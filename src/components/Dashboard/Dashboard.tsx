import { useRepositories } from '../../contexts/RepositoryContext'
import { useScanContext, type ScanTab } from '../../contexts/ScanContext'
import type { View } from '../../types'

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

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { repositories, selectedRepo, addRepository, removeRepository, selectRepository } = useRepositories()
  const { scanResults, requestScan, setPreferredTab } = useScanContext()

  const scanResult = selectedRepo ? scanResults[selectedRepo.path] : null
  const lastScan = scanResult ? formatRelativeTime(scanResult.scanDate) : 'Never'
  const tdScore = scanResult?.consoleUpload?.tdScore
  const tdDelta = scanResult?.consoleUpload?.tdDelta

  const navigateToScan = (tab: ScanTab, autoRun = false) => {
    setPreferredTab(tab)
    if (autoRun && selectedRepo) {
      requestScan(selectedRepo.path)
    }
    onNavigate('full-scan')
  }

  const handleImport = async () => {
    const path = await window.bridge.selectDirectory()
    if (path) {
      await addRepository(path)
    }
  }

  return (
    <div className="fade-in">
      <div className="dashboard-hero">
        <div>
          <h2>Bridge-Desktop</h2>
          <p>Automated technical debt reduction and metrics pipeline.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => onNavigate('settings')}>
          Settings
        </button>
      </div>

      <div className="dashboard-summary">
        <div className="card">
          <div className="summary-label">Selected Repo</div>
          <div className="summary-value">{selectedRepo?.name || 'None selected'}</div>
          <div className="summary-sub">{selectedRepo?.path || 'Import a repository to begin.'}</div>
        </div>
        <div className="card">
          <div className="summary-label">Last Scan</div>
          <div className="summary-value">{lastScan}</div>
          <div className="summary-sub">Run a full TD scan to update.</div>
        </div>
        <div className="card">
          <div className="summary-label">TD Score</div>
          <div className="summary-value">
            {tdScore ?? '—'}
            {typeof tdDelta === 'number' && (
              <span className={`delta ${tdDelta >= 0 ? 'delta-up' : 'delta-down'}`}>
                {tdDelta >= 0 ? '+' : ''}{tdDelta}
              </span>
            )}
          </div>
          <div className="summary-sub">Bridge-Console</div>
        </div>
      </div>

      <div className="dashboard-actions">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="action-grid">
            <button className="btn btn-primary" onClick={() => navigateToScan('overview', true)} disabled={!selectedRepo}>
              Run Full Scan
            </button>
            <button className="btn btn-secondary" onClick={() => navigateToScan('dead-code')} disabled={!selectedRepo}>
              Remove Dead Code
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('patch-batch')}>
              Update Dependencies
            </button>
            <button className="btn btn-secondary" onClick={() => navigateToScan('circular')} disabled={!selectedRepo}>
              Fix Circular Deps
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Issues</h3>
          </div>
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
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Repositories</h3>
          <button className="btn btn-primary btn-sm" onClick={handleImport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Import
          </button>
        </div>

        {repositories.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            <h3 className="empty-state-title">No repositories yet</h3>
            <p className="empty-state-desc">Import a repository to get started</p>
            <button className="btn btn-primary" onClick={handleImport}>
              Import Repository
            </button>
          </div>
        ) : (
          <div className="repo-grid">
            {repositories.map(repo => (
              <div
                key={repo.path}
                className={`repo-card ${selectedRepo?.path === repo.path ? 'active' : ''}`}
                onClick={() => { selectRepository(repo); onNavigate('full-scan') }}
              >
                <div>
                  <div className="repo-title">{repo.name}</div>
                  <div className="repo-path">{repo.path}</div>
                </div>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={(e) => { e.stopPropagation(); removeRepository(repo.path) }}
                  title="Remove repository"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
