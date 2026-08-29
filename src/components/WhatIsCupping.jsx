import { motion } from 'framer-motion'
import { useLang } from '../contexts/LanguageContext.jsx'
import ScrollReveal from './ScrollReveal'

export default function WhatIsCupping() {
  const { t } = useLang()
  return (
    <section id="whatis" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <ScrollReveal>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-[28px] overflow-hidden shadow-card"
              style={{ aspectRatio: '4/3' }}
            >
              <img src="/images/infant-massage.jpg" alt="Cupping massage" loading="lazy"
                className="w-full h-full object-cover" />
            </motion.div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h2 className="gradient-text-animated text-left mb-5">{t('whatis.title')}</h2>
            <p className="mb-4 text-secondary-soft">{t('whatis.p1')}</p>
            <p className="text-secondary-soft">{t('whatis.p2')}</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
