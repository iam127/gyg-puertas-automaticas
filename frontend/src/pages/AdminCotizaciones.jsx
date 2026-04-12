import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaSearch, FaEye, FaCheck, FaTimes, FaEdit } from 'react-icons/fa'

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cotizaciones</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {cotizaciones.length} total
        </span>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2 flex-1">
          <FaSearch size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o codigo..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="flex-1 focus:outline-none text-sm"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none"
        >
          {ESTADOS.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>

      {/* TABLA */}
      {cargando ? (
        <p className="text-gray-500 text-center py-10">Cargando...</p>
      ) : cotizacionesFiltradas.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No se encontraron cotizaciones.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Codigo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Telefono</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Distrito</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cotizacionesFiltradas.map((c, i) => (
                <tr key={c.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium text-yellow-600">{c.codigo}</td>
                  <td className="px-4 py-3">{c.nombre_cliente}</td>
                  <td className="px-4 py-3">{c.telefono}</td>
                  <td className="px-4 py-3">{c.distrito}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor[c.estado] || 'bg-gray-100 text-gray-700'}`}>
                      {c.estado?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(c.creado_en).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSeleccionada(c); setNuevoEstado(c.estado) }}
                      className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg text-xs font-bold hover:bg-yellow-300 transition flex items-center gap-1"
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

      {/* MODAL DETALLE */}
      {seleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold">Cotizacion {seleccionada.codigo}</h3>
              <button onClick={() => setSeleccionada(null)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Cliente</p>
                  <p className="font-medium">{seleccionada.nombre_cliente}</p>
                </div>
                <div>
                  <p className="text-gray-500">Telefono</p>
                  <p className="font-medium">{seleccionada.telefono}</p>
                </div>
                <div>
                  <p className="text-gray-500">Correo</p>
                  <p className="font-medium">{seleccionada.correo}</p>
                </div>
                <div>
                  <p className="text-gray-500">Distrito</p>
                  <p className="font-medium">{seleccionada.distrito}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tipo de uso</p>
                  <p className="font-medium">{seleccionada.tipo_uso}</p>
                </div>
                <div>
                  <p className="text-gray-500">Disponibilidad</p>
                  <p className="font-medium">{seleccionada.disponibilidad}</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Descripcion</p>
                <p className="font-medium bg-gray-50 p-3 rounded-xl">{seleccionada.descripcion}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500 mb-2">Cambiar estado</p>
                <select
                  value={nuevoEstado}
                  onChange={e => setNuevoEstado(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
                >
                  {ESTADOS.filter(e => e.value !== '').map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => cambiarEstado(seleccionada.id)}
                className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCotizaciones