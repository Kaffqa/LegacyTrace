import { motion } from 'framer-motion'
import { Handshake, Package, Send, MapPin } from 'lucide-react'
import { BackgroundShapes } from '../components/BackgroundShapes'
import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { LoginModal } from '../components/LoginModal'

export const Partnership = () => {
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { user } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)
    
    const data = Object.fromEntries(formData.entries())

    setSubmitting(true)
    setStatus('idle')
    try {
      await api.post('/partnership', data)
      setStatus('success')
      form.reset()
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err: any) {
       setStatus('error')
       setErrorMessage(err.message || 'Terjadi kesalahan saat mengirim pengajuan.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative page-transition">
      <BackgroundShapes variant="default" />

      <motion.section
        className="max-w-4xl mx-auto px-8 py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Handshake className="w-12 h-12 text-gold dark:text-gold-neon" />
          </motion.div>
          <h1 className="text-5xl font-serif font-bold gradient-text mb-4">Kerja Sama dengan Kami</h1>
          <p className="text-xl text-stone-text dark:text-dark-body">
            Bergabunglah dengan LegacyTrace dan tampilkan produk UMKM Anda ke pasar yang lebih luas
          </p>
        </div>

        <motion.div
          className="glass rounded-3xl p-8 md:p-12 shadow-2xl border border-stone-100/50 dark:border-night-border/50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-ink dark:text-dark-heading mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-100 dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold dark:focus:ring-gold-neon outline-none transition-all"
                  placeholder="Nama Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink dark:text-dark-heading mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-100 dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold dark:focus:ring-gold-neon outline-none transition-all"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
               <label className="block text-sm font-semibold text-ink dark:text-dark-heading mb-2">
                 Nomor WhatsApp *
               </label>
               <input
                 type="tel"
                 name="whatsapp"
                 required
                 className="w-full px-4 py-3 rounded-xl border border-stone-100 dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold dark:focus:ring-gold-neon outline-none transition-all"
                 placeholder="Contoh: 081234567890"
               />
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-ink dark:text-dark-heading mb-2">
                  Nama UMKM *
                </label>
                <input
                  type="text"
                  name="umkm"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-100 dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold dark:focus:ring-gold-neon outline-none transition-all"
                  placeholder="Nama UMKM Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink dark:text-dark-heading mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Lokasi/Desa *
                </label>
                <input
                  type="text"
                  name="village"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-100 dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold dark:focus:ring-gold-neon outline-none transition-all"
                  placeholder="Desa/Kota, Provinsi"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink dark:text-dark-heading mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Kategori Produk *
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-100 dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold dark:focus:ring-gold-neon outline-none transition-all"
              >
                <option value="">Pilih Kategori</option>
                <option value="batik">Batik</option>
                <option value="makanan">Makanan</option>
                <option value="kerajinan">Kerajinan</option>
                <option value="tenun">Tenun</option>
                <option value="gerabah">Gerabah</option>
                <option value="herbal">Herbal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink dark:text-dark-heading mb-2">
                Kisah UMKM *
              </label>
              <textarea
                name="umkmStory"
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-stone-100 dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold dark:focus:ring-gold-neon outline-none transition-all resize-none"
                placeholder="Ceritakan sejarah dan perjalanan UMKM Anda..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink dark:text-dark-heading mb-2">
                Deskripsi Produk *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-stone-100 dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold dark:focus:ring-gold-neon outline-none transition-all resize-none"
                placeholder="Jelaskan produk Anda, keunikan, dan nilai budayanya..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink dark:text-dark-heading mb-2">
                Badge Etis (pisahkan dengan koma) *
              </label>
              <input
                type="text"
                name="ethicalBadges"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-100 dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold dark:focus:ring-gold-neon outline-none transition-all"
                placeholder="Contoh: Perdagangan Adil, Ramah Lingkungan, Bahan Alami"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink dark:text-dark-heading mb-2">
                Tahapan Produksi *
              </label>
              <textarea
                name="steps"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-stone-100 dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-dark-heading focus:ring-2 focus:ring-gold dark:focus:ring-gold-neon outline-none transition-all resize-none"
                placeholder="Jelaskan tahapan produksi dari awal hingga selesai.&#10;&#10;Contoh:&#10;Step 1: Pemilihan bahan baku berkualitas&#10;Step 2: Proses produksi dengan teknik tradisional&#10;Step 3: Kontrol kualitas produk&#10;Step 4: Pengemasan dan distribusi"
              />
            </div>

            {status === 'success' && (
              <div className="p-4 bg-teal/10 dark:bg-teal-neon/10 text-teal dark:text-teal-neon rounded-xl text-center text-sm font-medium border border-teal/20 dark:border-teal-neon/20">
                Pendaftaran berhasil dikirim! Tim kami akan segera menghubungi Anda.
              </div>
            )}
            
            {status === 'error' && (
              <div className="p-4 bg-coral/10 dark:bg-coral-neon/10 text-coral dark:text-coral-neon rounded-xl text-center text-sm font-medium border border-coral/20 dark:border-coral-neon/20">
                {errorMessage}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              className="w-full px-8 py-4 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-gold/50 dark:hover:shadow-gold-neon/50 transition-all duration-250 flex items-center justify-center gap-2 btn-glow disabled:opacity-70"
              whileHover={{ scale: submitting ? 1 : 1.02, y: submitting ? 0 : -2 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
            >
              <Send className="w-5 h-5" />
              {submitting ? 'Mengirim...' : 'Kirim Pengajuan'}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          className="mt-12 text-center text-stone-text dark:text-dark-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm">
            Dengan mengirimkan formulir ini, Anda setuju untuk dihubungi oleh tim LegacyTrace
          </p>
        </motion.div>
      </motion.section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}
