import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaFileExcel, FaFilePdf, FaChartBar, FaChartPie } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

function AdminReportes() {
  const [stats, setStats] = useState({
    cotizaciones: [],
    mantenimientos: [],
    productos: [],
  })
  const [cargando, setCargando] = useState(true)
  const [rango, setRango] = useState('mes')

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = () => {
    setCargando(true)
    Promise.all([
      api.get('/cotizaciones/'),
      api.get('/mantenimientos/'),
      api.get('/productos/'),
    ]).then(([cotRes, manRes, proRes]) => {
      setStats({
        cotizaciones: cotRes.data,
        mantenimientos: manRes.data,
        productos: proRes.data,
      })
    }).finally(() => setCargando(false))
  }

  const contarPorEstado = (lista, campo = 'estado') => {
    return lista.reduce((acc, item) => {
      const estado = item[campo] || 'sin estado'
      acc[estado] = (acc[estado] || 0) + 1
      return acc
    }, {})
  }

  const contarPorTipo = (lista) => {
    return lista.reduce((acc, item) => {
      const tipo = item.tipo || 'sin tipo'
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    }, {})
  }

  const estadosCotizaciones = contarPorEstado(stats.cotizaciones)
  const estadosMantenimientos = contarPorEstado(stats.mantenimientos)
  const tiposMantenimientos = contarPorTipo(stats.mantenimientos)
  const usoProductos = contarPorEstado(stats.productos, 'uso')

  const exportarCSV = (datos, nombre) => {
    if (datos.length === 0) return
    const headers = Object.keys(datos[0]).join(',')
    const rows = datos.map(d => Object.values(d).join(',')).join('\n')
    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${nombre}.csv`
    a.click()
  }

  const colorEstado = {
    recibido: 'bg-blue-500',
    en_revision: 'bg-yellow-500',
    visita_agendada: 'bg-purple-500',
    cotizado: 'bg-orange-500',
    aceptado: 'bg-green-500',
    rechazado: 'bg-red-500',
    completado: 'bg-green-700',
    cancelado: 'bg-red-700',
    en_proceso: 'bg-orange-400',
    preventivo: 'bg-blue-500',
    correctivo: 'bg-orange-500',
    garantia: 'bg-green-500',
    residencial: 'bg-blue-500',
    comercial: 'bg-yellow-500',
    industrial: 'bg-gray-500',
  }

  if (cargando) return <p className="text-gray-500 text-center py-20">Cargando reportes...</p>

  return (
    <div>
      <Helmet>
        <title>Reportes | GyG Admin</title>
      </Helmet>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reportes</h2>
        <div className="flex gap-3">
          <button
            onClick={() => exportarCSV(stats.cotizaciones, 'cotizaciones')}
            className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2 text-sm"
          >
            <FaFileExcel size={14} />
            Exportar Cotizaciones
          </button>
          <button
            onClick={() => exportarCSV(stats.mantenimientos, 'mantenimientos')}
            className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2 text-sm"
          >
            <FaFileExcel size={14} />
            Exportar Mantenimientos
          </button>
        </div>
      </div>

      {/* KPIs GENERALES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Cotizaciones', valor: stats.cotizaciones.length, color: 'bg-blue-500' },
          { label: 'Total Mantenimientos', valor: stats.mantenimientos.length, color: 'bg-green-500' },
          { label: 'Total Productos', valor: stats.productos.length, color: 'bg-yellow-500' },
          { label: 'Completados', valor: stats.cotizaciones.filter(c => c.estado === 'completado').length + stats.mantenimientos.filter(m => m.estado === 'completado').length, color: 'bg-purple-500' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6">
            <div className={`${kpi.color} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-3`}>
              {kpi.valor}
            </div>
            <p className="text-gray-600 text-sm font-medium">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* COTIZACIONES POR ESTADO */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FaChartBar className="text-blue-500" />
            Cotizaciones por Estado
          </h3>
          {Object.keys(estadosCotizaciones).length === 0 ? (
            <p className="text-gray-500 text-sm">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(estadosCotizaciones).map(([estado, count]) => (
                <div key={estado}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{estado.replace(/_/g, ' ')}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${colorEstado[estado] || 'bg-gray-400'} h-2 rounded-full`}
                      style={{ width: `${(count / stats.cotizaciones.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MANTENIMIENTOS POR ESTADO */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FaChartBar className="text-green-500" />
            Mantenimientos por Estado
          </h3>
          {Object.keys(estadosMantenimientos).length === 0 ? (
            <p className="text-gray-500 text-sm">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(estadosMantenimientos).map(([estado, count]) => (
                <div key={estado}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{estado.replace(/_/g, ' ')}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${colorEstado[estado] || 'bg-gray-400'} h-2 rounded-full`}
                      style={{ width: `${(count / stats.mantenimientos.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MANTENIMIENTOS POR TIPO */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FaChartPie className="text-orange-500" />
            Mantenimientos por Tipo
          </h3>
          {Object.keys(tiposMantenimientos).length === 0 ? (
            <p className="text-gray-500 text-sm">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(tiposMantenimientos).map(([tipo, count]) => (
                <div key={tipo}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{tipo}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${colorEstado[tipo] || 'bg-gray-400'} h-2 rounded-full`}
                      style={{ width: `${(count / stats.mantenimientos.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCTOS POR USO */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FaChartPie className="text-yellow-500" />
            Productos por Tipo de Uso
          </h3>
          {Object.keys(usoProductos).length === 0 ? (
            <p className="text-gray-500 text-sm">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(usoProductos).map(([uso, count]) => (
                <div key={uso}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{uso}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${colorEstado[uso] || 'bg-gray-400'} h-2 rounded-full`}
                      style={{ width: `${(count / stats.productos.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminReportes