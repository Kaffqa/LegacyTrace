import { motion } from 'framer-motion'
import { SupplyStep } from '../types/product'
import { User, MapPin } from 'lucide-react'

interface TimelineStepProps {
  step: SupplyStep
  index: number
  isVisible: boolean
}

export const TimelineStep = ({ step, index, isVisible }: TimelineStepProps) => {
  const isRight = index % 2 === 0

  return (
    <motion.div
      className="relative flex items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Side - Empty or Content */}
      <div className="w-1/2 pr-4 md:pr-12">
        {!isRight && (
          <motion.div
            className="glass p-5 md:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ml-auto max-w-sm md:max-w-lg border border-stone-100/60 dark:border-night-border/60"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-right">
              {step.imageUrl && <img src={step.imageUrl} alt={step.title} className="w-full h-32 md:h-48 object-cover rounded-lg mb-4 bg-stone-100 dark:bg-night-card shadow-sm" />}
              <h4 className="text-base md:text-xl font-serif font-bold text-gold dark:text-gold-neon mb-3">{step.title}</h4>
              <p className="text-xs md:text-base text-stone-text dark:text-dark-body font-semibold mb-2 flex items-center gap-2 justify-end"><User className="w-4 h-4" /> {step.actor}</p>
              <p className="text-xs md:text-base text-stone-text dark:text-dark-body font-semibold mb-4 flex items-center gap-2 justify-end"><MapPin className="w-4 h-4" /> {step.location}</p>
              <p className="text-ink dark:text-dark-body leading-relaxed text-sm md:text-base mb-4 break-words">{step.description}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Center Line with Marker */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
        <motion.div
          className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-gold to-teal dark:from-gold-neon dark:to-teal-neon rounded-full shadow-xl flex items-center justify-center"
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className="text-white font-bold text-lg md:text-2xl">{step.icon || ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'][index] || index + 1}</span>
        </motion.div>
      </div>

      {/* Right Side - Empty or Content */}
      <div className="w-1/2 pl-4 md:pl-12">
        {isRight && (
          <motion.div
            className="glass p-5 md:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mr-auto max-w-sm md:max-w-lg border border-stone-100/60 dark:border-night-border/60"
            whileHover={{ scale: 1.02 }}
          >
            {step.imageUrl && <img src={step.imageUrl} alt={step.title} className="w-full h-32 md:h-48 object-cover rounded-lg mb-4 bg-stone-100 dark:bg-night-card shadow-sm" />}
            <h4 className="text-base md:text-xl font-serif font-bold text-gold dark:text-gold-neon mb-3">{step.title}</h4>
            <p className="text-xs md:text-base text-stone-text dark:text-dark-body font-semibold mb-2 flex items-center gap-2"><User className="w-4 h-4" /> {step.actor}</p>
            <p className="text-xs md:text-base text-stone-text dark:text-dark-body font-semibold mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" /> {step.location}</p>
            <p className="text-ink dark:text-dark-body leading-relaxed text-sm md:text-base mb-4 break-words">{step.description}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}