import { getLocalDateString } from '../../lib/localDate.js'

const TASK_DATE_FIELDS = [
  'due_date',
  'due_at',
  'scheduled_date',
  'scheduled_for',
  'task_date',
  'date',
]

const LOG_DATE_FIELDS = ['log_date', 'logged_at', 'completed_at', 'date', 'created_at']

function dateKey(value) {
  if (!value) return null
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null

  return getLocalDateString(parsed)
}

function getDateValue(record, fields) {
  for (const field of fields) {
    if (record?.[field]) return record[field]
  }
  return null
}

function isActive(record) {
  if (record?.archived_at || record?.deleted_at) return false
  if (record?.status) {
    return ['active', 'in progress', 'in_progress'].includes(
      String(record.status).toLowerCase(),
    )
  }
  if (record?.is_active !== undefined) return Boolean(record.is_active)

  return true
}

function isCompleted(record) {
  for (const field of ['is_completed', 'completed', 'done']) {
    if (record?.[field] !== undefined) return Boolean(record[field])
  }

  return ['completed', 'complete', 'done'].includes(
    String(record?.status || '').toLowerCase(),
  )
}

function priorityRank(priority) {
  if (typeof priority === 'number') return priority

  const ranks = { urgent: 4, high: 3, medium: 2, normal: 2, low: 1 }
  return ranks[String(priority || '').toLowerCase()] || 0
}

function displayName(profile, user) {
  const firstLast = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(' ')
  const metadata = user?.user_metadata || {}
  const name =
    profile?.display_name ||
    profile?.full_name ||
    profile?.name ||
    profile?.username ||
    firstLast ||
    metadata.full_name ||
    metadata.name

  return name || user?.email?.split('@')[0] || 'there'
}

function getGreetingKey(hour) {
  if (hour < 12) return 'dashboard.greetingMorning'
  if (hour < 17) return 'dashboard.greetingAfternoon'
  return 'dashboard.greetingEvening'
}

function getTaskTitle(task) {
  return task.title || task.name || task.description || 'Untitled task'
}

function getHabitTitle(habit) {
  return habit.title || habit.name || 'Untitled habit'
}

export function buildDashboardModel(source, user, now = new Date(), language = 'en') {
  const today = dateKey(now)
  const goals = source.goals || []
  const allHabits = source.habits || []
  const activeHabits = allHabits.filter(isActive)
  const todayLogs = (source.habitLogs || []).filter(
    (log) => dateKey(getDateValue(log, LOG_DATE_FIELDS)) === today,
  )
  const completedHabitIds = new Set(
    todayLogs
      .filter(isCompleted)
      .map((log) => log.habit_id ?? log.habitId)
      .filter(Boolean),
  )
  const tasks = (source.tasks || [])
    .filter((task) => dateKey(getDateValue(task, TASK_DATE_FIELDS)) === today)
    .sort((first, second) => priorityRank(second.priority) - priorityRank(first.priority))
    .slice(0, 3)
    .map((task, index) => ({
      id: task.id ?? `${getTaskTitle(task)}-${index}`,
      title: getTaskTitle(task),
      completed: isCompleted(task),
      priority: task.priority,
    }))
  const completedGoals = goals.filter(isCompleted).length
  const completedTasks = tasks.filter((task) => task.completed).length
  const completedHabits = activeHabits.filter((habit) =>
    completedHabitIds.has(habit.id),
  ).length

  return {
    greetingKey: getGreetingKey(now.getHours()),
    userName: displayName(source.profile, user),
    dateLabel: new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(now),
    goals: goals.filter(isActive).map((goal, index) => ({
      id: goal.id ?? `${goal.title || goal.name || 'goal'}-${index}`,
      title: goal.title || goal.name || 'Untitled goal',
      category: goal.category || goal.area || 'Personal',
      targetDate:
        goal.target_date || goal.due_date || goal.target_at || goal.deadline || null,
      status: goal.status || 'Active',
    })),
    habits: activeHabits.map((habit, index) => ({
      id: habit.id ?? `${getHabitTitle(habit)}-${index}`,
      title: getHabitTitle(habit),
      completedToday: completedHabitIds.has(habit.id),
    })),
    tasks,
    progress: [
      {
        labelKey: 'dashboard.goalsProgressLabel',
        detailKey: 'dashboard.goalsProgress',
        detailParams: { completed: completedGoals, total: goals.length },
        value: goals.length ? Math.round((completedGoals / goals.length) * 100) : 0,
      },
      {
        labelKey: 'dashboard.tasksToday',
        detailKey: 'dashboard.goalsProgress',
        detailParams: { completed: completedTasks, total: tasks.length },
        value: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
      },
      {
        labelKey: 'dashboard.habitsToday',
        detailKey: 'dashboard.goalsProgress',
        detailParams: { completed: completedHabits, total: activeHabits.length },
        value: activeHabits.length
          ? Math.round((completedHabits / activeHabits.length) * 100)
          : 0,
      },
    ],
  }
}

export function formatDashboardDate(value, language = 'en') {
  if (!value) return 'No target date'
  const isDateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  const parsed = new Date(isDateOnly ? `${value}T00:00:00` : value)
  if (Number.isNaN(parsed.getTime())) return 'No target date'

  return new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}