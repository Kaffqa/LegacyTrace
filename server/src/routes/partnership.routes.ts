import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma.js'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'

const router = Router()

// GET /api/partnership - Admin: get all partnership requests
router.get('/', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const partnerships = await prisma.partnership.findMany({
            orderBy: { createdAt: 'desc' }
        })
        res.json(partnerships)
    } catch (error) {
        console.error('Get partnerships error:', error)
        res.status(500).json({ error: 'Gagal mengambil data kemitraan' })
    }
})

// POST /api/partnership - Public: submit new partnership application
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, whatsapp, umkm, village, category, umkmStory, description, ethicalBadges, steps } = req.body

        const partnership = await prisma.partnership.create({
            data: {
                name,
                email,
                whatsapp,
                umkm,
                village,
                category,
                umkmStory,
                description,
                ethicalBadges,
                steps
            }
        })
        
        res.status(201).json(partnership)
    } catch (error) {
        console.error('Create partnership error:', error)
        res.status(500).json({ error: 'Gagal mengirim pengajuan kemitraan' })
    }
})

// PUT /api/partnership/:id/status - Admin: update status (APPROVE / REJECT)
router.put('/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string)
        const { status } = req.body

        if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
            res.status(400).json({ error: 'Status tidak valid' })
            return
        }

        const partnership = await prisma.partnership.update({
            where: { id },
            data: { status }
        })

        res.json(partnership)
    } catch (error) {
        console.error('Update partnership status error:', error)
        res.status(500).json({ error: 'Gagal memperbarui status kemitraan' })
    }
})

export default router
