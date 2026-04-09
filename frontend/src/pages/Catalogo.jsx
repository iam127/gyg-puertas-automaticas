import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductos, getCategorias, buscarProductos, getProductosPorUso } from '../services/productos'

function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroUso, setFiltroUso] = useState('')

  useEffect(() => {
    getProductos().then(res => setProductos(res.data))
    getCategorias().then(res => setCategorias(res.data))
  }, [])

  const handleBusqueda = (e) => {
    e.preventDefault()
    if (busqueda.trim()) {
      buscarProductos(busqueda).then(res => setProductos(res.data))
    } else {
      getProductos().then(res => setProductos(res.data))
    }
  }

  const handleFiltroUso = (uso) => {
    setFiltroUso(uso)
    if (uso) {
      getProductosPorUso(uso).then(res => setProductos(res.data))
    } else {
      getProductos().then(res => setProductos(res.data))
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Catálogo de Productos</h1>
      <p className="text-gray-500 mb-8">Encuentra la puerta automática ideal para tu necesidad</p>

      {/* BUSCADOR */}
      <form onSubmit={handleBusqueda} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Describe lo que necesitas..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-yellow-400"
        />
        <button type="submit" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition">
          Buscar
        </button>
      </form>

      {/* FILTROS */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {['', 'residencial', 'comercial', 'industrial'].map((uso) => (
          <button
            key={uso}
            onClick={() => handleFiltroUso(uso)}
            className={`px-4 py-2 rounded-full font-medium border transition ${
              filtroUso === uso
                ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                : 'border-gray-300 text-gray-600 hover:border-yellow-400'
            }`}
          >
            {uso === '' ? 'Todos' : uso.charAt(0).toUpperCase() + uso.slice(1)}
          </button>
        ))}
      </div>

      {/* PRODUCTOS */}
      {productos.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productos.map(producto => (
            <div key={producto.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              {producto.imagen_principal ? (
                <img src={producto.imagen_principal} alt={producto.nombre} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">🚪</div>
              )}
              <div className="p-4">
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  {producto.uso}
                </span>
                <h3 className="text-lg font-bold mt-2 mb-1">{producto.nombre}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{producto.descripcion}</p>
                <Link
                  to={`/catalogo/${producto.id}`}
                  className="text-yellow-500 font-bold hover:underline text-sm"
                >
                  Ver detalle →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Catalogo