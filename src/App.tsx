import { Loader2 } from 'lucide-react'
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RedirectIfAuthed, RedirectIfHasWedding, RequireAuth, RequireWedding } from '@/components/protected-route'
import { AppLayout } from '@/layouts/app-layout'
import { AuthLayout } from '@/layouts/auth-layout'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password-page'
import { LoginPage } from '@/pages/auth/login-page'
import { SignupPage } from '@/pages/auth/signup-page'
import { UpdatePasswordPage } from '@/pages/auth/update-password-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { DocumentsPage } from '@/pages/documents-page'
import { EventsPage } from '@/pages/events-page'
import { FamilyPage } from '@/pages/family-page'
import { GuestsPage } from '@/pages/guests-page'
import { InspirationPage } from '@/pages/inspiration-page'
import { MorePage } from '@/pages/more-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { OnboardingPage } from '@/pages/onboarding-page'
import { PaymentsPage } from '@/pages/payments-page'
import { ReportsPage } from '@/pages/reports-page'
import { SettingsPage } from '@/pages/settings-page'
import { TasksPage } from '@/pages/tasks-page'
import { VendorsPage } from '@/pages/vendors-page'

// Recharts is heavy — load the Budget page's bundle only when it's visited.
const BudgetPage = lazy(() => import('@/pages/budget-page').then((m) => ({ default: m.BudgetPage })))

function RouteFallback() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="size-6 animate-spin text-rose-400" />
    </div>
  )
}

export function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <LoginPage />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuthed>
              <SignupPage />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectIfAuthed>
              <ForgotPasswordPage />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/update-password"
          element={
            <RequireAuth>
              <UpdatePasswordPage />
            </RequireAuth>
          }
        />
      </Route>

      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <RedirectIfHasWedding>
              <OnboardingPage />
            </RedirectIfHasWedding>
          </RequireAuth>
        }
      />

      <Route
        element={
          <RequireAuth>
            <RequireWedding>
              <AppLayout />
            </RequireWedding>
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/guests" element={<GuestsPage />} />
        <Route
          path="/budget"
          element={
            <Suspense fallback={<RouteFallback />}>
              <BudgetPage />
            </Suspense>
          }
        />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/inspiration" element={<InspirationPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/more" element={<MorePage />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
