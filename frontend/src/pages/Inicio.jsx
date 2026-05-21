import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaShieldAlt, FaStar, FaClock, FaTools, FaMoneyBillWave, FaHeadset, FaArrowRight, FaPhone, FaCheckCircle, FaDoorOpen } from 'react-icons/fa'
import { getTestimonios } from '../services/contenido'
import { getProductosDestacados } from '../services/productos'
import { Helmet } from 'react-helmet-async'

import puerta01 from '../assets/Puerta01.jpg'
import puerta02 from '../assets/Puerta02.jpg'
import puerta04 from '../assets/Puerta04.jpg'
import puerta07 from '../assets/Puerta07.jpg'
import puerta09 from '../assets/Puerta09.jpg'

import logoCame from '../assets/Logo-Came.png'
import logoClopay from '../assets/Logo-Clopay.png'
import logoDea from '../assets/Logo-Dea.png'
import logoLiftmaster from '../assets/Logo-Liftmaster.jpg'
import logoNice from '../assets/Logo-Nice.jpg'
import logoBft from '../assets/Logo-Bft.jpg'

const slides = [
  { imagen: puerta04, titulo: 'Puertas Corredizas', desc: 'Elegantes y funcionales para tu hogar o empresa' },
  { imagen: puerta07, titulo: 'Puertas Levadizas', desc: 'Máxima seguridad con diseño moderno' },
  { imagen: puerta09, titulo: 'Puertas Seccionales', desc: 'Calidad y durabilidad garantizada' },
  { imagen: puerta01, titulo: 'Puertas Batientes', desc: 'Ideales para accesos comerciales y residenciales' },
  { imagen: puerta02, titulo: 'Puertas Automáticas', desc: 'Tecnología de punta para tu comodidad y seguridad' },
]

const ventajas = [
  { icono: <FaStar size={16} />, titulo: 'Experiencia comprobada', desc: 'Más de 4 años instalando puertas automáticas en toda Lima con resultados garantizados.' },
  { icono: <FaShieldAlt size={16} />, titulo: 'Garantía incluida', desc: 'Todos nuestros productos e instalaciones cuentan con garantía real en piezas y mano de obra.' },
  { icono: <FaClock size={16} />, titulo: 'Atención en 24 horas', desc: 'Respondemos tu solicitud rápidamente y coordinamos la visita técnica gratuita.' },
  { icono: <FaTools size={16} />, titulo: 'Técnicos certificados', desc: 'Nuestro equipo está capacitado para instalar y mantener todas las marcas del mercado.' },
  { icono: <FaMoneyBillWave size={16} />, titulo: 'Precios competitivos', desc: 'Ofrecemos los mejores precios del mercado sin sacrificar la calidad del trabajo.' },
  { icono: <FaHeadset size={16} />, titulo: 'Soporte 24/7', desc: 'Disponibles las 24 horas del día para atender cualquier emergencia con tu puerta.' },
]

const pasos = [
  { n: '01', titulo: 'Solicita tu cotización', desc: 'Completa el formulario con los datos de tu proyecto.' },
  { n: '02', titulo: 'Visita técnica gratuita', desc: 'Un técnico especialista visita tu domicilio sin costo.' },
  { n: '03', titulo: 'Instalación profesional', desc: 'Instalamos con materiales de primera calidad.' },
  { n: '04', titulo: 'Garantía activada', desc: 'Recibes tu puerta con garantía y soporte continuo.' },
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
  { nombre: 'Carlos M.', comentario: 'Excelente servicio, instalaron mi puerta corrediza en un día. Muy profesionales y puntuales.', estrellas: 5 },
  { nombre: 'María L.', comentario: 'Muy buena atención, el técnico fue puntual y el trabajo quedó perfecto. Lo recomiendo.', estrellas: 5 },
  { nombre: 'Roberto K.', comentario: 'Recomiendo GyG, precios justos y garantía real. Ya llevo 2 años sin ningún problema.', estrellas: 5 },
]

