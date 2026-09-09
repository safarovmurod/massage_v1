import { supabase } from './supabase.js'

// --- Кто зашёл ---
// Постоянный id посетителя в его браузере. Нужен, чтобы отличать
// «10 просмотров одного человека» от «10 разных людей».
// Никаких личных данных не содержит — просто случайная строка.
function getVisitorId() {
  try {
    let id = localStorage.getItem('visitorId')
    if (!id) {
      id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
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
function detectSource() {
  try {
    const utm = new URLSearchParams(window.location.search).get('utm_source')
    if (utm) return utm.slice(0, 40).toLowerCase()

    const ref = document.referrer || ''
    if (!ref) return 'direct'
    const host = new URL(ref).hostname.replace(/^www\./, '')
    if (host.includes('instagram')) return 'instagram'
    if (host.includes('whatsapp') || host.includes('wa.me')) return 'whatsapp'
    if (host.includes('t.me') || host.includes('telegram')) return 'telegram'
    if (host.includes('facebook')) return 'facebook'
    if (host.includes('google')) return 'google'
    if (host.includes('yandex')) return 'yandex'
    if (host.includes(window.location.hostname)) return 'direct'
    return host.slice(0, 40)
  } catch {
    return 'direct'
  }
}

// Первый источник запоминается на весь визит, чтобы переходы внутри
// сайта не превращались в «прямые заходы».
function getSource() {
  try {
    const saved = sessionStorage.getItem('visitSource')
    if (saved) return saved
    const source = detectSource()
    sessionStorage.setItem('visitSource', source)
    return source
  } catch {
    return detectSource()
  }
}

function getReferrer() {
  try {
    return (document.referrer || '').slice(0, 300) || null
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
    const userId = await getUserId()
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      event_data: eventData,
      page_url: window.location.pathname.slice(0, 200),
      user_agent: navigator.userAgent.slice(0, 200),
      visitor_id: getVisitorId(),
      user_id: userId,
      referrer: getReferrer(),
      source: getSource(),
    })
  } catch {
    // тихо: аналитика никогда не должна ломать страницу
  }
}

export async function trackPageView(path) {
  trackEvent('page_view', { path: path || window.location.pathname })
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
