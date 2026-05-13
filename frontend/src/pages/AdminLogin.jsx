import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setTokens } from '../services/auth'
import logo from '../assets/Logo-gyg-Admin.png'
import { Helmet } from 'react-helmet-async'
import { FaUser, FaLock, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'

function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <Helmet>
        <title>Login | GyG Admin</title>
      </Helmet>

      {/* FONDO DECORATIVO */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(250,204,21,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.04) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(250,204,21,0.03) 0%, transparent 50%)'
      }} />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'linear-gradient(rgba(250,204,21,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* CÍRCULO DECORATIVO SUPERIOR */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #facc15, transparent)' }} />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex items-center gap-16">

        {/* LADO IZQUIERDO */}
        <div className="hidden lg:flex flex-1 flex-col gap-10">
          <div>
            <img src={logo} alt="GyG" className="h-16 object-contain mb-8" />
            <h1 className="text-5xl font-black text-white leading-tight mb-4">
              Panel de<br />
              <span style={{ color: '#facc15' }}>Administración</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm">
              Gestiona cotizaciones, mantenimientos, productos y técnicos desde un solo lugar.
            </p>
          </div>

          <div className="space-y-3">
            {[
              'Gestión completa de cotizaciones y mantenimientos',
              'Control de productos y catálogo en tiempo real',
              'Reportes y exportación de datos en Excel',
              'Notificaciones automáticas por WhatsApp y Email',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <FaCheckCircle size={14} style={{ color: '#facc15' }} className="flex-shrink-0" />
                <span className="text-gray-400 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(250,204,21,0.3), transparent)' }} />
            <span className="text-gray-600 text-xs">GyG Puertas Automáticas © 2026</span>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="rounded-2xl p-8 border" style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}>

            <div className="lg:hidden text-center mb-6">
              <img src={logo} alt="GyG" className="h-12 object-contain mx-auto" />
            </div>

            <div className="mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.2)' }}>
                <FaShieldAlt size={20} style={{ color: '#facc15' }} />
              </div>
              <h2 className="text-2xl font-black text-white mb-1">Bienvenido</h2>
              <p className="text-gray-500 text-sm">Ingresa tus credenciales para acceder</p>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Usuario</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2" size={13} style={{ color: '#6b7280' }} />
                  <input
                    name="username"
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none transition"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(250,204,21,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contraseña</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2" size={13} style={{ color: '#6b7280' }} />
                  <input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none transition"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(250,204,21,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition mt-2"
                style={{
                  background: cargando ? 'rgba(250,204,21,0.5)' : '#facc15',
                  color: '#111827',
                  boxShadow: '0 4px 15px rgba(250,204,21,0.2)'
                }}
              >
                {cargando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <FaShieldAlt size={13} />
                    Ingresar al panel
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-center text-xs" style={{ color: '#4b5563' }}>
                Acceso restringido solo para administradores
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin