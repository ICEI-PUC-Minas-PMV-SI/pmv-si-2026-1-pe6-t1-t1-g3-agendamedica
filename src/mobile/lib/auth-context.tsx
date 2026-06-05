import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as api from './api';
import type { User } from './types';

// SecureStore não funciona no browser — usa localStorage como fallback
const storage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    return SecureStore.setItemAsync(key, value);
  },
  async del(key: string): Promise<void> {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
    return SecureStore.deleteItemAsync(key);
  },
};


async function registerForPushNotifications() {
  if (Platform.OS === 'web') return;
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
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
      const token = await storage.get(TOKEN_KEY);
      const userJson = await storage.get(USER_KEY);
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
    await storage.set(TOKEN_KEY, token);
    await storage.set(USER_KEY, JSON.stringify(user));
    api.setToken(token);
    setState({ user, token, isLoading: false });
    registerForPushNotifications();
  }

  async function register(name: string, email: string, cpf: string, password: string) {
    const { token, user } = await api.register(name, email, cpf, password);
    await storage.set(TOKEN_KEY, token);
    await storage.set(USER_KEY, JSON.stringify(user));
    api.setToken(token);
    setState({ user, token, isLoading: false });
    registerForPushNotifications();
  }

  async function logout() {
    await storage.del(TOKEN_KEY);
    await storage.del(USER_KEY);
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
