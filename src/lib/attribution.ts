export function detectSource(search = window.location.search, referrer = document.referrer, hostname = window.location.hostname) {
  try {
    const utm = new URLSearchParams(search).get('utm_source')?.toLowerCase()
    if (utm && ['instagram', 'whatsapp', 'telegram', 'facebook', 'google', 'yandex'].includes(utm)) return utm

    const ref = referrer || ''
    if (!ref) return 'unknown'
    const host = new URL(ref).hostname.replace(/^www\./, '')
    const matches = (domain) => host === domain || host.endsWith('.' + domain)
    if (matches('instagram.com')) return 'instagram'
    if (matches('whatsapp.com') || matches('wa.me')) return 'whatsapp'
    if (matches('t.me') || matches('telegram.org')) return 'telegram'
    if (matches('facebook.com')) return 'facebook'
    if (matches('google.com')) return 'google'
    if (matches('yandex.ru') || matches('yandex.uz')) return 'yandex'
    if (host === hostname) return 'unknown'
    return host.slice(0, 40)
  } catch {
    return 'unknown'
  }
}

