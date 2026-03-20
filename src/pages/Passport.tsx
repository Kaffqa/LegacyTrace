import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { Product, Review } from '../types/product'
import { useAuth } from '../contexts/AuthContext'
import { TimelineStep } from '../components/TimelineStep'
import { BackgroundShapes } from '../components/BackgroundShapes'
import {
  MapPin, Check, BookOpen, Leaf, Hammer, Hand,
  Award, Clock, Quote, Sparkles, ArrowRight, Star, MessageCircle, Pencil
} from 'lucide-react'

export const Passport = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set())
  const { user } = useAuth()

  // Rating form state
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)

  // Edit review state
  const [isEditing, setIsEditing] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<number | string | null>(null)

  const userReview = product?.reviews?.find(r => r.userId === user?.id) ?? null
  const userHasReviewed = !!userReview

  const refreshProduct = useCallback(() => {
    if (!productId) return
    api.get<Product>(`/products/${productId}`).then(setProduct).catch(() => {})
  }, [productId])

  const handleSubmitReview = async () => {
    if (!selectedRating || !reviewComment.trim()) {
      setReviewError('Pilih rating dan tulis komentar')
      return
    }
    setSubmittingReview(true)
    setReviewError('')
    try {
      if (isEditing && editingReviewId) {
        // Edit existing review
        await api.put(`/reviews/${editingReviewId}`, { rating: selectedRating, comment: reviewComment.trim() })
        setReviewSuccess(true)
        setIsEditing(false)
        setEditingReviewId(null)
      } else {
        // Create new review
        await api.post('/reviews', { rating: selectedRating, comment: reviewComment.trim(), productId: parseInt(productId!) })
        setReviewSuccess(true)
      }
      setSelectedRating(0)
      setReviewComment('')
      refreshProduct()
      setTimeout(() => setReviewSuccess(false), 3000)
    } catch (err: any) {
      setReviewError(err.message || 'Gagal mengirim review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleStartEdit = () => {
    if (userReview) {
      setSelectedRating(userReview.rating)
      setReviewComment(userReview.comment)
      setEditingReviewId(userReview.id)
      setIsEditing(true)
      setReviewError('')
      setReviewSuccess(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingReviewId(null)
    setSelectedRating(0)
    setReviewComment('')
    setReviewError('')
  }

  useEffect(() => {
    if (!productId) { navigate('/products'); return }
    api.get<Product>(`/products/${productId}`)
      .then(setProduct)
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [productId, navigate])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [productId])

  const handleStepScroll = (index: number) => {
    setVisibleSteps(prev => new Set([...prev, index]))
  }

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
  if (!product) return null

  // Map artisan fields from nested object for backward compat
  const artisanName = product.artisan?.name || product.artisanName || 'Pengrajin'
  const artisanExperience = product.artisan?.yearsExperience || product.artisanExperience || 0
  const artisanQuote = product.artisan?.quote || product.artisanQuote || ''
  const artisanQuoteLocal = product.artisan?.quoteLocal || product.artisanQuoteLocal || ''
  const artisanPhotoUrl = product.artisan?.photoUrl || product.artisanPhotoUrl || ''
  const artisanWhatsapp = product.artisan?.whatsapp || ''
  const steps = product.supplySteps || product.steps || []

  return (
    <div className="min-h-screen pb-20 relative page-transition">
      <BackgroundShapes variant="minimal" />

      {/* ═══════════════════════════════════
          HERO HEADER
         ═══════════════════════════════════ */}
      <motion.section
        className="relative max-w-6xl mx-auto px-8 py-10 my-8 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold-soft via-cream to-teal-soft/30 dark:from-night-card dark:via-night dark:to-gold-glow-bg/20 border border-stone-100/60 dark:border-night-border/60" />
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold/6 dark:bg-gold-neon/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal/6 dark:bg-teal-neon/6 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 dark:bg-gold-neon/10 rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold dark:text-gold-neon" />
              <span className="text-xs font-semibold text-gold dark:text-gold-neon">Digital Passport</span>
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl font-serif font-bold gradient-text mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {product.name}
            </motion.h1>
            <motion.p
              className="text-xl text-gold-deep dark:text-gold-neon font-bold mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {product.umkm}
            </motion.p>
            <motion.p
              className="text-base text-stone-text dark:text-dark-body mb-5 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <MapPin className="w-4 h-4 text-gold dark:text-gold-neon" /> {product.village}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {product.ethicalBadges.map((badge, idx) => (
                <motion.span
                  key={idx}
                  className="bg-cream/90 dark:bg-night-card/90 backdrop-blur-md text-gold-deep dark:text-gold-neon border border-gold/50 dark:border-gold-neon/50 px-3 py-1.5 rounded-full font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all duration-300 hover:bg-gold hover:text-white dark:hover:bg-gold-neon dark:hover:text-night"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Check className="w-3.5 h-3.5" /> {badge}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative group"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute -inset-2 bg-gradient-to-br from-gold/20 to-teal/20 dark:from-gold-neon/20 dark:to-teal-neon/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={product.imageUrl}
              alt={product.name}
              className="relative w-full h-72 object-cover rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          UMKM STORY & CULTURAL VALUE
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 mb-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UMKM Story */}
          <motion.div
            className="glass p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100/60 dark:border-night-border/60 group"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif font-bold text-ink dark:text-dark-heading group-hover:text-gold dark:group-hover:text-gold-neon transition-colors">Kisah UMKM</h2>
            </div>
            <p className="text-stone-text dark:text-dark-body leading-relaxed break-words">{product.umkmStory}</p>
          </motion.div>

          {/* Cultural Value */}
          <motion.div
            className="glass p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100/60 dark:border-night-border/60 group"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal to-teal-deep dark:from-teal-neon dark:to-teal-bright rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif font-bold text-ink dark:text-dark-heading group-hover:text-gold dark:group-hover:text-gold-neon transition-colors">Nilai Budaya</h2>
            </div>
            <p className="text-stone-text dark:text-dark-body leading-relaxed break-words">{product.culturalValue}</p>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          SUPPLY CHAIN TIMELINE
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 dark:bg-gold-neon/10 rounded-full mb-4">
            <Hammer className="w-4 h-4 text-gold dark:text-gold-neon" />
            <span className="text-sm font-semibold text-gold dark:text-gold-neon">Supply Chain</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-ink dark:text-dark-heading">
            Proses <span className="gradient-text">Pembuatan</span> Produk
          </h2>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gold via-teal to-gold-deep dark:from-gold-neon dark:via-teal-neon dark:to-gold-bright rounded-full"></div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <TimelineStep
                key={step.id}
                step={step}
                index={idx}
                isVisible={true}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          ARTISAN SECTION (PREMIUM REDESIGN)
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-12 mb-12 relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 top-12 bottom-0 left-8 right-8 bg-gradient-to-br from-gold/5 via-transparent to-teal/5 dark:from-gold-neon/10 dark:via-transparent dark:to-teal-neon/10 rounded-[3rem] -z-10 blur-2xl" />

        <div className="relative rounded-3xl bg-white dark:bg-night shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.15)] border border-stone-100 dark:border-night-border/50 overflow-hidden">
          
          {/* Subtle Abstract Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gold/10 to-transparent dark:from-gold-neon/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#10A37F]/10 to-transparent dark:from-teal-neon/5 rounded-full blur-2xl pointer-events-none" />

          {/* Optional texture layer */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBjeD0iMyIgY3k9IjMiIHI9IjMiLz48L2c+PC9zdmc+')] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10 w-full">
            
            {/* Left Column: Avatar & Quick Info */}
            <div className="lg:col-span-4 relative p-8 lg:p-10 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-stone-100 dark:border-night-border/50">
              
              {/* Animated Avatar */}
              <div className="relative mb-6 group cursor-default">
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-gold to-[#10A37F] dark:from-gold-neon dark:to-teal-neon rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-spin"
                  style={{ animationDuration: '20s' }}
                />
                <motion.div
                  className="w-32 h-32 rounded-full overflow-hidden relative z-10 ring-4 ring-white dark:ring-night border border-stone-100 dark:border-night-border/50 bg-stone-50 dark:bg-night-card shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {artisanPhotoUrl ? (
                    <img src={artisanPhotoUrl} alt={artisanName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-gold-deep dark:text-gold-neon font-serif font-bold">
                      {artisanName.charAt(0)}
                    </div>
                  )}
                </motion.div>
                
                {/* Floating Artisan Badge */}
                <motion.div 
                  className="absolute -bottom-1 -right-1 bg-white dark:bg-night rounded-full p-1.5 shadow-lg border border-stone-100 dark:border-night-border z-20"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright rounded-full flex items-center justify-center text-white">
                    <Award className="w-4 h-4" />
                  </div>
                </motion.div>
              </div>

              <h3 className="text-xl font-serif font-bold text-ink dark:text-dark-heading mb-1.5">{artisanName}</h3>
              <p className="text-xs font-bold tracking-wider uppercase text-[#10A37F] dark:text-teal-neon mb-4">
                  {product.category === 'batik' ? 'Ahli Pembatik Tradisional' :
                   product.category === 'makanan' ? 'Ahli Kuliner Tradisional' :
                   product.category === 'kerajinan' ? 'Ahli Kerajinan Tradisional' :
                   product.category === 'tenun' ? 'Ahli Penenun Tradisional' :
                   product.category === 'gerabah' ? 'Ahli Pembuat Gerabah' :
                   product.category === 'herbal' ? 'Ahli Herbalis Tradisional' : 'Pengrajin Ahli'}
              </p>
              
              <div className="inline-flex items-center gap-1.5 text-stone-text dark:text-dark-muted text-xs mb-8 bg-stone-50/80 dark:bg-night-card/50 px-3 py-1.5 rounded-full border border-stone-200/50 dark:border-night-border/50 backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-coral dark:text-coral-neon" />
                <span className="font-medium">{product.village}</span>
              </div>

              {/* Minimal Stats Layout */}
              <div className="flex gap-3 w-full mb-8 max-w-xs">
                <div className="flex-1 bg-gradient-to-b from-[#FAF8F5] to-white dark:from-night-card/30 dark:to-night-card/10 p-4 rounded-2xl border border-stone-100 dark:border-night-border hover:shadow-sm transition-shadow">
                  <p className="text-2xl font-bold text-gold-deep dark:text-gold-neon mb-1">{artisanExperience}<span className="text-lg">+</span></p>
                  <p className="text-[9px] font-bold text-stone-text/70 dark:text-dark-muted uppercase tracking-wider">Tahun Nyata</p>
                </div>
                <div className="flex-1 bg-gradient-to-b from-[#F2FBF8] to-white dark:from-teal-900/10 dark:to-night-card/10 p-4 rounded-2xl border border-stone-100 dark:border-night-border hover:shadow-sm transition-shadow">
                  <p className="text-2xl font-bold text-[#10A37F] dark:text-teal-neon mb-1 mt-0.5"><Sparkles className="w-5 h-5 mx-auto" /></p>
                  <p className="text-[9px] font-bold text-stone-text/70 dark:text-dark-muted uppercase tracking-wider mt-1.5">{product.category === 'batik' ? 'Maestro' : 'Ahli'}</p>
                </div>
              </div>

              {/* Soft WhatsApp CTA */}
              {artisanWhatsapp && (
                <motion.a
                  href={`https://wa.me/${artisanWhatsapp}?text=${encodeURIComponent(`Halo, saya tertarik dengan produk "${product.name}" di LegacyTrace.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full relative group rounded-xl overflow-hidden block"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-[#10A37F] opacity-[0.85] group-hover:opacity-100 transition-opacity duration-300 dark:bg-emerald-600" />
                  <div className="relative flex items-center justify-center gap-2 px-5 py-3 text-white">
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-semibold tracking-wide">Hubungi WhatsApp</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  </div>
                </motion.a>
              )}
            </div>

            {/* Right Column: Editorial Bio & Quotes */}
            <div className="lg:col-span-8 p-8 lg:p-10 xl:p-14 flex flex-col justify-center h-full">
              
              {/* Top Section: Quotes */}
              <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 mb-8">
                
                {/* Highlight Quote Box */}
                <div className="relative flex-1">
                  <Quote className="w-14 h-14 text-gold-deep/[0.08] dark:text-gold-neon/[0.08] absolute -top-6 -left-4 transform -rotate-6" />
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative z-10"
                  >
                    <h4 className="text-[10px] font-bold text-gold-deep dark:text-gold-neon uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                      <span className="w-6 h-[2px] bg-gold-deep dark:bg-gold-neon mix-blend-multiply dark:mix-blend-screen" /> Visi Artisan
                    </h4>
                    <blockquote className="text-xl lg:text-3xl font-serif italic text-ink dark:text-dark-heading leading-[1.4] tracking-tight">
                      "{artisanQuote}"
                    </blockquote>
                  </motion.div>
                </div>
              </div>

              {/* Elegant Text Divider */}
              <div className="w-full h-px bg-gradient-to-r from-stone-200 via-stone-100 to-transparent dark:from-night-border dark:via-night-border/50 mb-8" />

              {/* Bottom Section: Bio Paragraph */}
              <motion.div 
                className="prose prose-stone dark:prose-invert max-w-none text-stone-text dark:text-dark-body text-sm lg:text-base leading-relaxed break-words"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                   <div className="flex flex-col">
                       <h5 className="font-serif text-lg font-bold text-ink dark:text-dark-heading tracking-wide">Kisah {artisanName}</h5>
                       <p className="text-xs text-stone-text/70 dark:text-dark-muted/70 uppercase tracking-widest mt-0.5">Legenda & Dedikasi</p>
                   </div>
                </div>
                <p>
                  <span className="font-serif text-4xl float-left mr-3 pt-1 text-gold-deep dark:text-gold-neon leading-none">
                    {artisanName.charAt(0)}
                  </span>
                  {artisanName.substring(1)} adalah pengrajin berpengalaman dengan lebih dari <strong>{artisanExperience} tahun dedikasi</strong> dalam melestarikan warisan budaya Indonesia. 
                  Keahlian dan ketekunan beliau telah menghasilkan karya-karya berkualitas tinggi yang menggabungkan teknik tradisional dengan sentuhan artistik yang unik, berkontribusi pada {product.culturalValue?.toLowerCase() || 'keanekaragaman lokal'}.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          RATING & REVIEWS SECTION
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Average Rating Summary */}
        {product.reviews && product.reviews.length > 0 && (() => {
          const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          return (
            <div className="glass rounded-2xl p-8 mb-8 text-center border border-stone-100/60 dark:border-night-border/60">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-serif font-bold text-gold dark:text-gold-neon">{avgRating.toFixed(1)}</span>
                <span className="text-lg text-stone-text dark:text-dark-muted">/5</span>
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'text-gold dark:text-gold-neon fill-current' : 'text-stone-200 dark:text-night-border'}`} />
                ))}
              </div>
              <p className="text-sm text-stone-text dark:text-dark-muted">Berdasarkan {product.reviews.length} ulasan</p>
            </div>
          )
        })()}

        {/* Rating Form — new review or edit mode */}
        {user && (!userHasReviewed || isEditing) ? (
          <motion.div
            className="glass rounded-2xl p-8 mb-8 border border-stone-100/60 dark:border-night-border/60"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-ink dark:text-dark-heading flex items-center gap-2">
                <Star className="w-5 h-5 text-gold dark:text-gold-neon" /> {isEditing ? 'Edit Review' : 'Beri Rating'}
              </h3>
              {isEditing && (
                <motion.button
                  onClick={handleCancelEdit}
                  className="text-sm text-stone-text dark:text-dark-muted hover:text-coral dark:hover:text-coral-neon transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Batal
                </motion.button>
              )}
            </div>

            {/* Star Selector */}
            <div className="flex gap-2 mb-5">
              {[1, 2, 3, 4, 5].map(star => (
                <motion.button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Star className={`w-8 h-8 transition-colors duration-200 ${
                    star <= (hoverRating || selectedRating)
                      ? 'text-gold dark:text-gold-neon fill-current'
                      : 'text-stone-200 dark:text-night-border'
                  }`} />
                </motion.button>
              ))}
              {selectedRating > 0 && (
                <span className="ml-2 text-sm text-stone-text dark:text-dark-muted self-center">
                  {selectedRating === 1 && 'Kurang'}
                  {selectedRating === 2 && 'Cukup'}
                  {selectedRating === 3 && 'Baik'}
                  {selectedRating === 4 && 'Sangat Baik'}
                  {selectedRating === 5 && 'Luar Biasa!'}
                </span>
              )}
            </div>

            {/* Comment */}
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="Tulis ulasan Anda tentang produk ini..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text focus:ring-2 focus:ring-gold/50 outline-none text-sm resize-none mb-4"
            />

            {reviewError && (
              <p className="text-sm text-coral dark:text-coral-neon mb-3">{reviewError}</p>
            )}
            {reviewSuccess && (
              <p className="text-sm text-teal dark:text-teal-neon mb-3">✓ Review berhasil {isEditing ? 'diperbarui' : 'dikirim'}!</p>
            )}

            <motion.button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="px-6 py-3 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-300 disabled:opacity-50 btn-glow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {submittingReview ? 'Mengirim...' : isEditing ? 'Simpan Perubahan' : 'Kirim Review'}
            </motion.button>
          </motion.div>
        ) : user && userHasReviewed && !isEditing ? (
          /* Show user's existing review with Edit button */
          <motion.div
            className="glass rounded-2xl p-8 mb-8 border border-gold/20 dark:border-gold-neon/20"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-serif font-bold text-ink dark:text-dark-heading flex items-center gap-2">
                <Star className="w-5 h-5 text-gold dark:text-gold-neon" /> Review Anda
              </h3>
              <motion.button
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-4 py-2 bg-gold/10 dark:bg-gold-neon/10 text-gold dark:text-gold-neon rounded-lg text-sm font-semibold hover:bg-gold/20 dark:hover:bg-gold-neon/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Pencil className="w-4 h-4" /> Edit
              </motion.button>
            </div>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`w-5 h-5 ${star <= userReview!.rating ? 'text-gold dark:text-gold-neon fill-current' : 'text-stone-200 dark:text-night-border'}`} />
              ))}
              <span className="ml-2 text-sm text-stone-text dark:text-dark-muted">{userReview!.rating}/5</span>
            </div>
            <p className="text-stone-text dark:text-dark-body leading-relaxed">{userReview!.comment}</p>
            {userReview!.updatedAt && userReview!.updatedAt !== userReview!.createdAt && (
              <p className="text-xs text-stone-text/60 dark:text-dark-muted/60 mt-3 italic">Diedit pada {new Date(userReview!.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            )}
          </motion.div>
        ) : !user ? (
          <div className="glass rounded-2xl p-8 mb-8 text-center border border-stone-100/60 dark:border-night-border/60">
            <p className="text-stone-text dark:text-dark-muted mb-4">Masuk untuk memberikan rating dan ulasan</p>
            <Link to="/login">
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold rounded-xl shadow-lg btn-glow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Masuk
              </motion.button>
            </Link>
          </div>
        ) : null}

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-ink dark:text-dark-heading mb-4">Ulasan Produk ({product.reviews.length})</h3>
            {product.reviews.map(review => (
              <motion.div
                key={review.id}
                className="glass rounded-2xl p-6 border border-stone-100/60 dark:border-night-border/60"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-teal dark:from-gold-neon dark:to-teal-neon flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{review.user?.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-ink dark:text-dark-heading text-sm">{review.user?.name || 'Anonim'}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-gold dark:text-gold-neon fill-current' : 'text-stone-200 dark:text-night-border'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.createdAt && (
                    <span className="text-xs text-stone-text dark:text-dark-muted">
                      {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-text dark:text-dark-body leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ═══════════════════════════════════
          QUIZ SECTION
         ═══════════════════════════════════ */}

    </div>
  )
}