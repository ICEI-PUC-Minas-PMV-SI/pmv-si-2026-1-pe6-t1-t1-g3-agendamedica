import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, typography } from '@/lib/tokens';
import { initials } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string;
  size?: AvatarSize;
}

const sizeMap = { sm: 32, md: 40, lg: 56 } as const;
const fontSizeMap = { sm: 12, md: 15, lg: 20 } as const;

export function Avatar({ name, size = 'md' }: AvatarProps) {
  const dim = sizeMap[size];
  return (
    <View
      style={[
        styles.base,
        { width: dim, height: dim, borderRadius: radius.pill },
      ]}
    >
      <Text style={[styles.text, { fontSize: fontSizeMap[size] }]}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  text: {
    fontFamily: typography.bodyBold,
    color: colors.accent,
    letterSpacing: 0.5,
  },
});
