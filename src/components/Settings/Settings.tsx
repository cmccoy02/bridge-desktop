import { useEffect, useState } from 'react'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { BridgeConsoleSettings } from '../../types'

const emptySettings: BridgeConsoleSettings = {
  consoleUrl: 'http://localhost:3000',
  apiToken: '',
  githubUsername: '',
  autoUpload: true
}

export default function Settings() {
  const { settings: appSettings, saveSettings: saveAppSettings, loading: appSettingsLoading } = useAppSettings()
  const { repositories, selectedRepo } = useRepositories()
  const [settings, setSettings] = useState<BridgeConsoleSettings>(emptySettings)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [savingAppSettings, setSavingAppSettings] = useState(false)
  const [bridgeConfigRepoPath, setBridgeConfigRepoPath] = useState<string>('')
  const [bridgeConfigText, setBridgeConfigText] = useState('')
  const [bridgeConfigDirty, setBridgeConfigDirty] = useState(false)
  const [bridgeConfigLoading, setBridgeConfigLoading] = useState(false)
  const [bridgeConfigMessage, setBridgeConfigMessage] = useState<string | null>(null)

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

  useEffect(() => {
    if (selectedRepo?.path) {
      setBridgeConfigRepoPath(selectedRepo.path)
      return
    }
    if (!bridgeConfigRepoPath && repositories.length > 0) {
      setBridgeConfigRepoPath(repositories[0].path)
    }
  }, [selectedRepo?.path, repositories, bridgeConfigRepoPath])

  useEffect(() => {
    const loadBridgeConfig = async () => {
      if (!bridgeConfigRepoPath) {
        setBridgeConfigText('')
        setBridgeConfigDirty(false)
        return
      }
      setBridgeConfigLoading(true)
      setBridgeConfigMessage(null)
      try {
        const config = await window.bridge.loadBridgeConfig(bridgeConfigRepoPath)
        setBridgeConfigText(`${JSON.stringify(config, null, 2)}\n`)
        setBridgeConfigDirty(false)
      } catch (error) {
        setBridgeConfigMessage(error instanceof Error ? error.message : 'Failed to load .bridge.json')
      } finally {
        setBridgeConfigLoading(false)
      }
    }

    void loadBridgeConfig()
  }, [bridgeConfigRepoPath])

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

  const saveBridgeConfig = async () => {
    if (!bridgeConfigRepoPath) return
    setBridgeConfigMessage(null)
    let parsed: unknown
    try {
      parsed = JSON.parse(bridgeConfigText)
    } catch (error) {
      setBridgeConfigMessage(`Invalid JSON: ${error instanceof Error ? error.message : 'parse error'}`)
      return
    }

    try {
      const saved = await window.bridge.saveBridgeConfig(bridgeConfigRepoPath, parsed as any)
      setBridgeConfigText(`${JSON.stringify(saved, null, 2)}\n`)
      setBridgeConfigDirty(false)
      setBridgeConfigMessage('Saved .bridge.json')
    } catch (error) {
      setBridgeConfigMessage(error instanceof Error ? error.message : 'Failed to save .bridge.json')
    }
  }

  const initializeBridgeConfig = async () => {
    if (!bridgeConfigRepoPath) return
    setBridgeConfigLoading(true)
    setBridgeConfigMessage(null)
    try {
      const generated = await window.bridge.generateBridgeConfig(bridgeConfigRepoPath)
      setBridgeConfigText(`${JSON.stringify(generated, null, 2)}\n`)
      setBridgeConfigDirty(false)
      setBridgeConfigMessage('Generated .bridge.json for this repository')
    } catch (error) {
      setBridgeConfigMessage(error instanceof Error ? error.message : 'Failed to generate .bridge.json')
    } finally {
      setBridgeConfigLoading(false)
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

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>.bridge.json Editor</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Scope: one <code>.bridge.json</code> per repository. Bridge reads and writes this file at each repo root.
          </p>

          <div className="form-group">
            <label>Repository</label>
            <select
              value={bridgeConfigRepoPath}
              onChange={e => setBridgeConfigRepoPath(e.target.value)}
              disabled={repositories.length === 0}
            >
              {repositories.length === 0 && (
                <option value="">No repositories available</option>
              )}
              {repositories.map(repo => (
                <option key={repo.path} value={repo.path}>
                  {repo.name} — {repo.path}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Config JSON</label>
            <textarea
              value={bridgeConfigText}
              onChange={e => {
                setBridgeConfigText(e.target.value)
                setBridgeConfigDirty(true)
              }}
              rows={18}
              placeholder={bridgeConfigLoading ? 'Loading...' : 'Select a repository to edit .bridge.json'}
              disabled={!bridgeConfigRepoPath || bridgeConfigLoading}
              style={{ fontFamily: 'monospace', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={initializeBridgeConfig} disabled={!bridgeConfigRepoPath || bridgeConfigLoading}>
              Generate
            </button>
            <button className="btn btn-primary" onClick={saveBridgeConfig} disabled={!bridgeConfigRepoPath || bridgeConfigLoading || !bridgeConfigDirty}>
              Save .bridge.json
            </button>
          </div>

          {bridgeConfigMessage && (
            <div className="alert" style={{ marginTop: '12px' }}>
              {bridgeConfigMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
