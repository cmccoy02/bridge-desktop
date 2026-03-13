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
import { loadBridgeConfig } from './bridgeConfig'
import { evaluateGates } from './gateEvaluator'
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
  pushChanges?: boolean
  baseBranch?: string
  remoteFirst?: boolean
  pinnedPackages?: Record<string, string>
  selectedReviewPackages?: string[]
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

function extractFailureSummary(output: string): string | null {
  const lines = splitOutputLines(output)
  if (lines.length === 0) {
    return null
  }

  const prioritizedPatterns = [
    /(^|\s)FAIL(\s|$)/i,
    /(^|\s)error[:\s]/i,
    /(^|\s)failed(\s|$)/i,
    /timed out/i
  ]

  for (const pattern of prioritizedPatterns) {
    const match = lines.find(line => pattern.test(line))
    if (match) {
      return match.slice(0, 220)
    }
  }

  return lines[lines.length - 1].slice(0, 220)
}

function detectValidationEnvironmentIssue(output: string): string | null {
  const checks: Array<{ pattern: RegExp; reason: string }> = [
    {
      pattern: /spawn pnpm ENOENT/i,
      reason: 'test script requires pnpm but pnpm is not installed or not available in PATH'
    },
    {
      pattern: /spawn yarn ENOENT/i,
      reason: 'test script requires yarn but yarn is not installed or not available in PATH'
    },
    {
      pattern: /spawn npm ENOENT/i,
      reason: 'test script requires npm but npm is not available in PATH'
    },
    {
      pattern: /command not found:\s*pnpm/i,
      reason: 'pnpm is not installed or not available in PATH'
    },
    {
      pattern: /command not found:\s*yarn/i,
      reason: 'yarn is not installed or not available in PATH'
    }
  ]

  for (const check of checks) {
    if (check.pattern.test(output)) {
      return check.reason
    }
  }

  return null
}

function extractFailureFingerprints(output: string): Set<string> {
  const lines = splitOutputLines(output)
  const fingerprints = new Set<string>()

  const normalize = (line: string) => line
    .replace(/\d+ms\b/g, '<ms>')
    .replace(/\s+/g, ' ')
    .trim()

  for (const line of lines) {
    if (/^\s*(FAIL|×)\s+/i.test(line)) {
      fingerprints.add(normalize(line))
      continue
    }
    if (/^Error:\s+/i.test(line)) {
      fingerprints.add(normalize(line))
      continue
    }
    if (/^\s*✗\s+/i.test(line)) {
      fingerprints.add(normalize(line))
    }
  }

  return fingerprints
}

function countFailedTests(output: string): number | null {
  const match = output.match(/Tests?\s+(\d+)\s+failed/i)
  if (!match) return null
  return Number.parseInt(match[1], 10)
}

function isValidationRegression(
  baselineOutput: string,
  postOutput: string
): { regressed: boolean; reason?: string } {
  const baselineFailedTests = countFailedTests(baselineOutput)
  const postFailedTests = countFailedTests(postOutput)

  if (baselineFailedTests !== null && postFailedTests !== null) {
    if (postFailedTests > baselineFailedTests) {
      return {
        regressed: true,
        reason: `failed test count increased (${baselineFailedTests} -> ${postFailedTests})`
      }
    }
  }

  const baselineFingerprints = extractFailureFingerprints(baselineOutput)
  const postFingerprints = extractFailureFingerprints(postOutput)
  if (postFingerprints.size === 0) {
    return { regressed: false }
  }

  if (baselineFingerprints.size === 0) {
    return { regressed: true, reason: 'post-update validation introduced new failures' }
  }

  for (const line of postFingerprints) {
    if (!baselineFingerprints.has(line)) {
      return { regressed: true, reason: `new failure detected: ${line}` }
    }
  }

  return { regressed: false }
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
type TestFramework = 'vitest' | 'jest' | 'mocha' | 'ava' | 'playwright'

interface ValidationStep {
  command: string
  relativeCwd: string
  stage: ValidationStage
  label: string
}

function normalizeConfiguredTimeoutMs(rawTimeout: unknown): number | null {
  if (typeof rawTimeout !== 'number' || !Number.isFinite(rawTimeout) || rawTimeout <= 0) {
    return null
  }

  // `.bridge.json` uses human-friendly values (default: 300), which represent seconds.
  // If the value is very small, interpret it as seconds; otherwise treat as milliseconds.
  if (rawTimeout <= 600) {
    return Math.round(rawTimeout * 1000)
  }

  return Math.round(rawTimeout)
}

async function detectNodePackageManager(repoPath: string): Promise<PackageManager> {
  const declared = await readDeclaredPackageManager(repoPath)
  if (declared) {
    return declared
  }

  const hasNpmLock = await fileExists(path.join(repoPath, 'package-lock.json'))
  const hasPnpmLock = await fileExists(path.join(repoPath, 'pnpm-lock.yaml'))
  const hasYarnLock = await fileExists(path.join(repoPath, 'yarn.lock'))

  if (hasPnpmLock) {
    return 'pnpm'
  }
  if (hasYarnLock) {
    return 'yarn'
  }
  if (hasNpmLock) {
    return 'npm'
  }

  return 'npm'
}

async function readDeclaredPackageManager(repoPath: string): Promise<PackageManager | null> {
  const packageJsonPath = path.join(repoPath, 'package.json')
  if (!(await fileExists(packageJsonPath))) {
    return null
  }
  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    const value = String(packageJson?.packageManager || '').trim().toLowerCase()
    if (!value) return null
    if (value.startsWith('pnpm@')) return 'pnpm'
    if (value.startsWith('yarn@')) return 'yarn'
    if (value.startsWith('npm@')) return 'npm'
    return null
  } catch {
    return null
  }
}

