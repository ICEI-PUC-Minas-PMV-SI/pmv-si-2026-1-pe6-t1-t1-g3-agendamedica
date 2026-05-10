export type AppStatus = "loaded" | "loading" | "empty" | "error";
export type Accent = "teal" | "coral" | "indigo" | "forest";
export type Density = "compact" | "comfortable" | "spacious";
export type Theme = "light" | "dark";
export type View = "home" | "schedule" | "appointments" | "history" | "profile" | "notifications";
export type Auth = "patient" | "unauth";
export type AuthView = "landing" | "login" | "register";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "RESCHEDULED";

export interface AppState {
    theme: Theme;
    auth: Auth;
    authView: AuthView;
    view: View;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    initials: string;
}

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
    patientId: string;
    patientName?: string;
    doctorId: string;
    notes?: string | null;
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
