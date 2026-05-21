import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock } from 'react-icons/fa'
import logo from '../assets/Logo-gyg.png'

function Footer() {
  const whatsappUrl = 'https://wa.me/51947316874?text=Hola%2C%20me%20gustaria%20obtener%20informacion%20sobre%20sus%20puertas%20automaticas'

  return (
    <footer style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        .footer-link:hover { color: #FACC15 !important; }
        .footer-link { transition: color .2s; }
      `}</style>
      
      <div style={{
        background: '#fff', borderTop: '1px solid #EEECEA',
        marginTop: 'auto',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '64px clamp(24px, 8vw, 120px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '48px',
        }} className="footer-grid">

          <div style={{ gridColumn: 'span 2' }} className="footer-col-2">
            <img
              src={logo}
              alt="GyG Puertas Automáticas"
              style={{ height: '48px', objectFit: 'contain', marginBottom: '16px' }}
            />
            <p style={{
              color: '#888', fontSize: '14px',
              marginBottom: '24px', maxWidth: '400px',
              lineHeight: 1.7,
            }}>
              Soluciones en puertas automáticas para tu hogar y empresa. Calidad, seguridad y garantía en cada instalación.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#666' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaMapMarkerAlt style={{ color: '#FACC15', flexShrink: 0 }} size={16} />
                <a
                  href="https://maps.google.com/?q=Manuel+Odria+161+Ate+Lima+Peru"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                  style={{ color: '#666', textDecoration: 'none' }}
                >
                  Manuel Odria 161, Ate, Lima, Perú
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaPhone style={{ color: '#FACC15', flexShrink: 0 }} size={16} />
                <a
                  href="tel:+51947316864"
                  className="footer-link"
                  style={{ color: '#666', textDecoration: 'none' }}
                >
                  +51 947 316 864
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaEnvelope style={{ color: '#FACC15', flexShrink: 0 }} size={16} />
                <a
                  href="mailto:gygpuertasautomaticas@gmail.com"
                  className="footer-link"
                  style={{ color: '#666', textDecoration: 'none' }}
                >
                  gygpuertasautomaticas@gmail.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaWhatsapp style={{ color: '#FACC15', flexShrink: 0 }} size={16} />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                  style={{ color: '#666', textDecoration: 'none' }}
                >
                  +51 947 316 874 (WhatsApp)
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaClock style={{ color: '#FACC15', flexShrink: 0 }} size={16} />
                <span>Atención 24/7</span>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{
              fontWeight: 700, fontSize: '17px',
              marginBottom: '20px', color: '#111',
            }}>
              Enlaces rápidos
            </h4>
            <ul style={{
              color: '#666', fontSize: '14px',
              listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <li><Link to="/catalogo" className="footer-link" style={{ color: '#666', textDecoration: 'none' }}>Catálogo</Link></li>
              <li><Link to="/cotizar" className="footer-link" style={{ color: '#666', textDecoration: 'none' }}>Solicitar Cotización</Link></li>
              <li><Link to="/mantenimiento" className="footer-link" style={{ color: '#666', textDecoration: 'none' }}>Mantenimiento</Link></li>
              <li><Link to="/seguimiento" className="footer-link" style={{ color: '#666', textDecoration: 'none' }}>Seguimiento</Link></li>
              <li><Link to="/galeria" className="footer-link" style={{ color: '#666', textDecoration: 'none' }}>Galería</Link></li>
              <li><Link to="/blog" className="footer-link" style={{ color: '#666', textDecoration: 'none' }}>Blog</Link></li>
              <li><Link to="/nosotros" className="footer-link" style={{ color: '#666', textDecoration: 'none' }}>Nosotros</Link></li>
              <li><Link to="/contacto" className="footer-link" style={{ color: '#666', textDecoration: 'none' }}>Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{
              fontWeight: 700, fontSize: '17px',
              marginBottom: '20px', color: '#111',
            }}>
              Servicios
            </h4>
            <ul style={{
              color: '#666', fontSize: '14px',
              listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <li>Puertas Levadizas</li>
              <li>Puertas Corredizas</li>
              <li>Puertas Batientes</li>
              <li>Puertas Seccionales</li>
              <li>Puertas Industriales</li>
              <li>Cercos Eléctricos</li>
              <li>Barreras Automáticas</li>
            </ul>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid #EEECEA',
          color: '#BBB', fontSize: '13px',
          padding: '24px clamp(24px, 8vw, 120px)',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0 }}>© 2026 GyG Puertas Automáticas. Todos los derechos reservados.</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-col-2 { grid-column: span 1 !important; }
        }
      `}</style>
    </footer>
  )
}

export default Footer