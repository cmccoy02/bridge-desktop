import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import type { ScanResult, SecurityFinding, ScanProgress } from '../../types'

const SEVERITY_COLORS = {
  critical: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
  high: { bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316' },
  medium: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  low: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }
}

export default function Security() {
  const { selectedRepo } = useRepositories()
  const { settings } = useAppSettings()
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState<ScanProgress | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [selectedFinding, setSelectedFinding] = useState<SecurityFinding | null>(null)
  const [generatingFix, setGeneratingFix] = useState(false)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [scannerAvailable, setScannerAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    checkScanner()
  }, [])

  useEffect(() => {
    if (scanning) {
      const cleanup = window.bridge.onSecurityScanProgress(setProgress)
      return cleanup
    }
  }, [scanning])

  const checkScanner = async () => {
    const available = await window.bridge.checkSecurityScannerAvailable()
    setScannerAvailable(available)
  }

  const runScan = async () => {
    if (!selectedRepo) return

    setScanning(true)
    setProgress(null)
    setResult(null)
    setSelectedFinding(null)

    try {
      const scanResult = await window.bridge.runSecurityScan(selectedRepo.path)
      setResult(scanResult)
    } catch (error) {
      console.error('Security scan failed:', error)
    } finally {
      setScanning(false)
      setProgress(null)
    }
  }

  const generateFix = async (finding: SecurityFinding) => {
    setGeneratingFix(true)
    try {
      const fix = await window.bridge.generateSecurityFix(finding)
      if (fix) {
        setSelectedFinding({ ...finding, fixedCode: fix })
      }
    } catch (error) {
      console.error('Failed to generate fix:', error)
    } finally {
      setGeneratingFix(false)
    }
  }

  const filteredFindings = result?.findings.filter(f =>
    filterSeverity === 'all' || f.severity === filterSeverity
  ) || []

  if (!settings.experimentalFeatures) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <h3 className="empty-state-title">Experimental feature disabled</h3>
        <p className="empty-state-desc">Enable Experimental Features in Settings to run Security Scan.</p>
      </div>
    )
  }

  if (!selectedRepo) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <h3 className="empty-state-title">No repository selected</h3>
        <p className="empty-state-desc">Select a repository from the sidebar to scan for security issues</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Security Scanner</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Scan for vulnerabilities: SQL injection, XSS, command injection, hardcoded secrets, and more.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={runScan}
            disabled={scanning}
          >
            {scanning ? (
              <>
                <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#000' }} />
                Scanning...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Scan Repository
              </>
            )}
          </button>
        </div>

        {scannerAvailable === false && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Using basic scanner. Install agentic_fixer dependencies for AI-powered fixes.</span>
            </div>
          </div>
        )}

        {scanning && progress && (
          <div className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div className="spinner" />
              <span>{progress.message}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress.progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{result.totalFindings}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Issues</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderColor: SEVERITY_COLORS.critical.color }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: SEVERITY_COLORS.critical.color }}>{result.criticalCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Critical</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderColor: SEVERITY_COLORS.high.color }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: SEVERITY_COLORS.high.color }}>{result.highCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>High</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderColor: SEVERITY_COLORS.medium.color }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: SEVERITY_COLORS.medium.color }}>{result.mediumCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Medium</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderColor: SEVERITY_COLORS.low.color }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: SEVERITY_COLORS.low.color }}>{result.lowCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Low</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Findings</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
                      <button
                        key={sev}
                        className={`btn ${filterSeverity === sev ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                        onClick={() => setFilterSeverity(sev)}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredFindings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    {result.totalFindings === 0 ? (
                      <>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                        <div>No security issues found!</div>
                      </>
                    ) : (
                      <div>No issues matching this filter</div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflow: 'auto' }}>
                    {filteredFindings.map((finding, i) => (
                      <div
                        key={`${finding.file}-${finding.line}-${i}`}
                        onClick={() => setSelectedFinding(finding)}
                        style={{
                          padding: '12px',
                          background: selectedFinding === finding ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          border: selectedFinding === finding ? '1px solid var(--accent)' : '1px solid transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span
                            className="badge"
                            style={{
                              background: SEVERITY_COLORS[finding.severity].bg,
                              color: SEVERITY_COLORS[finding.severity].color,
                              textTransform: 'uppercase',
                              fontSize: '10px'
                            }}
                          >
                            {finding.severity}
                          </span>
                          <span style={{ fontWeight: 500 }}>{finding.issue.replace(/-/g, ' ')}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          {finding.file}:{finding.line}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', gap: '8px' }}>
                          <span>{finding.cwe}</span>
                          <span>•</span>
                          <span>{finding.owasp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedFinding && (
              <div style={{ width: '450px' }}>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Finding Details</h3>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedFinding(null)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Issue Type</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          className="badge"
                          style={{
                            background: SEVERITY_COLORS[selectedFinding.severity].bg,
                            color: SEVERITY_COLORS[selectedFinding.severity].color
                          }}
                        >
                          {selectedFinding.severity}
                        </span>
                        <span style={{ fontWeight: 500 }}>{selectedFinding.issue.replace(/-/g, ' ')}</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Location</div>
                      <div>{selectedFinding.file}:{selectedFinding.line}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Classification</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="badge badge-accent">{selectedFinding.cwe}</span>
                        <span className="badge" style={{ background: 'var(--bg-tertiary)' }}>{selectedFinding.owasp}</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Description</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedFinding.description}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Vulnerable Code</div>
                      <pre style={{
                        padding: '12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'auto',
                        fontSize: '12px',
                        margin: 0
                      }}>
                        {selectedFinding.code}
                      </pre>
                    </div>

                    {selectedFinding.solution && (
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Solution</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedFinding.solution}</div>
                      </div>
                    )}

                    {selectedFinding.fixedCode && (
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Fixed Code</div>
                        <pre style={{
                          padding: '12px',
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid var(--success)',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'auto',
                          fontSize: '12px',
                          margin: 0
                        }}>
                          {selectedFinding.fixedCode}
                        </pre>
                      </div>
                    )}

                    {scannerAvailable && !selectedFinding.fixedCode && (
                      <button
                        className="btn btn-primary"
                        onClick={() => generateFix(selectedFinding)}
                        disabled={generatingFix}
                      >
                        {generatingFix ? (
                          <>
                            <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#000' }} />
                            Generating Fix...
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2a10 10 0 1010 10H12V2z" />
                            </svg>
                            Generate AI Fix
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!result && !scanning && (
        <div className="card">
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <h3 className="empty-state-title">Ready to scan</h3>
            <p className="empty-state-desc">Click "Scan Repository" to check for security vulnerabilities</p>
          </div>
        </div>
      )}
    </div>
  )
}
