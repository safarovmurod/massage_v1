import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLang } from '../contexts/LanguageContext.jsx'
import { WhatsAppIcon } from './icons/Icons.jsx'
import { getWhatsAppLink } from './Header'
import { trackWhatsAppClick } from '../lib/analytics.js'

export default function Hero() {
  const { lang, t } = useLang()
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 500], [0, 150])
  const bgOpacity = useTransform(scrollY, [0, 400], [0.2, 0])

  const handleWA = (e, type) => {
    e.preventDefault()
    trackWhatsAppClick(type)
    window.open(getWhatsAppLink(lang, type), '_blank')
  }

  const titleWords = t('hero.title').split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleAccent = titleWords.slice(-1).join(' ')

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  }
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  }

  return (
    <section className="min-h-[92vh] flex items-center pt-[120px] pb-16 relative overflow-hidden" id="home">
      <motion.div
        style={{ y: bgY, opacity: bgOpacity }}
        className="absolute top-0 right-0 w-[55%] h-full bg-cover bg-center z-0"
        css={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1), transparent)' }}
      >
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/cupping-therapy.jpg')" }} />
      </motion.div>
      <div className="absolute inset-0 z-0" style={{
        background: 'radial-gradient(ellipse at 70% 30%, rgba(212,168,87,0.12), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(232,145,90,0.08), transparent 50%)'
      }} />

      <div className="container">
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-[2] max-w-[680px]">
          <motion.h1 variants={item} className="mb-4 font-bold leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            {titleMain} <span className="gradient-text-animated">{titleAccent}</span>
          </motion.h1>
          <motion.p variants={item} className="text-lg mb-5 max-w-[560px] text-secondary-soft">{t('hero.subtitle')}</motion.p>
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 bg-glass border border-gold-soft rounded-full text-sm font-semibold text-gold mb-7 backdrop-blur-md">
            <span>♀</span><span>{t('hero.badge')}</span>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-7 max-w-[680px]">
            <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card !p-5">
              <h3 className="text-lg font-semibold mb-1.5">{t('hero.card1.title')}</h3>
              <div className="gradient-text text-3xl font-bold mb-2">{t('hero.card1.price')}</div>
              <p className="text-sm">{t('hero.card1.desc')}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card !p-5">
              <h3 className="text-lg font-semibold mb-1.5">{t('hero.card2.title')}</h3>
              <p className="text-sm">{t('hero.card2.desc')}</p>
            </motion.div>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <motion.a href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-lg" onClick={(e) => handleWA(e, 'general')}
            ><WhatsAppIcon size={20} /> {t('hero.btn.whatsapp')}</motion.a>
            <Link to="/#benefits" className="btn btn-secondary btn-lg">{t('hero.btn.more')}</Link>
            <Link to="/contact" className="btn btn-outline btn-lg">{t('hero.btn.address')}</Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
