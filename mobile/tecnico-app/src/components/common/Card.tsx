import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  hasBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, hasBorder = false }) => {
  return (
    <View style={[styles.card, hasBorder && styles.border, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: LAYOUT.spacing.md,
    marginVertical: LAYOUT.spacing.sm,
    ...LAYOUT.shadows.sm,
  },
  border: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
  },
});

export default Card;
