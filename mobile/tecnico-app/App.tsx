import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import RootNavigator from './src/navigation/index';
import OfflineStorage from './src/services/offlineStorage';
import MantenimientoService from './src/api/mantenimientos';
import CotizacionService from './src/api/cotizaciones';

async function syncPendingQueue() {
  const queue = await OfflineStorage.getQueue();
  if (queue.length === 0) return;

  const failed = [];

  for (const action of queue) {
    try {
      if (action.type === 'updateMantenimientoStatus') {
        await MantenimientoService.updateMantenimientoStatus(action.id, action.status);
      } else if (action.type === 'updateVisitaMantenimiento') {
        await MantenimientoService.updateVisitaMantenimiento(action.visitaId, action.data);
      } else if (action.type === 'updateCotizacionStatus') {
        await CotizacionService.updateCotizacionStatus(action.id, action.status as any);
      } else if (action.type === 'updateVisitaTecnica') {
        await CotizacionService.updateVisitaTecnica(action.visitaId, action.data);
      }
    } catch {
      // Si falla, lo volvemos a encolar
      failed.push(action);
    }
  }

  await OfflineStorage.clearQueue();

  // Re-encolar solo los que fallaron
  for (const action of failed) {
    await OfflineStorage.enqueue(action);
  }
}

export default function App() {
  const wasOffline = useRef(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOnline = state.isConnected && state.isInternetReachable;

      if (isOnline && wasOffline.current) {
        // Recuperó conexión — sincronizar cola pendiente
        syncPendingQueue();
      }

      wasOffline.current = !isOnline;
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#111827" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}