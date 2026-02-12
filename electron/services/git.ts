import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface RepoInfo {
  branch: string
  remote: string | null
  hasChanges: boolean
  isProtectedBranch: boolean
  defaultBranch: string
  ahead: number
  behind: number
}

export interface ConflictWarning {
  severity: 'high' | 'medium'
  message: string
  recommendation: string
  conflictingFiles: string[]
  behindBy: number
}

export interface GitHubCliStatus {
  installed: boolean
  authenticated: boolean
  account?: string
  message?: string
}

const PROTECTED_BRANCHES = ['main', 'master', 'develop', 'production', 'staging']

async function runGitCommand(repoPath: string, command: string): Promise<string> {
  const { stdout } = await execAsync(command, { cwd: repoPath, timeout: 30000 })
  return stdout.trim()
}

export async function getRepoInfo(repoPath: string): Promise<RepoInfo> {
  try {
    const branch = await runGitCommand(repoPath, 'git rev-parse --abbrev-ref HEAD')

    let remote: string | null = null
    try {
      remote = await runGitCommand(repoPath, 'git remote get-url origin')
    } catch {}

    let hasChanges = false
    try {
      const status = await runGitCommand(repoPath, 'git status --porcelain')
      hasChanges = status.length > 0
    } catch {}

    // Detect default branch
    let defaultBranch = 'main'
    try {
      const remoteInfo = await runGitCommand(repoPath, 'git remote show origin 2>/dev/null | grep "HEAD branch"')
      const match = remoteInfo.match(/HEAD branch:\s*(\S+)/)
      if (match) {
        defaultBranch = match[1]
      }
    } catch {
      // Check if main or master exists
      try {
        await runGitCommand(repoPath, 'git rev-parse --verify main')
        defaultBranch = 'main'
      } catch {
        try {
          await runGitCommand(repoPath, 'git rev-parse --verify master')
          defaultBranch = 'master'
        } catch {}
      }
    }

    const isProtectedBranch = PROTECTED_BRANCHES.includes(branch.toLowerCase())

    // Get ahead/behind counts relative to remote tracking branch
    let ahead = 0
    let behind = 0
    try {
      // First try to get upstream tracking branch
      const upstream = await runGitCommand(repoPath, `git rev-parse --abbrev-ref ${branch}@{upstream} 2>/dev/null`)
      if (upstream) {
        const counts = await runGitCommand(repoPath, `git rev-list --left-right --count ${upstream}...HEAD`)
        const [behindStr, aheadStr] = counts.split(/\s+/)
        behind = parseInt(behindStr, 10) || 0
        ahead = parseInt(aheadStr, 10) || 0
      }
    } catch {
      // No upstream configured or other error - leave as 0
    }

    return { branch, remote, hasChanges, isProtectedBranch, defaultBranch, ahead, behind }
  } catch (error) {
    return {
      branch: 'unknown',
      remote: null,
      hasChanges: false,
      isProtectedBranch: false,
      defaultBranch: 'main',
      ahead: 0,
      behind: 0
    }
  }
}

export async function isOnProtectedBranch(repoPath: string): Promise<boolean> {
  const info = await getRepoInfo(repoPath)
  return info.isProtectedBranch
}

export async function ensureSafeBranch(repoPath: string, targetBranch: string): Promise<void> {
  const info = await getRepoInfo(repoPath)

  if (info.isProtectedBranch) {
    throw new Error(`Cannot work on protected branch '${info.branch}'. Bridge will create a new branch.`)
  }

  if (info.hasChanges) {
    throw new Error('Repository has uncommitted changes. Please commit or stash them first.')
  }
}

export async function createBranch(repoPath: string, branchName: string): Promise<void> {
  const info = await getRepoInfo(repoPath)

  // If on protected branch, switch to default first
  if (info.isProtectedBranch) {
    try {
      await runGitCommand(repoPath, 'git fetch origin')
    } catch {}

    // Make sure we're up to date with default branch
    await runGitCommand(repoPath, `git checkout ${info.defaultBranch}`)
    try {
      await runGitCommand(repoPath, `git pull origin ${info.defaultBranch}`)
    } catch {}
  }

  // Create and checkout new branch
  await runGitCommand(repoPath, `git checkout -b ${branchName}`)
}

export async function commitChanges(repoPath: string, message: string, files?: string[]): Promise<void> {
  if (files && files.length > 0) {
    // Add specific files
    for (const file of files) {
      try {
        await runGitCommand(repoPath, `git add "${file}"`)
      } catch {}
    }
  } else {
    // Add common dependency files
    const commonFiles = [
      'package.json', 'package-lock.json',
      'requirements.txt', 'Pipfile.lock',
      'Gemfile', 'Gemfile.lock',
      'mix.exs', 'mix.lock'
    ]
    for (const file of commonFiles) {
      try {
        await runGitCommand(repoPath, `git add "${file}"`)
      } catch {}
    }
  }

  await runGitCommand(repoPath, `git commit -m "${message.replace(/"/g, '\\"')}"`)
}

export async function pushBranch(repoPath: string, branchName: string): Promise<void> {
  await runGitCommand(repoPath, `git push -u origin ${branchName}`)
}

export async function createPullRequest(
  repoPath: string,
  title: string,
  body: string
): Promise<string> {
  try {
    await runGitCommand(repoPath, 'command -v gh')
  } catch {
    throw new Error('GitHub CLI (`gh`) is required to create PRs. Install it and run `gh auth login`.')
  }

  try {
    const result = await runGitCommand(
      repoPath,
      `gh pr create --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}"`
    )
    return result
  } catch (error: any) {
    const output = `${error?.stdout || ''}${error?.stderr || ''}`.trim()
    if (output.includes('not logged in')) {
      throw new Error('GitHub CLI is not authenticated. Run `gh auth login` and retry.')
    }
    throw new Error(output || 'Failed to create pull request with gh CLI.')
  }
}

export async function predictMergeConflicts(
  repoPath: string,
  options: { baseBranch?: string; minBehindCommits?: number } = {}
): Promise<ConflictWarning[]> {
  const warnings: ConflictWarning[] = []

  try {
    const info = await getRepoInfo(repoPath)
    const currentBranch = info.branch
    const baseBranch = options.baseBranch || info.defaultBranch || 'main'
    const minBehindCommits = options.minBehindCommits ?? 10

    if (!currentBranch || currentBranch === 'HEAD' || currentBranch === baseBranch) {
      return warnings
    }

    try {
      await runGitCommand(repoPath, 'git fetch origin --prune')
    } catch {
      // Continue with local refs if fetch fails.
    }

    const behindRaw = await runGitCommand(
      repoPath,
      `git rev-list --count ${currentBranch}..origin/${baseBranch} 2>/dev/null || echo 0`
    )
    const behindBy = Number.parseInt(behindRaw, 10) || 0
    if (behindBy < minBehindCommits) {
      return warnings
    }

    const oursRaw = await runGitCommand(
      repoPath,
      `git diff --name-only origin/${baseBranch}...${currentBranch}`
    )
    const theirsRaw = await runGitCommand(
      repoPath,
      `git diff --name-only ${currentBranch}...origin/${baseBranch}`
    )

    const ours = new Set(oursRaw.split('\n').map(line => line.trim()).filter(Boolean))
    const theirs = new Set(theirsRaw.split('\n').map(line => line.trim()).filter(Boolean))
    const overlapping = Array.from(ours).filter(file => theirs.has(file))

    if (overlapping.length === 0) {
      return warnings
    }

    const severity: ConflictWarning['severity'] = behindBy >= 25 ? 'high' : 'medium'
    warnings.push({
      severity,
      behindBy,
      message: `Branch is ${behindBy} commits behind ${baseBranch}; ${overlapping.length} files overlap with ${baseBranch}.`,
      recommendation: `Run \`git fetch origin && git rebase origin/${baseBranch}\` before opening a PR.`,
      conflictingFiles: overlapping.slice(0, 30)
    })

    return warnings
  } catch {
    return warnings
  }
}

export async function getGitHubCliStatus(repoPath: string): Promise<GitHubCliStatus> {
  try {
    await runGitCommand(repoPath, 'command -v gh')
  } catch {
    return {
      installed: false,
      authenticated: false,
      message: 'GitHub CLI not installed. Install with `brew install gh`.'
    }
  }

  try {
    const output = await runGitCommand(repoPath, 'gh auth status -h github.com')
    const accountMatch = output.match(/Logged in to github\.com account\s+([^\s]+)/i)
    return {
      installed: true,
      authenticated: true,
      account: accountMatch?.[1]
    }
  } catch (error: any) {
    const stderr = `${error?.stderr || ''}${error?.stdout || ''}`.trim()
    return {
      installed: true,
      authenticated: false,
      message: stderr || 'GitHub CLI installed but not authenticated. Run `gh auth login`.'
    }
  }
}

function hasPositiveTestSignal(output: string): boolean {
  const patterns = [
    /\b\d+\s+passing\b/i,
    /\btests?\s*:\s*\d+\s+passed\b/i,
    /\bpassed\s+\d+\s+tests?\b/i,
    /\ball\s+tests\s+passed\b/i,
    /\bPASS\b/
  ]
  return patterns.some(pattern => pattern.test(output))
}

function hasFailureSignal(output: string): boolean {
  const countPatterns = [
    /\b(\d+)\s+failing\b/i,
    /\b(\d+)\s+failed\b/i
  ]
  for (const pattern of countPatterns) {
    const match = output.match(pattern)
    if (match && parseInt(match[1], 10) > 0) {
      return true
    }
  }

  return /\bFAIL\b/.test(output)
}

export async function runTests(
  repoPath: string,
  command: string,
  options: { timeoutMs?: number } = {}
): Promise<{ success: boolean; output: string; reason?: string; timedOut?: boolean }> {
  const timeoutMs = options.timeoutMs ?? 300000

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: repoPath,
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024
    })
    const output = `${stdout}${stderr}`
    const hasFailure = hasFailureSignal(output)
    const hasPass = hasPositiveTestSignal(output)
    const success = !hasFailure && hasPass
    return {
      success,
      output,
      reason: success ? undefined : 'Tests did not report a passing result.'
    }
  } catch (error: any) {
    const output = `${error.stdout || ''}${error.stderr || ''}` || error.message
    const timedOut = Boolean(error.killed || error.signal === 'SIGTERM')
    return {
      success: false,
      output,
      timedOut,
      reason: timedOut ? 'Test command timed out.' : 'Test command failed.'
    }
  }
}

export async function runLint(repoPath: string, command: string): Promise<{ success: boolean; output: string }> {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: repoPath,
      timeout: 120000,
      maxBuffer: 10 * 1024 * 1024
    })
    return { success: true, output: stdout + stderr }
  } catch (error: any) {
    return { success: false, output: error.stdout + error.stderr || error.message }
  }
}

// Stash changes temporarily
export async function stashChanges(repoPath: string): Promise<boolean> {
  try {
    await runGitCommand(repoPath, 'git stash')
    return true
  } catch {
    return false
  }
}

// Pop stashed changes
export async function popStash(repoPath: string): Promise<boolean> {
  try {
    await runGitCommand(repoPath, 'git stash pop')
    return true
  } catch {
    return false
  }
}

// Abort and cleanup on failure
export async function abortChanges(repoPath: string, originalBranch: string): Promise<void> {
  try {
    // Discard all changes
    await runGitCommand(repoPath, 'git checkout -- .')
    await runGitCommand(repoPath, 'git clean -fd')

    // Go back to original branch
    await runGitCommand(repoPath, `git checkout ${originalBranch}`)
  } catch (e) {
    console.error('Failed to abort changes:', e)
  }
}

// Delete a branch
export async function deleteBranch(repoPath: string, branchName: string): Promise<void> {
  try {
    await runGitCommand(repoPath, `git branch -D ${branchName}`)
  } catch {}
}
