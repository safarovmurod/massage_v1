import { createContext, useContext, useState, useCallback } from 'react'
import { translations } from '../lib/i18n.js'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'ru'
  })

  const changeLang = useCallback((newLang) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
    document.documentElement.lang = newLang === 'tj' ? 'tg' : newLang
  }, [])

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.ru[key] || key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
