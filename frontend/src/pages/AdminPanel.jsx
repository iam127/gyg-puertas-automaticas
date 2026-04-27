import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { removeTokens } from '../services/auth'
import {
  FaThLarge, FaBox, FaFileAlt, FaWrench,
  FaUsers, FaImages, FaChartBar, FaSignOutAlt,
  FaBars, FaTimes, FaCheckCircle, FaClock,
  FaExclamationTriangle, FaWhatsapp, FaEnvelope
} from 'react-icons/fa'
import logo from '../assets/Logo-gyg-Admin.png'
import api from '../services/api'
import AdminCotizaciones from './AdminCotizaciones'
import AdminProductos from './AdminProductos'
import AdminMantenimientos from './AdminMantenimientos'
import AdminTecnicos from './AdminTecnicos'
import AdminContenido from './AdminContenido'
import AdminReportes from './AdminReportes'
import { Helmet } from 'react-helmet-async'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaThLarge /> },
  { id: 'productos', label: 'Productos', icon: <FaBox /> },
  { id: 'cotizaciones', label: 'Cotizaciones', icon: <FaFileAlt /> },
  { id: 'mantenimientos', label: 'Mantenimientos', icon: <FaWrench /> },
  { id: 'tecnicos', label: 'Tecnicos', icon: <FaUsers /> },
  { id: 'contenido', label: 'Contenido', icon: <FaImages /> },
  { id: 'reportes', label: 'Reportes', icon: <FaChartBar /> },
]

const estadoColor = {
  recibido: 'bg-blue-100 text-blue-700',
  en_revision: 'bg-yellow-100 text-yellow-700',
  visita_agendada: 'bg-purple-100 text-purple-700',
  cotizado: 'bg-orange-100 text-orange-700',
  aceptado: 'bg-green-100 text-green-700',
  rechazado: 'bg-red-100 text-red-700',
  completado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
  en_proceso: 'bg-orange-100 text-orange-700',
  resuelto: 'bg-green-100 text-green-700',
}

