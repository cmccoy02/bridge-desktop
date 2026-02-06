import { useEffect, useMemo, useState } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import { useScanContext, type ScanTab } from '../../contexts/ScanContext'
import type { CircularDependency, DeadCodeExport, FullScanResult } from '../../types'
import CircularDepsGraph from './CircularDepsGraph'

const TAB_LABELS: Record<ScanTab, string> = {
  overview: 'Overview',
  circular: 'Circular Dependencies',
  'dead-code': 'Dead Code',
  bundle: 'Bundle Analysis',
  coverage: 'Test Coverage',
  docs: 'Documentation'
}

const formatNumber = (value: number | null | undefined, fallback = '—') => {
  if (value === null || value === undefined || Number.isNaN(value)) return fallback
  return value.toFixed(1)
}

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.round(ms / 60000)}m`
}

const buildCircularSuggestion = (dep: CircularDependency) => {
  const cycle = dep.cycle.length ? dep.cycle : [dep.from, dep.to]
  const from = cycle[0]
  const to = cycle[1] || dep.to
  const fromName = from.split('/').pop() || from
  const toName = to.split('/').pop() || to

  return `Break the cycle by extracting shared types used by ${fromName} and ${toName} into a new module, or by inverting the import between them.`
}

export default function FullScan() {
  const { selectedRepo } = useRepositories()
  const {
    scanResults,
    updateScanResult,
    preferredTab,
    setPreferredTab,
    scanRequestRepo,
    clearScanRequest
  } = useScanContext()

  const [activeTab, setActiveTab] = useState<ScanTab>(preferredTab)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState<{ message: string; step: number; total: number } | null>(null)
  const [result, setResult] = useState<FullScanResult | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [selectedCycle, setSelectedCycle] = useState<CircularDependency | null>(null)
  const [cleanupState, setCleanupState] = useState<{ running: boolean; message?: string; prUrl?: string; error?: string } | null>(null)
  const [removedExports, setRemovedExports] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (selectedRepo) {
      setResult(scanResults[selectedRepo.path] || null)
    }
  }, [selectedRepo, scanResults])

  useEffect(() => {
    setActiveTab(preferredTab)
  }, [preferredTab])

  useEffect(() => {
    if (!selectedRepo || scanning) return
    if (scanRequestRepo && selectedRepo.path === scanRequestRepo) {
      void runScan()
      clearScanRequest()
    }
  }, [scanRequestRepo, selectedRepo, scanning, clearScanRequest])

  useEffect(() => {
    if (!scanning) return
    const cleanup = window.bridge.onFullScanProgress(setProgress)
    return cleanup
  }, [scanning])

  const runScan = async () => {
    if (!selectedRepo) return

    setScanning(true)
    setScanError(null)
    setProgress(null)
    setSelectedCycle(null)

    try {
      const scanResult = await window.bridge.runFullScan(selectedRepo.path)
      setResult(scanResult)
      updateScanResult(selectedRepo.path, scanResult)
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'Full scan failed')
    } finally {
      setScanning(false)
      setProgress(null)
    }
  }

  const handleTabChange = (tab: ScanTab) => {
    setActiveTab(tab)
    setPreferredTab(tab)
  }

  const handleDeleteFile = async (file: string) => {
    if (!selectedRepo || !result) return

    try {
      await window.bridge.deleteDeadFile(selectedRepo.path, file)
      const nextDeadFiles = result.deadCode.deadFiles.filter(item => item !== file)
      const nextResult = {
        ...result,
        deadCode: {
          ...result.deadCode,
          deadFiles: nextDeadFiles,
          totalDeadCodeCount: nextDeadFiles.length + result.deadCode.unusedExports.length
        }
      }
      setResult(nextResult)
      updateScanResult(selectedRepo.path, nextResult)
    } catch (error) {
      setCleanupState({ running: false, error: error instanceof Error ? error.message : 'Failed to delete file' })
    }
  }

  const handleCleanupAll = async () => {
    if (!selectedRepo || !result) return

    setCleanupState({ running: true, message: 'Removing dead code and creating PR...' })

    try {
      const response = await window.bridge.cleanupDeadCode({
        repoPath: selectedRepo.path,
        deadFiles: result.deadCode.deadFiles,
        unusedExports: result.deadCode.unusedExports,
        createPr: true
      })

      if (response.success) {
        setCleanupState({ running: false, message: 'Cleanup PR created.', prUrl: response.prUrl })
        const nextResult = {
          ...result,
          deadCode: {
            ...result.deadCode,
            deadFiles: [],
            totalDeadCodeCount: result.deadCode.unusedExports.length
          }
        }
        setResult(nextResult)
        updateScanResult(selectedRepo.path, nextResult)
      } else {
        setCleanupState({ running: false, error: response.error || 'Cleanup failed' })
      }
    } catch (error) {
      setCleanupState({ running: false, error: error instanceof Error ? error.message : 'Cleanup failed' })
    }
  }

  const handleRemoveExport = (exportEntry: DeadCodeExport) => {
    const key = `${exportEntry.file}:${exportEntry.exportName}`
    setRemovedExports(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const filteredUnusedExports = useMemo(() => {
    if (!result) return []
    return result.deadCode.unusedExports.filter(exp => !removedExports.has(`${exp.file}:${exp.exportName}`))
  }, [result, removedExports])

  if (!selectedRepo) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v18M3 12h18" />
        </svg>
        <h3 className="empty-state-title">No repository selected</h3>
        <p className="empty-state-desc">Select a repository from the sidebar to run a full TD scan.</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="scan-header">
        <div>
          <h2 style={{ marginBottom: '6px' }}>Full TD Scan</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Run all deterministic checks to surface technical debt across the repository.
          </p>
        </div>
        <button className="btn btn-primary" onClick={runScan} disabled={scanning}>
          {scanning ? (
            <>
              <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#000' }} />
              Running...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Run Full TD Scan
            </>
          )}
        </button>
      </div>

      {scanning && progress && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div className="spinner" />
            <div>
              <div style={{ fontWeight: 600 }}>{progress.message}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Step {progress.step} of {progress.total}
              </div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(progress.step / progress.total) * 100}%` }} />
          </div>
        </div>
      )}

      {scanError && (
        <div className="card" style={{ borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.08)', marginBottom: '16px' }}>
          <div style={{ color: 'var(--error)' }}>{scanError}</div>
        </div>
      )}

      {result && (
        <>
          <div className="scan-summary-grid">
            <div className="card">
              <div className="summary-label">Last Scan</div>
              <div className="summary-value">{new Date(result.scanDate).toLocaleString()}</div>
              <div className="summary-sub">Duration {formatDuration(result.durationMs)}</div>
            </div>
            <div className="card">
              <div className="summary-label">TD Score</div>
              <div className="summary-value">
                {result.consoleUpload?.tdScore ?? '—'}
                {typeof result.consoleUpload?.tdDelta === 'number' && (
                  <span className={`delta ${result.consoleUpload.tdDelta >= 0 ? 'delta-up' : 'delta-down'}`}>
                    {result.consoleUpload.tdDelta >= 0 ? '+' : ''}{result.consoleUpload.tdDelta}
                  </span>
                )}
              </div>
              <div className="summary-sub">Bridge-Console</div>
            </div>
            <div className="card">
              <div className="summary-label">Circular Deps</div>
              <div className="summary-value">{result.circularDependencies.count}</div>
              <div className="summary-sub">dependency loops</div>
            </div>
            <div className="card">
              <div className="summary-label">Dead Code</div>
              <div className="summary-value">{result.deadCode.totalDeadCodeCount}</div>
              <div className="summary-sub">files + exports</div>
            </div>
            <div className="card">
              <div className="summary-label">Coverage</div>
              <div className="summary-value">
                {formatNumber(result.testCoverage.coveragePercentage)}%
              </div>
              <div className="summary-sub">overall lines</div>
            </div>
          </div>

          {result.consoleUpload && !result.consoleUpload.success && (
            <div className="alert error" style={{ marginBottom: '16px' }}>
              Upload failed: {result.consoleUpload.error || 'Unable to reach Bridge-Console.'}
            </div>
          )}

          <div className="scan-tabs">
            {Object.entries(TAB_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`btn ${activeTab === key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => handleTabChange(key as ScanTab)}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="scan-overview-grid">
              <div className="card">
                <h3 style={{ marginBottom: '8px' }}>Highlights</h3>
                <div className="overview-row">
                  <span>Circular dependencies</span>
                  <strong>{result.circularDependencies.count}</strong>
                </div>
                <div className="overview-row">
                  <span>Outdated packages</span>
                  <strong>{result.dependencies.outdated.length}</strong>
                </div>
                <div className="overview-row">
                  <span>Dead files</span>
                  <strong>{result.deadCode.deadFiles.length}</strong>
                </div>
                <div className="overview-row">
                  <span>Bundle size</span>
                  <strong>{result.bundleSize.totalSizeFormatted}</strong>
                </div>
                <div className="overview-row">
                  <span>Docs missing sections</span>
                  <strong>{result.documentation.missingReadmeSections.length}</strong>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '8px' }}>Alerts</h3>
                {result.dependencies.error && (
                  <div className="alert warn">Dependency scan failed: {result.dependencies.error}</div>
                )}
                {result.bundleSize.warning && (
                  <div className="alert warn">Bundle size increased by {formatNumber(result.bundleSize.deltaPercent)}%.</div>
                )}
                {result.testCoverage.coveragePercentage !== null && result.testCoverage.coveragePercentage < 50 && (
                  <div className="alert error">Coverage below 50%. Add tests before shipping.</div>
                )}
                {result.dependencies.vulnerabilities.critical > 0 && (
                  <div className="alert error">{result.dependencies.vulnerabilities.critical} critical vulnerabilities detected.</div>
                )}
                {result.dependencies.vulnerabilities.high > 0 && (
                  <div className="alert warn">{result.dependencies.vulnerabilities.high} high vulnerabilities detected.</div>
                )}
                {!result.dependencies.error && !result.bundleSize.warning && result.dependencies.vulnerabilities.critical === 0 && result.dependencies.vulnerabilities.high === 0 && (
                  <div className="alert success">No major alerts detected.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'circular' && (
            <div className="scan-detail-grid">
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3>Dependency Graph</h3>
                  <span className="badge badge-accent">{result.circularDependencies.count} cycles</span>
                </div>
                {result.circularDependencies.error && (
                  <div className="alert warn" style={{ marginBottom: '12px' }}>
                    {result.circularDependencies.error}
                  </div>
                )}
                {result.circularDependencies.count === 0 ? (
                  <div className="empty-state" style={{ padding: '32px 0' }}>
                    No circular dependencies detected.
                  </div>
                ) : (
                  <CircularDepsGraph dependencies={result.circularDependencies.dependencies} />
                )}
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <h3 className="card-title">Cycles</h3>
                </div>
                {result.circularDependencies.dependencies.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px 0' }}>No cycles found.</div>
                ) : (
                  <div className="list-stack">
                    {result.circularDependencies.dependencies.map((dep, index) => (
                      <div key={`${dep.from}-${dep.to}-${index}`} className="list-item">
                        <div>
                          <div className="list-title">{dep.from} → {dep.to}</div>
                          {dep.cycle.length > 0 && (
                            <div className="list-sub">Cycle: {dep.cycle.join(' → ')}</div>
                          )}
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCycle(dep)}>
                          Fix
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCycle && (
                  <div className="callout" style={{ marginTop: '16px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '6px' }}>Suggested fix</div>
                    <p style={{ marginBottom: '10px' }}>{buildCircularSuggestion(selectedCycle)}</p>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      Tip: Move shared types into a new module or invert the import direction.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dead-code' && (
            <div className="scan-detail-grid">
              <div className="card" style={{ padding: '16px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <h3 className="card-title">Unused Files</h3>
                  <button className="btn btn-primary btn-sm" onClick={handleCleanupAll} disabled={cleanupState?.running || result.deadCode.deadFiles.length === 0}>
                    {cleanupState?.running ? 'Cleaning...' : 'Cleanup All'}
                  </button>
                </div>

                {result.deadCode.error && (
                  <div className="alert warn" style={{ marginBottom: '12px' }}>
                    {result.deadCode.error}
                  </div>
                )}

                {cleanupState?.message && (
                  <div className="alert success" style={{ marginBottom: '12px' }}>{cleanupState.message} {cleanupState.prUrl && <span className="badge">PR created</span>}</div>
                )}
                {cleanupState?.error && (
                  <div className="alert error" style={{ marginBottom: '12px' }}>{cleanupState.error}</div>
                )}

                {result.deadCode.deadFiles.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px 0' }}>No unused files detected.</div>
                ) : (
                  <div className="list-stack">
                    {result.deadCode.deadFiles.map(file => (
                      <div key={file} className="list-item">
                        <div className="list-title">{file}</div>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteFile(file)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <h3 className="card-title">Unused Exports</h3>
                </div>
                {filteredUnusedExports.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px 0' }}>No unused exports detected.</div>
                ) : (
                  <div className="list-stack">
                    {filteredUnusedExports.map((exp, index) => (
                      <div key={`${exp.file}-${exp.exportName}-${index}`} className="list-item">
                        <div>
                          <div className="list-title">{exp.exportName}</div>
                          <div className="list-sub">{exp.file}</div>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleRemoveExport(exp)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  Export removal suggestions are included in cleanup PRs for manual review.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bundle' && (
            <div className="scan-detail-grid">
              <div className="card" style={{ padding: '16px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <h3 className="card-title">Bundle Size</h3>
                  {typeof result.bundleSize.deltaPercent === 'number' && (
                    <span className={`badge ${result.bundleSize.deltaPercent > 0 ? 'badge-warning' : 'badge-success'}`}>
                      {result.bundleSize.deltaPercent > 0 ? '↑' : '↓'} {formatNumber(Math.abs(result.bundleSize.deltaPercent))}%
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{result.bundleSize.totalSizeFormatted}</div>
                {result.bundleSize.error && (
                  <div className="alert warn" style={{ marginTop: '12px' }}>{result.bundleSize.error}</div>
                )}
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ marginBottom: '12px' }}>Largest Modules</h3>
                {result.bundleSize.largestModules.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px 0' }}>No module stats available.</div>
                ) : (
                  <div className="bar-list">
                    {result.bundleSize.largestModules.map(module => {
                      const maxSize = result.bundleSize.largestModules[0]?.size || 1
                      const width = Math.min(100, (module.size / maxSize) * 100)
                      return (
                        <div key={module.name} className="bar-item">
                          <div className="bar-meta">
                            <span>{module.name}</span>
                            <span>{module.sizeFormatted}</span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'coverage' && (
            <div className="scan-detail-grid">
              <div className="card" style={{ padding: '16px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <h3 className="card-title">Coverage</h3>
                </div>
                <div className={`coverage-meter ${result.testCoverage.coveragePercentage === null ? '' : result.testCoverage.coveragePercentage >= 80 ? 'good' : result.testCoverage.coveragePercentage >= 50 ? 'warn' : 'bad'}`}>
                  {formatNumber(result.testCoverage.coveragePercentage)}%
                </div>
                {result.testCoverage.error && (
                  <div className="alert warn" style={{ marginTop: '12px' }}>{result.testCoverage.error}</div>
                )}
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ marginBottom: '12px' }}>Critical Files Below 70%</h3>
                {result.testCoverage.uncoveredCriticalFiles.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px 0' }}>No critical files below threshold.</div>
                ) : (
                  <div className="list-stack">
                    {result.testCoverage.uncoveredCriticalFiles.map(file => (
                      <div key={file.file} className="list-item">
                        <div className="list-title">{file.file}</div>
                        <span className="badge badge-warning">{formatNumber(file.coverage)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="scan-detail-grid">
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ marginBottom: '12px' }}>README Coverage</h3>
                {result.documentation.error && (
                  <div className="alert warn" style={{ marginBottom: '12px' }}>
                    {result.documentation.error}
                  </div>
                )}
                {result.documentation.missingReadmeSections.length === 0 ? (
                  <div className="alert success">All required README sections are present.</div>
                ) : (
                  <div className="list-stack">
                    {result.documentation.missingReadmeSections.map(section => (
                      <div key={section} className="list-item">
                        <div className="list-title">Missing: {section}</div>
                      </div>
                    ))}
                  </div>
                )}
                {result.documentation.readmeOutdated && (
                  <div className="alert warn" style={{ marginTop: '12px' }}>
                    README last updated {Math.round(result.documentation.daysSinceUpdate)} days ago.
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ marginBottom: '12px' }}>Undocumented Functions</h3>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{result.documentation.undocumentedFunctions}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Functions exported without JSDoc.</div>
                <button className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }} disabled>
                  Generate Docs
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
