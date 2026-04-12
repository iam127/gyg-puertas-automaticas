import logoCalidad from '../assets/Logo-Calidad.png'
import logoCompromiso from '../assets/Logo-Compromiso.png'
import logoPuntualidad from '../assets/Logo-Puntualidad.png'
import logoGarantia from '../assets/Logo-Garantia.png'

function Nosotros() {
  return (
    <div>

      {/* HERO */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Sobre <span className="text-yellow-400">Nosotros</span></h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Desde 2016 brindando soluciones en puertas automaticas para hogares y empresas en toda Lima.
        </p>
      </section>

      {/* QUIENES SOMOS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Quienes somos</h2>
            <p className="text-gray-600 mb-4">
              GyG Puertas Automaticas es una empresa peruana fundada en 2016, especializada en la fabricacion, instalacion y mantenimiento de puertas automaticas para uso residencial, comercial e industrial.
            </p>
            <p className="text-gray-600 mb-4">
              A lo largo de estos anos hemos atendido a cientos de clientes en todos los distritos de Lima Metropolitana, ofreciendo soluciones personalizadas adaptadas a las necesidades y presupuesto de cada cliente.
            </p>
            <p className="text-gray-600">
              Trabajamos con motores y equipos importados de las marcas mas reconocidas del mundo, garantizando durabilidad, seguridad y confiabilidad en cada instalacion.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { numero: '2016', label: 'Ano de fundacion' },
              { numero: '10+', label: 'Anos de experiencia' },
              { numero: '500+', label: 'Clientes atendidos' },
              { numero: '100%', label: 'Lima Metropolitana' },
            ].map((stat, i) => (
              <div key={i} className="bg-yellow-400 rounded-xl p-6 text-center">
                <p className="text-3xl font-bold text-gray-900">{stat.numero}</p>
                <p className="text-sm font-medium text-gray-800 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISION VISION VALORES */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Mision, Vision y Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border-t-4 border-yellow-400 shadow text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Mision</h3>
              <p className="text-gray-600">
                Brindar soluciones integrales en automatizacion de puertas y accesos, garantizando la seguridad, comodidad y satisfaccion de nuestros clientes mediante productos de calidad y un servicio tecnico especializado.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border-t-4 border-gray-400 shadow text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Vision</h3>
              <p className="text-gray-600">
                Ser la empresa lider en automatizacion de puertas y accesos en el Peru, reconocida por la excelencia en nuestros productos, innovacion tecnologica y el compromiso con la satisfaccion de nuestros clientes.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border-t-4 border-yellow-400 shadow text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Valores</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { logo: logoCalidad, titulo: 'Calidad' },
                  { logo: logoCompromiso, titulo: 'Compromiso' },
                  { logo: logoPuntualidad, titulo: 'Puntualidad' },
                  { logo: logoGarantia, titulo: 'Garantia' },
                ].map((v, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <img src={v.logo} alt={v.titulo} className="h-10 w-10 object-contain mb-1 mix-blend-multiply" />
                    <p className="text-sm font-medium text-gray-700">{v.titulo}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Nuestros Servicios</h2>
          <p className="text-gray-500 text-center mb-10">Todo lo que necesitas en un solo lugar</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { titulo: 'Fabricacion', desc: 'Fabricamos puertas a medida en madera, metal y paneles importados segun tus especificaciones.' },
              { titulo: 'Instalacion', desc: 'Instalamos todo tipo de puertas automaticas con materiales de primera calidad y acabados perfectos.' },
              { titulo: 'Mantenimiento Preventivo', desc: 'Realizamos revisiones periodicas para evitar fallas y prolongar la vida util de tu puerta.' },
              { titulo: 'Mantenimiento Correctivo', desc: 'Diagnosticamos y reparamos cualquier falla en tu puerta automatica de forma rapida y efectiva.' },
              { titulo: 'Garantia y Repuestos', desc: 'Contamos con stock de repuestos originales para todas las marcas que trabajamos.' },
              { titulo: 'Atencion de Emergencias', desc: 'Disponibles las 24 horas del dia para atender cualquier emergencia con tu puerta automatica.' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition border border-gray-100">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 mb-3">
                  {i + 1}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.titulo}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COBERTURA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Nuestra Cobertura</h2>
          <p className="text-gray-500 text-center mb-10">Atendemos en todos los distritos de Lima Metropolitana</p>
          <div className="bg-yellow-50 border border-yellow-400 rounded-xl p-8 text-center">
            <p className="text-5xl font-bold text-yellow-500 mb-2">43</p>
            <p className="text-xl font-bold text-gray-900 mb-4">Distritos de Lima Metropolitana</p>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              Desde Chorrillos hasta Carabayllo, desde Ate hasta La Perla. Llegamos a cualquier distrito de Lima para instalarte o darte mantenimiento a tu puerta automatica.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'San Borja', 'Ate', 'Chorrillos', 'Los Olivos', 'SJM', 'Callao'].map((d, i) => (
                <span key={i} className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                  {d}
                </span>
              ))}
              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                y muchos mas...
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Nosotros