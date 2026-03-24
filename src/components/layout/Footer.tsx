import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'


export default function Footer() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      padding: '3rem 2rem',
      marginTop: '4rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '-0.02em',
          }}>
            AgriL
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>
            Connecter les producteurs béninois aux marchés locaux.
          </p>
        </div>
        {isAuthenticated ? (
          <div>
            
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { to: '/farms', label: 'Exploitations' },
              { to: '/register', label: 'S\'inscrire' },
              { to: '/login', label: 'Connexion' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', transition: 'color 0.2s' }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
        


        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-light)' }}>
          © 2026 AgriL. Bénin.
        </p>
      </div>
    </footer>
  )
}