function AdminPanel() {
  const [seccionActiva, setSeccionActiva] = useState('dashboard')
  const [sidebarAbierto, setSidebarAbierto] = useState(true)
  const [kpis, setKpis] = useState({ cotizaciones: 0, mantenimientos: 0, productos: 0, tecnicos: 0 })
  const [cotizaciones, setCotizaciones] = useState([])
  const [mantenimientos, setMantenimientos] = useState([])
  const [actividadReciente, setActividadReciente] = useState([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setCargando(true)
    Promise.all([
      api.get('/cotizaciones/'),
      api.get('/mantenimientos/'),
      api.get('/productos/'),
      api.get('/tecnicos/'),
    ]).then(([cotRes, manRes, proRes, tecRes]) => {
      setCotizaciones(cotRes.data)
      setMantenimientos(manRes.data)
      setKpis({
        cotizaciones: cotRes.data.length,
        mantenimientos: manRes.data.length,
        productos: proRes.data.length,
        tecnicos: tecRes.data.length,
      })
      const recientes = [
        ...cotRes.data.slice(0, 5).map(c => ({
          tipo: 'Cotizacion',
          descripcion: `${c.nombre_cliente}`,
          detalle: c.distrito,
          estado: c.estado,
          fecha: c.creado_en,
          codigo: c.codigo,
          telefono: c.telefono,
          color: 'bg-blue-500',
          icono: <FaFileAlt size={12} />,
        })),
        ...manRes.data.slice(0, 5).map(m => ({
          tipo: 'Mantenimiento',
          descripcion: `${m.nombre_cliente}`,
          detalle: m.tipo,
          estado: m.estado,
          fecha: m.creado_en,
          codigo: m.codigo,
          telefono: m.telefono,
          color: 'bg-green-500',
          icono: <FaWrench size={12} />,
        })),
      ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 8)
      setActividadReciente(recientes)
    }).catch(() => {}).finally(() => setCargando(false))
  }, [])

  const handleLogout = () => {
    removeTokens()
    navigate('/admin-login')
  }

  const pendientesCotizaciones = cotizaciones.filter(c => c.estado === 'recibido').length
  const pendientesMantenimientos = mantenimientos.filter(m => m.estado === 'recibido').length
  const completadosCotizaciones = cotizaciones.filter(c => c.estado === 'completado').length
  const completadosMantenimientos = mantenimientos.filter(m => m.estado === 'resuelto' || m.estado === 'completado').length

  const estadosCotizaciones = cotizaciones.reduce((acc, c) => {
    acc[c.estado] = (acc[c.estado] || 0) + 1
    return acc
  }, {})

  return (
    <div className="flex h-screen bg-gray-100">
      <Helmet>
        <title>Panel | GyG Admin</title>
      </Helmet>

      {/* SIDEBAR */}
      <div className={`${sidebarAbierto ? 'w-64' : 'w-16'} bg-gray-950 text-white transition-all duration-300 flex flex-col flex-shrink-0`}>
        <div className="flex items-center justify-center px-4 py-5 border-b border-gray-800">
          {sidebarAbierto && (
            <img src={logo} alt="GyG" className="h-20 object-contain" />
          )}
          {!sidebarAbierto && (
            <button onClick={() => setSidebarAbierto(true)} className="text-gray-500 hover:text-white transition p-1">
              <FaBars size={18} />
            </button>
          )}
        </div>

        {sidebarAbierto && (
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Menu principal</p>
          </div>
        )}

        <nav className="flex-1 py-3">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSeccionActiva(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                seccionActiva === item.id
                  ? 'bg-yellow-400 text-gray-900 font-bold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } ${!sidebarAbierto ? 'justify-center' : ''}`}
              title={!sidebarAbierto ? item.label : ''}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarAbierto && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-4 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition ${!sidebarAbierto ? 'justify-center' : ''}`}
          >
            <FaSignOutAlt size={16} className="flex-shrink-0" />
            {sidebarAbierto && <span>Cerrar sesion</span>}
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900 capitalize">{seccionActiva === 'dashboard' ? 'Dashboard' : seccionActiva}</h1>
            <p className="text-xs text-gray-400">Panel de administracion - GyG Puertas Automaticas</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
            <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center font-bold text-yellow-400 text-sm flex-shrink-0">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Administrador</p>
              <p className="text-xs text-gray-400">GyG Puertas Automaticas</p>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-6">
          {seccionActiva === 'dashboard' && (
            <div className="space-y-6">

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Cotizaciones', valor: kpis.cotizaciones, sub: `${pendientesCotizaciones} pendientes`, color: 'from-blue-500 to-blue-600', seccion: 'cotizaciones', icono: <FaFileAlt size={18} /> },
                  { label: 'Mantenimientos', valor: kpis.mantenimientos, sub: `${pendientesMantenimientos} pendientes`, color: 'from-green-500 to-green-600', seccion: 'mantenimientos', icono: <FaWrench size={18} /> },
                  { label: 'Productos', valor: kpis.productos, sub: 'en catalogo', color: 'from-yellow-500 to-yellow-600', seccion: 'productos', icono: <FaBox size={18} /> },
                  { label: 'Tecnicos', valor: kpis.tecnicos, sub: 'registrados', color: 'from-purple-500 to-purple-600', seccion: 'tecnicos', icono: <FaUsers size={18} /> },
                ].map((kpi, i) => (
                  <div
                    key={i}
                    onClick={() => setSeccionActiva(kpi.seccion)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition group overflow-hidden relative"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${kpi.color} opacity-10 rounded-full -mr-8 -mt-8`} />
                    <div className={`w-11 h-11 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-sm`}>
                      {kpi.icono}
                    </div>
                    <p className="text-3xl font-black text-gray-900 mb-1">{cargando ? '...' : kpi.valor}</p>
                    <p className="text-sm font-bold text-gray-700">{kpi.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              {/* ALERTAS */}
              {(pendientesCotizaciones > 0 || pendientesMantenimientos > 0) && (
                <div className="grid grid-cols-1 gap-4">
                  {pendientesCotizaciones > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-4">
                      <div className="bg-blue-500 w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <FaExclamationTriangle size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-blue-800 text-sm">{pendientesCotizaciones} cotizaciones pendientes</p>
                        <p className="text-blue-600 text-xs">Requieren atencion inmediata</p>
                      </div>
                      <button onClick={() => setSeccionActiva('cotizaciones')} className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition">
                        Ver ahora
                      </button>
                    </div>
                  )}
                  {pendientesMantenimientos > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-4">
                      <div className="bg-green-500 w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <FaExclamationTriangle size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-green-800 text-sm">{pendientesMantenimientos} mantenimientos pendientes</p>
                        <p className="text-green-600 text-xs">Requieren atencion inmediata</p>
                      </div>
                      <button onClick={() => setSeccionActiva('mantenimientos')} className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-600 transition">
                        Ver ahora
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* ACTIVIDAD RECIENTE */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">Actividad reciente</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{actividadReciente.length} ultimos registros</p>
                    </div>
                    <button onClick={() => setSeccionActiva('cotizaciones')} className="text-xs text-yellow-500 font-bold hover:underline">
                      Ver todos
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {cargando ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : actividadReciente.length === 0 ? (
                      <div className="text-center py-12">
                        <FaClock size={24} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No hay actividad reciente.</p>
                      </div>
                    ) : actividadReciente.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition">
                        <div className={`${item.color} w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                          {item.icono}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{item.descripcion}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.codigo} · {item.detalle}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoColor[item.estado] || 'bg-gray-100 text-gray-600'}`}>
                            {item.estado?.replace(/_/g, ' ')}
                          </span>
                          <a href={`https://wa.me/51${item.telefono}`} target="_blank" rel="noreferrer" className="w-7 h-7 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition">
                            <FaWhatsapp size={13} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PANEL DERECHO */}
                <div className="space-y-4">

                  {/* ESTADOS */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900 text-sm">Estados de cotizaciones</h3>
                    </div>
                    <div className="p-5 space-y-3">
                      {Object.keys(estadosCotizaciones).length === 0 ? (
                        <p className="text-gray-400 text-xs text-center py-2">Sin datos</p>
                      ) : Object.entries(estadosCotizaciones).map(([estado, count]) => (
                        <div key={estado}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-gray-600 capitalize font-medium">{estado.replace(/_/g, ' ')}</span>
                            <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded-md">{count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max((count / kpis.cotizaciones) * 100, 8)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACCESOS RAPIDOS */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 text-sm mb-3">Accesos rapidos</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Ver cotizaciones', seccion: 'cotizaciones', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100', icono: <FaFileAlt size={11} /> },
                        { label: 'Ver mantenimientos', seccion: 'mantenimientos', color: 'bg-green-50 text-green-700 hover:bg-green-100', icono: <FaWrench size={11} /> },
                        { label: 'Gestionar productos', seccion: 'productos', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100', icono: <FaBox size={11} /> },
                        { label: 'Gestionar contenido', seccion: 'contenido', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100', icono: <FaImages size={11} /> },
                      ].map((acc, i) => (
                        <button
                          key={i}
                          onClick={() => setSeccionActiva(acc.seccion)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${acc.color}`}
                        >
                          {acc.icono} {acc.label}
                        </button>
                      ))}
                      <a
                        href="mailto:gygpuertasautomaticas@gmail.com"
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold bg-gray-50 text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
                      >
                        <FaEnvelope size={11} /> Correo empresa
                      </a>
                    </div>
                  </div>

                  {/* RESUMEN */}
                  <div className="bg-gray-900 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheckCircle size={13} className="text-yellow-400" />
                      <p className="text-sm font-bold">Resumen general</p>
                    </div>
                    <p className="text-gray-500 text-xs mb-4">{new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Cotizaciones completadas</span>
                        <span className="text-green-400 font-black text-lg">{completadosCotizaciones}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1">
                        <div className="bg-green-400 h-1 rounded-full" style={{ width: kpis.cotizaciones > 0 ? `${(completadosCotizaciones / kpis.cotizaciones) * 100}%` : '0%' }} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Mantenimientos resueltos</span>
                        <span className="text-green-400 font-black text-lg">{completadosMantenimientos}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1">
                        <div className="bg-green-400 h-1 rounded-full" style={{ width: kpis.mantenimientos > 0 ? `${(completadosMantenimientos / kpis.mantenimientos) * 100}%` : '0%' }} />
                      </div>
                      <div className="border-t border-gray-800 pt-3 flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Pendientes total</span>
                        <span className="text-yellow-400 font-black text-lg">{pendientesCotizaciones + pendientesMantenimientos}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {seccionActiva === 'cotizaciones' && <AdminCotizaciones />}
          {seccionActiva === 'productos' && <AdminProductos />}
          {seccionActiva === 'mantenimientos' && <AdminMantenimientos />}
          {seccionActiva === 'tecnicos' && <AdminTecnicos />}
          {seccionActiva === 'contenido' && <AdminContenido />}
          {seccionActiva === 'reportes' && <AdminReportes />}
        </main>
      </div>
    </div>
  )
}

export default AdminPanel