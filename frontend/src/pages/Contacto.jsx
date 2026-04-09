function Contacto() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-yellow-400">Contáctanos</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Estamos disponibles para atender tus consultas y ayudarte a encontrar la mejor solución.
        </p>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* INFORMACION */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>
            <div className="space-y-4">
              {[
                { icono: '📍', titulo: 'Dirección', valor: 'Lima, Perú' },
                { icono: '📞', titulo: 'Teléfono', valor: '+51 999 999 999' },
                { icono: '📧', titulo: 'Correo', valor: 'contacto@gygpuertas.com' },
                { icono: '🕐', titulo: 'Horario', valor: 'Lunes a Sábado: 8am - 6pm' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                  <span className="text-2xl">{item.icono}</span>
                  <div>
                    <p className="font-bold text-gray-700">{item.titulo}</p>
                    <p className="text-gray-600">{item.valor}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-lg mb-4">Síguenos en redes sociales</h3>
              <div className="flex gap-4">
                <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                  Facebook
                </a>
                <a href="#" className="bg-pink-600 text-white px-4 py-2 rounded-xl hover:bg-pink-700 transition">
                  Instagram
                </a>
                <a href="#" className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  placeholder="Juan Pérez"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contacto