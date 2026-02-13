import { exec } from 'child_process'
import { promisify } from 'util'
import { BrowserWindow } from 'electron'
import { createBridgeStore } from './store'

const execAsync = promisify(exec)
const store = createBridgeStore('bridge-smart-scheduler')

export interface SmartScanSchedule {
  id: string
  repoPath: string
  repoName: string
  enabled: boolean
  quietHour: number
  lastRun: string | null
  nextRun: string
  createdAt: string
}

const SMART_KEY = 'smart-scan-schedules'
const smartTimers: Map<string, NodeJS.Timeout> = new Map()
let smartScanExecutor: ((repoPath: string) => Promise<void>) | null = null

export function setSmartScanExecutor(executor: (repoPath: string) => Promise<void>): void {
  smartScanExecutor = executor
}

export function getSmartScanSchedules(): SmartScanSchedule[] {
  return store.get(SMART_KEY, []) as SmartScanSchedule[]
}

export function saveSmartScanSchedules(schedules: SmartScanSchedule[]): void {
  store.set(SMART_KEY, schedules)
}

export async function analyzeCommitPatterns(repoPath: string): Promise<number> {
  try {
    const { stdout } = await execAsync('git log --pretty=format:"%ai" --since="30 days ago"', { cwd: repoPath, timeout: 30000 })
    const lines = stdout.split('\n').filter(line => line.trim())
    if (lines.length === 0) return 6

    const hourCounts = new Array(24).fill(0)
    for (const line of lines) {
      const date = new Date(line.trim())
      if (!Number.isNaN(date.getTime())) {
        hourCounts[date.getHours()] += 1
      }
    }

    const minCount = Math.min(...hourCounts)
    const quietHour = hourCounts.indexOf(minCount)
    return quietHour === -1 ? 6 : quietHour
  } catch {
    return 6
  }
}

function calculateNextRun(quietHour: number): string {
  const now = new Date()
  const next = new Date(now)
  next.setHours(quietHour, 0, 0, 0)
  if (next <= now) {
    next.setDate(next.getDate() + 1)
  }
  return next.toISOString()
}

export async function addSmartScanSchedule(repoPath: string, repoName: string): Promise<SmartScanSchedule> {
  const schedules = getSmartScanSchedules()
  const quietHour = await analyzeCommitPatterns(repoPath)

  const schedule: SmartScanSchedule = {
    id: `smart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    repoPath,
    repoName,
    enabled: true,
    quietHour,
    lastRun: null,
    nextRun: calculateNextRun(quietHour),
    createdAt: new Date().toISOString()
  }

  schedules.push(schedule)
  saveSmartScanSchedules(schedules)
  scheduleSmartTimer(schedule)

  return schedule
}

export function updateSmartScanSchedule(id: string, updates: Partial<SmartScanSchedule>): SmartScanSchedule | null {
  const schedules = getSmartScanSchedules()
  const index = schedules.findIndex(schedule => schedule.id === id)
  if (index === -1) return null

  schedules[index] = { ...schedules[index], ...updates }
  if (updates.quietHour !== undefined) {
    schedules[index].nextRun = calculateNextRun(updates.quietHour)
  }

  saveSmartScanSchedules(schedules)
  clearSmartTimer(id)

  if (schedules[index].enabled) {
    scheduleSmartTimer(schedules[index])
  }

  return schedules[index]
}

export function deleteSmartScanSchedule(id: string): boolean {
  const schedules = getSmartScanSchedules()
  const filtered = schedules.filter(schedule => schedule.id !== id)
  if (filtered.length === schedules.length) return false

  saveSmartScanSchedules(filtered)
  clearSmartTimer(id)
  return true
}

export function initializeSmartScheduler(): void {
  const schedules = getSmartScanSchedules()
  for (const schedule of schedules) {
    if (schedule.enabled) {
      const next = new Date(schedule.nextRun)
      const now = new Date()
      if (next <= now) {
        setTimeout(() => executeSmartScan(schedule.id), 5000)
      } else {
        scheduleSmartTimer(schedule)
      }
    }
  }
}

function scheduleSmartTimer(schedule: SmartScanSchedule): void {
  if (!schedule.enabled) return
  const nextRun = new Date(schedule.nextRun)
  const now = new Date()
  const delay = Math.max(0, nextRun.getTime() - now.getTime())
  if (delay > 24 * 60 * 60 * 1000) return

  const timer = setTimeout(() => {
    executeSmartScan(schedule.id)
  }, delay)

  smartTimers.set(schedule.id, timer)
}

function clearSmartTimer(id: string): void {
  const timer = smartTimers.get(id)
  if (timer) {
    clearTimeout(timer)
    smartTimers.delete(id)
  }
}

async function executeSmartScan(id: string): Promise<void> {
  const schedules = getSmartScanSchedules()
  const schedule = schedules.find(item => item.id === id)
  if (!schedule || !schedule.enabled) return

  const windows = BrowserWindow.getAllWindows()
  for (const win of windows) {
    win.webContents.send('smart-scan-started', { id: schedule.id, repoName: schedule.repoName })
  }

  if (smartScanExecutor) {
    try {
      await smartScanExecutor(schedule.repoPath)
    } catch {
      // Swallow errors to keep schedule alive
    }
  }

  const index = schedules.findIndex(item => item.id === id)
  if (index !== -1) {
    schedules[index].lastRun = new Date().toISOString()
    schedules[index].nextRun = calculateNextRun(schedules[index].quietHour)
    saveSmartScanSchedules(schedules)
    scheduleSmartTimer(schedules[index])
  }
}

export function cleanupSmartScheduler(): void {
  for (const timer of smartTimers.values()) {
    clearTimeout(timer)
  }
  smartTimers.clear()
}
