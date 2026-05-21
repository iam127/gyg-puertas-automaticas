import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { removeTokens } from '../services/auth'
import {
  FaThLarge, FaBox, FaFileAlt, FaWrench,
  FaUsers, FaImages, FaChartBar, FaSignOutAlt,
  FaBars, FaTimes, FaClock, FaWhatsapp, FaEnvelope,
  FaArrowUp
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
  { id: 'tecnicos', label: 'Técnicos', icon: <FaUsers /> },
  { id: 'contenido', label: 'Contenido', icon: <FaImages /> },
  { id: 'reportes', label: 'Reportes', icon: <FaChartBar /> },
]

const estadoColor = {
  recibido: 'bg-blue-50 text-blue-700 border-blue-200',
  en_revision: 'bg-slate-50 text-slate-700 border-slate-200',
  visita_agendada: 'bg-slate-50 text-slate-700 border-slate-200',
  cotizado: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  aceptado: 'bg-blue-50 text-blue-700 border-blue-200',
  rechazado: 'bg-slate-100 text-slate-700 border-slate-300',
  completado: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelado: 'bg-slate-100 text-slate-700 border-slate-300',
  en_proceso: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  resuelto: 'bg-blue-50 text-blue-700 border-blue-200',
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
          tipo: 'Cotización',
          descripcion: `${c.nombre_cliente}`,
          detalle: c.distrito,
          estado: c.estado,
          fecha: c.creado_en,
          codigo: c.codigo,
          telefono: c.telefono,
          color: 'bg-slate-700',
          icono: <FaFileAlt size={14} />,
        })),
        ...manRes.data.slice(0, 5).map(m => ({
          tipo: 'Mantenimiento',
          descripcion: `${m.nombre_cliente}`,
          detalle: m.tipo,
          estado: m.estado,
          fecha: m.creado_en,
          codigo: m.codigo,
          telefono: m.telefono,
          color: 'bg-slate-700',
          icono: <FaWrench size={14} />,
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
    <div className="flex h-screen bg-gray-50">
      <Helmet>
        <title>Panel | GyG Admin</title>
      </Helmet>

      {/* SIDEBAR ORIGINAL */}
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
            <p className="text-xs text-gray-500 uppercase tracking-wider">Menú principal</p>
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
            {sidebarAbierto && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900 capitalize flex items-center gap-3">
              {seccionActiva === 'dashboard' ? 'Dashboard' : seccionActiva}
              {(pendientesCotizaciones > 0 || pendientesMantenimientos > 0) && seccionActiva === 'dashboard' && (
                <span className="bg-yellow-400 text-gray-900 text-xs px-2.5 py-1 rounded-full font-bold">
                  {pendientesCotizaciones + pendientesMantenimientos}
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-400">Panel de administración - GyG Puertas Automáticas</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
            <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center font-bold text-yellow-400 text-sm flex-shrink-0">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Administrador</p>
              <p className="text-xs text-gray-400">GyG Puertas Automáticas</p>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {seccionActiva === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">

              {/* KPIs PROFESIONALES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { 
                    label: 'Cotizaciones', 
                    valor: kpis.cotizaciones, 
                    sub: `${pendientesCotizaciones} pendientes`, 
                    seccion: 'cotizaciones', 
                    icono: <FaFileAlt size={20} />
                  },
                  { 
                    label: 'Mantenimientos', 
                    valor: kpis.mantenimientos, 
                    sub: `${pendientesMantenimientos} pendientes`, 
                    seccion: 'mantenimientos', 
                    icono: <FaWrench size={20} />
                  },
                  { 
                    label: 'Productos', 
                    valor: kpis.productos, 
                    sub: 'en catálogo', 
                    seccion: 'productos', 
                    icono: <FaBox size={20} />
                  },
                  { 
                    label: 'Técnicos', 
                    valor: kpis.tecnicos, 
                    sub: 'registrados', 
                    seccion: 'tecnicos', 
                    icono: <FaUsers size={20} />
                  },
                ].map((kpi, i) => (
                  <div
                    key={i}
                    onClick={() => setSeccionActiva(kpi.seccion)}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-yellow-400">
                        {kpi.icono}
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{cargando ? '...' : kpi.valor}</p>
                    <p className="text-sm font-semibold text-gray-700">{kpi.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              {/* ALERTAS */}
              {(pendientesCotizaciones > 0 || pendientesMantenimientos > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {pendientesCotizaciones > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                      <div className="flex items-start gap-4">
                        <div className="bg-yellow-400 w-11 h-11 rounded-lg flex items-center justify-center text-gray-900 flex-shrink-0">
                          <FaFileAlt size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-base mb-1">{pendientesCotizaciones} cotizaciones pendientes</p>
                          <p className="text-gray-600 text-sm mb-3">Requieren revisión y respuesta inmediata</p>
                          <button 
                            onClick={() => setSeccionActiva('cotizaciones')} 
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
                          >
                            Revisar ahora
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {pendientesMantenimientos > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                      <div className="flex items-start gap-4">
                        <div className="bg-yellow-400 w-11 h-11 rounded-lg flex items-center justify-center text-gray-900 flex-shrink-0">
                          <FaWrench size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-base mb-1">{pendientesMantenimientos} mantenimientos pendientes</p>
                          <p className="text-gray-600 text-sm mb-3">Requieren asignación de técnico</p>
                          <button 
                            onClick={() => setSeccionActiva('mantenimientos')} 
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
                          >
                            Revisar ahora
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ACTIVIDAD RECIENTE */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Actividad reciente</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{actividadReciente.length} registros más recientes</p>
                      </div>
                      <button 
                        onClick={() => setSeccionActiva('cotizaciones')} 
                        className="text-sm text-gray-700 font-semibold hover:text-gray-900 transition"
                      >
                        Ver todo →
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {cargando ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                      </div>
                    ) : actividadReciente.length === 0 ? (
                      <div className="text-center py-16">
                        <FaClock size={32} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm font-medium">No hay actividad reciente</p>
                        <p className="text-gray-400 text-xs mt-1">Los nuevos registros aparecerán aquí</p>
                      </div>
                    ) : actividadReciente.map((item, i) => (
                      <div key={i} className="px-6 py-4 hover:bg-gray-50 transition">
                        <div className="flex items-start gap-4">
                          <div className={`${item.color} w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                            {item.icono}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <p className="text-sm font-semibold text-gray-900">{item.descripcion}</p>
                              <span className={`text-xs px-2.5 py-1 rounded-md font-medium border whitespace-nowrap ${estadoColor[item.estado] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                {item.estado?.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              <span className="font-medium text-gray-700">{item.codigo}</span> · {item.detalle}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-400">
                                {new Date(item.fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <a 
                                href={`https://wa.me/51${item.telefono}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="ml-auto bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-800 transition flex items-center gap-1.5"
                              >
                                <FaWhatsapp size={13} /> Contactar
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PANEL DERECHO */}
                <div className="space-y-6">

                  {/* ESTADOS */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-5 py-4 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900">Estados de cotizaciones</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Distribución actual</p>
                    </div>
                    <div className="p-5 space-y-3.5">
                      {Object.keys(estadosCotizaciones).length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">Sin datos disponibles</p>
                      ) : Object.entries(estadosCotizaciones).map(([estado, count]) => (
                        <div key={estado}>
                          <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="text-gray-700 capitalize font-medium">{estado.replace(/_/g, ' ')}</span>
                            <span className="font-bold text-gray-900">{count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gray-900 h-2.5 rounded-full transition-all duration-700"
                              style={{ width: `${Math.max((count / kpis.cotizaciones) * 100, 5)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RESUMEN */}
                  <div className="bg-gray-900 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-yellow-400 p-2 rounded-lg">
                        <FaChartBar size={16} className="text-gray-900" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Resumen del día</p>
                        <p className="text-xs text-gray-400">
                          {new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-300">Cotizaciones completadas</span>
                          <span className="text-yellow-400 font-bold text-lg">{completadosCotizaciones}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div 
                            className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: kpis.cotizaciones > 0 ? `${(completadosCotizaciones / kpis.cotizaciones) * 100}%` : '0%' }} 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-300">Mantenimientos resueltos</span>
                          <span className="text-yellow-400 font-bold text-lg">{completadosMantenimientos}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div 
                            className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: kpis.mantenimientos > 0 ? `${(completadosMantenimientos / kpis.mantenimientos) * 100}%` : '0%' }} 
                          />
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-800 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-300">Total pendientes</span>
                          <span className="text-yellow-400 font-bold text-lg">{pendientesCotizaciones + pendientesMantenimientos}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACCESOS RAPIDOS */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="font-bold text-gray-900 text-sm mb-3">Accesos rápidos</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Ver cotizaciones', seccion: 'cotizaciones', icono: <FaFileAlt size={12} /> },
                        { label: 'Ver mantenimientos', seccion: 'mantenimientos', icono: <FaWrench size={12} /> },
                        { label: 'Gestionar productos', seccion: 'productos', icono: <FaBox size={12} /> },
                        { label: 'Gestionar contenido', seccion: 'contenido', icono: <FaImages size={12} /> },
                      ].map((acc, i) => (
                        <button
                          key={i}
                          onClick={() => setSeccionActiva(acc.seccion)}
                          className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition flex items-center gap-2"
                        >
                          {acc.icono} {acc.label}
                        </button>
                      ))}
                      <a
                        href="mailto:gygpuertasautomaticas@gmail.com"
                        className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition flex items-center gap-2"
                      >
                        <FaEnvelope size={12} /> Correo empresa
                      </a>
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