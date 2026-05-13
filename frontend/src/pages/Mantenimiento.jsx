import { useState } from 'react'
import { crearMantenimiento } from '../services/mantenimientos'
import { Link } from 'react-router-dom'
import { FaTools, FaWrench, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const TIPOS = [
  {
    value: 'preventivo',
    icon: <FaTools size={28} />,
    titulo: 'Mantenimiento Preventivo',
    desc: 'Revisión periódica para evitar fallas y prolongar la vida útil de tu puerta.',
    colorActivo: 'border-blue-500 bg-blue-50',
    iconColor: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    value: 'correctivo',
    icon: <FaWrench size={28} />,
    titulo: 'Mantenimiento Correctivo',
    desc: 'Diagnóstico y reparación de fallas en tu puerta automática.',
    colorActivo: 'border-orange-500 bg-orange-50',
    iconColor: 'text-orange-500',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    value: 'garantia',
    icon: <FaShieldAlt size={28} />,
    titulo: 'Garantía',
    desc: 'Cobertura de garantía para trabajos realizados por GyG.',
    colorActivo: 'border-green-500 bg-green-50',
    iconColor: 'text-green-500',
    badge: 'bg-green-100 text-green-700',
  },
]

function Mantenimiento() {
  const [form, setForm] = useState({
    nombre_cliente: '',
    telefono: '',
    correo: '',
    direccion: '',
    distrito: '',
    tipo_puerta: '',
    fecha_instalacion_aprox: '',
    descripcion_problema: '',
    disponibilidad: '',
    tipo: '',
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
    crearMantenimiento(form)
      .then(res => {
        setCodigo(res.data.codigo)
        setEnviado(true)
      })
      .catch(() => setError('Ocurrió un error al enviar la solicitud. Inténtalo de nuevo.'))
      .finally(() => setCargando(false))
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Helmet>
        <title>Mantenimiento | GyG Puertas Automáticas</title>
      </Helmet>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Solicitud enviada correctamente</h2>
          <p className="text-gray-500 mb-6">Tu código de seguimiento es:</p>
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl px-8 py-6 mb-6">
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">Código de seguimiento</p>
            <p className="text-3xl font-bold text-gray-900 tracking-widest">{codigo}</p>
          </div>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Guarda este código para hacer seguimiento de tu solicitud. También te lo enviamos por correo y WhatsApp.
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
      <Helmet>
        <title>Mantenimiento | GyG Puertas Automáticas</title>
      </Helmet>
      {/* HERO */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Servicio técnico</span>
          <h1 className="text-5xl font-bold mt-2 mb-4">
            Solicitar <span className="text-yellow-400">Mantenimiento</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Completa el formulario y nuestro equipo técnico te atenderá a la brevedad.
          </p>
        </div>
      </section>

      {/* TIPOS DE SERVICIO */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Paso 1</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">Selecciona el tipo de servicio</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIPOS.map(tipo => (
              <button
                key={tipo.value}
                type="button"
                onClick={() => setForm({ ...form, tipo: tipo.value })}
                className={`p-6 rounded-2xl border-2 text-left transition hover:shadow-md ${
                  form.tipo === tipo.value
                    ? tipo.colorActivo + ' shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`mb-4 ${form.tipo === tipo.value ? tipo.iconColor : 'text-gray-300'}`}>
                  {tipo.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{tipo.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{tipo.desc}</p>
                {form.tipo === tipo.value && (
                  <div className="mt-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${tipo.badge}`}>
                      Seleccionado
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Paso 2</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">Completa tus datos</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {!form.tipo && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                <span className="font-bold">Atención:</span>
                Por favor selecciona un tipo de servicio arriba antes de continuar.
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    name="telefono"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                <input
                  name="correo"
                  type="email"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input
                    name="direccion"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distrito *</label>
                  <input
                    name="distrito"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de puerta instalada *</label>
                  <input
                    name="tipo_puerta"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha aproximada de instalación</label>
                  <input
                    name="fecha_instalacion_aprox"
                    type="date"
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del problema *</label>
                <textarea
                  name="descripcion_problema"
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad para visita técnica *</label>
                <input
                  name="disponibilidad"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 border border-gray-100">
                Al enviar tu solicitud, nuestro equipo técnico se comunicará contigo en menos de 24 horas para coordinar la visita.
              </div>

              <button
                type="submit"
                disabled={cargando || !form.tipo}
                className="w-full bg-yellow-400 text-gray-900 py-3.5 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50 text-base shadow-sm"
              >
                {cargando ? 'Enviando...' : 'Enviar solicitud de mantenimiento'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Mantenimiento