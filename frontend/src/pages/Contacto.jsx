import { useState } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock, FaChevronDown } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

function Contacto() {
  const [faqAbierto, setFaqAbierto] = useState(null)
  const whatsappUrl = 'https://wa.me/51947316874?text=Hola%2C%20me%20gustaria%20obtener%20informacion%20sobre%20sus%20puertas%20automaticas'
  const mapsUrl = 'https://maps.google.com/?q=Manuel+Odria+161+Ate+Lima+Peru'

  const faqs = [
    { pregunta: 'Cuanto tiempo demora la instalacion?', respuesta: 'El tiempo de instalacion varia segun el tipo de puerta y complejidad del trabajo. En promedio demora entre 1 y 3 dias.' },
    { pregunta: 'Que garantia tienen sus productos?', respuesta: 'Todos nuestros productos cuentan con garantia de 12 meses en piezas y mano de obra.' },
    { pregunta: 'Realizan mantenimiento a puertas de otras marcas?', respuesta: 'Si, nuestro equipo tecnico esta capacitado para dar mantenimiento a puertas automaticas de diferentes marcas.' },
    { pregunta: 'Como solicito una cotizacion?', respuesta: 'Puedes solicitar una cotizacion desde nuestra web completando el formulario. Nuestro equipo coordinara una visita tecnica para darte un precio exacto.' },
    { pregunta: 'Trabajan en toda Lima?', respuesta: 'Si, atendemos en todos los distritos de Lima Metropolitana.' },
  ]

  return (
    <div>
      <Helmet>
          <title>Contacto | GyG Puertas Automaticas</title>
      </Helmet>
      <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Estamos para ayudarte</span>
          <h1 className="text-5xl font-bold mt-2 mb-4">
            <span className="text-yellow-400">Contactanos</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Estamos disponibles las 24 horas del dia para atender tus consultas.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            <div>
              <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Informacion</span>
              <h2 className="text-3xl font-bold mt-1 mb-8 text-gray-900">Datos de contacto</h2>
              <div className="space-y-3">

                <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition group">
                  <div className="bg-yellow-400 text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Direccion</p>
                    <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-gray-800 font-medium hover:text-yellow-500 transition">
                      Manuel Odria 161, Ate, Lima, Peru
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition group">
                  <div className="bg-yellow-400 text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                    <FaPhone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Telefono</p>
                    <a href="tel:+51947316864" className="text-gray-800 font-medium hover:text-yellow-500 transition">
                      +51 947 316 864
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition group">
                  <div className="bg-yellow-400 text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                    <FaEnvelope size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Correo</p>
                    <a href="mailto:gygpuertasautomaticas@gmail.com" className="text-gray-800 font-medium hover:text-yellow-500 transition">
                      gygpuertasautomaticas@gmail.com
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition group">
                  <div className="bg-yellow-400 text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                    <FaWhatsapp size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">WhatsApp</p>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-gray-800 font-medium hover:text-yellow-500 transition">
                      +51 947 316 874
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition group">
                  <div className="bg-yellow-400 text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                    <FaClock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Horario</p>
                    <p className="text-gray-800 font-medium">Atencion 24/7</p>
                  </div>
                </div>

              </div>

              <div className="mt-6 bg-gray-900 rounded-2xl p-6 text-white">
                <p className="font-bold mb-2">Prefiere escribirnos por WhatsApp?</p>
                <p className="text-gray-400 text-sm mb-4">Respondemos en minutos durante el horario de atencion.</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-600 transition inline-flex items-center gap-2 text-sm"
                >
                  <FaWhatsapp size={16} />
                  Escribir por WhatsApp
                </a>
              </div>
            </div>

            <div>
              <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Formulario</span>
              <h2 className="text-3xl font-bold mt-1 mb-8 text-gray-900">Envianos un mensaje</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo electronico</label>
                    <input
                      type="email"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                    <textarea
                      rows={5}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-gray-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-yellow-400 text-gray-900 py-3.5 rounded-xl font-bold hover:bg-yellow-300 transition shadow-sm"
                  >
                    Enviar mensaje
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Ubicacion</span>
            <h2 className="text-3xl font-bold mt-1 text-gray-900">Nuestra ubicacion</h2>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <iframe
              title="Ubicacion GyG Puertas Automaticas"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.7721014655776!2d-76.96118472643364!3d-12.05919544212926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c68b563365f1%3A0x73f0003e430cce42!2sManuel%20A.%20Odria%20161%2C%20Ate%2015012!5e0!3m2!1ses-419!2spe!4v1775957636768!5m2!1ses-419!2spe"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4 text-center">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition inline-block"
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Dudas comunes</span>
            <h2 className="text-3xl font-bold mt-1 text-gray-900">Preguntas frecuentes</h2>
            <p className="text-gray-500 mt-2">Resolvemos tus dudas mas comunes</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl overflow-hidden border transition ${faqAbierto === i ? 'border-yellow-400 shadow-sm' : 'border-gray-100'}`}
              >
                <button
                  onClick={() => setFaqAbierto(faqAbierto === i ? null : i)}
                  className="w-full text-left px-6 py-5 font-medium flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="text-gray-900">{faq.pregunta}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition ${faqAbierto === i ? 'bg-yellow-400' : 'bg-gray-100'}`}>
                    <FaChevronDown
                      size={12}
                      className={`transition-transform ${faqAbierto === i ? 'rotate-180 text-gray-900' : 'text-gray-500'}`}
                    />
                  </div>
                </button>
                {faqAbierto === i && (
                  <div className="px-6 py-4 border-t border-gray-100 text-gray-600 text-sm leading-relaxed">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contacto