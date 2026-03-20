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

export const createStock = async (data: StockData): Promise<Stock> => {
  const response = await apiClient.post<{ stock: Stock }>('/stocks', data)
  return response.data.stock
}

export const updateStockStatus = async (id: number, status: string): Promise<Stock> => {
  const response = await apiClient.patch<{ stock: Stock }>(`/stocks/${id}/status`, { status })
  return response.data.stock
}

export const deleteStock = async (id: number): Promise<void> => {
  await apiClient.delete(`/stocks/${id}`)
}