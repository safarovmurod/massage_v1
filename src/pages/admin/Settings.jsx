import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TextField, Card, CardContent, Typography, Button as MuiButton, Alert, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'
import PasswordField from '../../components/common/PasswordField.jsx'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(212,168,87,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#d4a857' },
  },
  '& .MuiInputLabel-root': { color: '#8a7f76' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#d4a857' },
}

export default function AdminSettings() {
  const { user, profile, updatePassword, signOut } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchActivity() }, [])

  async function fetchActivity() {
    setLoading(true)
    try { const { data } = await supabase.from('admin_activity').select('*').order('created_at', { ascending: false }).limit(20); setActivity(data || []) }
    catch {} finally { setLoading(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault(); setMsg('')
    if (newPassword.length < 6) { setMsg('Password must be at least 6 characters'); return }
    try { await updatePassword(newPassword); setMsg('Password updated successfully!'); setNewPassword('') }
    catch (err) { setMsg(err.message) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Card><CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Admin Profile</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Name" value={profile?.full_name || ''} InputProps={{ readOnly: true }} sx={inputSx} />
            <TextField label="Email" value={user?.email || ''} InputProps={{ readOnly: true }} sx={inputSx} />
            <TextField label="Role" value={profile?.role || ''} InputProps={{ readOnly: true }} sx={inputSx} />
          </Box>
        </CardContent></Card>

        <Card><CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Change Password</Typography>
          <Box component="form" onSubmit={handleChangePassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <PasswordField label="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} sx={inputSx} />
            <MuiButton type="submit" variant="contained" sx={{ alignSelf: 'flex-start', background: 'linear-gradient(135deg, #d4a857, #e8915a)', fontWeight: 600, borderRadius: '999px', px: 4 }}>Update Password</MuiButton>
          </Box>
          {msg && <Alert severity={msg.includes('success') ? 'success' : 'error'} sx={{ mt: 2 }}>{msg}</Alert>}
        </CardContent></Card>

        <Card><CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Admin Activity Log</Typography>
          {loading ? <Typography>Loading...</Typography> : activity.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 4, color: '#8a7f76' }}>No activity logged</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
              <Table size="small">
                <TableHead><TableRow><TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Action</TableCell><TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Date</TableCell></TableRow></TableHead>
                <TableBody>{activity.map(a => (<TableRow key={a.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}><TableCell>{a.action}</TableCell><TableCell>{new Date(a.created_at).toLocaleString()}</TableCell></TableRow>))}</TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent></Card>

        <MuiButton variant="outlined" onClick={() => signOut()} sx={{ alignSelf: 'flex-start', borderColor: 'rgba(255,255,255,0.1)', color: '#c4b8ab', borderRadius: '999px', px: 4, '&:hover': { borderColor: '#d4a857', color: '#d4a857' } }}>Secure Logout</MuiButton>
      </Box>
    </motion.div>
  )
}
