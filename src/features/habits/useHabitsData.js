import { useCallback, useEffect, useState } from 'react'
import { getLocalDateString } from '../../lib/localDate.js'
import { listHabitLogsForDate, listHabits, saveHabitCompletion } from './habitsService.js'

export function useHabitsData(userId) {
  const [today] = useState(getLocalDateString)
  const [refreshKey, setRefreshKey] = useState(0)
  const [snapshot, setSnapshot] = useState({
    userId: null,
    today: null,
    refreshKey: -1,
    habits: [],
    habitLogs: [],
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    if (!userId) {
      return () => {
        isMounted = false
      }
    }

    Promise.all([listHabits(userId), listHabitLogsForDate(userId, today)])
      .then(([habits, habitLogs]) => {
        if (!isMounted) return
        setSnapshot({ userId, today, refreshKey, habits, habitLogs, error: null })
      })
      .catch((error) => {
        if (!isMounted) return
        setSnapshot({
          userId,
          today,
          refreshKey,
          habits: [],
          habitLogs: [],
          error: error.message || 'Habits could not be loaded. Please try again.',
        })
      })

    return () => {
      isMounted = false
    }
  }, [userId, today, refreshKey])

  const reload = useCallback(() => {
    setRefreshKey((current) => current + 1)
  }, [])

  const setTodayCompletion = useCallback(
    async (habitId, completed) => {
      const savedLog = await saveHabitCompletion(userId, habitId, today, completed)

      setSnapshot((current) => {
        if (
          current.userId !== userId ||
          current.today !== today ||
          current.refreshKey !== refreshKey
        ) {
          return current
        }

        const otherLogs = current.habitLogs.filter(
          (log) => !(log.habit_id === habitId && log.date === today),
        )

        return { ...current, habitLogs: [...otherLogs, savedLog] }
      })

      return savedLog
    },
    [userId, today, refreshKey],
  )

  const hasCurrentSnapshot =
    snapshot.userId === userId &&
    snapshot.today === today &&
    snapshot.refreshKey === refreshKey

  return {
    habits: hasCurrentSnapshot ? snapshot.habits : [],
    habitLogs: hasCurrentSnapshot ? snapshot.habitLogs : [],
    today,
    error: !userId
      ? 'Your session could not be verified. Please sign in again.'
      : hasCurrentSnapshot
        ? snapshot.error
        : null,
    isLoading: Boolean(userId) && !hasCurrentSnapshot,
    reload,
    setTodayCompletion,
  }
}