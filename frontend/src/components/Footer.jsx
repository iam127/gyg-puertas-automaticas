function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1a1a2e',
      color: 'white',
      padding: '2rem',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3>GyG Puertas Automaticas</h3>
          <p>Soluciones en puertas automaticas para tu hogar y empresa</p>
        </div>
        <div>
          <h4>Enlaces rapidos</h4>
          <p><a href="/catalogo" style={{ color: 'white' }}>Catalogo</a></p>
          <p><a href="/cotizar" style={{ color: 'white' }}>Solicitar Cotizacion</a></p>
          <p><a href="/mantenimiento" style={{ color: 'white' }}>Mantenimiento</a></p>
          <p><a href="/seguimiento" style={{ color: 'white' }}>Seguimiento</a></p>
        </div>
        <div>
          <h4>Contacto</h4>
          <p>Lima, Peru</p>
          <p>contacto@gygpuertas.com</p>
          <p>+51 999 999 999</p>
        </div>
      </div>
      <p style={{ marginTop: '1rem' }}>© 2026 GyG Puertas Automaticas. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer