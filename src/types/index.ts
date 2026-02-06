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
  language: Language
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

export interface PatchBatchConfig {
  repoPath: string
  branchName: string
  packages: { name: string; language: Language }[]
  createPR: boolean
  runTests: boolean
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
  error?: string
  testsPassed?: boolean
  testOutput?: string
}

export interface SecurityPatchConfig {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  testCommand?: string
}

export interface SecurityPatchResult {
  success: boolean
  updatedPackages: string[]
  failedPackages: string[]
  prUrl?: string | null
  error?: string
  testsPassed?: boolean
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
  enabled: boolean
  lastRun: string | null
  nextRun: string
  language: string
  createPR: boolean
  runTests: boolean
  createdAt: string
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

export interface FullScanResult {
  scanDate: string
  repository: string
  repositoryUrl?: string | null
  dependencies: DependencyReport
  circularDependencies: CircularDependencyReport
  deadCode: DeadCodeReport
  bundleSize: BundleAnalysisReport
  testCoverage: TestCoverageReport
  documentation: DocumentationDebtReport
  consoleUpload?: ConsoleUploadResult
  durationMs: number
}

export interface BridgeConsoleSettings {
  consoleUrl: string
  apiToken: string
  githubUsername: string
  autoUpload: boolean
}

export type View = 'dashboard' | 'files' | 'patch-batch' | 'cleanup' | 'scheduler' | 'security' | 'full-scan' | 'settings'
