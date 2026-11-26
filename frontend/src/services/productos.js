import api, { publicApi } from './api'

export const getProductos = () => api.get('/productos/')
export const getProducto = (id) => api.get(`/productos/${id}/`)
export const getProductosDestacados = () => publicApi.get('/productos/destacados/')
export const getProductosPorUso = (uso) => publicApi.get(`/productos/por_uso/?uso=${uso}`)
export const getCategorias = () => publicApi.get('/categorias/')
export const buscarProductos = (query) => api.get(`/productos/?search=${query}`)
export const buscarInteligente = (query) => api.get(`/buscar-inteligente/?q=${query}`)