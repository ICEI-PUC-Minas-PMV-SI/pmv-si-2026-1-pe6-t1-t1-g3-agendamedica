import { useState, useEffect, useRef } from "react";
import type React from "react";
import { PageHeader } from "../components/ui/PageHeader";
import type { Doctor, Appointment } from "../lib/types";
import * as api from "../lib/api";
import { Ic } from "../lib/icons";

interface Props {
    patientId: string;
    userName: string;
    currentUserRole?: string;
    initialData?: Appointment | null;
    onAppointmentCreated: () => void;
    onGoAppointments: () => void;
}

function BRDateInput({
    value,
    onChange,
    id,
    required,
    className,
}: {
    value: string;
    onChange: (iso: string) => void;
    id?: string;
    required?: boolean;
    className?: string;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const display = value ? value.split("-").reverse().join("/") : "";

    return (
        <div style={{ position: "relative" }}>
            <input
                type="text"
                readOnly
                placeholder="DD/MM/AAAA"
                value={display}
                className={className}
                style={{ cursor: "pointer" }}
                onClick={() => ref.current?.showPicker()}
            />
            <input
                ref={ref}
                id={id}
                type="date"
                required={required}
                value={value}
                min={(() => {
                    const d = new Date();
                    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                })()} // Formato YYYY-MM-DD obrigatório para o atributo min do HTML
                onChange={(e) => onChange(e.target.value)}
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderTop: "1px solid var(--border)",
            }}
        >
            <span style={{ color: "var(--ink-3)", fontSize: 13 }}>{label}</span>
            <span
                style={{
                    color: "var(--ink)",
                    fontWeight: 500,
                    fontSize: 13,
                    textAlign: "right",
                    maxWidth: "60%",
                }}
            >
                {value}
            </span>
        </div>
    );
}

