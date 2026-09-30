import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from '../components/ProtectedRoute.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import GoalsPage from '../pages/GoalsPage.jsx'
import HabitsPage from '../pages/HabitsPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import SignupPage from '../pages/SignupPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import { useI18n } from '../i18n/useI18n.js'

const ReadingPage = lazy(() => import('../pages/ReadingPage.jsx'))
const ColoringPage = lazy(() => import('../pages/ColoringPage.jsx'))

function ReadingRouteFallback() {
  const { t } = useI18n()

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f0] px-6 text-[#285344]">
      <p className="text-sm font-medium" role="status">{t('reading.loading')}</p>
    </main>
  )
}

function ColoringRouteFallback() {
  const { t } = useI18n()

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f0] px-6 text-[#285344]">
      <p className="text-sm font-medium" role="status">{t('coloring.loading')}</p>
    </main>
  )
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/reading"
            element={
              <Suspense fallback={<ReadingRouteFallback />}>
                <ReadingPage />
              </Suspense>
            }
          />
          <Route
            path="/coloring"
            element={
              <Suspense fallback={<ColoringRouteFallback />}>
                <ColoringPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter