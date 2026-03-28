import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyFarms, useCreateFarm, useUpdateFarm } from '../../../hooks/useFarms'
import type { Farm } from '../../../types'

interface FarmFormData {
  name: string
  description: string
  latitude: string
  longitude: string
  address: string
  city: string
  department: string
}

const DEPARTMENTS = [
  'Alibori', 'Atacora', 'Atlantique', 'Borgou',
  'Collines', 'Couffo', 'Donga', 'Littoral',
  'Mono', 'Ouémé', 'Plateau', 'Zou',
]

const emptyForm: FarmFormData = {
  name: '', description: '', latitude: '', longitude: '',
  address: '', city: '', department: '',
}

export default function FarmerFarms() {
  const { data: farms, isLoading } = useMyFarms()
  const { mutate: createFarm, isPending: creating } = useCreateFarm()
  const { mutate: updateFarm, isPending: updating } = useUpdateFarm()
  

  const [showForm, setShowForm] = useState(false)
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null)
  const [form, setForm] = useState<FarmFormData>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const openCreate = () => {
  setEditingFarm(null)
  setForm(emptyForm)
  setFormError(null)
  setImageFile(null)
  setImagePreview(null)
  setShowForm(true)
}

  const openEdit = (farm: Farm) => {
    setEditingFarm(farm)
    setForm({
      name: farm.name,
      description: farm.description ?? '',
      latitude: String(farm.latitude),
      longitude: String(farm.longitude),
      address: farm.address ?? '',
      city: farm.city,
      department: farm.department,
    })
    setFormError(null)
    setShowForm(true)
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          latitude: String(pos.coords.latitude.toFixed(6)),
          longitude: String(pos.coords.longitude.toFixed(6)),
        }))
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const payload = {
      name: form.name,
      description: form.description || undefined,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      address: form.address || undefined,
      city: form.city,
      department: form.department,
    }

    if (isNaN(payload.latitude) || isNaN(payload.longitude)) {
      setFormError('Les coordonnées GPS sont invalides.')
      return
    }

    if (editingFarm) {
      updateFarm(
        { id: editingFarm.id, data: payload },
        {
          onSuccess: () => setShowForm(false),
          onError: (err: any) => setFormError(err.response?.data?.message ?? 'Erreur lors de la modification.'),
        }
      )
  } else {
    createFarm({ ...payload, image: imageFile || undefined }, {
      onSuccess: () => {
        setShowForm(false)
        setImageFile(null)
        setImagePreview(null)
      },
      onError: (err: any) => setFormError(err.response?.data?.message ?? 'Erreur lors de la création.'),
    })
  }
  }

  const handleToggleActive = (farm: Farm) => {
    updateFarm({ id: farm.id, data: { is_active: !farm.is_active } })
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

  return (
    <div style={{ maxWidth: '100%' }}>

      {/* En-tête */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
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
            Mes exploitations
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
            {farms?.length ?? 0} exploitation{(farms?.length ?? 0) !== 1 ? 's' : ''} enregistrée{(farms?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={openCreate}
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
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Nouvelle exploitation
        </button>
      </div>

      {/* Liste */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ height: '120px', borderRadius: '16px', background: 'white', border: '1px solid var(--color-border)', opacity: 0.5 }} />
          ))}
        </div>
      ) : farms?.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          padding: '3rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'var(--color-primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 22V11L12 4l9 7v11" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22v-7h6v7" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.4rem' }}>
            Aucune exploitation enregistrée
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontWeight: 300 }}>
            Créez votre première exploitation pour commencer à publier des stocks.
          </p>
          <button
            onClick={openCreate}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'var(--color-primary)', color: 'white', border: 'none',
              borderRadius: '100px', padding: '0.7rem 1.5rem',
              fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer',
            }}
          >
            Créer mon exploitation
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {farms?.map((farm) => (
            <div key={farm.id} style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'box-shadow 0.2s',
              opacity: farm.is_active ? 1 : 0.6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {farm.name.charAt(0)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem', fontWeight: 700,
                        color: 'var(--color-text)', letterSpacing: '-0.01em',
                      }}>
                        {farm.name}
                      </h3>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 700,
                        background: farm.is_active ? '#ECFDF5' : '#F5F5F5',
                        color: farm.is_active ? '#065F46' : '#737373',
                        padding: '0.2rem 0.5rem', borderRadius: '100px',
                      }}>
                        {farm.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 1C4.12 1 3 2.12 3 3.5c0 2.1 2.5 5.5 2.5 5.5S8 5.6 8 3.5C8 2.12 6.88 1 5.5 1zm0 3.25a.75.75 0 110-1.5.75.75 0 010 1.5z" fill="#BBBBBB"/>
                      </svg>
                      {farm.city}, {farm.department}
                    </p>
                    {farm.description && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 300, fontStyle: 'italic' }}>
                        {farm.description.length > 80 ? farm.description.slice(0, 80) + '...' : farm.description}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <Link
                    to={`/farms/${farm.id}`}
                    style={{
                      padding: '0.5rem 0.875rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-strong)',
                      background: 'white',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6s2-4 5-4 5 4 5 4-2 4-5 4-5-4-5-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    Voir
                  </Link>
                  <button
                    onClick={() => openEdit(farm)}
                    style={{
                      padding: '0.5rem 0.875rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-strong)',
                      background: 'white',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M8.5 1.5l2 2L4 10H2v-2L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Modifier
                  </button>
                  <button
                    onClick={() => handleToggleActive(farm)}
                    disabled={updating}
                    style={{
                      padding: '0.5rem 0.875rem',
                      borderRadius: '8px',
                      border: `1px solid ${farm.is_active ? '#FECACA' : '#A7F3D0'}`,
                      background: farm.is_active ? '#FFF5F5' : '#ECFDF5',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      color: farm.is_active ? '#DC2626' : '#065F46',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {farm.is_active ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal formulaire */}
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 300,
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%', maxWidth: '560px',
            maxHeight: '90svh',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
            zIndex: 301,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #F0F0F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem', fontWeight: 700,
                color: 'var(--color-text)', letterSpacing: '-0.015em',
              }}>
                {editingFarm ? 'Modifier l\'exploitation' : 'Nouvelle exploitation'}
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
                <label style={labelStyle}>Nom de l'exploitation</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Ferme Mensah"
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Description <span style={{ fontWeight: 300, textTransform: 'none' }}>(optionnelle)</span></label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez votre exploitation..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Ville</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Ex: Bohicon"
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Département</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    required
                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                  >
                    <option value="">Sélectionner...</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Adresse <span style={{ fontWeight: 300, textTransform: 'none' }}>(optionnelle)</span></label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Ex: Quartier Gare, Bohicon"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Coordonnées GPS</label>
                  <button
                    type="button"
                    onClick={handleGeolocate}
                    disabled={locating}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      fontSize: '0.72rem', fontWeight: 600,
                      color: 'var(--color-primary)', background: 'var(--color-primary-light)',
                      border: 'none', borderRadius: '100px', padding: '0.3rem 0.75rem',
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor"/>
                      <path d="M5.5 1v1M5.5 9v1M1 5.5h1M9 5.5h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {locating ? 'Localisation...' : 'Ma position'}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                    placeholder="Latitude (ex: 7.183)"
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                  />
                  <input
                    type="text"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                    placeholder="Longitude (ex: 2.067)"
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                  />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                  Utilisez le bouton "Ma position" ou entrez les coordonnées manuellement.
                </p>
              </div>

              <div>
                <label style={labelStyle}>
                  Photo de la ferme{' '}
                  <span style={{ fontWeight: 300, textTransform: 'none' }}>(optionnelle)</span>
                </label>

                {imagePreview ? (
                  <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                    />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null) }}
                      style={{
                        position: 'absolute', top: '0.5rem', right: '0.5rem',
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: 'rgba(0,0,0,0.5)', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 2l8 8M10 2L2 10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: '0.5rem', padding: '1.5rem',
                    borderRadius: '12px', border: '2px dashed #E8E8E8',
                    background: '#F8F8F8', cursor: 'pointer', transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8E8E8'}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#BBBBBB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      Cliquer pour ajouter une photo
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)' }}>
                      JPG, PNG, WEBP — max 5 Mo
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setImageFile(file)
                          setImagePreview(URL.createObjectURL(file))
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1, padding: '0.875rem',
                    borderRadius: '100px', border: '1.5px solid var(--color-border-strong)',
                    background: 'white', fontSize: '0.875rem', fontWeight: 500,
                    color: 'var(--color-text)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating || updating}
                  style={{
                    flex: 2, padding: '0.875rem',
                    borderRadius: '100px', border: 'none',
                    background: creating || updating ? '#A0C4B4' : 'var(--color-primary)',
                    fontSize: '0.875rem', fontWeight: 600,
                    color: 'white', cursor: creating || updating ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-body)', transition: 'background 0.2s',
                  }}
                >
                  {creating || updating ? 'Enregistrement...' : editingFarm ? 'Enregistrer les modifications' : 'Créer l\'exploitation'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}