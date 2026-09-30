import { supabase } from '../../lib/supabase/client.js'

function requireUserId(userId) {
  if (!userId) throw new Error('Sign in to view and manage your goals.')
}

function editableGoalFields(goal) {
  const title = goal.title?.trim()
  if (!title) throw new Error('Goal title is required.')

  return {
    title,
    description: goal.description?.trim() || null,
    category: goal.category || null,
    target_date: goal.target_date || null,
    status: goal.status || 'active',
  }
}

export async function listGoals(userId) {
  requireUserId(userId)

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createGoal(userId, goal) {
  requireUserId(userId)

  const { data, error } = await supabase
    .from('goals')
    .insert({ ...editableGoalFields(goal), user_id: userId })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateGoal(userId, goalId, goal) {
  requireUserId(userId)

  const { data, error } = await supabase
    .from('goals')
    .update(editableGoalFields(goal))
    .eq('id', goalId)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteGoal(userId, goalId) {
  requireUserId(userId)

  const { data, error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('This goal could not be found or deleted.')
}