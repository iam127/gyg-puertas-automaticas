import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Cotizacion from './pages/Cotizacion'
import Seguimiento from './pages/Seguimiento'
import Mantenimiento from './pages/Mantenimiento'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import FAQ from './pages/FAQ'
import Galeria from './pages/Galeria'
import Blog from './pages/Blog'
import DetalleProducto from './pages/DetalleProducto'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:id" element={<DetalleProducto />} />
            <Route path="/cotizar" element={<Cotizacion />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            <Route path="/mantenimiento" element={<Mantenimiento />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App