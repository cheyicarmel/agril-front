import apiClient from './client'
import type { Farm, PaginatedResponse } from '../types'

interface FarmFilters {
  city?: string
  department?: string
  product_id?: number
  lat?: number
  lng?: number
  radius?: number
  page?: number
}

interface FarmData {
  name: string
  description?: string
  latitude: number
  longitude: number
  address?: string
  city: string
  department: string
  photo_url?: string
}

export const getFarms = async (filters: FarmFilters = {}): Promise<PaginatedResponse<Farm>> => {
  const response = await apiClient.get<PaginatedResponse<Farm>>('/farms', { params: filters })
  return response.data
}

export const getFarm = async (id: number): Promise<Farm> => {
  const response = await apiClient.get<{ data: Farm }>(`/farms/${id}`)
  return response.data.data
}

export const getMyFarms = async (): Promise<Farm[]> => {
  const response = await apiClient.get<{ data: Farm[] }>('/farms/user/my-farms')
  return response.data.data
}

export const createFarm = async (data: FarmData & { image?: File }): Promise<Farm> => {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('latitude', String(data.latitude))
  formData.append('longitude', String(data.longitude))
  formData.append('city', data.city)
  formData.append('department', data.department)
  if (data.description) formData.append('description', data.description)
  if (data.address) formData.append('address', data.address)
  if (data.image) formData.append('image', data.image)

  const response = await apiClient.post<{ farm: Farm }>('/farms', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data.farm
}

export const updateFarm = async (id: number, data: Partial<FarmData>): Promise<Farm> => {
  const response = await apiClient.patch<{ farm: Farm }>(`/farms/${id}`, data)
  return response.data.farm
}

export const deleteFarm = async (id: number): Promise<void> => {
  await apiClient.delete(`/farms/${id}`)
}