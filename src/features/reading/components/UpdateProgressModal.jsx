import { useState } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'
import BookCover from './BookCover.jsx'
import { translateError } from '../../../i18n/translateError.js'

function UpdateProgressModal({ book, onCancel, onSave }) {
  const { t } = useI18n()
  const [currentPage, setCurrentPage] = useState(Number(book.current_page) || 0)
  const [duration, setDuration] = useState('')
  const [note, setNote] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const total = Number(book.total_pages) || 0

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    const nextPage = Number(currentPage)
    const minutes = duration === '' ? null : Number(duration)

    if (!Number.isInteger(nextPage) || nextPage < 0) {
      return setErrorMessage(t('reading.nonNegativePage'))
    }
    if (total && nextPage > total) return setErrorMessage(t('reading.pageExceedsTotal'))
    if (nextPage === Number(book.current_page || 0)) {
      return setErrorMessage(t('reading.unchangedProgress'))
    }
    if (nextPage < Number(book.current_page || 0)) {
      return setErrorMessage(t('reading.backwardProgress'))
    }
    if (minutes != null && (!Number.isInteger(minutes) || minutes < 0)) {
      return setErrorMessage(t('reading.invalidDuration'))
    }

    setIsSaving(true)
    try {
      await onSave({ current_page: nextPage, duration_minutes: minutes, note })
    } catch (error) {
      setErrorMessage(translateError(error, t, 'reading.progressSaveError'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#17251fcc] p-0 sm:items-center sm:p-6">
      <section aria-labelledby="progress-form-title" aria-modal="true" className="max-h-[94vh] w-full overflow-y-auto rounded-t-xl bg-[#fbfcf8] p-5 shadow-2xl sm:max-w-lg sm:rounded-lg sm:p-7" role="dialog">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">{t('reading.progressEyebrow')}</p>
            <h2 className="mt-1 text-xl font-semibold text-[#20372f]" id="progress-form-title">{t('reading.progressTitle')}</h2>
          </div>
          <button aria-label={t('common.close')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[#718278] transition hover:bg-[#edf1eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:opacity-50" disabled={isSaving} onClick={onCancel} type="button"><X aria-hidden="true" size={19} /></button>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-md bg-[#f2f5ef] p-4">
          <BookCover book={book} className="h-20 w-14" />
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-[#20372f]">{book.title}</p>
            {book.author && <p className="mt-1 text-sm text-[#718278]">{book.author}</p>}
            <p className="mt-2 text-xs tabular-nums text-[#64766c]">{t('reading.currentProgress')}: {t('reading.pageCount', { current: Number(book.current_page) || 0, total: total || '—' })}</p>
          </div>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[#354b41]">
            {t('reading.newCurrentPage')}
            <input autoFocus className="mt-1.5 w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" max={total || undefined} min={0} onChange={(event) => setCurrentPage(event.target.value)} required type="number" value={currentPage} />
          </label>
          <label className="block text-sm font-medium text-[#354b41]">
            {t('reading.duration')}
            <input className="mt-1.5 w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" min={0} onChange={(event) => setDuration(event.target.value)} type="number" value={duration} />
          </label>
          <label className="block text-sm font-medium text-[#354b41]">
            {t('reading.note')}
            <textarea className="mt-1.5 min-h-20 w-full resize-y rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20372f] outline-none focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20" onChange={(event) => setNote(event.target.value)} placeholder={t('reading.notePlaceholder')} rows={3} value={note} />
          </label>
          {errorMessage && <p className="rounded-md border border-[#e6c8bd] bg-[#fcf2ee] px-3.5 py-3 text-sm leading-5 text-[#7d3f32]" role="alert">{errorMessage}</p>}
          <div className="flex flex-col-reverse gap-3 border-t border-[#e7ebe4] pt-5 sm:flex-row sm:justify-end">
            <button className="rounded-md border border-[#cbd7cd] px-4 py-2.5 text-sm font-medium text-[#42584c] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:opacity-60" disabled={isSaving} onClick={onCancel} type="button">{t('common.cancel')}</button>
            <button className="rounded-md bg-[#285344] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:cursor-wait disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? t('common.saving') : t('reading.updateProgress')}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default UpdateProgressModal