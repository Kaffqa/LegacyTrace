import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import artisanRoutes from './routes/artisan.routes'
import reviewRoutes from './routes/review.routes'
import regionRoutes from './routes/region.routes'
import teamRoutes from './routes/team.routes'
import quizRoutes from './routes/quiz.routes'
import dashboardRoutes from './routes/dashboard.routes'
import uploadRoutes from './routes/upload.routes'
import statsRoutes from './routes/stats.routes'
import partnershipRoutes from './routes/partnership.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
        : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/artisans', artisanRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/regions', regionRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/partnership', partnershipRoutes)

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Only listen if not running on Vercel
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`)
    })
}

export default app
