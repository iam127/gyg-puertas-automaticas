import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Cargando...' }) => {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY_GOLD} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.spacing.lg,
  },
  text: {
    marginTop: LAYOUT.spacing.md,
    color: COLORS.TEXT_SECONDARY,
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontFamily: 'System',
  },
});

export default Loader;
