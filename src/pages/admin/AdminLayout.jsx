import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Button, Divider } from '@mui/material'
import { Menu as MuiMenuIcon, Close as MuiCloseIcon, Logout as MuiLogoutIcon } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { LogoIcon, DashboardIcon, UsersIcon, LeadsIcon, EditIcon, SettingsIcon, ChartIcon, MapPinIcon } from '../../components/icons/Icons.jsx'

const drawerWidth = 250

export default function AdminLayout() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => { await signOut(); navigate('/') }

  const navItems = [
    { to: '/admin', icon: DashboardIcon, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: UsersIcon, label: 'Users' },
    { to: '/admin/leads', icon: LeadsIcon, label: 'Leads' },
    { to: '/admin/content', icon: EditIcon, label: 'Content' },
    { to: '/admin/contacts', icon: MapPinIcon, label: 'Contacts' },
    { to: '/admin/analytics', icon: ChartIcon, label: 'Analytics' },
    { to: '/admin/settings', icon: SettingsIcon, label: 'Settings' },
  ]

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#221c2a' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.25, borderBottom: '1px solid rgba(212,168,87,0.2)' }}>
        <LogoIcon size={32} />
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#f5ede4' }}>Admin Panel</Typography>
      </Box>
      <List sx={{ flex: 1, p: 1.5, gap: 0.5 }}>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            style={({ isActive }) => ({ textDecoration: 'none', display: 'block' })}
            onClick={() => setMobileOpen(false)}
          >
            {({ isActive }) => (
              <ListItemButton sx={{
                borderRadius: '12px', mb: 0.5, px: 2, py: 1.5,
                background: isActive ? 'linear-gradient(135deg, #d4a857, #e8915a)' : 'transparent',
                color: isActive ? '#fff' : '#c4b8ab',
                '&:hover': { background: isActive ? 'linear-gradient(135deg, #e8c178, #e8915a)' : 'rgba(255,255,255,0.05)' },
              }}>
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><item.icon width={22} height={22} /></ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(212,168,87,0.2)' }} />
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontSize: '0.82rem', color: '#8a7f76', mb: 1 }}>{profile?.full_name || user?.email}</Typography>
        <Button fullWidth variant="outlined" size="small" onClick={handleLogout}
          sx={{ borderColor: 'rgba(255,255,255,0.1)', color: '#c4b8ab', '&:hover': { borderColor: '#d4a857', color: '#d4a857' } }}
          startIcon={<MuiLogoutIcon />}>Logout</Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#1a1520' }}>
      <AppBar position="fixed" sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` },
        background: 'rgba(26,21,32,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,168,87,0.2)', boxShadow: 'none',
      }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
            {mobileOpen ? <MuiCloseIcon /> : <MuiMenuIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: '#f5ede4' }}>Dashboard</Typography>
          <Typography sx={{ fontSize: '0.88rem', color: '#8a7f76' }}>{user?.email}</Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: '1px solid rgba(212,168,87,0.2)' } }}>
          {drawerContent}
        </Drawer>
        <Drawer variant="permanent" open
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: '1px solid rgba(212,168,87,0.2)', boxSizing: 'border-box' } }}>
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: '64px' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  )
}
