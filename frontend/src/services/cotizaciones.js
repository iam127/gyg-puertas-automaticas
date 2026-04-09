import api from './api'

export const crearCotizacion = (data) => api.post('/cotizaciones/', data)
export const getSeguimiento = (codigo) => api.get(`/cotizaciones/seguimiento/?codigo=${codigo}`)
export const getSeguimientoPorToken = (token) => api.get(`/cotizaciones/seguimiento/?token=${token}`)
export const responderCotizacion = (id, data) => api.post(`/cotizaciones/${id}/responder/`, data)