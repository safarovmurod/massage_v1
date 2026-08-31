import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CircularProgress } from '@mui/material'
import { useAuth } from './contexts/AuthContext.jsx'
import { useLang } from './contexts/LanguageContext.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import WhatsAppFloat from './components/common/WhatsAppFloat.jsx'
import MobileBottomBar from './components/layout/MobileBottomBar.jsx'
import CookieConsent from './components/common/CookieConsent.jsx'
import Home from './pages/Home.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminUsers from './pages/admin/Users.jsx'
import AdminLeads from './pages/admin/Leads.jsx'
import AdminContent from './pages/admin/Content.jsx'
import AdminContacts from './pages/admin/Contacts.jsx'
import AdminAnalytics from './pages/admin/AnalyticsPage.jsx'
import AdminSettings from './pages/admin/Settings.jsx'
import AdminPasswordResets from './pages/admin/PasswordResets.jsx'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
}

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth()
  const { t } = useLang()
  if (loading) return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4 min-h-screen text-secondary-soft"
    >
      <CircularProgress size={40} sx={{ color: '#d4a857' }} />
      <span className="text-base">{t('auth.loading')}</span>
    </motion.div>
  )
  if (!user) return <Navigate to="/register" replace />
  if (profile?.role !== 'admin') return (
    <motion.div
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-10"
    >
      <h2 className="text-2xl mb-3 text-orange-400">{t('auth.access.denied.title')}</h2>
      <p className="mb-5">{t('auth.access.denied.desc')}</p>
      <a href="/" className="btn btn-secondary">{t('auth.access.denied.btn')}</a>
    </motion.div>
  )
  return children
}

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomBar />
      <CookieConsent />
    </>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PublicLayout><PageWrapper><Home /></PageWrapper></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><PageWrapper><Contact /></PageWrapper></PublicLayout>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
        <Route path="/admin" element={
          <ProtectedRoute><PageWrapper><AdminLayout /></PageWrapper></ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="password-resets" element={<AdminPasswordResets />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<PublicLayout><PageWrapper><NotFound /></PageWrapper></PublicLayout>} />
      </Routes>
    </AnimatePresence>
  )
}
