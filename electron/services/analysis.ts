import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

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
