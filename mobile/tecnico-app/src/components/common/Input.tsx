import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label, error, hint, containerStyle, secureTextEntry, onFocus, onBlur, ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = !!error;
  const isSecure = secureTextEntry && !isPasswordVisible;

  const borderColor = hasError ? COLORS.ERROR_RED : isFocused ? COLORS.PRIMARY_GOLD : COLORS.BORDER_DARK;
  const borderWidth = isFocused || hasError ? 1.5 : 1;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.fieldRow, { borderColor, borderWidth }, isFocused && styles.focusedBg]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.TEXT_TERTIARY}
          secureTextEntry={isSecure}
          onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
          accessibilityLabel={label}
          selectionColor={COLORS.PRIMARY_GOLD}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(v => !v)}
            style={styles.eyeBtn}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={20} color={COLORS.TEXT_TERTIARY} />
          </TouchableOpacity>
        )}
      </View>
      {hasError && (
        <View style={styles.feedbackRow}>
          <MaterialIcons name="error-outline" size={13} color={COLORS.ERROR_RED} />
          <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>
        </View>
      )}
      {!hasError && hint && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginVertical: 8, width: '100%' },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: 'System',
    textTransform: 'uppercase',
  },
  fieldRow: {
    height: 52,
    backgroundColor: COLORS.BG_ELEVATED,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  focusedBg: { backgroundColor: COLORS.BG_SURFACE },
  input: { flex: 1, height: '100%', color: COLORS.TEXT_PRIMARY, fontSize: 15, fontFamily: 'System' },
  eyeBtn: { padding: 6, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  errorText: { color: COLORS.ERROR_RED, fontSize: 12, fontWeight: '500', fontFamily: 'System' },
  hintText: { color: COLORS.TEXT_TERTIARY, fontSize: 12, marginTop: 5, fontFamily: 'System' },
});

export default Input;