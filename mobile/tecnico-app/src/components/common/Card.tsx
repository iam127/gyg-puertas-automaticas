import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import COLORS from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  hasBorder?: boolean;
  variant?: 'default' | 'elevated' | 'gold';
}

export const Card: React.FC<CardProps> = ({ children, style, hasBorder = false, variant = 'default' }) => {
  return (
    <View style={[styles.base, styles[`variant_${variant}`], hasBorder && styles.bordered, variant === 'gold' && styles.goldBorder, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: { borderRadius: 16, padding: 16, marginVertical: 6 },
  variant_default: {
    backgroundColor: COLORS.BG_SURFACE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  variant_elevated: { backgroundColor: COLORS.BG_ELEVATED },
  variant_gold:     { backgroundColor: COLORS.BG_SURFACE },
  bordered:   { borderWidth: 1, borderColor: COLORS.BORDER_DARK },
  goldBorder: { borderWidth: 1, borderColor: COLORS.BORDER_GOLD },
});

export default Card;