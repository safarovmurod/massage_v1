import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, trackEvent, getSource } from '../../lib/analytics.ts'
import { useAuth } from '../../contexts/AuthContext.tsx'

// Записывает просмотр страницы при каждом переходе.
// Раньше на сайте это нигде не вызывалось, поэтому статистика посещений
// всегда была пустой.
export default function PageViewTracker() {
  const location = useLocation()
  const lastPath = useRef('')
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    // Админку не считаем — это не посетители сайта
    if (loading || (user && !profile) || profile?.role === 'admin') return
    if (location.pathname.startsWith('/admin')) return
    getSource()
    function recordView() {
      try {
        if (localStorage.getItem('cookieConsent') !== 'accepted') return
      } catch { return }
      if (lastPath.current === location.pathname) return
      lastPath.current = location.pathname
      trackPageView(location.pathname)
    }
    function heartbeat() {
      if (document.visibilityState === 'visible') trackEvent('heartbeat')
    }
    recordView()
    const timer = setInterval(heartbeat, 60000)
    window.addEventListener('analytics-consent', recordView)
    document.addEventListener('visibilitychange', heartbeat)
    return () => {
      clearInterval(timer)
      window.removeEventListener('analytics-consent', recordView)
      document.removeEventListener('visibilitychange', heartbeat)
    }
  }, [location.pathname, location.search, loading, user, profile])

  return null
}