export function ScheduleView({ patientId, userName, currentUserRole, initialData, onAppointmentCreated, onGoAppointments }: Props) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState(patientId);
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        api.fetchDoctors().then((docs) => {
            setDoctors(docs);
            if (initialData && docs.length > 0) {
                const doc = docs.find((d) => d.id === initialData.doctorId);
                if (doc) {
                    setSelectedSpecialty(doc.specialty);
                    setSelectedDoctor(doc);
                }
                if (initialData.date) {
                    const d = new Date(initialData.date);
                    setDate(d.toISOString().split("T")[0]);
                    const h = String(d.getHours()).padStart(2, "0");
                    const m = String(d.getMinutes()).padStart(2, "0");
                    setTime(`${h}:${m}`);
                }
            }
        }).catch(console.error);

        if (currentUserRole === "RECEPTIONIST") {
            api.fetchPatients().then(setPatients).catch(console.error);
        }
    }, [initialData, currentUserRole]);

    const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();
    const filteredDoctors = selectedSpecialty
        ? doctors.filter((d) => d.specialty === selectedSpecialty)
        : [];


    const canSubmit = !!(selectedDoctor && date && time);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    function handleSpecSelect(spec: string) {
        setSelectedSpecialty(spec);
        setSelectedDoctor(null);
    }

    function resetForm() {
        setSelectedSpecialty(null);
        setSelectedDoctor(null);
        setDate("");
        setTime("");
        setNotes("");
        setError("");
        setSuccess(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);
        setError("");
        try {
            const isoDate = new Date(`${date}T${time}:00`).toISOString();
            
            if (initialData) {
                await api.rescheduleAppointment({
                    appointmentId: initialData.id,
                    date: isoDate,
                    notes,
                });
            } else {
                await api.createAppointment({
                    patientId: currentUserRole === "RECEPTIONIST" ? selectedPatientId : patientId,
                    doctorId: selectedDoctor!.id,
                    date: isoDate,
                    notes,
                });
            }
            onAppointmentCreated();
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Não foi possível criar a consulta. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <>
                <PageHeader
                    eyebrow="nova consulta"
                    title={`Consulta <em>agendada</em>!`}
                    sub="Você receberá uma notificação com os detalhes do atendimento."
                />
                <div style={{ maxWidth: 420, margin: "0 auto" }}>
                    <section className="card" style={{ textAlign: "center", padding: 40 }}>
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                background: "var(--success-soft)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                                color: "var(--success)",
                            }}
                        >
                            <Ic.check size={28} />
                        </div>
                        <h2
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 22,
                                fontWeight: 400,
                                letterSpacing: "-0.015em",
                                margin: "0 0 8px",
                            }}
                        >
                            Tudo certo!
                        </h2>
                        <p style={{ color: "var(--ink-3)", fontSize: 14, margin: "0 0 24px" }}>
                            Sua consulta com <strong>{selectedDoctor?.name}</strong> foi agendada para{" "}
                            <strong>
                                {new Date(`${date}T${time}`).toLocaleDateString("pt-BR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                })}{" "}
                                às {time}
                            </strong>
                            .
                        </p>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button className="btn btn-ghost" onClick={resetForm}>
                                Novo agendamento
                            </button>
                            <button className="btn btn-primary" onClick={onGoAppointments}>
                                Ver minhas consultas
                            </button>
                        </div>
                    </section>
                </div>
            </>
        );
    }

    return (
        <>
            <PageHeader
                eyebrow="nova consulta"
                title={`Agendar em <em>3 passos</em>.`}
                sub="Escolha a especialidade, o profissional e confirme. Você recebe o código do atendimento imediatamente."
            />
            <form onSubmit={handleSubmit}>
                <div className="home-grid">
                    {/* Fluxo Principal */}
                    <div className="col" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Passo 0 (Apenas Recepção): Paciente */}
                        {currentUserRole === "RECEPTIONIST" && !initialData && (
                            <section className="card">
                                <div className="card-head">
                                    <h3 className="card-title">1 · Paciente</h3>
                                </div>
                                <div className="form-field">
                                    <label className="form-label" htmlFor="sched-patient">Selecione o paciente</label>
                                    <select
                                        id="sched-patient"
                                        className="form-input"
                                        value={selectedPatientId}
                                        onChange={(e) => setSelectedPatientId(e.target.value)}
                                        required
                                        style={{ height: 42 }}
                                    >
                                        <option value="">Selecione...</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </section>
                        )}

                        {/* Passo 1 */}
                        <section className="card">
                            <div className="card-head">
                                <h3 className="card-title">{currentUserRole === "RECEPTIONIST" && !initialData ? "2" : "1"} · Especialidade</h3>
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                                    gap: 8,
                                }}
                            >
                                {specialties.map((s) => {
                                    const count = doctors.filter((d) => d.specialty === s).length;
                                    return (
                                        <button
                                            key={s}
                                            type="button"
                                            className="shortcut"
                                            disabled={!!initialData && selectedSpecialty !== s}
                                            style={{
                                                minHeight: 70,
                                                opacity: !!initialData && selectedSpecialty !== s ? 0.4 : 1,
                                                cursor: !!initialData && selectedSpecialty !== s ? "not-allowed" : "pointer",
                                                borderColor:
                                                    selectedSpecialty === s
                                                        ? "var(--accent)"
                                                        : undefined,
                                                background:
                                                    selectedSpecialty === s
                                                        ? "var(--accent-soft)"
                                                        : undefined,
                                            }}
                                            onClick={() => handleSpecSelect(s)}
                                        >
                                            <div className="shortcut-label">{s}</div>
                                            <div className="shortcut-sub">
                                                {count} profissional{count !== 1 ? "ais" : ""}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Passo 2 */}
                        {selectedSpecialty && (
                            <section className="card">
                                <div className="card-head">
                                    <h3 className="card-title">{currentUserRole === "RECEPTIONIST" && !initialData ? "3" : "2"} · Profissional</h3>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: "var(--ink-muted)",
                                            fontFamily: "var(--font-mono)",
                                        }}
                                    >
                                        {selectedSpecialty}
                                    </span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {filteredDoctors.map((d) => {
                                        const initial = d.name.replace(/^Dr[a]?\. /, "")[0];
                                        const active = selectedDoctor?.id === d.id;
                                        return (
                                            <button
                                                key={d.id}
                                                type="button"
                                                onClick={() => setSelectedDoctor(d)}
                                                disabled={!!initialData && selectedDoctor?.id !== d.id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                    padding: "12px 14px",
                                                    borderRadius: "var(--r-2)",
                                                    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                                                    background: active
                                                        ? "var(--accent-soft)"
                                                        : "var(--surface-2)",
                                                    cursor: !!initialData && selectedDoctor?.id !== d.id ? "not-allowed" : "pointer",
                                                    opacity: !!initialData && selectedDoctor?.id !== d.id ? 0.4 : 1,
                                                    textAlign: "left",
                                                    transition: "border-color 0.1s, background 0.1s",
                                                    width: "100%",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: "50%",
                                                        background: "var(--accent-soft)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "var(--accent-soft-ink)",
                                                        flexShrink: 0,
                                                        fontWeight: 700,
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    {initial}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div
                                                        style={{
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                            color: "var(--ink)",
                                                        }}
                                                    >
                                                        {d.name}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 12,
                                                            color: "var(--ink-3)",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {d.clinic}
                                                    </div>
                                                </div>
                                                {active && (
                                                    <Ic.check
                                                        size={16}
                                                        style={{ color: "var(--accent)", flexShrink: 0 }}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Passo 3 */}
                        {selectedDoctor && (
                            <section className="card">
                                <div className="card-head">
                                    <h3 className="card-title">{currentUserRole === "RECEPTIONIST" && !initialData ? "4" : "3"} · Data e Horário</h3>
                                </div>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 12,
                                    }}
                                >
                                    <div className="form-field">
                                        <label className="form-label" htmlFor="sched-date">
                                            Data
                                        </label>
                                        <BRDateInput
                                            id="sched-date"
                                            className="form-input"
                                            value={date}
                                            onChange={setDate}
                                            required
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label" htmlFor="sched-time">
                                            Horário
                                        </label>
                                        <select
                                            id="sched-time"
                                            className="form-input"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecione</option>
                                            {Array.from({ length: 34 }, (_, i) => {
                                                const totalMin = 7 * 60 + i * 20;
                                                const h = String(Math.floor(totalMin / 60)).padStart(2, "0");
                                                const m = String(totalMin % 60).padStart(2, "0");
                                                return `${h}:${m}`;
                                            }).map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Coluna direita: resumo */}
                    <div className="col">
                        <section className="card">
                            <div className="card-head">
                                <h3 className="card-title">Resumo</h3>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <SummaryRow label="Paciente" value={currentUserRole === "RECEPTIONIST" && !initialData ? (patients.find(p => p.id === selectedPatientId)?.name || "—") : (initialData?.patientName || userName)} />
                                <SummaryRow
                                    label="Especialidade"
                                    value={selectedSpecialty ?? "—"}
                                />
                                <SummaryRow
                                    label="Profissional"
                                    value={selectedDoctor?.name ?? "—"}
                                />
                                <SummaryRow label="Local" value={selectedDoctor?.clinic ?? "—"} />
                                <SummaryRow
                                    label="Data"
                                    value={
                                        date
                                            ? new Date(`${date}T00:00`).toLocaleDateString("pt-BR", {
                                                  weekday: "short",
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric",
                                              })
                                            : "—"
                                    }
                                />
                                <SummaryRow label="Horário" value={time || "—"} />
                            </div>

                            <div className="form-field" style={{ marginTop: 16 }}>
                                <label className="form-label" htmlFor="sched-notes">
                                    Observações{" "}
                                    <span style={{ color: "var(--ink-muted)", fontWeight: 400 }}>
                                        (opcional)
                                    </span>
                                </label>
                                <textarea
                                    id="sched-notes"
                                    className="form-input"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Ex: consulta de retorno, trazer exames..."
                                    style={{
                                        resize: "vertical",
                                        minHeight: 72,
                                        fontFamily: "var(--font-ui)",
                                    }}
                                />
                            </div>

                            {error && (
                                <div
                                    style={{
                                        background: "var(--danger-soft)",
                                        border: "1px solid oklch(from var(--danger) l c h / 0.2)",
                                        borderRadius: "var(--r-2)",
                                        padding: "12px 14px",
                                        display: "flex",
                                        gap: 10,
                                        alignItems: "flex-start",
                                        marginTop: 16,
                                    }}
                                >
                                    <Ic.alertOct size={16} style={{ color: "var(--danger-ink)", flexShrink: 0, marginTop: 1 }} />
                                    <p style={{ fontSize: 13, color: "var(--danger-ink)", margin: 0, lineHeight: 1.5 }}>
                                        {error}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                style={{
                                    width: "100%",
                                    marginTop: 16,
                                    justifyContent: "center",
                                    opacity: !canSubmit ? 0.5 : 1,
                                    cursor: !canSubmit ? "not-allowed" : "pointer",
                                }}
                                onClick={() => { if (!canSubmit) setSubmitAttempted(true); }}
                                disabled={loading}
                            >
                                {loading ? "Agendando…" : "Confirmar agendamento"}
                            </button>
                            {submitAttempted && !canSubmit && (
                                <p style={{ fontSize: 12, color: "var(--danger-ink)", textAlign: "center", marginTop: 10 }}>
                                    Falta selecionar:{" "}
                                    {[
                                        !selectedSpecialty && "especialidade",
                                        !selectedDoctor && "profissional",
                                        !date && "data",
                                        !time && "horário",
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                    .
                                </p>
                            )}
                            {canSubmit && (
                                <p style={{ fontSize: 11.5, color: "var(--ink-muted)", textAlign: "center", marginTop: 10 }}>
                                    Você poderá remarcar até 4h antes da consulta.
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </form>
        </>
    );
}
