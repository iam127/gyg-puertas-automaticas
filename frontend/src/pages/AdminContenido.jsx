import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'

function AdminContenido() {
  const [tab, setTab] = useState('testimonios')
  const [testimonios, setTestimonios] = useState([])
  const [blogs, setBlogs] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formTestimonio, setFormTestimonio] = useState({ nombre_cliente: '', comentario: '', calificacion: 5, aprobado: true })
  const [formBlog, setFormBlog] = useState({ titulo: '', contenido: '', publicado: false })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = () => {
    setCargando(true)
    Promise.all([
      api.get('/testimonios/'),
      api.get('/blog/'),
    ]).then(([testRes, blogRes]) => {
      setTestimonios(testRes.data)
      setBlogs(blogRes.data)
    }).finally(() => setCargando(false))
  }

  const abrirModal = (item = null) => {
    setEditando(item)
    if (tab === 'testimonios') {
      setFormTestimonio(item ? {
        nombre_cliente: item.nombre_cliente,
        comentario: item.comentario,
        calificacion: item.calificacion,
        aprobado: item.aprobado,
      } : { nombre_cliente: '', comentario: '', calificacion: 5, aprobado: true })
    } else {
      setFormBlog(item ? {
        titulo: item.titulo,
        contenido: item.contenido,
        publicado: item.publicado,
      } : { titulo: '', contenido: '', publicado: false })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setEditando(null)
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

  const eliminar = (id) => {
    if (window.confirm('Eliminar este elemento?')) {
      const endpoint = tab === 'testimonios' ? `/testimonios/${id}/` : `/blog/${id}/`
      api.delete(endpoint).then(cargarDatos)
    }
  }

  const tabs = [
    { id: 'testimonios', label: 'Testimonios' },
    { id: 'blog', label: 'Blog' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contenido</h2>
        <button
          onClick={() => abrirModal()}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition flex items-center gap-2"
        >
          <FaPlus size={14} />
          Nuevo
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition ${
              tab === t.id
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-white border border-gray-300 text-gray-600 hover:border-yellow-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TESTIMONIOS */}
      {tab === 'testimonios' && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {cargando ? (
            <p className="text-gray-500 text-center py-10">Cargando...</p>
          ) : testimonios.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No hay testimonios.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Comentario</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Calificacion</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Aprobado</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {testimonios.map((t, i) => (
                  <tr key={t.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 font-medium">{t.nombre_cliente}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{t.comentario}</td>
                    <td className="px-4 py-3">{t.calificacion}/5</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.aprobado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.aprobado ? 'Si' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => abrirModal(t)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200 transition flex items-center gap-1">
                        <FaEdit size={12} /> Editar
                      </button>
                      <button onClick={() => eliminar(t.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-200 transition flex items-center gap-1">
                        <FaTrash size={12} /> Eliminar
                      </button>
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
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {cargando ? (
            <p className="text-gray-500 text-center py-10">Cargando...</p>
          ) : blogs.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No hay entradas de blog.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Titulo</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Publicado</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b, i) => (
                  <tr key={b.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 font-medium">{b.titulo}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.publicado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {b.publicado ? 'Si' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(b.creado_en).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => abrirModal(b)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200 transition flex items-center gap-1">
                        <FaEdit size={12} /> Editar
                      </button>
                      <button onClick={() => eliminar(b.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-200 transition flex items-center gap-1">
                        <FaTrash size={12} /> Eliminar
                      </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{editando ? 'Editar testimonio' : 'Nuevo testimonio'}</h3>
                <p className="text-sm text-gray-500 mt-1">Completa los campos para {editando ? 'actualizar' : 'agregar'} el testimonio</p>
              </div>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg">
                <FaTimes size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitTestimonio} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del cliente *</label>
                <input
                  value={formTestimonio.nombre_cliente}
                  onChange={e => setFormTestimonio({...formTestimonio, nombre_cliente: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentario *</label>
                <textarea
                  value={formTestimonio.comentario}
                  onChange={e => setFormTestimonio({...formTestimonio, comentario: e.target.value})}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calificacion</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFormTestimonio({...formTestimonio, calificacion: n})}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition ${
                        formTestimonio.calificacion >= n
                          ? 'bg-yellow-400 text-gray-900'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500 self-center">{formTestimonio.calificacion} de 5 estrellas</span>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formTestimonio.aprobado}
                  onChange={e => setFormTestimonio({...formTestimonio, aprobado: e.target.checked})}
                  className="w-4 h-4 accent-yellow-400"
                />
                <span className="text-sm font-medium text-gray-700">Mostrar en la web</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={cerrarModal} className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition text-sm">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-yellow-400 text-gray-900 py-2.5 rounded-xl font-bold hover:bg-yellow-300 transition text-sm">
                  {editando ? 'Guardar cambios' : 'Crear testimonio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BLOG */}
      {modalAbierto && tab === 'blog' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{editando ? 'Editar entrada' : 'Nueva entrada de blog'}</h3>
                <p className="text-sm text-gray-500 mt-1">Completa los campos para {editando ? 'actualizar' : 'publicar'} la entrada</p>
              </div>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg">
                <FaTimes size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitBlog} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titulo *</label>
                <input
                  value={formBlog.titulo}
                  onChange={e => setFormBlog({...formBlog, titulo: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
                <textarea
                  value={formBlog.contenido}
                  onChange={e => setFormBlog({...formBlog, contenido: e.target.value})}
                  required
                  rows={8}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
                <p className="text-xs text-gray-400 mt-1">{formBlog.contenido.length} caracteres</p>
              </div>
              <label className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formBlog.publicado}
                  onChange={e => setFormBlog({...formBlog, publicado: e.target.checked})}
                  className="w-4 h-4 accent-yellow-400"
                />
                <span className="text-sm font-medium text-gray-700">Publicar en la web</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={cerrarModal} className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition text-sm">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-yellow-400 text-gray-900 py-2.5 rounded-xl font-bold hover:bg-yellow-300 transition text-sm">
                  {editando ? 'Guardar cambios' : 'Publicar entrada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContenido