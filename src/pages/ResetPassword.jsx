import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TextField, Button as MuiButton, Alert, Box } from '@mui/material'
import { useAuth } from '../contexts/AuthContext.jsx'
import { LogoIcon } from '../components/icons/Icons.jsx'
export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('')
    if (password.length < 6) { setError('Min 6 chars'); return }
    if (password !== confirm) { setError('Mismatch'); return }
    setLoading(true)
    try { await updatePassword(password); setSuccess('OK!'); setTimeout(() => navigate('/login'), 2000) }
    catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  const inputSx = { '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&.Mui-focused fieldset': { borderColor: '#d4a857' } }, '& .MuiInputLabel-root': { color: '#8a7f76' } }
  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: 'linear-gradient(180deg,#1a1520,#221c2a,#1a1520)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-md p-10">
        <div className="text-center mb-6"><LogoIcon size={48} /></div>
        <h1 className="text-2xl font-bold text-center mb-5">Новый пароль</h1>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Новый пароль" type="password" required value={password} onChange={e => setPassword(e.target.value)} sx={inputSx} />
          <TextField label="Подтвердите" type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} sx={inputSx} />
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <MuiButton type="submit" variant="contained" size="large" disabled={loading} sx={{ background: 'linear-gradient(135deg,#d4a857,#e8915a)', borderRadius: '999px', py: 1.5 }}>{loading ? '...' : 'Сохранить'}</MuiButton>
        </Box>
        <div className="mt-5 text-center"><Link to="/login" style={{ color: '#d4a857', fontSize: '0.875rem' }}>← Вход</Link></div>
      </motion.div>
    </div>
  )
}
