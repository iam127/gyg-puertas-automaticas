import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { removeTokens } from '../services/auth'
import {
  FaThLarge, FaBox, FaFileAlt, FaWrench,
  FaUsers, FaImages, FaChartBar, FaSignOutAlt,
  FaBars, FaTimes
} from 'react-icons/fa'
import logo from '../assets/Logo-gyg.png'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaThLarge /> },
  { id: 'productos', label: 'Productos', icon: <FaBox /> },
  { id: 'cotizaciones', label: 'Cotizaciones', icon: <FaFileAlt /> },
  { id: 'mantenimientos', label: 'Mantenimientos', icon: <FaWrench /> },
  { id: 'tecnicos', label: 'Tecnicos', icon: <FaUsers /> },
  { id: 'contenido', label: 'Contenido', icon: <FaImages /> },
  { id: 'reportes', label: 'Reportes', icon: <FaChartBar /> },
]

function AdminPanel() {
  const [seccionActiva, setSeccionActiva] = useState('dashboard')
  const [sidebarAbierto, setSidebarAbierto] = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => {
    removeTokens()
    navigate('/admin-login')
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className={`${sidebarAbierto ? 'w-64' : 'w-16'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {sidebarAbierto && (
            <img src={logo} alt="GyG" className="h-10 object-contain bg-white rounded-lg px-2" />
          )}
          <button onClick={() => setSidebarAbierto(!sidebarAbierto)} className="text-gray-400 hover:text-white transition">
            {sidebarAbierto ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSeccionActiva(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                seccionActiva === item.id
                  ? 'bg-yellow-400 text-gray-900 font-bold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarAbierto && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition border-t border-gray-700"
        >
          <FaSignOutAlt size={18} />
          {sidebarAbierto && <span>Cerrar sesion</span>}
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 capitalize">{seccionActiva}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaUsers size={16} />
            <span>Administrador</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {seccionActiva === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Bienvenido al Panel de GyG</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Cotizaciones', valor: '0', color: 'bg-blue-500' },
                  { label: 'Mantenimientos', valor: '0', color: 'bg-green-500' },
                  { label: 'Productos', valor: '0', color: 'bg-yellow-500' },
                  { label: 'Tecnicos', valor: '0', color: 'bg-purple-500' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white rounded-xl shadow p-6">
                    <div className={`${kpi.color} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-3`}>
                      {kpi.valor}
                    </div>
                    <p className="text-gray-600 text-sm">{kpi.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-lg mb-4">Actividad reciente</h3>
                <p className="text-gray-500 text-sm">No hay actividad reciente.</p>
              </div>
            </div>
          )}

          {seccionActiva !== 'dashboard' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 capitalize">{seccionActiva}</h2>
              <p className="text-gray-500">Esta seccion esta en desarrollo.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminPanel