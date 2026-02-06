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
  const { repositories, selectedRepo, selectRepository, addRepository, removeRepository } = useRepositories()
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
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
            </svg>
            Dashboard
          </button>
          <button
            className={`nav-item ${currentView === 'full-scan' ? 'active' : ''}`}
            onClick={() => onNavigate('full-scan')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Full TD Scan
          </button>
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
          <button
            className={`nav-item ${currentView === 'cleanup' ? 'active' : ''}`}
            onClick={() => onNavigate('cleanup')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            Cleanup
          </button>
          <button
            className={`nav-item ${currentView === 'security' ? 'active' : ''}`}
            onClick={() => onNavigate('security')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Security Scan
          </button>
          <button
            className={`nav-item ${currentView === 'scheduler' ? 'active' : ''}`}
            onClick={() => onNavigate('scheduler')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Scheduler
          </button>
          <button
            className={`nav-item ${currentView === 'files' ? 'active' : ''}`}
            onClick={() => onNavigate('files')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            File Browser
          </button>
          <button
            className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => onNavigate('settings')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2h-2a2 2 0 01-2-2v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2v-2a2 2 0 012-2h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2h2a2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2v2a2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            Settings
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
                  <button
                    className="repo-remove"
                    title="Remove repository"
                    onClick={async (event) => {
                      event.stopPropagation()
                      await removeRepository(repo.path)
                    }}
                  >
                    ×
                  </button>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </aside>
  )
}
