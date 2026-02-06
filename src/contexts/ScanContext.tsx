import React, { createContext, useContext, useMemo, useState } from 'react'
import type { FullScanResult } from '../types'

export type ScanTab = 'overview' | 'circular' | 'dead-code' | 'bundle' | 'coverage' | 'docs'

interface ScanContextType {
  scanResults: Record<string, FullScanResult>
  updateScanResult: (repoPath: string, result: FullScanResult) => void
  preferredTab: ScanTab
  setPreferredTab: (tab: ScanTab) => void
  scanRequestRepo: string | null
  requestScan: (repoPath: string) => void
  clearScanRequest: () => void
}

const STORAGE_KEY = 'bridge-scan-results'

const ScanContext = createContext<ScanContextType | undefined>(undefined)

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [scanResults, setScanResults] = useState<Record<string, FullScanResult>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })
  const [preferredTab, setPreferredTab] = useState<ScanTab>('overview')
  const [scanRequestRepo, setScanRequestRepo] = useState<string | null>(null)

  const updateScanResult = (repoPath: string, result: FullScanResult) => {
    setScanResults(prev => {
      const next = { ...prev, [repoPath]: result }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore storage failures
      }
      return next
    })
  }

  const requestScan = (repoPath: string) => {
    setScanRequestRepo(repoPath)
  }

  const clearScanRequest = () => {
    setScanRequestRepo(null)
  }

  const value = useMemo(() => ({
    scanResults,
    updateScanResult,
    preferredTab,
    setPreferredTab,
    scanRequestRepo,
    requestScan,
    clearScanRequest
  }), [scanResults, preferredTab, scanRequestRepo])

  return (
    <ScanContext.Provider value={value}>
      {children}
    </ScanContext.Provider>
  )
}

export function useScanContext() {
  const context = useContext(ScanContext)
  if (!context) {
    throw new Error('useScanContext must be used within a ScanProvider')
  }
  return context
}
