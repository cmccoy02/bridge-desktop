import { useState, useEffect, useMemo } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import type { ScheduledJob, ScheduleFrequency, JobResult, SmartScanSchedule, ScheduledJobCreateInput } from '../../types'

const FREQUENCY_LABELS: Record<ScheduleFrequency, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly'
}

const WEEKDAY_OPTIONS = [
  { value: 0, short: 'Sun', long: 'Sunday' },
  { value: 1, short: 'Mon', long: 'Monday' },
  { value: 2, short: 'Tue', long: 'Tuesday' },
  { value: 3, short: 'Wed', long: 'Wednesday' },
  { value: 4, short: 'Thu', long: 'Thursday' },
  { value: 5, short: 'Fri', long: 'Friday' },
  { value: 6, short: 'Sat', long: 'Saturday' }
] as const

function getDefaultStartDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

function getDefaultTimeOfDay(): string {
  return '06:00'
}

function buildStartAtIso(startDate: string, timeOfDay: string): string {
  const dateTime = new Date(`${startDate}T${timeOfDay}:00`)
  if (Number.isNaN(dateTime.getTime())) {
    return new Date().toISOString()
  }
  return dateTime.toISOString()
}

function formatTimeOfDay(timeOfDay: string): string {
  const [hourRaw, minuteRaw] = timeOfDay.split(':').map(Number)
  const date = new Date()
  date.setHours(Number.isFinite(hourRaw) ? hourRaw : 0, Number.isFinite(minuteRaw) ? minuteRaw : 0, 0, 0)
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function formatJobRecurrence(job: ScheduledJob): string {
  const formattedTime = formatTimeOfDay(job.timeOfDay)

  switch (job.frequency) {
    case 'hourly':
      return `Every ${job.intervalHours} hour${job.intervalHours === 1 ? '' : 's'}`
    case 'daily':
      return `Every day at ${formattedTime}`
    case 'weekly': {
      const days = (job.daysOfWeek || [])
        .map(day => WEEKDAY_OPTIONS.find(option => option.value === day)?.short)
        .filter(Boolean)
      return `Weekly on ${days.length ? days.join(', ') : 'selected days'} at ${formattedTime}`
    }
    case 'monthly':
      return `Monthly on day ${job.dayOfMonth} at ${formattedTime}`
    default:
      return 'Custom recurrence'
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Scheduler() {
  const { repositories } = useRepositories()
  const { settings } = useAppSettings()
  const [jobs, setJobs] = useState<ScheduledJob[]>([])
  const [results, setResults] = useState<JobResult[]>([])
  const [smartSchedules, setSmartSchedules] = useState<SmartScanSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [smartMessage, setSmartMessage] = useState<string | null>(null)

  // New job form state
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set())
  const [frequency, setFrequency] = useState<ScheduleFrequency>('weekly')
  const runTests = true
  const [startDate, setStartDate] = useState(getDefaultStartDate())
  const [timeOfDay, setTimeOfDay] = useState(getDefaultTimeOfDay())
  const [intervalHours, setIntervalHours] = useState(24)
  const [weeklyDays, setWeeklyDays] = useState<Set<number>>(new Set([new Date().getDay()]))
  const [monthlyDay, setMonthlyDay] = useState(new Date().getDate())
  const [smartRepo, setSmartRepo] = useState('')

  const availableRepos = useMemo(
    () => repositories.filter(repo => repo.exists && repo.hasGit),
    [repositories]
  )

  const recurrenceSummary = useMemo(() => {
    const formattedTime = formatTimeOfDay(timeOfDay)
    switch (frequency) {
      case 'hourly':
        return `Runs every ${intervalHours} hour${intervalHours === 1 ? '' : 's'}, starting ${formattedTime}`
      case 'daily':
        return `Runs every day at ${formattedTime}`
      case 'weekly': {
        const labels = Array.from(weeklyDays)
          .sort((a, b) => a - b)
          .map(day => WEEKDAY_OPTIONS.find(option => option.value === day)?.long)
          .filter(Boolean)
        return `Runs every week on ${labels.length ? labels.join(', ') : 'selected days'} at ${formattedTime}`
      }
      case 'monthly':
        return `Runs every month on day ${monthlyDay} at ${formattedTime}`
      default:
        return 'Runs on a recurring schedule'
    }
  }, [frequency, intervalHours, monthlyDay, timeOfDay, weeklyDays])

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

  const resetForm = () => {
    setSelectedRepos(new Set())
    setFrequency('weekly')
    setStartDate(getDefaultStartDate())
    setTimeOfDay(getDefaultTimeOfDay())
    setIntervalHours(24)
    setWeeklyDays(new Set([new Date().getDay()]))
    setMonthlyDay(new Date().getDate())
  }

  const addJob = async () => {
    if (selectedRepos.size === 0) return

    const selectedWeeklyDays = Array.from(weeklyDays).sort((a, b) => a - b)
    const startAt = buildStartAtIso(startDate, timeOfDay)

    const batchInputs: ScheduledJobCreateInput[] = availableRepos
      .filter(repo => selectedRepos.has(repo.path))
      .map(repo => ({
        repoPath: repo.path,
        repoName: repo.name,
        frequency,
        intervalHours: frequency === 'hourly' ? Math.max(1, Math.min(24, intervalHours)) : undefined,
        daysOfWeek: frequency === 'weekly' ? (selectedWeeklyDays.length ? selectedWeeklyDays : [new Date(startAt).getDay()]) : undefined,
        dayOfMonth: frequency === 'monthly' ? Math.max(1, Math.min(31, monthlyDay)) : undefined,
        timeOfDay,
        startAt,
        enabled: true,
        language: repo.languages?.[0] || 'javascript',
        createPR: false,
        runTests
      }))

    if (batchInputs.length === 0) return

    try {
      await window.bridge.addScheduledJobsBatch(batchInputs)
      await loadJobs()
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error('Failed to add job:', error)
    }
  }

  const toggleSelectedRepo = (repoPath: string) => {
    setSelectedRepos(prev => {
      const next = new Set(prev)
      if (next.has(repoPath)) {
        next.delete(repoPath)
      } else {
        next.add(repoPath)
      }
      return next
    })
  }

  const toggleWeeklyDay = (day: number) => {
    setWeeklyDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) {
        if (next.size === 1) {
          return next
        }
        next.delete(day)
      } else {
        next.add(day)
      }
      return next
    })
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
            New Recurring Update
          </button>
        </div>
      </div>

      {settings.experimentalFeatures && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">Smart TD Scans</h3>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
              Bridge analyzes commit patterns and schedules scans during low-activity hours.
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
                {availableRepos.map(repo => (
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
      )}

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
            <p className="empty-state-desc">Create a recurring event to automate non-breaking dependency updates.</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              Create First Schedule
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
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {job.repoPath}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {formatJobRecurrence(job)}
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
                      Local commit only, {job.runTests ? 'run tests' : 'skip tests'}
                    </div>
                  </div>

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

      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(2, 6, 23, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => {
            setShowAddModal(false)
            resetForm()
          }}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '760px', margin: '20px', maxHeight: '90vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ marginBottom: '6px' }}>Create Recurring Update</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Configure this like a calendar event. Bridge will run non-breaking dependency updates on the schedule.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Repositories
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedRepos(new Set(availableRepos.map(r => r.path)))}
                  >
                    Select All
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedRepos(new Set())}>
                    Clear
                  </button>
                </div>
                <div style={{ maxHeight: '300px', overflow: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '8px' }}>
                  {availableRepos.length === 0 && (
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '8px' }}>
                      No git repositories available in your current code directory.
                    </div>
                  )}
                  {availableRepos.map(repo => {
                    const checked = selectedRepos.has(repo.path)
                    return (
                      <label key={repo.path} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 6px', borderRadius: '8px', background: checked ? 'var(--accent-light)' : 'transparent', cursor: 'pointer' }}>
                        <input type="checkbox" checked={checked} onChange={() => toggleSelectedRepo(repo.path)} />
                        <span style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{repo.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{repo.path}</span>
                        </span>
                      </label>
                    )
                  })}
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  Selected repositories: {selectedRepos.size}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Repeat
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', marginBottom: '12px' }}>
                  {(['hourly', 'daily', 'weekly', 'monthly'] as ScheduleFrequency[]).map(freq => (
                    <button
                      key={freq}
                      className={`btn ${frequency === freq ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      onClick={() => setFrequency(freq)}
                    >
                      {FREQUENCY_LABELS[freq]}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>Start date</label>
                    <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>Time</label>
                    <input type="time" className="input" value={timeOfDay} onChange={e => setTimeOfDay(e.target.value)} />
                  </div>
                </div>

                {frequency === 'hourly' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Repeat every (hours)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      className="input"
                      value={intervalHours}
                      onChange={e => setIntervalHours(Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
                    />
                  </div>
                )}

                {frequency === 'weekly' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Repeat on
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px' }}>
                      {WEEKDAY_OPTIONS.map(day => {
                        const selected = weeklyDays.has(day.value)
                        return (
                          <button
                            key={day.value}
                            className={`btn ${selected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                            onClick={() => toggleWeeklyDay(day.value)}
                            title={day.long}
                          >
                            {day.short}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {frequency === 'monthly' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Day of month
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      className="input"
                      value={monthlyDay}
                      onChange={e => setMonthlyDay(Math.max(1, Math.min(31, Number(e.target.value) || 1)))}
                    />
                  </div>
                )}

                <div className="alert" style={{ fontSize: '12px', marginTop: '4px' }}>
                  <div style={{ marginBottom: '4px', color: 'var(--text-secondary)' }}>Summary</div>
                  <div>{recurrenceSummary}</div>
                </div>

                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Scheduled updates always run tests before and after dependency changes.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={addJob}
                disabled={selectedRepos.size === 0}
              >
                Create {selectedRepos.size || ''} Schedule{selectedRepos.size === 1 ? '' : 's'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
