import { useParams, Link, useNavigate } from 'react-router-dom'
import { useFarm } from '../../hooks/useFarms'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { useAuthStore } from '../../store/authStore'
import { useFindOrCreateConversation } from '../../hooks/useMessages'

const STATUS_CONFIG = {
  available: { label: 'Disponible', bg: '#ECFDF5', color: '#065F46' },
  reserved: { label: 'Réservé', bg: '#FFFBEB', color: '#92400E' },
  exhausted: { label: 'Épuisé', bg: '#F5F5F5', color: '#737373' },
}

const productImages: Record<string, string> = {
  'tomate': '/images/tomato.jpg',
  'maïs': '/images/maize.jpg',
  'igname': '/images/farm.jpg',
  'arachide': '/images/corn.jpg',
  'ananas': '/images/maize2.jpg',
  'manioc': '/images/field.jpg',
}

function getProductImage(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, img] of Object.entries(productImages)) {
    if (lower.includes(key)) return img
  }
  return '/images/field.jpg'
}

export default function FarmDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: farm, isLoading, isError } = useFarm(Number(id))
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        {[200, 100, 80, 80].map((h, i) => (
          <div key={i} style={{
            height: `${h}px`,
            borderRadius: '16px',
            background: '#F0F0F0',
            opacity: 0.5 - i * 0.08,
            marginBottom: '1rem',
          }} />
        ))}
      </div>
    )
  }

  if (isError || !farm) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.25rem', textAlign: 'center' }}>
        <p style={{ color: '#C0392B', marginBottom: '1rem', fontSize: '0.95rem' }}>
          Exploitation introuvable.
        </p>
        <Link to="/farms" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
          ← Retour aux exploitations
        </Link>
      </div>
    )
  }

  const availableStocks = farm.stocks?.filter((s) => s.status === 'available') ?? []
  const otherStocks = farm.stocks?.filter((s) => s.status !== 'available') ?? []

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate(`/dashboard/messages?farm=${farm.id}`)
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100svh - 64px)' }}>

      {/* Banner photo */}
      <div style={{
        position: 'relative',
        height: 'clamp(180px, 30vw, 260px)',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0D3D28 0%, #1A6B45 60%, #2D9B6A 100%)',
      }}>
        <img
          src="/images/field.jpg"
          alt={farm.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.55,
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
        }} />

        <div style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.25rem',
        }}>
          <Link
            to="/farms"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '100px',
              padding: '0.4rem 0.875rem',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: 'white',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M9 6H3M3 6L6 3M3 6L6 9" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Retour
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.25rem 4rem' }}>

        {/* Carte profil */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          border: '1px solid var(--color-border)',
          padding: '1.5rem',
          marginTop: '-2.5rem',
          position: 'relative',
          zIndex: 10,
          marginBottom: '1.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(26,107,69,0.25)',
            }}>
              {farm.name.charAt(0)}
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 3vw, 1.6rem)',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.2,
                }}>
                  {farm.name}
                </h1>
                {availableStocks.length > 0 && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: '#ECFDF5',
                    color: '#065F46',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '100px',
                    border: '1px solid #A7F3D0',
                  }}>
                    {availableStocks.length} stock{availableStocks.length !== 1 ? 's' : ''} actif{availableStocks.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1C4.343 1 3 2.343 3 4c0 2.5 3 7 3 7s3-4.5 3-7c0-1.657-1.343-3-3-3zm0 4a1 1 0 110-2 1 1 0 010 2z" fill="#BBBBBB"/>
                  </svg>
                  {farm.address ? `${farm.address} · ` : ''}{farm.city}, {farm.department}
                </p>
                {farm.owner && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="4" r="2.5" stroke="#BBBBBB" strokeWidth="1.2"/>
                      <path d="M1.5 10.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="#BBBBBB" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {farm.owner.name}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleContact}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '100px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(26,107,69,0.25)',
                transition: 'background 0.2s, transform 0.15s',
                flexShrink: 0,
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
                <path d="M12.5 9.5a1 1 0 01-1 1h-7l-3 2V2.5a1 1 0 011-1h10a1 1 0 011 1v7z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Envoyer un message
            </button>
          </div>

          {farm.description && (
            <div style={{
              marginTop: '1.25rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #F0F0F0',
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.75,
                fontWeight: 300,
                fontStyle: 'italic',
              }}>
                "{farm.description}"
              </p>
            </div>
          )}

          {/* Stats rapides */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #F0F0F0',
          }}>
            {[
              { value: farm.stocks?.length ?? 0, label: 'Stocks actifs' },
              { value: farm.stocks?.reduce((acc, s) => acc + (s.product ? 1 : 0), 0) ?? 0, label: 'Produits' },
              { value: '98%', label: 'Réponse' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '0.2rem',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grille principale */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem',
        }} className="farm-detail-grid">

          {/* Stocks */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--color-text)',
                letterSpacing: '-0.02em',
              }}>
                Stocks Disponibles
              </h2>
              {availableStocks.length > 0 && (
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Trier par{' '}
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}>Plus récent ↓</span>
                </span>
              )}
            </div>

            {availableStocks.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                padding: '2.5rem',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
              }}>
                Aucun stock disponible pour le moment.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem' }} className="stocks-grid">
                {availableStocks.map((stock) => {
                  const s = STATUS_CONFIG[stock.status]
                  const image = getProductImage(stock.product?.name ?? '')
                  return (
                    <div
                      key={stock.id}
                      style={{
                        background: 'white',
                        borderRadius: '16px',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
                        <img
                          src={image}
                          alt={stock.product?.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: 'rgba(255,255,255,0.92)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '100px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                        }}>
                          {stock.price_per_unit.toLocaleString('fr-FR')} FCFA/{stock.unit}
                        </div>
                        <div style={{
                          position: 'absolute',
                          top: '0.5rem',
                          left: '0.5rem',
                          background: s.bg,
                          borderRadius: '100px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: s.color,
                        }}>
                          {s.label}
                        </div>
                      </div>

                      <div style={{ padding: '0.875rem' }}>
                        <h3 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: 'var(--color-text)',
                          letterSpacing: '-0.01em',
                          marginBottom: '0.25rem',
                        }}>
                          {stock.product?.name}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                          <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{stock.quantity} {stock.unit}</strong> disponibles
                        </p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>
                          Dès le {new Date(stock.available_from).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                        {stock.notes && (
                          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', fontStyle: 'italic', fontWeight: 300 }}>
                            {stock.notes}
                          </p>
                        )}

                        <button
                          onClick={handleContact}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            width: '100%',
                            marginTop: '0.75rem',
                            padding: '0.6rem',
                            borderRadius: '100px',
                            border: '1.5px solid var(--color-primary)',
                            background: 'transparent',
                            color: 'var(--color-primary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-body)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
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
                          Contacter l'agriculteur
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {otherStocks.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                  Autres stocks
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {otherStocks.map((stock) => {
                    const s = STATUS_CONFIG[stock.status]
                    return (
                      <div key={stock.id} style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        padding: '0.875rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: 0.65,
                      }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
                          {stock.product?.name} · {stock.quantity} {stock.unit}
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          background: s.bg,
                          color: s.color,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '100px',
                        }}>
                          {s.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar droite */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Mini carte */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ height: '180px' }}>
                <MapContainer
                  center={[farm.latitude, farm.longitude]}
                  zoom={13}
                  style={{ width: '100%', height: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[farm.latitude, farm.longitude]} />
                </MapContainer>
              </div>
              <div style={{ padding: '1rem' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                  Localisation
                </p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.15rem' }}>
                  {farm.city}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Département du {farm.department}
                </p>
                {farm.address && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                    {farm.address}
                  </p>
                )}
              </div>
            </div>

            {/* Bouton contact */}
            <button
              onClick={handleContact}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '100px',
                fontSize: '0.9rem',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(26,107,69,0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary-hover)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,107,69,0.35)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-primary)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,107,69,0.3)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 10a1 1 0 01-1 1H4l-3 3V2a1 1 0 011-1h11a1 1 0 011 1v8z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Contacter le producteur
            </button>

            {!isAuthenticated && (
              <Link
                to="/register"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'white',
                  color: 'var(--color-text)',
                  border: '1.5px solid var(--color-border-strong)',
                  padding: '0.9rem',
                  borderRadius: '100px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.2s',
                }}
              >
                Créer un compte gratuitement
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}