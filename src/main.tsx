import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { App } from '@/App'
import { ConfigMissingScreen } from '@/components/config-missing-screen'
import { AuthProvider } from '@/hooks/use-auth'
import { ThemeProvider } from '@/hooks/use-theme'
import { isSupabaseConfigured } from '@/lib/supabase'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      {isSupabaseConfigured ? (
        <BrowserRouter basename="/wedding_planner">
          <AuthProvider>
            <App />
          </AuthProvider>
          <Toaster richColors position="top-center" />
        </BrowserRouter>
      ) : (
        <ConfigMissingScreen />
      )}
    </ThemeProvider>
  </StrictMode>,
)
