import axios from 'axios'
import { getToken } from './auth'
import { API_BASE_URL } from '../constants'

// Cliente autenticado — para endpoints privados
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Cliente público — para endpoints que no requieren autenticación
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export default api