// Definition de la forme de toutes mes données

export interface User {
  id: number
  name: string
  email: string
  role: 'farmer' | 'buyer' | 'admin'
  phone: string | null
  is_active: boolean
  created_at: string
}

export interface Product {
  id: number
  name: string
  category: string
  unit: string
  description: string | null
}

export interface Stock {
  id: number
  quantity: number
  unit: string
  price_per_unit: number
  available_from: string
  status: 'available' | 'reserved' | 'exhausted'
  photo_url: string | null
  notes: string | null
  created_at: string
  product?: Product
  farm?: Farm
}

export interface Farm {
  id: number
  name: string
  description: string | null
  latitude: number
  longitude: number
  address: string | null
  city: string
  department: string
  photo_url: string | null
  is_active: boolean
  created_at: string
  owner?: User
  stocks?: Stock[]
  available_stocks_count?: number
}

export interface Message {
  id: number
  content: string
  is_read: boolean
  created_at: string
  sender?: User
}

export interface Conversation {
  id: number
  created_at: string
  farm?: Farm
  buyer?: User
  messages?: Message[]
  last_message?: Message
  unread_count: number
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ApiResponse<T> {
  message: string
  data?: T
}

export type UserRole = 'farmer' | 'buyer' | 'admin'
export type StockStatus = 'available' | 'reserved' | 'exhausted'