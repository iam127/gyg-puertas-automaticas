import { useEffect, useState } from 'react'
import { getFAQ } from '../services/contenido'

function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [abierto, setAbierto] = useState(null)

  useEffect(() => {
    getFAQ().then(res => setFaqs(res.data))
  }, [])

  const toggleFAQ = (id) => {
    setAbierto(abierto === id ? null : id)
  }

  return (
    <div>
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Preguntas <span className="text-yellow-400">Frecuentes</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Resolvemos tus dudas más comunes sobre nuestros productos y servicios.
        </p>
      </section>

      <section className="py-16 px-4 max-w-3xl mx-auto">
        {faqs.length === 0 ? (
          <div className="space-y-4">
            {[
              { pregunta: '¿Cuánto tiempo demora la instalación?', respuesta: 'El tiempo de instalación varía según el tipo de puerta y complejidad del trabajo. En promedio demora entre 1 y 3 días.' },
              { pregunta: '¿Qué garantía tienen sus productos?', respuesta: 'Todos nuestros productos cuentan con garantía de 12 meses en piezas y mano de obra.' },
              { pregunta: '¿Realizan mantenimiento a puertas de otras marcas?', respuesta: 'Sí, nuestro equipo técnico está capacitado para dar mantenimiento a puertas automáticas de diferentes marcas.' },
              { pregunta: '¿Cómo solicito una cotización?', respuesta: 'Puedes solicitar una cotización desde nuestra web completando el formulario. Nuestro equipo coordinará una visita técnica para darte un precio exacto.' },
              { pregunta: '¿Trabajan en toda Lima?', respuesta: 'Sí, atendemos en todos los distritos de Lima Metropolitana.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
                <button
                  onClick={() => toggleFAQ(i)}
                  className="w-full text-left px-6 py-4 font-medium flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span>{faq.pregunta}</span>
                  <span className="text-yellow-400 text-xl">{abierto === i ? '−' : '+'}</span>
                </button>
                {abierto === i && (
                  <div className="px-6 py-4 border-t text-gray-600">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map(faq => (
              <div key={faq.id} className="bg-white rounded-xl shadow overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left px-6 py-4 font-medium flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span>{faq.pregunta}</span>
                  <span className="text-yellow-400 text-xl">{abierto === faq.id ? '−' : '+'}</span>
                </button>
                {abierto === faq.id && (
                  <div className="px-6 py-4 border-t text-gray-600">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default FAQ