import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/stats — Public: platform statistics for homepage
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const [
            totalProducts,
            totalArtisans,
            totalRegions,
            totalReviews,
            distinctCategories,
            avgRating
        ] = await Promise.all([
            prisma.product.count(),
            prisma.artisan.count(),
            prisma.region.count(),
            prisma.review.count(),
            prisma.product.findMany({
                select: { category: true },
                distinct: ['category']
            }),
            prisma.review.aggregate({ _avg: { rating: true } })
        ])

        res.json({
            totalProducts,
            totalArtisans,
            totalRegions,
            totalCategories: distinctCategories.length,
            totalReviews,
            averageRating: Math.round((avgRating._avg.rating || 0) * 10) / 10
        })
    } catch (error) {
        console.error('Get stats error:', error)
        res.status(500).json({ error: 'Gagal mengambil statistik' })
    }
})

export default router
