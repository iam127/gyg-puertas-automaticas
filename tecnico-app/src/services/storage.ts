import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tecnico } from '../types/auth.types';

const KEYS = {
  ACCESS_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  TECNICO_PROFILE: 'tecnicoProfile',
};

export const Storage = {
  getAccessToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
    } catch (e) {
      return null;
    }
  },

  setAccessToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
    } catch (e) {
      // Ignorar
    }
  },

  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
    } catch (e) {
      return null;
    }
  },

  setRefreshToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token);
    } catch (e) {
      // Ignorar
    }
  },

  getTecnicoProfile: async (): Promise<Tecnico | null> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.TECNICO_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setTecnicoProfile: async (profile: Tecnico): Promise<void> => {
    try {
      await AsyncStorage.setItem(KEYS.TECNICO_PROFILE, JSON.stringify(profile));
    } catch (e) {
      // Ignorar
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        KEYS.ACCESS_TOKEN,
        KEYS.REFRESH_TOKEN,
        KEYS.TECNICO_PROFILE,
      ]);
    } catch (e) {
      // Ignorar
    }
  },
};

export default Storage;
