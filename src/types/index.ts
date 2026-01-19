export interface Section {
  id: string
  title: string
  description: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  projects?: Project[]
}

export interface Project {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  sectionId: string
  section?: Section
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  images?: Image[]
}

export interface Image {
  id: string
  url: string
  alt: string | null
  projectId: string
  project?: Project
  order: number
  createdAt: Date
}

export interface SiteSettings {
  id: string
  siteName: string
  tagline: string | null
  aboutMe: string | null
  email: string | null
  phone: string | null
  address: string | null
  linkedIn: string | null
  github: string | null
  twitter: string | null
  instagram: string | null
  heroImage: string | null
  profileImage: string | null
}

export interface Link {
  id: string
  title: string
  url: string
  icon: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
