import { useEffect, useMemo, useState } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { BridgeConfig, BridgeProjectConfigResult, OutdatedPackage, PatchBatchResult } from '../../types'
import Scheduler from '../Scheduler/Scheduler'

export default function PatchBatch() {
  const { selectedRepo } = useRepositories()
  const [packages, setPackages] = useState<OutdatedPackage[]>([])
  const [selectedReviewPackages, setSelectedReviewPackages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ message: string; step: number; total: number } | null>(null)
  const [result, setResult] = useState<PatchBatchResult | null>(null)
  const [projectConfig, setProjectConfig] = useState<BridgeProjectConfigResult | null>(null)
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfig | null>(null)

  const [branchName, setBranchName] = useState('bridge-update-deps')
  const [repoInfo, setRepoInfo] = useState<{ branch: string; isProtectedBranch: boolean } | null>(null)
  const [outputLines, setOutputLines] = useState<string[]>([])
  const [testCommand, setTestCommand] = useState('')
  const [testCommandDetected, setTestCommandDetected] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showScheduler, setShowScheduler] = useState(false)
  const [createPrEnabled, setCreatePrEnabled] = useState(false)
  const [dependencyDebtDelta, setDependencyDebtDelta] = useState<{ before: number; after: number; delta: number } | null>(null)

  const patchConfig = projectConfig?.config.patch
  const runTestsOnRun = patchConfig?.runTests ?? true
  const configuredBaseBranch = patchConfig?.baseBranch || projectConfig?.config.baseBranch
  const remoteFirst = patchConfig?.remoteFirst ?? true
  const runTests = runTestsOnRun
  const updatePolicy = bridgeConfig?.dependencies.updatePolicy || { patch: 'auto', minor: 'auto', major: 'review' }

  const getPackageKey = (pkg: OutdatedPackage) => `${pkg.language}:${pkg.name}`
  const estimateDependencyDebt = (list: OutdatedPackage[]) => {
    return list.reduce((sum, pkg) => {
      const updatePoints = pkg.updateType === 'patch' ? 1 : pkg.updateType === 'minor' ? 2 : pkg.updateType === 'major' ? 5 : 0
      const vulnPoints = (pkg.vulnerabilities?.critical || 0) * 2 + (pkg.vulnerabilities?.high || 0)
      return sum + updatePoints + vulnPoints
    }, 0)
  }

  const nonBreakingPackages = useMemo(
    () => packages.filter(pkg => pkg.isNonBreaking),
    [packages]
  )
  const majorPackages = useMemo(
    () => packages.filter(pkg => pkg.updateType === 'major'),
    [packages]
  )
  const sortedPackages = useMemo(() => {
    const order: Record<OutdatedPackage['updateType'], number> = {
      patch: 0,
      minor: 1,
      major: 2,
      unknown: 3
    }
    return [...packages].sort((a, b) => {
      const aAuto = a.isNonBreaking ? 0 : 1
      const bAuto = b.isNonBreaking ? 0 : 1
      if (aAuto !== bAuto) return aAuto - bAuto
      if (order[a.updateType] !== order[b.updateType]) {
        return order[a.updateType] - order[b.updateType]
      }
      return a.name.localeCompare(b.name)
    })
  }, [packages])
  const selectedPackageCount = nonBreakingPackages.length + selectedReviewPackages.size

  const getUpdateTypeBadgeClass = (updateType: OutdatedPackage['updateType']) => {
    switch (updateType) {
      case 'major':
        return 'badge-warning'
      case 'minor':
        return 'badge-accent'
      case 'patch':
        return 'badge-success'
      default:
        return 'badge'
    }
  }

  useEffect(() => {
    if (selectedRepo) {
      void loadProjectConfig()
      void loadOutdatedPackages()
      void loadRepoInfo()
      void detectTestCommand()
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

    return () => {
      cleanupProgress()
      cleanupLog()
      cleanupWarning()
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

  const loadProjectConfig = async () => {
    if (!selectedRepo) return
    try {
      const [config, fullConfig] = await Promise.all([
        window.bridge.getBridgeProjectConfig(selectedRepo.path),
        window.bridge.loadBridgeConfig(selectedRepo.path)
      ])
      setProjectConfig(config)
      setBridgeConfig(fullConfig)
      setCreatePrEnabled(config.config.patch?.createPR ?? false)
      const configuredBranchPrefix = config.config.patch?.branchPrefix || config.config.branchPrefix
      if (configuredBranchPrefix) {
        setBranchName(configuredBranchPrefix)
      }
      const configuredTestCommand = config.config.patch?.testCommand || fullConfig.gates.tests.command
      if (configuredTestCommand) {
        setTestCommand(configuredTestCommand)
        setTestCommandDetected(false)
      }
    } catch {
      setProjectConfig(null)
      setBridgeConfig(null)
      setCreatePrEnabled(false)
    }
  }

  const detectTestCommand = async () => {
    if (!selectedRepo) return
    try {
      const [project, full] = await Promise.all([
        window.bridge.getBridgeProjectConfig(selectedRepo.path),
        window.bridge.loadBridgeConfig(selectedRepo.path)
      ])
      const configuredCommand = project.config.patch?.testCommand || full.gates.tests.command
      if (configuredCommand) {
        setTestCommand(configuredCommand)
        setTestCommandDetected(false)
        return
      }
    } catch {}

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
      if (fileNames.has('package-lock.json')) {
        packageManager = 'npm'
      } else if (fileNames.has('pnpm-lock.yaml')) {
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

  const loadOutdatedPackages = async (options?: { preserveResult?: boolean }): Promise<OutdatedPackage[] | null> => {
    if (!selectedRepo) return null

    setLoading(true)
    if (!options?.preserveResult) {
      setResult(null)
    }
    setLoadError(null)

    try {
      const [outdated, fullConfig] = await Promise.all([
        window.bridge.getOutdatedPackages(selectedRepo.path),
        window.bridge.loadBridgeConfig(selectedRepo.path)
      ])

      setBridgeConfig(fullConfig)
      const policy = fullConfig.dependencies.updatePolicy
      const filtered = outdated.filter(pkg => {
        if (pkg.updateType === 'patch' && policy.patch === 'ignore') return false
        if (pkg.updateType === 'minor' && policy.minor === 'ignore') return false
        if (pkg.updateType === 'major' && policy.major === 'ignore') return false
        return true
      })

      setPackages(filtered)

      const autoSelectedMajors = filtered
        .filter(pkg => !pkg.isNonBreaking && ((pkg.vulnerabilities?.critical || 0) > 0 || (pkg.vulnerabilities?.high || 0) > 0))
        .map(getPackageKey)
      setSelectedReviewPackages(new Set(autoSelectedMajors))
      return filtered
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load outdated packages'
      setLoadError(message)
      setPackages([])
      setSelectedReviewPackages(new Set())
      return null
    } finally {
      setLoading(false)
    }
  }

  const toggleReviewPackage = (pkg: OutdatedPackage) => {
    if (pkg.isNonBreaking) return
    const key = getPackageKey(pkg)
    const next = new Set(selectedReviewPackages)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    setSelectedReviewPackages(next)
  }

  const runSelectedUpdates = async () => {
    if (!selectedRepo) return

    if (!selectedRepo.hasGit) {
      setResult({ success: false, error: "Git not initialized - run 'git init' first." })
      return
    }

    if (nonBreakingPackages.length === 0 && selectedReviewPackages.size === 0) {
      setResult({ success: false, error: 'No dependency updates selected.' })
      return
    }

    if (createPrEnabled) {
      const ghStatus = await window.bridge.getGitHubCliStatus(selectedRepo.path)
      if (!ghStatus.installed || !ghStatus.authenticated) {
        setResult({
          success: false,
          error: ghStatus.message || 'PR creation requires GitHub CLI. Install with `brew install gh` and run `gh auth login`.'
        })
        return
      }
    }

    setRunning(true)
    setProgress(null)
    setResult(null)
    setDependencyDebtDelta(null)
    setOutputLines([])
    const beforeDependencyDebt = estimateDependencyDebt(packages)

    try {
      const nextResult = await window.bridge.runNonBreakingUpdate({
        repoPath: selectedRepo.path,
        branchName: `${branchName}-non-breaking-${Date.now()}`,
        createPR: createPrEnabled,
        runTests: runTestsOnRun,
        baseBranch: configuredBaseBranch,
        remoteFirst,
        selectedReviewPackages: packages
          .filter(pkg => selectedReviewPackages.has(getPackageKey(pkg)))
          .map(pkg => pkg.name),
        testCommand: testCommand.trim() || undefined,
        prTitle: 'chore(deps): apply non-breaking dependency updates',
        prBody: 'Automated patch/minor dependency updates via Bridge.'
      })

      setResult(nextResult)

      if (nextResult.success) {
        const refreshedPackages = await loadOutdatedPackages({ preserveResult: true })
        await loadRepoInfo()
        if (refreshedPackages) {
          const afterDependencyDebt = estimateDependencyDebt(refreshedPackages)
          setDependencyDebtDelta({
            before: beforeDependencyDebt,
            after: afterDependencyDebt,
            delta: afterDependencyDebt - beforeDependencyDebt
          })
        }
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Non-breaking update failed'
      })
    } finally {
      setRunning(false)
      setProgress(null)
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
              One click runs pull latest, test, clean install script, test, commit, and push from remote source-of-truth.
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

        {loadError && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <div style={{ color: 'var(--error)' }}>{loadError}</div>
          </div>
        )}

        {projectConfig?.exists && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--accent)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Using config: <code>{projectConfig.path}</code>
            </div>
            <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Base branch: {configuredBaseBranch || 'origin HEAD'} · Remote-first: {remoteFirst ? 'enabled' : 'disabled'} · Mode: {createPrEnabled ? 'Push + PR' : 'Push only'}
            </div>
            {bridgeConfig && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Update policy: patch {updatePolicy.patch}, minor {updatePolicy.minor}, major {updatePolicy.major}
              </div>
            )}
            {projectConfig.errors.length > 0 && (
              <div style={{ marginTop: '6px', color: 'var(--warning)', fontSize: '12px' }}>
                Config warning: {projectConfig.errors.join('; ')}
              </div>
            )}
          </div>
        )}

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header">
            <h3 className="card-title">All Outdated Dependencies</h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => void runSelectedUpdates()}
              disabled={running || (!selectedRepo.hasGit) || (nonBreakingPackages.length === 0 && selectedReviewPackages.size === 0)}
            >
              {running
                ? 'Running...'
                : createPrEnabled
                  ? `Update Patch/Minor [${selectedPackageCount}] + PR`
                  : `Update Patch/Minor [${selectedPackageCount}]`}
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '10px' }}>
            Runs: pull latest → tests → clean install/update script → tests → commit → push.
          </p>
          {nonBreakingPackages.length === 0 && majorPackages.length > 0 && (
            <div style={{ color: 'var(--warning)', fontSize: '12px', marginBottom: '10px' }}>
              No patch/minor updates are available in this repo right now. Only major upgrades are available, so select them manually if you want to include them.
            </div>
          )}
          {packages.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              No outdated dependencies detected.
            </div>
          ) : (
            <div className="package-table-wrapper">
              <table className="package-table">
                <thead>
                  <tr>
                    <th />
                    <th>Package Name</th>
                    <th>Current</th>
                    <th>Wanted</th>
                    <th>Latest</th>
                    <th>Update Type</th>
                    <th>Type</th>
                    <th>Vulns</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPackages.map(pkg => {
                    const key = getPackageKey(pkg)
                    const isChecked = pkg.isNonBreaking || selectedReviewPackages.has(key)
                    const isDisabled = pkg.isNonBreaking
                    return (
                      <tr
                        key={`all-${key}`}
                        className={isChecked ? 'selected' : ''}
                        onClick={() => {
                          if (!isDisabled) {
                            toggleReviewPackage(pkg)
                          }
                        }}
                      >
                        <td>
                          <div className={`checkbox ${isChecked ? 'checked' : ''}`} style={isDisabled ? { opacity: 0.6 } : undefined}>
                            {isChecked && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="package-name-cell">
                            <div className="package-name">{pkg.name}</div>
                          </div>
                        </td>
                        <td>{pkg.current}</td>
                        <td>{pkg.wanted}</td>
                        <td className="version-new">{pkg.latest}</td>
                        <td>
                          <span className={`badge ${getUpdateTypeBadgeClass(pkg.updateType)}`}>
                            {pkg.updateType}
                          </span>
                        </td>
                        <td>{pkg.type === 'devDependencies' ? 'devDep' : 'dep'}</td>
                        <td>
                          {(pkg.vulnerabilities?.total || 0) > 0 ? (
                            <span className="badge badge-warning">
                              C{pkg.vulnerabilities?.critical || 0} H{pkg.vulnerabilities?.high || 0} M{pkg.vulnerabilities?.medium || 0} L{pkg.vulnerabilities?.low || 0}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-tertiary)' }}>0</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
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
                  {result.prUrl
                    ? 'PR created successfully.'
                    : result.branchPushed
                      ? `Changes committed and pushed on '${result.branchName}'.`
                      : `Changes committed locally on '${result.branchName}' and ready to push.`}
                </div>
                {result.prUrl && (
                  <div style={{ fontSize: '13px' }}>
                    PR: <a href={result.prUrl} target="_blank" rel="noopener noreferrer">{result.prUrl}</a>
                  </div>
                )}
                {dependencyDebtDelta && (
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    Dependency debt: {dependencyDebtDelta.before} → {dependencyDebtDelta.after}{' '}
                    <strong style={{ color: dependencyDebtDelta.delta <= 0 ? 'var(--success)' : 'var(--error)' }}>
                      ({dependencyDebtDelta.delta >= 0 ? '+' : ''}{dependencyDebtDelta.delta})
                    </strong>
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
          <label className="simple-checkbox">
            <input
              type="checkbox"
              checked={createPrEnabled}
              onChange={e => setCreatePrEnabled(e.target.checked)}
            />
            <span className="checkbox-label">Create Pull Request (requires GitHub CLI)</span>
          </label>
          {createPrEnabled && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              If needed: <code>brew install gh</code> then <code>gh auth login</code>.
            </div>
          )}

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

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {runTests ? 'Tests run before and after updates.' : 'Tests are disabled via .bridge.json for this repo.'}
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
            />
            {runTests && testCommandDetected && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Detected command: {testCommand}
              </div>
            )}
            {runTests && isJavascriptRepo && !testCommandDetected && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--warning)' }}>
                No root test script found. Bridge will still attempt workspace validation scripts.
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
