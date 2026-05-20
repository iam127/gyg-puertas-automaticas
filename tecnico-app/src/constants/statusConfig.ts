import COLORS from './colors';

export interface StatusConfigItem {
  label: string;
  color: string;
  bgColor?: string;
}

export const MANTENIMIENTO_STATUS_CONFIG: Record<string, StatusConfigItem> = {
  recibido: { label: 'Recibido', color: COLORS.PREVENTIVE_BLUE, bgColor: COLORS.PREVENTIVE_BLUE_BG },
  en_revision: { label: 'En Revisión', color: COLORS.MUTED, bgColor: COLORS.BORDER_DARK },
  diagnostico_remoto: { label: 'Diag. Remoto', color: COLORS.PRIMARY_GOLD, bgColor: '#332a00' },
  visita_agendada: { label: 'Visita Agendada', color: COLORS.PRIMARY_GOLD, bgColor: '#332a00' },
  en_proceso: { label: 'En Proceso', color: COLORS.CORRECTIVE_ORANGE, bgColor: COLORS.CORRECTIVE_ORANGE_BG },
  esperando_repuestos: { label: 'Esperando Repuestos', color: COLORS.MUTED, bgColor: COLORS.BORDER_DARK },
  resuelto: { label: 'Resuelto', color: COLORS.WARRANTY_GREEN, bgColor: '#dcfce7' },
  cancelado: { label: 'Cancelado', color: COLORS.ERROR_RED, bgColor: '#fee2e2' },
};

export const COTIZACION_STATUS_CONFIG: Record<string, StatusConfigItem> = {
  recibido: { label: 'Recibido', color: COLORS.PREVENTIVE_BLUE, bgColor: COLORS.PREVENTIVE_BLUE_BG },
  en_revision: { label: 'En Revisión', color: COLORS.MUTED, bgColor: COLORS.BORDER_DARK },
  visita_agendada: { label: 'Visita Agendada', color: COLORS.PRIMARY_GOLD, bgColor: '#332a00' },
  cotizado: { label: 'Cotizado', color: COLORS.PRIMARY_GOLD, bgColor: '#332a00' },
  aceptado: { label: 'Aceptado', color: COLORS.WARRANTY_GREEN, bgColor: '#dcfce7' },
  rechazado: { label: 'Rechazado', color: COLORS.ERROR_RED, bgColor: '#fee2e2' },
  instalacion_agendada: { label: 'Instalación Agendada', color: COLORS.PREVENTIVE_BLUE, bgColor: COLORS.PREVENTIVE_BLUE_BG },
  en_instalacion: { label: 'En Instalación', color: COLORS.CORRECTIVE_ORANGE, bgColor: COLORS.CORRECTIVE_ORANGE_BG },
  completado: { label: 'Completado', color: COLORS.WARRANTY_GREEN, bgColor: '#dcfce7' },
  cancelado: { label: 'Cancelado', color: COLORS.ERROR_RED, bgColor: '#fee2e2' },
};

export const getMantenimientoStatus = (status: string): StatusConfigItem => {
  return MANTENIMIENTO_STATUS_CONFIG[status] || { label: status, color: COLORS.MUTED, bgColor: COLORS.BORDER_DARK };
};

export const getCotizacionStatus = (status: string): StatusConfigItem => {
  return COTIZACION_STATUS_CONFIG[status] || { label: status, color: COLORS.MUTED, bgColor: COLORS.BORDER_DARK };
};
