import { supabase } from './supabase.js'

/**
 * Пишет действие пользователя в user_activity.
 * Виден в админке: Users → карточка клиента → «История действий».
 * Никогда не бросает исключений — логирование не должно ломать UI.
 */
export async function logUserActivity(userId, action, details = {}) {
  if (!userId) return
  try {
    await supabase.from('user_activity').insert({
      user_id: userId,
      action,
      details,
      page_url: typeof window !== 'undefined' ? window.location.pathname : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 250) : null,
    })
  } catch {
    /* тихо игнорируем */
  }
}

/** Увеличивает счётчик входов и обновляет last_login */
export async function bumpLoginCounter(userId) {
  if (!userId) return
  try {
    const { data } = await supabase
      .from('profiles').select('login_count').eq('id', userId).single()
    await supabase.from('profiles').update({
      last_login: new Date().toISOString(),
      login_count: (data?.login_count || 0) + 1,
      updated_at: new Date().toISOString(),
    }).eq('id', userId)
  } catch {
    /* тихо игнорируем */
  }
}
