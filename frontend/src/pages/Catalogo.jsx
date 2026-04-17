import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRobot, FaBalanceScale, FaQuestion, FaDoorOpen, FaSearch } from 'react-icons/fa'
import { getProductos, getCategorias, buscarProductos, getProductosPorUso, buscarInteligente } from '../services/productos'

function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroUso, setFiltroUso] = useState('')
  const [modoIA, setModoIA] = useState(false)
  const [cargandoIA, setCargandoIA] = useState(false)

  useEffect(() => {
    getProductos().then(res => setProductos(res.data))
    getCategorias().then(res => setCategorias(res.data))
  }, [])

  const handleBusqueda = (e) => {
    e.preventDefault()
    if (!busqueda.trim()) {
      getProductos().then(res => setProductos(res.data))
      return
    }
    if (modoIA) {
      setCargandoIA(true)
      buscarInteligente(busqueda)
        .then(res => setProductos(res.data.productos))
        .finally(() => setCargandoIA(false))
    } else {
      buscarProductos(busqueda).then(res => setProductos(res.data))
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
    <div>
      {/* HERO */}
      <section className="bg-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Catalogo de <span className="text-yellow-400">Productos</span>
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          Encuentra la puerta automatica ideal para tu hogar o empresa.
        </p>

        {/* BUSCADOR EN HERO */}
        <form onSubmit={handleBusqueda} className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={modoIA ? "Describe lo que necesitas en lenguaje natural..." : "Buscar producto..."}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none border-2 border-gray-300 focus:border-yellow-400"
              />
            </div>
            <button
              type="submit"
              disabled={cargandoIA}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50"
            >
              {cargandoIA ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => setModoIA(!modoIA)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition ${
                modoIA ? 'bg-yellow-400 text-gray-900' : 'border border-gray-500 text-gray-300 hover:border-yellow-400'
              }`}
            >
              <FaRobot size={14} />
              {modoIA ? 'Busqueda con IA activada' : 'Activar busqueda con IA'}
            </button>
            {modoIA && (
              <span className="text-xs text-gray-400">Describe en lenguaje natural lo que necesitas</span>
            )}
          </div>
        </form>
      </section>

      {/* FILTROS */}
      <section className="py-6 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex gap-3 flex-wrap items-center">
          <span className="text-sm font-medium text-gray-600">Filtrar por uso:</span>
          {['', 'residencial', 'comercial', 'industrial'].map((uso) => (
            <button
              key={uso}
              onClick={() => handleFiltroUso(uso)}
              className={`px-4 py-2 rounded-full font-medium border text-sm transition ${
                filtroUso === uso
                  ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-yellow-400'
              }`}
            >
              {uso === '' ? 'Todos' : uso.charAt(0).toUpperCase() + uso.slice(1)}
            </button>
          ))}
          <div className="ml-auto flex gap-3">
            <Link
              to="/comparador"
              className="px-4 py-2 rounded-full font-medium border border-gray-300 bg-white text-gray-600 hover:border-yellow-400 transition text-sm flex items-center gap-2"
            >
              <FaBalanceScale size={14} />
              Comparar
            </Link>
            <Link
              to="/guia"
              className="px-4 py-2 rounded-full font-medium border border-gray-300 bg-white text-gray-600 hover:border-yellow-400 transition text-sm flex items-center gap-2"
            >
              <FaQuestion size={14} />
              Que puerta necesito?
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {productos.length === 0 ? (
            <div className="text-center py-20">
              <FaDoorOpen size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No se encontraron productos.</p>
              <button
                onClick={() => { setBusqueda(''); setFiltroUso(''); getProductos().then(res => setProductos(res.data)) }}
                className="mt-4 bg-yellow-400 text-gray-900 px-6 py-2 rounded-xl font-bold hover:bg-yellow-300 transition"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-6">{productos.length} producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {productos.map(producto => (
                  <div key={producto.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group border border-gray-100">
                    <div className="overflow-hidden h-52">
                      {producto.imagen_principal ? (
                        <img
                          src={producto.imagen_principal}
                          alt={producto.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                          <FaDoorOpen size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium capitalize">
                        {producto.uso}
                      </span>
                      <h3 className="text-lg font-bold mt-3 mb-1 text-gray-900">{producto.nombre}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>
                      <div className="flex gap-2">
                        <Link
                          to={`/catalogo/${producto.id}`}
                          className="flex-1 bg-yellow-400 text-gray-900 py-2 rounded-xl font-bold hover:bg-yellow-300 transition text-center text-sm"
                        >
                          Ver detalle
                        </Link>
                        <Link
                          to={`/cotizar?producto=${producto.id}`}
                          className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-xl font-bold hover:bg-gray-200 transition text-center text-sm"
                        >
                          Cotizar
                        </Link>
                      </div>
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

export default Catalogo