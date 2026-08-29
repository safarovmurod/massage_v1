import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext.jsx'
import ScrollReveal from '../common/ScrollReveal'
import { BloodFlowIcon, SkinIcon, TensionIcon, TissueIcon, RecoveryIcon, SkinHealthIcon } from '../icons/Icons.jsx'

export default function Benefits() {
  const { t } = useLang()

  const benefits = [
    { icon: BloodFlowIcon, key: '1' },
    { icon: SkinIcon, key: '2' },
    { icon: TensionIcon, key: '3' },
    { icon: TissueIcon, key: '4' },
    { icon: RecoveryIcon, key: '5' },
    { icon: SkinHealthIcon, key: '6' },
  ]

  return (
    <section id="benefits">
      <div className="container">
        <ScrollReveal className="section-title">
          <h2 className="gradient-text-animated">{t('benefits.title')}</h2>
          <p className="mt-3 text-lg max-w-[600px] mx-auto">{t('benefits.subtitle')}</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="glass-card text-center !p-8 group"
              >
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-glass border border-gold-soft flex items-center justify-center text-gold transition-all duration-300 group-hover:bg-gradient-gold group-hover:text-white group-hover:glow-shadow"
                >
                  <b.icon width={32} height={32} />
                </motion.div>
                <h3 className="text-base font-semibold mb-2">{t(`benefit.${b.key}.title`)}</h3>
                <p className="text-sm">{t(`benefit.${b.key}.desc`)}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
