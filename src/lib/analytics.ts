import { detectSource } from './attribution.ts'
import { supabase } from './supabase.ts'

// --- Кто зашёл ---
// Постоянный id посетителя в его браузере. Нужен, чтобы отличать
// «10 просмотров одного человека» от «10 разных людей».
// Никаких личных данных не содержит — просто случайная строка.
function getVisitorId() {
  try {
    let id = localStorage.getItem('visitorId')
    if (!id) {
      id = 'v_' + crypto.randomUUID()
      localStorage.setItem('visitorId', id)
    }
    return id
  } catch {
    return null
  }
}

// --- Откуда пришёл ---
// Instagram/WhatsApp не передают имя пользователя — узнать, КТО именно
// перешёл по ссылке, технически невозможно. Видно только сам источник.
// Первый источник запоминается на весь визит, чтобы переходы внутри
// сайта не превращались в «прямые заходы».
export function getSource() {
  try {
    const saved = sessionStorage.getItem('visitSourceV2')
    const explicit = new URLSearchParams(window.location.search).has('utm_source')
    if (saved && !explicit) return saved
    const source = detectSource()
    sessionStorage.setItem('visitSourceV2', source)
    return source
  } catch {
    return detectSource()
  }
}

function getReferrer() {
  try {
    return document.referrer ? new URL(document.referrer).origin.slice(0, 300) : null
  } catch {
    return null
  }
}

// Если человек вошёл в аккаунт — записываем и его id,
// тогда в админке видно имя, а не только «посетитель».
async function getUserId() {
  try {
    const { data } = await supabase.auth.getSession()
    return data?.session?.user?.id || null
  } catch {
    return null
  }
}

export async function trackEvent(eventType, eventData = {}) {
  try {
    if (localStorage.getItem('cookieConsent') !== 'accepted') return
    if (window.location.pathname.startsWith('/admin')) return
    const visitorId = getVisitorId()
    if (!visitorId) return
    const userId = await getUserId()
    const { error } = await supabase.from('analytics_events').insert({
      event_type: eventType,
      event_data: eventData,
      page_url: window.location.pathname.slice(0, 200),
      user_agent: navigator.userAgent.slice(0, 200),
      visitor_id: visitorId,
      user_id: userId,
      referrer: getReferrer(),
      source: getSource(),
    })
    if (error) console.warn('[analytics] Событие не сохранено:', error.code)
  } catch {
    // тихо: аналитика никогда не должна ломать страницу
  }
}

export async function trackPageView(path) {
  return trackEvent('page_view', { path: path || window.location.pathname })
}

export async function trackWhatsAppClick(context = 'general') {
  trackEvent('whatsapp_click', { context })
}

export async function trackInstagramClick() {
  trackEvent('instagram_click')
}

export async function trackFormSubmit(formData = {}) {
  trackEvent('form_submit', formData)
}

export async function trackLanguageChange(from, to) {
  trackEvent('language_change', { from, to })
}

export async function trackAuthEvent(type) {
  trackEvent(type === 'login' ? 'login' : 'registration')
}
