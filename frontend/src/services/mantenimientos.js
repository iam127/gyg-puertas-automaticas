import api, { publicApi } from './api'

export const crearMantenimiento = (data) => publicApi.post('/mantenimientos/', data)
export const getSeguimientoMantenimiento = (codigo) => publicApi.get(`/mantenimientos/seguimiento/?codigo=${codigo}`)
export const getSeguimientoMantenimientoPorToken = (token) => publicApi.get(`/mantenimientos/seguimiento/?token=${token}`)