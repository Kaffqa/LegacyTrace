import { useEffect, useState } from 'react'
import { isOfflineMode } from '../lib/api'
import { WifiOff } from 'lucide-react'

export const OfflineBadge = () => {
    const [isOffline, setIsOffline] = useState(isOfflineMode.current)

    useEffect(() => {
        const handleToggle = (e: CustomEvent) => setIsOffline(e.detail)
        window.addEventListener('offline-mode-toggled', handleToggle as EventListener)
        return () => window.removeEventListener('offline-mode-toggled', handleToggle as EventListener)
    }, [])

    if (!isOffline) return null

    return (
        <div className="fixed bottom-4 right-4 z-[9999] animate-bounce">
            <div className="bg-red-500/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg border border-red-400/50 flex items-center gap-2 text-sm font-medium">
                <WifiOff className="w-4 h-4" />
                <span>Offline Mode (Local Storage)</span>
            </div>
        </div>
    )
}
