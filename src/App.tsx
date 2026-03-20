import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import FarmsPage from './pages/farms/FarmsPage'
import FarmDetail from './pages/farms/FarmsDetail'
import Dashboard from './pages/dashboard/Dashboard'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="farms" element={<FarmsPage />} />
          <Route path="farms/:id" element={<FarmDetail />} />

          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App