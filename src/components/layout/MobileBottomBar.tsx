import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material'
import { HomeRounded, SpaRounded, WhatsApp, MenuRounded, CloseRounded, AdminPanelSettingsRounded, LightModeRounded, DarkModeRounded, ArrowForwardRounded, LogoutRounded } from '@mui/icons-material'
import { useLang } from '../../contexts/LanguageContext.tsx'
import { useTheme } from '../../contexts/ThemeContext.tsx'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { getWhatsAppLink } from './Header.tsx'
import { trackWhatsAppClick, trackLanguageChange } from '../../lib/analytics.ts'

const copy = {
  ru: { menu: 'Меню', caption: 'Баночный массаж', book: 'Записаться на массаж', account: 'Ваш аккаунт', preferences: 'Язык и оформление', theme: 'Сменить тему', close: 'Закрыть меню', admin: 'Управление сайтом' },
  tj: { menu: 'Меню', caption: 'Массажи бонкагӣ', book: 'Ба массаж нависед', account: 'Аккаунти шумо', preferences: 'Забон ва намуди сайт', theme: 'Иваз кардани намуди сайт', close: 'Пӯшидани меню', admin: 'Идоракунии сайт' },
  en: { menu: 'Explore', caption: 'Cupping massage', book: 'Book a massage', account: 'Your account', preferences: 'Language & appearance', theme: 'Change theme', close: 'Close menu', admin: 'Manage website' },
}

