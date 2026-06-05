import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ViewStyle,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { fetchDoctors, fetchPatients, createAppointment } from '@/lib/api';
import { colors, spacing, radius, typography } from '@/lib/tokens';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { MonthCalendar } from '@/components/ui/MonthCalendar';
import { SearchIcon, CheckIcon } from '@/components/ui/Icon';
import type { Doctor, User } from '@/lib/types';

function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

type Step = 'patient' | 'doctor' | 'datetime' | 'confirm';

// Generates time slots for a given date (08:00–18:00, every 30 min)
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

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function NewAppointmentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const isReceptionist = user?.role === 'RECEPTIONIST';

  const [step, setStep] = useState<Step>(isReceptionist ? 'patient' : 'doctor');
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(true);
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .catch(() => {})
      .finally(() => setLoadingDoctors(false));
      
    if (isReceptionist) {
      fetchPatients()
        .then(setPatients)
        .catch(() => {})
        .finally(() => setLoadingPatients(false));
    }
  }, [isReceptionist]);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()),
  );

  const slots = selectedDate ? generateSlots(selectedDate) : [];

  const effectivePatientId = isReceptionist ? selectedPatient?.id : user?.id;

  async function handleConfirm() {
    if (!effectivePatientId || !selectedDoctor || !selectedSlot) return;
    setSubmitting(true);
    try {
      const appointment = await createAppointment(
        effectivePatientId,
        selectedDoctor.id,
        new Date(selectedSlot).toISOString(),
        notes || undefined,
      );
      if (Platform.OS === 'web') {
        window.alert('Consulta agendada!\n\nSua consulta foi agendada com sucesso.');
        router.replace(`/appointment/${appointment.id}` as any);
      } else {
        Alert.alert('Consulta agendada!', 'Sua consulta foi agendada com sucesso.', [
          {
            text: 'Ver detalhes',
            onPress: () => router.replace(`/appointment/${appointment.id}` as any),
          },
        ]);
      }
    } catch (err: unknown) {
      showAlert('Erro', err instanceof Error ? err.message : 'Não foi possível agendar.');
    } finally {
      setSubmitting(false);
    }
  }

  function renderDoctorItem({ item }: { item: Doctor }) {
    const isSelected = selectedDoctor?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedDoctor(item)}
        activeOpacity={0.7}
      >
        <Avatar name={item.name} src={item.avatarUrl} size="md" />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardSub}>{item.specialty}</Text>
          <Text style={styles.cardMeta}>{item.clinic}</Text>
        </View>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && <CheckIcon size={12} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  }

  function renderPatientItem({ item }: { item: User }) {
    const isSelected = selectedPatient?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedPatient(item)}
        activeOpacity={0.7}
      >
        <Avatar name={item.name} size="md" />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardMeta}>{item.email}</Text>
        </View>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && <CheckIcon size={12} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Nova consulta', headerBackTitle: 'Cancelar' }} />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        {/* Progress header */}
        <View style={styles.progressHeader}>
          {isReceptionist && (
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, step === 'patient' && styles.progressDotActive]} />
              <Text style={[styles.progressText, step === 'patient' && styles.progressTextActive]}>
                Paciente
              </Text>
            </View>
          )}
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, step === 'doctor' && styles.progressDotActive]} />
            <Text style={[styles.progressText, step === 'doctor' && styles.progressTextActive]}>
              Médico
            </Text>
          </View>
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, step === 'datetime' && styles.progressDotActive]} />
            <Text style={[styles.progressText, step === 'datetime' && styles.progressTextActive]}>
              Data
            </Text>
          </View>
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, step === 'confirm' && styles.progressDotActive]} />
            <Text style={[styles.progressText, step === 'confirm' && styles.progressTextActive]}>
              Revisar
            </Text>
          </View>
        </View>

        {/* Step: Patient (Receptionist only) */}
        {step === 'patient' && isReceptionist && (
          <View style={styles.stepContainer}>
            <View style={styles.searchContainer}>
              <SearchIcon color={colors.inkMuted} size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar paciente por nome..."
                placeholderTextColor={colors.inkMuted}
                value={patientSearch}
                onChangeText={setPatientSearch}
              />
            </View>
            {loadingPatients ? (
              <LoadingState />
            ) : (
              <FlatList
                data={filteredPatients}
                keyExtractor={(item) => item.id}
                renderItem={renderPatientItem}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
              />
            )}
            <View style={styles.footer}>
              <Button
                label="Próximo"
                onPress={() => setStep('doctor')}
                disabled={!selectedPatient}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}

        {/* Step: Doctor */}
        {step === 'doctor' && (
          <View style={styles.stepContainer}>
            <View style={styles.searchContainer}>
              <SearchIcon color={colors.inkMuted} size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome ou especialidade..."
                placeholderTextColor={colors.inkMuted}
                value={search}
                onChangeText={setSearch}
              />
            </View>
            {loadingDoctors ? (
              <LoadingState />
            ) : (
              <FlatList
                data={filteredDoctors}
                keyExtractor={(item) => item.id}
                renderItem={renderDoctorItem}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
              />
            )}
            <View style={styles.footer}>
              {isReceptionist && (
                <Button
                  label="Voltar"
                  variant="secondary"
                  onPress={() => setStep('patient')}
                  style={{ flex: 1 }}
                />
              )}
              <Button
                label="Próximo"
                onPress={() => setStep('datetime')}
                disabled={!selectedDoctor}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}

        {/* Step: Date & time */}
        {step === 'datetime' && (
          <View style={styles.stepContainer}>
            <ScrollView contentContainerStyle={styles.dateTimeContent}>
              <Text style={styles.sectionLabel}>Selecione a data</Text>
              
              <MonthCalendar
                selectedDate={selectedDate}
                minDate={todayStr()}
                onSelectDate={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
              />

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
          <View style={styles.stepContainer}>
            <ScrollView contentContainerStyle={styles.confirmContent}>
              <View style={styles.confirmCard}>
                <Text style={styles.confirmTitle}>Resumo da consulta</Text>
                
                {isReceptionist && selectedPatient && (
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>Paciente</Text>
                    <Text style={styles.confirmValue}>{selectedPatient.name}</Text>
                  </View>
                )}

                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Médico</Text>
                  <Text style={styles.confirmValue}>{selectedDoctor.name}</Text>
                </View>
                
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Especialidade</Text>
                  <Text style={styles.confirmValue}>{selectedDoctor.specialty}</Text>
                </View>

                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Local</Text>
                  <Text style={styles.confirmValue}>{selectedDoctor.clinic}</Text>
                </View>
                
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Data</Text>
                  <Text style={styles.confirmValue}>
                    {new Date(selectedSlot).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Horário</Text>
                  <Text style={styles.confirmValue}>{selectedSlot.slice(11, 16)}</Text>
                </View>
              </View>

              <Text style={[styles.sectionLabel, { marginTop: spacing[5] }]}>
                Observações (opcional)
              </Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Ex: Primeira consulta, levar exames..."
                placeholderTextColor={colors.inkMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </ScrollView>

            <View style={styles.footer}>
              <Button
                label="Voltar"
                variant="secondary"
                onPress={() => setStep('datetime')}
                style={{ flex: 1 }}
              />
              <Button
                label="Confirmar agendamento"
                onPress={handleConfirm}
                loading={submitting}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: spacing[4],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing[6],
  } as ViewStyle,
  progressStep: {
    alignItems: 'center',
    gap: spacing[1],
  } as ViewStyle,
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  } as ViewStyle,
  progressDotActive: {
    backgroundColor: colors.accent,
  } as ViewStyle,
  progressText: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
  },
  progressTextActive: {
    color: colors.ink,
    fontFamily: typography.bodyBold,
  },
  stepContainer: { flex: 1 } as ViewStyle,
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing[5],
    marginBottom: spacing[2],
    paddingHorizontal: spacing[3],
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[2],
  } as ViewStyle,
  searchInput: {
    flex: 1,
    fontFamily: typography.bodyFont,
    fontSize: typography.size.base,
    color: colors.ink,
  },
  listContent: {
    padding: spacing[5],
    gap: spacing[3],
  } as ViewStyle,
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[3],
  } as ViewStyle,
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.bgSubtle,
  } as ViewStyle,
  cardInfo: { flex: 1 } as ViewStyle,
  cardName: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.base,
    color: colors.ink,
  },
  cardSub: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
  cardMeta: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    marginTop: spacing[1],
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  radioSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  } as ViewStyle,
  footer: {
    flexDirection: 'row',
    padding: spacing[5],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing[3],
  } as ViewStyle,
  dateTimeContent: {
    padding: spacing[5],
    paddingBottom: spacing[10],
  } as ViewStyle,
  sectionLabel: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.sm,
    color: colors.ink2,
    marginBottom: spacing[3],
  },
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
  textWhite: { color: '#fff' },
  confirmContent: {
    padding: spacing[5],
    paddingBottom: spacing[10],
  } as ViewStyle,
  confirmCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[3],
  } as ViewStyle,
  confirmTitle: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.base,
    color: colors.ink,
    marginBottom: spacing[2],
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  notesInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing[3],
    minHeight: 80,
    fontFamily: typography.bodyFont,
    fontSize: typography.size.base,
    color: colors.ink,
  },
});
