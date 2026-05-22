import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as api from './api';
import type { User } from './types';

async function registerForPushNotifications() {
  if (Platform.OS === 'web') return;
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await api.registerPushToken(token);
  } catch {
    // Non-critical — push registration failure should not block login
  }
}

const TOKEN_KEY = 'medhub_token';
const USER_KEY = 'medhub_user';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, cpf: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    async function restore() {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      if (token && userJson) {
        api.setToken(token);
        setState({ user: JSON.parse(userJson), token, isLoading: false });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    }
    restore();
  }, []);

  async function login(email: string, password: string) {
    const { token, user } = await api.login(email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    api.setToken(token);
    setState({ user, token, isLoading: false });
    registerForPushNotifications();
  }

  async function register(name: string, email: string, cpf: string, password: string) {
    const { token, user } = await api.register(name, email, cpf, password);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    api.setToken(token);
    setState({ user, token, isLoading: false });
    registerForPushNotifications();
  }

  async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    api.setToken(null);
    setState({ user: null, token: null, isLoading: false });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
