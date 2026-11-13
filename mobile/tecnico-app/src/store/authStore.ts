import { create } from 'zustand';
import Storage from '../services/storage';
import { Tecnico } from '../types/auth.types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tecnico: Tecnico | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setTokens: (access: string, refresh: string) => Promise<void>;
  setTecnico: (tecnico: Tecnico) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  tecnico: null,
  isLoggedIn: false,
  isLoading: true,

  setTokens: async (access: string, refresh: string) => {
    await Storage.setAccessToken(access);
    await Storage.setRefreshToken(refresh);
    set({ accessToken: access, refreshToken: refresh, isLoggedIn: true });
  },

  setTecnico: async (tecnico: Tecnico) => {
    await Storage.setTecnicoProfile(tecnico);
    set({ tecnico });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const access = await Storage.getAccessToken();
      const refresh = await Storage.getRefreshToken();
      const tecnico = await Storage.getTecnicoProfile();

      // Ignorar sesiones demo que quedaron guardadas
      if (access && refresh && tecnico && access !== 'demo-access-token') {
        set({
          accessToken: access,
          refreshToken: refresh,
          tecnico: tecnico,
          isLoggedIn: true,
          isLoading: false,
        });
      } else {
        await Storage.clearAll();
        set({
          accessToken: null,
          refreshToken: null,
          tecnico: null,
          isLoggedIn: false,
          isLoading: false,
        });
      }
    } catch {
      set({
        accessToken: null,
        refreshToken: null,
        tecnico: null,
        isLoggedIn: false,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    await Storage.clearAll();
    set({
      accessToken: null,
      refreshToken: null,
      tecnico: null,
      isLoggedIn: false,
      isLoading: false,
    });
  },
}));