import type {
  BundleAnalysisReport,
  CircularDependencyReport,
  DeadCodeReport,
  DependencyReport,
  DocumentationDebtReport,
  OversizedComponent,
  TestCoverageReport,
  VulnerabilitySummary
} from './analysis'
import type { SecurityPatternFinding } from './securityPatterns'
import type { BridgeConfig } from './bridgeConfig'
import { analyzeRepo } from '../../bridge-mcp/src/core/repoAnalyzer.js'
import {
  calculateScore,
  type ActionItem,
  type DebtContributor,
  type DimensionScore,
  type TechDebtScore
} from '../../bridge-mcp/src/core/scorer.js'

export type {
  ActionItem,
  DebtContributor,
  DimensionScore,
  TechDebtScore
}

export interface CodeHealthMetrics {
  todoCount: number
  consoleLogCount: number
  commentedOutBlockCount: number
  mixedTabsSpaces: boolean
  inconsistentQuoteStyle: boolean
  hasLinter: boolean
  hasFormatter: boolean
  packageScriptsCount: number
  hasGitignore: boolean
}

export interface ScanData {
  dependencies: DependencyReport
  vulnerabilities: VulnerabilitySummary
  circularDependencies: CircularDependencyReport
  deadCode: DeadCodeReport
  bundleSize: BundleAnalysisReport
  testCoverage: TestCoverageReport
  documentation: DocumentationDebtReport
  oversizedComponents?: OversizedComponent[]
  securityPatterns?: SecurityPatternFinding[]
  codeHealth?: CodeHealthMetrics
  repositoryInsights?: {
    hasLockfile: boolean
    lockfileDaysSinceUpdate?: number | null
    packageManagerDetected: boolean
    hasSrcDirectory: boolean
    ciDetected: boolean
    readmeExists: boolean
    readmeWordCount: number
    readmeDaysSinceUpdate: number
    hasChangelog: boolean
    hasContributingGuide: boolean
    hasLicense: boolean
    testCommandExists: boolean
    testsPass: boolean | null
    maxNestingDepth: number
    deeplyNestedFiles: number
    nodeModulesCommitted: boolean
    avgFileComplexity?: number
    oversizedFilesCount?: number
  }
  previousScore?: number | null
}

export async function calculateTechDebtScore(
  repoPath: string,
  scanData: ScanData,
  config: BridgeConfig
): Promise<TechDebtScore> {
  void scanData
  const analysis = await analyzeRepo(repoPath)
  return calculateScore(analysis, config)
}
