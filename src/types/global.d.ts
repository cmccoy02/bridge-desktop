import type {
  Repository,
  FileEntry,
  Language,
  FileSizeStats,
  CleanupReport,
  OutdatedPackage,
  PatchBatchConfig,
  PatchBatchResult,
  RepoInfo,
  ScheduledJob,
  JobResult,
  ScanResult,
  ScanProgress,
  SecurityFinding
} from './index'

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
      getOutdatedPackages: (repoPath: string, language?: Language) => Promise<OutdatedPackage[]>
      runPatchBatch: (config: PatchBatchConfig) => Promise<PatchBatchResult>
      onPatchBatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      onPatchBatchWarning: (callback: (warning: { message: string; output: string }) => void) => () => void
      getRepoInfo: (repoPath: string) => Promise<RepoInfo>
      checkProtectedBranch: (repoPath: string) => Promise<boolean>
      getScheduledJobs: () => Promise<ScheduledJob[]>
      addScheduledJob: (job: Omit<ScheduledJob, 'id' | 'createdAt' | 'lastRun' | 'nextRun'>) => Promise<ScheduledJob>
      updateScheduledJob: (jobId: string, updates: Partial<ScheduledJob>) => Promise<ScheduledJob | null>
      deleteScheduledJob: (jobId: string) => Promise<boolean>
      getJobResults: (jobId?: string) => Promise<JobResult[]>
      onSchedulerJobStarted: (callback: (data: { jobId: string; repoName: string }) => void) => () => void
      checkSecurityScannerAvailable: () => Promise<boolean>
      runSecurityScan: (repoPath: string) => Promise<ScanResult>
      generateSecurityFix: (finding: SecurityFinding) => Promise<string | null>
      onSecurityScanProgress: (callback: (progress: ScanProgress) => void) => () => void
    }
  }
}

export {}
