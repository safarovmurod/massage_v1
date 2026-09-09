import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Переход по якорю (/#services) и подъём страницы вверх при смене маршрута.
export default function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    const id = location.hash.slice(1)
    const timer = setTimeout(() => {
      const element = document.getElementById(id)
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(timer)
  }, [location])

  return null
}
