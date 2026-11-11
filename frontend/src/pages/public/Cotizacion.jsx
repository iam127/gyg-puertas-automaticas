import { useState, useEffect } from 'react'
import { crearCotizacion } from '../../services/cotizaciones'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaHome, FaBuilding, FaIndustry } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const TIPOS_USO = [
  { value: 'residencial', label: 'Residencial', icono: <FaHome size={24} />, desc: 'Para tu hogar o cochera', colorBg: '#FFFBEB', colorIcon: '#F59E0B', colorBorder: '#FACC15', badgeBg: '#FEF08A', badgeText: '#92400E' },
  { value: 'comercial', label: 'Comercial', icono: <FaBuilding size={24} />, desc: 'Para tu negocio o empresa', colorBg: '#FFFBEB', colorIcon: '#F59E0B', colorBorder: '#FACC15', badgeBg: '#FEF08A', badgeText: '#92400E' },
  { value: 'industrial', label: 'Industrial', icono: <FaIndustry size={24} />, desc: 'Para uso industrial o almacén', colorBg: '#FFFBEB', colorIcon: '#F59E0B', colorBorder: '#FACC15', badgeBg: '#FEF08A', badgeText: '#92400E' },
]

const DISTRITOS_LIMA = [
  'Ate', 'Barranco', 'Bellavista', 'Breña', 'Carabayllo',
  'Carmen de la Legua', 'Cercado de Lima', 'Chaclacayo', 'Chorrillos', 'Cieneguilla',
  'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina',
  'La Perla', 'La Victoria', 'Lince', 'Los Olivos', 'Lurigancho-Chosica',
  'Lurín', 'Magdalena del Mar', 'Mi Perú', 'Miraflores', 'Pachacámac',
  'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Rímac', 'San Borja',
  'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis', 'San Martín de Porres',
  'San Miguel', 'Santa Anita', 'Santiago de Surco', 'Surquillo', 'Ventanilla',
  'Villa El Salvador', 'Villa María del Triunfo', 'Callao',
]

const TURNOS = [
  { value: 'manana', label: 'Mañana', sub: '8am – 12pm' },
  { value: 'tarde', label: 'Tarde', sub: '12pm – 6pm' },
  { value: 'cualquiera', label: 'Cualquier hora', sub: 'Flexible' },
]

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function Cotizacion() {
  const [form, setForm] = useState({
    nombre_cliente: '',
    telefono: '',
    correo: '',
    direccion: '',
    distrito: '',
    referencias: '',
    tipo_uso: '',
    descripcion: '',
    disponibilidad: '',
  })
  const [turno, setTurno] = useState('')
  const [diasSeleccionados, setDiasSeleccionados] = useState([])

  const toggleDia = (dia) => {
    setDiasSeleccionados(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    )
  }

  const getDisponibilidadTexto = () => {
    const dias = diasSeleccionados.length > 0 ? diasSeleccionados.join(', ') : 'Cualquier día'
    const turnoLabel = TURNOS.find(t => t.value === turno)?.label || ''
    return turnoLabel ? `${dias} – ${turnoLabel}` : dias
  }
  const [enviado, setEnviado] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    if (enviado) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [enviado])

  const handleSubmit = (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    const formConDisponibilidad = { ...form, disponibilidad: getDisponibilidadTexto() }
    crearCotizacion(formConDisponibilidad)
      .then(res => {
        setCodigo(res.data.codigo)
        setEnviado(true)
      })
      .catch(() => setError('Ocurrió un error al enviar la solicitud. Inténtalo de nuevo.'))
      .finally(() => setCargando(false))
  }

  const disponibilidadValida = turno !== ''

  if (enviado) {
    return (
      <div style={{
        minHeight: '100vh', background: '#FAFAF8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}>
        <Helmet>
          <title>Cotización | GyG Puertas Automáticas</title>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
          <style>{`
            .btn-seguimiento-cot:hover{background:#FDE047!important}
            .btn-seguimiento-cot{transition:background .2s}
            .btn-inicio-cot:hover{background:#F3F3F1!important}
            .btn-inicio-cot{transition:background .2s}
          `}</style>
        </Helmet>
        <div style={{
          background: '#fff', borderRadius: '16px',
          border: '1px solid #EEECEA', padding: '64px 48px',
          maxWidth: '560px', width: '100%', textAlign: 'center',
        }}>
          <div style={{
            width: '80px', height: '80px', background: '#D1FAE5',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <FaCheckCircle size={44} color="#10B981" />
          </div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '28px', fontWeight: 400,
            marginBottom: '12px', color: '#111',
          }}>
            Solicitud enviada correctamente
          </h2>
          <p style={{ color: '#888', marginBottom: '28px', fontSize: '15px' }}>
            Tu código de seguimiento es:
          </p>
          <div style={{
            background: '#FFFBEB', border: '2px solid #FACC15',
            borderRadius: '12px', padding: '24px 32px', marginBottom: '28px',
          }}>
            <p style={{
              fontSize: '11px', fontWeight: 700,
              color: '#B45309', textTransform: 'uppercase',
              letterSpacing: '0.1em', marginBottom: '8px',
            }}>
              Código de seguimiento
            </p>
            <p style={{
              fontSize: '32px', fontWeight: 700,
              color: '#111', letterSpacing: '0.05em', margin: 0,
            }}>
              {codigo}
            </p>
          </div>
          <p style={{
            color: '#888', fontSize: '14px',
            marginBottom: '32px', lineHeight: 1.7,
          }}>
            Guarda este código para hacer seguimiento de tu solicitud. También te lo enviamos por correo y WhatsApp.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/seguimiento"
              className="btn-seguimiento-cot"
              style={{
                background: '#FACC15', color: '#111',
                padding: '14px 28px', borderRadius: '8px',
                fontWeight: 700, textDecoration: 'none',
                fontSize: '15px', display: 'inline-block',
              }}
            >
              Hacer seguimiento
            </Link>
            <Link
              to="/"
              className="btn-inicio-cot"
              style={{
                border: '2px solid #E8E5E0', color: '#666',
                background: 'transparent', padding: '14px 28px',
                borderRadius: '8px', fontWeight: 700,
                textDecoration: 'none', fontSize: '15px',
                display: 'inline-block',
              }}
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
      <Helmet>
        <title>Cotización | GyG Puertas Automáticas</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
          .a1{animation:fadeUp .9s .05s cubic-bezier(.22,1,.36,1) both}
          .a2{animation:fadeUp .9s .18s cubic-bezier(.22,1,.36,1) both}
          .a3{animation:fadeUp .9s .30s cubic-bezier(.22,1,.36,1) both}
          
          .tipo-uso-btn{transition:all .2s}
          .tipo-uso-btn:hover{box-shadow:0 8px 24px rgba(0,0,0,0.1)}
          
          .input-cotizar:focus{outline:none;border-color:#FACC15!important}
          .btn-enviar-cot:hover{background:#FDE047!important}
          .btn-enviar-cot{transition:background .2s}
          
          @keyframes spin{to{transform:rotate(360deg)}}
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
            Gratis y sin compromiso
          </p>

          <h1 className="a2" style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(3rem, 7vw, 5.8rem)',
            fontWeight: 400, lineHeight: 1.0,
            color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em',
          }}>
            Solicitar<br />
            <span style={{ color: '#FACC15' }}>Cotización</span>
          </h1>

          <div style={{ width: '52px', height: '3px', background: '#FACC15', margin: '0 auto 28px' }} />

          <p className="a3" style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
            maxWidth: '720px', margin: '0 auto',
          }}>
            Completa el formulario y nuestro equipo te contactará a la brevedad para coordinar una visita técnica gratuita.
          </p>
        </div>
      </section>

      <section style={{
        padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)',
        background: '#FAFAF8',
      }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              color: '#F59E0B', fontWeight: 700,
              fontSize: '11px', textTransform: 'uppercase',
              letterSpacing: '0.22em',
            }}>
              Paso 1
            </span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              fontWeight: 400, color: '#111',
              margin: '8px 0 0', letterSpacing: '-0.02em',
            }}>
              Tipo de uso
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {TIPOS_USO.map(tipo => (
              <button
                key={tipo.value}
                type="button"
                onClick={() => setForm({ ...form, tipo_uso: tipo.value })}
                className="tipo-uso-btn"
                style={{
                  padding: '32px 28px', borderRadius: '14px',
                  border: `2px solid ${form.tipo_uso === tipo.value ? tipo.colorBorder : '#E8E5E0'}`,
                  textAlign: 'left', cursor: 'pointer',
                  background: form.tipo_uso === tipo.value ? tipo.colorBg : '#fff',
                }}
              >
                <div style={{
                  marginBottom: '20px',
                  color: form.tipo_uso === tipo.value ? tipo.colorIcon : '#CCC',
                }}>
                  {tipo.icono}
                </div>
                <h3 style={{
                  fontWeight: 700, color: '#111',
                  marginBottom: '6px', fontSize: '17px',
                }}>
                  {tipo.label}
                </h3>
                <p style={{
                  color: '#666', fontSize: '14px',
                  lineHeight: 1.6, margin: 0,
                }}>
                  {tipo.desc}
                </p>
                {form.tipo_uso === tipo.value && (
                  <div style={{ marginTop: '20px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 700,
                      padding: '5px 14px', borderRadius: '20px',
                      background: tipo.badgeBg,
                      color: tipo.badgeText,
                    }}>
                      Seleccionado
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)',
        background: '#fff',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              color: '#F59E0B', fontWeight: 700,
              fontSize: '11px', textTransform: 'uppercase',
              letterSpacing: '0.22em',
            }}>
              Paso 2
            </span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              fontWeight: 400, color: '#111',
              margin: '8px 0 0', letterSpacing: '-0.02em',
            }}>
              Tus datos
            </h2>
          </div>

          <div style={{
            background: '#FAFAF8', borderRadius: '16px',
            border: '1px solid #EEECEA', padding: 'clamp(32px, 5vw, 48px)',
          }}>
            {error && (
              <div style={{
                background: '#FEE2E2', border: '1px solid #FCA5A5',
                color: '#DC2626', padding: '16px 20px',
                borderRadius: '12px', marginBottom: '24px',
                fontSize: '14px', fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {!form.tipo_uso && (
              <div style={{
                background: '#FFFBEB', border: '1px solid #FDE68A',
                color: '#92400E', padding: '16px 20px',
                borderRadius: '12px', marginBottom: '24px',
                fontSize: '14px', display: 'flex',
                alignItems: 'center', gap: '8px',
              }}>
                <span style={{ fontWeight: 700 }}>Atención:</span>
                Por favor selecciona el tipo de uso arriba antes de continuar.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block', fontSize: '13px',
                    fontWeight: 600, color: '#111', marginBottom: '6px',
                  }}>
                    Nombre completo *
                  </label>
                  <input
                    name="nombre_cliente"
                    onChange={handleChange}
                    required
                    className="input-cotizar"
                    style={{
                      width: '100%', border: '1.5px solid #E8E5E0',
                      borderRadius: '8px', padding: '12px 16px',
                      background: '#fff', fontSize: '15px',
                      color: '#111', boxSizing: 'border-box',
                      transition: 'border-color .2s',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block', fontSize: '13px',
                    fontWeight: 600, color: '#111', marginBottom: '6px',
                  }}>
                    Teléfono *
                  </label>
                  <input
                    name="telefono"
                    type="tel"
                    inputMode="numeric"
                    maxLength={9}
                    placeholder=""
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setForm({ ...form, telefono: val })
                    }}
                    required
                    pattern="9[0-9]{8}"
                    title="Ingresa un número peruano válido (9 dígitos, empieza en 9)"
                    className="input-cotizar"
                    style={{
                      width: '100%', border: '1.5px solid #E8E5E0',
                      borderRadius: '8px', padding: '12px 16px',
                      background: '#fff', fontSize: '15px',
                      color: '#111', boxSizing: 'border-box',
                      transition: 'border-color .2s',
                    }}
                  />
                  <p style={{ fontSize: '11px', color: '#aaa', margin: '4px 0 0' }}>
                    Número peruano de 9 dígitos
                  </p>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: '13px',
                  fontWeight: 600, color: '#111', marginBottom: '6px',
                }}>
                  Correo electrónico *
                </label>
                <input
                  name="correo"
                  type="email"
                  onChange={handleChange}
                  required
                  className="input-cotizar"
                  style={{
                    width: '100%', border: '1.5px solid #E8E5E0',
                    borderRadius: '8px', padding: '12px 16px',
                    background: '#fff', fontSize: '15px',
                    color: '#111', boxSizing: 'border-box',
                    transition: 'border-color .2s',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: '13px',
                  fontWeight: 600, color: '#111', marginBottom: '6px',
                }}>
                  Dirección *
                </label>
                <input
                  name="direccion"
                  onChange={handleChange}
                  required
                  className="input-cotizar"
                  style={{
                    width: '100%', border: '1.5px solid #E8E5E0',
                    borderRadius: '8px', padding: '12px 16px',
                    background: '#fff', fontSize: '15px',
                    color: '#111', boxSizing: 'border-box',
                    transition: 'border-color .2s',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block', fontSize: '13px',
                    fontWeight: 600, color: '#111', marginBottom: '6px',
                  }}>
                    Distrito *
                  </label>
                  <select
                    name="distrito"
                    onChange={handleChange}
                    required
                    className="input-cotizar"
                    style={{
                      width: '100%', border: '1.5px solid #E8E5E0',
                      borderRadius: '8px', padding: '12px 16px',
                      background: '#fff', fontSize: '15px',
                      color: form.distrito ? '#111' : '#999',
                      boxSizing: 'border-box',
                      transition: 'border-color .2s',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      paddingRight: '36px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Selecciona tu distrito</option>
                    {DISTRITOS_LIMA.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{
                    display: 'block', fontSize: '13px',
                    fontWeight: 600, color: '#111', marginBottom: '6px',
                  }}>
                    Referencias de ubicación
                  </label>
                  <input
                    name="referencias"
                    onChange={handleChange}
                    className="input-cotizar"
                    style={{
                      width: '100%', border: '1.5px solid #E8E5E0',
                      borderRadius: '8px', padding: '12px 16px',
                      background: '#fff', fontSize: '15px',
                      color: '#111', boxSizing: 'border-box',
                      transition: 'border-color .2s',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: '13px',
                  fontWeight: 600, color: '#111', marginBottom: '6px',
                }}>
                  Descripción de lo que necesitas *
                </label>
                <textarea
                  name="descripcion"
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder=""
                  className="input-cotizar"
                  style={{
                    width: '100%', border: '1.5px solid #E8E5E0',
                    borderRadius: '8px', padding: '12px 16px',
                    background: '#fff', fontSize: '15px',
                    color: '#111', boxSizing: 'border-box',
                    transition: 'border-color .2s',
                    fontFamily: 'inherit', resize: 'vertical',
                  }}
                />
                <p style={{ fontSize: '11px', color: '#aaa', margin: '6px 0 0', lineHeight: 1.5 }}>
                  Incluye el tipo de puerta, medidas aproximadas y cualquier detalle relevante
                </p>
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: '13px',
                  fontWeight: 600, color: '#111', marginBottom: '6px',
                }}>
                  Disponibilidad para visita técnica *
                </label>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>
                  Selecciona tu turno preferido y los días disponibles
                </p>

                {/* Turno */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                  {TURNOS.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTurno(t.value)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: '8px',
                        border: `2px solid ${turno === t.value ? '#FACC15' : '#E8E5E0'}`,
                        background: turno === t.value ? '#FFFBEB' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all .15s',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>{t.label}</div>
                      <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{t.sub}</div>
                    </button>
                  ))}
                </div>

                {/* Días */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {DIAS.map(dia => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDia(dia)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: `2px solid ${diasSeleccionados.includes(dia) ? '#FACC15' : '#E8E5E0'}`,
                        background: diasSeleccionados.includes(dia) ? '#FFFBEB' : '#fff',
                        fontSize: '13px', fontWeight: 600,
                        color: diasSeleccionados.includes(dia) ? '#92400E' : '#666',
                        cursor: 'pointer',
                        transition: 'all .15s',
                      }}
                    >
                      {dia}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setDiasSeleccionados([])}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: `2px solid ${diasSeleccionados.length === 0 ? '#FACC15' : '#E8E5E0'}`,
                      background: diasSeleccionados.length === 0 ? '#FFFBEB' : '#fff',
                      fontSize: '13px', fontWeight: 600,
                      color: diasSeleccionados.length === 0 ? '#92400E' : '#666',
                      cursor: 'pointer',
                      transition: 'all .15s',
                    }}
                  >
                    Cualquier día
                  </button>
                </div>
              </div>

              <div style={{
                background: '#F3F3F1', borderRadius: '12px',
                padding: '16px 20px', fontSize: '14px',
                color: '#666', border: '1px solid #E8E5E0',
                lineHeight: 1.6,
              }}>
                Al enviar tu solicitud, nuestro equipo te contactará en menos de 24 horas para coordinar la visita técnica gratuita.
              </div>

              <button
                type="submit"
                disabled={cargando || !form.tipo_uso || !disponibilidadValida}
                className="btn-enviar-cot"
                style={{
                  width: '100%', background: '#FACC15',
                  color: '#111', padding: '16px 0',
                  borderRadius: '8px', fontWeight: 700,
                  fontSize: '16px', border: 'none',
                  cursor: cargando || !form.tipo_uso || !disponibilidadValida ? 'not-allowed' : 'pointer',
                  opacity: cargando || !form.tipo_uso || !disponibilidadValida ? 0.5 : 1,
                }}
              >
                {cargando ? 'Enviando...' : 'Enviar solicitud de cotización'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Cotizacion
