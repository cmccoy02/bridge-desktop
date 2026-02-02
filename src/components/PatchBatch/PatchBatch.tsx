import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { OutdatedPackage, Language } from '../../types'

const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: 'JS',
  python: 'Py',
  ruby: 'Rb',
  elixir: 'Ex',
  unknown: '?'
}

export default function PatchBatch() {
  const { selectedRepo } = useRepositories()
  const [packages, setPackages] = useState<OutdatedPackage[]>([])
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ message: string; step: number; total: number } | null>(null)
  const [result, setResult] = useState<{ success: boolean; prUrl?: string | null; error?: string; testsPassed?: boolean } | null>(null)
  const [branchName, setBranchName] = useState('patch-updates')
  const [createPR, setCreatePR] = useState(true)
  const [runTests, setRunTests] = useState(true)
  const [repoInfo, setRepoInfo] = useState<{ branch: string; isProtectedBranch: boolean } | null>(null)

  useEffect(() => {
    if (selectedRepo) {
      loadOutdatedPackages()
      loadRepoInfo()
    }
  }, [selectedRepo])

  useEffect(() => {
    if (running) {
      const cleanup = window.bridge.onPatchBatchProgress(setProgress)
      return cleanup
    }
  }, [running])

  const loadRepoInfo = async () => {
    if (!selectedRepo) return
    const info = await window.bridge.getRepoInfo(selectedRepo.path)
    setRepoInfo(info)
  }

  const loadOutdatedPackages = async () => {
    if (!selectedRepo) return

    setLoading(true)
    setResult(null)
    try {
      const outdated = await window.bridge.getOutdatedPackages(selectedRepo.path)
      setPackages(outdated)

      const patchPackages = outdated.filter(p => p.hasPatchUpdate).map(p => `${p.language}:${p.name}`)
      setSelectedPackages(new Set(patchPackages))
    } catch (error) {
      console.error('Failed to get outdated packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPackageKey = (pkg: OutdatedPackage) => `${pkg.language}:${pkg.name}`

  const togglePackage = (pkg: OutdatedPackage) => {
    const key = getPackageKey(pkg)
    const next = new Set(selectedPackages)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    setSelectedPackages(next)
  }

  const selectAllPatch = () => {
    const patchPackages = packages.filter(p => p.hasPatchUpdate).map(getPackageKey)
    setSelectedPackages(new Set(patchPackages))
  }

  const clearSelection = () => {
    setSelectedPackages(new Set())
  }

  const runPatchBatch = async () => {
    if (!selectedRepo || selectedPackages.size === 0) return

    setRunning(true)
    setProgress(null)
    setResult(null)

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
        prTitle: `chore(deps): update ${packagesToUpdate.length} packages to latest patch versions`,
        prBody: `## Summary\nAutomated patch version updates via Bridge.\n\n### Updated packages\n${packagesToUpdate.map(p => `- ${p.name} (${p.language})`).join('\n')}`
      })

      setResult(result)

      if (result.success) {
        await loadOutdatedPackages()
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

  const patchUpdatesCount = packages.filter(p => p.hasPatchUpdate).length

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
        <h3 className="empty-state-title">No supported package manager</h3>
        <p className="empty-state-desc">This repository doesn't have package.json, requirements.txt, Gemfile, or mix.exs</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Patch Batch</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Update packages to their latest patch versions safely.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={loadOutdatedPackages}
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
                <div style={{ fontWeight: 500, marginBottom: '8px', color: 'var(--success)' }}>
                  Patch update completed successfully!
                </div>
                {result.testsPassed && (
                  <div style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    All tests passed
                  </div>
                )}
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
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>Update failed</div>
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
              placeholder="patch-updates"
              style={{ maxWidth: '300px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
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
              <span className="checkbox-label">Run tests before PR</span>
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Outdated Packages</h3>
            {patchUpdatesCount > 0 && (
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {patchUpdatesCount} patch update{patchUpdatesCount !== 1 ? 's' : ''} available
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-ghost btn-sm" onClick={selectAllPatch}>
              Select patch updates
            </button>
            <button className="btn btn-ghost btn-sm" onClick={clearSelection}>
              Clear
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
          <div className="package-list">
            {packages.map(pkg => {
              const key = getPackageKey(pkg)
              return (
                <div
                  key={key}
                  className={`package-item ${selectedPackages.has(key) ? 'selected' : ''}`}
                  onClick={() => pkg.hasPatchUpdate && togglePackage(pkg)}
                  style={{ opacity: pkg.hasPatchUpdate ? 1 : 0.5, cursor: pkg.hasPatchUpdate ? 'pointer' : 'default' }}
                >
                  <div
                    className={`checkbox ${selectedPackages.has(key) ? 'checked' : ''}`}
                    style={{ pointerEvents: 'none' }}
                  >
                    {selectedPackages.has(key) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="package-info">
                    <div className="package-name">{pkg.name}</div>
                    <div className="package-versions">
                      <span>{pkg.current}</span>
                      <span className="version-arrow">→</span>
                      <span className="version-new">{pkg.wanted}</span>
                      {pkg.latest !== pkg.wanted && (
                        <>
                          <span style={{ color: 'var(--text-tertiary)' }}>|</span>
                          <span style={{ color: 'var(--text-tertiary)' }}>latest: {pkg.latest}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '10px' }}>
                    {LANGUAGE_LABELS[pkg.language]}
                  </span>
                  <span className={`badge ${pkg.hasPatchUpdate ? 'badge-success' : 'badge-warning'}`}>
                    {pkg.hasPatchUpdate ? 'patch' : 'minor/major'}
                  </span>
                  <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    {pkg.type === 'devDependencies' ? 'dev' : 'prod'}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {packages.length > 0 && (
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              {selectedPackages.size} package{selectedPackages.size !== 1 ? 's' : ''} selected
            </span>
            <button
              className="btn btn-primary"
              onClick={runPatchBatch}
              disabled={selectedPackages.size === 0 || running}
            >
              {running ? (
                <>
                  <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#000' }} />
                  Running...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-9-9" />
                    <path d="M21 3v6h-6" />
                  </svg>
                  Run Patch Batch
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
