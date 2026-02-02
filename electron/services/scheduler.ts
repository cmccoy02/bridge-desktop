import Store from 'electron-store'
import { BrowserWindow } from 'electron'

const store = new Store()

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly'

export interface ScheduledJob {
  id: string
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
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

const JOBS_KEY = 'scheduled-jobs'
const RESULTS_KEY = 'job-results'

// Timer references for cleanup
const jobTimers: Map<string, NodeJS.Timeout> = new Map()

export function getScheduledJobs(): ScheduledJob[] {
  return store.get(JOBS_KEY, []) as ScheduledJob[]
}

export function saveScheduledJobs(jobs: ScheduledJob[]): void {
  store.set(JOBS_KEY, jobs)
}

export function addScheduledJob(job: Omit<ScheduledJob, 'id' | 'createdAt' | 'lastRun' | 'nextRun'>): ScheduledJob {
  const jobs = getScheduledJobs()

  const newJob: ScheduledJob = {
    ...job,
    id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    lastRun: null,
    nextRun: calculateNextRun(job.frequency)
  }

  jobs.push(newJob)
  saveScheduledJobs(jobs)

  // Start timer for this job
  scheduleJobTimer(newJob)

  return newJob
}

export function updateScheduledJob(jobId: string, updates: Partial<ScheduledJob>): ScheduledJob | null {
  const jobs = getScheduledJobs()
  const index = jobs.findIndex(j => j.id === jobId)

  if (index === -1) return null

  jobs[index] = { ...jobs[index], ...updates }

  if (updates.frequency) {
    jobs[index].nextRun = calculateNextRun(updates.frequency)
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

function calculateNextRun(frequency: ScheduleFrequency): string {
  const now = new Date()
  let next: Date

  switch (frequency) {
    case 'daily':
      next = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      next.setHours(3, 0, 0, 0) // 3 AM
      break
    case 'weekly':
      next = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      next.setHours(3, 0, 0, 0)
      break
    case 'monthly':
      next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 3, 0, 0, 0)
      break
  }

  return next.toISOString()
}

function scheduleJobTimer(job: ScheduledJob): void {
  if (!job.enabled) return

  const nextRun = new Date(job.nextRun)
  const now = new Date()
  const delay = Math.max(0, nextRun.getTime() - now.getTime())

  // Don't schedule if more than 24 hours away (will reschedule on app restart)
  if (delay > 24 * 60 * 60 * 1000) {
    return
  }

  const timer = setTimeout(() => {
    executeJob(job.id)
  }, delay)

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

  for (const job of jobs) {
    if (job.enabled) {
      // Check if job was missed and should run now
      const nextRun = new Date(job.nextRun)
      const now = new Date()

      if (nextRun < now) {
        // Missed job - run it now
        setTimeout(() => executeJob(job.id), 5000)
      } else {
        scheduleJobTimer(job)
      }
    }
  }
}

// Main job execution function
async function executeJob(jobId: string): Promise<void> {
  const jobs = getScheduledJobs()
  const job = jobs.find(j => j.id === jobId)

  if (!job || !job.enabled) return

  // Notify renderer that job is starting
  const windows = BrowserWindow.getAllWindows()
  for (const win of windows) {
    win.webContents.send('scheduler-job-started', { jobId, repoName: job.repoName })
  }

  // The actual job execution will be handled by the main process
  // This is a placeholder that will be called from main.ts
  for (const win of windows) {
    win.webContents.send('scheduler-execute-job', job)
  }

  // Update job with new next run time
  const index = jobs.findIndex(j => j.id === jobId)
  if (index !== -1) {
    jobs[index].lastRun = new Date().toISOString()
    jobs[index].nextRun = calculateNextRun(job.frequency)
    saveScheduledJobs(jobs)

    // Schedule next run
    scheduleJobTimer(jobs[index])
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
