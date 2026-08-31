import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import { translations } from '../lib/i18n.js'

const ContentContext = createContext()

/**
 * Загружает site_content / site_settings из Supabase и отдаёт функцию tc(),
 * которая возвращает значение из БД, а при его отсутствии — текст из i18n.
 * Благодаря этому правки в админке сразу видны на сайте.
 */
export function ContentProvider({ children }) {
  const [content, setContent] = useState({})
  const [settings, setSettings] = useState({})
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(async () => {
    try {
      const [c, s] = await Promise.all([
        supabase.from('site_content').select('key, value'),
        supabase.from('site_settings').select('key, value'),
      ])
      const toObj = (rows) => {
        const o = {}
        ;(rows || []).forEach((r) => {
          if (r?.value !== null && r?.value !== undefined && String(r.value).trim() !== '') {
            o[r.key] = r.value
          }
        })
        return o
      }
      setContent(toObj(c?.data))
      setSettings(toObj(s?.data))
    } catch {
      /* при ошибке остаёмся на переводах из i18n */
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <ContentContext.Provider value={{ content, settings, loaded, reloadContent: load }}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => useContext(ContentContext) || { content: {}, settings: {}, loaded: false }

/**
 * tc(key, lang, t) — значение с приоритетом:
 *   1) site_content['key.<lang>']   — язык из админки
 *   2) site_content['key']          — общее значение
 *   3) t(key)                       — перевод из i18n
 */
export function resolveContent(content, key, lang, t) {
  const localized = content[`${key}.${lang}`]
  if (localized) return localized
  const plain = content[key]
  if (plain) return plain
  return t ? t(key) : (translations[lang]?.[key] || translations.ru?.[key] || key)
}

/** Хук: возвращает tc() — прямую замену t() с поддержкой правок из админки */
export function useSiteText(lang, t) {
  const { content } = useContent()
  return useCallback((key) => resolveContent(content, key, lang, t), [content, lang, t])
}
