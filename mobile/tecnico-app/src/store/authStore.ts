import { create } from 'zustand';
import Storage from '../services/storage';
import { Tecnico } from '../types/auth.types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tecnico: Tecnico | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  setTokens: (access: string, refresh: string) => Promise<void>;
  setTecnico: (tecnico: Tecnico) => Promise<void>;
  enableDemoMode: () => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  tecnico: null,
  isLoggedIn: false,
  isLoading: true,
  isDemoMode: false,

  setTokens: async (access: string, refresh: string) => {
    await Storage.setAccessToken(access);
    await Storage.setRefreshToken(refresh);
    set({ accessToken: access, refreshToken: refresh, isLoggedIn: true, isDemoMode: false });
  },

  setTecnico: async (tecnico: Tecnico) => {
    await Storage.setTecnicoProfile(tecnico);
    set({ tecnico });
  },

  enableDemoMode: async () => {
    const demoTecnico: Tecnico = {
      id: 999,
      usuario: {
        id: 999,
        username: 'tecnico_invitado',
        first_name: 'Juan (Invitado)',
        last_name: 'Pérez',
        email: 'demo@gygpuertas.com',
      },
      telefono: '+51 987 654 321',
      activo: true,
      codigo_invitacion: 'DEMO-MODE-ACTIVE',
      creado_en: new Date().toISOString(),
    };
    await Storage.setAccessToken('demo-access-token');
    await Storage.setRefreshToken('demo-refresh-token');
    await Storage.setTecnicoProfile(demoTecnico);
    set({
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
      tecnico: demoTecnico,
      isLoggedIn: true,
      isDemoMode: true,
      isLoading: false,
    });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const access = await Storage.getAccessToken();
      const refresh = await Storage.getRefreshToken();
      const tecnico = await Storage.getTecnicoProfile();

      if (access && refresh && tecnico) {
        set({
          accessToken: access,
          refreshToken: refresh,
          tecnico: tecnico,
          isLoggedIn: true,
          isDemoMode: tecnico.codigo_invitacion === 'DEMO-MODE-ACTIVE',
          isLoading: false,
        });
      } else {
        set({
          accessToken: null,
          refreshToken: null,
          tecnico: null,
          isLoggedIn: false,
          isDemoMode: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        accessToken: null,
        refreshToken: null,
        tecnico: null,
        isLoggedIn: false,
        isDemoMode: false,
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
      isDemoMode: false,
      isLoading: false,
    });
  },
}));
