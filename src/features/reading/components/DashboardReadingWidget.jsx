import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../../i18n/useI18n.js'
import BookCover from './BookCover.jsx'

function DashboardReadingWidget({ book, error, isLoading }) {
  const { language, t } = useI18n()
  const currentPage = Number(book?.current_page) || 0
  const totalPages = Number(book?.total_pages) || 0
  const progress = totalPages ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : 0

  return (
    <section className="rounded-lg border border-[#dfe5dc] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">{t('reading.dashboardTitle')}</p>
          {book && <h2 className="mt-1 text-lg font-semibold text-[#20372f]">{book.title}</h2>}
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#eaf1ee] text-[#4d7165]"><BookOpen aria-hidden="true" size={18} /></span>
      </div>

      {isLoading ? (
        <div className="mt-5 h-20 animate-pulse rounded-md bg-[#f1f3ee]" role="status" />
      ) : error ? (
        <p className="mt-4 text-sm leading-5 text-[#718278]">{t('common.loadError')}</p>
      ) : book ? (
        <div className="mt-4 flex items-center gap-4">
          <BookCover book={book} className="h-24 w-16" />
          <div className="min-w-0 flex-1">
            {book.author && <p className="break-words text-sm text-[#718278]">{book.author}</p>}
            {totalPages > 0 && <>
              <p className="mt-2 text-xs tabular-nums text-[#64766c]">{t('reading.pageCount', { current: currentPage.toLocaleString(language), total: totalPages.toLocaleString(language) })}</p>
              <div aria-label={t('reading.progressOf', { percent: progress })} className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf0eb]" role="img">
                <div className="me-auto h-full rounded-full bg-[#6e9675]" style={{ width: `${progress}%` }} />
              </div>
            </>}
            <Link className="mt-3 inline-flex min-h-9 items-center rounded-md bg-[#edf3eb] px-3 py-2 text-xs font-semibold text-[#285344] transition hover:bg-[#e1ebe0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] sm:text-sm" to="/reading">{t('reading.continueReading')}</Link>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm font-medium text-[#42584c]">{t('reading.dashboardEmptyTitle')}</p>
          <p className="mt-1 text-sm leading-5 text-[#718278]">{t('reading.dashboardEmptyText')}</p>
          <Link className="mt-3 inline-flex min-h-9 items-center rounded-md border border-[#cbd7cd] px-3 py-2 text-xs font-semibold text-[#285344] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] sm:text-sm" to="/reading">{t('reading.startReading')}</Link>
        </div>
      )}
    </section>
  )
}

export default DashboardReadingWidget