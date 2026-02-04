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
  const result = await runGitCommand(
    repoPath,
    `gh pr create --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}"`
  )
  return result
}

export async function runTests(repoPath: string, command: string): Promise<{ success: boolean; output: string }> {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: repoPath,
      timeout: 300000, // 5 min timeout for tests
      maxBuffer: 10 * 1024 * 1024
    })
    return { success: true, output: stdout + stderr }
  } catch (error: any) {
    return { success: false, output: error.stdout + error.stderr || error.message }
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
