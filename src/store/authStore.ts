import { create } from 'zustand'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('agril_token', token)
    localStorage.setItem('agril_user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  clearAuth: () => {
    localStorage.removeItem('agril_token')
    localStorage.removeItem('agril_user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateUser: (user) => {
    localStorage.setItem('agril_user', JSON.stringify(user))
    set({ user })
  },
}))

export const initAuthStore = () => {
  const token = localStorage.getItem('agril_token')
  const userJson = localStorage.getItem('agril_user')

  if (token && userJson) {
    try {
      const user = JSON.parse(userJson) as User
      useAuthStore.getState().setAuth(user, token)
    } catch {
      localStorage.removeItem('agril_token')
      localStorage.removeItem('agril_user')
    }
  }
}