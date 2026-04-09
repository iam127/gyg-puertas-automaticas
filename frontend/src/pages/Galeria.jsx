import { useEffect, useState } from 'react'
import { getGaleria } from '../services/contenido'

function Galeria() {
  const [galeria, setGaleria] = useState([])
  const [filtro, setFiltro] = useState('')
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null)

  useEffect(() => {
    getGaleria().then(res => setGaleria(res.data))
  }, [])

  const galeriaFiltrada = filtro
    ? galeria.filter(g => g.tipo_puerta.toLowerCase().includes(filtro.toLowerCase()))
    : galeria

  return (
    <div>
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Galería de <span className="text-yellow-400">Trabajos</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Conoce algunos de nuestros trabajos realizados en Lima y alrededores.
        </p>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex gap-3 mb-8 flex-wrap justify-center">
          {['', 'Levadiza', 'Corrediza', 'Batiente', 'Seccional'].map(tipo => (
            <button
              key={tipo}
              onClick={() => setFiltro(tipo)}
              className={`px-4 py-2 rounded-full font-medium border transition ${
                filtro === tipo
                  ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                  : 'border-gray-300 text-gray-600 hover:border-yellow-400'
              }`}
            >
              {tipo === '' ? 'Todos' : tipo}
            </button>
          ))}
        </div>

        {galeriaFiltrada.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 rounded-xl h-48 flex items-center justify-center text-gray-400">
                <span className="text-4xl">🚪</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galeriaFiltrada.map(item => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => setImagenSeleccionada(item)}
              >
                <img src={item.imagen} alt={item.titulo} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold">{item.titulo}</h3>
                  {item.tipo_puerta && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      {item.tipo_puerta}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {imagenSeleccionada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setImagenSeleccionada(null)}
        >
          <div className="bg-white rounded-xl overflow-hidden max-w-2xl w-full">
            <img src={imagenSeleccionada.imagen} alt={imagenSeleccionada.titulo} className="w-full" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{imagenSeleccionada.titulo}</h3>
              <p className="text-gray-600">{imagenSeleccionada.descripcion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Galeria