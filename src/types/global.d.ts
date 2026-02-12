import type {
  Repository,
  FileEntry,
  Language,
  FileSizeStats,
  CleanupReport,
  OutdatedPackage,
  PatchBatchConfig,
  PatchBatchResult,
  NonBreakingUpdateConfig,
  SecurityPatchConfig,
  SecurityPatchResult,
  RepoInfo,
  ScheduledJob,
  SmartScanSchedule,
  JobResult,
  ScanResult,
  ScanProgress,
  SecurityFinding,
  FullScanResult,
  DeadCodeReport,
  DeadCodeExport,
  BridgeConsoleSettings,
  ConflictWarning,
  AppSettings,
  GitHubCliStatus
} from './index'

declare global {
  interface Window {
    bridge: {
      selectDirectory: () => Promise<string | null>
      selectCodeDirectory: () => Promise<string | null>
      getDefaultCodeDirectory: () => Promise<string>
      getCodeDirectory: () => Promise<string | null>
      saveCodeDirectory: (directory: string) => Promise<boolean>
      directoryExists: (directory: string) => Promise<boolean>
      scanForRepos: (directory: string) => Promise<Repository[]>
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
      runNonBreakingUpdate: (config: NonBreakingUpdateConfig) => Promise<PatchBatchResult>
      runSecurityPatch: (config: SecurityPatchConfig) => Promise<SecurityPatchResult>
      onPatchBatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      onPatchBatchWarning: (callback: (warning: { message: string; output: string }) => void) => () => void
      onPatchBatchLog: (callback: (entry: { message: string }) => void) => () => void
      onSecurityPatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      onSecurityPatchLog: (callback: (entry: { message: string }) => void) => () => void
      getRepoInfo: (repoPath: string) => Promise<RepoInfo>
      checkProtectedBranch: (repoPath: string) => Promise<boolean>
      predictMergeConflicts: (repoPath: string) => Promise<ConflictWarning[]>
      getGitHubCliStatus: (repoPath: string) => Promise<GitHubCliStatus>
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
      getAppSettings: () => Promise<AppSettings>
      saveAppSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>
    }
  }
}

export {}
