import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1a1a2e',
      color: 'white'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
        GyG Puertas Automaticas
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link>
        <Link to="/nosotros" style={{ color: 'white', textDecoration: 'none' }}>Nosotros</Link>
        <Link to="/catalogo" style={{ color: 'white', textDecoration: 'none' }}>Catalogo</Link>
        <Link to="/galeria" style={{ color: 'white', textDecoration: 'none' }}>Galeria</Link>
        <Link to="/blog" style={{ color: 'white', textDecoration: 'none' }}>Blog</Link>
        <Link to="/faq" style={{ color: 'white', textDecoration: 'none' }}>FAQ</Link>
        <Link to="/seguimiento" style={{ color: 'white', textDecoration: 'none' }}>Seguimiento</Link>
        <Link to="/cotizar" style={{ color: 'white', textDecoration: 'none' }}>Cotizar</Link>
        <Link to="/mantenimiento" style={{ color: 'white', textDecoration: 'none' }}>Mantenimiento</Link>
        <Link to="/contacto" style={{ color: 'white', textDecoration: 'none' }}>Contacto</Link>
      </div>
    </nav>
  )
}

export default Navbar