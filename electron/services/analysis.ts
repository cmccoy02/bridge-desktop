import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { app } from 'electron'
import { createBridgeStore } from './store'
import {
  detectLanguages,
  getPythonOutdated,
  getRubyOutdated,
  getElixirOutdated,
  type OutdatedPackage
} from './languages'
import { getJsOutdatedPackages } from './patchBatch'
import {
  getRepoInfo,
  createBranch,
  commitChanges,
  pushBranch,
  createPullRequest,
  abortChanges,
  deleteBranch,
  ensureSafeBranch
} from './git'
import {
  getBridgeConsoleSettings,
  sendScanToConsole,
  type ConsoleUploadResult
} from './bridgeConsoleApi'
import {
  loadBridgeConfig,
  generateDefaultConfig,
  writeBridgeConfig,
  type BridgeConfig
} from './bridgeConfig'
import {
  calculateTechDebtScore,
  type CodeHealthMetrics,
  type ScanData,
  type TechDebtScore
} from './techDebtScorer'
import {
  generateScanReport,
  writeScanReportArtifacts,
  type BridgeScanReport
} from './scanReport'
import {
  scanRepoForSecurityPatterns,
  type SecurityPatternFinding
} from './securityPatterns'

const execAsync = promisify(exec)
const scanStore = createBridgeStore('bridge-analysis')
const SCAN_HISTORY_KEY = 'td-scan-history'
const DEFAULT_SCAN_TIMEOUT_MS = 10 * 60 * 1000

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
  codeHealth: CodeHealthMetrics
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

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function getBridgeRoot(): string {
  try {
    const appPath = app.getAppPath()
    return appPath
  } catch {
    return path.resolve(__dirname, '..', '..')
  }
}

function buildToolEnv(): NodeJS.ProcessEnv {
  const root = getBridgeRoot()
  const binPath = path.join(root, 'node_modules', '.bin')
  const existingPath = process.env.PATH || ''
  return {
    ...process.env,
    PATH: `${binPath}${path.delimiter}${existingPath}`
  }
}

async function resolveCommandEnv(cwd: string): Promise<NodeJS.ProcessEnv> {
  const env = buildToolEnv()
  const localNpmrc = path.join(cwd, '.npmrc')
  try {
    await fs.access(localNpmrc)
    env.NPM_CONFIG_USERCONFIG = localNpmrc
    env.npm_config_userconfig = localNpmrc
  } catch {
    // Keep defaults when repository does not define .npmrc.
  }
  return env
}

async function detectPackageManager(repoPath: string): Promise<'npm' | 'yarn' | 'pnpm'> {
  try {
    await fs.access(path.join(repoPath, 'pnpm-lock.yaml'))
    return 'pnpm'
  } catch {}
  try {
    await fs.access(path.join(repoPath, 'yarn.lock'))
    return 'yarn'
  } catch {}
  return 'npm'
}

function extractJsonPayload(output: string): any | null {
  const trimmed = output.trim()
  if (!trimmed) return null

  const jsonMatch = trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])$/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1])
    } catch {}
  }

  const firstBrace = trimmed.indexOf('{')
  const firstBracket = trimmed.indexOf('[')
  const start = firstBrace === -1 ? firstBracket : firstBracket === -1 ? firstBrace : Math.min(firstBrace, firstBracket)
  if (start >= 0) {
    try {
      return JSON.parse(trimmed.slice(start))
    } catch {}
  }

  return null
}

async function runCli(command: string, args: string[], cwd: string, timeoutMs = DEFAULT_SCAN_TIMEOUT_MS) {
  const cmd = `${command} ${args.join(' ')}`.trim()
  try {
    const env = await resolveCommandEnv(cwd)
    const { stdout, stderr } = await execAsync(cmd, {
      cwd,
      timeout: timeoutMs,
      maxBuffer: 20 * 1024 * 1024,
      env
    })
    return { stdout: stdout || '', stderr: stderr || '', success: true }
  } catch (error: any) {
    return {
      stdout: error?.stdout || '',
      stderr: error?.stderr || error?.message || '',
      success: false
    }
  }
}

function getScanHistory(repoPath: string): { bundleSize?: number; techDebtScore?: number } {
  const history = scanStore.get(SCAN_HISTORY_KEY, {}) as Record<string, { bundleSize?: number; techDebtScore?: number }>
  return history[repoPath] || {}
}

function saveScanHistory(repoPath: string, data: { bundleSize?: number; techDebtScore?: number }): void {
  const history = scanStore.get(SCAN_HISTORY_KEY, {}) as Record<string, { bundleSize?: number; techDebtScore?: number }>
  history[repoPath] = { ...(history[repoPath] || {}), ...data }
  scanStore.set(SCAN_HISTORY_KEY, history)
}

async function getReadmeStats(repoPath: string): Promise<{ exists: boolean; wordCount: number; daysSinceUpdate: number }> {
  const readmePath = path.join(repoPath, 'README.md')
  try {
    const [content, stats] = await Promise.all([
      fs.readFile(readmePath, 'utf-8'),
      fs.stat(readmePath)
    ])
    const words = content.trim().split(/\s+/).filter(Boolean).length
    const daysSinceUpdate = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24)
    return { exists: true, wordCount: words, daysSinceUpdate }
  } catch {
    return { exists: false, wordCount: 0, daysSinceUpdate: 999 }
  }
}

