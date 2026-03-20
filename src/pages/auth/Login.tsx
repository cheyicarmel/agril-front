import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { mutate: login, isPending, error } = useLogin()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(form, { onSuccess: () => navigate('/dashboard', { replace: true }) })
  }

  const errorMessage = error
    ? (error as any).response?.data?.message ?? 'Une erreur est survenue.'
    : null

  return (
    <div style={{
      minHeight: 'calc(100svh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: '2rem 1.25rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '860px',
        minHeight: '520px',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr',
        boxShadow: '0 24px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
      }} className="login-card">

        {/* Panneau gauche — vert */}
        <div style={{
          display: 'none',
          background: 'var(--color-primary)',
          padding: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }} className="login-left">

          {/* Forme organique décorative */}
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }} />

          <div>
            <img src="/images/agril.svg" alt="AgriL" style={{ height: '36px', width: 'auto', marginBottom: '3rem', filter: 'brightness(0) invert(1)' }} />
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.25rem',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}>
              Bon retour !
            </h2>
            <p style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.75,
              fontWeight: 300,
              maxWidth: '280px',
            }}>
              Connectez-vous pour accéder à votre espace et gérer vos exploitations ou commandes.
            </p>
          </div>

          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: '2px solid rgba(255,255,255,0.4)',
              color: 'white',
              padding: '0.875rem 2rem',
              borderRadius: '100px',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              transition: 'border-color 0.2s, background 0.2s',
              alignSelf: 'flex-start',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'white'
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Créer un compte
          </Link>
        </div>

        {/* Panneau droit — formulaire blanc */}
        <div style={{
          background: 'white',
          padding: 'clamp(2rem, 6vw, 3.5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Forme organique décorative */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            left: '-60px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'var(--color-primary-light)',
            opacity: 0.6,
          }} />

          <div style={{ position: 'relative' }}>
            {/* Logo visible uniquement sur mobile */}
            <div style={{ marginBottom: '2rem' }} className="login-mobile-logo">
              <img src="/images/agril.svg" alt="AgriL" style={{ height: '32px', width: 'auto' }} />
            </div>

            <div style={{ marginBottom: '2.25rem' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '-0.03em',
                marginBottom: '0.4rem',
                lineHeight: 1.15,
              }}>
                welcome
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
                Connectez-vous à votre compte pour continuer.
              </p>
            </div>

            {errorMessage && (
              <div style={{
                background: '#FFF5F5',
                border: '1px solid #FFD5D5',
                borderRadius: '10px',
                padding: '0.875rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                color: '#C0392B',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="7" stroke="#C0392B" strokeWidth="1.5"/>
                  <path d="M8 5V8M8 11H8.01" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email..."
                  required
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.1rem 0.9rem 3rem',
                    borderRadius: '100px',
                    border: `1.5px solid ${focused === 'email' ? 'var(--color-primary)' : '#E8E8E8'}`,
                    background: focused === 'email' ? 'white' : '#F8F8F8',
                    fontSize: '0.9rem',
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
                <svg style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm0 0l6 5 6-5" stroke={focused === 'email' ? 'var(--color-primary)' : '#BBBBBB'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Password..."
                  required
                  style={{
                    width: '100%',
                    padding: '0.9rem 3.5rem 0.9rem 3rem',
                    borderRadius: '100px',
                    border: `1.5px solid ${focused === 'password' ? 'var(--color-primary)' : '#E8E8E8'}`,
                    background: focused === 'password' ? 'white' : '#F8F8F8',
                    fontSize: '0.9rem',
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
                <svg style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke={focused === 'password' ? 'var(--color-primary)' : '#BBBBBB'} strokeWidth="1.3"/>
                  <path d="M5 7V5a3 3 0 016 0v2" stroke={focused === 'password' ? 'var(--color-primary)' : '#BBBBBB'} strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1.1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#BBBBBB',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M3 3l10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                  )}
                </button>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                  Mot de passe oublié ?
                </span>
              </div>

              <button
                type="submit"
                disabled={isPending}
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  background: isPending ? '#A0C4B4' : 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'background 0.2s, transform 0.15s',
                  marginTop: '0.25rem',
                }}
                onMouseEnter={(e) => { if (!isPending) e.currentTarget.style.background = 'var(--color-primary-hover)' }}
                onMouseLeave={(e) => { if (!isPending) e.currentTarget.style.background = 'var(--color-primary)' }}
              >
                {isPending ? 'Connexion...' : 'LOG IN'}
              </button>
            </form>

            <p style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.82rem',
              color: 'var(--color-text-muted)',
              fontWeight: 300,
            }}>
              Pas encore de compte ?{' '}
              <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                S'inscrire
              </Link>
            </p>

            {/* Comptes de test */}
            {/* <div style={{
              marginTop: '1.5rem',
              padding: '0.875rem 1rem',
              background: 'var(--color-primary-light)',
              borderRadius: '12px',
              fontSize: '0.75rem',
              color: 'var(--color-primary)',
              lineHeight: 1.8,
            }}>
              <strong>Test</strong> — Agriculteur : <code style={{ background: 'rgba(26,107,69,0.1)', padding: '1px 4px', borderRadius: '3px' }}>koffi@agril.bj</code> · Acheteur : <code style={{ background: 'rgba(26,107,69,0.1)', padding: '1px 4px', borderRadius: '3px' }}>cocotier@agril.bj</code> · MDP : <code style={{ background: 'rgba(26,107,69,0.1)', padding: '1px 4px', borderRadius: '3px' }}>password</code>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}