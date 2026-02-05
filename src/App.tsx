import { useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import PatchBatch from './components/PatchBatch/PatchBatch'
import type { View } from './types'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('patch-batch')

  return (
    <div className="app-layout">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="app-main">
        <Header currentView={currentView} />
        <div className="app-content">
          <PatchBatch />
        </div>
      </main>
    </div>
  )
}