async function getLockfileAgeDays(repoPath: string): Promise<number | null> {
  const candidates = [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'poetry.lock',
    'Pipfile.lock',
    'Gemfile.lock',
    'mix.lock',
    'Cargo.lock'
  ]

  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(path.join(repoPath, candidate))
      return (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24)
    } catch {
      // Keep scanning candidates.
    }
  }

  return null
}

async function getInstalledDependencyNames(repoPath: string): Promise<string[]> {
  try {
    const packageJsonPath = path.join(repoPath, 'package.json')
    const raw = await fs.readFile(packageJsonPath, 'utf-8')
    const pkg = JSON.parse(raw)
    const names = new Set<string>()

    for (const key of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      const section = pkg?.[key]
      if (section && typeof section === 'object') {
        for (const name of Object.keys(section)) {
          names.add(name)
        }
      }
    }

    return Array.from(names)
  } catch {
    return []
  }
}

async function existsAt(repoPath: string, relativePath: string): Promise<boolean> {
  try {
    await fs.access(path.join(repoPath, relativePath))
    return true
  } catch {
    return false
  }
}

async function detectTestScript(repoPath: string): Promise<boolean> {
  try {
    const raw = await fs.readFile(path.join(repoPath, 'package.json'), 'utf-8')
    const pkg = JSON.parse(raw)
    return Boolean(pkg?.scripts?.test && String(pkg.scripts.test).trim())
  } catch {
    return false
  }
}

async function detectCiConfig(repoPath: string): Promise<boolean> {
  const candidates = [
    '.github/workflows',
    '.gitlab-ci.yml',
    'circle.yml',
    '.circleci/config.yml',
    'azure-pipelines.yml',
    'Jenkinsfile'
  ]
  for (const candidate of candidates) {
    if (await existsAt(repoPath, candidate)) {
      return true
    }
  }
  return false
}

async function detectNodeModulesCommitted(repoPath: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync('git ls-files node_modules', {
      cwd: repoPath,
      timeout: 20000
    })
    return stdout.trim().length > 0
  } catch {
    return false
  }
}

async function collectPathDepthSignals(repoPath: string): Promise<{ maxNestingDepth: number; deeplyNestedFiles: number }> {
  let maxNestingDepth = 0
  let deeplyNestedFiles = 0
  const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'build', '.next', 'coverage', '.bridge'])

  const walk = async (dir: string, depth: number): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) continue
        await walk(fullPath, depth + 1)
      } else {
        maxNestingDepth = Math.max(maxNestingDepth, depth)
        if (depth > 6) {
          deeplyNestedFiles += 1
        }
      }
    }
  }

  await walk(repoPath, 0)
  return { maxNestingDepth, deeplyNestedFiles }
}

async function computeCodeHealthMetrics(repoPath: string): Promise<CodeHealthMetrics> {
  const metrics: CodeHealthMetrics = {
    todoCount: 0,
    consoleLogCount: 0,
    commentedOutBlockCount: 0,
    mixedTabsSpaces: false,
    inconsistentQuoteStyle: false,
    hasLinter: false,
    hasFormatter: false,
    packageScriptsCount: 0,
    hasGitignore: false
  }

  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.rb', '.go', '.java', '.rs', '.ex', '.exs']
  const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', '.bridge'])
  let singleQuoteCount = 0
  let doubleQuoteCount = 0

  metrics.hasGitignore = await existsAt(repoPath, '.gitignore')

  try {
    const packageJsonRaw = await fs.readFile(path.join(repoPath, 'package.json'), 'utf-8')
    const packageJson = JSON.parse(packageJsonRaw)
    metrics.packageScriptsCount = Object.keys(packageJson?.scripts || {}).length
    const deps = { ...(packageJson?.dependencies || {}), ...(packageJson?.devDependencies || {}) }
    metrics.hasLinter = Boolean(deps.eslint || deps['@typescript-eslint/eslint-plugin'] || packageJson?.scripts?.lint)
    metrics.hasFormatter = Boolean(deps.prettier || deps.rome || packageJson?.scripts?.format)
  } catch {
    // non-node repos or unreadable package.json
  }

  const walk = async (dir: string): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) continue
        await walk(fullPath)
      } else if (extensions.includes(path.extname(entry.name).toLowerCase())) {
        const content = await fs.readFile(fullPath, 'utf-8').catch(() => '')
        if (!content) continue

        const todoMatches = content.match(/\b(TODO|FIXME|HACK)\b/g)
        const consoleMatches = content.match(/console\.log\s*\(/g)
        const commentedOutMatches = content.match(/^\s*\/\/\s*(if|for|while|function|class|const|let|var)\b/gm)
        metrics.todoCount += todoMatches?.length || 0
        metrics.consoleLogCount += consoleMatches?.length || 0
        metrics.commentedOutBlockCount += commentedOutMatches?.length || 0

        const hasTabs = /^\t+/m.test(content)
        const hasSpaces = /^ {2,}/m.test(content)
        if (hasTabs && hasSpaces) {
          metrics.mixedTabsSpaces = true
        }

        singleQuoteCount += (content.match(/'[^'\n]*'/g) || []).length
        doubleQuoteCount += (content.match(/"[^"\n]*"/g) || []).length
      }
    }
  }

  await walk(repoPath)
  const quoteTotal = singleQuoteCount + doubleQuoteCount
  if (quoteTotal > 0) {
    const ratio = Math.abs(singleQuoteCount - doubleQuoteCount) / quoteTotal
    metrics.inconsistentQuoteStyle = ratio < 0.6
  }

  return metrics
}

