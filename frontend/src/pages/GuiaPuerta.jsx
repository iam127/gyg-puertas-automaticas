import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getProductosPorUso } from '../services/productos'
import { FaDoorOpen, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'

const getUrl = (url) => {
  if (!url) return null
  return url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`
}

const preguntas = [
  {
    id: 1,
    pregunta: '¿Para qué tipo de lugar necesitas la puerta?',
    opciones: [
      { valor: 'residencial', label: '🏠 Casa / Vivienda', desc: 'Cochera, entrada principal o jardín' },
      { valor: 'comercial', label: '🏢 Empresa / Negocio', desc: 'Tienda, oficina o local comercial' },
      { valor: 'industrial', label: '🏭 Industria / Almacén', desc: 'Planta, almacén o zona industrial' },
    ]
  },
  {
    id: 2,
    pregunta: '¿Qué tan grande es el acceso?',
    opciones: [
      { valor: 'pequeno', label: '📏 Pequeño', desc: 'Hasta 2.5 metros de ancho' },
      { valor: 'mediano', label: '📐 Mediano', desc: 'Entre 2.5 y 4 metros de ancho' },
      { valor: 'grande', label: '📊 Grande', desc: 'Más de 4 metros de ancho' },
    ]
  },
  {
    id: 3,
    pregunta: '¿Tienes espacio lateral disponible?',
    opciones: [
      { valor: 'si', label: '✅ Sí tengo espacio lateral', desc: 'Puedo abrir hacia los lados' },
      { valor: 'no', label: '❌ No tengo espacio lateral', desc: 'El espacio es limitado' },
    ]
  },
  {
    id: 4,
    pregunta: '¿Qué material prefieres?',
    opciones: [
      { valor: 'metal', label: '⚙️ Metal / Acero', desc: 'Máxima durabilidad y seguridad' },
      { valor: 'aluminio', label: '✨ Aluminio', desc: 'Ligero y moderno' },
      { valor: 'vidrio', label: '🪟 Vidrio templado', desc: 'Elegante y luminoso' },
      { valor: 'indiferente', label: '🤷 Me es indiferente', desc: 'Lo que mejor se adapte' },
    ]
  },
  {
    id: 5,
    pregunta: '¿Necesitas automatización con control remoto?',
    opciones: [
      { valor: 'si', label: '📡 Sí, con control remoto', desc: 'Apertura automática sin bajarse del auto' },
      { valor: 'no', label: '🚪 No, manual está bien', desc: 'Operación manual es suficiente' },
    ]
  },
]

const recomendaciones = {
  residencial: {
    pequeno: { tipo: 'Puerta Corrediza', uso: 'residencial', palabraClave: 'corrediza', desc: 'Ideal para cocheras pequeñas de viviendas. Motor silencioso y apertura suave.' },
    mediano: { tipo: 'Portón Levadizo', uso: 'residencial', palabraClave: 'levadizo', desc: 'Perfecta para accesos medianos en viviendas. No invade la vereda al abrir.' },
    grande: { tipo: 'Portón Corredizo', uso: 'residencial', palabraClave: 'corredizo', desc: 'Ideal para accesos grandes en viviendas con espacio lateral disponible.' },
  },
  comercial: {
    pequeno: { tipo: 'Puerta Batiente', uso: 'comercial', palabraClave: 'batiente', desc: 'Ideal para locales comerciales con accesos pequeños y tráfico peatonal.' },
    mediano: { tipo: 'Puerta Corrediza', uso: 'comercial', palabraClave: 'corrediza', desc: 'Perfecta para empresas con accesos medianos y tráfico frecuente.' },
    grande: { tipo: 'Puerta Enrollable', uso: 'comercial', palabraClave: 'enrollable', desc: 'Diseñada para grandes accesos en establecimientos comerciales.' },
  },
  industrial: {
    pequeno: { tipo: 'Puerta Enrollable', uso: 'industrial', palabraClave: 'enrollable', desc: 'Robusta y duradera para uso industrial intensivo.' },
    mediano: { tipo: 'Portón Levadizo Seccional', uso: 'industrial', palabraClave: 'seccional', desc: 'Perfecta para almacenes y plantas industriales de tamaño mediano.' },
    grande: { tipo: 'Barrera Vehicular', uso: 'comercial', palabraClave: 'barrera', desc: 'Ideal para grandes accesos industriales con alto tráfico vehicular.' },
  },
}

function GuiaPuerta() {
  const [paso, setPaso] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [resultado, setResultado] = useState(null)
  const [productosRecomendados, setProductosRecomendados] = useState([])
  const [cargando, setCargando] = useState(false)

  const handleRespuesta = (valor) => {
    const nuevasRespuestas = { ...respuestas, [preguntas[paso].id]: valor }
    setRespuestas(nuevasRespuestas)

    if (paso < preguntas.length - 1) {
      setPaso(paso + 1)
    } else {
      const uso = nuevasRespuestas[1]
      const tamano = nuevasRespuestas[2]
      const recomendacion = recomendaciones[uso]?.[tamano] || {
        tipo: 'Consulta personalizada',
        uso: uso || 'residencial',
        palabraClave: '',
        desc: 'Según tus necesidades específicas, te recomendamos contactarnos para una asesoría personalizada gratuita.'
      }
      setResultado(recomendacion)

      // Buscar productos reales en la BD
      setCargando(true)
      getProductosPorUso(recomendacion.uso)
        .then(res => {
          const todos = res.data
          // Filtrar por palabra clave si existe
          if (recomendacion.palabraClave) {
            const filtrados = todos.filter(p =>
              p.nombre.toLowerCase().includes(recomendacion.palabraClave.toLowerCase()) ||
              p.descripcion?.toLowerCase().includes(recomendacion.palabraClave.toLowerCase())
            )
            setProductosRecomendados(filtrados.length > 0 ? filtrados.slice(0, 3) : todos.slice(0, 3))
          } else {
            setProductosRecomendados(todos.slice(0, 3))
          }
        })
        .finally(() => setCargando(false))
    }
  }

  const reiniciar = () => {
    setPaso(0)
    setRespuestas({})
    setResultado(null)
    setProductosRecomendados([])
  }

  if (resultado) {
    return (
      <div>
        <Helmet>
          <title>¿Qué puerta necesito? | GyG Puertas Automáticas</title>
        </Helmet>

        <section className="bg-gray-900 text-white py-16 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle size={28} className="text-gray-900" />
            </div>
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Resultado del quiz</span>
            <h1 className="text-4xl font-bold mt-2 mb-2">
              Te recomendamos una <span className="text-yellow-400">{resultado.tipo}</span>
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto">{resultado.desc}</p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12">

          {/* PRODUCTOS RECOMENDADOS */}
          {cargando ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : productosRecomendados.length > 0 ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Productos disponibles para ti</h2>
              <p className="text-gray-500 mb-6">Estos son los productos de nuestro catálogo que mejor se adaptan a tus necesidades</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {productosRecomendados.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
                    <div style={{ height: '180px', backgroundColor: '#f9fafb' }}>
                      {p.imagen_principal ? (
                        <img
                          src={getUrl(p.imagen_principal)}
                          alt={p.nombre}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaDoorOpen size={40} color="#d1d5db" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full capitalize">{p.uso}</span>
                      <h3 className="font-bold text-gray-900 mt-2 mb-1">{p.nombre}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{p.descripcion}</p>
                      <div className="flex gap-2">
                        <Link
                          to={`/catalogo/${p.id}`}
                          className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
                        >
                          Ver detalle
                        </Link>
                        <Link
                          to={`/cotizar?producto=${p.id}`}
                          className="flex-1 text-center bg-yellow-400 text-gray-900 py-2 rounded-xl font-bold text-sm hover:bg-yellow-300 transition"
                        >
                          Cotizar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 mb-12">
              <FaDoorOpen size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No encontramos productos exactos pero podemos asesorarte</p>
            </div>
          )}

          {/* ACCIONES */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to={`/catalogo`}
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition"
            >
              Ver catálogo completo
            </Link>
            <Link
              to="/cotizar"
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
            >
              Solicitar cotización
            </Link>
            <button
              onClick={reiniciar}
              className="border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:border-yellow-400 transition"
            >
              Volver a empezar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const preguntaActual = preguntas[paso]

  return (
    <div>
      <Helmet>
        <title>¿Qué puerta necesito? | GyG Puertas Automáticas</title>
      </Helmet>

      <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Asesor virtual</span>
          <h1 className="text-5xl font-bold mt-2 mb-4">
            ¿Qué puerta <span className="text-yellow-400">necesito?</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Responde estas preguntas y te recomendaremos el producto ideal de nuestro catálogo.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-16">

        {/* BARRA DE PROGRESO */}
        <div className="flex gap-2 mb-8">
          {preguntas.map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full overflow-hidden bg-gray-200">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: i <= paso ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
            Pregunta {paso + 1} de {preguntas.length}
          </p>
          <h2 className="text-xl font-black text-gray-900 mb-6">{preguntaActual.pregunta}</h2>
          <div className="space-y-3">
            {preguntaActual.opciones.map(opcion => (
              <button
                key={opcion.valor}
                onClick={() => handleRespuesta(opcion.valor)}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-100 hover:border-yellow-400 hover:bg-yellow-50 transition group"
              >
                <div className="font-bold text-gray-900 group-hover:text-gray-900">{opcion.label}</div>
                {opcion.desc && (
                  <div className="text-gray-400 text-sm mt-0.5">{opcion.desc}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {paso > 0 && (
          <button
            onClick={() => setPaso(paso - 1)}
            className="mt-5 flex items-center gap-2 text-gray-500 hover:text-yellow-500 text-sm transition"
          >
            <FaArrowLeft size={12} /> Pregunta anterior
          </button>
        )}
      </div>
    </div>
  )
}

export default GuiaPuerta