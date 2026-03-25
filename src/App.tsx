import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { LoadingScreen } from './components/LoadingScreen'
import { FloatingMenu } from './components/FloatingMenu'
import { ScrollToTop } from './components/ScrollToTop'
import { AuthProvider } from './contexts/AuthContext'
import { OfflineBadge } from './components/OfflineBadge'
import { ProtectedRoute } from './components/ProtectedRoute'

// Lazy-loaded pages (code splitting — only download when visited)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })))
const Passport = lazy(() => import('./pages/Passport').then(m => ({ default: m.Passport })))
const Edutainment = lazy(() => import('./pages/Edutainment').then(m => ({ default: m.Edutainment })))
const ArtisanPage = lazy(() => import('./pages/Artisan').then(m => ({ default: m.ArtisanPage })))
const Team = lazy(() => import('./pages/Team').then(m => ({ default: m.Team })))
const Regions = lazy(() => import('./pages/Regions').then(m => ({ default: m.Regions })))
const Partnership = lazy(() => import('./pages/Partnership').then(m => ({ default: m.Partnership })))

// Admin pages (lazy-loaded separately)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })))
const AdminArtisans = lazy(() => import('./pages/admin/AdminArtisans').then(m => ({ default: m.AdminArtisans })))
const AdminRegions = lazy(() => import('./pages/admin/AdminRegions').then(m => ({ default: m.AdminRegions })))
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam').then(m => ({ default: m.AdminTeam })))
const AdminQuiz = lazy(() => import('./pages/admin/AdminQuiz').then(m => ({ default: m.AdminQuiz })))
const AdminPartnerships = lazy(() => import('./pages/admin/AdminPartnerships').then(m => ({ default: m.AdminPartnerships })))

// Minimal fallback spinner for lazy-loaded pages
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-gold/30 border-t-gold dark:border-gold-neon/30 dark:border-t-gold-neon rounded-full animate-spin" />
  </div>
)
const AppContent = () => {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      {!isAdminPage && <Navbar />}
      <main className={!isAdminPage ? 'pt-24' : ''}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/passport/:productId" element={<ProtectedRoute><Passport /></ProtectedRoute>} />
            <Route path="/edutainment" element={<ProtectedRoute><Edutainment /></ProtectedRoute>} />
            <Route path="/artisan/:artisanId" element={<ArtisanPage />} />
            <Route path="/team" element={<Team />} />
            <Route path="/regions" element={<Regions />} />
            <Route path="/partnership" element={<Partnership />} />

            {/* Admin pages */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="artisans" element={<AdminArtisans />} />
              <Route path="regions" element={<AdminRegions />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="quiz" element={<AdminQuiz />} />
              <Route path="partnerships" element={<AdminPartnerships />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <FloatingMenu />}
      <OfflineBadge />
    </>
  )
}

export const App = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800) // Reduced from 2000ms
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      {!loading && (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      )}
    </>
  )
}

export default App