async function collectRepositoryInsights(
  repoPath: string,
  config: BridgeConfig
): Promise<ScanData['repositoryInsights']> {
  const existsAny = async (targets: string[]): Promise<boolean> => {
    for (const target of targets) {
      if (await existsAt(repoPath, target)) {
        return true
      }
    }
    return false
  }

  const [readmeStats, ciDetected, hasTestScript, pathSignals, nodeModulesCommitted, lockfileAgeDays] = await Promise.all([
    getReadmeStats(repoPath),
    detectCiConfig(repoPath),
    detectTestScript(repoPath),
    collectPathDepthSignals(repoPath),
    detectNodeModulesCommitted(repoPath),
    getLockfileAgeDays(repoPath)
  ])

  const hasLockfile = await existsAny([
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'poetry.lock',
    'Pipfile.lock',
    'Gemfile.lock',
    'mix.lock',
    'Cargo.lock'
  ])

  const hasSrcDirectory = await existsAt(repoPath, 'src')
  const hasChangelog = await existsAny(['CHANGELOG.md', 'changelog.md', 'CHANGELOG'])
  const hasContributingGuide = await existsAny(['CONTRIBUTING.md', '.github/CONTRIBUTING.md'])
  const hasLicense = await existsAny(['LICENSE', 'LICENSE.md', 'LICENSE.txt'])

  return {
    hasLockfile,
    lockfileDaysSinceUpdate: lockfileAgeDays,
    packageManagerDetected: Boolean(config.project.packageManager),
    hasSrcDirectory,
    ciDetected,
    readmeExists: readmeStats.exists,
    readmeWordCount: readmeStats.wordCount,
    readmeDaysSinceUpdate: readmeStats.daysSinceUpdate,
    hasChangelog,
    hasContributingGuide,
    hasLicense,
    testCommandExists: Boolean(config.gates.tests.command || hasTestScript),
    testsPass: null,
    maxNestingDepth: pathSignals.maxNestingDepth,
    deeplyNestedFiles: pathSignals.deeplyNestedFiles,
    nodeModulesCommitted
  }
}

// Find largest files in the repository
export async function findLargeFiles(repoPath: string, minSizeBytes: number = 1024 * 1024): Promise<LargeFile[]> {
  const largeFiles: LargeFile[] = []

  async function scanDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        // Skip node_modules, .git, vendor, deps, etc.
        if (['node_modules', '.git', 'vendor', 'deps', '_build', '.bundle', '__pycache__', '.venv', 'venv'].includes(entry.name)) {
          continue
        }

        if (entry.isDirectory()) {
          await scanDir(fullPath)
        } else {
          try {
            const stats = await fs.stat(fullPath)
            if (stats.size >= minSizeBytes) {
              largeFiles.push({
                path: path.relative(repoPath, fullPath),
                size: stats.size,
                sizeFormatted: formatSize(stats.size),
                type: 'current'
              })
            }
          } catch {}
        }
      }
    } catch {}
  }

  await scanDir(repoPath)

  return largeFiles.sort((a, b) => b.size - a.size)
}

// Find large files in git history (blobs that are large but may have been deleted)
export async function findGitHistoryBlobs(repoPath: string, minSizeBytes: number = 5 * 1024 * 1024): Promise<LargeFile[]> {
  const largeFiles: LargeFile[] = []

  try {
    // Get all blobs with their sizes
    const { stdout } = await execAsync(
      `git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '/^blob/ {print $2, $3, $4}'`,
      { cwd: repoPath, timeout: 60000, maxBuffer: 50 * 1024 * 1024 }
    )

    const lines = stdout.split('\n').filter(l => l.trim())

    for (const line of lines) {
      const parts = line.split(' ')
      if (parts.length >= 2) {
        const size = parseInt(parts[1], 10)
        const filePath = parts.slice(2).join(' ') || parts[0]

        if (size >= minSizeBytes) {
          largeFiles.push({
            path: filePath,
            size,
            sizeFormatted: formatSize(size),
            type: 'git-history'
          })
        }
      }
    }
  } catch (e) {
    console.error('Git history scan failed:', e)
  }

  return largeFiles.sort((a, b) => b.size - a.size).slice(0, 50)
}

// Find oversized components (files with too many lines)
export async function findOversizedComponents(repoPath: string, maxLines: number = 150): Promise<OversizedComponent[]> {
  const oversized: OversizedComponent[] = []

  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.py', '.rb', '.ex', '.exs', '.go', '.rs', '.java', '.kt', '.swift']

  async function scanDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (['node_modules', '.git', 'vendor', 'deps', '_build', '.bundle', '__pycache__', '.venv', 'venv', 'dist', 'build'].includes(entry.name)) {
          continue
        }

        if (entry.isDirectory()) {
          await scanDir(fullPath)
        } else {
          const ext = path.extname(entry.name).toLowerCase()

          if (codeExtensions.includes(ext)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8')
              const lines = content.split('\n').length

              if (lines > maxLines) {
                let type = 'file'

                // Try to detect component type
                if (ext === '.tsx' || ext === '.jsx') {
                  type = 'React Component'
                } else if (ext === '.vue') {
                  type = 'Vue Component'
                } else if (ext === '.svelte') {
                  type = 'Svelte Component'
                } else if (content.includes('class ') && content.includes('def ')) {
                  type = 'Class'
                }

                oversized.push({
                  path: path.relative(repoPath, fullPath),
                  lines,
                  type
                })
              }
            } catch {}
          }
        }
      }
    } catch {}
  }

  await scanDir(repoPath)

  return oversized.sort((a, b) => b.lines - a.lines)
}

