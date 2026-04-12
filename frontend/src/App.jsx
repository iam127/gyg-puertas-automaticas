import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Cotizacion from './pages/Cotizacion'
import Seguimiento from './pages/Seguimiento'
import Mantenimiento from './pages/Mantenimiento'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import Galeria from './pages/Galeria'
import Blog from './pages/Blog'
import DetalleProducto from './pages/DetalleProducto'
import GuiaPuerta from './pages/GuiaPuerta'
import Comparador from './pages/Comparador'

const WHATSAPP_URL = 'https://wa.me/51947316874?text=Hola%2C%20me%20gustaria%20obtener%20informacion%20sobre%20sus%20puertas%20automaticas'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:id" element={<DetalleProducto />} />
            <Route path="/cotizar" element={<Cotizacion />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            <Route path="/mantenimiento" element={<Mantenimiento />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/guia" element={<GuiaPuerta />} />
            <Route path="/comparador" element={<Comparador />} />
          </Routes>
        </main>
        <Chatbot />
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="fixed bottom-6 left-6 bg-green-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 z-50">
          <FaWhatsapp size={30} />
        </a>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App