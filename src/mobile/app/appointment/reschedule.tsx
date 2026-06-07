import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Platform, ViewStyle } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchAppointmentById, rescheduleAppointment } from '@/lib/api';
import { colors, spacing, radius, typography, shadows } from '@/lib/tokens';
import { fmtDateLong, fmtTime } from '@/lib/utils';
import { LoadingState } from '@/components/ui/LoadingState';
import { Button } from '@/components/ui/Button';
import { MonthCalendar } from '@/components/ui/MonthCalendar';
import type { Appointment } from '@/lib/types';

function showAlert(title: string, msg: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
  else Alert.alert(title, msg);
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function generateSlots(dateStr: string): string[] {
  const slots: string[] = [];
  for (let h = 8; h < 18; h++) {
    for (const m of [0, 30]) {
      slots.push(`${dateStr}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`);
    }
  }
  return slots;
}

export default function RescheduleScreen() {
  const rawId = useLocalSearchParams<{ id?: string }>().id;
  const id = typeof rawId === 'string' ? rawId : undefined;
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      // id ausente ou inválido → volta para a tela anterior
      router.back();
      return;
    }
    fetchAppointmentById(id)
      .then(a => { setAppointment(a); setNotes(a.notes ?? ''); })
      .catch(() => router.back())
      .finally(() => setLoading(false));
  }, [id, router]);

  const slots = selectedDate ? generateSlots(selectedDate) : [];

  async function handleSubmit() {
    if (!appointment || !selectedSlot) return;
    setSubmitting(true);
    try {
      await rescheduleAppointment(appointment.id, new Date(selectedSlot).toISOString(), notes || undefined);
      if (Platform.OS === 'web') { window.alert('Consulta remarcada com sucesso!'); router.back(); }
      else Alert.alert('Sucesso', 'Consulta remarcada!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: unknown) {
      showAlert('Erro', err instanceof Error ? err.message : 'Não foi possível remarcar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Remarcar consulta', headerBackTitle: 'Voltar' }} />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        {loading ? <LoadingState rows={4} /> : appointment ? (
          <>
            <View style={styles.currentCard}>
              <Text style={styles.currentLabel}>Data atual</Text>
              <Text style={styles.currentValue}>{fmtDateLong(appointment.date)} às {fmtTime(appointment.date)}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
              <Text style={styles.sectionLabel}>Nova data</Text>
              <MonthCalendar selectedDate={selectedDate} minDate={todayStr()}
                onSelectDate={d => { setSelectedDate(d); setSelectedSlot(null); }} />

              {selectedDate && (
                <>
                  <Text style={[styles.sectionLabel, { marginTop: spacing[5] }]}>Novo horário</Text>
                  <View style={styles.slotsGrid}>
                    {slots.map(slot => {
                      const active = selectedSlot === slot;
                      return (
                        <TouchableOpacity key={slot} style={[styles.slot, active && styles.slotActive]}
                          onPress={() => setSelectedSlot(slot)}>
                          <Text style={[styles.slotText, active && styles.slotTextActive]}>
                            {slot.slice(11, 16)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}

              <Text style={[styles.sectionLabel, { marginTop: spacing[5] }]}>Observações (opcional)</Text>
              <TextInput value={notes} onChangeText={setNotes} placeholder="Motivo ou informações..." placeholderTextColor={colors.inkMuted}
                multiline numberOfLines={3} style={styles.notes} textAlignVertical="top" />
            </ScrollView>

            <View style={styles.footer}>
              <Button label="Cancelar" variant="secondary" onPress={() => router.back()} style={{ flex: 1 }} />
              <Button label="Remarcar" onPress={handleSubmit} disabled={!selectedSlot} loading={submitting} style={{ flex: 1 }} />
            </View>
          </>
        ) : null}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  currentCard: { margin: spacing[5], marginBottom: 0, padding: spacing[4], backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadows.sm } as ViewStyle,
  currentLabel: { fontFamily: typography.bodyFont, fontSize: typography.size.xs, color: colors.inkMuted },
  currentValue: { fontFamily: typography.bodyBold, fontSize: typography.size.base, color: colors.ink, marginTop: spacing[1] },
  content: { padding: spacing[5], paddingBottom: spacing[10] } as ViewStyle,
  sectionLabel: { fontFamily: typography.bodyBold, fontSize: typography.size.sm, color: colors.ink2, marginBottom: spacing[3] },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] } as ViewStyle,
  slot: { width: '30%', paddingVertical: spacing[3], alignItems: 'center', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface } as ViewStyle,
  slotActive: { backgroundColor: colors.accent, borderColor: colors.accent } as ViewStyle,
  slotText: { fontFamily: typography.bodyMedium, fontSize: typography.size.sm, color: colors.ink },
  slotTextActive: { color: '#fff' },
  notes: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing[3], fontFamily: typography.bodyFont, fontSize: typography.size.base, color: colors.ink, backgroundColor: colors.surface, minHeight: 80 },
  footer: { flexDirection: 'row', gap: spacing[3], padding: spacing[5], borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface } as ViewStyle,
});
