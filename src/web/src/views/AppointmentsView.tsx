import { useState } from "react";
import type { ReactNode } from "react";
import type { Appointment } from "../lib/types";
import { Ic } from "../lib/icons";
import { fmtDate, STATUS_LABEL, STATUS_CLASS } from "../lib/utils";
import { PageHeader } from "../components/ui/PageHeader";
import * as api from "../lib/api";

interface AppointmentsViewProps {
    appointments: Appointment[];
    currentUserRole: string;
    onCancelled: (id: string) => void;
    onConfirmed: (id: string) => void;
    onReschedule: (appointment: Appointment) => void;
}

// ── Row da listagem ───────────────────────────────────────────

interface AppointmentRowFullProps {
    appointment: Appointment;
    currentUserRole: string;
    cancelling: boolean;
    confirming: boolean;
    onRequestCancel: (appointment: Appointment) => void;
    onRequestConfirm: (appointment: Appointment) => void;
    onOpenDetail: (appointment: Appointment) => void;
    onReschedule: (appointment: Appointment) => void;
}

function AppointmentRowFull({ appointment, currentUserRole, cancelling, confirming, onRequestCancel, onRequestConfirm, onOpenDetail, onReschedule }: AppointmentRowFullProps) {
    const formattedDate = fmtDate(appointment.date);
    const isCancelled = appointment.status === "CANCELLED";
    
    const appointmentDate = new Date(appointment.date);
    const todayDate = new Date();
    const isToday = appointmentDate.getDate() === todayDate.getDate() && appointmentDate.getMonth() === todayDate.getMonth() && appointmentDate.getFullYear() === todayDate.getFullYear();

    const hoursUntilAppointment = (appointmentDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60);
    const canModify = currentUserRole === "PATIENT" && hoursUntilAppointment >= 4;

    return (
        <div className="appt-row">
            <div className={`appt-date ${isToday ? "appt-today" : ""}`}>
                <span className="mo">{isToday ? "hoje" : formattedDate.mo}</span>
                <span className="d">{formattedDate.d}</span>
                <span className="dow">{formattedDate.dow}</span>
            </div>
            <div className="appt-body">
                <div className="appt-doctor">
                    {currentUserRole === "PATIENT" ? appointment.doctor : `${appointment.patientName} (com ${appointment.doctor})`}
                    <span className={`chip ${STATUS_CLASS[appointment.status]}`}>
                        {STATUS_LABEL[appointment.status]}
                    </span>
                </div>
                <div className="appt-specialty">
                    <span className="inline-ic">
                        <Ic.stethoscope size={13} />
                        {appointment.specialty}
                    </span>
                    <span className="dot">·</span>
                    <span className="inline-ic">
                        <Ic.clock size={13} />
                        {formattedDate.hm}
                    </span>
                    <span className="dot">·</span>
                    <span>{appointment.clinic}</span>
                </div>
            </div>
            <div className="appt-actions">
                {currentUserRole === "DOCTOR" ? (
                    <button className="btn btn-secondary btn-sm" onClick={() => onOpenDetail(appointment)}>
                        Detalhes
                    </button>
                ) : (
                    <>
                        {appointment.status === "PENDING" && currentUserRole === "RECEPTIONIST" && (
                            <button
                                className="btn btn-primary btn-sm"
                                disabled={confirming}
                                onClick={() => onRequestConfirm(appointment)}
                            >
                                {confirming ? "Confirmando…" : "Confirmar"}
                            </button>
                        )}
                        {!isCancelled && (currentUserRole === "RECEPTIONIST" || canModify) && (
                            <button className="btn btn-ghost btn-sm" onClick={() => onReschedule(appointment)}>Remarcar</button>
                        )}
                        {!isCancelled && (currentUserRole === "RECEPTIONIST" || canModify) && (
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ color: "var(--danger-ink)" }}
                                disabled={cancelling}
                                onClick={() => onRequestCancel(appointment)}
                            >
                                {cancelling ? "Cancelando…" : "Cancelar"}
                            </button>
                        )}
                        <button className="btn btn-secondary btn-sm" onClick={() => onOpenDetail(appointment)}>
                            Detalhes
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// ── Modal de confirmação de cancelamento ──────────────────────

interface CancelConfirmModalProps {
    appointment: Appointment;
    confirming: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

function CancelConfirmModal({ appointment, confirming, onConfirm, onClose }: CancelConfirmModalProps) {
    const formattedDate = fmtDate(appointment.date);

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxWidth: 400 }} role="dialog" aria-modal="true" aria-labelledby="cancel-dialog-title">
                <div className="modal-header">
                    <h2 id="cancel-dialog-title" className="modal-title">Cancelar consulta</h2>
                    <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Fechar">
                        <Ic.x size={16} />
                    </button>
                </div>

                <div
                    style={{
                        background: "var(--danger-soft)",
                        border: "1px solid oklch(from var(--danger) l c h / 0.2)",
                        borderRadius: "var(--r-2)",
                        padding: "12px 14px",
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        marginBottom: 16,
                    }}
                >
                    <Ic.alertOct size={16} style={{ color: "var(--danger-ink)", flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 13, color: "var(--danger-ink)", margin: 0, lineHeight: 1.5 }}>
                        Esta ação não pode ser desfeita.
                    </p>
                </div>

                <p style={{ fontSize: 14, color: "var(--ink-2)", margin: "0 0 4px" }}>
                    Você está cancelando a consulta com:
                </p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                    {appointment.doctor}
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0 }}>
                    {formattedDate.dow}, {formattedDate.d} de {formattedDate.mo} · {formattedDate.hm} · {appointment.clinic}
                </p>

                <div className="modal-footer">
                    <button className="btn btn-ghost" onClick={onClose} disabled={confirming}>
                        Voltar
                    </button>
                    <button
                        className="btn btn-sm"
                        style={{
                            height: 40,
                            padding: "0 18px",
                            background: "var(--danger)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "var(--r-2)",
                            fontWeight: 600,
                            cursor: confirming ? "not-allowed" : "pointer",
                            opacity: confirming ? 0.7 : 1,
                        }}
                        onClick={onConfirm}
                        disabled={confirming}
                    >
                        {confirming ? "Cancelando…" : "Sim, cancelar consulta"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Tela de detalhes ──────────────────────────────────────────

interface DetailRowProps {
    icon: ReactNode;
    label: string;
    value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 0",
                borderBottom: "1px solid var(--border)",
            }}
        >
            <span style={{ color: "var(--ink-3)", flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                    {label}
                </div>
                <div style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>{value}</div>
            </div>
        </div>
    );
}

interface AppointmentDetailProps {
    appointment: Appointment;
    currentUserRole: string;
    cancelling: boolean;
    confirming: boolean;
    error: string | null;
    onRequestCancel: (appointment: Appointment) => void;
    onRequestConfirm: (appointment: Appointment) => void;
    onBack: () => void;
    onReschedule: (appointment: Appointment) => void;
}

function AppointmentDetail({ appointment, currentUserRole, cancelling, confirming, error, onRequestCancel, onRequestConfirm, onBack, onReschedule }: AppointmentDetailProps) {
    const formattedDate = fmtDate(appointment.date);
    const isCancelled = appointment.status === "CANCELLED";

    const dateFormatted = new Date(appointment.date).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const hoursUntilAppointment = (new Date(appointment.date).getTime() - new Date().getTime()) / (1000 * 60 * 60);
    const canModify = currentUserRole === "RECEPTIONIST" || hoursUntilAppointment >= 4;

    return (
        <>
            <div style={{ marginBottom: 24 }}>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={onBack}
                    style={{ gap: 6, paddingLeft: 6 }}
                >
                    <Ic.arrow size={15} style={{ transform: "rotate(180deg)" }} />
                    Minhas consultas
                </button>
            </div>

            <PageHeader
                eyebrow="detalhes da consulta"
                title={currentUserRole === "PATIENT" ? appointment.doctor : (appointment.patientName || "Paciente")}
                sub={currentUserRole === "PATIENT" ? appointment.specialty : `Com ${appointment.doctor} - ${appointment.specialty}`}
            />

            <div style={{ maxWidth: 600 }}>
                <section className="card" style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Status:</span>
                        <span className={`chip ${STATUS_CLASS[appointment.status]}`}>
                            {STATUS_LABEL[appointment.status]}
                        </span>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border)" }}>
                        {currentUserRole !== "PATIENT" && (
                            <DetailRow
                                icon={<Ic.user size={16} />}
                                label="Paciente"
                                value={appointment.patientName || "Paciente"}
                            />
                        )}
                        <DetailRow
                            icon={<Ic.stethoscope size={16} />}
                            label="Médico"
                            value={appointment.doctor}
                        />
                        <DetailRow
                            icon={<Ic.calendar size={16} />}
                            label="Data"
                            value={dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)}
                        />
                        <DetailRow
                            icon={<Ic.clock size={16} />}
                            label="Horário"
                            value={formattedDate.hm}
                        />
                        <DetailRow
                            icon={<Ic.stethoscope size={16} />}
                            label="Especialidade"
                            value={appointment.specialty}
                        />
                        <DetailRow
                            icon={<Ic.mapPin size={16} />}
                            label="Local"
                            value={appointment.clinic}
                        />
                        <DetailRow
                            icon={appointment.mode === "tele" ? <Ic.video size={16} /> : <Ic.user size={16} />}
                            label="Modalidade"
                            value={appointment.mode === "tele" ? "Teleconsulta" : "Presencial"}
                        />
                    </div>
                </section>

                {error && (
                    <p style={{ fontSize: 13, color: "var(--danger-ink)", marginBottom: 12 }}>
                        {error}
                    </p>
                )}
                {!isCancelled && canModify && (
                    <div style={{ display: "flex", gap: 10 }}>
                        {appointment.status === "PENDING" && currentUserRole === "RECEPTIONIST" && (
                            <button
                                className="btn btn-primary"
                                disabled={confirming}
                                onClick={() => onRequestConfirm(appointment)}
                            >
                                {confirming ? "Confirmando…" : "Confirmar consulta"}
                            </button>
                        )}
                        <button className="btn btn-ghost" onClick={() => onReschedule(appointment)}>Remarcar</button>
                        <button
                            className="btn btn-ghost"
                            style={{ color: "var(--danger-ink)" }}
                            disabled={cancelling}
                            onClick={() => onRequestCancel(appointment)}
                        >
                            {cancelling ? "Cancelando…" : "Cancelar consulta"}
                        </button>
                    </div>
                )}
                {!isCancelled && !canModify && appointment.status !== "CONFIRMED" && (
                    <p style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 8 }}>
                        {hoursUntilAppointment > 0 
                            ? "Faltam menos de 4 horas para a consulta. Não é possível alterar." 
                            : "A data desta consulta já passou."}
                    </p>
                )}
            </div>
        </>
    );
}

