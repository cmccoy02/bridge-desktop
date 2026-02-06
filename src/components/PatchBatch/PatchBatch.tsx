import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { OutdatedPackage, SecurityPatchResult } from '../../types'
import Scheduler from '../Scheduler/Scheduler'

export default function PatchBatch() {
  const { selectedRepo } = useRepositories()
  const [packages, setPackages] = useState<OutdatedPackage[]>([])
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ message: string; step: number; total: number } | null>(null)
  const [result, setResult] = useState<{
    success: boolean
    prUrl?: string | null
    branchName?: string
    error?: string
    testsPassed?: boolean
  } | null>(null)
  const [branchName, setBranchName] = useState('bridge-update-deps')
  const [createPR, setCreatePR] = useState(true)
  const [runTests, setRunTests] = useState(true)
  const [repoInfo, setRepoInfo] = useState<{ branch: string; isProtectedBranch: boolean } | null>(null)
  const [outputLines, setOutputLines] = useState<string[]>([])
  const [testCommand, setTestCommand] = useState('')
  const [testCommandDetected, setTestCommandDetected] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showScheduler, setShowScheduler] = useState(false)
  const [securityRunning, setSecurityRunning] = useState(false)
  const [securityProgress, setSecurityProgress] = useState<{ message: string; step: number; total: number } | null>(null)
  const [securityResult, setSecurityResult] = useState<SecurityPatchResult | null>(null)
  const [securityLogs, setSecurityLogs] = useState<string[]>([])

  const getPackageKey = (pkg: OutdatedPackage) => `${pkg.language}:${pkg.name}`

  useEffect(() => {
    if (selectedRepo) {
      loadOutdatedPackages()
      loadRepoInfo()
      detectTestCommand()
    }
  }, [selectedRepo])

  useEffect(() => {
    const cleanupProgress = window.bridge.onPatchBatchProgress(setProgress)
    const cleanupLog = window.bridge.onPatchBatchLog(({ message }) => {
      setOutputLines(prev => [...prev, message])
    })
    const cleanupWarning = window.bridge.onPatchBatchWarning(({ message, output }) => {
      const lines = output ? output.split(/\r?\n/).filter(line => line.trim()) : []
      setOutputLines(prev => [...prev, `WARN: ${message}`, ...lines])
    })
    const cleanupSecurityProgress = window.bridge.onSecurityPatchProgress(setSecurityProgress)
    const cleanupSecurityLog = window.bridge.onSecurityPatchLog(({ message }) => {
      setSecurityLogs(prev => [...prev, message])
    })

    return () => {
      cleanupProgress()
      cleanupLog()
      cleanupWarning()
      cleanupSecurityProgress()
      cleanupSecurityLog()
    }
  }, [])

  const loadRepoInfo = async () => {
    if (!selectedRepo) return
    try {
      const info = await window.bridge.getRepoInfo(selectedRepo.path)
      setRepoInfo(info)
    } catch {
      setRepoInfo(null)
    }
  }

  const detectTestCommand = async () => {
    if (!selectedRepo) return
    const primaryLang = selectedRepo.languages?.[0] || 'javascript'
    const defaultTestCommands: Record<string, string> = {
      python: 'pytest',
      ruby: 'bundle exec rspec',
      elixir: 'mix test'
    }
    try {
      const [packageJsonRaw, files] = await Promise.all([
        window.bridge.readFile(`${selectedRepo.path}/package.json`),
        window.bridge.readDirectory(selectedRepo.path)
      ])

      const packageJson = JSON.parse(packageJsonRaw)
      const hasTestScript = Boolean(packageJson?.scripts?.test && String(packageJson.scripts.test).trim())

      if (!hasTestScript) {
        setTestCommand('')
        setTestCommandDetected(false)
        return
      }

      const fileNames = new Set(files.map(file => file.name))
      let packageManager = 'npm'
      if (fileNames.has('pnpm-lock.yaml')) {
        packageManager = 'pnpm'
      } else if (fileNames.has('yarn.lock')) {
        packageManager = 'yarn'
      }

      setTestCommand(`${packageManager} test`)
      setTestCommandDetected(true)
    } catch {
      if (defaultTestCommands[primaryLang]) {
        setTestCommand(defaultTestCommands[primaryLang])
        setTestCommandDetected(true)
      } else {
        setTestCommand('')
        setTestCommandDetected(false)
      }
    }
  }

  const loadOutdatedPackages = async (options?: { preserveResult?: boolean }) => {
    if (!selectedRepo) return

    setLoading(true)
    if (!options?.preserveResult) {
      setResult(null)
    }
    setLoadError(null)
    try {
      const outdated = await window.bridge.getOutdatedPackages(selectedRepo.path)
      setPackages(outdated)

      const patchPackages = outdated.filter(p => p.hasPatchUpdate).map(getPackageKey)
      setSelectedPackages(new Set(patchPackages))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load outdated packages'
      setLoadError(message)
      setPackages([])
      setSelectedPackages(new Set())
    } finally {
      setLoading(false)
    }
  }

  const togglePackage = (pkg: OutdatedPackage) => {
    if (!pkg.hasPatchUpdate) return
    const key = getPackageKey(pkg)
    const next = new Set(selectedPackages)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    setSelectedPackages(next)
  }

  const selectAll = () => {
    const patchPackages = packages.filter(p => p.hasPatchUpdate).map(getPackageKey)
    setSelectedPackages(new Set(patchPackages))
  }

  const clearSelection = () => {
    setSelectedPackages(new Set())
  }

  const runPatchBatch = async () => {
    if (!selectedRepo || selectedPackages.size === 0) return

    if (!selectedRepo.hasGit) {
      setResult({
        success: false,
        error: "Git not initialized - run 'git init' first."
      })
      return
    }

    const isJavascriptRepo = (selectedRepo.languages ?? []).includes('javascript')
    if (runTests && isJavascriptRepo && testCommand.trim().length === 0) {
      setResult({
        success: false,
        error: "No test script found - add one to package.json or uncheck 'Run tests'.",
        testsPassed: false
      })
      return
    }

    setRunning(true)
    setProgress(null)
    setResult(null)
    setOutputLines([])

    try {
      const packagesToUpdate = packages
        .filter(p => selectedPackages.has(getPackageKey(p)))
        .map(p => ({ name: p.name, language: p.language }))

      const result = await window.bridge.runPatchBatch({
        repoPath: selectedRepo.path,
        branchName: `${branchName}-${Date.now()}`,
        packages: packagesToUpdate,
        createPR,
        runTests,
        testCommand: testCommand.trim() || undefined,
        prTitle: `chore(deps): update ${packagesToUpdate.length} packages to latest patch versions`,
        prBody: `## Summary\nAutomated patch version updates via Bridge.\n\n### Updated packages\n${packagesToUpdate.map(p => `- ${p.name} (${p.language})`).join('\n')}`
      })

      setResult(result)

      if (result.success) {
        await loadOutdatedPackages({ preserveResult: true })
        await loadRepoInfo()
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setRunning(false)
      setProgress(null)
    }
  }

  const runSecurityPatch = async () => {
    if (!selectedRepo) return

    setSecurityRunning(true)
    setSecurityProgress(null)
    setSecurityResult(null)
    setSecurityLogs([])

    try {
      const result = await window.bridge.runSecurityPatch({
        repoPath: selectedRepo.path,
        branchName: `bridge-security-patch-${Date.now()}`,
        createPR,
        runTests,
        testCommand: testCommand.trim() || undefined
      })

      setSecurityResult(result)

      if (result.success) {
        await loadOutdatedPackages({ preserveResult: true })
        await loadRepoInfo()
      }
    } catch (error) {
      setSecurityResult({
        success: false,
        updatedPackages: [],
        failedPackages: [],
        error: error instanceof Error ? error.message : 'Security patch failed'
      })
    } finally {
      setSecurityRunning(false)
      setSecurityProgress(null)
    }
  }

  if (!selectedRepo) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 12a9 9 0 11-9-9" />
          <path d="M21 3v6h-6" />
        </svg>
        <h3 className="empty-state-title">No repository selected</h3>
        <p className="empty-state-desc">Select a repository from the sidebar to update packages</p>
      </div>
    )
  }

  if ((selectedRepo.languages?.length ?? 0) === 0) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 className="empty-state-title">No package.json found</h3>
        <p className="empty-state-desc">Is this a Node.js project?</p>
      </div>
    )
  }

  const patchUpdatesCount = packages.filter(p => p.hasPatchUpdate).length
  const isJavascriptRepo = (selectedRepo.languages ?? []).includes('javascript')
  const runButtonLabel = () => {
    if (running) {
      const message = progress?.message?.toLowerCase() || ''
      if (message.includes('test')) return 'Running tests...'
      if (message.includes('pull request') || message.includes('pr')) return 'Creating PR...'
      if (message.includes('commit')) return 'Committing updates...'
      return progress?.message || 'Running update...'
    }

    if (selectedPackages.size === 0) return 'Select packages to update'

    return `Update ${selectedPackages.size} Package${selectedPackages.size === 1 ? '' : 's'}`
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div className="patch-header">
          <div>
            <h2 style={{ marginBottom: '4px' }}>Update Dependencies</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Point Bridge at a repo, review patch updates, run tests, and create a clean PR.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => loadOutdatedPackages()}
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

        <div className="step-guide">
          <div className="step-item">
            <span className="step-number">1</span>
            <span>Select Repository</span>
          </div>
          <div className="step-item">
            <span className="step-number">2</span>
            <span>Review Outdated Packages</span>
          </div>
          <div className="step-item">
            <span className="step-number">3</span>
            <span>Run Update (with tests)</span>
          </div>
        </div>

        {!selectedRepo.hasGit && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <div style={{ color: 'var(--error)', fontWeight: 500 }}>
              Git not initialized - run 'git init' first.
            </div>
          </div>
        )}

        {repoInfo?.isProtectedBranch && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>You're on <strong>{repoInfo.branch}</strong> (protected). Bridge will create a new branch automatically.</span>
            </div>
          </div>
        )}

        {loadError && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <div style={{ color: 'var(--error)' }}>{loadError}</div>
          </div>
        )}

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header">
            <h3 className="card-title">Security Vulnerability Auto-Patcher</h3>
            <button className="btn btn-primary btn-sm" onClick={runSecurityPatch} disabled={securityRunning || !selectedRepo.hasGit}>
              {securityRunning ? 'Patching...' : 'Patch High/Critical'}
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
            Runs npm audit, updates high/critical vulnerabilities one-by-one, and creates a PR when tests pass.
          </p>

          {securityProgress && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', marginBottom: '6px' }}>{securityProgress.message}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(securityProgress.step / securityProgress.total) * 100}%` }} />
              </div>
            </div>
          )}

          {securityResult && (
            <div className="card" style={{
              borderColor: securityResult.success ? 'var(--success)' : 'var(--error)',
              background: securityResult.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              padding: '12px'
            }}>
              {securityResult.success ? (
                <div style={{ color: 'var(--success)' }}>
                  Patched {securityResult.updatedPackages.length} packages.{securityResult.prUrl ? ' PR created.' : ''}
                </div>
              ) : (
                <div style={{ color: 'var(--error)' }}>
                  {securityResult.error || 'Security patch failed.'}
                </div>
              )}
              {securityResult.prUrl && (
                <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  PR: {securityResult.prUrl}
                </div>
              )}
              {securityResult.failedPackages.length > 0 && (
                <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Failed: {securityResult.failedPackages.join(', ')}
                </div>
              )}
            </div>
          )}

          {securityLogs.length > 0 && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {securityLogs.slice(-4).map((line, i) => (
                <div key={`${line}-${i}`}>{line}</div>
              ))}
            </div>
          )}
        </div>

        {result && (
          <div
            className="card"
            style={{
              marginBottom: '16px',
              borderColor: result.success ? 'var(--success)' : 'var(--error)',
              background: result.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
            }}
          >
            {result.success ? (
              <div>
                <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--success)' }}>
                  {result.prUrl ? '✓ PR Created Successfully' : `✓ Updates committed to branch '${result.branchName}'`}
                </div>
                {result.prUrl && (
                  <div style={{ fontSize: '13px' }}>
                    Pull request created:{' '}
                    <a href={result.prUrl} target="_blank" rel="noopener noreferrer">
                      {result.prUrl}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--error)' }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                  {result.testsPassed === false ? '✗ Tests Failed - No PR created' : 'Update failed'}
                </div>
                <div style={{ fontSize: '13px' }}>{result.error}</div>
                {result.branchName && (
                  <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-secondary)' }}>
                    Branch available: {result.branchName}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {running && progress && (
          <div className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div className="spinner" />
              <span>{progress.message}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(progress.step / progress.total) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Configuration</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Branch name prefix
            </label>
            <input
              type="text"
              className="input"
              value={branchName}
              onChange={e => setBranchName(e.target.value)}
              placeholder="bridge-update-deps"
              style={{ maxWidth: '300px' }}
            />
          </div>

          <div className="config-grid">
            <label className="checkbox-wrapper">
              <div
                className={`checkbox ${createPR ? 'checked' : ''}`}
                onClick={() => setCreatePR(!createPR)}
              >
                {createPR && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="checkbox-label">Create pull request</span>
            </label>

            <label className="checkbox-wrapper">
              <div
                className={`checkbox ${runTests ? 'checked' : ''}`}
                onClick={() => setRunTests(!runTests)}
              >
                {runTests && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="checkbox-label">Run tests before creating PR</span>
            </label>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Test command
            </label>
            <input
              type="text"
              className="input"
              value={testCommand}
              onChange={e => {
                setTestCommand(e.target.value)
                if (testCommandDetected) {
                  setTestCommandDetected(false)
                }
              }}
              placeholder="npm test"
              disabled={!runTests}
            />
            {runTests && testCommandDetected && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Detected command - will run: {testCommand}
              </div>
            )}
            {runTests && isJavascriptRepo && !testCommandDetected && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--warning)' }}>
                No test script found - add one to package.json or uncheck 'Run tests'.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Outdated Packages</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {patchUpdatesCount > 0
                ? `${patchUpdatesCount} patch update${patchUpdatesCount !== 1 ? 's' : ''} available`
                : 'No patch updates detected'}
            </div>
          </div>
          <div className="table-actions">
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              {selectedPackages.size} selected
            </span>
            <button className="btn btn-ghost btn-sm" onClick={selectAll}>
              Select All
            </button>
            <button className="btn btn-ghost btn-sm" onClick={clearSelection}>
              Deselect All
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={runPatchBatch}
              disabled={selectedPackages.size === 0 || running || !selectedRepo.hasGit}
            >
              {running ? (
                <>
                  <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#000' }} />
                  {runButtonLabel()}
                </>
              ) : (
                <>
                  {runButtonLabel()}
                </>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner" />
          </div>
        ) : packages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <div>All packages are up to date!</div>
          </div>
        ) : (
          <div className="package-table-wrapper">
            <table className="package-table">
              <thead>
                <tr>
                  <th />
                  <th>Package Name</th>
                  <th>Current</th>
                  <th>Latest</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => {
                  const key = getPackageKey(pkg)
                  const isSelected = selectedPackages.has(key)
                  const latestDisplay = pkg.hasPatchUpdate ? pkg.wanted : pkg.latest
                  return (
                    <tr
                      key={key}
                      className={`${pkg.hasPatchUpdate ? '' : 'disabled'} ${isSelected ? 'selected' : ''}`}
                      onClick={() => togglePackage(pkg)}
                    >
                      <td>
                        <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="package-name-cell">
                          <div className="package-name">{pkg.name}</div>
                          {!pkg.hasPatchUpdate && (
                            <span className="badge badge-warning">minor/major</span>
                          )}
                        </div>
                      </td>
                      <td>{pkg.current}</td>
                      <td className={pkg.hasPatchUpdate ? 'version-new' : ''}>{latestDisplay}</td>
                      <td>{pkg.type === 'devDependencies' ? 'devDep' : 'dep'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Live Output</h3>
        </div>
        <div className="output-panel">
          {outputLines.length === 0 ? (
            <div style={{ color: 'var(--text-tertiary)' }}>No output yet. Run an update to see progress here.</div>
          ) : (
            outputLines.map((line, index) => (
              <div key={`${line}-${index}`} className="output-line">{line}</div>
            ))
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Scheduler</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Set it and forget it. Schedule updates for any repo.
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowScheduler(!showScheduler)}>
            {showScheduler ? 'Hide Scheduler' : 'Show Scheduler'}
          </button>
        </div>
        {showScheduler && (
          <div style={{ paddingTop: '12px' }}>
            <Scheduler />
          </div>
        )}
      </div>
    </div>
  )
}
