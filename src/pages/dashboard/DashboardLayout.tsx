import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useLogout } from '../../hooks/useAuth'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

const farmerNav: NavItem[] = [
  {
    to: '/dashboard/farmer',
    label: 'Vue d\'ensemble',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/farmer/farms',
    label: 'Mes exploitations',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 16V8.5L9 3l7 5.5V16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 16v-5h5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/farmer/stocks',
    label: 'Mes stocks',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 5.5L9 2l7 3.5v7L9 16l-7-3.5v-7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 9.5V16M2 5.5l7 4 7-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/farmer/messages',
    label: 'Messages',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M15.5 11.5a1 1 0 01-1 1H5l-3 3V3.5a1 1 0 011-1h11.5a1 1 0 011 1v8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/profile',
    label: 'Mon profil',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2.5 16c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const buyerNav: NavItem[] = [
  {
    to: '/dashboard/buyer',
    label: 'Vue d\'ensemble',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/buyer/favorites',
    label: 'Mes favoris',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 15S2 10.5 2 6a4 4 0 018-1 4 4 0 018 1c0 4.5-7 9-7 9z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/buyer/messages',
    label: 'Messages',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M15.5 11.5a1 1 0 01-1 1H5l-3 3V3.5a1 1 0 011-1h11.5a1 1 0 011 1v8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/profile',
    label: 'Mon profil',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2.5 16c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function DashboardLayout() {
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogout()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = user?.role === 'farmer' ? farmerNav : buyerNav

  const handleLogout = () => {
    logout(undefined, { onSuccess: () => navigate('/') })
  }

  const sidebarContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #F0F0F0' }}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <img src="/images/agril.svg" alt="AgriL" style={{ height: '45px', width: 'auto' }} />
        </NavLink>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
          }}>
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user?.name}
            </p>
            <p style={{
              fontSize: '0.72rem',
              color: 'var(--color-text-muted)',
              fontWeight: 400,
            }}>
              {user?.role === 'farmer' ? 'Agriculteur' : 'Acheteur'}
            </p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        <p style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: 'var(--color-text-light)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '0 0.5rem',
          marginBottom: '0.5rem',
        }}>
          Navigation
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard/farmer' || item.to === '/dashboard/buyer'}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.875rem',
              borderRadius: '10px',
              marginBottom: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              background: isActive ? 'var(--color-primary-light)' : 'transparent',
              transition: 'all 0.15s',
              textDecoration: 'none',
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #F0F0F0' }}>
        <NavLink
          to="/farms"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 0.875rem',
            borderRadius: '10px',
            marginBottom: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: 400,
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
            transition: 'all 0.15s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3L2 9h2.5v7h4v-4h1v4h4V9H16L9 3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour au site
        </NavLink>

        <button
          onClick={handleLogout}
          disabled={isPending}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 0.875rem',
            borderRadius: '10px',
            width: '100%',
            fontSize: '0.875rem',
            fontWeight: 400,
            color: '#DC2626',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'background 0.15s',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#FFF5F5'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 16H3.5A1.5 1.5 0 012 14.5v-11A1.5 1.5 0 013.5 2H7M12 13l4-4-4-4M16 9H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isPending ? 'Déconnexion...' : 'Se déconnecter'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{
      display: 'flex',
      minHeight: '100svh',
      background: 'var(--color-bg)',
    }}>

      {/* Sidebar desktop */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        background: 'white',
        borderRight: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        height: '100svh',
        overflowY: 'auto',
        display: 'none',
      }} className="dashboard-sidebar">
        {sidebarContent}
      </aside>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 200,
          }}
        />
      )}

      {/* Sidebar mobile — drawer */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: mobileOpen ? 0 : '-260px',
        width: '240px',
        height: '100svh',
        background: 'white',
        borderRight: '1px solid var(--color-border)',
        zIndex: 201,
        transition: 'left 0.3s ease',
        overflowY: 'auto',
      }} className="dashboard-sidebar-mobile">
        {sidebarContent}
      </aside>

      {/* Zone principale */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header mobile */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid var(--color-border)',
          padding: '0 1.25rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }} className="dashboard-mobile-header">
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display: 'block', width: '20px', height: '2px', background: 'var(--color-text)', borderRadius: '2px' }} />
            ))}
          </button>

          <img src="/images/agril.svg" alt="AgriL" style={{ height: '24px' }} />

          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'white',
          }}>
            {user?.name.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Contenu de la page active */}
        <main style={{ flex: 1, padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}