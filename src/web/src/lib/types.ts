export type AppStatus = "loaded" | "loading" | "empty" | "error";
export type Accent = "teal" | "coral" | "indigo" | "forest";
export type Density = "compact" | "comfortable" | "spacious";
export type Theme = "light" | "dark";
export type View = "home" | "schedule" | "appointments" | "history" | "profile" | "notifications";
// Atualizado para incluir o estado de autenticação profissional
export type Auth = "patient" | "professional" | "unauth";
export type AuthView = "landing" | "login" | "register";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "RESCHEDULED";
export type UserRole = "PATIENT" | "DOCTOR" | "RECEPTIONIST";

export interface AppState {
    theme: Theme;
    auth: Auth;
    authView: AuthView;
    view: View;
    mode: "patient" | "professional"; // Controle de visão (Switcher)
}

interface BaseUser {
    id: string;
    name: string;
    email: string;
    initials: string;
    role: UserRole;
}

export interface PatientUser extends BaseUser {
    role: "PATIENT";
    cpf: string;
}

export interface ReceptionistUser extends BaseUser {
    role: "RECEPTIONIST";
    unitId?: string;
}

export type User = PatientUser | DoctorUser | ReceptionistUser;

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    clinic: string;
}

export interface Appointment {
    id: string;
    date: string;
    status: AppointmentStatus;
    doctor: string;
    specialty: string;
    clinic: string;
    mode: "presencial" | "tele";
    isToday: boolean;
    patientName?: string; // Útil para a visão profissional
}

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
    appointmentId: string | null;
}
