import { createClient } from '@supabase/supabase-js'

// Publishable key only. Access is enforced by database RLS, never by hiding this key.
const defaultUrl = 'https://alafwzjqxwjanoqrirwi.supabase.co'
const defaultKey = 'sb_publishable_pttATYOLyVLJ3FTOLiCWZw_MhL2nCQ6'
const configuredUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const configuredKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
const supabaseUrl = configuredUrl || defaultUrl
const supabaseKey = configuredKey || defaultKey

function isPublicKey(key: string) {
  if (key.startsWith('sb_publishable_')) return true
  try {
    const payload = JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.role === 'anon'
  } catch { return false }
}

if (!/^https:\/\/[^/]+\/?$/.test(supabaseUrl) || !isPublicKey(supabaseKey)) {
  throw new Error('Invalid Supabase public configuration. Never use a secret or service_role key in VITE_* variables.')
}

export const isSupabaseConfigured = () => true
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})
