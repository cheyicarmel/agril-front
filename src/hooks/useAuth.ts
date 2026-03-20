import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { login, logout, register, getMe } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import type { User } from '../types'

export const useLogin = () => {
  const { setAuth } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export const useRegister = () => {
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
    },
  })
}

export const useLogout = () => {
  const { clearAuth } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
    },
  })
}

export const useMe = () => {
  const { isAuthenticated } = useAuthStore()

  return useQuery<User>({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: isAuthenticated,
  })
}