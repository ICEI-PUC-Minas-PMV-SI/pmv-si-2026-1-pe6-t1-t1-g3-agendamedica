import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = (file) =>
    JSON.parse(readFileSync(join(__dirname, "data", file), "utf-8"));

const app = express();
app.use(cors());
app.use(express.json());

// Notificações em memória para suportar mark-as-read na sessão
let notifications = data("notifications.json");
const appointments = data("appointments.json");
const defaultUser = data("user.json");
let clinicsData = data("clinics.json");

// ── Health ──────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Auth ────────────────────────────────────────────────────
app.post("/auth/login", (_req, res) => {
    res.json({ token: "mock-token", user: defaultUser });
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

// ── Appointments ─────────────────────────────────────────────
app.get("/appointments/", (_req, res) => res.json(appointments));
app.get("/appointments/listAppointments", (_req, res) =>
    res.json(appointments),
);

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

// ── Notifications ─────────────────────────────────────────────
app.get("/notifications/", (_req, res) => res.json(notifications));

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

// ────────────────────────────────────────────────────────────
const PORT = 3001;
app.listen(PORT, () =>
    console.log(`Mock server rodando em http://localhost:${PORT}`),
);
