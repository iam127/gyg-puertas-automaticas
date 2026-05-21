import { useState } from 'react'
import { getSeguimiento } from '../services/cotizaciones'
import { getSeguimientoMantenimiento } from '../services/mantenimientos'
import { FaSearch, FaCheckCircle, FaTimesCircle, FaTools, FaFileAlt, FaWhatsapp, FaPhone } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const estadoColor = {
  recibido: '#DBEAFE',
  en_revision: '#FEF3C7',
  visita_agendada: '#E9D5FF',
  cotizado: '#FED7AA',
  aceptado: '#D1FAE5',
  rechazado: '#FEE2E2',
  instalacion_agendada: '#E9D5FF',
  en_instalacion: '#FED7AA',
  completado: '#D1FAE5',
  cancelado: '#FEE2E2',
  en_proceso: '#FED7AA',
  resuelto: '#D1FAE5',
}

const estadoTexto = {
  recibido: '#1E40AF',
  en_revision: '#B45309',
  visita_agendada: '#7C3AED',
  cotizado: '#EA580C',
  aceptado: '#047857',
  rechazado: '#DC2626',
  instalacion_agendada: '#7C3AED',
  en_instalacion: '#EA580C',
  completado: '#047857',
  cancelado: '#DC2626',
  en_proceso: '#EA580C',
  resuelto: '#047857',
}

const pasosCotizacion = [
  { estado: 'recibido', label: 'Recibido' },
  { estado: 'en_revision', label: 'En revisión' },
  { estado: 'visita_agendada', label: 'Visita agendada' },
  { estado: 'cotizado', label: 'Cotizado' },
  { estado: 'aceptado', label: 'Aceptado' },
  { estado: 'instalacion_agendada', label: 'Instalación agendada' },
  { estado: 'completado', label: 'Completado' },
]

const pasosMantenimiento = [
  { estado: 'recibido', label: 'Recibido' },
  { estado: 'en_revision', label: 'En revisión' },
  { estado: 'visita_agendada', label: 'Visita agendada' },
  { estado: 'en_proceso', label: 'En proceso' },
  { estado: 'completado', label: 'Completado' },
]

