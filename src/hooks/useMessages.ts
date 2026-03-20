import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getConversations,
  getConversation,
  findOrCreateConversation,
  sendMessage,
} from '../api/messages'

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  })
}

export const useConversation = (id: number) => {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => getConversation(id),
    enabled: !!id,
  })
}

export const useFindOrCreateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (farmId: number) => findOrCreateConversation(farmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: number; content: string }) =>
      sendMessage(conversationId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', variables.conversationId] })
    },
  })
}