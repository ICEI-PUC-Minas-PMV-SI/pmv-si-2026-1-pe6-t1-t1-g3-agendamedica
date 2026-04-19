import { useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";

interface SummaryRowProps {
    label: string;
    value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderTop: "1px solid var(--border)",
            }}
        >
            <span style={{ color: "var(--ink-3)" }}>{label}</span>
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>{value}</span>
        </div>
    );
}

const SPECS = [
    "Clínico Geral",
    "Cardiologia",
    "Dermatologia",
    "Pediatria",
    "Ginecologia",
    "Oftalmologia",
    "Ortopedia",
    "Psiquiatria",
];

const SLOTS = ["09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00", "16:15"];

const PROF_COUNTS: Record<string, number> = {
    "Clínico Geral": 14,
    Cardiologia: 9,
    Dermatologia: 11,
    Pediatria: 16,
    Ginecologia: 8,
    Oftalmologia: 12,
    Ortopedia: 10,
    Psiquiatria: 13,
};

export function ScheduleView() {
    const [_step, setStep] = useState(0);
    const [specialty, setSpec] = useState<string | null>(null);
    const [slot, setSlot] = useState<string | null>(null);

    function handleSpecSelect(s: string) {
        setSpec(s);
        setStep(1);
    }

    function handleSlotSelect(t: string) {
        setSlot(t);
        setStep(2);
    }

    return (
        <>
            <PageHeader
                eyebrow="nova consulta"
                title={`Agendar em <em>3 passos</em>.`}
                sub="Escolha especialidade, horário e confirme. Você recebe o código do atendimento imediatamente."
            />
            <div className="home-grid">
                <div className="col">
                    <section className="card">
                        <div className="card-head">
                            <h3 className="card-title">1 · Especialidade</h3>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                                gap: 8,
                            }}
                        >
                            {SPECS.map((s) => (
                                <button
                                    key={s}
                                    className="shortcut"
                                    style={{
                                        minHeight: 70,
                                        borderColor: specialty === s ? "var(--accent)" : undefined,
                                        background:
                                            specialty === s ? "var(--accent-soft)" : undefined,
                                    }}
                                    onClick={() => handleSpecSelect(s)}
                                >
                                    <div className="shortcut-label">{s}</div>
                                    <div className="shortcut-sub">
                                        {PROF_COUNTS[s]} profissionais
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                    <section className="card">
                        <div className="card-head">
                            <h3 className="card-title">2 · Horário</h3>
                            <span
                                style={{
                                    fontSize: 12,
                                    color: "var(--ink-muted)",
                                    fontFamily: "var(--font-mono)",
                                }}
                            >
                                qui · 23 abr
                            </span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(86px, 1fr))",
                                gap: 8,
                            }}
                        >
                            {SLOTS.map((t) => (
                                <button
                                    key={t}
                                    className="btn btn-secondary"
                                    style={{
                                        height: 40,
                                        justifyContent: "center",
                                        borderColor: slot === t ? "var(--accent)" : undefined,
                                        background: slot === t ? "var(--accent-soft)" : undefined,
                                        color: slot === t ? "var(--accent-soft-ink)" : undefined,
                                    }}
                                    onClick={() => handleSlotSelect(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
                <div className="col">
                    <section className="card">
                        <div className="card-head">
                            <h3 className="card-title">Resumo</h3>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                fontSize: 13,
                            }}
                        >
                            <SummaryRow label="Paciente" value="Ana Beatriz Lima" />
                            <SummaryRow label="Especialidade" value={specialty ?? "—"} />
                            <SummaryRow label="Data" value="23 abr 2026" />
                            <SummaryRow label="Horário" value={slot ?? "—"} />
                            <SummaryRow label="Modalidade" value="Presencial" />
                        </div>
                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: "100%", marginTop: 18, justifyContent: "center" }}
                            disabled={!specialty || !slot}
                        >
                            Confirmar agendamento
                        </button>
                        <p
                            style={{
                                fontSize: 11.5,
                                color: "var(--ink-muted)",
                                textAlign: "center",
                                marginTop: 10,
                            }}
                        >
                            Você poderá remarcar até 4h antes.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}
