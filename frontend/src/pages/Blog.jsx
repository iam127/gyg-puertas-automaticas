import { useEffect, useState } from 'react'
import { getBlog } from '../services/contenido'
import { FaCalendarAlt, FaArrowLeft, FaClock, FaArrowRight } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'
import logoGyg from '../assets/Logo-gyg-Admin.png'

function Blog() {
  const [posts, setPosts] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    getBlog().then(res => setPosts(res.data))
  }, [])

  const tiempoLectura = (contenido) => {
    const palabras = contenido.split(' ').length
    return Math.ceil(palabras / 200)
  }

  if (seleccionado) {
    return (
      <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
        <Helmet>
          <title>{seleccionado.titulo} | GyG Puertas Automáticas</title>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
          <style>{`
            .btn-volver-blog:hover{background:#F3F3F1!important}
            .btn-volver-blog{transition:background .2s}
            .btn-cotizar-blog:hover{background:#FDE047!important}
            .btn-cotizar-blog{transition:background .2s}
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

          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#FACC15', marginBottom: '20px',
            }}>
              Artículo
            </p>

            <h1 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 400, lineHeight: 1.15,
              color: '#fff', margin: '0 0 24px', letterSpacing: '-0.025em',
            }}>
              {seleccionado.titulo}
            </h1>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.5)',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarAlt size={12} />
                <span>{new Date(seleccionado.creado_en).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaClock size={12} />
                <span>{tiempoLectura(seleccionado.contenido)} min de lectura</span>
              </div>
            </div>
          </div>
        </section>

        <section style={{
          padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)',
          maxWidth: '900px', margin: '0 auto',
        }}>
          <button
            onClick={() => setSeleccionado(null)}
            className="btn-volver-blog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#FAFAF8', color: '#666',
              border: '1.5px solid #E8E5E0', borderRadius: '8px',
              padding: '10px 20px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', marginBottom: '40px',
            }}
          >
            <FaArrowLeft size={12} /> Volver al blog
          </button>

          <div style={{
            background: '#fff', borderRadius: '16px',
            border: '1px solid #EEECEA', padding: 'clamp(32px, 6vw, 64px)',
          }}>
            <p style={{
              fontSize: '16px', fontWeight: 300,
              color: '#444', lineHeight: 1.85,
              whiteSpace: 'pre-line', margin: 0,
            }}>
              {seleccionado.contenido}
            </p>
          </div>

          <div style={{
            marginTop: '48px', background: '#FFFBEB',
            border: '1px solid #FDE68A', borderRadius: '16px',
            padding: '32px', textAlign: 'center',
          }}>
            <p style={{
              fontSize: '15px', fontWeight: 600,
              color: '#111', marginBottom: '20px',
            }}>
              ¿Necesitas una puerta automática?
            </p>
            <a
              href="/cotizar"
              className="btn-cotizar-blog"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#FACC15', color: '#111',
                padding: '14px 32px', borderRadius: '8px',
                fontWeight: 700, fontSize: '15px',
                textDecoration: 'none',
              }}
            >
              Solicitar Cotización <FaArrowRight size={12} />
            </a>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#fff' }}>
      <Helmet>
        <title>Blog | GyG Puertas Automáticas</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)} }
          .a1{animation:fadeUp .9s .05s cubic-bezier(.22,1,.36,1) both}
          .a2{animation:fadeUp .9s .18s cubic-bezier(.22,1,.36,1) both}
          .a3{animation:fadeUp .9s .30s cubic-bezier(.22,1,.36,1) both}
          
          .blog-card{transition:all .25s ease}
          .blog-card:hover{transform:translateY(-4px);box-shadow:0 24px 56px rgba(0,0,0,.11)}
          .blog-card:hover .blog-img{transform:scale(1.05)}
          .blog-img{transition:transform .5s ease}
          
          .btn-leer:hover{background:#FDE047!important}
          .btn-leer{transition:background .2s}
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
            Noticias y consejos
          </p>

          <h1 className="a2" style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(3rem, 7vw, 5.8rem)',
            fontWeight: 400, lineHeight: 1.0,
            color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em',
          }}>
            Blog y<br />
            <span style={{ color: '#FACC15' }}>Noticias</span>
          </h1>

          <div style={{ width: '52px', height: '3px', background: '#FACC15', margin: '0 auto 28px' }} />

          <p className="a3" style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
            maxWidth: '640px', margin: '0 auto',
          }}>
            Mantente informado sobre nuestros productos, consejos y novedades del sector.
          </p>
        </div>
      </section>

      <section style={{
        padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 120px)',
        background: '#FAFAF8',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '96px 0' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '20px',
                background: '#F3F3F1', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <FaCalendarAlt size={36} color="#CCC" />
              </div>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '28px', fontWeight: 400,
                color: '#111', margin: '0 0 10px',
              }}>
                No hay publicaciones disponibles
              </h3>
              <p style={{ fontSize: '15px', fontWeight: 300, color: '#999', margin: 0 }}>
                Vuelve pronto para ver nuestras novedades.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '14px', fontWeight: 400, color: '#888', marginBottom: '36px' }}>
                <span style={{ fontWeight: 700, color: '#111' }}>{posts.length}</span>{' '}
                artículo{posts.length !== 1 ? 's' : ''} publicado{posts.length !== 1 ? 's' : ''}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '20px',
              }}>
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    className="blog-card"
                    style={{
                      background: '#fff', borderRadius: '14px',
                      overflow: 'hidden', border: '1px solid #EEECEA',
                      display: index === 0 ? 'grid' : 'block',
                      gridTemplateColumns: index === 0 ? '1fr 1fr' : 'auto',
                    }}
                  >
                    <div style={{
                      position: 'relative', overflow: 'hidden',
                      height: index === 0 ? '100%' : '220px',
                      background: '#F3F3F1',
                    }}>
                      {post.imagen ? (
                        <img
                          src={post.imagen}
                          alt={post.titulo}
                          className="blog-img"
                          style={{
                            width: '100%', height: '100%',
                            objectFit: 'cover', display: 'block',
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: '#111', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <img
                            src={logoGyg}
                            alt="GyG Puertas Automáticas"
                            style={{
                              maxWidth: index === 0 ? '360px' : '280px',
                              height: 'auto', opacity: 0.9,
                            }}
                          />
                        </div>
                      )}
                      {index === 0 && (
                        <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                          <span style={{
                            background: '#FACC15', color: '#111',
                            fontSize: '11px', fontWeight: 700,
                            padding: '6px 14px', borderRadius: '20px',
                          }}>
                            Destacado
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{
                      padding: index === 0 ? 'clamp(32px, 5vw, 56px)' : '24px',
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '16px',
                          fontSize: '12px', color: '#BBB', marginBottom: '16px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FaCalendarAlt size={11} />
                            <span>{new Date(post.creado_en).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FaClock size={11} />
                            <span>{tiempoLectura(post.contenido)} min</span>
                          </div>
                        </div>

                        <h3 style={{
                          fontFamily: index === 0 ? "'DM Serif Display', serif" : "'DM Sans', sans-serif",
                          fontSize: index === 0 ? 'clamp(1.5rem, 3vw, 2.2rem)' : '17px',
                          fontWeight: index === 0 ? 400 : 700,
                          color: '#111', margin: '0 0 12px',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {post.titulo}
                        </h3>

                        <p style={{
                          fontSize: '14px', fontWeight: 300,
                          color: '#666', lineHeight: 1.75,
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {post.contenido}
                        </p>
                      </div>

                      <button
                        onClick={() => setSeleccionado(post)}
                        className="btn-leer"
                        style={{
                          marginTop: '24px',
                          background: '#FACC15', color: '#111',
                          padding: index === 0 ? '14px 32px' : '11px 0',
                          borderRadius: '8px', fontWeight: 700,
                          fontSize: index === 0 ? '15px' : '14px',
                          cursor: 'pointer', border: 'none',
                          width: index === 0 ? 'fit-content' : '100%',
                          display: 'inline-flex', alignItems: 'center',
                          justifyContent: 'center', gap: '8px',
                        }}
                      >
                        Leer artículo completo <FaArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Blog