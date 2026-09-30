import { useState } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'
import { getLocalDateString } from '../../../lib/localDate.js'
import { translateError } from '../../../i18n/translateError.js'

function BookFormModal({ book, onCancel, onSave }) {
  const { language, t } = useI18n()
  const [title, setTitle] = useState(book?.title || '')
  const [author, setAuthor] = useState(book?.author || '')
  const [coverUrl, setCoverUrl] = useState(book?.cover_url || '')
  const [totalPages, setTotalPages] = useState(book?.total_pages ?? '')
  const [currentPage, setCurrentPage] = useState(book?.current_page ?? 0)
  const [status, setStatus] = useState(book?.status || 'want_to_read')
  const [startDate, setStartDate] = useState(book?.start_date || '')
  const [notes, setNotes] = useState(book?.notes || '')
  const [rating, setRating] = useState(book?.rating ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    const total = totalPages === '' ? null : Number(totalPages)
    const current = currentPage === '' ? 0 : Number(currentPage)
    const ratingValue = rating === '' ? null : Number(rating)
    if (!title.trim()) return setErrorMessage(t('reading.titleRequired'))
    if (total != null && (!Number.isFinite(total) || total <= 0)) return setErrorMessage(t('reading.positivePages'))
    if (!Number.isFinite(current) || current < 0) return setErrorMessage(t('reading.nonNegativePage'))
    if (total != null && current > total) return setErrorMessage(t('reading.pageExceedsTotal'))
    if (ratingValue != null && (!Number.isFinite(ratingValue) || ratingValue < 0 || ratingValue > 5)) {
      return setErrorMessage(t('reading.ratingRange'))
    }

    setIsSaving(true)
    try {
      await onSave({
        title: title.trim(),
        author,
        cover_url: coverUrl,
        total_pages: total,
        current_page: current,
        status,
        start_date: startDate || null,
        completion_date: status === 'completed'
          ? book?.completion_date || getLocalDateString()
          : null,
        notes,
        rating: ratingValue,
      })
    } catch (error) {
      setErrorMessage(translateError(error, t, 'reading.saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  const categories = [
    ['want_to_read', 'reading.statusWantToRead'],
    ['reading', 'reading.statusReading'],
    ['completed', 'reading.statusCompleted'],
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#17251fcc] p-0 sm:items-center sm:p-6">
      <section aria-labelledby="book-form-title" aria-modal="true" className="max-h-[95vh] w-full overflow-y-auto rounded-t-xl bg-[#fbfcf8] p-5 shadow-2xl sm:max-w-2xl sm:rounded-lg sm:p-7" role="dialog">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">
              {book ? t('reading.formEditEyebrow') : t('reading.formAddEyebrow')}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#20372f]" id="book-form-title">
              {book ? t('reading.editTitle') : t('reading.addTitle')}
            </h2>
          </div>
          <button aria-label={t('common.close')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[#718278] transition hover:bg-[#edf1eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:opacity-50" disabled={isSaving} onClick={onCancel} type="button">
            <X aria-hidden="true" size={19} />
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-[#354b41] sm:col-span-2">
              {t('reading.titleLabel')} <span className="text-[#9a5a48">*</span>
              <input autoFocus className="mt-1.5 w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" maxLength={200} onChange={(event) => setTitle(event.target.value)} placeholder={t('reading.titlePlaceholder')} required value={title} />
            </label>
            <label className="text-sm font-medium text-[#354b41]">
              {t('reading.author')}
              <input className="mt-1.5 w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" onChange={(event) => setAuthor(event.target.value)} placeholder={t('reading.authorPlaceholder')} value={author} />
            </label>
            <label className="text-sm font-medium text-[#354b41]">
              {t('reading.coverUrl')}
              <input className="mt-1.5 w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" dir="ltr" onChange={(event) => setCoverUrl(event.target.value)} type="url" value={coverUrl} />
            </label>
            <label className="text-sm font-medium text-[#354b41]">
              {t('reading.totalPages')}
              <input className="mt-1.5 w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" min="1" onChange={(event) => setTotalPages(event.target.value)} type="number" value={totalPages} />
            </label>
            <label className="text-sm font-medium text-[#354b41]">
              {t('reading.currentPage')}
              <input className="mt-1.5 w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" min="0" onChange={(event) => setCurrentPage(event.target.value)} type="number" value={currentPage} />
            </label>
            <label className="text-sm font-medium text-[#354b41]">
              {t('reading.status')}
              <select className="mt-1.5 w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" onChange={(event) => setStatus(event.target.value)} value={status}>
                {categories.map(([value, key]) => <option key={value} value={value}>{t(key)}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-[#354b41]">
              {t('reading.startDate')}
              <input className="mt-1.5 w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" dir={language === 'ar' ? 'rtl' : 'ltr'} onChange={(event) => setStartDate(event.target.value)} type="date" value={startDate} />
            </label>
            <label className="text-sm font-medium text-[#354b41]">
              {t('reading.rating')}
              <select className="mt-1.5 w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" onChange={(event) => setRating(event.target.value)} value={rating}>
                <option value="">{t('reading.noRating')}</option>
                {[0, 1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-[#354b41] sm:col-span-2">
              {t('reading.notes')}
              <textarea className="mt-1.5 min-h-20 w-full resize-y rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" onChange={(event) => setNotes(event.target.value)} placeholder={t('reading.notesPlaceholder')} rows={3} value={notes} />
            </label>
          </div>

          {errorMessage && <p className="rounded-md border border-[#e6c8bd] bg-[#fcf2ee] px-3.5 py-3 text-sm leading-5 text-[#7d3f32]" role="alert">{errorMessage}</p>}
          <div className="flex flex-col-reverse gap-3 border-t border-[#e7ebe4] pt-5 sm:flex-row sm:justify-end">
            <button className="rounded-md border border-[#cbd7cd] px-4 py-2.5 text-sm font-medium text-[#42584c] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:opacity-60" disabled={isSaving} onClick={onCancel} type="button">{t('common.cancel')}</button>
            <button className="rounded-md bg-[#285344] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:cursor-wait disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? t('common.saving') : book ? t('common.saveChanges') : t('reading.addBook')}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default BookFormModal