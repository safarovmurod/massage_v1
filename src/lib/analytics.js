import { supabase } from './supabase.js'

export async function trackEvent(eventType, eventData = {}) {
  try {
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      event_data: eventData,
      page_url: window.location.pathname,
      user_agent: navigator.userAgent.slice(0, 200)
    })
  } catch (e) {
    // silent fail — analytics should never break the page
  }
}

export async function trackPageView() {
  trackEvent('page_view', { path: window.location.pathname })
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
