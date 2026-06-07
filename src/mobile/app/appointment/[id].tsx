import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  ViewStyle,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { fetchAppointmentById, cancelAppointment, confirmAppointment } from '@/lib/api';
import { colors, spacing, radius, typography, shadows } from '@/lib/tokens';
import { fmtDateLong, fmtTime } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { CalendarIcon, ClockIcon, UserIcon } from '@/components/ui/Icon';
import type { Appointment } from '@/lib/types';

function showAlert(title: string, msg: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
  else Alert.alert(title, msg);
}

export default function AppointmentDetailScreen() {
  const rawId = useLocalSearchParams<{ id?: string }>().id;
  const id = typeof rawId === 'string' ? rawId : undefined;
  const router = useRouter();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!id) {
      // id ausente ou inválido → volta para a tela anterior
      router.back();
      return;
    }
    fetchAppointmentById(id)
      .then(setAppointment)
      .catch(() => router.back())
      .finally(() => setLoading(false));
  }, [id, router]);

  function confirmCancel() {
    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja cancelar esta consulta?')) doCancel();
    } else {
      Alert.alert('Cancelar consulta', 'Tem certeza que deseja cancelar esta consulta?', [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim, cancelar', style: 'destructive', onPress: doCancel },
      ]);
    }
  }

  async function doCancel() {
    if (!appointment) return;
    setCancelling(true);
    try {
      const updated = await cancelAppointment(appointment.id);
      setAppointment(prev => prev ? { ...prev, status: updated.status } : prev);
    } catch (err: unknown) {
      showAlert('Erro', err instanceof Error ? err.message : 'Não foi possível cancelar.');
    } finally {
      setCancelling(false);
    }
  }

  async function doConfirm() {
    if (!appointment) return;
    setConfirming(true);
    try {
      const updated = await confirmAppointment(appointment.id);
      setAppointment(prev => prev ? { ...prev, status: updated.status } : prev);
      showAlert('Sucesso', 'Consulta confirmada com sucesso!');
    } catch (err: unknown) {
      showAlert('Erro', err instanceof Error ? err.message : 'Não foi possível confirmar.');
    } finally {
      setConfirming(false);
    }
  }

  const isReceptionist = user?.role === 'RECEPTIONIST';
  const isPatient = user?.role === 'PATIENT';
  const isDoctor = user?.role === 'DOCTOR';

  const isCancelled = appointment?.status === 'CANCELLED';
  const hoursUntil = appointment
    ? (new Date(appointment.date).getTime() - Date.now()) / (1000 * 60 * 60)
    : 0;

  // Mesmas regras do web
  const canConfirm = isReceptionist && appointment?.status === 'PENDING';
  const canReschedule = !isCancelled && appointment != null &&
    (isReceptionist || (isPatient && hoursUntil >= 4));
  const tooSoonToReschedule = !isCancelled && isPatient && hoursUntil > 0 && hoursUntil < 4;
  const canCancel = !isCancelled && appointment != null &&
    (appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') &&
    (isReceptionist || isPatient);
  const showPatient = (isReceptionist || isDoctor) && !!appointment?.patientName;

  return (
    <>
      <Stack.Screen options={{ title: 'Detalhes da consulta', headerBackTitle: 'Voltar' }} />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        {loading ? (
          <LoadingState rows={4} />
        ) : appointment ? (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.statusRow}>
              <Badge status={appointment.status} />
            </View>

            <View style={styles.card}>
              {showPatient && (
                <>
                  <InfoRow
                    icon={<UserIcon color={colors.inkMuted} size={18} />}
                    label="Paciente"
                    value={appointment.patientName!}
                  />
                  <View style={styles.divider} />
                </>
              )}
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

            {appointment.notes ? (
              <View style={styles.notesCard}>
                <Text style={styles.notesLabel}>Observações</Text>
                <Text style={styles.notesText}>{appointment.notes}</Text>
              </View>
            ) : null}

            {canConfirm ? (
              <Button
                label="Confirmar consulta"
                onPress={doConfirm}
                loading={confirming}
                style={styles.actionBtn}
              />
            ) : null}

            {canReschedule ? (
              <Button
                label="Remarcar consulta"
                variant="secondary"
                onPress={() => router.push(`/appointment/reschedule?id=${appointment.id}` as any)}
                style={styles.actionBtn}
              />
            ) : null}

            {tooSoonToReschedule ? (
              <Text style={styles.mutedNote}>
                Faltam menos de 4 horas para a consulta. Não é possível remarcar.
              </Text>
            ) : null}

            {canCancel ? (
              <Button
                label="Cancelar consulta"
                variant="danger"
                onPress={confirmCancel}
                loading={cancelling}
                style={styles.actionBtn}
              />
            ) : null}
          </ScrollView>
        ) : null}
      </SafeAreaView>
    </>
  );
}

function InfoRow({ icon, label, value, sub }: {
  icon: React.ReactNode; label: string; value: string; sub?: string;
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
  divider: { height: 1, backgroundColor: colors.border, marginLeft: spacing[5] + 18 + spacing[3] },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing[4], gap: spacing[3] } as ViewStyle,
  infoIcon: { width: 18, marginTop: 2 } as ViewStyle,
  infoTexts: { flex: 1 } as ViewStyle,
  infoLabel: { fontFamily: typography.bodyFont, fontSize: typography.size.xs, color: colors.inkMuted, marginBottom: 2 },
  infoValue: { fontFamily: typography.bodyBold, fontSize: typography.size.base, color: colors.ink },
  infoSub: { fontFamily: typography.bodyFont, fontSize: typography.size.sm, color: colors.inkMuted, marginTop: 1 },
  notesCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[2],
    ...shadows.sm,
  } as ViewStyle,
  notesLabel: { fontFamily: typography.bodyMedium, fontSize: typography.size.sm, color: colors.inkMuted },
  notesText: { fontFamily: typography.bodyFont, fontSize: typography.size.base, color: colors.ink },
  actionBtn: { marginTop: spacing[2] } as ViewStyle,
  mutedNote: { fontFamily: typography.bodyFont, fontSize: typography.size.sm, color: colors.inkMuted, textAlign: 'center', marginTop: spacing[2] },
});
