export interface ProviderCard {
  id: string
  slug: string
  name: string
  credential: string | null
  specialty: string[]
  location: {
    city: string | null
    state: string | null
    address: string | null
  }
  rating: number
  reviewCount: number
  acceptingNewPatients: boolean | null
}

export interface ProviderProfile extends ProviderCard {
  phone: string | null
  bio: string | null
  education: string[]
  languages: string[]
  insuranceAccepted: string[]
}

export interface ReviewItem {
  id: string
  rating: number
  title: string
  content: string
  createdAt: string
  helpfulCount: number
  isAnonymous: boolean
  authorName: string | null
  verified: boolean
  tags: string[]
}
