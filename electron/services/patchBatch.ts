import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import * as semver from 'semver'
import {
  updatePythonPackages,
  updateRubyPackages,
  updateElixirPackages,
  getCleanInstallCommand,
  getTestCommand,
  getLintCommand,
  getFilesToCommit,
  Language,
  OutdatedPackage
} from './languages'
import {
  commitChanges,
  pushBranch,
  createPullRequest,
  getGitHubCliStatus,
  runTests,
  runLint,
} from './git'

const execAsync = promisify(exec)
const DEFAULT_TEST_TIMEOUT_MS = 300000
const DEFAULT_MAX_BUFFER = 20 * 1024 * 1024

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
  error?: string
  testsPassed?: boolean
  testOutput?: string
}

export interface PatchBatchHandlers {
  onProgress?: (message: string, step: number, total: number) => void
  onLog?: (message: string) => void
  onWarning?: (warning: { message: string; output: string }) => void
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

export interface SecurityPatchResult {
  success: boolean
  updatedPackages: string[]
  failedPackages: string[]
  prUrl?: string | null
  error?: string
  testsPassed?: boolean
}

export interface SecurityPatchHandlers {
  onProgress?: (message: string, step: number, total: number) => void
  onLog?: (message: string) => void
}

function formatError(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }
  return fallback
}

function splitOutputLines(output: string): string[] {
  return output
    .split(/\r?\n/)
    .map(line => line.trimEnd())
    .filter(line => line.length > 0)
}

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function getPackageManagerEnv(repoPath: string): Promise<NodeJS.ProcessEnv> {
  const env: NodeJS.ProcessEnv = { ...process.env, INIT_CWD: repoPath, PWD: repoPath }
  const localNpmrc = path.join(repoPath, '.npmrc')
  if (await fileExists(localNpmrc)) {
    env.NPM_CONFIG_USERCONFIG = localNpmrc
    env.npm_config_userconfig = localNpmrc
  }
  return env
}

async function runCommand(
  command: string,
  cwd: string,
  options: { timeout?: number; maxBuffer?: number } = {}
) {
  const env = await getPackageManagerEnv(cwd)
  return execAsync(command, {
    cwd,
    env,
    timeout: options.timeout ?? DEFAULT_TEST_TIMEOUT_MS,
    maxBuffer: options.maxBuffer ?? DEFAULT_MAX_BUFFER
  })
}

type PackageManager = 'npm' | 'yarn' | 'pnpm'
type ValidationStage = 'test' | 'lint' | 'build'

interface ValidationStep {
  command: string
  relativeCwd: string
  stage: ValidationStage
  label: string
}

async function detectNodePackageManager(repoPath: string): Promise<PackageManager> {
  if (await fileExists(path.join(repoPath, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }
  if (await fileExists(path.join(repoPath, 'yarn.lock'))) {
    return 'yarn'
  }
  return 'npm'
}

function isMissingCommandOutput(output: string): boolean {
  return (
    /command not found/i.test(output) ||
    /is not recognized as an internal or external command/i.test(output) ||
    /missing script/i.test(output) ||
    /npm ERR! Missing script/i.test(output) ||
    /ERR_PNPM_NO_SCRIPT/i.test(output) ||
    /Couldn't find a script named/i.test(output)
  )
}

function getScriptCommand(packageManager: PackageManager, scriptName: ValidationStage): string {
  if (packageManager === 'yarn') {
    return scriptName === 'test' ? 'yarn test' : `yarn ${scriptName}`
  }
  if (packageManager === 'pnpm') {
    return scriptName === 'test' ? 'pnpm test' : `pnpm run ${scriptName}`
  }
  return scriptName === 'test' ? 'npm test' : `npm run ${scriptName}`
}

function normalizePathForMatch(value: string): string {
  return value.replace(/\\/g, '/').replace(/\/+$/, '')
}

function globToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '__DOUBLE_STAR__')
    .replace(/\*/g, '[^/]+')
    .replace(/__DOUBLE_STAR__/g, '.*')
  return new RegExp(`^${escaped}$`)
}

