import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      case 'outline':
        return styles.outlineButton;
      case 'primary':
      default:
        return styles.primaryButton;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      case 'secondary':
        return styles.secondaryText;
      case 'primary':
      case 'danger':
      default:
        return styles.primaryText;
    }
  };

  const isBtnDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isBtnDisabled}
      style={[
        styles.button, 
        getVariantStyle(), 
        isBtnDisabled && styles.disabledButton, 
        style
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isBtnDisabled, busy: loading }}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? COLORS.PRIMARY_GOLD : COLORS.BG_DARK} 
        />
      ) : (
        <Text style={[styles.text, getVariantTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: LAYOUT.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.spacing.lg,
    flexDirection: 'row',
    ...LAYOUT.shadows.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY_GOLD,
  },
  secondaryButton: {
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
  },
  dangerButton: {
    backgroundColor: COLORS.ERROR_RED,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY_GOLD,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  primaryText: {
    color: COLORS.BG_DARK,
  },
  secondaryText: {
    color: COLORS.TEXT_PRIMARY,
  },
  outlineText: {
    color: COLORS.PRIMARY_GOLD,
  },
});

export default Button;
