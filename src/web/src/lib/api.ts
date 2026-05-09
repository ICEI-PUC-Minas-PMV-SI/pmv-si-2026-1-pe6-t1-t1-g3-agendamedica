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
        const message = body?.message ?? `${method} ${path} → ${res.status}`;
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

export async function register(name: string, email: string, password: string): Promise<User> {
    const data = await req<{ token: string; user: User }>("POST", "/auth/register", {
        name,
        email,
        password,
    });
    setToken(data.token);
    data.user.initials = makeInitials(data.user.name);
    return data.user;
}

// ── Doctors ───────────────────────────────────────────────────
export function fetchDoctors(): Promise<Doctor[]> {
    return req("GET", "/doctors/");
}

// ── Appointments ──────────────────────────────────────────────
export function fetchAppointments(): Promise<Appointment[]> {
    return req("GET", "/appointments/");
}

export interface CreateAppointmentPayload {
    patientId: string;
    doctorId: string;
    date: string;
    notes?: string;
}

export function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
    return req("POST", "/appointments/createAppointment", payload);
}

export function cancelAppointment(appointmentId: string): Promise<Appointment> {
    return req("POST", "/appointments/cancelAppointment", { appointmentId });
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