async function isCommandAvailable(command: string, cwd: string): Promise<boolean> {
  try {
    await execAsync(`command -v ${command}`, {
      cwd,
      timeout: 15000
    })
    return true
  } catch {
    return false
  }
}

async function resolvePackageManagerCommand(repoPath: string, manager: PackageManager): Promise<string> {
  if (manager === 'npm') {
    return 'npm'
  }

  if (await isCommandAvailable(manager, repoPath)) {
    return manager
  }

  if (await isCommandAvailable('corepack', repoPath)) {
    return `corepack ${manager}`
  }

  throw new Error(
    `Repository uses ${manager}, but '${manager}' is not installed and 'corepack' is unavailable. Install ${manager} (or enable corepack) and retry.`
  )
}

async function normalizeConfiguredValidationCommand(repoPath: string, command: string | undefined): Promise<string | undefined> {
  const trimmed = command?.trim()
  if (!trimmed) return undefined

  const tokens = trimmed.split(/\s+/)
  const runner = tokens[0]
  if (runner !== 'pnpm' && runner !== 'yarn') {
    return trimmed
  }

  const available = await isCommandAvailable(runner, repoPath)
  if (available) {
    return trimmed
  }

  const hasCorepack = await isCommandAvailable('corepack', repoPath)
  if (hasCorepack) {
    const rest = tokens.slice(1).join(' ')
    return `corepack ${runner}${rest ? ` ${rest}` : ''}`.trim()
  }

  const subcommand = tokens[1] || ''
  const rest = tokens.slice(2).join(' ')

  if (subcommand === 'run') {
    return `npm run ${rest}`.trim()
  }
  if (subcommand === 'test') {
    return `npm test${rest ? ` ${rest}` : ''}`.trim()
  }
  if (!subcommand) {
    return 'npm test'
  }
  return `npm run ${[subcommand, ...tokens.slice(2)].join(' ')}`.trim()
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

function getScriptCommand(packageManager: PackageManager, managerCommand: string, scriptName: string): string {
  if (packageManager === 'yarn') {
    return scriptName === 'test' ? `${managerCommand} test` : `${managerCommand} ${scriptName}`
  }
  if (packageManager === 'pnpm') {
    return scriptName === 'test' ? `${managerCommand} test` : `${managerCommand} run ${scriptName}`
  }
  return scriptName === 'test' ? `${managerCommand} test` : `${managerCommand} run ${scriptName}`
}

function getNonBreakingUpdateCommand(packageManager: PackageManager, managerCommand: string): string {
  if (packageManager === 'pnpm') {
    return `${managerCommand} update`
  }
  if (packageManager === 'yarn') {
    return `${managerCommand} upgrade`
  }
  return `${managerCommand} update`
}

function getManagerInstallCommand(packageManager: PackageManager, managerCommand: string): string {
  if (packageManager === 'pnpm') return `${managerCommand} install`
  if (packageManager === 'yarn') return `${managerCommand} install`
  return `${managerCommand} install`
}

function getManagerLockfile(packageManager: PackageManager): string {
  if (packageManager === 'pnpm') return 'pnpm-lock.yaml'
  if (packageManager === 'yarn') return 'yarn.lock'
  return 'package-lock.json'
}

function getManualReviewInstallCommand(packageManager: PackageManager, managerCommand: string, pkg: string): string {
  if (packageManager === 'pnpm') return `${managerCommand} add ${pkg}@latest`
  if (packageManager === 'yarn') return `${managerCommand} add ${pkg}@latest`
  return `${managerCommand} install ${pkg}@latest`
}

function getCleanUpdateSequenceCommand(packageManager: PackageManager, managerCommand: string): string {
  const installCommand = getManagerInstallCommand(packageManager, managerCommand)
  const lockfile = getManagerLockfile(packageManager)
  const updateCommand = getNonBreakingUpdateCommand(packageManager, managerCommand)
  return `rm -rf node_modules ${lockfile}; ${installCommand}; ${updateCommand}; rm -rf node_modules ${lockfile}; ${installCommand};`
}

const TEST_SCRIPT_CANDIDATES = ['test', 'test:ci', 'test:unit', 'test:integration', 'test:all', 'verify', 'check']
const LINT_SCRIPT_CANDIDATES = ['lint', 'lint:ci']
const BUILD_SCRIPT_CANDIDATES = ['build', 'build:ci']
const TEST_FILE_PATTERN = /\.(test|spec)\.[cm]?[jt]sx?$/
const TEST_DIR_NAMES = new Set(['test', 'tests', '__tests__', '__mocks__'])
const TEST_FRAMEWORK_PACKAGE_MAP: Record<string, TestFramework> = {
  vitest: 'vitest',
  jest: 'jest',
  mocha: 'mocha',
  ava: 'ava',
  playwright: 'playwright',
  '@playwright/test': 'playwright'
}
const TEST_FRAMEWORK_CONFIG_FILES: Record<TestFramework, string[]> = {
  vitest: ['vitest.config.ts', 'vitest.config.js', 'vitest.config.mts', 'vitest.config.mjs', 'vitest.config.cts', 'vitest.config.cjs'],
  jest: ['jest.config.ts', 'jest.config.js', 'jest.config.mts', 'jest.config.mjs', 'jest.config.cjs', 'jest.config.json'],
  mocha: ['.mocharc', '.mocharc.json', '.mocharc.yml', '.mocharc.yaml', '.mocharc.js', '.mocharc.cjs'],
  ava: ['ava.config.ts', 'ava.config.js', 'ava.config.mts', 'ava.config.mjs', 'ava.config.cjs'],
  playwright: ['playwright.config.ts', 'playwright.config.js', 'playwright.config.mts', 'playwright.config.mjs', 'playwright.config.cjs']
}
const TEST_FRAMEWORK_PRIORITY: TestFramework[] = ['vitest', 'jest', 'mocha', 'playwright', 'ava']

function pickScriptForStage(scripts: Record<string, unknown>, stage: ValidationStage): string | null {
  const candidates = stage === 'test'
    ? TEST_SCRIPT_CANDIDATES
    : stage === 'lint'
      ? LINT_SCRIPT_CANDIDATES
      : BUILD_SCRIPT_CANDIDATES

  for (const candidate of candidates) {
    if (typeof scripts[candidate] === 'string' && scripts[candidate].trim().length > 0) {
      return candidate
    }
  }
  return null
}

function detectFrameworksFromDependencies(packageJson: any): Set<TestFramework> {
  const frameworks = new Set<TestFramework>()
  const sections = [
    packageJson?.dependencies || {},
    packageJson?.devDependencies || {},
    packageJson?.peerDependencies || {}
  ]

  for (const section of sections) {
    for (const depName of Object.keys(section)) {
      const framework = TEST_FRAMEWORK_PACKAGE_MAP[depName]
      if (framework) {
        frameworks.add(framework)
      }
    }
  }

  return frameworks
}

async function detectFrameworksFromConfigs(repoPath: string, packageDirs: string[]): Promise<Set<TestFramework>> {
  const frameworks = new Set<TestFramework>()
  const directories = ['.', ...packageDirs]

  for (const relativeDir of directories) {
    const basePath = relativeDir === '.' ? repoPath : path.join(repoPath, relativeDir)

    for (const framework of Object.keys(TEST_FRAMEWORK_CONFIG_FILES) as TestFramework[]) {
      for (const fileName of TEST_FRAMEWORK_CONFIG_FILES[framework]) {
        if (await fileExists(path.join(basePath, fileName))) {
          frameworks.add(framework)
          break
        }
      }
    }
  }

  return frameworks
}

async function hasTestArtifacts(repoPath: string, maxDepth = 7): Promise<boolean> {
  const skipDirs = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', 'out', '.turbo'])

  const walk = async (absoluteDir: string, depth: number): Promise<boolean> => {
    if (depth > maxDepth) return false

    let entries: import('fs').Dirent[]
    try {
      entries = await fs.readdir(absoluteDir, { withFileTypes: true })
    } catch {
      return false
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (skipDirs.has(entry.name)) continue
        if (TEST_DIR_NAMES.has(entry.name)) {
          return true
        }
        if (await walk(path.join(absoluteDir, entry.name), depth + 1)) {
          return true
        }
      } else if (entry.isFile()) {
        if (TEST_FILE_PATTERN.test(entry.name)) {
          return true
        }
      }
    }

    return false
  }

  return walk(repoPath, 0)
}

