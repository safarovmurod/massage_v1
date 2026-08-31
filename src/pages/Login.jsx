import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TextField, Button as MuiButton, Box, Alert, CircularProgress } from '@mui/material'
import { useLang } from '../contexts/LanguageContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { LogoIcon } from '../components/icons/Icons.jsx'
import PasswordField from '../components/common/PasswordField.jsx'
import { trackAuthEvent } from '../lib/analytics.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
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

export default function Login() {
  const { t } = useLang()
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (user) navigate('/admin') }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      trackAuthEvent('login')
      navigate('/admin')
    } catch (err) {
      setError(translateAuthError(err, t))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundImage: 'linear-gradient(180deg, #1a1520 0%, #221c2a 50%, #1a1520 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[28px] p-10 max-w-[440px] w-full backdrop-blur-xl border border-glass-soft shadow-card"
        style={{ background: 'var(--bg-card)' }}
      >
        <motion.div
          className="text-center mb-6"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <LogoIcon size={56} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="text-3xl font-bold text-center mb-2 gradient-text"
        >{t('auth.login')}</motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-sm text-muted-soft text-center mb-7"
        >{t('auth.login.subtitle')}</motion.p>

        <AnimatePresence>
          {!isSupabaseConfigured() && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Alert severity="error" sx={{ mb: 2 }}>{t('auth.error.notConfigured')}</Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <TextField label={t('auth.email')} type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} sx={inputSx} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <PasswordField
              label={t('auth.password')} autoComplete="current-password" required
              value={password} onChange={e => setPassword(e.target.value)}
              showLabel={t('auth.password.show')} hideLabel={t('auth.password.hide')}
            />
          </motion.div>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Alert severity="error">{error}</Alert>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <MuiButton
              type="submit" fullWidth variant="contained" disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #d4a857, #e8915a)', fontWeight: 600, borderRadius: '999px', py: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': { background: 'linear-gradient(135deg, #e8c178, #e8915a)', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(212,168,87,0.35)' },
                '&.Mui-disabled': { background: 'linear-gradient(135deg, rgba(212,168,87,0.5), rgba(232,145,90,0.5))', color: 'rgba(255,255,255,0.7)' },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : t('auth.login.btn')}
            </MuiButton>
          </motion.div>
        </Box>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex flex-col gap-2.5 mt-5 text-center">
          <Link to="/forgot-password" className="text-sm">{t('auth.forgot')}</Link>
          <Link to="/register" className="text-sm">{t('auth.no.account')}</Link>
        </motion.div>
        <Link to="/" className="block text-center mt-4 text-sm">{t('auth.back.home')}</Link>
      </motion.div>
    </div>
  )
}
