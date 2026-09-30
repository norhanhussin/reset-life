import { BookOpen, CalendarDays, Plus } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'
import BookCover from './BookCover.jsx'
import ReadingStatusBadge from './ReadingStatusBadge.jsx'

function formatDate(value, language) {
  if (!value) return null
  const isDateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  const date = new Date(isDateOnly ? `${value}T00:00:00` : value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', {
    month: 'long', day: 'numeric', year: 'numeric',
  }).format(date)
}

function CurrentBookPanel({ book, error, onAddBook, onUpdateProgress }) {
  const { language, t } = useI18n()

  return (
    <section aria-labelledby="current-book-heading" className="overflow-hidden rounded-lg border border-[#d9e2d8] bg-[#eaf0e8]">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.75fr)] lg:items-center lg:gap-10 lg:p-9">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#617968]">{t('reading.currentBook')}</p>
          {error ? (
            <div className="mt-5 max-w-lg">
              <h2 className="font-serif text-2xl text-[#24483c] sm:text-3xl" id="current-book-heading">{t('reading.dashboardTitle')}</h2>
              <p className="mt-2 text-sm leading-6 text-[#617468]">{t('common.loadError')}</p>
            </div>
          ) : book ? (
            <>
              <div className="mt-5 flex gap-5 sm:gap-7">
                <BookCover book={book} className="h-40 w-28 shadow-md sm:h-52 sm:w-36" />
                <div className="min-w-0 flex-1 self-center">
                  <ReadingStatusBadge status={book.status} />
                  <h2 className="mt-3 break-words font-serif text-2xl leading-tight text-[#24483c] sm:text-3xl" id="current-book-heading">
                    {book.title}
                  </h2>
                  {book.author && <p className="mt-2 text-sm text-[#617468] sm:text-base">{book.author}</p>}
                  <p className="mt-4 text-sm font-medium tabular-nums text-[#354b41]">
                    {t('reading.pageCount', {
                      current: (Number(book.current_page) || 0).toLocaleString(language),
                      total: (Number(book.total_pages) || 0).toLocaleString(language),
                    })}
                  </p>
                  {book.start_date && formatDate(book.start_date, language) && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#718278]">
                      <CalendarDays aria-hidden="true" size={14} />
                      {t('reading.startDate', { date: formatDate(book.start_date, language) })}
                    </p>
                  )}
                </div>
              </div>
              {Number(book.total_pages) > 0 && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs text-[#617468]">
                    <span>{t('reading.progressOf', { percent: Math.min(100, Math.round((Number(book.current_page || 0) / Number(book.total_pages)) * 100)) })}</span>
                    <span className="tabular-nums">{Math.min(100, Math.round((Number(book.current_page || 0) / Number(book.total_pages)) * 100))}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/70">
                    <div
                      className="me-auto h-full rounded-full bg-[#5f8768] transition-[width] duration-500"
                      style={{ width: `${Math.min(100, Math.round((Number(book.current_page || 0) / Number(book.total_pages)) * 100))}%` }}
                    />
                  </div>
                </div>
              )}
              <button className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md bg-[#285344] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]" onClick={() => onUpdateProgress(book)} type="button">
                <BookOpen aria-hidden="true" size={16} />
                {t('reading.updateProgress')}
              </button>
            </>
          ) : (
            <div className="mt-5 max-w-lg">
              <h2 className="font-serif text-2xl text-[#24483c] sm:text-3xl" id="current-book-heading">{t('reading.noBookInProgress')}</h2>
              <p className="mt-2 text-sm leading-6 text-[#617468]">{t('reading.startJourney')}</p>
              <button className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md bg-[#285344] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]" onClick={onAddBook} type="button">
                <Plus aria-hidden="true" size={17} />
                {t('reading.startReading')}
              </button>
            </div>
          )}
        </div>
        <div aria-hidden="true" className="hidden justify-self-center lg:flex">
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-[#bfcfbe] text-[#6e8972]">
            <div className="absolute inset-4 rounded-full border border-[#cbd8c9]" />
            <BookOpen size={58} strokeWidth={1} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CurrentBookPanel