import apiClient from './client'
import type { Stock, PaginatedResponse } from '../types'

interface StockFilters {
  product_id?: number
  max_price?: number
  min_quantity?: number
  department?: string
  page?: number
}

interface StockData {
  farm_id: number
  product_id: number
  quantity: number
  unit: string
  price_per_unit: number
  available_from: string
  notes?: string
  photo_url?: string
}

export const getStocks = async (filters: StockFilters = {}): Promise<PaginatedResponse<Stock>> => {
  const response = await apiClient.get<PaginatedResponse<Stock>>('/stocks', { params: filters })
  return response.data
}

export const getStock = async (id: number): Promise<Stock> => {
  const response = await apiClient.get<Stock>(`/stocks/${id}`)
  return response.data
}

export const getMyStocks = async (): Promise<Stock[]> => {
  const response = await apiClient.get<{ data: Stock[] }>('/stocks/user/my-stocks')
  return response.data.data
}

export const createStock = async (data: StockData & { image?: File }): Promise<Stock> => {
  const formData = new FormData()
  formData.append('farm_id', String(data.farm_id))
  formData.append('product_id', String(data.product_id))
  formData.append('quantity', String(data.quantity))
  formData.append('unit', data.unit)
  formData.append('price_per_unit', String(data.price_per_unit))
  formData.append('available_from', data.available_from)
  if (data.notes) formData.append('notes', data.notes)
  if (data.image) formData.append('image', data.image)

  const response = await apiClient.post<{ stock: Stock }>('/stocks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data.stock
}

export const updateStockStatus = async (id: number, status: string): Promise<Stock> => {
  const response = await apiClient.patch<{ stock: Stock }>(`/stocks/${id}/status`, { status })
  return response.data.stock
}

export const deleteStock = async (id: number): Promise<void> => {
  await apiClient.delete(`/stocks/${id}`)
}