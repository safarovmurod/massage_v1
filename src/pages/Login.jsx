import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TextField, Button as MuiButton, Box, Alert } from '@mui/material'
import { useLang } from '../contexts/LanguageContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { LogoIcon } from '../components/icons/Icons.jsx'
import { trackAuthEvent } from '../lib/analytics.js'
import { isSupabaseConfigured } from '../lib/supabase.js'

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
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundImage: 'linear-gradient(180deg, #1a1520 0%, #221c2a 50%, #1a1520 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
        className="rounded-[28px] p-10 max-w-[440px] w-full backdrop-blur-xl border border-glass-soft shadow-card"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="text-center mb-6"><LogoIcon size={56} /></div>
        <h1 className="text-3xl font-bold text-center mb-2 gradient-text">{t('auth.login')}</h1>
        <p className="text-sm text-muted-soft text-center mb-7">{t('auth.login.subtitle')}</p>
        {!isSupabaseConfigured() && <Alert severity="error" sx={{ mb: 2 }}>Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label={t('auth.email')} type="email" required value={email} onChange={e => setEmail(e.target.value)} sx={inputSx} />
          <TextField label={t('auth.password')} type="password" required value={password} onChange={e => setPassword(e.target.value)} sx={inputSx} />
          {error && <Alert severity="error">{error}</Alert>}
          <MuiButton type="submit" variant="contained" disabled={loading} sx={{ background: 'linear-gradient(135deg, #d4a857, #e8915a)', fontWeight: 600, borderRadius: '999px', py: 1.5, '&:hover': { background: 'linear-gradient(135deg, #e8c178, #e8915a)' } }}>
            {loading ? '...' : t('auth.login.btn')}
          </MuiButton>
        </Box>
        <div className="flex flex-col gap-2.5 mt-5 text-center">
          <Link to="/forgot-password" className="text-sm">{t('auth.forgot')}</Link>
          <Link to="/register" className="text-sm">{t('auth.no.account')}</Link>
        </div>
        <Link to="/" className="block text-center mt-4 text-sm">{t('auth.back.home')}</Link>
      </motion.div>
    </div>
  )
}
