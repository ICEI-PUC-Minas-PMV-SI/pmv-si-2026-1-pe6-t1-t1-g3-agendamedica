import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchNotifications,
  markNotificationRead,
  markNotificationUnread,
  markAllNotificationsRead,
} from '@/lib/api';
import { useNotificationCount } from '@/lib/notification-count-context';
import { colors, spacing, radius, typography, shadows } from '@/lib/tokens';
import { relTime } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { BellIcon, CalendarIcon, CheckIcon, XIcon, ClockIcon } from '@/components/ui/Icon';
import type { Notification } from '@/lib/types';

const TYPE_ICON: Record<string, { Icon: React.FC<{ color?: string; size?: number }>; color: string }> = {
  APPOINTMENT_CREATED: { Icon: CalendarIcon, color: colors.accent },
  APPOINTMENT_CONFIRMED: { Icon: CheckIcon, color: '#16a34a' },
  APPOINTMENT_CANCELLED: { Icon: XIcon, color: '#dc2626' },
  APPOINTMENT_RESCHEDULED: { Icon: ClockIcon, color: '#d97706' },
};

export default function NotificationsScreen() {
  const { refresh: refreshCount } = useNotificationCount();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await fetchNotifications(1, 50);
      setNotifications(result.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleMarkRead(id: string) {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      refreshCount();
    } catch {
      // ignore
    }
  }

  async function handleMarkUnread(id: string) {
    try {
      await markNotificationUnread(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
      );
      refreshCount();
    } catch {
      // ignore
    }
  }

  function handleTapNotification(id: string, read: boolean) {
    if (!read) {
      handleMarkRead(id);
      return;
    }
    Alert.alert('Notificação', undefined, [
      { text: 'Marcar como não lida', onPress: () => handleMarkUnread(id) },
      { text: 'Fechar', style: 'cancel' },
    ]);
  }

  async function handleMarkAllRead() {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      refreshCount();
    } catch {
      // ignore
    } finally {
      setMarkingAll(false);
    }
  }

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notificações</Text>
        {hasUnread && (
          <TouchableOpacity
            onPress={handleMarkAllRead}
            disabled={markingAll}
            style={styles.markAllBtn}
          >
            <CheckIcon color={colors.accent} size={16} />
            <Text style={styles.markAllText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.list}
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
              title="Sem notificações"
              body="Você será notificado quando houver atualizações nas suas consultas."
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleTapNotification(item.id, item.read)}
              activeOpacity={0.75}
              style={[styles.card, !item.read && styles.cardUnread]}
            >
              {/* Unread dot */}
              {!item.read && <View style={styles.dot} />}

              <View style={styles.iconBadge}>
                {(() => {
                  const entry = TYPE_ICON[item.type];
                  if (!entry) return <BellIcon color={colors.inkMuted} size={18} />;
                  return <entry.Icon color={entry.color} size={18} />;
                })()}
              </View>

              <View style={styles.body}>
                <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
                  {item.title}
                </Text>
                <Text style={styles.message} numberOfLines={2}>
                  {item.message}
                </Text>
                <Text style={styles.time}>{relTime(item.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          )}
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
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  } as ViewStyle,
  markAllText: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.xs,
    color: colors.accent,
  },

  list: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[10],
  } as ViewStyle,
  sep: { height: spacing[2] },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[3],
    ...shadows.sm,
  } as ViewStyle,
  cardUnread: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  } as ViewStyle,
  dot: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  } as ViewStyle,

  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  body: { flex: 1, gap: 3 } as ViewStyle,
  notifTitle: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.base,
    color: colors.ink,
  },
  notifTitleUnread: {
    fontFamily: typography.bodyBold,
  },
  message: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
    lineHeight: typography.size.sm * 1.4,
  },
  time: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    marginTop: 2,
  },
});
