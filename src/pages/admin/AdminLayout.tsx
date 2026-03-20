import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import {
    LayoutDashboard, Package, Users, MapPin, UserCircle,
    HelpCircle, LogOut, ChevronRight, Shield, Menu, X, Handshake
} from 'lucide-react'
import { useState, useEffect } from 'react'

const sidebarItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Produk', path: '/admin/products', icon: Package },
    { label: 'Pengrajin', path: '/admin/artisans', icon: Users },
    { label: 'Wilayah', path: '/admin/regions', icon: MapPin },
    { label: 'Tim', path: '/admin/team', icon: UserCircle },
    { label: 'Kuis', path: '/admin/quiz', icon: HelpCircle },
    { label: 'Kemitraan', path: '/admin/partnerships', icon: Handshake },
]

export const AdminLayout = () => {
    const { user, logout, isAdmin, loading } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!loading && !isAdmin) navigate('/')
    }, [isAdmin, loading, navigate])

    useEffect(() => {
        setSidebarOpen(false)
    }, [location.pathname])

    if (loading) {
        return (
            <div className="min-h-screen bg-cream dark:bg-night flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-gold/30 border-t-gold dark:border-gold-neon/30 dark:border-t-gold-neon rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-muted-text dark:text-dark-muted">Memuat...</p>
                </div>
            </div>
        )
    }

    if (!isAdmin) return null

    return (
        <div className="min-h-screen bg-cream dark:bg-night flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-night-surface border-r border-stone-100 dark:border-night-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-stone-100 dark:border-night-border">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white dark:text-night" />
                            </div>
                            <div>
                                <h2 className="font-bold text-ink dark:text-dark-heading text-lg">Admin Panel</h2>
                                <p className="text-xs text-muted-text dark:text-dark-muted">LegacyTrace</p>
                            </div>
                        </Link>
                    </div>

                    {/* Nav items */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {sidebarItems.map(item => {
                            const isActive = location.pathname === item.path ||
                                (item.path !== '/admin' && location.pathname.startsWith(item.path))
                            const Icon = item.icon
                            return (
                                <Link key={item.path} to={item.path}>
                                    <motion.div
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-gold-soft dark:bg-gold-glow-bg text-gold dark:text-gold-neon border-l-4 border-gold dark:border-gold-neon'
                                            : 'text-stone-text dark:text-dark-body hover:bg-warm-sand dark:hover:bg-night-card'
                                            }`}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                    </motion.div>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User info + logout */}
                    <div className="p-4 border-t border-stone-100 dark:border-night-border">
                        <div className="flex items-center gap-3 mb-3 px-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal to-teal-deep dark:from-teal-neon dark:to-teal-bright flex items-center justify-center text-white dark:text-night text-sm font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-ink dark:text-dark-heading truncate">{user?.name}</p>
                                <p className="text-xs text-muted-text dark:text-dark-muted truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { logout(); navigate('/') }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-coral dark:text-coral-neon hover:bg-coral-soft dark:hover:bg-coral-glow-bg transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white dark:bg-night-surface border-b border-stone-100 dark:border-night-border">
                    <button onClick={() => setSidebarOpen(true)} className="text-ink dark:text-dark-heading">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="font-bold text-ink dark:text-dark-heading">Admin Panel</h2>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
