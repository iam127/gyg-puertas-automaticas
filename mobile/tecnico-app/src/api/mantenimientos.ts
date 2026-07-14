import api from './config';
import { Mantenimiento } from '../types/mantenimiento.types';
import { useAuthStore } from '../store/authStore';

let MOCK_MANTENIMIENTOS: Mantenimiento[] = [
  {
    id: 101,
    codigo: 'MNT-2026-042',
    nombre_cliente: 'Condominio El Sol - Ingreso Principal',
    telefono: '+51 983 241 556',
    correo: 'administracion@condominiosol.com',
    direccion: 'Av. Primavera 1420',
    distrito: 'Surco',
    tipo_puerta: 'Corrediza Levadiza Automática',
    fecha_instalacion_aprox: '2024-03-12',
    descripcion_problema: 'El motor principal hace un ruido inusual y la puerta corrediza se detiene a la mitad de su recorrido habitual.',
    disponibilidad: 'Lunes a Viernes por las mañanas',
    tipo: 'correctivo',
    estado: 'en_proceso',
    garantia_vigente: true,
    token_unico: 'tok-mnt-01',
    creado_en: '2026-05-15T08:30:00Z',
    actualizado_en: '2026-05-18T10:00:00Z',
    visitas: [
      {
        id: 201,
        mantenimiento: 101,
        tecnico: 999,
        fecha: '2026-05-20',
        hora: '09:00',
        estado: 'programada',
        diagnostico: 'Desgaste en la cremallera de arrastre.',
        trabajos_realizados: '',
        repuestos_utilizados: '',
        costo_total: null,
        foto_mantenimiento: null,
      }
    ]
  },
  {
    id: 102,
    codigo: 'MNT-2026-045',
    nombre_cliente: 'Residencia Familiar Barreto',
    telefono: '+51 912 345 678',
    correo: 'cbarreto@gmail.com',
    direccion: 'Calle Los Sauces 412',
    distrito: 'La Molina',
    tipo_puerta: 'Seccional de Madera Cochera',
    fecha_instalacion_aprox: '2025-01-20',
    descripcion_problema: 'Mantenimiento preventivo anual.',
    disponibilidad: 'Sábados por la mañana',
    tipo: 'preventivo',
    estado: 'visita_agendada',
    garantia_vigente: true,
    token_unico: 'tok-mnt-02',
    creado_en: '2026-05-18T14:20:00Z',
    actualizado_en: '2026-05-18T14:20:00Z',
    visitas: [
      {
        id: 202,
        mantenimiento: 102,
        tecnico: 999,
        fecha: '2026-05-21',
        hora: '11:30',
        estado: 'programada',
        diagnostico: '',
        trabajos_realizados: '',
        repuestos_utilizados: '',
        costo_total: null,
        foto_mantenimiento: null,
      }
    ]
  },
  {
    id: 103,
    codigo: 'MNT-2026-039',
    nombre_cliente: 'Almacén Logístico Transcargo',
    telefono: '+51 999 888 777',
    correo: 'operaciones@transcargo.pe',
    direccion: 'Av. Industrial 850',
    distrito: 'Ate',
    tipo_puerta: 'Industrial Levadiza de Gran Peso',
    fecha_instalacion_aprox: '2023-08-15',
    descripcion_problema: 'Cambio preventivo de resortes.',
    disponibilidad: 'Cualquier día previa coordinación',
    tipo: 'garantia',
    estado: 'resuelto',
    garantia_vigente: false,
    token_unico: 'tok-mnt-03',
    creado_en: '2026-05-10T10:00:00Z',
    actualizado_en: '2026-05-14T17:00:00Z',
    visitas: [
      {
        id: 203,
        mantenimiento: 103,
        tecnico: 999,
        fecha: '2026-05-14',
        hora: '15:00',
        estado: 'completada',
        diagnostico: 'Resortes desgastados con riesgo de ruptura.',
        trabajos_realizados: 'Reemplazo de resortes helicoidales.',
        repuestos_utilizados: '2 Resortes de torsión, Grasa de litio.',
        costo_total: 450.00,
        foto_mantenimiento: null,
      }
    ]
  }
];

export const MantenimientoService = {
  getMyMantenimientos: async (tecnicoId: number): Promise<Mantenimiento[]> => {
    if (useAuthStore.getState().isDemoMode) {
      return MOCK_MANTENIMIENTOS;
    }
    const response = await api.get<Mantenimiento[]>('/mantenimientos/mis_mantenimientos/');
    return response.data;
  },

  getMantenimientoDetail: async (id: number): Promise<Mantenimiento> => {
    if (useAuthStore.getState().isDemoMode) {
      const mant = MOCK_MANTENIMIENTOS.find((m) => m.id === id);
      if (!mant) throw new Error('Mantenimiento no encontrado (Demo)');
      return mant;
    }
    const response = await api.get<Mantenimiento>(`/mantenimientos/${id}/`);
    return response.data;
  },

  updateMantenimientoStatus: async (id: number, status: any): Promise<Mantenimiento> => {
    if (useAuthStore.getState().isDemoMode) {
      MOCK_MANTENIMIENTOS = MOCK_MANTENIMIENTOS.map((m) => {
        if (m.id === id) return { ...m, estado: status, actualizado_en: new Date().toISOString() };
        return m;
      });
      const updated = MOCK_MANTENIMIENTOS.find((m) => m.id === id);
      if (!updated) throw new Error('Mantenimiento no encontrado (Demo)');
      return updated;
    }
    const response = await api.patch<Mantenimiento>(`/mantenimientos/${id}/`, { estado: status });
    return response.data;
  },

  updateVisitaMantenimiento: async (visitaId: number, data: {
    estado: 'programada' | 'completada' | 'cancelada' | 'reprogramada';
    diagnostico: string;
    trabajos_realizados: string;
    repuestos_utilizados: string;
    costo_total: number;
  }): Promise<any> => {
    if (useAuthStore.getState().isDemoMode) {
      MOCK_MANTENIMIENTOS = MOCK_MANTENIMIENTOS.map((m) => {
        const hasVisita = m.visitas?.some((v) => v.id === visitaId);
        if (hasVisita) {
          const updatedVisitas = m.visitas?.map((v) => {
            if (v.id === visitaId) {
              return {
                ...v,
                estado: data.estado,
                diagnostico: data.diagnostico,
                trabajos_realizados: data.trabajos_realizados,
                repuestos_utilizados: data.repuestos_utilizados,
                costo_total: data.costo_total,
              };
            }
            return v;
          });
          return { ...m, visitas: updatedVisitas };
        }
        return m;
      });
      return { success: true };
    }
    const response = await api.patch(`/visitas-mantenimiento/${visitaId}/`, data);
    return response.data;
  },

  subirFotoMantenimiento: async (visitaId: number, fotoUri: string): Promise<any> => {
    if (useAuthStore.getState().isDemoMode) {
      return { success: true };
    }
    const formData = new FormData();
    const filename = fotoUri.split('/').pop() || 'foto.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1] : 'jpg';

    formData.append('foto_mantenimiento', {
      uri: fotoUri,
      name: `mantenimiento_${visitaId}.${ext}`,
      type: `image/${ext}`,
    } as any);

    const response = await api.patch(`/visitas-mantenimiento/${visitaId}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default MantenimientoService;