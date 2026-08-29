import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext.jsx'
import { WhatsAppIcon } from '../icons/Icons.jsx'
import { getWhatsAppLink } from '../layout/Header.jsx'
import { trackWhatsAppClick } from '../../lib/analytics.js'

export default function WhatsAppFloat() {
  const { lang } = useLang()
  return (
    <motion.a
      href={getWhatsAppLink(lang)}
      onClick={(e) => { e.preventDefault(); trackWhatsAppClick('float'); window.open(getWhatsAppLink(lang), '_blank') }}
      aria-label="WhatsApp"
      className="wa-pulse fixed bottom-20 md:bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white z-[996] transition-all"
      style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}
      whileHover={{ scale: 1.1, boxShadow: '0 6px 28px rgba(37,211,102,0.6)' }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
    >
      <WhatsAppIcon size={28} />
    </motion.a>
  )
}
