import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'

type Role = 'farmer' | 'buyer'

export default function Register() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { mutate: register, isPending, error } = useRegister()
  const [focused, setFocused] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'buyer' as Role,
    phone: '',
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(form, { onSuccess: () => navigate('/dashboard', { replace: true }) })
  }

  const errorData = error ? (error as any).response?.data : null
  const errorMessage = errorData?.message ?? null
  const fieldErrors = errorData?.errors ?? {}

  const inputStyle = (name: string, hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.9rem 1.1rem 0.9rem 3rem',
    borderRadius: '100px',
    border: `1.5px solid ${hasError ? '#FFADAD' : focused === name ? 'var(--color-primary)' : '#E8E8E8'}`,
    background: hasError ? '#FFF8F8' : focused === name ? 'white' : '#F8F8F8',
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'all 0.2s',
    WebkitAppearance: 'none',
  })

  const iconColor = (name: string) => focused === name ? 'var(--color-primary)' : '#BBBBBB'

  const roles: { value: Role; title: string; desc: string }[] = [
    { value: 'buyer', title: 'Je suis acheteur', desc: 'Je recherche des produits locaux frais.' },
    { value: 'farmer', title: 'Je suis agriculteur', desc: 'Je souhaite vendre mes récoltes en direct.' },
  ]

  return (
    <div style={{
      minHeight: 'calc(100svh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: '2rem 1.25rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '860px',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr',
        boxShadow: '0 24px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
      }} className="login-card">

        {/* Panneau gauche — vert */}
        <div style={{
          display: 'none',
          background: 'var(--color-primary)',
          padding: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }} className="login-left">
          <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

          <div>
            <img src="/images/agril.svg" alt="AgriL" style={{ height: '36px', width: 'auto', marginBottom: '3rem', filter: 'brightness(0) invert(1)' }} />
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.25rem',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}>
              Rejoignez le domaine.
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, fontWeight: 300, maxWidth: '280px' }}>
              Sélectionnez votre profil pour commencer l'aventure AgriL.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Accès gratuit, sans commission',
              'Contact direct producteur-acheteur',
              'Présent dans les 12 départements',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: 'rgba(74,222,128,0.2)',
                  border: '1px solid rgba(74,222,128,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', fontWeight: 300 }}>{item}</span>
              </div>
            ))}
          </div>

          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.4)',
              color: 'white',
              padding: '0.875rem 2rem',
              borderRadius: '100px',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              alignSelf: 'flex-start',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'white'
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Déjà un compte ?
          </Link>
        </div>

        {/* Panneau droit — formulaire */}
        <div style={{
          background: 'white',
          padding: 'clamp(2rem, 5vw, 3rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '-60px',
            left: '-60px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'var(--color-primary-light)',
            opacity: 0.6,
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{ marginBottom: '1.5rem' }} className="login-mobile-logo">
              <img src="/images/agril.svg" alt="AgriL" style={{ height: '28px', width: 'auto' }} />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '-0.03em',
                marginBottom: '0.35rem',
                lineHeight: 1.15,
              }}>
                Bienvenue
              </h1>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
                Créez votre compte pour commencer.
              </p>
            </div>

            {errorMessage && (
              <div style={{
                background: '#FFF5F5',
                border: '1px solid #FFD5D5',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.82rem',
                color: '#C0392B',
              }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

              {/* Rôle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {roles.map(({ value, title, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, role: value })}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: '16px',
                      border: `2px solid ${form.role === value ? 'var(--color-primary)' : '#E8E8E8'}`,
                      background: form.role === value ? 'var(--color-primary-light)' : '#F8F8F8',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: form.role === value ? 'var(--color-primary)' : 'var(--color-text)',
                      marginBottom: '0.2rem',
                    }}>
                      {title}
                    </div>
                    <div style={{
                      fontSize: '0.68rem',
                      color: form.role === value ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      lineHeight: 1.4,
                      fontWeight: 300,
                    }}>
                      {desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Nom */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nom complet..."
                  required
                  style={inputStyle('name', !!fieldErrors.name)}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                />
                <svg style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <circle cx="7.5" cy="5" r="3" stroke={iconColor('name')} strokeWidth="1.3"/>
                  <path d="M1.5 13.5c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={iconColor('name')} strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                {fieldErrors.name && <p style={{ fontSize: '0.72rem', color: '#C0392B', marginTop: '0.3rem', paddingLeft: '1rem' }}>{fieldErrors.name[0]}</p>}
              </div>

              {/* Email */}
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email..."
                  required
                  style={inputStyle('email', !!fieldErrors.email)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
                <svg style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M1.5 3.5h12v8a1 1 0 01-1 1h-10a1 1 0 01-1-1v-8zm0 0l6 4.5 6-4.5" stroke={iconColor('email')} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {fieldErrors.email && <p style={{ fontSize: '0.72rem', color: '#C0392B', marginTop: '0.3rem', paddingLeft: '1rem' }}>{fieldErrors.email[0]}</p>}
              </div>

              {/* Téléphone */}
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Téléphone (optionnel)..."
                  style={inputStyle('phone')}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                />
                <svg style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M3 1.5h3l1.5 3.75-1.875 1.125a8.25 8.25 0 004.5 4.5L11.25 9l3.75 1.5V13.5A1.5 1.5 0 0113.5 15C6.596 15 1 9.404 1 2.5A1.5 1.5 0 013 1z" stroke={iconColor('phone')} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Mots de passe */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mot de passe..."
                    required
                    style={inputStyle('password', !!fieldErrors.password)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                  />
                  <svg style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <rect x="2.5" y="6.5" width="10" height="7" rx="1.5" stroke={iconColor('password')} strokeWidth="1.3"/>
                    <path d="M4.5 6.5V4.5a3 3 0 016 0v2" stroke={iconColor('password')} strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {fieldErrors.password && <p style={{ fontSize: '0.68rem', color: '#C0392B', marginTop: '0.3rem', paddingLeft: '0.5rem' }}>{fieldErrors.password[0]}</p>}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    placeholder="Confirmation..."
                    required
                    style={inputStyle('confirm')}
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused(null)}
                  />
                  <svg style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <rect x="2.5" y="6.5" width="10" height="7" rx="1.5" stroke={iconColor('confirm')} strokeWidth="1.3"/>
                    <path d="M4.5 6.5V4.5a3 3 0 016 0v2" stroke={iconColor('confirm')} strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  background: isPending ? '#A0C4B4' : 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'background 0.2s',
                  marginTop: '0.25rem',
                }}
                onMouseEnter={(e) => { if (!isPending) e.currentTarget.style.background = 'var(--color-primary-hover)' }}
                onMouseLeave={(e) => { if (!isPending) e.currentTarget.style.background = 'var(--color-primary)' }}
              >
                {isPending ? 'Création...' : 'CRÉER MON COMPTE'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
              Déjà inscrit ?{' '}
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}