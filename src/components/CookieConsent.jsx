import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../contexts/LanguageContext.jsx'

export default function CookieConsent() {
  const { t } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) setTimeout(() => setShow(true), 1500)
  }, [])

  const handle = (value) => {
    localStorage.setItem('cookieConsent', value)
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-center gap-4 flex-wrap px-6 py-4 border-t border-gold-soft"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <p className="text-sm m-0">{t('cookie.text')}</p>
          <div className="flex gap-3">
            <button className="btn btn-secondary btn-sm" onClick={() => handle('declined')}>{t('cookie.decline')}</button>
            <button className="btn btn-primary btn-sm" onClick={() => handle('accepted')}>{t('cookie.accept')}</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
