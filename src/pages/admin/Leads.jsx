import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TextField, MenuItem, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box, Select } from '@mui/material'
import { supabase } from '../../lib/supabase.js'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(212,168,87,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#d4a857' },
  },
}

export default function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLeads() }, [])

  async function fetchLeads() {
    setLoading(true)
    try { const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false }); setLeads(data || []) }
    catch {} finally { setLoading(false) }
  }

  async function updateStatus(id, status) {
    try { await supabase.from('leads').update({ status }).eq('id', id); setLeads(leads.map(l => l.id === id ? { ...l, status } : l)) } catch {}
  }

  const filtered = leads.filter(l => {
    const matchSearch = l.name?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search)
    const matchStatus = filterStatus === 'all' || l.status === filterStatus
    return matchSearch && matchStatus
  })

  if (loading) return <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>Loading leads...</Typography>

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <TextField label="Search leads..." value={search} onChange={e => setSearch(e.target.value)} sx={{ ...inputSx, maxWidth: 400 }} />
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} size="small" sx={{ ...inputSx, maxWidth: 200, minWidth: 150 }}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </Box>
      {filtered.length === 0 ? (
        <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>No leads found</Typography>
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
              <Table size="small">
                <TableHead><TableRow>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Phone</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Message</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Status</TableCell>
                </TableRow></TableHead>
                <TableBody>
                  {filtered.map(l => (
                    <TableRow key={l.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                      <TableCell>{l.name}</TableCell>
                      <TableCell>{l.phone}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.message || '—'}</TableCell>
                      <TableCell>{new Date(l.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select value={l.status} onChange={e => updateStatus(l.id, e.target.value)} size="small" sx={{ ...inputSx, minWidth: 130, fontSize: '0.8rem' }}>
                          <MenuItem value="new">New</MenuItem>
                          <MenuItem value="in_progress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </TableCell>
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
