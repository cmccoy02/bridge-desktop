import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import { RepositoryProvider } from './contexts/RepositoryContext'
import { ScanProvider } from './contexts/ScanContext'
import { AppSettingsProvider } from './contexts/AppSettingsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppSettingsProvider>
        <RepositoryProvider>
          <ScanProvider>
            <App />
          </ScanProvider>
        </RepositoryProvider>
      </AppSettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
)
