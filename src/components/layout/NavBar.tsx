import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useLogout } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore()
  const { mutate: logout, isPending } = useLogout()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout(undefined, { onSuccess: () => navigate('/login') })
    setMenuOpen(false)
  }

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.875rem',
    fontWeight: 500,
    color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
    padding: '0.4rem 0',
    borderBottom: `2px solid ${active ? 'var(--color-primary)' : 'transparent'}`,
    transition: 'color 0.2s, border-color 0.2s',
    fontFamily: 'var(--font-body)',
  })

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.25rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src="/images/agril.svg" alt="AgriL" style={{ height: '50px', width: 'auto' }} />
          </Link>

          {/* Desktop — centre */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem',
            flex: 1,
            justifyContent: 'center',
          }} className="nav-desktop-links">
            <Link to="/farms" style={linkStyle(isActive('/farms'))}>Exploitations</Link>
            {isAuthenticated && user && (
              <Link to="/dashboard" style={linkStyle(isActive('/dashboard'))}>Tableau de bord</Link>
            )}
          </div>

          {/* Desktop — droite */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.75rem',
            flexShrink: 0,
          }} className="nav-desktop-actions">
            {isAuthenticated && user ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '100px',
                  border: '1px solid var(--color-border)',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'white',
                    flexShrink: 0,
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    padding: '0.4rem 0.5rem',
                  }}
                >
                  {isPending ? '...' : 'Déconnexion'}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-strong)',
                  fontFamily: 'var(--font-body)',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                }}>
                  Je suis acheteur
                </Link>
                <Link to="/register" style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'white',
                  background: 'var(--color-primary)',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-body)',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                }}>
                  Je suis agriculteur
                </Link>
              </>
            )}
          </div>

          {/* Burger — mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              flexShrink: 0,
            }}
            className="nav-burger"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: 'var(--color-text)',
                borderRadius: '2px',
                transition: 'all 0.25s',
                transform: menuOpen
                  ? i === 0 ? 'translateY(7px) rotate(45deg)'
                  : i === 1 ? 'scaleX(0)'
                  : 'translateY(-7px) rotate(-45deg)'
                  : 'none',
              }} />
            ))}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div style={{
            background: 'white',
            borderTop: '1px solid var(--color-border)',
            padding: '1.5rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <Link to="/farms" style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text)', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
              Exploitations
            </Link>
            {isAuthenticated && user && (
              <Link to="/dashboard" style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text)', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                Tableau de bord
              </Link>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
              {isAuthenticated && user ? (
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border-strong)',
                    background: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Déconnexion
                </button>
              ) : (
                <>
                  <Link to="/login" style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border-strong)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                  }}>
                    Je suis acheteur
                  </Link>
                  <Link to="/register" style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.875rem',
                    borderRadius: '10px',
                    background: 'var(--color-primary)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'white',
                  }}>
                    Je suis agriculteur
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}