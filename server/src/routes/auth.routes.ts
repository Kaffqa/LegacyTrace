import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body

        if (!email || !password || !name) {
            res.status(400).json({ error: 'Email, password, dan nama wajib diisi' })
            return
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            res.status(400).json({ error: 'Email sudah terdaftar' })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, role: 'USER' }
        })

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        )

        res.status(201).json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        })
    } catch (error) {
        console.error('Register error:', error)
        res.status(500).json({ error: 'Gagal mendaftar' })
    }
})

// POST /api/auth/login
router.post('/login', async (req, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ error: 'Email dan password wajib diisi' })
            return
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            res.status(401).json({ error: 'Email atau password salah' })
            return
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            res.status(401).json({ error: 'Email atau password salah' })
            return
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        )

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Gagal login' })
    }
})

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { id: true, email: true, name: true, role: true, createdAt: true }
        })
        if (!user) {
            res.status(404).json({ error: 'User tidak ditemukan' })
            return
        }
        res.json(user)
    } catch (error) {
        console.error('Me error:', error)
        res.status(500).json({ error: 'Gagal mengambil data user' })
    }
})

export default router
