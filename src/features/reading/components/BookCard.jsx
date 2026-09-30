import { BookOpen, CalendarDays, Pencil, Star, Trash2 } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'
import BookCover from './BookCover.jsx'
import ReadingStatusBadge from './ReadingStatusBadge.jsx'

function formatDate(value, language) {
  if (!value) return null
  const isDateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  const date = new Date(isDateOnly ? `${value}T00:00:00` : value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(date)
}

function BookCard({ book, onDelete, onEdit, onUpdateProgress }) {
  const { language, t } = useI18n()
  const total = Number(book.total_pages) || 0
  const current = Number(book.current_page) || 0
  const percent = total ? Math.min(100, Math.round((current / total) * 100)) : 0
  const relevantDate = book.completion_date || book.start_date
  const formattedDate = formatDate(relevantDate, language)

  return (
    <article className="group flex h-full flex-col rounded-lg border border-[#dfe5dc] bg-white p-4 transition-shadow hover:shadow-sm sm:p-5">
      <div className="flex gap-4">
        <BookCover book={book} className="h-32 w-[5.25rem] sm:h-36 sm:w-24" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ReadingStatusBadge status={book.status} />
            {book.rating != null && book.status === 'completed' && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#8c704c]">
                <Star aria-hidden="true" className="fill-current" size={13} />
                {book.rating}/5
              </span>
            )}
          </div>
          <h3 className="mt-3 break-words text-base font-semibold leading-5 text-[#20372f]">{book.title}</h3>
          {book.author && <p className="mt-1 break-words text-sm text-[#718278]">{book.author}</p>}
          {total > 0 && (
            <>
              <p className="mt-3 text-xs tabular-nums text-[#64766c]">
                {t('reading.pageCount', { current: current.toLocaleString(language), total: total.toLocaleString(language) })}
              </p>
              <div aria-label={t('reading.progressOf', { percent })} className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf0eb]" role="img">
                <div className="me-auto h-full rounded-full bg-[#6e9675]" style={{ width: `${percent}%` }} />
              </div>
            </>
          )}
          {formattedDate && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#89978d]">
              <CalendarDays aria-hidden="true" size={13} />
              {book.completion_date
                ? t('reading.completionDate', { date: formattedDate })
                : t('reading.startDate', { date: formattedDate })}
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#edf0eb] pt-3 mt-4">
        {book.status === 'reading' ? (
          <button
            className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#edf3eb] px-3 py-2 text-xs font-semibold text-[#285344] transition hover:bg-[#e1ebe0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] sm:text-sm"
            onClick={() => onUpdateProgress(book)}
            type="button"
          >
            <BookOpen aria-hidden="true" size={15} />
            {t('reading.updateProgress')}
          </button>
        ) : <span />}
        <div className="ms-auto flex items-center gap-1">
          <button aria-label={t('reading.editBook')} className="flex h-9 w-9 items-center justify-center rounded-md text-[#718278] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]" onClick={() => onEdit(book)} title={t('reading.editBook')} type="button">
            <Pencil aria-hidden="true" size={15} />
          </button>
          <button aria-label={t('reading.deleteBook')} className="flex h-9 w-9 items-center justify-center rounded-md text-[#92766e] transition hover:bg-[#fbefeb] hover:text-[#873f31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#873f31]" onClick={() => onDelete(book)} title={t('reading.deleteBook')} type="button">
            <Trash2 aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default BookCard