/// <reference types="vite/client" />
import { initializeDummyData, getFallbackData, saveFallbackData } from './dummyData'

initializeDummyData()

const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api'

export const isOfflineMode = { current: false }

const handleFallback = (method: string, path: string, body?: any) => {
    isOfflineMode.current = true
    window.dispatchEvent(new CustomEvent('offline-mode-toggled', { detail: true }))

    const db = getFallbackData()
    console.warn(`[OFFLINE MODE] Intercepted ${method} ${path}`)

    const parts = path.split('/').filter(Boolean)
    const resource = parts[0]
    const id = parts[1]

    if (resource === 'auth') {
        if (path.includes('/me')) return { id: 1, email: 'test@example.com', name: 'Offline Admin', role: 'ADMIN' }
        return { token: 'offline-token-123', user: { id: 1, email: 'test@example.com', name: 'Offline Admin', role: 'ADMIN' } }
    }

    if (path.includes('/dashboard/stats') || path === '/stats') {
        return db.stats || { totalProducts: db.products?.length || 0, totalArtisans: db.artisans?.length || 0, totalRegions: db.regions?.length || 0, totalPartnerships: db.partnership?.length || 0 }
    }

    if (resource === 'upload') {
        return { url: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400' }
    }

    if (!db[resource]) {
        db[resource] = []
    }

    const table = db[resource]

    switch (method) {
        case 'GET':
            if (id) {
                if (id === 'featured') return table.slice(0, 3)
                const item = table.find((x: any) => x.id.toString() === id.toString())
                if (!item) throw new Error(`Fallback: ${resource} not found`)
                return item
            }
            return table

        case 'POST':
            const newItem = { id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...body }
            table.push(newItem)
            saveFallbackData(db)
            return newItem

        case 'PUT':
        case 'PATCH':
            const index = table.findIndex((x: any) => x.id.toString() === id?.toString())
            if (index > -1) {
                table[index] = { ...table[index], ...body, updatedAt: new Date().toISOString() }
                saveFallbackData(db)
                return table[index]
            }
            throw new Error(`Fallback: ${resource} not found`)

        case 'DELETE':
            db[resource] = table.filter((x: any) => x.id.toString() !== id?.toString())
            saveFallbackData(db)
            return { success: true }
    }
    throw new Error('Fallback not implemented for ' + path)
}

class ApiClient {
    private getToken(): string | null {
        return localStorage.getItem('token')
    }

    private headers(json = true): HeadersInit {
        const h: HeadersInit = {}
        if (json) h['Content-Type'] = 'application/json'
        const token = this.getToken()
        if (token) h['Authorization'] = `Bearer ${token}`
        return h
    }

    private async safeFetch<T>(method: string, path: string, body?: unknown, isUpload = false): Promise<T> {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10_000) // 10s timeout

        try {
            const options: RequestInit = { method, headers: this.headers(!isUpload), signal: controller.signal }
            if (body && !isUpload) options.body = JSON.stringify(body)
            if (isUpload) options.body = body as BodyInit

            const res = await fetch(`${API_BASE}${path}`, options)
            clearTimeout(timeout)
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText)
            
            // If success, restore online mode
            if (isOfflineMode.current) {
                isOfflineMode.current = false
                window.dispatchEvent(new CustomEvent('offline-mode-toggled', { detail: false }))
            }
            return res.json()
        } catch (error: any) {
            clearTimeout(timeout)
            const reason = error?.name === 'AbortError' ? 'Timeout (10s)' : error?.message
            console.warn(`[API] ${method} ${path} failed (${reason}) → switching to offline mode`)
            return handleFallback(method, path, body) as T
        }
    }

    get<T>(path: string): Promise<T> { return this.safeFetch('GET', path) }
    post<T>(path: string, body?: unknown): Promise<T> { return this.safeFetch('POST', path, body) }
    put<T>(path: string, body?: unknown): Promise<T> { return this.safeFetch('PUT', path, body) }
    delete<T>(path: string): Promise<T> { return this.safeFetch('DELETE', path) }

    async upload(file: File): Promise<{ url: string }> {
        const formData = new FormData()
        formData.append('file', file)

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10_000)
        
        try {
            const h: HeadersInit = {}
            const token = this.getToken()
            if (token) h['Authorization'] = `Bearer ${token}`
            
            const res = await fetch(`${API_BASE}/upload`, { method: 'POST', headers: h, body: formData, signal: controller.signal })
            clearTimeout(timeout)
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText)
            
            if (isOfflineMode.current) {
                isOfflineMode.current = false
                window.dispatchEvent(new CustomEvent('offline-mode-toggled', { detail: false }))
            }
            return res.json()
        } catch (error) {
            clearTimeout(timeout)
            return handleFallback('POST', '/upload', null) as any
        }
    }
}

export const api = new ApiClient()
