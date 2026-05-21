import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TextInputProps, 
  ViewStyle, 
  TouchableOpacity 
} from 'react-native';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  secureTextEntry,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const hasSecureOption = secureTextEntry !== undefined;
  const showSecureText = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      
      <View 
        style={[
          styles.inputContainer,
          isFocused && styles.focusedBorder,
          error !== undefined && error !== '' && styles.errorBorder
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          secureTextEntry={showSecureText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label}
          {...props}
        />

        {hasSecureOption && secureTextEntry && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <Text style={styles.eyeText}>
              {isPasswordVisible ? '👁️' : '🙈'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error !== undefined && error !== '' && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: LAYOUT.spacing.sm,
    width: '100%',
  },
  label: {
    fontSize: LAYOUT.typography.sizes.body,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  inputContainer: {
    height: 48,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_DARK,
    borderRadius: LAYOUT.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.spacing.md,
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.TEXT_PRIMARY,
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontFamily: 'System',
  },
  focusedBorder: {
    borderColor: COLORS.PRIMARY_GOLD,
  },
  errorBorder: {
    borderColor: COLORS.ERROR_RED,
  },
  errorText: {
    color: COLORS.ERROR_RED,
    fontSize: LAYOUT.typography.sizes.small,
    marginTop: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  eyeButton: {
    padding: LAYOUT.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    fontSize: 18,
  },
});

export default Input;
