import apiClient from './client'
import type { Product } from '../types'

export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<{ data: Product[] }>('/products')
  return response.data.data
}