import { useState } from 'react'
import { crearMantenimiento } from '../services/mantenimientos'
import { Link } from 'react-router-dom'
import { FaTools, FaWrench, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const TIPOS = [
  {
    value: 'preventivo',
    icon: <FaTools size={28} />,
    titulo: 'Mantenimiento Preventivo',
    desc: 'Revisión periódica para evitar fallas y prolongar la vida útil de tu puerta.',
    colorActivo: '#DBEAFE',
    iconColor: '#3B82F6',
    borderColor: '#3B82F6',
    badgeBg: '#DBEAFE',
    badgeText: '#1E40AF',
  },
  {
    value: 'correctivo',
    icon: <FaWrench size={28} />,
    titulo: 'Mantenimiento Correctivo',
    desc: 'Diagnóstico y reparación de fallas en tu puerta automática.',
    colorActivo: '#FED7AA',
    iconColor: '#F97316',
    borderColor: '#F97316',
    badgeBg: '#FED7AA',
    badgeText: '#C2410C',
  },
  {
    value: 'garantia',
    icon: <FaShieldAlt size={28} />,
    titulo: 'Garantía',
    desc: 'Cobertura de garantía para trabajos realizados por GyG.',
    colorActivo: '#D1FAE5',
    iconColor: '#10B981',
    borderColor: '#10B981',
    badgeBg: '#D1FAE5',
    badgeText: '#047857',
  },
]

function Mantenimiento() {
  const [form, setForm] = useState({
    nombre_cliente: '',
    telefono: '',
    correo: '',
    direccion: '',
    distrito: '',
    tipo_puerta: '',
    fecha_instalacion_aprox: '',
    descripcion_problema: '',
    disponibilidad: '',
    tipo: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    crearMantenimiento(form)
      .then(res => {
        setCodigo(res.data.codigo)
        setEnviado(true)
      })
      .catch(() => setError('Ocurrió un error al enviar la solicitud. Inténtalo de nuevo.'))
      .finally(() => setCargando(false))
  }

  if (enviado) {
    return (
      <div style={{
        minHeight: '100vh', background: '#FAFAF8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}>
        <Helmet>
          <title>Mantenimiento | GyG Puertas Automáticas</title>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
          <style>{`
            .btn-seguimiento:hover{background:#FDE047!important}
            .btn-seguimiento{transition:background .2s}
            .btn-inicio:hover{background:#F3F3F1!important}
            .btn-inicio{transition:background .2s}
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
              className="btn-seguimiento"
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
              className="btn-inicio"
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
        <title>Mantenimiento | GyG Puertas Automáticas</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
          .a1{animation:fadeUp .9s .05s cubic-bezier(.22,1,.36,1) both}
          .a2{animation:fadeUp .9s .18s cubic-bezier(.22,1,.36,1) both}
          .a3{animation:fadeUp .9s .30s cubic-bezier(.22,1,.36,1) both}
          
          .tipo-btn{transition:all .2s}
          .tipo-btn:hover{box-shadow:0 8px 24px rgba(0,0,0,0.1)}
          
          .input-field:focus{outline:none;border-color:#FACC15!important}
          .btn-enviar:hover{background:#FDE047!important}
          .btn-enviar{transition:background .2s}
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
            Servicio técnico
          </p>

          <h1 className="a2" style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(3rem, 7vw, 5.8rem)',
            fontWeight: 400, lineHeight: 1.0,
            color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em',
          }}>
            Solicitar<br />
            <span style={{ color: '#FACC15' }}>Mantenimiento</span>
          </h1>

          <div style={{ width: '52px', height: '3px', background: '#FACC15', margin: '0 auto 28px' }} />

          <p className="a3" style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
            maxWidth: '640px', margin: '0 auto',
          }}>
            Completa el formulario y nuestro equipo técnico te atenderá a la brevedad.
          </p>
        </div>
      </section>

      {/* TIPOS DE SERVICIO */}
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
              Selecciona el tipo de servicio
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {TIPOS.map(tipo => (
              <button
                key={tipo.value}
                type="button"
                onClick={() => setForm({ ...form, tipo: tipo.value })}
                className="tipo-btn"
                style={{
                  padding: '32px 28px', borderRadius: '14px',
                  border: `2px solid ${form.tipo === tipo.value ? tipo.borderColor : '#E8E5E0'}`,
                  textAlign: 'left', cursor: 'pointer',
                  background: form.tipo === tipo.value ? tipo.colorActivo : '#fff',
                }}
              >
                <div style={{
                  marginBottom: '20px',
                  color: form.tipo === tipo.value ? tipo.iconColor : '#CCC',
                }}>
                  {tipo.icon}
                </div>
                <h3 style={{
                  fontWeight: 700, color: '#111',
                  marginBottom: '8px', fontSize: '17px',
                }}>
                  {tipo.titulo}
                </h3>
                <p style={{
                  color: '#666', fontSize: '14px',
                  lineHeight: 1.65, margin: 0,
                }}>
                  {tipo.desc}
                </p>
                {form.tipo === tipo.value && (
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

      {/* FORMULARIO */}
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
              Completa tus datos
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

            {!form.tipo && (
              <div style={{
                background: '#FFFBEB', border: '1px solid #FDE68A',
                color: '#92400E', padding: '16px 20px',
                borderRadius: '12px', marginBottom: '24px',
                fontSize: '14px', display: 'flex',
                alignItems: 'center', gap: '8px',
              }}>
                <span style={{ fontWeight: 700 }}>Atención:</span>
                Por favor selecciona un tipo de servicio arriba antes de continuar.
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
                    className="input-field"
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
                    onChange={handleChange}
                    required
                    className="input-field"
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
                  Correo electrónico *
                </label>
                <input
                  name="correo"
                  type="email"
                  onChange={handleChange}
                  required
                  className="input-field"
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
                    Dirección *
                  </label>
                  <input
                    name="direccion"
                    onChange={handleChange}
                    required
                    className="input-field"
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
                    Distrito *
                  </label>
                  <input
                    name="distrito"
                    onChange={handleChange}
                    required
                    className="input-field"
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block', fontSize: '13px',
                    fontWeight: 600, color: '#111', marginBottom: '6px',
                  }}>
                    Tipo de puerta instalada *
                  </label>
                  <input
                    name="tipo_puerta"
                    onChange={handleChange}
                    required
                    className="input-field"
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
                    Fecha aproximada de instalación
                  </label>
                  <input
                    name="fecha_instalacion_aprox"
                    type="date"
                    onChange={handleChange}
                    className="input-field"
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
                  Descripción del problema *
                </label>
                <textarea
                  name="descripcion_problema"
                  onChange={handleChange}
                  required
                  rows={4}
                  className="input-field"
                  style={{
                    width: '100%', border: '1.5px solid #E8E5E0',
                    borderRadius: '8px', padding: '12px 16px',
                    background: '#fff', fontSize: '15px',
                    color: '#111', boxSizing: 'border-box',
                    transition: 'border-color .2s',
                    fontFamily: 'inherit', resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: '13px',
                  fontWeight: 600, color: '#111', marginBottom: '6px',
                }}>
                  Disponibilidad para visita técnica *
                </label>
                <input
                  name="disponibilidad"
                  onChange={handleChange}
                  required
                  className="input-field"
                  style={{
                    width: '100%', border: '1.5px solid #E8E5E0',
                    borderRadius: '8px', padding: '12px 16px',
                    background: '#fff', fontSize: '15px',
                    color: '#111', boxSizing: 'border-box',
                    transition: 'border-color .2s',
                  }}
                />
              </div>

              <div style={{
                background: '#F3F3F1', borderRadius: '12px',
                padding: '16px 20px', fontSize: '14px',
                color: '#666', border: '1px solid #E8E5E0',
                lineHeight: 1.6,
              }}>
                Al enviar tu solicitud, nuestro equipo técnico se comunicará contigo en menos de 24 horas para coordinar la visita.
              </div>

              <button
                type="submit"
                disabled={cargando || !form.tipo}
                className="btn-enviar"
                style={{
                  width: '100%', background: '#FACC15',
                  color: '#111', padding: '16px 0',
                  borderRadius: '8px', fontWeight: 700,
                  fontSize: '16px', border: 'none',
                  cursor: cargando || !form.tipo ? 'not-allowed' : 'pointer',
                  opacity: cargando || !form.tipo ? 0.5 : 1,
                }}
              >
                {cargando ? 'Enviando...' : 'Enviar solicitud de mantenimiento'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Mantenimiento