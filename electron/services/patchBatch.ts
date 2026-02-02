import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import * as semver from 'semver'

const execAsync = promisify(exec)

export interface OutdatedPackage {
  name: string
  current: string
  wanted: string
  latest: string
  type: 'dependencies' | 'devDependencies'
  hasPatchUpdate: boolean
}

export interface PatchBatchResult {
  updated: string[]
  failed: string[]
}

export async function getOutdatedPackages(repoPath: string): Promise<OutdatedPackage[]> {
  try {
    // Read package.json to know which are dev dependencies
    const packageJsonPath = path.join(repoPath, 'package.json')
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageJsonContent)

    const devDeps = new Set(Object.keys(packageJson.devDependencies || {}))

    // Run npm outdated
    let outdatedJson: string
    try {
      const { stdout } = await execAsync('npm outdated --json', { cwd: repoPath })
      outdatedJson = stdout
    } catch (error: any) {
      // npm outdated exits with code 1 when there are outdated packages
      outdatedJson = error.stdout || '{}'
    }

    const outdated = JSON.parse(outdatedJson || '{}')

    const packages: OutdatedPackage[] = []

    for (const [name, info] of Object.entries(outdated) as [string, any][]) {
      const current = info.current || '0.0.0'
      const wanted = info.wanted || current
      const latest = info.latest || wanted

      // Check if there's a patch update available
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
        hasPatchUpdate
      })
    }

    // Sort: packages with patch updates first
    return packages.sort((a, b) => {
      if (a.hasPatchUpdate && !b.hasPatchUpdate) return -1
      if (!a.hasPatchUpdate && b.hasPatchUpdate) return 1
      return a.name.localeCompare(b.name)
    })
  } catch (error) {
    console.error('Error getting outdated packages:', error)
    return []
  }
}

export async function runPatchBatch(
  repoPath: string,
  packages: string[]
): Promise<PatchBatchResult> {
  const updated: string[] = []
  const failed: string[] = []

  // Read current package.json
  const packageJsonPath = path.join(repoPath, 'package.json')
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)

  // Get current versions of requested packages
  const outdated = await getOutdatedPackages(repoPath)
  const outdatedMap = new Map(outdated.map(p => [p.name, p]))

  // Update package.json with patch versions
  for (const pkgName of packages) {
    const pkg = outdatedMap.get(pkgName)
    if (!pkg || !pkg.hasPatchUpdate) {
      failed.push(pkgName)
      continue
    }

    // Update the version in package.json
    if (packageJson.dependencies?.[pkgName]) {
      // Preserve the version prefix (^, ~, etc)
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

  // Write updated package.json
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

  // Run the clean install script
  const cleanInstallScript = 'rm -rf node_modules package-lock.json && npm install && npm update && rm -rf node_modules package-lock.json && npm install'

  try {
    await execAsync(cleanInstallScript, {
      cwd: repoPath,
      timeout: 300000 // 5 minute timeout
    })
  } catch (error) {
    console.error('Clean install failed:', error)
    throw new Error('Clean install script failed')
  }

  return { updated, failed }
}