function getFrameworkTestCommand(
  framework: TestFramework,
  packageManager: PackageManager,
  managerCommand: string
): string {
  const frameworkCommand = framework === 'vitest'
    ? 'vitest run'
    : framework === 'jest'
      ? 'jest --runInBand'
      : framework === 'mocha'
        ? 'mocha'
        : framework === 'playwright'
          ? 'playwright test'
          : 'ava'

  if (packageManager === 'npm') {
    return `npx --no-install ${frameworkCommand}`
  }
  if (packageManager === 'pnpm') {
    return `${managerCommand} exec ${frameworkCommand}`
  }
  return `${managerCommand} ${frameworkCommand}`
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
  managerCommand: string,
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
    const scripts = (workspaceJson?.scripts || {}) as Record<string, unknown>

    for (const stage of stages) {
      if (rootHasStage[stage]) {
        continue
      }
      const scriptName = pickScriptForStage(scripts, stage)
      if (!scriptName) {
        continue
      }
      const command = getScriptCommand(packageManager, managerCommand, scriptName)
      const step: ValidationStep = {
        command,
        relativeCwd: relativeDir,
        stage,
        label: `${relativeDir} (${scriptName})`
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

async function resolveNestedValidationSteps(
  repoPath: string,
  packageManager: PackageManager,
  managerCommand: string,
  rootHasStage: Record<ValidationStage, boolean>
): Promise<ValidationStep[]> {
  const packageDirs = await collectPackageJsonDirectories(repoPath)
  const stages: ValidationStage[] = ['test', 'lint', 'build']
  const byStage: Record<ValidationStage, ValidationStep[]> = { test: [], lint: [], build: [] }
  const seen = new Set<string>()

  for (const relativeDir of packageDirs) {
    const packageJsonPath = path.join(repoPath, relativeDir, 'package.json')
    let workspaceJson: any
    try {
      workspaceJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    } catch {
      continue
    }
    const scripts = (workspaceJson?.scripts || {}) as Record<string, unknown>

    for (const stage of stages) {
      if (rootHasStage[stage]) continue
      const scriptName = pickScriptForStage(scripts, stage)
      if (!scriptName) continue
      const command = getScriptCommand(packageManager, managerCommand, scriptName)
      const step: ValidationStep = {
        command,
        relativeCwd: relativeDir,
        stage,
        label: `${relativeDir} (${scriptName})`
      }
      const dedupeKey = `${step.relativeCwd}::${step.command}`
      if (seen.has(dedupeKey)) continue
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
  const managerCommand = await resolvePackageManagerCommand(repoPath, packageManager)
  const packageJsonPath = path.join(repoPath, 'package.json')
  if (!(await fileExists(packageJsonPath))) {
    return []
  }

  const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonRaw)
  const scripts = (packageJson?.scripts || {}) as Record<string, unknown>
  const packageDirs = await collectPackageJsonDirectories(repoPath)

  const stages: ValidationStage[] = ['test', 'lint', 'build']
  const rootScriptNames: Record<ValidationStage, string | null> = {
    test: pickScriptForStage(scripts, 'test'),
    lint: pickScriptForStage(scripts, 'lint'),
    build: pickScriptForStage(scripts, 'build')
  }
  const rootHasStage: Record<ValidationStage, boolean> = {
    test: Boolean(rootScriptNames.test),
    lint: Boolean(rootScriptNames.lint),
    build: Boolean(rootScriptNames.build)
  }

  const rootSteps: ValidationStep[] = stages
    .filter(stage => rootHasStage[stage])
    .map(stage => ({
      command: getScriptCommand(packageManager, managerCommand, rootScriptNames[stage]!),
      relativeCwd: '.',
      stage,
      label: `root (${rootScriptNames[stage]})`
    }))

  const workspacePatterns = await getWorkspacePatterns(repoPath, packageJson)
  const workspaceSteps = workspacePatterns.length > 0
    ? await resolveWorkspaceValidationSteps(
      repoPath,
      packageManager,
      managerCommand,
      workspacePatterns,
      rootHasStage
    )
    : await resolveNestedValidationSteps(
      repoPath,
      packageManager,
      managerCommand,
      rootHasStage
    )
  const resolvedSteps = [...rootSteps, ...workspaceSteps]
  const hasTestStep = resolvedSteps.some(step => step.stage === 'test')

  if (!hasTestStep) {
    const frameworkSignals = detectFrameworksFromDependencies(packageJson)
    for (const relativeDir of packageDirs) {
      const nestedPackageJsonPath = path.join(repoPath, relativeDir, 'package.json')
      if (!(await fileExists(nestedPackageJsonPath))) {
        continue
      }
      try {
        const nestedPackageJson = JSON.parse(await fs.readFile(nestedPackageJsonPath, 'utf-8'))
        detectFrameworksFromDependencies(nestedPackageJson).forEach(framework => frameworkSignals.add(framework))
      } catch {
        // Ignore invalid nested package.json files.
      }
    }

    const configSignals = await detectFrameworksFromConfigs(repoPath, packageDirs)
    configSignals.forEach(framework => frameworkSignals.add(framework))

    const hasArtifacts = await hasTestArtifacts(repoPath)
    const selectedFramework = TEST_FRAMEWORK_PRIORITY.find(framework => frameworkSignals.has(framework))

    if (selectedFramework) {
      resolvedSteps.unshift({
        command: getFrameworkTestCommand(selectedFramework, packageManager, managerCommand),
        relativeCwd: '.',
        stage: 'test',
        label: `detected-${selectedFramework}`
      })
    } else if (hasArtifacts) {
      resolvedSteps.unshift({
        command: 'node --test',
        relativeCwd: '.',
        stage: 'test',
        label: 'detected-node-test-artifacts'
      })
    }
  }

  return resolvedSteps
}

async function runValidationSteps(
  steps: ValidationStep[],
  repoRoot: string,
  onLog: (message: string) => void,
  onWarning: (warning: { message: string; output: string }) => void,
  options: { timeoutMs: number; stageLabel: string }
): Promise<{ success: boolean; output: string; executedCount: number; skippedMissingCount: number; attemptedCount: number; failedCommand?: string }> {
  const allOutput: string[] = []
  let executedCount = 0
  let skippedMissingCount = 0
  let attemptedCount = 0

  for (const step of steps) {
    const command = step.command
    const stepCwd = step.relativeCwd === '.'
      ? repoRoot
      : path.join(repoRoot, step.relativeCwd)
    attemptedCount += 1
    onLog(`${step.relativeCwd === '.' ? '[root]' : `[${step.relativeCwd}]`} > ${command}`)
    try {
      const { stdout, stderr } = await runCommand(command, stepCwd, {
        timeout: options.timeoutMs,
        maxBuffer: DEFAULT_MAX_BUFFER
      })
      executedCount += 1
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
        skippedMissingCount += 1
        onWarning({
          message: `${options.stageLabel}: command not found, skipping '${command}' in ${step.relativeCwd}`,
          output
        })
        continue
      }

      return {
        success: false,
        output: allOutput.join('\n\n'),
        executedCount,
        skippedMissingCount,
        attemptedCount,
        failedCommand: `${step.relativeCwd === '.' ? 'root' : step.relativeCwd}: ${command}`
      }
    }
  }

  return {
    success: true,
    output: allOutput.join('\n\n'),
    executedCount,
    skippedMissingCount,
    attemptedCount
  }
}

async function installDependenciesForValidation(
  repoPath: string,
  onLog: (message: string) => void,
  validationSteps: ValidationStep[] = []
): Promise<void> {
  const installTargets = new Set<string>(['.'])
  for (const step of validationSteps) {
    if (step.relativeCwd && step.relativeCwd !== '.') {
      installTargets.add(step.relativeCwd)
    }
  }

  for (const relativeDir of installTargets) {
    const targetPath = relativeDir === '.'
      ? repoPath
      : path.join(repoPath, relativeDir)
    const packageJsonPath = path.join(targetPath, 'package.json')
    if (!(await fileExists(packageJsonPath))) {
      continue
    }

    const manager = await detectNodePackageManager(targetPath)
    const managerCommand = await resolvePackageManagerCommand(targetPath, manager)
    const installCommand = manager === 'npm' && await fileExists(path.join(targetPath, 'package-lock.json'))
      ? `${managerCommand} ci`
      : getManagerInstallCommand(manager, managerCommand)

    onLog(`Installing baseline dependencies${relativeDir === '.' ? '' : ` in ${relativeDir}`}: ${installCommand}`)
    const { stdout, stderr } = await runCommand(installCommand, targetPath, {
      timeout: 15 * 60 * 1000,
      maxBuffer: 50 * 1024 * 1024
    })
    const output = `${stdout}${stderr}`.trim()
    if (output) {
      splitOutputLines(output).forEach(line => onLog(line))
    }
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
    onLog?.('Fetching latest refs from origin...')
    await execAsync('git fetch origin --prune', {
      cwd: repoPath,
      timeout: 120000,
      maxBuffer: DEFAULT_MAX_BUFFER
    })
    onLog?.('Fetched latest refs from origin.')
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
      try {
        const { stdout } = await execAsync(`git rev-parse --short "${candidate}"`, {
          cwd: repoPath,
          timeout: 30000
        })
        const sha = stdout.trim()
        if (sha) {
          onLog?.(`Using base ref ${candidate} @ ${sha}.`)
        }
      } catch {}
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

interface BridgeUpdateLogEntry {
  timestamp: string
  workflow: 'patch-batch' | 'non-breaking' | 'security'
  branchName: string
  updatedPackages: string[]
  failedPackages?: string[]
  createPR: boolean
  prUrl?: string | null
  testsPassed?: boolean
  gatesPassed?: boolean
}

async function appendBridgeUpdateLog(repoPath: string, entry: BridgeUpdateLogEntry): Promise<void> {
  const bridgeDir = path.join(repoPath, '.bridge')
  const logPath = path.join(bridgeDir, 'update-log.json')
  await fs.mkdir(bridgeDir, { recursive: true })

  let existing: BridgeUpdateLogEntry[] = []
  try {
    const raw = await fs.readFile(logPath, 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      existing = parsed as BridgeUpdateLogEntry[]
    }
  } catch {
    existing = []
  }

  existing.unshift(entry)
  if (existing.length > 200) {
    existing = existing.slice(0, 200)
  }

  await fs.writeFile(logPath, JSON.stringify(existing, null, 2) + '\n', 'utf-8')
}

function normalizeBranchName(branchName: string): string {
  const normalized = branchName.trim().replace(/[^a-zA-Z0-9/_-]+/g, '-')
  if (!normalized) {
    return `bridge-update-${Date.now()}`
  }
  return normalized
}

function parseVersionLoose(version: string): semver.SemVer | null {
  return semver.parse(version) || semver.coerce(version)
}

function classifyUpdateType(fromVersion: string, toVersion: string): OutdatedPackage['updateType'] {
  const fromParsed = parseVersionLoose(fromVersion)
  const toParsed = parseVersionLoose(toVersion)
  if (!fromParsed || !toParsed) {
    return 'unknown'
  }
  if (toParsed.major > fromParsed.major) {
    return 'major'
  }
  if (toParsed.minor > fromParsed.minor) {
    return 'minor'
  }
  if (toParsed.patch > fromParsed.patch) {
    return 'patch'
  }
  return 'unknown'
}

interface PackageVulnerabilityCount {
  critical: number
  high: number
  medium: number
  low: number
  total: number
}

async function getInstalledDependencyNames(repoPath: string): Promise<string[]> {
  try {
    const raw = await fs.readFile(path.join(repoPath, 'package.json'), 'utf-8')
    const pkg = JSON.parse(raw)
    const names = new Set<string>()
    for (const key of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      const section = pkg?.[key]
      if (section && typeof section === 'object') {
        for (const depName of Object.keys(section)) {
          names.add(depName)
        }
      }
    }
    return Array.from(names)
  } catch {
    return []
  }
}

async function getJavascriptAuditVulnerabilityMap(repoPath: string): Promise<Map<string, PackageVulnerabilityCount>> {
  const map = new Map<string, PackageVulnerabilityCount>()
  try {
    const { stdout } = await runCommand('npm audit --json', repoPath, {
      timeout: 120000,
      maxBuffer: 20 * 1024 * 1024
    })
    const payload = JSON.parse(stdout || '{}')

    if (payload.vulnerabilities && typeof payload.vulnerabilities === 'object') {
      for (const [name, meta] of Object.entries(payload.vulnerabilities) as [string, any][]) {
        const severity = String(meta?.severity || '').toLowerCase()
        const existing = map.get(name) || { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
        if (severity === 'critical') existing.critical += 1
        else if (severity === 'high') existing.high += 1
        else if (severity === 'moderate' || severity === 'medium') existing.medium += 1
        else if (severity === 'low') existing.low += 1
        existing.total = existing.critical + existing.high + existing.medium + existing.low
        map.set(name, existing)
      }
    }

    if (payload.advisories && typeof payload.advisories === 'object') {
      for (const advisory of Object.values(payload.advisories) as any[]) {
        const name = String(advisory?.module_name || '')
        if (!name) continue
        const severity = String(advisory?.severity || '').toLowerCase()
        const existing = map.get(name) || { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
        if (severity === 'critical') existing.critical += 1
        else if (severity === 'high') existing.high += 1
        else if (severity === 'moderate' || severity === 'medium') existing.medium += 1
        else if (severity === 'low') existing.low += 1
        existing.total = existing.critical + existing.high + existing.medium + existing.low
        map.set(name, existing)
      }
    }
  } catch {
    // Best effort: vulnerability metadata is optional for package listing.
  }

  return map
}

async function warnOnGateFailures(
  repoPath: string,
  onLog: (message: string) => void,
  onWarning: (warning: { message: string; output: string }) => void,
  fallbackCoverage: number | null
): Promise<{ passed: boolean; failingGateNames: string[] }> {
  try {
    const [config, outdated, vulnerabilityMap, installedPackages] = await Promise.all([
      loadBridgeConfig(repoPath),
      getJsOutdatedPackages(repoPath),
      getJavascriptAuditVulnerabilityMap(repoPath),
      getInstalledDependencyNames(repoPath)
    ])

    const vulnerabilitySummary = { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
    for (const counts of vulnerabilityMap.values()) {
      vulnerabilitySummary.critical += counts.critical
      vulnerabilitySummary.high += counts.high
      vulnerabilitySummary.medium += counts.medium
      vulnerabilitySummary.low += counts.low
      vulnerabilitySummary.total += counts.total
    }

    const gateResults = evaluateGates(config, {
      dependencies: {
        outdated,
        vulnerabilities: vulnerabilitySummary,
        installedPackages
      },
      deadCode: {
        deadFiles: [],
        unusedExports: [],
        totalDeadCodeCount: 0
      },
      circularDependencies: {
        count: 0,
        dependencies: []
      },
      bundleSize: {
        totalSize: 0,
        totalSizeFormatted: '0 B',
        largestModules: []
      },
      testCoverage: {
        coveragePercentage: fallbackCoverage,
        uncoveredCriticalFiles: []
      },
      documentation: {
        missingReadmeSections: [],
        readmeOutdated: false,
        daysSinceUpdate: 0,
        undocumentedFunctions: 0
      },
      techDebt: {
        total: 0
      } as any
    } as any)

    const failing = gateResults.filter(gate => !gate.passed)
    if (failing.length > 0) {
      for (const gate of failing) {
        onWarning({
          message: `Gate ${gate.name} failed (${gate.severity}): ${gate.message}`,
          output: ''
        })
      }
      return {
        passed: false,
        failingGateNames: failing.map(gate => gate.name)
      }
    } else {
      onLog('✓ Post-update gate evaluation passed')
      return {
        passed: true,
        failingGateNames: []
      }
    }
  } catch (error) {
    onWarning({
      message: 'Post-update gate evaluation failed to run',
      output: error instanceof Error ? error.message : String(error)
    })
    return {
      passed: false,
      failingGateNames: ['gate-evaluation-error']
    }
  }
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
    const vulnerabilityMap = await getJavascriptAuditVulnerabilityMap(repoPath)

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
      const wantedUpdateType = classifyUpdateType(current, wanted)
      const hasNonBreakingWantedUpdate = wanted !== current && (wantedUpdateType === 'patch' || wantedUpdateType === 'minor')
      const updateType = hasNonBreakingWantedUpdate
        ? wantedUpdateType
        : classifyUpdateType(current, latest)

      const currentParsed = parseVersionLoose(current)
      const wantedParsed = parseVersionLoose(wanted)

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
        isNonBreaking: hasNonBreakingWantedUpdate,
        updateType,
        language: 'javascript',
        vulnerabilities: vulnerabilityMap.get(name) || { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
      })
    }

    const order: Record<OutdatedPackage['updateType'], number> = {
      patch: 0,
      minor: 1,
      major: 2,
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

  const totalSteps = 5 + (shouldRunTests ? 1 : 0) + (createPR ? 1 : 0)
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
      onProgress('Pushing branch...', ++currentStep, totalSteps)
      await pushBranch(workspacePath, safeBranchName)
      onLog(`✓ Branch pushed: ${safeBranchName}`)
      deleteBranchOnCleanup = true
      const gateCheck = await warnOnGateFailures(
        workspacePath,
        onLog,
        onWarning,
        shouldRunTests ? 100 : null
      )
      await appendBridgeUpdateLog(repoPath, {
        timestamp: new Date().toISOString(),
        workflow: 'patch-batch',
        branchName: safeBranchName,
        updatedPackages: allUpdated,
        failedPackages: allFailed,
        createPR: false,
        testsPassed: shouldRunTests ? testsPassed : undefined,
        gatesPassed: gateCheck.passed
      })
      return {
        success: true,
        updatedPackages: allUpdated,
        failedPackages: allFailed,
        branchName: safeBranchName,
        branchPushed: true,
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
    const gateCheck = await warnOnGateFailures(
      workspacePath,
      onLog,
      onWarning,
      shouldRunTests ? 100 : null
    )
    await appendBridgeUpdateLog(repoPath, {
      timestamp: new Date().toISOString(),
      workflow: 'patch-batch',
      branchName: safeBranchName,
      updatedPackages: allUpdated,
      failedPackages: allFailed,
      createPR: true,
      prUrl,
      testsPassed: shouldRunTests ? testsPassed : undefined,
      gatesPassed: gateCheck.passed
    })

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
    pushChanges = true,
    baseBranch,
    remoteFirst,
    pinnedPackages = {},
    selectedReviewPackages = [],
    testCommand,
    testTimeoutMs,
    prTitle,
    prBody
  } = config

  const onProgress = handlers.onProgress || (() => {})
  const onLog = handlers.onLog || (() => {})
  const onWarning = handlers.onWarning || (() => {})
  const safeBranchName = normalizeBranchName(branchName)

  const totalSteps = 5 + (shouldRunTests ? 3 : 0) + (selectedReviewPackages.length > 0 ? 1 : 0) + (createPR ? 1 : 0)
  let currentStep = 0
  let workspacePath = repoPath
  let workspaceCreated = false
  let deleteBranchOnCleanup = true
  const validationOutput: string[] = []
  let baselineValidationFailed = false
  let baselineValidationOutput = ''
  let validationCommands: ValidationStep[] = []
  let effectivePinnedPackages: Record<string, string> = { ...pinnedPackages }
  let effectiveSelectedReviewPackages: string[] = []
  let effectiveTestCommand = testCommand
  let effectiveTimeoutMs = testTimeoutMs ?? DEFAULT_TEST_TIMEOUT_MS
  let majorUpdatePolicy: 'review' | 'ignore' = 'review'

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

  try {
    const bridgeConfig = await loadBridgeConfig(repoPath)
    majorUpdatePolicy = bridgeConfig.dependencies.updatePolicy.major
    effectivePinnedPackages = {
      ...(bridgeConfig.dependencies.pinnedPackages || {}),
      ...pinnedPackages
    }
    effectiveTestCommand = testCommand || bridgeConfig.gates?.tests?.command || undefined
    effectiveTestCommand = await normalizeConfiguredValidationCommand(repoPath, effectiveTestCommand)
    if (!testTimeoutMs && bridgeConfig.gates?.tests?.timeout) {
      const rawTimeout = bridgeConfig.gates.tests.timeout
      const timeoutFromConfig = normalizeConfiguredTimeoutMs(rawTimeout)
      if (timeoutFromConfig) {
        effectiveTimeoutMs = timeoutFromConfig
        if (typeof rawTimeout === 'number' && rawTimeout <= 600) {
          onLog(`Using test timeout from .bridge.json: ${rawTimeout}s (${effectiveTimeoutMs}ms)`)
        }
      }
    }

    if (shouldRunTests) {
      validationCommands = await resolveJavascriptValidationCommands(repoPath, effectiveTestCommand)
    }
  } catch (error) {
    onWarning({
      message: `Bridge config integration failed, using pipeline defaults: ${formatError(error, 'Unknown config error')}`,
      output: ''
    })
    if (shouldRunTests) {
      const fallbackTestCommand = await normalizeConfiguredValidationCommand(repoPath, testCommand)
      validationCommands = await resolveJavascriptValidationCommands(repoPath, fallbackTestCommand)
    }
  }

  effectiveSelectedReviewPackages = Array.from(new Set(selectedReviewPackages))

  if (createPR) {
    const ghStatus = await getGitHubCliStatus(repoPath)
    if (!ghStatus.installed || !ghStatus.authenticated) {
      return fail(ghStatus.message || 'GitHub CLI is required and must be authenticated before creating PRs.')
    }
  }

  try {
    const beforeOutdated = await getJsOutdatedPackages(repoPath)
    const beforeOutdatedMap = new Map(beforeOutdated.map(pkg => [pkg.name, pkg]))
    const nonBreakingBefore = beforeOutdated.filter(pkg => pkg.isNonBreaking)
    const manualReviewPackages: string[] = []

    for (const pkgName of effectiveSelectedReviewPackages) {
      const pkg = beforeOutdatedMap.get(pkgName)
      if (!pkg) continue
      if (pkg.isNonBreaking) continue

      if (effectivePinnedPackages[pkgName]) {
        onWarning({
          message: `Skipping pinned package '${pkgName}' (${effectivePinnedPackages[pkgName]})`,
          output: ''
        })
        continue
      }

      if (pkg.updateType === 'major' && majorUpdatePolicy === 'ignore') {
        onWarning({
          message: `Skipping ${pkgName} - major updates are ignored by .bridge.json policy`,
          output: ''
        })
        continue
      }

      manualReviewPackages.push(pkgName)
    }

    if (nonBreakingBefore.length === 0) {
      onLog('No direct patch/minor candidates detected. Continuing with clean update script for transitive/non-listed updates.')
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
      onLog('Using repository-local .npmrc for package manager commands.')
    } else {
      onWarning({
        message: 'No repository .npmrc found. Falling back to global npm config.',
        output: 'Create a local .npmrc if you need repository-scoped registry/auth settings.'
      })
    }

    if (shouldRunTests) {
      if (validationCommands.length === 0) {
        return fail('No validation commands detected. Add test/lint/build scripts or set gates.tests.command in .bridge.json.')
      }

      onProgress('Installing baseline dependencies...', ++currentStep, totalSteps)
      try {
        await installDependenciesForValidation(workspacePath, onLog, validationCommands)
      } catch (error) {
        return fail(`Baseline dependency install failed: ${formatError(error, 'Install failed')}`)
      }

      onProgress('Running pre-update validation...', ++currentStep, totalSteps)
      onLog('[1/5] Running validation on latest remote baseline...')
      const baselineValidation = await runValidationSteps(
        validationCommands,
        workspacePath,
        onLog,
        onWarning,
        { timeoutMs: effectiveTimeoutMs, stageLabel: 'Pre-update validation' }
      )
      validationOutput.push(baselineValidation.output)
      if (!baselineValidation.success) {
        baselineValidationFailed = true
        baselineValidationOutput = baselineValidation.output
        const summary = extractFailureSummary(baselineValidation.output) || 'unknown failure'
        const environmentIssue = detectValidationEnvironmentIssue(baselineValidation.output)
        if (environmentIssue) {
          return fail(
            `Baseline validation could not run due to repository/tooling setup: ${environmentIssue}. Bridge stopped before applying updates.`,
            {
              testsPassed: false,
              testOutput: baselineValidation.output
            }
          )
        }
        onWarning({
          message: `Baseline validation failed at ${baselineValidation.failedCommand || 'unknown step'} (${summary}). Bridge will continue and require no regression after updates.`,
          output: ''
        })
        onLog('WARN: Continuing despite baseline failure. Post-update validation must not introduce new failures.')
      }
      if (baselineValidation.attemptedCount > 0 && baselineValidation.attemptedCount === baselineValidation.skippedMissingCount) {
        return fail('Pre-update validation skipped every command. Ensure required test tools are installed in the repository.')
      }
      if (!baselineValidationFailed) {
        onLog(`✓ Pre-update validation passed (${baselineValidation.executedCount} checks)`)
      }
    }

    onProgress('Running non-breaking update sequence...', ++currentStep, totalSteps)
    onLog('[2/5] Running update script:')
    const packageManager = await detectNodePackageManager(workspacePath)
    const packageManagerCommand = await resolvePackageManagerCommand(workspacePath, packageManager)
    onLog(`Detected package manager: ${packageManager} (${packageManagerCommand}).`)
    const updateSequence = getCleanUpdateSequenceCommand(packageManager, packageManagerCommand)
    onLog(updateSequence)
    try {
      const { stdout, stderr } = await runCommand(
        updateSequence,
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

    const manualReviewUpdated: string[] = []
    if (manualReviewPackages.length > 0) {
      onProgress('Applying selected review updates...', ++currentStep, totalSteps)
      onLog('[3/5] Applying selected manual review updates...')
      for (const pkg of manualReviewPackages) {
        try {
          const installCommand = getManualReviewInstallCommand(packageManager, packageManagerCommand, pkg)
          onLog(`> ${installCommand}`)
          const { stdout, stderr } = await runCommand(installCommand, workspacePath, {
            timeout: DEFAULT_TEST_TIMEOUT_MS,
            maxBuffer: DEFAULT_MAX_BUFFER
          })
          splitOutputLines(`${stdout}${stderr}`).forEach(line => onLog(line))
          manualReviewUpdated.push(pkg)
        } catch (error: any) {
          const output = `${error?.stdout || ''}${error?.stderr || ''}`.trim() || String(error?.message || '')
          splitOutputLines(output).forEach(line => onLog(line))
          return fail(`Failed to apply selected review update: ${pkg}`, {
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
    for (const pkg of manualReviewUpdated) {
      if (!updatedPackages.includes(pkg)) {
        updatedPackages.push(pkg)
      }
    }

    onProgress('Evaluating changes...', ++currentStep, totalSteps)
    const changed = await hasGitChanges(workspacePath)
    if (!changed) {
      const nonBreakingBeforeCount = nonBreakingBefore.length
      const nonBreakingAfterCount = remainingNonBreaking.size
      onLog(
        `No git-tracked dependency changes detected. Non-breaking candidates before: ${nonBreakingBeforeCount}, remaining after: ${nonBreakingAfterCount}.`
      )
      onLog(
        'Likely causes: lockfile already at latest allowed versions, or local node_modules was stale when the outdated list was generated.'
      )
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
        { timeoutMs: effectiveTimeoutMs, stageLabel: 'Post-update validation' }
      )
      validationOutput.push(postValidation.output)
      if (!postValidation.success && !baselineValidationFailed) {
        const summary = extractFailureSummary(postValidation.output)
        return fail(`Post-update validation failed at ${postValidation.failedCommand || 'unknown step'}${summary ? ` (${summary})` : ''}. No commit was created.`, {
          testsPassed: false,
          testOutput: postValidation.output
        })
      }
      if (!postValidation.success && baselineValidationFailed) {
        const regression = isValidationRegression(baselineValidationOutput, postValidation.output)
        if (regression.regressed) {
          const summary = extractFailureSummary(postValidation.output)
          return fail(
            `Post-update validation regressed (${regression.reason || 'new failures detected'})${summary ? ` (${summary})` : ''}. No commit was created.`,
            {
              testsPassed: false,
              testOutput: postValidation.output
            }
          )
        }
        onWarning({
          message: 'Post-update validation still failing, but no regression detected versus baseline. Proceeding with commit.',
          output: ''
        })
      }
      if (postValidation.attemptedCount > 0 && postValidation.attemptedCount === postValidation.skippedMissingCount) {
        return fail('Post-update validation skipped every command. Aborting to avoid unverified updates.', {
          testsPassed: false,
          testOutput: postValidation.output
        })
      }
      onLog(`✓ Post-update validation passed (${postValidation.executedCount} checks)`)
    }

    onProgress('Committing changes...', ++currentStep, totalSteps)
    await commitChanges(
      workspacePath,
      `chore(deps): apply non-breaking dependency updates\n\nUpdated packages:\n${updatedPackages.map(p => `- ${p}`).join('\n') || '- lockfile/package graph changes'}`,
      getFilesToCommit('javascript')
    )
    deleteBranchOnCleanup = false
    const validationPassedCleanly = shouldRunTests ? !baselineValidationFailed : undefined

    if (!createPR) {
      onLog('[5/5] Committing updates locally...')
      onLog(`✓ Changes committed on '${safeBranchName}'`)
      if (pushChanges) {
        onProgress('Pushing branch...', ++currentStep, totalSteps)
        await pushBranch(workspacePath, safeBranchName)
        onLog(`✓ Branch pushed: ${safeBranchName}`)
        deleteBranchOnCleanup = true
      } else {
        onLog(`✓ Push skipped (pushChanges=false). Branch '${safeBranchName}' is committed locally.`)
      }
      const gateCheck = await warnOnGateFailures(
        workspacePath,
        onLog,
        onWarning,
        shouldRunTests ? 100 : null
      )
      await appendBridgeUpdateLog(repoPath, {
        timestamp: new Date().toISOString(),
        workflow: 'non-breaking',
        branchName: safeBranchName,
        updatedPackages,
        createPR: false,
        testsPassed: validationPassedCleanly,
        gatesPassed: gateCheck.passed
      })
      return {
        success: true,
        branchName: safeBranchName,
        branchPushed: pushChanges,
        updatedPackages,
        testsPassed: validationPassedCleanly,
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
    const gateCheck = await warnOnGateFailures(
      workspacePath,
      onLog,
      onWarning,
      shouldRunTests ? 100 : null
    )
    await appendBridgeUpdateLog(repoPath, {
      timestamp: new Date().toISOString(),
      workflow: 'non-breaking',
      branchName: safeBranchName,
      updatedPackages,
      createPR: true,
      prUrl,
      testsPassed: validationPassedCleanly,
      gatesPassed: gateCheck.passed
    })

    return {
      success: true,
      branchName: safeBranchName,
      prUrl,
      updatedPackages,
      testsPassed: validationPassedCleanly,
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

    await appendBridgeUpdateLog(repoPath, {
      timestamp: new Date().toISOString(),
      workflow: 'security',
      branchName: safeBranchName,
      updatedPackages,
      failedPackages,
      createPR,
      prUrl,
      testsPassed
    })

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
