import { Link } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-yellow-400">
          GyG Puertas Automáticas
        </Link>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-yellow-400 transition">Inicio</Link>
          <Link to="/nosotros" className="hover:text-yellow-400 transition">Nosotros</Link>
          <Link to="/catalogo" className="hover:text-yellow-400 transition">Catálogo</Link>
          <Link to="/galeria" className="hover:text-yellow-400 transition">Galería</Link>
          <Link to="/blog" className="hover:text-yellow-400 transition">Blog</Link>
          <Link to="/faq" className="hover:text-yellow-400 transition">FAQ</Link>
          <Link to="/seguimiento" className="hover:text-yellow-400 transition">Seguimiento</Link>
          <Link to="/mantenimiento" className="hover:text-yellow-400 transition">Mantenimiento</Link>
          <Link to="/contacto" className="hover:text-yellow-400 transition">Contacto</Link>
          <Link to="/cotizar" className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full font-bold hover:bg-yellow-300 transition">
            Cotizar
          </Link>
          <Link to="/comparador" className="hover:text-yellow-400 transition">Comparador</Link>

        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>
      </div>

      {menuAbierto && (
        <div className="md:hidden flex flex-col gap-3 px-4 py-3 bg-gray-800 text-sm">
          <Link to="/" className="hover:text-yellow-400">Inicio</Link>
          <Link to="/nosotros" className="hover:text-yellow-400">Nosotros</Link>
          <Link to="/catalogo" className="hover:text-yellow-400">Catálogo</Link>
          <Link to="/galeria" className="hover:text-yellow-400">Galería</Link>
          <Link to="/blog" className="hover:text-yellow-400">Blog</Link>
          <Link to="/faq" className="hover:text-yellow-400">FAQ</Link>
          <Link to="/seguimiento" className="hover:text-yellow-400">Seguimiento</Link>
          <Link to="/mantenimiento" className="hover:text-yellow-400">Mantenimiento</Link>
          <Link to="/contacto" className="hover:text-yellow-400">Contacto</Link>
          <Link to="/cotizar" className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full font-bold text-center">Cotizar</Link>
          <Link to="/comparador" className="hover:text-yellow-400 transition">Comparador</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar