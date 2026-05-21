import api from './config';
import { Cotizacion } from '../types/cotizacion.types';
import { useAuthStore } from '../store/authStore';

// Mock Data for Demo/Guest Mode when backend is offline
let MOCK_COTIZACIONES: Cotizacion[] = [
  {
    id: 301,
    codigo: 'COT-2026-089',
    nombre_cliente: 'Sra. Beatriz Mandamiento',
    telefono: '+51 944 556 778',
    correo: 'bmandamiento@outlook.com',
    direccion: 'Jr. Cantuarias 254, Dpto 402',
    distrito: 'Miraflores',
    referencias: 'A dos cuadras del Parque Kennedy',
    tipo_uso: 'residencial',
    descripcion: 'Solicita cotización para instalación de puerta levadiza con motor CAME en su cochera privada.',
    disponibilidad: 'Cualquier día a partir de las 3:00 PM',
    estado: 'visita_agendada',
    motivo_rechazo: '',
    token_unico: 'tok-cot-01',
    creado_en: '2026-05-17T09:00:00Z',
    actualizado_en: '2026-05-18T11:00:00Z',
    visitas: [
      {
        id: 401,
        cotizacion: 301,
        tecnico: 999, // Guest Tech ID
        fecha: '2026-05-22',
        hora: '15:30',
        estado: 'programada',
        medidas: '',
        observaciones: '',
        dificultad: '',
        tiempo_estimado: '',
      }
    ]
  },
  {
    id: 302,
    codigo: 'COT-2026-081',
    nombre_cliente: 'Supermercados Metro - San Isidro',
    telefono: '+51 988 776 655',
    correo: 'mantenimiento.metro@cencosud.pe',
    direccion: 'Av. Las Begonias 320',
    distrito: 'San Isidro',
    referencias: 'Frente al Centro Comercial Begonias',
    tipo_uso: 'comercial',
    descripcion: 'Visita técnica de cotización para reparación estructural y cambio de sistema batiente en puerta de carga principal.',
    disponibilidad: 'Lunes a Viernes por las mañanas antes de las 9:00 AM',
    estado: 'completado',
    motivo_rechazo: '',
    token_unico: 'tok-cot-02',
    creado_en: '2026-05-11T08:00:00Z',
    actualizado_en: '2026-05-13T12:00:00Z',
    visitas: [
      {
        id: 402,
        cotizacion: 302,
        tecnico: 999,
        fecha: '2026-05-13',
        hora: '07:30',
        estado: 'completada',
        medidas: 'Ancho: 4.5m, Alto: 3.2m. Espesor riel: 4mm',
        observaciones: 'El sistema batiente se encuentra desviado por choque leve de camión. Se requiere cambio de bisagras industriales y alineación de guías de arrastre.',
        dificultad: 'Media-Alta',
        tiempo_estimado: '2 días hábiles (8 horas netas de trabajo técnico)',
      }
    ]
  }
];

export const CotizacionService = {
  /**
   * Fetches all technical quotation visits and filters them by technician ID on the client side
   */
  getMyCotizaciones: async (tecnicoId: number): Promise<Cotizacion[]> => {
    if (useAuthStore.getState().isDemoMode) {
      return MOCK_COTIZACIONES.filter((c) =>
        c.visitas?.some((v) => v.tecnico === tecnicoId)
      );
    }

    const response = await api.get<Cotizacion[]>('/cotizaciones/');
    return response.data.filter((c) =>
      c.visitas?.some((v) => v.tecnico === tecnicoId)
    );
  },

  /**
   * Fetches full details for a single quotation
   */
  getCotizacionDetail: async (id: number): Promise<Cotizacion> => {
    if (useAuthStore.getState().isDemoMode) {
      const quote = MOCK_COTIZACIONES.find((c) => c.id === id);
      if (!quote) throw new Error('Cotización no encontrada (Demo)');
      return quote;
    }

    const response = await api.get<Cotizacion>(`/cotizaciones/${id}/`);
    return response.data;
  },

  /**
   * Updates the global status of a quotation ticket
   */
  updateCotizacionStatus: async (id: number, status: any): Promise<Cotizacion> => {
    if (useAuthStore.getState().isDemoMode) {
      MOCK_COTIZACIONES = MOCK_COTIZACIONES.map((c) => {
        if (c.id === id) {
          return { ...c, estado: status, actualizado_en: new Date().toISOString() };
        }
        return c;
      });
      const updated = MOCK_COTIZACIONES.find((c) => c.id === id);
      if (!updated) throw new Error('Cotización no encontrada (Demo)');
      return updated;
    }

    const response = await api.patch<Cotizacion>(`/cotizaciones/${id}/`, {
      estado: status,
    });
    return response.data;
  },

  /**
   * Updates the technical details of a specific technical quotation visit
   */
  updateVisitaTecnica: async (visitaId: number, data: {
    estado: 'programada' | 'completada' | 'cancelada' | 'reprogramada';
    medidas: string;
    observaciones: string;
    dificultad: string;
    tiempo_estimado: string;
  }): Promise<any> => {
    if (useAuthStore.getState().isDemoMode) {
      MOCK_COTIZACIONES = MOCK_COTIZACIONES.map((c) => {
        const hasVisita = c.visitas?.some((v) => v.id === visitaId);
        if (hasVisita) {
          const updatedVisitas = c.visitas?.map((v) => {
            if (v.id === visitaId) {
              return {
                ...v,
                estado: data.estado,
                medidas: data.medidas,
                observaciones: data.observaciones,
                dificultad: data.dificultad,
                tiempo_estimado: data.tiempo_estimado,
              };
            }
            return v;
          });
          return { ...c, visitas: updatedVisitas };
        }
        return c;
      });
      return { success: true, message: 'Visita de cotización técnica actualizada (Demo)' };
    }

    const response = await api.patch(`/visitas/${visitaId}/`, data);
    return response.data;
  },
};

export default CotizacionService;
