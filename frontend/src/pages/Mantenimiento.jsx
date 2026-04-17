import { useState } from 'react'
import { crearMantenimiento } from '../services/mantenimientos'
import { Link } from 'react-router-dom'
import { FaTools, FaWrench, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'

const TIPOS = [
  {
    value: 'preventivo',
    icon: <FaTools size={32} />,
    titulo: 'Mantenimiento Preventivo',
    desc: 'Revision periodica para evitar fallas y prolongar la vida util de tu puerta.',
    color: 'border-blue-400 bg-blue-50',
    colorActivo: 'border-blue-500 bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    value: 'correctivo',
    icon: <FaWrench size={32} />,
    titulo: 'Mantenimiento Correctivo',
    desc: 'Diagnostico y reparacion de fallas en tu puerta automatica.',
    color: 'border-orange-400 bg-orange-50',
    colorActivo: 'border-orange-500 bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    value: 'garantia',
    icon: <FaShieldAlt size={32} />,
    titulo: 'Garantia',
    desc: 'Cobertura de garantia para trabajos realizados por GyG.',
    color: 'border-green-400 bg-green-50',
    colorActivo: 'border-green-500 bg-green-100',
    iconColor: 'text-green-500',
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
      .catch(() => setError('Ocurrio un error al enviar la solicitud. Intentalo de nuevo.'))
      .finally(() => setCargando(false))
  }

  if (enviado) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <FaCheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Solicitud enviada correctamente</h2>
        <p className="text-gray-600 mb-4">Tu codigo de seguimiento es:</p>
        <div className="bg-yellow-100 border border-yellow-400 rounded-xl px-6 py-4 mb-6">
          <p className="text-2xl font-bold text-yellow-700">{codigo}</p>
        </div>
        <p className="text-gray-500 text-sm mb-6">Guarda este codigo para hacer seguimiento de tu solicitud. tambien te lo enviamos por correo y WhatsApp.</p>
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
    <div>
      {/* HERO */}
      <section className="bg-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Solicitar <span className="text-yellow-400">Mantenimiento</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Completa el formulario y nuestro equipo tecnico te atendera a la brevedad.
        </p>
      </section>

      {/* TIPOS DE SERVICIO */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-8">Selecciona el tipo de servicio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIPOS.map(tipo => (
              <button
                key={tipo.value}
                type="button"
                onClick={() => setForm({ ...form, tipo: tipo.value })}
                className={`p-6 rounded-2xl border-2 text-left transition hover:shadow-md ${
                  form.tipo === tipo.value ? tipo.colorActivo + ' shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`mb-3 ${form.tipo === tipo.value ? tipo.iconColor : 'text-gray-400'}`}>
                  {tipo.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{tipo.titulo}</h3>
                <p className="text-gray-500 text-sm">{tipo.desc}</p>
                {form.tipo === tipo.value && (
                  <div className="mt-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${tipo.iconColor} bg-white`}>
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
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Datos de contacto</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {!form.tipo && (
              <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl mb-6 text-sm">
                Por favor selecciona un tipo de servicio arriba antes de continuar.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input
                    name="nombre_cliente"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                  <input
                    name="telefono"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Direccion *</label>
                  <input
                    name="direccion"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distrito *</label>
                  <input
                    name="distrito"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
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
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha aproximada de instalacion</label>
                  <input
                    name="fecha_instalacion_aprox"
                    type="date"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion del problema *</label>
                <textarea
                  name="descripcion_problema"
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad para visita tecnica *</label>
                <input
                  name="disponibilidad"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              <button
                type="submit"
                disabled={cargando || !form.tipo}
                className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50 mt-2"
              >
                {cargando ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Mantenimiento