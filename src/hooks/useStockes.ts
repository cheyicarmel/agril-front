import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getStocks, getMyStocks, createStock, updateStockStatus, deleteStock } from '../api/stocks'

interface StockFilters {
  product_id?: number
  max_price?: number
  min_quantity?: number
  department?: string
  page?: number
}

export const useStocks = (filters: StockFilters = {}) => {
  return useQuery({
    queryKey: ['stocks', filters],
    queryFn: () => getStocks(filters),
  })
}

export const useMyStocks = () => {
  return useQuery({
    queryKey: ['my-stocks'],
    queryFn: getMyStocks,
  })
}

export const useCreateStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] })
      queryClient.invalidateQueries({ queryKey: ['my-stocks'] })
    },
  })
}

export const useUpdateStockStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateStockStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] })
      queryClient.invalidateQueries({ queryKey: ['my-stocks'] })
    },
  })
}

export const useDeleteStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] })
      queryClient.invalidateQueries({ queryKey: ['my-stocks'] })
    },
  })
}