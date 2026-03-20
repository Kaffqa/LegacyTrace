import { Router, Response } from 'express'
import multer from 'multer'
import { createClient } from '@supabase/supabase-js'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import crypto from 'crypto'
import path from 'path'

const router = Router()

// Configure multer for memory storage (no disk write)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024 }, // 4MB max (Vercel limit ~4.5MB)
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        if (allowed.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Hanya file gambar (JPEG, PNG, WebP, GIF) yang diizinkan'))
        }
    }
})

// Initialize Supabase client
function getSupabase() {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) {
        throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_KEY harus diset di .env')
    }
    return createClient(url, key)
}

// POST /api/upload - Upload image to Supabase Storage
router.post('/', authenticate, requireAdmin, upload.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'Tidak ada file yang diupload' })
            return
        }

        const supabase = getSupabase()
        const ext = path.extname(req.file.originalname) || '.jpg'
        const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
        const filePath = `images/${filename}`

        const { error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Supabase upload error:', uploadError)
            res.status(500).json({ error: 'Gagal mengupload file: ' + uploadError.message })
            return
        }

        const { data: publicUrlData } = supabase.storage
            .from('uploads')
            .getPublicUrl(filePath)

        res.json({ url: publicUrlData.publicUrl })
    } catch (error: any) {
        console.error('Upload error:', error)
        res.status(500).json({ error: error.message || 'Gagal mengupload file' })
    }
})

export default router
