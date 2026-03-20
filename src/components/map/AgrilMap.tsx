import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import type { Farm } from '../../types'
import { useMapStore } from '../../store/mapStore'

interface Props {
  farms: Farm[]
  selectedFarmId?: number | null
}

function MapController() {
  const { center, zoom } = useMapStore()
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom, { animate: true })
  }, [center, zoom, map])

  return null
}

export default function AgrilMap({ farms, selectedFarmId }: Props) {
  const { center, zoom } = useMapStore()

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%', borderRadius: '16px' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController />

      {farms.map((farm) => (
        <Marker
          key={farm.id}
          position={[farm.latitude, farm.longitude]}
        >
          <Popup>
            <div style={{ fontFamily: 'var(--font-body)', minWidth: '160px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--color-earth)',
                  marginBottom: '0.2rem',
                }}
              >
                {farm.name}
              </p>
              <p style={{ fontSize: '0.78rem', color: '#9B8B7E', marginBottom: '0.5rem' }}>
                {farm.city}, {farm.department}
              </p>
              {farm.available_stocks_count !== undefined && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-green-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {farm.available_stocks_count} stock{farm.available_stocks_count !== 1 ? 's' : ''} disponible{farm.available_stocks_count !== 1 ? 's' : ''}
                </p>
              )}
              <Link
                to={`/farms/${farm.id}`}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--color-green-primary)',
                  textDecoration: 'none',
                }}
              >
                Voir l'exploitation →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}