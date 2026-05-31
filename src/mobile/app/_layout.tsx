import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import {
  useFonts,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_700Bold,
} from '@expo-google-fonts/inter-tight';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { NotificationCountProvider } from '@/lib/notification-count-context';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      if (!user) return;
      const appointmentId = response.notification.request.content.data?.appointmentId;
      if (appointmentId && typeof appointmentId === 'string') {
        router.push(`/appointment/${appointmentId}`);
      } else {
        router.push('/(tabs)/notifications');
      }
    });
    return () => sub.remove();
  }, [user]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_700Bold,
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <NotificationCountProvider>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen
            name="appointment/new"
            options={{
              headerShown: true,
              title: 'Nova Consulta',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="appointment/[id]"
            options={{ headerShown: true, title: 'Consulta', headerBackTitle: 'Voltar' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </AuthGuard>
      </NotificationCountProvider>
    </AuthProvider>
  );
}
