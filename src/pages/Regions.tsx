import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Region } from '../types/product'
import {
  Map, Palmtree, Mountain, Anchor, Bird,
  Palette, Utensils, Hammer, Scissors, Coffee, Leaf,
  ArrowRight, Leaf as LeafIcon, Sun, Compass
} from 'lucide-react'
import { BackgroundShapes } from '../components/BackgroundShapes'
import { useAuth } from '../contexts/AuthContext'
import { LoginModal } from '../components/LoginModal'

export const Regions = () => {
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, isOffline } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!user && !isOffline) {
      e.preventDefault()
      setIsLoginModalOpen(true)
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    api.get<Region[]>('/regions')
      .then(data => {
        setRegions(data)
        if (data.length > 0) setSelectedRegion(data[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const scrollToDetail = () => {
    const detailSection = document.getElementById('region-detail')
    if (detailSection) {
      detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region)
    setTimeout(scrollToDetail, 100)
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

  const pulauBesar = regions.slice(0, 5)
  const pulauKecil = regions.slice(5)

  // Helper to get icon based on category or region name
  const getIcon = (type: string, className = "w-8 h-8") => {
    const lower = type.toLowerCase()
    // Regions
    if (lower.includes('jawa') || lower.includes('java')) return <Mountain className={className} />
    if (lower.includes('sumatra')) return <Palmtree className={className} />
    if (lower.includes('kalimantan')) return <Leaf className={className} />
    if (lower.includes('sulawesi')) return <Anchor className={className} />
    if (lower.includes('papua')) return <Bird className={className} />
    if (lower.includes('bali')) return <Sun className={className} />

    // Categories
    if (lower.includes('batik')) return <Palette className={className} />
    if (lower.includes('makanan') || lower.includes('snacks')) return <Utensils className={className} />
    if (lower.includes('crafts') || lower.includes('kerajinan')) return <Hammer className={className} />
    if (lower.includes('woven') || lower.includes('tenun')) return <Scissors className={className} />
    if (lower.includes('pottery') || lower.includes('gerabah')) return <Coffee className={className} />
    if (lower.includes('herbal')) return <LeafIcon className={className} />

    // Default
    return <Map className={className} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gold/30 border-t-gold dark:border-gold-neon/30 dark:border-t-gold-neon rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden page-transition">
      <BackgroundShapes variant="minimal" />

      {/* Header */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-16 text-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 dark:bg-gold-neon/10 rounded-full mb-6">
          <Compass className="w-4 h-4 text-gold dark:text-gold-neon" />
          <span className="text-sm font-semibold text-gold dark:text-gold-neon">Peta Nusantara</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold gradient-text mb-4">Jelajahi Nusantara</h1>
        <p className="text-lg text-stone-text dark:text-dark-body max-w-2xl mx-auto leading-relaxed">
          Temukan kerajinan tradisional unik dari 5 pulau besar dan 5 pulau kecil terkenal Indonesia.
        </p>
      </motion.section>

      {/* Pulau Besar Section */}
      {pulauBesar.length > 0 && (
        <motion.section
          className="max-w-6xl mx-auto px-8 mb-16 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-serif font-bold text-gold dark:text-gold-neon mb-8 flex items-center gap-3">
            <Map className="w-6 h-6" /> Pulau Besar
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {pulauBesar.map((region) => (
              <motion.button
                key={region.id}
                onClick={() => handleRegionSelect(region)}
                className={`p-6 rounded-2xl font-semibold transition-all duration-300 text-center group ${selectedRegion?.id === region.id
                  ? 'bg-gradient-to-br from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night shadow-lg scale-105 ring-4 ring-gold/20 dark:ring-gold-neon/20'
                  : 'glass border border-stone-100/60 dark:border-night-border/60 text-stone-text dark:text-dark-body hover:border-gold dark:hover:border-gold-neon hover:shadow-md'
                  }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={`mb-3 flex justify-center transition-colors ${selectedRegion?.id === region.id ? 'text-white dark:text-night' : 'text-gold dark:text-gold-neon group-hover:text-gold-deep dark:group-hover:text-gold-bright'}`}>
                  {getIcon(region.name, "w-10 h-10")}
                </span>
                {region.name}
              </motion.button>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Pulau Kecil Section */}
      {pulauKecil.length > 0 && (
        <motion.section
          className="max-w-6xl mx-auto px-8 mb-20 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-serif font-bold text-gold dark:text-gold-neon mb-8 flex items-center gap-3">
            <Sun className="w-6 h-6" /> Pulau Kecil Terkenal
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {pulauKecil.map((region) => (
              <motion.button
                key={region.id}
                onClick={() => handleRegionSelect(region)}
                className={`p-6 rounded-2xl font-semibold transition-all duration-300 text-center group ${selectedRegion?.id === region.id
                  ? 'bg-gradient-to-br from-teal to-teal-deep dark:from-teal-neon dark:to-teal-bright text-white shadow-lg scale-105 ring-4 ring-teal/20 dark:ring-teal-neon/20'
                  : 'glass border border-stone-100/60 dark:border-night-border/60 text-stone-text dark:text-dark-body hover:border-teal dark:hover:border-teal-neon hover:shadow-md'
                  }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={`mb-3 flex justify-center transition-colors ${selectedRegion?.id === region.id ? 'text-white' : 'text-teal dark:text-teal-neon group-hover:text-teal-deep dark:group-hover:text-teal-bright'}`}>
                  {getIcon(region.name, "w-10 h-10")}
                </span>
                {region.name}
              </motion.button>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Region Detail */}
      {selectedRegion && (
        <motion.section id="region-detail" className="max-w-6xl mx-auto px-8 mb-12 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRegion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-3xl p-8 md:p-12 shadow-xl border border-stone-100/60 dark:border-night-border/60"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                <div className="p-6 bg-gold-soft dark:bg-gold-glow-bg rounded-2xl shadow-inner text-gold dark:text-gold-neon">
                  {getIcon(selectedRegion.name, "w-16 h-16")}
                </div>
                <div className="flex-1">
                  <h3 className="text-4xl font-serif font-bold text-ink dark:text-dark-heading mb-3">{selectedRegion.name}</h3>
                  <p className="text-stone-text dark:text-dark-body text-lg leading-relaxed">{selectedRegion.description}</p>
                </div>
              </div>

              {/* Products */}
              <div className="mt-12">
                <h4 className="text-2xl font-serif font-bold text-gold dark:text-gold-neon mb-6 border-b border-stone-100 dark:border-night-border pb-4">Produk Unggulan</h4>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {selectedRegion.products.map((product) => (
                    <motion.div
                      key={product.id}
                      className="glass rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100/60 dark:border-night-border/60 hover:border-gold/30 dark:hover:border-gold-neon/30 group card-hover"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="mb-4 text-gold dark:text-gold-neon group-hover:scale-110 transition-transform duration-300">
                        {getIcon(product.category, "w-8 h-8")}
                      </div>
                      <h5 className="font-serif font-bold text-ink dark:text-dark-heading mb-2 text-sm line-clamp-2 group-hover:text-gold dark:group-hover:text-gold-neon transition-colors">{product.name}</h5>
                      <p className="text-xs text-teal dark:text-teal-neon font-semibold mb-1 uppercase tracking-wider">{product.category}</p>
                      <p className="text-xs text-stone-text dark:text-dark-body truncate">{product.umkm}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      )}

      {/* Footer CTA */}
      <motion.section
        className="max-w-6xl mx-auto px-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass rounded-3xl p-12 text-center border border-gold/15 dark:border-gold-neon/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-teal/[0.03] dark:from-gold-neon/[0.06] dark:to-teal-neon/[0.06]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold text-ink dark:text-dark-heading mb-3">Ingin <span className="gradient-text">Mengeksplorasi</span> Lebih Lanjut?</h2>
            <p className="text-lg text-stone-text dark:text-dark-body mb-8">Lihat semua produk dari region pilihan Anda</p>
            <Link to="/products" onClick={handleProtectedClick}>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-300 flex items-center gap-2 mx-auto btn-glow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Jelajahi Semua Produk <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}