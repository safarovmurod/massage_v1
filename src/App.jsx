import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from './contexts/AuthContext.jsx'
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

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
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
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-secondary-soft text-xl">
      Загрузка...
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (profile?.role !== 'admin') return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-10">
      <h2 className="text-2xl mb-3 text-orange-400">Access denied</h2>
      <p>У вас нет прав администратора.</p>
    </div>
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
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<PublicLayout><PageWrapper><NotFound /></PageWrapper></PublicLayout>} />
      </Routes>
    </AnimatePresence>
  )
}
