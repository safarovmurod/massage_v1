import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome, FaSpa, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'
import { useLang } from '../../contexts/LanguageContext.jsx'
import { getWhatsAppLink } from './Header.jsx'
import { trackWhatsAppClick } from '../../lib/analytics.js'

// Нижняя навигация для телефона: активная вкладка подсвечивается
// «таблеткой», которая плавно переезжает (framer-motion layoutId).
export default function MobileBottomBar() {
  const { lang, t } = useLang()
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { id: 'home', to: '/', icon: FaHome, label: t('mobile.home') },
    { id: 'services', to: '/#services', icon: FaSpa, label: t('mobile.services') },
    { id: 'whatsapp', wa: true, icon: FaWhatsapp, label: t('mobile.whatsapp') },
    { id: 'contacts', to: '/contact', icon: FaMapMarkerAlt, label: t('mobile.contacts') },
  ]

  function getActiveId() {
    if (location.pathname === '/contact') return 'contacts'
    if (location.hash === '#services') return 'services'
    if (location.pathname === '/') return 'home'
    return ''
  }
  const activeId = getActiveId()

  function handleClick(item) {
    if (item.wa) {
      trackWhatsAppClick('mobile')
      window.open(getWhatsAppLink(lang), '_blank', 'noopener,noreferrer')
      return
    }
    // Повторное нажатие на ту же вкладку: адрес не меняется,
    // поэтому прокручиваем сами
    const current = location.pathname + location.hash
    if (current === item.to) {
      if (item.id === 'services') {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }
    navigate(item.to)
  }

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 26 }}
      className="md:hidden fixed bottom-4 left-4 right-4 z-[997]"
      aria-label="Mobile navigation"
    >
      <div
        className="flex items-center justify-between gap-1 px-2 py-2 rounded-full border border-gold-soft backdrop-blur-xl"
        style={{ background: 'var(--header-bg)', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}
      >
        {items.map(item => {
          const active = activeId === item.id
          return (
            <motion.button
              key={item.id}
              onClick={() => handleClick(item)}
              whileTap={{ scale: 0.92 }}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className="relative flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-full"
            >
              {active && (
                <motion.span
                  layoutId="bottom-bar-pill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-gradient-gold"
                />
              )}
              <span className="relative z-[1] flex items-center gap-1.5">
                <item.icon
                  className="text-[20px]"
                  style={{ color: item.wa ? '#25D366' : active ? '#ffffff' : 'var(--text-muted)' }}
                />
                <motion.span
                  animate={{ opacity: active ? 1 : 0, width: active ? 'auto' : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-semibold text-white overflow-hidden whitespace-nowrap"
                >
                  {active ? item.label : ''}
                </motion.span>
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )
}
