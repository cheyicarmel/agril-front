import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import FarmerDashboard from './FarmerDashboard'
import BuyerDashboard from './BuyerDashboard'

export default function Dashboard() {
  const { user } = useAuthStore()

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'farmer') return <FarmerDashboard />
  if (user.role === 'buyer') return <BuyerDashboard />

  return <Navigate to="/" replace />
}