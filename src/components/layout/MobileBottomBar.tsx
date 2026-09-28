import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Button, Drawer, IconButton, Stack, Typography, Divider } from '@mui/material'
import { HomeRounded, SpaRounded, WhatsApp, MenuRounded, CloseRounded, AdminPanelSettingsRounded, LightModeRounded, DarkModeRounded } from '@mui/icons-material'
import { useLang } from '../../contexts/LanguageContext.tsx'
import { useTheme } from '../../contexts/ThemeContext.tsx'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { getWhatsAppLink } from './Header.tsx'
import { trackWhatsAppClick } from '../../lib/analytics.ts'
import { LogoIcon } from '../icons/Icons.tsx'

export default function MobileBottomBar() {
  const [open, setOpen] = useState(false)
  const { lang, changeLang, t } = useLang()
  const { theme, toggleTheme } = useTheme()
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const isAdmin = profile?.role === 'admin' && profile?.is_active === true
  useEffect(() => { setOpen(false) }, [location])

  const links = [
    { to: '/', label: t('mobile.home'), icon: HomeRounded },
    { to: '/#services', label: t('mobile.services'), icon: SpaRounded },
  ]

  function handleNavigate(to) {
    if (location.pathname + location.hash !== to) return
    if (to.includes('#')) document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Box component="nav" aria-label="Мобильная навигация" sx={{
        display: 'flex', '@media (min-width: 1024px)': { display: 'none' }, position: 'fixed', zIndex: 1200,
        bottom: 'max(12px, env(safe-area-inset-bottom))', left: '12px', right: '12px',
        gap: '4px', padding: '8px', borderRadius: '24px',
        background: 'var(--header-bg)', border: '1px solid #d4a85755', backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px #00000033', animation: 'nav-enter 450ms ease-out both',
      }}>
        {links.map(item => {
          const active = location.pathname + location.hash === item.to
          const ItemIcon = item.icon
          return <Button key={item.to} component={Link} to={item.to} onClick={() => handleNavigate(item.to)}
            aria-current={active ? 'page' : undefined}
            sx={{ flex: 1, minWidth: '0px', flexDirection: 'column', gap: '3px', padding: '8px 2px', borderRadius: '18px',
              color: active ? '#1a1520' : 'var(--text-secondary)', background: active ? '#d4a857' : 'transparent', fontSize: '10px' }}>
            <ItemIcon sx={{ fontSize: '22px' }} />{item.label}
          </Button>
        })}
        <Button component="a" href={getWhatsAppLink(lang)} target="_blank" rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('mobile')} sx={{ flex: 1, minWidth: '0px', flexDirection: 'column', gap: '3px', padding: '8px 2px', color: '#25d366', fontSize: '10px' }}>
          <WhatsApp sx={{ fontSize: '22px' }} />WhatsApp
        </Button>
        <Button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu"
          sx={{ flex: 1, minWidth: '0px', flexDirection: 'column', gap: '3px', padding: '8px 2px', color: 'var(--text-primary)', fontSize: '10px' }}>
          <MenuRounded sx={{ fontSize: '22px' }} />{lang === 'en' ? 'Menu' : 'Меню'}
        </Button>
      </Box>
      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}
        sx={{ '@media (min-width: 1024px)': { display: 'none' } }}
        PaperProps={{ id: 'mobile-menu', sx: { maxHeight: '85dvh', padding: '24px', paddingBottom: 'max(24px, env(safe-area-inset-bottom))', borderRadius: '28px 28px 0 0', background: 'var(--bg-secondary)', color: 'var(--text-primary)' } }}>
        <Stack direction="row" alignItems="center" gap="12px" sx={{ mb: '20px' }}>
          <LogoIcon size={32} /><Typography sx={{ flex: 1, fontWeight: 700 }}>{t('brand.name')}</Typography>
          <IconButton aria-label="Закрыть меню" onClick={() => setOpen(false)} sx={{ color: 'var(--text-primary)' }}><CloseRounded /></IconButton>
        </Stack>
        <Stack gap="12px">
          {isAdmin && <Button component={Link} to="/admin" variant="contained" startIcon={<AdminPanelSettingsRounded />} sx={{ padding: '14px', borderRadius: '14px', fontWeight: 700 }}>Открыть админ-панель</Button>}
          <Button component={Link} to="/contact" variant="outlined" sx={{ padding: '12px', borderRadius: '14px' }}>{t('mobile.contacts')}</Button>
          {user ? <>
            <Typography sx={{ fontSize: '14px', overflowWrap: 'anywhere' }}>{profile?.full_name || user.email}</Typography>
            <Button onClick={async () => { await signOut(); setOpen(false) }}>{t('nav.logout')}</Button>
          </> : <Stack direction="row" gap="12px">
            <Button fullWidth component={Link} to="/login" variant="outlined">{t('nav.login')}</Button>
            <Button fullWidth component={Link} to="/register" variant="outlined">{t('nav.register')}</Button>
          </Stack>}
          <Divider />
          <Stack direction="row" gap="8px" alignItems="center">
            {['ru', 'tj', 'en'].map(value => <Button key={value} onClick={() => changeLang(value)} variant={lang === value ? 'contained' : 'outlined'} aria-pressed={lang === value}>{value.toUpperCase()}</Button>)}
            <IconButton onClick={toggleTheme} aria-label="Сменить тему" sx={{ ml: 'auto', color: '#d4a857' }}>{theme === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}</IconButton>
          </Stack>
        </Stack>
      </Drawer>
    </>
  )
}
