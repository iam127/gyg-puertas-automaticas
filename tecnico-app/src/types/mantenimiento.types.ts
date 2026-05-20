export type MantenimientoTipo = 'preventivo' | 'correctivo' | 'garantia';

export type MantenimientoEstado =
  | 'recibido'
  | 'en_revision'
  | 'diagnostico_remoto'
  | 'visita_agendada'
  | 'en_proceso'
  | 'esperando_repuestos'
  | 'resuelto'
  | 'cancelado';

export interface VisitaMantenimiento {
  id: number;
  mantenimiento: number;
  tecnico: number | null;
  fecha: string;
  hora: string;
  estado: 'programada' | 'completada' | 'cancelada' | 'reprogramada';
  diagnostico: string;
  trabajos_realizados: string;
  repuestos_utilizados: string;
  costo_total: string | number | null;
  creado_en?: string;
}

export interface Mantenimiento {
  id: number;
  codigo: string;
  nombre_cliente: string;
  telefono: string;
  correo: string;
  direccion: string;
  distrito: string;
  tipo_puerta: string;
  fecha_instalacion_aprox?: string | null;
  descripcion_problema: string;
  disponibilidad: string;
  tipo: MantenimientoTipo;
  estado: MantenimientoEstado;
  garantia_vigente: boolean;
  token_unico: string;
  fecha_proximo_mantenimiento?: string | null;
  creado_en: string;
  actualizado_en: string;
  visitas?: VisitaMantenimiento[];
}
