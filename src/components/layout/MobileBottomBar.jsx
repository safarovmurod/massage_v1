import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext.jsx'
import { WhatsAppIcon } from '../icons/Icons.jsx'
import { getWhatsAppLink } from './Header.jsx'
import { trackWhatsAppClick } from '../../lib/analytics.js'

export default function MobileBottomBar() {
  const { lang, t } = useLang()
  const items = [
    { to: '/', icon: '🏠', label: t('mobile.home') },
    { to: '/#pricing', icon: '💆', label: t('mobile.services') },
    { href: getWhatsAppLink(lang), wa: true, icon: <WhatsAppIcon size={22} />, label: t('mobile.whatsapp') },
    { to: '/contact', icon: '📍', label: t('mobile.contacts') },
  ]

  return (
    <motion.div
      initial={{ y: 60 }} animate={{ y: 0 }} transition={{ delay: 0.5 }}
      className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t border-gold-soft z-[997] py-1.5"
      style={{ background: 'var(--header-bg)' }}
    >
      <div className="flex justify-around items-center max-w-[480px] mx-auto">
        {items.map((item, i) => (
          <motion.div key={i} whileTap={{ scale: 0.9 }}>
            {item.wa ? (
              <a href={item.href}
                onClick={(e) => { e.preventDefault(); trackWhatsAppClick('mobile'); window.open(item.href, '_blank') }}
                className="flex flex-col items-center gap-0.5 text-xs font-semibold text-muted-soft px-3 py-1.5 rounded-xl transition-colors hover:text-[#25D366]"
              >
                <span className="flex" style={{ color: '#25D366' }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ) : (
              <Link to={item.to} className="flex flex-col items-center gap-0.5 text-xs font-semibold text-muted-soft px-3 py-1.5 rounded-xl transition-colors hover:text-gold">
                <span className="flex">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
