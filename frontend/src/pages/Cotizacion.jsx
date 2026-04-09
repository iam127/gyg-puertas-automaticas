import { useState } from 'react'
import { crearCotizacion } from '../services/cotizaciones'

function Cotizacion() {
  const [form, setForm] = useState({
    nombre_cliente: '',
    telefono: '',
    correo: '',
    direccion: '',
    distrito: '',
    referencias: '',
    tipo_uso: '',
    descripcion: '',
    disponibilidad: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [codigo, setCodigo] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    crearCotizacion(form).then(res => {
      setCodigo(res.data.codigo)
      setEnviado(true)
    })
  }

  if (enviado) {
    return (
      <div>
        <h2>Solicitud enviada correctamente</h2>
        <p>Tu codigo de seguimiento es: <strong>{codigo}</strong></p>
        <p>Guarda este codigo para hacer seguimiento de tu solicitud.</p>
        <a href="/seguimiento">Hacer seguimiento</a>
      </div>
    )
  }

  return (
    <div>
      <h1>Solicitar Cotizacion</h1>
      <form onSubmit={handleSubmit}>
        <input name="nombre_cliente" placeholder="Nombre completo" onChange={handleChange} required />
        <input name="telefono" placeholder="Telefono" onChange={handleChange} required />
        <input name="correo" type="email" placeholder="Correo electronico" onChange={handleChange} required />
        <input name="direccion" placeholder="Direccion" onChange={handleChange} required />
        <input name="distrito" placeholder="Distrito" onChange={handleChange} required />
        <input name="referencias" placeholder="Referencias de ubicacion" onChange={handleChange} />
        <select name="tipo_uso" onChange={handleChange} required>
          <option value="">Selecciona el tipo de uso</option>
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
          <option value="industrial">Industrial</option>
        </select>
        <textarea name="descripcion" placeholder="Describe lo que necesitas" onChange={handleChange} required />
        <input name="disponibilidad" placeholder="Disponibilidad para visita tecnica" onChange={handleChange} required />
        <button type="submit">Enviar solicitud</button>
      </form>
    </div>
  )
}

export default Cotizacion