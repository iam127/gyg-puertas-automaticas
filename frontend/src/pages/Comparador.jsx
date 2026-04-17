import { useEffect, useState } from 'react'
import { getProductos } from '../services/productos'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function Comparador() {
  const [productos, setProductos] = useState([])
  const [seleccionados, setSeleccionados] = useState([])
  const [comparando, setComparando] = useState(false)

  useEffect(() => {
    getProductos().then(res => setProductos(res.data))
  }, [])

  const toggleSeleccionar = (producto) => {
    if (seleccionados.find(p => p.id === producto.id)) {
      setSeleccionados(seleccionados.filter(p => p.id !== producto.id))
    } else {
      if (seleccionados.length < 3) {
        setSeleccionados([...seleccionados, producto])
      }
    }
  }

  const isSeleccionado = (id) => seleccionados.some(p => p.id === id)

  if (comparando && seleccionados.length >= 2) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Helmet>
          <title>Comparador | GyG Puertas Automaticas</title>
        </Helmet>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Comparando productos</h1>
          <button
            onClick={() => setComparando(false)}
            className="border border-gray-300 px-4 py-2 rounded-xl hover:border-yellow-400 transition"
          >
            ← Volver
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-gray-50 rounded-tl-xl w-40">Característica</th>
                {seleccionados.map(p => (
                  <th key={p.id} className="p-4 bg-gray-50 text-center">
                    <div className="font-bold text-lg">{p.nombre}</div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{p.uso}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { campo: 'descripcion', label: 'Descripción' },
                { campo: 'uso', label: 'Tipo de uso' },
                { campo: 'material', label: 'Material' },
                { campo: 'especificaciones', label: 'Especificaciones' },
                { campo: 'categoria_nombre', label: 'Categoría' },
              ].map((fila, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-4 font-medium text-gray-700">{fila.label}</td>
                  {seleccionados.map(p => (
                    <td key={p.id} className="p-4 text-center text-gray-600 text-sm">
                      {p[fila.campo] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4 font-medium text-gray-700">Acción</td>
                {seleccionados.map(p => (
                  <td key={p.id} className="p-4 text-center">
                    <Link
                      to="/cotizar"
                      className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition text-sm"
                    >
                      Cotizar
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Comparador de Productos</h1>
      <p className="text-gray-500 mb-8">Selecciona hasta 3 productos para comparar sus características.</p>

      {seleccionados.length >= 2 && (
        <div className="bg-yellow-50 border border-yellow-400 rounded-xl p-4 mb-6 flex justify-between items-center">
          <p className="font-medium text-yellow-700">
            {seleccionados.length} productos seleccionados: {seleccionados.map(p => p.nombre).join(', ')}
          </p>
          <button
            onClick={() => setComparando(true)}
            className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-xl font-bold hover:bg-yellow-300 transition"
          >
            Comparar ahora
          </button>
        </div>
      )}

      {productos.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No hay productos disponibles aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productos.map(producto => (
            <div
              key={producto.id}
              className={`bg-white rounded-xl shadow overflow-hidden transition border-2 ${
                isSeleccionado(producto.id) ? 'border-yellow-400' : 'border-transparent'
              }`}
            >
              {producto.imagen_principal ? (
                <img src={producto.imagen_principal} alt={producto.nombre} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">🚪</div>
              )}
              <div className="p-4">
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{producto.uso}</span>
                <h3 className="font-bold text-lg mt-2 mb-1">{producto.nombre}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>
                <button
                  onClick={() => toggleSeleccionar(producto)}
                  disabled={!isSeleccionado(producto.id) && seleccionados.length >= 3}
                  className={`w-full py-2 rounded-xl font-bold transition ${
                    isSeleccionado(producto.id)
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                      : seleccionados.length >= 3
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border border-gray-300 hover:border-yellow-400'
                  }`}
                >
                  {isSeleccionado(producto.id) ? '✓ Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Comparador