import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, radius, typography } from '@/lib/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#fff' : colors.accent}
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  } as ViewStyle,

  primary: {
    backgroundColor: colors.accent,
  } as ViewStyle,
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  } as ViewStyle,
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  } as ViewStyle,
  danger: {
    backgroundColor: colors.danger,
  } as ViewStyle,

  size_sm: { height: 32, paddingHorizontal: spacing[3] } as ViewStyle,
  size_md: { height: 44, paddingHorizontal: spacing[5] } as ViewStyle,
  size_lg: { height: 52, paddingHorizontal: spacing[6] } as ViewStyle,

  disabled: { opacity: 0.5 } as ViewStyle,

  label: {
    fontFamily: typography.bodyMedium,
  } as TextStyle,
  label_primary: { color: '#fff' } as TextStyle,
  label_secondary: { color: colors.ink } as TextStyle,
  label_ghost: { color: colors.accent } as TextStyle,
  label_danger: { color: '#fff' } as TextStyle,

  labelSize_sm: { fontSize: typography.size.sm } as TextStyle,
  labelSize_md: { fontSize: typography.size.base } as TextStyle,
  labelSize_lg: { fontSize: typography.size.md } as TextStyle,
});
