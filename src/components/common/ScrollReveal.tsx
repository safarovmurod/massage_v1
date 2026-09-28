import { motion, useReducedMotion } from 'framer-motion'

export default function ScrollReveal({ children, delay = 0, className = '', y = 30 }) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y, rotateX: 7, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      style={{ transformPerspective: 1200, transformOrigin: 'center top' }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ duration: reducedMotion ? 0 : 0.75, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
