import { Link } from 'react-router-dom'
import type { Farm } from '../../types'

interface Props {
  farm: Farm
  isSelected?: boolean
  onClick?: () => void
}

export default function FarmCard({ farm, isSelected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? 'var(--color-primary-light)' : 'white',
        borderRadius: '14px',
        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : '#F0F0F0'}`,
        padding: '0.875rem 1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        gap: '0.875rem',
        alignItems: 'flex-start',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--color-border-strong)'
          e.currentTarget.style.background = '#FAFAFA'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#F0F0F0'
          e.currentTarget.style.background = 'white'
        }
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: isSelected
          ? 'var(--color-primary)'
          : 'linear-gradient(135deg, #E8F5EE 0%, #C8E6D4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        fontWeight: 700,
        color: isSelected ? 'white' : 'var(--color-primary)',
        flexShrink: 0,
      }}>
        {farm.name.charAt(0)}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {farm.name}
          </h3>
          {farm.available_stocks_count !== undefined && farm.available_stocks_count > 0 && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              background: 'var(--color-primary)',
              color: 'white',
              padding: '0.15rem 0.5rem',
              borderRadius: '100px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {farm.available_stocks_count} stock{farm.available_stocks_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
            <path d="M5 1C3.343 1 2 2.343 2 4c0 2.5 3 6 3 6s3-3.5 3-6c0-1.657-1.343-3-3-3zm0 4a1 1 0 110-2 1 1 0 010 2z" fill="#BBBBBB"/>
          </svg>
          {farm.city}, {farm.department}
        </p>

        {farm.stocks && farm.stocks.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {farm.stocks.slice(0, 2).map((stock) => (
              <span key={stock.id} style={{
                fontSize: '0.65rem',
                background: '#F5F5F5',
                color: 'var(--color-text-muted)',
                padding: '0.15rem 0.5rem',
                borderRadius: '100px',
                fontWeight: 500,
              }}>
                {stock.product?.name}
              </span>
            ))}
            {farm.stocks.length > 2 && (
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-light)' }}>+{farm.stocks.length - 2}</span>
            )}
          </div>
        )}

        <Link
          to={`/farms/${farm.id}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--color-primary)',
            marginTop: '0.4rem',
          }}
        >
          Voir le profil
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}