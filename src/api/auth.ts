import apiClient from './client'
import type { User } from '../types'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: 'farmer' | 'buyer'
  phone?: string
}

interface AuthResponse {
  message: string
  user: User
  token: string
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data)
  return response.data
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data)
  return response.data
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<{ user: User }>('/auth/me')
  return response.data.user
}