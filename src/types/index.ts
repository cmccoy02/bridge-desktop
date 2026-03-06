export type Language = 'javascript' | 'python' | 'ruby' | 'elixir' | 'unknown'
export type ScheduleFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly'

export interface Repository {
  path: string
  name: string
  languages: Language[]
  hasGit: boolean
  addedAt: string
  exists: boolean
}

export interface OutdatedPackage {
  name: string
  current: string
  wanted: string
  latest: string
  type: 'dependencies' | 'devDependencies'
  hasPatchUpdate: boolean
  isNonBreaking: boolean
  updateType: 'patch' | 'minor' | 'major' | 'unknown'
  language: Language
  vulnerabilities?: {
    critical: number
    high: number
    medium: number
    low: number
    total: number
  }
}

export interface FileEntry {
  name: string
  path: string
  isDirectory: boolean
  size?: number
  modified?: string
}

export interface RepoInfo {
  branch: string
  remote: string | null
  hasChanges: boolean
  isProtectedBranch: boolean
  defaultBranch: string
  ahead: number
  behind: number
}

export interface ConflictWarning {
  severity: 'high' | 'medium'
  message: string
  recommendation: string
  conflictingFiles: string[]
  behindBy: number
}

export interface GitHubCliStatus {
  installed: boolean
  authenticated: boolean
  account?: string
  message?: string
}

export interface PatchBatchConfig {
  repoPath: string
  branchName: string
  packages: { name: string; language: Language }[]
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  updateStrategy?: 'wanted' | 'latest'
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}

export interface NonBreakingUpdateConfig {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  pinnedPackages?: Record<string, string>
  selectedMajorPackages?: string[]
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}

export interface PatchBatchResult {
  success: boolean
  updatedPackages?: string[]
  failedPackages?: string[]
  prUrl?: string | null
  branchName?: string
  branchPushed?: boolean
  error?: string
  testsPassed?: boolean
  testOutput?: string
}

export interface SecurityPatchConfig {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  testCommand?: string
}

export interface BridgePatchConfig {
  createPR?: boolean
  runTests?: boolean
  testCommand?: string
  branchPrefix?: string
  baseBranch?: string
  remoteFirst?: boolean
}

export interface BridgeProjectConfig {
  baseBranch?: string
  branchPrefix?: string
  patch?: BridgePatchConfig
}

export interface BridgeProjectConfigResult {
  exists: boolean
  path: string
  config: BridgeProjectConfig
  errors: string[]
}

export interface SecurityPatchResult {
  success: boolean
  updatedPackages: string[]
  failedPackages: string[]
  prUrl?: string | null
  error?: string
  testsPassed?: boolean
}

export interface PushBranchResult {
  success: boolean
  error?: string
}

export interface LargeFile {
  path: string
  size: number
  sizeFormatted: string
  type: 'current' | 'git-history'
}

export interface OversizedComponent {
  path: string
  lines: number
  type: string
}

export interface CleanupReport {
  largeFiles: LargeFile[]
  gitHistoryFiles: LargeFile[]
  oversizedComponents: OversizedComponent[]
  totalWastedSpace: number
  totalWastedSpaceFormatted: string
}

export interface FileSizeStats {
  totalSize: number
  totalSizeFormatted: string
  fileCount: number
  largestFiles: LargeFile[]
}

export interface ScheduledJob {
  id: string
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
  intervalHours: number
  daysOfWeek: number[]
  dayOfMonth: number
  timeOfDay: string
  startAt: string
  enabled: boolean
  lastRun: string | null
  nextRun: string
  language: string
  createPR: boolean
  runTests: boolean
  createdAt: string
}

export interface ScheduledJobCreateInput {
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
  intervalHours?: number
  daysOfWeek?: number[]
  dayOfMonth?: number
  timeOfDay?: string
  startAt?: string
  enabled: boolean
  language: string
  createPR: boolean
  runTests: boolean
}

export interface SmartScanSchedule {
  id: string
  repoPath: string
  repoName: string
  enabled: boolean
  quietHour: number
  lastRun: string | null
  nextRun: string
  createdAt: string
}

export interface JobResult {
  jobId: string
  success: boolean
  timestamp: string
  updatedPackages: string[]
  prUrl?: string
  error?: string
  testsPassed?: boolean
}

export interface SecurityFinding {
  file: string
  line: number
  issue: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  code: string
  description: string
  cwe: string
  owasp: string
  solution?: string
  fixedCode?: string
}

export interface ScanResult {
  scanId: string
  repoPath: string
  totalFindings: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  findings: SecurityFinding[]
  scannedAt: string
  duration: number
}

export interface ScanProgress {
  status: 'scanning' | 'analyzing' | 'generating-fixes' | 'complete' | 'error'
  progress: number
  message: string
  currentFile?: string
}

export interface VulnerabilitySummary {
  critical: number
  high: number
  medium: number
  low: number
  total: number
}

export interface DependencyReport {
  outdated: OutdatedPackage[]
  vulnerabilities: VulnerabilitySummary
  installedPackages?: string[]
  error?: string
}

export interface CircularDependency {
  from: string
  to: string
  cycle: string[]
}

export interface CircularDependencyReport {
  count: number
  dependencies: CircularDependency[]
  error?: string
}

export interface DeadCodeExport {
  file: string
  exportName: string
}

export interface DeadCodeReport {
  deadFiles: string[]
  unusedExports: DeadCodeExport[]
  totalDeadCodeCount: number
  raw?: {
    knip?: string
    unimported?: string
  }
  error?: string
}

export interface BundleModule {
  name: string
  size: number
  sizeFormatted: string
}

export interface BundleAnalysisReport {
  totalSize: number
  totalSizeFormatted: string
  largestModules: BundleModule[]
  previousSize?: number
  delta?: number
  deltaPercent?: number
  warning?: boolean
  statsPath?: string
  error?: string
}

export interface TestCoverageReport {
  coveragePercentage: number | null
  uncoveredCriticalFiles: { file: string; coverage: number }[]
  summaryPath?: string
  error?: string
}

export interface DocumentationDebtReport {
  missingReadmeSections: string[]
  readmeOutdated: boolean
  daysSinceUpdate: number
  undocumentedFunctions: number
  error?: string
}

export interface ConsoleUploadResult {
  success: boolean
  tdScore?: number
  tdDelta?: number
  error?: string
}

export interface BridgeConfig {
  version: 1
  project: {
    name: string
    description?: string
    primaryLanguage: 'javascript' | 'typescript' | 'python' | 'ruby' | 'elixir' | 'go' | 'rust' | 'java' | 'multi'
    packageManager?: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'poetry' | 'bundler' | 'mix' | 'cargo' | 'maven' | 'gradle'
    monorepo?: boolean
    workspacePatterns?: string[]
  }
  dependencies: {
    updatePolicy: {
      patch: 'auto' | 'review' | 'ignore'
      minor: 'auto' | 'review' | 'ignore'
      major: 'review' | 'ignore'
    }
    bannedPackages?: string[]
    requiredPackages?: string[]
    pinnedPackages?: Record<string, string>
    maxAge?: {
      patch: number
      minor: number
      major: number
    }
    securityPolicy: {
      autoFixCritical: boolean
      autoFixHigh: boolean
      blockOnCritical: boolean
      blockOnHigh: boolean
    }
  }
  gates: {
    tests: {
      required: boolean
      command?: string
      minCoverage?: number
      timeout?: number
    }
    lint: {
      required: boolean
      command?: string
    }
    build: {
      required: boolean
      command?: string
    }
    bundleSize?: {
      maxBytes?: number
      maxDeltaPercent?: number
    }
    circularDependencies: {
      maxAllowed: number
      failOnNew: boolean
    }
    deadCode: {
      maxUnusedExports: number
      maxDeadFiles: number
      failOnNew: boolean
    }
    documentation: {
      requireReadme: boolean
      requireChangelog: boolean
      maxDaysSinceReadmeUpdate?: number
    }
  }
  agent: {
    context: string
    conventions?: string[]
    avoidPatterns?: string[]
    preferredLibraries?: Record<string, string>
    reviewChecklist?: string[]
  }
  scoring?: {
    weights?: {
      dependencies?: number
      security?: number
      architecture?: number
      testing?: number
      documentation?: number
      codeHealth?: number
    }
    thresholds?: {
      maxOutdatedDeps?: number
      maxCircularDeps?: number
      maxDeadFiles?: number
      minTestCoverage?: number
      maxOversizedFiles?: number
      maxAvgFileComplexity?: number
      maxDebtScore?: number
    }
  }
  scan: {
    schedule?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'manual'
    exclude?: string[]
    include?: string[]
    features: {
      dependencies: boolean
      security: boolean
      circularDeps: boolean
      deadCode: boolean
      bundleSize: boolean
      testCoverage: boolean
      documentation: boolean
      codeSmells: boolean
      fileAnalysis: boolean
    }
  }
  console?: {
    projectId?: string
    autoUpload: boolean
    uploadOn?: ('scan' | 'update' | 'schedule')[]
  }
}

export interface SecurityPatternFinding {
  file: string
  line: number
  column?: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  cwe?: string
  owasp?: string
  title: string
  description: string
  suggestion: string
  snippet: string
}

export interface DimensionScore {
  score: number
  weight: number
  weightedScore: number
  findings: string[]
  metrics: Record<string, number | string>
}

export interface DebtContributor {
  dimension: string
  description: string
  impact: number
  fixable: boolean
  effort: 'trivial' | 'small' | 'medium' | 'large'
}

export interface ActionItem {
  priority: number
  title: string
  description: string
  dimension: string
  impact: number
  effort: 'trivial' | 'small' | 'medium' | 'large'
  automatable: boolean
  command?: string
}

export interface TechDebtScore {
  total: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  trend: 'improving' | 'stable' | 'declining' | 'unknown'
  dimensions: {
    dependencies: DimensionScore
    security: DimensionScore
    architecture: DimensionScore
    testing: DimensionScore
    documentation: DimensionScore
    codeHealth: DimensionScore
  }
  topContributors: DebtContributor[]
  actionItems: ActionItem[]
}

export interface GateResult {
  name: string
  passed: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
  details?: Record<string, any>
}

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

export interface FullScanResult {
  scanDate: string
  repository: string
  repositoryUrl?: string | null
  config: BridgeConfig
  dependencies: DependencyReport
  circularDependencies: CircularDependencyReport
  deadCode: DeadCodeReport
  bundleSize: BundleAnalysisReport
  testCoverage: TestCoverageReport
  documentation: DocumentationDebtReport
  securityPatterns: SecurityPatternFinding[]
  oversizedFiles: OversizedComponent[]
  codeHealth: {
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
  techDebtScore: TechDebtScore
  scanReport?: BridgeScanReport
  reportPaths?: {
    latestReportPath: string
    latestScorePath: string
    archivePath: string
    configSnapshotPath: string
  }
  consoleUpload?: ConsoleUploadResult
  durationMs: number
}

export interface BridgeConsoleSettings {
  consoleUrl: string
  apiToken: string
  githubUsername: string
  autoUpload: boolean
}

export interface AppSettings {
  experimentalFeatures: boolean
  onboardingCompleted: boolean
}

export type View = 'dashboard' | 'files' | 'patch-batch' | 'cleanup' | 'scheduler' | 'security' | 'full-scan' | 'settings'
