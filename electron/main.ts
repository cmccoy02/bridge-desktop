import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import Store from 'electron-store'
import { scanRepository, readDirectory, readFile, validateRepositories, cleanupMissingRepositories } from './services/fileSystem'
import {
  getFileSizeStats,
  generateCleanupReport,
  runFullScan,
  deleteDeadFile,
  cleanupDeadCode,
  detectDeadCode
} from './services/analysis'
import {
  getBridgeConsoleSettings,
  saveBridgeConsoleSettings,
  testBridgeConsoleConnection
} from './services/bridgeConsoleApi'
import {
  detectLanguages,
  getPythonOutdated,
  getRubyOutdated,
  getElixirOutdated,
  Language
} from './services/languages'
import { getJsOutdatedPackages, runPatchBatchPipeline, runSecurityPatchPipeline } from './services/patchBatch'
import {
  getScheduledJobs,
  addScheduledJob,
  updateScheduledJob,
  deleteScheduledJob,
  getJobResults,
  addJobResult,
  initializeScheduler,
  cleanupScheduler,
  setSchedulerExecutor,
  ScheduledJob,
  JobResult
} from './services/scheduler'
import {
  initializeSmartScheduler,
  setSmartScanExecutor,
  cleanupSmartScheduler,
  getSmartScanSchedules,
  addSmartScanSchedule,
  updateSmartScanSchedule,
  deleteSmartScanSchedule
} from './services/smartScheduler'
import {
  getRepoInfo,
  isOnProtectedBranch
} from './services/git'
import {
  runSecurityScan,
  generateSecurityFix,
  checkAgenticFixerAvailable
} from './services/securityScanner'
const store = new Store()

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 20, y: 20 },
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Vite dev server URL - check multiple possible env vars
  const devServerUrl = process.env.VITE_DEV_SERVER_URL ||
                       process.env['VITE_DEV_SERVER_URL'] ||
                       (process.env.NODE_ENV !== 'production' ? 'http://localhost:5173' : null)

  if (devServerUrl) {
    console.log('Loading dev server:', devServerUrl)
    mainWindow.loadURL(devServerUrl)
    mainWindow.webContents.openDevTools()

    // Handle load failures
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDesc) => {
      console.error('Failed to load:', errorCode, errorDesc)
      // Retry after a short delay
      setTimeout(() => {
        mainWindow?.loadURL(devServerUrl)
      }, 1000)
    })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  initializeScheduler()
  initializeSmartScheduler()
  setSchedulerExecutor(async (job): Promise<JobResult | null> => {
    try {
      const outdated = await collectOutdatedPackages(job.repoPath)
      const patchPackages = outdated.filter(p => p.hasPatchUpdate)

      if (patchPackages.length === 0) {
        return {
          jobId: job.id,
          success: true,
          timestamp: new Date().toISOString(),
          updatedPackages: []
        }
      }

      const packages = patchPackages.map(p => ({ name: p.name, language: p.language }))
      const result = await runPatchBatchPipeline({
        repoPath: job.repoPath,
        branchName: `bridge-scheduled-${Date.now()}`,
        packages,
        createPR: job.createPR,
        runTests: job.runTests,
        prTitle: `chore(deps): scheduled update of ${packages.length} packages`,
        prBody: `## Summary\nScheduled patch updates via Bridge.\n\n### Updated packages\n${packages.map(p => `- ${p.name} (${p.language})`).join('\n')}`
      })

      return {
        jobId: job.id,
        success: result.success,
        timestamp: new Date().toISOString(),
        updatedPackages: result.updatedPackages || [],
        prUrl: result.prUrl || undefined,
        error: result.success ? undefined : result.error,
        testsPassed: result.testsPassed
      }
    } catch (error) {
      return {
        jobId: job.id,
        success: false,
        timestamp: new Date().toISOString(),
        updatedPackages: [],
        error: error instanceof Error ? error.message : 'Scheduled job failed'
      }
    }
  })

  setSmartScanExecutor(async (repoPath: string) => {
    await runFullScan(repoPath, { skipConsoleUpload: false })
  })

  // Validate repos on startup
  setTimeout(async () => {
    const repos = store.get('repositories', []) as any[]
    const cleaned = await cleanupMissingRepositories(repos)
    store.set('repositories', cleaned)
  }, 2000)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  cleanupScheduler()
  cleanupSmartScheduler()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  cleanupScheduler()
  cleanupSmartScheduler()
})

// IPC Handlers

// Repository management
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
    title: 'Select Repository'
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return result.filePaths[0]
})

ipcMain.handle('scan-repository', async (_, repoPath: string) => {
  return await scanRepository(repoPath)
})

ipcMain.handle('read-directory', async (_, dirPath: string) => {
  return await readDirectory(dirPath)
})

ipcMain.handle('read-file', async (_, filePath: string) => {
  return await readFile(filePath)
})

ipcMain.handle('detect-languages', async (_, repoPath: string) => {
  return await detectLanguages(repoPath)
})

// Persistence
ipcMain.handle('get-repositories', async () => {
  const repos = store.get('repositories', []) as any[]
  return await validateRepositories(repos)
})

ipcMain.handle('save-repositories', (_, repositories: any[]) => {
  store.set('repositories', repositories)
  return true
})

ipcMain.handle('remove-repository', (_, repoPath: string) => {
  const repos = store.get('repositories', []) as any[]
  const filtered = repos.filter((r: any) => r.path !== repoPath)
  store.set('repositories', filtered)
  return filtered
})

ipcMain.handle('cleanup-missing-repos', async () => {
  const repos = store.get('repositories', []) as any[]
  const cleaned = await cleanupMissingRepositories(repos)
  store.set('repositories', cleaned)
  return cleaned
})

// Bridge Console settings
ipcMain.handle('get-bridge-console-settings', () => {
  return getBridgeConsoleSettings()
})

ipcMain.handle('save-bridge-console-settings', (_, settings: any) => {
  return saveBridgeConsoleSettings(settings)
})

ipcMain.handle('test-bridge-console-connection', async (_, settings: any) => {
  return await testBridgeConsoleConnection(settings)
})

// Analysis
ipcMain.handle('get-file-stats', async (_, repoPath: string) => {
  return await getFileSizeStats(repoPath)
})

ipcMain.handle('get-cleanup-report', async (_, repoPath: string) => {
  return await generateCleanupReport(repoPath)
})

ipcMain.handle('detect-dead-code', async (_, repoPath: string) => {
  return await detectDeadCode(repoPath)
})

ipcMain.handle('run-full-scan', async (event, repoPath: string) => {
  return await runFullScan(repoPath, {
    onProgress: (message, step, total) => {
      event.sender.send('full-scan-progress', { message, step, total })
    }
  })
})

ipcMain.handle('delete-dead-file', async (_, repoPath: string, relativePath: string) => {
  return await deleteDeadFile(repoPath, relativePath)
})

ipcMain.handle('cleanup-dead-code', async (_, payload: { repoPath: string; deadFiles: string[]; unusedExports: any[]; createPr?: boolean }) => {
  return await cleanupDeadCode(payload.repoPath, payload.deadFiles, payload.unusedExports, { createPr: payload.createPr })
})

// Get outdated packages for any language
ipcMain.handle('get-outdated-packages', async (_, repoPath: string, language?: Language) => {
  const languages = language ? [language] : await detectLanguages(repoPath)
  const allPackages: any[] = []

  if (languages.length === 0) {
    throw new Error('No package.json found - is this a Node.js project?')
  }

  for (const lang of languages) {
    switch (lang) {
      case 'javascript':
        allPackages.push(...await getJsOutdatedPackages(repoPath))
        break
      case 'python':
        allPackages.push(...await getPythonOutdated(repoPath))
        break
      case 'ruby':
        allPackages.push(...await getRubyOutdated(repoPath))
        break
      case 'elixir':
        allPackages.push(...await getElixirOutdated(repoPath))
        break
    }
  }

  return allPackages
})

async function collectOutdatedPackages(repoPath: string) {
  const languages = await detectLanguages(repoPath)
  const allPackages: any[] = []

  for (const lang of languages) {
    switch (lang) {
      case 'javascript':
        allPackages.push(...await getJsOutdatedPackages(repoPath))
        break
      case 'python':
        allPackages.push(...await getPythonOutdated(repoPath))
        break
      case 'ruby':
        allPackages.push(...await getRubyOutdated(repoPath))
        break
      case 'elixir':
        allPackages.push(...await getElixirOutdated(repoPath))
        break
    }
  }

  return allPackages
}

// Run patch batch with full pipeline
ipcMain.handle('run-patch-batch', async (event, config: {
  repoPath: string
  branchName: string
  packages: { name: string; language: Language }[]
  createPR: boolean
  runTests: boolean
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}) => {
  const { repoPath, branchName, packages, createPR, runTests: shouldRunTests, prTitle, prBody, testCommand, testTimeoutMs } = config

  return runPatchBatchPipeline(
    {
      repoPath,
      branchName,
      packages,
      createPR,
      runTests: shouldRunTests,
      prTitle,
      prBody,
      testCommand,
      testTimeoutMs
    },
    {
      onProgress: (message, step, total) => event.sender.send('patch-batch-progress', { message, step, total }),
      onLog: (message) => event.sender.send('patch-batch-log', { message }),
      onWarning: (warning) => event.sender.send('patch-batch-warning', warning)
    }
  )
})

ipcMain.handle('run-security-patch', async (event, config: {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  testCommand?: string
}) => {
  return runSecurityPatchPipeline(
    config,
    {
      onProgress: (message, step, total) => event.sender.send('security-patch-progress', { message, step, total }),
      onLog: (message) => event.sender.send('security-patch-log', { message })
    }
  )
})


// Git info
ipcMain.handle('get-repo-info', async (_, repoPath: string) => {
  return await getRepoInfo(repoPath)
})

ipcMain.handle('check-protected-branch', async (_, repoPath: string) => {
  return await isOnProtectedBranch(repoPath)
})

// Scheduler
ipcMain.handle('get-scheduled-jobs', () => {
  return getScheduledJobs()
})

ipcMain.handle('add-scheduled-job', (_, job: any) => {
  return addScheduledJob(job)
})

ipcMain.handle('update-scheduled-job', (_, jobId: string, updates: any) => {
  return updateScheduledJob(jobId, updates)
})

ipcMain.handle('delete-scheduled-job', (_, jobId: string) => {
  return deleteScheduledJob(jobId)
})

ipcMain.handle('get-job-results', (_, jobId?: string) => {
  return getJobResults(jobId)
})

// Smart scheduling
ipcMain.handle('get-smart-scan-schedules', () => {
  return getSmartScanSchedules()
})

ipcMain.handle('add-smart-scan-schedule', async (_, payload: { repoPath: string; repoName: string }) => {
  return await addSmartScanSchedule(payload.repoPath, payload.repoName)
})

ipcMain.handle('update-smart-scan-schedule', async (_, id: string, updates: any) => {
  return updateSmartScanSchedule(id, updates)
})

ipcMain.handle('delete-smart-scan-schedule', async (_, id: string) => {
  return deleteSmartScanSchedule(id)
})

// Handle scheduler job execution
ipcMain.on('scheduler-job-complete', (_, result: any) => {
  addJobResult(result)
})

// Security Scanner
ipcMain.handle('check-security-scanner-available', async () => {
  return await checkAgenticFixerAvailable()
})

ipcMain.handle('run-security-scan', async (event, repoPath: string) => {
  return await runSecurityScan(repoPath, (progress) => {
    event.sender.send('security-scan-progress', progress)
  })
})

ipcMain.handle('generate-security-fix', async (_, finding: any) => {
  return await generateSecurityFix(finding)
})
