import { FaHammer, FaWrench, FaTools, FaSearchPlus, FaShieldAlt, FaBolt, FaArrowRight, FaMapMarkerAlt, FaCheckCircle, FaPhone, FaQuoteLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import logoCalidad from '../assets/Logo-Calidad.png'
import logoCompromiso from '../assets/Logo-Compromiso.png'
import logoPuntualidad from '../assets/Logo-Puntualidad.png'
import logoGarantia from '../assets/Logo-Garantia.png'

const servicios = [
  { icono: <FaHammer size={22} />, titulo: 'Fabricación', desc: 'Puertas a medida en madera, metal y paneles importados según tus especificaciones.' },
  { icono: <FaWrench size={22} />, titulo: 'Instalación', desc: 'Instalación profesional con materiales de primera calidad y acabados perfectos.' },
  { icono: <FaTools size={22} />, titulo: 'Mantenimiento Preventivo', desc: 'Revisiones periódicas para evitar fallas y prolongar la vida útil de tu puerta.' },
  { icono: <FaSearchPlus size={22} />, titulo: 'Mantenimiento Correctivo', desc: 'Diagnóstico y reparación de cualquier falla de forma rápida y efectiva.' },
  { icono: <FaShieldAlt size={22} />, titulo: 'Garantía y Repuestos', desc: 'Stock de repuestos originales para todas las marcas que trabajamos.' },
  { icono: <FaBolt size={22} />, titulo: 'Emergencias 24/7', desc: 'Disponibles a cualquier hora para atender emergencias con tu puerta automática.' },
]

const valores = [
  { logo: logoCalidad, titulo: 'Calidad' },
  { logo: logoCompromiso, titulo: 'Compromiso' },
  { logo: logoPuntualidad, titulo: 'Puntualidad' },
  { logo: logoGarantia, titulo: 'Garantía' },
]

const distritos = [
  'Miraflores', 'San Isidro', 'Surco', 'La Molina', 'San Borja',
  'Ate', 'Chorrillos', 'Los Olivos', 'SJM', 'Callao',
  'Lince', 'Jesús María', 'Pueblo Libre', 'Magdalena',
]

const timeline = [
  { año: '2022', hito: 'Fundación de GyG', desc: 'Iniciamos operaciones en Lima con un equipo de técnicos especializados.' },
  { año: '2023', hito: 'Expansión de servicios', desc: 'Ampliamos cobertura a toda Lima Metropolitana y sumamos nuevas marcas.' },
  { año: '2024', hito: '500+ clientes', desc: 'Superamos los 500 proyectos completados con satisfacción garantizada.' },
  { año: '2025', hito: 'Líderes en Lima', desc: 'Reconocidos como referentes en automatización de puertas en el mercado peruano.' },
]

export default function Nosotros() {
  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
      <Helmet>
        <title>Nosotros | GyG Puertas Automáticas</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
          .a1{animation:fadeUp .9s .05s cubic-bezier(.22,1,.36,1) both}
          .a2{animation:fadeUp .9s .18s cubic-bezier(.22,1,.36,1) both}
          .a3{animation:fadeUp .9s .30s cubic-bezier(.22,1,.36,1) both}
          .a4{animation:fadeUp .9s .42s cubic-bezier(.22,1,.36,1) both}
          .svc:hover{border-color:#FACC15!important;transform:translateY(-2px)}
          .svc{transition:border-color .2s,transform .2s}
          .btn-y:hover{background:#FDE047!important}
          .btn-y{transition:background .2s}
          .btn-o:hover{border-color:#FACC15!important;color:#FACC15!important}
          .btn-o{transition:border-color .2s,color .2s}
          .dtag:hover{background:#FACC15!important;color:#111!important;border-color:#F59E0B!important}
          .dtag{transition:all .18s}
          .vcard:hover{transform:translateY(-3px)}
          .vcard{transition:transform .2s}
        `}</style>
      </Helmet>

      {/* ══════════════════════════════
          HERO — split layout
      ══════════════════════════════ */}
      <section style={{
        background: '#111',
        minHeight: '88vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Franja izquierda */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'linear-gradient(to bottom, #FACC15, #F59E0B)', zIndex: 4 }} />

        {/* Col izquierda — contenido */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(80px,12vh,140px) clamp(40px,6vw,96px) clamp(80px,12vh,140px) clamp(40px,8vw,120px)',
          position: 'relative', zIndex: 2,
        }}>
          <p className="a1" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FACC15', marginBottom: '28px' }}>
            GyG Puertas Automáticas · Lima, Perú
          </p>

          <h1 className="a2" style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(3.2rem, 6vw, 5.6rem)',
            fontWeight: 400, lineHeight: 1.0,
            color: '#fff', margin: '0 0 32px',
            letterSpacing: '-0.025em',
          }}>
            Más de 4 años<br />
            construyendo<br />
            <em style={{ color: '#FACC15', fontStyle: 'italic' }}>confianza</em>
          </h1>

          <p className="a3" style={{
            fontSize: '17px', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.8,
            maxWidth: '440px', marginBottom: '48px',
          }}>
            Somos la empresa de referencia en automatización de puertas
            en Lima. Instalamos, fabricamos y mantenemos con garantía real.
          </p>

          <div className="a4" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/cotizar" className="btn-y" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#FACC15', color: '#111', fontWeight: 700,
              padding: '15px 32px', borderRadius: '6px',
              textDecoration: 'none', fontSize: '15px',
            }}>
              Cotización Gratuita <FaArrowRight size={13} />
            </Link>
            <a href="tel:+51947316864" className="btn-o" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              color: '#fff', fontWeight: 500,
              padding: '15px 28px',
              border: '1.5px solid rgba(255,255,255,0.28)',
              borderRadius: '6px', textDecoration: 'none', fontSize: '15px',
            }}>
              <FaPhone size={13} /> Llamar ahora
            </a>
          </div>
        </div>

        {/* Col derecha — stats en grid */}
        <div style={{
          display: 'grid', gridTemplateRows: '1fr 1fr',
          borderLeft: '1px solid #222',
          position: 'relative',
        }}>
          {/* Fila superior */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #222' }}>
            <div style={{ padding: '52px 40px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '64px', color: '#FACC15', lineHeight: 1, margin: '0 0 8px' }}>4+</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Años de experiencia</p>
            </div>
            <div style={{ padding: '52px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '64px', color: '#FACC15', lineHeight: 1, margin: '0 0 8px' }}>500+</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Clientes satisfechos</p>
            </div>
          </div>
          {/* Fila inferior */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '52px 40px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '64px', color: '#FACC15', lineHeight: 1, margin: '0 0 8px' }}>43</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Distritos cubiertos</p>
            </div>
            <div style={{ padding: '52px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '64px', color: '#FACC15', lineHeight: 1, margin: '0 0 8px' }}>24/7</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Soporte disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          QUIÉNES SOMOS — texto largo + quote lateral
      ══════════════════════════════ */}
      <section style={{ padding: 'clamp(80px,12vw,140px) clamp(24px,8vw,120px)', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '5fr 4fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '18px' }}>
              Nuestra Historia
            </p>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
              fontWeight: 400, color: '#111',
              margin: '0 0 32px', lineHeight: 1.05, letterSpacing: '-0.02em',
            }}>
              ¿Quiénes Somos?
            </h2>
            <div style={{ width: '52px', height: '3px', background: '#FACC15', marginBottom: '36px' }} />
            <p style={{ fontSize: '17px', fontWeight: 400, color: '#333', lineHeight: 1.9, marginBottom: '22px' }}>
              <strong>GyG Puertas Automáticas</strong> nació en 2022 con una misión clara:
              ofrecer soluciones de automatización de accesos con la más alta calidad
              del mercado peruano, a un precio justo y con garantía real.
            </p>
            <p style={{ fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.9, marginBottom: '22px' }}>
              En pocos años nos convertimos en referentes en Lima, atendiendo proyectos
              residenciales, comerciales e industriales en más de 43 distritos de la capital.
              Nuestro equipo está compuesto por técnicos certificados con experiencia en
              las marcas más reconocidas del mundo.
            </p>
            <p style={{ fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.9 }}>
              Trabajamos con <strong style={{ color: '#111', fontWeight: 600 }}>LiftMaster, CAME, NICE, DEA, BFT y Clopay</strong>,
              garantizando repuestos originales y soporte técnico continuo en cada proyecto.
            </p>
          </div>

          {/* Quote + checklist */}
          <div>
            {/* Quote block */}
            <div style={{
              background: '#111', borderRadius: '14px',
              padding: '40px 36px', marginBottom: '20px',
              position: 'relative',
            }}>
              <FaQuoteLeft size={28} color="#FACC15" style={{ marginBottom: '20px', opacity: 0.7 }} />
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '22px', fontWeight: 400,
                color: '#fff', lineHeight: 1.5,
                margin: '0 0 28px', fontStyle: 'italic',
              }}>
                "Cada puerta que instalamos es una promesa de seguridad y calidad para nuestros clientes."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: '#FACC15', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '20px', color: '#111',
                }}>G</div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>Equipo GyG</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Fundadores</p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ background: '#fff', borderRadius: '14px', padding: '32px 30px', border: '1px solid #EEECEA' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#111', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px' }}>¿Por qué elegirnos?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Más de 4 años en el mercado',
                  'Técnicos certificados y capacitados',
                  'Garantía real en piezas y mano de obra',
                  'Atención en menos de 24 horas',
                  'Soporte técnico disponible 24/7',
                  'Precios competitivos sin costos ocultos',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FaCheckCircle size={15} color="#FACC15" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', fontWeight: 400, color: '#444', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          TIMELINE — nuestra historia
      ══════════════════════════════ */}
      <section style={{ padding: 'clamp(80px,12vw,140px) clamp(24px,8vw,120px)', background: '#fff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end', marginBottom: '72px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '16px' }}>Trayectoria</p>
              <h2 style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
                fontWeight: 400, color: '#111', margin: 0,
                lineHeight: 1.05, letterSpacing: '-0.02em',
              }}>
                Nuestra Historia
              </h2>
            </div>
            <p style={{ fontSize: '16px', fontWeight: 300, color: '#777', lineHeight: 1.75, margin: 0 }}>
              De una pequeña empresa a referente del sector en Lima en solo cuatro años.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', position: 'relative' }}>
            {/* Línea conectora */}
            <div style={{
              position: 'absolute', top: '28px', left: '0', right: '0',
              height: '1px', background: '#E8E5E0', zIndex: 0,
            }} />
            {timeline.map((t, i) => (
              <div key={i} style={{ padding: '0 24px', position: 'relative', zIndex: 1 }}>
                {/* Dot */}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: i === 3 ? '#FACC15' : '#111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '15px', fontWeight: 400,
                  color: i === 3 ? '#111' : '#FACC15',
                  marginBottom: '28px',
                }}>
                  {t.año}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: '0 0 10px' }}>{t.hito}</h3>
                <p style={{ fontSize: '13px', fontWeight: 300, color: '#888', lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          MISIÓN & VISIÓN — asimétrico
      ══════════════════════════════ */}
      <section style={{ padding: 'clamp(80px,12vw,140px) clamp(24px,8vw,120px)', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '16px', textAlign: 'center' }}>Nuestros Pilares</p>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
            fontWeight: 400, color: '#111',
            margin: '0 0 64px', textAlign: 'center', letterSpacing: '-0.02em',
          }}>
            Misión, Visión y Valores
          </h2>

          {/* Misión + Visión lado a lado */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', marginBottom: '20px' }}>
            {/* Misión — más ancha */}
            <div style={{
              background: '#FACC15', borderRadius: '16px',
              padding: '56px 52px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.5)', marginBottom: '16px' }}>01 — Misión</p>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '38px', fontWeight: 400, color: '#111', margin: '0 0 24px' }}>Misión</h3>
              <p style={{ fontSize: '17px', fontWeight: 500, color: 'rgba(17,17,17,0.8)', lineHeight: 1.8, margin: 0, maxWidth: '440px' }}>
                Brindar soluciones integrales en automatización de puertas y accesos,
                garantizando la seguridad, comodidad y satisfacción de nuestros clientes
                mediante productos de calidad y un servicio técnico especializado.
              </p>
            </div>
            {/* Visión — más estrecha */}
            <div style={{
              background: '#111', borderRadius: '16px',
              padding: '56px 44px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', left: '-30px', top: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(250,204,21,0.07)' }} />
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,204,21,0.4)', marginBottom: '16px' }}>02 — Visión</p>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '38px', fontWeight: 400, color: '#fff', margin: '0 0 24px' }}>Visión</h3>
              <p style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.68)', lineHeight: 1.8, margin: 0 }}>
                Ser la empresa líder en automatización en el Perú, reconocida por la
                excelencia, innovación y el compromiso con nuestros clientes.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '48px 44px', border: '1px solid #EEECEA' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '36px', textAlign: 'center' }}>03 — Valores</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {valores.map((v, i) => (
                <div key={i} className="vcard" style={{
                  background: '#FAFAF8', borderRadius: '12px',
                  padding: '32px 20px', textAlign: 'center',
                  border: '1px solid #EEECEA',
                }}>
                  <img src={v.logo} alt={v.titulo} style={{ height: '54px', objectFit: 'contain', marginBottom: '14px', mixBlendMode: 'multiply' }} />
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#111', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{v.titulo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SERVICIOS — dark, grid 3x2
      ══════════════════════════════ */}
      <section style={{ padding: 'clamp(80px,12vw,140px) clamp(24px,8vw,120px)', background: '#111' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end', marginBottom: '64px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FACC15', marginBottom: '16px' }}>Lo que Hacemos</p>
              <h2 style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
                fontWeight: 400, color: '#fff', margin: 0,
                lineHeight: 1.05, letterSpacing: '-0.02em',
              }}>
                Nuestros Servicios
              </h2>
            </div>
            <p style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, margin: 0 }}>
              Desde la fabricación hasta la emergencia nocturna — somos tu aliado completo en automatización.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {servicios.map((s, i) => (
              <div key={i} className="svc" style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '14px', padding: '38px 32px',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{
                  width: '50px', height: '50px', background: '#FACC15',
                  borderRadius: '12px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#111', marginBottom: '24px',
                }}>
                  {s.icono}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>{s.titulo}</h3>
                <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.48)', lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          COBERTURA
      ══════════════════════════════ */}
      <section style={{ padding: 'clamp(80px,12vw,140px) clamp(24px,8vw,120px)', background: '#fff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

            {/* Número grande */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: '#FAFAF8', borderRadius: '20px',
                border: '1px solid #EEECEA',
              }} />
              <div style={{
                position: 'relative', zIndex: 1,
                padding: '64px 56px', textAlign: 'center',
              }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '16px' }}>
                  Dónde Estamos
                </p>
                <p style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(6rem, 12vw, 10rem)',
                  fontWeight: 400, color: '#111',
                  lineHeight: 1, margin: '0 0 8px',
                }}>43</p>
                <p style={{ fontSize: '18px', fontWeight: 300, color: '#888', margin: '0 0 36px' }}>Distritos en Lima</p>
                <div style={{ width: '48px', height: '3px', background: '#FACC15', margin: '0 auto 36px' }} />
                <p style={{ fontSize: '15px', fontWeight: 300, color: '#666', lineHeight: 1.8, margin: 0 }}>
                  Desde Chorrillos hasta Carabayllo, desde Ate hasta La Perla.
                  Visita técnica gratuita coordinada en menos de 24 horas.
                </p>
              </div>
            </div>

            {/* Columna texto + tags */}
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '16px' }}>Nuestra Cobertura</p>
              <h2 style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 400, color: '#111',
                margin: '0 0 24px', lineHeight: 1.05, letterSpacing: '-0.02em',
              }}>
                Atendemos toda<br />Lima Metropolitana
              </h2>
              <div style={{ width: '48px', height: '3px', background: '#FACC15', marginBottom: '32px' }} />
              <p style={{ fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.85, marginBottom: '36px' }}>
                Contamos con técnicos en distintos puntos de Lima para garantizar
                tiempos de respuesta rápidos en cualquier emergencia o instalación.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {distritos.map((d, i) => (
                  <span key={i} className="dtag" style={{
                    background: '#FAFAF8', color: '#444',
                    padding: '8px 18px', borderRadius: '6px',
                    fontSize: '13px', fontWeight: 600,
                    border: '1px solid #E8E5E0', cursor: 'default',
                  }}>
                    {d}
                  </span>
                ))}
                <span style={{
                  background: '#FACC15', color: '#111',
                  padding: '8px 18px', borderRadius: '6px',
                  fontSize: '13px', fontWeight: 700,
                  border: '1px solid #F59E0B',
                }}>
                  + muchos más
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA FINAL
      ══════════════════════════════ */}
      <section style={{
        padding: 'clamp(80px,12vw,140px) clamp(24px,8vw,120px)',
        background: '#111', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '-100px', top: '-100px', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '-80px', bottom: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(250,204,21,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FACC15', marginBottom: '20px' }}>
            Contáctanos hoy
          </p>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
            fontWeight: 400, color: '#fff',
            margin: '0 0 20px', lineHeight: 1.05, letterSpacing: '-0.02em',
          }}>
            ¿Listo para automatizar<br />tu puerta?
          </h2>
          <p style={{ fontSize: '17px', fontWeight: 300, color: 'rgba(255,255,255,0.48)', lineHeight: 1.75, marginBottom: '48px' }}>
            Visita técnica gratuita en toda Lima. Sin compromiso, sin costos ocultos.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/cotizar" className="btn-y" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#FACC15', color: '#111', fontWeight: 700,
              padding: '16px 38px', borderRadius: '6px',
              textDecoration: 'none', fontSize: '15px',
            }}>
              Solicitar Cotización <FaArrowRight size={13} />
            </Link>
            <a href="https://wa.me/51947316874" target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#22C55E', color: '#fff', fontWeight: 700,
              padding: '16px 38px', borderRadius: '6px',
              textDecoration: 'none', fontSize: '15px',
            }}>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}