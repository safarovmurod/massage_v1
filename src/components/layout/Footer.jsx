import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiSun, FiActivity, FiList, FiTag, FiMapPin } from 'react-icons/fi'
import { useLang } from '../../contexts/LanguageContext.jsx'
import { LogoIcon, WhatsAppIcon, InstagramIcon, MapPinIcon } from '../icons/Icons.jsx'
import { getWhatsAppLink } from './Header.jsx'

export const INSTAGRAM_URL = 'https://www.instagram.com/orom.massage.tj/'
export const INSTAGRAM_NAME = '@orom.massage.tj'

export default function Footer() {
  const { lang, t } = useLang()
  const year = new Date().getFullYear()

  const socials = [
    { href: getWhatsAppLink(lang), icon: WhatsAppIcon, label: 'WhatsApp' },
    { href: INSTAGRAM_URL, icon: InstagramIcon, label: 'Instagram' },
  ]
  const quickLinks = [
    { to: '/', label: t('nav.home'), icon: FiHome },
    { to: '/#services', label: t('nav.services'), icon: FiSun },
    { to: '/#benefits', label: t('nav.benefits'), icon: FiActivity },
    { to: '/#process', label: t('nav.process'), icon: FiList },
    { to: '/#pricing', label: t('nav.prices'), icon: FiTag },
    { to: '/contact', label: t('nav.contacts'), icon: FiMapPin },
  ]

  return (
    <footer
      className="border-t border-gold-soft pt-14 pb-[120px] md:pb-7 mt-15"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <LogoIcon size={34} />
              <span className="text-lg font-bold text-primary-soft">{t('brand.name')}</span>
            </div>
            <p className="text-sm mb-2.5 max-w-[280px]">{t('footer.about')}</p>
            <p className="text-sm text-gold font-semibold">{t('footer.note')}</p>
            <div className="flex gap-2.5 mt-3.5">
              {socials.map((s, i) => (
                <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="rounded-full bg-glass border border-glass-soft flex items-center justify-center text-secondary-soft transition-all hover:bg-gradient-gold hover:text-white"
                  style={{ width: 38, height: 38 }}
                ><s.icon size={19} /></motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3.5">{t('footer.links.title')}</h4>
            <ul className="list-none">
              {quickLinks.map((link, i) => (
                <li key={i} className="mb-2">
                  <Link to={link.to} className="flex items-center gap-2 text-sm text-secondary-soft hover:text-gold transition-colors">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-glass text-gold shrink-0">
                      <link.icon className="text-[15px]" />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3.5">{t('footer.contacts.title')}</h4>
            <div className="flex items-center gap-2 text-sm mb-2 text-secondary-soft"><MapPinIcon size={16} /> {t('contact.address.value')}</div>
            <div className="flex items-center gap-2 text-sm mb-2 text-secondary-soft">
              <WhatsAppIcon size={16} />
              <a href={getWhatsAppLink(lang)} target="_blank" rel="noopener noreferrer">+992 007 336 264</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary-soft">
              <InstagramIcon size={16} />
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{INSTAGRAM_NAME}</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3.5">{t('contact.hours.label')}</h4>
            <div className="text-sm text-secondary-soft">{t('contact.hours.all')}</div>
          </div>
        </div>

        <div className="border-t border-glass-soft pt-5 flex justify-between flex-wrap gap-2.5 text-sm text-muted-soft">
          <span>© {year} {t('footer.copyright').replace('© 2026 ', '')}</span>
        </div>
      </div>
    </footer>
  )
}
