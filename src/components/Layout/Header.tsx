import { useTheme } from '../../contexts/ThemeContext'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { View } from '../../types'

interface HeaderProps {
  currentView: View
}

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard',
  files: 'File Browser',
  'patch-batch': 'Patch Batch',
  cleanup: 'Cleanup',
  scheduler: 'Scheduler',
  security: 'Security Scanner'
}

export default function Header({ currentView }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { selectedRepo } = useRepositories()

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600 }}>{viewTitles[currentView]}</h1>
        {selectedRepo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-accent">{selectedRepo.name}</span>
            {(selectedRepo.languages ?? []).map(lang => (
              <span key={lang} className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '10px' }}>
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>

      <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        {theme === 'dark' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </header>
  )
}
