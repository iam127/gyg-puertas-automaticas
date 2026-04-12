import { useState } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock, FaChevronDown } from 'react-icons/fa'

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
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-yellow-400">Contactanos</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Estamos disponibles las 24 horas del dia para atender tus consultas.
        </p>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Informacion de contacto</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                <div className="bg-yellow-400 p-3 rounded-xl">
                  <FaMapMarkerAlt size={20} className="text-gray-900" />
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-sm">Direccion</p>
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-yellow-500 transition">
                    Manuel Odria 161, Ate, Lima, Peru
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                <div className="bg-yellow-400 p-3 rounded-xl">
                  <FaPhone size={20} className="text-gray-900" />
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-sm">Telefono</p>
                  <a href="tel:+51947316864" className="text-gray-600 hover:text-yellow-500 transition">
                    +51 947 316 864
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                <div className="bg-yellow-400 p-3 rounded-xl">
                  <FaEnvelope size={20} className="text-gray-900" />
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-sm">Correo</p>
                  <a href="mailto:gygpuertasautomaticas@gmail.com" className="text-gray-600 hover:text-yellow-500 transition">
                    gygpuertasautomaticas@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                <div className="bg-yellow-400 p-3 rounded-xl">
                  <FaWhatsapp size={20} className="text-gray-900" />
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-sm">WhatsApp</p>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-yellow-500 transition">
                    +51 947 316 874
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                <div className="bg-yellow-400 p-3 rounded-xl">
                  <FaClock size={20} className="text-gray-900" />
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-sm">Horario</p>
                  <p className="text-gray-600">Atencion 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Envianos un mensaje</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electronico</label>
                <input type="email" className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea rows={5} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400" />
              </div>
              <button type="submit" className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="pb-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Nuestra ubicacion</h2>
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <iframe
            title="Ubicacion GyG Puertas Automaticas"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.7721014655776!2d-76.96118472643364!3d-12.05919544212926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c68b563365f1%3A0x73f0003e430cce42!2sManuel%20A.%20Odria%20161%2C%20Ate%2015012!5e0!3m2!1ses-419!2spe!4v1775957636768!5m2!1ses-419!2spe"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mt-4 text-center">
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition inline-block">
            Abrir en Google Maps
          </a>
        </div>
      </section>

      <section className="pb-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Preguntas frecuentes</h2>
        <p className="text-gray-500 mb-8">Resolvemos tus dudas mas comunes</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
              <button
                onClick={() => setFaqAbierto(faqAbierto === i ? null : i)}
                className="w-full text-left px-6 py-4 font-medium flex justify-between items-center hover:bg-gray-100 transition"
              >
                <span>{faq.pregunta}</span>
                <FaChevronDown
                  size={14}
                  className={`text-yellow-500 transition-transform ${faqAbierto === i ? 'rotate-180' : ''}`}
                />
              </button>
              {faqAbierto === i && (
                <div className="px-6 py-4 border-t border-gray-200 text-gray-600 text-sm">
                  {faq.respuesta}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Contacto