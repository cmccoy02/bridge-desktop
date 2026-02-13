import Store from 'electron-store'
import { app } from 'electron'
import os from 'os'
import path from 'path'
import fs from 'fs'

function resolveStoreCwd(): string {
  try {
    const userData = app.getPath('userData')
    if (userData) {
      fs.mkdirSync(userData, { recursive: true })
      return userData
    }
  } catch {
    // Fall through to home directory fallback.
  }

  const fallback = path.join(os.homedir(), '.bridge-desktop')
  fs.mkdirSync(fallback, { recursive: true })
  return fallback
}

export function createBridgeStore<T extends Record<string, unknown> = Record<string, unknown>>(name: string): Store<T> {
  return new Store<T>({
    name,
    cwd: resolveStoreCwd(),
    clearInvalidConfig: true
  })
}

