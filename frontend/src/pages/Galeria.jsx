import { useEffect, useState } from 'react'
import { getGaleria } from '../services/contenido'
import { FaTimes, FaExpand, FaDoorOpen, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const getUrl = (url) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`
}

function Galeria() {
  const [galeria, setGaleria] = useState([])
  const [filtro, setFiltro] = useState('')
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null)
  const [indexSeleccionado, setIndexSeleccionado] = useState(null)

  useEffect(() => {
    getGaleria().then(res => setGaleria(res.data))
  }, [])

  const galeriaFiltrada = filtro
    ? galeria.filter(g => g.tipo_puerta?.toLowerCase().includes(filtro.toLowerCase()))
    : galeria

  const abrirImagen = (item, index) => {
    setImagenSeleccionada(item)
    setIndexSeleccionado(index)
  }

  const anterior = () => {
    const nuevoIndex = (indexSeleccionado - 1 + galeriaFiltrada.length) % galeriaFiltrada.length
    setImagenSeleccionada(galeriaFiltrada[nuevoIndex])
    setIndexSeleccionado(nuevoIndex)
  }

  const siguiente = () => {
    const nuevoIndex = (indexSeleccionado + 1) % galeriaFiltrada.length
    setImagenSeleccionada(galeriaFiltrada[nuevoIndex])
    setIndexSeleccionado(nuevoIndex)
  }

  const tipos = ['', 'Puerta Corrediza', 'Portón Levadizo', 'Puerta Batiente', 'Puerta Enrollable', 'Barrera Vehicular']

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
      <Helmet>
        <title>Galería | GyG Puertas Automáticas</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
          .a1{animation:fadeUp .9s .05s cubic-bezier(.22,1,.36,1) both}
          .a2{animation:fadeUp .9s .18s cubic-bezier(.22,1,.36,1) both}
          .a3{animation:fadeUp .9s .30s cubic-bezier(.22,1,.36,1) both}
          
          .filtro-gal{transition:all .2s}
          .filtro-gal:hover{opacity:.85}
          
          .galeria-card{transition:all .25s ease}
          .galeria-card:hover{transform:translateY(-4px);box-shadow:0 24px 56px rgba(0,0,0,.11)}
          .galeria-card:hover .overlay-expand{background:rgba(0,0,0,0.4)!important}
          .galeria-card:hover .icon-expand{opacity:1!important}
          
          .overlay-expand{transition:background .3s}
          .icon-expand{transition:opacity .3s}
          
          .modal-nav-btn{transition:all .2s}
          .modal-nav-btn:hover{background:rgba(250,204,21,0.9)!important}
        `}</style>
      </Helmet>

      {/* HERO */}
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
            Nuestros trabajos
          </p>

          <h1 className="a2" style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(3rem, 7vw, 5.8rem)',
            fontWeight: 400, lineHeight: 1.0,
            color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em',
          }}>
            Galería de<br />
            <span style={{ color: '#FACC15' }}>Trabajos</span>
          </h1>

          <div style={{ width: '52px', height: '3px', background: '#FACC15', margin: '0 auto 28px' }} />

          <p className="a3" style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
            maxWidth: '640px', margin: '0 auto',
          }}>
            Conoce algunos de nuestros trabajos realizados en Lima y alrededores. Calidad garantizada en cada proyecto.
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <section style={{
        padding: '0 clamp(24px, 8vw, 120px)',
        background: '#fff', borderBottom: '1px solid #EEECEA',
        position: 'sticky', top: 0, zIndex: 30,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', gap: '10px', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'center',
          height: '64px',
        }}>
          <span style={{
            fontSize: '12px', fontWeight: 700,
            color: '#888', textTransform: 'uppercase',
            letterSpacing: '0.1em', marginRight: '4px',
          }}>
            Filtrar por tipo:
          </span>
          {tipos.map(tipo => (
            <button
              key={tipo}
              onClick={() => setFiltro(tipo)}
              className="filtro-gal"
              style={{
                padding: '7px 18px', borderRadius: '6px',
                fontSize: '13px', fontWeight: 600,
                background: filtro === tipo ? '#111' : '#FAFAF8',
                color: filtro === tipo ? '#FACC15' : '#555',
                border: filtro === tipo ? '1.5px solid #111' : '1.5px solid #E8E5E0',
                cursor: 'pointer',
              }}
            >
              {tipo === '' ? 'Todos' : tipo}
            </button>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      <section style={{
        padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)',
        background: '#FAFAF8',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {galeriaFiltrada.length === 0 ? (
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
                No hay imágenes disponibles
              </h3>
              <p style={{ fontSize: '15px', fontWeight: 300, color: '#999', margin: 0 }}>
                Vuelve pronto para ver nuestros trabajos.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '14px', fontWeight: 400, color: '#888', marginBottom: '36px' }}>
                <span style={{ fontWeight: 700, color: '#111' }}>{galeriaFiltrada.length}</span>{' '}
                trabajo{galeriaFiltrada.length !== 1 ? 's' : ''} encontrado{galeriaFiltrada.length !== 1 ? 's' : ''}
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
              }}>
                {galeriaFiltrada.map((item, index) => (
                  <div
                    key={item.id}
                    className="galeria-card"
                    onClick={() => abrirImagen(item, index)}
                    style={{
                      background: '#fff', borderRadius: '14px',
                      overflow: 'hidden', border: '1px solid #EEECEA',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      position: 'relative', height: '240px',
                      background: '#F3F3F1', overflow: 'hidden',
                    }}>
                      <img
                        src={getUrl(item.imagen)}
                        alt={item.titulo}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover', display: 'block',
                        }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      <div
                        className="overlay-expand"
                        style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(0,0,0,0)',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FaExpand
                          size={28}
                          color="white"
                          className="icon-expand"
                          style={{ opacity: 0 }}
                        />
                      </div>
                      {item.tipo_puerta && (
                        <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                          <span style={{
                            background: '#FACC15', color: '#111',
                            fontSize: '11px', fontWeight: 700,
                            padding: '4px 12px', borderRadius: '20px',
                          }}>
                            {item.tipo_puerta}
                          </span>
                        </div>
                      )}
                      <div style={{
                        position: 'absolute', top: '14px', right: '14px',
                        background: 'rgba(0,0,0,0.5)', borderRadius: '50%',
                        width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <FaExpand size={14} color="white" />
                      </div>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <h3 style={{
                        fontSize: '17px', fontWeight: 700,
                        color: '#111', margin: '0 0 8px', lineHeight: 1.3,
                      }}>
                        {item.titulo}
                      </h3>
                      {item.descripcion && (
                        <p style={{
                          fontSize: '13px', fontWeight: 300,
                          color: '#999', lineHeight: 1.7, margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {item.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* MODAL */}
      {imagenSeleccionada && (
        <div
          style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: '16px',
            background: 'rgba(0,0,0,0.9)',
          }}
          onClick={() => setImagenSeleccionada(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px',
              overflow: 'hidden', maxWidth: '900px',
              width: '100%', position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'relative', background: '#F3F3F1', maxHeight: '60vh' }}>
              <img
                src={getUrl(imagenSeleccionada.imagen)}
                alt={imagenSeleccionada.titulo}
                style={{
                  width: '100%', height: '100%', maxHeight: '60vh',
                  objectFit: 'contain', display: 'block',
                }}
              />
              <button
                onClick={() => setImagenSeleccionada(null)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(0,0,0,0.6)', color: '#fff',
                  border: 'none', borderRadius: '50%',
                  width: '40px', height: '40px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <FaTimes size={16} />
              </button>
              {galeriaFiltrada.length > 1 && (
                <>
                  <button
                    onClick={anterior}
                    className="modal-nav-btn"
                    style={{
                      position: 'absolute', left: '16px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.6)', color: '#fff',
                      border: 'none', borderRadius: '50%',
                      width: '44px', height: '44px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <FaChevronLeft size={18} />
                  </button>
                  <button
                    onClick={siguiente}
                    className="modal-nav-btn"
                    style={{
                      position: 'absolute', right: '16px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.6)', color: '#fff',
                      border: 'none', borderRadius: '50%',
                      width: '44px', height: '44px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <FaChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            <div style={{ padding: '28px 32px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: '20px',
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '22px', fontWeight: 700,
                    color: '#111', margin: '0 0 8px',
                  }}>
                    {imagenSeleccionada.titulo}
                  </h3>
                  {imagenSeleccionada.descripcion && (
                    <p style={{
                      fontSize: '14px', fontWeight: 300,
                      color: '#666', lineHeight: 1.7, margin: 0,
                    }}>
                      {imagenSeleccionada.descripcion}
                    </p>
                  )}
                </div>
                {imagenSeleccionada.tipo_puerta && (
                  <span style={{
                    background: '#FACC15', color: '#111',
                    fontSize: '11px', fontWeight: 700,
                    padding: '6px 14px', borderRadius: '20px',
                    flexShrink: 0,
                  }}>
                    {imagenSeleccionada.tipo_puerta}
                  </span>
                )}
              </div>
              <p style={{
                fontSize: '12px', fontWeight: 500,
                color: '#BBB', margin: '16px 0 0',
              }}>
                {indexSeleccionado + 1} de {galeriaFiltrada.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Galeria