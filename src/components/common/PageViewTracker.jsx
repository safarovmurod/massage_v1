import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../../lib/analytics.js'

// Записывает просмотр страницы при каждом переходе.
// Раньше на сайте это нигде не вызывалось, поэтому статистика посещений
// всегда была пустой.
export default function PageViewTracker() {
  const location = useLocation()
  const lastPath = useRef('')

  useEffect(() => {
    // Админку не считаем — это не посетители сайта
    if (location.pathname.startsWith('/admin')) return
    if (lastPath.current === location.pathname) return
    lastPath.current = location.pathname
    trackPageView(location.pathname)
  }, [location.pathname])

  return null
}
