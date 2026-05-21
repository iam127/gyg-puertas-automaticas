import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getProductosPorUso } from '../services/productos'
import { FaDoorOpen, FaArrowLeft, FaCheckCircle, FaArrowRight } from 'react-icons/fa'

const getUrl = (url) => {
  if (!url) return null
  return url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`
}

const preguntas = [
  {
    id: 1,
    pregunta: '¿Para qué tipo de lugar necesitas la puerta?',
    opciones: [
      { valor: 'residencial', label: '🏠 Casa / Vivienda', desc: 'Cochera, entrada principal o jardín' },
      { valor: 'comercial', label: '🏢 Empresa / Negocio', desc: 'Tienda, oficina o local comercial' },
      { valor: 'industrial', label: '🏭 Industria / Almacén', desc: 'Planta, almacén o zona industrial' },
    ]
  },
  {
    id: 2,
    pregunta: '¿Qué tan grande es el acceso?',
    opciones: [
      { valor: 'pequeno', label: '📏 Pequeño', desc: 'Hasta 2.5 metros de ancho' },
      { valor: 'mediano', label: '📐 Mediano', desc: 'Entre 2.5 y 4 metros de ancho' },
      { valor: 'grande', label: '📊 Grande', desc: 'Más de 4 metros de ancho' },
    ]
  },
  {
    id: 3,
    pregunta: '¿Tienes espacio lateral disponible?',
    opciones: [
      { valor: 'si', label: '✅ Sí tengo espacio lateral', desc: 'Puedo abrir hacia los lados' },
      { valor: 'no', label: '❌ No tengo espacio lateral', desc: 'El espacio es limitado' },
    ]
  },
  {
    id: 4,
    pregunta: '¿Qué material prefieres?',
    opciones: [
      { valor: 'metal', label: '⚙️ Metal / Acero', desc: 'Máxima durabilidad y seguridad' },
      { valor: 'aluminio', label: '✨ Aluminio', desc: 'Ligero y moderno' },
      { valor: 'vidrio', label: '🪟 Vidrio templado', desc: 'Elegante y luminoso' },
      { valor: 'indiferente', label: '🤷 Me es indiferente', desc: 'Lo que mejor se adapte' },
    ]
  },
  {
    id: 5,
    pregunta: '¿Necesitas automatización con control remoto?',
    opciones: [
      { valor: 'si', label: '📡 Sí, con control remoto', desc: 'Apertura automática sin bajarse del auto' },
      { valor: 'no', label: '🚪 No, manual está bien', desc: 'Operación manual es suficiente' },
    ]
  },
]

const recomendaciones = {
  residencial: {
    pequeno: { tipo: 'Puerta Corrediza', uso: 'residencial', palabraClave: 'corrediza', desc: 'Ideal para cocheras pequeñas de viviendas. Motor silencioso y apertura suave.' },
    mediano: { tipo: 'Portón Levadizo', uso: 'residencial', palabraClave: 'levadizo', desc: 'Perfecta para accesos medianos en viviendas. No invade la vereda al abrir.' },
    grande: { tipo: 'Portón Corredizo', uso: 'residencial', palabraClave: 'corredizo', desc: 'Ideal para accesos grandes en viviendas con espacio lateral disponible.' },
  },
  comercial: {
    pequeno: { tipo: 'Puerta Batiente', uso: 'comercial', palabraClave: 'batiente', desc: 'Ideal para locales comerciales con accesos pequeños y tráfico peatonal.' },
    mediano: { tipo: 'Puerta Corrediza', uso: 'comercial', palabraClave: 'corrediza', desc: 'Perfecta para empresas con accesos medianos y tráfico frecuente.' },
    grande: { tipo: 'Puerta Enrollable', uso: 'comercial', palabraClave: 'enrollable', desc: 'Diseñada para grandes accesos en establecimientos comerciales.' },
  },
  industrial: {
    pequeno: { tipo: 'Puerta Enrollable', uso: 'industrial', palabraClave: 'enrollable', desc: 'Robusta y duradera para uso industrial intensivo.' },
    mediano: { tipo: 'Portón Levadizo Seccional', uso: 'industrial', palabraClave: 'seccional', desc: 'Perfecta para almacenes y plantas industriales de tamaño mediano.' },
    grande: { tipo: 'Barrera Vehicular', uso: 'comercial', palabraClave: 'barrera', desc: 'Ideal para grandes accesos industriales con alto tráfico vehicular.' },
  },
}

function GuiaPuerta() {
  const [paso, setPaso] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [resultado, setResultado] = useState(null)
  const [productosRecomendados, setProductosRecomendados] = useState([])
  const [cargando, setCargando] = useState(false)

  const handleRespuesta = (valor) => {
    const nuevasRespuestas = { ...respuestas, [preguntas[paso].id]: valor }
    setRespuestas(nuevasRespuestas)

    if (paso < preguntas.length - 1) {
      setPaso(paso + 1)
    } else {
      const uso = nuevasRespuestas[1]
      const tamano = nuevasRespuestas[2]
      const recomendacion = recomendaciones[uso]?.[tamano] || {
        tipo: 'Consulta personalizada',
        uso: uso || 'residencial',
        palabraClave: '',
        desc: 'Según tus necesidades específicas, te recomendamos contactarnos para una asesoría personalizada gratuita.'
      }
      setResultado(recomendacion)

      // Buscar productos reales en la BD
      setCargando(true)
      getProductosPorUso(recomendacion.uso)
        .then(res => {
          const todos = res.data
          // Filtrar por palabra clave si existe
          if (recomendacion.palabraClave) {
            const filtrados = todos.filter(p =>
              p.nombre.toLowerCase().includes(recomendacion.palabraClave.toLowerCase()) ||
              p.descripcion?.toLowerCase().includes(recomendacion.palabraClave.toLowerCase())
            )
            setProductosRecomendados(filtrados.length > 0 ? filtrados.slice(0, 3) : todos.slice(0, 3))
          } else {
            setProductosRecomendados(todos.slice(0, 3))
          }
        })
        .finally(() => setCargando(false))
    }
  }

  const reiniciar = () => {
    setPaso(0)
    setRespuestas({})
    setResultado(null)
    setProductosRecomendados([])
  }

  if (resultado) {
    return (
      <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
        <Helmet>
          <title>¿Qué puerta necesito? | GyG Puertas Automáticas</title>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
          <style>{`
            .btn-ver-det:hover{background:#F3F3F1!important}
            .btn-ver-det{transition:background .2s}
            .btn-cotizar-g:hover{background:#FDE047!important}
            .btn-cotizar-g{transition:background .2s}
            .btn-catalogo:hover{background:#FDE047!important}
            .btn-catalogo{transition:background .2s}
            .btn-solicitar:hover{background:#222!important}
            .btn-solicitar{transition:background .2s}
            .btn-reiniciar:hover{border-color:#FACC15!important;color:#111!important}
            .btn-reiniciar{transition:all .2s}
            .prod-card-guia:hover{transform:translateY(-4px);box-shadow:0 24px 56px rgba(0,0,0,.11)}
            .prod-card-guia{transition:all .25s ease}
          `}</style>
        </Helmet>

        <section style={{
          background: '#111',
          padding: 'clamp(80px, 12vh, 120px) clamp(24px, 8vw, 120px) clamp(60px, 8vh, 80px)',
          position: 'relative', overflow: 'hidden', textAlign: 'center',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: '4px', background: 'linear-gradient(to bottom, #FACC15, #F59E0B)',
            zIndex: 3,
          }} />

          <div style={{
            position: 'absolute', right: '-100px', top: '-100px',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250,204,21,0.09) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              width: '72px', height: '72px',
              background: '#FACC15', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <FaCheckCircle size={36} color="#111" />
            </div>

            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#FACC15', marginBottom: '20px',
            }}>
              Resultado del quiz
            </p>

            <h1 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 400, lineHeight: 1.1,
              color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em',
            }}>
              Te recomendamos una<br />
              <span style={{ color: '#FACC15' }}>{resultado.tipo}</span>
            </h1>

            <p style={{
              fontSize: '16px', fontWeight: 300,
              color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
              maxWidth: '600px', margin: '0 auto',
            }}>
              {resultado.desc}
            </p>
          </div>
        </section>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)' }}>

          {/* PRODUCTOS RECOMENDADOS */}
          {cargando ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
              <div style={{
                width: '40px', height: '40px',
                border: '3px solid #FACC15',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : productosRecomendados.length > 0 ? (
            <div style={{ marginBottom: '64px' }}>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 400, color: '#111',
                margin: '0 0 12px', letterSpacing: '-0.02em',
              }}>
                Productos disponibles para ti
              </h2>
              <p style={{ fontSize: '15px', fontWeight: 300, color: '#888', marginBottom: '40px' }}>
                Estos son los productos de nuestro catálogo que mejor se adaptan a tus necesidades
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
              }}>
                {productosRecomendados.map(p => (
                  <div key={p.id} className="prod-card-guia" style={{
                    background: '#fff', borderRadius: '14px',
                    overflow: 'hidden', border: '1px solid #EEECEA',
                  }}>
                    <div style={{ height: '200px', background: '#F3F3F1' }}>
                      {p.imagen_principal ? (
                        <img
                          src={getUrl(p.imagen_principal)}
                          alt={p.nombre}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaDoorOpen size={48} color="#D1D5DB" />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '24px' }}>
                      <span style={{
                        background: '#FFFBEB', color: '#F59E0B',
                        fontSize: '11px', fontWeight: 700,
                        padding: '4px 12px', borderRadius: '20px',
                        textTransform: 'capitalize', display: 'inline-block',
                        marginBottom: '12px',
                      }}>
                        {p.uso}
                      </span>
                      <h3 style={{
                        fontSize: '17px', fontWeight: 700,
                        color: '#111', margin: '0 0 8px', lineHeight: 1.3,
                      }}>
                        {p.nombre}
                      </h3>
                      <p style={{
                        fontSize: '13px', fontWeight: 300,
                        color: '#999', lineHeight: 1.7,
                        margin: '0 0 20px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {p.descripcion}
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Link
                          to={`/catalogo/${p.id}`}
                          className="btn-ver-det"
                          style={{
                            flex: 1, textAlign: 'center',
                            background: '#FAFAF8', color: '#666',
                            padding: '11px 0', borderRadius: '8px',
                            fontWeight: 700, fontSize: '13px',
                            textDecoration: 'none', display: 'block',
                          }}
                        >
                          Ver detalle
                        </Link>
                        <Link
                          to={`/cotizar?producto=${p.id}`}
                          className="btn-cotizar-g"
                          style={{
                            flex: 1, textAlign: 'center',
                            background: '#FACC15', color: '#111',
                            padding: '11px 0', borderRadius: '8px',
                            fontWeight: 700, fontSize: '13px',
                            textDecoration: 'none', display: 'block',
                          }}
                        >
                          Cotizar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '64px 32px',
              background: '#FAFAF8', borderRadius: '16px',
              border: '1px solid #EEECEA', marginBottom: '64px',
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '20px',
                background: '#F3F3F1', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <FaDoorOpen size={36} color="#CCC" />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#888', margin: 0 }}>
                No encontramos productos exactos pero podemos asesorarte
              </p>
            </div>
          )}

          {/* ACCIONES */}
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: '12px',
          }}>
            <Link
              to="/catalogo"
              className="btn-catalogo"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#FACC15', color: '#111',
                padding: '14px 32px', borderRadius: '8px',
                fontWeight: 700, fontSize: '15px',
                textDecoration: 'none',
              }}
            >
              Ver catálogo completo <FaArrowRight size={12} />
            </Link>
            <Link
              to="/cotizar"
              className="btn-solicitar"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#111', color: '#fff',
                padding: '14px 32px', borderRadius: '8px',
                fontWeight: 700, fontSize: '15px',
                textDecoration: 'none',
              }}
            >
              Solicitar cotización
            </Link>
            <button
              onClick={reiniciar}
              className="btn-reiniciar"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                border: '2px solid #E8E5E0',
                background: 'transparent', color: '#666',
                padding: '14px 32px', borderRadius: '8px',
                fontWeight: 700, fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Volver a empezar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const preguntaActual = preguntas[paso]

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
      <Helmet>
        <title>¿Qué puerta necesito? | GyG Puertas Automáticas</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
          .a1{animation:fadeUp .9s .05s cubic-bezier(.22,1,.36,1) both}
          .a2{animation:fadeUp .9s .18s cubic-bezier(.22,1,.36,1) both}
          .a3{animation:fadeUp .9s .30s cubic-bezier(.22,1,.36,1) both}
          
          .opcion-btn:hover{border-color:#FACC15!important;background:#FFFBEB!important}
          .opcion-btn{transition:all .2s}
          .btn-anterior:hover{color:#FACC15!important}
          .btn-anterior{transition:color .2s}
        `}</style>
      </Helmet>

      <section style={{
        background: '#111',
        padding: 'clamp(90px, 14vh, 140px) clamp(24px, 8vw, 120px) clamp(72px, 10vh, 112px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: '4px', background: 'linear-gradient(to bottom, #FACC15, #F59E0B)',
          zIndex: 3,
        }} />

        <div style={{
          position: 'absolute', right: '-100px', top: '-100px',
          width: '480px', height: '480px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(250,204,21,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '-60px', bottom: '-60px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(250,204,21,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p className="a1" style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: '#FACC15', marginBottom: '20px',
          }}>
            Asesor virtual
          </p>

          <h1 className="a2" style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(3rem, 7vw, 5.8rem)',
            fontWeight: 400, lineHeight: 1.0,
            color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em',
          }}>
            ¿Qué puerta<br />
            <span style={{ color: '#FACC15' }}>necesito?</span>
          </h1>

          <div style={{ width: '52px', height: '3px', background: '#FACC15', margin: '0 auto 28px' }} />

          <p className="a3" style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
            maxWidth: '560px', margin: '0 auto',
          }}>
            Responde estas preguntas y te recomendaremos el producto ideal de nuestro catálogo.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)' }}>

        {/* BARRA DE PROGRESO */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
          {preguntas.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '6px', borderRadius: '10px',
              overflow: 'hidden', background: '#E8E5E0',
            }}>
              <div style={{
                height: '100%', background: '#FACC15',
                transition: 'width 0.5s ease',
                width: i <= paso ? '100%' : '0%',
              }} />
            </div>
          ))}
        </div>

        <div style={{
          background: '#fff', borderRadius: '16px',
          border: '1px solid #EEECEA', padding: '48px 44px',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: '#BBB', marginBottom: '8px',
          }}>
            Pregunta {paso + 1} de {preguntas.length}
          </p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 400, color: '#111',
            margin: '0 0 32px', lineHeight: 1.2,
          }}>
            {preguntaActual.pregunta}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {preguntaActual.opciones.map(opcion => (
              <button
                key={opcion.valor}
                onClick={() => handleRespuesta(opcion.valor)}
                className="opcion-btn"
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '20px 24px', borderRadius: '12px',
                  border: '2px solid #E8E5E0',
                  background: '#fff', cursor: 'pointer',
                }}
              >
                <div style={{
                  fontSize: '15px', fontWeight: 700,
                  color: '#111', marginBottom: '4px',
                }}>
                  {opcion.label}
                </div>
                {opcion.desc && (
                  <div style={{
                    fontSize: '13px', fontWeight: 300,
                    color: '#888', lineHeight: 1.5,
                  }}>
                    {opcion.desc}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {paso > 0 && (
          <button
            onClick={() => setPaso(paso - 1)}
            className="btn-anterior"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              marginTop: '24px', background: 'transparent',
              border: 'none', color: '#888',
              fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <FaArrowLeft size={12} /> Pregunta anterior
          </button>
        )}
      </div>
    </div>
  )
}

export default GuiaPuerta