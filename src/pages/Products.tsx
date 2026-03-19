import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Product } from '../types/product'
import { ProductCard } from '../components/ProductCard'
import { BackgroundShapes } from '../components/BackgroundShapes'
import {
  Globe, Palette, Utensils, Hammer, Scissors,
  Coffee, Leaf
} from 'lucide-react'

type Category = 'all' | 'batik' | 'makanan' | 'kerajinan' | 'tenun' | 'gerabah' | 'herbal'

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFromUrl = (searchParams.get('category') as Category) || 'all'
  const [selectedCategory, setSelectedCategory] = useState<Category>(categoryFromUrl)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedCategory])

  useEffect(() => {
    setSelectedCategory(categoryFromUrl)
  }, [categoryFromUrl])

  useEffect(() => {
    api.get<Product[]>('/products')
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const categories: Array<{ value: Category; label: string; icon: React.ReactNode }> = [
    { value: 'all', label: 'Semua Produk', icon: <Globe className="w-5 h-5" /> },
    { value: 'batik', label: 'Batik', icon: <Palette className="w-5 h-5" /> },
    { value: 'makanan', label: 'Makanan', icon: <Utensils className="w-5 h-5" /> },
    { value: 'kerajinan', label: 'Kerajinan', icon: <Hammer className="w-5 h-5" /> },
    { value: 'tenun', label: 'Tenun', icon: <Scissors className="w-5 h-5" /> },
    { value: 'gerabah', label: 'Gerabah', icon: <Coffee className="w-5 h-5" /> },
    { value: 'herbal', label: 'Herbal', icon: <Leaf className="w-5 h-5" /> }
  ]

  const filtered = useMemo(() => {
    return products.filter(p => {
      return selectedCategory === 'all' || p.category === selectedCategory
    })
  }, [selectedCategory, products])

  return (
    <div className="min-h-screen pb-20 relative page-transition">
      <BackgroundShapes variant="minimal" />

      {/* Header */}
      <motion.section
        className="max-w-6xl mx-auto px-8 py-12 text-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-serif font-bold gradient-text mb-2">Jelajahi Produk Ethical</h1>
        <p className="text-lg text-stone-text dark:text-dark-body">
          Filter berdasarkan kategori untuk menemukan produk handcrafted favorit Anda
        </p>
      </motion.section>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-8 mb-8 glass rounded-2xl shadow-xl p-8 border border-stone-100/50 dark:border-night-border/50">
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <motion.button
                key={cat.value}
                className={`px-5 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night shadow-lg hover:shadow-xl hover:shadow-gold/50 dark:hover:shadow-gold-neon/50'
                  : 'glass bg-transparent text-ink dark:text-dark-body hover:bg-gold/10 dark:hover:bg-gold-neon/10'
                  }`}
                onClick={() => {
                  setSelectedCategory(cat.value)
                  setSearchParams(cat.value === 'all' ? {} : { category: cat.value })
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={selectedCategory === cat.value ? 'transform rotate-12' : ''}>{cat.icon}</span> {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-gold/30 border-t-gold dark:border-gold-neon/30 dark:border-t-gold-neon rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filtered.length > 0 ? (
            filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <ProductCard product={product} selectedCategory={selectedCategory} />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-16 text-stone-text dark:text-dark-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg">Tidak ada produk ditemukan. Coba sesuaikan filter Anda!</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}