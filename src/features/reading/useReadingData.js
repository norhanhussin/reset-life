import { useCallback, useEffect, useState } from 'react'
import { getReadingData } from './readingService.js'

const EMPTY_DATA = { books: [], logs: [], currentBook: null, stats: null }

export function useReadingData(userId) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [snapshot, setSnapshot] = useState({
    userId: null,
    refreshKey: -1,
    data: EMPTY_DATA,
    error: null,
  })

  useEffect(() => {
    let isMounted = true
    if (!userId) return () => { isMounted = false }

    getReadingData(userId)
      .then((data) => {
        if (isMounted) setSnapshot({ userId, refreshKey, data, error: null })
      })
      .catch((error) => {
        if (isMounted) {
          setSnapshot({
            userId,
            refreshKey,
            data: EMPTY_DATA,
            error: error.message || 'Reading data could not be loaded.',
          })
        }
      })

    return () => { isMounted = false }
  }, [userId, refreshKey])

  const reload = useCallback(() => setRefreshKey((current) => current + 1), [])
  const hasCurrentSnapshot = snapshot.userId === userId && snapshot.refreshKey === refreshKey

  return {
    ...EMPTY_DATA,
    ...(hasCurrentSnapshot ? snapshot.data : {}),
    error: !userId
      ? 'Your session could not be verified. Please sign in again.'
      : hasCurrentSnapshot
        ? snapshot.error
        : null,
    isLoading: Boolean(userId) && !hasCurrentSnapshot,
    reload,
  }
}