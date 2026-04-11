import { Link } from 'react-router-dom'
import logo from '../assets/Logo-gyg.png'

function Footer() {
  const whatsappUrl = 'https://wa.me/51947316874?text=Hola%2C%20me%20gustaria%20obtener%20informacion%20sobre%20sus%20puertas%20automaticas'

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="md:col-span-2">
          <img src={logo} alt="GyG Puertas Automaticas" className="h-16 object-contain mb-4" />
          <p className="text-gray-500 text-sm mb-4">Soluciones en puertas automaticas para tu hogar y empresa. Calidad, seguridad y garantia en cada instalacion.</p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <a href="https://maps.google.com/?q=Manuel+Odria+161+Lima+Peru" target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition">
                Manuel Odria 161, Lima, Peru
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <a href="tel:+51947316864" className="hover:text-yellow-500 transition">
                +51 947 316 864
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>📧</span>
              <a href="mailto:gygpuertasautomaticas@gmail.com" className="hover:text-yellow-500 transition">
                gygpuertasautomaticas@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>💬</span>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition">
                +51 947 316 874 (WhatsApp)
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>🕐</span>
              <span>Atencion 24/7</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-3 text-gray-900">Enlaces rapidos</h4>
          <ul className="text-gray-600 text-sm space-y-2">
            <li><Link to="/catalogo" className="hover:text-yellow-500 transition">Catalogo</Link></li>
            <li><Link to="/cotizar" className="hover:text-yellow-500 transition">Solicitar Cotizacion</Link></li>
            <li><Link to="/mantenimiento" className="hover:text-yellow-500 transition">Mantenimiento</Link></li>
            <li><Link to="/seguimiento" className="hover:text-yellow-500 transition">Seguimiento</Link></li>
            <li><Link to="/galeria" className="hover:text-yellow-500 transition">Galeria</Link></li>
            <li><Link to="/blog" className="hover:text-yellow-500 transition">Blog</Link></li>
            <li><Link to="/faq" className="hover:text-yellow-500 transition">Preguntas Frecuentes</Link></li>
            <li><Link to="/nosotros" className="hover:text-yellow-500 transition">Nosotros</Link></li>
            <li><Link to="/contacto" className="hover:text-yellow-500 transition">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-3 text-gray-900">Servicios</h4>
          <ul className="text-gray-600 text-sm space-y-2">
            <li>Puertas Levadizas</li>
            <li>Puertas Corredizas</li>
            <li>Puertas Batientes</li>
            <li>Puertas Seccionales</li>
            <li>Puertas Industriales</li>
            <li>Cercos Electricos</li>
            <li>Barreras Automaticas</li>
          </ul>
          <div className="mt-6">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition flex items-center gap-2 w-fit">
              Escribenos por WhatsApp
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-200 text-gray-400 text-sm py-4 px-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <p>© 2026 GyG Puertas Automaticas. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <Link to="/faq" className="hover:text-yellow-500 transition">Preguntas Frecuentes</Link>
          <Link to="/contacto" className="hover:text-yellow-500 transition">Contacto</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer