import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RedirectIfAuthed, RedirectIfHasWedding, RequireAuth, RequireWedding } from '@/components/protected-route'
import { AppLayout } from '@/layouts/app-layout'
import { AuthLayout } from '@/layouts/auth-layout'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password-page'
import { LoginPage } from '@/pages/auth/login-page'
import { SignupPage } from '@/pages/auth/signup-page'
import { UpdatePasswordPage } from '@/pages/auth/update-password-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { GuestsPage } from '@/pages/guests-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { OnboardingPage } from '@/pages/onboarding-page'
import { TasksPage } from '@/pages/tasks-page'

// Dashboard/Tasks/Guests are the primary bottom-nav tabs and load eagerly.
// Everything else is visited less often, so it's only fetched when needed —
// keeps the initial load lean, especially on mobile. lazy() must be called
// once at module scope, not per-render, or React remounts the page (and
// loses any in-progress form state) on every unrelated re-render of <App>.
const BudgetPage = lazy(() => import('@/pages/budget-page').then((m) => ({ default: m.BudgetPage })))
const VendorsPage = lazy(() => import('@/pages/vendors-page').then((m) => ({ default: m.VendorsPage })))
const EventsPage = lazy(() => import('@/pages/events-page').then((m) => ({ default: m.EventsPage })))
const PaymentsPage = lazy(() => import('@/pages/payments-page').then((m) => ({ default: m.PaymentsPage })))
const DocumentsPage = lazy(() => import('@/pages/documents-page').then((m) => ({ default: m.DocumentsPage })))
const InspirationPage = lazy(() => import('@/pages/inspiration-page').then((m) => ({ default: m.InspirationPage })))
const ReportsPage = lazy(() => import('@/pages/reports-page').then((m) => ({ default: m.ReportsPage })))
const FamilyPage = lazy(() => import('@/pages/family-page').then((m) => ({ default: m.FamilyPage })))
const SettingsPage = lazy(() => import('@/pages/settings-page').then((m) => ({ default: m.SettingsPage })))
const MorePage = lazy(() => import('@/pages/more-page').then((m) => ({ default: m.MorePage })))

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
        <Route path="/budget" element={<BudgetPage />} />
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
