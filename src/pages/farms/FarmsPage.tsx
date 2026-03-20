import { useState, useEffect } from 'react'
import { useFarms } from '../../hooks/useFarms'
import { useProducts } from '../../hooks/useProducts'
import AgrilMap from '../../components/map/AgrilMap'
import FarmCard from '../../components/farms/FarmCard'
import { useMapStore } from '../../store/mapStore'
import type { Farm } from '../../types'

const DEPARTMENTS = [
  'Alibori', 'Atacora', 'Atlantique', 'Borgou',
  'Collines', 'Couffo', 'Donga', 'Littoral',
  'Mono', 'Ouémé', 'Plateau', 'Zou',
]

const CATEGORIES = ['Céréales', 'Légumes', 'Fruits', 'Tubercules', 'Légumineuses', 'Transformation']

export default function FarmsPage() {
  const { setCenter, setSelectedFarm, selectedFarmId } = useMapStore()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [department, setDepartment] = useState('')
  const [radius, setRadius] = useState(50)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const { data, isLoading } = useFarms({
    department: department || undefined,
    page,
  })

  const farms = data?.data ?? []

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      )
    }
  }, [])

  const filteredFarms = farms.filter((farm) => {
    if (availableOnly && (farm.available_stocks_count ?? 0) === 0) return false
    if (search) {
      const q = search.toLowerCase()
      const matchName = farm.name.toLowerCase().includes(q)
      const matchProducts = farm.stocks?.some(s => s.product?.name.toLowerCase().includes(q))
      if (!matchName && !matchProducts) return false
    }
    if (category) {
      const hasCategory = farm.stocks?.some(s => s.product?.category === category)
      if (!hasCategory) return false
    }
    if (userLocation && radius) {
      const R = 6371
      const dLat = (farm.latitude - userLocation.lat) * Math.PI / 180
      const dLng = (farm.longitude - userLocation.lng) * Math.PI / 180
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(farm.latitude * Math.PI / 180) * Math.sin(dLng / 2) ** 2
      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      if (dist > radius) return false
    }
    return true
  })

  const handleFarmClick = (farm: Farm) => {
    setSelectedFarm(farm.id)
    setCenter([farm.latitude, farm.longitude])
  }

  const hasFilters = search || category || department || availableOnly

  const resetFilters = () => {
    setSearch('')
    setCategory('')
    setDepartment('')
    setRadius(50)
    setAvailableOnly(false)
    setPage(1)
  }

  return (
    <div style={{ position: 'relative', height: 'calc(100svh - 64px)', overflow: 'hidden' }}>

      {/* Carte plein écran */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <AgrilMap farms={filteredFarms} selectedFarmId={selectedFarmId} />
      </div>

      {/* Panneau gauche */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        bottom: '1rem',
        width: '340px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
      }} className="farms-panel">

        {/* En-tête du panneau */}
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}>
                Rechercher des produits
              </h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                {isLoading ? '...' : `${filteredFarms.length} exploitation${filteredFarms.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            {hasFilters && (
              <button
                onClick={resetFilters}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  background: 'var(--color-primary-light)',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '0.35rem 0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Barre de recherche */}
          <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
            <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', flexShrink: 0 }} width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="#BBBBBB" strokeWidth="1.3"/>
              <path d="M10 10l3 3" stroke="#BBBBBB" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Maïs, Tomates, Avocats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '100px',
                border: '1.5px solid #E8E8E8',
                background: '#F8F8F8',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text)',
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)'
                e.target.style.background = 'white'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E8E8E8'
                e.target.style.background = '#F8F8F8'
              }}
            />
          </div>

          {/* Catégories */}
          <div style={{ marginBottom: '0.875rem' }}>
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              flexWrap: 'wrap',
            }}>
              {['Tout', ...CATEGORIES].map((cat) => {
                const active = cat === 'Tout' ? !category : category === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat === 'Tout' ? '' : cat)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '100px',
                      border: `1.5px solid ${active ? 'var(--color-primary)' : '#E8E8E8'}`,
                      background: active ? 'var(--color-primary)' : 'white',
                      color: active ? 'white' : 'var(--color-text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Département */}
          <div style={{ marginBottom: '0.875rem' }}>
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(1) }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1.5px solid #E8E8E8',
                background: '#F8F8F8',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-body)',
                color: department ? 'var(--color-text)' : 'var(--color-text-muted)',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23BBBBBB' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                paddingRight: '2.5rem',
              }}
            >
              <option value="">Tous les départements</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Rayon */}
          {userLocation && (
            <div style={{ marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Rayon de recherche (km)
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {radius} km
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  appearance: 'none',
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(radius - 10) / 490 * 100}%, #E8E8E8 ${(radius - 10) / 490 * 100}%, #E8E8E8 100%)`,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />
            </div>
          )}

          {/* Toggle disponible maintenant */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            background: '#F8F8F8',
            borderRadius: '12px',
            marginBottom: '1rem',
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--color-text)' }}>
              Disponible maintenant
            </span>
            <button
              type="button"
              onClick={() => setAvailableOnly(!availableOnly)}
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                background: availableOnly ? 'var(--color-primary)' : '#D4D4D4',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute',
                top: '2px',
                left: availableOnly ? '22px' : '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'white',
                transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }} />
            </button>
          </div>
        </div>

        {/* Séparateur */}
        <div style={{ height: '1px', background: '#F0F0F0', flexShrink: 0 }} />

        {/* Liste des résultats */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
        }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
            Résultats à proximité
          </p>

          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{
              height: '80px',
              borderRadius: '14px',
              background: '#F5F5F5',
              opacity: 0.6 - i * 0.15,
            }} />
          ))}

          {!isLoading && filteredFarms.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem',
            }}>
              Aucune exploitation trouvée.
              <br />
              <button
                onClick={resetFilters}
                style={{
                  marginTop: '0.75rem',
                  color: 'var(--color-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {filteredFarms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              isSelected={selectedFarmId === farm.id}
              onClick={() => handleFarmClick(farm)}
            />
          ))}

          {data && data.last_page > 1 && (
            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', paddingTop: '0.5rem' }}>
              {Array.from({ length: data.last_page }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border-strong)',
                    background: page === i + 1 ? 'var(--color-primary)' : 'white',
                    color: page === i + 1 ? 'white' : 'var(--color-text)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.15s',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bouton ouvrir/fermer panneau sur mobile */}
      <button
        style={{
          display: 'none',
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '100px',
          padding: '0.875rem 2rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(26,107,69,0.35)',
          zIndex: 1001,
          alignItems: 'center',
          gap: '0.5rem',
        }}
        className="farms-mobile-btn"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h8M2 12h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Voir les résultats
      </button>

    </div>
  )
}