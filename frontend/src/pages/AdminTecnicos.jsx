import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaPlus, FaTrash, FaTimes, FaCopy, FaSearch, FaUsers, FaCheck, FaUserCheck, FaKey } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

function AdminTecnicos() {
  const [tecnicos, setTecnicos] = useState([])
  const [codigos, setCodigos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [copiado, setCopiado] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = () => {
    setCargando(true)
    Promise.all([
      api.get('/tecnicos/'),
      api.get('/codigos-invitacion/'),
    ]).then(([tecRes, codRes]) => {
      setTecnicos(tecRes.data)
      setCodigos(codRes.data)
    }).finally(() => setCargando(false))
  }

  const generarCodigo = () => {
    api.post('/codigos-invitacion/').then(() => {
      cargarDatos()
      setModalAbierto(false)
    })
  }

  const eliminarCodigo = (id) => {
    if (window.confirm('¿Eliminar este código de invitación?')) {
      api.delete(`/codigos-invitacion/${id}/`).then(cargarDatos)
    }
  }

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo)
    setCopiado(codigo)
    setTimeout(() => setCopiado(null), 2000)
  }

  const tecnicosFiltrados = tecnicos.filter(t =>
    t.usuario?.username?.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.usuario?.first_name?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const codigosDisponibles = codigos.filter(c => !c.usado).length

  return (
    <div>
      <Helmet>
        <title>Técnicos | GyG Admin</title>
      </Helmet>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-700 rounded-lg flex items-center justify-center">
            <FaUsers size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestión de técnicos</h2>
            <p className="text-sm text-gray-500">{tecnicos.length} técnicos registrados</p>
          </div>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-slate-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center gap-2 shadow-sm"
        >
          <FaPlus size={14} />
          Generar código
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
              <FaUsers size={18} className="text-slate-700" />
            </div>
            <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
              Total
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{tecnicos.length}</p>
          <p className="text-sm text-gray-600 font-medium">Total técnicos</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FaUserCheck size={18} className="text-emerald-700" />
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">
              Activos
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{tecnicos.filter(t => t.activo).length}</p>
          <p className="text-sm text-gray-600 font-medium">Técnicos activos</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-amber-100 rounded-lg flex items-center justify-center">
              <FaKey size={18} className="text-amber-700" />
            </div>
            <div className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-semibold">
              Disponibles
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{codigosDisponibles}</p>
          <p className="text-sm text-gray-600 font-medium">Códigos disponibles</p>
        </div>
      </div>

      {/* CODIGOS DE INVITACION */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Códigos de invitación</h3>
            <p className="text-xs text-gray-500 mt-0.5">{codigos.length} códigos generados</p>
          </div>
        </div>
        {codigos.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <FaKey size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay códigos generados</p>
            <p className="text-gray-400 text-sm mt-1">Genera un código para invitar técnicos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {codigos.map(c => (
              <div
                key={c.id}
                className={`rounded-lg p-4 flex justify-between items-center border-2 ${
                  c.usado
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded flex items-center justify-center ${c.usado ? 'bg-gray-200' : 'bg-slate-700'}`}>
                      <FaKey size={12} className={c.usado ? 'text-gray-500' : 'text-white'} />
                    </div>
                    <p className="font-black text-base tracking-wider text-gray-900">{c.codigo}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md inline-block border ${
                    c.usado ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {c.usado ? 'Usado' : 'Disponible'}
                  </span>
                </div>
                <div className="flex flex-col gap-2 ml-3">
                  {!c.usado && (
                    <button
                      onClick={() => copiarCodigo(c.codigo)}
                      className={`p-2 rounded-lg transition border ${
                        copiado === c.codigo
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'
                      }`}
                      title="Copiar código"
                    >
                      {copiado === c.codigo ? <FaCheck size={14} /> : <FaCopy size={14} />}
                    </button>
                  )}
                  <button
                    onClick={() => eliminarCodigo(c.id)}
                    className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition border border-red-200"
                    title="Eliminar código"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LISTA DE TECNICOS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Técnicos registrados</h3>
            <p className="text-xs text-gray-500 mt-0.5">{tecnicosFiltrados.length} técnicos</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
            <FaSearch size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar técnico..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="focus:outline-none text-sm bg-transparent w-40 text-gray-900 placeholder-gray-400"
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="text-gray-400 hover:text-gray-600 transition">
                <FaTimes size={13} />
              </button>
            )}
          </div>
        </div>
        {cargando ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
          </div>
        ) : tecnicosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <FaUsers size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">No hay técnicos registrados</p>
            <p className="text-gray-400 text-sm mt-1">Genera un código de invitación para agregar técnicos</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Usuario</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Nombre</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Correo</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Teléfono</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tecnicosFiltrados.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FaUsers size={13} className="text-slate-700" />
                      </div>
                      <span className="font-semibold text-gray-900">{t.usuario?.username}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{t.usuario?.first_name} {t.usuario?.last_name}</td>
                  <td className="px-5 py-4 text-gray-600">{t.usuario?.email}</td>
                  <td className="px-5 py-4 text-gray-600">{t.telefono || '-'}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${t.activo ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {t.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {modalAbierto && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-700 rounded-lg flex items-center justify-center">
                  <FaKey size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Generar código de invitación</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Crear código para nuevo técnico</p>
                </div>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaKey size={16} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">Código único de registro</p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Se generará un código único que podrás compartir con el técnico para que se registre en la app móvil.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold text-sm hover:bg-gray-50 transition text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={generarCodigo}
                  className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-slate-800 transition"
                >
                  Generar código
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTecnicos