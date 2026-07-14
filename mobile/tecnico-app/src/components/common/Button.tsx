import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import COLORS from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, style, textStyle, accessibilityLabel, leftIcon,
}) => {
  const isBtnDisabled = disabled || loading;
  const spinnerColor = variant === 'primary' ? COLORS.WHITE : COLORS.PRIMARY_GOLD_DARK;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isBtnDisabled}
      style={[styles.base, styles[`size_${size}`], styles[`variant_${variant}`], isBtnDisabled && styles.disabled, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isBtnDisabled, busy: loading }}
      activeOpacity={0.80}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconWrap}>{leftIcon}</View>}
          <Text style={[styles.label, styles[`label_${size}`], styles[`label_${variant}`], textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: { borderRadius: 14, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconWrap: { marginRight: 8 },

  size_sm: { height: 40, paddingHorizontal: 16 },
  size_md: { height: 52, paddingHorizontal: 20 },
  size_lg: { height: 58, paddingHorizontal: 24 },

  variant_primary: { backgroundColor: COLORS.PRIMARY_GOLD },
  variant_secondary: { backgroundColor: COLORS.BG_ELEVATED, borderWidth: 1, borderColor: COLORS.BORDER_DARK },
  variant_danger:   { backgroundColor: COLORS.ERROR_RED },
  variant_outline:  { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.BORDER_GOLD_STRONG },
  variant_ghost:    { backgroundColor: COLORS.PRIMARY_GOLD_MUTED, borderWidth: 1, borderColor: COLORS.BORDER_GOLD },

  disabled: { opacity: 0.45 },

  label: { fontFamily: 'System', letterSpacing: 0.2 },
  label_sm: { fontSize: 13, fontWeight: '600' },
  label_md: { fontSize: 15, fontWeight: '700' },
  label_lg: { fontSize: 16, fontWeight: '700' },

  label_primary:   { color: COLORS.WHITE },
  label_secondary: { color: COLORS.TEXT_PRIMARY },
  label_danger:    { color: COLORS.WHITE },
  label_outline:   { color: COLORS.PRIMARY_GOLD_DARK },
  label_ghost:     { color: COLORS.PRIMARY_GOLD_DARK },
});

export default Button;