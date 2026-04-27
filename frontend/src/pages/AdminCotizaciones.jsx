import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaSearch, FaTimes, FaEdit, FaFileAlt, FaWhatsapp, FaPhone } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'recibido', label: 'Recibido' },
  { value: 'en_revision', label: 'En Revision' },
  { value: 'visita_agendada', label: 'Visita Agendada' },
  { value: 'cotizado', label: 'Cotizado' },
  { value: 'aceptado', label: 'Aceptado' },
  { value: 'rechazado', label: 'Rechazado' },
  { value: 'instalacion_agendada', label: 'Instalacion Agendada' },
  { value: 'completado', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' },
]

const estadoColor = {
  recibido: 'bg-blue-100 text-blue-700',
  en_revision: 'bg-yellow-100 text-yellow-700',
  visita_agendada: 'bg-purple-100 text-purple-700',
  cotizado: 'bg-orange-100 text-orange-700',
  aceptado: 'bg-green-100 text-green-700',
  rechazado: 'bg-red-100 text-red-700',
  instalacion_agendada: 'bg-purple-100 text-purple-700',
  completado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
}

function AdminCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [seleccionada, setSeleccionada] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState('')

  useEffect(() => {
    cargarCotizaciones()
  }, [])

  const cargarCotizaciones = () => {
    setCargando(true)
    api.get('/cotizaciones/')
      .then(res => setCotizaciones(res.data))
      .finally(() => setCargando(false))
  }

  const cambiarEstado = (id) => {
    api.patch(`/cotizaciones/${id}/`, { estado: nuevoEstado })
      .then(() => {
        cargarCotizaciones()
        setSeleccionada(null)
      })
  }

  const cotizacionesFiltradas = cotizaciones.filter(c => {
    const matchBusqueda = busqueda === '' ||
      c.nombre_cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.codigo?.toLowerCase().includes(busqueda.toLowerCase())
    const matchEstado = filtroEstado === '' || c.estado === filtroEstado
    return matchBusqueda && matchEstado
  })

  const pendientes = cotizaciones.filter(c => c.estado === 'recibido').length
  const completados = cotizaciones.filter(c => c.estado === 'completado').length

  return (
    <div>
      <Helmet>
        <title>Cotizaciones | GyG Admin</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <FaFileAlt size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{cotizaciones.length} cotizaciones registradas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FaFileAlt size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{cotizaciones.length}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <FaFileAlt size={16} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{pendientes}</p>
            <p className="text-xs text-gray-400">Pendientes</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <FaFileAlt size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{completados}</p>
            <p className="text-xs text-gray-400">Completadas</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 shadow-sm">
          <FaSearch size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o codigo..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="flex-1 focus:outline-none text-sm bg-transparent"
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="text-gray-400 hover:text-gray-600">
              <FaTimes size={13} />
            </button>
          )}
        </div>
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white shadow-sm"
        >
          {ESTADOS.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : cotizacionesFiltradas.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <FaFileAlt size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No se encontraron cotizaciones</p>
          <p className="text-gray-400 text-sm mt-1">Intenta con otro termino de busqueda</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Codigo</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Cliente</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Telefono</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Distrito</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Estado</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Fecha</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cotizacionesFiltradas.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-bold text-yellow-600">{c.codigo}</td>
                  <td className="px-5 py-4 font-medium text-gray-900">{c.nombre_cliente}</td>
                  <td className="px-5 py-4 text-gray-500">{c.telefono}</td>
                  <td className="px-5 py-4 text-gray-500">{c.distrito}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${estadoColor[c.estado] || 'bg-gray-100 text-gray-700'}`}>
                      {c.estado?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {new Date(c.creado_en).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => { setSeleccionada(c); setNuevoEstado(c.estado) }}
                      className="bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-300 transition flex items-center gap-1"
                    >
                      <FaEdit size={11} />
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {seleccionada && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <FaFileAlt size={16} className="text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{seleccionada.codigo}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Detalle de la cotizacion</p>
                </div>
              </div>
              <button onClick={() => setSeleccionada(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Cliente</p>
                  <p className="text-sm font-bold text-gray-900">{seleccionada.nombre_cliente}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Telefono</p>
                  <p className="text-sm font-bold text-gray-900">{seleccionada.telefono}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Correo</p>
                  <p className="text-sm font-bold text-gray-900">{seleccionada.correo}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Distrito</p>
                  <p className="text-sm font-bold text-gray-900">{seleccionada.distrito}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Tipo de uso</p>
                  <p className="text-sm font-bold text-gray-900">{seleccionada.tipo_uso}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Disponibilidad</p>
                  <p className="text-sm font-bold text-gray-900">{seleccionada.disponibilidad}</p>
                </div>
              </div>

              {seleccionada.descripcion && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Descripcion</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{seleccionada.descripcion}</p>
                </div>
              )}

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/51${seleccionada.telefono}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={14} /> WhatsApp
                </a>
                <a
                  href={`tel:+51${seleccionada.telefono}`}
                  className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <FaPhone size={13} /> Llamar
                </a>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cambiar estado</p>
                <select
                  value={nuevoEstado}
                  onChange={e => setNuevoEstado(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 bg-gray-50 text-sm mb-3"
                >
                  {ESTADOS.filter(e => e.value !== '').map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSeleccionada(null)}
                    className="flex-1 border border-gray-200 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => cambiarEstado(seleccionada.id)}
                    className="flex-1 bg-yellow-400 text-gray-900 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-300 transition"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCotizaciones