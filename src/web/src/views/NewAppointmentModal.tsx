import { useState, useEffect } from "react";
import type React from "react";
import type { Appointment, Doctor } from "../lib/types";
import * as api from "../lib/api";
import { Ic } from "../lib/icons";

interface Props {
    patientId: string;
    onClose: () => void;
    onCreated: (appt: Appointment) => void;
}

export function NewAppointmentModal({ patientId, onClose, onCreated }: Props) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctorId, setDoctorId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.fetchDoctors().then(setDoctors).catch(() => setError("Não foi possível carregar os médicos."));
    }, []);

    const today = new Date().toISOString().split("T")[0];

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const isoDate = new Date(`${date}T${time}:00`).toISOString();
            const appt = await api.createAppointment({ patientId, doctorId, date: isoDate, notes });
            onCreated(appt);
            onClose();
        } catch {
            setError("Não foi possível criar a consulta. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="modal-header">
                    <h2 id="modal-title" className="modal-title">Nova consulta</h2>
                    <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Fechar">
                        <Ic.x size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="form-field">
                        <label className="form-label" htmlFor="doctor-select">Médico</label>
                        <select
                            id="doctor-select"
                            className="form-input"
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                            required
                        >
                            <option value="">Selecione um médico...</option>
                            {doctors.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} — {d.specialty}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div className="form-field">
                            <label className="form-label" htmlFor="appt-date">Data</label>
                            <input
                                id="appt-date"
                                type="date"
                                className="form-input"
                                value={date}
                                min={today}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="appt-time">Horário</label>
                            <input
                                id="appt-time"
                                type="time"
                                className="form-input"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label" htmlFor="appt-notes">
                            Observações{" "}
                            <span style={{ color: "var(--ink-muted)", fontWeight: 400 }}>(opcional)</span>
                        </label>
                        <textarea
                            id="appt-notes"
                            className="form-input"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Ex: consulta de retorno, trazer exames..."
                            style={{ resize: "vertical", minHeight: 80, fontFamily: "var(--font-ui)" }}
                        />
                    </div>

                    {error && (
                        <p style={{ fontSize: 13, color: "var(--danger-ink)", margin: 0 }}>{error}</p>
                    )}

                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Agendando…" : "Agendar consulta"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
