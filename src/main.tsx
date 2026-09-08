import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { App } from '@/App'
import { ThemeProvider } from '@/hooks/use-theme'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter basename="/wedding_planner">
        <App />
        <Toaster richColors position="top-center" />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
