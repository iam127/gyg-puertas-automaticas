import { useEffect, useState } from 'react'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import api from '../services/api'
import { FaFileExcel, FaChartBar, FaChartPie, FaFileAlt, FaWrench, FaBox, FaCheckCircle } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

function AdminReportes() {
  const [stats, setStats] = useState({
    cotizaciones: [],
    mantenimientos: [],
    productos: [],
  })
  const [cargando, setCargando] = useState(true)

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

  const exportarExcel = async (datos, nombre) => {
    if (datos.length === 0) return

    const encabezados = {
      codigo: 'Codigo',
      nombre_cliente: 'Cliente',
      telefono: 'Telefono',
      correo: 'Correo',
      distrito: 'Distrito',
      tipo_uso: 'Tipo de Uso',
      tipo: 'Tipo',
      estado: 'Estado',
      disponibilidad: 'Disponibilidad',
      descripcion: 'Descripcion',
      descripcion_problema: 'Problema',
      tipo_puerta: 'Tipo de Puerta',
      creado_en: 'Fecha',
    }

    const camposPermitidos = Object.keys(encabezados)

    const datosLimpios = datos.map(item => {
      const fila = {}
      camposPermitidos.forEach(campo => {
        if (item[campo] !== undefined) {
          let valor = item[campo]
          if (campo === 'creado_en' && valor) {
            valor = new Date(valor).toLocaleDateString('es-PE')
          }
          fila[encabezados[campo]] = valor || '-'
        }
      })
      return fila
    })

    const wb = new ExcelJS.Workbook()
    wb.creator = 'GyG Puertas Automaticas'
    wb.created = new Date()

    const ws = wb.addWorksheet(nombre, {
      pageSetup: { paperSize: 9, orientation: 'landscape' }
    })

    const headerKeys = Object.keys(datosLimpios[0] || {})
    const numCols = headerKeys.length
    const fechaHoy = new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    ws.columns = headerKeys.map(key => ({
      width: key === 'Descripcion' || key === 'Problema' ? 40 : key === 'Cliente' || key === 'Correo' ? 28 : 20
    }))

    // Fila 1 - Titulo empresa
    ws.mergeCells(1, 1, 1, numCols)
    const tituloCell = ws.getCell('A1')
    tituloCell.value = 'GyG Puertas Automaticas'
    tituloCell.font = { bold: true, size: 18, color: { argb: 'FF111827' }, name: 'Calibri' }
    tituloCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFACC15' } }
    tituloCell.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(1).height = 35

    // Fila 2 - Subtitulo reporte
    ws.mergeCells(2, 1, 2, numCols)
    const subtituloCell = ws.getCell('A2')
    subtituloCell.value = `Reporte de ${nombre}`
    subtituloCell.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' }, name: 'Calibri' }
    subtituloCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } }
    subtituloCell.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(2).height = 25

    // Fila 3 - Fecha
    ws.mergeCells(3, 1, 3, numCols)
    const fechaCell = ws.getCell('A3')
    fechaCell.value = `Exportado el: ${fechaHoy}`
    fechaCell.font = { italic: true, size: 10, color: { argb: 'FF6B7280' }, name: 'Calibri' }
    fechaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEFCE8' } }
    fechaCell.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(3).height = 18

    // Fila 4 - Total registros
    ws.mergeCells(4, 1, 4, numCols)
    const totalCell = ws.getCell('A4')
    totalCell.value = `Total de registros: ${datos.length}`
    totalCell.font = { bold: true, size: 10, color: { argb: 'FF374151' }, name: 'Calibri' }
    totalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF9C3' } }
    totalCell.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(4).height = 18

    // Fila 5 - Espacio
    ws.addRow([])
    ws.getRow(5).height = 8

    // Fila 6 - Headers
    const headerRow = ws.addRow(headerKeys)
    headerRow.height = 28
    headerRow.eachCell(cell => {
      cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' }, name: 'Calibri' }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111827' } }
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
      cell.border = {
        top: { style: 'medium', color: { argb: 'FFFACC15' } },
        bottom: { style: 'medium', color: { argb: 'FFFACC15' } },
        left: { style: 'thin', color: { argb: 'FF374151' } },
        right: { style: 'thin', color: { argb: 'FF374151' } },
      }
    })

    // Filas de datos
    datosLimpios.forEach((fila, rowIdx) => {
      const row = ws.addRow(Object.values(fila))
      row.height = 20
      const esPar = rowIdx % 2 === 0
      row.eachCell((cell, colNumber) => {
        if (colNumber === 1) {
          cell.font = { bold: true, size: 10, color: { argb: 'FFB45309' }, name: 'Calibri' }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFBEB' } }
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        } else {
          cell.font = { size: 10, color: { argb: 'FF111827' }, name: 'Calibri' }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: esPar ? 'FFF9FAFB' : 'FFFFFFFF' } }
          cell.alignment = { vertical: 'middle' }
        }
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        }
      })
    })

    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `GyG_${nombre}_${new Date().toLocaleDateString('es-PE').replace(/\//g, '-')}.xlsx`)
  }

  const colorEstado = {
    recibido: 'bg-blue-500',
    en_revision: 'bg-yellow-500',
    visita_agendada: 'bg-purple-500',
    cotizado: 'bg-orange-500',
    aceptado: 'bg-green-500',
    rechazado: 'bg-red-500',
    completado: 'bg-green-600',
    cancelado: 'bg-red-600',
    en_proceso: 'bg-orange-400',
    preventivo: 'bg-blue-500',
    correctivo: 'bg-orange-500',
    garantia: 'bg-green-500',
    residencial: 'bg-blue-500',
    comercial: 'bg-yellow-500',
    industrial: 'bg-gray-500',
  }

  if (cargando) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <Helmet>
        <title>Reportes | GyG Admin</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <FaChartBar size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Estadisticas y exportacion de datos</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportarExcel(stats.cotizaciones, 'Cotizaciones')}
            className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2 text-sm shadow-sm"
          >
            <FaFileExcel size={13} />
            Exportar Cotizaciones
          </button>
          <button
            onClick={() => exportarExcel(stats.mantenimientos, 'Mantenimientos')}
            className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2 text-sm shadow-sm"
          >
            <FaFileExcel size={13} />
            Exportar Mantenimientos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Cotizaciones', valor: stats.cotizaciones.length, color: 'from-blue-500 to-blue-600', icono: <FaFileAlt size={18} /> },
          { label: 'Total Mantenimientos', valor: stats.mantenimientos.length, color: 'from-green-500 to-green-600', icono: <FaWrench size={18} /> },
          { label: 'Total Productos', valor: stats.productos.length, color: 'from-yellow-500 to-yellow-600', icono: <FaBox size={18} /> },
          {
            label: 'Completados',
            valor: stats.cotizaciones.filter(c => c.estado === 'completado').length + stats.mantenimientos.filter(m => m.estado === 'completado').length,
            color: 'from-purple-500 to-purple-600',
            icono: <FaCheckCircle size={18} />
          },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${kpi.color} opacity-10 rounded-full -mr-8 -mt-8`} />
            <div className={`w-11 h-11 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-sm`}>
              {kpi.icono}
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{kpi.valor}</p>
            <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaChartBar size={14} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Cotizaciones por Estado</h3>
          </div>
          {Object.keys(estadosCotizaciones).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sin datos disponibles</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(estadosCotizaciones).map(([estado, count]) => (
                <div key={estado}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="capitalize font-medium text-gray-700">{estado.replace(/_/g, ' ')}</span>
                    <span className="font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg text-xs">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${colorEstado[estado] || 'bg-gray-400'} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max((count / stats.cotizaciones.length) * 100, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FaChartBar size={14} className="text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900">Mantenimientos por Estado</h3>
          </div>
          {Object.keys(estadosMantenimientos).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sin datos disponibles</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(estadosMantenimientos).map(([estado, count]) => (
                <div key={estado}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="capitalize font-medium text-gray-700">{estado.replace(/_/g, ' ')}</span>
                    <span className="font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg text-xs">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${colorEstado[estado] || 'bg-gray-400'} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max((count / stats.mantenimientos.length) * 100, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaChartPie size={14} className="text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900">Mantenimientos por Tipo</h3>
          </div>
          {Object.keys(tiposMantenimientos).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sin datos disponibles</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(tiposMantenimientos).map(([tipo, count]) => (
                <div key={tipo}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="capitalize font-medium text-gray-700">{tipo}</span>
                    <span className="font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg text-xs">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${colorEstado[tipo] || 'bg-gray-400'} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max((count / stats.mantenimientos.length) * 100, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaChartPie size={14} className="text-yellow-600" />
            </div>
            <h3 className="font-bold text-gray-900">Productos por Tipo de Uso</h3>
          </div>
          {Object.keys(usoProductos).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sin datos disponibles</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(usoProductos).map(([uso, count]) => (
                <div key={uso}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="capitalize font-medium text-gray-700">{uso}</span>
                    <span className="font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg text-xs">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${colorEstado[uso] || 'bg-gray-400'} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max((count / stats.productos.length) * 100, 5)}%` }}
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