import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import { RepositoryProvider } from './contexts/RepositoryContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RepositoryProvider>
        <App />
      </RepositoryProvider>
    </ThemeProvider>
  </React.StrictMode>
)
