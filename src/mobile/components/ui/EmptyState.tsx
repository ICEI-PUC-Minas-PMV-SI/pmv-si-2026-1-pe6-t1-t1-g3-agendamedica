import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@/lib/tokens';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.emoji}>📭</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[10],
  } as ViewStyle,
  icon: {
    marginBottom: spacing[4],
  } as ViewStyle,
  emoji: {
    fontSize: 40,
  },
  title: {
    fontFamily: typography.displayFont,
    fontSize: typography.size.xl,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  body: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.base,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: typography.size.base * typography.lineHeight.normal,
    marginBottom: spacing[5],
  },
  action: {
    marginTop: spacing[2],
  } as ViewStyle,
});
