import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ViewStyle,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { fetchAppointments } from '@/lib/api';
import { colors, spacing, radius, typography, shadows } from '@/lib/tokens';
import { greeting } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { AppointmentRow } from '@/components/AppointmentRow';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { CalendarIcon, PlusIcon, ClockIcon } from '@/components/ui/Icon';
import type { Appointment } from '@/lib/types';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load(silent = false) {
    if (!user) return;
    if (!silent) setLoading(true);
    try {
      const all = await fetchAppointments(user.id);
      const now = new Date();
      const upcoming = all
        .filter(
          (a) =>
            new Date(a.date) >= now &&
            (a.status === 'PENDING' || a.status === 'CONFIRMED' || a.status === 'RESCHEDULED'),
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
      setAppointments(upcoming);
    } catch {
      // ignore on home
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [user])
  );

  function onRefresh() {
    setRefreshing(true);
    load(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.name}>{user?.name.split(' ')[0]}</Text>
          </View>
          <Avatar name={user?.name ?? ''} size="md" />
        </View>

        {/* Hero card */}
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>Sua saúde em dia</Text>
          <Text style={styles.heroTitle}>
            Agende sua próxima{'\n'}
            <Text style={styles.heroAccent}>consulta</Text>
          </Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => router.push('/appointment/new' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.heroBtnText}>Agendar agora</Text>
          </TouchableOpacity>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <QuickAction
            label="Nova consulta"
            sub="Agendar"
            icon={<PlusIcon color={colors.accent} size={20} />}
            onPress={() => router.push('/appointment/new' as any)}
          />
          <QuickAction
            label="Minhas consultas"
            sub="Ver todas"
            icon={<CalendarIcon color={colors.accent} size={20} />}
            onPress={() => router.push('/(tabs)/appointments' as any)}
          />
          <QuickAction
            label="Histórico"
            sub="Anteriores"
            icon={<ClockIcon color={colors.accent} size={20} />}
            onPress={() => router.push('/(tabs)/appointments' as any)}
          />
        </View>

        {/* Upcoming appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas consultas</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/appointments' as any)}>
              <Text style={styles.sectionLink}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <LoadingState rows={2} />
          ) : appointments.length === 0 ? (
            <EmptyState
              title="Sem consultas"
              body="Você não tem consultas agendadas. Que tal agendar uma?"
              actionLabel="Agendar consulta"
              onAction={() => router.push('/appointment/new' as any)}
            />
          ) : (
            <View style={styles.list}>
              {appointments.map((a) => (
                <AppointmentRow key={a.id} appointment={a} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  label,
  sub,
  icon,
  onPress,
}: {
  label: string;
  sub: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.qa} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.qaIcon}>{icon}</View>
      <Text style={styles.qaLabel}>{label}</Text>
      <Text style={styles.qaSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[5],
  } as ViewStyle,
  greeting: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
  name: {
    fontFamily: typography.displayFont,
    fontSize: typography.size['2xl'],
    color: colors.ink,
  },

  hero: {
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    padding: spacing[6],
    marginBottom: spacing[5],
    ...shadows.md,
  } as ViewStyle,
  heroEyebrow: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.xs,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  heroTitle: {
    fontFamily: typography.displayFont,
    fontSize: typography.size['2xl'],
    color: '#fff',
    marginBottom: spacing[5],
    lineHeight: typography.size['2xl'] * 1.2,
  },
  heroAccent: {
    fontStyle: 'italic',
  },
  heroBtn: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    alignSelf: 'flex-start',
  } as ViewStyle,
  heroBtnText: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.sm,
    color: colors.accent,
  },

  quickActions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[6],
  } as ViewStyle,
  qa: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    alignItems: 'center',
    gap: spacing[2],
    ...shadows.sm,
  } as ViewStyle,
  qaIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  qaLabel: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.xs,
    color: colors.ink,
    textAlign: 'center',
  },
  qaSub: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
  },

  section: { marginBottom: spacing[6] },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  } as ViewStyle,
  sectionTitle: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.md,
    color: colors.ink,
  },
  sectionLink: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.accent,
  },
  list: { gap: spacing[3] } as ViewStyle,
});
