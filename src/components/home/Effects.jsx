import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext.jsx'
import ScrollReveal from '../common/ScrollReveal'
import { CheckIcon } from '../icons/Icons.jsx'

export default function Effects() {
  const { t } = useLang()
  const effects = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <section id="effects">
      <div className="container">
        <ScrollReveal className="section-title">
          <h2 className="gradient-text-animated">{t('effects.title')}</h2>
          <p className="mt-3 text-lg max-w-[600px] mx-auto">{t('effects.subtitle')}</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1100px] mx-auto">
          {effects.map((n, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ x: 4, borderColor: '#d4a857' }}
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-glass border border-glass-soft transition-all duration-300 hover:bg-glass-hover"
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 200 }}
                className="text-gold shrink-0"
              >
                <CheckIcon width={20} height={20} />
              </motion.span>
              <span className="text-sm text-secondary-soft">{t(`effects.${n}`)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
