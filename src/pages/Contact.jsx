import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TextField, MenuItem, Button as MuiButton, Box, Typography } from '@mui/material'
import { WhatsAppIcon, InstagramIcon, MapPinIcon, ClockIcon } from '../components/icons/Icons.jsx'
import { getWhatsAppLink } from '../components/layout/Header.jsx'
import { trackWhatsAppClick, trackInstagramClick, trackFormSubmit } from '../lib/analytics.js'

export default function Contact() {
  const [forWhom, setForWhom] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', time: '', comment: '' })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const handleWA = (e) => {
    e.preventDefault()
    trackWhatsAppClick('contact')
    window.open(getWhatsAppLink('ru'), '_blank')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    trackFormSubmit({ forWhom })
    setSubmitted(true)
  }

  const yandexMapSrc = 'https://yandex.uz/map-widget/v1/?ll=68.786%2C38.536&z=15&pt=38.536,68.786,pm2rdm'
  const routeLink = 'https://maps.app.goo.gl/Z6nT8PEVyGF8H6a26?g_st=atm'

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(212,168,87,0.4)' },
      '&.Mui-focused fieldset': { borderColor: '#d4a857' },
    },
    '& .MuiInputLabel-root': { color: '#8a7f76' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#d4a857' },
  }

  return (
    <>
      <section className="pt-[120px] pb-8 text-center">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="section-title">
            <h2 className="gradient-text-animated text-3xl md:text-4xl font-bold">{('Где мы находимся')}</h2>
            <p className="mt-3 text-lg max-w-[600px] mx-auto">Свяжитесь с нами удобным способом</p>
          </motion.div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column: info + map */}
            <div>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="glass-card !p-7 mb-5">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-[42px] h-[42px] rounded-full bg-glass border border-gold-soft flex items-center justify-center text-gold shrink-0"><MapPinIcon width={22} height={22} /></div>
                  <div><div className="text-xs text-muted-soft uppercase tracking-wide">Адрес</div><div className="text-base font-semibold">Зарафшон 22/1</div></div>
                </div>
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-[42px] h-[42px] rounded-full bg-glass border border-gold-soft flex items-center justify-center text-gold shrink-0"><WhatsAppIcon size={22} /></div>
                  <div><div className="text-xs text-muted-soft uppercase tracking-wide">WhatsApp</div><div className="text-base font-semibold"><a href={getWhatsAppLink('ru')} target="_blank" rel="noopener" onClick={handleWA}>+992 007 336 264</a></div></div>
                </div>
                <div className="flex items-start gap-3.5 mb-5">
                  <div className="w-[42px] h-[42px] rounded-full bg-glass border border-gold-soft flex items-center justify-center text-gold shrink-0"><InstagramIcon width={22} height={22} /></div>
                  <div><div className="text-xs text-muted-soft uppercase tracking-wide">Instagram</div><div className="text-base font-semibold"><a href="https://www.instagram.com/safarovvv.i8/" target="_blank" rel="noopener" onClick={() => trackInstagramClick()}>@safarovvv.i8</a></div></div>
                </div>
                <motion.a href="#" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary btn-block mb-2.5" onClick={handleWA}><WhatsAppIcon size={18} /> Написать в WhatsApp</motion.a>
                <a href="https://www.instagram.com/safarovvv.i8/" target="_blank" rel="noopener" className="btn btn-secondary btn-block" onClick={() => trackInstagramClick()}><InstagramIcon size={18} /> Открыть Instagram</a>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                <div className="rounded-[28px] overflow-hidden shadow-card mb-4">
                  <iframe src={yandexMapSrc} title="Yandex Map — Zarafshon 22/1" loading="lazy" className="w-full border-none block" style={{ height: 340 }} />
                </div>
                <a href={routeLink} target="_blank" rel="noopener" className="btn btn-outline btn-block">Построить маршрут</a>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card mt-5">
                <h3 className="text-lg font-semibold mb-3.5 flex items-center gap-2"><ClockIcon width={22} height={22} /> Часы работы</h3>
                <ul className="list-none"><li className="flex justify-between py-2 border-b border-glass-soft last:border-b-0 text-sm">Пн – Вс: 9:00 – 19:00</li></ul>
              </motion.div>
            </div>

            {/* Right column: form */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
              <div className="glass-card !p-8">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <h3 className="text-lg font-semibold mb-1.5">Форма обратной связи</h3>
                      <p className="text-sm mb-5">Заполните форму — мы свяжемся с вами в WhatsApp</p>
                      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField label="Имя *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} sx={inputSx} />
                        <TextField label="Номер телефона *" required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} sx={inputSx} />
                        <TextField label="Удобное время" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} sx={inputSx} />
                        <TextField select label="Кому нужна процедура? *" required value={forWhom} onChange={e => setForWhom(e.target.value)} sx={inputSx}>
                          <MenuItem value="">—</MenuItem>
                          <MenuItem value="woman">Женщине</MenuItem>
                          <MenuItem value="child">Ребёнку</MenuItem>
                        </TextField>
                        {forWhom === 'child' && <Typography sx={{ fontSize: '0.82rem', color: '#d4a857', bgcolor: 'rgba(212,168,87,0.1)', p: 1, borderRadius: 1 }}>Для записи ребёнка необходима предварительная связь с родителем или законным представителем.</Typography>}
                        <TextField label="Комментарий" multiline minRows={3} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} sx={inputSx} />
                        <MuiButton type="submit" variant="contained" size="large" sx={{ background: 'linear-gradient(135deg, #d4a857, #e8915a)', fontWeight: 600, borderRadius: '999px', py: 1.5, '&:hover': { background: 'linear-gradient(135deg, #e8c178, #e8915a)' } }}>Отправить заявку</MuiButton>
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-7 rounded-[20px]" style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)' }}>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="text-4xl mb-3" style={{ color: '#25D366' }}>✓</motion.div>
                      <h3 className="text-[#25D366] mb-1.5">Заявка отправлена!</h3>
                      <p>Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
