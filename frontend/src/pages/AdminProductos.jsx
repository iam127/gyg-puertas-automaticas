import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch } from 'react-icons/fa'

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    especificaciones: '',
    uso: '',
    material: '',
    activo: true,
    destacado: false,
    categoria_id: '',
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = () => {
    setCargando(true)
    Promise.all([
      api.get('/productos/'),
      api.get('/categorias/'),
    ]).then(([prodRes, catRes]) => {
      setProductos(prodRes.data)
      setCategorias(catRes.data)
    }).finally(() => setCargando(false))
  }

  const abrirModal = (producto = null) => {
    if (producto) {
      setEditando(producto)
      setForm({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        especificaciones: producto.especificaciones || '',
        uso: producto.uso,
        material: producto.material || '',
        activo: producto.activo,
        destacado: producto.destacado,
        categoria_id: producto.categoria?.id || '',
      })
    } else {
      setEditando(null)
      setForm({ nombre: '', descripcion: '', especificaciones: '', uso: '', material: '', activo: true, destacado: false, categoria_id: '' })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setEditando(null)
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const request = editando
      ? api.patch(`/productos/${editando.id}/`, form)
      : api.post('/productos/', form)
    request.then(() => {
      cargarDatos()
      cerrarModal()
    })
  }

  const eliminar = (id) => {
    if (window.confirm('Estas seguro de eliminar este producto?')) {
      api.delete(`/productos/${id}/`).then(cargarDatos)
    }
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Productos</h2>
        <button
          onClick={() => abrirModal()}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition flex items-center gap-2"
        >
          <FaPlus size={14} />
          Nuevo producto
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2 mb-6">
        <FaSearch size={14} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="flex-1 focus:outline-none text-sm"
        />
      </div>

      {/* TABLA */}
      {cargando ? (
        <p className="text-gray-500 text-center py-10">Cargando...</p>
      ) : productosFiltrados.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No se encontraron productos.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Uso</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Material</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Activo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Destacado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium">{p.nombre}</td>
                  <td className="px-4 py-3 capitalize">{p.uso}</td>
                  <td className="px-4 py-3">{p.material || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.activo ? 'Si' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.destacado ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {p.destacado ? 'Si' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => abrirModal(p)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200 transition flex items-center gap-1"
                    >
                      <FaEdit size={12} />
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(p.id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-200 transition flex items-center gap-1"
                    >
                      <FaTrash size={12} />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold">{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion *</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required rows={3} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especificaciones tecnicas</label>
                <textarea name="especificaciones" value={form.especificaciones} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de uso *</label>
                  <select name="uso" value={form.uso} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400">
                    <option value="">Selecciona...</option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <input name="material" value={form.material} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select name="categoria_id" value={form.categoria_id} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400">
                  <option value="">Sin categoria</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="w-4 h-4 accent-yellow-400" />
                  Activo
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} className="w-4 h-4 accent-yellow-400" />
                  Destacado
                </label>
              </div>
              <button type="submit" className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition">
                {editando ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProductos