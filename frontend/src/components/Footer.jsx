import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-yellow-400 font-bold text-lg mb-3">GyG Puertas Automáticas</h3>
          <p className="text-gray-400 text-sm">Soluciones en puertas automáticas para tu hogar y empresa. Calidad y seguridad garantizada.</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-3">Enlaces rápidos</h4>
          <ul className="text-gray-400 text-sm space-y-2">
            <li><Link to="/catalogo" className="hover:text-yellow-400 transition">Catálogo</Link></li>
            <li><Link to="/cotizar" className="hover:text-yellow-400 transition">Solicitar Cotización</Link></li>
            <li><Link to="/mantenimiento" className="hover:text-yellow-400 transition">Mantenimiento</Link></li>
            <li><Link to="/seguimiento" className="hover:text-yellow-400 transition">Seguimiento</Link></li>
            <li><Link to="/faq" className="hover:text-yellow-400 transition">Preguntas Frecuentes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-3">Contacto</h4>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>📍 Lima, Perú</li>
            <li>📧 contacto@gygpuertas.com</li>
            <li>📞 +51 999 999 999</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center text-gray-500 text-sm py-4">
        © 2026 GyG Puertas Automáticas. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer