import { useMemo, useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import PatchBatch from './components/PatchBatch/PatchBatch'
import Dashboard from './components/Dashboard/Dashboard'
import Cleanup from './components/Cleanup/Cleanup'
import Scheduler from './components/Scheduler/Scheduler'
import Security from './components/Security/Security'
import FileBrowser from './components/FileBrowser/FileBrowser'
import FullScan from './components/FullScan/FullScan'
import Settings from './components/Settings/Settings'
import { useAppSettings } from './contexts/AppSettingsContext'
import type { View } from './types'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const { settings } = useAppSettings()

  const content = useMemo(() => {
    if (!settings.experimentalFeatures && (currentView === 'full-scan' || currentView === 'security')) {
      return <Dashboard onNavigate={setCurrentView} />
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />
      case 'full-scan':
        return <FullScan />
      case 'cleanup':
        return <Cleanup />
      case 'scheduler':
        return <Scheduler />
      case 'security':
        return <Security />
      case 'files':
        return <FileBrowser />
      case 'settings':
        return <Settings />
      case 'patch-batch':
      default:
        return <PatchBatch />
    }
  }, [currentView, settings.experimentalFeatures])

  const normalizedView: View = (!settings.experimentalFeatures && (currentView === 'full-scan' || currentView === 'security'))
    ? 'dashboard'
    : currentView

  return (
    <div className="app-layout">
      <Sidebar currentView={normalizedView} onNavigate={setCurrentView} />
      <main className="app-main">
        <Header currentView={normalizedView} />
        <div className="app-content">
          {content}
        </div>
      </main>
    </div>
  )
}
