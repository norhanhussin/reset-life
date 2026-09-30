import { supabase } from '../../lib/supabase/client.js'

function requireUserId(userId) {
  if (!userId) throw new Error('Sign in to view and manage your habits.')
}

function editableHabitFields(habit) {
  const name = habit.name?.trim()
  if (!name) throw new Error('Habit name is required.')

  return {
    name,
    category: habit.category || null,
    frequency: habit.frequency || 'daily',
  }
}

export async function listHabits(userId) {
  requireUserId(userId)

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data || []
}

export async function listHabitLogsForDate(userId, date) {
  requireUserId(userId)

  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)

  if (error) throw error
  return data || []
}

export async function createHabit(userId, habit) {
  requireUserId(userId)

  const { data, error } = await supabase
    .from('habits')
    .insert({ ...editableHabitFields(habit), user_id: userId })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateHabit(userId, habitId, habit) {
  requireUserId(userId)

  const { data, error } = await supabase
    .from('habits')
    .update(editableHabitFields(habit))
    .eq('id', habitId)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteHabit(userId, habitId) {
  requireUserId(userId)

  const { data, error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('This habit could not be found or deleted.')
}

export async function saveHabitCompletion(userId, habitId, date, completed) {
  requireUserId(userId)

  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(
      {
        habit_id: habitId,
        date,
        completed,
        user_id: userId,
      },
      { onConflict: 'habit_id,date' },
    )
    .select('*')
    .single()

  if (error) throw error
  return data
}