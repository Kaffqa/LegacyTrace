import { motion } from 'framer-motion'
import {
    Palette, Utensils, Hammer, Scissors, Coffee, Leaf,
    ShieldCheck, QrCode, Heart, Search
} from 'lucide-react'

interface HeroVisualProps {
    stats?: {
        totalProducts: number
        totalArtisans: number
    } | null
}

/* ── Orbiting category icons ── */
const orbitItems = [
    { icon: <Palette className="w-5 h-5" />, label: 'Batik', color: 'text-cat-batik dark:text-cat-batik-dark', bg: 'bg-purple-50 dark:bg-purple-950/40' },
    { icon: <Utensils className="w-5 h-5" />, label: 'Makanan', color: 'text-coral dark:text-coral-neon', bg: 'bg-coral-soft dark:bg-coral-glow-bg' },
    { icon: <Hammer className="w-5 h-5" />, label: 'Kerajinan', color: 'text-teal dark:text-teal-neon', bg: 'bg-teal-soft dark:bg-teal-glow-bg' },
    { icon: <Scissors className="w-5 h-5" />, label: 'Tenun', color: 'text-cat-weave dark:text-cat-weave-dark', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
    { icon: <Coffee className="w-5 h-5" />, label: 'Gerabah', color: 'text-cat-pottery dark:text-cat-pottery-dark', bg: 'bg-amber-50 dark:bg-amber-950/40' },
    { icon: <Leaf className="w-5 h-5" />, label: 'Herbal', color: 'text-cat-herbal dark:text-cat-herbal-dark', bg: 'bg-green-50 dark:bg-green-950/40' },
]

export const HeroVisual = ({ stats }: HeroVisualProps) => {
    /* ── Floating stat mini-cards (dynamic from API) ── */
    const floatingCards = [
        { value: stats ? `${stats.totalProducts}+` : '...', label: 'Produk', icon: <QrCode className="w-4 h-4" />, x: '8%', y: '12%', delay: 0 },
        { value: stats ? `${stats.totalArtisans}+` : '...', label: 'Artisan', icon: <Heart className="w-4 h-4" />, x: '72%', y: '8%', delay: 0.3 },
        { value: '100%', label: 'Transparan', icon: <ShieldCheck className="w-4 h-4" />, x: '68%', y: '76%', delay: 0.6 },
    ]

    const orbitRadius = 140
    const centerX = 50 // percent
    const centerY = 50 // percent

    return (
        <div className="relative w-full h-full min-h-[420px] flex items-center justify-center">
            {/* ── Layered gradient background ── */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-soft/60 via-gold-soft/40 to-coral-soft/40 dark:from-gold-glow-bg/40 dark:via-gold-glow-bg/20 dark:to-coral-glow-bg/30" />

                {/* Animated gradient orbs */}
                {/* Single ambient gradient orb (reduced from 3 for performance) */}
                <motion.div
                    className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-gold/20 to-gold-deep/10 dark:from-gold-neon/15 dark:to-gold-bright/5 blur-3xl"
                    style={{ top: '20%', left: '25%', willChange: 'transform' }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Decorative grid dots */}
                <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            {/* ── Orbit ring ── */}
            <motion.div
                className="absolute rounded-full border border-dashed border-gold/15 dark:border-gold-neon/15"
                style={{
                    width: orbitRadius * 2,
                    height: orbitRadius * 2,
                    left: `calc(${centerX}% - ${orbitRadius}px)`,
                    top: `calc(${centerY}% - ${orbitRadius}px)`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            />

            {/* Second orbit ring */}
            <motion.div
                className="absolute rounded-full border border-dashed border-gold/10 dark:border-gold-neon/10"
                style={{
                    width: orbitRadius * 2 + 60,
                    height: orbitRadius * 2 + 60,
                    left: `calc(${centerX}% - ${orbitRadius + 30}px)`,
                    top: `calc(${centerY}% - ${orbitRadius + 30}px)`,
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            />

            {/* ── Orbiting category icons ── */}
            {orbitItems.map((item, i) => {
                const angle = (360 / orbitItems.length) * i
                const rad = (angle * Math.PI) / 180
                const x = Math.cos(rad) * orbitRadius
                const y = Math.sin(rad) * orbitRadius

                return (
                    <motion.div
                        key={i}
                        className="absolute z-20"
                        style={{
                            left: `calc(${centerX}% + ${x}px - 22px)`,
                            top: `calc(${centerY}% + ${y}px - 22px)`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.12, type: 'spring', stiffness: 200 }}
                    >
                        <motion.div
                            className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center ${item.color} shadow-lg backdrop-blur-sm border border-white/30 dark:border-white/10 cursor-default`}
                            whileHover={{ scale: 1.25, rotate: 10 }}
                            animate={{
                                y: [0, -6, 0],
                            }}
                            transition={{
                                y: { duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 },
                            }}
                        >
                            {item.icon}
                        </motion.div>
                    </motion.div>
                )
            })}

            {/* ── Center piece — Supply chain hub ── */}
            <motion.div
                className="relative z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
            >
                {/* Outer glow ring */}
                <motion.div
                    className="absolute -inset-6 rounded-full bg-gradient-to-br from-gold/30 to-gold-deep/20 dark:from-gold-neon/25 dark:to-gold-bright/15 blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Pulsing ring */}
                <motion.div
                    className="absolute -inset-3 rounded-full border-2 border-gold/20 dark:border-gold-neon/15"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Main center circle */}
                <motion.div
                    className="w-28 h-28 rounded-full bg-gradient-to-br from-gold via-gold-deep to-gold dark:from-gold-neon dark:via-gold-bright dark:to-gold-neon shadow-2xl flex items-center justify-center relative overflow-hidden"
                    animate={{
                        boxShadow: [
                            '0 0 30px rgba(184,134,11,0.3)',
                            '0 0 50px rgba(184,134,11,0.5)',
                            '0 0 30px rgba(184,134,11,0.3)',
                        ]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {/* Inner decorative rings */}
                    <div className="absolute inset-1 rounded-full border-2 border-white/15 dark:border-night/15" />
                    <div className="absolute inset-3 rounded-full border border-white/10 dark:border-night/10" />

                    {/* Rotating background shimmer */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-conic from-white/10 via-transparent to-white/10"
                        style={{ background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.12), transparent, rgba(255,255,255,0.12))' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Supply chain flow icons */}
                    <div className="relative z-10 flex flex-col items-center gap-0.5">
                        {/* Top icon — Discover */}
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Search className="w-4 h-4 text-white/80 dark:text-night/70" />
                        </motion.div>

                        {/* Center icon — Verify (main) */}
                        <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <ShieldCheck className="w-7 h-7 text-white dark:text-night" />
                        </motion.div>

                        {/* Bottom icon — Support */}
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Heart className="w-4 h-4 text-white/80 dark:text-night/70" />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            {/* ── Floating stat cards ── */}
            {floatingCards.map((card, i) => (
                <motion.div
                    key={i}
                    className="absolute z-30"
                    style={{ left: card.x, top: card.y }}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.8 + card.delay, duration: 0.6, type: 'spring' }}
                >
                    <motion.div
                        className="glass rounded-xl px-3.5 py-2.5 shadow-xl border border-gold/10 dark:border-gold-neon/10 backdrop-blur-xl cursor-default"
                        whileHover={{ scale: 1.08, y: -3 }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            y: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 },
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold/15 to-gold-deep/15 dark:from-gold-neon/20 dark:to-gold-bright/20 flex items-center justify-center text-gold dark:text-gold-neon">
                                {card.icon}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-ink dark:text-dark-heading leading-none">{card.value}</div>
                                <div className="text-[10px] text-stone-text dark:text-dark-muted font-medium">{card.label}</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ))}

            {/* ── Animated connection lines (SVG) ── */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 400 420">
                {/* Animated path 1 */}
                <motion.path
                    d="M 80 80 Q 200 150 320 80"
                    fill="none"
                    stroke="url(#gold-gradient)"
                    strokeWidth="1"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 2, delay: 1.2 }}
                />
                {/* Animated path 2 */}
                <motion.path
                    d="M 100 340 Q 200 280 300 340"
                    fill="none"
                    stroke="url(#gold-gradient-2)"
                    strokeWidth="1"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 2, delay: 1.5 }}
                />
                {/* Gradient defs */}
                <defs>
                    <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#B8860B" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#DAA520" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="gold-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#DAA520" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#B8860B" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Floating particles removed for performance (was 8 infinite animations) */}
        </div>
    )
}
