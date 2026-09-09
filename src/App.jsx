import { lazy, Suspense } from 'react'
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
import ScrollToHash from './components/common/ScrollToHash.jsx'
import PageViewTracker from './components/common/PageViewTracker.jsx'
import Home from './pages/Home.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const AdminUsers = lazy(() => import('./pages/admin/Users.jsx'))
const AdminLeads = lazy(() => import('./pages/admin/Leads.jsx'))
const AdminContent = lazy(() => import('./pages/admin/Content.jsx'))
const AdminContacts = lazy(() => import('./pages/admin/Contacts.jsx'))
const AdminAnalytics = lazy(() => import('./pages/admin/AnalyticsPage.jsx'))
const AdminSettings = lazy(() => import('./pages/admin/Settings.jsx'))
const AdminPasswordResets = lazy(() => import('./pages/admin/PasswordResets.jsx'))

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

function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <CircularProgress size={36} sx={{ color: '#d4a857' }} />
    </div>
  )
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
    <>
    <ScrollToHash />
    <PageViewTracker />
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PublicLayout><PageWrapper><Home /></PageWrapper></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><PageWrapper><Contact /></PageWrapper></PublicLayout>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
        {/* Админка грузится отдельным файлом — обычный посетитель её не скачивает */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <PageWrapper>
              <Suspense fallback={<AdminLoading />}><AdminLayout /></Suspense>
            </PageWrapper>
          </ProtectedRoute>
        }>
          <Route index element={<Suspense fallback={<AdminLoading />}><AdminDashboard /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<AdminLoading />}><AdminUsers /></Suspense>} />
          <Route path="leads" element={<Suspense fallback={<AdminLoading />}><AdminLeads /></Suspense>} />
          <Route path="content" element={<Suspense fallback={<AdminLoading />}><AdminContent /></Suspense>} />
          <Route path="contacts" element={<Suspense fallback={<AdminLoading />}><AdminContacts /></Suspense>} />
          <Route path="password-resets" element={<Suspense fallback={<AdminLoading />}><AdminPasswordResets /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<AdminLoading />}><AdminAnalytics /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<AdminLoading />}><AdminSettings /></Suspense>} />
        </Route>
        <Route path="*" element={<PublicLayout><PageWrapper><NotFound /></PageWrapper></PublicLayout>} />
      </Routes>
    </AnimatePresence>
    </>
  )
}
