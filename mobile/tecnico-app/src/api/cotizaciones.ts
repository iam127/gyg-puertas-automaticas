import api from './config';
import { Cotizacion } from '../types/cotizacion.types';
import OfflineStorage, { PendingAction } from '../services/offlineStorage';
import NetInfo from '@react-native-community/netinfo';

export const CotizacionService = {
  getMyCotizaciones: async (_tecnicoId: number): Promise<Cotizacion[]> => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      return OfflineStorage.getCotizaciones();
    }
    const response = await api.get<Cotizacion[]>('/cotizaciones/mis_cotizaciones/');
    await OfflineStorage.saveCotizaciones(response.data);
    return response.data;
  },

  getCotizacionDetail: async (id: number): Promise<Cotizacion> => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      const cached = await OfflineStorage.getCotizacionDetail(id);
      if (cached) return cached;
      throw new Error('Sin conexión y sin datos en caché.');
    }
    const response = await api.get<Cotizacion>(`/cotizaciones/${id}/`);
    await OfflineStorage.saveCotizacionDetail(response.data);
    return response.data;
  },

  updateCotizacionStatus: async (id: number, status: any): Promise<Cotizacion> => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      const action: PendingAction = { type: 'updateCotizacionStatus', id, status };
      await OfflineStorage.enqueue(action);
      const cached = await OfflineStorage.getCotizacionDetail(id);
      if (cached) {
        const updated = { ...cached, estado: status, actualizado_en: new Date().toISOString() };
        await OfflineStorage.saveCotizacionDetail(updated);
        return updated;
      }
      throw new Error('Sin conexión. Acción guardada para sincronizar luego.');
    }
    const response = await api.patch<Cotizacion>(`/cotizaciones/${id}/`, { estado: status });
    await OfflineStorage.saveCotizacionDetail(response.data);
    return response.data;
  },

  updateVisitaTecnica: async (visitaId: number, data: {
    estado: 'programada' | 'completada' | 'cancelada' | 'reprogramada';
    medidas: string;
    materiales_necesarios: string;
    observaciones: string;
    dificultad: string;
    tiempo_estimado: string;
  }): Promise<any> => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      const action: PendingAction = { type: 'updateVisitaTecnica', visitaId, data };
      await OfflineStorage.enqueue(action);
      return { success: true, offline: true };
    }
    const response = await api.patch(`/visitas/${visitaId}/`, data);
    return response.data;
  },

  // ── Sincronizar cola pendiente al recuperar conexión ──────────────────────
  syncPendingQueue: async (): Promise<void> => {
    const queue = await OfflineStorage.getQueue();
    if (queue.length === 0) return;

    const failed: PendingAction[] = [];

    for (const action of queue) {
      try {
        if (action.type === 'updateCotizacionStatus') {
          await api.patch(`/cotizaciones/${action.id}/`, { estado: action.status });
        } else if (action.type === 'updateVisitaTecnica') {
          await api.patch(`/visitas/${action.visitaId}/`, action.data);
        }
        // mantenimientos los maneja MantenimientoService
      } catch {
        failed.push(action);
      }
    }

    if (failed.length === 0) {
      await OfflineStorage.clearQueue();
    }
  },
};

export default CotizacionService;