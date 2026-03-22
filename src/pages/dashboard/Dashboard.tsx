import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()

  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'farmer') return <Navigate to="/dashboard/farmer" replace />
  if (user.role === 'buyer') return <Navigate to="/dashboard/buyer" replace />

  return <Navigate to="/" replace />
}