async function collectPackageJsonDirectories(
  repoPath: string,
  maxDepth = 6
): Promise<string[]> {
  const results: string[] = []
  const skipDirs = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', 'out'])

  const walk = async (absoluteDir: string, relativeDir: string, depth: number): Promise<void> => {
    if (depth > maxDepth) return

    const packageJsonPath = path.join(absoluteDir, 'package.json')
    if (relativeDir !== '.' && await fileExists(packageJsonPath)) {
      results.push(relativeDir)
    }

    if (depth === maxDepth) return

    let entries: import('fs').Dirent[]
    try {
      entries = await fs.readdir(absoluteDir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      if (skipDirs.has(entry.name)) continue
      const nextAbsolute = path.join(absoluteDir, entry.name)
      const nextRelative = relativeDir === '.' ? entry.name : path.join(relativeDir, entry.name)
      await walk(nextAbsolute, normalizePathForMatch(nextRelative), depth + 1)
    }
  }

  await walk(repoPath, '.', 0)
  return results
}

async function getWorkspacePatterns(repoPath: string, packageJson: any): Promise<string[]> {
  const patterns = new Set<string>()
  const rawWorkspaces = packageJson?.workspaces

  if (Array.isArray(rawWorkspaces)) {
    rawWorkspaces.forEach(value => {
      if (typeof value === 'string' && value.trim()) {
        patterns.add(normalizePathForMatch(value.trim()))
      }
    })
  } else if (rawWorkspaces && Array.isArray(rawWorkspaces.packages)) {
    rawWorkspaces.packages.forEach((value: unknown) => {
      if (typeof value === 'string' && value.trim()) {
        patterns.add(normalizePathForMatch(value.trim()))
      }
    })
  }

  const pnpmWorkspacePath = path.join(repoPath, 'pnpm-workspace.yaml')
  if (await fileExists(pnpmWorkspacePath)) {
    try {
      const yaml = await fs.readFile(pnpmWorkspacePath, 'utf-8')
      for (const line of yaml.split(/\r?\n/)) {
        const match = line.match(/^\s*-\s*['"]?([^'"]+)['"]?\s*$/)
        if (match?.[1]) {
          patterns.add(normalizePathForMatch(match[1]))
        }
      }
    } catch {
      // Ignore malformed workspace yaml; fallback to package.json workspaces.
    }
  }

  return Array.from(patterns)
}

async function resolveWorkspaceValidationSteps(
  repoPath: string,
  packageManager: PackageManager,
  workspacePatterns: string[],
  rootHasStage: Record<ValidationStage, boolean>
): Promise<ValidationStep[]> {
  if (workspacePatterns.length === 0) {
    return []
  }

  const patternMatchers = workspacePatterns.map(pattern => globToRegExp(pattern))
  const allPackageDirs = await collectPackageJsonDirectories(repoPath)
  const matchedPackageDirs = allPackageDirs
    .map(normalizePathForMatch)
    .filter(relativeDir => patternMatchers.some(pattern => pattern.test(relativeDir)))

  const stages: ValidationStage[] = ['test', 'lint', 'build']
  const byStage: Record<ValidationStage, ValidationStep[]> = {
    test: [],
    lint: [],
    build: []
  }
  const seen = new Set<string>()

  for (const relativeDir of matchedPackageDirs) {
    const packageJsonPath = path.join(repoPath, relativeDir, 'package.json')
    let workspaceJson: any
    try {
      workspaceJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    } catch {
      continue
    }
    const scripts = workspaceJson?.scripts || {}

    for (const stage of stages) {
      if (rootHasStage[stage]) {
        continue
      }
      const hasScript = typeof scripts[stage] === 'string' && scripts[stage].trim().length > 0
      if (!hasScript) {
        continue
      }
      const command = getScriptCommand(packageManager, stage)
      const step: ValidationStep = {
        command,
        relativeCwd: relativeDir,
        stage,
        label: `${relativeDir} (${stage})`
      }
      const dedupeKey = `${step.relativeCwd}::${step.command}`
      if (seen.has(dedupeKey)) {
        continue
      }
      seen.add(dedupeKey)
      byStage[stage].push(step)
    }
  }

  return [...byStage.test, ...byStage.lint, ...byStage.build]
}

async function resolveJavascriptValidationCommands(
  repoPath: string,
  overrideCommand?: string
): Promise<ValidationStep[]> {
  if (overrideCommand?.trim()) {
    return [{
      command: overrideCommand.trim(),
      relativeCwd: '.',
      stage: 'test',
      label: 'custom'
    }]
  }

  const packageManager = await detectNodePackageManager(repoPath)
  const packageJsonPath = path.join(repoPath, 'package.json')
  if (!(await fileExists(packageJsonPath))) {
    return []
  }

  const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonRaw)
  const scripts = packageJson?.scripts || {}
  const hasScript = (name: string) => typeof scripts[name] === 'string' && scripts[name].trim().length > 0

  const stages: ValidationStage[] = ['test', 'lint', 'build']
  const rootHasStage: Record<ValidationStage, boolean> = {
    test: hasScript('test'),
    lint: hasScript('lint'),
    build: hasScript('build')
  }

  const rootSteps: ValidationStep[] = stages
    .filter(stage => rootHasStage[stage])
    .map(stage => ({
      command: getScriptCommand(packageManager, stage),
      relativeCwd: '.',
      stage,
      label: `root (${stage})`
    }))

  const workspacePatterns = await getWorkspacePatterns(repoPath, packageJson)
  const workspaceSteps = await resolveWorkspaceValidationSteps(
    repoPath,
    packageManager,
    workspacePatterns,
    rootHasStage
  )

  return [...rootSteps, ...workspaceSteps]
}

async function runValidationSteps(
  steps: ValidationStep[],
  repoRoot: string,
  onLog: (message: string) => void,
  onWarning: (warning: { message: string; output: string }) => void,
  options: { timeoutMs: number; stageLabel: string }
): Promise<{ success: boolean; output: string }> {
  const allOutput: string[] = []

  for (const step of steps) {
    const command = step.command
    const stepCwd = step.relativeCwd === '.'
      ? repoRoot
      : path.join(repoRoot, step.relativeCwd)
    onLog(`${step.relativeCwd === '.' ? '[root]' : `[${step.relativeCwd}]`} > ${command}`)
    try {
      const { stdout, stderr } = await runCommand(command, stepCwd, {
        timeout: options.timeoutMs,
        maxBuffer: DEFAULT_MAX_BUFFER
      })
      const output = `${stdout}${stderr}`.trim()
      if (output) {
        splitOutputLines(output).forEach(line => onLog(line))
        allOutput.push(output)
      }
    } catch (error: any) {
      const output = `${error?.stdout || ''}${error?.stderr || ''}`.trim() || String(error?.message || '')
      if (output) {
        splitOutputLines(output).forEach(line => onLog(line))
        allOutput.push(output)
      }

      if (isMissingCommandOutput(output)) {
        onWarning({
          message: `${options.stageLabel}: command not found, skipping '${command}' in ${step.relativeCwd}`,
          output
        })
        continue
      }

      return {
        success: false,
        output: allOutput.join('\n\n')
      }
    }
  }

  return {
    success: true,
    output: allOutput.join('\n\n')
  }
}

function sanitizeGitRef(value: string): string | null {
  const normalized = value.trim()
  if (!normalized) return null
  if (!/^[A-Za-z0-9._/-]+$/.test(normalized)) {
    return null
  }
  return normalized
}

async function gitRefExists(repoPath: string, ref: string): Promise<boolean> {
  const safeRef = sanitizeGitRef(ref)
  if (!safeRef) return false
  try {
    await execAsync(`git rev-parse --verify --quiet "${safeRef}"`, {
      cwd: repoPath,
      timeout: 30000
    })
    return true
  } catch {
    return false
  }
}

async function resolveBaseRef(
  repoPath: string,
  preferredBaseBranch?: string,
  onLog?: (message: string) => void
): Promise<string> {
  try {
    await execAsync('git fetch origin --prune', {
      cwd: repoPath,
      timeout: 120000,
      maxBuffer: DEFAULT_MAX_BUFFER
    })
  } catch (error) {
    onLog?.(`WARN: Unable to fetch origin before update. Falling back to local refs (${formatError(error, 'fetch failed')}).`)
  }

  const candidates: string[] = []
  const preferred = sanitizeGitRef(preferredBaseBranch || '')
  if (preferred) {
    candidates.push(`origin/${preferred}`, preferred)
  }

  try {
    const { stdout } = await execAsync('git symbolic-ref --short refs/remotes/origin/HEAD', {
      cwd: repoPath,
      timeout: 30000
    })
    const originHead = stdout.trim()
    if (originHead) {
      candidates.push(originHead)
      if (originHead.startsWith('origin/')) {
        candidates.push(originHead.slice('origin/'.length))
      }
    }
  } catch {}

  candidates.push('origin/main', 'origin/master', 'main', 'master')
  const uniqueCandidates = Array.from(new Set(candidates.map(candidate => candidate.trim()).filter(Boolean)))

  for (const candidate of uniqueCandidates) {
    if (await gitRefExists(repoPath, candidate)) {
      return candidate
    }
  }

  return 'HEAD'
}

async function createIsolatedWorkspace(
  repoPath: string,
  branchName: string,
  options: { baseBranch?: string; remoteFirst?: boolean; onLog?: (message: string) => void } = {}
): Promise<string> {
  const worktreeRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bridge-worktree-'))
  const useRemoteFirst = options.remoteFirst !== false
  const baseRef = useRemoteFirst
    ? await resolveBaseRef(repoPath, options.baseBranch, options.onLog)
    : 'HEAD'
  options.onLog?.(`Creating branch '${branchName}' from ${baseRef}.`)

  await execAsync(`git worktree add -b "${branchName}" "${worktreeRoot}" "${baseRef}"`, {
    cwd: repoPath,
    timeout: DEFAULT_TEST_TIMEOUT_MS,
    maxBuffer: DEFAULT_MAX_BUFFER
  })
  return worktreeRoot
}

async function cleanupIsolatedWorkspace(
  repoPath: string,
  worktreePath: string,
  branchName: string,
  options: { deleteBranch?: boolean } = {}
): Promise<void> {
  try {
    await execAsync(`git worktree remove --force "${worktreePath}"`, {
      cwd: repoPath,
      timeout: DEFAULT_TEST_TIMEOUT_MS
    })
  } catch {}

  if (options.deleteBranch) {
    try {
      await execAsync(`git branch -D ${branchName}`, {
        cwd: repoPath,
        timeout: 30000
      })
    } catch {}
  }
}

function normalizeBranchName(branchName: string): string {
  const normalized = branchName.trim().replace(/[^a-zA-Z0-9/_-]+/g, '-')
  if (!normalized) {
    return `bridge-update-${Date.now()}`
  }
  return normalized
}

function classifyUpdateType(current: string, latest: string): OutdatedPackage['updateType'] {
  const currentParsed = semver.parse(current)
  const latestParsed = semver.parse(latest)
  if (!currentParsed || !latestParsed) {
    return 'unknown'
  }
  if (latestParsed.major > currentParsed.major) {
    return 'major'
  }
  if (latestParsed.minor > currentParsed.minor) {
    return 'minor'
  }
  if (latestParsed.patch > currentParsed.patch) {
    return 'patch'
  }
  return 'unknown'
}

export async function getJsOutdatedPackages(repoPath: string): Promise<OutdatedPackage[]> {
  const packageJsonPath = path.join(repoPath, 'package.json')
  try {
    await fs.access(packageJsonPath)
  } catch {
    throw new Error('No package.json found - is this a Node.js project?')
  }
  try {
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageJsonContent)

    const devDeps = new Set(Object.keys(packageJson.devDependencies || {}))

    let outdatedJson = '{}'
    try {
      const { stdout } = await runCommand('npm outdated --json', repoPath, { timeout: 60000 })
      outdatedJson = stdout
    } catch (error: any) {
      outdatedJson = error.stdout || '{}'
    }

    const outdated = JSON.parse(outdatedJson || '{}')
    const packages: OutdatedPackage[] = []

    for (const [name, info] of Object.entries(outdated) as [string, any][]) {
      const current = info.current || '0.0.0'
      const wanted = info.wanted || current
      const latest = info.latest || wanted
      const updateType = classifyUpdateType(current, latest)

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
        isNonBreaking: updateType === 'patch' || updateType === 'minor',
        updateType,
        language: 'javascript'
      })
    }

    const order: Record<OutdatedPackage['updateType'], number> = {
      major: 0,
      minor: 1,
      patch: 2,
      unknown: 3
    }

    return packages.sort((a, b) => {
      if (order[a.updateType] !== order[b.updateType]) {
        return order[a.updateType] - order[b.updateType]
      }
      return a.name.localeCompare(b.name)
    })
  } catch (error) {
    const message = formatError(error, 'Failed to read package.json')
    throw new Error(message)
  }
}

async function updateJsPackages(
  repoPath: string,
  packages: string[],
  options: { updateStrategy?: 'wanted' | 'latest' } = {}
) {
  const updated: string[] = []
  const failed: string[] = []
  const updateStrategy = options.updateStrategy || 'wanted'

  const packageJsonPath = path.join(repoPath, 'package.json')
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)

  const outdated = await getJsOutdatedPackages(repoPath)
  const outdatedMap = new Map(outdated.map(p => [p.name, p]))

  for (const pkgName of packages) {
    const pkg = outdatedMap.get(pkgName)
    if (!pkg) {
      failed.push(pkgName)
      continue
    }
    const targetVersion = updateStrategy === 'latest' ? pkg.latest : pkg.wanted
    if (!targetVersion || targetVersion === pkg.current) {
      failed.push(pkgName)
      continue
    }

    if (packageJson.dependencies?.[pkgName]) {
      const currentVersion = packageJson.dependencies[pkgName]
      const prefix = currentVersion.match(/^[^0-9]*/)?.[0] || '^'
      packageJson.dependencies[pkgName] = `${prefix}${targetVersion}`
      updated.push(pkgName)
    } else if (packageJson.devDependencies?.[pkgName]) {
      const currentVersion = packageJson.devDependencies[pkgName]
      const prefix = currentVersion.match(/^[^0-9]*/)?.[0] || '^'
      packageJson.devDependencies[pkgName] = `${prefix}${targetVersion}`
      updated.push(pkgName)
    } else {
      failed.push(pkgName)
    }
  }

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

  return { updated, failed }
}

