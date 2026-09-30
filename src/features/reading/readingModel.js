import { getLocalDateString } from '../../lib/localDate.js'

function getReadingStreak(logs, today) {
  const readingDates = new Set(
    logs
      .map((log) => log.reading_date || (log.created_at ? getLocalDateString(new Date(log.created_at)) : null))
      .filter((date) => date && date <= today),
  )
  const anchor = new Date(`${today}T00:00:00`)
  if (!readingDates.has(today)) anchor.setDate(anchor.getDate() - 1)

  let streak = 0
  while (readingDates.has(getLocalDateString(anchor))) {
    streak += 1
    anchor.setDate(anchor.getDate() - 1)
  }
  return streak
}

export function calculateReadingStats(books, logs, today = getLocalDateString()) {
  return {
    booksCompleted: books.filter((book) => book.status === 'completed').length,
    pagesRead: logs.reduce(
      (total, log) => total + Math.max(0, Number(log.pages_read) || 0),
      0,
    ),
    readingStreak: getReadingStreak(logs, today),
    currentlyReading: books.filter((book) => book.status === 'reading').length,
  }
}

export function getCurrentBookFromBooks(books) {
  return books.find((book) => book.status === 'reading') || null
}