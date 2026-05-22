import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/lib/tokens';
import { STATUS_LABEL, STATUS_COLOR, STATUS_BG } from '@/lib/utils';
import type { AppointmentStatus } from '@/lib/types';

interface BadgeProps {
  status: AppointmentStatus;
}

export function Badge({ status }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: STATUS_BG[status] }]}>
      <Text style={[styles.label, { color: STATUS_COLOR[status] }]}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

// Generic colored dot badge for numbers (e.g. notification count)
interface DotBadgeProps {
  count: number;
}

export function DotBadge({ count }: DotBadgeProps) {
  if (count <= 0) return null;
  return (
    <View style={styles.dot}>
      <Text style={styles.dotText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radius.pill,
  } as ViewStyle,
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.xs,
  },
  dot: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  } as ViewStyle,
  dotText: {
    fontFamily: typography.bodyBold,
    fontSize: 10,
    color: '#fff',
  },
});
