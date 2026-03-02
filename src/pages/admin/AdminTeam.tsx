import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../lib/api'
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react'
import { ImageUploader } from '../../components/ImageUploader'

interface TeamMember {
    id: number; name: string; role: string; position: string; bio: string; image: string; email: string; phone: string; instagram: string; expertise: string; experience: number; quote: string
}

export const AdminTeam = () => {
    const [items, setItems] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState<TeamMember | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', role: '', position: '', bio: '', image: '', email: '', phone: '', instagram: '', expertise: '', experience: '', quote: '' })

    const load = () => {
        api.get<TeamMember[]>('/team').then(setItems).catch(console.error).finally(() => setLoading(false))
    }
    useEffect(load, [])

    const openNew = () => { setEditing(null); setForm({ name: '', role: '', position: '', bio: '', image: '', email: '', phone: '', instagram: '', expertise: '', experience: '', quote: '' }); setShowForm(true) }
    const openEdit = (t: TeamMember) => {
        setEditing(t)
        setForm({ name: t.name, role: t.role, position: t.position, bio: t.bio || '', image: t.image || '', email: t.email || '', phone: t.phone || '', instagram: t.instagram || '', expertise: t.expertise || '', experience: t.experience?.toString() || '', quote: t.quote || '' })
        setShowForm(true)
    }

    const handleSave = async () => {
        try {
            const data = { ...form, experience: Number(form.experience) || 0 }
            if (editing) await api.put(`/team/${editing.id}`, data)
            else await api.post('/team', data)
            setShowForm(false); load()
        } catch (err: any) { alert(err.message) }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus anggota tim ini?')) return
        try { await api.delete(`/team/${id}`); load() } catch (err: any) { alert(err.message) }
    }

    const filtered = items.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-gold/30 border-t-gold rounded-full animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-ink dark:text-dark-heading font-serif">Kelola Tim</h1>
                    <p className="text-stone-text dark:text-dark-muted text-sm mt-1">{items.length} anggota</p>
                </div>
                <motion.button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold text-sm shadow-lg btn-glow" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Plus className="w-4 h-4" /> Tambah Anggota
                </motion.button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari anggota..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-night-surface border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text focus:ring-2 focus:ring-gold/50 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(t => (
                    <motion.div key={t.id} className="bg-white dark:bg-night-surface rounded-2xl border border-stone-100/60 dark:border-night-border/60 p-5 shadow-sm text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 bg-warm-sand" onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64' }} />
                        <h3 className="font-bold text-ink dark:text-dark-heading">{t.name}</h3>
                        <p className="text-xs text-gold dark:text-gold-neon font-medium mt-1">{t.role}</p>
                        <p className="text-xs text-stone-text dark:text-dark-muted mt-1">{t.position}</p>
                        {t.quote && <p className="text-xs italic text-muted-text dark:text-dark-muted mt-2">"{t.quote}"</p>}
                        <div className="flex gap-2 justify-center mt-4">
                            <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-gold-soft dark:hover:bg-gold-glow-bg text-gold dark:text-gold-neon"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(t.id)} className="p-2 rounded-lg hover:bg-coral-soft dark:hover:bg-coral-glow-bg text-coral dark:text-coral-neon"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white dark:bg-night-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-stone-100/60 dark:border-night-border/60" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                            <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-night-border">
                                <h3 className="text-lg font-bold text-ink dark:text-dark-heading">{editing ? 'Edit Anggota' : 'Tambah Anggota'}</h3>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-warm-sand dark:hover:bg-night-card rounded-lg"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { label: 'Nama', key: 'name' },
                                    { label: 'Role', key: 'role' },
                                    { label: 'Posisi', key: 'position' },
                                    { label: 'Email', key: 'email' },
                                    { label: 'Telepon', key: 'phone' },
                                    { label: 'Instagram', key: 'instagram' },
                                    { label: 'Pengalaman (tahun)', key: 'experience', type: 'number' },
                                    { label: 'Keahlian (JSON)', key: 'expertise' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1">{f.label}</label>
                                        <input type={(f as any).type || 'text'} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold/50 outline-none text-sm" />
                                    </div>
                                ))}
                                <ImageUploader label="Foto Anggota" value={form.image} onChange={url => setForm({ ...form, image: url })} />
                                {[{ label: 'Bio', key: 'bio' }, { label: 'Kutipan', key: 'quote' }].map(f => (
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
