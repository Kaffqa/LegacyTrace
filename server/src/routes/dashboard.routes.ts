import { Router, Response } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/dashboard/stats - Admin only
router.get('/stats', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const [
            totalUsers,
            totalProducts,
            totalArtisans,
            totalReviews,
            totalRegions,
            totalTeamMembers,
            totalQuizQuestions,
            recentReviews,
            recentUsers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.artisan.count(),
            prisma.review.count(),
            prisma.region.count(),
            prisma.teamMember.count(),
            prisma.quizQuestion.count(),
            prisma.review.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true } },
                    product: { select: { name: true } }
                }
            }),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            })
        ])

        // Average rating
        const avgRating = await prisma.review.aggregate({ _avg: { rating: true } })

        // Products per category
        const products = await prisma.product.findMany({ select: { category: true } })
        const categoryCounts: Record<string, number> = {}
        products.forEach(p => {
            categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1
        })

        res.json({
            stats: {
                totalUsers,
                totalProducts,
                totalArtisans,
                totalReviews,
                totalRegions,
                totalTeamMembers,
                totalQuizQuestions,
                averageRating: avgRating._avg.rating || 0
            },
            categoryCounts,
            recentReviews,
            recentUsers
        })
    } catch (error) {
        console.error('Dashboard stats error:', error)
        res.status(500).json({ error: 'Gagal mengambil statistik dashboard' })
    }
})

export default router
