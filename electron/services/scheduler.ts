import { BrowserWindow } from 'electron'
import { createBridgeStore } from './store'

const store = createBridgeStore('bridge-scheduler')

export type ScheduleFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly'

export interface ScheduledJob {
  id: string
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
  intervalHours: number
  daysOfWeek: number[]
  dayOfMonth: number
  timeOfDay: string
  startAt: string
  enabled: boolean
  lastRun: string | null
  nextRun: string
  language: string
  createPR: boolean
  runTests: boolean
  createdAt: string
}

export interface JobResult {
  jobId: string
  success: boolean
  timestamp: string
  updatedPackages: string[]
  prUrl?: string
  error?: string
  testsPassed?: boolean
}

export interface ScheduleJobInput {
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
  intervalHours?: number
  daysOfWeek?: number[]
  dayOfMonth?: number
  timeOfDay?: string
  startAt?: string
  enabled: boolean
  language: string
  createPR: boolean
  runTests: boolean
}

const JOBS_KEY = 'scheduled-jobs'
const RESULTS_KEY = 'job-results'
const MAX_TIMER_DELAY_MS = 24 * 60 * 60 * 1000

// Timer references for cleanup
const jobTimers: Map<string, NodeJS.Timeout> = new Map()
const runningJobs: Set<string> = new Set()
let jobExecutor: ((job: ScheduledJob) => Promise<JobResult | null>) | null = null

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function isValidIsoDate(value: string | null | undefined): boolean {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

function normalizeTimeOfDay(value?: string): string {
  const match = (value || '').match(/^(\d{1,2}):(\d{2})$/)
  if (!match) {
    return '03:00'
  }
  const hours = clamp(Number(match[1]), 0, 23)
  const minutes = clamp(Number(match[2]), 0, 59)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function getTimeParts(timeOfDay: string): { hour: number; minute: number } {
  const [hour, minute] = normalizeTimeOfDay(timeOfDay).split(':').map(Number)
  return { hour, minute }
}

function normalizeDaysOfWeek(days: number[] | undefined, fallbackDay: number): number[] {
  const normalized = Array.from(new Set((days || []).map(day => clamp(Math.floor(day), 0, 6))))
    .sort((a, b) => a - b)
  if (normalized.length > 0) {
    return normalized
  }
  return [clamp(fallbackDay, 0, 6)]
}

function lastDayOfMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

function normalizeScheduleInput(input: ScheduleJobInput): Required<Pick<ScheduledJob, 'intervalHours' | 'daysOfWeek' | 'dayOfMonth' | 'timeOfDay' | 'startAt'>> {
  const startAtDate = isValidIsoDate(input.startAt) ? new Date(input.startAt as string) : new Date()
  const timeOfDay = normalizeTimeOfDay(input.timeOfDay)
  const { hour, minute } = getTimeParts(timeOfDay)
  startAtDate.setHours(hour, minute, 0, 0)

  return {
    intervalHours: clamp(Math.floor(input.intervalHours || 1), 1, 24),
    daysOfWeek: normalizeDaysOfWeek(input.daysOfWeek, startAtDate.getDay()),
    dayOfMonth: clamp(Math.floor(input.dayOfMonth || startAtDate.getDate()), 1, 31),
    timeOfDay,
    startAt: startAtDate.toISOString()
  }
}

export function setSchedulerExecutor(executor: (job: ScheduledJob) => Promise<JobResult | null>): void {
  jobExecutor = executor
}

export function getScheduledJobs(): ScheduledJob[] {
  return store.get(JOBS_KEY, []) as ScheduledJob[]
}

export function saveScheduledJobs(jobs: ScheduledJob[]): void {
  store.set(JOBS_KEY, jobs)
}

function createScheduledJob(job: ScheduleJobInput, nextRun?: string): ScheduledJob {
  const schedule = normalizeScheduleInput(job)
  return {
    ...job,
    ...schedule,
    id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    createdAt: new Date().toISOString(),
    lastRun: null,
    nextRun: nextRun || calculateNextRun(job.frequency, schedule)
  }
}

export function addScheduledJob(job: ScheduleJobInput): ScheduledJob {
  const jobs = getScheduledJobs()
  const newJob = createScheduledJob(job)

  jobs.push(newJob)
  saveScheduledJobs(jobs)

  // Start timer for this job
  scheduleJobTimer(newJob)

  return newJob
}

export function addScheduledJobsBatch(batch: ScheduleJobInput[]): ScheduledJob[] {
  if (batch.length === 0) return []
  const jobs = getScheduledJobs()
  const created = batch.map(input => createScheduledJob(input))

  jobs.push(...created)
  saveScheduledJobs(jobs)

  for (const job of created) {
    scheduleJobTimer(job)
  }

  return created
}

export function updateScheduledJob(jobId: string, updates: Partial<ScheduledJob>): ScheduledJob | null {
  const jobs = getScheduledJobs()
  const index = jobs.findIndex(j => j.id === jobId)

  if (index === -1) return null

  jobs[index] = { ...jobs[index], ...updates }

  const scheduleFieldsChanged = (
    updates.frequency !== undefined ||
    updates.intervalHours !== undefined ||
    updates.daysOfWeek !== undefined ||
    updates.dayOfMonth !== undefined ||
    updates.timeOfDay !== undefined ||
    updates.startAt !== undefined
  )

  if (scheduleFieldsChanged) {
    const normalized = normalizeScheduleInput({
      repoPath: jobs[index].repoPath,
      repoName: jobs[index].repoName,
      frequency: jobs[index].frequency,
      intervalHours: jobs[index].intervalHours,
      daysOfWeek: jobs[index].daysOfWeek,
      dayOfMonth: jobs[index].dayOfMonth,
      timeOfDay: jobs[index].timeOfDay,
      startAt: jobs[index].startAt,
      enabled: jobs[index].enabled,
      language: jobs[index].language,
      createPR: jobs[index].createPR,
      runTests: jobs[index].runTests
    })
    jobs[index] = { ...jobs[index], ...normalized }
    jobs[index].nextRun = calculateNextRun(jobs[index].frequency, normalized)
  }

  saveScheduledJobs(jobs)

  // Reschedule timer
  clearJobTimer(jobId)
  if (jobs[index].enabled) {
    scheduleJobTimer(jobs[index])
  }

  return jobs[index]
}

export function deleteScheduledJob(jobId: string): boolean {
  const jobs = getScheduledJobs()
  const filtered = jobs.filter(j => j.id !== jobId)

  if (filtered.length === jobs.length) return false

  saveScheduledJobs(filtered)
  clearJobTimer(jobId)

  return true
}

export function getJobResults(jobId?: string): JobResult[] {
  const results = store.get(RESULTS_KEY, []) as JobResult[]

  if (jobId) {
    return results.filter(r => r.jobId === jobId)
  }

  return results
}

export function addJobResult(result: JobResult): void {
  const results = getJobResults()
  results.unshift(result)

  // Keep only last 100 results
  if (results.length > 100) {
    results.splice(100)
  }

  store.set(RESULTS_KEY, results)
}

function calculateNextRun(
  frequency: ScheduleFrequency,
  options: Pick<ScheduledJob, 'intervalHours' | 'daysOfWeek' | 'dayOfMonth' | 'timeOfDay' | 'startAt'>,
  fromDate: Date = new Date()
): string {
  const now = new Date(fromDate)
  const start = isValidIsoDate(options.startAt) ? new Date(options.startAt) : new Date()
  const { hour, minute } = getTimeParts(options.timeOfDay)
  const intervalHours = clamp(options.intervalHours || 1, 1, 24)
  const daysOfWeek = normalizeDaysOfWeek(options.daysOfWeek, start.getDay())
  const dayOfMonth = clamp(options.dayOfMonth || start.getDate(), 1, 31)

  let next: Date

  switch (frequency) {
    case 'hourly': {
      const anchor = new Date(start)
      anchor.setMinutes(minute, 0, 0)
      if (anchor > now) {
        next = anchor
        break
      }
      const intervalMs = intervalHours * 60 * 60 * 1000
      const elapsed = now.getTime() - anchor.getTime()
      const periods = Math.floor(elapsed / intervalMs) + 1
      next = new Date(anchor.getTime() + periods * intervalMs)
      break
    }
    case 'daily': {
      next = new Date(now)
      next.setHours(hour, minute, 0, 0)
      if (next <= now) {
        next.setDate(next.getDate() + 1)
      }
      if (next < start) {
        next = new Date(start)
        next.setHours(hour, minute, 0, 0)
      }
      break
    }
    case 'weekly': {
      next = new Date(now)
      next.setHours(hour, minute, 0, 0)
      let best: Date | null = null

      for (const day of daysOfWeek) {
        const candidate = new Date(next)
        const distance = (day - candidate.getDay() + 7) % 7
        candidate.setDate(candidate.getDate() + distance)
        if (candidate <= now) {
          candidate.setDate(candidate.getDate() + 7)
        }
        if (candidate < start) {
          continue
        }
        if (!best || candidate < best) {
          best = candidate
        }
      }

      next = best || new Date(start)
      next.setHours(hour, minute, 0, 0)
      if (next <= now) {
        next.setDate(next.getDate() + 7)
      }
      break
    }
    case 'monthly': {
      next = new Date(now.getFullYear(), now.getMonth(), 1, hour, minute, 0, 0)
      const targetDay = Math.min(dayOfMonth, lastDayOfMonth(next.getFullYear(), next.getMonth()))
      next.setDate(targetDay)
      if (next <= now) {
        next = new Date(now.getFullYear(), now.getMonth() + 1, 1, hour, minute, 0, 0)
        const nextTargetDay = Math.min(dayOfMonth, lastDayOfMonth(next.getFullYear(), next.getMonth()))
        next.setDate(nextTargetDay)
      }
      if (next < start) {
        next = new Date(start.getFullYear(), start.getMonth(), 1, hour, minute, 0, 0)
        const startTargetDay = Math.min(dayOfMonth, lastDayOfMonth(next.getFullYear(), next.getMonth()))
        next.setDate(startTargetDay)
        if (next <= now) {
          next = new Date(next.getFullYear(), next.getMonth() + 1, 1, hour, minute, 0, 0)
          const shiftedTargetDay = Math.min(dayOfMonth, lastDayOfMonth(next.getFullYear(), next.getMonth()))
          next.setDate(shiftedTargetDay)
        }
      }
      break
    }
    default:
      next = new Date(now.getTime() + 60 * 60 * 1000)
      break
  }

  return next.toISOString()
}

function scheduleJobTimer(job: ScheduledJob): void {
  if (!job.enabled) return

  clearJobTimer(job.id)

  const nextRun = new Date(job.nextRun)
  const now = new Date()
  const delay = Math.max(0, nextRun.getTime() - now.getTime())
  const timerDelay = Math.min(delay, MAX_TIMER_DELAY_MS)

  const timer = setTimeout(() => {
    const latest = getScheduledJobs().find(scheduled => scheduled.id === job.id)
    if (!latest || !latest.enabled) {
      clearJobTimer(job.id)
      return
    }

    const isDue = new Date(latest.nextRun).getTime() <= Date.now()
    if (isDue) {
      void executeJob(job.id)
      return
    }

    scheduleJobTimer(latest)
  }, timerDelay)

  jobTimers.set(job.id, timer)
}

function clearJobTimer(jobId: string): void {
  const timer = jobTimers.get(jobId)
  if (timer) {
    clearTimeout(timer)
    jobTimers.delete(jobId)
  }
}

// Called on app startup to initialize all job timers
export function initializeScheduler(): void {
  const jobs = getScheduledJobs()
  let changed = false

  const normalizedJobs = jobs.map(job => {
    const schedule = normalizeScheduleInput({
      repoPath: job.repoPath,
      repoName: job.repoName,
      frequency: job.frequency,
      intervalHours: job.intervalHours,
      daysOfWeek: job.daysOfWeek,
      dayOfMonth: job.dayOfMonth,
      timeOfDay: job.timeOfDay,
      startAt: job.startAt,
      enabled: job.enabled,
      language: job.language,
      createPR: job.createPR,
      runTests: job.runTests
    })
    const nextRun = isValidIsoDate(job.nextRun)
      ? job.nextRun
      : calculateNextRun(job.frequency, schedule)
    const normalized = {
      ...job,
      ...schedule,
      nextRun,
      createPR: false,
      runTests: true
    }
    if (
      normalized.createPR !== job.createPR ||
      normalized.runTests !== job.runTests ||
      normalized.intervalHours !== job.intervalHours ||
      normalized.dayOfMonth !== job.dayOfMonth ||
      normalized.timeOfDay !== job.timeOfDay ||
      normalized.startAt !== job.startAt ||
      JSON.stringify(normalized.daysOfWeek) !== JSON.stringify(job.daysOfWeek) ||
      normalized.nextRun !== job.nextRun
    ) {
      changed = true
    }
    return normalized
  })

  if (changed) {
    saveScheduledJobs(normalizedJobs)
  }

  for (const job of normalizedJobs) {
    if (job.enabled) {
      scheduleJobTimer(job)
    }
  }
}

// Main job execution function
async function executeJob(jobId: string): Promise<void> {
  if (runningJobs.has(jobId)) return
  runningJobs.add(jobId)

  const jobs = getScheduledJobs()
  const job = jobs.find(j => j.id === jobId)

  if (!job || !job.enabled) {
    runningJobs.delete(jobId)
    return
  }

  // Notify renderer that job is starting
  const windows = BrowserWindow.getAllWindows()
  for (const win of windows) {
    win.webContents.send('scheduler-job-started', { jobId, repoName: job.repoName })
  }

  try {
    if (jobExecutor) {
      try {
        const result = await jobExecutor(job)
        if (result) {
          addJobResult(result)
        }
      } catch (error) {
        addJobResult({
          jobId: job.id,
          success: false,
          timestamp: new Date().toISOString(),
          updatedPackages: [],
          error: error instanceof Error ? error.message : 'Scheduled job failed'
        })
      }
    }

    // Update job with new next run time
    const index = jobs.findIndex(j => j.id === jobId)
    if (index !== -1) {
      jobs[index].lastRun = new Date().toISOString()
      jobs[index].nextRun = calculateNextRun(job.frequency, jobs[index])
      saveScheduledJobs(jobs)

      // Schedule next run
      scheduleJobTimer(jobs[index])
    }
  } finally {
    runningJobs.delete(jobId)
  }
}

// Check if any jobs are due (called periodically)
export function checkDueJobs(): ScheduledJob[] {
  const jobs = getScheduledJobs()
  const now = new Date()
  const dueJobs: ScheduledJob[] = []

  for (const job of jobs) {
    if (job.enabled) {
      const nextRun = new Date(job.nextRun)
      if (nextRun <= now) {
        dueJobs.push(job)
      }
    }
  }

  return dueJobs
}

// Get next scheduled job
export function getNextScheduledJob(): ScheduledJob | null {
  const jobs = getScheduledJobs().filter(j => j.enabled)

  if (jobs.length === 0) return null

  jobs.sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime())

  return jobs[0]
}

// Cleanup on app quit
export function cleanupScheduler(): void {
  for (const timer of jobTimers.values()) {
    clearTimeout(timer)
  }
  jobTimers.clear()
}
