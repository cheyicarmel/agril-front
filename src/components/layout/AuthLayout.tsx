import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div style={{ minHeight: '100svh', background: 'var(--color-bg)' }}>
      <Outlet />
    </div>
  )
}