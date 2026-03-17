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
              className="text-xl text-teal dark:text-teal-neon font-semibold mb-1"
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
                  className="bg-gradient-to-r from-teal to-teal-deep dark:from-teal-neon dark:to-teal-bright text-white px-3 py-1.5 rounded-full font-semibold text-xs shadow-sm flex items-center gap-1.5"
                  whileHover={{ scale: 1.08, y: -2 }}
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
            <p className="text-stone-text dark:text-dark-body leading-relaxed">{product.umkmStory}</p>
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
            <p className="text-stone-text dark:text-dark-body leading-relaxed">{product.culturalValue}</p>
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
          ARTISAN SECTION (ENHANCED)
         ═══════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass rounded-3xl shadow-xl border border-stone-100/60 dark:border-night-border/60 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-gold/[0.06] to-teal/[0.06] dark:from-gold-neon/[0.08] dark:to-teal-neon/[0.08] px-8 py-5 border-b border-stone-100/60 dark:border-night-border/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright rounded-xl flex items-center justify-center text-white">
                <Hand className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-ink dark:text-dark-heading">Kenali Pengrajinnya</h2>
                <p className="text-xs text-stone-text dark:text-dark-muted">Artisan di balik karya ini</p>
              </div>
            </div>
          </div>

          {/* Artisan Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Artisan Identity */}
              <div className="lg:col-span-1 flex flex-col items-center text-center">
                {/* Avatar */}
                <motion.div
                  className="w-28 h-28 rounded-full overflow-hidden shadow-xl mb-5 ring-4 ring-white dark:ring-night-card bg-gradient-to-br from-gold to-teal dark:from-gold-neon dark:to-teal-neon flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  {artisanPhotoUrl ? (
                    <img
                      src={artisanPhotoUrl}
                      alt={artisanName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<span class="text-4xl text-white font-serif font-bold">${artisanName.charAt(0)}</span>`
                        }
                      }}
                    />
                  ) : (
                    <span className="text-4xl text-white font-serif font-bold">
                      {artisanName.charAt(0)}
                    </span>
                  )}
                </motion.div>

                <h3 className="text-2xl font-serif font-bold text-ink dark:text-dark-heading mb-1">{artisanName}</h3>
                <p className="text-sm text-teal dark:text-teal-neon font-semibold mb-2">
                  {product.category === 'batik' && 'Ahli Pembatik Tradisional'}
                  {product.category === 'makanan' && 'Ahli Kuliner Tradisional'}
                  {product.category === 'kerajinan' && 'Ahli Kerajinan Tradisional'}
                  {product.category === 'tenun' && 'Ahli Penenun Tradisional'}
                  {product.category === 'gerabah' && 'Ahli Pembuat Gerabah'}
                  {product.category === 'herbal' && 'Ahli Herbalis Tradisional'}
                </p>
                <p className="text-xs text-stone-text dark:text-dark-muted mb-5">
                  📍 {product.village}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="bg-gold-soft dark:bg-gold-glow-bg rounded-xl p-3 text-center">
                    <Clock className="w-5 h-5 text-gold dark:text-gold-neon mx-auto mb-1" />
                    <p className="text-xl font-bold text-gold dark:text-gold-neon">{artisanExperience}+</p>
                    <p className="text-xs text-stone-text dark:text-dark-muted">Tahun</p>
                  </div>
                  <div className="bg-teal-soft dark:bg-teal-glow-bg rounded-xl p-3 text-center">
                    <Award className="w-5 h-5 text-teal dark:text-teal-neon mx-auto mb-1" />
                    <p className="text-xl font-bold text-teal dark:text-teal-neon">Ahli</p>
                    <p className="text-xs text-stone-text dark:text-dark-muted">Level</p>
                  </div>
                </div>

                {/* Badge Tags */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  <span className="px-3 py-1 bg-gold/10 dark:bg-gold-neon/10 text-gold dark:text-gold-neon rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" /> Terampil
                  </span>
                  <span className="px-3 py-1 bg-teal/10 dark:bg-teal-neon/10 text-teal dark:text-teal-neon rounded-full text-xs font-semibold flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Tradisional
                  </span>
                </div>

                {/* WhatsApp Contact Button */}
                {artisanWhatsapp && (
                  <motion.a
                    href={`https://wa.me/${artisanWhatsapp}?text=${encodeURIComponent(`Halo, saya tertarik dengan produk "${product.name}" di LegacyTrace. Apakah produk ini masih tersedia?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Hubungi via WhatsApp
                  </motion.a>
                )}
              </div>

              {/* Right: Quote & Details */}
              <div className="lg:col-span-2 flex flex-col justify-center">
                {/* Artisan Bio */}
                <div className="mb-6 p-4 bg-gradient-to-r from-cream to-gold-soft/30 dark:from-night-card/50 dark:to-gold-glow-bg/20 rounded-xl border-l-4 border-gold dark:border-gold-neon">
                  <h4 className="text-sm font-semibold text-gold dark:text-gold-neon mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Tentang Pengrajin
                  </h4>
                  <p className="text-sm text-stone-text dark:text-dark-body leading-relaxed">
                    {artisanName} adalah pengrajin berpengalaman dengan lebih dari {artisanExperience} tahun dedikasi dalam melestarikan warisan budaya Indonesia.
                    Keahlian dan ketekunan beliau telah menghasilkan karya-karya berkualitas tinggi yang menggabungkan teknik tradisional dengan sentuhan artistik yang unik.
                  </p>
                </div>

                {/* Main Quote */}
                <div className="relative mb-6">
                  <Quote className="w-10 h-10 text-gold/20 dark:text-gold-neon/20 absolute -top-2 -left-2" />
                  <blockquote className="pl-8 text-xl italic text-ink dark:text-dark-heading leading-relaxed font-serif">
                    "{artisanQuote}"
                  </blockquote>
                  <p className="text-right text-sm text-stone-text dark:text-dark-muted mt-2 pr-2">
                    — {artisanName}
                  </p>
                </div>

                {/* Local Quote */}
                {artisanQuoteLocal && (
                  <motion.div
                    className="bg-gradient-to-r from-teal-soft/60 to-gold-soft/40 dark:from-teal-glow-bg/50 dark:to-gold-glow-bg/30 rounded-xl p-5 border-l-4 border-teal dark:border-teal-neon mb-6"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-teal dark:text-teal-neon" />
                      <p className="text-sm text-teal dark:text-teal-neon font-semibold">Dalam Bahasa Lokal:</p>
                    </div>
                    <blockquote className="text-base italic text-ink dark:text-dark-body leading-relaxed font-serif">
                      "{artisanQuoteLocal}"
                    </blockquote>
                  </motion.div>
                )}


              </div>
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