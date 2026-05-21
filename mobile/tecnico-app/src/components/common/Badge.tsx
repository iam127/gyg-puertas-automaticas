import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';
import { getMantenimientoStatus, getCotizacionStatus } from '../../constants/statusConfig';

interface BadgeProps {
  status: string;
  type: 'mantenimiento' | 'cotizacion';
}

export const Badge: React.FC<BadgeProps> = ({ status, type }) => {
  const config = type === 'mantenimiento' 
    ? getMantenimientoStatus(status) 
    : getCotizacionStatus(status);

  return (
    <View 
      style={[
        styles.badge, 
        { backgroundColor: config.bgColor || COLORS.CARD_DARK }
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Estado: ${config.label}`}
    >
      <Text style={[styles.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: LAYOUT.spacing.sm,
    paddingVertical: LAYOUT.spacing.xs,
    borderRadius: LAYOUT.borderRadius.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  text: {
    fontSize: LAYOUT.typography.sizes.xs,
    fontWeight: 'bold',
    fontFamily: 'System',
    textTransform: 'uppercase',
  },
});

export default Badge;
