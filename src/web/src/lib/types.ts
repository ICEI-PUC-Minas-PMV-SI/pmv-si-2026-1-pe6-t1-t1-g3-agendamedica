export type AppStatus = "loaded" | "loading" | "empty" | "error";
export type Accent = "teal" | "coral" | "indigo" | "forest";
export type Density = "compact" | "comfortable" | "spacious";
export type Theme = "light" | "dark";
export type View = "home" | "schedule" | "appointments" | "history" | "profile" | "notifications";
export type Auth = "patient" | "professional" | "unauth";
export type AuthView = "landing" | "login" | "register";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "RESCHEDULED";
export type UserRole = "PATIENT" | "DOCTOR" | "RECEPTIONIST";

export interface AppState {
    theme: Theme;
    auth: Auth;
    authView: AuthView;
    view: View;
    mode: "patient" | "professional";
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    initials?: string;
    crm?: string;
    specialty?: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    clinic: string;
    crm?: string;
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
