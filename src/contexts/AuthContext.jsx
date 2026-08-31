import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import { logUserActivity, bumpLoginCounter } from '../lib/userActivity.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [passwordRecovery, setPasswordRecovery] = useState(false)

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); return }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) { setProfile(null); return }
      setProfile(data)
    } catch {
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setUser(session?.user || null)
          if (session?.user) {
            await fetchProfile(session.user.id)
          }
        }
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true)
      }
      setUser(session?.user || null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => { mounted = false; listener?.subscription?.unsubscribe() }
  }, [fetchProfile])

  // extra — любые дополнительные поля профиля (phone, city, birth_date, ...)
  const signUp = useCallback(async (email, password, fullName, extra = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: {
          full_name: fullName,
          lang: localStorage.getItem('lang') || 'ru',
          ...extra,
        },
      },
    })
    if (error) throw error
    // Профиль создаётся триггером handle_new_user — ручной insert не нужен.
    return data
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    // Блокировка аккаунта администратором
    if (data?.user) {
      const { data: prof } = await supabase
        .from('profiles').select('is_active').eq('id', data.user.id).single()
      if (prof && prof.is_active === false) {
        await supabase.auth.signOut()
        throw new Error('ACCOUNT_BLOCKED')
      }
      logUserActivity(data.user.id, 'login', { email })
      bumpLoginCounter(data.user.id)
    }
    return data
  }, [])

  const signOut = useCallback(async () => {
    if (user?.id) await logUserActivity(user.id, 'logout')
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [user])

  const updateProfile = useCallback(async (fields) => {
    if (!user?.id) throw new Error('Не авторизован')
    const { error } = await supabase.from('profiles')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (error) throw error
    await logUserActivity(user.id, 'profile_update', { fields: Object.keys(fields) })
    await fetchProfile(user.id)
  }, [user, fetchProfile])

  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  }, [])

  const updatePassword = useCallback(async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    setPasswordRecovery(false)
  }, [])

  const value = {
    user, profile, loading, passwordRecovery,
    signUp, signIn, signOut, resetPassword, updatePassword, updateProfile,
    refreshProfile: () => user && fetchProfile(user.id)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
