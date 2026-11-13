// ─── GYG PUERTAS AUTOMÁTICAS — Design System Colors (Light / Crema) ──────────

const COLORS = {

  // ── Dorado principal ───────────────────────────────────────────────────────
  PRIMARY_GOLD:        '#F59E0B',
  PRIMARY_GOLD_LIGHT:  '#FCD34D',
  PRIMARY_GOLD_DARK:   '#B45309',
  PRIMARY_GOLD_MUTED:  'rgba(245, 158, 11, 0.10)',
  PRIMARY_GOLD_BORDER: 'rgba(245, 158, 11, 0.30)',

  // ── Fondos ─────────────────────────────────────────────────────────────────
  BG_BASE:      '#FAFAF8',   // Fondo raíz — crema/hueso
  BG_DARK:      '#FAFAF8',   // Alias para compatibilidad
  BG_SURFACE:   '#FFFFFF',   // Cards y superficies elevadas
  BG_ELEVATED:  '#F3F2EF',   // Inputs, elementos interactivos
  BG_OVERLAY:   '#ECEAE5',   // Hover, pressed

  // ── Tarjetas ───────────────────────────────────────────────────────────────
  CARD_DARK:    '#FFFFFF',
  CARD_MEDIUM:  '#F7F6F3',
  CARD_LIGHT:   '#F3F2EF',

  // ── Textos ─────────────────────────────────────────────────────────────────
  TEXT_PRIMARY:   '#1A1814',   // Casi negro cálido
  TEXT_SECONDARY: '#6B6760',   // Gris cálido medio
  TEXT_TERTIARY:  '#9B9790',   // Hints, placeholders
  TEXT_MUTED:     '#C4C0B8',   // Subtexto muy apagado
  TEXT_INVERSE:   '#FFFFFF',   // Texto sobre fondos oscuros

  // ── Bordes ─────────────────────────────────────────────────────────────────
  BORDER_SUBTLE:      'rgba(26, 24, 20, 0.06)',
  BORDER_DARK:        'rgba(26, 24, 20, 0.12)',
  BORDER_MEDIUM:      'rgba(26, 24, 20, 0.18)',
  BORDER_GOLD:        'rgba(245, 158, 11, 0.25)',
  BORDER_GOLD_STRONG: 'rgba(245, 158, 11, 0.55)',

  // ── Estados semánticos ─────────────────────────────────────────────────────
  SUCCESS:        '#059669',
  SUCCESS_BG:     'rgba(5, 150, 105, 0.08)',
  SUCCESS_BORDER: 'rgba(5, 150, 105, 0.20)',

  WARNING:        '#F59E0B',
  WARNING_BG:     'rgba(245, 158, 11, 0.10)',
  WARNING_BORDER: 'rgba(245, 158, 11, 0.25)',

  ERROR_RED:      '#DC2626',
  ERROR_BG:       'rgba(220, 38, 38, 0.08)',
  ERROR_BORDER:   'rgba(220, 38, 38, 0.20)',

  INFO:           '#2563EB',
  INFO_BG:        'rgba(37, 99, 235, 0.08)',
  INFO_BORDER:    'rgba(37, 99, 235, 0.20)',

  // ── Tipos de servicio ──────────────────────────────────────────────────────
  PREVENTIVE_BLUE:    '#2563EB',
  PREVENTIVE_BLUE_BG: 'rgba(37, 99, 235, 0.08)',

  CORRECTIVE_ORANGE:    '#EA580C',
  CORRECTIVE_ORANGE_BG: 'rgba(234, 88, 12, 0.08)',

  WARRANTY_GREEN:    '#059669',
  WARRANTY_GREEN_BG: 'rgba(5, 150, 105, 0.08)',

  // ── Integraciones ──────────────────────────────────────────────────────────
  WHATSAPP_GREEN: '#25D366',

  // ── Básicos ────────────────────────────────────────────────────────────────
  WHITE:  '#FFFFFF',
  BLACK:  '#1A1814',
  MUTED:  '#9B9790',

  // ── Compatibilidad heredada ────────────────────────────────────────────────
  SECONDARY_GOLD: '#FCD34D',
};

export default COLORS;