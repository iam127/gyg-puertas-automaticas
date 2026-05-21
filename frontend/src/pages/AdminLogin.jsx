import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setTokens } from '../services/auth'
import logo from '../assets/Logo-gyg-Admin.png'
import fondoAdmin from '../assets/Fondo-Admin.jpg'
import { Helmet } from 'react-helmet-async'
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa'

function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [focused, setFocused] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    login(form.username, form.password)
      .then(res => {
        setTokens(res.data.access, res.data.refresh)
        navigate('/admin-panel')
      })
      .catch(() => setError('Usuario o contraseña incorrectos.'))
      .finally(() => setCargando(false))
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

      {/* ROOT — fixed fullscreen, no scroll */}
      <div
        className="admin-root"
        style={{
          position: 'fixed', inset: 0,
          display: 'flex',
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          overflow: 'hidden',
        }}
      >
        {/* BACKGROUND */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${fondoAdmin})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.32) saturate(0.7)',
          zIndex: 0,
        }} />

        {/* GRID OVERLAY */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* LEFT YELLOW STRIPE */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', zIndex: 2,
          background: 'linear-gradient(to bottom, #FACC15, #F59E0B, #FACC15)',
        }} />

        {/* ── LEFT PANEL ── */}
        <div
          className="admin-left"
          style={{
            position: 'relative', zIndex: 1,
            width: '50%',
            flexShrink: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            padding: '40px 56px',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Logo */}
            <img
              src={logo}
              alt="GyG Puertas Automáticas"
              style={{ height: '145px', marginBottom: '32px', objectFit: 'contain', objectPosition: 'left' }}
            />

            <h1 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(36px, 4vw, 62px)',
              fontWeight: 400, lineHeight: 1.05, color: '#FFFFFF',
              margin: '0 0 4px',
            }}>
              Sistema de
            </h1>
            <h1 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(36px, 4vw, 62px)',
              fontWeight: 400, fontStyle: 'italic',
              lineHeight: 1.05, color: '#FACC15',
              margin: '0 0 18px',
            }}>
              Administración
            </h1>

            <p style={{
              fontSize: '14px', fontWeight: 300,
              color: 'rgba(255,255,255,0.58)', lineHeight: 1.65,
              maxWidth: '420px', marginBottom: '24px',
            }}>
              Plataforma integral para la gestión de operaciones de GyG Puertas Automáticas.
            </p>

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Control de cotizaciones y mantenimientos',
                'Gestión de productos y catálogo',
                'Reportes y análisis de datos',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    border: '1.5px solid rgba(250,204,21,0.38)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FACC15' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.65)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '0' }}>
            © 2026 GyG Puertas Automáticas. Todos los derechos reservados.
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
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
          {/* TOP ACCENT BAR */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #FACC15, #F59E0B)',
          }} />

          {/* Heading */}
          <div style={{ marginBottom: 'clamp(28px, 4vh, 48px)' }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 400,
              color: '#111', margin: '0 0 8px', letterSpacing: '-0.02em',
            }}>
              Iniciar Sesión
            </h2>

          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '24px', padding: '13px 16px',
              background: '#FEF2F2', borderLeft: '3px solid #EF4444',
              borderRadius: '0 6px 6px 0',
            }}>
              <span style={{ fontSize: '13px', color: '#B91C1C', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vh, 26px)' }}>

            {/* Username */}
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

            {/* Password */}
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

            {/* Button */}
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

          {/* Footer */}
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