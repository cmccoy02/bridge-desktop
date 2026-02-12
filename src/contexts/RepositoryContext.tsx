import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Repository } from '../types'

interface RepositoryContextType {
  repositories: Repository[]
  selectedRepo: Repository | null
  codeDirectory: string | null
  loading: boolean
  addRepository: (path: string) => Promise<void>
  removeRepository: (path: string) => Promise<void>
  selectRepository: (repo: Repository | null) => void
  setCodeDirectory: (directory: string | null) => Promise<void>
  scanCodeDirectory: (directory?: string) => Promise<void>
  selectAndScanCodeDirectory: () => Promise<void>
  refreshRepositories: () => Promise<void>
  cleanupMissingRepos: () => Promise<void>
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined)

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [codeDirectory, setCodeDirectoryState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRepositories()
  }, [])

  const loadRepositories = async () => {
    try {
      const existingRepos = await window.bridge.cleanupMissingRepos()
      setRepositories(existingRepos)

      // If selected repo no longer exists, deselect it
      if (selectedRepo && !existingRepos.find((r: Repository) => r.path === selectedRepo.path)) {
        setSelectedRepo(null)
      }

      const savedCodeDirectory = await window.bridge.getCodeDirectory()
      if (savedCodeDirectory && await window.bridge.directoryExists(savedCodeDirectory)) {
        setCodeDirectoryState(savedCodeDirectory)
        await scanCodeDirectory(savedCodeDirectory)
      } else {
        const defaultDirectory = await window.bridge.getDefaultCodeDirectory()
        if (defaultDirectory && await window.bridge.directoryExists(defaultDirectory)) {
          await window.bridge.saveCodeDirectory(defaultDirectory)
          setCodeDirectoryState(defaultDirectory)
          await scanCodeDirectory(defaultDirectory)
        } else {
          setCodeDirectoryState(savedCodeDirectory || null)
        }
      }
    } catch (error) {
      console.error('Failed to load repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  const addRepository = async (path: string) => {
    const repo = await window.bridge.scanRepository(path)

    if (!repo.exists) {
      throw new Error('Repository path does not exist')
    }

    const exists = repositories.find(r => r.path === repo.path)
    if (exists) {
      setSelectedRepo(exists)
      return
    }

    const updated = [...repositories, repo]
    await window.bridge.saveRepositories(updated)
    setRepositories(updated)
    setSelectedRepo(repo)
  }

  const removeRepository = async (path: string) => {
    const updated = await window.bridge.removeRepository(path)
    setRepositories(updated.filter((r: Repository) => r.exists))

    if (selectedRepo?.path === path) {
      setSelectedRepo(null)
    }
  }

  const selectRepository = (repo: Repository | null) => {
    setSelectedRepo(repo)
  }

  const setCodeDirectory = async (directory: string | null) => {
    if (!directory) {
      setCodeDirectoryState(null)
      return
    }
    await window.bridge.saveCodeDirectory(directory)
    setCodeDirectoryState(directory)
  }

  const scanCodeDirectory = async (directory?: string) => {
    const targetDirectory = directory || codeDirectory
    if (!targetDirectory) {
      return
    }

    const scannedRepos = await window.bridge.scanForRepos(targetDirectory)
    setRepositories(scannedRepos)

    if (selectedRepo && !scannedRepos.find(repo => repo.path === selectedRepo.path)) {
      setSelectedRepo(null)
    }
  }

  const selectAndScanCodeDirectory = async () => {
    const directory = await window.bridge.selectCodeDirectory()
    if (!directory) {
      return
    }

    await setCodeDirectory(directory)
    await scanCodeDirectory(directory)
  }

  const refreshRepositories = async () => {
    setLoading(true)
    try {
      await loadRepositories()
    } finally {
      setLoading(false)
    }
  }

  const cleanupMissingRepos = async () => {
    const cleaned = await window.bridge.cleanupMissingRepos()
    setRepositories(cleaned)
  }

  return (
    <RepositoryContext.Provider value={{
      repositories,
      selectedRepo,
      codeDirectory,
      loading,
      addRepository,
      removeRepository,
      selectRepository,
      setCodeDirectory,
      scanCodeDirectory,
      selectAndScanCodeDirectory,
      refreshRepositories,
      cleanupMissingRepos
    }}>
      {children}
    </RepositoryContext.Provider>
  )
}

export function useRepositories() {
  const context = useContext(RepositoryContext)
  if (!context) {
    throw new Error('useRepositories must be used within a RepositoryProvider')
  }
  return context
}
