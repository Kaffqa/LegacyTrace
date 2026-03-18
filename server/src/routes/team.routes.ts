import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma.js'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'

const router = Router()

// GET /api/team - Public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const members = await prisma.teamMember.findMany()
        res.json(members)
    } catch (error) {
        console.error('Get team error:', error)
        res.status(500).json({ error: 'Gagal mengambil data tim' })
    }
})

// POST /api/team - Admin
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const data = { ...req.body }
        if (typeof data.expertise === 'string') {
            try { data.expertise = JSON.parse(data.expertise) }
            catch { data.expertise = data.expertise.split(',').map((s: string) => s.trim()).filter(Boolean) }
        }
        if (data.expertise !== undefined && !Array.isArray(data.expertise)) data.expertise = []
        
        // expertise is stored as native Json in PostgreSQL
        const member = await prisma.teamMember.create({ data })
        res.status(201).json(member)
    } catch (error) {
        console.error('Create team member error:', error)
        res.status(500).json({ error: 'Gagal menambah anggota tim' })
    }
})

// PUT /api/team/:id - Admin
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const data = { ...req.body }
        if (typeof data.expertise === 'string') {
            try { data.expertise = JSON.parse(data.expertise) }
            catch { data.expertise = data.expertise.split(',').map((s: string) => s.trim()).filter(Boolean) }
        }
        if (data.expertise !== undefined && !Array.isArray(data.expertise)) data.expertise = []

        // expertise is stored as native Json in PostgreSQL
        const member = await prisma.teamMember.update({
            where: { id: parseInt(req.params.id as string) },
            data
        })
        res.json(member)
    } catch (error) {
        console.error('Update team member error:', error)
        res.status(500).json({ error: 'Gagal mengupdate anggota tim' })
    }
})

// DELETE /api/team/:id - Admin
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await prisma.teamMember.delete({ where: { id: parseInt(req.params.id as string) } })
        res.json({ message: 'Anggota tim berhasil dihapus' })
    } catch (error) {
        console.error('Delete team member error:', error)
        res.status(500).json({ error: 'Gagal menghapus anggota tim' })
    }
})

export default router
