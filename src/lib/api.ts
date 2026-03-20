/// <reference types="vite/client" />
const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api'

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

    async get<T>(path: string): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, { headers: this.headers(false) })
        if (!res.ok) throw new Error((await res.json()).error || res.statusText)
        return res.json()
    }

    async post<T>(path: string, body?: unknown): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify(body)
        })
        if (!res.ok) throw new Error((await res.json()).error || res.statusText)
        return res.json()
    }

    async put<T>(path: string, body?: unknown): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'PUT',
            headers: this.headers(),
            body: JSON.stringify(body)
        })
        if (!res.ok) throw new Error((await res.json()).error || res.statusText)
        return res.json()
    }

    async delete<T>(path: string): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'DELETE',
            headers: this.headers(false)
        })
        if (!res.ok) throw new Error((await res.json()).error || res.statusText)
        return res.json()
    }

    async upload(file: File): Promise<{ url: string }> {
        const formData = new FormData()
        formData.append('file', file)
        const h: HeadersInit = {}
        const token = this.getToken()
        if (token) h['Authorization'] = `Bearer ${token}`
        const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: h,
            body: formData
        })
        if (!res.ok) throw new Error((await res.json()).error || res.statusText)
        return res.json()
    }
}

export const api = new ApiClient()
