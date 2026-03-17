import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../lib/api'
import { Plus, Edit2, Trash2, X, Search, Users } from 'lucide-react'
import { ImageUploader } from '../../components/ImageUploader'

interface Artisan {
    id: number; name: string; specialty: string; location: string; quote: string; quoteLocal: string; photoUrl: string; yearsExperience: number; culturalBackground: string; whatsapp?: string
}

export const AdminArtisans = () => {
    const [items, setItems] = useState<Artisan[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState<Artisan | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', specialty: 'batik', location: '', quote: '', quoteLocal: '', photoUrl: '', yearsExperience: '', culturalBackground: '', whatsapp: '' })

    const load = () => {
        api.get<Artisan[]>('/artisans').then(setItems).catch(console.error).finally(() => setLoading(false))
    }
    useEffect(load, [])

    const openNew = () => {
        setEditing(null)
        setForm({ name: '', specialty: 'batik', location: '', quote: '', quoteLocal: '', photoUrl: '', yearsExperience: '', culturalBackground: '', whatsapp: '' })
        setShowForm(true)
    }

    const openEdit = (a: Artisan) => {
        setEditing(a)
        setForm({ name: a.name, specialty: a.specialty, location: a.location, quote: a.quote || '', quoteLocal: a.quoteLocal || '', photoUrl: a.photoUrl || '', yearsExperience: a.yearsExperience?.toString() || '', culturalBackground: a.culturalBackground || '', whatsapp: a.whatsapp || '' })
        setShowForm(true)
    }

    const handleSave = async () => {
        try {
            const data = { ...form, yearsExperience: Number(form.yearsExperience) || 0 }
            if (editing) await api.put(`/artisans/${editing.id}`, data)
            else await api.post('/artisans', data)
            setShowForm(false); load()
        } catch (err: any) { alert(err.message) }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus pengrajin ini?')) return
        try { await api.delete(`/artisans/${id}`); load() } catch (err: any) { alert(err.message) }
    }

    const filtered = items.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.specialty.toLowerCase().includes(search.toLowerCase()))

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-gold/30 border-t-gold rounded-full animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-ink dark:text-dark-heading font-serif">Kelola Pengrajin</h1>
                    <p className="text-stone-text dark:text-dark-muted text-sm mt-1">{items.length} pengrajin</p>
                </div>
                <motion.button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold text-sm shadow-lg btn-glow" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Plus className="w-4 h-4" /> Tambah Pengrajin
                </motion.button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pengrajin..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-night-surface border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text focus:ring-2 focus:ring-gold/50 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(a => (
                    <motion.div key={a.id} className="bg-white dark:bg-night-surface rounded-2xl border border-stone-100/60 dark:border-night-border/60 p-5 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-start gap-4 mb-3">
                            <img src={a.photoUrl} alt={a.name} className="w-14 h-14 rounded-full object-cover bg-warm-sand" onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56' }} />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-ink dark:text-dark-heading truncate">{a.name}</h3>
                                <p className="text-xs text-muted-text dark:text-dark-muted capitalize">{a.specialty} · {a.yearsExperience} tahun</p>
                                <p className="text-xs text-stone-text dark:text-dark-body mt-1">{a.location}</p>
                            </div>
                        </div>
                        {a.quote && <p className="text-xs italic text-stone-text dark:text-dark-muted mb-3 line-clamp-2">"{a.quote}"</p>}
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-gold-soft dark:hover:bg-gold-glow-bg text-gold dark:text-gold-neon"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-coral-soft dark:hover:bg-coral-glow-bg text-coral dark:text-coral-neon"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white dark:bg-night-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-stone-100/60 dark:border-night-border/60" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                            <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-night-border">
                                <h3 className="text-lg font-bold text-ink dark:text-dark-heading">{editing ? 'Edit Pengrajin' : 'Tambah Pengrajin'}</h3>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-warm-sand dark:hover:bg-night-card rounded-lg"><X className="w-5 h-5 text-stone-text" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { label: 'Nama', key: 'name' },
                                    { label: 'Lokasi', key: 'location' },
                                    { label: 'Pengalaman (tahun)', key: 'yearsExperience', type: 'number' },
                                    { label: 'Background Budaya', key: 'culturalBackground' },
                                    { label: 'WhatsApp (cth: 6281234567890)', key: 'whatsapp' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1">{f.label}</label>
                                        <input type={f.type || 'text'} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold/50 outline-none text-sm" />
                                    </div>
                                ))}
                                <ImageUploader label="Foto Pengrajin" value={form.photoUrl} onChange={url => setForm({ ...form, photoUrl: url })} />
                                <div>
                                    <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1">Spesialisasi</label>
                                    <select value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold/50 outline-none text-sm">
                                        {['batik', 'makanan', 'kerajinan', 'tenun', 'gerabah', 'herbal'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                {[{ label: 'Kutipan', key: 'quote' }, { label: 'Kutipan Lokal', key: 'quoteLocal' }].map(f => (
                                    <div key={f.key}>
                                        <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1">{f.label}</label>
                                        <textarea value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold/50 outline-none text-sm resize-none" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 p-6 border-t border-stone-100 dark:border-night-border">
                                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-stone-100 dark:border-night-border text-stone-text font-medium text-sm hover:bg-warm-sand transition-colors">Batal</button>
                                <motion.button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold text-sm shadow-lg btn-glow" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{editing ? 'Simpan' : 'Tambah'}</motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
