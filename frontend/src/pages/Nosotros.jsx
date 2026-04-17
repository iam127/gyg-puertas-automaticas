import logoCalidad from '../assets/Logo-Calidad.png'
import logoCompromiso from '../assets/Logo-Compromiso.png'
import logoPuntualidad from '../assets/Logo-Puntualidad.png'
import logoGarantia from '../assets/Logo-Garantia.png'
import { FaHammer, FaWrench, FaTools, FaSearchPlus, FaShieldAlt, FaBolt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const servicios = [
  { icono: <FaHammer size={22} />, titulo: 'Fabricacion', desc: 'Fabricamos puertas a medida en madera, metal y paneles importados segun tus especificaciones.' },
  { icono: <FaWrench size={22} />, titulo: 'Instalacion', desc: 'Instalamos todo tipo de puertas automaticas con materiales de primera calidad y acabados perfectos.' },
  { icono: <FaTools size={22} />, titulo: 'Mantenimiento Preventivo', desc: 'Realizamos revisiones periodicas para evitar fallas y prolongar la vida util de tu puerta.' },
  { icono: <FaSearchPlus size={22} />, titulo: 'Mantenimiento Correctivo', desc: 'Diagnosticamos y reparamos cualquier falla en tu puerta automatica de forma rapida y efectiva.' },
  { icono: <FaShieldAlt size={22} />, titulo: 'Garantia y Repuestos', desc: 'Contamos con stock de repuestos originales para todas las marcas que trabajamos.' },
  { icono: <FaBolt size={22} />, titulo: 'Atencion de Emergencias', desc: 'Disponibles las 24 horas del dia para atender cualquier emergencia con tu puerta automatica.' },
]

function Nosotros() {
  return (
    <div>
      <Helmet>
        <title>Nosotros | GyG Puertas Automaticas</title>
      </Helmet>

      {/* HERO */}
      <section className="bg-gray-900 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Conocenos</span>
          <h1 className="text-5xl font-bold mt-2 mb-4">Sobre <span className="text-yellow-400">Nosotros</span></h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Desde 2016 brindando soluciones en puertas automaticas para hogares y empresas en toda Lima.
          </p>
        </div>
      </section>

      {/* QUIENES SOMOS */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Nuestra historia</span>
              <h2 className="text-4xl font-bold mt-2 mb-6 text-gray-900">Quienes somos</h2>
              <p className="text-gray-500 mb-4 leading-relaxed">
                GyG Puertas Automaticas es una empresa peruana fundada en 2016, especializada en la fabricacion, instalacion y mantenimiento de puertas automaticas para uso residencial, comercial e industrial.
              </p>
              <p className="text-gray-500 mb-4 leading-relaxed">
                A lo largo de estos anos hemos atendido a cientos de clientes en todos los distritos de Lima Metropolitana, ofreciendo soluciones personalizadas adaptadas a las necesidades y presupuesto de cada cliente.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Trabajamos con motores y equipos importados de las marcas mas reconocidas del mundo, garantizando durabilidad, seguridad y confiabilidad en cada instalacion.
              </p>
              <div className="mt-8">
                <Link to="/cotizar" className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition shadow-md inline-block">
                  Solicitar Cotizacion
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { numero: '2016', label: 'Ano de fundacion' },
                { numero: '10+', label: 'Anos de experiencia' },
                { numero: '500+', label: 'Clientes atendidos' },
                { numero: '100%', label: 'Lima Metropolitana' },
              ].map((stat, i) => (
                <div key={i} className={`rounded-2xl p-8 text-center shadow-md ${i % 2 === 0 ? 'bg-yellow-400' : 'bg-gray-900'}`}>
                  <p className={`text-4xl font-bold ${i % 2 === 0 ? 'text-gray-900' : 'text-yellow-400'}`}>{stat.numero}</p>
                  <p className={`text-sm font-medium mt-2 ${i % 2 === 0 ? 'text-gray-800' : 'text-gray-300'}`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISION VISION VALORES */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Nuestros pilares</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Mision, Vision y Valores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition border-b-4 border-yellow-400">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center font-bold text-gray-900 text-xl mb-5">M</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Mision</h3>
              <p className="text-gray-500 leading-relaxed">
                Brindar soluciones integrales en automatizacion de puertas y accesos, garantizando la seguridad, comodidad y satisfaccion de nuestros clientes mediante productos de calidad y un servicio tecnico especializado.
              </p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition border-b-4 border-gray-700">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center font-bold text-gray-900 text-xl mb-5">V</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                Ser la empresa lider en automatizacion de puertas y accesos en el Peru, reconocida por la excelencia en nuestros productos, innovacion tecnologica y el compromiso con la satisfaccion de nuestros clientes.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition border-b-4 border-yellow-400">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center font-bold text-gray-900 text-xl mb-5">V</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Valores</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { logo: logoCalidad, titulo: 'Calidad' },
                  { logo: logoCompromiso, titulo: 'Compromiso' },
                  { logo: logoPuntualidad, titulo: 'Puntualidad' },
                  { logo: logoGarantia, titulo: 'Garantia' },
                ].map((v, i) => (
                  <div key={i} className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
                    <img src={v.logo} alt={v.titulo} className="h-10 w-10 object-contain mb-2 mix-blend-multiply" />
                    <p className="text-xs font-bold text-gray-700">{v.titulo}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Lo que hacemos</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Nuestros Servicios</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Todo lo que necesitas en un solo lugar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition border border-gray-100 group">
                <div className="bg-yellow-400 text-gray-900 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition">
                  {s.icono}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{s.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COBERTURA */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Donde estamos</span>
          <h2 className="text-4xl font-bold mt-2 mb-4">Nuestra Cobertura</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">Atendemos en todos los distritos de Lima Metropolitana</p>
          <div className="bg-gray-800 rounded-2xl p-10 max-w-3xl mx-auto">
            <p className="text-7xl font-bold text-yellow-400 mb-2">43</p>
            <p className="text-2xl font-bold text-white mb-4">Distritos de Lima Metropolitana</p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Desde Chorrillos hasta Carabayllo, desde Ate hasta La Perla. Llegamos a cualquier distrito de Lima para instalarte o darte mantenimiento a tu puerta automatica.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'San Borja', 'Ate', 'Chorrillos', 'Los Olivos', 'SJM', 'Callao'].map((d, i) => (
                <span key={i} className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  {d}
                </span>
              ))}
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
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