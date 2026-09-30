import { useMemo, useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.js'
import BookCard from '../features/reading/components/BookCard.jsx'
import BookFormModal from '../features/reading/components/BookFormModal.jsx'
import CurrentBookPanel from '../features/reading/components/CurrentBookPanel.jsx'
import ReadingFilters from '../features/reading/components/ReadingFilters.jsx'
import ReadingStats from '../features/reading/components/ReadingStats.jsx'
import UpdateProgressModal from '../features/reading/components/UpdateProgressModal.jsx'
import { useReadingData } from '../features/reading/useReadingData.js'
import {
  createBook,
  deleteBook,
  updateBook,
  updateReadingProgress,
} from '../features/reading/readingService.js'
import { useI18n } from '../i18n/useI18n.js'
import { translateError } from '../i18n/translateError.js'

function ReadingLoading() {
  const { t } = useI18n()
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f0] px-6 text-[#285344]">
      <div className="text-center" role="status">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#cdd9ce] border-t-[#285344]" />
        <p className="mt-4 text-sm font-medium">{t('reading.loading')}</p>
      </div>
    </main>
  )
}

function ReadingPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const { books, currentBook, stats, error, isLoading, reload } = useReadingData(user?.id)
  const [filter, setFilter] = useState('all')
  const [isBookFormOpen, setIsBookFormOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [progressBook, setProgressBook] = useState(null)
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')

  const filteredBooks = useMemo(
    () => filter === 'all' ? books : books.filter((book) => book.status === filter),
    [books, filter],
  )

  function openAddBook() {
    setEditingBook(null)
    setActionError('')
    setNotice('')
    setIsBookFormOpen(true)
  }

  function openEditBook(book) {
    setEditingBook(book)
    setActionError('')
    setNotice('')
    setIsBookFormOpen(true)
  }

  async function handleSaveBook(values) {
    if (editingBook) {
      await updateBook(user.id, editingBook.id, values)
      setNotice(t('reading.updateSuccess'))
    } else {
      await createBook(user.id, values)
      setNotice(t('reading.createSuccess'))
    }
    setIsBookFormOpen(false)
    setEditingBook(null)
    reload()
  }

  async function handleDeleteBook(book) {
    if (!window.confirm(t('reading.deleteConfirm', { title: book.title }))) return
    setActionError('')
    setNotice('')
    try {
      await deleteBook(user.id, book.id)
      setNotice(t('reading.deleteSuccess'))
      reload()
    } catch (deleteError) {
      setActionError(translateError(deleteError, t, 'reading.deleteError'))
    }
  }

  async function handleSaveProgress(values) {
    const result = await updateReadingProgress(user.id, progressBook, values)
    setProgressBook(null)
    setNotice(result.completed ? t('reading.bookCompleted') : t('reading.progressSaved'))
    reload()
  }

  if (isLoading) return <ReadingLoading />

  return (
    <div className="min-h-screen bg-[#f5f6f0] text-[#20372f]">
      <header className="border-b border-[#dce3dc] bg-[#fbfcf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-[0.2em] text-[#285344]">RESET</span>
          <Link className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#53695c] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]" to="/dashboard">
            <ArrowLeft aria-hidden="true" className="rtl:rotate-180" size={16} />
            {t('common.backToDashboard')}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-7 sm:px-6 sm:pt-9 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718278]">{t('reading.currentBook')}</p>
            <h1 className="mt-2 font-serif text-3xl text-[#24483c] sm:text-4xl">{t('reading.title')}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#718278]">{t('reading.subtitle')}</p>
          </div>
          <button className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-[#285344] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]" onClick={openAddBook} type="button">
            <Plus aria-hidden="true" size={17} />
            {t('reading.addBook')}
          </button>
        </div>

        {(error || actionError) && (
          <section className="mt-6 flex flex-col gap-3 rounded-lg border border-[#e6c8bd] bg-[#fcf2ee] px-4 py-4 text-sm leading-5 text-[#7d3f32] sm:flex-row sm:items-center sm:justify-between">
            <p role="alert">{actionError || translateError(error, t, 'reading.loadError')}</p>
            {error && <button className="w-fit shrink-0 rounded-md border border-[#d9b4a8] px-3 py-2 text-sm font-semibold transition hover:bg-[#f8e5de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7d3f32]" onClick={reload} type="button">{t('reading.retry')}</button>}
          </section>
        )}
        {notice && <p className="mt-6 rounded-lg border border-[#cdddcf] bg-[#edf5ee] px-4 py-3 text-sm text-[#315c42]" role="status">{notice}</p>}

        {stats && <div className="mt-7"><ReadingStats stats={stats} /></div>}
        <div className="mt-6">
          <CurrentBookPanel book={currentBook} error={error} onAddBook={openAddBook} onUpdateProgress={setProgressBook} />
        </div>

        <section aria-labelledby="reading-library-title" className="mt-9">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#20372f]" id="reading-library-title">{t('reading.library')}</h2>
              <p className="mt-1 text-sm text-[#718278]">{books.length.toLocaleString()}</p>
            </div>
            <ReadingFilters onChange={setFilter} value={filter} />
          </div>

          {error ? null : books.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[#cbd7cd] bg-[#fbfcf8] px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9f0e8] text-[#4b7459]"><Plus aria-hidden="true" size={22} /></span>
              <h3 className="mt-4 text-base font-semibold text-[#354b41]">{t('reading.noBooks')}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#718278]">{t('reading.noBooksDescription')}</p>
              <button className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#bfcfc2] px-4 py-2.5 text-sm font-semibold text-[#285344] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]" onClick={openAddBook} type="button"><Plus aria-hidden="true" size={16} />{t('reading.addBook')}</button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#cbd7cd] bg-[#fbfcf8] px-6 py-10 text-center">
              <h3 className="text-base font-semibold text-[#354b41]">{t('reading.noFilteredBooks')}</h3>
              <p className="mt-2 text-sm leading-6 text-[#718278]">{t('reading.noFilteredBooksDescription')}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book) => (
                <BookCard book={book} key={book.id} onDelete={handleDeleteBook} onEdit={openEditBook} onUpdateProgress={setProgressBook} />
              ))}
            </div>
          )}
        </section>
      </main>

      {isBookFormOpen && <BookFormModal book={editingBook} key={editingBook?.id || 'new-book'} onCancel={() => setIsBookFormOpen(false)} onSave={handleSaveBook} />}
      {progressBook && <UpdateProgressModal book={progressBook} key={progressBook.id} onCancel={() => setProgressBook(null)} onSave={handleSaveProgress} />}
    </div>
  )
}

export default ReadingPage