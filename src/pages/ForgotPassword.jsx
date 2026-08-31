import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TextField, Button as MuiButton, Box, Alert, CircularProgress, Tabs, Tab } from '@mui/material'
import { useLang } from '../contexts/LanguageContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import { LogoIcon, WhatsAppIcon } from '../components/icons/Icons.jsx'
import PasswordField from '../components/common/PasswordField.jsx'
import { translateAuthError } from '../lib/authErrors.js'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(212,168,87,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#d4a857' },
  },
  '& .MuiInputLabel-root': { color: '#8a7f76' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#d4a857' },
}

const goldBtnSx = {
  background: 'linear-gradient(135deg, #d4a857, #e8915a)', fontWeight: 600, borderRadius: '999px', py: 1.5,
  transition: 'all 0.3s ease',
  '&:hover': { background: 'linear-gradient(135deg, #e8c178, #e8915a)', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(212,168,87,0.35)' },
  '&.Mui-disabled': { background: 'linear-gradient(135deg, rgba(212,168,87,0.5), rgba(232,145,90,0.5))', color: 'rgba(255,255,255,0.7)' },
}

function SuccessPanel({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="text-center py-8 rounded-[20px]"
      style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
        className="mx-auto mb-3 w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      </motion.div>
      <p className="px-6 text-sm" style={{ color: '#e5f9ee' }}>{text}</p>
    </motion.div>
  )
}

export default function ForgotPassword() {
  const { t, s, lang } = useLang()
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState(0)

  // --- способ 1: ссылка на email ---
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  // --- способ 2: код от администратора ---
  const [codeEmail, setCodeEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [codeStage, setCodeStage] = useState('request') // request | enter
  const [codeInfo, setCodeInfo] = useState('')
  const [codeError, setCodeError] = useState('')
  const [codeSuccess, setCodeSuccess] = useState('')
  const [codeLoading, setCodeLoading] = useState(false)

  const waNumber = (s('whatsapp_number', '992007336264') || '992007336264').replace(/\D/g, '')

  const waLink = () => {
    const msg = t('auth.forgot.code.wa.msg').replace('{email}', codeEmail || email || '—')
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setEmailError(''); setEmailSuccess(''); setEmailLoading(true)
    try {
      await resetPassword(email)
      setEmailSuccess(t('auth.reset.sent'))
    } catch (err) {
      setEmailError(translateAuthError(err, t))
    } finally { setEmailLoading(false) }
  }

  // клиент оставляет заявку -> админ выдаёт код
  const handleRequestCode = async (e) => {
    e.preventDefault()
    setCodeError(''); setCodeInfo(''); setCodeLoading(true)
    try {
      const { data, error } = await supabase.rpc('request_password_reset', {
        p_email: codeEmail, p_lang: lang,
      })
      if (error) throw error
      if (data?.ok) {
        setCodeInfo(t('auth.forgot.code.requested'))
        setCodeStage('enter')
      } else {
        setCodeError(t(`auth.forgot.err.${data?.error || 'generic'}`))
      }
    } catch (err) {
      setCodeError(translateAuthError(err, t))
    } finally { setCodeLoading(false) }
  }

  // клиент вводит код + новый пароль
  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    setCodeError(''); setCodeSuccess('')
    if (newPwd.length < 6) { setCodeError(t('auth.password.min')); return }
    if (newPwd !== confirmPwd) { setCodeError(t('auth.password.mismatch')); return }
    setCodeLoading(true)
    try {
      const { data, error } = await supabase.rpc('reset_password_with_code', {
        p_email: codeEmail, p_code: code, p_new_password: newPwd,
      })
      if (error) throw error
      if (data?.ok) {
        setCodeSuccess(t('auth.forgot.code.success'))
        setTimeout(() => navigate('/login'), 2500)
      } else {
        let msg = t(`auth.forgot.err.${data?.error || 'generic'}`)
        if (data?.error === 'bad_code' && typeof data?.left === 'number') {
          msg += ' ' + t('auth.forgot.err.attempts_left').replace('{n}', String(Math.max(0, data.left)))
        }
        setCodeError(msg)
      }
    } catch (err) {
      setCodeError(translateAuthError(err, t))
    } finally { setCodeLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundImage: 'linear-gradient(180deg, #1a1520 0%, #221c2a 50%, #1a1520 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[28px] p-8 sm:p-10 max-w-[480px] w-full backdrop-blur-xl border border-glass-soft shadow-card my-8"
        style={{ background: 'var(--bg-card)' }}
      >
        <motion.div className="text-center mb-5" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}>
          <LogoIcon size={48} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-2xl sm:text-3xl font-bold text-center mb-2 gradient-text">{t('auth.forgot.title')}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-muted-soft text-center mb-5">{t('auth.forgot.subtitle')}</motion.p>

        <Tabs
          value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth"
          sx={{
            mb: 3, minHeight: 40,
            '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #d4a857, #e8915a)', height: 3, borderRadius: 3 },
            '& .MuiTab-root': { color: '#8a7f76', fontSize: '0.8rem', fontWeight: 600, textTransform: 'none', minHeight: 40, px: 1 },
            '& .Mui-selected': { color: '#d4a857 !important' },
          }}
        >
          <Tab label={t('auth.forgot.tab.email')} />
          <Tab label={t('auth.forgot.tab.code')} />
        </Tabs>

        {/* ============ ВКЛАДКА 1: ссылка на email ============ */}
        {tab === 0 && (
          <motion.div key="tab-email" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
            <AnimatePresence mode="wait">
              {emailSuccess ? (
                <SuccessPanel key="ok" text={emailSuccess} />
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-xs text-muted-soft mb-3 leading-relaxed">{t('auth.forgot.email.hint')}</p>
                  <Alert severity="info" sx={{ mb: 2.5, fontSize: '0.78rem', py: 0.5 }}>{t('auth.forgot.email.limit')}</Alert>
                  <Box component="form" onSubmit={handleEmailSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField label={t('auth.email')} type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} sx={inputSx} />
                    <AnimatePresence mode="wait">
                      {emailError && (
                        <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          <Alert severity="error">{emailError}</Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <MuiButton type="submit" fullWidth variant="contained" disabled={emailLoading} sx={goldBtnSx}>
                      {emailLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : t('auth.reset.btn')}
                    </MuiButton>
                  </Box>
                  <button
                    type="button" onClick={() => { setCodeEmail(email); setTab(1) }}
                    className="w-full mt-3 text-xs text-center underline"
                    style={{ color: '#d4a857', background: 'none', border: 'none', cursor: 'pointer' }}
                  >{t('auth.forgot.tab.code')}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ============ ВКЛАДКА 2: код от администратора ============ */}
        {tab === 1 && (
          <motion.div key="tab-code" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
            <AnimatePresence mode="wait">
              {codeSuccess ? (
                <SuccessPanel key="ok" text={codeSuccess} />
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-xs text-muted-soft mb-3 leading-relaxed">{t('auth.forgot.code.hint')}</p>

                  {/* шаг A: запросить код */}
                  {codeStage === 'request' && (
                    <Box component="form" onSubmit={handleRequestCode} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <TextField label={t('auth.email')} type="email" autoComplete="email" required value={codeEmail} onChange={e => setCodeEmail(e.target.value)} sx={inputSx} />
                      <AnimatePresence mode="wait">
                        {codeError && (
                          <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            <Alert severity="error">{codeError}</Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <MuiButton type="submit" fullWidth variant="contained" disabled={codeLoading} sx={goldBtnSx}>
                        {codeLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : t('auth.forgot.code.request')}
                      </MuiButton>
                      <button
                        type="button" onClick={() => setCodeStage('enter')}
                        className="text-xs text-center underline"
                        style={{ color: '#d4a857', background: 'none', border: 'none', cursor: 'pointer' }}
                      >{t('auth.forgot.code.have')}</button>
                    </Box>
                  )}

                  {/* шаг B: ввести код и новый пароль */}
                  {codeStage === 'enter' && (
                    <Box component="form" onSubmit={handleCodeSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <AnimatePresence>
                        {codeInfo && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <Alert severity="success" sx={{ fontSize: '0.78rem', py: 0.5 }}>{codeInfo}</Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <MuiButton
                        component="a" href={waLink()} target="_blank" rel="noopener"
                        fullWidth variant="outlined"
                        startIcon={<WhatsAppIcon size={18} />}
                        sx={{
                          borderRadius: '999px', py: 1.2, textTransform: 'none', fontWeight: 600,
                          borderColor: 'rgba(37,211,102,0.5)', color: '#25D366',
                          '&:hover': { borderColor: '#25D366', background: 'rgba(37,211,102,0.08)' },
                        }}
                      >{t('auth.forgot.code.whatsapp')}</MuiButton>

                      <TextField label={t('auth.email')} type="email" autoComplete="email" required value={codeEmail} onChange={e => setCodeEmail(e.target.value)} sx={inputSx} />
                      <TextField
                        label={t('auth.forgot.code.label')} required value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        inputProps={{ inputMode: 'numeric', maxLength: 6, style: { letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 } }}
                        sx={inputSx}
                      />
                      <PasswordField
                        label={t('auth.password.new')} autoComplete="new-password" required
                        value={newPwd} onChange={e => setNewPwd(e.target.value)}
                        showLabel={t('auth.password.show')} hideLabel={t('auth.password.hide')}
                      />
                      <PasswordField
                        label={t('auth.password.confirm')} autoComplete="new-password" required
                        value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                        showLabel={t('auth.password.show')} hideLabel={t('auth.password.hide')}
                      />

                      <AnimatePresence mode="wait">
                        {codeError && (
                          <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            <Alert severity="error">{codeError}</Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <MuiButton type="submit" fullWidth variant="contained" disabled={codeLoading} sx={goldBtnSx}>
                        {codeLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : t('auth.forgot.code.submit')}
                      </MuiButton>
                      <button
                        type="button" onClick={() => { setCodeStage('request'); setCodeError(''); setCodeInfo('') }}
                        className="text-xs text-center underline"
                        style={{ color: '#8a7f76', background: 'none', border: 'none', cursor: 'pointer' }}
                      >{t('auth.forgot.code.request')}</button>
                    </Box>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col gap-2.5 mt-5 text-center">
          <Link to="/login" className="text-sm">{t('auth.have.account')}</Link>
        </motion.div>
        <Link to="/" className="block text-center mt-4 text-sm">{t('auth.back.home')}</Link>
      </motion.div>
    </div>
  )
}
