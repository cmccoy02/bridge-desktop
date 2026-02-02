import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { FileEntry, FileSizeStats } from '../../types'

export default function FileBrowser() {
  const { selectedRepo } = useRepositories()
  const [currentPath, setCurrentPath] = useState<string>('')
  const [files, setFiles] = useState<FileEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [stats, setStats] = useState<FileSizeStats | null>(null)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    if (selectedRepo) {
      setCurrentPath(selectedRepo.path)
      loadDirectory(selectedRepo.path)
      loadStats()
    }
  }, [selectedRepo])

  const loadStats = async () => {
    if (!selectedRepo) return
    try {
      const statsResult = await window.bridge.getFileStats(selectedRepo.path)
      setStats(statsResult)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const loadDirectory = async (path: string) => {
    setLoading(true)
    setFileContent(null)
    setSelectedFile(null)
    try {
      const entries = await window.bridge.readDirectory(path)
      setFiles(entries)
      setCurrentPath(path)
    } catch (error) {
      console.error('Failed to read directory:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileClick = async (file: FileEntry) => {
    if (file.isDirectory) {
      await loadDirectory(file.path)
    } else {
      try {
        const content = await window.bridge.readFile(file.path)
        setFileContent(content)
        setSelectedFile(file.name)
      } catch (error) {
        console.error('Failed to read file:', error)
      }
    }
  }

  const navigateUp = () => {
    const parent = currentPath.split('/').slice(0, -1).join('/')
    if (parent && selectedRepo && parent.startsWith(selectedRepo.path.split('/').slice(0, -1).join('/'))) {
      loadDirectory(parent)
    }
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getSizeColor = (bytes?: number) => {
    if (!bytes) return 'var(--text-tertiary)'
    if (bytes > 1024 * 1024) return 'var(--error)' // > 1MB
    if (bytes > 500 * 1024) return 'var(--warning)' // > 500KB
    if (bytes > 100 * 1024) return 'var(--accent)' // > 100KB
    return 'var(--text-tertiary)'
  }

  if (!selectedRepo) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
        <h3 className="empty-state-title">No repository selected</h3>
        <p className="empty-state-desc">Select a repository from the sidebar to browse its files</p>
      </div>
    )
  }

  return (
    <div className="file-browser fade-in">
      <div className="file-browser-header">
        <button
          className="btn btn-secondary btn-icon"
          onClick={navigateUp}
          disabled={currentPath === selectedRepo.path}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="file-path">{currentPath}</div>
        <button
          className={`btn ${showStats ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setShowStats(!showStats)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
          Stats
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => loadDirectory(currentPath)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      {showStats && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div className="card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Size</div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>{stats.totalSizeFormatted}</div>
          </div>
          <div className="card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Files</div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>{stats.fileCount}</div>
          </div>
          <div className="card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Largest File</div>
            <div style={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {stats.largestFiles[0]?.sizeFormatted || '—'}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', height: showStats ? 'calc(100% - 120px)' : 'calc(100% - 60px)' }}>
        <div className="file-list" style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div className="spinner" />
            </div>
          ) : files.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
              Empty directory
            </div>
          ) : (
            files.map(file => (
              <div
                key={file.path}
                className="file-item"
                onClick={() => handleFileClick(file)}
                style={{ background: selectedFile === file.name ? 'var(--bg-secondary)' : undefined }}
              >
                {file.isDirectory ? (
                  <svg className="file-icon folder" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                  </svg>
                ) : (
                  <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
                <span className="file-name">{file.name}</span>
                {!file.isDirectory && file.size && (
                  <span className="file-size" style={{ color: getSizeColor(file.size), fontWeight: file.size && file.size > 100 * 1024 ? 500 : 400 }}>
                    {formatSize(file.size)}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {fileContent !== null && (
          <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{selectedFile}</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setFileContent(null); setSelectedFile(null) }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <pre style={{
              flex: 1,
              padding: '16px',
              margin: 0,
              overflow: 'auto',
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)'
            }}>
              {fileContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