// Get file size statistics for a repository
export async function getFileSizeStats(repoPath: string): Promise<{
  totalSize: number
  totalSizeFormatted: string
  fileCount: number
  largestFiles: LargeFile[]
}> {
  let totalSize = 0
  let fileCount = 0
  const files: LargeFile[] = []

  async function scanDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (['node_modules', '.git', 'vendor', 'deps', '_build', '.bundle'].includes(entry.name)) {
          continue
        }

        if (entry.isDirectory()) {
          await scanDir(fullPath)
        } else {
          try {
            const stats = await fs.stat(fullPath)
            totalSize += stats.size
            fileCount++

            files.push({
              path: path.relative(repoPath, fullPath),
              size: stats.size,
              sizeFormatted: formatSize(stats.size),
              type: 'current'
            })
          } catch {}
        }
      }
    } catch {}
  }

  await scanDir(repoPath)

  // Sort and get top 20
  files.sort((a, b) => b.size - a.size)

  return {
    totalSize,
    totalSizeFormatted: formatSize(totalSize),
    fileCount,
    largestFiles: files.slice(0, 20)
  }
}

// Generate full cleanup report
export async function generateCleanupReport(repoPath: string): Promise<CleanupReport> {
  const [largeFiles, gitHistoryFiles, oversizedComponents] = await Promise.all([
    findLargeFiles(repoPath, 500 * 1024), // 500KB+
    findGitHistoryBlobs(repoPath, 5 * 1024 * 1024), // 5MB+ in git history
    findOversizedComponents(repoPath, 150)
  ])

  const totalWastedSpace = gitHistoryFiles.reduce((sum, f) => sum + f.size, 0)

  return {
    largeFiles,
    gitHistoryFiles,
    oversizedComponents,
    totalWastedSpace,
    totalWastedSpaceFormatted: formatSize(totalWastedSpace)
  }
}

async function getNpmAuditSummary(repoPath: string): Promise<VulnerabilitySummary> {
  const empty: VulnerabilitySummary = { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
  const manager = await detectPackageManager(repoPath)
  const auditArgs = manager === 'npm'
    ? ['audit', '--json']
    : ['audit', '--json']

  const result = await runCli(manager, auditArgs, repoPath, DEFAULT_SCAN_TIMEOUT_MS)
  const payload = extractJsonPayload(result.stdout || result.stderr)
  if (!payload) {
    return empty
  }

  if (payload.metadata?.vulnerabilities) {
    const meta = payload.metadata.vulnerabilities
    const critical = Number(meta.critical || 0)
    const high = Number(meta.high || 0)
    const medium = Number(meta.moderate || meta.medium || 0)
    const low = Number(meta.low || 0)
    const total = critical + high + medium + low
    return { critical, high, medium, low, total }
  }

  if (payload.vulnerabilities && typeof payload.vulnerabilities === 'object' && !Array.isArray(payload.vulnerabilities)) {
    const counts = payload.vulnerabilities as Record<string, any>
    if (typeof counts.critical === 'number') {
      const critical = Number(counts.critical || 0)
      const high = Number(counts.high || 0)
      const medium = Number(counts.moderate || counts.medium || 0)
      const low = Number(counts.low || 0)
      const total = critical + high + medium + low
      return { critical, high, medium, low, total }
    }
  }

  if (payload.advisories && typeof payload.advisories === 'object') {
    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 }
    for (const advisory of Object.values(payload.advisories) as any[]) {
      const severity = String(advisory.severity || '').toLowerCase()
      if (severity === 'critical') severityCounts.critical += 1
      else if (severity === 'high') severityCounts.high += 1
      else if (severity === 'moderate' || severity === 'medium') severityCounts.medium += 1
      else if (severity === 'low') severityCounts.low += 1
    }
    const total = severityCounts.critical + severityCounts.high + severityCounts.medium + severityCounts.low
    return { ...severityCounts, total }
  }

  return empty
}

export async function analyzeDependencies(repoPath: string): Promise<DependencyReport> {
  try {
    const languages = await detectLanguages(repoPath)
    const outdated: OutdatedPackage[] = []

    for (const lang of languages) {
      switch (lang) {
        case 'javascript':
          outdated.push(...await getJsOutdatedPackages(repoPath))
          break
        case 'python':
          outdated.push(...await getPythonOutdated(repoPath))
          break
        case 'ruby':
          outdated.push(...await getRubyOutdated(repoPath))
          break
        case 'elixir':
          outdated.push(...await getElixirOutdated(repoPath))
          break
      }
    }

    const vulnerabilities = languages.includes('javascript')
      ? await getNpmAuditSummary(repoPath)
      : { critical: 0, high: 0, medium: 0, low: 0, total: 0 }

    const installedPackages = await getInstalledDependencyNames(repoPath)
    return { outdated, vulnerabilities, installedPackages }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Dependency analysis failed'
    return {
      outdated: [],
      vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
      installedPackages: [],
      error: message
    }
  }
}

export async function detectCircularDependencies(repoPath: string): Promise<CircularDependencyReport> {
  const tempConfigPath = path.join(repoPath, '.bridge-depcruise.tmp.json')
  try {
    const tempConfig = {
      forbidden: [
        {
          name: 'no-circular',
          severity: 'error',
          from: {},
          to: { circular: true }
        }
      ]
    }
    await fs.writeFile(tempConfigPath, JSON.stringify(tempConfig), 'utf-8')

    const result = await runCli(
      'depcruise',
      [
        '--config', tempConfigPath,
        '--include-only', '^src',
        '--exclude', 'node_modules',
        '--output-type', 'json',
        '.'
      ],
      repoPath,
      DEFAULT_SCAN_TIMEOUT_MS
    )
    const payload = extractJsonPayload(result.stdout || result.stderr)
    if (!payload) {
      return {
        count: 0,
        dependencies: [],
        error: 'dependency-cruiser did not produce parseable output.'
      }
    }

    const violations = payload.output?.violations || []
    const dependencies: CircularDependency[] = violations.map((violation: any) => ({
      from: violation.from,
      to: violation.to,
      cycle: Array.isArray(violation.cycle) ? violation.cycle : []
    }))

    return {
      count: dependencies.length,
      dependencies
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Circular dependency scan failed'
    return { count: 0, dependencies: [], error: message }
  } finally {
    await fs.unlink(tempConfigPath).catch(() => {})
  }
}

function normalizeReportedPath(repoPath: string, target: string): string {
  const cleaned = target.replace(/^(\.\/|\\)/, '').trim()
  if (!cleaned) return target
  if (path.isAbsolute(cleaned)) {
    return path.relative(repoPath, cleaned)
  }
  return cleaned
}

function parseDeadCodeExports(payload: any, repoPath: string): DeadCodeExport[] {
  const exports: DeadCodeExport[] = []
  if (!payload) return exports

  if (Array.isArray(payload.exports)) {
    for (const entry of payload.exports) {
      const file = normalizeReportedPath(repoPath, entry.file || entry.path || '')
      const list = entry.exports || entry.unusedExports || []
      if (Array.isArray(list)) {
        for (const exp of list) {
          exports.push({ file, exportName: String(exp) })
        }
      }
    }
  }

  if (Array.isArray(payload.unusedExports)) {
    for (const entry of payload.unusedExports) {
      if (typeof entry === 'string') {
        exports.push({ file: 'unknown', exportName: entry })
      } else if (entry && typeof entry === 'object') {
        exports.push({
          file: normalizeReportedPath(repoPath, entry.file || entry.path || 'unknown'),
          exportName: String(entry.export || entry.name || '')
        })
      }
    }
  }

  return exports
}

function parseDeadFiles(payload: any, repoPath: string): string[] {
  if (!payload) return []
  const candidates =
    payload.unusedFiles ||
    payload.unimported ||
    payload.unused ||
    payload.files ||
    payload.unusedModules ||
    []

  if (Array.isArray(candidates)) {
    return candidates
      .map((entry: any) => typeof entry === 'string' ? entry : entry?.file || entry?.path)
      .filter(Boolean)
      .map((file: string) => normalizeReportedPath(repoPath, file))
  }

  return []
}

export async function detectDeadCode(repoPath: string): Promise<DeadCodeReport> {
  const report: DeadCodeReport = {
    deadFiles: [],
    unusedExports: [],
    totalDeadCodeCount: 0,
    raw: {}
  }

  const knipResult = await runCli('knip', ['--reporter', 'json'], repoPath, DEFAULT_SCAN_TIMEOUT_MS)
  report.raw!.knip = knipResult.stdout || knipResult.stderr
  const knipPayload = extractJsonPayload(knipResult.stdout || knipResult.stderr)
  report.unusedExports = parseDeadCodeExports(knipPayload, repoPath)

  const unimportedResult = await runCli('unimported', ['--json'], repoPath, DEFAULT_SCAN_TIMEOUT_MS)
  report.raw!.unimported = unimportedResult.stdout || unimportedResult.stderr
  const unimportedPayload = extractJsonPayload(unimportedResult.stdout || unimportedResult.stderr)
  report.deadFiles = parseDeadFiles(unimportedPayload, repoPath)

  report.totalDeadCodeCount = report.deadFiles.length + report.unusedExports.length

  if (!knipResult.success && !unimportedResult.success) {
    report.error = 'Dead code tooling failed to run. Ensure knip and unimported are installed.'
  }

  return report
}

async function locateStatsFile(repoPath: string): Promise<string | null> {
  const candidates = [
    path.join(repoPath, 'dist', 'stats.json'),
    path.join(repoPath, 'build', 'stats.json'),
    path.join(repoPath, 'stats.json')
  ]

  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {}
  }

  return null
}

