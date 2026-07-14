import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaSearch, FaTimes, FaEdit, FaWrench, FaWhatsapp, FaPhone, FaUserPlus, FaCheckCircle, FaFilePdf, FaDownload, FaHammer } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'recibido', label: 'Recibido' },
  { value: 'en_revision', label: 'En Revisión' },
  { value: 'visita_agendada', label: 'Visita Agendada' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'resuelto', label: 'Resuelto' },
  { value: 'cancelado', label: 'Cancelado' },
]

const estadoColor = {
  recibido: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  en_revision: 'bg-gray-100 text-gray-700 border-gray-300',
  visita_agendada: 'bg-blue-50 text-blue-700 border-blue-200',
  en_proceso: 'bg-orange-50 text-orange-700 border-orange-200',
  resuelto: 'bg-gray-900 text-white border-gray-900',
  cancelado: 'bg-red-50 text-red-600 border-red-200',
}

const tipoColor = {
  preventivo: 'bg-blue-50 text-blue-700 border-blue-200',
  correctivo: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  garantia: 'bg-gray-900 text-white border-gray-900',
}

function AdminMantenimientos() {
  const [mantenimientos, setMantenimientos] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState('')

  const [mostrarAsignacion, setMostrarAsignacion] = useState(false)
  const [tecnicoId, setTecnicoId] = useState('')
  const [fechaVisita, setFechaVisita] = useState('')
  const [horaVisita, setHoraVisita] = useState('')
  const [asignando, setAsignando] = useState(false)
  const [visitaExistente, setVisitaExistente] = useState(null)

  const [mostrarPdf, setMostrarPdf] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const [subiendoPdf, setSubiendoPdf] = useState(false)
  const [confirmandoMantenimiento, setConfirmandoMantenimiento] = useState(false)

  useEffect(() => {
    cargarMantenimientos()
    cargarTecnicos()
  }, [])

  useEffect(() => {
    if (seleccionado) {
      const visita = seleccionado.visitas?.[0] || null
      setVisitaExistente(visita)
      if (visita && !mostrarAsignacion) {
        setTecnicoId(visita.tecnico?.toString() || '')
        setFechaVisita(visita.fecha || '')
        setHoraVisita(visita.hora?.slice(0, 5) || '')
      } else if (!visita) {
        setTecnicoId('')
        setFechaVisita('')
        setHoraVisita('')
      }
      setMostrarPdf(false)
      setPdfFile(null)
    }
  }, [seleccionado])

  const cargarMantenimientos = () => {
    setCargando(true)
    api.get('/mantenimientos/')
      .then(res => setMantenimientos(res.data))
      .finally(() => setCargando(false))
  }

  const cargarTecnicos = () => {
    api.get('/tecnicos/').then(res => setTecnicos(res.data))
  }

  const cambiarEstado = (id) => {
    api.patch(`/mantenimientos/${id}/`, { estado: nuevoEstado })
      .then(() => {
        cargarMantenimientos()
        setSeleccionado(null)
      })
  }

  const asignarTecnico = () => {
    if (!tecnicoId || !fechaVisita || !horaVisita) {
      alert('Completa todos los campos de asignación')
      return
    }
    setAsignando(true)
    api.post(`/mantenimientos/${seleccionado.id}/asignar_tecnico/`, {
      tecnico_id: parseInt(tecnicoId),
      fecha: fechaVisita,
      hora: horaVisita,
    })
      .then(() => {
        cargarMantenimientos()
        setMostrarAsignacion(false)
        setSeleccionado(null)
        alert('Técnico asignado correctamente.')
      })
      .catch(e => alert('Error al asignar técnico: ' + (e.response?.data?.error || e.message)))
      .finally(() => setAsignando(false))
  }

  const confirmarMantenimiento = () => {
    if (!window.confirm('¿Confirmar mantenimiento al técnico? El estado cambiará a "En Proceso" y el técnico lo verá en su app.')) return
    setConfirmandoMantenimiento(true)
    api.patch(`/mantenimientos/${seleccionado.id}/`, { estado: 'en_proceso' })
      .then(() => {
        cargarMantenimientos()
        setSeleccionado(null)
        alert('✅ Mantenimiento confirmado. El técnico ya puede verlo en su app móvil.')
      })
      .catch(e => alert('Error: ' + (e.response?.data?.error || e.message)))
      .finally(() => setConfirmandoMantenimiento(false))
  }

  const subirPdf = () => {
    if (!pdfFile) return
    setSubiendoPdf(true)

    // Para mantenimientos usamos cotizaciones-formales pero vinculado al mantenimiento
    // Si no existe cotizacion formal, subimos el PDF directamente al mantenimiento
    const formData = new FormData()
    formData.append('pdf_cotizacion', pdfFile)

    // Intentamos subir como archivo adjunto al mantenimiento
    api.patch(`/mantenimientos/${seleccionado.id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        cargarMantenimientos()
        setPdfFile(null)
        setMostrarPdf(false)
        setSeleccionado(null)
        alert('PDF subido correctamente. El cliente recibirá la cotización.')
      })
      .catch(() => {
        // Si el modelo no tiene campo pdf, solo cambiamos estado a cotizado
        api.patch(`/mantenimientos/${seleccionado.id}/`, { estado: 'cotizado' })
          .then(() => {
            cargarMantenimientos()
            setPdfFile(null)
            setMostrarPdf(false)
            setSeleccionado(null)
          })
      })
      .finally(() => setSubiendoPdf(false))
  }

  const getTecnicoNombre = (id) => {
    const t = tecnicos.find(t => t.id === id)
    return t ? `${t.usuario.first_name} ${t.usuario.last_name}` : 'Desconocido'
  }

  const mantenimientosFiltrados = mantenimientos.filter(m => {
    const matchBusqueda = busqueda === '' ||
      m.nombre_cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.codigo?.toLowerCase().includes(busqueda.toLowerCase())
    const matchEstado = filtroEstado === '' || m.estado === filtroEstado
    return matchBusqueda && matchEstado
  })

  const pendientes = mantenimientos.filter(m => m.estado === 'recibido').length
  const completados = mantenimientos.filter(m => m.estado === 'resuelto').length
  const enProceso = mantenimientos.filter(m => m.estado === 'en_proceso').length

  return (
    <div>
      <Helmet><title>Mantenimientos | GyG Admin</title></Helmet>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gray-900 rounded-lg flex items-center justify-center">
            <FaWrench size={18} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestión de mantenimientos</h2>
            <p className="text-sm text-gray-500">{mantenimientos.length} mantenimientos registrados</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="w-11 h-11 bg-gray-900 rounded-lg flex items-center justify-center mb-3"><FaWrench size={18} className="text-yellow-400" /></div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{mantenimientos.length}</p>
          <p className="text-sm text-gray-600 font-medium">Total</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="w-11 h-11 bg-yellow-400 rounded-lg flex items-center justify-center mb-3"><FaWrench size={18} className="text-gray-900" /></div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{pendientes}</p>
          <p className="text-sm text-gray-600 font-medium">Por atender</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="w-11 h-11 bg-orange-500 rounded-lg flex items-center justify-center mb-3"><FaWrench size={18} className="text-white" /></div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{enProceso}</p>
          <p className="text-sm text-gray-600 font-medium">En proceso</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="w-11 h-11 bg-green-500 rounded-lg flex items-center justify-center mb-3"><FaWrench size={18} className="text-white" /></div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{completados}</p>
          <p className="text-sm text-gray-600 font-medium">Resueltos</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 flex-1 shadow-sm">
          <FaSearch size={15} className="text-gray-400" />
          <input type="text" placeholder="Buscar por nombre o código..." value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="flex-1 focus:outline-none text-sm bg-transparent text-gray-900 placeholder-gray-400" />
          {busqueda && <button onClick={() => setBusqueda('')} className="text-gray-400 hover:text-gray-600 transition"><FaTimes size={14} /></button>}
        </div>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none bg-white shadow-sm font-medium text-gray-700">
          {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : mantenimientosFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <FaWrench size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">No se encontraron mantenimientos</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Código</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Cliente</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Teléfono</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Tipo</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Distrito</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Estado</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Técnico</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mantenimientosFiltrados.map((m) => {
                const visita = m.visitas?.[0]
                const tecnicoAsignado = visita?.tecnico ? getTecnicoNombre(visita.tecnico) : null
                return (
                  <tr key={m.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-gray-900 whitespace-nowrap">{m.codigo}</span>
                        {m.estado === 'aceptado' && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium w-fit">Confirmar</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4"><p className="font-semibold text-gray-900">{m.nombre_cliente}</p></td>
                    <td className="px-5 py-4 text-gray-600">{m.telefono}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize border ${tipoColor[m.tipo] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        {m.tipo}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{m.distrito}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border whitespace-nowrap ${estadoColor[m.estado] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        {m.estado?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {tecnicoAsignado ? (
                        <div className="flex items-center gap-1.5">
                          <FaCheckCircle size={11} className="text-green-500" />
                          <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{tecnicoAsignado}</span>
                        </div>
                      ) : <span className="text-xs text-gray-400">Sin asignar</span>}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => { setSeleccionado(m); setNuevoEstado(m.estado); setMostrarAsignacion(false) }}
                        className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-800 transition flex items-center gap-1.5">
                        <FaEdit size={12} /> Gestionar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {seleccionado && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gray-900 rounded-lg flex items-center justify-center">
                  <FaWrench size={18} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{seleccionado.codigo}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Detalle del mantenimiento</p>
                </div>
              </div>
              <button onClick={() => setSeleccionado(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Cliente</p>
                  <p className="text-sm font-semibold text-gray-900">{seleccionado.nombre_cliente}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Teléfono</p>
                  <p className="text-sm font-semibold text-gray-900">{seleccionado.telefono}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Correo</p>
                  <p className="text-sm font-semibold text-gray-900 break-all">{seleccionado.correo}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Distrito</p>
                  <p className="text-sm font-semibold text-gray-900">{seleccionado.distrito}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Tipo</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{seleccionado.tipo}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Tipo de puerta</p>
                  <p className="text-sm font-semibold text-gray-900">{seleccionado.tipo_puerta}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 col-span-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">Disponibilidad</p>
                  <p className="text-sm font-semibold text-gray-900">{seleccionado.disponibilidad}</p>
                </div>
              </div>

              {seleccionado.descripcion_problema && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-2">Descripción del problema</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{seleccionado.descripcion_problema}</p>
                </div>
              )}

              {/* REPORTE DEL TÉCNICO */}
              {visitaExistente?.diagnostico && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-3">🔧 Reporte del técnico</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Diagnóstico</p>
                      <p className="text-sm text-gray-800 font-medium">{visitaExistente.diagnostico}</p>
                    </div>
                    {visitaExistente.trabajos_realizados && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Trabajos realizados</p>
                        <p className="text-sm text-gray-800 font-medium">{visitaExistente.trabajos_realizados}</p>
                      </div>
                    )}
                    {visitaExistente.repuestos_utilizados && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Repuestos utilizados</p>
                        <p className="text-sm text-gray-800 font-medium">{visitaExistente.repuestos_utilizados}</p>
                      </div>
                    )}
                    {visitaExistente.costo_total && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Costo adicional</p>
                        <p className="text-sm text-gray-800 font-medium">S/ {visitaExistente.costo_total}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FOTO DEL MANTENIMIENTO */}
              {visitaExistente?.foto_mantenimiento && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-3">📸 Foto del mantenimiento realizado</p>
                  <img
                    src={`http://127.0.0.1:8000${visitaExistente.foto_mantenimiento}`}
                    alt="Mantenimiento realizado"
                    className="w-full rounded-lg border border-green-200 mb-2"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                  <p className="text-xs text-green-600 font-medium text-center">Mantenimiento registrado por el técnico</p>
                </div>
              )}

              <div className="flex gap-3">
                <a href={`https://wa.me/51${seleccionado.telefono}`} target="_blank" rel="noreferrer"
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2">
                  <FaWhatsapp size={16} /> WhatsApp
                </a>
                <a href={`tel:+51${seleccionado.telefono}`}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold text-sm hover:bg-gray-200 transition flex items-center justify-center gap-2 border border-gray-200">
                  <FaPhone size={14} /> Llamar
                </a>
              </div>

              {/* CONFIRMAR MANTENIMIENTO — solo si estado es aceptado */}
              {seleccionado.estado === 'aceptado' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaHammer size={14} className="text-green-600" />
                    <p className="text-sm font-bold text-green-700">El cliente aceptó el mantenimiento</p>
                  </div>
                  <p className="text-xs text-green-600 mb-3">
                    Confirma el mantenimiento para que el técnico lo vea en su app móvil y pueda proceder con el trabajo.
                  </p>
                  <button
                    onClick={confirmarMantenimiento}
                    disabled={confirmandoMantenimiento}
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FaHammer size={13} />
                    {confirmandoMantenimiento ? 'Confirmando...' : 'Confirmar mantenimiento al técnico'}
                  </button>
                </div>
              )}

              {/* SUBIR PDF */}
              {visitaExistente?.diagnostico && seleccionado.estado === 'visita_agendada' && (
                <div className="border border-red-200 rounded-lg overflow-hidden">
                  <button onClick={() => setMostrarPdf(!mostrarPdf)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 transition">
                    <div className="flex items-center gap-2">
                      <FaFilePdf size={14} className="text-red-600" />
                      <span className="text-sm font-semibold text-red-700">Subir PDF de cotización de mantenimiento</span>
                    </div>
                    <span className="text-red-500 text-xs">{mostrarPdf ? '▲ Cerrar' : '▼ Abrir'}</span>
                  </button>
                  {mostrarPdf && (
                    <div className="p-4 bg-white space-y-3">
                      <p className="text-xs text-gray-500">Prepara la cotización en Word, conviértela a PDF y súbela. Se enviará automáticamente al cliente.</p>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Seleccionar archivo PDF *</label>
                        <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])}
                          className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none" />
                      </div>
                      {pdfFile && <p className="text-xs text-gray-500">Archivo: <span className="font-semibold text-gray-700">{pdfFile.name}</span></p>}
                      <button onClick={subirPdf} disabled={!pdfFile || subiendoPdf}
                        className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                        <FaFilePdf size={13} />
                        {subiendoPdf ? 'Subiendo...' : 'Subir PDF'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ASIGNAR TÉCNICO */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <button onClick={() => {
                  if (!mostrarAsignacion) setTecnicoId('')
                  setMostrarAsignacion(!mostrarAsignacion)
                }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 transition">
                  <div className="flex items-center gap-2">
                    <FaUserPlus size={14} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">
                      {visitaExistente ? 'Reasignar técnico o actualizar visita' : 'Asignar técnico y agendar visita'}
                    </span>
                  </div>
                  <span className="text-blue-500 text-xs">{mostrarAsignacion ? '▲ Cerrar' : '▼ Abrir'}</span>
                </button>

                {visitaExistente && !mostrarAsignacion && (
                  <div className="px-4 py-3 bg-green-50 border-t border-green-100 flex items-center gap-3">
                    <FaCheckCircle size={14} className="text-green-500" />
                    <div>
                      <p className="text-xs font-semibold text-green-700">Técnico asignado</p>
                      <p className="text-xs text-green-600">{getTecnicoNombre(visitaExistente.tecnico)} — {visitaExistente.fecha} a las {visitaExistente.hora?.slice(0, 5)}</p>
                    </div>
                  </div>
                )}

                {mostrarAsignacion && (
                  <div className="p-4 bg-white space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Técnico *</label>
                      <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white">
                        <option value="">Seleccionar técnico...</option>
                        {tecnicos.map(t => <option key={t.id} value={t.id}>{t.usuario.first_name} {t.usuario.last_name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Fecha de visita *</label>
                        <input type="date" value={fechaVisita} onChange={e => setFechaVisita(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Hora de visita *</label>
                        <input type="time" value={horaVisita} onChange={e => setHoraVisita(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                      </div>
                    </div>
                    <button onClick={asignarTecnico} disabled={asignando}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                      <FaUserPlus size={13} />
                      {asignando ? 'Asignando...' : 'Confirmar asignación'}
                    </button>
                  </div>
                )}
              </div>

              {/* CAMBIAR ESTADO */}
              <div className="border-t border-gray-200 pt-5">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Actualizar estado</p>
                <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900 bg-white text-sm font-medium mb-4">
                  {ESTADOS.filter(e => e.value !== '').map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
                <div className="flex gap-3">
                  <button onClick={() => setSeleccionado(null)}
                    className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold text-sm hover:bg-gray-50 transition text-gray-700">
                    Cancelar
                  </button>
                  <button onClick={() => cambiarEstado(seleccionado.id)}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition">
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMantenimientos