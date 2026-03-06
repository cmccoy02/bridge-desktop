import fs from 'fs/promises'
import path from 'path'
import { loadBridgeConfig } from './bridgeConfig'

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
    const fullConfig = await loadBridgeConfig(repoPath)
    result.config = {
      baseBranch: undefined,
      branchPrefix: asString((fullConfig as any).branchPrefix) || 'bridge-update-deps',
      patch: {
        createPR: asBoolean((fullConfig as any)?.patch?.createPR),
        runTests: fullConfig.gates.tests.required,
        testCommand: fullConfig.gates.tests.command,
        branchPrefix: asString((fullConfig as any)?.patch?.branchPrefix || (fullConfig as any)?.branchPrefix) || 'bridge-update-deps',
        baseBranch: sanitizeBranch((fullConfig as any)?.patch?.baseBranch || (fullConfig as any)?.baseBranch),
        remoteFirst: asBoolean((fullConfig as any)?.patch?.remoteFirst)
      }
    }

    const raw = await fs.readFile(configPath, 'utf-8')
    const parsed = JSON.parse(raw) as Record<string, unknown>
    result.config.baseBranch = sanitizeBranch(parsed.baseBranch) || result.config.patch?.baseBranch
    result.config.branchPrefix = asString(parsed.branchPrefix) || result.config.patch?.branchPrefix
    result.config.patch = {
      ...result.config.patch,
      ...normalizePatchConfig(parsed.patch)
    }
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Failed to parse .bridge.json')
  }

  return result
}
