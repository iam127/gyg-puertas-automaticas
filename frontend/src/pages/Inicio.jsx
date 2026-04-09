import { useEffect, useState } from 'react'
import { getProductosDestacados } from '../services/productos'
import { getTestimonios } from '../services/contenido'

function Inicio() {
  const [productosDestacados, setProductosDestacados] = useState([])
  const [testimonios, setTestimonios] = useState([])

  useEffect(() => {
    getProductosDestacados().then(res => setProductosDestacados(res.data))
    getTestimonios().then(res => setTestimonios(res.data))
  }, [])

  return (
    <div>
      <section>
        <h1>GyG Puertas Automaticas</h1>
        <p>Soluciones en puertas automaticas para tu hogar y empresa</p>
        <a href="/catalogo">Ver Catalogo</a>
        <a href="/cotizar">Solicitar Cotizacion</a>
      </section>

      <section>
        <h2>Productos Destacados</h2>
        <div>
          {productosDestacados.map(producto => (
            <div key={producto.id}>
              <img src={producto.imagen_principal} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <a href={`/catalogo/${producto.id}`}>Ver mas</a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Lo que dicen nuestros clientes</h2>
        <div>
          {testimonios.map(testimonio => (
            <div key={testimonio.id}>
              <p>{testimonio.comentario}</p>
              <p>{testimonio.nombre_cliente}</p>
              <p>{'⭐'.repeat(testimonio.calificacion)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Inicio