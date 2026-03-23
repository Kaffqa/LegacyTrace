import { Product, Artisan, Review, QuizQuestion, Region, TeamMember } from '../types/product'

export const dummyData = {
    team: [
        { id: 1, name: 'Alice', role: 'Founder', position: 'CEO', bio: 'Passionate about culture', image: 'https://i.pravatar.cc/150?u=1', email: 'alice@test.com', phone: '123', expertise: ['Business'], experience: 10, quote: 'Culture is key', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ] as TeamMember[],
    regions: [
        { id: 1, name: 'Java', emoji: '🌋', description: 'Rich in batik and crafts', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), products: [] }
    ] as Region[],
    artisans: [
        { id: 1, name: 'Budi Santoso', specialty: 'Batik Tulis', location: 'Yogyakarta', description: 'Master of fine batik', quote: 'Membatik adalah melukis jiwa.', quoteLocal: 'Membatik iku nglukis jiwo.', photoUrl: 'https://i.pravatar.cc/150?u=2', yearsExperience: 25, culturalBackground: 'Javanese', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ] as Artisan[],
    products: [
        { id: 1, name: 'Batik Megamendung', description: 'Classic cloud pattern batik.', category: 'Textile', imageUrl: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400', umkm: 'Batik Berkah', umkmStory: 'A family business since 1990.', village: 'Trusmi', culturalValue: 'Represents patience.', ethicalBadges: ['Fair Trade', 'Eco-friendly'], artisanId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ] as Product[],
    reviews: [
        { id: 1, rating: 5, comment: 'Amazing quality!', userId: 1, productId: 1, user: { id: 1, name: 'Test User' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ] as Review[],
    quiz: [
        { id: 1, question: 'Where is Megamendung from?', options: ['Cirebon', 'Solo', 'Pekalongan', 'Bali'], correct: 0, explanation: 'Megamendung is an iconic motif from Cirebon.' }
    ] as QuizQuestion[],
    partnership: [],
    stats: {
        totalProducts: 1,
        totalArtisans: 1,
        totalRegions: 1,
        totalPartnerships: 0
    }
}

// Initialization script
export const initializeDummyData = () => {
    if (!localStorage.getItem('legacytrace_fallback_data')) {
        localStorage.setItem('legacytrace_fallback_data', JSON.stringify(dummyData))
    }
}

export const getFallbackData = () => {
    return JSON.parse(localStorage.getItem('legacytrace_fallback_data') || '{}')
}

export const saveFallbackData = (data: any) => {
    localStorage.setItem('legacytrace_fallback_data', JSON.stringify(data))
}
