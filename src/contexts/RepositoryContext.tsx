import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Repository } from '../types'

interface RepositoryContextType {
  repositories: Repository[]
  selectedRepo: Repository | null
  loading: boolean
  addRepository: (path: string) => Promise<void>
  removeRepository: (path: string) => Promise<void>
  selectRepository: (repo: Repository | null) => void
  refreshRepositories: () => Promise<void>
  cleanupMissingRepos: () => Promise<void>
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined)

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
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

  const refreshRepositories = async () => {
    setLoading(true)
    await loadRepositories()
  }

  const cleanupMissingRepos = async () => {
    const cleaned = await window.bridge.cleanupMissingRepos()
    setRepositories(cleaned)
  }

  return (
    <RepositoryContext.Provider value={{
      repositories,
      selectedRepo,
      loading,
      addRepository,
      removeRepository,
      selectRepository,
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
