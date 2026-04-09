import { useState } from 'react'
import { crearCotizacion } from '../services/cotizaciones'
import { Link } from 'react-router-dom'

function Cotizacion() {
  const [form, setForm] = useState({
    nombre_cliente: '',
    telefono: '',
    correo: '',
    direccion: '',
    distrito: '',
    referencias: '',
    tipo_uso: '',
    descripcion: '',
    disponibilidad: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    crearCotizacion(form)
      .then(res => {
        setCodigo(res.data.codigo)
        setEnviado(true)
      })
      .catch(() => setError('Ocurrio un error al enviar la solicitud. Intentalo de nuevo.'))
      .finally(() => setCargando(false))
  }

  if (enviado) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">Solicitud enviada correctamente</h2>
        <p className="text-gray-600 mb-4">Tu código de seguimiento es:</p>
        <div className="bg-yellow-100 border border-yellow-400 rounded-xl px-6 py-4 mb-6">
          <p className="text-2xl font-bold text-yellow-700">{codigo}</p>
        </div>
        <p className="text-gray-500 text-sm mb-6">Guarda este código para hacer seguimiento de tu solicitud. También te lo enviamos por correo y WhatsApp.</p>
        <div className="flex justify-center gap-4">
          <Link to="/seguimiento" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition">
            Hacer seguimiento
          </Link>
          <Link to="/" className="border border-gray-300 px-6 py-3 rounded-full font-bold hover:border-yellow-400 transition">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Solicitar Cotización</h1>
      <p className="text-gray-500 mb-8">Completa el formulario y nuestro equipo te contactará a la brevedad.</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
            <input
              name="nombre_cliente"
              placeholder="Juan Pérez"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
            <input
              name="telefono"
              placeholder="+51 999 999 999"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
          <input
            name="correo"
            type="email"
            placeholder="correo@ejemplo.com"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
          <input
            name="direccion"
            placeholder="Av. Example 123"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distrito *</label>
            <input
              name="distrito"
              placeholder="Miraflores"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de uso *</label>
            <select
              name="tipo_uso"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
            >
              <option value="">Selecciona...</option>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referencias de ubicación</label>
          <input
            name="referencias"
            placeholder="Frente al parque, cerca a..."
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de lo que necesitas *</label>
          <textarea
            name="descripcion"
            placeholder="Describe el tipo de puerta, medidas aproximadas, material, etc."
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad para visita técnica *</label>
          <input
            name="disponibilidad"
            placeholder="Lunes a viernes por las mañanas"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {cargando ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>
    </div>
  )
}

export default Cotizacion