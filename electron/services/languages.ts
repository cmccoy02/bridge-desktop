import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

export type Language = 'javascript' | 'python' | 'ruby' | 'elixir' | 'unknown'

export interface LanguageInfo {
  language: Language
  packageManager: string
  lockFile: string | null
  configFile: string
}

export interface OutdatedPackage {
  name: string
  current: string
  wanted: string
  latest: string
  type: 'dependencies' | 'devDependencies'
  hasPatchUpdate: boolean
  isNonBreaking: boolean
  updateType: 'patch' | 'minor' | 'major' | 'unknown'
  language: Language
}

const LANGUAGE_CONFIG: Record<Language, LanguageInfo> = {
  javascript: {
    language: 'javascript',
    packageManager: 'npm',
    lockFile: 'package-lock.json',
    configFile: 'package.json'
  },
  python: {
    language: 'python',
    packageManager: 'pip',
    lockFile: null,
    configFile: 'requirements.txt'
  },
  ruby: {
    language: 'ruby',
    packageManager: 'bundler',
    lockFile: 'Gemfile.lock',
    configFile: 'Gemfile'
  },
  elixir: {
    language: 'elixir',
    packageManager: 'mix',
    lockFile: 'mix.lock',
    configFile: 'mix.exs'
  },
  unknown: {
    language: 'unknown',
    packageManager: '',
    lockFile: null,
    configFile: ''
  }
}

export async function detectLanguages(repoPath: string): Promise<Language[]> {
  const languages: Language[] = []

  const checks = [
    { file: 'package.json', lang: 'javascript' as Language },
    { file: 'requirements.txt', lang: 'python' as Language },
    { file: 'Pipfile', lang: 'python' as Language },
    { file: 'pyproject.toml', lang: 'python' as Language },
    { file: 'Gemfile', lang: 'ruby' as Language },
    { file: 'mix.exs', lang: 'elixir' as Language }
  ]

  for (const check of checks) {
    try {
      await fs.access(path.join(repoPath, check.file))
      if (!languages.includes(check.lang)) {
        languages.push(check.lang)
      }
    } catch {}
  }

  return languages
}

export function getLanguageConfig(lang: Language): LanguageInfo {
  return LANGUAGE_CONFIG[lang]
}

// Python: Parse requirements.txt and get outdated packages
export async function getPythonOutdated(repoPath: string): Promise<OutdatedPackage[]> {
  const packages: OutdatedPackage[] = []

  try {
    // Check for requirements.txt
    const reqPath = path.join(repoPath, 'requirements.txt')
    const content = await fs.readFile(reqPath, 'utf-8')

    // Parse requirements.txt
    const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'))
    const installed: Map<string, string> = new Map()

    for (const line of lines) {
      const match = line.match(/^([a-zA-Z0-9_-]+)==([0-9.]+)/)
      if (match) {
        installed.set(match[1].toLowerCase(), match[2])
      }
    }

    // Get outdated packages using pip
    try {
      const { stdout } = await execAsync('pip list --outdated --format=json', {
        cwd: repoPath,
        timeout: 60000
      })

      const outdated = JSON.parse(stdout || '[]')

      for (const pkg of outdated) {
        const name = pkg.name.toLowerCase()
        if (installed.has(name)) {
          const current = pkg.version
          const latest = pkg.latest_version

          // Parse versions for patch detection
          const currentParts = current.split('.').map(Number)
          const latestParts = latest.split('.').map(Number)

          const hasPatchUpdate =
            currentParts[0] === latestParts[0] &&
            currentParts[1] === latestParts[1] &&
            (currentParts[2] || 0) < (latestParts[2] || 0)

          packages.push({
            name: pkg.name,
            current,
            wanted: latest,
            latest,
            type: 'dependencies',
            hasPatchUpdate,
            isNonBreaking: hasPatchUpdate,
            updateType: hasPatchUpdate ? 'patch' : 'unknown',
            language: 'python'
          })
        }
      }
    } catch (e) {
      console.error('pip list failed:', e)
    }
  } catch {}

  return packages
}

// Ruby: Parse Gemfile.lock and get outdated gems
export async function getRubyOutdated(repoPath: string): Promise<OutdatedPackage[]> {
  const packages: OutdatedPackage[] = []

  try {
    await fs.access(path.join(repoPath, 'Gemfile'))

    // Run bundle outdated
    try {
      const { stdout } = await execAsync('bundle outdated --parseable', {
        cwd: repoPath,
        timeout: 120000
      })

      // Parse output: gem_name (newest x.x.x, installed x.x.x)
      const lines = stdout.split('\n').filter(l => l.trim())

      for (const line of lines) {
        const match = line.match(/^(\S+)\s+\(newest\s+([0-9.]+),\s+installed\s+([0-9.]+)/)
        if (match) {
          const [, name, latest, current] = match

          const currentParts = current.split('.').map(Number)
          const latestParts = latest.split('.').map(Number)

          const hasPatchUpdate =
            currentParts[0] === latestParts[0] &&
            currentParts[1] === latestParts[1] &&
            (currentParts[2] || 0) < (latestParts[2] || 0)

          packages.push({
            name,
            current,
            wanted: latest,
            latest,
            type: 'dependencies',
            hasPatchUpdate,
            isNonBreaking: hasPatchUpdate,
            updateType: hasPatchUpdate ? 'patch' : 'unknown',
            language: 'ruby'
          })
        }
      }
    } catch (e: any) {
      // bundle outdated exits with 1 when there are outdated gems
      if (e.stdout) {
        const lines = e.stdout.split('\n').filter((l: string) => l.trim())
        for (const line of lines) {
          const match = line.match(/^(\S+)\s+\(newest\s+([0-9.]+),\s+installed\s+([0-9.]+)/)
          if (match) {
            const [, name, latest, current] = match
            const currentParts = current.split('.').map(Number)
            const latestParts = latest.split('.').map(Number)
            const hasPatchUpdate =
              currentParts[0] === latestParts[0] &&
              currentParts[1] === latestParts[1] &&
              (currentParts[2] || 0) < (latestParts[2] || 0)

            packages.push({
              name,
              current,
              wanted: latest,
              latest,
              type: 'dependencies',
              hasPatchUpdate,
              isNonBreaking: hasPatchUpdate,
              updateType: hasPatchUpdate ? 'patch' : 'unknown',
              language: 'ruby'
            })
          }
        }
      }
    }
  } catch {}

  return packages
}

// Elixir: Parse mix.lock and get outdated deps
export async function getElixirOutdated(repoPath: string): Promise<OutdatedPackage[]> {
  const packages: OutdatedPackage[] = []

  try {
    await fs.access(path.join(repoPath, 'mix.exs'))

    // Run mix hex.outdated
    try {
      const { stdout } = await execAsync('mix hex.outdated', {
        cwd: repoPath,
        timeout: 120000
      })

      // Parse output
      const lines = stdout.split('\n').filter(l => l.trim())

      for (const line of lines) {
        // Format: dependency    current  latest
        const match = line.match(/^(\S+)\s+([0-9.]+)\s+([0-9.]+)/)
        if (match) {
          const [, name, current, latest] = match

          const currentParts = current.split('.').map(Number)
          const latestParts = latest.split('.').map(Number)

          const hasPatchUpdate =
            currentParts[0] === latestParts[0] &&
            currentParts[1] === latestParts[1] &&
            (currentParts[2] || 0) < (latestParts[2] || 0)

          packages.push({
            name,
            current,
            wanted: latest,
            latest,
            type: 'dependencies',
            hasPatchUpdate,
            isNonBreaking: hasPatchUpdate,
            updateType: hasPatchUpdate ? 'patch' : 'unknown',
            language: 'elixir'
          })
        }
      }
    } catch (e) {
      console.error('mix hex.outdated failed:', e)
    }
  } catch {}

  return packages
}

// Update functions for each language
export async function updatePythonPackages(repoPath: string, packages: string[]): Promise<{ updated: string[], failed: string[] }> {
  const updated: string[] = []
  const failed: string[] = []

  const reqPath = path.join(repoPath, 'requirements.txt')

  try {
    let content = await fs.readFile(reqPath, 'utf-8')

    for (const pkg of packages) {
      try {
        // Update single package
        await execAsync(`pip install --upgrade ${pkg}`, { cwd: repoPath, timeout: 60000 })

        // Get new version
        const { stdout } = await execAsync(`pip show ${pkg} | grep Version`, { cwd: repoPath })
        const version = stdout.match(/Version:\s*([0-9.]+)/)?.[1]

        if (version) {
          // Update requirements.txt
          const regex = new RegExp(`^${pkg}==.+$`, 'mi')
          content = content.replace(regex, `${pkg}==${version}`)
          updated.push(pkg)
        }
      } catch {
        failed.push(pkg)
      }
    }

    await fs.writeFile(reqPath, content)
  } catch (e) {
    console.error('Python update failed:', e)
  }

  return { updated, failed }
}

export async function updateRubyPackages(repoPath: string, packages: string[]): Promise<{ updated: string[], failed: string[] }> {
  const updated: string[] = []
  const failed: string[] = []

  for (const pkg of packages) {
    try {
      await execAsync(`bundle update ${pkg} --patch`, { cwd: repoPath, timeout: 120000 })
      updated.push(pkg)
    } catch {
      failed.push(pkg)
    }
  }

  return { updated, failed }
}

export async function updateElixirPackages(repoPath: string, packages: string[]): Promise<{ updated: string[], failed: string[] }> {
  const updated: string[] = []
  const failed: string[] = []

  for (const pkg of packages) {
    try {
      await execAsync(`mix deps.update ${pkg}`, { cwd: repoPath, timeout: 120000 })
      updated.push(pkg)
    } catch {
      failed.push(pkg)
    }
  }

  return { updated, failed }
}

// Get clean install command for language
export function getCleanInstallCommand(lang: Language): string {
  switch (lang) {
    case 'javascript':
      return 'rm -rf node_modules package-lock.json && npm install && npm update && rm -rf node_modules package-lock.json && npm install'
    case 'python':
      return 'pip install -r requirements.txt --upgrade'
    case 'ruby':
      return 'rm -rf .bundle vendor/bundle && bundle install'
    case 'elixir':
      return 'rm -rf deps _build && mix deps.get && mix compile'
    default:
      return ''
  }
}

// Get test command for language
export function getTestCommand(lang: Language): string | null {
  switch (lang) {
    case 'javascript':
      return 'npm test'
    case 'python':
      return 'pytest || python -m pytest || python -m unittest discover'
    case 'ruby':
      return 'bundle exec rspec || bundle exec rake test'
    case 'elixir':
      return 'mix test'
    default:
      return null
  }
}

// Get lint command for language
export function getLintCommand(lang: Language): string | null {
  switch (lang) {
    case 'javascript':
      return 'npm run lint || npx eslint .'
    case 'python':
      return 'flake8 || pylint . || ruff check .'
    case 'ruby':
      return 'bundle exec rubocop'
    case 'elixir':
      return 'mix credo'
    default:
      return null
  }
}

// Get files to commit after update
export function getFilesToCommit(lang: Language): string[] {
  switch (lang) {
    case 'javascript':
      return ['package.json', 'package-lock.json']
    case 'python':
      return ['requirements.txt', 'Pipfile.lock', 'poetry.lock']
    case 'ruby':
      return ['Gemfile', 'Gemfile.lock']
    case 'elixir':
      return ['mix.exs', 'mix.lock']
    default:
      return []
  }
}
