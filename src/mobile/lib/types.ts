export type UserRole = 'PATIENT' | 'DOCTOR' | 'RECEPTIONIST';

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'RESCHEDULED';

export type NotificationType =
  | 'APPOINTMENT_CREATED'
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_RESCHEDULED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic?: string;
  clinicId?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  doctor?: Doctor;
  patientName?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  appointmentId?: string | null;
  createdAt: string;
}

export interface PaginatedNotifications {
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}
