import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

interface EmptyStateProps {
  title?: string;
  message: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title = 'Sin resultados', message, iconName = 'inbox' }) => (
  <View style={styles.container} accessibilityRole="summary">
    <View style={styles.iconContainer}>
      <MaterialIcons name={iconName} size={28} color={COLORS.PRIMARY_GOLD} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingVertical: 48, paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center' },
  iconContainer: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderWidth: 1, borderColor: COLORS.BORDER_GOLD,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 8, fontFamily: 'System', textAlign: 'center' },
  message: { fontSize: 14, color: COLORS.TEXT_SECONDARY, textAlign: 'center', lineHeight: 21, fontFamily: 'System' },
});

export default EmptyState;