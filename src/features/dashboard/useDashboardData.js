import { useCallback, useEffect, useState } from 'react'
import { fetchDashboardData } from './dashboardService.js'

const EMPTY_DATA = {
  profile: null,
  goals: [],
  habits: [],
  habitLogs: [],
  tasks: [],
}

export function useDashboardData(userId) {
  const [snapshot, setSnapshot] = useState({
    userId: null,
    refreshKey: -1,
    dashboardData: EMPTY_DATA,
    errors: {},
  })
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let isMounted = true

    if (!userId) {
      return () => {
        isMounted = false
      }
    }

    fetchDashboardData(userId).then((result) => {
      if (!isMounted) return
      setSnapshot({
        userId,
        refreshKey,
        dashboardData: { ...EMPTY_DATA, ...result.data },
        errors: result.errors,
      })
    }).catch((error) => {
      if (!isMounted) return
      setSnapshot({
        userId,
        refreshKey,
        dashboardData: EMPTY_DATA,
        errors: { dashboard: error.message || 'Dashboard data could not be loaded.' },
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
    dashboardData: hasCurrentSnapshot ? snapshot.dashboardData : EMPTY_DATA,
    errors: !userId
      ? { dashboard: 'Your session could not be verified. Please sign in again.' }
      : hasCurrentSnapshot
        ? snapshot.errors
        : {},
    isLoading: Boolean(userId) && !hasCurrentSnapshot,
    reload,
  }
}