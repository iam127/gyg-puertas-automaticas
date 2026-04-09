import api from './api'

export const getProductos = () => api.get('/productos/')
export const getProducto = (id) => api.get(`/productos/${id}/`)
export const getProductosDestacados = () => api.get('/productos/destacados/')
export const getProductosPorUso = (uso) => api.get(`/productos/por_uso/?uso=${uso}`)
export const getCategorias = () => api.get('/categorias/')
export const buscarProductos = (query) => api.get(`/productos/?search=${query}`)