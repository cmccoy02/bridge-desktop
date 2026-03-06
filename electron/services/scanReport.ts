import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import type {
  BundleAnalysisReport,
  CircularDependencyReport,
  DeadCodeReport,
  DependencyReport,
  DocumentationDebtReport,
  FullScanResult,
  OversizedComponent,
  TestCoverageReport,
  VulnerabilitySummary
} from './analysis'
import type { BridgeConfig } from './bridgeConfig'
import type { GateResult } from './gateEvaluator'
import { evaluateGates } from './gateEvaluator'
import type { ActionItem, TechDebtScore } from './techDebtScorer'
import type { SecurityPatternFinding } from './securityPatterns'

const execAsync = promisify(exec)

export interface BridgeScanReport {
  version: 1
  generatedAt: string
  generatedBy: 'bridge-desktop' | 'bridge-cli' | 'bridge-ci'
  repository: {
    path: string
    name: string
    url?: string
    branch?: string
    commit?: string
    language: string
    packageManager?: string
  }
  durationMs: number
  config: BridgeConfig
  techDebt: TechDebtScore
  dependencies: DependencyReport
  security: {
    vulnerabilities: VulnerabilitySummary
    patternFindings: SecurityPatternFinding[]
  }
  architecture: {
    circularDependencies: CircularDependencyReport
    deadCode: DeadCodeReport
    bundleSize: BundleAnalysisReport
    oversizedFiles: OversizedComponent[]
  }
  testing: {
    coverage: TestCoverageReport
    hasTests: boolean
    testCommand?: string
  }
  documentation: DocumentationDebtReport
  gates: {
    passed: boolean
    results: GateResult[]
  }
  agentDigest: {
    debtScore: number
    grade: string
    critical: string[]
    actions: ActionItem[]
    policies: {
      banned_present: string[]
      missing_required: string[]
      update_policy: BridgeConfig['dependencies']['updatePolicy']
    }
    conventions: string[]
    context: string
    outdated_summary: {
      total: number
      patch: number
      minor: number
      major: number
    }
  }
}

async function safeGitValue(repoPath: string, command: string): Promise<string | undefined> {
  try {
    const { stdout } = await execAsync(command, {
      cwd: repoPath,
      timeout: 30000
    })
    const value = stdout.trim()
    return value || undefined
  } catch {
    return undefined
  }
}

function toOutdatedSummary(dependencies: DependencyReport) {
  const summary = {
    total: dependencies.outdated.length,
    patch: 0,
    minor: 0,
    major: 0
  }

  for (const dep of dependencies.outdated) {
    if (dep.updateType === 'patch') summary.patch += 1
    if (dep.updateType === 'minor') summary.minor += 1
    if (dep.updateType === 'major') summary.major += 1
  }

  return summary
}

function deriveCriticalStatements(
  report: FullScanResult,
  config: BridgeConfig,
  score: TechDebtScore,
  patternFindings: SecurityPatternFinding[]
): string[] {
  const statements: string[] = []

  const criticalVulns = report.dependencies.vulnerabilities.critical || 0
  if (criticalVulns > 0) {
    statements.push(`${criticalVulns} critical security vulnerabilities detected.`)
  }

  if (patternFindings.length > 0) {
    statements.push(`${patternFindings.length} risky security code patterns found.`)
  }

  if (report.circularDependencies.count > 0) {
    statements.push(`${report.circularDependencies.count} circular dependency cycles detected.`)
  }

  const minCoverage = config.gates.tests.minCoverage ?? 80
  if ((report.testCoverage.coveragePercentage ?? 100) < minCoverage) {
    statements.push(`Test coverage is ${report.testCoverage.coveragePercentage ?? 0}% (minimum ${minCoverage}%).`)
  }

  if (statements.length === 0) {
    statements.push('No critical issues detected.')
  }

  return statements.slice(0, 5)
}

function derivePolicies(
  config: BridgeConfig,
  dependencies: DependencyReport
): BridgeScanReport['agentDigest']['policies'] {
  const banned = new Set((config.dependencies.bannedPackages || []).map(pkg => pkg.toLowerCase()))
  const installed = new Set(
    (dependencies.installedPackages || dependencies.outdated.map(dep => dep.name))
      .map(dep => dep.toLowerCase())
  )
  const bannedPresent = Array.from(banned).filter(pkg => installed.has(pkg))

  const required = new Set((config.dependencies.requiredPackages || []).map(pkg => pkg.toLowerCase()))
  const missingRequired = Array.from(required).filter(pkg => !installed.has(pkg))

  return {
    banned_present: bannedPresent,
    missing_required: missingRequired,
    update_policy: config.dependencies.updatePolicy
  }
}

