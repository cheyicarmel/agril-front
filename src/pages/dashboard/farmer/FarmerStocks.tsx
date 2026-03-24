import { useState } from 'react'
import { useMyStocks, useCreateStock, useUpdateStockStatus, useDeleteStock } from '../../../hooks/useStockes'
import { useMyFarms } from '../../../hooks/useFarms'
import { useProducts } from '../../../hooks/useProducts'
import type { Stock } from '../../../types'

const STATUS_CONFIG = {
  available: { label: 'Disponible', bg: '#ECFDF5', color: '#065F46' },
  reserved: { label: 'Réservé', bg: '#FFFBEB', color: '#92400E' },
  exhausted: { label: 'Épuisé', bg: '#F5F5F5', color: '#737373' },
}

const STATUS_NEXT: Record<string, { value: string; label: string }> = {
  available: { value: 'reserved', label: 'Marquer réservé' },
  reserved: { value: 'exhausted', label: 'Marquer épuisé' },
  exhausted: { value: 'available', label: 'Remettre disponible' },
}

interface StockFormData {
  farm_id: string
  product_id: string
  quantity: string
  unit: string
  price_per_unit: string
  available_from: string
  notes: string
}

const emptyForm: StockFormData = {
  farm_id: '', product_id: '', quantity: '', unit: '',
  price_per_unit: '', available_from: '', notes: '',
}

