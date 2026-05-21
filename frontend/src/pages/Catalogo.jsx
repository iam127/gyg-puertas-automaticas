import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRobot, FaBalanceScale, FaQuestion, FaDoorOpen, FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa'
import { getProductos, getCategorias, buscarProductos, getProductosPorUso, buscarInteligente } from '../services/productos'
import { Helmet } from 'react-helmet-async'

const getUrl = (url) => {
  if (!url) return null
  return url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`
}

function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroUso, setFiltroUso] = useState('')
  const [modoIA, setModoIA] = useState(false)
  const [cargandoIA, setCargandoIA] = useState(false)

  useEffect(() => {
    getProductos().then(res => setProductos(res.data))
    getCategorias().then(res => setCategorias(res.data))
  }, [])

  const handleBusqueda = (e) => {
    e.preventDefault()
    if (!busqueda.trim()) {
      getProductos().then(res => setProductos(res.data))
      return
    }
    if (modoIA) {
      setCargandoIA(true)
      buscarInteligente(busqueda)
        .then(res => setProductos(res.data.productos))
        .finally(() => setCargandoIA(false))
    } else {
      buscarProductos(busqueda).then(res => setProductos(res.data))
    }
  }

  const handleFiltroUso = (uso) => {
    setFiltroUso(uso)
    if (uso) {
      getProductosPorUso(uso).then(res => setProductos(res.data))
    } else {
      getProductos().then(res => setProductos(res.data))
    }
  }

  const limpiarBusqueda = () => {
    setBusqueda('')
    setFiltroUso('')
    getProductos().then(res => setProductos(res.data))
  }

  const filtros = [
    { valor: '', label: 'Todos' },
    { valor: 'residencial', label: 'Residencial' },
    { valor: 'comercial', label: 'Comercial' },
    { valor: 'industrial', label: 'Industrial' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
      <Helmet>
        <title>Catálogo | GyG Puertas Automáticas</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
          .a1{animation:fadeUp .9s .05s cubic-bezier(.22,1,.36,1) both}
          .a2{animation:fadeUp .9s .18s cubic-bezier(.22,1,.36,1) both}
          .a3{animation:fadeUp .9s .30s cubic-bezier(.22,1,.36,1) both}
          .a4{animation:fadeUp .9s .42s cubic-bezier(.22,1,.36,1) both}
          
          .prod-card:hover .prod-img { transform: scale(1.05); }
          .prod-card { transition: box-shadow .25s ease, transform .25s ease; }
          .prod-card:hover { box-shadow: 0 24px 56px rgba(0,0,0,0.11); transform: translateY(-4px); }
          .prod-img { transition: transform .5s ease; }
          
          .filtro-btn { transition: all .18s ease; cursor: pointer; border: none; }
          .filtro-btn:hover { opacity: .85; }
          
          .btn-ver:hover { background: #FDE047 !important; }
          .btn-ver { transition: background .2s; }
          .btn-cotizar:hover { background: #222 !important; }
          .btn-cotizar { transition: background .2s; }
          
          .ia-toggle:hover { opacity: .85; }
          .ia-toggle { transition: opacity .2s; cursor: pointer; border: none; }
          
          .limpiar:hover { background: rgba(239,68,68,0.08) !important; }
          .limpiar { transition: background .18s; cursor: pointer; border: none; }
          
          .tool-link:hover { border-color: #FACC15 !important; color: #111 !important; }
          .tool-link { transition: border-color .18s, color .18s; }
          
          .search-input:focus { outline: none; border-color: #FACC15 !important; }
          .btn-buscar:hover { background: #FDE047 !important; }
          .btn-buscar { transition: background .2s; }
        `}</style>
      </Helmet>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section style={{
        background: '#111',
        padding: 'clamp(90px, 14vh, 140px) clamp(24px, 8vw, 120px) clamp(72px, 10vh, 112px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Franja izquierda */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: '4px', background: 'linear-gradient(to bottom, #FACC15, #F59E0B)',
          zIndex: 3,
        }} />

        {/* Círculos decorativos */}
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

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Eyebrow */}
          <p className="a1" style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: '#FACC15', marginBottom: '20px',
          }}>
            Nuestros productos
          </p>

          {/* Headline */}
          <h1 className="a2" style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(3rem, 7vw, 5.8rem)',
            fontWeight: 400, lineHeight: 1.0,
            color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em',
          }}>
            Catálogo de<br />
            <span style={{ color: '#FACC15' }}>Productos</span>
          </h1>

          <div style={{ width: '52px', height: '3px', background: '#FACC15', marginBottom: '28px' }} />

          <p className="a3" style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
            maxWidth: '480px', marginBottom: '48px',
          }}>
            Encuentra la puerta automática ideal para tu hogar o empresa.
            Instalación profesional con garantía incluida.
          </p>

          {/* Buscador */}
          <form onSubmit={handleBusqueda} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              {/* Input */}
              <div style={{ flex: 1, position: 'relative' }}>
                <FaSearch
                  size={15}
                  style={{
                    position: 'absolute', left: '16px',
                    top: '50%', transform: 'translateY(-50%)',
                    color: '#888', pointerEvents: 'none',
                  }}
                />
                <input
                  className="search-input"
                  type="text"
                  placeholder={modoIA ? 'Describe lo que necesitas...' : 'Buscar producto...'}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 16px 14px 44px',
                    borderRadius: '8px', fontSize: '15px',
                    border: '2px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.07)',
                    color: '#fff', boxSizing: 'border-box',
                    transition: 'border-color .2s',
                  }}
                />
              </div>
              {/* Botón buscar */}
              <button
                type="submit"
                disabled={cargandoIA}
                className="btn-buscar"
                style={{
                  background: '#FACC15', color: '#111',
                  fontWeight: 700, fontSize: '15px',
                  padding: '14px 28px', borderRadius: '8px',
                  border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', opacity: cargandoIA ? 0.6 : 1,
                }}
              >
                {cargandoIA ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {/* Toggle IA */}
            <button
              type="button"
              className="ia-toggle"
              onClick={() => setModoIA(!modoIA)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '20px',
                background: modoIA ? '#FACC15' : 'transparent',
                color: modoIA ? '#111' : 'rgba(255,255,255,0.55)',
                border: modoIA ? '1.5px solid #FACC15' : '1.5px solid rgba(255,255,255,0.2)',
                fontSize: '13px', fontWeight: 600,
              }}
            >
              <FaRobot size={13} />
              {modoIA ? 'Búsqueda con IA activada' : 'Activar búsqueda con IA'}
            </button>
          </form>
        </div>
      </section>

      {/* ══════════════════════════════
          BARRA DE FILTROS — sticky
      ══════════════════════════════ */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: '#fff', borderBottom: '1px solid #EEECEA',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 clamp(24px, 8vw, 120px)',
          display: 'flex', alignItems: 'center',
          gap: '10px', flexWrap: 'wrap',
          height: '64px',
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '4px' }}>
            Filtrar:
          </span>

          {filtros.map(({ valor, label }) => (
            <button
              key={valor}
              className="filtro-btn"
              onClick={() => handleFiltroUso(valor)}
              style={{
                padding: '7px 18px', borderRadius: '6px',
                fontSize: '13px', fontWeight: 600,
                background: filtroUso === valor ? '#111' : '#FAFAF8',
                color: filtroUso === valor ? '#FACC15' : '#555',
                border: filtroUso === valor ? '1.5px solid #111' : '1.5px solid #E8E5E0',
              }}
            >
              {label}
            </button>
          ))}

          {(busqueda || filtroUso) && (
            <button
              className="limpiar"
              onClick={limpiarBusqueda}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '6px',
                fontSize: '13px', fontWeight: 600,
                color: '#EF4444', background: 'transparent',
                border: '1.5px solid rgba(239,68,68,0.25)',
              }}
            >
              <FaTimes size={11} /> Limpiar
            </button>
          )}

          {/* Herramientas derecha */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <Link to="/comparador" className="tool-link" style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '7px 16px', borderRadius: '6px',
              fontSize: '13px', fontWeight: 600,
              color: '#666', border: '1.5px solid #E8E5E0',
              textDecoration: 'none', background: '#FAFAF8',
            }}>
              <FaBalanceScale size={13} /> Comparar
            </Link>
            <Link to="/guia" className="tool-link" style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '7px 16px', borderRadius: '6px',
              fontSize: '13px', fontWeight: 600,
              color: '#666', border: '1.5px solid #E8E5E0',
              textDecoration: 'none', background: '#FAFAF8',
            }}>
              <FaQuestion size={13} /> ¿Qué puerta necesito?
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          GRID DE PRODUCTOS
      ══════════════════════════════ */}
      <section style={{
        padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)',
        background: '#FAFAF8', minHeight: '60vh',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {productos.length === 0 ? (
            /* Estado vacío */
            <div style={{ textAlign: 'center', padding: '96px 0' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '20px',
                background: '#F3F3F1', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <FaDoorOpen size={36} color="#CCC" />
              </div>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '28px', fontWeight: 400,
                color: '#111', margin: '0 0 10px',
              }}>
                No se encontraron productos
              </h3>
              <p style={{ fontSize: '15px', fontWeight: 300, color: '#999', marginBottom: '32px' }}>
                Intenta con otros términos de búsqueda o filtros
              </p>
              <button
                onClick={limpiarBusqueda}
                className="btn-buscar"
                style={{
                  background: '#FACC15', color: '#111',
                  fontWeight: 700, fontSize: '15px',
                  padding: '14px 32px', borderRadius: '8px',
                  border: 'none', cursor: 'pointer',
                }}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <>
              {/* Contador */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '36px',
                flexWrap: 'wrap', gap: '12px',
              }}>
                <p style={{ fontSize: '14px', fontWeight: 400, color: '#888', margin: 0 }}>
                  <span style={{ fontWeight: 700, color: '#111' }}>{productos.length}</span>{' '}
                  producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}
                  {filtroUso && (
                    <span style={{
                      marginLeft: '10px', background: '#FFFBEB',
                      color: '#F59E0B', padding: '3px 10px',
                      borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                      textTransform: 'capitalize',
                    }}>
                      {filtroUso}
                    </span>
                  )}
                </p>
              </div>

              {/* Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
              }}>
                {productos.map(producto => (
                  <div
                    key={producto.id}
                    className="prod-card"
                    style={{
                      background: '#fff', borderRadius: '14px',
                      overflow: 'hidden', border: '1px solid #EEECEA',
                    }}
                  >
                    {/* Imagen */}
                    <div style={{ height: '220px', overflow: 'hidden', position: 'relative', background: '#F3F3F1' }}>
                      {producto.imagen_principal ? (
                        <img
                          className="prod-img"
                          src={getUrl(producto.imagen_principal)}
                          alt={producto.nombre}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaDoorOpen size={48} color="#D1D5DB" />
                        </div>
                      )}
                      {/* Badge uso */}
                      <span style={{
                        position: 'absolute', top: '14px', left: '14px',
                        background: '#FACC15', color: '#111',
                        fontSize: '11px', fontWeight: 700,
                        padding: '4px 12px', borderRadius: '20px',
                        textTransform: 'capitalize', letterSpacing: '0.04em',
                      }}>
                        {producto.uso}
                      </span>
                    </div>

                    {/* Contenido */}
                    <div style={{ padding: '24px' }}>
                      <h3 style={{
                        fontSize: '17px', fontWeight: 700,
                        color: '#111', margin: '0 0 8px', lineHeight: 1.3,
                      }}>
                        {producto.nombre}
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
                        {producto.descripcion}
                      </p>

                      {/* Botones */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Link
                          to={`/catalogo/${producto.id}`}
                          className="btn-ver"
                          style={{
                            flex: 1, display: 'inline-flex',
                            alignItems: 'center', justifyContent: 'center', gap: '6px',
                            background: '#FACC15', color: '#111',
                            fontWeight: 700, fontSize: '13px',
                            padding: '11px 0', borderRadius: '8px',
                            textDecoration: 'none',
                          }}
                        >
                          Ver detalle <FaArrowRight size={11} />
                        </Link>
                        <Link
                          to={`/cotizar?producto=${producto.id}`}
                          className="btn-cotizar"
                          style={{
                            flex: 1, display: 'inline-flex',
                            alignItems: 'center', justifyContent: 'center',
                            background: '#111', color: '#fff',
                            fontWeight: 700, fontSize: '13px',
                            padding: '11px 0', borderRadius: '8px',
                            textDecoration: 'none',
                          }}
                        >
                          Cotizar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          CTA FINAL
      ══════════════════════════════ */}
      <section style={{
        padding: 'clamp(72px, 10vw, 112px) clamp(24px, 8vw, 120px)',
        background: '#111', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-80px', top: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FACC15', marginBottom: '20px' }}>
            ¿No encuentras lo que buscas?
          </p>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
            fontWeight: 400, color: '#fff',
            margin: '0 0 20px', lineHeight: 1.05, letterSpacing: '-0.02em',
          }}>
            Te asesoramos sin<br />ningún costo
          </h2>
          <p style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '44px' }}>
            Nuestros técnicos visitan tu domicilio gratis y te recomiendan la solución ideal.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/cotizar"
              className="btn-y"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#FACC15', color: '#111', fontWeight: 700,
                padding: '16px 36px', borderRadius: '8px',
                textDecoration: 'none', fontSize: '15px',
                transition: 'background .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FDE047'}
              onMouseLeave={e => e.currentTarget.style.background = '#FACC15'}
            >
              Solicitar Cotización <FaArrowRight size={13} />
            </Link>
            <a
              href="https://wa.me/51947316874"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#22C55E', color: '#fff', fontWeight: 700,
                padding: '16px 36px', borderRadius: '8px',
                textDecoration: 'none', fontSize: '15px',
              }}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Catalogo