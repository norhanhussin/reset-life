import { useEffect, useState } from 'react'
import { getCurrentBook } from './readingService.js'

export function useCurrentBook(userId) {
  const [snapshot, setSnapshot] = useState({ userId: null, book: null, error: null })

  useEffect(() => {
    let isMounted = true
    if (!userId) return () => { isMounted = false }

    getCurrentBook(userId)
      .then((book) => {
        if (isMounted) setSnapshot({ userId, book, error: null })
      })
      .catch((error) => {
        if (isMounted) {
          setSnapshot({ userId, book: null, error: error.message || 'Current book could not be loaded.' })
        }
      })

    return () => { isMounted = false }
  }, [userId])

  const hasCurrentSnapshot = snapshot.userId === userId
  return {
    book: hasCurrentSnapshot ? snapshot.book : null,
    error: hasCurrentSnapshot ? snapshot.error : null,
    isLoading: Boolean(userId) && !hasCurrentSnapshot,
  }
}