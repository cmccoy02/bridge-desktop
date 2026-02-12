import { useEffect, useMemo, useState } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { ConflictWarning, OutdatedPackage, PatchBatchResult, SecurityPatchResult } from '../../types'
import Scheduler from '../Scheduler/Scheduler'

export default function PatchBatch() {
  const { selectedRepo } = useRepositories()
  const [packages, setPackages] = useState<OutdatedPackage[]>([])
  const [selectedMajorPackages, setSelectedMajorPackages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ message: string; step: number; total: number } | null>(null)
  const [result, setResult] = useState<PatchBatchResult | null>(null)
  const [activeRunType, setActiveRunType] = useState<'non-breaking' | 'major' | null>(null)

  const [branchName, setBranchName] = useState('bridge-update-deps')
  const [createPR, setCreatePR] = useState(false)
  const [runTests, setRunTests] = useState(true)
  const [repoInfo, setRepoInfo] = useState<{ branch: string; isProtectedBranch: boolean } | null>(null)
  const [conflictWarnings, setConflictWarnings] = useState<ConflictWarning[]>([])
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

  const nonBreakingPackages = useMemo(
    () => packages.filter(pkg => pkg.isNonBreaking),
    [packages]
  )
  const majorPackages = useMemo(
    () => packages.filter(pkg => pkg.updateType === 'major'),
    [packages]
  )

  useEffect(() => {
    if (selectedRepo) {
      void loadOutdatedPackages()
      void loadRepoInfo()
      void detectTestCommand()
      void loadMergeConflictWarnings()
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

  const loadMergeConflictWarnings = async () => {
    if (!selectedRepo || !selectedRepo.hasGit) {
      setConflictWarnings([])
      return
    }

    try {
      const warnings = await window.bridge.predictMergeConflicts(selectedRepo.path)
      setConflictWarnings(warnings)
    } catch {
      setConflictWarnings([])
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

      const defaultMajorSelection = outdated
        .filter(pkg => pkg.updateType === 'major')
        .map(getPackageKey)
      setSelectedMajorPackages(new Set(defaultMajorSelection))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load outdated packages'
      setLoadError(message)
      setPackages([])
      setSelectedMajorPackages(new Set())
    } finally {
      setLoading(false)
    }
  }

  const toggleMajorPackage = (pkg: OutdatedPackage) => {
    if (pkg.updateType !== 'major') return
    const key = getPackageKey(pkg)
    const next = new Set(selectedMajorPackages)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    setSelectedMajorPackages(next)
  }

  const runNonBreakingUpdates = async () => {
    if (!selectedRepo) return

    if (!selectedRepo.hasGit) {
      setResult({ success: false, error: "Git not initialized - run 'git init' first." })
      return
    }

    if (nonBreakingPackages.length === 0) {
      setResult({ success: false, error: 'No non-breaking updates available.' })
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

    setActiveRunType('non-breaking')
    setRunning(true)
    setProgress(null)
    setResult(null)
    setOutputLines([])

    try {
      const nextResult = await window.bridge.runNonBreakingUpdate({
        repoPath: selectedRepo.path,
        branchName: `${branchName}-non-breaking-${Date.now()}`,
        createPR,
        runTests,
        testCommand: testCommand.trim() || undefined,
        prTitle: 'chore(deps): apply non-breaking dependency updates',
        prBody: 'Automated patch/minor dependency updates via Bridge.'
      })

      setResult(nextResult)

      if (nextResult.success) {
        await loadOutdatedPackages({ preserveResult: true })
        await loadRepoInfo()
        await loadMergeConflictWarnings()
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Non-breaking update failed'
      })
    } finally {
      setRunning(false)
      setProgress(null)
      setActiveRunType(null)
    }
  }

  const runMajorUpdates = async () => {
    if (!selectedRepo) return

    if (!selectedRepo.hasGit) {
      setResult({ success: false, error: "Git not initialized - run 'git init' first." })
      return
    }

    const selected = majorPackages.filter(pkg => selectedMajorPackages.has(getPackageKey(pkg)))
    if (selected.length === 0) {
      setResult({ success: false, error: 'Select at least one major update package.' })
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

    setActiveRunType('major')
    setRunning(true)
    setProgress(null)
    setResult(null)
    setOutputLines([])

    try {
      const nextResult = await window.bridge.runPatchBatch({
        repoPath: selectedRepo.path,
        branchName: `${branchName}-major-${Date.now()}`,
        packages: selected.map(pkg => ({ name: pkg.name, language: pkg.language })),
        createPR,
        runTests,
        updateStrategy: 'latest',
        testCommand: testCommand.trim() || undefined,
        prTitle: `chore(deps): update ${selected.length} major dependency versions`,
        prBody: `## Summary\nMajor dependency upgrades via Bridge.\n\n### Updated packages\n${selected.map(pkg => `- ${pkg.name}`).join('\n')}`
      })

      setResult(nextResult)

      if (nextResult.success) {
        await loadOutdatedPackages({ preserveResult: true })
        await loadRepoInfo()
        await loadMergeConflictWarnings()
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Major update failed'
      })
    } finally {
      setRunning(false)
      setProgress(null)
      setActiveRunType(null)
    }
  }

  const runSecurityPatch = async () => {
    if (!selectedRepo) return

    setSecurityRunning(true)
    setSecurityProgress(null)
    setSecurityResult(null)
    setSecurityLogs([])

    try {
      const nextResult = await window.bridge.runSecurityPatch({
        repoPath: selectedRepo.path,
        branchName: `bridge-security-patch-${Date.now()}`,
        createPR,
        runTests,
        testCommand: testCommand.trim() || undefined
      })

      setSecurityResult(nextResult)

      if (nextResult.success) {
        await loadOutdatedPackages({ preserveResult: true })
        await loadRepoInfo()
        await loadMergeConflictWarnings()
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
        <h3 className="empty-state-title">No package manager detected</h3>
        <p className="empty-state-desc">This repository does not have a supported dependency manifest.</p>
      </div>
    )
  }

  const isJavascriptRepo = (selectedRepo.languages ?? []).includes('javascript')

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div className="patch-header">
          <div>
            <h2 style={{ marginBottom: '4px' }}>Update Dependencies</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Non-breaking updates are automated. Major updates require explicit package selection.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => void loadOutdatedPackages()} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '14px', height: '14px' }} /> : 'Refresh'}
          </button>
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
            <div style={{ color: 'var(--warning)' }}>
              You're on <strong>{repoInfo.branch}</strong> (protected). Bridge will create a new branch automatically.
            </div>
          </div>
        )}

        {conflictWarnings.map((warning, index) => (
          <div
            key={`${warning.message}-${index}`}
            className="card"
            style={{
              marginBottom: '16px',
              borderColor: warning.severity === 'high' ? 'var(--error)' : 'var(--warning)',
              background: warning.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Merge conflict risk</div>
            <div style={{ marginBottom: '8px' }}>{warning.message}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{warning.recommendation}</div>
          </div>
        ))}

        {loadError && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <div style={{ color: 'var(--error)' }}>{loadError}</div>
          </div>
        )}

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header">
            <h3 className="card-title">Non-Breaking Updates (Patch + Minor)</h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => void runNonBreakingUpdates()}
              disabled={running || nonBreakingPackages.length === 0 || !selectedRepo.hasGit}
            >
              {running && activeRunType === 'non-breaking' ? 'Running...' : `Update ${nonBreakingPackages.length} Packages`}
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Runs the clean install/update sequence Marcus recommended, from inside the project context.
          </p>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header">
            <h3 className="card-title">Major Updates (Manual Selection)</h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => void runMajorUpdates()}
              disabled={running || selectedMajorPackages.size === 0 || !selectedRepo.hasGit}
            >
              {running && activeRunType === 'major' ? 'Running...' : `Update ${selectedMajorPackages.size} Major Packages`}
            </button>
          </div>
          {majorPackages.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No major updates available.</div>
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
                  {majorPackages.map(pkg => {
                    const key = getPackageKey(pkg)
                    const isSelected = selectedMajorPackages.has(key)
                    return (
                      <tr
                        key={key}
                        className={isSelected ? 'selected' : ''}
                        onClick={() => toggleMajorPackage(pkg)}
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
                            <span className="badge badge-warning">major</span>
                          </div>
                        </td>
                        <td>{pkg.current}</td>
                        <td className="version-new">{pkg.latest}</td>
                        <td>{pkg.type === 'devDependencies' ? 'devDep' : 'dep'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header">
            <h3 className="card-title">Security Vulnerability Auto-Patcher</h3>
            <button className="btn btn-primary btn-sm" onClick={() => void runSecurityPatch()} disabled={securityRunning || !selectedRepo.hasGit}>
              {securityRunning ? 'Patching...' : 'Patch High/Critical'}
            </button>
          </div>
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
              {securityResult.success ? 'Security patch run succeeded.' : securityResult.error || 'Security patch failed.'}
            </div>
          )}
          {securityLogs.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {securityLogs.slice(-4).map((line, i) => <div key={`${line}-${i}`}>{line}</div>)}
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
                  {result.prUrl ? 'PR created successfully.' : `Updates committed to branch '${result.branchName}'.`}
                </div>
                {result.prUrl && (
                  <div style={{ fontSize: '13px' }}>
                    PR: <a href={result.prUrl} target="_blank" rel="noopener noreferrer">{result.prUrl}</a>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--error)' }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                  {result.testsPassed === false ? 'Tests failed - no PR created' : 'Update failed'}
                </div>
                <div style={{ fontSize: '13px' }}>{result.error}</div>
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
              style={{ maxWidth: '320px' }}
            />
          </div>

          <div className="config-grid">
            <label className="checkbox-wrapper">
              <div className={`checkbox ${createPR ? 'checked' : ''}`} onClick={() => setCreatePR(!createPR)}>
                {createPR && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="checkbox-label">Create pull request (off by default)</span>
            </label>

            <label className="checkbox-wrapper">
              <div className={`checkbox ${runTests ? 'checked' : ''}`} onClick={() => setRunTests(!runTests)}>
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
                Detected command: {testCommand}
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
