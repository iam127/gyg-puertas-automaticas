import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaPlus, FaTrash, FaTimes, FaCopy, FaSearch } from 'react-icons/fa'
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

  return (
    <div>
      <Helmet>
        <title>Tecnicos | GyG Admin</title>
      </Helmet>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tecnicos</h2>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition flex items-center gap-2"
        >
          <FaPlus size={14} />
          Generar codigo de invitacion
        </button>
      </div>

      {/* CODIGOS DE INVITACION */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Codigos de invitacion disponibles</h3>
        {codigos.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay codigos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {codigos.map(c => (
              <div key={c.id} className={`border rounded-xl p-4 flex justify-between items-center ${c.usado ? 'border-gray-200 bg-gray-50' : 'border-yellow-400 bg-yellow-50'}`}>
                <div>
                  <p className="font-bold text-lg tracking-widest">{c.codigo}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {c.usado ? 'Usado' : 'Disponible'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!c.usado && (
                    <button
                      onClick={() => copiarCodigo(c.codigo)}
                      className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition"
                      title="Copiar codigo"
                    >
                      {copiado === c.codigo ? '✓' : <FaCopy size={14} />}
                    </button>
                  )}
                  <button
                    onClick={() => eliminarCodigo(c.id)}
                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition"
                    title="Eliminar codigo"
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
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">Tecnicos registrados</h3>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2">
            <FaSearch size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tecnico..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="flex-1 focus:outline-none text-sm bg-transparent"
            />
          </div>
        </div>
        {cargando ? (
          <p className="text-gray-500 text-center py-10">Cargando...</p>
        ) : tecnicosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No hay tecnicos registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Usuario</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Correo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Telefono</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {tecnicosFiltrados.map((t, i) => (
                <tr key={t.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium">{t.usuario?.username}</td>
                  <td className="px-4 py-3">{t.usuario?.first_name} {t.usuario?.last_name}</td>
                  <td className="px-4 py-3">{t.usuario?.email}</td>
                  <td className="px-4 py-3">{t.telefono || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL CONFIRMAR */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Generar codigo de invitacion</h3>
              <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Se generara un codigo unico que podras compartir con el tecnico para que se registre en la app movil.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModalAbierto(false)}
                className="flex-1 border border-gray-300 py-2 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={generarCodigo}
                className="flex-1 bg-yellow-400 text-gray-900 py-2 rounded-xl font-bold hover:bg-yellow-300 transition"
              >
                Generar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTecnicos