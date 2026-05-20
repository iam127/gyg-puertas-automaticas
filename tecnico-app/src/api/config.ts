import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import Storage from '../services/storage';
import { Alert } from 'react-native';

// Fallbacks for localhost in physical/emulator devices
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the access token
api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().accessToken || (await Storage.getAccessToken());
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Auto-rotate tokens & global error alerts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Session Expiration (Attempt Auto-Refresh)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken || (await Storage.getRefreshToken());
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        // Call the JWT refresh endpoint using a fresh axios instance to avoid infinite loops
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        
        // Update both memory (Zustand) and persistence (AsyncStorage)
        await Storage.setAccessToken(newAccessToken);
        useAuthStore.setState({ accessToken: newAccessToken });

        isRefreshing = false;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // If refresh fails, wipe session and logout
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      Alert.alert('Acceso Denegado', 'No tienes permisos para realizar esta acción.');
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      Alert.alert('Error de Conexión', 'Ocurrió un error en el servidor de GyG. Por favor, intenta de nuevo más tarde.');
    }

    return Promise.reject(error);
  }
);

export default api;
