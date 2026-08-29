import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Chip } from '@mui/material'
import { supabase } from '../../lib/supabase.js'
import { UsersIcon, ChartIcon, WhatsAppIcon, InstagramIcon, LeadsIcon } from '../../components/icons/Icons.jsx'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, newToday: 0, newMonth: 0, totalVisits: 0, whatsappClicks: 0, instagramClicks: 0, formSubmits: 0, onlineNow: 0 })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentLeads, setRecentLeads] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  async function fetchStats() {
    setLoading(true)
    try {
      const [users, leads, events] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(500)
      ])
      const allUsers = users.data || []
      const now = new Date()
      const today = new Date(now.setHours(0, 0, 0, 0))
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
      const newToday = allUsers.filter(u => new Date(u.created_at) >= today).length
      const newMonth = allUsers.filter(u => new Date(u.created_at) >= monthAgo).length
      const allEvents = events.data || []
      const pageViews = allEvents.filter(e => e.event_type === 'page_view').length
      const waClicks = allEvents.filter(e => e.event_type === 'whatsapp_click').length
      const igClicks = allEvents.filter(e => e.event_type === 'instagram_click').length
      const formSubs = allEvents.filter(e => e.event_type === 'form_submit').length
      const days = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0)
        const next = new Date(d); next.setDate(d.getDate() + 1)
        const dayEvents = allEvents.filter(e => { const ed = new Date(e.created_at); return ed >= d && ed < next })
        days.push({ name: d.toLocaleDateString('ru', { weekday: 'short' }), visits: dayEvents.filter(e => e.event_type === 'page_view').length, clicks: dayEvents.filter(e => e.event_type === 'whatsapp_click').length })
      }
      setStats({ totalUsers: allUsers.length, newToday, newMonth, totalVisits: pageViews, whatsappClicks: waClicks, instagramClicks: igClicks, formSubmits: formSubs, onlineNow: 1 })
      setRecentUsers(allUsers.slice(0, 5))
      setRecentLeads(leads.data || [])
      setChartData(days)
    } catch {} finally { setLoading(false) }
  }

  if (loading) return <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>Loading dashboard...</Typography>

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: UsersIcon },
    { label: 'New Today', value: stats.newToday, icon: UsersIcon },
    { label: 'New This Month', value: stats.newMonth, icon: UsersIcon },
    { label: 'Page Views', value: stats.totalVisits, icon: ChartIcon },
    { label: 'WhatsApp Clicks', value: stats.whatsappClicks, icon: WhatsAppIcon },
    { label: 'Instagram Clicks', value: stats.instagramClicks, icon: InstagramIcon },
    { label: 'Form Submissions', value: stats.formSubmits, icon: LeadsIcon },
    { label: 'Online Now', value: stats.onlineNow, icon: UsersIcon },
  ]

  return (
    <div>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statCards.map((s, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card sx={{ '&:hover': { borderColor: '#d4a857', transform: 'translateY(-2px)' }, transition: 'all 0.3s' }}>
                <CardContent>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4a857', mb: 1.5 }}><s.icon width={22} height={22} /></Box>
                  <Typography sx={{ fontSize: '0.8rem', color: '#8a7f76', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #d4a857, #e8915a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Daily Activity (Last 7 Days)</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, height: 200, alignItems: 'flex-end', mt: 2 }}>
            {chartData.map((d, i) => (
              <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: 160 }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: Math.max(4, d.visits * 10) }} transition={{ delay: i * 0.1, duration: 0.5 }}
                    style={{ width: 20, background: '#d4a857', borderRadius: '4px 4px 0 0' }} title={`Visits: ${d.visits}`} />
                  <motion.div initial={{ height: 0 }} animate={{ height: Math.max(4, d.clicks * 10) }} transition={{ delay: i * 0.1 + 0.1, duration: 0.5 }}
                    style={{ width: 20, background: '#e8915a', borderRadius: '4px 4px 0 0' }} title={`Clicks: ${d.clicks}`} />
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#8a7f76' }}>{d.name}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 1.5, fontSize: '0.8rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, background: '#d4a857', borderRadius: 0.75 }} /> Visits</Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, background: '#e8915a', borderRadius: 0.75 }} /> WhatsApp Clicks</Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Latest Registrations</Typography>
              {recentUsers.length === 0 ? <Typography sx={{ textAlign: 'center', py: 4, color: '#8a7f76' }}>No users yet</Typography> : (
                <TableContainer component={Paper} sx={{ background: 'transparent' }}>
                  <Table size="small">
                    <TableHead><TableRow><TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Name</TableCell><TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Email</TableCell><TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Date</TableCell></TableRow></TableHead>
                    <TableBody>{recentUsers.map(u => (<TableRow key={u.id}><TableCell>{u.full_name || '—'}</TableCell><TableCell>{u.email}</TableCell><TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell></TableRow>))}</TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Latest Leads</Typography>
              {recentLeads.length === 0 ? <Typography sx={{ textAlign: 'center', py: 4, color: '#8a7f76' }}>No leads yet</Typography> : (
                <TableContainer component={Paper} sx={{ background: 'transparent' }}>
                  <Table size="small">
                    <TableHead><TableRow><TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Name</TableCell><TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Phone</TableCell><TableCell sx={{ color: '#8a7f76', fontWeight: 600 }}>Status</TableCell></TableRow></TableHead>
                    <TableBody>{recentLeads.map(l => (<TableRow key={l.id}><TableCell>{l.name}</TableCell><TableCell>{l.phone}</TableCell><TableCell><Chip label={l.status} size="small" sx={{ bgcolor: l.status === 'new' ? 'rgba(37,211,102,0.15)' : l.status === 'in_progress' ? 'rgba(212,168,87,0.15)' : 'rgba(138,127,118,0.15)', color: l.status === 'new' ? '#25D366' : l.status === 'in_progress' ? '#d4a857' : '#8a7f76' }} /></TableCell></TableRow>))}</TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
