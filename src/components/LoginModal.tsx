import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, X, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

type ModalType = 'login' | 'register'

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [authModal, setAuthModal] = useState<ModalType>('login')
  
  // Auth form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  
  const { login, register } = useAuth()

  // Reset form when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail('')
        setPassword('')
        setName('')
        setConfirmPassword('')
        setShowPassword(false)
        setAuthError('')
        setAuthLoading(false)
        setAuthModal('login')
      }, 300)
    }
  }, [isOpen])

  const openModal = (type: ModalType) => {
    setAuthError('')
    setAuthModal(type)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)
    try {
      await login(email, password)
      onClose()
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
      onClose()
    } catch (err: any) {
      setAuthError(err.message || 'Registrasi gagal')
    } finally {
      setAuthLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        />

        {/* Modal Content */}
        <motion.div
          className="bg-white dark:bg-night-surface rounded-2xl shadow-2xl w-full max-w-md border border-stone-100/60 dark:border-night-border/60 overflow-hidden relative z-[101]"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="relative px-8 pt-8 pb-4">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-warm-sand dark:hover:bg-night-card text-muted-text dark:text-dark-muted transition-colors">
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
      </div>
    </AnimatePresence>
  )
}
