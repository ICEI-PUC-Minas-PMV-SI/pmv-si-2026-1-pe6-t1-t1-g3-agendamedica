import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ViewStyle,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { fetchDoctors, createAppointment } from '@/lib/api';
import { colors, spacing, radius, typography, shadows } from '@/lib/tokens';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { SearchIcon, CheckIcon } from '@/components/ui/Icon';
import type { Doctor } from '@/lib/types';

type Step = 'doctor' | 'datetime' | 'confirm';

// Generate time slots for a given date (08:00–18:00, every 30 min)
function generateSlots(dateStr: string): string[] {
  const slots: string[] = [];
  for (let h = 8; h < 18; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${dateStr}T${hh}:${mm}:00`);
    }
  }
  return slots;
}

// Generate next 14 days as YYYY-MM-DD
function nextDays(n = 14): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function fmtDayLabel(dateStr: string): { weekday: string; day: string; month: string } {
  const d = new Date(`${dateStr}T12:00:00`);
  return {
    weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
  };
}

export default function NewAppointmentScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>('doctor');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .catch(() => {})
      .finally(() => setLoadingDoctors(false));
  }, []);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()),
  );

  const days = nextDays(14);
  const slots = selectedDate ? generateSlots(selectedDate) : [];

  async function handleConfirm() {
    if (!user || !selectedDoctor || !selectedSlot) return;
    setSubmitting(true);
    try {
      const appointment = await createAppointment(
        user.id,
        selectedDoctor.id,
        new Date(selectedSlot).toISOString(),
        notes || undefined,
      );
      Alert.alert('Consulta agendada!', 'Sua consulta foi agendada com sucesso.', [
        {
          text: 'Ver detalhes',
          onPress: () => router.replace(`/appointment/${appointment.id}` as any),
        },
      ]);
    } catch (err: unknown) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível agendar.');
    } finally {
      setSubmitting(false);
    }
  }

  const stepTitle =
    step === 'doctor'
      ? 'Escolha o médico'
      : step === 'datetime'
      ? 'Data e horário'
      : 'Confirmar consulta';

  return (
    <>
      <Stack.Screen options={{ title: stepTitle }} />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        {/* Progress indicator */}
        <View style={styles.progress}>
          {(['doctor', 'datetime', 'confirm'] as Step[]).map((s, i) => (
            <View
              key={s}
              style={[
                styles.progressStep,
                step === s && styles.progressStepActive,
                (step === 'datetime' && i === 0) ||
                (step === 'confirm' && i <= 1)
                  ? styles.progressStepDone
                  : null,
              ]}
            />
          ))}
        </View>

        {/* Step: Doctor selection */}
        {step === 'doctor' && (
          <View style={styles.stepContainer}>
            {/* Search */}
            <View style={styles.searchBar}>
              <SearchIcon color={colors.inkMuted} size={18} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar por nome ou especialidade"
                placeholderTextColor={colors.inkMuted}
                style={styles.searchInput}
              />
            </View>

            {loadingDoctors ? (
              <LoadingState rows={4} />
            ) : (
              <FlatList
                data={filteredDoctors}
                keyExtractor={(d) => d.id}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.doctorCard,
                      selectedDoctor?.id === item.id && styles.doctorCardSelected,
                    ]}
                    onPress={() => setSelectedDoctor(item)}
                    activeOpacity={0.75}
                  >
                    <Avatar name={item.name} size="md" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.doctorName}>{item.name}</Text>
                      <Text style={styles.doctorSpec}>{item.specialty}</Text>
                      {item.clinic ? (
                        <Text style={styles.doctorClinic}>{item.clinic}</Text>
                      ) : null}
                    </View>
                    {selectedDoctor?.id === item.id && (
                      <CheckIcon color={colors.accent} size={20} />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}

            <View style={styles.footer}>
              <Button
                label="Próximo"
                onPress={() => setStep('datetime')}
                disabled={!selectedDoctor}
              />
            </View>
          </View>
        )}

        {/* Step: Date & time */}
        {step === 'datetime' && (
          <View style={styles.stepContainer}>
            <ScrollView contentContainerStyle={styles.dateTimeContent}>
              <Text style={styles.sectionLabel}>Selecione a data</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
                <View style={styles.daysRow}>
                  {days.map((d) => {
                    const lbl = fmtDayLabel(d);
                    const active = selectedDate === d;
                    return (
                      <TouchableOpacity
                        key={d}
                        style={[styles.dayChip, active && styles.dayChipActive]}
                        onPress={() => { setSelectedDate(d); setSelectedSlot(null); }}
                      >
                        <Text style={[styles.dayWeekday, active && styles.textWhite]}>
                          {lbl.weekday}
                        </Text>
                        <Text style={[styles.dayDay, active && styles.textWhite]}>
                          {lbl.day}
                        </Text>
                        <Text style={[styles.dayMonth, active && styles.textWhite]}>
                          {lbl.month}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {selectedDate && (
                <>
                  <Text style={[styles.sectionLabel, { marginTop: spacing[5] }]}>
                    Selecione o horário
                  </Text>
                  <View style={styles.slotsGrid}>
                    {slots.map((slot) => {
                      const time = slot.slice(11, 16);
                      const active = selectedSlot === slot;
                      return (
                        <TouchableOpacity
                          key={slot}
                          style={[styles.slot, active && styles.slotActive]}
                          onPress={() => setSelectedSlot(slot)}
                        >
                          <Text style={[styles.slotText, active && styles.textWhite]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <Button
                label="Voltar"
                variant="secondary"
                onPress={() => setStep('doctor')}
                style={{ flex: 1 }}
              />
              <Button
                label="Próximo"
                onPress={() => setStep('confirm')}
                disabled={!selectedSlot}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && selectedDoctor && selectedSlot && (
          <ScrollView contentContainerStyle={styles.confirmContent}>
            <Text style={styles.confirmTitle}>Resumo do agendamento</Text>

            <View style={styles.confirmCard}>
              <ConfirmRow label="Médico" value={selectedDoctor.name} />
              <ConfirmRow label="Especialidade" value={selectedDoctor.specialty} />
              {selectedDoctor.clinic && (
                <ConfirmRow label="Clínica" value={selectedDoctor.clinic} />
              )}
              <ConfirmRow
                label="Data"
                value={new Date(`${selectedDate}T12:00:00`).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              />
              <ConfirmRow label="Horário" value={selectedSlot.slice(11, 16)} />
            </View>

            <Text style={styles.notesLabel}>Observações (opcional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Descreva o motivo da consulta ou outras informações..."
              placeholderTextColor={colors.inkMuted}
              multiline
              numberOfLines={3}
              style={styles.notesInput}
              textAlignVertical="top"
            />

            <View style={styles.footer}>
              <Button
                label="Voltar"
                variant="secondary"
                onPress={() => setStep('datetime')}
                style={{ flex: 1 }}
              />
              <Button
                label="Confirmar"
                onPress={handleConfirm}
                loading={submitting}
                style={{ flex: 1 }}
              />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.confirmRow}>
      <Text style={styles.confirmLabel}>{label}</Text>
      <Text style={styles.confirmValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  progress: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  } as ViewStyle,
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  } as ViewStyle,
  progressStepActive: { backgroundColor: colors.accent } as ViewStyle,
  progressStepDone: { backgroundColor: colors.accentDark } as ViewStyle,

  stepContainer: { flex: 1 } as ViewStyle,

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing[5],
    marginBottom: spacing[3],
    paddingHorizontal: spacing[3],
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing[2],
  } as ViewStyle,
  searchInput: {
    flex: 1,
    fontFamily: typography.bodyFont,
    fontSize: typography.size.base,
    color: colors.ink,
  },

  listContent: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] } as ViewStyle,
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  } as ViewStyle,
  doctorCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  } as ViewStyle,
  doctorName: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.base,
    color: colors.ink,
  },
  doctorSpec: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
  doctorClinic: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    marginTop: 2,
  },

  dateTimeContent: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] } as ViewStyle,
  sectionLabel: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.sm,
    color: colors.ink2,
    marginBottom: spacing[3],
  },
  daysScroll: { marginHorizontal: -spacing[5] },
  daysRow: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[5],
  } as ViewStyle,
  dayChip: {
    width: 56,
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  } as ViewStyle,
  dayChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  } as ViewStyle,
  dayWeekday: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    textTransform: 'capitalize',
  },
  dayDay: {
    fontFamily: typography.displayFont,
    fontSize: typography.size.xl,
    color: colors.ink,
  },
  dayMonth: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    textTransform: 'capitalize',
  },
  textWhite: { color: '#fff' },

  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  } as ViewStyle,
  slot: {
    width: '30%',
    paddingVertical: spacing[3],
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  } as ViewStyle,
  slotActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  } as ViewStyle,
  slotText: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.ink,
  },

  confirmContent: {
    padding: spacing[5],
    paddingBottom: spacing[10],
  } as ViewStyle,
  confirmTitle: {
    fontFamily: typography.displayFont,
    fontSize: typography.size.xl,
    color: colors.ink,
    marginBottom: spacing[5],
  },
  confirmCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing[5],
    overflow: 'hidden',
    ...shadows.sm,
  } as ViewStyle,
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,
  confirmLabel: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
  confirmValue: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.ink,
    maxWidth: '60%',
    textAlign: 'right',
  },

  notesLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.ink2,
    marginBottom: spacing[2],
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing[3],
    fontFamily: typography.bodyFont,
    fontSize: typography.size.base,
    color: colors.ink,
    backgroundColor: colors.surface,
    minHeight: 80,
    marginBottom: spacing[6],
  },

  footer: {
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[5],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  } as ViewStyle,
});