export async function runPatchBatchPipeline(
  config: PatchBatchConfig,
  handlers: PatchBatchHandlers = {}
): Promise<PatchBatchResult> {
  const {
    repoPath,
    branchName,
    packages,
    createPR,
    runTests: shouldRunTests,
    baseBranch,
    remoteFirst,
    updateStrategy,
    prTitle,
    prBody,
    testCommand,
    testTimeoutMs
  } = config

  const onProgress = handlers.onProgress || (() => {})
  const onLog = handlers.onLog || (() => {})
  const onWarning = handlers.onWarning || (() => {})
  const safeBranchName = normalizeBranchName(branchName)

  const totalSteps = 4 + (shouldRunTests ? 1 : 0) + (createPR ? 2 : 0)
  let currentStep = 0

  const primaryLang = packages[0]?.language || 'javascript'
  const resolvedTestCommand = shouldRunTests
    ? (testCommand?.trim() || getTestCommand(primaryLang))
    : null

  let workspacePath = repoPath
  let workspaceCreated = false
  let changesCommitted = false
  let deleteBranchOnCleanup = true

  const fail = async (message: string, extra?: Partial<PatchBatchResult>): Promise<PatchBatchResult> => {
    onLog(`✗ ${message}`)
    return {
      success: false,
      error: message,
      branchName: safeBranchName,
      ...extra
    }
  }

  if (!packages.length) {
    return fail('No packages selected for update.')
  }

  if (shouldRunTests && (!resolvedTestCommand || resolvedTestCommand.length === 0)) {
    return fail("No test script found - add one to package.json or uncheck 'Run tests'.")
  }

  if (createPR) {
    const ghStatus = await getGitHubCliStatus(repoPath)
    if (!ghStatus.installed || !ghStatus.authenticated) {
      return fail(ghStatus.message || 'GitHub CLI is required and must be authenticated before creating PRs.')
    }
  }

  try {
    await fs.access(path.join(repoPath, '.git'))
  } catch {
    return fail("Git not initialized - run 'git init' first.")
  }

  if (packages.some(pkg => pkg.language === 'javascript')) {
    try {
      await fs.access(path.join(repoPath, 'package.json'))
    } catch {
      return fail('No package.json found - is this a Node.js project?')
    }
  }

  try {
    onProgress('Preparing isolated update workspace...', ++currentStep, totalSteps)
    workspacePath = await createIsolatedWorkspace(repoPath, safeBranchName, {
      baseBranch,
      remoteFirst,
      onLog
    })
    workspaceCreated = true
    onLog(`Using isolated workspace: ${workspacePath}`)
    onLog('Local repository changes are left untouched.')

    if (packages.some(pkg => pkg.language === 'javascript')) {
      if (await fileExists(path.join(workspacePath, '.npmrc'))) {
        onLog('Using repository-local .npmrc for package operations.')
      } else {
        onWarning({
          message: 'No repository .npmrc found. Falling back to global npm config.',
          output: 'Create a local .npmrc if you need repository-scoped registry/auth settings.'
        })
      }
    }

    onProgress('Updating packages...', ++currentStep, totalSteps)
    onLog('[1/3] Updating packages...')

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
          result = await updateJsPackages(workspacePath, pkgNames, { updateStrategy })
          break
        case 'python':
          result = await updatePythonPackages(workspacePath, pkgNames)
          break
        case 'ruby':
          result = await updateRubyPackages(workspacePath, pkgNames)
          break
        case 'elixir':
          result = await updateElixirPackages(workspacePath, pkgNames)
          break
        default:
          result = { updated: [], failed: pkgNames }
      }

      allUpdated.push(...result.updated)
      allFailed.push(...result.failed)
    }

    allUpdated.forEach(name => onLog(`✓ Updated ${name}`))
    allFailed.forEach(name => onLog(`✗ Skipped ${name}`))

    if (allUpdated.length === 0) {
      return fail('No packages were updated. Check selections and try again.')
    }

    onProgress('Running clean install...', ++currentStep, totalSteps)
    const cleanCmd = getCleanInstallCommand(primaryLang)
    if (cleanCmd) {
      try {
        const { stdout, stderr } = await runCommand(cleanCmd, workspacePath, {
          timeout: 300000,
          maxBuffer: 10 * 1024 * 1024
        })
        splitOutputLines(`${stdout}${stderr}`).forEach(line => onLog(line))
      } catch (error: any) {
        const output = `${error.stdout || ''}${error.stderr || ''}` || error.message
        splitOutputLines(output).forEach(line => onLog(line))
        return fail('Install failed. Please check your package manager output.')
      }
    }

    let testsPassed = true
    let testOutput = ''

    if (shouldRunTests && resolvedTestCommand) {
      onProgress('Running tests...', ++currentStep, totalSteps)
      onLog('[2/3] Running tests...')
      onLog(`> ${resolvedTestCommand}`)

      const testResult = await runTests(workspacePath, resolvedTestCommand, {
        timeoutMs: testTimeoutMs ?? DEFAULT_TEST_TIMEOUT_MS
      })

      testOutput = testResult.output
      splitOutputLines(testResult.output).forEach(line => onLog(line))
      testsPassed = testResult.success

      if (!testsPassed) {
        return fail('Tests failed - no PR created.', {
          testsPassed: false,
          testOutput
        })
      }

      onLog('✓ All tests passed')

      const lintCommand = getLintCommand(primaryLang)
      if (lintCommand) {
        const lintResult = await runLint(workspacePath, lintCommand)
        if (!lintResult.success) {
          onWarning({ message: 'Linter found issues', output: lintResult.output })
        }
      }
    } else if (!shouldRunTests) {
      onLog('[2/3] Tests skipped (disabled)')
    }

    onProgress('Committing changes...', ++currentStep, totalSteps)
    const files = getFilesToCommit(primaryLang)
    await commitChanges(
      workspacePath,
      `chore(deps): update ${allUpdated.length} selected dependencies\n\nUpdated packages:\n${allUpdated.map(p => `- ${p}`).join('\n')}`,
      files
    )
    changesCommitted = true
    deleteBranchOnCleanup = false

    if (!createPR) {
      onLog('[3/3] Committing updates...')
      onLog(`✓ Updates committed to branch '${safeBranchName}'`)
      return {
        success: true,
        updatedPackages: allUpdated,
        failedPackages: allFailed,
        branchName: safeBranchName,
        testsPassed: shouldRunTests ? testsPassed : undefined,
        testOutput
      }
    }

    onProgress('Pushing branch...', ++currentStep, totalSteps)
    try {
      await pushBranch(workspacePath, safeBranchName)
    } catch (error) {
      const message = formatError(error, 'Push failed. Please check your git remote configuration.')
      onLog(`✗ ${message}`)
      return {
        success: false,
        updatedPackages: allUpdated,
        failedPackages: allFailed,
        branchName: safeBranchName,
        error: message,
        testsPassed: shouldRunTests ? testsPassed : undefined,
        testOutput
      }
    }

    onProgress('Creating pull request...', ++currentStep, totalSteps)
    onLog('[3/3] Creating PR...')

    let prUrl: string | null = null
    try {
      prUrl = await createPullRequest(
        workspacePath,
        prTitle || `chore(deps): update ${allUpdated.length} packages`,
        prBody || `## Summary\nAutomated dependency updates via Bridge.\n\n### Updated packages\n${allUpdated.map(p => `- ${p}`).join('\n')}\n\n${shouldRunTests ? '### Checks\n- [x] Tests passed\n- [x] Lint checked' : ''}`
      )
    } catch (error) {
      const message = formatError(error, 'PR creation failed. Please open a PR manually.')
      onLog(`✗ ${message}`)
      return {
        success: false,
        updatedPackages: allUpdated,
        failedPackages: allFailed,
        branchName: safeBranchName,
        error: message,
        testsPassed: shouldRunTests ? testsPassed : undefined,
        testOutput
      }
    }

    onLog(`✓ PR created: ${prUrl}`)
    deleteBranchOnCleanup = true

    return {
      success: true,
      updatedPackages: allUpdated,
      failedPackages: allFailed,
      prUrl,
      branchName: safeBranchName,
      testsPassed: shouldRunTests ? testsPassed : undefined,
      testOutput
    }
  } catch (error) {
    return fail(formatError(error, 'Update failed. Please try again.'))
  } finally {
    if (workspaceCreated) {
      await cleanupIsolatedWorkspace(repoPath, workspacePath, safeBranchName, {
        deleteBranch: deleteBranchOnCleanup
      })
    }
  }
}

