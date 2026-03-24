import { Link } from 'react-router-dom'
import { useConversations } from '../../../hooks/useMessages'
import { useAuthStore } from '../../../store/authStore'
import { getFavorites } from '../../../api/messages'
import { useQuery } from '@tanstack/react-query'

export default function BuyerDashboard() {
  const { user } = useAuthStore()
  const { data: conversations, isLoading: convsLoading } = useConversations()
  const { data: favorites, isLoading: favsLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  })

  const isLoading = convsLoading || favsLoading
  const unreadMessages = conversations?.reduce((acc, c) => acc + (c.unread_count ?? 0), 0) ?? 0
  const recentConversations = conversations?.slice(0, 4) ?? []

  const stats = [
    {
      value: favorites?.length ?? 0,
      label: 'Exploitations',
      sub: 'favorites',
      color: '#92400E',
      bg: '#FFFBEB',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 17S3 12.5 3 7.5a4.5 4.5 0 019-1 4.5 4.5 0 019 1C21 12.5 10 17 10 17z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      value: conversations?.length ?? 0,
      label: 'Conversations',
      sub: 'actives',
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-light)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.5 13a1 1 0 01-1 1H6l-3.5 3.5V4.5a1 1 0 011-1H16.5a1 1 0 011 1V13z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      value: unreadMessages,
      label: 'Messages',
      sub: 'non lus',
      color: '#1D4ED8',
      bg: '#EFF6FF',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 5.5h16v11a1 1 0 01-1 1H3a1 1 0 01-1-1v-11zm0 0l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]

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
          Bonjour, {user?.name.split(' ')[0]}.
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
          Trouvez les meilleurs producteurs locaux béninois.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1rem',
      }} className="dashboard-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: stat.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color, flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              {isLoading ? (
                <div style={{ width: '40px', height: '24px', borderRadius: '6px', background: '#F0F0F0' }} />
              ) : (
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem', fontWeight: 700,
                  color: 'var(--color-text)', letterSpacing: '-0.03em',
                  lineHeight: 1, marginBottom: '0.2rem',
                }}>
                  {stat.value}
                </div>
              )}
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {stat.label} <span style={{ color: stat.color, fontWeight: 600 }}>{stat.sub}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Explorer — pleine largeur */}
      <div style={{
        background: 'var(--color-primary)',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        boxShadow: '0 4px 20px rgba(26,107,69,0.25)',
        marginBottom: '2rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Trouver des producteurs
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 700,
            color: 'white', lineHeight: 1.3,
          }}>
            Explorer la carte des exploitations béninoises
          </p>
        </div>
        <Link to="/farms" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'white', color: 'var(--color-primary)',
          padding: '0.75rem 1.5rem', borderRadius: '100px',
          fontSize: '0.875rem', fontWeight: 700,
          fontFamily: 'var(--font-body)', flexShrink: 0,
          transition: 'transform 0.15s',
          whiteSpace: 'nowrap',
        }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Explorer maintenant
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M10 5l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.5rem',
      }} className="dashboard-content-grid">

        {/* Favoris récents */}
        <div style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            padding: '1.25rem 1.25rem 0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '0.75rem',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem', fontWeight: 700,
              color: 'var(--color-text)', letterSpacing: '-0.015em',
            }}>
              Mes favoris
            </h2>
            <Link to="/dashboard/buyer/favorites" style={{
              fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', gap: '0.25rem',
            }}>
              Tout voir
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ height: '56px', borderRadius: '8px', background: '#F5F5F5', opacity: 0.5 }} />
              ))}
            </div>
          ) : (favorites?.length ?? 0) === 0 ? (
            <div style={{ padding: '2rem 1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Aucune exploitation sauvegardée.
              </p>
              <Link to="/farms" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'var(--color-primary)', color: 'white',
                padding: '0.6rem 1.25rem', borderRadius: '100px',
                fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-body)',
              }}>
                Explorer les exploitations
              </Link>
            </div>
          ) : (
            <div>
              {favorites?.slice(0, 4).map((farm, i) => (
                <Link
                  key={farm.id}
                  to={`/farms/${farm.id}`}
                  style={{
                    padding: '0.875rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    borderTop: i === 0 ? '1px solid #F5F5F5' : 'none',
                    borderBottom: '1px solid #F5F5F5',
                    transition: 'background 0.15s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '0.875rem',
                    fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {farm.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {farm.name}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      {farm.city}, {farm.department}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 600,
                    background: (farm.available_stocks_count ?? 0) > 0 ? 'var(--color-primary-light)' : '#F5F5F5',
                    color: (farm.available_stocks_count ?? 0) > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    padding: '0.2rem 0.5rem', borderRadius: '100px', whiteSpace: 'nowrap',
                  }}>
                    {farm.available_stocks_count ?? 0} stock{(farm.available_stocks_count ?? 0) !== 1 ? 's' : ''}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Derniers messages */}
        <div style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            padding: '1.25rem 1.25rem 0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '0.75rem',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem', fontWeight: 700,
              color: 'var(--color-text)', letterSpacing: '-0.015em',
            }}>
              Derniers messages
            </h2>
            <Link to="/dashboard/buyer/messages" style={{
              fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', gap: '0.25rem',
            }}>
              Voir tout
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ height: '60px', borderRadius: '8px', background: '#F5F5F5', opacity: 0.5 }} />
              ))}
            </div>
          ) : recentConversations.length === 0 ? (
            <div style={{ padding: '2rem 1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
                Aucun message pour l'instant.
              </p>
            </div>
          ) : (
            <div>
              {recentConversations.map((conv, i) => (
                <Link
                  key={conv.id}
                  to="/dashboard/buyer/messages"
                  style={{
                    padding: '0.875rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    borderTop: i === 0 ? '1px solid #F5F5F5' : 'none',
                    borderBottom: '1px solid #F5F5F5',
                    transition: 'background 0.15s', textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E8F5EE 0%, #C8E6D4 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '0.875rem',
                    fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0,
                  }}>
                    {conv.farm?.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <p style={{
                        fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {conv.farm?.name ?? 'Exploitation'}
                      </p>
                      {(conv.unread_count ?? 0) > 0 && (
                        <span style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: 'var(--color-primary)', color: 'white',
                          fontSize: '0.65rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize: '0.72rem', color: 'var(--color-text-muted)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontWeight: (conv.unread_count ?? 0) > 0 ? 500 : 300,
                    }}>
                      {conv.last_message?.content ?? 'Nouvelle conversation'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}