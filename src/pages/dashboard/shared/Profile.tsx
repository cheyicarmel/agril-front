import { useState, useEffect } from 'react'
import { useAuthStore } from '../../../store/authStore'
import { useUpdateProfile } from '../../../hooks/useAuth'

export default function Profile() {
  const { user } = useAuthStore()
  const { mutate: updateProfile, isPending, error, isSuccess } = useUpdateProfile()

  const [infoForm, setInfoForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  })

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const [focused, setFocused] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'info' | 'password'>('info')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    if (isSuccess) {
      setSuccessMsg(activeSection === 'info' ? 'Informations mises à jour.' : 'Mot de passe modifié.')
      if (activeSection === 'password') {
        setPasswordForm({ current_password: '', password: '', password_confirmation: '' })
      }
      setTimeout(() => setSuccessMsg(null), 3000)
    }
  }, [isSuccess])

  const errorData = error ? (error as any).response?.data : null
  const errorMessage = errorData?.message ?? null
  const fieldErrors = errorData?.errors ?? {}

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveSection('info')
    updateProfile(infoForm)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveSection('password')
    updateProfile(passwordForm)
  }

  const inputStyle = (name: string, hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '10px',
    border: `1.5px solid ${hasError ? '#FFADAD' : focused === name ? 'var(--color-primary)' : '#E8E8E8'}`,
    background: hasError ? '#FFF8F8' : focused === name ? 'white' : '#F8F8F8',
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'all 0.15s',
  })

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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
          fontWeight: 700,
          color: 'var(--color-text)',
          letterSpacing: '-0.025em',
          marginBottom: '0.35rem',
        }}>
          Mon profil
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
          Gérez vos informations personnelles et votre mot de passe.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.5rem',
        maxWidth: '680px',
      }}>

        {/* Carte identité */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            height: '80px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
            position: 'relative',
          }} />

          <div style={{ padding: '0 1.5rem 1.5rem', marginTop: '-28px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: '1.4rem',
              fontWeight: 700, color: 'white',
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(26,107,69,0.25)',
              marginBottom: '0.875rem',
            }}>
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem', fontWeight: 700,
              color: 'var(--color-text)', letterSpacing: '-0.015em',
              marginBottom: '0.2rem',
            }}>
              {user?.name}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {user?.email} · <span style={{
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                padding: '0.15rem 0.5rem',
                borderRadius: '100px',
                fontSize: '0.68rem',
                fontWeight: 700,
              }}>
                {user?.role === 'farmer' ? 'Agriculteur' : 'Acheteur'}
              </span>
            </p>
          </div>
        </div>

        {/* Message succès */}
        {successMsg && (
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '12px',
            padding: '0.875rem 1rem',
            fontSize: '0.875rem',
            color: '#065F46',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#065F46" strokeWidth="1.5"/>
              <path d="M5 8l2 2 4-4" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {successMsg}
          </div>
        )}

        {/* Formulaire infos */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F0F0F0' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem', fontWeight: 700,
              color: 'var(--color-text)', letterSpacing: '-0.01em',
            }}>
              Informations personnelles
            </h3>
          </div>

          <form onSubmit={handleInfoSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {errorMessage && activeSection === 'info' && (
              <div style={{
                background: '#FFF5F5', border: '1px solid #FFD5D5',
                borderRadius: '10px', padding: '0.875rem 1rem',
                fontSize: '0.82rem', color: '#C0392B',
              }}>
                {errorMessage}
              </div>
            )}

            <div>
              <label style={labelStyle}>Nom complet</label>
              <input
                type="text"
                value={infoForm.name}
                onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                required
                style={inputStyle('name', !!fieldErrors.name)}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
              />
              {fieldErrors.name && <p style={{ fontSize: '0.75rem', color: '#C0392B', marginTop: '0.3rem' }}>{fieldErrors.name[0]}</p>}
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={infoForm.email}
                onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                required
                style={inputStyle('email', !!fieldErrors.email)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
              {fieldErrors.email && <p style={{ fontSize: '0.75rem', color: '#C0392B', marginTop: '0.3rem' }}>{fieldErrors.email[0]}</p>}
            </div>

            <div>
              <label style={labelStyle}>
                Téléphone{' '}
                <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0, color: 'var(--color-text-muted)' }}>
                  (optionnel)
                </span>
              </label>
              <input
                type="tel"
                value={infoForm.phone}
                onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                placeholder="+229 61 00 00 00"
                style={inputStyle('phone')}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused(null)}
              />
            </div>

            <button
              type="submit"
              disabled={isPending && activeSection === 'info'}
              style={{
                padding: '0.875rem',
                borderRadius: '100px',
                border: 'none',
                background: isPending && activeSection === 'info' ? '#A0C4B4' : 'var(--color-primary)',
                color: 'white',
                fontSize: '0.875rem', fontWeight: 600,
                fontFamily: 'var(--font-body)',
                cursor: isPending && activeSection === 'info' ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                alignSelf: 'flex-start',
                minWidth: '180px',
              }}
              onMouseEnter={(e) => { if (!(isPending && activeSection === 'info')) e.currentTarget.style.background = 'var(--color-primary-hover)' }}
              onMouseLeave={(e) => { if (!(isPending && activeSection === 'info')) e.currentTarget.style.background = 'var(--color-primary)' }}
            >
              {isPending && activeSection === 'info' ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </div>

        {/* Formulaire mot de passe */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F0F0F0' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem', fontWeight: 700,
              color: 'var(--color-text)', letterSpacing: '-0.01em',
            }}>
              Changer le mot de passe
            </h3>
          </div>

          <form onSubmit={handlePasswordSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {errorMessage && activeSection === 'password' && (
              <div style={{
                background: '#FFF5F5', border: '1px solid #FFD5D5',
                borderRadius: '10px', padding: '0.875rem 1rem',
                fontSize: '0.82rem', color: '#C0392B',
              }}>
                {errorMessage}
              </div>
            )}

            <div>
              <label style={labelStyle}>Mot de passe actuel</label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                placeholder="••••••••"
                required
                style={inputStyle('current_password', !!fieldErrors.current_password)}
                onFocus={() => setFocused('current_password')}
                onBlur={() => setFocused(null)}
              />
              {fieldErrors.current_password && <p style={{ fontSize: '0.75rem', color: '#C0392B', marginTop: '0.3rem' }}>{fieldErrors.current_password[0]}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                  placeholder="8 car. min."
                  required
                  style={inputStyle('new_password', !!fieldErrors.password)}
                  onFocus={() => setFocused('new_password')}
                  onBlur={() => setFocused(null)}
                />
                {fieldErrors.password && <p style={{ fontSize: '0.75rem', color: '#C0392B', marginTop: '0.3rem' }}>{fieldErrors.password[0]}</p>}
              </div>
              <div>
                <label style={labelStyle}>Confirmation</label>
                <input
                  type="password"
                  value={passwordForm.password_confirmation}
                  onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                  placeholder="••••••••"
                  required
                  style={inputStyle('confirm_password')}
                  onFocus={() => setFocused('confirm_password')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending && activeSection === 'password'}
              style={{
                padding: '0.875rem',
                borderRadius: '100px',
                border: 'none',
                background: isPending && activeSection === 'password' ? '#A0C4B4' : 'var(--color-primary)',
                color: 'white',
                fontSize: '0.875rem', fontWeight: 600,
                fontFamily: 'var(--font-body)',
                cursor: isPending && activeSection === 'password' ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                alignSelf: 'flex-start',
                minWidth: '220px',
              }}
              onMouseEnter={(e) => { if (!(isPending && activeSection === 'password')) e.currentTarget.style.background = 'var(--color-primary-hover)' }}
              onMouseLeave={(e) => { if (!(isPending && activeSection === 'password')) e.currentTarget.style.background = 'var(--color-primary)' }}
            >
              {isPending && activeSection === 'password' ? 'Modification...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}