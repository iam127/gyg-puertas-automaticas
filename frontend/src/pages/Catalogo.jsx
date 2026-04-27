import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRobot, FaBalanceScale, FaQuestion, FaDoorOpen, FaSearch, FaTimes } from 'react-icons/fa'
import { getProductos, getCategorias, buscarProductos, getProductosPorUso, buscarInteligente } from '../services/productos'
import { Helmet } from 'react-helmet-async'

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

  const limpiarBusqueda = () => {
    setBusqueda('')
    setFiltroUso('')
    getProductos().then(res => setProductos(res.data))
  }

  return (
    <div>
      <Helmet>
          <title>Catalogo | GyG Puertas Automaticas</title>
      </Helmet>
      {/* HERO */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Nuestros productos</span>
          <h1 className="text-5xl font-bold mt-2 mb-4">
            Catalogo de <span className="text-yellow-400">Productos</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto mb-10">
            Encuentra la puerta automatica ideal para tu hogar o empresa.
          </p>

          <form onSubmit={handleBusqueda} className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder={modoIA ? "Describe lo que necesitas en lenguaje natural..." : "Buscar producto..."}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}className="w-full rounded-xl pl-10 pr-4 py-3 focus:outline-none border-2 border-gray-300 focus:border-yellow-400"
style={{ color: '#111827', backgroundColor: '#ffffff' }}className="w-full rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none border-2 border-gray-300 focus:border-yellow-400"
                />
              </div>
              <button
                type="submit"
                disabled={cargandoIA}
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50"
              >
                {cargandoIA ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setModoIA(!modoIA)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
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
        </div>
      </section>

      {/* FILTROS */}
      <section className="py-5 px-4 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex gap-3 flex-wrap items-center">
          <span className="text-sm font-bold text-gray-700">Filtrar:</span>
          {['', 'residencial', 'comercial', 'industrial'].map((uso) => (
            <button
              key={uso}
              onClick={() => handleFiltroUso(uso)}
              className={`px-4 py-2 rounded-full font-medium border text-sm transition ${
                filtroUso === uso
                  ? 'bg-yellow-400 text-gray-900 border-yellow-400 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-400'
              }`}
            >
              {uso === '' ? 'Todos' : uso.charAt(0).toUpperCase() + uso.slice(1)}
            </button>
          ))}
          {(busqueda || filtroUso) && (
            <button
              onClick={limpiarBusqueda}
              className="flex items-center gap-1 px-3 py-2 rounded-full text-sm text-red-500 border border-red-200 hover:bg-red-50 transition"
            >
              <FaTimes size={12} />
              Limpiar filtros
            </button>
          )}
          <div className="ml-auto flex gap-3">
            <Link
              to="/comparador"
              className="px-4 py-2 rounded-full font-medium border border-gray-200 bg-white text-gray-600 hover:border-yellow-400 transition text-sm flex items-center gap-2"
            >
              <FaBalanceScale size={14} />
              Comparar
            </Link>
            <Link
              to="/guia"
              className="px-4 py-2 rounded-full font-medium border border-gray-200 bg-white text-gray-600 hover:border-yellow-400 transition text-sm flex items-center gap-2"
            >
              <FaQuestion size={14} />
              Que puerta necesito?
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {productos.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaDoorOpen size={36} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 mb-6">Intenta con otros terminos de busqueda o filtros</p>
              <button
                onClick={limpiarBusqueda}
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <p className="text-gray-500 text-sm">
                  <span className="font-bold text-gray-900">{productos.length}</span> producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}
                  {filtroUso && <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium capitalize">{filtroUso}</span>}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productos.map(producto => (
                  <div key={producto.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group border border-gray-100">
                    <div className="overflow-hidden h-56 relative">
                      {producto.imagen_principal ? (
                        <img
                          src={producto.imagen_principal}
                          alt={producto.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <FaDoorOpen size={48} className="text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full capitalize shadow-sm">
                          {producto.uso}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 text-gray-900">{producto.nombre}</h3>
                      <p className="text-gray-500 text-sm mb-5 line-clamp-2 leading-relaxed">{producto.descripcion}</p>
                      <div className="flex gap-2">
                        <Link
                          to={`/catalogo/${producto.id}`}
                          className="flex-1 bg-yellow-400 text-gray-900 py-2.5 rounded-xl font-bold hover:bg-yellow-300 transition text-center text-sm"
                        >
                          Ver detalle
                        </Link>
                        <Link
                          to={`/cotizar?producto=${producto.id}`}
                          className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl font-bold hover:bg-gray-800 transition text-center text-sm"
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