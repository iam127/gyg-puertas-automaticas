import { useEffect, useState } from 'react'
import { getProductos } from '../services/productos'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaCheck, FaTimes, FaDoorOpen, FaBalanceScale, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const getUrl = (url) => {
  if (!url) return null
  return url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`
}

function Comparador() {
  const [productos, setProductos] = useState([])
  const [seleccionados, setSeleccionados] = useState([])
  const [comparando, setComparando] = useState(false)

  useEffect(() => {
    getProductos().then(res => setProductos(res.data))
  }, [])

  const toggleSeleccionar = (producto) => {
    if (seleccionados.find(p => p.id === producto.id)) {
      setSeleccionados(seleccionados.filter(p => p.id !== producto.id))
    } else {
      if (seleccionados.length < 3) {
        setSeleccionados([...seleccionados, producto])
      }
    }
  }

  const isSeleccionado = (id) => seleccionados.some(p => p.id === id)

  const filas = [
    { campo: 'uso', label: 'Tipo de uso' },
    { campo: 'material', label: 'Material' },
    { campo: 'categoria_nombre', label: 'Categoría' },
    { campo: 'descripcion', label: 'Descripción' },
    { campo: 'especificaciones', label: 'Especificaciones técnicas' },
  ]

  if (comparando && seleccionados.length >= 2) {
    return (
      <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
        <Helmet>
          <title>Comparador | GyG Puertas Automáticas</title>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
          <style>{`
            .btn-volver:hover{background:rgba(255,255,255,.08)!important}
            .btn-volver{transition:background .2s}
            .btn-cotizar-comp:hover{background:#FDE047!important}
            .btn-cotizar-comp{transition:background .2s}
          `}</style>
        </Helmet>

        {/* HERO */}
        <section style={{
          background: '#111',
          padding: 'clamp(80px, 12vh, 120px) clamp(24px, 8vw, 120px) clamp(60px, 8vh, 80px)',
          position: 'relative', overflow: 'hidden',
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

          <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#FACC15', marginBottom: '20px',
            }}>
              Resultado de comparación
            </p>

            <h1 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 400, lineHeight: 1.1,
              color: '#fff', margin: '0 0 16px', letterSpacing: '-0.025em',
            }}>
              Comparando <span style={{ color: '#FACC15' }}>{seleccionados.length} productos</span>
            </h1>

            <p style={{
              fontSize: '16px', fontWeight: 300,
              color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
              margin: 0,
            }}>
              Analiza las diferencias y elige el que mejor se adapta a ti
            </p>
          </div>
        </section>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)' }}>
          <button
            onClick={() => setComparando(false)}
            className="btn-volver"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent', color: '#666',
              border: '1.5px solid #E8E5E0', borderRadius: '8px',
              padding: '12px 24px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', marginBottom: '40px',
            }}
          >
            <FaArrowLeft size={12} /> Volver a selección
          </button>

          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid #EEECEA', background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{
                    textAlign: 'left', padding: '24px',
                    background: '#111', color: 'rgba(255,255,255,0.4)',
                    fontSize: '11px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    width: '180px', borderTopLeftRadius: '16px',
                  }}>
                    Característica
                  </th>
                  {seleccionados.map((p, i) => (
                    <th key={p.id} style={{
                      padding: '24px', background: '#111', textAlign: 'center',
                      borderTopRightRadius: i === seleccionados.length - 1 ? '16px' : '0',
                    }}>
                      <div style={{
                        height: '140px', borderRadius: '12px',
                        overflow: 'hidden', marginBottom: '16px',
                        background: '#F3F3F1',
                      }}>
                        {p.imagen_principal ? (
                          <img
                            src={getUrl(p.imagen_principal)}
                            alt={p.nombre}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaDoorOpen size={40} color="#999" />
                          </div>
                        )}
                      </div>
                      <div style={{
                        color: '#fff', fontWeight: 700,
                        fontSize: '15px', lineHeight: 1.3, marginBottom: '12px',
                      }}>
                        {p.nombre}
                      </div>
                      <span style={{
                        background: '#FACC15', color: '#111',
                        fontSize: '11px', fontWeight: 700,
                        padding: '4px 12px', borderRadius: '20px',
                        textTransform: 'capitalize',
                      }}>
                        {p.uso}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((fila, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAF8' }}>
                    <td style={{
                      padding: '20px 24px', fontWeight: 700,
                      color: '#111', fontSize: '14px',
                      borderRight: '1px solid #EEECEA',
                    }}>
                      {fila.label}
                    </td>
                    {seleccionados.map(p => (
                      <td key={p.id} style={{
                        padding: '20px 24px', textAlign: 'center',
                        color: '#666', fontSize: '14px',
                        borderRight: '1px solid #EEECEA',
                      }}>
                        {p[fila.campo] ? (
                          fila.campo === 'uso' ? (
                            <span style={{
                              background: '#FFFBEB', color: '#F59E0B',
                              padding: '4px 12px', borderRadius: '20px',
                              fontSize: '12px', fontWeight: 700,
                              textTransform: 'capitalize',
                            }}>
                              {p[fila.campo]}
                            </span>
                          ) : (
                            p[fila.campo]
                          )
                        ) : (
                          <span style={{ color: '#DDD' }}>—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* FILA DESTACADO */}
                <tr style={{ background: '#fff' }}>
                  <td style={{
                    padding: '20px 24px', fontWeight: 700,
                    color: '#111', fontSize: '14px',
                    borderRight: '1px solid #EEECEA',
                  }}>
                    Destacado
                  </td>
                  {seleccionados.map(p => (
                    <td key={p.id} style={{
                      padding: '20px 24px', textAlign: 'center',
                      borderRight: '1px solid #EEECEA',
                    }}>
                      {p.destacado ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          background: '#D1FAE5', color: '#047857',
                          padding: '6px 14px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: 700,
                        }}>
                          <FaCheck size={10} /> Sí
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          background: '#F3F3F1', color: '#999',
                          padding: '6px 14px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: 700,
                        }}>
                          <FaTimes size={10} /> No
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* FILA ACCION */}
                <tr style={{ background: '#111' }}>
                  <td style={{
                    padding: '24px', color: 'rgba(255,255,255,0.4)',
                    fontWeight: 700, fontSize: '14px',
                    borderBottomLeftRadius: '16px',
                  }}>
                    Acción
                  </td>
                  {seleccionados.map((p, i) => (
                    <td key={p.id} style={{
                      padding: '24px', textAlign: 'center',
                      borderBottomRightRadius: i === seleccionados.length - 1 ? '16px' : '0',
                    }}>
                      <Link
                        to={`/cotizar?producto=${p.id}`}
                        className="btn-cotizar-comp"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          background: '#FACC15', color: '#111',
                          padding: '12px 24px', borderRadius: '8px',
                          fontWeight: 700, fontSize: '14px',
                          textDecoration: 'none',
                        }}
                      >
                        Cotizar este <FaArrowRight size={11} />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
      <Helmet>
        <title>Comparador | GyG Puertas Automáticas</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
          .a1{animation:fadeUp .9s .05s cubic-bezier(.22,1,.36,1) both}
          .a2{animation:fadeUp .9s .18s cubic-bezier(.22,1,.36,1) both}
          .a3{animation:fadeUp .9s .30s cubic-bezier(.22,1,.36,1) both}
          
          .prod-card-comp:hover{box-shadow:0 24px 56px rgba(0,0,0,.11);transform:translateY(-4px)}
          .prod-card-comp{transition:box-shadow .25s ease,transform .25s ease}
          .prod-card-comp.selected{border-color:#FACC15!important}
          
          .btn-select:hover{background:#FDE047!important;border-color:#FDE047!important}
          .btn-select{transition:all .2s}
          .btn-limpiar:hover{background:rgba(239,68,68,0.08)!important}
          .btn-limpiar{transition:background .2s}
          .btn-comparar:hover{background:#FDE047!important}
          .btn-comparar{transition:background .2s}
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
            Herramienta
          </p>

          <h1 className="a2" style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(3rem, 7vw, 5.8rem)',
            fontWeight: 400, lineHeight: 1.0,
            color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em',
          }}>
            Comparador de<br />
            <span style={{ color: '#FACC15' }}>Productos</span>
          </h1>

          <div style={{ width: '52px', height: '3px', background: '#FACC15', margin: '0 auto 28px' }} />

          <p className="a3" style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
            maxWidth: '560px', margin: '0 auto',
          }}>
            Selecciona hasta 3 productos para comparar sus características y encontrar la puerta ideal para tu proyecto.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)' }}>

        {/* BARRA DE SELECCIONADOS */}
        {seleccionados.length > 0 && (
          <div style={{
            background: '#111', borderRadius: '16px',
            padding: '24px 28px', marginBottom: '40px',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: '20px', flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px',
                background: '#FACC15', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FaBalanceScale size={20} color="#111" />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px', margin: 0 }}>
                  {seleccionados.length} de 3 productos seleccionados
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '4px 0 0' }}>
                  {seleccionados.map(p => p.nombre).join(' · ')}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setSeleccionados([])}
                className="btn-limpiar"
                style={{
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  background: 'transparent', color: 'rgba(255,255,255,0.6)',
                  padding: '10px 20px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Limpiar
              </button>
              {seleccionados.length >= 2 && (
                <button
                  onClick={() => setComparando(true)}
                  className="btn-comparar"
                  style={{
                    background: '#FACC15', color: '#111',
                    padding: '10px 24px', borderRadius: '8px',
                    fontSize: '14px', fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  Comparar ahora
                </button>
              )}
            </div>
          </div>
        )}

        {/* INSTRUCCION */}
        {seleccionados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', marginBottom: '32px' }}>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
              Haz clic en <strong style={{ color: '#111' }}>Seleccionar</strong> en los productos que quieres comparar
            </p>
          </div>
        )}

        {productos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '96px 0' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '20px',
              background: '#F3F3F1', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <FaDoorOpen size={36} color="#CCC" />
            </div>
            <p style={{ color: '#999', fontSize: '15px' }}>No hay productos disponibles aún.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {productos.map(producto => {
              const selec = isSeleccionado(producto.id)
              const bloqueado = !selec && seleccionados.length >= 3
              return (
                <div
                  key={producto.id}
                  className={`prod-card-comp ${selec ? 'selected' : ''}`}
                  style={{
                    background: '#fff', borderRadius: '14px',
                    overflow: 'hidden',
                    border: selec ? '2px solid #FACC15' : '1px solid #EEECEA',
                  }}
                >
                  <div style={{ position: 'relative', height: '220px', background: '#F3F3F1' }}>
                    {producto.imagen_principal ? (
                      <img
                        src={getUrl(producto.imagen_principal)}
                        alt={producto.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaDoorOpen size={48} color="#D1D5DB" />
                      </div>
                    )}
                    {selec && (
                      <div style={{
                        position: 'absolute', top: '14px', right: '14px',
                        background: '#FACC15', borderRadius: '50%',
                        width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <FaCheck size={16} color="#111" />
                      </div>
                    )}
                    <span style={{
                      position: 'absolute', top: '14px', left: '14px',
                      background: '#FACC15', color: '#111',
                      fontSize: '11px', fontWeight: 700,
                      padding: '4px 12px', borderRadius: '20px',
                      textTransform: 'capitalize',
                    }}>
                      {producto.uso}
                    </span>
                  </div>

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
                      margin: '0 0 12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {producto.descripcion}
                    </p>
                    {producto.material && (
                      <p style={{
                        fontSize: '12px', color: '#BBB',
                        margin: '0 0 20px',
                      }}>
                        Material: {producto.material}
                      </p>
                    )}
                    <button
                      onClick={() => toggleSeleccionar(producto)}
                      disabled={bloqueado}
                      className="btn-select"
                      style={{
                        width: '100%', padding: '12px 0',
                        borderRadius: '8px', fontWeight: 700,
                        fontSize: '14px', cursor: bloqueado ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '8px',
                        background: selec ? '#FACC15' : (bloqueado ? '#F3F3F1' : 'transparent'),
                        color: selec ? '#111' : (bloqueado ? '#CCC' : '#666'),
                        border: selec ? '2px solid #FACC15' : (bloqueado ? '2px solid #F3F3F1' : '2px solid #E8E5E0'),
                      }}
                    >
                      {selec ? (
                        <><FaCheck size={12} /> Seleccionado</>
                      ) : bloqueado ? (
                        'Máximo 3 productos'
                      ) : (
                        'Seleccionar'
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Comparador