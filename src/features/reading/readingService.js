import { supabase } from '../../lib/supabase/client.js'
import { getLocalDateString } from '../../lib/localDate.js'
import { calculateReadingStats, getCurrentBookFromBooks } from './readingModel.js'

export { calculateReadingStats, getCurrentBookFromBooks } from './readingModel.js'

function requireUserId(userId) {
  if (!userId) throw new Error('Sign in to view and manage your reading list.')
}

function validateBook(book) {
  const title = book.title?.trim()
  if (!title) throw new Error('Book title is required.')

  const totalPages = book.total_pages === '' ? null : book.total_pages
  const currentPage = book.current_page === '' ? 0 : book.current_page
  const rating = book.rating === '' || book.rating == null ? null : book.rating

  if (totalPages != null && (!Number.isFinite(Number(totalPages)) || Number(totalPages) <= 0)) {
    throw new Error('Total pages must be a positive number.')
  }
  if (!Number.isFinite(Number(currentPage)) || Number(currentPage) < 0) {
    throw new Error('Current page cannot be negative.')
  }
  if (totalPages != null && Number(currentPage) > Number(totalPages)) {
    throw new Error('Current page cannot exceed total pages.')
  }
  if (rating != null && (!Number.isFinite(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)) {
    throw new Error('Rating must be between 0 and 5.')
  }

  return {
    title,
    author: book.author?.trim() || null,
    cover_url: book.cover_url?.trim() || null,
    total_pages: totalPages == null ? null : Number(totalPages),
    current_page: Number(currentPage),
    status: book.status || 'want_to_read',
    started_at: book.start_date || book.started_at || null,
    completed_at: book.completion_date || book.completed_at || null,
    notes: book.notes?.trim() || null,
    rating: rating == null ? null : Number(rating),
  }
}

function normalizeBook(book) {
  if (!book) return null

  return {
    ...book,
    start_date: book.started_at || null,
    completion_date: book.completed_at || null,
  }
}

export async function getBooks(userId) {
  requireUserId(userId)
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(normalizeBook)
}

export async function getBook(userId, bookId) {
  requireUserId(userId)
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .eq('id', bookId)
    .maybeSingle()

  if (error) throw error
  return normalizeBook(data)
}

export async function createBook(userId, book) {
  requireUserId(userId)
  const { data, error } = await supabase
    .from('books')
    .insert({ ...validateBook(book), user_id: userId })
    .select('*')
    .single()

  if (error) throw error
  return normalizeBook(data)
}

export async function updateBook(userId, bookId, book) {
  requireUserId(userId)
  const { data, error } = await supabase
    .from('books')
    .update(validateBook(book))
    .eq('user_id', userId)
    .eq('id', bookId)
    .select('*')
    .single()

  if (error) throw error
  return normalizeBook(data)
}

export async function deleteBook(userId, bookId) {
  requireUserId(userId)
  const { data, error } = await supabase
    .from('books')
    .delete()
    .eq('user_id', userId)
    .eq('id', bookId)
    .select('id')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('This book could not be found or deleted.')
}

export async function addReadingLog(userId, readingLog) {
  requireUserId(userId)
  const pagesRead = Number(readingLog.pages_read)
  const duration = readingLog.duration_minutes == null || readingLog.duration_minutes === ''
    ? null
    : Number(readingLog.duration_minutes)

  if (!readingLog.book_id) throw new Error('A book is required for a reading log.')
  if (!Number.isInteger(pagesRead) || pagesRead <= 0) {
    throw new Error('Pages read must be a positive whole number.')
  }
  if (duration != null && (!Number.isInteger(duration) || duration < 0)) {
    throw new Error('Reading duration must be a non-negative whole number.')
  }

  const { data, error } = await supabase
    .from('reading_logs')
    .insert({
      user_id: userId,
      book_id: readingLog.book_id,
      reading_date: readingLog.date || getLocalDateString(),
      pages_read: pagesRead,
      duration_minutes: duration,
      notes: readingLog.note?.trim() || null,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function getReadingLogs(userId) {
  requireUserId(userId)
  const { data, error } = await supabase
    .from('reading_logs')
    .select('*')
    .eq('user_id', userId)
    .order('reading_date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCurrentBook(userId) {
  const books = await getBooks(userId)
  return getCurrentBookFromBooks(books)
}

export async function getReadingStats(userId) {
  const [books, logs] = await Promise.all([getBooks(userId), getReadingLogs(userId)])
  return calculateReadingStats(books, logs)
}

export async function getReadingData(userId) {
  const [books, logs] = await Promise.all([getBooks(userId), getReadingLogs(userId)])

  return {
    books,
    logs,
    currentBook: getCurrentBookFromBooks(books),
    stats: calculateReadingStats(books, logs),
  }
}

export async function updateReadingProgress(userId, book, progress) {
  requireUserId(userId)
  const currentPage = Number(book.current_page) || 0
  const nextPage = Number(progress.current_page)
  const totalPages = book.total_pages == null ? null : Number(book.total_pages)
  const duration = progress.duration_minutes === '' || progress.duration_minutes == null
    ? null
    : Number(progress.duration_minutes)

  if (!Number.isInteger(nextPage) || nextPage < 0) {
    throw new Error('Current page must be a non-negative whole number.')
  }
  if (totalPages != null && nextPage > totalPages) {
    throw new Error('Current page cannot exceed total pages.')
  }
  if (duration != null && (!Number.isInteger(duration) || duration < 0)) {
    throw new Error('Reading duration must be a non-negative whole number.')
  }

  const pagesRead = nextPage - currentPage
  if (pagesRead <= 0) {
    if (nextPage === currentPage) return { book, logged: false, completed: false }
    throw new Error('Progress cannot move backward. Enter a page beyond your current progress.')
  }

  const today = getLocalDateString()
  const isCompleted = totalPages != null && nextPage >= totalPages
  const updatedFields = {
    current_page: nextPage,
    status: isCompleted ? 'completed' : 'reading',
    ...(isCompleted ? { completed_at: today } : {}),
    ...(!book.start_date ? { started_at: today } : {}),
  }

  const newLog = await addReadingLog(userId, {
      book_id: book.id,
      date: today,
      pages_read: pagesRead,
      duration_minutes: duration,
      note: progress.note?.trim() || null,
  })

  const { data: updatedBook, error: bookError } = await supabase
    .from('books')
    .update(updatedFields)
    .eq('user_id', userId)
    .eq('id', book.id)
    .select('*')
    .single()

  if (bookError) {
    await supabase
      .from('reading_logs')
      .delete()
      .eq('user_id', userId)
      .eq('id', newLog.id)
    throw bookError
  }

  return { book: normalizeBook(updatedBook), logged: true, completed: isCompleted }
}