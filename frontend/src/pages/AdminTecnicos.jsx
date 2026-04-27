import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaPlus, FaTrash, FaTimes, FaCopy, FaSearch, FaUsers, FaCheck } from 'react-icons/fa'
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
    if (window.confirm('Eliminar este codigo de invitacion?')) {
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
        <title>Tecnicos | GyG Admin</title>
      </Helmet>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <FaUsers size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{tecnicos.length} tecnicos registrados</p>
          </div>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-yellow-400 text-gray-900 px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-300 transition flex items-center gap-2 shadow-sm"
        >
          <FaPlus size={13} />
          Generar codigo
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <FaUsers size={16} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{tecnicos.length}</p>
            <p className="text-xs text-gray-400">Total tecnicos</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <FaUsers size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{tecnicos.filter(t => t.activo).length}</p>
            <p className="text-xs text-gray-400">Activos</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <FaPlus size={16} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{codigosDisponibles}</p>
            <p className="text-xs text-gray-400">Codigos disponibles</p>
          </div>
        </div>
      </div>

      {/* CODIGOS DE INVITACION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Codigos de invitacion</h3>
          <span className="text-xs text-gray-400">{codigos.length} codigos generados</span>
        </div>
        {codigos.length === 0 ? (
          <div className="text-center py-8">
            <FaPlus size={24} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No hay codigos generados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {codigos.map(c => (
              <div
                key={c.id}
                className={`rounded-2xl p-4 flex justify-between items-center border ${
                  c.usado
                    ? 'border-gray-100 bg-gray-50'
                    : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div>
                  <p className="font-black text-lg tracking-widest text-gray-900">{c.codigo}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                    c.usado ? 'bg-gray-200 text-gray-500' : 'bg-yellow-200 text-yellow-700'
                  }`}>
                    {c.usado ? 'Usado' : 'Disponible'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {!c.usado && (
                    <button
                      onClick={() => copiarCodigo(c.codigo)}
                      className={`p-2 rounded-lg transition ${
                        copiado === c.codigo
                          ? 'bg-green-100 text-green-600'
                          : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                      }`}
                      title="Copiar codigo"
                    >
                      {copiado === c.codigo ? <FaCheck size={13} /> : <FaCopy size={13} />}
                    </button>
                  )}
                  <button
                    onClick={() => eliminarCodigo(c.id)}
                    className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition border border-red-100"
                    title="Eliminar codigo"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LISTA DE TECNICOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Tecnicos registrados</h3>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
            <FaSearch size={13} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tecnico..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="focus:outline-none text-sm bg-transparent w-40"
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={12} />
              </button>
            )}
          </div>
        </div>
        {cargando ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tecnicosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <FaUsers size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay tecnicos registrados</p>
            <p className="text-gray-400 text-sm mt-1">Genera un codigo de invitacion para agregar tecnicos</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Usuario</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Nombre</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Correo</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Telefono</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tecnicosFiltrados.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-bold text-gray-900">{t.usuario?.username}</td>
                  <td className="px-5 py-4 text-gray-600">{t.usuario?.first_name} {t.usuario?.last_name}</td>
                  <td className="px-5 py-4 text-gray-500">{t.usuario?.email}</td>
                  <td className="px-5 py-4 text-gray-500">{t.telefono || '-'}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <FaPlus size={16} className="text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Generar codigo</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Codigo de invitacion para tecnico</p>
                </div>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-800 leading-relaxed">
                  Se generara un codigo unico que podras compartir con el tecnico para que se registre en la app movil.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 border border-gray-200 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={generarCodigo}
                  className="flex-1 bg-yellow-400 text-gray-900 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-300 transition"
                >
                  Generar codigo
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