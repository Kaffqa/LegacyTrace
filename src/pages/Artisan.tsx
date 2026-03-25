import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { Product } from '../types/product'
import { BackgroundShapes } from '../components/BackgroundShapes'
import {
  MapPin, Trophy, ArrowLeft, Award, Package, Quote,
  Clock, Sparkles, Star, Leaf, Heart, ArrowRight,
  BookOpen, CheckCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { LoginModal } from '../components/LoginModal'

export const ArtisanPage = () => {
  const { artisanId } = useParams()
  const navigate = useNavigate()
  const [artisanProducts, setArtisanProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isOffline } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!user && !isOffline) {
      e.preventDefault()
      setIsLoginModalOpen(true)
    }
  }

  const handleProtectedAction = (path: string) => {
    if (!user && !isOffline) {
      setIsLoginModalOpen(true)
    } else {
      navigate(path)
    }
  }

  useEffect(() => {
    if (!artisanId) { navigate('/products'); return }
    // Fetch all products and filter by artisanId
    api.get<Product[]>('/products')
      .then(all => {
        const found = all.filter(p => p.artisanId === Number(artisanId))
        if (found.length > 0) {
          setArtisanProducts(found)
        } else {
          navigate('/products')
        }
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [artisanId, navigate])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [artisanId])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-gold/30 border-t-gold dark:border-gold-neon/30 dark:border-t-gold-neon rounded-full animate-spin" />
    </div>
  )

  if (artisanProducts.length === 0) return null

  const firstProduct = artisanProducts[0]
  const artisan = firstProduct.artisan
  const artisanName = artisan?.name || firstProduct.artisanName || 'Pengrajin'
  const artisanExperience = artisan?.yearsExperience || firstProduct.artisanExperience || 0
  const artisanQuote = artisan?.quote || firstProduct.artisanQuote || ''
  const artisanQuoteLocal = artisan?.quoteLocal || firstProduct.artisanQuoteLocal || ''
  const artisanPhotoUrl = artisan?.photoUrl || firstProduct.artisanPhotoUrl || ''

  return (
    <div className="min-h-screen pb-20 relative page-transition">
      <BackgroundShapes variant="minimal" />

      {/* ═══════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════ */}
      <motion.section
        className="relative max-w-6xl mx-auto px-8 pt-12 pb-10 my-8 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold-soft via-cream to-teal-soft/30 dark:from-night-card dark:via-night dark:to-gold-glow-bg/20 border border-stone-100/60 dark:border-night-border/60" />
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/6 dark:bg-gold-neon/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal/6 dark:bg-teal-neon/6 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Back button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-stone-text dark:text-dark-muted hover:text-gold dark:hover:text-gold-neon transition-colors mb-6 text-sm font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </motion.button>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Artisan Photo */}
            <motion.div
              className="relative group flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="absolute -inset-3 bg-gradient-to-br from-gold/30 to-teal/30 dark:from-gold-neon/30 dark:to-teal-neon/30 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-white dark:ring-night-card shadow-2xl">
                <img
                  src={artisanPhotoUrl}
                  alt={artisanName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.classList.add('bg-gradient-to-br', 'from-gold', 'to-teal', 'dark:from-gold-neon', 'dark:to-teal-neon', 'flex', 'items-center', 'justify-center')
                    target.parentElement!.innerHTML = `<span class="text-5xl text-white font-serif font-bold">${artisanName.charAt(0)}</span>`
                  }}
                />
              </div>
            </motion.div>

            {/* Artisan Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 dark:bg-gold-neon/10 rounded-full mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold dark:text-gold-neon" />
                <span className="text-xs font-semibold text-gold dark:text-gold-neon">Profil Pengrajin</span>
              </motion.div>

              <motion.h1
                className="text-3xl md:text-4xl font-serif font-bold gradient-text mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {artisanName}
              </motion.h1>
              <motion.p
                className="text-lg text-teal dark:text-teal-neon font-semibold mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Ahli {firstProduct.category.charAt(0).toUpperCase() + firstProduct.category.slice(1)} Tradisional
              </motion.p>
              <motion.p
                className="text-base text-stone-text dark:text-dark-body flex items-center gap-2 justify-center md:justify-start mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <MapPin className="w-4 h-4 text-gold dark:text-gold-neon" /> {firstProduct.village}
              </motion.p>

              {/* Ethical badges */}
              <motion.div
                className="flex flex-wrap gap-2 justify-center md:justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {firstProduct.ethicalBadges.slice(0, 3).map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-teal/10 dark:bg-teal-neon/10 text-teal dark:text-teal-neon rounded-full text-xs font-semibold flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> {badge}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          STATS SECTION
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 mb-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="glass p-6 rounded-2xl text-center border border-stone-100/60 dark:border-night-border/60 hover:shadow-lg transition-all duration-300 group"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <Clock className="w-8 h-8 text-gold dark:text-gold-neon mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-3xl font-bold text-gold dark:text-gold-neon">{artisanExperience}+</p>
            <p className="text-sm text-stone-text dark:text-dark-muted font-medium">Tahun Pengalaman</p>
          </motion.div>

          <motion.div
            className="glass p-6 rounded-2xl text-center border border-stone-100/60 dark:border-night-border/60 hover:shadow-lg transition-all duration-300 group"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <Trophy className="w-8 h-8 text-teal dark:text-teal-neon mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-3xl font-bold text-teal dark:text-teal-neon">Ahli</p>
            <p className="text-sm text-stone-text dark:text-dark-muted font-medium">Master Craftsperson</p>
          </motion.div>

          <motion.div
            className="glass p-6 rounded-2xl text-center border border-stone-100/60 dark:border-night-border/60 hover:shadow-lg transition-all duration-300 group"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <Package className="w-8 h-8 text-cat-batik dark:text-cat-batik-dark mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-3xl font-bold text-cat-batik dark:text-cat-batik-dark">{artisanProducts.length}</p>
            <p className="text-sm text-stone-text dark:text-dark-muted font-medium">Produk Diciptakan</p>
          </motion.div>

          <motion.div
            className="glass p-6 rounded-2xl text-center border border-stone-100/60 dark:border-night-border/60 hover:shadow-lg transition-all duration-300 group"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <Heart className="w-8 h-8 text-cat-herbal dark:text-cat-herbal-dark mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-3xl font-bold text-cat-herbal dark:text-cat-herbal-dark">100%</p>
            <p className="text-sm text-stone-text dark:text-dark-muted font-medium">Buatan Tangan</p>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          ARTISAN QUOTE
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass rounded-3xl p-8 md:p-10 border border-stone-100/60 dark:border-night-border/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-teal/[0.03] dark:from-gold-neon/[0.06] dark:to-teal-neon/[0.06]" />

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
            <Quote className="w-12 h-12 text-gold/20 dark:text-gold-neon/20 flex-shrink-0" />
            <div className="flex-1">
              <blockquote className="text-xl md:text-2xl italic text-ink dark:text-dark-heading leading-relaxed font-serif mb-4">
                "{artisanQuote}"
              </blockquote>
              {artisanQuoteLocal && (
                <div className="bg-gold-soft/50 dark:bg-gold-glow-bg/50 rounded-xl p-4 border-l-4 border-gold dark:border-gold-neon mb-4">
                  <p className="text-xs text-stone-text dark:text-dark-muted font-semibold mb-1">Dalam bahasa lokal:</p>
                  <p className="text-base italic text-ink dark:text-dark-body leading-relaxed">"{artisanQuoteLocal}"</p>
                </div>
              )}
              <p className="text-sm text-gold dark:text-gold-neon font-semibold">— {artisanName}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          THE STORY (CULTURAL VALUE)
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Story */}
          <div className="glass p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100/60 dark:border-night-border/60 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif font-bold text-ink dark:text-dark-heading group-hover:text-gold dark:group-hover:text-gold-neon transition-colors">Kisah Pengrajin</h2>
            </div>
            <p className="text-stone-text dark:text-dark-body leading-relaxed">{firstProduct.umkmStory}</p>
          </div>

          {/* Cultural Value */}
          <div className="glass p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100/60 dark:border-night-border/60 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal to-teal-deep dark:from-teal-neon dark:to-teal-bright rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif font-bold text-ink dark:text-dark-heading group-hover:text-gold dark:group-hover:text-gold-neon transition-colors">Nilai Budaya</h2>
            </div>
            <p className="text-stone-text dark:text-dark-body leading-relaxed">{firstProduct.culturalValue}</p>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          ARTISAN CREATIONS
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-8 mb-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 dark:bg-gold-neon/10 rounded-full mb-4">
            <Star className="w-4 h-4 text-gold dark:text-gold-neon" />
            <span className="text-sm font-semibold text-gold dark:text-gold-neon">Karya & Produk</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-ink dark:text-dark-heading">
            Kreasi <span className="gradient-text">{artisanName}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisanProducts.map((product) => (
            <motion.div
              key={product.id}
              className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-stone-100/60 dark:border-night-border/60 group card-hover"
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link to={`/passport/${product.id}`} onClick={handleProtectedClick}>
                    <motion.button
                      className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-deep text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Lihat Passport <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-teal dark:text-teal-neon font-semibold uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-base font-serif font-bold text-ink dark:text-dark-heading mb-1 group-hover:text-gold dark:group-hover:text-gold-neon transition-colors">{product.name}</h3>
                <p className="text-sm text-stone-text dark:text-dark-body">{product.umkm}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          FOOTER CTA
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-4xl mx-auto px-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass rounded-3xl p-10 text-center border border-gold/15 dark:border-gold-neon/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-teal/[0.03] dark:from-gold-neon/[0.06] dark:to-teal-neon/[0.06]" />
          <div className="relative z-10">
            <h2 className="text-2xl font-serif font-bold text-ink dark:text-dark-heading mb-2">
              Dukung <span className="gradient-text">Pengrajin</span> Ini
            </h2>
            <p className="text-stone-text dark:text-dark-body mb-6">
              Jelajahi lebih banyak produk autentik dari pengrajin berbakat Indonesia
            </p>
            <motion.button
              onClick={() => handleProtectedAction('/products')}
              className="px-8 py-3.5 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-300 flex items-center gap-2 mx-auto btn-glow"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" /> Lihat Semua Produk
            </motion.button>
          </div>
        </div>
      </motion.section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}