export async function analyzeBundleSize(repoPath: string): Promise<BundleAnalysisReport> {
  try {
    let statsPath = await locateStatsFile(repoPath)
    if (!statsPath) {
      const manager = await detectPackageManager(repoPath)
      const buildArgs = manager === 'yarn'
        ? ['run', 'build', '--stats-json']
        : ['run', 'build', '--', '--stats-json']
      await runCli(manager, buildArgs, repoPath, DEFAULT_SCAN_TIMEOUT_MS)
      statsPath = await locateStatsFile(repoPath)
    }

    if (!statsPath) {
      return {
        totalSize: 0,
        totalSizeFormatted: formatSize(0),
        largestModules: [],
        error: 'Bundle stats not found. Ensure your build outputs stats.json.'
      }
    }

    const raw = await fs.readFile(statsPath, 'utf-8')
    const stats = JSON.parse(raw)
    const assets = stats.assets || stats.children?.flatMap((child: any) => child.assets || []) || []
    const modules = stats.modules || stats.children?.flatMap((child: any) => child.modules || []) || []

    const totalSize = assets.reduce((sum: number, asset: any) => sum + (asset?.size || 0), 0)
    const largestModules = modules
      .filter((mod: any) => typeof mod?.size === 'number')
      .sort((a: any, b: any) => b.size - a.size)
      .slice(0, 10)
      .map((mod: any) => ({
        name: String(mod.name || mod.identifier || mod.moduleName || 'unknown'),
        size: mod.size,
        sizeFormatted: formatSize(mod.size)
      }))

    const history = getScanHistory(repoPath)
    const previousSize = history.bundleSize
    const delta = previousSize ? totalSize - previousSize : undefined
    const deltaPercent = previousSize ? (delta! / previousSize) * 100 : undefined
    const warning = typeof deltaPercent === 'number' ? deltaPercent > 10 : false

    saveScanHistory(repoPath, { bundleSize: totalSize })

    return {
      totalSize,
      totalSizeFormatted: formatSize(totalSize),
      largestModules,
      previousSize,
      delta,
      deltaPercent,
      warning,
      statsPath
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Bundle analysis failed'
    return {
      totalSize: 0,
      totalSizeFormatted: formatSize(0),
      largestModules: [],
      error: message
    }
  }
}

export async function analyzeTestCoverage(repoPath: string): Promise<TestCoverageReport> {
  const report: TestCoverageReport = {
    coveragePercentage: null,
    uncoveredCriticalFiles: []
  }

  try {
    await fs.access(path.join(repoPath, 'package.json'))
  } catch {
    report.error = 'No package.json found for test coverage'
    return report
  }

  const manager = await detectPackageManager(repoPath)
  const testArgs = manager === 'yarn'
    ? ['test', '--coverage']
    : manager === 'pnpm'
      ? ['test', '--', '--coverage']
      : ['test', '--', '--coverage']

  await runCli(manager, testArgs, repoPath, DEFAULT_SCAN_TIMEOUT_MS)

  try {
    const summaryPath = path.join(repoPath, 'coverage', 'coverage-summary.json')
    const summaryRaw = await fs.readFile(summaryPath, 'utf-8')
    const summary = JSON.parse(summaryRaw)
    const total = summary.total
    report.coveragePercentage = total?.lines?.pct ?? null
    report.summaryPath = summaryPath

    const criticalEntries = Object.entries(summary)
      .filter(([key]) => key !== 'total')
      .filter(([file]) => file.includes('/auth/') || file.includes('/payments/') || file.includes('/api/'))
      .map(([file, data]: any) => ({
        file,
        coverage: data?.lines?.pct ?? 0
      }))
      .filter(entry => entry.coverage < 70)

    report.uncoveredCriticalFiles = criticalEntries
  } catch (error) {
    report.error = error instanceof Error ? error.message : 'Coverage summary not found'
  }

  return report
}

async function findSourceFiles(dir: string, extensions: string[]): Promise<string[]> {
  const results: string[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])

  for (const entry of entries) {
    if (entry.name.startsWith('.') || ['node_modules', 'dist', 'build', 'coverage'].includes(entry.name)) {
      continue
    }
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...await findSourceFiles(fullPath, extensions))
    } else if (extensions.includes(path.extname(entry.name))) {
      results.push(fullPath)
    }
  }

  return results
}

