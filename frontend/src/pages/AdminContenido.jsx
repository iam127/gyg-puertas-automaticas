import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImages, FaStar, FaImage, FaUpload } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

function AdminContenido() {
  const [tab, setTab] = useState('testimonios')
  const [testimonios, setTestimonios] = useState([])
  const [blogs, setBlogs] = useState([])
  const [galerias, setGalerias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [imagenGaleria, setImagenGaleria] = useState(null)
  const [previstaGaleria, setPrevistaGaleria] = useState(null)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [formTestimonio, setFormTestimonio] = useState({ nombre_cliente: '', comentario: '', calificacion: 5, aprobado: true })
  const [formBlog, setFormBlog] = useState({ titulo: '', contenido: '', publicado: false })
  const [formGaleria, setFormGaleria] = useState({ titulo: '', descripcion: '', tipo_puerta: '', activo: true })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = () => {
    setCargando(true)
    Promise.all([
      api.get('/testimonios/'),
      api.get('/blog/'),
      api.get('/galeria/'),
    ]).then(([testRes, blogRes, galRes]) => {
      setTestimonios(testRes.data)
      setBlogs(blogRes.data)
      setGalerias(galRes.data)
    }).finally(() => setCargando(false))
  }

  const abrirModal = (item = null) => {
    setEditando(item)
    setImagenGaleria(null)
    setPrevistaGaleria(null)
    if (tab === 'testimonios') {
      setFormTestimonio(item ? {
        nombre_cliente: item.nombre_cliente,
        comentario: item.comentario,
        calificacion: item.calificacion,
        aprobado: item.aprobado,
      } : { nombre_cliente: '', comentario: '', calificacion: 5, aprobado: true })
    } else if (tab === 'blog') {
      setFormBlog(item ? {
        titulo: item.titulo,
        contenido: item.contenido,
        publicado: item.publicado,
      } : { titulo: '', contenido: '', publicado: false })
    } else if (tab === 'galeria') {
      setFormGaleria(item ? {
        titulo: item.titulo,
        descripcion: item.descripcion || '',
        tipo_puerta: item.tipo_puerta || '',
        activo: item.activo,
      } : { titulo: '', descripcion: '', tipo_puerta: '', activo: true })
      if (item?.imagen) {
        setPrevistaGaleria(item.imagen.startsWith('http') ? item.imagen : `http://127.0.0.1:8000${item.imagen}`)
      }
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setEditando(null)
    setImagenGaleria(null)
    setPrevistaGaleria(null)
  }

  const handleSubmitTestimonio = (e) => {
    e.preventDefault()
    const request = editando
      ? api.patch(`/testimonios/${editando.id}/`, formTestimonio)
      : api.post('/testimonios/', formTestimonio)
    request.then(() => { cargarDatos(); cerrarModal() })
  }

  const handleSubmitBlog = (e) => {
    e.preventDefault()
    const request = editando
      ? api.patch(`/blog/${editando.id}/`, formBlog)
      : api.post('/blog/', formBlog)
    request.then(() => { cargarDatos(); cerrarModal() })
  }

  const handleSubmitGaleria = (e) => {
    e.preventDefault()
    if (!editando && !imagenGaleria) {
      alert('Por favor selecciona una imagen')
      return
    }
    setSubiendoImagen(true)
    const formData = new FormData()
    formData.append('titulo', formGaleria.titulo)
    formData.append('descripcion', formGaleria.descripcion)
    formData.append('tipo_puerta', formGaleria.tipo_puerta)
    formData.append('activo', formGaleria.activo)
    if (imagenGaleria) formData.append('imagen', imagenGaleria)

    const request = editando
      ? api.patch(`/galeria/${editando.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.post('/galeria/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

    request.then(() => {
      cargarDatos()
      cerrarModal()
    }).finally(() => setSubiendoImagen(false))
  }

  const eliminar = (id) => {
    if (window.confirm('Eliminar este elemento?')) {
      const endpoint = tab === 'testimonios' ? `/testimonios/${id}/` : tab === 'blog' ? `/blog/${id}/` : `/galeria/${id}/`
      api.delete(endpoint).then(cargarDatos)
    }
  }

  const getImagenUrl = (url) => {
    if (!url) return null
    return url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`
  }

  const tabs = [
    { id: 'testimonios', label: 'Testimonios', count: testimonios.length },
    { id: 'blog', label: 'Blog', count: blogs.length },
    { id: 'galeria', label: 'Galeria', count: galerias.length },
  ]

  return (
    <div>
      <Helmet>
        <title>Contenido | GyG Admin</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <FaImages size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Gestiona testimonios, blog y galeria</p>
          </div>
        </div>
        <button
          onClick={() => abrirModal()}
          className="bg-yellow-400 text-gray-900 px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-300 transition flex items-center gap-2 shadow-sm"
        >
          <FaPlus size={13} />
          Nuevo
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition flex items-center gap-2 ${
              tab === t.id
                ? 'bg-yellow-400 text-gray-900 shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-yellow-400'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === t.id ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* TESTIMONIOS */}
      {tab === 'testimonios' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {cargando ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : testimonios.length === 0 ? (
            <div className="text-center py-20">
              <FaStar size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No hay testimonios</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Comentario</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Calificacion</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Aprobado</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {testimonios.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">{t.nombre_cliente}</td>
                    <td className="px-5 py-4 max-w-xs truncate text-gray-500">{t.comentario}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(t.calificacion)].map((_, i) => (
                          <FaStar key={i} size={12} className="text-yellow-400" />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">{t.calificacion}/5</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.aprobado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.aprobado ? 'Aprobado' : 'No aprobado'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => abrirModal(t)} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1">
                          <FaEdit size={11} /> Editar
                        </button>
                        <button onClick={() => eliminar(t.id)} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition flex items-center gap-1">
                          <FaTrash size={11} /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* BLOG */}
      {tab === 'blog' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {cargando ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <FaImages size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No hay entradas de blog</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Titulo</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Publicado</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">{b.titulo}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${b.publicado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {b.publicado ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(b.creado_en).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => abrirModal(b)} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1">
                          <FaEdit size={11} /> Editar
                        </button>
                        <button onClick={() => eliminar(b.id)} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition flex items-center gap-1">
                          <FaTrash size={11} /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* GALERIA */}
      {tab === 'galeria' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {cargando ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : galerias.length === 0 ? (
            <div className="text-center py-20">
              <FaImages size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No hay imagenes en la galeria</p>
              <p className="text-gray-400 text-sm mt-1">Agrega la primera imagen</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Imagen</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Titulo</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Tipo de puerta</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Activo</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {galerias.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      {g.imagen ? (
                        <img
                          src={getImagenUrl(g.imagen)}
                          alt={g.titulo}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                          <FaImage size={16} className="text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">{g.titulo}</td>
                    <td className="px-5 py-4">
                      {g.tipo_puerta ? (
                        <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-bold">
                          {g.tipo_puerta}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${g.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {g.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(g.creado_en).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => abrirModal(g)} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1">
                          <FaEdit size={11} /> Editar
                        </button>
                        <button onClick={() => eliminar(g.id)} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition flex items-center gap-1">
                          <FaTrash size={11} /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* MODAL TESTIMONIO */}
      {modalAbierto && tab === 'testimonios' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <FaStar size={16} className="text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{editando ? 'Editar testimonio' : 'Nuevo testimonio'}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Completa los campos para {editando ? 'actualizar' : 'agregar'} el testimonio</p>
                </div>
              </div>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmitTestimonio} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del cliente *</label>
                <input
                  value={formTestimonio.nombre_cliente}
                  onChange={e => setFormTestimonio({...formTestimonio, nombre_cliente: e.target.value})}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentario *</label>
                <textarea
                  value={formTestimonio.comentario}
                  onChange={e => setFormTestimonio({...formTestimonio, comentario: e.target.value})}
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calificacion</label>
                <div className="flex gap-2 items-center">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button"
                      onClick={() => setFormTestimonio({...formTestimonio, calificacion: n})}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition ${formTestimonio.calificacion >= n ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 text-gray-400'}`}
                    >{n}</button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{formTestimonio.calificacion} de 5 estrellas</span>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl cursor-pointer border border-gray-100">
                <input type="checkbox" checked={formTestimonio.aprobado} onChange={e => setFormTestimonio({...formTestimonio, aprobado: e.target.checked})} className="w-4 h-4 accent-yellow-400" />
                <span className="text-sm font-medium text-gray-700">Mostrar en la web</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={cerrarModal} className="flex-1 border border-gray-200 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition text-sm">Cancelar</button>
                <button type="submit" className="flex-1 bg-yellow-400 text-gray-900 py-2.5 rounded-xl font-bold hover:bg-yellow-300 transition text-sm">{editando ? 'Guardar cambios' : 'Crear testimonio'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BLOG */}
      {modalAbierto && tab === 'blog' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <FaImages size={16} className="text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{editando ? 'Editar entrada' : 'Nueva entrada de blog'}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Completa los campos para {editando ? 'actualizar' : 'publicar'} la entrada</p>
                </div>
              </div>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmitBlog} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titulo *</label>
                <input value={formBlog.titulo} onChange={e => setFormBlog({...formBlog, titulo: e.target.value})} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
                <textarea value={formBlog.contenido} onChange={e => setFormBlog({...formBlog, contenido: e.target.value})} required rows={8} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50 text-sm" />
                <p className="text-xs text-gray-400 mt-1">{formBlog.contenido.length} caracteres</p>
              </div>
              <label className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl cursor-pointer border border-gray-100">
                <input type="checkbox" checked={formBlog.publicado} onChange={e => setFormBlog({...formBlog, publicado: e.target.checked})} className="w-4 h-4 accent-yellow-400" />
                <span className="text-sm font-medium text-gray-700">Publicar en la web</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={cerrarModal} className="flex-1 border border-gray-200 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition text-sm">Cancelar</button>
                <button type="submit" className="flex-1 bg-yellow-400 text-gray-900 py-2.5 rounded-xl font-bold hover:bg-yellow-300 transition text-sm">{editando ? 'Guardar cambios' : 'Publicar entrada'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GALERIA */}
      {modalAbierto && tab === 'galeria' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <FaImages size={16} className="text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{editando ? 'Editar imagen' : 'Nueva imagen de galeria'}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Sube una foto de instalacion real</p>
                </div>
              </div>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="p-6">
              {/* IMAGEN */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen {!editando && '*'}</label>
                {previstaGaleria ? (
                  <div style={{ position: 'relative', borderRadius: '12px', border: '2px solid #facc15', cursor: 'pointer' }}
                    onClick={() => document.getElementById('input-imagen-galeria').click()}
                  >
                    <img src={previstaGaleria} alt="preview" style={{ width: '100%', height: '180px', objectFit: 'contain', display: 'block', backgroundColor: '#f9fafb', borderRadius: '10px' }} />
                    <div style={{ position: 'absolute', bottom: 8, left: 8, background: '#facc15', color: '#111827', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px' }}>
                      Imagen seleccionada
                    </div>
                    <button type="button"
                      onClick={(e) => { e.stopPropagation(); setImagenGaleria(null); setPrevistaGaleria(null) }}
                      style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', color: '#fff', width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <FaTimes size={12} />
                    </button>
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FaUpload size={10} /> Cambiar
                    </div>
                  </div>
                ) : (
                  <div onClick={() => document.getElementById('input-imagen-galeria').click()}
                    style={{ border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '32px 16px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb' }}
                  >
                    <div style={{ width: 48, height: 48, background: '#e5e7eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                      <FaImage size={20} color="#9ca3af" />
                    </div>
                    <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>Haz clic para subir una imagen</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: 4 }}>Foto de instalacion real — JPG, PNG hasta 5MB</p>
                  </div>
                )}
                <input id="input-imagen-galeria" type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) { setImagenGaleria(file); setPrevistaGaleria(URL.createObjectURL(file)) }
                  }}
                />
              </div>

              <form onSubmit={handleSubmitGaleria} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titulo *</label>
                  <input value={formGaleria.titulo} onChange={e => setFormGaleria({...formGaleria, titulo: e.target.value})} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50 text-sm" placeholder="Ej: Instalacion puerta corrediza en Miraflores" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                  <textarea value={formGaleria.descripcion} onChange={e => setFormGaleria({...formGaleria, descripcion: e.target.value})} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50 text-sm" placeholder="Breve descripcion del proyecto" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de puerta</label>
                  <select value={formGaleria.tipo_puerta} onChange={e => setFormGaleria({...formGaleria, tipo_puerta: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 bg-gray-50 text-sm">
                    <option value="">Selecciona...</option>
                    <option value="Puerta Corrediza">Puerta Corrediza</option>
                    <option value="Porton Levadizo">Porton Levadizo</option>
                    <option value="Puerta Batiente">Puerta Batiente</option>
                    <option value="Puerta Enrollable">Puerta Enrollable</option>
                    <option value="Barrera Vehicular">Barrera Vehicular</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl cursor-pointer border border-gray-100">
                  <input type="checkbox" checked={formGaleria.activo} onChange={e => setFormGaleria({...formGaleria, activo: e.target.checked})} className="w-4 h-4 accent-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">Mostrar en la galeria</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={cerrarModal} className="flex-1 border border-gray-200 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition text-sm">Cancelar</button>
                  <button type="submit" disabled={subiendoImagen} className="flex-1 bg-yellow-400 text-gray-900 py-2.5 rounded-xl font-bold hover:bg-yellow-300 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {subiendoImagen ? (
                      <><div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" /> Subiendo...</>
                    ) : editando ? 'Guardar cambios' : 'Agregar a galeria'}
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

export default AdminContenido