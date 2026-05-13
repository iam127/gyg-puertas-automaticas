import { useEffect, useState } from 'react'
import { getBlog } from '../services/contenido'
import { FaCalendarAlt, FaArrowLeft, FaClock } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

function Blog() {
  const [posts, setPosts] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    getBlog().then(res => setPosts(res.data))
  }, [])

  const tiempoLectura = (contenido) => {
    const palabras = contenido.split(' ').length
    return Math.ceil(palabras / 200)
  }

  if (seleccionado) {
    return (
      <div>
        <Helmet>
          <title>{seleccionado.titulo} | GyG Puertas Automáticas</title>
        </Helmet>
        <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Artículo</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-5 leading-tight">{seleccionado.titulo}</h1>
            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <FaCalendarAlt size={12} />
                <span>{new Date(seleccionado.creado_en).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock size={12} />
                <span>{tiempoLectura(seleccionado.contenido)} min de lectura</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 max-w-3xl mx-auto">
          <button
            onClick={() => setSeleccionado(null)}
            className="flex items-center gap-2 text-gray-600 font-medium mb-8 hover:text-yellow-500 transition bg-white border border-gray-200 px-4 py-2 rounded-full"
          >
            <FaArrowLeft size={14} />
            Volver al blog
          </button>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">{seleccionado.contenido}</p>
          </div>
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
            <p className="text-gray-700 font-medium mb-3">¿Necesitas una puerta automática?</p>
            <a href="/cotizar" className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition inline-block">
              Solicitar Cotización
            </a>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <Helmet>
        <title>Blog | GyG Puertas Automáticas</title>
      </Helmet>
      <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Noticias y consejos</span>
          <h1 className="text-5xl font-bold mt-2 mb-4">
            Blog y <span className="text-yellow-400">Noticias</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Mantente informado sobre nuestros productos, consejos y novedades.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCalendarAlt size={28} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No hay publicaciones disponibles</h3>
              <p className="text-gray-500">Vuelve pronto para ver nuestras novedades.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-8">
                <span className="font-bold text-gray-900">{posts.length}</span> artículo{posts.length !== 1 ? 's' : ''} publicado{posts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100 group ${index === 0 ? 'md:col-span-3 md:grid md:grid-cols-2' : ''}`}
                  >
                    <div className={`relative overflow-hidden ${index === 0 ? 'h-64 md:h-full' : 'h-52'}`}>
                      {post.imagen ? (
                        <img
                          src={post.imagen}
                          alt={post.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center gap-2">
                          <span className="text-yellow-400 font-bold text-3xl">GyG</span>
                          <span className="text-gray-500 text-sm">Puertas Automáticas</span>
                        </div>
                      )}
                      {index === 0 && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                            Destacado
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`p-6 flex flex-col justify-between ${index === 0 ? 'md:p-10' : ''}`}>
                      <div>
                        <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt size={11} />
                            <span>{new Date(post.creado_en).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaClock size={11} />
                            <span>{tiempoLectura(post.contenido)} min</span>
                          </div>
                        </div>
                        <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                          {post.titulo}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.contenido}</p>
                      </div>
                      <button
                        onClick={() => setSeleccionado(post)}
                        className={`mt-5 bg-yellow-400 text-gray-900 rounded-xl font-bold hover:bg-yellow-300 transition text-sm ${index === 0 ? 'py-3 px-8 w-fit' : 'py-2.5 w-full'}`}
                      >
                        Leer artículo completo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Blog