export async function detectDocumentationDebt(repoPath: string): Promise<DocumentationDebtReport> {
  const requiredSections = ['Installation', 'Usage', 'API', 'Contributing', 'License']

  try {
    const readmePath = path.join(repoPath, 'README.md')
    const readme = await fs.readFile(readmePath, 'utf-8')

    const missingSections = requiredSections.filter(section => {
      const pattern = new RegExp(`^#{1,6}\\s+${section}\\b`, 'm')
      return !pattern.test(readme)
    })

    const lastUpdateMatch = readme.match(/Last updated:\s*(.+)/i)
    const lastUpdate = lastUpdateMatch ? new Date(lastUpdateMatch[1]) : null
    const validLastUpdate = lastUpdate && !Number.isNaN(lastUpdate.getTime())
    const daysSinceUpdate = validLastUpdate
      ? (Date.now() - lastUpdate!.getTime()) / (1000 * 60 * 60 * 24)
      : 999

    const srcDir = path.join(repoPath, 'src')
    const srcFiles = await findSourceFiles(srcDir, ['.ts', '.tsx', '.js', '.jsx'])
    let undocumentedFunctions = 0

    for (const file of srcFiles) {
      const content = await fs.readFile(file, 'utf-8')
      const matches = content.match(/^export\s+(async\s+)?function/gm)
      const jsDocMatches = content.match(/\/\*\*[\s\S]*?\*\/\s*export\s+(async\s+)?function/gm)
      undocumentedFunctions += Math.max(0, (matches?.length || 0) - (jsDocMatches?.length || 0))
    }

    return {
      missingReadmeSections: missingSections,
      readmeOutdated: daysSinceUpdate > 90,
      daysSinceUpdate,
      undocumentedFunctions
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Documentation scan failed'
    return {
      missingReadmeSections: requiredSections,
      readmeOutdated: true,
      daysSinceUpdate: 999,
      undocumentedFunctions: 0,
      error: message
    }
  }
}

export async function runFullScan(
  repoPath: string,
  options: { onProgress?: (message: string, step: number, total: number) => void; skipConsoleUpload?: boolean } = {}
): Promise<FullScanResult> {
  const startTime = Date.now()
  const configPath = path.join(repoPath, '.bridge.json')
  let config = await loadBridgeConfig(repoPath)
  try {
    await fs.access(configPath)
  } catch {
    // First scan for this repository: generate and persist starter config.
    const generated = await generateDefaultConfig(repoPath)
    await writeBridgeConfig(repoPath, generated)
    config = generated
  }

  const featureFlags = config.scan.features
  const steps: string[] = []
  if (featureFlags.dependencies) steps.push('Analyzing dependencies')
  if (featureFlags.circularDeps) steps.push('Detecting circular dependencies')
  if (featureFlags.deadCode) steps.push('Detecting dead code')
  if (featureFlags.bundleSize) steps.push('Analyzing bundle size')
  if (featureFlags.testCoverage) steps.push('Running test coverage')
  if (featureFlags.documentation) steps.push('Checking documentation')
  if (featureFlags.security) steps.push('Scanning security code patterns')
  if (featureFlags.fileAnalysis) steps.push('Collecting file architecture signals')
  if (featureFlags.codeSmells) steps.push('Analyzing code health metrics')
  if (steps.length === 0) {
    steps.push('No enabled scan features; returning baseline report')
  }

  let stepIndex = 0
  const progress = (message: string) => {
    stepIndex += 1
    options.onProgress?.(message, stepIndex, steps.length)
  }

  let dependencies: DependencyReport = {
    outdated: [],
    vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
    installedPackages: []
  }
  if (featureFlags.dependencies) {
    progress('Analyzing dependencies')
    dependencies = await analyzeDependencies(repoPath)
  }

  let circularDependencies: CircularDependencyReport = { count: 0, dependencies: [] }
  if (featureFlags.circularDeps) {
    progress('Detecting circular dependencies')
    circularDependencies = await detectCircularDependencies(repoPath)
  }

  let deadCode: DeadCodeReport = { deadFiles: [], unusedExports: [], totalDeadCodeCount: 0 }
  if (featureFlags.deadCode) {
    progress('Detecting dead code')
    deadCode = await detectDeadCode(repoPath)
  }

  let bundleSize: BundleAnalysisReport = { totalSize: 0, totalSizeFormatted: formatSize(0), largestModules: [] }
  if (featureFlags.bundleSize) {
    progress('Analyzing bundle size')
    bundleSize = await analyzeBundleSize(repoPath)
  }

  let testCoverage: TestCoverageReport = { coveragePercentage: null, uncoveredCriticalFiles: [] }
  if (featureFlags.testCoverage) {
    progress('Running test coverage')
    testCoverage = await analyzeTestCoverage(repoPath)
  }

  let documentation: DocumentationDebtReport = {
    missingReadmeSections: [],
    readmeOutdated: false,
    daysSinceUpdate: 0,
    undocumentedFunctions: 0
  }
  if (featureFlags.documentation) {
    progress('Checking documentation')
    documentation = await detectDocumentationDebt(repoPath)
  }

  let securityPatterns: SecurityPatternFinding[] = []
  if (featureFlags.security) {
    progress('Scanning security code patterns')
    securityPatterns = await scanRepoForSecurityPatterns(repoPath, {
      exclude: config.scan.exclude,
      maxFindings: 300
    })
  }

  let oversizedFiles: OversizedComponent[] = []
  if (featureFlags.fileAnalysis) {
    progress('Collecting file architecture signals')
    oversizedFiles = await findOversizedComponents(repoPath, 150)
  }

  let codeHealth: CodeHealthMetrics = {
    todoCount: 0,
    consoleLogCount: 0,
    commentedOutBlockCount: 0,
    mixedTabsSpaces: false,
    inconsistentQuoteStyle: false,
    hasLinter: false,
    hasFormatter: false,
    packageScriptsCount: 0,
    hasGitignore: false
  }
  if (featureFlags.codeSmells) {
    progress('Analyzing code health metrics')
    codeHealth = await computeCodeHealthMetrics(repoPath)
  }

  const repositoryInsights = await collectRepositoryInsights(repoPath, config)
  repositoryInsights.testsPass = null
  repositoryInsights.oversizedFilesCount = oversizedFiles.length

  const history = getScanHistory(repoPath)
  const scanData: ScanData = {
    dependencies,
    vulnerabilities: dependencies.vulnerabilities,
    circularDependencies,
    deadCode,
    bundleSize,
    testCoverage,
    documentation,
    oversizedComponents: oversizedFiles,
    securityPatterns,
    codeHealth,
    repositoryInsights,
    previousScore: history.techDebtScore
  }

  const techDebtScore = await calculateTechDebtScore(repoPath, scanData, config)
  saveScanHistory(repoPath, {
    bundleSize: bundleSize.totalSize || history.bundleSize,
    techDebtScore: techDebtScore.total
  })

  let repositoryUrl: string | null | undefined = undefined
  try {
    const repoInfo = await getRepoInfo(repoPath)
    repositoryUrl = repoInfo.remote
  } catch {}

  const result: FullScanResult = {
    scanDate: new Date().toISOString(),
    repository: repoPath,
    repositoryUrl,
    config,
    dependencies,
    circularDependencies,
    deadCode,
    bundleSize,
    testCoverage,
    documentation,
    securityPatterns,
    oversizedFiles,
    codeHealth,
    techDebtScore,
    durationMs: Date.now() - startTime
  }

  const scanReport = await generateScanReport(repoPath, config, result, techDebtScore, {
    patternFindings: securityPatterns,
    oversizedFiles
  })
  result.scanReport = scanReport
  result.reportPaths = await writeScanReportArtifacts(repoPath, scanReport)

  if (!options.skipConsoleUpload) {
    const settings = getBridgeConsoleSettings()
    if (settings.autoUpload && settings.consoleUrl && settings.apiToken && settings.githubUsername) {
      result.consoleUpload = await sendScanToConsole(result, settings)
    }
  }

  try {
    const gitignoreRaw = await fs.readFile(path.join(repoPath, '.gitignore'), 'utf-8')
    if (!gitignoreRaw.split(/\r?\n/).some(line => line.trim() === '.bridge/' || line.trim() === '.bridge')) {
      console.log(`[Bridge] Consider adding '.bridge/' to ${repoPath}/.gitignore`) // eslint-disable-line no-console
    }
  } catch {
    console.log(`[Bridge] Consider adding '.bridge/' to ${repoPath}/.gitignore`) // eslint-disable-line no-console
  }

  return result
}

export async function loadRepositoryBridgeConfig(repoPath: string): Promise<BridgeConfig> {
  return loadBridgeConfig(repoPath)
}

export async function generateRepositoryBridgeConfig(repoPath: string): Promise<BridgeConfig> {
  const config = await generateDefaultConfig(repoPath)
  await writeBridgeConfig(repoPath, config)
  return config
}

export async function saveRepositoryBridgeConfig(repoPath: string, config: BridgeConfig): Promise<BridgeConfig> {
  await writeBridgeConfig(repoPath, config)
  return loadBridgeConfig(repoPath)
}

export async function getLatestTechDebtScore(repoPath: string): Promise<TechDebtScore> {
  const scorePath = path.join(repoPath, '.bridge', 'latest-score.json')
  try {
    const raw = await fs.readFile(scorePath, 'utf-8')
    const parsed = JSON.parse(raw)
    if (typeof parsed?.total === 'number' && parsed?.dimensions) {
      return parsed as TechDebtScore
    }
  } catch {
    // Fallback to fresh scan below.
  }

  const scan = await runFullScan(repoPath, { skipConsoleUpload: true })
  return scan.techDebtScore
}

export async function deleteDeadFile(repoPath: string, relativePath: string): Promise<boolean> {
  const target = path.resolve(repoPath, relativePath)
  const root = path.resolve(repoPath) + path.sep
  if (!target.startsWith(root)) {
    throw new Error('Invalid file path')
  }
  await fs.unlink(target)
  return true
}

export async function cleanupDeadCode(
  repoPath: string,
  deadFiles: string[],
  unusedExports: DeadCodeExport[],
  options: { createPr?: boolean } = {}
): Promise<{ success: boolean; deletedFiles: string[]; skippedFiles: string[]; prUrl?: string; error?: string }> {
  const deletedFiles: string[] = []
  const skippedFiles: string[] = []
  const branchName = `bridge-remove-dead-code-${Date.now()}`
  let originalBranch = ''
  let branchCreated = false

  try {
    await ensureSafeBranch(repoPath, branchName)
    const repoInfo = await getRepoInfo(repoPath)
    originalBranch = repoInfo.branch
    await createBranch(repoPath, branchName)
    branchCreated = true

    for (const file of deadFiles) {
      try {
        await deleteDeadFile(repoPath, file)
        deletedFiles.push(file)
      } catch {
        skippedFiles.push(file)
      }
    }

    if (deletedFiles.length === 0) {
      throw new Error('No dead files were deleted.')
    }

    await commitChanges(repoPath, `chore: remove ${deletedFiles.length} dead code files (Bridge auto-cleanup)`, deletedFiles)

    let prUrl: string | undefined
    if (options.createPr !== false) {
      await pushBranch(repoPath, branchName)
      const exportLines = unusedExports.map(exp => `- ${exp.exportName} (${exp.file})`)
      const prBody = [
        '## Summary',
        `Removed ${deletedFiles.length} unused files via Bridge auto-cleanup.`,
        '',
        '### Files removed',
        ...deletedFiles.map(file => `- ${file}`),
        '',
        '### Unused exports (manual follow-up)',
        exportLines.length ? exportLines : ['- None detected']
      ].join('\n')
      prUrl = await createPullRequest(
        repoPath,
        'Remove dead code (Bridge auto-cleanup)',
        prBody
      )
    }

    return { success: true, deletedFiles, skippedFiles, prUrl }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Dead code cleanup failed'
    if (branchCreated && originalBranch) {
      await abortChanges(repoPath, originalBranch)
      await deleteBranch(repoPath, branchName)
    }
    return { success: false, deletedFiles, skippedFiles, error: message }
  }
}
