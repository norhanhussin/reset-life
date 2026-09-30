export function buildHabitsModel(habits, habitLogs) {
  const completedHabitIds = new Set(
    habitLogs
      .filter((log) => log.completed === true)
      .map((log) => log.habit_id),
  )
  const items = habits.map((habit) => ({
    ...habit,
    completedToday: completedHabitIds.has(habit.id),
  }))
  const completedCount = items.filter((habit) => habit.completedToday).length

  return {
    habits: items,
    completedCount,
    totalCount: items.length,
    completionPercent: items.length
      ? Math.round((completedCount / items.length) * 100)
      : 0,
  }
}