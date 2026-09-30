import { useCallback, useEffect, useState } from 'react'
import { listGoals } from './goalsService.js'

export function useGoals(userId) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [snapshot, setSnapshot] = useState({
    userId: null,
    refreshKey: -1,
    goals: [],
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    if (!userId) {
      return () => {
        isMounted = false
      }
    }

    listGoals(userId)
      .then((goals) => {
        if (!isMounted) return
        setSnapshot({ userId, refreshKey, goals, error: null })
      })
      .catch((error) => {
        if (!isMounted) return
        setSnapshot({
          userId,
          refreshKey,
          goals: [],
          error: error.message || 'Goals could not be loaded. Please try again.',
        })
      })

    return () => {
      isMounted = false
    }
  }, [userId, refreshKey])

  const reload = useCallback(() => {
    setRefreshKey((current) => current + 1)
  }, [])

  const hasCurrentSnapshot =
    snapshot.userId === userId && snapshot.refreshKey === refreshKey

  return {
    goals: hasCurrentSnapshot ? snapshot.goals : [],
    error: !userId
      ? 'Your session could not be verified. Please sign in again.'
      : hasCurrentSnapshot
        ? snapshot.error
        : null,
    isLoading: Boolean(userId) && !hasCurrentSnapshot,
    reload,
  }
}