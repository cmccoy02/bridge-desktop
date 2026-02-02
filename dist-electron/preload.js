"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("bridge", {
  // Repository management
  selectDirectory: () => electron.ipcRenderer.invoke("select-directory"),
  scanRepository: (path) => electron.ipcRenderer.invoke("scan-repository", path),
  readDirectory: (path) => electron.ipcRenderer.invoke("read-directory", path),
  readFile: (path) => electron.ipcRenderer.invoke("read-file", path),
  detectLanguages: (path) => electron.ipcRenderer.invoke("detect-languages", path),
  // Persistence
  getRepositories: () => electron.ipcRenderer.invoke("get-repositories"),
  saveRepositories: (repos) => electron.ipcRenderer.invoke("save-repositories", repos),
  removeRepository: (path) => electron.ipcRenderer.invoke("remove-repository", path),
  cleanupMissingRepos: () => electron.ipcRenderer.invoke("cleanup-missing-repos"),
  // Analysis
  getFileStats: (repoPath) => electron.ipcRenderer.invoke("get-file-stats", repoPath),
  getCleanupReport: (repoPath) => electron.ipcRenderer.invoke("get-cleanup-report", repoPath),
  // Patch Batch
  getOutdatedPackages: (repoPath, language) => electron.ipcRenderer.invoke("get-outdated-packages", repoPath, language),
  runPatchBatch: (config) => electron.ipcRenderer.invoke("run-patch-batch", config),
  onPatchBatchProgress: (callback) => {
    electron.ipcRenderer.on("patch-batch-progress", (_, progress) => callback(progress));
    return () => electron.ipcRenderer.removeAllListeners("patch-batch-progress");
  },
  onPatchBatchWarning: (callback) => {
    electron.ipcRenderer.on("patch-batch-warning", (_, warning) => callback(warning));
    return () => electron.ipcRenderer.removeAllListeners("patch-batch-warning");
  },
  // Git
  getRepoInfo: (repoPath) => electron.ipcRenderer.invoke("get-repo-info", repoPath),
  checkProtectedBranch: (repoPath) => electron.ipcRenderer.invoke("check-protected-branch", repoPath),
  // Scheduler
  getScheduledJobs: () => electron.ipcRenderer.invoke("get-scheduled-jobs"),
  addScheduledJob: (job) => electron.ipcRenderer.invoke("add-scheduled-job", job),
  updateScheduledJob: (jobId, updates) => electron.ipcRenderer.invoke("update-scheduled-job", jobId, updates),
  deleteScheduledJob: (jobId) => electron.ipcRenderer.invoke("delete-scheduled-job", jobId),
  getJobResults: (jobId) => electron.ipcRenderer.invoke("get-job-results", jobId),
  onSchedulerJobStarted: (callback) => {
    electron.ipcRenderer.on("scheduler-job-started", (_, data) => callback(data));
    return () => electron.ipcRenderer.removeAllListeners("scheduler-job-started");
  },
  // Security Scanner
  checkSecurityScannerAvailable: () => electron.ipcRenderer.invoke("check-security-scanner-available"),
  runSecurityScan: (repoPath) => electron.ipcRenderer.invoke("run-security-scan", repoPath),
  generateSecurityFix: (finding) => electron.ipcRenderer.invoke("generate-security-fix", finding),
  onSecurityScanProgress: (callback) => {
    electron.ipcRenderer.on("security-scan-progress", (_, progress) => callback(progress));
    return () => electron.ipcRenderer.removeAllListeners("security-scan-progress");
  }
});
