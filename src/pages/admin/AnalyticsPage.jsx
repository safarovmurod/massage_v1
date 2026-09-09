import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Card, CardContent, Typography, Button as MuiButton, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Box, Avatar,
} from '@mui/material'
import { supabase } from '../../lib/supabase.js'

const goldText = {
  fontSize: '2rem', fontWeight: 700,
  background: 'linear-gradient(135deg, #d4a857, #e8915a)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
}
const headCell = { color: '#8a7f76', fontWeight: 600 }

// Как показывать источник перехода
const sourceLabels = {
  instagram: { label: 'Instagram', color: '#e1306c' },
  whatsapp: { label: 'WhatsApp', color: '#25D366' },
  telegram: { label: 'Telegram', color: '#2AABEE' },
  facebook: { label: 'Facebook', color: '#1877F2' },
  google: { label: 'Google', color: '#4285F4' },
  yandex: { label: 'Яндекс', color: '#FC3F1D' },
  direct: { label: 'Прямой заход', color: '#d4a857' },
}

// Названия событий по-русски
const eventLabels = {
  all: 'Все',
  page_view: 'Просмотры',
  whatsapp_click: 'WhatsApp',
  instagram_click: 'Instagram',
  form_submit: 'Заявки',
  language_change: 'Смена языка',
  login: 'Входы',
  registration: 'Регистрации',
}

function eventLabel(type) {
  return eventLabels[type] || type
}

function sourceView(source) {
  return sourceLabels[source] || { label: source || 'Неизвестно', color: '#8a7f76' }
}

function formatDate(value) {
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminAnalytics() {
  const [events, setEvents] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [eventsRes, profilesRes] = await Promise.all([
        supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(1000),
        supabase.from('profiles').select('id, email, full_name, first_name, last_name'),
      ])
      setEvents(eventsRes.data || [])
      setProfiles(profilesRes.data || [])
    } catch {
      /* пустой список покажет «нет данных» */
    } finally {
      setLoading(false)
    }
  }

  function personName(userId) {
    const person = profiles.find(p => p.id === userId)
    if (!person) return null
    const fromParts = [person.first_name, person.last_name].filter(Boolean).join(' ')
    return person.full_name || fromParts || person.email
  }

  const pageViews = events.filter(e => e.event_type === 'page_view')

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 6)

  const viewsToday = pageViews.filter(e => new Date(e.created_at) >= todayStart).length
  const viewsWeek = pageViews.filter(e => new Date(e.created_at) >= weekStart).length

  // Уникальные люди: считаем по visitor_id (у старых записей его нет)
  const uniqueVisitors = new Set(pageViews.map(e => e.visitor_id).filter(Boolean)).size

  const cards = [
    { title: 'Всего просмотров', value: pageViews.length },
    { title: 'Уникальных посетителей', value: uniqueVisitors },
    { title: 'Сегодня', value: viewsToday },
    { title: 'За 7 дней', value: viewsWeek },
  ]

  // --- Откуда приходят ---
  const sourceMap = {}
  pageViews.forEach(e => {
    const key = e.source || 'direct'
    if (!sourceMap[key]) sourceMap[key] = { views: 0, visitors: new Set() }
    sourceMap[key].views += 1
    if (e.visitor_id) sourceMap[key].visitors.add(e.visitor_id)
  })
  const sources = Object.keys(sourceMap)
    .map(key => ({ key, views: sourceMap[key].views, visitors: sourceMap[key].visitors.size }))
    .sort((a, b) => b.views - a.views)

  // --- Кто заходил ---
  const visitorMap = {}
  pageViews.forEach(e => {
    const key = e.visitor_id || e.id
    if (!visitorMap[key]) {
      visitorMap[key] = { key, views: 0, userId: null, source: e.source, last: e.created_at, pages: new Set() }
    }
    const row = visitorMap[key]
    row.views += 1
    if (e.user_id) row.userId = e.user_id
    if (e.page_url) row.pages.add(e.page_url)
    if (new Date(e.created_at) > new Date(row.last)) row.last = e.created_at
  })
  const visitors = Object.values(visitorMap).sort((a, b) => new Date(b.last) - new Date(a.last))

  const eventTypes = ['all', 'page_view', 'whatsapp_click', 'instagram_click', 'form_submit', 'language_change', 'login', 'registration']
  const filtered = filter === 'all' ? events : events.filter(e => e.event_type === filter)

  if (loading) return <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>Загрузка статистики…</Typography>

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Цифры */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {cards.map(card => (
          <Grid item xs={6} md={3} key={card.title}>
            <Card><CardContent>
              <Typography sx={{ fontSize: '0.78rem', color: '#8a7f76', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.title}
              </Typography>
              <Typography sx={goldText}>{card.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      {/* Откуда пришли */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#f5ede4', mb: 2 }}>
            Откуда приходят люди
          </Typography>
          {sources.length === 0 ? (
            <Typography sx={{ color: '#8a7f76', fontSize: '0.9rem' }}>Пока нет данных о переходах.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {sources.map(item => {
                const view = sourceView(item.key)
                const percent = Math.round((item.views / pageViews.length) * 100)
                return (
                  <Box key={item.key}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontSize: '0.88rem', color: view.color, fontWeight: 600 }}>{view.label}</Typography>
                      <Typography sx={{ fontSize: '0.82rem', color: '#c4b8ab' }}>
                        {item.visitors} чел. · {item.views} просмотров · {percent}%
                      </Typography>
                    </Box>
                    <Box sx={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${percent}%`, background: view.color, opacity: 0.85 }} />
                    </Box>
                  </Box>
                )
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Кто заходил */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ pb: 0 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#f5ede4', mb: 0.5 }}>
            Кто заходил на сайт
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#8a7f76', mb: 2 }}>
            Имя видно у тех, кто вошёл в аккаунт. Остальные — гости: имя и Instagram посетителя
            браузер сайту не передаёт, виден только источник перехода.
          </Typography>
        </CardContent>
        <CardContent sx={{ p: 0 }}>
          {visitors.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 4, color: '#8a7f76' }}>Пока никто не заходил.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
              <Table size="small">
                <TableHead><TableRow>
                  <TableCell sx={headCell}>Посетитель</TableCell>
                  <TableCell sx={headCell}>Откуда</TableCell>
                  <TableCell sx={headCell}>Просмотров</TableCell>
                  <TableCell sx={headCell}>Страниц</TableCell>
                  <TableCell sx={headCell}>Последний визит</TableCell>
                </TableRow></TableHead>
                <TableBody>
                  {visitors.slice(0, 50).map(row => {
                    const name = row.userId ? personName(row.userId) : null
                    const view = sourceView(row.source)
                    return (
                      <TableRow key={row.key} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Avatar sx={{
                              width: 30, height: 30, fontSize: '0.8rem',
                              background: name ? 'linear-gradient(135deg, #d4a857, #e8915a)' : 'rgba(255,255,255,0.08)',
                              color: name ? '#fff' : '#8a7f76',
                            }}>
                              {(name || 'Г').charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.85rem', color: '#f5ede4' }}>
                                {name || 'Гость'}
                              </Typography>
                              {!name && (
                                <Typography sx={{ fontSize: '0.7rem', color: '#8a7f76' }}>
                                  {String(row.key).slice(0, 10)}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={view.label} size="small"
                            sx={{ bgcolor: `${view.color}22`, color: view.color, fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ color: '#c4b8ab' }}>{row.views}</TableCell>
                        <TableCell sx={{ color: '#c4b8ab' }}>{row.pages.size}</TableCell>
                        <TableCell sx={{ color: '#c4b8ab' }}>{formatDate(row.last)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Все события */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {eventTypes.map(type => (
          <MuiButton key={type} size="small" variant={filter === type ? 'contained' : 'outlined'} onClick={() => setFilter(type)}
            sx={filter === type
              ? { background: 'linear-gradient(135deg, #d4a857, #e8915a)', borderRadius: '999px', textTransform: 'none' }
              : { borderColor: 'rgba(255,255,255,0.1)', color: '#c4b8ab', borderRadius: '999px', textTransform: 'none', '&:hover': { borderColor: '#d4a857' } }}
          >{eventLabel(type)}</MuiButton>
        ))}
      </Box>

      {filtered.length === 0 ? (
        <Typography sx={{ textAlign: 'center', py: 6, color: '#8a7f76' }}>Событий нет</Typography>
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
              <Table size="small">
                <TableHead><TableRow>
                  <TableCell sx={headCell}>Событие</TableCell>
                  <TableCell sx={headCell}>Кто</TableCell>
                  <TableCell sx={headCell}>Откуда</TableCell>
                  <TableCell sx={headCell}>Страница</TableCell>
                  <TableCell sx={headCell}>Дата</TableCell>
                </TableRow></TableHead>
                <TableBody>
                  {filtered.slice(0, 60).map(event => {
                    const name = event.user_id ? personName(event.user_id) : null
                    const view = sourceView(event.source)
                    return (
                      <TableRow key={event.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell>
                          <Chip label={eventLabel(event.event_type)} size="small"
                            sx={{ bgcolor: 'rgba(212,168,87,0.15)', color: '#d4a857' }} />
                        </TableCell>
                        <TableCell sx={{ color: '#c4b8ab' }}>{name || 'Гость'}</TableCell>
                        <TableCell sx={{ color: view.color }}>{view.label}</TableCell>
                        <TableCell sx={{ color: '#c4b8ab' }}>{event.page_url}</TableCell>
                        <TableCell sx={{ color: '#c4b8ab' }}>{formatDate(event.created_at)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
