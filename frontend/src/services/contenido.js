import { publicApi } from './api'

export const getBlog = () => publicApi.get('/blog/')
export const getFAQ = () => publicApi.get('/faq/')
export const getGaleria = () => publicApi.get('/galeria/')
export const getTestimonios = () => publicApi.get('/testimonios/')