export default function MobileBottomBar() {
  const [open, setOpen] = useState(false)
  const { lang, changeLang, t } = useLang()
  const { theme, toggleTheme } = useTheme()
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const text = copy[lang]
  const isAdmin = profile?.role === 'admin' && profile?.is_active === true
  const dark = theme === 'dark'
  const colors = dark
    ? { background: '#1d1d1b', surface: '#282824', text: '#f5f1e8', muted: '#b7b4aa', line: '#ffffff1a', accent: '#d7bd88' }
    : { background: '#f7f4ee', surface: '#eeebe3', text: '#292b25', muted: '#64675d', line: '#292b251c', accent: '#6a5934' }
  const accountName = profile?.full_name || user?.user_metadata?.full_name || user?.email || ''
  useEffect(() => { setOpen(false) }, [location])

  const links = [
    { to: '/', label: t('mobile.home'), icon: HomeRounded },
    { to: '/#services', label: t('mobile.services'), icon: SpaRounded },
  ]
  const menuLinks = [
    ...links,
    { to: '/#pricing', label: t('nav.prices') },
    { to: '/contact', label: t('mobile.contacts') },
  ]
  const dockButton = {
    flex: 1, minWidth: '0px', minHeight: '58px', flexDirection: 'column', gap: '4px',
    px: '2px', py: '8px', borderRadius: '12px', color: colors.muted, fontSize: '11px',
    lineHeight: 1.2, fontWeight: 500, textTransform: 'none', '&:hover': { background: colors.surface, color: colors.text },
  }

  function handleNavigate(to) {
    setOpen(false)
    if (location.pathname + location.hash !== to) return
    const target = to.split('#')[1]
    if (target) document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleLanguage(value) {
    trackLanguageChange(lang, value)
    changeLang(value)
  }

  async function handleSignOut() {
    await signOut()
    setOpen(false)
  }

  return <>
    <Box component="nav" aria-label="Мобильная навигация" sx={{
      display: 'flex', '@media (min-width: 1024px)': { display: 'none' }, position: 'fixed', zIndex: 1200,
      bottom: 'max(12px, env(safe-area-inset-bottom))', left: '12px', right: '12px', maxWidth: '480px', mx: 'auto',
      gap: '4px', padding: '6px', borderRadius: '20px', background: colors.background,
      border: '1px solid ' + colors.line, boxShadow: '0 8px 28px #00000026',
    }}>
      {links.map(item => {
        const active = location.pathname + location.hash === item.to
        const ItemIcon = item.icon
        return <Button key={item.to} component={Link} to={item.to} onClick={() => handleNavigate(item.to)}
          aria-current={active ? 'page' : undefined}
          sx={{ ...dockButton, color: active ? colors.accent : colors.muted, background: active ? colors.surface : 'transparent' }}>
          <ItemIcon sx={{ fontSize: '23px' }} />{item.label}
        </Button>
      })}
      <Button component="a" href={getWhatsAppLink(lang)} target="_blank" rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick('mobile')} sx={dockButton}>
        <WhatsApp sx={{ fontSize: '23px' }} />WhatsApp
      </Button>
      <Button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu" sx={dockButton}>
        <MenuRounded sx={{ fontSize: '23px' }} />{text.menu}
      </Button>
    </Box>
    <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}
      sx={{ '@media (min-width: 1024px)': { display: 'none' } }}
      slotProps={{ backdrop: { sx: { background: '#10120f99', backdropFilter: 'blur(6px)' } } }}
      PaperProps={{ id: 'mobile-menu', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'mobile-menu-title', sx: {
        width: '100%', maxWidth: '520px', maxHeight: '92dvh', mx: 'auto',
        padding: '24px', paddingBottom: 'max(24px, env(safe-area-inset-bottom))', borderRadius: '28px 28px 0 0',
        background: colors.background, color: colors.text, border: '1px solid ' + colors.line,
      } }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap="12px" sx={{ mb: '20px' }}>
        <Box>
          <Typography sx={{ color: colors.muted, fontSize: '11px', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', mb: '6px' }}>{text.caption}</Typography>
          <Typography id="mobile-menu-title" component="h2" sx={{ color: colors.text, fontSize: '34px', lineHeight: 1.15, fontWeight: 500, letterSpacing: '-1px' }}>{text.menu}</Typography>
        </Box>
        <IconButton aria-label={text.close} onClick={() => setOpen(false)} sx={{ width: '44px', height: '44px', border: '1px solid ' + colors.line, color: colors.text }}><CloseRounded sx={{ fontSize: '22px' }} /></IconButton>
      </Stack>
      <Box component="nav" aria-label={text.menu} sx={{ mb: '22px' }}>
        {menuLinks.map((item, index) => <Button key={item.to} component={Link} to={item.to} onClick={() => handleNavigate(item.to)} fullWidth
          sx={{ justifyContent: 'flex-start', gap: '16px', minHeight: '54px', px: '0px', py: '12px', borderRadius: '0px', borderBottom: '1px solid ' + colors.line, color: colors.text, fontSize: '20px', fontWeight: 400, textTransform: 'none', '&:hover': { background: colors.surface, color: colors.accent } }}>
          <Box component="span" sx={{ color: colors.muted, fontSize: '11px', fontWeight: 400 }}>{String(index + 1).padStart(2, '0')}</Box>
          {item.label}<ArrowForwardRounded sx={{ ml: 'auto', color: colors.muted, fontSize: '19px' }} />
        </Button>)}
      </Box>
      <Button component="a" href={getWhatsAppLink(lang)} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('mobile-menu')}
        startIcon={<WhatsApp />} endIcon={<ArrowForwardRounded />} sx={{ justifyContent: 'space-between', flexShrink: 0, minHeight: '54px', px: '18px', mb: '20px', borderRadius: '12px', background: '#d7bd88', color: '#24261f', fontSize: '14px', fontWeight: 600, textTransform: 'none', '&:hover': { background: '#e4cca1', color: '#24261f' } }}>
        {text.book}
      </Button>
      {user ? <Box sx={{ p: '14px', mb: '20px', borderRadius: '12px', background: colors.surface }}>
        <Stack direction="row" alignItems="center" gap="12px">
          <Box sx={{ display: 'grid', placeItems: 'center', width: '38px', height: '38px', flexShrink: 0, border: '1px solid ' + colors.line, borderRadius: '50%', color: colors.accent, fontSize: '16px' }}>{accountName.charAt(0).toUpperCase()}</Box>
          <Box sx={{ flex: 1, minWidth: '0px' }}>
            <Typography sx={{ color: colors.muted, fontSize: '11px', mb: '2px' }}>{text.account}</Typography>
            <Typography sx={{ color: colors.text, fontSize: '14px', lineHeight: 1.4, overflowWrap: 'anywhere' }}>{accountName}</Typography>
          </Box>
          <IconButton aria-label={t('nav.logout')} onClick={handleSignOut} sx={{ width: '44px', height: '44px', color: colors.muted }}><LogoutRounded sx={{ fontSize: '20px' }} /></IconButton>
        </Stack>
        {isAdmin && <Button component={Link} to="/admin" fullWidth startIcon={<AdminPanelSettingsRounded />} endIcon={<ArrowForwardRounded />} sx={{ justifyContent: 'space-between', minHeight: '44px', mt: '12px', px: '0px', borderTop: '1px solid ' + colors.line, borderRadius: '0px', color: colors.accent, textTransform: 'none' }}>{text.admin}</Button>}
      </Box> : <Stack direction="row" gap="12px" sx={{ mb: '20px' }}>
        <Button component={Link} to="/login" fullWidth sx={{ minHeight: '44px', borderRadius: '10px', background: colors.surface, color: colors.text, textTransform: 'none' }}>{t('nav.login')}</Button>
        <Button component={Link} to="/register" fullWidth sx={{ minHeight: '44px', borderRadius: '10px', color: colors.text, textTransform: 'none' }}>{t('nav.register')}</Button>
      </Stack>}
      <Typography sx={{ color: colors.muted, fontSize: '11px', mb: '10px' }}>{text.preferences}</Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap="12px">
        <Stack direction="row" gap="4px" sx={{ padding: '4px', borderRadius: '12px', background: colors.surface }}>
          {['ru', 'tj', 'en'].map(value => <Button key={value} onClick={() => handleLanguage(value)} aria-pressed={lang === value}
            sx={{ minWidth: '48px', minHeight: '40px', padding: '8px', borderRadius: '8px', background: lang === value ? colors.background : 'transparent', color: lang === value ? colors.accent : colors.muted, fontSize: '12px', textTransform: 'none' }}>{value.toUpperCase()}</Button>)}
        </Stack>
        <IconButton onClick={toggleTheme} aria-label={text.theme} sx={{ width: '48px', height: '48px', border: '1px solid ' + colors.line, color: colors.text }}>{dark ? <LightModeRounded sx={{ fontSize: '21px' }} /> : <DarkModeRounded sx={{ fontSize: '21px' }} />}</IconButton>
      </Stack>
    </Drawer>
  </>
}
