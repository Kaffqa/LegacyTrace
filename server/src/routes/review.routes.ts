import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/reviews/featured - Public: top reviews for homepage testimonials
router.get('/featured', async (_req: Request, res: Response): Promise<void> => {
    try {
        const reviews = await prisma.review.findMany({
            where: { rating: { gte: 4 } },
            include: {
                user: { select: { id: true, name: true } },
                product: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 6
        })
        res.json(reviews)
    } catch (error) {
        console.error('Get featured reviews error:', error)
        res.status(500).json({ error: 'Gagal mengambil data featured review' })
    }
})

// GET /api/reviews?productId=X - Public
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.query
        const where = productId ? { productId: parseInt(productId as string) } : {}
        const reviews = await prisma.review.findMany({
            where,
            include: { user: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' }
        })
        res.json(reviews)
    } catch (error) {
        console.error('Get reviews error:', error)
        res.status(500).json({ error: 'Gagal mengambil data review' })
    }
})

// POST /api/reviews - User only (authenticated)
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { rating, comment, productId } = req.body

        if (!rating || !comment || !productId) {
            res.status(400).json({ error: 'Rating, komentar, dan productId wajib diisi' })
            return
        }

        if (rating < 1 || rating > 5) {
            res.status(400).json({ error: 'Rating harus antara 1-5' })
            return
        }

        // Prevent duplicate reviews: one review per user per product
        const existing = await prisma.review.findFirst({
            where: { userId: req.user!.id, productId: parseInt(productId) }
        })
        if (existing) {
            res.status(400).json({ error: 'Anda sudah memberikan review untuk produk ini' })
            return
        }

        const review = await prisma.review.create({
            data: {
                rating: parseInt(rating),
                comment,
                userId: req.user!.id,
                productId: parseInt(productId)
            },
            include: { user: { select: { id: true, name: true } } }
        })

        res.status(201).json(review)
    } catch (error) {
        console.error('Create review error:', error)
        res.status(500).json({ error: 'Gagal membuat review' })
    }
})

// PUT /api/reviews/:id - Owner only: edit own review
router.put('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const review = await prisma.review.findUnique({ where: { id: parseInt(req.params.id as string) } })
        if (!review) {
            res.status(404).json({ error: 'Review tidak ditemukan' })
            return
        }

        if (review.userId !== req.user!.id) {
            res.status(403).json({ error: 'Anda hanya bisa mengedit review milik sendiri' })
            return
        }

        const { rating, comment } = req.body
        if (!rating || !comment?.trim()) {
            res.status(400).json({ error: 'Rating dan komentar wajib diisi' })
            return
        }
        if (rating < 1 || rating > 5) {
            res.status(400).json({ error: 'Rating harus antara 1-5' })
            return
        }

        const updated = await prisma.review.update({
            where: { id: review.id },
            data: { rating: parseInt(rating), comment: comment.trim() },
            include: { user: { select: { id: true, name: true } } }
        })

        res.json(updated)
    } catch (error) {
        console.error('Update review error:', error)
        res.status(500).json({ error: 'Gagal mengupdate review' })
    }
})

// DELETE /api/reviews/:id - Owner or Admin
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const review = await prisma.review.findUnique({ where: { id: parseInt(req.params.id as string) } })
        if (!review) {
            res.status(404).json({ error: 'Review tidak ditemukan' })
            return
        }

        if (review.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
            res.status(403).json({ error: 'Tidak memiliki akses' })
            return
        }

        await prisma.review.delete({ where: { id: review.id } })
        res.json({ message: 'Review berhasil dihapus' })
    } catch (error) {
        console.error('Delete review error:', error)
        res.status(500).json({ error: 'Gagal menghapus review' })
    }
})

export default router
