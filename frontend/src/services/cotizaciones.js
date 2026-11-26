import { publicApi } from './api'

export const crearCotizacion = (data) => publicApi.post('/cotizaciones/', data)
export const getSeguimiento = (codigo) => publicApi.get(`/cotizaciones/seguimiento/?codigo=${codigo}`)
export const getSeguimientoPorToken = (token) => publicApi.get(`/cotizaciones/seguimiento/?token=${token}`)
export const responderCotizacion = (id, data) => publicApi.post(`/cotizaciones/${id}/responder/`, data)