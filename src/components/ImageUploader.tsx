import { useState, useRef, useCallback } from 'react'
import { Upload, Camera, X, Image, Link, Loader2 } from 'lucide-react'
import { api } from '../lib/api'

interface ImageUploaderProps {
    value: string
    onChange: (url: string) => void
    label?: string
}

export const ImageUploader = ({ value, onChange, label = 'Foto' }: ImageUploaderProps) => {
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [mode, setMode] = useState<'upload' | 'url'>('upload')
    const [error, setError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Hanya file gambar yang diizinkan')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Ukuran file maksimal 5MB')
            return
        }
        setError('')
        setUploading(true)
        try {
            const result = await api.upload(file)
            onChange(result.url)
        } catch (err: any) {
            setError(err.message || 'Gagal mengupload file')
        } finally {
            setUploading(false)
        }
    }, [onChange])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleUpload(file)
        e.target.value = ''
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleUpload(file)
    }, [handleUpload])

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = () => setDragOver(false)

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-charcoal dark:text-dark-body">{label}</label>
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => setMode('upload')}
                        className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${mode === 'upload'
                            ? 'bg-gold/20 text-gold dark:bg-gold-neon/20 dark:text-gold-neon'
                            : 'text-muted-text dark:text-dark-muted hover:bg-warm-sand dark:hover:bg-night-card'
                            }`}
                    >
                        <Upload className="w-3 h-3 inline mr-1" />Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${mode === 'url'
                            ? 'bg-gold/20 text-gold dark:bg-gold-neon/20 dark:text-gold-neon'
                            : 'text-muted-text dark:text-dark-muted hover:bg-warm-sand dark:hover:bg-night-card'
                            }`}
                    >
                        <Link className="w-3 h-3 inline mr-1" />URL
                    </button>
                </div>
            </div>

            {mode === 'url' ? (
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 outline-none text-sm"
                />
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${dragOver
                        ? 'border-gold dark:border-gold-neon bg-gold/5 dark:bg-gold-neon/5'
                        : 'border-stone-200 dark:border-night-border hover:border-gold/50 dark:hover:border-gold-neon/50'
                        }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                            <Loader2 className="w-8 h-8 text-gold dark:text-gold-neon animate-spin" />
                            <p className="text-sm text-muted-text dark:text-dark-muted">Mengupload...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 py-2">
                            <Image className="w-8 h-8 text-muted-text dark:text-dark-muted" />
                            <p className="text-sm text-muted-text dark:text-dark-muted">
                                Drag & drop gambar di sini, atau
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 dark:bg-gold-neon/10 text-gold dark:text-gold-neon text-xs font-medium hover:bg-gold/20 dark:hover:bg-gold-neon/20 transition-colors"
                                >
                                    <Upload className="w-3.5 h-3.5" /> Pilih File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => cameraInputRef.current?.click()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 dark:hover:bg-emerald-400/20 transition-colors"
                                >
                                    <Camera className="w-3.5 h-3.5" /> Ambil Foto
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Hidden file inputs */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            )}

            {error && (
                <p className="text-xs text-coral dark:text-coral-neon mt-1">{error}</p>
            )}

            {/* Preview */}
            {value && (
                <div className="mt-2 relative inline-block">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-20 h-20 rounded-xl object-cover border border-stone-100 dark:border-night-border"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-coral dark:bg-coral-neon text-white dark:text-night flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}
        </div>
    )
}
