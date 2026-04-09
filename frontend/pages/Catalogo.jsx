import { useEffect, useState } from 'react'
import { getProductos, getCategorias, buscarProductos } from '../services/productos'

function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroUso, setFiltroUso] = useState('')

  useEffect(() => {
    getProductos().then(res => setProductos(res.data))
    getCategorias().then(res => setCategorias(res.data))
  }, [])

  const handleBusqueda = (e) => {
    e.preventDefault()
    buscarProductos(busqueda).then(res => setProductos(res.data))
  }

  return (
    <div>
      <h1>Catalogo de Productos</h1>

      <form onSubmit={handleBusqueda}>
        <input
          type="text"
          placeholder="Busca el producto que necesitas..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <div>
        <button onClick={() => setFiltroUso('')}>Todos</button>
        <button onClick={() => setFiltroUso('residencial')}>Residencial</button>
        <button onClick={() => setFiltroUso('comercial')}>Comercial</button>
        <button onClick={() => setFiltroUso('industrial')}>Industrial</button>
      </div>

      <div>
        {productos
          .filter(p => filtroUso ? p.uso === filtroUso : true)
          .map(producto => (
            <div key={producto.id}>
              <img src={producto.imagen_principal} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p>{producto.uso}</p>
              <a href={`/catalogo/${producto.id}`}>Ver detalle</a>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Catalogo