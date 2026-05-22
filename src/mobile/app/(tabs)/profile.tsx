import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { colors, spacing, radius, typography, shadows } from '@/lib/tokens';
import { Avatar } from '@/components/ui/Avatar';
import { UserIcon, CalendarIcon, BellIcon, ChevronRightIcon } from '@/components/ui/Icon';

const ROLE_LABEL: Record<string, string> = {
  PATIENT: 'Paciente',
  DOCTOR: 'Médico',
  RECEPTIONIST: 'Recepcionista',
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User hero */}
        <View style={styles.hero}>
          <Avatar name={user.name} size="lg" />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{ROLE_LABEL[user.role] ?? user.role}</Text>
          </View>
        </View>

        {/* Info section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Informações da conta</Text>
          <View style={styles.card}>
            <InfoRow icon={<UserIcon color={colors.inkMuted} size={18} />} label="Nome" value={user.name} />
            <View style={styles.divider} />
            <InfoRow icon={<BellIcon color={colors.inkMuted} size={18} />} label="E-mail" value={user.email} />
            <View style={styles.divider} />
            <InfoRow icon={<CalendarIcon color={colors.inkMuted} size={18} />} label="Perfil" value={ROLE_LABEL[user.role] ?? user.role} />
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Aplicativo</Text>
          <View style={styles.card}>
            <MenuItem label="Sobre o MedHub" onPress={() => {
              Alert.alert('MedHub', 'Sistema de agendamento médico v1.0.0\n\nDesenvolvido como projeto acadêmico — PUC Minas 2026.');
            }} />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.75}
        >
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoTexts}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function MenuItem({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRightIcon color={colors.inkMuted} size={18} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] },

  hero: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    gap: spacing[2],
  } as ViewStyle,
  name: {
    fontFamily: typography.displayFont,
    fontSize: typography.size['2xl'],
    color: colors.ink,
    marginTop: spacing[2],
  },
  email: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.base,
    color: colors.inkMuted,
  },
  roleBadge: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  } as ViewStyle,
  roleText: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.xs,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  section: { marginBottom: spacing[5] } as ViewStyle,
  sectionLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[3],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  } as ViewStyle,
  divider: { height: 1, backgroundColor: colors.border } as ViewStyle,

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  } as ViewStyle,
  infoIcon: { width: 18 } as ViewStyle,
  infoTexts: { flex: 1 } as ViewStyle,
  infoLabel: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.base,
    color: colors.ink,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
  } as ViewStyle,
  menuLabel: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.base,
    color: colors.ink,
  },

  logoutBtn: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: spacing[4],
    alignItems: 'center',
    backgroundColor: colors.dangerSoft,
  } as ViewStyle,
  logoutText: {
    fontFamily: typography.bodyBold,
    fontSize: typography.size.base,
    color: colors.danger,
  },
});
