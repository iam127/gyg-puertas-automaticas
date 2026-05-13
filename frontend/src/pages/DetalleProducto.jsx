import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProducto } from '../services/productos'
import { Helmet } from 'react-helmet-async'

function DetalleProducto() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [imagenActual, setImagenActual] = useState(0)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getProducto(id)
      .then(res => setProducto(res.data))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) return (
    <div className="flex items-center justify-center py-40 text-gray-400">
      <p>Cargando producto...</p>
    </div>
  )

  if (!producto) return (
    <div className="flex items-center justify-center py-40 text-gray-400">
      <p>Producto no encontrado.</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>{producto.nombre} | GyG Puertas Automáticas</title>
      </Helmet>
      <div className="mb-6">
        <Link to="/catalogo" className="text-yellow-500 hover:underline text-sm">
          ← Volver al catálogo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGENES */}
        <div>
          {producto.imagenes && producto.imagenes.length > 0 ? (
            <div>
              <img
                src={producto.imagenes[imagenActual]?.imagen}
                alt={producto.nombre}
                className="w-full h-80 object-cover rounded-xl mb-4"
              />
              <div className="flex gap-2 flex-wrap">
                {producto.imagenes.map((img, i) => (
                  <img
                    key={i}
                    src={img.imagen}
                    alt={producto.nombre}
                    onClick={() => setImagenActual(i)}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                      imagenActual === i ? 'border-yellow-400' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-6xl">
              🚪
            </div>
          )}
        </div>

        {/* INFORMACION */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
              {producto.uso}
            </span>
            {producto.categoria && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                {producto.categoria.nombre}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-3">{producto.nombre}</h1>
          <p className="text-gray-600 mb-6">{producto.descripcion}</p>

          {producto.material && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Material</p>
              <p className="text-gray-600">{producto.material}</p>
            </div>
          )}

          {producto.especificaciones && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Especificaciones técnicas</p>
              <div className="bg-gray-50 rounded-xl p-4 text-gray-600 text-sm whitespace-pre-line">
                {producto.especificaciones}
              </div>
            </div>
          )}

          <div className="flex gap-4 flex-wrap">
            <Link
              to="/cotizar"
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
            >
              Solicitar cotización
            </Link>
            <Link
              to="/catalogo"
              className="border border-gray-300 px-6 py-3 rounded-xl font-bold hover:border-yellow-400 transition"
            >
              Ver más productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleProducto