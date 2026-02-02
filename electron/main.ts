import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import Store from 'electron-store'
import { scanRepository, readDirectory, readFile, validateRepositories, cleanupMissingRepositories } from './services/fileSystem'
import { getFileSizeStats, generateCleanupReport } from './services/analysis'
import {
  detectLanguages,
  getPythonOutdated,
  getRubyOutdated,
  getElixirOutdated,
  updatePythonPackages,
  updateRubyPackages,
  updateElixirPackages,
  getCleanInstallCommand,
  getTestCommand,
  getLintCommand,
  getFilesToCommit,
  Language
} from './services/languages'
import {
  getScheduledJobs,
  addScheduledJob,
  updateScheduledJob,
  deleteScheduledJob,
  getJobResults,
  addJobResult,
  initializeScheduler,
  cleanupScheduler,
  ScheduledJob
} from './services/scheduler'
import {
  createBranch,
  commitChanges,
  pushBranch,
  createPullRequest,
  getRepoInfo,
  isOnProtectedBranch,
  runTests,
  runLint,
  abortChanges,
  deleteBranch
} from './services/git'
import {
  runSecurityScan,
  generateSecurityFix,
  checkAgenticFixerAvailable
} from './services/securityScanner'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import * as semver from 'semver'

const execAsync = promisify(exec)
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  cleanupScheduler()
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

// Analysis
ipcMain.handle('get-file-stats', async (_, repoPath: string) => {
  return await getFileSizeStats(repoPath)
})

ipcMain.handle('get-cleanup-report', async (_, repoPath: string) => {
  return await generateCleanupReport(repoPath)
})

// Get outdated packages for any language
ipcMain.handle('get-outdated-packages', async (_, repoPath: string, language?: Language) => {
  const languages = language ? [language] : await detectLanguages(repoPath)
  const allPackages: any[] = []

  for (const lang of languages) {
    switch (lang) {
      case 'javascript':
        const jsPackages = await getJsOutdatedPackages(repoPath)
        allPackages.push(...jsPackages)
        break
      case 'python':
        const pyPackages = await getPythonOutdated(repoPath)
        allPackages.push(...pyPackages)
        break
      case 'ruby':
        const rbPackages = await getRubyOutdated(repoPath)
        allPackages.push(...rbPackages)
        break
      case 'elixir':
        const exPackages = await getElixirOutdated(repoPath)
        allPackages.push(...exPackages)
        break
    }
  }

  return allPackages
})

// JavaScript outdated packages helper
async function getJsOutdatedPackages(repoPath: string) {
  try {
    const packageJsonPath = path.join(repoPath, 'package.json')
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageJsonContent)

    const devDeps = new Set(Object.keys(packageJson.devDependencies || {}))

    let outdatedJson: string
    try {
      const { stdout } = await execAsync('npm outdated --json', { cwd: repoPath })
      outdatedJson = stdout
    } catch (error: any) {
      outdatedJson = error.stdout || '{}'
    }

    const outdated = JSON.parse(outdatedJson || '{}')
    const packages: any[] = []

    for (const [name, info] of Object.entries(outdated) as [string, any][]) {
      const current = info.current || '0.0.0'
      const wanted = info.wanted || current
      const latest = info.latest || wanted

      const currentParsed = semver.parse(current)
      const wantedParsed = semver.parse(wanted)

      let hasPatchUpdate = false
      if (currentParsed && wantedParsed) {
        hasPatchUpdate = currentParsed.major === wantedParsed.major &&
                         currentParsed.minor === wantedParsed.minor &&
                         currentParsed.patch < wantedParsed.patch
      }

      packages.push({
        name,
        current,
        wanted,
        latest,
        type: devDeps.has(name) ? 'devDependencies' : 'dependencies',
        hasPatchUpdate,
        language: 'javascript'
      })
    }

    return packages.sort((a, b) => {
      if (a.hasPatchUpdate && !b.hasPatchUpdate) return -1
      if (!a.hasPatchUpdate && b.hasPatchUpdate) return 1
      return a.name.localeCompare(b.name)
    })
  } catch {
    return []
  }
}

// Run patch batch with full pipeline
ipcMain.handle('run-patch-batch', async (event, config: {
  repoPath: string
  branchName: string
  packages: { name: string; language: Language }[]
  createPR: boolean
  runTests: boolean
  prTitle?: string
  prBody?: string
}) => {
  const { repoPath, branchName, packages, createPR, runTests: shouldRunTests, prTitle, prBody } = config

  const sendProgress = (message: string, step: number, total: number) => {
    event.sender.send('patch-batch-progress', { message, step, total })
  }

  const totalSteps = shouldRunTests ? 8 : 6
  let currentStep = 0

  try {
    // Step 1: Check branch safety
    sendProgress('Checking branch safety...', ++currentStep, totalSteps)
    const repoInfo = await getRepoInfo(repoPath)
    const originalBranch = repoInfo.branch

    if (repoInfo.hasChanges) {
      return { success: false, error: 'Repository has uncommitted changes. Please commit or stash first.' }
    }

    // Step 2: Create branch (this handles protected branch check)
    sendProgress('Creating git branch...', ++currentStep, totalSteps)
    await createBranch(repoPath, branchName)

    // Step 3: Update packages by language
    sendProgress('Updating packages...', ++currentStep, totalSteps)

    const byLanguage = new Map<Language, string[]>()
    for (const pkg of packages) {
      const list = byLanguage.get(pkg.language) || []
      list.push(pkg.name)
      byLanguage.set(pkg.language, list)
    }

    const allUpdated: string[] = []
    const allFailed: string[] = []

    for (const [lang, pkgNames] of byLanguage) {
      let result: { updated: string[]; failed: string[] }

      switch (lang) {
        case 'javascript':
          result = await updateJsPackages(repoPath, pkgNames)
          break
        case 'python':
          result = await updatePythonPackages(repoPath, pkgNames)
          break
        case 'ruby':
          result = await updateRubyPackages(repoPath, pkgNames)
          break
        case 'elixir':
          result = await updateElixirPackages(repoPath, pkgNames)
          break
        default:
          result = { updated: [], failed: pkgNames }
      }

      allUpdated.push(...result.updated)
      allFailed.push(...result.failed)
    }

    // Step 4: Run clean install
    sendProgress('Running clean install...', ++currentStep, totalSteps)
    const primaryLang = packages[0]?.language || 'javascript'
    const cleanCmd = getCleanInstallCommand(primaryLang)
    if (cleanCmd) {
      await execAsync(cleanCmd, { cwd: repoPath, timeout: 300000 })
    }

    // Step 5: Run tests if requested
    let testsPassed = true
    if (shouldRunTests) {
      sendProgress('Running tests...', ++currentStep, totalSteps)
      const testCmd = getTestCommand(primaryLang)
      if (testCmd) {
        const testResult = await runTests(repoPath, testCmd)
        testsPassed = testResult.success

        if (!testsPassed) {
          // Abort and cleanup
          sendProgress('Tests failed, reverting changes...', ++currentStep, totalSteps)
          await abortChanges(repoPath, originalBranch)
          await deleteBranch(repoPath, branchName)
          return {
            success: false,
            error: 'Tests failed. Changes reverted.',
            testOutput: testResult.output
          }
        }
      }

      // Run lint
      sendProgress('Running linter...', ++currentStep, totalSteps)
      const lintCmd = getLintCommand(primaryLang)
      if (lintCmd) {
        const lintResult = await runLint(repoPath, lintCmd)
        if (!lintResult.success) {
          // Lint failures are warnings, not blockers
          event.sender.send('patch-batch-warning', { message: 'Linter found issues', output: lintResult.output })
        }
      }
    }

    // Step 6: Commit changes
    sendProgress('Committing changes...', ++currentStep, totalSteps)
    const files = getFilesToCommit(primaryLang)
    await commitChanges(repoPath, `chore(deps): update ${allUpdated.length} packages to latest patch versions

Updated packages:
${allUpdated.map(p => `- ${p}`).join('\n')}`, files)

    // Step 7: Push branch
    sendProgress('Pushing branch...', ++currentStep, totalSteps)
    await pushBranch(repoPath, branchName)

    // Step 8: Create PR if requested
    let prUrl: string | null = null
    if (createPR) {
      sendProgress('Creating pull request...', ++currentStep, totalSteps)
      prUrl = await createPullRequest(
        repoPath,
        prTitle || `chore(deps): update ${allUpdated.length} packages`,
        prBody || `## Summary
Automated patch version updates via Bridge.

### Updated packages
${allUpdated.map(p => `- ${p}`).join('\n')}

${shouldRunTests ? '### Checks\n- [x] Tests passed\n- [x] Lint checked' : ''}`
      )
    }

    return {
      success: true,
      updatedPackages: allUpdated,
      failedPackages: allFailed,
      prUrl,
      testsPassed
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})

// JavaScript package update helper
async function updateJsPackages(repoPath: string, packages: string[]) {
  const updated: string[] = []
  const failed: string[] = []

  const packageJsonPath = path.join(repoPath, 'package.json')
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)

  const outdated = await getJsOutdatedPackages(repoPath)
  const outdatedMap = new Map(outdated.map((p: any) => [p.name, p]))

  for (const pkgName of packages) {
    const pkg = outdatedMap.get(pkgName)
    if (!pkg || !pkg.hasPatchUpdate) {
      failed.push(pkgName)
      continue
    }

    if (packageJson.dependencies?.[pkgName]) {
      const currentVersion = packageJson.dependencies[pkgName]
      const prefix = currentVersion.match(/^[^0-9]*/)?.[0] || '^'
      packageJson.dependencies[pkgName] = `${prefix}${pkg.wanted}`
      updated.push(pkgName)
    } else if (packageJson.devDependencies?.[pkgName]) {
      const currentVersion = packageJson.devDependencies[pkgName]
      const prefix = currentVersion.match(/^[^0-9]*/)?.[0] || '^'
      packageJson.devDependencies[pkgName] = `${prefix}${pkg.wanted}`
      updated.push(pkgName)
    } else {
      failed.push(pkgName)
    }
  }

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

  return { updated, failed }
}

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
