import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setTokens } from '../services/auth'
import logo from '../assets/Logo-gyg.png'

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
      .catch(() => setError('Usuario o contrasena incorrectos.'))
      .finally(() => setCargando(false))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="GyG" className="h-16 object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
          <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              name="username"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50 mt-2"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin