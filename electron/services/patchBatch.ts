import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
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
  createBranch,
  commitChanges,
  pushBranch,
  createPullRequest,
  getRepoInfo,
  runTests,
  runLint,
  abortChanges,
  deleteBranch
} from './git'

const execAsync = promisify(exec)
const DEFAULT_TEST_TIMEOUT_MS = 300000

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

export interface PatchBatchHandlers {
  onProgress?: (message: string, step: number, total: number) => void
  onLog?: (message: string) => void
  onWarning?: (warning: { message: string; output: string }) => void
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
      const { stdout } = await execAsync('npm outdated --json', { cwd: repoPath })
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
  } catch (error) {
    const message = formatError(error, 'Failed to read package.json')
    throw new Error(message)
  }
}

async function updateJsPackages(repoPath: string, packages: string[]) {
  const updated: string[] = []
  const failed: string[] = []

  const packageJsonPath = path.join(repoPath, 'package.json')
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)

  const outdated = await getJsOutdatedPackages(repoPath)
  const outdatedMap = new Map(outdated.map(p => [p.name, p]))

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
    prTitle,
    prBody,
    testCommand,
    testTimeoutMs
  } = config

  const onProgress = handlers.onProgress || (() => {})
  const onLog = handlers.onLog || (() => {})
  const onWarning = handlers.onWarning || (() => {})

  const totalSteps = 5 + (shouldRunTests ? 1 : 0) + (createPR ? 2 : 0)
  let currentStep = 0

  const primaryLang = packages[0]?.language || 'javascript'
  const resolvedTestCommand = shouldRunTests
    ? (testCommand?.trim() || getTestCommand(primaryLang))
    : null

  let originalBranch = ''
  let branchCreated = false

  const fail = async (message: string, extra?: Partial<PatchBatchResult>) => {
    onLog(`✗ ${message}`)
    if (branchCreated && originalBranch) {
      onLog('Reverting changes and cleaning up...')
      await abortChanges(repoPath, originalBranch)
      await deleteBranch(repoPath, branchName)
    }
    return {
      success: false,
      error: message,
      branchName,
      ...extra
    }
  }

  if (!packages.length) {
    return fail('No packages selected for update.')
  }

  if (shouldRunTests && (!resolvedTestCommand || resolvedTestCommand.length === 0)) {
    return fail("No test script found - add one to package.json or uncheck 'Run tests'.")
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
    onProgress('Checking branch safety...', ++currentStep, totalSteps)
    const repoInfo = await getRepoInfo(repoPath)
    originalBranch = repoInfo.branch

    if (repoInfo.hasChanges) {
      return fail('Repository has uncommitted changes. Please commit or stash first.')
    }

    onProgress('Creating git branch...', ++currentStep, totalSteps)
    await createBranch(repoPath, branchName)
    branchCreated = true

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

    allUpdated.forEach(name => onLog(`✓ Updated ${name}`))
    allFailed.forEach(name => onLog(`✗ Skipped ${name}`))

    if (allUpdated.length === 0) {
      return fail('No packages were updated. Check selections and try again.')
    }

    onProgress('Running clean install...', ++currentStep, totalSteps)
    const cleanCmd = getCleanInstallCommand(primaryLang)
    if (cleanCmd) {
      try {
        const { stdout, stderr } = await execAsync(cleanCmd, {
          cwd: repoPath,
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

      const testResult = await runTests(repoPath, resolvedTestCommand, {
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
        const lintResult = await runLint(repoPath, lintCommand)
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
      repoPath,
      `chore(deps): update ${allUpdated.length} packages to latest patch versions\n\nUpdated packages:\n${allUpdated.map(p => `- ${p}`).join('\n')}`,
      files
    )

    if (!createPR) {
      onLog('[3/3] Committing updates...')
      onLog(`✓ Updates committed to branch '${branchName}'`)
      return {
        success: true,
        updatedPackages: allUpdated,
        failedPackages: allFailed,
        branchName,
        testsPassed: shouldRunTests ? testsPassed : undefined,
        testOutput
      }
    }

    onProgress('Pushing branch...', ++currentStep, totalSteps)
    await pushBranch(repoPath, branchName)

    onProgress('Creating pull request...', ++currentStep, totalSteps)
    onLog('[3/3] Creating PR...')

    const prUrl = await createPullRequest(
      repoPath,
      prTitle || `chore(deps): update ${allUpdated.length} packages`,
      prBody || `## Summary\nAutomated patch version updates via Bridge.\n\n### Updated packages\n${allUpdated.map(p => `- ${p}`).join('\n')}\n\n${shouldRunTests ? '### Checks\n- [x] Tests passed\n- [x] Lint checked' : ''}`
    )

    onLog(`✓ PR created: ${prUrl}`)

    return {
      success: true,
      updatedPackages: allUpdated,
      failedPackages: allFailed,
      prUrl,
      branchName,
      testsPassed: shouldRunTests ? testsPassed : undefined,
      testOutput
    }
  } catch (error) {
    return fail(formatError(error, 'Update failed. Please try again.'))
  }
}
