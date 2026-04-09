import api from './api'

export const getBlog = () => api.get('/blog/')
export const getFAQ = () => api.get('/faq/')
export const getGaleria = () => api.get('/galeria/')
export const getTestimonios = () => api.get('/testimonios/')