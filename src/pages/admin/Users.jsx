import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TextField, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box } from '@mui/material'
import { supabase } from '../../lib/supabase.js'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(212,168,87,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#d4a857' },
  },
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    try { const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }); setUsers(data || []) }
    catch {} finally { setLoading(false) }
  }

  const filtered = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>Loading users...</Typography>

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <TextField label="Search users..." value={search} onChange={e => setSearch(e.target.value)} sx={{ ...inputSx, mb: 2, maxWidth: 400 }} />
      {filtered.length === 0 ? (
        <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>No users found</Typography>
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
              <Table size="small">
                <TableHead><TableRow>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Last Login</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Status</TableCell>
                </TableRow></TableHead>
                <TableBody>
                  {filtered.map(u => (
                    <TableRow key={u.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                      <TableCell>{u.full_name || '—'}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell><Chip label={u.role} size="small" sx={{ bgcolor: u.role === 'admin' ? 'rgba(138,127,118,0.15)' : 'rgba(37,211,102,0.15)', color: u.role === 'admin' ? '#8a7f76' : '#25D366' }} /></TableCell>
                      <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{u.last_login ? new Date(u.last_login).toLocaleDateString() : '—'}</TableCell>
                      <TableCell><Box component="span" sx={{ fontSize: '1rem' }}>{u.last_login ? '🟢' : '⚪'}</Box></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
