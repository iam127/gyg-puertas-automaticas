import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onBack, rightComponent }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSlot}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Regresar" activeOpacity={0.75}>
              <MaterialIcons name="arrow-back" size={20} color={COLORS.PRIMARY_GOLD_DARK} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
        <View style={styles.rightSlot}>{rightComponent ?? null}</View>
      </View>
      <View style={styles.accent} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { backgroundColor: COLORS.BG_SURFACE },
  container: { height: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  leftSlot:  { width: 44, alignItems: 'flex-start', justifyContent: 'center' },
  rightSlot: { width: 44, alignItems: 'flex-end',   justifyContent: 'center' },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, letterSpacing: 0.2, fontFamily: 'System', textAlign: 'center' },
  subtitle: { fontSize: 11, color: COLORS.TEXT_TERTIARY, marginTop: 1, fontFamily: 'System', textAlign: 'center' },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.BG_ELEVATED,
    borderWidth: 1, borderColor: COLORS.BORDER_DARK,
    justifyContent: 'center', alignItems: 'center',
  },
  accent: { height: 1, backgroundColor: COLORS.BORDER_SUBTLE },
});

export default Header;