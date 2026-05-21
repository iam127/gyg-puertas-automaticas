import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = 'Sin resultados', 
  message,
}) => {
  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>🔍</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: LAYOUT.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: LAYOUT.borderRadius.round,
    backgroundColor: COLORS.CARD_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.md,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: LAYOUT.typography.sizes.h3,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    marginBottom: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  message: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: LAYOUT.typography.lineHeights.body,
    fontFamily: 'System',
  },
});

export default EmptyState;
