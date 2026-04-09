import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductosDestacados } from '../services/productos'
import { getTestimonios } from '../services/contenido'

function Inicio() {
  const [productosDestacados, setProductosDestacados] = useState([])
  const [testimonios, setTestimonios] = useState([])

  useEffect(() => {
    getProductosDestacados().then(res => setProductosDestacados(res.data))
    getTestimonios().then(res => setTestimonios(res.data))
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="bg-gray-900 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          GyG <span className="text-yellow-400">Puertas Automáticas</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Soluciones en puertas automáticas para tu hogar, empresa e industria. Calidad y seguridad garantizada.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/catalogo" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition">
            Ver Catálogo
          </Link>
          <Link to="/cotizar" className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-gray-900 transition">
            Solicitar Cotización
          </Link>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Nuestros Servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { titulo: 'Instalación', desc: 'Instalamos puertas automáticas con garantía y profesionalismo.', icono: '🚪' },
            { titulo: 'Mantenimiento', desc: 'Servicio de mantenimiento preventivo y correctivo.', icono: '🔧' },
            { titulo: 'Garantía', desc: 'Todos nuestros productos cuentan con garantía incluida.', icono: '🛡️' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-6 text-center shadow hover:shadow-lg transition">
              <div className="text-5xl mb-4">{s.icono}</div>
              <h3 className="text-xl font-bold mb-2">{s.titulo}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Productos Destacados</h2>
          {productosDestacados.length === 0 ? (
            <p className="text-center text-gray-500">No hay productos destacados aún.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {productosDestacados.map(producto => (
                <div key={producto.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                  {producto.imagen_principal && (
                    <img src={producto.imagen_principal} alt={producto.nombre} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">{producto.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-3">{producto.descripcion}</p>
                    <Link to={`/catalogo/${producto.id}`} className="text-yellow-500 font-bold hover:underline">
                      Ver más →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/catalogo" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition">
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Lo que dicen nuestros clientes</h2>
        {testimonios.length === 0 ? (
          <p className="text-center text-gray-500">No hay testimonios aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map(t => (
              <div key={t.id} className="bg-gray-100 rounded-xl p-6 shadow">
                <p className="text-yellow-400 text-xl mb-2">{'⭐'.repeat(t.calificacion)}</p>
                <p className="text-gray-700 mb-3">"{t.comentario}"</p>
                <p className="font-bold text-gray-900">{t.nombre_cliente}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-yellow-400 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Listo para automatizar tu puerta?</h2>
        <p className="text-gray-800 mb-6">Solicita una cotización gratuita y nuestro equipo te contactará.</p>
        <Link to="/cotizar" className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
          Solicitar Cotización
        </Link>
      </section>
    </div>
  )
}

export default Inicio