import type { BridgeConfig } from './bridgeConfig'
import type { BridgeScanReport } from './scanReport'
import { evaluateGates as evaluateCoreGates, type GateResult } from '../../bridge-mcp/src/core/gateEvaluator.js'
import type { RepoAnalysis } from '../../bridge-mcp/src/core/repoAnalyzer.js'

export type { GateResult }

function toRepoAnalysis(config: BridgeConfig, scanData: Partial<BridgeScanReport>): RepoAnalysis {
  const vulnerabilities = scanData.security?.vulnerabilities || scanData.dependencies?.vulnerabilities || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    total: 0
  }

  const outdated = scanData.dependencies?.outdated || []
  const dependencyNames = scanData.dependencies?.installedPackages || outdated.map(dep => dep.name)

  const hasCoverage = typeof scanData.testing?.coverage?.coveragePercentage === 'number'

  const codeHealthMetrics = scanData.techDebt?.dimensions?.codeHealth?.metrics || {}
  const todoMetric = Number(codeHealthMetrics.todoCount || 0)
  const hasLinterMetric = Number(codeHealthMetrics.hasLinter || 0)

  return {
    outdated,
    vulnerabilities,
    fileStats: {
      totalFiles: 0,
      totalLines: 0,
      largestFiles: []
    },
    hasTests: scanData.testing?.hasTests ?? Boolean(scanData.testing?.testCommand || config.gates.tests.command),
    hasTestFiles: scanData.testing?.hasTests ?? Boolean(scanData.testing?.testCommand || config.gates.tests.command),
    testCommand: scanData.testing?.testCommand || config.gates.tests.command || null,
    hasLinter: hasLinterMetric > 0,
    todoCount: Number.isFinite(todoMetric) ? todoMetric : 0,
    circularDeps: scanData.architecture?.circularDependencies?.count || scanData.circularDependencies?.count || 0,
    languages: [String(config.project.primaryLanguage || 'unknown')],
    hasCoverageData: hasCoverage,
    readmeExists: !(scanData.documentation?.readmeOutdated ?? false),
    readmeWordCount: 0,
    dependencyNames
  }
}

export function evaluateGates(
  config: BridgeConfig,
  scanData: Partial<BridgeScanReport>
): GateResult[] {
  const analysis = toRepoAnalysis(config, scanData)
  return evaluateCoreGates(config, analysis)
}
