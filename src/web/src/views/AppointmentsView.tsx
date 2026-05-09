import { useState } from "react";
import type { ReactNode } from "react";
import type { Appointment } from "../lib/types";
import { Ic } from "../lib/icons";
import { fmtDate, STATUS_LABEL, STATUS_CLASS } from "../lib/utils";
import { PageHeader } from "../components/ui/PageHeader";
import * as api from "../lib/api";

interface AppointmentsViewProps {
    appointments: Appointment[];
    onCancelled: (id: string) => void;
}

// ── Row da listagem ───────────────────────────────────────────

interface AppointmentRowFullProps {
    ap: Appointment;
    cancelling: boolean;
    onRequestCancel: (ap: Appointment) => void;
    onOpenDetail: (ap: Appointment) => void;
}

function AppointmentRowFull({ ap, cancelling, onRequestCancel, onOpenDetail }: AppointmentRowFullProps) {
    const f = fmtDate(ap.date);
    const isCancelled = ap.status === "CANCELLED";

    return (
        <div className="appt-row">
            <div className={`appt-date ${ap.isToday ? "appt-today" : ""}`}>
                <span className="mo">{ap.isToday ? "hoje" : f.mo}</span>
                <span className="d">{f.d}</span>
                <span className="dow">{f.dow}</span>
            </div>
            <div className="appt-body">
                <div className="appt-doctor">
                    {ap.doctor}
                    <span className={`chip ${STATUS_CLASS[ap.status]}`}>
                        {STATUS_LABEL[ap.status]}
                    </span>
                </div>
                <div className="appt-specialty">
                    <span className="inline-ic">
                        <Ic.stethoscope size={13} />
                        {ap.specialty}
                    </span>
                    <span className="dot">·</span>
                    <span className="inline-ic">
                        <Ic.clock size={13} />
                        {f.hm}
                    </span>
                    <span className="dot">·</span>
                    <span>{ap.clinic}</span>
                </div>
            </div>
            <div className="appt-actions">
                <button className="btn btn-ghost btn-sm">Remarcar</button>
                {!isCancelled && (
                    <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--danger-ink)" }}
                        disabled={cancelling}
                        onClick={() => onRequestCancel(ap)}
                    >
                        {cancelling ? "Cancelando…" : "Cancelar"}
                    </button>
                )}
                <button className="btn btn-secondary btn-sm" onClick={() => onOpenDetail(ap)}>
                    Detalhes
                </button>
            </div>
        </div>
    );
}

// ── Modal de confirmação de cancelamento ──────────────────────

interface CancelConfirmModalProps {
    ap: Appointment;
    confirming: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

function CancelConfirmModal({ ap, confirming, onConfirm, onClose }: CancelConfirmModalProps) {
    const f = fmtDate(ap.date);

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
                    {ap.doctor}
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0 }}>
                    {f.dow}, {f.d} de {f.mo} · {f.hm} · {ap.clinic}
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
    ap: Appointment;
    cancelling: boolean;
    error: string | null;
    onRequestCancel: (ap: Appointment) => void;
    onBack: () => void;
}

function AppointmentDetail({ ap, cancelling, error, onRequestCancel, onBack }: AppointmentDetailProps) {
    const f = fmtDate(ap.date);
    const isCancelled = ap.status === "CANCELLED";

    const dateFormatted = new Date(ap.date).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

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
                title={ap.doctor}
                sub={ap.specialty}
            />

            <div style={{ maxWidth: 600 }}>
                <section className="card" style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Status:</span>
                        <span className={`chip ${STATUS_CLASS[ap.status]}`}>
                            {STATUS_LABEL[ap.status]}
                        </span>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border)" }}>
                        <DetailRow
                            icon={<Ic.calendar size={16} />}
                            label="Data"
                            value={dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)}
                        />
                        <DetailRow
                            icon={<Ic.clock size={16} />}
                            label="Horário"
                            value={f.hm}
                        />
                        <DetailRow
                            icon={<Ic.stethoscope size={16} />}
                            label="Especialidade"
                            value={ap.specialty}
                        />
                        <DetailRow
                            icon={<Ic.mapPin size={16} />}
                            label="Local"
                            value={ap.clinic}
                        />
                        <DetailRow
                            icon={ap.mode === "tele" ? <Ic.video size={16} /> : <Ic.user size={16} />}
                            label="Modalidade"
                            value={ap.mode === "tele" ? "Teleconsulta" : "Presencial"}
                        />
                    </div>
                </section>

                {error && (
                    <p style={{ fontSize: 13, color: "var(--danger-ink)", marginBottom: 12 }}>
                        {error}
                    </p>
                )}
                {!isCancelled && (
                    <div style={{ display: "flex", gap: 10 }}>
                        <button className="btn btn-ghost">Remarcar</button>
                        <button
                            className="btn btn-ghost"
                            style={{ color: "var(--danger-ink)" }}
                            disabled={cancelling}
                            onClick={() => onRequestCancel(ap)}
                        >
                            {cancelling ? "Cancelando…" : "Cancelar consulta"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

// ── View principal ────────────────────────────────────────────

export function AppointmentsView({ appointments, onCancelled }: AppointmentsViewProps) {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [pendingCancel, setPendingCancel] = useState<Appointment | null>(null);
    const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

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
                    ap={detailAp}
                    cancelling={cancellingIds.has(detailAp.id)}
                    error={error}
                    onRequestCancel={setPendingCancel}
                    onBack={() => setSelectedAppointment(null)}
                />
                {pendingCancel && (
                    <CancelConfirmModal
                        ap={pendingCancel}
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
                <div className="card-head">
                    <h3 className="card-title">
                        Agendadas <span className="count">{appointments.length}</span>
                    </h3>
                </div>
                {error && (
                    <p style={{ fontSize: 13, color: "var(--danger-ink)", marginBottom: 12 }}>
                        {error}
                    </p>
                )}
                {appointments.map((ap) => (
                    <AppointmentRowFull
                        key={ap.id}
                        ap={ap}
                        cancelling={cancellingIds.has(ap.id)}
                        onRequestCancel={setPendingCancel}
                        onOpenDetail={setSelectedAppointment}
                    />
                ))}
            </section>

            {pendingCancel && (
                <CancelConfirmModal
                    ap={pendingCancel}
                    confirming={cancellingIds.has(pendingCancel.id)}
                    onConfirm={handleConfirmCancel}
                    onClose={() => setPendingCancel(null)}
                />
            )}
        </>
    );
}
