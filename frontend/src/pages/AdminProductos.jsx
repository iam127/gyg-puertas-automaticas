import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch, FaBox, FaImage, FaUpload } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [imagen, setImagen] = useState(null)
  const [previstaImagen, setPrevistaImagen] = useState(null)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
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
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        especificaciones: producto.especificaciones || '',
        uso: producto.uso || '',
        material: producto.material || '',
        activo: producto.activo ?? true,
        destacado: producto.destacado ?? false,
        categoria_id: producto.categoria_id || producto.categoria?.id || '',
      })
      setPrevistaImagen(producto.imagen_principal || null)
      setImagen(null)
    } else {
      setEditando(null)
      setForm({ nombre: '', descripcion: '', especificaciones: '', uso: '', material: '', activo: true, destacado: false, categoria_id: '' })
      setImagen(null)
      setPrevistaImagen(null)
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setEditando(null)
    setImagen(null)
    setPrevistaImagen(null)
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
      setPrevistaImagen(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = { ...form }
    payload.categoria_id = payload.categoria_id || null

    const request = editando
      ? api.patch(`/productos/${editando.id}/`, payload)
      : api.post('/productos/', payload)

    request.then(res => {
      const productoId = res.data.id || editando?.id
      if (imagen && productoId) {
        setSubiendoImagen(true)
        const formData = new FormData()
        formData.append('imagen', imagen)
        formData.append('producto', productoId)
        formData.append('principal', 'True')
        api.post('/imagenes/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).finally(() => {
          setSubiendoImagen(false)
          cargarDatos()
          cerrarModal()
        })
      } else {
        cargarDatos()
        cerrarModal()
      }
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
      <Helmet>
        <title>Productos | GyG Admin</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <FaBox size={16} className="text-gray-900" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{productos.length} productos registrados</p>
          </div>
        </div>
        <button
          onClick={() => abrirModal()}
          className="bg-yellow-400 text-gray-900 px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-300 transition flex items-center gap-2 shadow-sm"
        >
          <FaPlus size={13} />
          Nuevo producto
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <FaBox size={16} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{productos.length}</p>
            <p className="text-xs text-gray-400">Total productos</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <FaBox size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{productos.filter(p => p.activo).length}</p>
            <p className="text-xs text-gray-400">Activos</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FaBox size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{productos.filter(p => p.destacado).length}</p>
            <p className="text-xs text-gray-400">Destacados</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-6 shadow-sm">
        <FaSearch size={14} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar producto por nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="flex-1 focus:outline-none text-sm bg-transparent"
        />
        {busqueda && (
          <button onClick={() => setBusqueda('')} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={14} />
          </button>
        )}
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <FaBox size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No se encontraron productos</p>
          <p className="text-gray-400 text-sm mt-1">Intenta con otro termino de busqueda</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Imagen</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Nombre</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Uso</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Material</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Activo</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Destacado</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productosFiltrados.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    {p.imagen_principal ? (
                      <img
                        src={p.imagen_principal}
                        alt={p.nombre}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                        <FaImage size={16} className="text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900">{p.nombre}</td>
                  <td className="px-5 py-4">
                    <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-bold capitalize">
                      {p.uso}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{p.material || '-'}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.destacado ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.destacado ? 'Si' : 'No'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModal(p)}
                        className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1"
                      >
                        <FaEdit size={11} /> Editar
                      </button>
                      <button
                        onClick={() => eliminar(p.id)}
                        className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition flex items-center gap-1"
                      >
                        <FaTrash size={11} /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAbierto && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center" style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <FaBox size={16} className="text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{editando ? 'Actualiza los datos del producto' : 'Completa los datos del nuevo producto'}</p>
                </div>
              </div>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>
                {previstaImagen ? (
                  <div
                    style={{ position: 'relative', borderRadius: '12px', border: '2px solid #facc15', cursor: 'pointer' }}
                    onClick={() => document.getElementById('input-imagen-producto').click()}
                  >
                    <img
                      src={previstaImagen}
                      alt="preview"
                      style={{ width: '100%', height: '180px', objectFit: 'contain', display: 'block', backgroundColor: '#f9fafb', borderRadius: '10px' }}
                    />
                    <div style={{ position: 'absolute', bottom: 8, left: 8, background: '#facc15', color: '#111827', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px' }}>
                      Imagen principal
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImagen(null); setPrevistaImagen(null) }}
                      style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', color: '#fff', width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <FaTimes size={12} />
                    </button>
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FaUpload size={10} /> Cambiar
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => document.getElementById('input-imagen-producto').click()}
                    style={{ border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '32px 16px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb' }}
                  >
                    <div style={{ width: 48, height: 48, background: '#e5e7eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                      <FaImage size={20} color="#9ca3af" />
                    </div>
                    <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>Haz clic para subir una imagen</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: 4 }}>JPG, PNG hasta 5MB</p>
                  </div>
                )}
                <input
                  id="input-imagen-producto"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImagenChange}
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion *</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especificaciones tecnicas</label>
                  <textarea
                    name="especificaciones"
                    value={form.especificaciones}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de uso *</label>
                    <select
                      name="uso"
                      value={form.uso}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 bg-gray-50 text-sm"
                    >
                      <option value="">Selecciona...</option>
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                    <input
                      name="material"
                      value={form.material}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 bg-gray-50 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    name="categoria_id"
                    value={form.categoria_id}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 bg-gray-50 text-sm"
                  >
                    <option value="">Sin categoria</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="w-4 h-4 accent-yellow-400" />
                    Activo en la web
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} className="w-4 h-4 accent-yellow-400" />
                    Destacado en inicio
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="flex-1 border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-sm text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={subiendoImagen}
                    className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {subiendoImagen ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        Subiendo imagen...
                      </>
                    ) : editando ? 'Guardar cambios' : 'Crear producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProductos