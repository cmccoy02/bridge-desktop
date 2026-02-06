import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { ScheduledJob, ScheduleFrequency, JobResult, SmartScanSchedule } from '../../types'

const FREQUENCY_LABELS: Record<ScheduleFrequency, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly'
}

export default function Scheduler() {
  const { repositories } = useRepositories()
  const [jobs, setJobs] = useState<ScheduledJob[]>([])
  const [results, setResults] = useState<JobResult[]>([])
  const [smartSchedules, setSmartSchedules] = useState<SmartScanSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [smartMessage, setSmartMessage] = useState<string | null>(null)

  // New job form state
  const [selectedRepo, setSelectedRepo] = useState('')
  const [frequency, setFrequency] = useState<ScheduleFrequency>('weekly')
  const [createPR, setCreatePR] = useState(true)
  const [runTests, setRunTests] = useState(true)
  const [smartRepo, setSmartRepo] = useState('')

  useEffect(() => {
    loadJobs()
    loadSmartSchedules()
  }, [])

  useEffect(() => {
    const cleanup = window.bridge.onSmartScanStarted(({ repoName }) => {
      setSmartMessage(`Smart scan started for ${repoName}`)
      setTimeout(() => setSmartMessage(null), 4000)
    })
    return cleanup
  }, [])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const [jobsData, resultsData] = await Promise.all([
        window.bridge.getScheduledJobs(),
        window.bridge.getJobResults()
      ])
      setJobs(jobsData)
      setResults(resultsData)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSmartSchedules = async () => {
    try {
      const schedules = await window.bridge.getSmartScanSchedules()
      setSmartSchedules(schedules)
    } catch (error) {
      console.error('Failed to load smart schedules:', error)
    }
  }

  const addJob = async () => {
    if (!selectedRepo) return

    const repo = repositories.find(r => r.path === selectedRepo)
    if (!repo) return

    try {
      await window.bridge.addScheduledJob({
        repoPath: repo.path,
        repoName: repo.name,
        frequency,
        enabled: true,
        language: repo.languages?.[0] || 'javascript',
        createPR,
        runTests
      })
      await loadJobs()
      setShowAddModal(false)
      setSelectedRepo('')
    } catch (error) {
      console.error('Failed to add job:', error)
    }
  }

  const toggleJob = async (jobId: string, enabled: boolean) => {
    try {
      await window.bridge.updateScheduledJob(jobId, { enabled })
      await loadJobs()
    } catch (error) {
      console.error('Failed to toggle job:', error)
    }
  }

  const deleteJob = async (jobId: string) => {
    try {
      await window.bridge.deleteScheduledJob(jobId)
      await loadJobs()
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  const addSmartSchedule = async () => {
    if (!smartRepo) return
    const repo = repositories.find(r => r.path === smartRepo)
    if (!repo) return
    try {
      await window.bridge.addSmartScanSchedule({ repoPath: repo.path, repoName: repo.name })
      setSmartRepo('')
      await loadSmartSchedules()
    } catch (error) {
      console.error('Failed to add smart schedule:', error)
    }
  }

  const toggleSmartSchedule = async (id: string, enabled: boolean) => {
    try {
      await window.bridge.updateSmartScanSchedule(id, { enabled })
      await loadSmartSchedules()
    } catch (error) {
      console.error('Failed to update smart schedule:', error)
    }
  }

  const deleteSmartSchedule = async (id: string) => {
    try {
      await window.bridge.deleteSmartScanSchedule(id)
      await loadSmartSchedules()
    } catch (error) {
      console.error('Failed to delete smart schedule:', error)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getJobResults = (jobId: string) => {
    return results.filter(r => r.jobId === jobId).slice(0, 5)
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Scheduler</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Set it and forget it. Automate package updates on a schedule.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Schedule
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Smart TD Scans</h3>
        </div>
        <div style={{ padding: '0 16px 16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
            Bridge will analyze commit patterns and schedule scans during low-activity hours.
          </p>

          {smartMessage && <div className="alert success" style={{ marginBottom: '12px' }}>{smartMessage}</div>}

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <select
              className="input"
              value={smartRepo}
              onChange={e => setSmartRepo(e.target.value)}
              style={{ minWidth: '220px' }}
            >
              <option value="">Select repository...</option>
              {repositories.filter(r => r.exists && r.hasGit).map(repo => (
                <option key={repo.path} value={repo.path}>
                  {repo.name}
                </option>
              ))}
            </select>
            <button className="btn btn-primary btn-sm" onClick={addSmartSchedule} disabled={!smartRepo}>
              Enable Smart Scan
            </button>
          </div>

          {smartSchedules.length === 0 ? (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>No smart scans configured.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {smartSchedules.map(schedule => (
                <div key={schedule.id} className="list-item">
                  <div>
                    <div className="list-title">{schedule.repoName}</div>
                    <div className="list-sub">Quiet hour: {schedule.quietHour}:00 · Next run: {formatDate(schedule.nextRun)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => toggleSmartSchedule(schedule.id, !schedule.enabled)}>
                      {schedule.enabled ? 'Pause' : 'Resume'}
                    </button>
                    <button className="btn btn-ghost btn-icon" onClick={() => deleteSmartSchedule(schedule.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="spinner" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h3 className="empty-state-title">No scheduled jobs</h3>
            <p className="empty-state-desc">Create a schedule to automatically update packages</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              Add Schedule
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map(job => (
            <div key={job.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: job.enabled ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={job.enabled ? 'var(--accent)' : 'var(--text-tertiary)'} strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{job.repoName}</h3>
                    <span className={`badge ${job.enabled ? 'badge-success' : ''}`} style={{ background: job.enabled ? undefined : 'var(--bg-tertiary)', color: job.enabled ? undefined : 'var(--text-tertiary)' }}>
                      {job.enabled ? 'Active' : 'Paused'}
                    </span>
                    <span className="badge badge-accent">{FREQUENCY_LABELS[job.frequency]}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {job.repoPath}
                  </div>

                  <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Last run:</span> {formatDate(job.lastRun)}
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Next run:</span> {formatDate(job.nextRun)}
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Options:</span>{' '}
                      {job.createPR ? 'Create PR' : 'No PR'}, {job.runTests ? 'Run tests' : 'Skip tests'}
                    </div>
                  </div>

                  {/* Recent results */}
                  {getJobResults(job.id).length > 0 && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Recent runs:</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {getJobResults(job.id).map((result, i) => (
                          <div
                            key={i}
                            title={result.success ? `Updated ${result.updatedPackages.length} packages` : result.error}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              background: result.success ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {result.success ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="3">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleJob(job.id, !job.enabled)}
                  >
                    {job.enabled ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => deleteJob(job.id)}
                    title="Delete schedule"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '480px', margin: '20px' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '20px' }}>Add Schedule</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Repository
                </label>
                <select
                  className="input"
                  value={selectedRepo}
                  onChange={e => setSelectedRepo(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select a repository...</option>
                  {repositories.filter(r => r.exists && r.hasGit).map(repo => (
                    <option key={repo.path} value={repo.path}>
                      {repo.name} ({(repo.languages ?? []).join(', ') || 'unknown'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Frequency
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['hourly', 'daily', 'weekly', 'monthly'] as ScheduleFrequency[]).map(freq => (
                    <button
                      key={freq}
                      className={`btn ${frequency === freq ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      onClick={() => setFrequency(freq)}
                      style={{ flex: 1 }}
                    >
                      {FREQUENCY_LABELS[freq]}
                    </button>
                  ))}
                </div>
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
                  <span className="checkbox-label">Create PR</span>
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
                  <span className="checkbox-label">Run tests</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={addJob}
                disabled={!selectedRepo}
              >
                Add Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
