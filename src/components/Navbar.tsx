import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X, LogIn, UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, User, LogOut, Shield, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

type ModalType = 'login' | 'register' | null

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )
  const [authModal, setAuthModal] = useState<ModalType>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, login, register, logout, isAdmin } = useAuth()

  // Auth form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const resetForm = () => {
    setEmail(''); setPassword(''); setName(''); setConfirmPassword('')
    setShowPassword(false); setAuthError(''); setAuthLoading(false)
  }

  const openModal = (type: ModalType) => {
    resetForm()
    setAuthModal(type)
    setIsOpen(false)
    setShowUserMenu(false)
  }

  const closeModal = () => {
    setAuthModal(null)
    resetForm()
  }

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setShowUserMenu(false)
  }, [location.pathname])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowUserMenu(false)
    if (showUserMenu) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [showUserMenu])

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (!user && (path.startsWith('/products') || path.startsWith('/edutainment'))) {
      e.preventDefault()
      openModal('login')
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)
    try {
      const loggedUser = await login(email, password)
      closeModal()
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin')
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login gagal')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    if (password !== confirmPassword) {
      setAuthError('Password tidak cocok')
      return
    }
    if (password.length < 6) {
      setAuthError('Password minimal 6 karakter')
      return
    }
    setAuthLoading(true)
    try {
      await register(name, email, password)
      closeModal()
    } catch (err: any) {
      setAuthError(err.message || 'Registrasi gagal')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  const navItems = [
    { label: 'Beranda', path: '/', isActive: (p: string) => p === '/' },
    { label: 'Jelajahi', path: '/products', isActive: (p: string) => p.startsWith('/products') || p.startsWith('/passport') },
    { label: 'Belajar', path: '/edutainment', isActive: (p: string) => p.startsWith('/edutainment') },
  ]

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`mx-auto my-4 rounded-2xl transition-all duration-300 px-6 md:px-12 py-3 bg-white dark:bg-night-surface border border-stone-100/60 dark:border-night-border/60 ${isScrolled
              ? 'shadow-xl shadow-gold/5 dark:shadow-gold-neon/10'
              : 'shadow-md'
              }`}
          >
            <div className="flex justify-between items-center gap-8 md:gap-20">

              {/* Logo */}
              <div onClick={(e) => handleNavClick(e, '/')}>
                <Link to="/">
                  <motion.div
                    className="text-xl md:text-2xl font-bold gradient-text font-serif flex-shrink-0 tracking-wide"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    LegacyTrace
                  </motion.div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8 lg:gap-12">
                {navItems.map((item, idx) => {
                  const isActive = item.isActive(location.pathname)
                  return (
                    <div key={idx}>
                      <Link to={item.path} onClick={(e) => handleNavClick(e, item.path)}>
                        <motion.div
                          className="relative pb-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className={`text-sm font-medium transition-colors duration-250 ${isActive
                            ? 'text-gold dark:text-gold-neon font-bold'
                            : 'text-charcoal dark:text-dark-body hover:text-gold dark:hover:text-gold-neon'
                            }`}>
                            {item.label}
                          </span>
                          {isActive && (
                            <motion.div
                              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-teal to-gold dark:from-gold-neon dark:via-teal-neon dark:to-gold-neon rounded-full"
                              layoutId="navbar-underline"
                              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                            />
                          )}
                        </motion.div>
                      </Link>
                    </div>
                  )
                })}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Dark mode toggle */}
                <motion.button
                  onClick={toggleDarkMode}
                  className="text-2xl hover:opacity-80 transition-opacity"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <Sun className="w-5 h-5 text-gold-neon" /> : <Moon className="w-5 h-5 text-gold" />}
                </motion.button>

                {/* Auth / User section - Desktop */}
                <div className="hidden md:flex items-center gap-3">
                  {user ? (
                    /* Logged in user menu */
                    <div className="relative">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu) }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border hover:border-gold/30 dark:hover:border-gold-neon/30 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright flex items-center justify-center text-white dark:text-night text-xs font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-ink dark:text-dark-heading max-w-24 truncate">{user.name}</span>
                        <ChevronDown className={`w-4 h-4 text-muted-text dark:text-dark-muted transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                      </motion.button>

                      {/* Dropdown */}
                      <AnimatePresence>
                        {showUserMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-night-surface rounded-xl shadow-xl border border-stone-100/60 dark:border-night-border/60 overflow-hidden z-50"
                          >
                            <div className="px-4 py-3 border-b border-stone-100 dark:border-night-border">
                              <p className="text-sm font-medium text-ink dark:text-dark-heading truncate">{user.name}</p>
                              <p className="text-xs text-muted-text dark:text-dark-muted truncate">{user.email}</p>
                            </div>
                            {isAdmin && (
                              <Link to="/admin" onClick={() => setShowUserMenu(false)}>
                                <div className="px-4 py-3 flex items-center gap-3 hover:bg-gold-soft dark:hover:bg-gold-glow-bg transition-colors text-sm text-charcoal dark:text-dark-body">
                                  <Shield className="w-4 h-4 text-gold dark:text-gold-neon" />
                                  Admin Panel
                                </div>
                              </Link>
                            )}
                            <Link to="/team" onClick={() => setShowUserMenu(false)}>
                              <div className="px-4 py-3 flex items-center gap-3 hover:bg-warm-sand dark:hover:bg-night-card transition-colors text-sm text-charcoal dark:text-dark-body">
                                <User className="w-4 h-4 text-teal dark:text-teal-neon" />
                                Tim Kami
                              </div>
                            </Link>
                            <button onClick={handleLogout} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-coral-soft dark:hover:bg-coral-glow-bg transition-colors text-sm text-coral dark:text-coral-neon border-t border-stone-100 dark:border-night-border">
                              <LogOut className="w-4 h-4" />
                              Keluar
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    /* Not logged in */
                    <>
                      <motion.button
                        onClick={() => openModal('login')}
                        className="px-5 py-2 rounded-full text-sm font-medium text-charcoal dark:text-dark-body hover:text-gold dark:hover:text-gold-neon border border-stone-100 dark:border-night-border hover:border-gold/30 dark:hover:border-gold-neon/30 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Masuk
                      </motion.button>
                      <motion.button
                        onClick={() => openModal('register')}
                        className="px-5 py-2 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold text-sm rounded-full shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-250 btn-glow"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Daftar
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                  className="md:hidden text-gold dark:text-gold-neon flex-shrink-0 text-3xl"
                  onClick={() => setIsOpen(!isOpen)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
              className="md:hidden overflow-hidden border-t border-stone-100 dark:border-night-border mt-4"
              initial={{ height: 0 }}
              animate={{ height: isOpen ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4 pt-6 pb-4">
                {navItems.map((item, idx) => {
                  const isActive = item.isActive(location.pathname)
                  return (
                    <div key={idx}>
                      <Link to={item.path} onClick={(e) => { handleNavClick(e, item.path); setIsOpen(false); }}>
                        <motion.div
                          className={`px-6 py-4 rounded-lg text-lg font-medium transition-all duration-250 ${isActive
                            ? 'bg-gold-soft dark:bg-gold-glow-bg text-gold dark:text-gold-neon font-bold border-l-4 border-gold dark:border-gold-neon'
                            : 'text-charcoal dark:text-dark-body hover:text-gold dark:hover:text-gold-neon hover:bg-warm-sand dark:hover:bg-night-border'
                            }`}
                          whileHover={{ x: 4 }}
                        >
                          {item.label}
                        </motion.div>
                      </Link>
                    </div>
                  )
                })}

                {/* Mobile auth / user section */}
                <div className="border-t border-stone-100 dark:border-night-border pt-4 space-y-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-6 py-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright flex items-center justify-center text-white dark:text-night font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink dark:text-dark-heading">{user.name}</p>
                          <p className="text-xs text-muted-text dark:text-dark-muted">{user.email}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                          <motion.div className="px-6 py-4 rounded-lg text-lg font-medium text-charcoal dark:text-dark-body hover:bg-gold-soft dark:hover:bg-gold-glow-bg flex items-center gap-3" whileHover={{ x: 4 }}>
                            <Shield className="w-5 h-5 text-gold dark:text-gold-neon" /> Admin Panel
                          </motion.div>
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full px-6 py-4 rounded-lg text-lg font-medium text-coral dark:text-coral-neon hover:bg-coral-soft dark:hover:bg-coral-glow-bg flex items-center gap-3 transition-colors">
                        <LogOut className="w-5 h-5" /> Keluar
                      </button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => openModal('login')}
                        className="w-full px-6 py-4 rounded-full text-lg font-medium text-charcoal dark:text-dark-body border border-stone-100 dark:border-night-border hover:border-gold/30 dark:hover:border-gold-neon/30 transition-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        Masuk
                      </motion.button>
                      <motion.button
                        onClick={() => openModal('register')}
                        className="w-full px-6 py-4 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold text-lg rounded-full shadow-md"
                        whileHover={{ scale: 1.02 }}
                      >
                        Daftar
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ====== AUTH MODAL ====== */}
      <AnimatePresence>
        {authModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white dark:bg-night-surface rounded-2xl shadow-2xl w-full max-w-md border border-stone-100/60 dark:border-night-border/60 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative px-8 pt-8 pb-4">
                <button onClick={closeModal} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-warm-sand dark:hover:bg-night-card text-muted-text dark:text-dark-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold gradient-text font-serif">{authModal === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}</h2>
                  <p className="text-sm text-stone-text dark:text-dark-muted mt-2">
                    {authModal === 'login' ? 'Masuk ke akun LegacyTrace Anda' : 'Bergabung dengan komunitas LegacyTrace'}
                  </p>
                </div>
              </div>

              {/* Error */}
              {authError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mx-8 mb-4 p-3 rounded-xl bg-coral-soft dark:bg-coral-glow-bg border border-coral/20 dark:border-coral-neon/20 flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-coral dark:text-coral-neon flex-shrink-0" />
                  <span className="text-sm text-coral-deep dark:text-coral-neon">{authError}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={authModal === 'login' ? handleLogin : handleRegister} className="px-8 pb-4 space-y-4">
                {/* Name (register only) */}
                {authModal === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1.5">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text dark:text-dark-muted" />
                      <input type="text" value={name} onChange={e => setName(e.target.value)} required
                        placeholder="Nama Anda"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 focus:border-gold dark:focus:border-gold-neon transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text dark:text-dark-muted" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 focus:border-gold dark:focus:border-gold-neon transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text dark:text-dark-muted" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                      placeholder={authModal === 'register' ? 'Minimal 6 karakter' : '••••••••'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 focus:border-gold dark:focus:border-gold-neon transition-all text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text dark:text-dark-muted hover:text-gold dark:hover:text-gold-neon">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password (register only) */}
                {authModal === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1.5">Konfirmasi Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text dark:text-dark-muted" />
                      <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                        placeholder="Ulangi password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 focus:border-gold dark:focus:border-gold-neon transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-250 btn-glow flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {authLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : authModal === 'login' ? (
                    <><LogIn className="w-4 h-4" /> Masuk</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Daftar</>
                  )}
                </motion.button>
              </form>

              {/* Switch modal */}
              <div className="px-8 py-4 border-t border-stone-100 dark:border-night-border text-center">
                <p className="text-sm text-stone-text dark:text-dark-muted">
                  {authModal === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                  <button
                    onClick={() => openModal(authModal === 'login' ? 'register' : 'login')}
                    className="text-gold dark:text-gold-neon font-semibold hover:underline"
                  >
                    {authModal === 'login' ? 'Daftar sekarang' : 'Masuk'}
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}