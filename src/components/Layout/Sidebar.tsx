import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { View, Language, RepoInfo } from '../../types'

interface SidebarProps {
  currentView: View
  onNavigate: (view: View) => void
}

const LANGUAGE_COLORS: Record<Language, string> = {
  javascript: '#f7df1e',
  python: '#3776ab',
  ruby: '#cc342d',
  elixir: '#6e4a7e',
  unknown: '#666666'
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const { repositories, selectedRepo, selectRepository, addRepository } = useRepositories()
  const [repoInfoMap, setRepoInfoMap] = useState<Record<string, RepoInfo>>({})

  useEffect(() => {
    const fetchRepoInfo = async () => {
      const newInfoMap: Record<string, RepoInfo> = {}
      for (const repo of repositories) {
        if (repo.hasGit && repo.exists) {
          try {
            const info = await window.bridge.getRepoInfo(repo.path)
            newInfoMap[repo.path] = info
          } catch {
            // Ignore errors
          }
        }
      }
      setRepoInfoMap(newInfoMap)
    }
    fetchRepoInfo()
  }, [repositories])

  const handleImport = async () => {
    const path = await window.bridge.selectDirectory()
    if (path) {
      await addRepository(path)
    }
  }

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">B</span>
          Bridge
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Navigation</div>
          <button
            className={`nav-item ${currentView === 'patch-batch' ? 'active' : ''}`}
            onClick={() => onNavigate('patch-batch')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-9-9" />
              <path d="M21 3v6h-6" />
            </svg>
            Update Dependencies
          </button>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Repositories</div>
          <button className="nav-item" onClick={handleImport}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Import Repository
          </button>

          <div className="repo-list">
            {repositories.map(repo => {
              const info = repoInfoMap[repo.path]
              const hasSync = info && (info.ahead > 0 || info.behind > 0)
              return (
                <button
                  key={repo.path}
                  className={`repo-item ${selectedRepo?.path === repo.path ? 'active' : ''}`}
                  onClick={() => selectRepository(repo)}
                  style={{ opacity: repo.exists ? 1 : 0.5 }}
                >
                  <span
                    className="repo-dot"
                    style={{
                      background: repo.languages?.[0] ? LANGUAGE_COLORS[repo.languages[0]] : LANGUAGE_COLORS.unknown
                    }}
                  />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{repo.name}</span>
                  {hasSync && (
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', display: 'flex', gap: '4px' }}>
                      {info.behind > 0 && <span title={`${info.behind} behind`}>↓{info.behind}</span>}
                      {info.ahead > 0 && <span title={`${info.ahead} ahead`}>↑{info.ahead}</span>}
                    </span>
                  )}
                  {(repo.languages?.length ?? 0) > 1 && (
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>+{repo.languages!.length - 1}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </aside>
  )
}
