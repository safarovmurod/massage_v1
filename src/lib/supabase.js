import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://alafwzjqxwjanoqrirwi.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pttATYOLyVLJ3FTOLiCWZw_MhL2nCQ6'
export const isSupabaseConfigured = () => !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
const mockClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: async () => { throw new Error('Supabase not configured.') },
    signInWithPassword: async () => { throw new Error('Supabase not configured.') },
    signOut: async () => {},
    resetPasswordForEmail: async () => { throw new Error('Supabase not configured.') },
    updateUser: async () => { throw new Error('Supabase not configured.') },
  },
  from: () => ({
    select: () => ({ data: [], error: null, order: () => ({ data: [], error: null }), eq: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }) }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null, eq: () => ({ data: null, error: null }) }),
    upsert: () => ({ data: null, error: null }),
  })
}
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } })
  : mockClient
