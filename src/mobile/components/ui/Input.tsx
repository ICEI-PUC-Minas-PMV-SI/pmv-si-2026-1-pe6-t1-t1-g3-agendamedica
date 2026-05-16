import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { colors, spacing, radius, typography } from '@/lib/tokens';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={colors.inkMuted}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[1],
  } as ViewStyle,
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.ink2,
  } as TextStyle,
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    fontFamily: typography.bodyFont,
    fontSize: typography.size.base,
    color: colors.ink,
    backgroundColor: colors.surface,
  } as TextStyle,
  inputFocused: {
    borderColor: colors.accent,
    borderWidth: 2,
  } as TextStyle,
  inputError: {
    borderColor: colors.danger,
  } as TextStyle,
  error: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.xs,
    color: colors.danger,
  } as TextStyle,
});
