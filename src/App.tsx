import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import FarmsPage from './pages/farms/FarmsPage'
import FarmDetail from './pages/farms/FarmsDetail'
import Dashboard from './pages/dashboard/Dashboard'
import FarmerDashboard from './pages/dashboard/farmer/FarmerDashboard'
import FarmerFarms from './pages/dashboard/farmer/FarmerFarms'
import FarmerStocks from './pages/dashboard/farmer/FarmerStocks'
import FarmerMessages from './pages/dashboard/farmer/FarmerMessages'
import BuyerDashboard from './pages/dashboard/buyer/BuyerDashboard'
import BuyerFavorites from './pages/dashboard/buyer/BuyerFavorites'
import BuyerMessages from './pages/dashboard/buyer/BuyerMessages'
import Profile from './pages/dashboard/shared/Profile'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="farms" element={<FarmsPage />} />
          <Route path="farms/:id" element={<FarmDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="farmer" element={<FarmerDashboard />} />
            <Route path="farmer/farms" element={<FarmerFarms />} />
            <Route path="farmer/stocks" element={<FarmerStocks />} />
            <Route path="farmer/messages" element={<FarmerMessages />} />
            <Route path="buyer" element={<BuyerDashboard />} />
            <Route path="buyer/favorites" element={<BuyerFavorites />} />
            <Route path="buyer/messages" element={<BuyerMessages />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App