async function hasGitChanges(repoPath: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync('git status --porcelain', { cwd: repoPath, timeout: 30000 })
    return stdout.trim().length > 0
  } catch {
    return false
  }
}

export async function runNonBreakingUpdatePipeline(
  config: NonBreakingUpdateConfig,
  handlers: PatchBatchHandlers = {}
): Promise<PatchBatchResult> {
  const {
    repoPath,
    branchName,
    createPR,
    runTests: shouldRunTests,
    baseBranch,
    remoteFirst,
    selectedMajorPackages = [],
    testCommand,
    testTimeoutMs,
    prTitle,
    prBody
  } = config

  const onProgress = handlers.onProgress || (() => {})
  const onLog = handlers.onLog || (() => {})
  const onWarning = handlers.onWarning || (() => {})
  const safeBranchName = normalizeBranchName(branchName)

  const totalSteps = 4 + (shouldRunTests ? 2 : 0) + (selectedMajorPackages.length > 0 ? 1 : 0) + (createPR ? 2 : 0)
  let currentStep = 0
  let workspacePath = repoPath
  let workspaceCreated = false
  let deleteBranchOnCleanup = true
  const validationOutput: string[] = []
  const validationCommands = shouldRunTests
    ? await resolveJavascriptValidationCommands(repoPath, testCommand)
    : []

  const fail = async (message: string, extra?: Partial<PatchBatchResult>): Promise<PatchBatchResult> => {
    onLog(`✗ ${message}`)
    return {
      success: false,
      error: message,
      branchName: safeBranchName,
      ...extra
    }
  }

  try {
    await fs.access(path.join(repoPath, '.git'))
    await fs.access(path.join(repoPath, 'package.json'))
  } catch {
    return fail("Git and package.json are required for non-breaking updates.")
  }

  if (createPR) {
    const ghStatus = await getGitHubCliStatus(repoPath)
    if (!ghStatus.installed || !ghStatus.authenticated) {
      return fail(ghStatus.message || 'GitHub CLI is required and must be authenticated before creating PRs.')
    }
  }

  try {
    const beforeOutdated = await getJsOutdatedPackages(repoPath)
    const nonBreakingBefore = beforeOutdated.filter(pkg => pkg.isNonBreaking)
    if (nonBreakingBefore.length === 0 && selectedMajorPackages.length === 0) {
      return fail('No non-breaking updates available and no major packages selected.')
    }

    if (shouldRunTests) {
      if (validationCommands.length === 0) {
        onWarning({
          message: 'No validation scripts found (test/lint/build). Continuing without pre/post validation checks.',
          output: 'Define scripts in package.json to enable automated validation.'
        })
      } else {
        onProgress('Running pre-update validation...', ++currentStep, totalSteps)
        onLog('[1/5] Running baseline validation in current repo...')
        const baselineValidation = await runValidationSteps(
          validationCommands,
          repoPath,
          onLog,
          onWarning,
          { timeoutMs: testTimeoutMs ?? DEFAULT_TEST_TIMEOUT_MS, stageLabel: 'Pre-update validation' }
        )
        validationOutput.push(baselineValidation.output)
        if (!baselineValidation.success) {
          return fail('Pre-update validation failed. Update aborted before dependency changes.', {
            testsPassed: false,
            testOutput: baselineValidation.output
          })
        }
        onLog('✓ Baseline validation passed')
      }
    }

    onProgress('Preparing isolated update workspace...', ++currentStep, totalSteps)
    workspacePath = await createIsolatedWorkspace(repoPath, safeBranchName, {
      baseBranch,
      remoteFirst,
      onLog
    })
    workspaceCreated = true
    onLog(`Using isolated workspace: ${workspacePath}`)
    onLog('Local repository changes are left untouched.')

    if (await fileExists(path.join(workspacePath, '.npmrc'))) {
      onLog('Using repository-local .npmrc for npm commands.')
    } else {
      onWarning({
        message: 'No repository .npmrc found. Falling back to global npm config.',
        output: 'Create a local .npmrc if you need repository-scoped registry/auth settings.'
      })
    }

    onProgress('Running non-breaking update sequence...', ++currentStep, totalSteps)
    onLog('[2/5] Running update script:')
    onLog('rm -rf node_modules package-lock.json; npm install; npm update; rm -rf node_modules package-lock.json; npm install;')
    try {
      const { stdout, stderr } = await runCommand(
        'rm -rf node_modules package-lock.json; npm install; npm update; rm -rf node_modules package-lock.json; npm install;',
        workspacePath,
        {
          timeout: 15 * 60 * 1000,
          maxBuffer: 50 * 1024 * 1024
        }
      )
      splitOutputLines(`${stdout}${stderr}`).forEach(line => onLog(line))
    } catch (error: any) {
      const output = `${error.stdout || ''}${error.stderr || ''}` || error.message
      splitOutputLines(output).forEach(line => onLog(line))
      return fail('Non-breaking update script failed. Check npm output.')
    }

    const majorUpdated: string[] = []
    if (selectedMajorPackages.length > 0) {
      onProgress('Applying selected major updates...', ++currentStep, totalSteps)
      onLog('[3/5] Applying selected major updates...')
      for (const pkg of selectedMajorPackages) {
        try {
          onLog(`> npm install ${pkg}@latest`)
          const { stdout, stderr } = await runCommand(`npm install ${pkg}@latest`, workspacePath, {
            timeout: DEFAULT_TEST_TIMEOUT_MS,
            maxBuffer: DEFAULT_MAX_BUFFER
          })
          splitOutputLines(`${stdout}${stderr}`).forEach(line => onLog(line))
          majorUpdated.push(pkg)
        } catch (error: any) {
          const output = `${error?.stdout || ''}${error?.stderr || ''}`.trim() || String(error?.message || '')
          splitOutputLines(output).forEach(line => onLog(line))
          return fail(`Failed to apply selected major update: ${pkg}`, {
            testOutput: output
          })
        }
      }
    }

    const afterOutdated = await getJsOutdatedPackages(workspacePath)
    const remainingNonBreaking = new Set(afterOutdated.filter(pkg => pkg.isNonBreaking).map(pkg => pkg.name))
    const updatedPackages = nonBreakingBefore
      .map(pkg => pkg.name)
      .filter(name => !remainingNonBreaking.has(name))
    for (const pkg of majorUpdated) {
      if (!updatedPackages.includes(pkg)) {
        updatedPackages.push(pkg)
      }
    }

    onProgress('Evaluating changes...', ++currentStep, totalSteps)
    const changed = await hasGitChanges(workspacePath)
    if (!changed) {
      return fail('No dependency changes were produced by the update process.')
    }

    if (shouldRunTests && validationCommands.length > 0) {
      onProgress('Running post-update validation...', ++currentStep, totalSteps)
      onLog('[4/5] Running validation after dependency changes...')
      const postValidation = await runValidationSteps(
        validationCommands,
        workspacePath,
        onLog,
        onWarning,
        { timeoutMs: testTimeoutMs ?? DEFAULT_TEST_TIMEOUT_MS, stageLabel: 'Post-update validation' }
      )
      validationOutput.push(postValidation.output)
      if (!postValidation.success) {
        return fail('Post-update validation failed. No commit was created.', {
          testsPassed: false,
          testOutput: postValidation.output
        })
      }
      onLog('✓ Post-update validation passed')
    }

    onProgress('Committing changes...', ++currentStep, totalSteps)
    await commitChanges(
      workspacePath,
      `chore(deps): apply non-breaking dependency updates\n\nUpdated packages:\n${updatedPackages.map(p => `- ${p}`).join('\n') || '- lockfile/package graph changes'}`,
      getFilesToCommit('javascript')
    )
    deleteBranchOnCleanup = false

    if (!createPR) {
      onLog('[5/5] Committing updates locally...')
      onLog(`✓ Changes committed on '${safeBranchName}'`)
      onLog(`✓ Ready to push: git push -u origin ${safeBranchName}`)
      return {
        success: true,
        branchName: safeBranchName,
        updatedPackages,
        testsPassed: shouldRunTests ? true : undefined,
        testOutput: validationOutput.filter(Boolean).join('\n\n')
      }
    }

    onProgress('Pushing branch...', ++currentStep, totalSteps)
    await pushBranch(workspacePath, safeBranchName)

    onProgress('Creating pull request...', ++currentStep, totalSteps)
    const prUrl = await createPullRequest(
      workspacePath,
      prTitle || 'chore(deps): apply non-breaking dependency updates',
      prBody || [
        '## Summary',
        'Automated non-breaking dependency updates (patch + minor) via Bridge.',
        '',
        '### Updated packages',
        ...(updatedPackages.length ? updatedPackages.map(pkg => `- ${pkg}`) : ['- lockfile/package graph changes'])
      ].join('\n')
    )
    deleteBranchOnCleanup = true

    return {
      success: true,
      branchName: safeBranchName,
      prUrl,
      updatedPackages,
      testsPassed: shouldRunTests ? true : undefined,
      testOutput: validationOutput.filter(Boolean).join('\n\n')
    }
  } catch (error) {
    return fail(formatError(error, 'Non-breaking update failed.'))
  } finally {
    if (workspaceCreated) {
      await cleanupIsolatedWorkspace(repoPath, workspacePath, safeBranchName, {
        deleteBranch: deleteBranchOnCleanup
      })
    }
  }
}

