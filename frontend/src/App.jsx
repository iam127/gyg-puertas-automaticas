import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Cotizacion from './pages/Cotizacion'
import Seguimiento from './pages/Seguimiento'
import Mantenimiento from './pages/Mantenimiento'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/cotizar" element={<Cotizacion />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            <Route path="/mantenimiento" element={<Mantenimiento />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App