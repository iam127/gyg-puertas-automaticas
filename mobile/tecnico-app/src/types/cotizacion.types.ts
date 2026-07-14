export type CotizacionEstado =
  | 'recibido'
  | 'en_revision'
  | 'visita_agendada'
  | 'cotizado'
  | 'aceptado'
  | 'rechazado'
  | 'instalacion_agendada'
  | 'en_instalacion'
  | 'completado'
  | 'cancelado';

export interface VisitaTecnica {
  id: number;
  cotizacion: number;
  tecnico: number | null;
  fecha: string;
  hora: string;
  estado: 'programada' | 'completada' | 'cancelada' | 'reprogramada';
  medidas: string;
  materiales_necesarios: string;
  observaciones: string;
  dificultad: string;
  tiempo_estimado: string;
  creado_en?: string;
}

export interface Cotizacion {
  id: number;
  codigo: string;
  nombre_cliente: string;
  telefono: string;
  correo: string;
  direccion: string;
  distrito: string;
  referencias: string;
  tipo_uso: 'residencial' | 'comercial' | 'industrial';
  descripcion: string;
  disponibilidad: string;
  estado: CotizacionEstado;
  motivo_rechazo: string;
  token_unico: string;
  creado_en: string;
  actualizado_en: string;
  visitas?: VisitaTecnica[];
}
