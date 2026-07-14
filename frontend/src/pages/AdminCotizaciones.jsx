import { useEffect, useState } from 'react'
import api from '../services/api'
import { FaSearch, FaTimes, FaEdit, FaFileAlt, FaWhatsapp, FaPhone, FaUserPlus, FaCheckCircle, FaFilePdf, FaDownload, FaHammer, FaImage } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'recibido', label: 'Recibido' },
  { value: 'en_revision', label: 'En Revisión' },
  { value: 'visita_agendada', label: 'Visita Agendada' },
  { value: 'cotizado', label: 'Cotizado' },
  { value: 'aceptado', label: 'Aceptado' },
  { value: 'rechazado', label: 'Rechazado' },
  { value: 'instalacion_agendada', label: 'Instalación Agendada' },
  { value: 'completado', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' },
]

const estadoColor = {
  recibido: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  en_revision: 'bg-gray-100 text-gray-700 border-gray-300',
  visita_agendada: 'bg-blue-50 text-blue-700 border-blue-200',
  cotizado: 'bg-purple-50 text-purple-700 border-purple-200',
  aceptado: 'bg-green-50 text-green-700 border-green-200',
  rechazado: 'bg-red-50 text-red-600 border-red-200',
  instalacion_agendada: 'bg-orange-50 text-orange-700 border-orange-200',
  completado: 'bg-gray-900 text-white border-gray-900',
  cancelado: 'bg-gray-100 text-gray-600 border-gray-300',
}

function AdminCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [seleccionada, setSeleccionada] = useState(null)
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

  const [confirmandoInstalacion, setConfirmandoInstalacion] = useState(false)

  useEffect(() => {
    cargarCotizaciones()
    cargarTecnicos()
  }, [])

  useEffect(() => {
    if (seleccionada) {
      const visita = seleccionada.visitas?.[0] || null
      setVisitaExistente(visita)
      if (visita) {
        setTecnicoId(visita.tecnico?.toString() || '')
        setFechaVisita(visita.fecha || '')
        setHoraVisita(visita.hora?.slice(0, 5) || '')
      } else {
        setTecnicoId('')
        setFechaVisita('')
        setHoraVisita('')
      }
      setMostrarAsignacion(false)
      setMostrarPdf(false)
      setPdfFile(null)
    }
  }, [seleccionada])

  const cargarCotizaciones = () => {
    setCargando(true)
    api.get('/cotizaciones/')
      .then(res => setCotizaciones(res.data))
      .finally(() => setCargando(false))
  }

  const cargarTecnicos = () => {
    api.get('/tecnicos/').then(res => setTecnicos(res.data))
  }

  const cambiarEstado = (id) => {
    api.patch(`/cotizaciones/${id}/`, { estado: nuevoEstado })
      .then(() => {
        cargarCotizaciones()
        setSeleccionada(null)
      })
  }

  const asignarTecnico = () => {
    if (!tecnicoId || !fechaVisita || !horaVisita) {
      alert('Completa todos los campos de asignación')
      return
    }
    setAsignando(true)
    api.post(`/cotizaciones/${seleccionada.id}/asignar_tecnico/`, {
      tecnico_id: parseInt(tecnicoId),
      fecha: fechaVisita,
      hora: horaVisita,
    })
      .then(() => {
        cargarCotizaciones()
        setMostrarAsignacion(false)
        setSeleccionada(null)
        alert('Técnico asignado correctamente.')
      })
      .catch(e => alert('Error al asignar técnico: ' + (e.response?.data?.error || e.message)))
      .finally(() => setAsignando(false))
  }

  const confirmarInstalacion = () => {
    if (!window.confirm('¿Confirmar instalación al técnico? El estado cambiará a "Instalación Agendada" y el técnico lo verá en su app.')) return
    setConfirmandoInstalacion(true)
    api.patch(`/cotizaciones/${seleccionada.id}/`, { estado: 'instalacion_agendada' })
      .then(() => {
        cargarCotizaciones()
        setSeleccionada(null)
        alert('✅ Instalación confirmada. El técnico ya puede ver la confirmación en su app móvil.')
      })
      .catch(e => alert('Error: ' + (e.response?.data?.error || e.message)))
      .finally(() => setConfirmandoInstalacion(false))
  }

  const subirPdf = () => {
    if (!pdfFile) return
    setSubiendoPdf(true)

    const crearYSubir = (cotizacionFormalId) => {
      const formData = new FormData()
      formData.append('pdf_cotizacion', pdfFile)
      api.patch(`/cotizaciones-formales/${cotizacionFormalId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(() => {
          cargarCotizaciones()
          setPdfFile(null)
          setMostrarPdf(false)
          setSeleccionada(null)
          alert('PDF subido correctamente.')
        })
        .catch(e => alert('Error al subir PDF: ' + (e.response?.data?.error || e.message)))
        .finally(() => setSubiendoPdf(false))
    }

    if (seleccionada.cotizacion_formal?.id) {
      crearYSubir(seleccionada.cotizacion_formal.id)
    } else {
      api.post('/cotizaciones-formales/', {
        cotizacion: seleccionada.id,
        descripcion_producto: 'Cotización adjunta en PDF',
        lista_materiales: '-',
        costo_materiales: 0,
        costo_mano_obra: 0,
        costo_instalacion: 0,
        costo_total: 0,
        tiempo_instalacion: '-',
        condiciones_pago: '-',
      })
        .then(res => {
          api.patch(`/cotizaciones/${seleccionada.id}/`, { estado: 'cotizado' })
          crearYSubir(res.data.id)
        })
        .catch(e => {
          alert('Error al preparar cotización: ' + (e.response?.data?.error || e.message))
          setSubiendoPdf(false)
        })
    }
  }

  const getTecnicoNombre = (id) => {
    const t = tecnicos.find(t => t.id === id)
    return t ? `${t.usuario.first_name} ${t.usuario.last_name}` : 'Desconocido'
  }

  const cotizacionesFiltradas = cotizaciones.filter(c => {
    const matchBusqueda = busqueda === '' ||
      c.nombre_cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.codigo?.toLowerCase().includes(busqueda.toLowerCase())
    const matchEstado = filtroEstado === '' || c.estado === filtroEstado
    return matchBusqueda && matchEstado
  })

  const pendientes = cotizaciones.filter(c => c.estado === 'recibido').length
  const completados = cotizaciones.filter(c => c.estado === 'completado').length
  const conPdf = cotizaciones.filter(c => c.cotizacion_formal?.pdf_cotizacion).length

  return (
    <div>
      <Helmet><title>Cotizaciones | GyG Admin</title></Helmet>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gray-900 rounded-lg flex items-center justify-center">
            <FaFileAlt size={18} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestión de cotizaciones</h2>
            <p className="text-sm text-gray-500">{cotizaciones.length} cotizaciones registradas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="w-11 h-11 bg-gray-900 rounded-lg flex items-center justify-center mb-3"><FaFileAlt size={18} className="text-yellow-400" /></div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{cotizaciones.length}</p>
          <p className="text-sm text-gray-600 font-medium">Total</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="w-11 h-11 bg-yellow-400 rounded-lg flex items-center justify-center mb-3"><FaFileAlt size={18} className="text-gray-900" /></div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{pendientes}</p>
          <p className="text-sm text-gray-600 font-medium">Por revisar</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="w-11 h-11 bg-red-500 rounded-lg flex items-center justify-center mb-3"><FaFilePdf size={18} className="text-white" /></div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{conPdf}</p>
          <p className="text-sm text-gray-600 font-medium">Con PDF enviado</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="w-11 h-11 bg-green-500 rounded-lg flex items-center justify-center mb-3"><FaFileAlt size={18} className="text-white" /></div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{completados}</p>
          <p className="text-sm text-gray-600 font-medium">Finalizadas</p>
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
      ) : cotizacionesFiltradas.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <FaFileAlt size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">No se encontraron cotizaciones</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Código</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Cliente</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Teléfono</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Distrito</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Estado</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Técnico</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Fecha</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cotizacionesFiltradas.map((c) => {
                const visita = c.visitas?.[0]
                const tecnicoAsignado = visita?.tecnico ? getTecnicoNombre(visita.tecnico) : null
                const tienePdf = c.cotizacion_formal?.pdf_cotizacion
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-gray-900 whitespace-nowrap">{c.codigo}</span>
                        {tienePdf && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium w-fit">PDF</span>}
                        {c.estado === 'aceptado' && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium w-fit">Confirmar inst.</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4"><p className="font-semibold text-gray-900">{c.nombre_cliente}</p></td>
                    <td className="px-5 py-4 text-gray-600">{c.telefono}</td>
                    <td className="px-5 py-4 text-gray-600">{c.distrito}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border whitespace-nowrap ${estadoColor[c.estado] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        {c.estado?.replace(/_/g, ' ')}
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
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(c.creado_en).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => { setSeleccionada(c); setNuevoEstado(c.estado) }}
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

      {seleccionada && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gray-900 rounded-lg flex items-center justify-center">
                  <FaFileAlt size={18} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{seleccionada.codigo}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Detalle de la cotización</p>
                </div>
              </div>
              <button onClick={() => setSeleccionada(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Cliente</p>
                  <p className="text-sm font-semibold text-gray-900">{seleccionada.nombre_cliente}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Teléfono</p>
                  <p className="text-sm font-semibold text-gray-900">{seleccionada.telefono}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Correo</p>
                  <p className="text-sm font-semibold text-gray-900 break-all">{seleccionada.correo}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Distrito</p>
                  <p className="text-sm font-semibold text-gray-900">{seleccionada.distrito}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Tipo de uso</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{seleccionada.tipo_uso}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Disponibilidad</p>
                  <p className="text-sm font-semibold text-gray-900">{seleccionada.disponibilidad}</p>
                </div>
              </div>

              {seleccionada.descripcion && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-2">Descripción del proyecto</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{seleccionada.descripcion}</p>
                </div>
              )}

              {/* MEDIDAS DEL TÉCNICO */}
              {visitaExistente?.medidas && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-3">📐 Reporte del técnico</p>
                  <div className="space-y-2">
                    <div><p className="text-xs text-gray-500 font-medium">Medidas técnicas</p><p className="text-sm text-gray-800 font-medium">{visitaExistente.medidas}</p></div>
                    {visitaExistente.materiales_necesarios && <div><p className="text-xs text-gray-500 font-medium">Materiales necesarios</p><p className="text-sm text-gray-800 font-medium">{visitaExistente.materiales_necesarios}</p></div>}
                    {visitaExistente.dificultad && <div><p className="text-xs text-gray-500 font-medium">Dificultad</p><p className="text-sm text-gray-800 font-medium">{visitaExistente.dificultad}</p></div>}
                    {visitaExistente.tiempo_estimado && <div><p className="text-xs text-gray-500 font-medium">Tiempo estimado</p><p className="text-sm text-gray-800 font-medium">{visitaExistente.tiempo_estimado}</p></div>}
                    {visitaExistente.observaciones && <div><p className="text-xs text-gray-500 font-medium">Observaciones</p><p className="text-sm text-gray-800 font-medium">{visitaExistente.observaciones}</p></div>}
                  </div>
                </div>
              )}

              {/* FOTO DE INSTALACIÓN */}
              {visitaExistente?.foto_instalacion && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-3">📸 Foto de instalación del técnico</p>
                  <img
                    src={`http://127.0.0.1:8000${visitaExistente.foto_instalacion}`}
                    alt="Instalación realizada"
                    className="w-full rounded-lg border border-green-200 mb-2"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                  <p className="text-xs text-green-600 font-medium text-center">Instalación registrada por el técnico</p>
                </div>
              )}

              <div className="flex gap-3">
                <a href={`https://wa.me/51${seleccionada.telefono}`} target="_blank" rel="noreferrer"
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2">
                  <FaWhatsapp size={16} /> WhatsApp
                </a>
                <a href={`tel:+51${seleccionada.telefono}`}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold text-sm hover:bg-gray-200 transition flex items-center justify-center gap-2 border border-gray-200">
                  <FaPhone size={14} /> Llamar
                </a>
              </div>

              {/* CONFIRMAR INSTALACIÓN — solo si estado es aceptado */}
              {seleccionada.estado === 'aceptado' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaHammer size={14} className="text-green-600" />
                    <p className="text-sm font-bold text-green-700">El cliente aceptó la cotización</p>
                  </div>
                  <p className="text-xs text-green-600 mb-3">
                    Confirma la instalación para que el técnico lo vea en su app móvil y pueda proceder con el trabajo.
                  </p>
                  <button
                    onClick={confirmarInstalacion}
                    disabled={confirmandoInstalacion}
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FaHammer size={13} />
                    {confirmandoInstalacion ? 'Confirmando...' : 'Confirmar instalación al técnico'}
                  </button>
                </div>
              )}

              {/* ASIGNAR TÉCNICO */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <button onClick={() => setMostrarAsignacion(!mostrarAsignacion)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 transition">
                  <div className="flex items-center gap-2">
                    <FaUserPlus size={14} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">
                      {visitaExistente ? 'Reasignar técnico para visita' : 'Asignar técnico para tomar medidas'}
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

              {/* SUBIR PDF */}
              <div className="border border-red-200 rounded-lg overflow-hidden">
                <button onClick={() => setMostrarPdf(!mostrarPdf)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 transition">
                  <div className="flex items-center gap-2">
                    <FaFilePdf size={14} className="text-red-600" />
                    <span className="text-sm font-semibold text-red-700">
                      {seleccionada.cotizacion_formal?.pdf_cotizacion ? 'PDF subido — subir nuevo' : 'Subir PDF de cotización'}
                    </span>
                  </div>
                  <span className="text-red-500 text-xs">{mostrarPdf ? '▲ Cerrar' : '▼ Abrir'}</span>
                </button>

                {seleccionada.cotizacion_formal?.pdf_cotizacion && !mostrarPdf && (
                  <div className="px-4 py-3 bg-green-50 border-t border-green-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle size={14} className="text-green-500" />
                      <p className="text-xs font-semibold text-green-700">PDF disponible</p>
                    </div>
                    <a href={`http://127.0.0.1:8000${seleccionada.cotizacion_formal.pdf_cotizacion}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
                      <FaDownload size={11} /> Descargar PDF
                    </a>
                  </div>
                )}

                {mostrarPdf && (
                  <div className="p-4 bg-white space-y-3">
                    <p className="text-xs text-gray-500">Sube el PDF. Al subirlo el estado cambiará a <strong>Cotizado</strong> y se enviará automáticamente al cliente.</p>
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

              {/* CAMBIAR ESTADO */}
              <div className="border-t border-gray-200 pt-5">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Actualizar estado</p>
                <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900 bg-white text-sm font-medium mb-4">
                  {ESTADOS.filter(e => e.value !== '').map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
                <div className="flex gap-3">
                  <button onClick={() => setSeleccionada(null)}
                    className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold text-sm hover:bg-gray-50 transition text-gray-700">
                    Cancelar
                  </button>
                  <button onClick={() => cambiarEstado(seleccionada.id)}
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

export default AdminCotizaciones