import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFavorites, removeFavorite } from '../../../api/messages'

export default function BuyerFavorites() {
  const queryClient = useQueryClient()
  const { data: farms, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  })

  const { mutate: remove, isPending: removing } = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  })

  return (
    <div style={{ maxWidth: '100%' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
          fontWeight: 700,
          color: 'var(--color-text)',
          letterSpacing: '-0.025em',
          marginBottom: '0.35rem',
        }}>
          Mes favoris
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
          {farms?.length ?? 0} exploitation{(farms?.length ?? 0) !== 1 ? 's' : ''} sauvegardée{(farms?.length ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {isLoading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '160px', borderRadius: '16px',
              background: 'white', border: '1px solid var(--color-border)',
              opacity: 0.5,
            }} />
          ))}
        </div>
      ) : (farms?.length ?? 0) === 0 ? (
        <div style={{
          background: 'white', borderRadius: '20px',
          border: '1px solid var(--color-border)',
          padding: '4rem 2rem', textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: '#FFFBEB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 21S4 15 4 9a5 5 0 0110-1 5 5 0 0110 1c0 6-8 12-8 12z" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.4rem' }}>
            Aucune exploitation sauvegardée
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontWeight: 300 }}>
            Explorez la carte et ajoutez des exploitations à vos favoris pour les retrouver facilement.
          </p>
          <Link to="/farms" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--color-primary)', color: 'white',
            padding: '0.75rem 1.5rem', borderRadius: '100px',
            fontSize: '0.875rem', fontWeight: 600,
            fontFamily: 'var(--font-body)',
          }}>
            Explorer les exploitations
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {farms?.map((farm) => (
            <div key={farm.id} style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
            >
              {/* Banner */}
              <div style={{
                height: '80px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem', fontWeight: 700,
                  color: 'white', opacity: 0.2,
                  letterSpacing: '-0.04em',
                  userSelect: 'none',
                }}>
                  {farm.name.charAt(0)}
                </span>
                <button
                  onClick={() => remove(farm.id)}
                  disabled={removing}
                  style={{
                    position: 'absolute',
                    top: '0.6rem', right: '0.6rem',
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220,38,38,0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  title="Retirer des favoris"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2l8 8M10 2L2 10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem', fontWeight: 700,
                    color: 'var(--color-text)', letterSpacing: '-0.01em',
                    marginBottom: '0.2rem',
                  }}>
                    {farm.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1C3.343 1 2 2.343 2 4c0 2.5 3 6 3 6s3-3.5 3-6c0-1.657-1.343-3-3-3zm0 4a1 1 0 110-2 1 1 0 010 2z" fill="#BBBBBB"/>
                    </svg>
                    {farm.city}, {farm.department}
                  </p>
                </div>

                {farm.available_stocks_count !== undefined && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.875rem',
                  }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600,
                      background: (farm.available_stocks_count ?? 0) > 0 ? 'var(--color-primary-light)' : '#F5F5F5',
                      color: (farm.available_stocks_count ?? 0) > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      padding: '0.2rem 0.5rem', borderRadius: '100px',
                    }}>
                      {farm.available_stocks_count} stock{(farm.available_stocks_count ?? 0) !== 1 ? 's' : ''} disponible{(farm.available_stocks_count ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                <Link
                  to={`/farms/${farm.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '100px',
                    border: '1.5px solid var(--color-primary)',
                    color: 'var(--color-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-primary)'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--color-primary)'
                  }}
                >
                  Voir le profil
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}