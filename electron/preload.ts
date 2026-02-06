import { contextBridge, ipcRenderer } from 'electron'

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
  prTitle?: string
  prBody?: string
}

export interface PatchBatchResult {
  success: boolean
  updatedPackages?: string[]
  failedPackages?: string[]
  prUrl?: string | null
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

contextBridge.exposeInMainWorld('bridge', {
  // Repository management
  selectDirectory: (): Promise<string | null> =>
    ipcRenderer.invoke('select-directory'),

  scanRepository: (path: string): Promise<Repository> =>
    ipcRenderer.invoke('scan-repository', path),

  readDirectory: (path: string): Promise<FileEntry[]> =>
    ipcRenderer.invoke('read-directory', path),

  readFile: (path: string): Promise<string> =>
    ipcRenderer.invoke('read-file', path),

  detectLanguages: (path: string): Promise<Language[]> =>
    ipcRenderer.invoke('detect-languages', path),

  // Persistence
  getRepositories: (): Promise<Repository[]> =>
    ipcRenderer.invoke('get-repositories'),

  saveRepositories: (repos: Repository[]): Promise<boolean> =>
    ipcRenderer.invoke('save-repositories', repos),

  removeRepository: (path: string): Promise<Repository[]> =>
    ipcRenderer.invoke('remove-repository', path),

  cleanupMissingRepos: (): Promise<Repository[]> =>
    ipcRenderer.invoke('cleanup-missing-repos'),

  // Analysis
  getFileStats: (repoPath: string): Promise<FileSizeStats> =>
    ipcRenderer.invoke('get-file-stats', repoPath),

  getCleanupReport: (repoPath: string): Promise<CleanupReport> =>
    ipcRenderer.invoke('get-cleanup-report', repoPath),

  detectDeadCode: (repoPath: string): Promise<DeadCodeReport> =>
    ipcRenderer.invoke('detect-dead-code', repoPath),

  runFullScan: (repoPath: string): Promise<FullScanResult> =>
    ipcRenderer.invoke('run-full-scan', repoPath),

  onFullScanProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => {
    ipcRenderer.on('full-scan-progress', (_, progress) => callback(progress))
    return () => ipcRenderer.removeAllListeners('full-scan-progress')
  },

  deleteDeadFile: (repoPath: string, relativePath: string): Promise<boolean> =>
    ipcRenderer.invoke('delete-dead-file', repoPath, relativePath),

  cleanupDeadCode: (payload: { repoPath: string; deadFiles: string[]; unusedExports: DeadCodeExport[]; createPr?: boolean }): Promise<any> =>
    ipcRenderer.invoke('cleanup-dead-code', payload),

  // Patch Batch
  getOutdatedPackages: (repoPath: string, language?: Language): Promise<OutdatedPackage[]> =>
    ipcRenderer.invoke('get-outdated-packages', repoPath, language),

  runPatchBatch: (config: PatchBatchConfig): Promise<PatchBatchResult> =>
    ipcRenderer.invoke('run-patch-batch', config),

  runSecurityPatch: (config: SecurityPatchConfig): Promise<SecurityPatchResult> =>
    ipcRenderer.invoke('run-security-patch', config),

  onPatchBatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => {
    ipcRenderer.on('patch-batch-progress', (_, progress) => callback(progress))
    return () => ipcRenderer.removeAllListeners('patch-batch-progress')
  },

  onPatchBatchWarning: (callback: (warning: { message: string; output: string }) => void) => {
    ipcRenderer.on('patch-batch-warning', (_, warning) => callback(warning))
    return () => ipcRenderer.removeAllListeners('patch-batch-warning')
  },

  onPatchBatchLog: (callback: (entry: { message: string }) => void) => {
    ipcRenderer.on('patch-batch-log', (_, entry) => callback(entry))
    return () => ipcRenderer.removeAllListeners('patch-batch-log')
  },

  onSecurityPatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => {
    ipcRenderer.on('security-patch-progress', (_, progress) => callback(progress))
    return () => ipcRenderer.removeAllListeners('security-patch-progress')
  },

  onSecurityPatchLog: (callback: (entry: { message: string }) => void) => {
    ipcRenderer.on('security-patch-log', (_, entry) => callback(entry))
    return () => ipcRenderer.removeAllListeners('security-patch-log')
  },

  // Git
  getRepoInfo: (repoPath: string): Promise<RepoInfo> =>
    ipcRenderer.invoke('get-repo-info', repoPath),

  checkProtectedBranch: (repoPath: string): Promise<boolean> =>
    ipcRenderer.invoke('check-protected-branch', repoPath),

  // Scheduler
  getScheduledJobs: (): Promise<ScheduledJob[]> =>
    ipcRenderer.invoke('get-scheduled-jobs'),

  addScheduledJob: (job: Omit<ScheduledJob, 'id' | 'createdAt' | 'lastRun' | 'nextRun'>): Promise<ScheduledJob> =>
    ipcRenderer.invoke('add-scheduled-job', job),

  updateScheduledJob: (jobId: string, updates: Partial<ScheduledJob>): Promise<ScheduledJob | null> =>
    ipcRenderer.invoke('update-scheduled-job', jobId, updates),

  deleteScheduledJob: (jobId: string): Promise<boolean> =>
    ipcRenderer.invoke('delete-scheduled-job', jobId),

  getJobResults: (jobId?: string): Promise<JobResult[]> =>
    ipcRenderer.invoke('get-job-results', jobId),

  onSchedulerJobStarted: (callback: (data: { jobId: string; repoName: string }) => void) => {
    ipcRenderer.on('scheduler-job-started', (_, data) => callback(data))
    return () => ipcRenderer.removeAllListeners('scheduler-job-started')
  },

  getSmartScanSchedules: (): Promise<SmartScanSchedule[]> =>
    ipcRenderer.invoke('get-smart-scan-schedules'),

  addSmartScanSchedule: (payload: { repoPath: string; repoName: string }): Promise<SmartScanSchedule> =>
    ipcRenderer.invoke('add-smart-scan-schedule', payload),

  updateSmartScanSchedule: (id: string, updates: Partial<SmartScanSchedule>): Promise<SmartScanSchedule | null> =>
    ipcRenderer.invoke('update-smart-scan-schedule', id, updates),

  deleteSmartScanSchedule: (id: string): Promise<boolean> =>
    ipcRenderer.invoke('delete-smart-scan-schedule', id),

  onSmartScanStarted: (callback: (data: { id: string; repoName: string }) => void) => {
    ipcRenderer.on('smart-scan-started', (_, data) => callback(data))
    return () => ipcRenderer.removeAllListeners('smart-scan-started')
  },

  // Security Scanner
  checkSecurityScannerAvailable: (): Promise<boolean> =>
    ipcRenderer.invoke('check-security-scanner-available'),

  runSecurityScan: (repoPath: string): Promise<ScanResult> =>
    ipcRenderer.invoke('run-security-scan', repoPath),

  generateSecurityFix: (finding: SecurityFinding): Promise<string | null> =>
    ipcRenderer.invoke('generate-security-fix', finding),

  onSecurityScanProgress: (callback: (progress: ScanProgress) => void) => {
    ipcRenderer.on('security-scan-progress', (_, progress) => callback(progress))
    return () => ipcRenderer.removeAllListeners('security-scan-progress')
  },

  // Bridge Console settings
  getBridgeConsoleSettings: (): Promise<BridgeConsoleSettings> =>
    ipcRenderer.invoke('get-bridge-console-settings'),

  saveBridgeConsoleSettings: (settings: BridgeConsoleSettings): Promise<BridgeConsoleSettings> =>
    ipcRenderer.invoke('save-bridge-console-settings', settings),

  testBridgeConsoleConnection: (settings: BridgeConsoleSettings): Promise<{ ok: boolean; message?: string }> =>
    ipcRenderer.invoke('test-bridge-console-connection', settings)
})

declare global {
  interface Window {
    bridge: {
      selectDirectory: () => Promise<string | null>
      scanRepository: (path: string) => Promise<Repository>
      readDirectory: (path: string) => Promise<FileEntry[]>
      readFile: (path: string) => Promise<string>
      detectLanguages: (path: string) => Promise<Language[]>
      getRepositories: () => Promise<Repository[]>
      saveRepositories: (repos: Repository[]) => Promise<boolean>
      removeRepository: (path: string) => Promise<Repository[]>
      cleanupMissingRepos: () => Promise<Repository[]>
      getFileStats: (repoPath: string) => Promise<FileSizeStats>
      getCleanupReport: (repoPath: string) => Promise<CleanupReport>
      detectDeadCode: (repoPath: string) => Promise<DeadCodeReport>
      runFullScan: (repoPath: string) => Promise<FullScanResult>
      onFullScanProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      deleteDeadFile: (repoPath: string, relativePath: string) => Promise<boolean>
      cleanupDeadCode: (payload: { repoPath: string; deadFiles: string[]; unusedExports: DeadCodeExport[]; createPr?: boolean }) => Promise<any>
      getOutdatedPackages: (repoPath: string, language?: Language) => Promise<OutdatedPackage[]>
      runPatchBatch: (config: PatchBatchConfig) => Promise<PatchBatchResult>
      runSecurityPatch: (config: SecurityPatchConfig) => Promise<SecurityPatchResult>
      onPatchBatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      onPatchBatchWarning: (callback: (warning: { message: string; output: string }) => void) => () => void
      onSecurityPatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      onSecurityPatchLog: (callback: (entry: { message: string }) => void) => () => void
      getRepoInfo: (repoPath: string) => Promise<RepoInfo>
      checkProtectedBranch: (repoPath: string) => Promise<boolean>
      getScheduledJobs: () => Promise<ScheduledJob[]>
      addScheduledJob: (job: Omit<ScheduledJob, 'id' | 'createdAt' | 'lastRun' | 'nextRun'>) => Promise<ScheduledJob>
      updateScheduledJob: (jobId: string, updates: Partial<ScheduledJob>) => Promise<ScheduledJob | null>
      deleteScheduledJob: (jobId: string) => Promise<boolean>
      getJobResults: (jobId?: string) => Promise<JobResult[]>
      onSchedulerJobStarted: (callback: (data: { jobId: string; repoName: string }) => void) => () => void
      getSmartScanSchedules: () => Promise<SmartScanSchedule[]>
      addSmartScanSchedule: (payload: { repoPath: string; repoName: string }) => Promise<SmartScanSchedule>
      updateSmartScanSchedule: (id: string, updates: Partial<SmartScanSchedule>) => Promise<SmartScanSchedule | null>
      deleteSmartScanSchedule: (id: string) => Promise<boolean>
      onSmartScanStarted: (callback: (data: { id: string; repoName: string }) => void) => () => void
      checkSecurityScannerAvailable: () => Promise<boolean>
      runSecurityScan: (repoPath: string) => Promise<ScanResult>
      generateSecurityFix: (finding: SecurityFinding) => Promise<string | null>
      onSecurityScanProgress: (callback: (progress: ScanProgress) => void) => () => void
      getBridgeConsoleSettings: () => Promise<BridgeConsoleSettings>
      saveBridgeConsoleSettings: (settings: BridgeConsoleSettings) => Promise<BridgeConsoleSettings>
      testBridgeConsoleConnection: (settings: BridgeConsoleSettings) => Promise<{ ok: boolean; message?: string }>
    }
  }
}
