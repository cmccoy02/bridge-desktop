import fs from 'fs/promises'
import path from 'path'

export interface BridgePatchConfig {
  createPR?: boolean
  runTests?: boolean
  testCommand?: string
  branchPrefix?: string
  baseBranch?: string
  remoteFirst?: boolean
}

export interface BridgeProjectConfig {
  baseBranch?: string
  branchPrefix?: string
  patch?: BridgePatchConfig
}

export interface BridgeProjectConfigResult {
  exists: boolean
  path: string
  config: BridgeProjectConfig
  errors: string[]
}

const CONFIG_FILE_NAME = '.bridge.json'

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function sanitizeBranch(value: unknown): string | undefined {
  const branch = asString(value)
  if (!branch) return undefined
  if (!/^[A-Za-z0-9._/-]+$/.test(branch)) return undefined
  return branch
}

function normalizePatchConfig(rawPatch: unknown): BridgePatchConfig {
  const patchConfig = (rawPatch && typeof rawPatch === 'object') ? rawPatch as Record<string, unknown> : {}
  return {
    createPR: asBoolean(patchConfig.createPR),
    runTests: asBoolean(patchConfig.runTests),
    testCommand: asString(patchConfig.testCommand),
    branchPrefix: asString(patchConfig.branchPrefix),
    baseBranch: sanitizeBranch(patchConfig.baseBranch),
    remoteFirst: asBoolean(patchConfig.remoteFirst)
  }
}

export async function loadBridgeProjectConfig(repoPath: string): Promise<BridgeProjectConfigResult> {
  const configPath = path.join(repoPath, CONFIG_FILE_NAME)
  const result: BridgeProjectConfigResult = {
    exists: false,
    path: configPath,
    config: {},
    errors: []
  }

  try {
    await fs.access(configPath)
    result.exists = true
  } catch {
    return result
  }

  try {
    const raw = await fs.readFile(configPath, 'utf-8')
    const parsed = JSON.parse(raw) as Record<string, unknown>
    result.config = {
      baseBranch: sanitizeBranch(parsed.baseBranch),
      branchPrefix: asString(parsed.branchPrefix),
      patch: normalizePatchConfig(parsed.patch)
    }
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Failed to parse .bridge.json')
  }

  return result
}