interface AuditTarget {
  name: string
  severity: 'high' | 'critical'
  fixVersion?: string
}

async function getAuditTargets(repoPath: string): Promise<AuditTarget[]> {
  const targets: AuditTarget[] = []
  try {
    const { stdout } = await runCommand('npm audit --json', repoPath, {
      timeout: 120000,
      maxBuffer: 20 * 1024 * 1024
    })
    const payload = JSON.parse(stdout || '{}')

    if (payload.vulnerabilities) {
      for (const [name, data] of Object.entries(payload.vulnerabilities) as [string, any][]) {
        const severity = String(data.severity || '').toLowerCase()
        if (severity !== 'critical' && severity !== 'high') continue
        const fixAvailable = data.fixAvailable
        let fixVersion: string | undefined
        if (fixAvailable && typeof fixAvailable === 'object') {
          if (fixAvailable.isSemVerMajor) {
            continue
          }
          fixVersion = fixAvailable.version
        }
        targets.push({ name, severity: severity as 'high' | 'critical', fixVersion })
      }
    }

    if (payload.advisories) {
      for (const advisory of Object.values(payload.advisories) as any[]) {
        const severity = String(advisory.severity || '').toLowerCase()
        if (severity !== 'critical' && severity !== 'high') continue
        const name = advisory.module_name
        const fixVersion = advisory.fix_available && advisory.fix_available.name
          ? advisory.fix_available.version
          : advisory.fix_available && typeof advisory.fix_available === 'string'
            ? advisory.fix_available
            : undefined
        targets.push({ name, severity: severity as 'high' | 'critical', fixVersion })
      }
    }
  } catch (error) {
    console.error('npm audit failed:', error)
  }

  return targets
}

