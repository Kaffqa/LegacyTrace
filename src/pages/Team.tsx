import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { TeamMember } from '../types/product'
import { Linkedin, Instagram } from 'lucide-react'

export const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    api.get<TeamMember[]>('/team')
      .then(data => {
        const parsed = data.map(m => {
          let exp: any[] = []
          const rawExp = (m as any).expertise;
          if (Array.isArray(rawExp)) exp = rawExp
          else if (typeof rawExp === 'string') {
            try { exp = JSON.parse(rawExp) }
            catch { exp = rawExp.split(',').map((s: string) => s.trim()).filter(Boolean) }
          }
          return { ...m, expertise: exp }
        })
        setTeamMembers(parsed)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pb-20 page-transition">
      {/* Header */}
      <motion.section
        className="bg-gradient-to-br from-gold-soft to-teal-soft dark:from-gold/10 dark:to-teal/10 max-w-6xl mx-auto px-8 py-16 rounded-2xl my-8 text-center relative overflow-hidden border border-stone-100 dark:border-night-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gold/10 dark:bg-gold-neon/10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-teal/10 dark:bg-teal-neon/10 rounded-lg rotate-45"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-serif font-bold text-gold dark:text-gold-neon mb-3">👥 Meet Our Team</h1>
          <p className="text-xl text-stone-text dark:text-dark-body">
            Tim passionate yang berdedikasi untuk melestarikan warisan budaya UMKM Indonesia
          </p>
        </div>
      </motion.section>

      {/* Team Members */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-gold/30 border-t-gold dark:border-gold-neon/30 dark:border-t-gold-neon rounded-full animate-spin" />
        </div>
      ) : (
        <motion.section
          className="max-w-6xl mx-auto px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                className="bg-pure-card dark:bg-night-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-250 border border-stone-100 dark:border-night-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-coral dark:text-coral-neon font-semibold">{member.role}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-stone-text dark:text-dark-body text-sm mb-4 leading-relaxed">{member.bio}</p>

                  {/* Quote */}
                  <div className="bg-gold-soft dark:bg-gold-glow-bg p-4 rounded-lg mb-4 border-l-4 border-gold dark:border-gold-neon">
                    <p className="text-ink dark:text-dark-heading text-sm italic">"{member.quote}"</p>
                  </div>

                  {/* Expertise */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gold dark:text-gold-neon mb-2">Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-warm-sand dark:bg-night-border text-ink dark:text-dark-body text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact & Social */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-stone-100 dark:border-night-border">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold dark:text-gold-neon hover:text-teal dark:hover:text-teal-neon transition-colors"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold dark:text-gold-neon hover:text-teal dark:hover:text-teal-neon transition-colors"
                      >
                        <Instagram size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}
