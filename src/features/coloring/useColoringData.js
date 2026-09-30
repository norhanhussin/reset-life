import { useCallback, useEffect, useState } from 'react'
import { getColoringData } from './coloringService.js'

const EMPTY_DATA = { artworks: [], favorites: [], stats: null }

export function useColoringData(userId) {
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

    getColoringData(userId)
      .then((data) => {
        if (isMounted) setSnapshot({ userId, refreshKey, data, error: null })
      })
      .catch((error) => {
        if (isMounted) {
          setSnapshot({
            userId,
            refreshKey,
            data: EMPTY_DATA,
            error: error.message || 'Creative Space data could not be loaded.',
          })
        }
      })

    return () => { isMounted = false }
  }, [userId, refreshKey])

  const reload = useCallback(() => setRefreshKey((current) => current + 1), [])
  const hasUserSnapshot = snapshot.userId === userId

  return {
    ...(hasUserSnapshot ? snapshot.data : EMPTY_DATA),
    error: !userId
      ? 'Your session could not be verified. Please sign in again.'
      : hasUserSnapshot
        ? snapshot.error
        : null,
    isLoading: Boolean(userId) && !hasUserSnapshot,
    reload,
  }
}