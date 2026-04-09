import { useState } from 'react'
import { Link } from 'react-router-dom'

const preguntas = [
  {
    id: 1,
    pregunta: '¿Para qué tipo de lugar necesitas la puerta?',
    opciones: [
      { valor: 'residencial', label: '🏠 Casa / Vivienda' },
      { valor: 'comercial', label: '🏢 Empresa / Negocio' },
      { valor: 'industrial', label: '🏭 Industria / Almacén' },
    ]
  },
  {
    id: 2,
    pregunta: '¿Qué tan grande es el acceso?',
    opciones: [
      { valor: 'pequeno', label: '📏 Pequeño (hasta 2.5m)' },
      { valor: 'mediano', label: '📐 Mediano (2.5m a 4m)' },
      { valor: 'grande', label: '📊 Grande (más de 4m)' },
    ]
  },
  {
    id: 3,
    pregunta: '¿Tienes espacio lateral disponible?',
    opciones: [
      { valor: 'si', label: '✅ Sí tengo espacio lateral' },
      { valor: 'no', label: '❌ No tengo espacio lateral' },
    ]
  },
  {
    id: 4,
    pregunta: '¿Qué material prefieres?',
    opciones: [
      { valor: 'metal', label: '⚙️ Metal' },
      { valor: 'madera', label: '🌲 Madera' },
      { valor: 'panel', label: '🔲 Panel importado' },
      { valor: 'indiferente', label: '🤷 Me es indiferente' },
    ]
  },
  {
    id: 5,
    pregunta: '¿Necesitas automatización con control remoto?',
    opciones: [
      { valor: 'si', label: '📡 Sí, con control remoto' },
      { valor: 'no', label: '🚪 No, manual está bien' },
    ]
  },
]

const recomendaciones = {
  residencial: {
    pequeno: { tipo: 'Puerta Levadiza', desc: 'Ideal para cocheras pequeñas de viviendas. Ocupa poco espacio y es fácil de operar.' },
    mediano: { tipo: 'Puerta Corrediza', desc: 'Perfecta para accesos medianos en viviendas con espacio lateral disponible.' },
    grande: { tipo: 'Puerta Seccional', desc: 'Ideal para accesos grandes en viviendas. No invade la vereda al abrir.' },
  },
  comercial: {
    pequeno: { tipo: 'Puerta Batiente', desc: 'Ideal para locales comerciales con accesos pequeños.' },
    mediano: { tipo: 'Puerta Corrediza', desc: 'Perfecta para empresas con accesos medianos y tráfico frecuente.' },
    grande: { tipo: 'Puerta Industrial', desc: 'Diseñada para grandes accesos en establecimientos comerciales.' },
  },
  industrial: {
    pequeno: { tipo: 'Puerta Industrial', desc: 'Robusta y duradera para uso industrial intensivo.' },
    mediano: { tipo: 'Puerta Industrial', desc: 'Perfecta para almacenes y plantas industriales de tamaño mediano.' },
    grande: { tipo: 'Barrera Automática', desc: 'Ideal para grandes accesos industriales con alto tráfico vehicular.' },
  },
}

function GuiaPuerta() {
  const [paso, setPaso] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [resultado, setResultado] = useState(null)

  const handleRespuesta = (valor) => {
    const nuevasRespuestas = { ...respuestas, [preguntas[paso].id]: valor }
    setRespuestas(nuevasRespuestas)

    if (paso < preguntas.length - 1) {
      setPaso(paso + 1)
    } else {
      const uso = nuevasRespuestas[1]
      const tamano = nuevasRespuestas[2]
      const recomendacion = recomendaciones[uso]?.[tamano]
      setResultado(recomendacion || {
        tipo: 'Consulta con nuestro equipo',
        desc: 'Según tus necesidades específicas, te recomendamos contactarnos para una asesoría personalizada.'
      })
    }
  }

  const reiniciar = () => {
    setPaso(0)
    setRespuestas({})
    setResultado(null)
  }

  if (resultado) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🚪</div>
        <h2 className="text-2xl font-bold mb-2">Te recomendamos:</h2>
        <div className="bg-yellow-50 border border-yellow-400 rounded-xl px-8 py-6 mb-6">
          <h3 className="text-2xl font-bold text-yellow-700 mb-2">{resultado.tipo}</h3>
          <p className="text-gray-600">{resultado.desc}</p>
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/catalogo" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition">
            Ver en catálogo
          </Link>
          <Link to="/cotizar" className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition">
            Solicitar cotización
          </Link>
          <button onClick={reiniciar} className="border border-gray-300 px-6 py-3 rounded-full font-bold hover:border-yellow-400 transition">
            Volver a empezar
          </button>
        </div>
      </div>
    )
  }

  const preguntaActual = preguntas[paso]

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">¿Qué puerta necesito?</h1>
      <p className="text-gray-500 text-center mb-10">Responde estas preguntas y te recomendaremos el producto ideal.</p>

      <div className="flex gap-2 mb-8 justify-center">
        {preguntas.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition ${i <= paso ? 'bg-yellow-400' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-8">
        <p className="text-sm text-gray-400 mb-2">Pregunta {paso + 1} de {preguntas.length}</p>
        <h2 className="text-xl font-bold mb-6">{preguntaActual.pregunta}</h2>
        <div className="space-y-3">
          {preguntaActual.opciones.map(opcion => (
            <button
              key={opcion.valor}
              onClick={() => handleRespuesta(opcion.valor)}
              className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition font-medium"
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      {paso > 0 && (
        <button
          onClick={() => setPaso(paso - 1)}
          className="mt-4 text-gray-500 hover:text-yellow-500 text-sm"
        >
          ← Pregunta anterior
        </button>
      )}
    </div>
  )
}

export default GuiaPuerta