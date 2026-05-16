import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ViewStyle,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchAppointmentById, cancelAppointment } from '@/lib/api';
import { colors, spacing, radius, typography, shadows } from '@/lib/tokens';
import { fmtDateLong, fmtTime } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { CalendarIcon, ClockIcon, UserIcon } from '@/components/ui/Icon';
import type { Appointment } from '@/lib/types';

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointmentById(id)
      .then(setAppointment)
      .catch(() => router.back())
      .finally(() => setLoading(false));
  }, [id]);

  function confirmCancel() {
    Alert.alert(
      'Cancelar consulta',
      'Tem certeza que deseja cancelar esta consulta?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim, cancelar', style: 'destructive', onPress: doCancel },
      ],
    );
  }

  async function doCancel() {
    if (!appointment) return;
    setCancelling(true);
    try {
      const updated = await cancelAppointment(appointment.id);
      setAppointment((prev) => prev ? { ...prev, status: updated.status } : prev);
    } catch (err: unknown) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível cancelar.');
    } finally {
      setCancelling(false);
    }
  }

  const canCancel =
    appointment &&
    (appointment.status === 'PENDING' || appointment.status === 'CONFIRMED');

  return (
    <>
      <Stack.Screen options={{ title: 'Detalhes da consulta', headerBackTitle: 'Voltar' }} />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        {loading ? (
          <LoadingState rows={4} />
        ) : appointment ? (
          <ScrollView contentContainerStyle={styles.content}>
            {/* Status */}
            <View style={styles.statusRow}>
              <Badge status={appointment.status} />
            </View>

            {/* Info card */}
            <View style={styles.card}>
              <InfoRow
                icon={<UserIcon color={colors.inkMuted} size={18} />}
                label="Médico"
                value={appointment.doctor?.name ?? 'Não informado'}
                sub={appointment.doctor?.specialty}
              />
              <View style={styles.divider} />
              <InfoRow
                icon={<CalendarIcon color={colors.inkMuted} size={18} />}
                label="Data"
                value={fmtDateLong(appointment.date)}
              />
              <View style={styles.divider} />
              <InfoRow
                icon={<ClockIcon color={colors.inkMuted} size={18} />}
                label="Horário"
                value={fmtTime(appointment.date)}
              />
              {appointment.doctor?.clinic ? (
                <>
                  <View style={styles.divider} />
                  <InfoRow
                    icon={<UserIcon color={colors.inkMuted} size={18} />}
                    label="Clínica"
                    value={appointment.doctor.clinic}
                  />
                </>
              ) : null}
            </View>

            {/* Notes */}
            {appointment.notes ? (
              <View style={styles.notesCard}>
                <Text style={styles.notesLabel}>Observações</Text>
                <Text style={styles.notesText}>{appointment.notes}</Text>
              </View>
            ) : null}

            {/* Cancel */}
            {canCancel ? (
              <Button
                label="Cancelar consulta"
                onPress={confirmCancel}
                variant="danger"
                loading={cancelling}
                style={styles.cancelBtn}
              />
            ) : null}
          </ScrollView>
        ) : null}
      </SafeAreaView>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoTexts}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
        {sub ? <Text style={styles.infoSub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing[5], gap: spacing[4] } as ViewStyle,
  statusRow: { alignItems: 'flex-start' } as ViewStyle,
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  } as ViewStyle,
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing[5] + 18 + spacing[3],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[4],
    gap: spacing[3],
  } as ViewStyle,
  infoIcon: {
    width: 18,
    marginTop: 2,
  } as ViewStyle,
  infoTexts: { flex: 1 } as ViewStyle,
  infoLabel: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.base,
    color: colors.ink,
  },
  infoSub: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
    marginTop: 1,
  },
  notesCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[2],
    ...shadows.sm,
  } as ViewStyle,
  notesLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
  notesText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.base,
    color: colors.ink,
    lineHeight: typography.size.base * typography.lineHeight.normal,
  },
  cancelBtn: { marginTop: spacing[2] } as ViewStyle,
});
