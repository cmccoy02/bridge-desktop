import { createBridgeStore } from './store'

export interface AppSettings {
  experimentalFeatures: boolean
  onboardingCompleted: boolean
}

const store = createBridgeStore('bridge-app-settings')
const SETTINGS_KEY = 'bridge-app-settings'

const defaultSettings: AppSettings = {
  experimentalFeatures: false,
  onboardingCompleted: false
}

export function getAppSettings(): AppSettings {
  return store.get(SETTINGS_KEY, defaultSettings) as AppSettings
}

export function saveAppSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getAppSettings()
  const next = {
    ...current,
    ...settings
  }
  store.set(SETTINGS_KEY, next)
  return next
}

export function isExperimentalFeaturesEnabled(): boolean {
  return getAppSettings().experimentalFeatures
}
