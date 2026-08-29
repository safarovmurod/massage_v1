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

export default function AdminContent() {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchContent() }, [])

  async function fetchContent() {
    setLoading(true)
    try { const { data } = await supabase.from('site_content').select('*'); const obj = {}; (data || []).forEach(item => { obj[item.key] = item.value }); setContent(obj) }
    catch {} finally { setLoading(false) }
  }

  async function saveContent() {
    setSaved(false)
    try { for (const [key, value] of Object.entries(content)) { await supabase.from('site_content').upsert({ key, value, updated_at: new Date().toISOString() }) }; setSaved(true); setTimeout(() => setSaved(false), 3000) } catch {}
  }

  const sections = [
    { title: 'Hero Section', fields: [
      { key: 'hero_title_ru', label: 'Hero Title (RU)' }, { key: 'hero_title_tj', label: 'Hero Title (TJ)' }, { key: 'hero_title_en', label: 'Hero Title (EN)' },
      { key: 'hero_subtitle_ru', label: 'Hero Subtitle (RU)' }, { key: 'hero_price_home', label: 'Home Visit Price' },
    ]},
    { title: 'Pricing', fields: [
      { key: 'price_home_visit', label: 'Home Visit Fee (somoni)' }, { key: 'price_prepayment', label: 'Prepayment (somoni)' },
    ]},
    { title: 'Benefits', fields: [
      { key: 'benefit_1_ru', label: 'Benefit 1 (RU)' }, { key: 'benefit_2_ru', label: 'Benefit 2 (RU)' },
      { key: 'benefit_3_ru', label: 'Benefit 3 (RU)' }, { key: 'benefit_4_ru', label: 'Benefit 4 (RU)' },
      { key: 'benefit_5_ru', label: 'Benefit 5 (RU)' }, { key: 'benefit_6_ru', label: 'Benefit 6 (RU)' },
    ]},
  ]

  if (loading) return <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>Loading content...</Typography>

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {sections.map((section, si) => (
          <Card key={si}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>{section.title}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.fields.map(f => (
                  <Box key={f.key} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '200px 1fr' }, gap: 1.5, alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 500, color: '#c4b8ab' }}>{f.label}</Typography>
                    <TextField value={content[f.key] || ''} onChange={e => setContent({ ...content, [f.key]: e.target.value })} sx={inputSx} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
        <MuiButton variant="contained" onClick={saveContent} sx={{ alignSelf: 'flex-start', background: 'linear-gradient(135deg, #d4a857, #e8915a)', fontWeight: 600, borderRadius: '999px', px: 4 }}>Save Changes</MuiButton>
        {saved && <Alert severity="success">Content saved successfully!</Alert>}
      </Box>
    </motion.div>
  )
}
