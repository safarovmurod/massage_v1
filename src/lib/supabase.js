import { createClient } from '@supabase/supabase-js'

// Values are read from the environment first (.env locally, project settings on
// Vercel). The constants below are this project's public Supabase credentials
// and act as a fallback so the site keeps working if the env vars are missing.
// The anon / publishable key is safe in client code — access is enforced by RLS.
const DEFAULT_SUPABASE_URL = 'https://alafwzjqxwjanoqrirwi.supabase.co'
const DEFAULT_SUPABASE_KEY = 'sb_publishable_pttATYOLyVLJ3FTOLiCWZw_MhL2nCQ6'

// Strips whitespace and stray quotes — a common .env copy/paste artifact
// (VITE_SUPABASE_URL="https://..." keeps the quotes as part of the value).
function readEnv(...names) {
  for (const name of names) {
    const raw = import.meta.env?.[name]
    if (typeof raw !== 'string') continue
    const value = raw.trim().replace(/^['"]|['"]$/g, '').trim()
    if (value) return value
  }
  return ''
}

const supabaseUrl = readEnv('VITE_SUPABASE_URL') || DEFAULT_SUPABASE_URL
const supabaseAnonKey =
  readEnv('VITE_SUPABASE_ANON_KEY', 'VITE_SUPABASE_PUBLISHABLE_KEY') || DEFAULT_SUPABASE_KEY

function isValidUrl(value) {
  try {
    return new URL(value).protocol.startsWith('http')
  } catch {
    return false
  }
}

export const isSupabaseConfigured = () => isValidUrl(supabaseUrl) && supabaseAnonKey.length > 20

const NOT_CONFIGURED =
  'Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env'

// Chainable no-op query builder used when Supabase is not configured, so the
// UI degrades to an empty state instead of throwing "x.limit is not a function"
// on chains like .select().order().limit().
const QUERY_METHODS = [
  'select', 'insert', 'update', 'upsert', 'delete', 'eq', 'neq', 'gt', 'gte',
  'lt', 'lte', 'like', 'ilike', 'is', 'in', 'contains', 'match', 'filter',
  'not', 'or', 'order', 'limit', 'range', 'single', 'maybeSingle', 'returns',
]

function createQueryStub() {
  const result = { data: null, error: new Error(NOT_CONFIGURED), count: 0, status: 0 }
  const settled = () => Promise.resolve(result)
  const builder = {
    then: (onFulfilled, onRejected) => settled().then(onFulfilled, onRejected),
    catch: (onRejected) => settled().catch(onRejected),
    finally: (onFinally) => settled().finally(onFinally),
  }
  for (const method of QUERY_METHODS) builder[method] = () => builder
  return builder
}

const rejected = () => Promise.reject(new Error(NOT_CONFIGURED))

const fallbackClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: rejected,
    signInWithPassword: rejected,
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: rejected,
    updateUser: rejected,
  },
  from: () => createQueryStub(),
  rpc: () => createQueryStub(),
}

if (!isSupabaseConfigured() && typeof console !== 'undefined') {
  console.error(NOT_CONFIGURED)
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : fallbackClient
