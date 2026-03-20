import apiClient from './client'
import type { Conversation, Message, Farm } from '../types'

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await apiClient.get<{ data: Conversation[] }>('/conversations')
  return response.data.data
}

export const getConversation = async (id: number): Promise<Conversation> => {
  const response = await apiClient.get<{ data: Conversation }>(`/conversations/${id}`)
  return response.data.data
}

export const findOrCreateConversation = async (farmId: number): Promise<Conversation> => {
  const response = await apiClient.post<{ conversation: Conversation }>('/conversations/find-or-create', {
    farm_id: farmId,
  })
  return response.data.conversation
}

export const sendMessage = async (conversationId: number, content: string): Promise<Message> => {
  const response = await apiClient.post<{ data: Message }>(`/conversations/${conversationId}/messages`, {
    content,
  })
  return response.data.data
}

export const getFavorites = async (): Promise<Farm[]> => {
  const response = await apiClient.get<{ data: Farm[] }>('/favorites')
  return response.data.data
}

export const addFavorite = async (farmId: number): Promise<void> => {
  await apiClient.post(`/favorites/${farmId}`)
}

export const removeFavorite = async (farmId: number): Promise<void> => {
  await apiClient.delete(`/favorites/${farmId}`)
}