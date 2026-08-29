import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../contexts/LanguageContext.jsx'
import { WhatsAppIcon } from '../components/icons/Icons.jsx'
import { getWhatsAppLink } from '../components/layout/Header.jsx'
import { trackWhatsAppClick } from '../lib/analytics.js'

export default function NotFound() {
  const { lang, t } = useLang()
  return (
    <section className="min-h-[90vh] flex items-center justify-center text-center">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="gradient-text-animated font-bold leading-none"
            style={{ fontSize: 'clamp(5rem, 15vw, 10rem)' }}
          >404</motion.div>
          <h1 className="text-2xl font-bold mb-3">{t('404.title')}</h1>
          <p className="mb-7">{t('404.desc')}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="btn btn-primary btn-lg">{t('404.btn.home')}</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href={getWhatsAppLink(lang)} className="btn btn-secondary btn-lg"
                onClick={(e) => { e.preventDefault(); trackWhatsAppClick('404'); window.open(getWhatsAppLink(lang), '_blank') }}>
                <WhatsAppIcon size={20} /> {t('404.btn.whatsapp')}
              </a>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="glass-card !p-6 mt-9 max-w-[500px] mx-auto"
          >
            <h2 className="text-lg font-semibold mb-2 gradient-text">{t('404.construction.title')}</h2>
            <p className="text-sm text-secondary-soft">{t('404.construction.desc')}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