async function discardWorkingTree(repoPath: string): Promise<void> {
  try {
    await execAsync('git reset --hard HEAD', { cwd: repoPath })
    await execAsync('git clean -fd', { cwd: repoPath })
  } catch {}
}

async function createIssue(repoPath: string, title: string, body: string): Promise<void> {
  const safeTitle = title.replace(/\"/g, '\\\"')
  const safeBody = body.replace(/\"/g, '\\\"')
  try {
    await execAsync(`gh issue create --title \"${safeTitle}\" --body \"${safeBody}\"`, { cwd: repoPath })
  } catch {}
}

export async function runSecurityPatchPipeline(
  config: SecurityPatchConfig,
  handlers: SecurityPatchHandlers = {}
): Promise<SecurityPatchResult> {
  const { repoPath, branchName, createPR, runTests: shouldRunTests, baseBranch, remoteFirst, testCommand } = config
  const safeBranchName = normalizeBranchName(branchName)
  const onProgress = handlers.onProgress || (() => {})
  const onLog = handlers.onLog || (() => {})
  const updatedPackages: string[] = []
  const failedPackages: string[] = []
  let workspacePath = repoPath
  let workspaceCreated = false
  let deleteBranchOnCleanup = true

  try {
    await fs.access(path.join(repoPath, '.git'))
  } catch {
    return { success: false, updatedPackages: [], failedPackages: [], error: 'Git not initialized.' }
  }

  try {
    workspacePath = await createIsolatedWorkspace(repoPath, safeBranchName, {
      baseBranch,
      remoteFirst,
      onLog
    })
    workspaceCreated = true
    onLog(`Using isolated workspace: ${workspacePath}`)

    const targets = await getAuditTargets(workspacePath)
    const uniqueTargets = Array.from(
      new Map(targets.filter(target => target.fixVersion).map(target => [target.name, target])).values()
    )

    if (uniqueTargets.length === 0) {
      return { success: false, updatedPackages: [], failedPackages: [], error: 'No critical/high vulnerabilities with safe fixes found.' }
    }

    const totalSteps = uniqueTargets.length
    let step = 0
    let testsPassed = true

    for (const target of uniqueTargets) {
      step += 1
      onProgress(`Patching ${target.name} (${target.severity})`, step, totalSteps)
      onLog(`Updating ${target.name} to ${target.fixVersion}`)

      try {
        await runCommand(`npm install ${target.name}@${target.fixVersion}`, workspacePath, {
          timeout: DEFAULT_TEST_TIMEOUT_MS,
          maxBuffer: 20 * 1024 * 1024
        })

        if (shouldRunTests) {
          const cmd = testCommand?.trim() || getTestCommand('javascript')
          if (!cmd) {
            throw new Error('No test command found')
          }
          const result = await runTests(workspacePath, cmd, { timeoutMs: DEFAULT_TEST_TIMEOUT_MS })
          if (!result.success) {
            testsPassed = false
            failedPackages.push(target.name)
            await createIssue(
              workspacePath,
              `Manual fix needed: ${target.name} vulnerability`,
              `Bridge attempted to patch ${target.name} but tests failed.\\n\\nTest output:\\n${result.output}`
            )
            await discardWorkingTree(workspacePath)
            continue
          }
        }

        await commitChanges(workspacePath, `chore(security): patch ${target.name}`)
        deleteBranchOnCleanup = false
        updatedPackages.push(target.name)
      } catch {
        failedPackages.push(target.name)
        await discardWorkingTree(workspacePath)
      }
    }

    let prUrl: string | null | undefined = null
    if (createPR && updatedPackages.length > 0) {
      await pushBranch(workspacePath, safeBranchName)
      prUrl = await createPullRequest(
        workspacePath,
        `chore(security): patch ${updatedPackages.length} vulnerable packages`,
        `## Summary\\nBridge patched ${updatedPackages.length} vulnerable packages.\\n\\n### Updated packages\\n${updatedPackages.map(pkg => `- ${pkg}`).join('\\n')}`
      )
      deleteBranchOnCleanup = true
    }

    if (updatedPackages.length === 0) {
      return {
        success: false,
        updatedPackages,
        failedPackages,
        error: 'No packages were successfully patched.',
        testsPassed
      }
    }

    return {
      success: failedPackages.length === 0,
      updatedPackages,
      failedPackages,
      prUrl,
      testsPassed
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Security patch failed'
    return { success: false, updatedPackages, failedPackages, error: message }
  } finally {
    if (workspaceCreated) {
      await cleanupIsolatedWorkspace(repoPath, workspacePath, safeBranchName, {
        deleteBranch: deleteBranchOnCleanup
      })
    }
  }
}