// ── View principal ────────────────────────────────────────────

export function AppointmentsView({ appointments, currentUserRole, onCancelled, onConfirmed, onReschedule }: AppointmentsViewProps) {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [pendingCancel, setPendingCancel] = useState<Appointment | null>(null);
    const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());
    const [confirmingIds, setConfirmingIds] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const filteredAppointments = appointments.filter((a) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            a.doctor.toLowerCase().includes(q) ||
            a.specialty.toLowerCase().includes(q) ||
            (a.patientName && a.patientName.toLowerCase().includes(q))
        );
    });

    async function handleConfirmAppointment(appointment: Appointment) {
        const { id } = appointment;
        setConfirmingIds((prev) => new Set(prev).add(id));
        setError(null);
        try {
            await api.confirmAppointment(id);
            onConfirmed(id);
            if (selectedAppointment?.id === id) {
                setSelectedAppointment((prev) => prev ? { ...prev, status: "CONFIRMED" } : null);
            }
        } catch {
            setError("Não foi possível confirmar a consulta. Tente novamente.");
        } finally {
            setConfirmingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    }

    async function handleConfirmCancel() {
        if (!pendingCancel) return;
        const { id } = pendingCancel;
        setPendingCancel(null);
        setCancellingIds((prev) => new Set(prev).add(id));
        setError(null);
        try {
            await api.cancelAppointment(id);
            onCancelled(id);
            // Atualiza o appointment selecionado se for o cancelado
            if (selectedAppointment?.id === id) {
                setSelectedAppointment((prev) => prev ? { ...prev, status: "CANCELLED" } : null);
            }
        } catch {
            setError("Não foi possível cancelar a consulta. Tente novamente.");
        } finally {
            setCancellingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    }

    // Mantém o appointment do detalhe sincronizado com a lista
    const detailAp = selectedAppointment
        ? (appointments.find((a) => a.id === selectedAppointment.id) ?? selectedAppointment)
        : null;

    if (detailAp) {
        return (
            <>
                <AppointmentDetail
                    appointment={detailAp}
                    currentUserRole={currentUserRole}
                    cancelling={cancellingIds.has(detailAp.id)}
                    confirming={confirmingIds.has(detailAp.id)}
                    error={error}
                    onRequestCancel={setPendingCancel}
                    onRequestConfirm={handleConfirmAppointment}
                    onBack={() => setSelectedAppointment(null)}
                    onReschedule={onReschedule}
                />
                {pendingCancel && (
                    <CancelConfirmModal
                        appointment={pendingCancel}
                        confirming={cancellingIds.has(pendingCancel.id)}
                        onConfirm={handleConfirmCancel}
                        onClose={() => setPendingCancel(null)}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <PageHeader
                eyebrow="minhas consultas"
                title={`Gerencie suas <em>consultas</em>.`}
                sub="Remarque, cancele ou acompanhe o status em tempo real."
            />
            <section className="card">
                <div className="card-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 className="card-title">
                        Agendadas <span className="count">{filteredAppointments.length}</span>
                    </h3>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou especialidade..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: 6,
                            border: "1px solid var(--border)",
                            fontSize: 13,
                            width: "100%",
                            maxWidth: 240,
                            outline: "none"
                        }}
                    />
                </div>
                {error && (
                    <p style={{ fontSize: 13, color: "var(--danger-ink)", marginBottom: 12 }}>
                        {error}
                    </p>
                )}
                {filteredAppointments.length === 0 ? (
                    <p style={{ textAlign: "center", color: "var(--ink-muted)", padding: "40px 0" }}>Nenhuma consulta encontrada.</p>
                ) : (
                    filteredAppointments.map((appointment) => (
                    <AppointmentRowFull
                        key={appointment.id}
                        appointment={appointment}
                        currentUserRole={currentUserRole}
                        cancelling={cancellingIds.has(appointment.id)}
                        confirming={confirmingIds.has(appointment.id)}
                        onRequestCancel={setPendingCancel}
                        onRequestConfirm={handleConfirmAppointment}
                        onOpenDetail={setSelectedAppointment}
                        onReschedule={onReschedule}
                    />
                    ))
                )}
            </section>

            {pendingCancel && (
                <CancelConfirmModal
                    appointment={pendingCancel}
                    confirming={cancellingIds.has(pendingCancel.id)}
                    onConfirm={handleConfirmCancel}
                    onClose={() => setPendingCancel(null)}
                />
            )}
        </>
    );
}
