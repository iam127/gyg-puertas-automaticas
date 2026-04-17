import { useEffect, useState } from 'react'
import { getGaleria } from '../services/contenido'
import { FaTimes, FaExpand, FaDoorOpen, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

function Galeria() {
  const [galeria, setGaleria] = useState([])
  const [filtro, setFiltro] = useState('')
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null)
  const [indexSeleccionado, setIndexSeleccionado] = useState(null)

  useEffect(() => {
    getGaleria().then(res => setGaleria(res.data))
  }, [])

  const galeriaFiltrada = filtro
    ? galeria.filter(g => g.tipo_puerta.toLowerCase().includes(filtro.toLowerCase()))
    : galeria

  const abrirImagen = (item, index) => {
    setImagenSeleccionada(item)
    setIndexSeleccionado(index)
  }

  const anterior = () => {
    const nuevoIndex = (indexSeleccionado - 1 + galeriaFiltrada.length) % galeriaFiltrada.length
    setImagenSeleccionada(galeriaFiltrada[nuevoIndex])
    setIndexSeleccionado(nuevoIndex)
  }

  const siguiente = () => {
    const nuevoIndex = (indexSeleccionado + 1) % galeriaFiltrada.length
    setImagenSeleccionada(galeriaFiltrada[nuevoIndex])
    setIndexSeleccionado(nuevoIndex)
  }

  const tipos = ['', 'Levadiza', 'Corrediza', 'Batiente', 'Seccional']

  return (
    <div>
      <Helmet>
        <title>Galeria | GyG Puertas Automaticas</title>
      </Helmet>
      {/* HERO */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Nuestros trabajos</span>
          <h1 className="text-5xl font-bold mt-2 mb-4">
            Galeria de <span className="text-yellow-400">Trabajos</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Conoce algunos de nuestros trabajos realizados en Lima y alrededores.
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="py-6 px-4 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex gap-3 flex-wrap items-center justify-center">
          <span className="text-sm font-bold text-gray-700">Filtrar por tipo:</span>
          {tipos.map(tipo => (
            <button
              key={tipo}
              onClick={() => setFiltro(tipo)}
              className={`px-4 py-2 rounded-full font-medium border text-sm transition ${
                filtro === tipo
                  ? 'bg-yellow-400 text-gray-900 border-yellow-400 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-400'
              }`}
            >
              {tipo === '' ? 'Todos' : tipo}
            </button>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {galeriaFiltrada.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaDoorOpen size={36} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No hay imagenes disponibles</h3>
              <p className="text-gray-500">Vuelve pronto para ver nuestros trabajos.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-8">
                <span className="font-bold text-gray-900">{galeriaFiltrada.length}</span> trabajo{galeriaFiltrada.length !== 1 ? 's' : ''} encontrado{galeriaFiltrada.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galeriaFiltrada.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group border border-gray-100"
                    onClick={() => abrirImagen(item, index)}
                  >
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={item.imagen}
                        alt={item.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                        <FaExpand size={28} className="text-white opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      {item.tipo_puerta && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            {item.tipo_puerta}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-1">{item.titulo}</h3>
                      {item.descripcion && (
                        <p className="text-gray-500 text-sm line-clamp-2">{item.descripcion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* MODAL */}
      {imagenSeleccionada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setImagenSeleccionada(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={imagenSeleccionada.imagen}
                alt={imagenSeleccionada.titulo}
                className="w-full max-h-96 object-cover"
              />
              <button
                onClick={() => setImagenSeleccionada(null)}
                className="absolute top-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition"
              >
                <FaTimes size={18} />
              </button>
              {galeriaFiltrada.length > 1 && (
                <>
                  <button
                    onClick={anterior}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition"
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  <button
                    onClick={siguiente}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition"
                  >
                    <FaChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{imagenSeleccionada.titulo}</h3>
                  {imagenSeleccionada.descripcion && (
                    <p className="text-gray-500 text-sm">{imagenSeleccionada.descripcion}</p>
                  )}
                </div>
                {imagenSeleccionada.tipo_puerta && (
                  <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full ml-4">
                    {imagenSeleccionada.tipo_puerta}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-3">
                {indexSeleccionado + 1} de {galeriaFiltrada.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Galeria