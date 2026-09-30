import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.js'
import { buildDashboardModel } from '../features/dashboard/dashboardModel.js'
import { useDashboardData } from '../features/dashboard/useDashboardData.js'
import DashboardHeader from '../features/dashboard/components/DashboardHeader.jsx'
import GoalsCard from '../features/dashboard/components/GoalsCard.jsx'
import HabitsCard from '../features/dashboard/components/HabitsCard.jsx'
import PrioritiesCard from '../features/dashboard/components/PrioritiesCard.jsx'
import ProgressSummary from '../features/dashboard/components/ProgressSummary.jsx'
import TodayFocus from '../features/dashboard/components/TodayFocus.jsx'
import { useI18n } from '../i18n/useI18n.js'
import { translateError } from '../i18n/translateError.js'
import DashboardReadingWidget from '../features/reading/components/DashboardReadingWidget.jsx'
import { useCurrentBook } from '../features/reading/useCurrentBook.js'
import ColoringDashboardWidget from '../features/coloring/components/ColoringDashboardWidget.jsx'
import { useLatestUnfinishedArtwork } from '../features/coloring/useLatestUnfinishedArtwork.js'

function DashboardLoading() {
  const { t } = useI18n()

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f0] px-6 text-[#285344]">
      <div className="text-center" role="status">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#cdd9ce] border-t-[#285344]" />
        <p className="mt-4 text-sm font-medium">{t('dashboard.loading')}</p>
      </div>
    </main>
  )
}

function DashboardErrorNotice({ errors, onRetry }) {
  const { t } = useI18n()
  const entries = Object.entries(errors)
  if (entries.length === 0) return null

  return (
    <section
      aria-label={t('dashboard.dataErrorAria')}
      className="mb-6 flex flex-col gap-4 rounded-lg border border-[#e6c8bd] bg-[#fcf2ee] p-4 text-[#7d3f32] sm:flex-row sm:items-center sm:justify-between sm:p-5"
      role="alert"
    >
      <div>
        <h2 className="text-sm font-semibold">{t('dashboard.dataErrorTitle')}</h2>
        <ul className="mt-1 space-y-1 text-sm leading-5">
          {entries.map(([key, message]) => (
            <li key={key}>
              {t(`dashboard.dataset.${key}`)}:{' '}
              {translateError(message, t, 'common.loadError')}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="w-fit shrink-0 rounded-md border border-[#d9b4a8] px-3 py-2 text-sm font-semibold transition hover:bg-[#f8e5de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7d3f32]"
        onClick={onRetry}
        type="button"
      >
        {t('common.tryAgain')}
      </button>
    </section>
  )
}

function DashboardPage() {
  const { user, signOut } = useAuth()
  const { language, t } = useI18n()
  const navigate = useNavigate()
  const { dashboardData, errors, isLoading, reload } = useDashboardData(user?.id)
  const currentBook = useCurrentBook(user?.id)
  const currentArtwork = useLatestUnfinishedArtwork(user?.id)
  const [logoutError, setLogoutError] = useState('')
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setLogoutError('')
    setIsSigningOut(true)

    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      setLogoutError(translateError(error, t, 'dashboard.logoutError'))
    } finally {
      setIsSigningOut(false)
    }
  }

  if (isLoading) return <DashboardLoading />

  const model = buildDashboardModel(dashboardData, user, new Date(), language)
  const greeting = `${t(model.greetingKey)}, ${model.userName}`

  return (
    <div className="min-h-screen bg-[#f5f6f0] text-[#20372f]">
      <DashboardHeader
        dateLabel={model.dateLabel}
        greeting={greeting}
        isSigningOut={isSigningOut}
        onSignOut={handleSignOut}
      />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <DashboardErrorNotice errors={errors} onRetry={reload} />
        {logoutError && (
          <p
            className="mb-6 rounded-lg border border-[#e6c8bd] bg-[#fcf2ee] px-4 py-3 text-sm text-[#7d3f32]"
            role="alert"
          >
            {logoutError}
          </p>
        )}

        <TodayFocus />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DashboardReadingWidget {...currentBook} />
          <ColoringDashboardWidget {...currentArtwork} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <PrioritiesCard error={errors.tasks} tasks={model.tasks} />
          <ProgressSummary progress={model.progress} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <GoalsCard error={errors.goals} goals={model.goals} />
          <HabitsCard error={errors.habits || errors.habitLogs} habits={model.habits} />
        </div>
      </main>
    </div>
  )
}

export default DashboardPage