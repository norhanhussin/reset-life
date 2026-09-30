import { supabase } from '../../lib/supabase/client.js'

export function getCurrentSession() {
  return supabase.auth.getSession()
}

export function subscribeToAuthChanges(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback)

  return subscription
}

export async function signInWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signUpWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOutCurrentUser() {
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}