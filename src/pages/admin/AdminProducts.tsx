import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../lib/api'
import { Package, Plus, Edit2, Trash2, X, Search } from 'lucide-react'
import { ImageUploader } from '../../components/ImageUploader'

interface Product {
    id: number; name: string; category: string; village: string; imageUrl: string; description: string; umkm: string; umkmStory: string; culturalValue: string; ethicalBadges: string; artisanId: number | null; supplySteps?: any[]
}

interface Artisan { id: number; name: string }

export const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [artisans, setArtisans] = useState<Artisan[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState<Product | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<{name: string, category: string, village: string, imageUrl: string, description: string, umkm: string, umkmStory: string, culturalValue: string, ethicalBadges: string, artisanId: string, supplySteps?: any[]}>({ name: '', category: 'batik', village: '', imageUrl: '', description: '', umkm: '', umkmStory: '', culturalValue: '', ethicalBadges: '', artisanId: '', supplySteps: [] })

    const load = () => {
        Promise.all([
            api.get<Product[]>('/products'),
            api.get<Artisan[]>('/artisans')
        ]).then(([p, a]) => { setProducts(p); setArtisans(a) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(load, [])

    const openNew = () => {
        setEditing(null)
        setForm({ name: '', category: 'batik', village: '', imageUrl: '', description: '', umkm: '', umkmStory: '', culturalValue: '', ethicalBadges: '', artisanId: '', supplySteps: [] })
        setShowForm(true)
    }

    const openEdit = (p: Product) => {
        setEditing(p)
        setForm({ name: p.name, category: p.category, village: p.village, imageUrl: p.imageUrl, description: p.description, umkm: p.umkm || '', umkmStory: p.umkmStory || '', culturalValue: p.culturalValue || '', ethicalBadges: p.ethicalBadges || '', artisanId: p.artisanId?.toString() || '', supplySteps: p.supplySteps || [] })
        setShowForm(true)
    }

    const handleSave = async () => {
        try {
            const data = { ...form, artisanId: form.artisanId ? Number(form.artisanId) : undefined }
            if (editing) {
                await api.put(`/products/${editing.id}`, data)
            } else {
                await api.post('/products', data)
            }
            setShowForm(false)
            load()
        } catch (err: any) {
            alert(err.message)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus produk ini?')) return
        try {
            await api.delete(`/products/${id}`)
            load()
        } catch (err: any) {
            alert(err.message)
        }
    }

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))

    const categoryBadge = (cat: string) => {
        const colors: Record<string, string> = {
            batik: 'bg-cat-batik/10 text-cat-batik dark:bg-cat-batik-dark/20 dark:text-cat-batik-dark',
            makanan: 'bg-cat-food/10 text-cat-food dark:bg-cat-food-dark/20 dark:text-cat-food-dark',
            kerajinan: 'bg-cat-craft/10 text-cat-craft dark:bg-cat-craft-dark/20 dark:text-cat-craft-dark',
            tenun: 'bg-cat-weave/10 text-cat-weave dark:bg-cat-weave-dark/20 dark:text-cat-weave-dark',
            gerabah: 'bg-cat-pottery/10 text-cat-pottery dark:bg-cat-pottery-dark/20 dark:text-cat-pottery-dark',
            herbal: 'bg-cat-herbal/10 text-cat-herbal dark:bg-cat-herbal-dark/20 dark:text-cat-herbal-dark',
        }
        return colors[cat] || 'bg-gold/10 text-gold dark:bg-gold-neon/20 dark:text-gold-neon'
    }

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-gold/30 border-t-gold rounded-full animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-ink dark:text-dark-heading font-serif">Kelola Produk</h1>
                    <p className="text-stone-text dark:text-dark-muted text-sm mt-1">{products.length} produk</p>
                </div>
                <motion.button
                    onClick={openNew}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold text-sm shadow-lg btn-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus className="w-4 h-4" /> Tambah Produk
                </motion.button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text dark:text-dark-muted" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari produk..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-night-surface border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text dark:placeholder-dark-muted focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-night-surface rounded-2xl border border-stone-100/60 dark:border-night-border/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 dark:border-night-border bg-warm-sand/50 dark:bg-night-card/50">
                                <th className="text-left px-6 py-4 font-medium text-stone-text dark:text-dark-muted">Produk</th>
                                <th className="text-left px-6 py-4 font-medium text-stone-text dark:text-dark-muted">Kategori</th>
                                <th className="text-left px-6 py-4 font-medium text-stone-text dark:text-dark-muted hidden md:table-cell">Lokasi</th>
                                <th className="text-left px-6 py-4 font-medium text-stone-text dark:text-dark-muted hidden lg:table-cell">UMKM</th>
                                <th className="px-6 py-4 font-medium text-stone-text dark:text-dark-muted text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="border-b border-stone-100/50 dark:border-night-border/50 hover:bg-warm-sand/30 dark:hover:bg-night-card/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-warm-sand dark:bg-night-card" onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40' }} />
                                            <span className="font-medium text-ink dark:text-dark-heading">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryBadge(p.category)}`}>{p.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-stone-text dark:text-dark-body hidden md:table-cell">{p.village}</td>
                                    <td className="px-6 py-4 text-stone-text dark:text-dark-body hidden lg:table-cell">{p.umkm}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-gold-soft dark:hover:bg-gold-glow-bg text-gold dark:text-gold-neon transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-coral-soft dark:hover:bg-coral-glow-bg text-coral dark:text-coral-neon transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div
                            className="bg-white dark:bg-night-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-stone-100/60 dark:border-night-border/60"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-night-border">
                                <h3 className="text-lg font-bold text-ink dark:text-dark-heading">{editing ? 'Edit Produk' : 'Tambah Produk'}</h3>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-warm-sand dark:hover:bg-night-card rounded-lg"><X className="w-5 h-5 text-stone-text dark:text-dark-muted" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { label: 'Nama Produk', key: 'name' },
                                    { label: 'Desa / Lokasi', key: 'village' },
                                    { label: 'UMKM', key: 'umkm' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1">{f.label}</label>
                                        <input
                                            value={(form as any)[f.key]}
                                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 outline-none text-sm"
                                        />
                                    </div>
                                ))}
                                <ImageUploader label="Gambar Produk" value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} />
                                <div>
                                    <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1">Kategori</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 outline-none text-sm"
                                    >
                                        {['batik', 'makanan', 'kerajinan', 'tenun', 'gerabah', 'herbal'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1">Pengrajin</label>
                                    <select
                                        value={form.artisanId}
                                        onChange={e => setForm({ ...form, artisanId: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 outline-none text-sm"
                                    >
                                        <option value="">Pilih pengrajin</option>
                                        {artisans.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>
                                {[
                                    { label: 'Deskripsi', key: 'description' },
                                    { label: 'Cerita UMKM', key: 'umkmStory' },
                                    { label: 'Nilai Budaya', key: 'culturalValue' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1">{f.label}</label>
                                        <textarea
                                            value={(form as any)[f.key]}
                                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 outline-none text-sm resize-none"
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal dark:text-dark-body mb-1">Badge Etis (pisahkan dengan koma)</label>
                                    <input
                                        value={form.ethicalBadges}
                                        onChange={e => setForm({ ...form, ethicalBadges: e.target.value })}
                                        placeholder="Buatan Tangan, Tanpa Pengawet"
                                        className="w-full px-4 py-2.5 rounded-xl bg-warm-sand dark:bg-night-card border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text focus:ring-2 focus:ring-gold/50 dark:focus:ring-gold-neon/50 outline-none text-sm"
                                    />
                                </div>
                                <div className="mt-6 pt-6 border-t border-stone-100 dark:border-night-border">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-medium text-charcoal dark:text-dark-body">Proses Pembuatan (Supply Steps)</label>
                                        <button type="button" onClick={() => setForm({ ...form, supplySteps: [...(form.supplySteps || []), { title: '', actor: '', location: '', description: '', imageUrl: '' }] })} className="text-xs flex items-center gap-1 text-gold dark:text-gold-neon hover:underline px-2 py-1 rounded bg-gold/10 dark:bg-gold-neon/10"><Plus className="w-3 h-3"/> Tambah Proses</button>
                                    </div>
                                    <div className="space-y-4">
                                        {form.supplySteps?.map((step: any, index: number) => (
                                            <div key={index} className="p-4 rounded-xl border border-stone-200 dark:border-night-border bg-stone-50/50 dark:bg-night-card/50 relative">
                                                <button type="button" onClick={() => { const newSteps = [...(form.supplySteps || [])]; newSteps.splice(index, 1); setForm({ ...form, supplySteps: newSteps })}} className="absolute top-2 right-2 p-1.5 text-coral/70 hover:text-coral dark:text-coral-neon/70 dark:hover:text-coral-neon rounded-md hover:bg-coral/10 dark:hover:bg-coral-neon/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pr-8">
                                                    <div>
                                                        <label className="block text-xs text-stone-text dark:text-dark-muted mb-1">Nama Proses</label>
                                                        <input value={step.title} onChange={e => { const newSteps = [...(form.supplySteps || [])]; newSteps[index].title = e.target.value; setForm({ ...form, supplySteps: newSteps })}} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-night-surface border border-stone-200 dark:border-night-border text-ink dark:text-dark-heading text-xs focus:ring-1 focus:ring-gold/50 outline-none" placeholder="Cth: Pewarnaan Alami" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-stone-text dark:text-dark-muted mb-1">Aktor / Pelaku</label>
                                                        <input value={step.actor} onChange={e => { const newSteps = [...(form.supplySteps || [])]; newSteps[index].actor = e.target.value; setForm({ ...form, supplySteps: newSteps })}} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-night-surface border border-stone-200 dark:border-night-border text-ink dark:text-dark-heading text-xs focus:ring-1 focus:ring-gold/50 outline-none" placeholder="Cth: Kelompok Tani Mekar" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-stone-text dark:text-dark-muted mb-1">Lokasi</label>
                                                        <input value={step.location} onChange={e => { const newSteps = [...(form.supplySteps || [])]; newSteps[index].location = e.target.value; setForm({ ...form, supplySteps: newSteps })}} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-night-surface border border-stone-200 dark:border-night-border text-ink dark:text-dark-heading text-xs focus:ring-1 focus:ring-gold/50 outline-none" placeholder="Cth: Desa Sukamaju" />
                                                    </div>
                                                    <div className="col-span-1 sm:col-span-2 mt-2">
                                                        <ImageUploader 
                                                            label="Gambar Proses (Opsional)" 
                                                            value={step.imageUrl || ''} 
                                                            onChange={url => { const newSteps = [...(form.supplySteps || [])]; newSteps[index].imageUrl = url; setForm({ ...form, supplySteps: newSteps })}} 
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-stone-text dark:text-dark-muted mb-1">Deskripsi Singkat</label>
                                                    <textarea value={step.description} onChange={e => { const newSteps = [...(form.supplySteps || [])]; newSteps[index].description = e.target.value; setForm({ ...form, supplySteps: newSteps })}} rows={2} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-night-surface border border-stone-200 dark:border-night-border text-ink dark:text-dark-heading text-xs focus:ring-1 focus:ring-gold/50 outline-none resize-none" placeholder="Ceritakan detail tahap ini..." />
                                                </div>
                                            </div>
                                        ))}
                                        {(!form.supplySteps || form.supplySteps.length === 0) && (
                                            <div className="text-center py-6 bg-stone-50/50 dark:bg-night-card/50 rounded-xl border border-dashed border-stone-200 dark:border-night-border">
                                                <p className="text-xs text-stone-text/70 dark:text-dark-muted">Belum ada tahapan proses yang ditambahkan.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 p-6 border-t border-stone-100 dark:border-night-border">
                                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-stone-100 dark:border-night-border text-stone-text dark:text-dark-muted font-medium text-sm hover:bg-warm-sand dark:hover:bg-night-card transition-colors">
                                    Batal
                                </button>
                                <motion.button
                                    onClick={handleSave}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold text-sm shadow-lg btn-glow"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {editing ? 'Simpan' : 'Tambah'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
