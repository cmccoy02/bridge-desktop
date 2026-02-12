import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AppSettings } from '../types'

interface AppSettingsContextType {
  settings: AppSettings
  loading: boolean
  saveSettings: (next: Partial<AppSettings>) => Promise<void>
}

const defaultSettings: AppSettings = {
  experimentalFeatures: false,
  onboardingCompleted: false
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined)

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await window.bridge.getAppSettings()
        setSettings(stored)
      } catch {
        setSettings(defaultSettings)
      } finally {
        setLoading(false)
      }
    }
    void loadSettings()
  }, [])

  const saveSettings = async (next: Partial<AppSettings>) => {
    const saved = await window.bridge.saveAppSettings(next)
    setSettings(saved)
  }

  const value = useMemo(() => ({
    settings,
    loading,
    saveSettings
  }), [settings, loading])

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  )
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext)
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider')
  }
  return context
}
