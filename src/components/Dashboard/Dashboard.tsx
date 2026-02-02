import { useRepositories } from '../../contexts/RepositoryContext'
import type { View, Language } from '../../types'

interface DashboardProps {
  onNavigate: (view: View) => void
}

const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: 'JavaScript/Node',
  python: 'Python',
  ruby: 'Ruby',
  elixir: 'Elixir',
  unknown: 'Unknown'
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { repositories, selectedRepo, addRepository, removeRepository } = useRepositories()

  const handleImport = async () => {
    const path = await window.bridge.selectDirectory()
    if (path) {
      await addRepository(path)
    }
  }

  const features = [
    {
      id: 'patch-batch',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <path d="M21 12a9 9 0 11-9-9" />
          <path d="M21 3v6h-6" />
        </svg>
      ),
      title: 'Patch Batch',
      subtitle: 'Update packages safely',
      description: 'Update all packages to their latest patch versions with tests.',
      view: 'patch-batch' as View
    },
    {
      id: 'cleanup',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      ),
      title: 'Cleanup',
      subtitle: 'Find hidden bloat',
      description: 'Find large files in git history and oversized components.',
      view: 'cleanup' as View
    },
    {
      id: 'scheduler',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: 'Scheduler',
      subtitle: 'Set it and forget it',
      description: 'Automate updates daily, weekly, or monthly across repos.',
      view: 'scheduler' as View
    },
    {
      id: 'security',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'Security Scanner',
      subtitle: 'Find vulnerabilities',
      description: 'Scan for SQL injection, XSS, secrets, and more with AI-powered fixes.',
      view: 'security' as View
    },
    {
      id: 'files',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
      ),
      title: 'File Browser',
      subtitle: 'Explore your repos',
      description: 'Browse files with size info, find the biggest files.',
      view: 'files' as View
    }
  ]

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '8px' }}>Welcome to Bridge</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage tech debt and keep your dependencies up to date. Works with JavaScript, Python, Ruby, and Elixir.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {features.map(feature => (
          <div key={feature.id} className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate(feature.view)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '16px' }}>{feature.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{feature.subtitle}</p>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Repositories</h3>
          <button className="btn btn-primary btn-sm" onClick={handleImport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Import
          </button>
        </div>

        {repositories.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            <h3 className="empty-state-title">No repositories yet</h3>
            <p className="empty-state-desc">Import a repository to get started</p>
            <button className="btn btn-primary" onClick={handleImport}>
              Import Repository
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {repositories.map(repo => (
              <div
                key={repo.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: selectedRepo?.path === repo.path ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: selectedRepo?.path === repo.path ? '1px solid var(--accent)' : '1px solid transparent',
                  opacity: repo.exists ? 1 : 0.5
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                </svg>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {repo.name}
                    {!repo.exists && <span className="badge" style={{ background: 'var(--error)', color: '#fff', fontSize: '10px' }}>Missing</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.path}</div>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {(repo.languages ?? []).map(lang => (
                    <span key={lang} className="badge badge-success" style={{ fontSize: '10px' }}>
                      {LANGUAGE_LABELS[lang]}
                    </span>
                  ))}
                  {repo.hasGit && <span className="badge badge-accent" style={{ fontSize: '10px' }}>git</span>}
                </div>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={(e) => { e.stopPropagation(); removeRepository(repo.path) }}
                  title="Remove repository"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
