import { useEffect, useState } from 'react'
import { getBlog } from '../services/contenido'

function Blog() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getBlog().then(res => setPosts(res.data))
  }, [])

  return (
    <div>
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Blog y <span className="text-yellow-400">Noticias</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Mantente informado sobre nuestros productos, consejos y novedades.
        </p>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        {posts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { titulo: '¿Cómo elegir la puerta automática ideal?', desc: 'Te explicamos los factores clave para elegir la puerta perfecta para tu hogar o empresa.' },
              { titulo: 'Mantenimiento preventivo: ¿cada cuánto tiempo?', desc: 'El mantenimiento regular es clave para prolongar la vida útil de tu puerta automática.' },
              { titulo: 'Beneficios de las puertas automáticas en empresas', desc: 'Las puertas automáticas mejoran la seguridad y eficiencia en establecimientos comerciales.' },
            ].map((post, i) => (
              <div key={i} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-400 text-4xl">📰</div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{post.titulo}</h3>
                  <p className="text-gray-600 text-sm">{post.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                {post.imagen ? (
                  <img src={post.imagen} alt={post.titulo} className="w-full h-48 object-cover" />
                ) : (
                  <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-400 text-4xl">📰</div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{post.titulo}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{post.contenido}</p>
                  <p className="text-gray-400 text-xs mt-2">{new Date(post.creado_en).toLocaleDateString('es-PE')}</p>
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