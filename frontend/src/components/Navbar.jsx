import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FaPhone, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa'
import logo from '../assets/Logo-gyg.png'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header>
      {/* TOPBAR */}
      <div className="bg-gray-900 text-white text-sm px-4 py-1">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+51947316864" className="flex items-center gap-1 hover:text-yellow-400 transition">
              <FaPhone size={12} />
              <span>+51 947 316 864</span>
            </a>
            <a href="mailto:gygpuertasautomaticas@gmail.com" className="flex items-center gap-1 hover:text-yellow-400 transition">
              <FaEnvelope size={12} />
              <span>gygpuertasautomaticas@gmail.com</span>
            </a>
          </div>
          <div className="font-medium text-yellow-400">
            Atencion 24/7
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="bg-white text-gray-900 shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="GyG Puertas Automaticas" className="h-14 object-contain" />
          </Link>

          <div className="hidden md:flex gap-5 text-sm font-medium items-center">
            <Link to="/" className="hover:text-yellow-500 transition">Inicio</Link>
            <Link to="/nosotros" className="hover:text-yellow-500 transition">Nosotros</Link>
            <Link to="/catalogo" className="hover:text-yellow-500 transition">Catalogo</Link>
            <Link to="/galeria" className="hover:text-yellow-500 transition">Galeria</Link>
            <Link to="/blog" className="hover:text-yellow-500 transition">Blog</Link>
            <Link to="/faq" className="hover:text-yellow-500 transition">FAQ</Link>
            <Link to="/seguimiento" className="hover:text-yellow-500 transition">Seguimiento</Link>
            <Link to="/mantenimiento" className="hover:text-yellow-500 transition">Mantenimiento</Link>
            <Link to="/contacto" className="hover:text-yellow-500 transition">Contacto</Link>
            <Link to="/cotizar" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition">
              Cotizar
            </Link>
          </div>

          <button
            className="md:hidden text-gray-900"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {menuAbierto && (
          <div className="md:hidden flex flex-col gap-3 px-4 py-4 bg-gray-50 text-sm border-t border-gray-200">
            <Link to="/" className="hover:text-yellow-500" onClick={() => setMenuAbierto(false)}>Inicio</Link>
            <Link to="/nosotros" className="hover:text-yellow-500" onClick={() => setMenuAbierto(false)}>Nosotros</Link>
            <Link to="/catalogo" className="hover:text-yellow-500" onClick={() => setMenuAbierto(false)}>Catalogo</Link>
            <Link to="/galeria" className="hover:text-yellow-500" onClick={() => setMenuAbierto(false)}>Galeria</Link>
            <Link to="/blog" className="hover:text-yellow-500" onClick={() => setMenuAbierto(false)}>Blog</Link>
            <Link to="/faq" className="hover:text-yellow-500" onClick={() => setMenuAbierto(false)}>FAQ</Link>
            <Link to="/seguimiento" className="hover:text-yellow-500" onClick={() => setMenuAbierto(false)}>Seguimiento</Link>
            <Link to="/mantenimiento" className="hover:text-yellow-500" onClick={() => setMenuAbierto(false)}>Mantenimiento</Link>
            <Link to="/contacto" className="hover:text-yellow-500" onClick={() => setMenuAbierto(false)}>Contacto</Link>
            <Link to="/cotizar" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-center" onClick={() => setMenuAbierto(false)}>Cotizar</Link>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar