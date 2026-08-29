import { motion } from 'framer-motion'
import { useLang } from '../contexts/LanguageContext.jsx'
import ScrollReveal from './ScrollReveal'

export default function Steps() {
  const { t } = useLang()
  const steps = [1, 2, 3, 4]

  return (
    <section id="process" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <ScrollReveal className="section-title">
          <h2 className="gradient-text-animated">{t('steps.title')}</h2>
          <p className="mt-3 text-lg max-w-[600px] mx-auto">{t('steps.subtitle')}</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          <div className="hidden lg:block absolute top-[23px] left-[12%] right-[12%] h-0.5 bg-gradient-gold opacity-30" />
          {steps.map((n, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-[1]"
            >
              <motion.div whileHover={{ scale: 1.05, y: -4 }} className="glass-card text-center !p-7">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.3, type: 'spring', stiffness: 120 }}
                  className="w-[46px] h-[46px] mx-auto mb-3.5 rounded-full bg-gradient-gold text-white text-xl font-bold flex items-center justify-center glow-shadow"
                >{n}</motion.div>
                <h3 className="text-base font-semibold mb-2">{t(`step.${n}.title`)}</h3>
                <p className="text-sm">{t(`step.${n}.desc`)}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
