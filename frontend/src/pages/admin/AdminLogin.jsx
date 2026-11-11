import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/Logo-gyg-Admin.png'
import fondoAdmin from '../../assets/Fondo-Admin.png'
import { Helmet } from 'react-helmet-async'
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa'

function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [focused, setFocused] = useState(null)
  const { login, loading: cargando, error } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(form.username, form.password)
    if (ok) navigate('/admin-panel')
  }

  return (
    <>
      <Helmet>
        <title>Login | GyG Admin</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          html, body, #root { height: 100%; margin: 0; padding: 0; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (max-width: 900px) {
            .admin-left { display: none !important; }
            .admin-right { width: 100% !important; max-width: 100% !important; }
            .admin-root { display: block !important; }
          }
        `}</style>
      </Helmet>

      <div
        className="admin-root"
        style={{
          position: 'fixed', inset: 0,
          display: 'flex',
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', zIndex: 2,
          background: 'linear-gradient(to bottom, #FACC15, #F59E0B, #FACC15)',
        }} />

        <div
          className="admin-left"
          style={{
            position: 'relative', zIndex: 1,
            width: '50%',
            flexShrink: 0,
            overflow: 'hidden',
            backgroundColor: '#0a0a0f',
          }}
        >
          <img
            src={fondoAdmin}
            alt=""
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 95%',
            }}
          />
          <img
            src={logo}
            alt="GyG Logo"
            style={{
              position: 'absolute',
              bottom: '460px',
              left: 'clamp(24px, 4vw, 48px)',
              zIndex: 2,
              width: '420px',
              objectFit: 'contain',
            }}
          />
        </div>

        <div
          className="admin-right"
          style={{
            position: 'relative', zIndex: 1,
            width: '50%',
            flexShrink: 0,
            background: '#FAFAF8',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: 'clamp(32px, 5vh, 64px) clamp(28px, 4vw, 56px)',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #FACC15, #F59E0B)',
          }} />

          <div style={{ marginBottom: 'clamp(28px, 4vh, 48px)' }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 400,
              color: '#111', margin: '0 0 8px', letterSpacing: '-0.02em',
            }}>
              Iniciar Sesión
            </h2>
          </div>

          {error && (
            <div style={{
              marginBottom: '24px', padding: '13px 16px',
              background: '#FEF2F2', borderLeft: '3px solid #EF4444',
              borderRadius: '0 6px 6px 0',
            }}>
              <span style={{ fontSize: '13px', color: '#B91C1C', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vh, 26px)' }}>

            <div>
              <label style={{
                display: 'block', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#666', marginBottom: '8px',
              }}>Usuario</label>
              <div style={{ position: 'relative' }}>
                <FaUser style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: focused === 'username' ? '#F59E0B' : '#C0C0BC',
                  fontSize: '13px', transition: 'color 0.2s',
                }} />
                <input
                  name="username"
                  onChange={handleChange}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  required
                  autoComplete="username"
                  placeholder="Ingresa tu usuario"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: '44px', paddingRight: '16px',
                    paddingTop: '13px', paddingBottom: '13px',
                    border: focused === 'username' ? '1.5px solid #FACC15' : '1.5px solid #E8E8E5',
                    borderRadius: '8px',
                    background: focused === 'username' ? '#FFFDF0' : '#FFFFFF',
                    fontSize: '14px', color: '#111', outline: 'none',
                    transition: 'all 0.2s', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#666', marginBottom: '8px',
              }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: focused === 'password' ? '#F59E0B' : '#C0C0BC',
                  fontSize: '13px', transition: 'color 0.2s',
                }} />
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: '44px', paddingRight: '16px',
                    paddingTop: '13px', paddingBottom: '13px',
                    border: focused === 'password' ? '1.5px solid #FACC15' : '1.5px solid #E8E8E5',
                    borderRadius: '8px',
                    background: focused === 'password' ? '#FFFDF0' : '#FFFFFF',
                    fontSize: '14px', color: '#111', outline: 'none',
                    transition: 'all 0.2s', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              style={{
                marginTop: '4px',
                width: '100%', padding: '15px 24px',
                background: cargando ? '#444' : '#111111',
                color: '#FFFFFF', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
                letterSpacing: '0.02em',
                cursor: cargando ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'background 0.2s, transform 0.1s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!cargando) e.currentTarget.style.background = '#222' }}
              onMouseLeave={e => { if (!cargando) e.currentTarget.style.background = '#111111' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.985)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, #FACC15, #F59E0B)',
              }} />
              {cargando ? (
                <>
                  <div style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <FaArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: 'clamp(24px, 3.5vh, 40px)',
            paddingTop: 'clamp(16px, 2vh, 24px)',
            borderTop: '1px solid #EEEDE9',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <div style={{ width: '5px', height: '5px', background: '#D4D4D0', borderRadius: '50%' }} />
            <p style={{ fontSize: '11px', color: '#BBBBB7', margin: 0 }}>
              Acceso restringido para personal autorizado
            </p>
            <div style={{ width: '5px', height: '5px', background: '#D4D4D0', borderRadius: '50%' }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminLogin