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
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'

const WHATSAPP_URL = 'https://wa.me/51947316874?text=Hola%2C%20me%20gustaria%20obtener%20informacion%20sobre%20sus%20puertas%20automaticas'

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="fixed bottom-28 left-6 bg-green-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 z-50">
        <FaWhatsapp size={30} />
      </a>
      <Chatbot />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS ADMIN - sin navbar ni footer */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* RUTAS PUBLICAS - con navbar y footer */}
        <Route path="/" element={<PublicLayout><Inicio /></PublicLayout>} />
        <Route path="/catalogo" element={<PublicLayout><Catalogo /></PublicLayout>} />
        <Route path="/catalogo/:id" element={<PublicLayout><DetalleProducto /></PublicLayout>} />
        <Route path="/cotizar" element={<PublicLayout><Cotizacion /></PublicLayout>} />
        <Route path="/seguimiento" element={<PublicLayout><Seguimiento /></PublicLayout>} />
        <Route path="/mantenimiento" element={<PublicLayout><Mantenimiento /></PublicLayout>} />
        <Route path="/nosotros" element={<PublicLayout><Nosotros /></PublicLayout>} />
        <Route path="/contacto" element={<PublicLayout><Contacto /></PublicLayout>} />
        <Route path="/galeria" element={<PublicLayout><Galeria /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/guia" element={<PublicLayout><GuiaPuerta /></PublicLayout>} />
        <Route path="/comparador" element={<PublicLayout><Comparador /></PublicLayout>} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App