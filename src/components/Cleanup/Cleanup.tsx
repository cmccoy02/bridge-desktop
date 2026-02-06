import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { CleanupReport, FileSizeStats, DeadCodeReport } from '../../types'

export default function Cleanup() {
  const { selectedRepo } = useRepositories()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<FileSizeStats | null>(null)
  const [report, setReport] = useState<CleanupReport | null>(null)
  const [activeTab, setActiveTab] = useState<'files' | 'git-history' | 'components'>('files')
  const [deadCode, setDeadCode] = useState<DeadCodeReport | null>(null)
  const [deadCodeLoading, setDeadCodeLoading] = useState(false)
  const [deadCodeMessage, setDeadCodeMessage] = useState<string | null>(null)

  useEffect(() => {
    if (selectedRepo) {
      loadStats()
    }
  }, [selectedRepo])

  const loadStats = async () => {
    if (!selectedRepo) return
    setLoading(true)
    try {
      const [statsResult, reportResult] = await Promise.all([
        window.bridge.getFileStats(selectedRepo.path),
        window.bridge.getCleanupReport(selectedRepo.path)
      ])
      setStats(statsResult)
      setReport(reportResult)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDeadCode = async () => {
    if (!selectedRepo) return
    setDeadCodeLoading(true)
    setDeadCodeMessage(null)
    try {
      const result = await window.bridge.detectDeadCode(selectedRepo.path)
      setDeadCode(result)
    } catch (error) {
      setDeadCodeMessage(error instanceof Error ? error.message : 'Failed to detect dead code')
    } finally {
      setDeadCodeLoading(false)
    }
  }

  const cleanupAllDeadCode = async () => {
    if (!selectedRepo || !deadCode) return
    setDeadCodeLoading(true)
    setDeadCodeMessage(null)
    try {
      const result = await window.bridge.cleanupDeadCode({
        repoPath: selectedRepo.path,
        deadFiles: deadCode.deadFiles,
        unusedExports: deadCode.unusedExports,
        createPr: true
      })
      if (result.success) {
        setDeadCodeMessage('Cleanup PR created successfully.')
        setDeadCode({ ...deadCode, deadFiles: [] })
      } else {
        setDeadCodeMessage(result.error || 'Cleanup failed')
      }
    } catch (error) {
      setDeadCodeMessage(error instanceof Error ? error.message : 'Cleanup failed')
    } finally {
      setDeadCodeLoading(false)
    }
  }

  if (!selectedRepo) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
        <h3 className="empty-state-title">No repository selected</h3>
        <p className="empty-state-desc">Select a repository from the sidebar to analyze</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Dead Code Cleanup</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={loadDeadCode} disabled={deadCodeLoading}>
              {deadCodeLoading ? 'Scanning...' : 'Detect Dead Code'}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={cleanupAllDeadCode}
              disabled={deadCodeLoading || !deadCode || deadCode.deadFiles.length === 0}
            >
              Cleanup All
            </button>
          </div>
        </div>

        {deadCodeMessage && (
          <div style={{ padding: '0 16px 12px', color: 'var(--text-secondary)' }}>
            {deadCodeMessage}
          </div>
        )}

        {deadCode && (
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {deadCode.deadFiles.length} unused files, {deadCode.unusedExports.length} unused exports
            </div>
            {deadCode.deadFiles.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>No unused files detected.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {deadCode.deadFiles.slice(0, 5).map(file => (
                  <div key={file} style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{file}</div>
                ))}
                {deadCode.deadFiles.length > 5 && (
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    +{deadCode.deadFiles.length - 5} more
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Cleanup Analysis</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Find hidden bloat, large files in git history, and oversized components.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={loadStats}
            disabled={loading}
          >
            {loading ? <div className="spinner" style={{ width: '14px', height: '14px' }} /> : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            )}
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="spinner" />
        </div>
      ) : stats && report ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="card">
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Size</div>
              <div style={{ fontSize: '24px', fontWeight: 600 }}>{stats.totalSizeFormatted}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{stats.fileCount} files</div>
            </div>
            <div className="card">
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Git History Bloat</div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: report.totalWastedSpace > 0 ? 'var(--warning)' : 'var(--success)' }}>
                {report.totalWastedSpaceFormatted}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{report.gitHistoryFiles.length} large blobs</div>
            </div>
            <div className="card">
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Large Files</div>
              <div style={{ fontSize: '24px', fontWeight: 600 }}>{report.largeFiles.length}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>files over 500KB</div>
            </div>
            <div className="card">
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Oversized Components</div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: report.oversizedComponents.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
                {report.oversizedComponents.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>files over 150 lines</div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                className={`btn ${activeTab === 'files' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActiveTab('files')}
              >
                Largest Files ({stats.largestFiles.length})
              </button>
              <button
                className={`btn ${activeTab === 'git-history' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActiveTab('git-history')}
              >
                Git History ({report.gitHistoryFiles.length})
              </button>
              <button
                className={`btn ${activeTab === 'components' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActiveTab('components')}
              >
                Oversized Components ({report.oversizedComponents.length})
              </button>
            </div>

            {activeTab === 'files' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {stats.largestFiles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No large files found
                  </div>
                ) : (
                  stats.largestFiles.map((file, i) => (
                    <div
                      key={file.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', width: '24px' }}>
                        #{i + 1}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.path}
                      </span>
                      <span style={{ fontWeight: 500, color: file.size > 1024 * 1024 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                        {file.sizeFormatted}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'git-history' && (
              <div>
                {report.gitHistoryFiles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    <div>No large blobs in git history!</div>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '13px', color: 'var(--warning)' }}>
                      <strong>Tip:</strong> These files are stored in your git history even if deleted. Use <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>git filter-branch</code> or <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>BFG Repo-Cleaner</code> to remove them.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {report.gitHistoryFiles.map((file, i) => (
                        <div
                          key={`${file.path}-${i}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 12px',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', width: '24px' }}>
                            #{i + 1}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                          </svg>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {file.path}
                          </span>
                          <span style={{ fontWeight: 500, color: 'var(--warning)' }}>
                            {file.sizeFormatted}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'components' && (
              <div>
                {report.oversizedComponents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    <div>All components are under 150 lines!</div>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '13px', color: 'var(--warning)' }}>
                      <strong>Tip:</strong> Components over 150 lines are harder to maintain. Consider breaking them into smaller, focused components.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {report.oversizedComponents.map((comp, i) => (
                        <div
                          key={comp.path}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 12px',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', width: '24px' }}>
                            #{i + 1}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                          </svg>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {comp.path}
                          </span>
                          <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '10px' }}>
                            {comp.type}
                          </span>
                          <span style={{ fontWeight: 500, color: comp.lines > 300 ? 'var(--error)' : 'var(--warning)' }}>
                            {comp.lines} lines
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}
