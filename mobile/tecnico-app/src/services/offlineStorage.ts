import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  MANTENIMIENTOS: 'offline_mantenimientos',
  COTIZACIONES:   'offline_cotizaciones',
  PENDING_QUEUE:  'offline_pending_queue',
};

export type PendingAction =
  | { type: 'updateMantenimientoStatus'; id: number; status: string }
  | { type: 'updateVisitaMantenimiento'; visitaId: number; data: any }
  | { type: 'updateCotizacionStatus'; id: number; status: string }
  | { type: 'updateVisitaTecnica'; visitaId: number; data: any };

export const OfflineStorage = {
  // ── Mantenimientos ────────────────────────────────────────────────────────
  saveMantenimientos: async (data: any[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(KEYS.MANTENIMIENTOS, JSON.stringify(data));
    } catch {}
  },

  getMantenimientos: async (): Promise<any[]> => {
    try {
      const raw = await AsyncStorage.getItem(KEYS.MANTENIMIENTOS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveMantenimientoDetail: async (item: any): Promise<void> => {
    try {
      const list = await OfflineStorage.getMantenimientos();
      const updated = list.some(m => m.id === item.id)
        ? list.map(m => m.id === item.id ? item : m)
        : [...list, item];
      await AsyncStorage.setItem(KEYS.MANTENIMIENTOS, JSON.stringify(updated));
    } catch {}
  },

  getMantenimientoDetail: async (id: number): Promise<any | null> => {
    const list = await OfflineStorage.getMantenimientos();
    return list.find(m => m.id === id) ?? null;
  },

  // ── Cotizaciones ──────────────────────────────────────────────────────────
  saveCotizaciones: async (data: any[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(KEYS.COTIZACIONES, JSON.stringify(data));
    } catch {}
  },

  getCotizaciones: async (): Promise<any[]> => {
    try {
      const raw = await AsyncStorage.getItem(KEYS.COTIZACIONES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveCotizacionDetail: async (item: any): Promise<void> => {
    try {
      const list = await OfflineStorage.getCotizaciones();
      const updated = list.some(c => c.id === item.id)
        ? list.map(c => c.id === item.id ? item : c)
        : [...list, item];
      await AsyncStorage.setItem(KEYS.COTIZACIONES, JSON.stringify(updated));
    } catch {}
  },

  getCotizacionDetail: async (id: number): Promise<any | null> => {
    const list = await OfflineStorage.getCotizaciones();
    return list.find(c => c.id === id) ?? null;
  },

  // ── Cola de acciones pendientes ───────────────────────────────────────────
  enqueue: async (action: PendingAction): Promise<void> => {
    try {
      const queue = await OfflineStorage.getQueue();
      queue.push(action);
      await AsyncStorage.setItem(KEYS.PENDING_QUEUE, JSON.stringify(queue));
    } catch {}
  },

  getQueue: async (): Promise<PendingAction[]> => {
    try {
      const raw = await AsyncStorage.getItem(KEYS.PENDING_QUEUE);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  clearQueue: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(KEYS.PENDING_QUEUE);
    } catch {}
  },
};

export default OfflineStorage;