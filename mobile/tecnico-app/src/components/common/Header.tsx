import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightComponent }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {onBack ? (
            <TouchableOpacity 
              onPress={onBack} 
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Regresar"
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        
        <View style={styles.rightContainer}>
          {rightComponent || null}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.BG_DARK,
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_DARK,
    backgroundColor: COLORS.BG_DARK,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: LAYOUT.typography.sizes.h3,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
    textAlign: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: LAYOUT.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_DARK,
  },
  backArrow: {
    fontSize: 20,
    color: COLORS.PRIMARY_GOLD,
    fontWeight: 'bold',
  },
});

export default Header;
