import { useState } from 'react'
import { getSeguimiento } from '../services/cotizaciones'
import { getSeguimientoMantenimiento } from '../services/mantenimientos'
import { FaSearch, FaCheckCircle, FaTimesCircle, FaTools, FaFileAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const estadoColor = {
  recibido: 'bg-blue-100 text-blue-700 border-blue-200',
  en_revision: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  visita_agendada: 'bg-purple-100 text-purple-700 border-purple-200',
  cotizado: 'bg-orange-100 text-orange-700 border-orange-200',
  aceptado: 'bg-green-100 text-green-700 border-green-200',
  rechazado: 'bg-red-100 text-red-700 border-red-200',
  instalacion_agendada: 'bg-purple-100 text-purple-700 border-purple-200',
  en_instalacion: 'bg-orange-100 text-orange-700 border-orange-200',
  completado: 'bg-green-100 text-green-700 border-green-200',
  cancelado: 'bg-red-100 text-red-700 border-red-200',
  en_proceso: 'bg-orange-100 text-orange-700 border-orange-200',
  resuelto: 'bg-green-100 text-green-700 border-green-200',
}

const pasosCotizacion = [
  { estado: 'recibido', label: 'Recibido' },
  { estado: 'en_revision', label: 'En revision' },
  { estado: 'visita_agendada', label: 'Visita agendada' },
  { estado: 'cotizado', label: 'Cotizado' },
  { estado: 'aceptado', label: 'Aceptado' },
  { estado: 'instalacion_agendada', label: 'Instalacion agendada' },
  { estado: 'completado', label: 'Completado' },
]

const pasosMantenimiento = [
  { estado: 'recibido', label: 'Recibido' },
  { estado: 'en_revision', label: 'En revision' },
  { estado: 'visita_agendada', label: 'Visita agendada' },
  { estado: 'en_proceso', label: 'En proceso' },
  { estado: 'completado', label: 'Completado' },
]

function BarraProgreso({ pasos, estadoActual }) {
  const indexActual = pasos.findIndex(p => p.estado === estadoActual)
  return (
    <div className="flex items-start justify-between mb-8 overflow-x-auto pb-2">
      {pasos.map((paso, i) => (
        <div key={paso.estado} className="flex items-start">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                i < indexActual
                  ? 'bg-green-500 border-green-500 text-white'
                  : i === indexActual
                  ? 'bg-yellow-400 border-yellow-400 text-gray-900'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {i < indexActual ? <FaCheckCircle size={14} /> : i + 1}
            </div>
            <p className={`text-xs mt-1 text-center w-16 leading-tight ${i <= indexActual ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
              {paso.label}
            </p>
          </div>
          {i < pasos.length - 1 && (
            <div className={`h-1 w-8 md:w-12 mx-1 mt-4 rounded flex-shrink-0 ${i < indexActual ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function Seguimiento() {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleBuscar = (e) => {
    e.preventDefault()
    setError('')
    setResultado(null)
    setCargando(true)
    if (codigo.startsWith('GYG')) {
      getSeguimiento(codigo)
        .then(res => setResultado({ tipo: 'cotizacion', data: res.data }))
        .catch(() => setError('No se encontro ninguna solicitud con ese codigo.'))
        .finally(() => setCargando(false))
    } else if (codigo.startsWith('MANT')) {
      getSeguimientoMantenimiento(codigo)
        .then(res => setResultado({ tipo: 'mantenimiento', data: res.data }))
        .catch(() => setError('No se encontro ninguna solicitud con ese codigo.'))
        .finally(() => setCargando(false))
    } else {
      setError('Codigo invalido. Debe empezar con GYG o MANT.')
      setCargando(false)
    }
  }

  return (
    <div>
      <section className="bg-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Seguimiento de <span className="text-yellow-400">Solicitud</span>
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Ingresa tu codigo de seguimiento para ver el estado de tu solicitud en tiempo real.
        </p>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleBuscar} className="flex gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Ej: GYG-2026-0001 o MANT-2026-0001"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                required
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-400 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50"
            >
              {cargando ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
          <div className="flex gap-4 mt-4 text-sm text-gray-500 justify-center">
            <span className="flex items-center gap-1">
              <FaFileAlt size={12} className="text-blue-500" />
              Cotizaciones: GYG-2026-XXXX
            </span>
            <span className="flex items-center gap-1">
              <FaTools size={12} className="text-green-500" />
              Mantenimientos: MANT-2026-XXXX
            </span>
          </div>
        </div>
      </section>

      {error && (
        <div className="max-w-2xl mx-auto px-4 mt-6">
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-4 rounded-xl flex items-center gap-3">
            <FaTimesCircle size={20} />
            <p>{error}</p>
          </div>
        </div>
      )}

      {resultado && (
        <section className="py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-900 px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {resultado.tipo === 'cotizacion'
                    ? <FaFileAlt size={20} className="text-yellow-400" />
                    : <FaTools size={20} className="text-yellow-400" />
                  }
                  <div>
                    <p className="text-gray-400 text-xs">
                      {resultado.tipo === 'cotizacion' ? 'Cotizacion' : 'Mantenimiento'}
                    </p>
                    <p className="text-yellow-400 font-bold text-xl">{resultado.data.codigo}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${estadoColor[resultado.data.estado] || 'bg-gray-100 text-gray-700'}`}>
                  {resultado.data.estado?.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              <div className="px-6 pt-6">
                <BarraProgreso
                  pasos={resultado.tipo === 'cotizacion' ? pasosCotizacion : pasosMantenimiento}
                  estadoActual={resultado.data.estado}
                />
              </div>

              <div className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">Cliente</p>
                    <p className="font-bold text-gray-900">{resultado.data.nombre_cliente}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">Telefono</p>
                    <p className="font-bold text-gray-900">{resultado.data.telefono}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">Distrito</p>
                    <p className="font-bold text-gray-900">{resultado.data.distrito}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">Fecha de solicitud</p>
                    <p className="font-bold text-gray-900">
                      {new Date(resultado.data.creado_en).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                </div>

                {resultado.data.descripcion && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-500 text-xs mb-1">Descripcion</p>
                    <p className="font-medium text-gray-900">{resultado.data.descripcion}</p>
                  </div>
                )}

                {resultado.data.descripcion_problema && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-500 text-xs mb-1">Problema reportado</p>
                    <p className="font-medium text-gray-900">{resultado.data.descripcion_problema}</p>
                  </div>
                )}

                {resultado.data.motivo_rechazo && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <p className="text-red-500 text-xs mb-1">Motivo</p>
                    <p className="font-medium text-red-700">{resultado.data.motivo_rechazo}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <a
                    href="https://wa.me/51947316874"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition text-center text-sm"
                  >
                    Contactar por WhatsApp
                  </a>
                  <Link
                    to="/contacto"
                    className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-200 transition text-center text-sm"
                  >
                    Ir a Contacto
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Seguimiento