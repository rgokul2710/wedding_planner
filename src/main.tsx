import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { App } from '@/App'
import { ConfigMissingScreen } from '@/components/config-missing-screen'
import { ErrorBoundary } from '@/components/error-boundary'
import { AuthProvider } from '@/hooks/use-auth'
import { ThemeProvider } from '@/hooks/use-theme'
import { queryClient } from '@/lib/query-client'
import { isSupabaseConfigured } from '@/lib/supabase'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        {isSupabaseConfigured ? (
          <QueryClientProvider client={queryClient}>
            <BrowserRouter basename="/wedding_planner">
              <AuthProvider>
                <App />
              </AuthProvider>
              <Toaster richColors position="top-center" />
            </BrowserRouter>
          </QueryClientProvider>
        ) : (
          <ConfigMissingScreen />
        )}
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
