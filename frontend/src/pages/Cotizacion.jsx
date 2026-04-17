import { useState } from 'react'
import { crearCotizacion } from '../services/cotizaciones'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaHome, FaBuilding, FaIndustry } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const TIPOS_USO = [
  { value: 'residencial', label: 'Residencial', icono: <FaHome size={24} />, desc: 'Para tu hogar o cochera' },
  { value: 'comercial', label: 'Comercial', icono: <FaBuilding size={24} />, desc: 'Para tu negocio o empresa' },
  { value: 'industrial', label: 'Industrial', icono: <FaIndustry size={24} />, desc: 'Para uso industrial o almacen' },
]

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Helmet>
          <title>Cotizacion | GyG Puertas Automaticas</title>
        </Helmet>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Solicitud enviada correctamente</h2>
          <p className="text-gray-500 mb-6">Tu codigo de seguimiento es:</p>
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl px-8 py-6 mb-6">
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">Codigo de seguimiento</p>
            <p className="text-3xl font-bold text-gray-900 tracking-widest">{codigo}</p>
          </div>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Guarda este codigo para hacer seguimiento de tu solicitud. tambien te lo enviamos por correo y WhatsApp.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/seguimiento" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition">
              Hacer seguimiento
            </Link>
            <Link to="/" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Gratis y sin compromiso</span>
          <h1 className="text-5xl font-bold mt-2 mb-4">
            Solicitar <span className="text-yellow-400">Cotizacion</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Completa el formulario y nuestro equipo te contactara a la brevedad para coordinar una visita tecnica gratuita.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Paso 1</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">Tipo de uso</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIPOS_USO.map(tipo => (
              <button
                key={tipo.value}
                type="button"
                onClick={() => setForm({ ...form, tipo_uso: tipo.value })}
                className={`p-6 rounded-2xl border-2 text-left transition hover:shadow-md ${
                  form.tipo_uso === tipo.value
                    ? 'border-yellow-400 bg-yellow-50 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`mb-4 ${form.tipo_uso === tipo.value ? 'text-yellow-500' : 'text-gray-300'}`}>
                  {tipo.icono}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{tipo.label}</h3>
                <p className="text-gray-500 text-sm">{tipo.desc}</p>
                {form.tipo_uso === tipo.value && (
                  <div className="mt-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                      Seleccionado
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Paso 2</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">Tus datos</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {!form.tipo_uso && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                <span className="font-bold">Atencion:</span>
                Por favor selecciona el tipo de uso arriba antes de continuar.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input
                    name="nombre_cliente"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                  <input
                    name="telefono"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electronico *</label>
                <input
                  name="correo"
                  type="email"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direccion *</label>
                <input
                  name="direccion"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distrito *</label>
                  <input
                    name="distrito"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referencias de ubicacion</label>
                  <input
                    name="referencias"
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion de lo que necesitas *</label>
                <textarea
                  name="descripcion"
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad para visita tecnica *</label>
                <input
                  name="disponibilidad"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 border border-gray-100">
                Al enviar tu solicitud, nuestro equipo te contactara en menos de 24 horas para coordinar la visita tecnica gratuita.
              </div>

              <button
                type="submit"
                disabled={cargando || !form.tipo_uso}
                className="w-full bg-yellow-400 text-gray-900 py-3.5 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50 text-base shadow-sm"
              >
                {cargando ? 'Enviando...' : 'Enviar solicitud de cotizacion'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Cotizacion