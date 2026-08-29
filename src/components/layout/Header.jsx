import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home as MuiHome, Spa as MuiSpa, ListAlt as MuiListAlt, LocalOffer as MuiLocalOffer, LocationOn as MuiLocationOn, Login as MuiLogin, PersonAdd as MuiPersonAdd } from '@mui/icons-material'
import { useLang } from '../../contexts/LanguageContext.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'
import { LogoIcon, SunIcon, MoonIcon, MenuIcon, CloseIcon, WhatsAppIcon } from '../icons/Icons.jsx'
import { trackWhatsAppClick, trackLanguageChange } from '../../lib/analytics.js'

const WA_NUMBER = '992007336264'

export function getWhatsAppLink(lang, type = 'general') {
  const messages = {
    ru: { general: 'Здравствуйте! Я хочу узнать подробнее о баночном массаже и записаться на процедуру.', home: 'Меня интересует баночный массаж с выездом на дом.', clinic: 'Меня интересует баночный массаж по вашему адресу.' },
    tj: { general: 'Салом! Ман мехоҳам дар бораи массажи бонкагӣ маълумот гирам ва нависам.', home: 'Ман массажи бонкагӣ бо омадан ба хонаро мехоҳам.', clinic: 'Ман массажи бонкагӣ дар суроғаи шуморо мехоҳам.' },
    en: { general: 'Hello! I would like to know more about cupping massage and book an appointment.', home: 'I am interested in cupping massage with a home visit.', clinic: 'I am interested in cupping massage at your location.' }
  }
  let msg = messages[lang]?.general || messages.ru.general
  if (type === 'home') msg += ' ' + (messages[lang]?.home || messages.ru.home)
  if (type === 'clinic') msg += ' ' + (messages[lang]?.clinic || messages.ru.clinic)
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

export default function Header() {
  const { lang, changeLang, t } = useLang()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setMenuOpen(false) }, [location])

  const handleLangChange = (newLang) => {
    trackLanguageChange(lang, newLang)
    changeLang(newLang)
  }
  const handleWA = (e, type) => {
    e.preventDefault()
    trackWhatsAppClick(type)
    window.open(getWhatsAppLink(lang, type), '_blank')
  }
  const langs = ['ru', 'tj', 'en']
  const navLinks = [
    { to: '/', label: t('nav.home'), icon: MuiHome },
    { to: '/#benefits', label: t('nav.benefits'), icon: MuiSpa },
    { to: '/#process', label: t('nav.process'), icon: MuiListAlt },
    { to: '/#pricing', label: t('nav.prices'), icon: MuiLocalOffer },
    { to: '/contact', label: t('nav.contacts'), icon: MuiLocationOn },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-[1000] backdrop-blur-xl border-b border-gold-soft"
        style={{ background: 'var(--header-bg)' }}
      >
        <div className="flex items-center justify-between px-6 max-w-[1280px] mx-auto gap-3 py-3.5">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <LogoIcon size={36} />
            <span className="text-lg font-bold text-primary-soft whitespace-nowrap">Баночный массаж</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="text-sm font-medium px-3 py-2 rounded-xl transition-all duration-300 hover:bg-glass-hover text-secondary-soft hover:text-primary-soft whitespace-nowrap"
              >{link.label}</Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <div className="flex gap-1">
              {langs.map(l => (
                <motion.button key={l} whileTap={{ scale: 0.9 }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 border border-glass-soft
                    ${lang === l ? 'bg-gradient-gold text-white border-transparent' : 'bg-glass text-muted-soft hover:text-primary-soft hover:bg-glass-hover'}`}
                  onClick={() => handleLangChange(l)}>{l.toUpperCase()}</motion.button>
              ))}
            </div>
            <motion.button whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9 }}
              onClick={toggleTheme} aria-label="Toggle theme"
              className="w-9.5 h-9.5 rounded-full bg-glass border border-glass-soft flex items-center justify-center text-primary-soft transition-all shrink-0"
              style={{ width: 38, height: 38 }}
            >
              {theme === 'dark' ? <SunIcon width={20} height={20} /> : <MoonIcon width={20} height={20} />}
            </motion.button>
            <div className="flex gap-1.5">
              <Link to="/login" className="text-sm font-semibold px-3.5 py-2 rounded-xl border border-glass-soft text-secondary-soft hover:text-primary-soft hover:bg-glass transition-all">{t('nav.login')}</Link>
              <Link to="/register" className="text-sm font-semibold px-3.5 py-2 rounded-xl bg-glass text-gold hover:bg-glass-hover transition-all">{t('nav.register')}</Link>
            </div>
            <motion.a href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-sm" onClick={(e) => handleWA(e, 'general')}
            ><WhatsAppIcon size={18} /> {t('header.whatsapp')}</motion.a>
          </div>
          <button className="md:hidden flex flex-col p-2 z-[1001] text-primary-soft" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-[998] md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)} />
            <motion.div className="fixed top-0 right-0 w-full max-w-[340px] h-screen z-[999] flex flex-col px-5 pt-[70px] pb-5 overflow-y-auto md:hidden"
              style={{ background: 'var(--bg-secondary)', boxShadow: '-8px 0 32px rgba(0,0,0,0.3)' }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <nav className="flex flex-col gap-1.5 mb-5">
                {navLinks.map((link, i) => (
                  <motion.div key={link.to}
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
                  >
                    <Link to={link.to} className="flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-2xl bg-glass text-primary-soft hover:bg-glass-hover transition-all">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-glass-hover text-gold shrink-0"><link.icon sx={{ fontSize: 20 }} /></span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div className="flex justify-center gap-1 mb-4"
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              >
                {langs.map(l => (
                  <button key={l} className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border border-glass-soft
                    ${lang === l ? 'bg-gradient-gold text-white border-transparent' : 'bg-glass text-muted-soft hover:text-primary-soft'}`}
                    onClick={() => handleLangChange(l)}>{l.toUpperCase()}</button>
                ))}
              </motion.div>
              <motion.div className="flex flex-col gap-2 mb-4"
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              >
                <Link to="/login" className="btn btn-secondary btn-block flex items-center justify-center gap-2">
                  <MuiLogin sx={{ fontSize: 20 }} /> {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-secondary btn-block flex items-center justify-center gap-2">
                  <MuiPersonAdd sx={{ fontSize: 20 }} /> {t('nav.register')}
                </Link>
              </motion.div>
              <motion.a href="#" className="btn btn-primary btn-block flex items-center justify-center gap-2"
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                onClick={(e) => handleWA(e, 'general')}
              >
                <WhatsAppIcon size={18} /> {t('header.whatsapp')}
              </motion.a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
