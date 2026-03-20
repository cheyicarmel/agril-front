import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          navigate('/')
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div style={{
      minHeight: 'calc(100svh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.25rem',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '480px',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(6rem, 20vw, 10rem)',
          fontWeight: 700,
          color: 'var(--color-primary)',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          opacity: 0.12,
          marginBottom: '-1rem',
          userSelect: 'none',
        }}>
          404
        </div>

        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 18a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm1-6.5a1 1 0 01-2 0V10a1 1 0 012 0v5.5z" fill="var(--color-primary)"/>
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 700,
          color: 'var(--color-text)',
          letterSpacing: '-0.025em',
          marginBottom: '0.75rem',
          lineHeight: 1.2,
        }}>
          Page introuvable.
        </h1>

        <p style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.75,
          fontWeight: 300,
          marginBottom: '2rem',
        }}>
          La page que vous cherchez n'existe pas ou a été déplacée. Vous serez redirigé automatiquement dans{' '}
          <strong style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{countdown}s</strong>.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--color-primary)',
              color: 'white',
              padding: '0.875rem 2rem',
              borderRadius: '100px',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 16px rgba(26,107,69,0.25)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-primary-hover)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-primary)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L1 7l6 6M1 7h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Retour à l'accueil
          </Link>

          <Link
            to="/farms"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'white',
              color: 'var(--color-text)',
              padding: '0.875rem 1.75rem',
              borderRadius: '100px',
              fontSize: '0.875rem',
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
              border: '1.5px solid var(--color-border-strong)',
              transition: 'border-color 0.2s',
            }}
          >
            Voir les exploitations
          </Link>
        </div>
      </div>
    </div>
  )
}