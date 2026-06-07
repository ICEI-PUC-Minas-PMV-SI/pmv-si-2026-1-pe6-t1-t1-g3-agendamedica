import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@/lib/tokens';
import {
  HomeIcon,
  CalendarIcon,
  BellIcon,
  UserIcon,
} from '@/components/ui/Icon';
import { DotBadge } from '@/components/ui/Badge';
import { useNotificationCount } from '@/lib/notification-count-context';

export default function TabsLayout() {
  const { count } = useNotificationCount();
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + bottom,
          paddingBottom: 8 + bottom,
        },
        tabBarLabelStyle: {
          fontFamily: typography.bodyMedium,
          fontSize: typography.size.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Consultas',
          tabBarIcon: ({ color, size }) => <CalendarIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <View>
              <BellIcon color={color} size={size} />
              <DotBadge count={count} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
