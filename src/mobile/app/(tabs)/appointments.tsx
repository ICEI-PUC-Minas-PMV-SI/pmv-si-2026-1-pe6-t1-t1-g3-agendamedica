import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { fetchAppointments } from '@/lib/api';
import { colors, spacing, radius, typography } from '@/lib/tokens';
import { AppointmentRow } from '@/components/AppointmentRow';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PlusIcon } from '@/components/ui/Icon';
import type { Appointment } from '@/lib/types';

type Filter = 'upcoming' | 'past' | 'cancelled';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'upcoming', label: 'Próximas' },
  { key: 'past', label: 'Realizadas' },
  { key: 'cancelled', label: 'Canceladas' },
];

export default function AppointmentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [all, setAll] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load(silent = false) {
    if (!user) return;
    if (!silent) setLoading(true);
    try {
      const data = await fetchAppointments(user.id);
      setAll(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, [user]);

  const filtered = useMemo(() => {
    const now = new Date();
    if (filter === 'upcoming') {
      return all
        .filter(
          (a) =>
            new Date(a.date) >= now &&
            (a.status === 'PENDING' || a.status === 'CONFIRMED' || a.status === 'RESCHEDULED'),
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    if (filter === 'cancelled') {
      return all
        .filter((a) => a.status === 'CANCELLED')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    // past
    return all
      .filter(
        (a) =>
          new Date(a.date) < now && a.status !== 'CANCELLED',
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [all, filter]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Consultas</Text>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/appointment/new' as any)}
          activeOpacity={0.8}
        >
          <PlusIcon color="#fff" size={18} />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
          >
            <Text
              style={[
                styles.filterLabel,
                filter === f.key && styles.filterLabelActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <LoadingState rows={4} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <AppointmentRow appointment={item} />}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(true); }}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="Nenhuma consulta"
              body={
                filter === 'upcoming'
                  ? 'Você não tem consultas agendadas.'
                  : filter === 'past'
                  ? 'Nenhuma consulta realizada ainda.'
                  : 'Nenhuma consulta cancelada.'
              }
              actionLabel={filter === 'upcoming' ? 'Agendar consulta' : undefined}
              onAction={
                filter === 'upcoming'
                  ? () => router.push('/appointment/new' as any)
                  : undefined
              }
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
  } as ViewStyle,
  title: {
    fontFamily: typography.displayFont,
    fontSize: typography.size['2xl'],
    color: colors.ink,
  },
  fab: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    gap: spacing[2],
    marginBottom: spacing[4],
  } as ViewStyle,
  filterTab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  } as ViewStyle,
  filterTabActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  } as ViewStyle,
  filterLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
  filterLabelActive: {
    color: colors.accent,
  },
  list: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[10],
  } as ViewStyle,
  sep: { height: spacing[3] },
});
