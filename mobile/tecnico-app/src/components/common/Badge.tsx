import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import { getMantenimientoStatus, getCotizacionStatus } from '../../constants/statusConfig';

interface BadgeProps {
  status: string;
  type: 'mantenimiento' | 'cotizacion';
}

export const Badge: React.FC<BadgeProps> = ({ status, type }) => {
  const config = type === 'mantenimiento' ? getMantenimientoStatus(status) : getCotizacionStatus(status);
  return (
    <View style={[styles.pill, { backgroundColor: config.bgColor ?? COLORS.BG_ELEVATED }]} accessibilityRole="text" accessibilityLabel={`Estado: ${config.label}`}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 11, fontWeight: '700', fontFamily: 'System', letterSpacing: 0.4, textTransform: 'uppercase' },
});

export default Badge;