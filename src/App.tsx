import { Navigate, Route, Routes } from 'react-router-dom'
import { RedirectIfAuthed, RequireAuth } from '@/components/protected-route'
import { AppLayout } from '@/layouts/app-layout'
import { AuthLayout } from '@/layouts/auth-layout'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password-page'
import { LoginPage } from '@/pages/auth/login-page'
import { SignupPage } from '@/pages/auth/signup-page'
import { UpdatePasswordPage } from '@/pages/auth/update-password-page'
import { BudgetPage } from '@/pages/budget-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { DocumentsPage } from '@/pages/documents-page'
import { EventsPage } from '@/pages/events-page'
import { FamilyPage } from '@/pages/family-page'
import { GuestsPage } from '@/pages/guests-page'
import { InspirationPage } from '@/pages/inspiration-page'
import { MorePage } from '@/pages/more-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { PaymentsPage } from '@/pages/payments-page'
import { ReportsPage } from '@/pages/reports-page'
import { SettingsPage } from '@/pages/settings-page'
import { TasksPage } from '@/pages/tasks-page'
import { VendorsPage } from '@/pages/vendors-page'

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
        element={
          <RequireAuth>
            <AppLayout />
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
