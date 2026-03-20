import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../lib/api'
import { Handshake, Search, X, CheckCircle, XCircle, Eye } from 'lucide-react'

interface Partnership {
    id: number
    name: string
    email: string
    whatsapp: string | null
    umkm: string
    village: string
    category: string
    umkmStory: string
    description: string
    ethicalBadges: string
    steps: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
}

export const AdminPartnerships = () => {
    const [partnerships, setPartnerships] = useState<Partnership[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<Partnership | null>(null)

    const load = () => {
        api.get<Partnership[]>('/partnership')
            .then(setPartnerships)
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(load, [])

    const handleUpdateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${status}?`)) return
        try {
            await api.put(`/partnership/${id}/status`, { status })
            setSelected(null)
            load()
        } catch (err: any) {
            alert(err.message || 'Gagal mengubah status')
        }
    }

    const filtered = partnerships.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.umkm.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    )

    const statusBadge = (status: string) => {
        if (status === 'APPROVED') return 'bg-teal/10 text-teal dark:bg-teal-neon/20 dark:text-teal-neon'
        if (status === 'REJECTED') return 'bg-coral/10 text-coral dark:bg-coral-neon/20 dark:text-coral-neon'
        return 'bg-gold/10 text-gold-deep dark:bg-gold-neon/20 dark:text-gold-neon'
    }

    const statusText = (status: string) => {
        if (status === 'APPROVED') return 'Disetujui'
        if (status === 'REJECTED') return 'Ditolak'
        return 'Menunggu'
    }

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-gold/30 border-t-gold rounded-full animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-ink dark:text-dark-heading font-serif">Pengajuan Kemitraan</h1>
                    <p className="text-stone-text dark:text-dark-muted text-sm mt-1">{partnerships.length} total pengajuan</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text dark:text-dark-muted" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari nama, UMKM, atau kategori..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-night-surface border border-stone-100 dark:border-night-border text-ink dark:text-dark-heading placeholder-muted-text dark:placeholder-dark-muted focus:ring-2 focus:ring-gold/50 outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-night-surface rounded-2xl border border-stone-100/60 dark:border-night-border/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 dark:border-night-border bg-warm-sand/50 dark:bg-night-card/50">
                                <th className="text-left px-6 py-4 font-medium text-stone-text dark:text-dark-muted">Tanggal</th>
                                <th className="text-left px-6 py-4 font-medium text-stone-text dark:text-dark-muted">Nama / Kontak</th>
                                <th className="text-left px-6 py-4 font-medium text-stone-text dark:text-dark-muted">UMKM</th>
                                <th className="text-left px-6 py-4 font-medium text-stone-text dark:text-dark-muted">Kategori</th>
                                <th className="text-center px-6 py-4 font-medium text-stone-text dark:text-dark-muted">Status</th>
                                <th className="text-right px-6 py-4 font-medium text-stone-text dark:text-dark-muted">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="border-b border-stone-100/50 dark:border-night-border/50 hover:bg-warm-sand/30 dark:hover:bg-night-card/30 transition-colors">
                                    <td className="px-6 py-4 text-stone-text dark:text-dark-body">
                                        {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-ink dark:text-dark-heading">{p.name}</p>
                                        <p className="text-xs text-stone-text dark:text-dark-muted">{p.email}</p>
                                        {p.whatsapp && <p className="text-xs text-stone-text dark:text-dark-muted">WA: {p.whatsapp}</p>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-ink dark:text-dark-heading">{p.umkm}</p>
                                        <p className="text-xs text-stone-text dark:text-dark-muted">{p.village}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-stone-100 dark:bg-night-border text-stone-700 dark:text-stone-300 rounded-full text-xs font-medium capitalize">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(p.status)}`}>
                                            {statusText(p.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setSelected(p)} className="p-2 rounded-lg hover:bg-gold-soft dark:hover:bg-gold-glow-bg text-gold dark:text-gold-neon transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-stone-text dark:text-dark-muted">
                                        Belum ada data pengajuan kemitraan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div
                            className="bg-white dark:bg-night-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-stone-100/60 dark:border-night-border/60"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-night-border sticky top-0 bg-white dark:bg-night-surface z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-ink dark:text-dark-heading gap-2 flex items-center">
                                        <Handshake className="w-5 h-5 text-gold dark:text-gold-neon"/> Detail Pengajuan
                                    </h3>
                                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${statusBadge(selected.status)}`}>
                                        {statusText(selected.status)}
                                    </span>
                                </div>
                                <button onClick={() => setSelected(null)} className="p-2 hover:bg-warm-sand dark:hover:bg-night-card rounded-lg"><X className="w-5 h-5 text-stone-text dark:text-dark-muted" /></button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-semibold text-stone-text dark:text-dark-muted uppercase tracking-wider mb-1">Informasi UMKM</p>
                                            <p className="font-medium text-ink dark:text-dark-heading">{selected.umkm}</p>
                                            <p className="text-sm text-stone-600 dark:text-stone-400">{selected.village}</p>
                                            <p className="text-sm text-stone-600 dark:text-stone-400 capitalize mt-1">Kategori: {selected.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-stone-text dark:text-dark-muted uppercase tracking-wider mb-1">Kontak Pendaftar</p>
                                            <p className="font-medium text-ink dark:text-dark-heading">{selected.name}</p>
                                            <p className="text-sm text-stone-600 dark:text-stone-400">{selected.email}</p>
                                            {selected.whatsapp && <p className="text-sm text-stone-600 dark:text-stone-400">WA: {selected.whatsapp}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-stone-text dark:text-dark-muted uppercase tracking-wider mb-1">Badge Etis</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selected.ethicalBadges.split(',').map((b, i) => (
                                                <span key={i} className="px-2 py-1 bg-gold/10 text-gold-deep dark:bg-gold-neon/20 dark:text-gold-neon rounded text-xs font-medium">
                                                    {b.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-stone-100 dark:border-night-border pt-6">
                                    <p className="text-xs font-semibold text-stone-text dark:text-dark-muted uppercase tracking-wider mb-2">Kisah UMKM</p>
                                    <p className="text-sm text-ink dark:text-dark-body whitespace-pre-wrap leading-relaxed bg-stone-50 dark:bg-night-card p-4 rounded-xl border border-stone-100 dark:border-night-border">{selected.umkmStory}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-stone-text dark:text-dark-muted uppercase tracking-wider mb-2">Deskripsi Produk</p>
                                    <p className="text-sm text-ink dark:text-dark-body whitespace-pre-wrap leading-relaxed bg-stone-50 dark:bg-night-card p-4 rounded-xl border border-stone-100 dark:border-night-border">{selected.description}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-stone-text dark:text-dark-muted uppercase tracking-wider mb-2">Tahapan Produksi</p>
                                    <p className="text-sm text-ink dark:text-dark-body whitespace-pre-wrap leading-relaxed bg-stone-50 dark:bg-night-card p-4 rounded-xl border border-stone-100 dark:border-night-border">{selected.steps}</p>
                                </div>
                            </div>
                            
                            {selected.status === 'PENDING' && (
                                <div className="flex gap-3 p-6 border-t border-stone-100 dark:border-night-border bg-stone-50 dark:bg-night-surface sticky bottom-0">
                                    <button 
                                        onClick={() => handleUpdateStatus(selected.id, 'REJECTED')} 
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-coral dark:border-coral-neon text-coral dark:text-coral-neon font-medium text-sm hover:bg-coral hover:text-white dark:hover:bg-coral-neon dark:hover:text-night transition-colors"
                                    >
                                        <XCircle className="w-4 h-4"/> Tolak
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus(selected.id, 'APPROVED')} 
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-teal dark:bg-teal-neon text-white dark:text-night font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-teal/30"
                                    >
                                        <CheckCircle className="w-4 h-4"/> Setujui
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminPartnerships
