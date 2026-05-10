import type { Appointment, Doctor, Notification, User } from "./types";

const BASE = "/api";

let _token = "";

export function setToken(t: string) {
    _token = t;
}

function authHeaders(): HeadersInit {
    return _token ? { Authorization: `Bearer ${_token}` } : {};
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.error ?? body?.message ?? `${method} ${path} → ${res.status}`;
        throw new Error(message);
    }
    return res.json() as Promise<T>;
}

function makeInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── Auth ──────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<User> {
    const data = await req<{ token: string; user: User }>("POST", "/auth/login", {
        email,
        password,
    });
    setToken(data.token);
    data.user.initials = makeInitials(data.user.name);
    return data.user;
}

export async function register(
    name: string,
    email: string,
    password: string,
    cpf: string,
    role: "PATIENT" | "DOCTOR" = "PATIENT",
    crm?: string,
    specialty?: string,
): Promise<User> {
    const data = await req<{ token: string; user: User }>("POST", "/auth/register", {
        name,
        email,
        password,
        cpf,
        role,
        ...(crm && { crm }),
        ...(specialty && { specialty }),
    });
    console.log("REGISTER RAW:", JSON.stringify(data));
    setToken(data.token);
    data.user.initials = makeInitials(data.user.name);
    return data.user;
}

// ── Doctors ───────────────────────────────────────────────────
export function fetchDoctors(): Promise<Doctor[]> {
    return req("GET", "/doctors/");
}

export function fetchPatients(): Promise<User[]> {
    return req("GET", "/patients/");
}

// ── Appointments ──────────────────────────────────────────────
export async function fetchAppointments(userId?: string): Promise<Appointment[]> {
    const query = userId ? `?userId=${userId}` : "";
    const [appts, docs] = await Promise.all([
        req<any[]>("GET", `/appointments/${query}`),
        fetchDoctors(),
    ]);
    return appts.map((a) => {
        const doc = docs.find((d) => d.id === a.doctorId);
        return {
            ...a,
            doctor: doc ? doc.name : "Médico",
            patientName: a.patientName || "Paciente",
            specialty: doc ? doc.specialty : "Especialidade",
            clinic: doc ? doc.clinic : "Clínica",
            mode: "presencial",
        };
    });
}

export interface CreateAppointmentPayload {
    patientId: string;
    doctorId: string;
    date: string;
    notes?: string;
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
    const a = await req<any>("POST", "/appointments/createAppointment", payload);
    const docs = await fetchDoctors();
    const doc = docs.find((d) => d.id === a.doctorId);
    return {
        ...a,
        doctor: doc ? doc.name : "Médico",
        specialty: doc ? doc.specialty : "Especialidade",
        clinic: doc ? doc.clinic : "Clínica",
        mode: "presencial",
    };
}

export async function cancelAppointment(appointmentId: string): Promise<Appointment> {
    const a = await req<any>("POST", "/appointments/cancelAppointment", { appointmentId });
    const docs = await fetchDoctors();
    const doc = docs.find((d) => d.id === a.doctorId);
    return {
        ...a,
        doctor: doc ? doc.name : "Médico",
        patientName: a.patientName || "Paciente",
        specialty: doc ? doc.specialty : "Especialidade",
        clinic: doc ? doc.clinic : "Clínica",
        mode: "presencial",
    };
}

export async function confirmAppointment(appointmentId: string): Promise<Appointment> {
    const a = await req<any>("PATCH", "/appointments/confirmAppointment", { appointmentId });
    const docs = await fetchDoctors();
    const doc = docs.find((d) => d.id === a.doctorId);
    return {
        ...a,
        doctor: doc ? doc.name : "Médico",
        patientName: a.patientName || "Paciente",
        specialty: doc ? doc.specialty : "Especialidade",
        clinic: doc ? doc.clinic : "Clínica",
        mode: "presencial",
    };
}

export interface RescheduleAppointmentPayload {
    appointmentId: string;
    date: string;
    notes?: string;
}

export async function rescheduleAppointment(payload: RescheduleAppointmentPayload): Promise<Appointment> {
    const a = await req<any>("PATCH", `/appointments/${payload.appointmentId}`, {
        date: payload.date,
        notes: payload.notes
    });
    const docs = await fetchDoctors();
    const doc = docs.find((d) => d.id === a.doctorId);
    return {
        ...a,
        doctor: doc ? doc.name : "Médico",
        patientName: a.patientName || "Paciente",
        specialty: doc ? doc.specialty : "Especialidade",
        clinic: doc ? doc.clinic : "Clínica",
        mode: "presencial",
    };
}

// ── Notifications ─────────────────────────────────────────────
export function fetchNotifications(): Promise<Notification[]> {
    return req("GET", "/notifications/");
}

export function markAllRead(): Promise<void> {
    return req("PATCH", "/notifications/read-all");
}

export function markRead(id: string): Promise<void> {
    return req("PATCH", `/notifications/${id}/read`);
}

export function markUnread(id: string): Promise<void> {
    return req("PATCH", `/notifications/${id}/unread`);
}
