import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TextField, Card, CardContent, Typography, Button as MuiButton, Alert, Box } from '@mui/material'
import { supabase } from '../../lib/supabase.js'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(212,168,87,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#d4a857' },
  },
  '& .MuiInputLabel-root': { color: '#8a7f76' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#d4a857' },
}

export default function AdminContacts() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    setLoading(true)
    try { const { data } = await supabase.from('site_settings').select('*'); const obj = {}; (data || []).forEach(item => { obj[item.key] = item.value }); setSettings(obj) }
    catch {} finally { setLoading(false) }
  }

  async function saveSettings() {
    setSaved(false)
    try { for (const [key, value] of Object.entries(settings)) { await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }) }; setSaved(true); setTimeout(() => setSaved(false), 3000) } catch {}
  }

  const fields = [
    { key: 'whatsapp_number', label: 'WhatsApp Number' }, { key: 'instagram_url', label: 'Instagram URL' },
    { key: 'telegram_url', label: 'Telegram URL' }, { key: 'viber_url', label: 'Viber URL' },
    { key: 'address', label: 'Address' }, { key: 'map_url', label: 'Map URL' },
    { key: 'working_hours_ru', label: 'Working Hours (RU)' }, { key: 'working_hours_tj', label: 'Working Hours (TJ)' },
    { key: 'working_hours_en', label: 'Working Hours (EN)' },
    { key: 'wa_msg_ru', label: 'WhatsApp Auto-Message (RU)' }, { key: 'wa_msg_tj', label: 'WhatsApp Auto-Message (TJ)' },
    { key: 'wa_msg_en', label: 'WhatsApp Auto-Message (EN)' },
  ]

  if (loading) return <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>Loading settings...</Typography>

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Contact Settings</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map(f => (
              <Box key={f.key} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '200px 1fr' }, gap: 1.5, alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 500, color: '#c4b8ab' }}>{f.label}</Typography>
                <TextField value={settings[f.key] || ''} onChange={e => setSettings({ ...settings, [f.key]: e.target.value })} sx={inputSx} />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
      <MuiButton variant="contained" onClick={saveSettings} sx={{ alignSelf: 'flex-start', background: 'linear-gradient(135deg, #d4a857, #e8915a)', fontWeight: 600, borderRadius: '999px', px: 4 }}>Save Changes</MuiButton>
      {saved && <Alert severity="success">Settings saved!</Alert>}
    </motion.div>
  )
}