export default function FarmerStocks() {
  const { data: stocks, isLoading } = useMyStocks()
  const { data: farms } = useMyFarms()
  const { data: products } = useProducts()
  const { mutate: createStock, isPending: creating } = useCreateStock()
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateStockStatus()
  const { mutate: deleteStock, isPending: deleting } = useDeleteStock()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<StockFormData>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const filteredStocks = stocks?.filter(s =>
    filterStatus === 'all' ? true : s.status === filterStatus
  ) ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    createStock({
      farm_id: parseInt(form.farm_id),
      product_id: parseInt(form.product_id),
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      price_per_unit: parseFloat(form.price_per_unit),
      available_from: form.available_from,
      notes: form.notes || undefined,
    }, {
      onSuccess: () => {
        setShowForm(false)
        setForm(emptyForm)
      },
      onError: (err: any) => {
        const errors = err.response?.data?.errors
        if (errors) {
          const first = Object.values(errors)[0] as string[]
          setFormError(first[0])
        } else {
          setFormError(err.response?.data?.message ?? 'Erreur lors de la publication.')
        }
      },
    })
  }

  const handleStatusChange = (stock: Stock) => {
    const next = STATUS_NEXT[stock.status]
    updateStatus({ id: stock.id, status: next.value })
  }

  const handleDelete = (id: number) => {
    deleteStock(id, {
      onSuccess: () => setConfirmDelete(null),
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: '1.5px solid #E8E8E8',
    background: '#F8F8F8',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-body)',
    color: 'var(--color-text)',
    outline: 'none',
    transition: 'border-color 0.15s, background 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: '0.4rem',
  }

  const categories = products
    ? [...new Set(products.map(p => p.category))].sort()
    : []

  const productsByCategory = categories.map(cat => ({
    category: cat,
    products: products?.filter(p => p.category === cat) ?? [],
  }))

  return (
    <div style={{ maxWidth: '100%' }}>

      {/* En-tête */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.5rem',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '-0.025em',
            marginBottom: '0.35rem',
          }}>
            Mes stocks
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
            {stocks?.length ?? 0} stock{(stocks?.length ?? 0) !== 1 ? 's' : ''} au total
          </p>
        </div>

        <button
          onClick={() => { setShowForm(true); setForm(emptyForm); setFormError(null) }}
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
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Publier un stock
        </button>
      </div>

      {/* Filtres par statut */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { value: 'all', label: `Tous (${stocks?.length ?? 0})` },
          { value: 'available', label: `Disponibles (${stocks?.filter(s => s.status === 'available').length ?? 0})` },
          { value: 'reserved', label: `Réservés (${stocks?.filter(s => s.status === 'reserved').length ?? 0})` },
          { value: 'exhausted', label: `Épuisés (${stocks?.filter(s => s.status === 'exhausted').length ?? 0})` },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '100px',
              border: `1.5px solid ${filterStatus === f.value ? 'var(--color-primary)' : '#E8E8E8'}`,
              background: filterStatus === f.value ? 'var(--color-primary)' : 'white',
              color: filterStatus === f.value ? 'white' : 'var(--color-text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste des stocks */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '90px', borderRadius: '14px', background: 'white', border: '1px solid var(--color-border)', opacity: 0.5 }} />
          ))}
        </div>
      ) : filteredStocks.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid var(--color-border)',
          padding: '3rem', textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            {filterStatus === 'all' ? 'Aucun stock publié pour l\'instant.' : `Aucun stock "${STATUS_CONFIG[filterStatus as keyof typeof STATUS_CONFIG]?.label ?? filterStatus}".`}
          </p>
          {filterStatus === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'var(--color-primary)', color: 'white', border: 'none',
                borderRadius: '100px', padding: '0.7rem 1.5rem',
                fontSize: '0.875rem', fontWeight: 600,
                fontFamily: 'var(--font-body)', cursor: 'pointer',
              }}
            >
              Publier mon premier stock
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredStocks.map((stock) => {
            const s = STATUS_CONFIG[stock.status]
            const next = STATUS_NEXT[stock.status]
            return (
              <div key={stock.id} style={{
                background: 'white',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                padding: '1.1rem 1.25rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'var(--color-primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '1rem',
                  fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0,
                }}>
                  {stock.product?.name?.charAt(0) ?? '?'}
                </div>

                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem', fontWeight: 700,
                      color: 'var(--color-text)', letterSpacing: '-0.01em',
                    }}>
                      {stock.product?.name}
                    </span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700,
                      background: s.bg, color: s.color,
                      padding: '0.2rem 0.5rem', borderRadius: '100px',
                    }}>
                      {s.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {stock.quantity} {stock.unit} ·{' '}
                    <strong style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                      {stock.price_per_unit.toLocaleString('fr-FR')} FCFA
                    </strong>/{stock.unit} ·{' '}
                    Dès le {new Date(stock.available_from).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {stock.farm && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-light)', marginTop: '0.15rem' }}>
                      {stock.farm.name} · {stock.farm.city}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleStatusChange(stock)}
                    disabled={updatingStatus}
                    style={{
                      padding: '0.45rem 0.875rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-strong)',
                      background: 'white',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    {next.label}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(stock.id)}
                    style={{
                      padding: '0.45rem 0.875rem',
                      borderRadius: '8px',
                      border: '1px solid #FECACA',
                      background: '#FFF5F5',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#DC2626',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      transition: 'all 0.15s',
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal confirmation suppression */}
      {confirmDelete !== null && (
        <>
          <div
            onClick={() => setConfirmDelete(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }}
          />
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%', maxWidth: '400px',
            background: 'white', borderRadius: '20px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
            zIndex: 301, padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: '#FFF5F5', border: '1px solid #FECACA',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3 6h16M8 6V4h6v2M19 6l-1 13a2 2 0 01-2 2H6a2 2 0 01-2-2L3 6" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem', fontWeight: 700,
              color: 'var(--color-text)', marginBottom: '0.5rem',
            }}>
              Supprimer ce stock ?
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontWeight: 300 }}>
              Cette action est irréversible. Le stock sera définitivement supprimé.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1, padding: '0.875rem',
                  borderRadius: '100px',
                  border: '1.5px solid var(--color-border-strong)',
                  background: 'white', fontSize: '0.875rem',
                  fontWeight: 500, color: 'var(--color-text)',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                style={{
                  flex: 1, padding: '0.875rem',
                  borderRadius: '100px', border: 'none',
                  background: deleting ? '#FECACA' : '#DC2626',
                  fontSize: '0.875rem', fontWeight: 600,
                  color: 'white', cursor: deleting ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)', transition: 'background 0.2s',
                }}
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal formulaire nouveau stock */}
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }}
          />
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%', maxWidth: '540px',
            maxHeight: '90svh',
            background: 'white', borderRadius: '20px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
            zIndex: 301, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #F0F0F0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexShrink: 0,
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem', fontWeight: 700,
                color: 'var(--color-text)', letterSpacing: '-0.015em',
              }}>
                Publier un nouveau stock
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: '#F5F5F5', border: 'none', borderRadius: '8px',
                  width: '32px', height: '32px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {formError && (
                <div style={{
                  background: '#FFF5F5', border: '1px solid #FFD5D5',
                  borderRadius: '10px', padding: '0.875rem 1rem',
                  fontSize: '0.82rem', color: '#C0392B',
                }}>
                  {formError}
                </div>
              )}

              <div>
                <label style={labelStyle}>Exploitation</label>
                <select
                  value={form.farm_id}
                  onChange={(e) => setForm({ ...form, farm_id: e.target.value })}
                  required
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                >
                  <option value="">Sélectionner une exploitation...</option>
                  {farms?.map(f => <option key={f.id} value={f.id}>{f.name} — {f.city}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Produit</label>
                <select
                  value={form.product_id}
                  onChange={(e) => {
                    const product = products?.find(p => p.id === parseInt(e.target.value))
                    setForm({ ...form, product_id: e.target.value, unit: product?.unit ?? '' })
                  }}
                  required
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                >
                  <option value="">Sélectionner un produit...</option>
                  {productsByCategory.map(({ category, products: prods }) => (
                    <optgroup key={category} label={category}>
                      {prods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Quantité</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder="Ex: 500"
                    min="0.01" step="0.01"
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Unité</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="Ex: kg, sac, tonne"
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Prix unitaire (FCFA)</label>
                  <input
                    type="number"
                    value={form.price_per_unit}
                    onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })}
                    placeholder="Ex: 350"
                    min="1" step="1"
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Disponible à partir du</label>
                  <input
                    type="date"
                    value={form.available_from}
                    onChange={(e) => setForm({ ...form, available_from: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Notes <span style={{ fontWeight: 300, textTransform: 'none' }}>(optionnel)</span></label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Informations complémentaires sur ce stock..."
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1, padding: '0.875rem',
                    borderRadius: '100px',
                    border: '1.5px solid var(--color-border-strong)',
                    background: 'white', fontSize: '0.875rem',
                    fontWeight: 500, color: 'var(--color-text)',
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    flex: 2, padding: '0.875rem',
                    borderRadius: '100px', border: 'none',
                    background: creating ? '#A0C4B4' : 'var(--color-primary)',
                    fontSize: '0.875rem', fontWeight: 600,
                    color: 'white', cursor: creating ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-body)', transition: 'background 0.2s',
                  }}
                >
                  {creating ? 'Publication...' : 'Publier le stock'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}