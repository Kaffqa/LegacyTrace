import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Product } from '../types/product'

interface ProductCardProps {
  product: Product
  selectedCategory?: string
}


export const ProductCard = ({ product, selectedCategory }: ProductCardProps) => {
  const passportLink = selectedCategory && selectedCategory !== 'all'
    ? `/passport/${product.id}?category=${selectedCategory}`
    : `/passport/${product.id}`

  return (
    <Link to={passportLink}>
      <motion.div
        className="glass rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-stone-100/50 dark:border-night-border/50 card-hover group"
        whileHover={{ y: -12, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="relative overflow-hidden h-64 group/image">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/70 to-transparent dark:from-night/90 dark:via-night/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold rounded-full transition-all duration-250 shadow-xl hover:shadow-2xl hover:shadow-gold/50 dark:hover:shadow-gold-neon/50 btn-glow"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View Digital Passport
            </motion.button>
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col relative z-10">
          <h3 className="text-xl font-serif font-bold text-ink dark:text-dark-heading mb-1 group-hover:text-gold dark:group-hover:text-gold-neon transition-colors">{product.name}</h3>
          <p className="text-gold dark:text-gold-neon font-semibold text-sm mb-1">{product.umkm}</p>
          <p className="text-stone-text dark:text-dark-body text-sm mb-4">{product.village}</p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {(Array.isArray(product.ethicalBadges) ? product.ethicalBadges : []).map((badge, idx) => (
              <motion.span
                key={idx}
                className="bg-cream/90 dark:bg-night-card/90 backdrop-blur-md text-gold-deep dark:text-gold-neon font-semibold rounded-full border border-gold/50 dark:border-gold-neon/50 px-3 py-1 text-xs transition-all duration-300 hover:bg-gold hover:text-white dark:hover:bg-gold-neon dark:hover:text-night hover:scale-105 shadow-sm"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}