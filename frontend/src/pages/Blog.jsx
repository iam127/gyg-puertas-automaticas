import { useEffect, useState } from 'react'
import { getBlog } from '../services/contenido'
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa'

function Blog() {
  const [posts, setPosts] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    getBlog().then(res => setPosts(res.data))
  }, [])

  if (seleccionado) {
    return (
      <div>
        <section className="bg-gray-900 text-white py-16 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">{seleccionado.titulo}</h1>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <FaCalendarAlt size={12} />
            <span>{new Date(seleccionado.creado_en).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </section>
        <section className="py-12 px-4 max-w-3xl mx-auto">
          <button
            onClick={() => setSeleccionado(null)}
            className="flex items-center gap-2 text-yellow-500 font-bold mb-8 hover:underline"
          >
            Volver al blog
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{seleccionado.contenido}</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Blog y <span className="text-yellow-400">Noticias</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Mantente informado sobre nuestros productos, consejos y novedades.
        </p>
      </section>

      <section className="py-12 px-4 max-w-7xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No hay publicaciones disponibles por el momento.</p>
            <p className="text-gray-400 text-sm mt-2">Vuelve pronto para ver nuestras novedades.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border border-gray-100 group">
                {post.imagen ? (
                  <img src={post.imagen} alt={post.titulo} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                ) : (
                  <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-xl">GyG</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                    <FaCalendarAlt size={11} />
                    <span>{new Date(post.creado_en).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{post.titulo}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">{post.contenido}</p>
                  <button
                    onClick={() => setSeleccionado(post)}
                    className="flex items-center gap-2 text-yellow-500 font-bold hover:gap-3 transition-all text-sm"
                  >
                    Leer mas <FaArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Blog