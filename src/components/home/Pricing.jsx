import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext.jsx'
import ScrollReveal from '../common/ScrollReveal'
import { WhatsAppIcon, CheckIcon } from '../icons/Icons.jsx'
import { getWhatsAppLink } from '../layout/Header.jsx'
import { trackWhatsAppClick } from '../../lib/analytics.js'

export default function Pricing() {
  const { lang, t } = useLang()

  const handleWA = (e, type) => {
    e.preventDefault()
    trackWhatsAppClick(type)
    window.open(getWhatsAppLink(lang, type), '_blank')
  }

  return (
    <section id="pricing" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <ScrollReveal className="section-title">
          <h2 className="gradient-text-animated">{t('pricing.title')}</h2>
          <p className="mt-3 text-lg max-w-[600px] mx-auto">{t('pricing.subtitle')}</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-[800px] mx-auto">
          {/* Featured card */}
          <ScrollReveal>
            <motion.div
              animate={{ boxShadow: ['0 0 40px rgba(212,168,87,0.15)', '0 0 60px rgba(212,168,87,0.3)', '0 0 40px rgba(212,168,87,0.15)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card !p-9 text-center relative border-gold"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-gold text-white text-xs font-semibold rounded-full">
                {t('pricing.badge.popular')}
              </div>
              <h3 className="text-xl font-semibold mb-3.5">{t('pricing.card1.title')}</h3>
              <div className="gradient-text text-3xl font-bold mb-4">{t('pricing.card1.price')}</div>
              <ul className="list-none mb-6 text-left">
                {[1, 2, 3].map(n => (
                  <li key={n} className="py-2 text-sm flex items-start gap-2 border-b border-glass-soft last:border-b-0">
                    <span className="text-gold shrink-0"><CheckIcon width={18} height={18} /></span>
                    {t(`pricing.card1.f${n}`)}
                  </li>
                ))}
              </ul>
              <motion.a href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-block" onClick={(e) => handleWA(e, 'home')}
              ><WhatsAppIcon size={18} /> {t('pricing.card1.btn')}</motion.a>
            </motion.div>
          </ScrollReveal>
          {/* Regular card */}
          <ScrollReveal delay={0.15}>
            <motion.div whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card !p-9 text-center"
            >
              <h3 className="text-xl font-semibold mb-3.5">{t('pricing.card2.title')}</h3>
              <div className="gradient-text text-2xl font-bold mb-4">{t('pricing.card2.price')}</div>
              <ul className="list-none mb-6 text-left">
                {[1, 2, 3].map(n => (
                  <li key={n} className="py-2 text-sm flex items-start gap-2 border-b border-glass-soft last:border-b-0">
                    <span className="text-gold shrink-0"><CheckIcon width={18} height={18} /></span>
                    {t(`pricing.card2.f${n}`)}
                  </li>
                ))}
              </ul>
              <motion.a href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="btn btn-secondary btn-block" onClick={(e) => handleWA(e, 'clinic')}
              >{t('pricing.card2.btn')}</motion.a>
            </motion.div>
          </ScrollReveal>
        </div>
        <ScrollReveal>
          <div className="text-center mt-7 text-sm text-muted-soft px-4 py-3.5 rounded-xl bg-glass max-w-[600px] mx-auto">
            {t('pricing.note')}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
