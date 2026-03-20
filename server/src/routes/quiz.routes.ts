import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/quiz - Public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const questions = await prisma.quizQuestion.findMany()
        res.json(questions)
    } catch (error) {
        console.error('Get quiz error:', error)
        res.status(500).json({ error: 'Gagal mengambil data kuis' })
    }
})

// POST /api/quiz - Admin
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const data = { ...req.body }
        // options is stored as native Json in PostgreSQL
        const question = await prisma.quizQuestion.create({ data })
        res.status(201).json(question)
    } catch (error) {
        console.error('Create quiz error:', error)
        res.status(500).json({ error: 'Gagal membuat kuis' })
    }
})

// PUT /api/quiz/:id - Admin
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const data = { ...req.body }
        // options is stored as native Json in PostgreSQL
        const question = await prisma.quizQuestion.update({
            where: { id: parseInt(req.params.id as string) },
            data
        })
        res.json(question)
    } catch (error) {
        console.error('Update quiz error:', error)
        res.status(500).json({ error: 'Gagal mengupdate kuis' })
    }
})

// DELETE /api/quiz/:id - Admin
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await prisma.quizQuestion.delete({ where: { id: parseInt(req.params.id as string) } })
        res.json({ message: 'Kuis berhasil dihapus' })
    } catch (error) {
        console.error('Delete quiz error:', error)
        res.status(500).json({ error: 'Gagal menghapus kuis' })
    }
})

export default router
