import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import os from 'os'
import { detectLanguages, Language } from './languages'

export interface Repository {
  path: string
  name: string
  languages: Language[]
  hasGit: boolean
  addedAt: string
  exists: boolean
}

export interface FileEntry {
  name: string
  path: string
  isDirectory: boolean
  size?: number
  modified?: string
}

const SKIP_DIRECTORY_NAMES = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.next',
  '.nuxt'
])

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

export async function scanRepository(repoPath: string): Promise<Repository> {
  const name = path.basename(repoPath)

  let hasGit = false
  let exists = true

  try {
    await fs.access(repoPath)
  } catch {
    exists = false
  }

  try {
    await fs.access(path.join(repoPath, '.git'))
    hasGit = true
  } catch {}

  const languages = exists ? await detectLanguages(repoPath) : []

  return {
    path: repoPath,
    name,
    languages,
    hasGit,
    addedAt: new Date().toISOString(),
    exists
  }
}

export async function scanForRepos(directory: string, maxDepth = 2): Promise<Repository[]> {
  const discovered = new Set<string>()

  async function walk(currentPath: string, depth: number): Promise<void> {
    if (depth > maxDepth) {
      return
    }

    const entries = await fs.readdir(currentPath, { withFileTypes: true }).catch(() => [])

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue
      }

      if (entry.name.startsWith('.') && entry.name !== '.git') {
        continue
      }

      if (SKIP_DIRECTORY_NAMES.has(entry.name)) {
        continue
      }

      const fullPath = path.join(currentPath, entry.name)
      const gitPath = path.join(fullPath, '.git')

      if (await pathExists(gitPath)) {
        discovered.add(fullPath)
        continue
      }

      await walk(fullPath, depth + 1)
    }
  }

  await walk(directory, 0)

  const repos = await Promise.all(
    Array.from(discovered).map(repoPath => scanRepository(repoPath))
  )

  return repos.sort((a, b) => a.name.localeCompare(b.name))
}

export function getDefaultCodeDirectory(): string {
  const homeDir = os.homedir()
  const commonPaths = [
    path.join(homeDir, 'code'),
    path.join(homeDir, 'projects'),
    path.join(homeDir, 'dev'),
    path.join(homeDir, 'workspace'),
    path.join(homeDir, 'Documents', 'code')
  ]

  for (const candidate of commonPaths) {
    try {
      const stats = fsSync.statSync(candidate)
      if (stats.isDirectory()) {
        return candidate
      }
    } catch {
      // Continue
    }
  }

  return path.join(homeDir, 'code')
}

export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath)
    return stats.isDirectory()
  } catch {
    return false
  }
}

export async function checkRepositoryExists(repoPath: string): Promise<boolean> {
  try {
    await fs.access(repoPath)
    return true
  } catch {
    return false
  }
}

export async function validateRepositories(repos: Repository[]): Promise<Repository[]> {
  const validated: Repository[] = []

  for (const repo of repos) {
    const exists = await checkRepositoryExists(repo.path)
    validated.push({ ...repo, exists })
  }

  return validated
}

export async function cleanupMissingRepositories(repos: Repository[]): Promise<Repository[]> {
  const validated = await validateRepositories(repos)
  return validated.filter(r => r.exists)
}

export async function readDirectory(dirPath: string): Promise<FileEntry[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  const files: FileEntry[] = []

  for (const entry of entries) {
    // Skip hidden files and node_modules
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue
    }

    const fullPath = path.join(dirPath, entry.name)

    try {
      const stats = await fs.stat(fullPath)

      files.push({
        name: entry.name,
        path: fullPath,
        isDirectory: entry.isDirectory(),
        size: entry.isDirectory() ? undefined : stats.size,
        modified: stats.mtime.toISOString()
      })
    } catch {
      // Skip files we can't access
    }
  }

  // Sort: directories first, then alphabetically
  return files.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1
    if (!a.isDirectory && b.isDirectory) return 1
    return a.name.localeCompare(b.name)
  })
}

export async function readFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf-8')
  return content
}

// Get total size of a directory (excluding node_modules, .git, etc.)
export async function getDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0

  async function scanDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        if (['node_modules', '.git', 'vendor', 'deps', '_build'].includes(entry.name)) {
          continue
        }

        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          await scanDir(fullPath)
        } else {
          try {
            const stats = await fs.stat(fullPath)
            totalSize += stats.size
          } catch {}
        }
      }
    } catch {}
  }

  await scanDir(dirPath)
  return totalSize
}
