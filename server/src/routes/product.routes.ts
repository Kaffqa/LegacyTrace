import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// Normalize ethicalBadges input: admin may send string or array, Prisma Json needs array
function normalizeEthicalBadges(input: unknown): string[] {
    if (Array.isArray(input)) return input
    if (typeof input === 'string') {
        try {
            const parsed = JSON.parse(input)
            if (Array.isArray(parsed)) return parsed
        } catch { /* not JSON */ }
        return input.split(',').map(s => s.trim()).filter(Boolean)
    }
    return []
}

// GET /api/products - Public: get all products
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.product.findMany({
            include: {
                artisan: true,
                supplySteps: { orderBy: { sortOrder: 'asc' } },
                reviews: { include: { user: { select: { id: true, name: true } } } }
            }
        })

        res.json(products)
    } catch (error) {
        console.error('Get products error:', error)
        res.status(500).json({ error: 'Gagal mengambil data produk' })
    }
})

// GET /api/products/:id - Public: get single product
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id as string) },
            include: {
                artisan: true,
                supplySteps: { orderBy: { sortOrder: 'asc' } },
                reviews: {
                    include: { user: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })
        if (!product) {
            res.status(404).json({ error: 'Produk tidak ditemukan' })
            return
        }
        res.json(product)
    } catch (error) {
        console.error('Get product error:', error)
        res.status(500).json({ error: 'Gagal mengambil data produk' })
    }
})

// POST /api/products - Admin: create product
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description, category, imageUrl, umkm, umkmStory, village, culturalValue, ethicalBadges, artisanId, supplySteps } = req.body

        const product = await prisma.product.create({
            data: {
                name, description, category, imageUrl,
                umkm, umkmStory, village, culturalValue,
                ethicalBadges: normalizeEthicalBadges(ethicalBadges) as any,
                artisanId: parseInt(artisanId),
                supplySteps: supplySteps ? {
                    create: supplySteps.map((s: any, i: number) => ({
                        title: s.title, actor: s.actor, location: s.location,
                        description: s.description, icon: s.icon || '', imageUrl: s.imageUrl,
                        sortOrder: i
                    }))
                } : undefined
            },
            include: { artisan: true, supplySteps: true }
        })

        res.status(201).json(product)
    } catch (error) {
        console.error('Create product error:', error)
        res.status(500).json({ error: 'Gagal membuat produk' })
    }
})

// PUT /api/products/:id - Admin: update product
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string)
        const { name, description, category, imageUrl, umkm, umkmStory, village, culturalValue, ethicalBadges, artisanId } = req.body

        const product = await prisma.product.update({
            where: { id },
            data: {
                name, description, category, imageUrl,
                umkm, umkmStory, village, culturalValue,
                ethicalBadges: ethicalBadges ? normalizeEthicalBadges(ethicalBadges) as any : undefined,
                artisanId: artisanId ? parseInt(artisanId) : undefined,
                supplySteps: req.body.supplySteps ? {
                    deleteMany: {},
                    create: req.body.supplySteps.map((s: any, i: number) => ({
                        title: s.title, actor: s.actor, location: s.location,
                        description: s.description, icon: s.icon || '', imageUrl: s.imageUrl,
                        sortOrder: i
                    }))
                } : undefined
            },
            include: { artisan: true, supplySteps: true }
        })

        res.json(product)
    } catch (error) {
        console.error('Update product error:', error)
        res.status(500).json({ error: 'Gagal mengupdate produk' })
    }
})

// DELETE /api/products/:id - Admin: delete product
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await prisma.product.delete({ where: { id: parseInt(req.params.id as string) } })
        res.json({ message: 'Produk berhasil dihapus' })
    } catch (error) {
        console.error('Delete product error:', error)
        res.status(500).json({ error: 'Gagal menghapus produk' })
    }
})

export default router
