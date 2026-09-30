import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.js'
import { useI18n } from '../i18n/useI18n.js'

function RouteLoading() {
  const { t } = useI18n()

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f2] px-6 text-[#24483c]">
      <p className="text-sm font-medium" role="status">
        {t('common.loadingSession')}
      </p>
    </main>
  )
}

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <RouteLoading />
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { user, loading } = useAuth()

  if (loading) return <RouteLoading />
  if (user) return <Navigate to="/dashboard" replace />

  return <Outlet />
}