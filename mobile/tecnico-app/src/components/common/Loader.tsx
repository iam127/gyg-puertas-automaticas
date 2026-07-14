import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import COLORS from '../../constants/colors';

interface LoaderProps { message?: string; }

export const Loader: React.FC<LoaderProps> = ({ message = 'Cargando...' }) => (
  <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message}>
    <View style={styles.ring}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY_GOLD} />
    </View>
    {message && <Text style={styles.text}>{message}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG_BASE, justifyContent: 'center', alignItems: 'center', padding: 32 },
  ring: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderWidth: 1, borderColor: COLORS.BORDER_GOLD,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  text: { color: COLORS.TEXT_SECONDARY, fontSize: 14, fontFamily: 'System', fontWeight: '500' },
});

export default Loader;