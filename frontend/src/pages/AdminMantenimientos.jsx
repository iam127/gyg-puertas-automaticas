import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaSearch, FaTimes, FaEdit, FaWrench, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCog } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'recibido', label: 'Recibido' },
  { value: 'en_revision', label: 'En Revisión' },
  { value: 'visita_agendada', label: 'Visita Agendada' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'completado', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' },
]

const estadoColor = {
  recibido: 'bg-blue-50 text-blue-700 border-blue-200',
  en_revision: 'bg-amber-50 text-amber-700 border-amber-200',
  visita_agendada: 'bg-purple-50 text-purple-700 border-purple-200',
  en_proceso: 'bg-orange-50 text-orange-700 border-orange-200',
  completado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelado: 'bg-red-50 text-red-700 border-red-200',
}

const tipoColor = {
  preventivo: 'bg-blue-50 text-blue-700 border-blue-200',
  correctivo: 'bg-orange-50 text-orange-700 border-orange-200',
  garantia: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

function AdminMantenimientos() {
  const [mantenimientos, setMantenimientos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState('')

  useEffect(() => {
    cargarMantenimientos()
  }, [])

  const cargarMantenimientos = () => {
    setCargando(true)
    api.get('/mantenimientos/')
      .then(res => setMantenimientos(res.data))
      .finally(() => setCargando(false))
  }

  const cambiarEstado = (id) => {
    api.patch(`/mantenimientos/${id}/`, { estado: nuevoEstado })
      .then(() => {
        cargarMantenimientos()
        setSeleccionado(null)
      })
  }

  const mantenimientosFiltrados = mantenimientos.filter(m => {
    const matchBusqueda = busqueda === '' ||
      m.nombre_cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.codigo?.toLowerCase().includes(busqueda.toLowerCase())
    const matchEstado = filtroEstado === '' || m.estado === filtroEstado
    return matchBusqueda && matchEstado
  })

  const pendientes = mantenimientos.filter(m => m.estado === 'recibido').length
  const completados = mantenimientos.filter(m => m.estado === 'completado').length

  return (
    <div>
      <Helmet>
        <title>Mantenimientos | GyG Admin</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-700 rounded-lg flex items-center justify-center">
            <FaWrench size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestión de mantenimientos</h2>
            <p className="text-sm text-gray-500">{mantenimientos.length} mantenimientos registrados</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
              <FaWrench size={18} className="text-slate-700" />
            </div>
            <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
              Total
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{mantenimientos.length}</p>
          <p className="text-sm text-gray-600 font-medium">Total mantenimientos</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-amber-100 rounded-lg flex items-center justify-center">
              <FaWrench size={18} className="text-amber-700" />
            </div>
            <div className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-semibold">
              Pendientes
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{pendientes}</p>
          <p className="text-sm text-gray-600 font-medium">Por atender</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FaWrench size={18} className="text-emerald-700" />
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">
              Completados
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{completados}</p>
          <p className="text-sm text-gray-600 font-medium">Finalizados</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 flex-1 shadow-sm">
          <FaSearch size={15} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="flex-1 focus:outline-none text-sm bg-transparent text-gray-900 placeholder-gray-400"
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="text-gray-400 hover:text-gray-600 transition">
              <FaTimes size={14} />
            </button>
          )}
        </div>
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none bg-white shadow-sm font-medium text-gray-700"
        >
          {ESTADOS.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
        </div>
      ) : mantenimientosFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <FaWrench size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">No se encontraron mantenimientos</p>
          <p className="text-gray-400 text-sm mt-1">Intenta con otro término de búsqueda o filtro</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Código</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Cliente</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Teléfono</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Tipo</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Distrito</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Estado</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Fecha</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mantenimientosFiltrados.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-700">{m.codigo}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{m.nombre_cliente}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{m.telefono}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize border ${tipoColor[m.tipo] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {m.tipo}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{m.distrito}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${estadoColor[m.estado] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {m.estado?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {new Date(m.creado_en).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => { setSeleccionado(m); setNuevoEstado(m.estado) }}
                      className="bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
                    >
                      <FaEdit size={12} />
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {seleccionado && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-700 rounded-lg flex items-center justify-center">
                  <FaWrench size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{seleccionado.codigo}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Detalle del mantenimiento</p>
                </div>
              </div>
              <button onClick={() => setSeleccionado(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                      <FaWrench size={11} className="text-slate-700" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Cliente</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{seleccionado.nombre_cliente}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                      <FaPhone size={11} className="text-slate-700" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{seleccionado.telefono}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                      <FaEnvelope size={11} className="text-slate-700" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Correo</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 break-all">{seleccionado.correo}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                      <FaMapMarkerAlt size={11} className="text-slate-700" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Distrito</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{seleccionado.distrito}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                      <FaCog size={11} className="text-slate-700" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Tipo</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{seleccionado.tipo}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                      <FaWrench size={11} className="text-slate-700" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Tipo de puerta</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{seleccionado.tipo_puerta}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                      <FaWrench size={11} className="text-slate-700" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Disponibilidad</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{seleccionado.disponibilidad}</p>
                </div>
              </div>

              {seleccionado.descripcion_problema && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-2">Descripción del problema</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{seleccionado.descripcion_problema}</p>
                </div>
              )}

              <div className="flex gap-3">
                <a
                  href={`https://wa.me/51${seleccionado.telefono}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={16} /> Contactar por WhatsApp
                </a>
                <a
                  href={`tel:+51${seleccionado.telefono}`}
                  className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  <FaPhone size={14} /> Llamar ahora
                </a>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Actualizar estado</p>
                <select
                  value={nuevoEstado}
                  onChange={e => setNuevoEstado(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 bg-white text-sm font-medium mb-4"
                >
                  {ESTADOS.filter(e => e.value !== '').map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSeleccionado(null)}
                    className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold text-sm hover:bg-gray-50 transition text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => cambiarEstado(seleccionado.id)}
                    className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-slate-800 transition"
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

export default AdminMantenimientos