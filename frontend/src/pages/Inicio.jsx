import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductosDestacados } from '../services/productos'
import { getTestimonios } from '../services/contenido'

import puerta01 from '../assets/Puerta01.jpg'
import puerta02 from '../assets/Puerta02.jpg'
import puerta03 from '../assets/Puerta03.jpg'
import puerta04 from '../assets/Puerta04.jpg'
import puerta06 from '../assets/Puerta06.jpg'
import puerta07 from '../assets/Puerta07.jpg'
import puerta08 from '../assets/Puerta08.jpg'
import puerta09 from '../assets/Puerta09.jpg'

import logoCame from '../assets/Logo-Came.png'
import logoClopay from '../assets/Logo-Clopay.png'
import logoDea from '../assets/Logo-Dea.png'
import logoLiftmaster from '../assets/Logo-Liftmaster.jpg'
import logoNice from '../assets/Logo-Nice.jpg'
import logoBft from '../assets/Logo-Bft.jpg'

const slides = [
  { imagen: puerta04, titulo: 'Puertas Corredizas', desc: 'Elegantes y funcionales para tu hogar o empresa' },
  { imagen: puerta07, titulo: 'Puertas Levadizas', desc: 'Maxima seguridad con diseno moderno' },
  { imagen: puerta09, titulo: 'Puertas Seccionales', desc: 'Calidad y durabilidad garantizada' },
]

const tiposPuertas = [
  { imagen: puerta01, nombre: 'Puertas Batientes', uso: 'Residencial / Comercial' },
  { imagen: puerta02, nombre: 'Puertas Seccionales', uso: 'Residencial' },
  { imagen: puerta03, nombre: 'Puertas Levadizas', uso: 'Residencial' },
  { imagen: puerta04, nombre: 'Puertas Corredizas', uso: 'Residencial / Comercial' },
  { imagen: puerta06, nombre: 'Estructuras Metalicas', uso: 'Comercial / Industrial' },
  { imagen: puerta08, nombre: 'Puertas de Madera', uso: 'Residencial' },
]

const porQueElegirnos = [
  { icono: '1', titulo: 'Experiencia comprobada', desc: 'Mas de 10 anos instalando puertas automaticas en Lima y provincias con resultados garantizados.' },
  { icono: '2', titulo: 'Garantia incluida', desc: 'Todos nuestros productos e instalaciones cuentan con garantia. Tu inversion esta protegida.' },
  { icono: '3', titulo: 'Atencion rapida', desc: 'Respondemos tu solicitud en menos de 24 horas y coordinamos la visita tecnica a la brevedad.' },
  { icono: '4', titulo: 'Tecnicos certificados', desc: 'Nuestro equipo esta capacitado y certificado para instalar y mantener todo tipo de puertas automaticas.' },
  { icono: '5', titulo: 'Precios competitivos', desc: 'Ofrecemos los mejores precios del mercado sin sacrificar la calidad de nuestros productos.' },
  { icono: '6', titulo: 'Soporte 24/7', desc: 'Estamos disponibles las 24 horas del dia, los 7 dias de la semana para atender cualquier emergencia.' },
]

const pasos = [
  { numero: '01', titulo: 'Solicita cotizacion', desc: 'Llena el formulario con tus datos y descripcion de lo que necesitas.' },
  { numero: '02', titulo: 'Visita tecnica', desc: 'Nuestro tecnico va a tu domicilio a tomar medidas y evaluar el espacio.' },
  { numero: '03', titulo: 'Instalacion', desc: 'Realizamos la instalacion con materiales de primera calidad.' },
  { numero: '04', titulo: 'Garantia activa', desc: 'Entregamos el trabajo con garantia y soporte tecnico incluido.' },
]

const marcas = [
  { logo: logoLiftmaster, nombre: 'LiftMaster', pais: 'USA' },
  { logo: logoCame, nombre: 'CAME', pais: 'Italia' },
  { logo: logoNice, nombre: 'NICE', pais: 'Italia' },
  { logo: logoDea, nombre: 'DEA', pais: 'Italia' },
  { logo: logoBft, nombre: 'BFT', pais: 'Italia' },
  { logo: logoClopay, nombre: 'Clopay', pais: 'USA' },
]

