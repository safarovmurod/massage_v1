import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Typography, Button as MuiButton, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Box } from '@mui/material'
import { supabase } from '../../lib/supabase.js'

export default function AdminAnalytics() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    setLoading(true)
    try { const { data } = await supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(200); setEvents(data || []) }
    catch {} finally { setLoading(false) }
  }

  const eventTypes = ['all', 'page_view', 'whatsapp_click', 'instagram_click', 'form_submit', 'language_change', 'login', 'registration']
  const filtered = filter === 'all' ? events : events.filter(e => e.event_type === filter)
  const counts = eventTypes.slice(1).map(type => ({ type, count: events.filter(e => e.event_type === type).length }))

  if (loading) return <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>Loading analytics...</Typography>

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {counts.map(c => (
          <Grid item xs={12} sm={6} md={3} key={c.type}>
            <Card><CardContent>
              <Typography sx={{ fontSize: '0.8rem', color: '#8a7f76', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.type.replace('_', ' ')}</Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #d4a857, #e8915a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{c.count}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {eventTypes.map(t => (
          <MuiButton key={t} size="small" variant={filter === t ? 'contained' : 'outlined'} onClick={() => setFilter(t)}
            sx={filter === t
              ? { background: 'linear-gradient(135deg, #d4a857, #e8915a)', borderRadius: '999px', textTransform: 'capitalize' }
              : { borderColor: 'rgba(255,255,255,0.1)', color: '#c4b8ab', borderRadius: '999px', textTransform: 'capitalize', '&:hover': { borderColor: '#d4a857' } }}
          >{t.replace('_', ' ')}</MuiButton>
        ))}
      </Box>

      {filtered.length === 0 ? (
        <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>No events found</Typography>
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
              <Table size="small">
                <TableHead><TableRow>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Event Type</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Page</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Data</TableCell>
                </TableRow></TableHead>
                <TableBody>
                  {filtered.slice(0, 50).map(e => (
                    <TableRow key={e.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                      <TableCell><Chip label={e.event_type} size="small" sx={{ bgcolor: 'rgba(37,211,102,0.15)', color: '#25D366' }} /></TableCell>
                      <TableCell>{e.page_url}</TableCell>
                      <TableCell>{new Date(e.created_at).toLocaleString()}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{JSON.stringify(e.event_data) || '—'}</TableCell>
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
