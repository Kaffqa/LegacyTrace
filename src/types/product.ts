export interface SupplyStep {
    id: number | string
    title: string
    actor: string
    location: string
    description: string
    icon: string
    imageUrl?: string | null
    sortOrder?: number
    productId?: number | string
}

export interface Artisan {
    id: number | string
    name: string
    specialty: string
    location: string
    description?: string | null
    quote: string
    quoteLocal?: string | null
    photoUrl: string
    yearsExperience: number
    culturalBackground: string
    whatsapp?: string | null
    createdAt?: string
    updatedAt?: string
}

export interface Review {
    id: number | string
    rating: number
    comment: string
    userId: number | string
    productId: number | string
    createdAt?: string
    updatedAt?: string
    user?: { id: number | string; name: string }
    product?: { name: string }
}

export interface Product {
    id: number | string
    name: string
    description: string
    category: string
    imageUrl: string
    umkm: string
    umkmStory: string
    village: string
    culturalValue: string
    ethicalBadges: string[]
    artisanId?: number | string
    createdAt?: string
    updatedAt?: string
    artisan?: Artisan
    supplySteps?: SupplyStep[]
    reviews?: Review[]
    // Legacy compat aliases
    steps?: SupplyStep[]
    artisanName?: string
    artisanExperience?: number
    artisanQuote?: string
    artisanQuoteLocal?: string
    artisanPhotoUrl?: string
}

export interface QuizQuestion {
    id: number | string
    question: string
    options: string[]
    correct: number
    explanation: string
}

export interface Region {
    id: number
    name: string
    emoji: string
    description: string
    createdAt: string
    updatedAt: string
    products: Array<{
        id: number
        name: string
        category: string
        umkm: string
        emoji: string
        regionId: number
    }>
}

export interface TeamMember {
    id: number
    name: string
    role: string
    position: string
    bio: string
    image: string
    email: string
    phone: string
    linkedin?: string | null
    twitter?: string | null
    instagram?: string | null
    expertise: string[]
    experience: number
    quote: string
    createdAt: string
    updatedAt: string
}