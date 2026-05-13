import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch, FaBox, FaImage, FaUpload, FaCheckCircle } from 'react-icons/fa'
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
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
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
          <div className="w-11 h-11 bg-slate-700 rounded-lg flex items-center justify-center">
            <FaBox size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestión de productos</h2>
            <p className="text-sm text-gray-500">{productos.length} productos registrados</p>
          </div>
        </div>
        <button
          onClick={() => abrirModal()}
          className="bg-slate-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center gap-2 shadow-sm"
        >
          <FaPlus size={14} />
          Nuevo producto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
              <FaBox size={18} className="text-slate-700" />
            </div>
            <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
              Total
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{productos.length}</p>
          <p className="text-sm text-gray-600 font-medium">Total productos</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle size={18} className="text-emerald-700" />
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">
              Activos
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{productos.filter(p => p.activo).length}</p>
          <p className="text-sm text-gray-600 font-medium">Productos activos</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-amber-100 rounded-lg flex items-center justify-center">
              <FaBox size={18} className="text-amber-700" />
            </div>
            <div className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-semibold">
              Destacados
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{productos.filter(p => p.destacado).length}</p>
          <p className="text-sm text-gray-600 font-medium">Productos destacados</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 mb-6 shadow-sm">
        <FaSearch size={15} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar producto por nombre..."
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

      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <FaBox size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">No se encontraron productos</p>
          <p className="text-gray-400 text-sm mt-1">Intenta con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Imagen</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Nombre</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Uso</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Material</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Estado</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Destacado</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productosFiltrados.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    {p.imagen_principal ? (
                      <img
                        src={p.imagen_principal}
                        alt={p.nombre}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                        <FaImage size={16} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{p.nombre}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium capitalize border border-slate-200">
                      {p.uso}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{p.material || '-'}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${p.activo ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${p.destacado ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {p.destacado ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModal(p)}
                        className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 transition flex items-center gap-1.5 border border-slate-200"
                      >
                        <FaEdit size={12} /> Editar
                      </button>
                      <button
                        onClick={() => eliminar(p.id)}
                        className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition flex items-center gap-1.5 border border-red-200"
                      >
                        <FaTrash size={12} /> Eliminar
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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-700 rounded-lg flex items-center justify-center">
                  <FaBox size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{editando ? 'Actualiza los datos del producto' : 'Completa los datos del nuevo producto'}</p>
                </div>
              </div>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen del producto</label>
                {previstaImagen ? (
                  <div
                    style={{ position: 'relative', borderRadius: '8px', border: '2px solid #475569', cursor: 'pointer' }}
                    onClick={() => document.getElementById('input-imagen-producto').click()}
                  >
                    <img
                      src={previstaImagen}
                      alt="preview"
                      style={{ width: '100%', height: '200px', objectFit: 'contain', display: 'block', backgroundColor: '#f9fafb', borderRadius: '6px' }}
                    />
                    <div style={{ position: 'absolute', bottom: 8, left: 8, background: '#475569', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '6px' }}>
                      Imagen principal
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImagen(null); setPrevistaImagen(null) }}
                      style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', color: '#fff', width: 30, height: 30, borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <FaTimes size={13} />
                    </button>
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <FaUpload size={11} /> Cambiar
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => document.getElementById('input-imagen-producto').click()}
                    style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '40px 16px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb' }}
                  >
                    <div style={{ width: 52, height: 52, background: '#e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <FaImage size={22} color="#9ca3af" />
                    </div>
                    <p style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>Haz clic para subir una imagen</p>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: 4 }}>JPG, PNG hasta 5MB</p>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del producto *</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 bg-white text-sm"
                    placeholder="Ej: Puerta seccional industrial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción *</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 bg-white text-sm"
                    placeholder="Describe el producto brevemente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Especificaciones técnicas</label>
                  <textarea
                    name="especificaciones"
                    value={form.especificaciones}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 bg-white text-sm"
                    placeholder="Detalles técnicos, dimensiones, características especiales"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo de uso *</label>
                    <select
                      name="uso"
                      value={form.uso}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-slate-500 bg-white text-sm"
                    >
                      <option value="">Selecciona...</option>
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Material</label>
                    <input
                      name="material"
                      value={form.material}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-slate-500 bg-white text-sm"
                      placeholder="Ej: Acero galvanizado"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoría</label>
                  <select
                    name="categoria_id"
                    value={form.categoria_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-slate-500 bg-white text-sm"
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="w-4 h-4 accent-slate-700 cursor-pointer" />
                    Activo en la web
                  </label>
                  <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} className="w-4 h-4 accent-slate-700 cursor-pointer" />
                    Destacado en inicio
                  </label>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-sm text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={subiendoImagen}
                    className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {subiendoImagen ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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