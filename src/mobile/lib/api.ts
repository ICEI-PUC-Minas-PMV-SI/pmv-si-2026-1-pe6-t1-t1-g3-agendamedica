import { Platform } from 'react-native';
import type {
  AuthResponse,
  Appointment,
  Doctor,
  Notification,
  PaginatedNotifications,
  User,
} from './types';

// Android emulator needs host IP; iOS simulator uses localhost
const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
}

function authHeaders(): Record<string, string> {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Auth
export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  name: string,
  email: string,
  cpf: string,
  password: string,
): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, cpf, password, role: 'PATIENT' }),
  });
}

// Appointments
export async function fetchAppointments(userId: string): Promise<Appointment[]> {
  return request<Appointment[]>(`/appointments/listAppointments?userId=${userId}`);
}

export async function createAppointment(
  patientId: string,
  doctorId: string,
  date: string,
  notes?: string,
): Promise<Appointment> {
  return request<Appointment>('/appointments/createAppointment', {
    method: 'POST',
    body: JSON.stringify({ patientId, doctorId, date, notes }),
  });
}

export async function cancelAppointment(appointmentId: string): Promise<Appointment> {
  return request<Appointment>('/appointments/cancelAppointment', {
    method: 'POST',
    body: JSON.stringify({ appointmentId }),
  });
}

export async function confirmAppointment(appointmentId: string): Promise<Appointment> {
  return request<Appointment>('/appointments/confirmAppointment', {
    method: 'PATCH',
    body: JSON.stringify({ appointmentId }),
  });
}

export async function rescheduleAppointment(
  appointmentId: string,
  date: string,
  notes?: string,
): Promise<Appointment> {
  return request<Appointment>(`/appointments/${appointmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ date, notes }),
  });
}

export async function fetchAppointmentById(id: string): Promise<Appointment> {
  return request<Appointment>(`/appointments/${id}`);
}

// Doctors
export async function fetchDoctors(): Promise<Doctor[]> {
  return request<Doctor[]>('/doctors');
}

// Patients (para recepcionista escolher ao agendar)
export async function fetchPatients(): Promise<User[]> {
  return request<User[]>('/patients/');
}


// Notifications
export async function fetchNotifications(
  page = 1,
  limit = 20,
  unreadOnly = false,
): Promise<PaginatedNotifications> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(unreadOnly ? { unreadOnly: 'true' } : {}),
  });
  const result = await request<PaginatedNotifications | Notification[]>(
    `/notifications?${params}`,
  );
  // Mock server returns a plain array; real backend returns { data, pagination }
  if (Array.isArray(result)) {
    return {
      data: result,
      pagination: { page: 1, limit: result.length, total: result.length, totalPages: 1 },
    };
  }
  return result;
}

export async function fetchNotificationUnreadCount(): Promise<number> {
  const data = await request<{ count: number }>('/notifications/unread-count');
  return data.count;
}

export async function markNotificationRead(id: string): Promise<Notification> {
  return request<Notification>(`/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markNotificationUnread(id: string): Promise<Notification> {
  return request<Notification>(`/notifications/${id}/unread`, { method: 'PATCH' });
}

export async function markAllNotificationsRead(): Promise<void> {
  return request<void>('/notifications/read-all', { method: 'PATCH' });
}

// Push token registration
export async function registerPushToken(expoPushToken: string): Promise<User> {
  return request<User>('/users/me/push-token', {
    method: 'PATCH',
    body: JSON.stringify({ expoPushToken }),
  });
}
