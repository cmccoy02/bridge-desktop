import { useEffect, useMemo, useState } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import { useScanContext, type ScanTab } from '../../contexts/ScanContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import type { ActionItem, BridgeProjectConfigResult, TechDebtScore, View } from '../../types'

interface DashboardProps {
  onNavigate: (view: View) => void
}

const formatRelativeTime = (iso?: string | null) => {
  if (!iso) return 'Never'
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const gradeColorMap: Record<TechDebtScore['grade'], string> = {
  A: '#22c55e',
  B: '#14b8a6',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444'
}

const trendMeta: Record<TechDebtScore['trend'], { arrow: string; label: string; color: string }> = {
  improving: { arrow: '↓', label: 'improving', color: 'var(--success)' },
  stable: { arrow: '→', label: 'stable', color: 'var(--text-secondary)' },
  declining: { arrow: '↑', label: 'declining', color: 'var(--error)' },
  unknown: { arrow: '•', label: 'unknown', color: 'var(--text-tertiary)' }
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const {
    repositories,
    selectedRepo,
    codeDirectory,
    selectRepository,
    selectAndScanCodeDirectory,
    scanCodeDirectory
  } = useRepositories()
  const { scanResults, requestScan, setPreferredTab } = useScanContext()
  const { settings, saveSettings } = useAppSettings()
  const [repoRemote, setRepoRemote] = useState<string | null>(null)
  const [projectConfig, setProjectConfig] = useState<BridgeProjectConfigResult | null>(null)
  const [initializingConfig, setInitializingConfig] = useState(false)

  const scanResult = selectedRepo ? scanResults[selectedRepo.path] : null
  const lastScan = scanResult ? formatRelativeTime(scanResult.scanDate) : 'Never'
  const debtScore = scanResult?.techDebtScore
  const grade = debtScore?.grade
  const trend = debtScore?.trend || 'unknown'

  const navigateToScan = (tab: ScanTab, autoRun = false) => {
    setPreferredTab(tab)
    if (autoRun && selectedRepo) {
      requestScan(selectedRepo.path)
    }
    onNavigate('full-scan')
  }

  useEffect(() => {
    const loadRepoInfo = async () => {
      if (!selectedRepo?.path) {
        setRepoRemote(null)
        setProjectConfig(null)
        return
      }
      try {
        const [info, config] = await Promise.all([
          window.bridge.getRepoInfo(selectedRepo.path),
          window.bridge.getBridgeProjectConfig(selectedRepo.path)
        ])
        setRepoRemote(info.remote)
        setProjectConfig(config)
      } catch {
        setRepoRemote(null)
        setProjectConfig(null)
      }
    }
    void loadRepoInfo()
  }, [selectedRepo?.path])

  const handleSelectCodeDirectory = async () => {
    await selectAndScanCodeDirectory()
  }

  const initializeBridgeConfig = async () => {
    if (!selectedRepo) return
    setInitializingConfig(true)
    try {
      await window.bridge.generateBridgeConfig(selectedRepo.path)
      const config = await window.bridge.getBridgeProjectConfig(selectedRepo.path)
      setProjectConfig(config)
    } finally {
      setInitializingConfig(false)
    }
  }

  const firstRunReady = Boolean(codeDirectory && repositories.length > 0 && selectedRepo?.hasGit)

  const completeOnboarding = async () => {
    await saveSettings({ onboardingCompleted: true })
  }

  const dimensionBars = useMemo(() => {
    if (!debtScore) return []
    return Object.entries(debtScore.dimensions).map(([name, dimension]) => ({
      name,
      score: dimension.score,
      weighted: dimension.weightedScore
    }))
  }, [debtScore])

  const handleActionFix = (item: ActionItem) => {
    if (item.dimension === 'dependencies' || item.command?.includes('npm')) {
      onNavigate('patch-batch')
      return
    }
    setPreferredTab('overview')
    onNavigate('full-scan')
  }

  return (
    <div className="fade-in">
      <div className="dashboard-hero">
        <div>
          <h2>Bridge-Desktop</h2>
          <p>Technical debt orchestration and agent-ready scan intelligence.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => onNavigate('settings')}>
          Settings
        </button>
      </div>

      <div className="dashboard-summary">
        <div className="card">
          <div className="summary-label">Selected Repo</div>
          <div className="summary-value">{selectedRepo?.name || 'None selected'}</div>
          <div className="summary-sub">{selectedRepo?.path || 'Select a code directory to begin.'}</div>
        </div>
        <div className="card">
          <div className="summary-label">Last Scan</div>
          <div className="summary-value">{lastScan}</div>
          <div className="summary-sub">Run full scan to refresh debt model.</div>
        </div>
        <div className="card">
          <div className="summary-label">Tech Debt Score</div>
          <div className="summary-value" style={{ color: grade ? gradeColorMap[grade] : 'var(--text-primary)' }}>
            {debtScore ? debtScore.total.toFixed(1) : '—'}
            {grade && <span className="badge" style={{ marginLeft: '8px' }}>{grade}</span>}
          </div>
          <div className="summary-sub" style={{ color: trendMeta[trend].color }}>
            {trendMeta[trend].arrow} {trendMeta[trend].label}
          </div>
        </div>
      </div>

      {!settings.onboardingCompleted && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">First-Run Checklist</h3>
            <button
              className="btn btn-primary btn-sm"
              disabled={!firstRunReady}
              onClick={completeOnboarding}
            >
              Mark Complete
            </button>
          </div>
          <div className="issue-list">
            <div className="issue-item">{codeDirectory ? '1. Code directory selected.' : '1. Select your code directory.'}</div>
            <div className="issue-item">{repositories.length > 0 ? '2. Repositories discovered.' : '2. Scan for repositories.'}</div>
            <div className="issue-item">{selectedRepo?.hasGit ? '3. Git repository selected.' : '3. Select a git repository.'}</div>
            <div className="issue-item">4. Run full scan and review the debt score and top contributors.</div>
            <div className="issue-item">5. Run one-click dependency patching and verify tests pass.</div>
          </div>
        </div>
      )}

      {selectedRepo && projectConfig && !projectConfig.exists && (
        <div className="card" style={{ marginTop: '24px', borderColor: 'var(--accent)' }}>
          <div className="card-header">
            <h3 className="card-title">Initialize Bridge</h3>
            <button className="btn btn-primary btn-sm" onClick={initializeBridgeConfig} disabled={initializingConfig}>
              {initializingConfig ? 'Generating...' : 'Create .bridge.json'}
            </button>
          </div>
          <div className="issue-list">
            <div className="issue-item">No `.bridge.json` detected in this repo.</div>
            <div className="issue-item">Initialize config to define update policy, gates, scan features, and agent context.</div>
          </div>
        </div>
      )}

      {!scanResult && selectedRepo && (
        <div className="card" style={{ marginTop: '24px', borderColor: 'var(--accent)' }}>
          <div className="card-header">
            <h3 className="card-title">Run First Scan</h3>
            <button className="btn btn-primary btn-sm" onClick={() => navigateToScan('overview', true)}>
              Run Full Scan
            </button>
          </div>
          <div className="issue-list">
            <div className="issue-item">This repository has no scan report yet.</div>
            <div className="issue-item">Run a full scan to generate score, top contributors, and action items.</div>
          </div>
        </div>
      )}

      {scanResult && debtScore && (
        <div className="dashboard-actions" style={{ marginTop: '24px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dimension Breakdown</h3>
            </div>
            <div className="bar-list">
              {dimensionBars.map(item => (
                <div key={item.name} className="bar-item">
                  <div className="bar-meta">
                    <span>{item.name}</span>
                    <span>{item.score.toFixed(1)}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Top Contributors</h3>
            </div>
            <div className="issue-list">
              {debtScore.topContributors.slice(0, 5).map((item, index) => (
                <div key={`${item.dimension}-${index}`} className="issue-item" style={{ justifyContent: 'space-between' }}>
                  <span>{item.description}</span>
                  <strong>+{item.impact}</strong>
                </div>
              ))}
              {debtScore.topContributors.length === 0 && (
                <div className="issue-item">No major contributors detected.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {scanResult && debtScore && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">Prioritized Action Items</h3>
          </div>
          <div className="issue-list">
            {debtScore.actionItems.slice(0, 8).map(item => (
              <div key={`${item.priority}-${item.title}`} className="issue-item" style={{ alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    #{item.priority} {item.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {item.dimension} · impact {item.impact} · effort {item.effort}
                  </div>
                </div>
                {item.automatable && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleActionFix(item)}>
                    Fix
                  </button>
                )}
              </div>
            ))}
            {debtScore.actionItems.length === 0 && (
              <div className="issue-item">No action items generated yet.</div>
            )}
          </div>
        </div>
      )}

      <div className="dashboard-actions" style={{ marginTop: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="action-grid">
            {settings.experimentalFeatures && (
              <button className="btn btn-primary" onClick={() => navigateToScan('overview', true)} disabled={!selectedRepo}>
                Run Full Scan
              </button>
            )}
            {settings.experimentalFeatures && (
              <button className="btn btn-secondary" onClick={() => navigateToScan('dead-code')} disabled={!selectedRepo}>
                Remove Dead Code
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => onNavigate('patch-batch')}>
              Update Dependencies
            </button>
            {settings.experimentalFeatures && (
              <button className="btn btn-secondary" onClick={() => navigateToScan('circular')} disabled={!selectedRepo}>
                Fix Circular Deps
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Issues</h3>
          </div>
          {settings.experimentalFeatures ? (
            <>
              <div className="issue-list">
                <div className="issue-item">
                  <span>🔴 {scanResult?.circularDependencies.count ?? 0} circular dependencies</span>
                </div>
                <div className="issue-item">
                  <span>🟡 {scanResult?.dependencies.outdated.length ?? 0} outdated packages</span>
                </div>
                <div className="issue-item">
                  <span>🟡 {scanResult?.deadCode.deadFiles.length ?? 0} dead code files</span>
                </div>
                <div className="issue-item">
                  <span>🟢 Test coverage: {scanResult?.testCoverage.coveragePercentage ?? '—'}%</span>
                </div>
              </div>
              <button className="btn btn-ghost" onClick={() => navigateToScan('overview')} disabled={!selectedRepo}>
                View Details →
              </button>
            </>
          ) : (
            <div className="issue-list">
              <div className="issue-item">
                <span>Experimental scans are disabled.</span>
              </div>
              <div className="issue-item">
                <span>Enable them in Settings to unlock TD/security scanning.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Preflight</h3>
        </div>
        {!selectedRepo ? (
          <div className="issue-list">
            <div className="issue-item">Select a repository to run environment checks.</div>
          </div>
        ) : (
          <div className="issue-list">
            <div className="issue-item">
              {selectedRepo.hasGit ? 'Git repository detected.' : 'Repository is not a git repo.'}
            </div>
            <div className="issue-item">
              {repoRemote ? `Remote detected: ${repoRemote}` : 'No git remote configured.'}
            </div>
            <div className="issue-item">
              Bridge updates are executed from remote-first source-of-truth when configured.
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Repositories</h3>
          <button className="btn btn-primary btn-sm" onClick={handleSelectCodeDirectory}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {codeDirectory ? 'Change Code Directory' : 'Select Code Directory'}
          </button>
        </div>

        {codeDirectory && (
          <div className="alert" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Code directory: {codeDirectory}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => scanCodeDirectory()}>
              Refresh
            </button>
          </div>
        )}

        {repositories.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            <h3 className="empty-state-title">No repositories yet</h3>
            <p className="empty-state-desc">Select a code directory to discover git repositories.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={handleSelectCodeDirectory}>
                Select Code Directory
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="repo-grid">
              {repositories.map(repo => (
                <div
                  key={repo.path}
                  className={`repo-card ${selectedRepo?.path === repo.path ? 'active' : ''}`}
                  onClick={() => { selectRepository(repo); onNavigate(settings.experimentalFeatures ? 'full-scan' : 'patch-batch') }}
                >
                  <div>
                    <div className="repo-title">{repo.name}</div>
                    <div className="repo-path">{repo.path}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
