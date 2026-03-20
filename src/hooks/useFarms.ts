import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getFarms, getFarm, getMyFarms, createFarm, updateFarm, deleteFarm } from '../api/farms'

interface FarmFilters {
  city?: string
  department?: string
  product_id?: number
  lat?: number
  lng?: number
  radius?: number
  page?: number
}

export const useFarms = (filters: FarmFilters = {}) => {
  return useQuery({
    queryKey: ['farms', filters],
    queryFn: () => getFarms(filters),
  })
}

export const useFarm = (id: number) => {
  return useQuery({
    queryKey: ['farms', id],
    queryFn: () => getFarm(id),
    enabled: !!id,
  })
}

export const useMyFarms = () => {
  return useQuery({
    queryKey: ['my-farms'],
    queryFn: getMyFarms,
  })
}

export const useCreateFarm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] })
      queryClient.invalidateQueries({ queryKey: ['my-farms'] })
    },
  })
}

export const useUpdateFarm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateFarm(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['farms', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['my-farms'] })
    },
  })
}

export const useDeleteFarm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] })
      queryClient.invalidateQueries({ queryKey: ['my-farms'] })
    },
  })
}