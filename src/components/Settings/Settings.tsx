import { useEffect, useState } from 'react'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import type { BridgeConsoleSettings } from '../../types'

const emptySettings: BridgeConsoleSettings = {
  consoleUrl: 'http://localhost:3000',
  apiToken: '',
  githubUsername: '',
  autoUpload: true
}

export default function Settings() {
  const { settings: appSettings, saveSettings: saveAppSettings, loading: appSettingsLoading } = useAppSettings()
  const [settings, setSettings] = useState<BridgeConsoleSettings>(emptySettings)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [savingAppSettings, setSavingAppSettings] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await window.bridge.getBridgeConsoleSettings()
        setSettings(stored)
      } catch {
        setSettings(emptySettings)
      }
    }

    void loadSettings()
  }, [])

  const updateField = (field: keyof BridgeConsoleSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const saveSettings = async () => {
    try {
      await window.bridge.saveBridgeConsoleSettings(settings)
      setMessage('Settings saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save settings')
    }
  }

  const testConnection = async () => {
    setConnectionStatus('testing')
    setMessage(null)

    try {
      const result = await window.bridge.testBridgeConsoleConnection(settings)
      if (result.ok) {
        setConnectionStatus('success')
        await window.bridge.saveBridgeConsoleSettings(settings)
      } else {
        setConnectionStatus('error')
        setMessage(result.message || 'Connection failed')
      }
    } catch (error) {
      setConnectionStatus('error')
      setMessage(error instanceof Error ? error.message : 'Connection failed')
    }
  }

  const toggleExperimentalFeatures = async (enabled: boolean) => {
    setSavingAppSettings(true)
    try {
      await saveAppSettings({ experimentalFeatures: enabled })
      setMessage('App settings saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save app settings')
    } finally {
      setSavingAppSettings(false)
    }
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '6px' }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Configure Bridge-Console integration and upload preferences.
        </p>
      </div>

      <div className="settings-grid">
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Bridge-Console Connection</h3>

          <div className="form-group">
            <label>Console URL</label>
            <input
              type="text"
              value={settings.consoleUrl}
              onChange={(e) => updateField('consoleUrl', e.target.value)}
              placeholder="https://bridge-console.your-org.com"
            />
          </div>

          <div className="form-group">
            <label>API Token</label>
            <input
              type="password"
              value={settings.apiToken}
              onChange={(e) => updateField('apiToken', e.target.value)}
              placeholder="Paste your Bridge-Console token"
            />
          </div>

          <div className="form-group">
            <label>GitHub Username</label>
            <input
              type="text"
              value={settings.githubUsername}
              onChange={(e) => updateField('githubUsername', e.target.value)}
              placeholder="cmccoy02"
            />
          </div>

          <label className="simple-checkbox">
            <input
              type="checkbox"
              checked={settings.autoUpload}
              onChange={(e) => updateField('autoUpload', e.target.checked)}
            />
            <span className="checkbox-label">Auto-upload scans after each run</span>
          </label>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="btn btn-secondary" onClick={saveSettings}>
              Save Settings
            </button>
            <button className="btn btn-primary" onClick={testConnection}>
              {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {connectionStatus === 'success' && (
            <div className="alert success" style={{ marginTop: '16px' }}>Connected to Bridge-Console.</div>
          )}
          {connectionStatus === 'error' && (
            <div className="alert error" style={{ marginTop: '16px' }}>Connection failed. {message}</div>
          )}
          {message && connectionStatus === 'idle' && (
            <div className="alert" style={{ marginTop: '16px' }}>{message}</div>
          )}
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Automation Notes</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Scheduled scans will upload automatically when auto-upload is enabled. Configure smart scheduling from the Scheduler view.
          </p>
          <div className="alert warn">
            For security, tokens are stored locally on this machine using Electron Store.
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Feature Flags</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Experimental features include Security Scan and Full TD Scan. Keep disabled for a simplified out-of-the-box workflow.
          </p>
          <label className="simple-checkbox">
            <input
              type="checkbox"
              checked={appSettings.experimentalFeatures}
              onChange={(e) => toggleExperimentalFeatures(e.target.checked)}
              disabled={appSettingsLoading || savingAppSettings}
            />
            <span className="checkbox-label">
              Enable experimental features
            </span>
          </label>
          <div style={{ marginTop: '10px', color: 'var(--text-tertiary)', fontSize: '12px' }}>
            Default: disabled
          </div>
          <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            First-run checklist: {appSettings.onboardingCompleted ? 'completed' : 'pending'}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: '8px' }}
            onClick={async () => {
              await saveAppSettings({ onboardingCompleted: false })
              setMessage('First-run checklist reset.')
            }}
          >
            Reset First-Run Checklist
          </button>
        </div>
      </div>
    </div>
  )
}
