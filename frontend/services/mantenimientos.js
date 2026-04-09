import api from './api'

export const crearMantenimiento = (data) => api.post('/mantenimientos/', data)
export const getSeguimientoMantenimiento = (codigo) => api.get(`/mantenimientos/seguimiento/?codigo=${codigo}`)
export const getSeguimientoMantenimientoPorToken = (token) => api.get(`/mantenimientos/seguimiento/?token=${token}`)