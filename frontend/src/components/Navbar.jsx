import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FaPhone, FaEnvelope, FaBars, FaTimes, FaWhatsapp, FaClock } from 'react-icons/fa'
import logo from '../assets/Logo-gyg.png'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/galeria', label: 'Galería' },
    { to: '/blog', label: 'Blog' },
    { to: '/seguimiento', label: 'Seguimiento' },
    { to: '/mantenimiento', label: 'Mantenimiento' },
    { to: '/contacto', label: 'Contacto' },
  ]

  return (
    <header>
      <div className="bg-gray-900 text-white text-xs px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+51947316864" className="flex items-center gap-1.5 hover:text-yellow-400 transition">
              <FaPhone size={11} />
              <span>+51 947 316 864</span>
            </a>
            <a href="mailto:gygpuertasautomaticas@gmail.com" className="hidden md:flex items-center gap-1.5 hover:text-yellow-400 transition">
              <FaEnvelope size={11} />
              <span>gygpuertasautomaticas@gmail.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-yellow-400">
              <FaClock size={11} />
              <span className="font-medium">Atención 24/7</span>
            </div>
            <a
              href="https://wa.me/51947316874"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full transition font-medium"
            >
              <FaWhatsapp size={11} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <nav className="bg-white text-gray-900 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-stretch h-20">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="GyG Puertas Automáticas" className="h-14 object-contain" />
          </Link>

          <div className="hidden md:flex text-sm font-medium items-stretch">
            {links.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="flex items-center px-3 hover:bg-yellow-400 hover:text-gray-900 transition"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center ml-4">
              <Link
                to="/cotizar"
                className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition text-sm my-auto"
              >
                Solicitar Cotización
              </Link>
            </div>
          </div>

          <button
            className="md:hidden text-gray-900 flex items-center"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {menuAbierto && (
          <div className="md:hidden flex flex-col gap-1 px-4 py-4 bg-gray-50 text-sm border-t border-gray-200">
            {links.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="py-2.5 px-3 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 font-medium transition"
                onClick={() => setMenuAbierto(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 mt-1 border-t border-gray-200">
              <Link
                to="/cotizar"
                className="bg-yellow-400 text-gray-900 px-4 py-3 rounded-xl font-bold text-center block hover:bg-yellow-300 transition"
                onClick={() => setMenuAbierto(false)}
              >
                Solicitar Cotización
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar