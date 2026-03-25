import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../lib/api'

interface User {
    id: number
    email: string
    name: string
    role: 'ADMIN' | 'USER'
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<User>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    isAdmin: boolean
    isOffline: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isOffline, setIsOffline] = useState(false)

    useEffect(() => {
        const handleOffline = (e: any) => setIsOffline(e.detail)
        window.addEventListener('offline-mode-toggled', handleOffline)
        return () => window.removeEventListener('offline-mode-toggled', handleOffline)
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            api.get<User>('/auth/me')
                .then(setUser)
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email: string, password: string): Promise<User> => {
        const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password })
        localStorage.setItem('token', res.token)
        setUser(res.user)
        return res.user
    }

    const register = async (name: string, email: string, password: string) => {
        const res = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password })
        localStorage.setItem('token', res.token)
        setUser(res.user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN', isOffline }}>
            {children}
        </AuthContext.Provider>
    )
}
