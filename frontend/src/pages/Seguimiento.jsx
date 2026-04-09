import { useState } from 'react'
import { getSeguimiento } from '../services/cotizaciones'
import { getSeguimientoMantenimiento } from '../services/mantenimientos'

function Seguimiento() {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const estadoColor = {
    recibido: 'bg-blue-100 text-blue-700',
    en_revision: 'bg-yellow-100 text-yellow-700',
    visita_agendada: 'bg-purple-100 text-purple-700',
    cotizado: 'bg-orange-100 text-orange-700',
    aceptado: 'bg-green-100 text-green-700',
    rechazado: 'bg-red-100 text-red-700',
    instalacion_agendada: 'bg-purple-100 text-purple-700',
    en_instalacion: 'bg-orange-100 text-orange-700',
    completado: 'bg-green-100 text-green-700',
    cancelado: 'bg-red-100 text-red-700',
    diagnostico_remoto: 'bg-yellow-100 text-yellow-700',
    esperando_repuestos: 'bg-orange-100 text-orange-700',
    resuelto: 'bg-green-100 text-green-700',
  }

  const handleBuscar = (e) => {
    e.preventDefault()
    setError('')
    setResultado(null)
    setCargando(true)

    if (codigo.startsWith('GYG')) {
      getSeguimiento(codigo)
        .then(res => setResultado({ tipo: 'cotizacion', data: res.data }))
        .catch(() => setError('No se encontró ninguna solicitud con ese código.'))
        .finally(() => setCargando(false))
    } else if (codigo.startsWith('MANT')) {
      getSeguimientoMantenimiento(codigo)
        .then(res => setResultado({ tipo: 'mantenimiento', data: res.data }))
        .catch(() => setError('No se encontró ninguna solicitud con ese código.'))
        .finally(() => setCargando(false))
    } else {
      setError('Código inválido. Debe empezar con GYG o MANT.')
      setCargando(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Seguimiento de Solicitud</h1>
      <p className="text-gray-500 mb-8">Ingresa tu código para ver el estado de tu solicitud.</p>

      <form onSubmit={handleBuscar} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Ej: GYG-2026-0001 o MANT-2026-0001"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          required
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-400"
        />
        <button
          type="submit"
          disabled={cargando}
          className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {resultado && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Código de solicitud</p>
              <p className="text-2xl font-bold text-yellow-500">{resultado.data.codigo}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${estadoColor[resultado.data.estado] || 'bg-gray-100 text-gray-700'}`}>
              {resultado.data.estado.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Cliente</p>
                <p className="font-medium">{resultado.data.nombre_cliente}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Teléfono</p>
                <p className="font-medium">{resultado.data.telefono}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Distrito</p>
                <p className="font-medium">{resultado.data.distrito}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Fecha de solicitud</p>
                <p className="font-medium">{new Date(resultado.data.creado_en).toLocaleDateString('es-PE')}</p>
              </div>
            </div>

            {resultado.data.descripcion && (
              <div>
                <p className="text-gray-500 text-sm">Descripción</p>
                <p className="font-medium">{resultado.data.descripcion}</p>
              </div>
            )}

            {resultado.data.motivo_rechazo && (
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-gray-500 text-sm">Motivo</p>
                <p className="font-medium text-red-700">{resultado.data.motivo_rechazo}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Seguimiento