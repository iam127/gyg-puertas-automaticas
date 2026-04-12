import api from './api'

export const login = (username, password) =>
  api.post('/token/', { username, password })

export const getToken = () => localStorage.getItem('access_token')

export const setTokens = (access, refresh) => {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export const removeTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const isAuthenticated = () => !!localStorage.getItem('access_token')