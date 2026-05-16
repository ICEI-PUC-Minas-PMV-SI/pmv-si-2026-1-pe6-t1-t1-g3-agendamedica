import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { fetchNotificationUnreadCount } from './api';
import { useAuth } from './auth-context';

interface NotificationCountContextValue {
  count: number;
  refresh: () => void;
}

const NotificationCountContext = createContext<NotificationCountContextValue>({
  count: 0,
  refresh: () => {},
});

export function NotificationCountProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const n = await fetchNotificationUnreadCount();
      setCount(n);
    } catch {
      // silently ignore network errors for badge count
    }
  }, [user]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <NotificationCountContext.Provider value={{ count, refresh }}>
      {children}
    </NotificationCountContext.Provider>
  );
}

export function useNotificationCount() {
  return useContext(NotificationCountContext);
}
