import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography, shadows } from '@/lib/tokens';
import { Badge } from '@/components/ui/Badge';
import { fmtMonthShort, fmtDayOfMonth, fmtTime, isToday } from '@/lib/utils';
import type { Appointment } from '@/lib/types';

interface AppointmentRowProps {
  appointment: Appointment;
  style?: ViewStyle;
}

export function AppointmentRow({ appointment, style }: AppointmentRowProps) {
  const router = useRouter();
  const today = isToday(appointment.date);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/appointment/${appointment.id}` as any)}
      activeOpacity={0.75}
      style={[styles.row, style]}
    >
      {/* Date box */}
      <View style={[styles.dateBox, today && styles.dateBoxToday]}>
        <Text style={[styles.month, today && styles.textToday]}>
          {fmtMonthShort(appointment.date)}
        </Text>
        <Text style={[styles.day, today && styles.textToday]}>
          {fmtDayOfMonth(appointment.date)}
        </Text>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.doctorName} numberOfLines={1}>
          {appointment.doctor?.name ?? 'Médico'}
        </Text>
        <Text style={styles.specialty} numberOfLines={1}>
          {appointment.doctor?.specialty ?? ''}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.time}>{fmtTime(appointment.date)}</Text>
          <Badge status={appointment.status} />
        </View>
      </View>

      {/* Arrow */}
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[3],
    ...shadows.sm,
  } as ViewStyle,
  dateBox: {
    width: 48,
    alignItems: 'center',
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.md,
    paddingVertical: spacing[2],
  } as ViewStyle,
  dateBoxToday: {
    backgroundColor: colors.accent,
  } as ViewStyle,
  month: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    textTransform: 'uppercase',
  },
  day: {
    fontFamily: typography.displayFont,
    fontSize: typography.size.xl,
    color: colors.ink,
    lineHeight: typography.size.xl * 1.1,
  },
  textToday: {
    color: '#fff',
  },
  details: {
    flex: 1,
    gap: 2,
  } as ViewStyle,
  doctorName: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.base,
    color: colors.ink,
  },
  specialty: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[1],
  } as ViewStyle,
  time: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
  },
  arrow: {
    fontSize: 20,
    color: colors.border,
    fontFamily: typography.bodyFont,
  },
});
