import { useState } from 'react'
import { getSeguimiento } from '../services/cotizaciones'
import { getSeguimientoMantenimiento } from '../services/mantenimientos'

function Seguimiento() {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  const handleBuscar = (e) => {
    e.preventDefault()
    setError('')
    setResultado(null)

    if (codigo.startsWith('GYG')) {
      getSeguimiento(codigo)
        .then(res => setResultado({ tipo: 'cotizacion', data: res.data }))
        .catch(() => setError('No se encontro ninguna solicitud con ese codigo'))
    } else if (codigo.startsWith('MANT')) {
      getSeguimientoMantenimiento(codigo)
        .then(res => setResultado({ tipo: 'mantenimiento', data: res.data }))
        .catch(() => setError('No se encontro ninguna solicitud con ese codigo'))
    } else {
      setError('Codigo invalido. Debe empezar con GYG o MANT')
    }
  }

  return (
    <div>
      <h1>Seguimiento de Solicitud</h1>
      <form onSubmit={handleBuscar}>
        <input
          type="text"
          placeholder="Ingresa tu codigo (GYG-2026-0001 o MANT-2026-0001)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />
        <button type="submit">Buscar</button>
      </form>

      {error && <p>{error}</p>}

      {resultado && (
        <div>
          <h2>Estado de tu solicitud</h2>
          <p>Codigo: {resultado.data.codigo}</p>
          <p>Cliente: {resultado.data.nombre_cliente}</p>
          <p>Estado: {resultado.data.estado}</p>
          <p>Fecha: {resultado.data.creado_en}</p>
        </div>
      )}
    </div>
  )
}

export default Seguimiento