import { useState } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock, FaChevronDown, FaCheckCircle } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'
import api from '../services/api'

function Contacto() {
  const [faqAbierto, setFaqAbierto] = useState(null)
  const [formContacto, setFormContacto] = useState({ nombre: '', telefono: '', correo: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errorContacto, setErrorContacto] = useState('')

  const whatsappUrl = 'https://wa.me/51947316874?text=Hola%2C%20me%20gustaria%20obtener%20informacion%20sobre%20sus%20puertas%20automaticas'
  const mapsUrl = 'https://maps.google.com/?q=Manuel+Odria+161+Ate+Lima+Peru'

  const faqs = [
    { pregunta: '¿Cuánto tiempo demora la instalación?', respuesta: 'El tiempo de instalación varía según el tipo de puerta y complejidad del trabajo. En promedio demora entre 1 y 3 días.' },
    { pregunta: '¿Qué garantía tienen sus productos?', respuesta: 'Todos nuestros productos cuentan con garantía de 12 meses en piezas y mano de obra.' },
    { pregunta: '¿Realizan mantenimiento a puertas de otras marcas?', respuesta: 'Sí, nuestro equipo técnico está capacitado para dar mantenimiento a puertas automáticas de diferentes marcas.' },
    { pregunta: '¿Cómo solicito una cotización?', respuesta: 'Puedes solicitar una cotización desde nuestra web completando el formulario. Nuestro equipo coordinará una visita técnica para darte un precio exacto.' },
    { pregunta: '¿Trabajan en toda Lima?', respuesta: 'Sí, atendemos en todos los distritos de Lima Metropolitana.' },
  ]

  const handleSubmitContacto = (e) => {
    e.preventDefault()
    setEnviando(true)
    setErrorContacto('')
    api.post('/contacto/', formContacto)
      .then(() => {
        setEnviado(true)
        setFormContacto({ nombre: '', telefono: '', correo: '', mensaje: '' })
      })
      .catch(() => setErrorContacto('Ocurrió un error. Por favor intenta de nuevo.'))
      .finally(() => setEnviando(false))
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
      <Helmet>
        <title>Contacto | GyG Puertas Automáticas</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
          .a1{animation:fadeUp .9s .05s cubic-bezier(.22,1,.36,1) both}
          .a2{animation:fadeUp .9s .18s cubic-bezier(.22,1,.36,1) both}
          .a3{animation:fadeUp .9s .30s cubic-bezier(.22,1,.36,1) both}
          
          .contact-card{transition:all .2s}
          .contact-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.1)}
          .contact-card:hover .icon-box{transform:scale(1.1)}
          .icon-box{transition:transform .2s}
          
          .input-contact:focus{outline:none;border-color:#FACC15!important}
          .btn-enviar-contacto:hover{background:#FDE047!important}
          .btn-enviar-contacto{transition:background .2s}
          .btn-whatsapp-dark:hover{background:#16A34A!important}
          .btn-whatsapp-dark{transition:background .2s}
          .btn-maps:hover{background:#222!important}
          .btn-maps{transition:background .2s}
          .btn-otro:hover{background:#F3F3F1!important}
          .btn-otro{transition:background .2s}
          
          .faq-btn:hover{background:#FAFAF8!important}
          .faq-btn{transition:background .15s}
          
          @keyframes spin{to{transform:rotate(360deg)}}
          .spinner{animation:spin 0.8s linear infinite}
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
            Estamos para ayudarte
          </p>

          <h1 className="a2" style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(3rem, 7vw, 5.8rem)',
            fontWeight: 400, lineHeight: 1.0,
            color: '#FACC15', margin: '0 0 20px', letterSpacing: '-0.025em',
          }}>
            Contáctanos
          </h1>

          <div style={{ width: '52px', height: '3px', background: '#FACC15', margin: '0 auto 28px' }} />

          <p className="a3" style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
            maxWidth: '640px', margin: '0 auto',
          }}>
            Estamos disponibles las 24 horas del día para atender tus consultas.
          </p>
        </div>
      </section>

      <section style={{
        padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)',
        background: '#FAFAF8',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
          }}>

            <div>
              <span style={{
                color: '#F59E0B', fontWeight: 700,
                fontSize: '11px', textTransform: 'uppercase',
                letterSpacing: '0.22em',
              }}>
                Información
              </span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 400, color: '#111',
                margin: '8px 0 32px', letterSpacing: '-0.02em',
              }}>
                Datos de contacto
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                <div className="contact-card" style={{
                  background: '#fff', borderRadius: '14px',
                  padding: '20px', display: 'flex', alignItems: 'center',
                  gap: '16px', border: '1px solid #EEECEA',
                }}>
                  <div className="icon-box" style={{
                    background: '#FACC15', color: '#111',
                    width: '48px', height: '48px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '11px', fontWeight: 700,
                      color: '#BBB', textTransform: 'uppercase',
                      letterSpacing: '0.1em', margin: '0 0 4px',
                    }}>
                      Dirección
                    </p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#111', fontWeight: 600,
                        fontSize: '15px', textDecoration: 'none',
                      }}
                    >
                      Manuel Odria 161, Ate, Lima, Perú
                    </a>
                  </div>
                </div>

                <div className="contact-card" style={{
                  background: '#fff', borderRadius: '14px',
                  padding: '20px', display: 'flex', alignItems: 'center',
                  gap: '16px', border: '1px solid #EEECEA',
                }}>
                  <div className="icon-box" style={{
                    background: '#FACC15', color: '#111',
                    width: '48px', height: '48px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaPhone size={18} />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '11px', fontWeight: 700,
                      color: '#BBB', textTransform: 'uppercase',
                      letterSpacing: '0.1em', margin: '0 0 4px',
                    }}>
                      Teléfono
                    </p>
                    <a
                      href="tel:+51947316864"
                      style={{
                        color: '#111', fontWeight: 600,
                        fontSize: '15px', textDecoration: 'none',
                      }}
                    >
                      +51 947 316 864
                    </a>
                  </div>
                </div>

                <div className="contact-card" style={{
                  background: '#fff', borderRadius: '14px',
                  padding: '20px', display: 'flex', alignItems: 'center',
                  gap: '16px', border: '1px solid #EEECEA',
                }}>
                  <div className="icon-box" style={{
                    background: '#FACC15', color: '#111',
                    width: '48px', height: '48px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaEnvelope size={18} />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '11px', fontWeight: 700,
                      color: '#BBB', textTransform: 'uppercase',
                      letterSpacing: '0.1em', margin: '0 0 4px',
                    }}>
                      Correo
                    </p>
                    <a
                      href="mailto:gygpuertasautomaticas@gmail.com"
                      style={{
                        color: '#111', fontWeight: 600,
                        fontSize: '15px', textDecoration: 'none',
                      }}
                    >
                      gygpuertasautomaticas@gmail.com
                    </a>
                  </div>
                </div>

                <div className="contact-card" style={{
                  background: '#fff', borderRadius: '14px',
                  padding: '20px', display: 'flex', alignItems: 'center',
                  gap: '16px', border: '1px solid #EEECEA',
                }}>
                  <div className="icon-box" style={{
                    background: '#FACC15', color: '#111',
                    width: '48px', height: '48px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaWhatsapp size={18} />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '11px', fontWeight: 700,
                      color: '#BBB', textTransform: 'uppercase',
                      letterSpacing: '0.1em', margin: '0 0 4px',
                    }}>
                      WhatsApp
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#111', fontWeight: 600,
                        fontSize: '15px', textDecoration: 'none',
                      }}
                    >
                      +51 947 316 874
                    </a>
                  </div>
                </div>

                <div className="contact-card" style={{
                  background: '#fff', borderRadius: '14px',
                  padding: '20px', display: 'flex', alignItems: 'center',
                  gap: '16px', border: '1px solid #EEECEA',
                }}>
                  <div className="icon-box" style={{
                    background: '#FACC15', color: '#111',
                    width: '48px', height: '48px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaClock size={18} />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '11px', fontWeight: 700,
                      color: '#BBB', textTransform: 'uppercase',
                      letterSpacing: '0.1em', margin: '0 0 4px',
                    }}>
                      Horario
                    </p>
                    <p style={{
                      color: '#111', fontWeight: 600,
                      fontSize: '15px', margin: 0,
                    }}>
                      Atención 24/7
                    </p>
                  </div>
                </div>

              </div>

              <div style={{
                marginTop: '24px', background: '#111',
                borderRadius: '14px', padding: '28px',
                color: '#fff',
              }}>
                <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: '17px' }}>
                  ¿Prefieres escribirnos por WhatsApp?
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.5)', fontSize: '14px',
                  marginBottom: '20px', lineHeight: 1.6,
                }}>
                  Respondemos en minutos durante el horario de atención.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp-dark"
                  style={{
                    background: '#22C55E', color: '#fff',
                    padding: '12px 24px', borderRadius: '8px',
                    fontWeight: 700, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center',
                    gap: '8px', fontSize: '14px',
                  }}
                >
                  <FaWhatsapp size={16} />
                  Escribir por WhatsApp
                </a>
              </div>
            </div>

            <div>
              <span style={{
                color: '#F59E0B', fontWeight: 700,
                fontSize: '11px', textTransform: 'uppercase',
                letterSpacing: '0.22em',
              }}>
                Formulario
              </span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 400, color: '#111',
                margin: '8px 0 32px', letterSpacing: '-0.02em',
              }}>
                Envíanos un mensaje
              </h2>
              <div style={{
                background: '#fff', borderRadius: '14px',
                border: '1px solid #EEECEA', padding: '32px',
              }}>
                {enviado ? (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{
                      width: '64px', height: '64px', background: '#D1FAE5',
                      borderRadius: '50%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}>
                      <FaCheckCircle size={32} color="#10B981" />
                    </div>
                    <h3 style={{
                      fontSize: '22px', fontWeight: 700,
                      color: '#111', margin: '0 0 8px',
                    }}>
                      Mensaje enviado
                    </h3>
                    <p style={{
                      color: '#888', fontSize: '14px',
                      marginBottom: '28px', lineHeight: 1.6,
                    }}>
                      Nos comunicaremos contigo a la brevedad. Gracias por contactarnos.
                    </p>
                    <button
                      onClick={() => setEnviado(false)}
                      className="btn-otro"
                      style={{
                        border: '2px solid #E8E5E0',
                        background: 'transparent', color: '#666',
                        padding: '12px 24px', borderRadius: '8px',
                        fontWeight: 600, fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitContacto} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {errorContacto && (
                      <div style={{
                        background: '#FEE2E2', border: '1px solid #FCA5A5',
                        color: '#DC2626', padding: '16px 20px',
                        borderRadius: '12px', fontSize: '14px',
                      }}>
                        {errorContacto}
                      </div>
                    )}
                    <div>
                      <label style={{
                        display: 'block', fontSize: '13px',
                        fontWeight: 600, color: '#111', marginBottom: '6px',
                      }}>
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        value={formContacto.nombre}
                        onChange={e => setFormContacto({...formContacto, nombre: e.target.value})}
                        required
                        className="input-contact"
                        style={{
                          width: '100%', border: '1.5px solid #E8E5E0',
                          borderRadius: '8px', padding: '12px 16px',
                          background: '#FAFAF8', fontSize: '15px',
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
                        type="text"
                        value={formContacto.telefono}
                        onChange={e => setFormContacto({...formContacto, telefono: e.target.value})}
                        required
                        className="input-contact"
                        style={{
                          width: '100%', border: '1.5px solid #E8E5E0',
                          borderRadius: '8px', padding: '12px 16px',
                          background: '#FAFAF8', fontSize: '15px',
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
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        value={formContacto.correo}
                        onChange={e => setFormContacto({...formContacto, correo: e.target.value})}
                        required
                        className="input-contact"
                        style={{
                          width: '100%', border: '1.5px solid #E8E5E0',
                          borderRadius: '8px', padding: '12px 16px',
                          background: '#FAFAF8', fontSize: '15px',
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
                        Mensaje *
                      </label>
                      <textarea
                        rows={5}
                        value={formContacto.mensaje}
                        onChange={e => setFormContacto({...formContacto, mensaje: e.target.value})}
                        required
                        className="input-contact"
                        style={{
                          width: '100%', border: '1.5px solid #E8E5E0',
                          borderRadius: '8px', padding: '12px 16px',
                          background: '#FAFAF8', fontSize: '15px',
                          color: '#111', boxSizing: 'border-box',
                          transition: 'border-color .2s',
                          fontFamily: 'inherit', resize: 'vertical',
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={enviando}
                      className="btn-enviar-contacto"
                      style={{
                        width: '100%', background: '#FACC15',
                        color: '#111', padding: '16px 0',
                        borderRadius: '8px', fontWeight: 700,
                        fontSize: '16px', border: 'none',
                        cursor: enviando ? 'not-allowed' : 'pointer',
                        opacity: enviando ? 0.6 : 1,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '8px',
                      }}
                    >
                      {enviando ? (
                        <>
                          <div className="spinner" style={{
                            width: '16px', height: '16px',
                            border: '2px solid #111',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                          }} />
                          Enviando...
                        </>
                      ) : 'Enviar mensaje'}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <section style={{
        padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)',
        background: '#fff',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
              color: '#F59E0B', fontWeight: 700,
              fontSize: '11px', textTransform: 'uppercase',
              letterSpacing: '0.22em',
            }}>
              Ubicación
            </span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 400, color: '#111',
              margin: '8px 0 0', letterSpacing: '-0.02em',
            }}>
              Nuestra ubicación
            </h2>
          </div>
          <div style={{
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid #EEECEA',
          }}>
            <iframe
              title="Ubicación GyG Puertas Automáticas"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.7721014655776!2d-76.96118472643364!3d-12.05919544212926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c68b563365f1%3A0x73f0003e430cce42!2sManuel%20A.%20Odria%20161%2C%20Ate%2015012!5e0!3m2!1ses-419!2spe!4v1775957636768!5m2!1ses-419!2spe"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-maps"
              style={{
                background: '#111', color: '#fff',
                padding: '14px 32px', borderRadius: '8px',
                fontWeight: 700, textDecoration: 'none',
                display: 'inline-block', fontSize: '15px',
              }}
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>
      </section>

      <section style={{
        padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)',
        background: '#FAFAF8',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              color: '#F59E0B', fontWeight: 700,
              fontSize: '11px', textTransform: 'uppercase',
              letterSpacing: '0.22em',
            }}>
              Dudas comunes
            </span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 400, color: '#111',
              margin: '8px 0', letterSpacing: '-0.02em',
            }}>
              Preguntas frecuentes
            </h2>
            <p style={{ color: '#888', marginTop: '8px', fontSize: '15px' }}>
              Resolvemos tus dudas más comunes
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: '#fff', borderRadius: '14px',
                  overflow: 'hidden', border: `1px solid ${faqAbierto === i ? '#FACC15' : '#EEECEA'}`,
                  transition: 'border-color .2s',
                }}
              >
                <button
                  onClick={() => setFaqAbierto(faqAbierto === i ? null : i)}
                  className="faq-btn"
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '20px 24px', fontWeight: 600,
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    fontSize: '15px', color: '#111',
                  }}
                >
                  <span>{faq.pregunta}</span>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                    marginLeft: '16px', transition: 'background .2s',
                    background: faqAbierto === i ? '#FACC15' : '#F3F3F1',
                  }}>
                    <FaChevronDown
                      size={12}
                      style={{
                        transition: 'transform .2s',
                        transform: faqAbierto === i ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: faqAbierto === i ? '#111' : '#888',
                      }}
                    />
                  </div>
                </button>
                {faqAbierto === i && (
                  <div style={{
                    padding: '0 24px 20px',
                    borderTop: '1px solid #EEECEA',
                    paddingTop: '20px',
                    color: '#666', fontSize: '14px',
                    lineHeight: 1.7,
                  }}>
                    {faq.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contacto