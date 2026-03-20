import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/regions - Public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const regions = await prisma.region.findMany({
            include: { products: true }
        })
        res.json(regions)
    } catch (error) {
        console.error('Get regions error:', error)
        res.status(500).json({ error: 'Gagal mengambil data wilayah' })
    }
})

// GET /api/regions/:id - Public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const region = await prisma.region.findUnique({
            where: { id: parseInt(req.params.id as string) },
            include: { products: true }
        })
        if (!region) {
            res.status(404).json({ error: 'Wilayah tidak ditemukan' })
            return
        }
        res.json(region)
    } catch (error) {
        console.error('Get region error:', error)
        res.status(500).json({ error: 'Gagal mengambil data wilayah' })
    }
})

// POST /api/regions - Admin
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, emoji, description, products } = req.body
        const region = await prisma.region.create({
            data: {
                name, emoji, description,
                products: products ? { create: products } : undefined
            },
            include: { products: true }
        })
        res.status(201).json(region)
    } catch (error) {
        console.error('Create region error:', error)
        res.status(500).json({ error: 'Gagal membuat wilayah' })
    }
})

// PUT /api/regions/:id - Admin
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, emoji, description } = req.body
        const region = await prisma.region.update({
            where: { id: parseInt(req.params.id as string) },
            data: { name, emoji, description },
            include: { products: true }
        })
        res.json(region)
    } catch (error) {
        console.error('Update region error:', error)
        res.status(500).json({ error: 'Gagal mengupdate wilayah' })
    }
})

// DELETE /api/regions/:id - Admin
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await prisma.region.delete({ where: { id: parseInt(req.params.id as string) } })
        res.json({ message: 'Wilayah berhasil dihapus' })
    } catch (error) {
        console.error('Delete region error:', error)
        res.status(500).json({ error: 'Gagal menghapus wilayah' })
    }
})

export default router
