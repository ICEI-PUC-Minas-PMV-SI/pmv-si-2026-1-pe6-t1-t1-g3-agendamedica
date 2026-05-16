import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius } from '@/lib/tokens';

interface SkeletonRowProps {
  width?: string | number;
  height?: number;
  style?: ViewStyle;
}

function SkeletonRow({ width = '100%', height = 16, style }: SkeletonRowProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: colors.border,
          borderRadius: radius.sm,
          opacity,
        },
        style,
      ]}
    />
  );
}

interface LoadingStateProps {
  rows?: number;
}

export function LoadingState({ rows = 3 }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.left}>
            <SkeletonRow width={44} height={44} style={{ borderRadius: radius.md }} />
          </View>
          <View style={styles.right}>
            <SkeletonRow width="70%" height={14} />
            <SkeletonRow width="45%" height={12} style={{ marginTop: spacing[2] }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[4],
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  } as ViewStyle,
  left: {} as ViewStyle,
  right: {
    flex: 1,
    gap: spacing[1],
  } as ViewStyle,
});
