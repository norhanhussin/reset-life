import { supabase } from '../../lib/supabase/client.js'

async function unwrapQuery(query) {
  const { data, error } = await query

  if (error) throw error
  return data
}

export async function fetchDashboardData(userId) {
  const requests = {
    profile: () =>
      unwrapQuery(
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      ),
    goals: () =>
      unwrapQuery(supabase.from('goals').select('*').eq('user_id', userId)),
    habits: () =>
      unwrapQuery(supabase.from('habits').select('*').eq('user_id', userId)),
    habitLogs: () =>
      unwrapQuery(
        supabase.from('habit_logs').select('*').eq('user_id', userId),
      ),
    tasks: () =>
      unwrapQuery(supabase.from('tasks').select('*').eq('user_id', userId)),
  }

  const entries = Object.entries(requests)
  const results = await Promise.allSettled(
    entries.map(([, request]) => request()),
  )

  return results.reduce(
    (dashboardData, result, index) => {
      const [key] = entries[index]

      if (result.status === 'fulfilled') {
        dashboardData.data[key] = result.value
      } else {
        dashboardData.data[key] = key === 'profile' ? null : []
        dashboardData.errors[key] = result.reason?.message || 'Request failed.'
      }

      return dashboardData
    },
    { data: {}, errors: {} },
  )
}