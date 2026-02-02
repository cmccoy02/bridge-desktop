import { useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Dashboard from './components/Dashboard/Dashboard'
import FileBrowser from './components/FileBrowser/FileBrowser'
import PatchBatch from './components/PatchBatch/PatchBatch'
import Cleanup from './components/Cleanup/Cleanup'
import Scheduler from './components/Scheduler/Scheduler'
import Security from './components/Security/Security'
import type { View } from './types'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />
      case 'files':
        return <FileBrowser />
      case 'patch-batch':
        return <PatchBatch />
      case 'cleanup':
        return <Cleanup />
      case 'scheduler':
        return <Scheduler />
      case 'security':
        return <Security />
      default:
        return <Dashboard onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="app-main">
        <Header currentView={currentView} />
        <div className="app-content">
          {renderView()}
        </div>
      </main>
    </div>
  )
}
