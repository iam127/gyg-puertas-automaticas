import { useEffect, useState } from 'react'
import { getProductos } from '../services/productos'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaCheck, FaTimes, FaDoorOpen, FaBalanceScale, FaArrowLeft } from 'react-icons/fa'

const getUrl = (url) => {
  if (!url) return null
  return url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`
}

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

  const filas = [
    { campo: 'uso', label: 'Tipo de uso' },
    { campo: 'material', label: 'Material' },
    { campo: 'categoria_nombre', label: 'Categoría' },
    { campo: 'descripcion', label: 'Descripción' },
    { campo: 'especificaciones', label: 'Especificaciones técnicas' },
  ]

  if (comparando && seleccionados.length >= 2) {
    return (
      <div>
        <Helmet>
          <title>Comparador | GyG Puertas Automáticas</title>
        </Helmet>

        {/* HERO */}
        <section className="bg-gray-900 text-white py-16 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10">
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Resultado</span>
            <h1 className="text-4xl font-bold mt-2 mb-2">
              Comparando <span className="text-yellow-400">{seleccionados.length} productos</span>
            </h1>
            <p className="text-gray-400 text-sm">Analiza las diferencias y elige el que mejor se adapta a ti</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <button
            onClick={() => setComparando(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-medium transition"
          >
            <FaArrowLeft size={14} /> Volver a selección
          </button>

          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-5 bg-gray-900 text-gray-400 text-xs uppercase tracking-wider w-44 rounded-tl-2xl">Característica</th>
                  {seleccionados.map((p, i) => (
                    <th key={p.id} className={`p-5 bg-gray-900 text-center ${i === seleccionados.length - 1 ? 'rounded-tr-2xl' : ''}`}>
                      <div style={{ height: '120px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', backgroundColor: '#1f2937' }}>
                        {p.imagen_principal ? (
                          <img
                            src={getUrl(p.imagen_principal)}
                            alt={p.nombre}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', backgroundColor: '#f9fafb' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaDoorOpen size={36} color="#4b5563" />
                          </div>
                        )}
                      </div>
                      <div className="text-white font-bold text-sm leading-tight mb-2">{p.nombre}</div>
                      <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full capitalize">{p.uso}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((fila, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-5 font-bold text-gray-700 text-sm border-r border-gray-100">{fila.label}</td>
                    {seleccionados.map(p => (
                      <td key={p.id} className="p-5 text-center text-gray-600 text-sm border-r border-gray-100 last:border-r-0">
                        {p[fila.campo] ? (
                          <span className={fila.campo === 'uso' ? 'bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-bold capitalize' : ''}>
                            {p[fila.campo]}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* FILA DESTACADO */}
                <tr className="bg-white">
                  <td className="p-5 font-bold text-gray-700 text-sm border-r border-gray-100">Destacado</td>
                  {seleccionados.map(p => (
                    <td key={p.id} className="p-5 text-center border-r border-gray-100 last:border-r-0">
                      {p.destacado ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
                          <FaCheck size={10} /> Sí
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-xs font-bold">
                          <FaTimes size={10} /> No
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* FILA ACCION */}
                <tr className="bg-gray-900">
                  <td className="p-5 text-gray-400 font-bold text-sm rounded-bl-2xl">Acción</td>
                  {seleccionados.map((p, i) => (
                    <td key={p.id} className={`p-5 text-center ${i === seleccionados.length - 1 ? 'rounded-br-2xl' : ''}`}>
                      <Link
                        to={`/cotizar?producto=${p.id}`}
                        className="inline-block bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-300 transition text-sm"
                      >
                        Cotizar este
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Helmet>
        <title>Comparador | GyG Puertas Automáticas</title>
      </Helmet>

      {/* HERO */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Herramienta</span>
          <h1 className="text-5xl font-bold mt-2 mb-4">
            Comparador de <span className="text-yellow-400">Productos</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Selecciona hasta 3 productos para comparar sus características y encontrar la puerta ideal.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* BARRA DE SELECCIONADOS */}
        {seleccionados.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-5 mb-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                <FaBalanceScale size={16} className="text-gray-900" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {seleccionados.length} de 3 productos seleccionados
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {seleccionados.map(p => p.nombre).join(' · ')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSeleccionados([])}
                className="border border-gray-600 text-gray-400 px-4 py-2 rounded-xl text-sm hover:border-gray-400 transition"
              >
                Limpiar
              </button>
              {seleccionados.length >= 2 && (
                <button
                  onClick={() => setComparando(true)}
                  className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-xl font-bold hover:bg-yellow-300 transition text-sm"
                >
                  Comparar ahora
                </button>
              )}
            </div>
          </div>
        )}

        {/* INSTRUCCION */}
        {seleccionados.length === 0 && (
          <div className="text-center py-6 mb-6">
            <p className="text-gray-500 text-sm">Haz clic en <strong>Seleccionar</strong> en los productos que quieres comparar</p>
          </div>
        )}

        {productos.length === 0 ? (
          <div className="text-center py-24">
            <FaDoorOpen size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay productos disponibles aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map(producto => {
              const selec = isSeleccionado(producto.id)
              const bloqueado = !selec && seleccionados.length >= 3
              return (
                <div
                  key={producto.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden transition border-2 ${
                    selec ? 'border-yellow-400 shadow-lg' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div style={{ position: 'relative', height: '200px', backgroundColor: '#f9fafb' }}>
                    {producto.imagen_principal ? (
                      <img
                        src={getUrl(producto.imagen_principal)}
                        alt={producto.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', backgroundColor: '#f9fafb' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaDoorOpen size={48} color="#d1d5db" />
                      </div>
                    )}
                    {selec && (
                      <div style={{ position: 'absolute', top: 12, right: 12, background: '#facc15', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaCheck size={14} color="#111827" />
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full capitalize shadow-sm">
                        {producto.uso}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">{producto.nombre}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>
                    {producto.material && (
                      <p className="text-xs text-gray-400 mb-4">Material: {producto.material}</p>
                    )}
                    <button
                      onClick={() => toggleSeleccionar(producto)}
                      disabled={bloqueado}
                      className={`w-full py-2.5 rounded-xl font-bold transition text-sm flex items-center justify-center gap-2 ${
                        selec
                          ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                          : bloqueado
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-2 border-gray-200 text-gray-700 hover:border-yellow-400 hover:text-gray-900'
                      }`}
                    >
                      {selec ? (
                        <><FaCheck size={12} /> Seleccionado</>
                      ) : bloqueado ? (
                        'Máximo 3 productos'
                      ) : (
                        'Seleccionar'
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Comparador