const stats = [
  { n: '4+', l: 'Años de experiencia' },
  { n: '500+', l: 'Clientes satisfechos' },
  { n: '1000+', l: 'Proyectos realizados' },
  { n: '24/7', l: 'Soporte disponible' },
]

const getUrl = (url) => {
  if (!url) return null
  return url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`
}

export default function Inicio() {
  const [slideActual, setSlideActual] = useState(0)
  const [testimonios, setTestimonios] = useState([])
  const [productosDestacados, setProductosDestacados] = useState([])

  useEffect(() => {
    getTestimonios().then(res => setTestimonios(res.data)).catch(() => {})
    getProductosDestacados().then(res => setProductosDestacados(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSlideActual(p => (p + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <Helmet>
        <title>GyG Puertas Automáticas | Instalación y Mantenimiento en Lima</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
          @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
          @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .hero-text { animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) both; }
          .hero-text-2 { animation: fadeUp 0.9s 0.15s cubic-bezier(.22,1,.36,1) both; }
          .hero-text-3 { animation: fadeUp 0.9s 0.28s cubic-bezier(.22,1,.36,1) both; }
          .hero-btns  { animation: fadeUp 0.9s 0.4s cubic-bezier(.22,1,.36,1) both; }
          .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.10); }
          .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
          .btn-primary:hover { background: #FDE047 !important; }
          .btn-dark:hover { background: #1f1f1f !important; }
          .marca-card:hover { border-color: #FACC15 !important; transform: translateY(-2px); }
          .marca-card { transition: border-color 0.2s, transform 0.2s; }
          .step-num:hover { transform: scale(1.08); }
          .step-num { transition: transform 0.2s; }
        `}</style>
      </Helmet>

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{ position: 'relative', height: '92vh', minHeight: '600px', maxHeight: '820px', overflow: 'hidden' }}>
        {/* Slides */}
        {slides.map((slide, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === slideActual ? 1 : 0, transition: 'opacity 1.6s ease' }}>
            <img src={slide.imagen} alt={slide.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.25) 100%)' }} />
          </div>
        ))}

        {/* Vertical yellow stripe */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'linear-gradient(to bottom, #FACC15, #F59E0B)', zIndex: 3 }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 2,
          height: '100%', display: 'flex', alignItems: 'center',
          padding: '0 clamp(24px, 8vw, 120px)',
        }}>
          <div style={{ maxWidth: '620px' }}>
            <p className="hero-text" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#FACC15', marginBottom: '20px',
            }}>
              GyG Puertas Automáticas · Lima, Perú
            </p>

            <h1 className="hero-text-2" style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 400, lineHeight: 1.0,
              color: '#FFFFFF', margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}>
              {slides[slideActual].titulo}
            </h1>

            <p className="hero-text-3" style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 300,
              color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
              marginBottom: '40px', maxWidth: '500px',
            }}>
              {slides[slideActual].desc}. Instalación profesional en toda Lima con garantía incluida.
            </p>

            <div className="hero-btns" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/cotizar" className="btn-primary" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#FACC15', color: '#111', fontWeight: 700,
                padding: '15px 32px', borderRadius: '6px', textDecoration: 'none',
                fontSize: '15px', transition: 'background 0.2s',
              }}>
                Cotización Gratuita <FaArrowRight size={13} />
              </Link>
              <a href="tel:+51947316864" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                color: '#fff', fontWeight: 500, padding: '15px 28px',
                border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '6px',
                textDecoration: 'none', fontSize: '15px', backdropFilter: 'blur(6px)',
                transition: 'border-color 0.2s',
              }}>
                <FaPhone size={13} /> Llamar ahora
              </a>
            </div>
          </div>
        </div>

        {/* Slide indicator — right side vertical */}
        <div style={{
          position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 3, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center',
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlideActual(i)} style={{
              width: '3px', height: i === slideActual ? '36px' : '12px',
              background: i === slideActual ? '#FACC15' : 'rgba(255,255,255,0.3)',
              border: 'none', borderRadius: '2px', cursor: 'pointer',
              transition: 'height 0.3s ease, background 0.3s ease', padding: 0,
            }} />
          ))}
        </div>

        {/* Slide counter */}
        <div style={{
          position: 'absolute', bottom: '32px', right: '40px', zIndex: 3,
          color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500,
          letterSpacing: '0.1em',
        }}>
          0{slideActual + 1} / 0{slides.length}
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section style={{ background: '#111111', borderBottom: '1px solid #222' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '36px 24px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid #2a2a2a' : 'none',
            }}>
              <p style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: '42px', fontWeight: 400, color: '#FACC15',
                margin: '0 0 6px', lineHeight: 1,
              }}>{s.n}</p>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ POR QUÉ ELEGIRNOS ═══════════════ */}
      <section style={{ padding: 'clamp(64px, 10vw, 112px) clamp(20px, 6vw, 80px)', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end', marginBottom: '64px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '16px' }}>
                Nuestras ventajas
              </p>
              <h2 style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400,
                color: '#111', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em',
              }}>
                ¿Por qué elegirnos?
              </h2>
            </div>
            <p style={{ fontSize: '16px', fontWeight: 300, color: '#777', lineHeight: 1.75, margin: 0 }}>
              Somos tu mejor opción en puertas automáticas en Lima con más de 4 años de experiencia y cientos de clientes satisfechos.
            </p>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {ventajas.map((v, i) => (
              <div key={i} className="card-hover" style={{
                background: '#FFFFFF', borderRadius: '12px',
                padding: '32px 28px', border: '1px solid #EEECEA',
              }}>
                <div style={{
                  width: '40px', height: '40px', background: '#111', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FACC15', marginBottom: '20px',
                }}>
                  {v.icono}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: '0 0 10px' }}>{v.titulo}</h3>
                <p style={{ fontSize: '13px', fontWeight: 300, color: '#888', lineHeight: 1.75, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRODUCTOS ═══════════════ */}
      <section style={{ padding: 'clamp(64px, 10vw, 112px) clamp(20px, 6vw, 80px)', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '14px' }}>
                Lo que ofrecemos
              </p>
              <h2 style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400,
                color: '#111', margin: 0, letterSpacing: '-0.02em',
              }}>
                Nuestros Productos
              </h2>
            </div>
            <Link to="/catalogo" className="btn-dark" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#111', color: '#fff', fontWeight: 600,
              padding: '13px 24px', borderRadius: '6px',
              textDecoration: 'none', fontSize: '13px', transition: 'background 0.2s',
            }}>
              Ver catálogo completo <FaArrowRight size={11} />
            </Link>
          </div>

          {productosDestacados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <FaDoorOpen size={48} style={{ color: '#DDD', marginBottom: '16px' }} />
              <p style={{ color: '#BBB', fontSize: '15px' }}>Cargando productos...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {productosDestacados.slice(0, 6).map((p) => (
                <div key={p.id} className="card-hover" style={{
                  borderRadius: '12px', overflow: 'hidden',
                  border: '1px solid #EEECEA', background: '#FAFAF8',
                }}>
                  <div style={{ height: '200px', background: '#F3F3F1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {p.imagen_principal ? (
                      <img src={getUrl(p.imagen_principal)} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <FaDoorOpen size={48} color="#D1D5DB" />
                    )}
                  </div>
                  <div style={{ padding: '24px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: '#F59E0B',
                      background: '#FFFBEB', padding: '4px 10px', borderRadius: '20px',
                      display: 'inline-block', marginBottom: '12px',
                    }}>{p.uso}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 8px' }}>{p.nombre}</h3>
                    <p style={{ fontSize: '13px', color: '#999', lineHeight: 1.65, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.descripcion}</p>
                    <Link to={`/catalogo/${p.id}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      color: '#111', fontWeight: 700, fontSize: '13px',
                      textDecoration: 'none', borderBottom: '1.5px solid #FACC15', paddingBottom: '1px',
                    }}>
                      Ver detalle <FaArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ PROCESO ═══════════════ */}
      <section style={{ padding: 'clamp(64px, 10vw, 112px) clamp(20px, 6vw, 80px)', background: '#111111' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FACC15', marginBottom: '16px' }}>
              Cómo trabajamos
            </p>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400,
              color: '#fff', margin: 0, letterSpacing: '-0.02em',
            }}>
              Un proceso simple y transparente
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', position: 'relative' }}>
            {/* Connector line */}
            <div style={{
              position: 'absolute', top: '28px', left: '12.5%', right: '12.5%',
              height: '1px', background: 'rgba(250,204,21,0.2)', zIndex: 0,
            }} />

            {pasos.map((p, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div className="step-num" style={{
                  width: '56px', height: '56px',
                  background: '#FACC15', borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '22px', fontWeight: 400, color: '#111',
                  margin: '0 auto 24px', cursor: 'default',
                }}>
                  {p.n}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>{p.titulo}</h3>
                <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MARCAS ═══════════════ */}
      <section style={{ padding: 'clamp(48px, 7vw, 80px) clamp(20px, 6vw, 80px)', background: '#FAFAF8', borderTop: '1px solid #EEECEA' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#BBBBBB', marginBottom: '40px' }}>
            Marcas con las que trabajamos
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
            {marcas.map((m, i) => (
              <div key={i} className="marca-card" style={{
                background: '#FFFFFF', borderRadius: '10px',
                padding: '32px 20px', display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: '12px',
                border: '1.5px solid #EEECEA',
              }}>
                <img src={m.logo} alt={m.nombre} style={{ height: '100px', width: '100%', objectFit: 'contain' }} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#BBBBBB', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{m.pais}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIOS ═══════════════ */}
      <section style={{ padding: 'clamp(64px, 10vw, 112px) clamp(20px, 6vw, 80px)', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '16px' }}>
              Testimonios
            </p>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400,
              color: '#111', margin: 0, letterSpacing: '-0.02em',
            }}>
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {(testimonios.length > 0 ? testimonios : testimoniosDefault).map((t, i) => (
              <div key={i} className="card-hover" style={{
                background: '#FAFAF8', borderRadius: '12px',
                padding: '32px 28px', border: '1px solid #EEECEA',
              }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}>
                  {[...Array(t.estrellas || t.calificacion)].map((_, j) => (
                    <FaStar key={j} size={14} style={{ color: '#FACC15' }} />
                  ))}
                </div>

                <p style={{
                  fontSize: '15px', fontWeight: 300, color: '#555',
                  lineHeight: 1.8, marginBottom: '28px',
                  fontStyle: 'italic',
                }}>
                  "{t.comentario}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: '#111', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: '18px', color: '#FACC15',
                  }}>
                    {(t.nombre || t.nombre_cliente)[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>
                      {t.nombre || t.nombre_cliente}
                    </p>
                    <p style={{ fontSize: '11px', color: '#AAA', margin: 0 }}>Cliente verificado</p>
                  </div>
                  <FaCheckCircle size={15} style={{ color: '#22C55E' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section style={{
        padding: 'clamp(64px, 10vw, 112px) clamp(20px, 6vw, 80px)',
        background: '#111111',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative yellow circle */}
        <div style={{
          position: 'absolute', right: '-80px', top: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FACC15', marginBottom: '20px' }}>
            Contáctanos hoy
          </p>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 400,
            color: '#FFFFFF', margin: '0 0 20px', lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}>
            ¿Listo para automatizar tu puerta?
          </h2>
          <p style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '48px' }}>
            Visita técnica gratuita en toda Lima. Sin compromiso, sin costos ocultos.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/cotizar" className="btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#FACC15', color: '#111', fontWeight: 700,
              padding: '16px 36px', borderRadius: '6px',
              textDecoration: 'none', fontSize: '15px', transition: 'background 0.2s',
            }}>
              Solicitar Cotización <FaArrowRight size={13} />
            </Link>
            <a href="https://wa.me/51947316874" target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#22C55E', color: '#fff', fontWeight: 700,
              padding: '16px 36px', borderRadius: '6px',
              textDecoration: 'none', fontSize: '15px', transition: 'background 0.2s',
            }}>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}