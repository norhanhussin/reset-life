import { useEffect, useState } from 'react'
import { AuthContext } from './authContext.js'
import {
  getCurrentSession,
  signInWithEmail,
  signOutCurrentUser,
  signUpWithEmail,
  subscribeToAuthChanges,
} from './authService.js'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionError, setSessionError] = useState(null)

  useEffect(() => {
    let isMounted = true
    const subscription = subscribeToAuthChanges((_event, nextSession) => {
      if (!isMounted) return
      setSession(nextSession)
      setSessionError(null)
      setLoading(false)
    })

    getCurrentSession()
      .then(({ data, error }) => {
        if (!isMounted) return
        setSession(data.session)
        setSessionError(error)
        setLoading(false)
      })
      .catch((error) => {
        if (!isMounted) return
        setSessionError(error)
        setLoading(false)
      })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    sessionError,
    signIn: signInWithEmail,
    signUp: signUpWithEmail,
    signOut: signOutCurrentUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}