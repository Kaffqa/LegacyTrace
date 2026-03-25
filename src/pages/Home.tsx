import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { BackgroundShapes } from '../components/BackgroundShapes'
import { HeroVisual } from '../components/HeroVisual'
import { api } from '../lib/api'
import { Review } from '../types/product'
import {
  Search, ShieldCheck, QrCode, Users,
  Palette, Utensils, Hammer, Scissors,
  Coffee, Leaf, ArrowRight, Map, BookOpen,
  Heart, Handshake, Sparkles, Award, MapPin, Star
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { LoginModal } from '../components/LoginModal'

/* ── Animated Counter Hook (rAF-based) ── */
function useCounter(end: number, durationMs: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  useEffect(() => {
    // allow re-animation when real data arrives
    if (end > 0) hasAnimated.current = false;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current && end > 0) {
          hasAnimated.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / durationMs, 1)
            // easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4)
            setCount(Math.round(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, durationMs])

  return { count, ref }
}

/* ── Stat Counter Component ── */
const StatCounter = ({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) => {
  const { count, ref } = useCounter(value)

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="text-4xl md:text-5xl font-serif font-bold text-gold dark:text-gold-neon mb-1">
        {count}{suffix}
      </div>
      <div className="text-sm text-stone-text dark:text-dark-muted font-medium uppercase tracking-wider">{label}</div>
    </motion.div>
  )
}

interface PlatformStats {
  totalProducts: number
  totalArtisans: number
  totalRegions: number
  totalCategories: number
  totalReviews: number
  averageRating: number
}

export const Home = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [featuredReviews, setFeaturedReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const { user, isOffline } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!user && !isOffline) {
      e.preventDefault()
      setIsLoginModalOpen(true)
    }
  }

  useEffect(() => {
    api.get<PlatformStats>('/stats').then(setStats).catch(console.error)
    api.get<Review[]>('/reviews/featured')
      .then(setFeaturedReviews)
      .catch(console.error)
      .finally(() => setReviewsLoading(false))
  }, [])


  const features = [
    {
      icon: <Search className="w-7 h-7" />,
      title: 'Rantai Pasok',
      desc: 'Lihat perjalanan lengkap dari setiap produk dari artisan hingga ke tangan Anda.',
      color: 'text-gold dark:text-gold-neon',
      bg: 'bg-gold-soft dark:bg-gold-glow-bg'
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Kerajinan Etis',
      desc: 'Dukung perdagangan adil dan komunitas artisan. Setiap pembelian memberdayakan pengrajin.',
      color: 'text-gold dark:text-gold-neon',
      bg: 'bg-gold-soft dark:bg-gold-glow-bg'
    },
    {
      icon: <QrCode className="w-7 h-7" />,
      title: 'Paspor Digital',
      desc: 'Setiap produk memiliki paspor digital interaktif yang menceritakan kisah uniknya.',
      color: 'text-gold dark:text-gold-neon',
      bg: 'bg-gold-soft dark:bg-gold-glow-bg'
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: 'Kisah Artisan',
      desc: 'Temui para pembuat di balik produk. Dengarkan kisah hidup, passion, dan budaya mereka.',
      color: 'text-gold dark:text-gold-neon',
      bg: 'bg-gold-soft dark:bg-gold-glow-bg'
    }
  ]

  const categories = [
    { icon: <Palette className="w-8 h-8" />, name: 'Batik', desc: 'Pola batik tulis tradisional', color: 'text-cat-pottery dark:text-cat-pottery-dark', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { icon: <Utensils className="w-8 h-8" />, name: 'Makanan', desc: 'Kuliner lokal autentik', color: 'text-cat-pottery dark:text-cat-pottery-dark', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { icon: <Hammer className="w-8 h-8" />, name: 'Kerajinan', desc: 'Artefak budaya buatan tangan', color: 'text-cat-pottery dark:text-cat-pottery-dark', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { icon: <Scissors className="w-8 h-8" />, name: 'Tenun', desc: 'Tenunan tekstil rumit', color: 'text-cat-pottery dark:text-cat-pottery-dark', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { icon: <Coffee className="w-8 h-8" />, name: 'Gerabah', desc: 'Kreasi keramik artisan', color: 'text-cat-pottery dark:text-cat-pottery-dark', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { icon: <Leaf className="w-8 h-8" />, name: 'Herbal', desc: 'Produk kesehatan tradisional', color: 'text-cat-pottery dark:text-cat-pottery-dark', bg: 'bg-amber-50 dark:bg-amber-950/20' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  return (
    <div className="min-h-screen relative page-transition">
      <BackgroundShapes variant="default" />

      {/* ═══════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════ */}
      <section className="relative bg-mesh-hero">
        <motion.div
          className="max-w-6xl mx-auto px-8 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-soft dark:bg-gold-glow-bg border border-gold/20 dark:border-gold-neon/20 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-gold dark:text-gold-neon" />
              <span className="text-sm font-semibold text-gold-deep dark:text-gold-neon">Ethical Supply Chain Platform</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
              <span className="text-ink dark:text-dark-heading">Setiap Produk</span>
              <br />
              <span className="text-shimmer">Punya Cerita</span>
            </h1>
            <p className="text-lg text-stone-text dark:text-dark-body mb-8 leading-relaxed max-w-lg">
              Temukan perjalanan etis di balik setiap produk UMKM Indonesia. Dari artisan hingga tangan Anda dengan transparansi penuh dan cerita yang menginspirasi.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: <Award className="w-3.5 h-3.5" />, label: 'Fair Trade Verified' },
                { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: '100% Transparan' },
                { icon: <Heart className="w-3.5 h-3.5" />, label: 'Dukung UMKM' },
              ].map((pill, i) => (
                <motion.span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-sand dark:bg-night-card text-xs font-medium text-charcoal dark:text-dark-body border border-stone-100 dark:border-night-border"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {pill.icon}
                  {pill.label}
                </motion.span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" onClick={handleProtectedClick}>
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-250 flex items-center gap-2 btn-glow"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Jelajahi Cerita <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/edutainment" onClick={handleProtectedClick}>
                <motion.button
                  className="px-8 py-4 bg-cream dark:bg-night-card text-gold dark:text-gold-neon font-semibold rounded-full border-2 border-gold dark:border-gold-neon shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-250"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pelajari Lebih Lanjut
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            className="hidden lg:flex items-center justify-center min-h-[420px] rounded-3xl relative overflow-hidden"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <HeroVisual stats={stats} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          IMPACT STATS
         ═══════════════════════════════════ */}
      <section className="relative">
        <div className="section-divider" />
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <StatCounter value={stats?.totalProducts ?? 0} suffix="+" label="Produk" delay={0} />
            <StatCounter value={stats?.totalArtisans ?? 0} suffix="+" label="Artisan" delay={0.1} />
            <StatCounter value={stats?.totalRegions ?? 0} suffix="" label="Region" delay={0.2} />
            <StatCounter value={stats?.totalCategories ?? 0} suffix="" label="Kategori" delay={0.3} />
            {(stats?.totalReviews ?? 0) > 0 && (
              <StatCounter value={stats?.averageRating ?? 0} suffix="/5" label="Rating" delay={0.4} />
            )}
          </div>
        </div>
        <div className="section-divider" />
      </section>

      {/* ═══════════════════════════════════
          FEATURES SECTION
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-20 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-14" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink dark:text-dark-heading mb-4">
            Mengapa Memilih <span className="gradient-text">LegacyTrace</span>?
          </h2>
          <p className="text-stone-text dark:text-dark-muted max-w-xl mx-auto">Platform yang menghubungkan konsumen dengan artisan lokal Indonesia melalui transparansi dan kepercayaan.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="glass p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-400 text-center card-hover card-glow border border-stone-100/60 dark:border-night-border/60 group"
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-serif font-bold text-ink dark:text-dark-heading mb-2 group-hover:text-gold dark:group-hover:text-gold-neon transition-colors">{feature.title}</h3>
              <p className="text-stone-text dark:text-dark-body text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          CATEGORIES SECTION
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-20 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-14" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink dark:text-dark-heading mb-4">
            Kategori <span className="gradient-text">Produk</span>
          </h2>
          <p className="text-stone-text dark:text-dark-muted max-w-xl mx-auto">Jelajahi kekayaan produk UMKM Indonesia dari berbagai kategori kerajinan tradisional.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 relative z-10">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              className="glass rounded-2xl p-7 text-center shadow-sm hover:shadow-xl transition-all duration-400 card-hover card-glow border border-stone-100/60 dark:border-night-border/60 group relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-teal/[0.02] dark:from-gold-neon/[0.04] dark:to-teal-neon/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className={`w-16 h-16 ${cat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 ${cat.color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-ink dark:text-dark-heading mb-1 group-hover:text-gold dark:group-hover:text-gold-neon transition-colors">{cat.name}</h3>
                <p className="text-sm text-stone-text dark:text-dark-body">{cat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          HOW IT WORKS
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink dark:text-dark-heading mb-4">
            Bagaimana <span className="gradient-text">Cara Kerja</span>?
          </h2>
          <p className="text-stone-text dark:text-dark-muted max-w-xl mx-auto">Empat langkah sederhana untuk mengenal produk UMKM Indonesia yang etis dan berkelanjutan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[72px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-gold/20 via-teal/20 to-gold/20 dark:from-gold-neon/10 dark:via-teal-neon/10 dark:to-gold-neon/10 z-0" />

          {[
            { step: '1', title: 'Jelajahi', desc: 'Jelajahi koleksi produk UMKM etis kami', icon: <Search className="w-5 h-5" /> },
            { step: '2', title: 'Temukan', desc: 'Pelajari cerita unik di balik setiap produk', icon: <BookOpen className="w-5 h-5" /> },
            { step: '3', title: 'Belajar', desc: 'Ikuti quiz interaktif tentang supply chain', icon: <ShieldCheck className="w-5 h-5" /> },
            { step: '4', title: 'Dukung', desc: 'Dukung artisan dengan pembelian bermakna', icon: <Heart className="w-5 h-5" /> }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <div className="glass rounded-2xl p-8 text-center border border-gold/10 dark:border-gold-neon/10 hover:border-gold/30 dark:hover:border-gold-neon/30 hover:shadow-xl transition-all duration-300 card-hover group">
                <div className="w-14 h-14 bg-gold dark:bg-gold-neon text-white dark:text-night rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-ink dark:text-dark-heading mb-2 group-hover:text-gold dark:group-hover:text-gold-neon transition-colors">{item.title}</h4>
                <p className="text-sm text-stone-text dark:text-dark-body">{item.desc}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:block absolute top-[72px] -right-3 transform -translate-y-1/2 z-20">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xl text-gold dark:text-gold-neon"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          REGIONS SECTION
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-20 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink dark:text-dark-heading mb-4 flex items-center justify-center gap-3">
            <Map className="w-9 h-9 text-teal dark:text-teal-neon" /> Explore by <span className="gradient-text">Region</span>
          </h2>
          <p className="text-stone-text dark:text-dark-body max-w-xl mx-auto">
            Temukan kerajinan tradisional unik dari berbagai pulau di Indonesia
          </p>
        </div>

        <Link to="/regions">
          <motion.div
            className="relative z-10 bg-gradient-to-br from-warm-sand to-gold-soft/50 dark:from-night-card dark:to-gold-glow-bg/30 rounded-3xl p-12 text-center border border-gold/15 dark:border-gold-neon/15 hover:border-gold/40 dark:hover:border-gold-neon/40 transition-all duration-250 hover:shadow-lg group overflow-hidden"
            whileHover={{ scale: 1.01 }}
          >
            {/* Subtle map pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzIiBmaWxsPSIjQjg4NjBCIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNTAiIHI9IjIiIGZpbGw9IiMwRDk0ODgiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjQiIGZpbGw9IiNCODg2MEIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjE1MCIgcj0iMiIgZmlsbD0iIzBEOTQ4OCIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iMyIgZmlsbD0iI0I4ODYwQiIvPjwvc3ZnPg==')]" />

            {/* Floating map pins */}
            <div className="absolute top-8 left-12 opacity-20 dark:opacity-10">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <MapPin className="w-6 h-6 text-gold dark:text-gold-neon" />
              </motion.div>
            </div>
            <div className="absolute bottom-8 right-16 opacity-20 dark:opacity-10">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}>
                <MapPin className="w-5 h-5 text-teal dark:text-teal-neon" />
              </motion.div>
            </div>

            <div className="relative z-10">
              <p className="text-2xl font-bold text-ink dark:text-dark-heading mb-2">Jelajahi Produk Berdasarkan Region</p>
              <p className="text-stone-text dark:text-dark-muted mb-8">5 Pulau Besar & 5 Kepulauan dengan keunikan budaya masing-masing</p>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold rounded-full shadow-md hover:shadow-lg hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-250 flex items-center gap-2 mx-auto btn-glow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Lihat Semua Region <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </Link>
      </motion.section>

      {/* ═══════════════════════════════════
          TESTIMONIALS
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink dark:text-dark-heading mb-4">
            Dari <span className="gradient-text">Komunitas</span>
          </h2>
          <p className="text-stone-text dark:text-dark-muted max-w-xl mx-auto">Cerita dan testimoni dari mereka yang sudah bergabung bersama LegacyTrace.</p>
        </div>

        {reviewsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[0, 1, 2].map(i => (
              <div key={i} className="glass rounded-2xl p-8 border-l-4 border-gold/30 dark:border-gold-neon/30 animate-pulse">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 rounded bg-gold/20 dark:bg-gold-neon/20" />
                  ))}
                </div>
                <div className="h-4 bg-stone-200 dark:bg-night-border rounded mb-2 w-full" />
                <div className="h-4 bg-stone-200 dark:bg-night-border rounded mb-6 w-3/4" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-night-border" />
                  <div>
                    <div className="h-3 bg-stone-200 dark:bg-night-border rounded w-20 mb-1" />
                    <div className="h-3 bg-stone-200 dark:bg-night-border rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {(featuredReviews.length > 0 ? featuredReviews.slice(0, 3) : [
              { id: 'f1', rating: 5, comment: 'Produk UMKM berkualitas tinggi dengan cerita yang menginspirasi!', user: { id: 0, name: 'Dewi S.' }, product: { name: 'Pembeli Setia' } },
              { id: 'f2', rating: 5, comment: 'Platform ini benar-benar membantu kami jangkau pasar yang lebih luas.', user: { id: 0, name: 'Pak Santoso' }, product: { name: 'Artisan Batik' } },
              { id: 'f3', rating: 5, comment: 'Saya senang belajar tentang proses produksi yang ethical dan sustainable.', user: { id: 0, name: 'Budi M.' }, product: { name: 'Conscious Consumer' } },
            ] as Review[]).map((review, idx) => (
              <motion.div
                key={review.id}
                className="glass rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-gold dark:border-gold-neon card-hover group relative"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
              >
                {/* Large quote mark */}
                <div className="absolute top-4 right-6 text-5xl font-serif text-gold/10 dark:text-gold-neon/10 leading-none">"</div>

                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-gold dark:text-gold-neon fill-current' : 'text-stone-200 dark:text-night-border'}`} />
                  ))}
                </div>
                <p className="text-charcoal dark:text-dark-body italic mb-6 relative z-10">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-teal dark:from-gold-neon dark:to-teal-neon flex items-center justify-center text-lg">
                    <span className="text-sm font-bold text-white">{review.user?.name?.charAt(0) || '?'}</span>
                  </div>
                  <div>
                    <p className="font-bold text-ink dark:text-dark-heading text-sm">{review.user?.name || 'Anonim'}</p>
                    <p className="text-xs text-teal dark:text-teal-neon font-medium">Review: {review.product?.name || 'Produk'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ═══════════════════════════════════
          CTA SECTION
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-20 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass rounded-3xl text-center p-12 md:p-16 relative overflow-hidden border border-gold/15 dark:border-gold-neon/15 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] via-transparent to-teal/[0.03] dark:from-gold-neon/[0.06] dark:via-transparent dark:to-teal-neon/[0.06]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink dark:text-dark-heading mb-4">
              Siap <span className="gradient-text">Mengeksplorasi</span>?
            </h2>
            <p className="text-lg text-stone-text dark:text-dark-body mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan komunitas global yang mendukung perdagangan etis dan seni tradisional Indonesia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" onClick={handleProtectedClick}>
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-250 btn-glow"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mulai Jelajah Sekarang
                </motion.button>
              </Link>
              <Link to="/edutainment" onClick={handleProtectedClick}>
                <motion.button
                  className="px-8 py-4 bg-cream dark:bg-night-card text-gold dark:text-gold-neon font-semibold rounded-full border-2 border-gold dark:border-gold-neon shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-250"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pelajari Lebih Lanjut
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          PARTNERSHIP SECTION
         ═══════════════════════════════════ */}
      <motion.section
        className="hidden md:block max-w-6xl mx-auto px-8 py-20 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="glass rounded-3xl text-center p-12 relative overflow-hidden border border-cat-batik/15 dark:border-cat-batik-dark/15 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cat-batik/[0.03] to-cat-weave/[0.03] dark:from-cat-batik-dark/[0.06] dark:to-cat-weave-dark/[0.06]" />
          <div className="relative z-10">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gold dark:bg-gold-neon rounded-full mb-6 shadow-lg"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Handshake className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink dark:text-dark-heading mb-4">Punya Produk UMKM?</h2>
            <p className="text-lg text-stone-text dark:text-dark-body mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan LegacyTrace dan tampilkan produk Anda ke pasar yang lebih luas. Kami membantu UMKM Indonesia terhubung dengan konsumen yang peduli.
            </p>

            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <span className="px-4 py-2 bg-gold-soft dark:bg-gold-glow-bg text-gold dark:text-gold-neon rounded-full text-sm font-semibold">✓ Gratis Bergabung</span>
              <span className="px-4 py-2 bg-gold-soft dark:bg-gold-glow-bg text-gold dark:text-gold-neon rounded-full text-sm font-semibold">✓ Jangkauan Luas</span>
              <span className="px-4 py-2 bg-gold-soft dark:bg-gold-glow-bg text-gold dark:text-gold-neon rounded-full text-sm font-semibold">✓ Transparansi Penuh</span>
            </div>

            <Link to="/partnership">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-250 btn-glow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Ajukan Kerja Sama Sekarang
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}
