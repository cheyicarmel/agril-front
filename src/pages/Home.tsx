import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStocks } from '../hooks/useStockes'
import { useAuthStore } from '../store/authStore'

const stats = [
  { value: '1 200+', label: 'Agriculteurs' },
  { value: '5 000+', label: 'Produits' },
  { value: '45', label: 'Villes' },
]

const productImages: Record<string, string> = {
  'tomate': '/images/tomato.jpg',
  'maïs': '/images/maize.jpg',
  'maiz': '/images/maize2.jpg',
  'igname': '/images/farm.jpg',
  'arachide': '/images/corn.jpg',
  'ananas': '/images/maize2.jpg',
  'niébé': '/images/corn.jpg',
  'manioc': '/images/field.jpg',
}



function getProductImage(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, img] of Object.entries(productImages)) {
    if (lower.includes(key)) return img
  }
  return '/images/field.jpg'
}

const howItWorks = [
  { num: '01', title: 'Explorez la carte', desc: 'Visualisez toutes les fermes avec leurs stocks disponibles, par produit et par zone géographique.' },
  { num: '02', title: 'Contactez directement', desc: 'Envoyez un message au producteur sans intermédiaire. Négociez prix, quantité et livraison.' },
  { num: '03', title: 'Concluez l\'échange', desc: 'Finalisez la commande en direct. Aucune commission prélevée par AgriL.' },
]

export default function Home() {
  const [visible, setVisible] = useState(false)
  const { data: stocksData, isLoading } = useStocks({ page: 1 })
  const featuredStocks = stocksData?.data?.slice(0, 4) ?? []
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    setTimeout(() => setVisible(true), 60)
  }, [])

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}>

      {/* HERO */}
      <section style={{
        position: 'relative',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <img
          src="/images/hero-farm.jpg"
          alt="Champ agricole béninois"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 100%)',
        }} />

        <div style={{
          position: 'relative',
          width: '100%',
          padding: '6rem 1.25rem 8rem',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '100px',
              padding: '0.4rem 1rem',
              marginBottom: '1.75rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Bénin · Marché agricole local
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}>
              Trouvez des produits frais chez les{' '}
              <em style={{ color: '#4ADE80', fontStyle: 'italic' }}>
                agriculteurs béninois.
              </em>
            </h1>

            <p style={{
              fontSize: 'clamp(0.9rem, 3vw, 1.05rem)',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.75,
              marginBottom: '2rem',
              fontWeight: 300,
            }}>
              De la terre à votre table, sans intermédiaires inutiles.
            </p>

            {/* <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <Link
                to="/farms"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'var(--color-primary)',
                  color: 'white',
                  padding: '0.95rem 2rem',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  boxShadow: '0 4px 24px rgba(26,107,69,0.4)',
                  transition: 'transform 0.2s',
                }}
              >
                Je suis acheteur
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <Link
                to="/register"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '0.95rem 2rem',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                }}
              >
                Je suis agriculteur
              </Link>
            </div> */}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '1.25rem 1rem',
              textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: '0.25rem',
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUITS VEDETTES */}
      <section style={{ padding: 'clamp(3rem, 8vw, 5rem) 1.25rem', background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1.75rem',
            gap: '1rem',
          }}>
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                La récolte du jour
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 5vw, 2.25rem)',
                fontWeight: 700,
                color: 'var(--color-text)',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
              }}>
                Produits vedettes
              </h2>
            </div>
            <Link to="/farms" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              Voir tout
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
          }} className="products-grid">
            {isLoading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{
                background: 'white',
                borderRadius: '16px',
                height: '260px',
                border: '1px solid var(--color-border)',
                opacity: 0.5,
              }} />
            ))}

            {featuredStocks.map((stock) => {
              const productName = stock.product?.name ?? ''
              const image = getProductImage(productName)
              return (
                <Link
                  key={stock.id}
                  to={`/farms/${stock.farm?.id ?? ''}`}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    display: 'block',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.25s, box-shadow 0.25s',
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
                  <div style={{ position: 'relative', height: 'clamp(140px, 30vw, 200px)', overflow: 'hidden' }}>
                    <img
                      src={image}
                      alt={productName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '0.6rem',
                      left: '0.6rem',
                      background: 'rgba(255,255,255,0.92)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '100px',
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                    }}>
                      {stock.farm?.city ?? ''}
                    </div>
                  </div>
                  <div style={{ padding: '0.875rem' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      letterSpacing: '-0.01em',
                      marginBottom: '0.15rem',
                    }}>
                      {productName}
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.6rem' }}>
                      {stock.farm?.name ?? ''}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        letterSpacing: '-0.02em',
                      }}>
                        {stock.price_per_unit.toLocaleString('fr-FR')} FCFA/{stock.unit}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        background: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '100px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>
                        {stock.quantity} {stock.unit}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section style={{
        padding: 'clamp(3rem, 8vw, 5rem) 1.25rem',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
          }} className="how-grid">
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Comment ça marche
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-text)',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                marginBottom: '2.5rem',
              }}>
                Simple des deux côtés du marché.
              </h2>

              {howItWorks.map((step, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '1.25rem',
                  marginBottom: i < 2 ? '2rem' : 0,
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--color-border-strong)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    flexShrink: 0,
                    minWidth: '2.5rem',
                    marginTop: '0.15rem',
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: '0.35rem',
                      letterSpacing: '-0.01em',
                    }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7, fontWeight: 300 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="/images/farmer.jpg"
                alt="Agriculteur béninois"
                style={{
                  width: '100%',
                  height: 'clamp(280px, 60vw, 480px)',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-1rem',
                left: '1rem',
                background: 'white',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                minWidth: '180px',
              }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Stock publié
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: '0.2rem',
                }}>
                  Igname · 500 kg
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Bohicon, Zou</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>350 FCFA/kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(3rem, 8vw, 5rem) 1.25rem', background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
            <img
              src="/images/field.jpg"
              alt="Champ agricole"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(13,61,40,0.9) 0%, rgba(13,61,40,0.75) 100%)',
            }} />

            <div style={{
              position: 'relative',
              padding: 'clamp(2.5rem, 8vw, 4rem) clamp(1.5rem, 5vw, 4rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }} className="cta-inner">
              <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
                  Pour les producteurs
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.2,
                  marginBottom: '0.875rem',
                }}>
                  Votre exploitation mérite{' '}
                  <em style={{ color: '#4ADE80', fontStyle: 'italic' }}>d'être visible.</em>
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.7 }}>
                  Publiez vos stocks et soyez contacté par des acheteurs professionnels dans tout le Bénin. Inscription gratuite.
                </p>
              </div>

              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    background: 'white',
                    color: 'var(--color-text)',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-body)',
                    boxShadow: 'var(--shadow-lg)',
                    alignSelf: 'flex-start',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Accéder à mon tableau de bord
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              ) : (
                <Link
                  to="/register"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    background: 'white',
                    color: 'var(--color-text)',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-body)',
                    boxShadow: 'var(--shadow-lg)',
                    alignSelf: 'flex-start',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Créer mon profil gratuitement
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}