export async function generateScanReport(
  repoPath: string,
  config: BridgeConfig,
  scanResults: FullScanResult,
  techDebtScore: TechDebtScore,
  extras: {
    patternFindings?: SecurityPatternFinding[]
    oversizedFiles?: OversizedComponent[]
  } = {}
): Promise<BridgeScanReport> {
  const patternFindings = extras.patternFindings || []
  const oversizedFiles = extras.oversizedFiles || []
  const branch = await safeGitValue(repoPath, 'git rev-parse --abbrev-ref HEAD')
  const commit = await safeGitValue(repoPath, 'git rev-parse HEAD')

  const gatesResults = evaluateGates(config, {
    dependencies: scanResults.dependencies,
    security: {
      vulnerabilities: scanResults.dependencies.vulnerabilities,
      patternFindings
    },
    architecture: {
      circularDependencies: scanResults.circularDependencies,
      deadCode: scanResults.deadCode,
      bundleSize: scanResults.bundleSize,
      oversizedFiles
    },
    testing: {
      coverage: scanResults.testCoverage,
      hasTests: Boolean(config.gates.tests.command),
      testCommand: config.gates.tests.command
    },
    documentation: scanResults.documentation,
    techDebt: techDebtScore
  })

  const report: BridgeScanReport = {
    version: 1,
    generatedAt: new Date().toISOString(),
    generatedBy: 'bridge-desktop',
    repository: {
      path: repoPath,
      name: path.basename(path.resolve(repoPath)),
      url: scanResults.repositoryUrl || undefined,
      branch,
      commit,
      language: config.project.primaryLanguage,
      packageManager: config.project.packageManager
    },
    durationMs: scanResults.durationMs,
    config,
    techDebt: techDebtScore,
    dependencies: scanResults.dependencies,
    security: {
      vulnerabilities: scanResults.dependencies.vulnerabilities,
      patternFindings
    },
    architecture: {
      circularDependencies: scanResults.circularDependencies,
      deadCode: scanResults.deadCode,
      bundleSize: scanResults.bundleSize,
      oversizedFiles
    },
    testing: {
      coverage: scanResults.testCoverage,
      hasTests: Boolean(config.gates.tests.command),
      testCommand: config.gates.tests.command
    },
    documentation: scanResults.documentation,
    gates: {
      passed: gatesResults.every(gate => gate.passed || gate.severity !== 'error'),
      results: gatesResults
    },
    agentDigest: {
      debtScore: techDebtScore.total,
      grade: techDebtScore.grade,
      critical: deriveCriticalStatements(scanResults, config, techDebtScore, patternFindings),
      actions: techDebtScore.actionItems.slice(0, 10),
      policies: derivePolicies(config, scanResults.dependencies),
      conventions: config.agent.conventions || [],
      context: config.agent.context,
      outdated_summary: toOutdatedSummary(scanResults.dependencies)
    }
  }

  return report
}

export async function writeScanReportArtifacts(
  repoPath: string,
  report: BridgeScanReport
): Promise<{ latestReportPath: string; latestScorePath: string; archivePath: string; configSnapshotPath: string }> {
  const bridgeDir = path.join(repoPath, '.bridge')
  const reportsDir = path.join(bridgeDir, 'reports')
  await fs.mkdir(reportsDir, { recursive: true })

  const timestampSafe = report.generatedAt.replace(/[:]/g, '-')
  const latestReportPath = path.join(bridgeDir, 'latest-report.json')
  const latestScorePath = path.join(bridgeDir, 'latest-score.json')
  const archivePath = path.join(reportsDir, `${timestampSafe}.json`)
  const configSnapshotPath = path.join(bridgeDir, 'config-snapshot.json')

  await fs.writeFile(latestReportPath, JSON.stringify(report, null, 2) + '\n', 'utf-8')
  await fs.writeFile(archivePath, JSON.stringify(report, null, 2) + '\n', 'utf-8')
  await fs.writeFile(configSnapshotPath, JSON.stringify(report.config, null, 2) + '\n', 'utf-8')

  // Keep score artifact tiny for agent consumption (< 2KB target).
  const compactDimensions = Object.fromEntries(
    Object.entries(report.techDebt.dimensions).map(([key, value]) => [key, {
      score: Number(value.score.toFixed(1)),
      weight: value.weight,
      weightedScore: Number(value.weightedScore.toFixed(2))
    }])
  )

  let minimalScore: Record<string, any> = {
    total: Number(report.techDebt.total.toFixed(1)),
    grade: report.techDebt.grade,
    trend: report.techDebt.trend,
    dimensions: compactDimensions,
    topContributors: report.techDebt.topContributors.slice(0, 3).map(item => ({
      dimension: item.dimension,
      impact: item.impact,
      description: item.description.slice(0, 72)
    })),
    actionItems: report.techDebt.actionItems.slice(0, 3).map(item => ({
      priority: item.priority,
      title: item.title.slice(0, 72),
      impact: item.impact,
      effort: item.effort,
      automatable: item.automatable
    }))
  }

  let serializedScore = JSON.stringify(minimalScore)
  if (Buffer.byteLength(serializedScore, 'utf-8') > 2000) {
    minimalScore = {
      total: minimalScore.total,
      grade: minimalScore.grade,
      trend: minimalScore.trend,
      dimensions: minimalScore.dimensions,
      topContributors: (minimalScore.topContributors as any[]).slice(0, 2).map(item => ({
        dimension: item.dimension,
        impact: item.impact
      })),
      actionItems: (minimalScore.actionItems as any[]).slice(0, 2).map(item => ({
        priority: item.priority,
        impact: item.impact,
        effort: item.effort,
        automatable: item.automatable
      }))
    }
    serializedScore = JSON.stringify(minimalScore)
  }

  await fs.writeFile(latestScorePath, serializedScore + '\n', 'utf-8')

  return {
    latestReportPath,
    latestScorePath,
    archivePath,
    configSnapshotPath
  }
}
