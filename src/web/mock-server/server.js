import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = (file) =>
    JSON.parse(readFileSync(join(__dirname, "data", file), "utf-8"));

const app = express();
app.set('etag', false);
app.use(cors());
app.use(express.json());

// Notificações em memória para suportar mark-as-read na sessão
let notifications = data("notifications.json");
let appointments = data("appointments.json");
const doctors = data("doctors.json");
const users = data("user.json");
let clinicsData = data("clinics.json");

function makeInitials(name) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

// ── Health ──────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Auth ────────────────────────────────────────────────────
app.post("/auth/login", (req, res) => {
    const { email } = req.body;
    let user = users.find(u => u.email === email);
    
    if (!user) user = users[0];

    res.json({ token: "mock-token", user });
});

app.post("/auth/register", (req, res) => {
    const { name, email } = req.body;
    const user = {
        id: `u-${Date.now()}`,
        name: name ?? "Usuário",
        email: email ?? "",
        role: "PATIENT",
        initials: makeInitials(name ?? "U"),
    };
    res.status(201).json({ token: "mock-token", user });
});

// ── Doctors & Patients ─────────────────────────────────────────
app.get("/doctors/", (_req, res) => res.json(doctors));
app.get("/patients/", (_req, res) => res.json(users.filter(u => u.role === "PATIENT")));

// ── Appointments ─────────────────────────────────────────────

const requireAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Acesso negado: Perfil não autenticado." });
    }
    next();
};

function enrichAppointment(a) {
    const patient = users.find(u => u.id === a.patientId);
    const doctor = doctors.find(d => d.id === a.doctorId);
    return {
        ...a,
        patientName: patient ? patient.name : "Paciente",
        doctor: doctor ?? null,
    };
}

function filterByUser(userId) {
    if (!userId) return appointments;
    const user = users.find(u => u.id === userId);
    if (user?.role === "PATIENT") return appointments.filter(a => a.patientId === userId);
    if (user?.role === "DOCTOR") return appointments.filter(a => a.doctorId === userId);
    return appointments;
}

app.get("/appointments/", requireAuth, (req, res) => {
    res.json(filterByUser(req.query.userId).map(enrichAppointment));
});

app.get("/appointments/listAppointments", requireAuth, (req, res) => {
    res.json(filterByUser(req.query.userId).map(enrichAppointment));
});

app.get("/appointments/:id", requireAuth, (req, res) => {
    const appt = appointments.find(a => a.id === req.params.id);
    if (!appt) return res.status(404).json({ error: "Consulta não encontrada" });
    res.json(enrichAppointment(appt));
});

// --- Clinics ---
// Rota para listar todas as clínicas
app.get("/clinics", (req, res) => {
  res.json(clinicsData);
});

// Rota para cadastrar nova clínica
app.post("/clinics", (req, res) => {
  const newClinic = { id: Date.now(), ...req.body };
  clinicsData.push(newClinic);
  res.status(201).json(newClinic);
});

// Rota para editar uma clínica existente
app.put("/clinics/:id", (req, res) => {
  const { id } = req.params;
  clinicsData = clinicsData.map(c => String(c.id) === String(id) ? { ...c, ...req.body } : c);
  res.json({ success: true });
});

app.post("/appointments/createAppointment", requireAuth, (req, res) => {
    const { doctorId, date, patientId, notes } = req.body;
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return res.status(404).json({ error: "Médico não encontrado" });

    const apptDate = new Date(date);
    if (apptDate < new Date()) {
        return res.status(400).json({ error: "Não é possível agendar em datas passadas." });
    }
    
    const appointmentDurationMs = 20 * 60 * 1000;
    const startWindow = new Date(apptDate.getTime() - appointmentDurationMs);
    const endWindow = new Date(apptDate.getTime() + appointmentDurationMs);

    const conflict = appointments.find(a => {
        if (a.status === "CANCELLED") return false;

        if (a.doctorId !== doctorId && a.doctor !== doctor.name) return false;
        
        const existingDate = new Date(a.date);
        return existingDate > startWindow && existingDate < endWindow;
    });

    if (conflict) {
        return res.status(409).json({ error: "Horário indisponível. Há um conflito com outra consulta já agendada próxima a este horário." });
    }

    const newAppt = {
        id: `a-${Date.now()}`,
        patientId,
        doctorId: doctor.id,
        date,
        status: "PENDING",
        notes: notes || null
    };
    appointments = [newAppt, ...appointments];
    res.status(201).json(newAppt);
});

app.patch("/appointments/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    const { date, notes } = req.body;
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) return res.status(404).json({ error: "Consulta não encontrada" });

    const apptDate = new Date(date);
    if (apptDate < new Date()) {
        return res.status(400).json({ error: "Não é possível reagendar para datas passadas." });
    }
    const appointmentDurationMs = 20 * 60 * 1000;
    const startWindow = new Date(apptDate.getTime() - appointmentDurationMs);
    const endWindow = new Date(apptDate.getTime() + appointmentDurationMs);

    const conflict = appointments.find(a => {
        if (a.id === id) return false;
        if (a.status === "CANCELLED") return false;
        if (a.doctorId !== appointments[idx].doctorId) return false;
        const existingDate = new Date(a.date);
        return existingDate > startWindow && existingDate < endWindow;
    });

    if (conflict) {
        return res.status(409).json({ error: "Horário indisponível. Há um conflito com outra consulta já agendada próxima a este horário." });
    }

    appointments[idx] = { 
        ...appointments[idx], 
        date, 
        notes: notes || null,
        status: "PENDING"
    };
    res.json(appointments[idx]);
});

app.post("/appointments/cancelAppointment", requireAuth, (req, res) => {
    const { appointmentId } = req.body;
    const idx = appointments.findIndex((a) => a.id === appointmentId);
    if (idx === -1) return res.status(404).json({ error: "Consulta não encontrada" });
    appointments[idx] = { ...appointments[idx], status: "CANCELLED" };
    res.json(appointments[idx]);
});

app.patch("/appointments/confirmAppointment", requireAuth, (req, res) => {
    const { appointmentId } = req.body;
    const idx = appointments.findIndex((a) => a.id === appointmentId);
    if (idx === -1) return res.status(404).json({ error: "Consulta não encontrada" });
    appointments[idx] = { ...appointments[idx], status: "CONFIRMED" };
    res.json(appointments[idx]);
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Notifications ─────────────────────────────────────────────
app.get("/notifications/", async (_req, res) => {
    await delay(1000);
    res.json(notifications);
});

app.get("/notifications/unread-count", (_req, res) => {
    res.json({ count: notifications.filter((n) => !n.read).length });
});

app.patch("/notifications/read-all", (_req, res) => {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    res.json({ success: true });
});

app.patch("/notifications/:id/read", (req, res) => {
    const { id } = req.params;
    notifications = notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
    );
    res.json({ success: true });
});

app.patch("/notifications/:id/unread", (req, res) => {
    const { id } = req.params;
    notifications = notifications.map((n) =>
        n.id === id ? { ...n, read: false } : n,
    );
    res.json({ success: true });
});

// ────────────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () =>
    console.log(`Mock server rodando em http://localhost:${PORT}`),
);