function BarraProgreso({ pasos, estadoActual }) {
  const indexActual = pasos.findIndex(p => p.estado === estadoActual)
  return (
    <div style={{ 
      display: 'flex', alignItems: 'flex-start', 
      justifyContent: 'space-between', marginBottom: '32px',
      overflowX: 'auto', paddingBottom: '8px',
    }}>
      {pasos.map((paso, i) => (
        <div key={paso.estado} style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, border: '2px solid',
              flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              background: i < indexActual ? '#10B981' : (i === indexActual ? '#FACC15' : '#fff'),
              borderColor: i < indexActual ? '#10B981' : (i === indexActual ? '#FACC15' : '#E8E5E0'),
              color: i < indexActual ? '#fff' : (i === indexActual ? '#111' : '#CCC'),
            }}>
              {i < indexActual ? <FaCheckCircle size={14} /> : i + 1}
            </div>
            <p style={{
              fontSize: '11px', marginTop: '6px', textAlign: 'center',
              width: '64px', lineHeight: 1.3,
              color: i <= indexActual ? '#111' : '#BBB',
              fontWeight: i <= indexActual ? 600 : 400,
            }}>
              {paso.label}
            </p>
          </div>
          {i < pasos.length - 1 && (
            <div style={{
              height: '4px', width: '32px', marginLeft: '4px',
              marginRight: '4px', marginTop: '16px', borderRadius: '10px',
              flexShrink: 0, background: i < indexActual ? '#10B981' : '#E8E5E0',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

function Seguimiento() {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleBuscar = (e) => {
    e.preventDefault()
    setError('')
    setResultado(null)
    setCargando(true)
    if (codigo.startsWith('GYG')) {
      getSeguimiento(codigo)
        .then(res => setResultado({ tipo: 'cotizacion', data: res.data }))
        .catch(() => setError('No se encontró ninguna solicitud con ese código.'))
        .finally(() => setCargando(false))
    } else if (codigo.startsWith('MANT')) {
      getSeguimientoMantenimiento(codigo)
        .then(res => setResultado({ tipo: 'mantenimiento', data: res.data }))
        .catch(() => setError('No se encontró ninguna solicitud con ese código.'))
        .finally(() => setCargando(false))
    } else {
      setError('Código inválido. Debe empezar con GYG o MANT.')
      setCargando(false)
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
      <Helmet>
        <title>Seguimiento | GyG Puertas Automáticas</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
          .a1{animation:fadeUp .9s .05s cubic-bezier(.22,1,.36,1) both}
          .a2{animation:fadeUp .9s .18s cubic-bezier(.22,1,.36,1) both}
          .a3{animation:fadeUp .9s .30s cubic-bezier(.22,1,.36,1) both}
          .a4{animation:fadeUp .9s .42s cubic-bezier(.22,1,.36,1) both}
          
          .input-buscar:focus{outline:none;border-color:#FACC15!important}
          .btn-buscar:hover{background:#FDE047!important}
          .btn-buscar{transition:background .2s}
          .btn-whatsapp:hover{background:#16A34A!important}
          .btn-whatsapp{transition:background .2s}
          .btn-llamar:hover{background:#222!important}
          .btn-llamar{transition:background .2s}
          .btn-contacto:hover{background:#E8E5E0!important}
          .btn-contacto{transition:background .2s}
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
            Estado de tu pedido
          </p>

          <h1 className="a2" style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(3rem, 7vw, 5.8rem)',
            fontWeight: 400, lineHeight: 1.0,
            color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em',
          }}>
            Seguimiento de<br />
            <span style={{ color: '#FACC15' }}>Solicitud</span>
          </h1>

          <div style={{ width: '52px', height: '3px', background: '#FACC15', margin: '0 auto 28px' }} />

          <p className="a3" style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
            maxWidth: '560px', margin: '0 auto 40px',
          }}>
            Ingresa tu código de seguimiento para ver el estado de tu solicitud en tiempo real.
          </p>

          <form onSubmit={handleBuscar} style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <FaSearch style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)', color: '#888',
                  pointerEvents: 'none',
                }} size={16} />
                <input
                  type="text"
                  placeholder="Ej: GYG-2026-0001 o MANT-2026-0001"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  required
                  className="input-buscar"
                  style={{
                    width: '100%', borderRadius: '8px', paddingLeft: '44px',
                    paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px',
                    fontSize: '15px', background: '#fff', color: '#111',
                    border: '2px solid #E8E5E0', boxSizing: 'border-box',
                    transition: 'border-color .2s',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={cargando}
                className="btn-buscar"
                style={{
                  background: '#FACC15', color: '#111',
                  padding: '14px 32px', borderRadius: '8px',
                  fontWeight: 700, fontSize: '15px',
                  border: 'none', cursor: 'pointer',
                  opacity: cargando ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {cargando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <div style={{
              display: 'flex', gap: '24px', fontSize: '13px',
              color: 'rgba(255,255,255,0.5)', justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaFileAlt size={12} style={{ color: '#60A5FA' }} />
                Cotizaciones: GYG-2026-XXXX
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaTools size={12} style={{ color: '#34D399' }} />
                Mantenimientos: MANT-2026-XXXX
              </span>
            </div>
          </form>
        </div>
      </section>

      {error && (
        <section style={{ padding: 'clamp(32px, 5vw, 48px) clamp(24px, 8vw, 120px)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              background: '#FEE2E2', border: '1px solid #FCA5A5',
              color: '#DC2626', padding: '20px 24px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <FaTimesCircle size={20} style={{ flexShrink: 0 }} />
              <p style={{ fontWeight: 600, margin: 0, fontSize: '15px' }}>{error}</p>
            </div>
          </div>
        </section>
      )}

      {resultado && (
        <section style={{
          padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)',
          background: '#FAFAF8',
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              background: '#fff', borderRadius: '16px',
              border: '1px solid #EEECEA', overflow: 'hidden',
            }}>
              <div style={{ background: '#111', padding: '28px 32px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      background: '#FACC15', padding: '12px',
                      borderRadius: '12px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      {resultado.tipo === 'cotizacion'
                        ? <FaFileAlt size={20} color="#111" />
                        : <FaTools size={20} color="#111" />
                      }
                    </div>
                    <div>
                      <p style={{
                        color: 'rgba(255,255,255,0.5)', fontSize: '11px',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        margin: '0 0 4px',
                      }}>
                        {resultado.tipo === 'cotizacion' ? 'Cotización' : 'Mantenimiento'}
                      </p>
                      <p style={{
                        color: '#FACC15', fontWeight: 700,
                        fontSize: '24px', margin: 0,
                      }}>
                        {resultado.data.codigo}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 16px', borderRadius: '20px',
                    fontSize: '11px', fontWeight: 700,
                    background: estadoColor[resultado.data.estado] || '#F3F3F1',
                    color: estadoTexto[resultado.data.estado] || '#666',
                    border: `1px solid ${estadoTexto[resultado.data.estado] || '#E8E5E0'}`,
                  }}>
                    {resultado.data.estado?.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ padding: '32px 32px 8px' }}>
                <p style={{
                  fontSize: '11px', fontWeight: 700,
                  color: '#888', textTransform: 'uppercase',
                  letterSpacing: '0.1em', marginBottom: '20px',
                }}>
                  Progreso de tu solicitud
                </p>
                <BarraProgreso
                  pasos={resultado.tipo === 'cotizacion' ? pasosCotizacion : pasosMantenimiento}
                  estadoActual={resultado.data.estado}
                />
              </div>

              <div style={{ padding: '0 32px 32px' }}>
                <p style={{
                  fontSize: '11px', fontWeight: 700,
                  color: '#888', textTransform: 'uppercase',
                  letterSpacing: '0.1em', marginBottom: '16px',
                }}>
                  Información de la solicitud
                </p>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px', marginBottom: '12px',
                }}>
                  <div style={{
                    background: '#FAFAF8', borderRadius: '12px',
                    padding: '16px', border: '1px solid #EEECEA',
                  }}>
                    <p style={{ color: '#BBB', fontSize: '11px', margin: '0 0 4px' }}>Cliente</p>
                    <p style={{ fontWeight: 700, color: '#111', fontSize: '15px', margin: 0 }}>
                      {resultado.data.nombre_cliente}
                    </p>
                  </div>
                  <div style={{
                    background: '#FAFAF8', borderRadius: '12px',
                    padding: '16px', border: '1px solid #EEECEA',
                  }}>
                    <p style={{ color: '#BBB', fontSize: '11px', margin: '0 0 4px' }}>Teléfono</p>
                    <p style={{ fontWeight: 700, color: '#111', fontSize: '15px', margin: 0 }}>
                      {resultado.data.telefono}
                    </p>
                  </div>
                  <div style={{
                    background: '#FAFAF8', borderRadius: '12px',
                    padding: '16px', border: '1px solid #EEECEA',
                  }}>
                    <p style={{ color: '#BBB', fontSize: '11px', margin: '0 0 4px' }}>Distrito</p>
                    <p style={{ fontWeight: 700, color: '#111', fontSize: '15px', margin: 0 }}>
                      {resultado.data.distrito}
                    </p>
                  </div>
                  <div style={{
                    background: '#FAFAF8', borderRadius: '12px',
                    padding: '16px', border: '1px solid #EEECEA',
                  }}>
                    <p style={{ color: '#BBB', fontSize: '11px', margin: '0 0 4px' }}>Fecha de solicitud</p>
                    <p style={{ fontWeight: 700, color: '#111', fontSize: '15px', margin: 0 }}>
                      {new Date(resultado.data.creado_en).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                </div>

                {resultado.data.descripcion && (
                  <div style={{
                    background: '#FAFAF8', borderRadius: '12px',
                    padding: '16px', marginBottom: '12px',
                    border: '1px solid #EEECEA',
                  }}>
                    <p style={{ color: '#BBB', fontSize: '11px', margin: '0 0 8px' }}>Descripción</p>
                    <p style={{
                      fontWeight: 500, color: '#111',
                      fontSize: '14px', lineHeight: 1.6, margin: 0,
                    }}>
                      {resultado.data.descripcion}
                    </p>
                  </div>
                )}

                {resultado.data.descripcion_problema && (
                  <div style={{
                    background: '#FAFAF8', borderRadius: '12px',
                    padding: '16px', marginBottom: '12px',
                    border: '1px solid #EEECEA',
                  }}>
                    <p style={{ color: '#BBB', fontSize: '11px', margin: '0 0 8px' }}>Problema reportado</p>
                    <p style={{
                      fontWeight: 500, color: '#111',
                      fontSize: '14px', lineHeight: 1.6, margin: 0,
                    }}>
                      {resultado.data.descripcion_problema}
                    </p>
                  </div>
                )}

                {resultado.data.motivo_rechazo && (
                  <div style={{
                    background: '#FEE2E2', border: '1px solid #FCA5A5',
                    borderRadius: '12px', padding: '16px', marginBottom: '12px',
                  }}>
                    <p style={{ color: '#DC2626', fontSize: '11px', margin: '0 0 8px', fontWeight: 700 }}>Motivo de rechazo</p>
                    <p style={{
                      fontWeight: 500, color: '#DC2626',
                      fontSize: '14px', lineHeight: 1.6, margin: 0,
                    }}>
                      {resultado.data.motivo_rechazo}
                    </p>
                  </div>
                )}

                <div style={{
                  background: '#FFFBEB', border: '1px solid #FDE68A',
                  borderRadius: '12px', padding: '20px',
                  marginBottom: '20px', marginTop: '8px', textAlign: 'center',
                }}>
                  <p style={{
                    color: '#92400E', fontSize: '14px',
                    fontWeight: 600, margin: 0,
                  }}>
                    ¿Necesitas ayuda con tu solicitud? Contáctanos directamente.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a
                    href="https://wa.me/51947316874"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-whatsapp"
                    style={{
                      flex: 1, minWidth: '140px',
                      background: '#22C55E', color: '#fff',
                      padding: '14px 0', borderRadius: '8px',
                      fontWeight: 700, textAlign: 'center',
                      fontSize: '14px', textDecoration: 'none',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px',
                    }}
                  >
                    <FaWhatsapp size={16} />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+51947316864"
                    className="btn-llamar"
                    style={{
                      flex: 1, minWidth: '140px',
                      background: '#111', color: '#fff',
                      padding: '14px 0', borderRadius: '8px',
                      fontWeight: 700, textAlign: 'center',
                      fontSize: '14px', textDecoration: 'none',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px',
                    }}
                  >
                    <FaPhone size={14} />
                    Llamar
                  </a>
                  <Link
                    to="/contacto"
                    className="btn-contacto"
                    style={{
                      flex: 1, minWidth: '140px',
                      background: '#FAFAF8', color: '#111',
                      padding: '14px 0', borderRadius: '8px',
                      fontWeight: 700, textAlign: 'center',
                      fontSize: '14px', textDecoration: 'none',
                      display: 'block',
                    }}
                  >
                    Contacto
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Seguimiento