const testimoniosDefault = [
  { nombre: 'Carlos M.', comentario: 'Excelente servicio, instalaron mi puerta corrediza en un dia. Muy profesionales.', estrellas: 5 },
  { nombre: 'Maria L.', comentario: 'Muy buena atencion, el tecnico fue puntual y el trabajo quedo perfecto.', estrellas: 5 },
  { nombre: 'Roberto K.', comentario: 'Recomiendo GyG, precios justos y garantia real. Ya llevo 2 anos sin problemas.', estrellas: 5 },
]

function Inicio() {
  const [slideActual, setSlideActual] = useState(0)
  const [productosDestacados, setProductosDestacados] = useState([])
  const [testimonios, setTestimonios] = useState([])

  useEffect(() => {
    getProductosDestacados().then(res => setProductosDestacados(res.data)).catch(() => {})
    getTestimonios().then(res => setTestimonios(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideActual(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>

      {/* SLIDER */}
      <section className="relative h-[500px] overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: i === slideActual ? 1 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <img
              src={slide.imagen}
              alt={slide.titulo}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white',
              padding: '1rem'
            }}>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  <span className="text-yellow-400">GyG</span> Puertas Automaticas
                </h1>
                <p className="text-xl md:text-2xl mb-2 font-medium">{slide.titulo}</p>
                <p className="text-gray-300 mb-8">{slide.desc}</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Link to="/catalogo" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition">
                    Ver Catalogo
                  </Link>
                  <Link to="/cotizar" className="border border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-gray-900 transition">
                    Solicitar Cotizacion
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '0.5rem', zIndex: 10 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideActual(i)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: i === slideActual ? '#facc15' : 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </section>

      {/* ESTADISTICAS */}
      <section className="bg-yellow-400 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-gray-900">
          {[
            { numero: '10+', label: 'Anos de experiencia' },
            { numero: '500+', label: 'Clientes satisfechos' },
            { numero: '1000+', label: 'Proyectos realizados' },
            { numero: '24/7', label: 'Atencion disponible' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-bold">{stat.numero}</p>
              <p className="text-sm font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POR QUE ELEGIRNOS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">Por que elegirnos</h2>
        <p className="text-gray-500 text-center mb-10">Somos tu mejor opcion en puertas automaticas en Lima</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {porQueElegirnos.map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition border border-gray-100">
              <div className="bg-yellow-400 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-3">
                {item.icono}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.titulo}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIPOS DE PUERTAS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Nuestros Productos</h2>
          <p className="text-gray-500 text-center mb-10">Fabricamos e instalamos todo tipo de puertas automaticas</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiposPuertas.map((tipo, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition group">
                <div className="overflow-hidden h-48">
                  <img
                    src={tipo.imagen}
                    alt={tipo.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{tipo.nombre}</h3>
                  <p className="text-gray-500 text-sm mb-3">{tipo.uso}</p>
                  <Link to="/catalogo" className="text-yellow-500 font-bold hover:underline text-sm">
                    Ver mas
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/catalogo" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition">
              Ver todo el catalogo
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">Como trabajamos</h2>
        <p className="text-gray-500 text-center mb-10">Un proceso simple y transparente para tu tranquilidad</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {pasos.map((paso, i) => (
            <div key={i} className="text-center">
              <div className="bg-yellow-400 text-gray-900 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {paso.numero}
              </div>
              <h3 className="font-bold text-lg mb-2">{paso.titulo}</h3>
              <p className="text-gray-600 text-sm">{paso.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARCAS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Trabajamos con las mejores marcas</h2>
          <p className="text-gray-500 text-center mb-10">Motores y equipos importados de marcas reconocidas mundialmente</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {marcas.map((marca, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col items-center justify-center gap-3 h-36">
                <img src={marca.logo} alt={marca.nombre} className="h-16 w-full object-contain" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{marca.pais}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(testimonios.length > 0 ? testimonios : testimoniosDefault).map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-6 shadow border border-gray-100">
              <p className="text-yellow-400 text-xl mb-2">{'*****'.slice(0, t.estrellas || t.calificacion)}</p>
              <p className="text-gray-700 mb-3 italic">"{t.comentario}"</p>
              <p className="font-bold text-gray-900">{t.nombre || t.nombre_cliente}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gray-900 py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Listo para automatizar tu puerta?</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">Solicita una cotizacion gratuita y nuestro equipo coordinara una visita tecnica sin costo.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/cotizar" className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition">
            Solicitar Cotizacion
          </Link>
          <a href="https://wa.me/51947316874" target="_blank" rel="noreferrer" className="bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition">
            Escribir por WhatsApp
          </a>
        </div>
      </section>

    </div>
  )
}

export default Inicio