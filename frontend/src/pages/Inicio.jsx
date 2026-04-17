import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShieldAlt, FaStar, FaClock, FaTools, FaMoneyBillWave, FaHeadset, FaArrowRight, FaPhone, FaCheckCircle } from 'react-icons/fa'
import { getTestimonios } from '../services/contenido'
import { Helmet } from 'react-helmet-async'

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

const ventajas = [
  { icono: <FaStar size={18} />, titulo: 'Experiencia comprobada', desc: 'Mas de 10 anos instalando puertas automaticas en toda Lima con resultados garantizados.' },
  { icono: <FaShieldAlt size={18} />, titulo: 'Garantia incluida', desc: 'Todos nuestros productos e instalaciones cuentan con garantia real en piezas y mano de obra.' },
  { icono: <FaClock size={18} />, titulo: 'Atencion en 24 horas', desc: 'Respondemos tu solicitud rapidamente y coordinamos la visita tecnica gratuita.' },
  { icono: <FaTools size={18} />, titulo: 'Tecnicos certificados', desc: 'Nuestro equipo esta capacitado para instalar y mantener todas las marcas del mercado.' },
  { icono: <FaMoneyBillWave size={18} />, titulo: 'Precios competitivos', desc: 'Ofrecemos los mejores precios del mercado sin sacrificar la calidad del trabajo.' },
  { icono: <FaHeadset size={18} />, titulo: 'Soporte 24/7', desc: 'Disponibles las 24 horas del dia para atender cualquier emergencia con tu puerta.' },
]

const pasos = [
  { n: '01', titulo: 'Solicita tu cotizacion', desc: 'Completa el formulario con los datos de tu proyecto.' },
  { n: '02', titulo: 'Visita tecnica gratuita', desc: 'Un tecnico especialista visita tu domicilio sin costo.' },
  { n: '03', titulo: 'Instalacion profesional', desc: 'Instalamos con materiales de primera calidad.' },
  { n: '04', titulo: 'Garantia activada', desc: 'Recibes tu puerta con garantia y soporte continuo.' },
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
  { nombre: 'Carlos M.', comentario: 'Excelente servicio, instalaron mi puerta corrediza en un dia. Muy profesionales y puntuales.', estrellas: 5 },
  { nombre: 'Maria L.', comentario: 'Muy buena atencion, el tecnico fue puntual y el trabajo quedo perfecto. Lo recomiendo.', estrellas: 5 },
  { nombre: 'Roberto K.', comentario: 'Recomiendo GyG, precios justos y garantia real. Ya llevo 2 anos sin ningun problema.', estrellas: 5 },
]

export default function Inicio() {
  const [slideActual, setSlideActual] = useState(0)
  const [testimonios, setTestimonios] = useState([])

  useEffect(() => {
    getTestimonios().then(res => setTestimonios(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSlideActual(p => (p + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      <Helmet>
        <title>GyG Puertas Automaticas | Instalacion y Mantenimiento en Lima</title>
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ height: '90vh', minHeight: '580px', maxHeight: '780px' }}>
        {slides.map((slide, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === slideActual ? 1 : 0, transition: 'opacity 1.5s ease' }}>
            <img src={slide.imagen} alt={slide.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.78) 50%, rgba(0,0,0,0.2) 100%)' }} />
          </div>
        ))}
        <div className="relative z-10 h-full flex items-center px-6 md:px-20">
          <div style={{ maxWidth: '580px' }}>
            <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-4">
              GyG Puertas Automaticas
            </p>
            <h1 className="text-white font-black mb-6" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 1.1 }}>
              {slides[slideActual].titulo}
            </h1>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              {slides[slideActual].desc}. Instalacion profesional en toda Lima con garantia incluida.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/cotizar" className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-300 transition flex items-center gap-2">
                Cotizacion Gratuita <FaArrowRight size={14} />
              </Link>
              <a href="tel:+51947316864" className="text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2 transition" style={{ border: '1.5px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(4px)' }}>
                <FaPhone size={14} /> Llamar ahora
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlideActual(i)} className="rounded-full transition-all" style={{ width: i === slideActual ? '28px' : '8px', height: '8px', background: i === slideActual ? '#facc15' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer' }} />
          ))}
        </div>
      </section>

      {/* ESTADISTICAS */}
      <section className="bg-yellow-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { n: '10+', l: 'Anos de experiencia' },
            { n: '500+', l: 'Clientes satisfechos' },
            { n: '1000+', l: 'Proyectos realizados' },
            { n: '24/7', l: 'Soporte disponible' },
          ].map((s, i) => (
            <div key={i} className="py-8 px-6 text-center border-r border-yellow-500 last:border-0">
              <p className="text-4xl font-black text-gray-900">{s.n}</p>
              <p className="text-xs font-semibold text-gray-700 mt-2 uppercase tracking-wider">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POR QUE ELEGIRNOS */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-3">Nuestras ventajas</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Por que elegirnos</h2>
            <p className="text-gray-500 max-w-md mx-auto">Somos tu mejor opcion en puertas automaticas en Lima con mas de una decada de experiencia.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ventajas.map((v, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-yellow-300 hover:shadow-md transition group">
                <div className="w-11 h-11 bg-yellow-400 rounded-xl flex items-center justify-center text-gray-900 mb-5 group-hover:scale-110 transition">
                  {v.icono}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{v.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 flex-wrap gap-4">
            <div>
              <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-3">Lo que ofrecemos</p>
              <h2 className="text-4xl font-black text-gray-900">Nuestros Productos</h2>
            </div>
            <Link to="/catalogo" className="bg-gray-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-800 transition flex items-center gap-2 text-sm">
              Ver catalogo <FaArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiposPuertas.map((tipo, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group bg-white">
                <div className="overflow-hidden h-52">
                  <img src={tipo.imagen} alt={tipo.nombre} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">{tipo.uso}</span>
                  <h3 className="font-bold text-gray-900 text-lg mt-3 mb-1">{tipo.nombre}</h3>
                  <Link to="/catalogo" className="text-yellow-500 font-bold text-sm flex items-center gap-1 mt-3 hover:gap-2 transition-all">
                    Ver detalle <FaArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-3">Como trabajamos</p>
            <h2 className="text-4xl font-black text-gray-900">Un proceso simple y transparente</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {pasos.map((p, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-2xl font-black text-gray-900 mx-auto mb-5 shadow-md">
                  {p.n}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{p.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARCAS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mb-10">Marcas con las que trabajamos</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {marcas.map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition border border-gray-100">
                <img src={m.logo} alt={m.nombre} className="h-10 w-full object-contain" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{m.pais}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-3">Testimonios</p>
            <h2 className="text-4xl font-black text-gray-900">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(testimonios.length > 0 ? testimonios : testimoniosDefault).map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.estrellas || t.calificacion)].map((_, j) => <FaStar key={j} size={15} className="text-yellow-400" />)}
                </div>
                <p className="text-gray-600 text-base leading-relaxed mb-6 italic">"{t.comentario}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-gray-900 text-lg">
                    {(t.nombre || t.nombre_cliente)[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.nombre || t.nombre_cliente}</p>
                    <p className="text-gray-400 text-xs">Cliente verificado</p>
                  </div>
                  <FaCheckCircle size={15} className="text-green-500 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">Contactanos hoy</p>
          <h2 className="text-white font-black mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
            Listo para automatizar tu puerta?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Visita tecnica gratuita en toda Lima. Sin compromiso, sin costos ocultos.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/cotizar" className="bg-yellow-400 text-gray-900 font-black px-10 py-4 rounded-lg hover:bg-yellow-300 transition flex items-center gap-2 text-base">
              Solicitar Cotizacion <FaArrowRight size={14} />
            </Link>
            <a href="https://wa.me/51947316874" target="_blank" rel="noreferrer" className="bg-green-500 text-white font-bold px-10 py-4 rounded-lg hover:bg-green-600 transition text-base">
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}