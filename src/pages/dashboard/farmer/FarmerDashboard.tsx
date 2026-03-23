import { Link } from 'react-router-dom'
import { useMyStocks } from '../../../hooks/useStockes'
import { useMyFarms } from '../../../hooks/useFarms'
import { useConversations } from '../../../hooks/useMessages'
import { useAuthStore } from '../../../store/authStore'

export default function FarmerDashboard() {
  const { user } = useAuthStore()
  const { data: stocks, isLoading: stocksLoading } = useMyStocks()
  const { data: farms, isLoading: farmsLoading } = useMyFarms()
  const { data: conversations, isLoading: convsLoading } = useConversations()

  const activeStocks = stocks?.filter(s => s.status === 'available').length ?? 0
  const reservedStocks = stocks?.filter(s => s.status === 'reserved').length ?? 0
  const exhaustedStocks = stocks?.filter(s => s.status === 'exhausted').length ?? 0
  const unreadMessages = conversations?.reduce((acc, c) => acc + (c.unread_count ?? 0), 0) ?? 0
  const recentStocks = stocks?.slice(0, 5) ?? []
  const recentConversations = conversations?.slice(0, 4) ?? []

  const isLoading = stocksLoading || farmsLoading || convsLoading

  const stats = [
    {
      value: farms?.length ?? 0,
      label: 'Exploitations',
      sub: 'actives',
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-light)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 18V9.5L10 3l8 6.5V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 18v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      value: activeStocks,
      label: 'Stocks',
      sub: 'disponibles',
      color: '#065F46',
      bg: '#ECFDF5',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 6L10 2l8 4v8L10 18l-8-4V6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 11V18M2 6l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      value: unreadMessages,
      label: 'Messages',
      sub: 'non lus',
      color: '#92400E',
      bg: '#FFFBEB',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.5 13a1 1 0 01-1 1H6l-3.5 3.5V3.5a1 1 0 011-1h13a1 1 0 011 1V13z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      value: reservedStocks,
      label: 'Stocks',
      sub: 'réservés',
      color: '#1D4ED8',
      bg: '#EFF6FF',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.5 5.1 17.2l.9-5.5L2 7.8l5.5-.8L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* En-tête */}
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
          Voici un aperçu de votre activité sur AgriL. D'ici, vous pourrait gérer vos fermes (exploitations), stocks, messages ainsi que votre profil utilisateur. 
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
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
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: stat.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.color,
              flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              {isLoading ? (
                <div style={{ width: '40px', height: '24px', borderRadius: '6px', background: '#F0F0F0' }} />
              ) : (
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '0.2rem',
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.5rem',
      }} className="dashboard-content-grid">

        {/* Derniers stocks */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            padding: '1.25rem 1.25rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              letterSpacing: '-0.015em',
            }}>
              Mes derniers stocks
            </h2>
            <Link to="/dashboard/farmer/stocks" style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}>
              Tout gérer
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div style={{ padding: '1.25rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '48px', borderRadius: '8px', background: '#F5F5F5', marginBottom: '0.5rem', opacity: 0.6 - i * 0.1 }} />
              ))}
            </div>
          ) : recentStocks.length === 0 ? (
            <div style={{ padding: '2rem 1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Vous n'avez pas encore publié de stock.
              </p>
              <Link to="/dashboard/farmer/stocks" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--color-primary)',
                color: 'white',
                padding: '0.6rem 1.25rem',
                borderRadius: '100px',
                fontSize: '0.82rem',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
              }}>
                Publier mon premier stock
              </Link>
            </div>
          ) : (
            <div>
              {recentStocks.map((stock, i) => {
                const statusColors = {
                  available: { bg: '#ECFDF5', color: '#065F46', label: 'Disponible' },
                  reserved: { bg: '#FFFBEB', color: '#92400E', label: 'Réservé' },
                  exhausted: { bg: '#F5F5F5', color: '#737373', label: 'Épuisé' },
                }
                const s = statusColors[stock.status]
                return (
                  <div key={stock.id} style={{
                    padding: '0.875rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: i === 0 ? '1px solid #F5F5F5' : 'none',
                    borderBottom: '1px solid #F5F5F5',
                    gap: '1rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', minWidth: 0 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--color-primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                      }}>
                        {stock.product?.name?.charAt(0) ?? '?'}
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
                          {stock.product?.name}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          {stock.quantity} {stock.unit} · {stock.price_per_unit.toLocaleString('fr-FR')} FCFA/{stock.unit}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: s.bg,
                      color: s.color,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '100px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Dernières conversations */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            padding: '1.25rem 1.25rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              letterSpacing: '-0.015em',
            }}>
              Derniers messages
            </h2>
            <Link to="/dashboard/farmer/messages" style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}>
              Voir tout
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div style={{ padding: '1.25rem' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ height: '60px', borderRadius: '8px', background: '#F5F5F5', marginBottom: '0.5rem', opacity: 0.6 - i * 0.15 }} />
              ))}
            </div>
          ) : recentConversations.length === 0 ? (
            <div style={{ padding: '2rem 1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Aucun message reçu pour l'instant.
              </p>
            </div>
          ) : (
            <div>
              {recentConversations.map((conv, i) => (
                <Link
                  key={conv.id}
                  to="/dashboard/farmer/messages"
                  style={{
                    padding: '0.875rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    borderTop: i === 0 ? '1px solid #F5F5F5' : 'none',
                    borderBottom: '1px solid #F5F5F5',
                    transition: 'background 0.15s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E8F5EE 0%, #C8E6D4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    flexShrink: 0,
                  }}>
                    {conv.buyer?.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {conv.buyer?.name ?? 'Acheteur'}
                      </p>
                      {(conv.unread_count ?? 0) > 0 && (
                        <span style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'var(--color-primary)',
                          color: 'white',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize: '0.72rem',
                      color: 'var(--color-text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
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