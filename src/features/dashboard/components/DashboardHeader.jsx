import { LogOut, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../../i18n/useI18n.js'

function DashboardHeader({ dateLabel, greeting, isSigningOut, onSignOut }) {
  const { t } = useI18n()
  return (
    <header className="border-b border-[#dce3dc] bg-[#fbfcf8]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-start gap-5 sm:items-center sm:gap-8">
          <span className="shrink-0 text-sm font-semibold tracking-[0.2em] text-[#285344]">
            RESET
          </span>
          <div className="min-w-0 border-s border-[#dce3dc] ps-5 sm:ps-8">
            <h1 className="truncate text-lg font-semibold text-[#20372f] sm:text-xl">
              {greeting}
            </h1>
            <p className="mt-1 text-sm text-[#718278]">{dateLabel}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-[#53695c] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
            to="/goals"
          >
            {t('common.goals')}
          </Link>
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-[#53695c] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
            to="/habits"
          >
            {t('common.habits')}
          </Link>
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-[#53695c] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
            to="/settings"
          >
            {t('common.settings')}
          </Link>
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-[#53695c] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
            to="/reading"
          >
            {t('reading.title')}
          </Link>
          <Link
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-[#53695c] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
            to="/coloring"
          >
            <Palette aria-hidden="true" size={15} strokeWidth={1.8} />
            {t('common.coloring')}
          </Link>
          <button
            className="inline-flex w-fit items-center gap-2 rounded-md border border-[#cbd7cd] px-3 py-2 text-sm font-medium text-[#285344] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:cursor-wait disabled:opacity-60"
            disabled={isSigningOut}
            onClick={onSignOut}
            type="button"
          >
            <LogOut aria-hidden="true" size={16} strokeWidth={1.8} />
            {isSigningOut ? t('common.loggingOut') : t('common.logout')}
          </button>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader