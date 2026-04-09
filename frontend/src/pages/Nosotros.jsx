function Nosotros() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Sobre <span className="text-yellow-400">Nosotros</span></h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Somos una empresa peruana especializada en la instalación y mantenimiento de puertas automáticas con años de experiencia en el mercado.
        </p>
      </section>

      {/* MISION VISION */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-yellow-50 rounded-xl p-8 border-l-4 border-yellow-400">
            <h2 className="text-2xl font-bold mb-4">🎯 Misión</h2>
            <p className="text-gray-600">
              Brindar soluciones integrales en automatización de puertas y accesos, garantizando la seguridad, comodidad y satisfacción de nuestros clientes mediante productos de calidad y un servicio técnico especializado.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-8 border-l-4 border-gray-400">
            <h2 className="text-2xl font-bold mb-4">🔭 Visión</h2>
            <p className="text-gray-600">
              Ser la empresa líder en automatización de puertas y accesos en el Perú, reconocida por la excelencia en nuestros productos, innovación tecnológica y compromiso con nuestros clientes.
            </p>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icono: '🏆', titulo: 'Calidad', desc: 'Trabajamos con los mejores materiales y tecnología.' },
              { icono: '🤝', titulo: 'Compromiso', desc: 'Nos comprometemos con cada cliente y proyecto.' },
              { icono: '⚡', titulo: 'Puntualidad', desc: 'Cumplimos con los tiempos acordados.' },
              { icono: '🛡️', titulo: 'Garantía', desc: 'Todos nuestros trabajos tienen garantía incluida.' },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow hover:shadow-lg transition">
                <div className="text-4xl mb-3">{v.icono}</div>
                <h3 className="font-bold text-lg mb-2">{v.titulo}</h3>
                <p className="text-gray-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUE ELEGIRNOS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">¿Por qué elegirnos?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            'Más de 10 años de experiencia en el mercado peruano',
            'Técnicos certificados y especializados',
            'Productos de marcas reconocidas a nivel mundial',
            'Atención personalizada para cada cliente',
            'Servicio de mantenimiento preventivo y correctivo',
            'Garantía en todos nuestros productos e instalaciones',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <span className="text-yellow-400 text-xl font-bold">✓</span>
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Nosotros