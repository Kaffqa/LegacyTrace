import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/artisans - Public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const artisans = await prisma.artisan.findMany({
            include: { products: { select: { id: true, name: true, category: true, imageUrl: true } } }
        })
        res.json(artisans)
    } catch (error) {
        console.error('Get artisans error:', error)
        res.status(500).json({ error: 'Gagal mengambil data artisan' })
    }
})

// GET /api/artisans/:id - Public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const artisan = await prisma.artisan.findUnique({
            where: { id: parseInt(req.params.id as string) },
            include: { products: true }
        })
        if (!artisan) {
            res.status(404).json({ error: 'Artisan tidak ditemukan' })
            return
        }
        res.json(artisan)
    } catch (error) {
        console.error('Get artisan error:', error)
        res.status(500).json({ error: 'Gagal mengambil data artisan' })
    }
})

// POST /api/artisans - Admin
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const artisan = await prisma.artisan.create({ data: req.body })
        res.status(201).json(artisan)
    } catch (error) {
        console.error('Create artisan error:', error)
        res.status(500).json({ error: 'Gagal membuat artisan' })
    }
})

// PUT /api/artisans/:id - Admin
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const artisan = await prisma.artisan.update({
            where: { id: parseInt(req.params.id as string) },
            data: req.body
        })
        res.json(artisan)
    } catch (error) {
        console.error('Update artisan error:', error)
        res.status(500).json({ error: 'Gagal mengupdate artisan' })
    }
})

// DELETE /api/artisans/:id - Admin
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await prisma.artisan.delete({ where: { id: parseInt(req.params.id as string) } })
        res.json({ message: 'Artisan berhasil dihapus' })
    } catch (error) {
        console.error('Delete artisan error:', error)
        res.status(500).json({ error: 'Gagal menghapus artisan' })
    }
})

export default router
