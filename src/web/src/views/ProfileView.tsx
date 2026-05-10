import { useState } from "react";
import type { Theme, User } from "../lib/types";
import { PageHeader } from "../components/ui/PageHeader";

interface ProfileViewProps {
    user: User;
    theme: Theme;
    onToggleTheme: () => void;
}

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

interface PrefRowProps {
    label: string;
    on?: boolean;
    onChange?: (v: boolean) => void;
}

function PrefRow({ label, on, onChange }: PrefRowProps) {
    const [v, setV] = useState(!!on);
    const toggle = () => {
        setV(!v);
        onChange?.(!v);
    };
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderTop: "1px solid var(--border)",
            }}
        >
            <span style={{ fontSize: 13.5 }}>{label}</span>
            <button
                onClick={toggle}
                style={{
                    width: 40,
                    height: 22,
                    borderRadius: 999,
                    border: "none",
                    background: v ? "var(--accent)" : "var(--border-strong)",
                    position: "relative",
                    transition: "background 120ms",
                    cursor: "pointer",
                }}
                aria-pressed={v}
            >
                <span
                    style={{
                        position: "absolute",
                        top: 2,
                        left: v ? 20 : 2,
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        background: "white",
                        transition: "left 140ms",
                        boxShadow: "0 1px 2px rgba(0,0,0,.2)",
                    }}
                />
            </button>
        </div>
    );
}

export function ProfileView({ user, theme, onToggleTheme }: ProfileViewProps) {
    const isDoctor = user.role === "DOCTOR";
    const isReceptionist = user.role === "RECEPTIONIST";
    const isPatient = user.role === "PATIENT" || (!isDoctor && !isReceptionist);
    const doctorUser = user as any;

    return (
        <>
            <PageHeader
                eyebrow="perfil"
                title={`Seus <em>dados</em>.`}
                sub={
                    isDoctor
                        ? "Mantenha seus dados profissionais atualizados para seus pacientes."
                        : isReceptionist
                        ? "Mantenha seus dados atualizados para acesso ao sistema."
                        : "Mantenha suas informações atualizadas para agilizar agendamentos e receber avisos no canal certo."
                }
            />
            <div className="home-grid">
                <div className="col">
                    <section className="card">
                        <div className="card-head">
                            <h3 className="card-title">Identidade</h3>
                            <button className="card-action">Editar</button>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 18,
                                alignItems: "center",
                                marginBottom: 18,
                            }}
                        >
                            <span className="avatar avatar-lg">{user.initials}</span>
                            <div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: 22,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {user.name}
                                </div>
                                <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
                                    {isDoctor
                                        ? `${doctorUser.specialty ?? "Médico"} • CRM ${doctorUser.crm ?? "—"}`
                                        : isReceptionist
                                        ? "Recepcionista Administrativa"
                                        : "Paciente desde mar/2024"}
                                </div>
                            </div>
                        </div>
                        <SummaryRow label="E-mail" value={user.email} />
                        {isDoctor ? (
                            <>
                                <SummaryRow label="CRM" value={doctorUser.crm ?? "—"} />
                                <SummaryRow label="Especialidade" value={doctorUser.specialty ?? "—"} />
                            </>
                        ) : isReceptionist ? (
                            <>
                                <SummaryRow label="CPF" value="•••.•••.321-00" />
                                <SummaryRow label="Matrícula" value="REC-1092" />
                            </>
                        ) : (
                            <>
                                <SummaryRow label="CPF" value="•••.•••.321-00" />
                                <SummaryRow label="Telefone" value="(31) 9•••• 4412" />
                                <SummaryRow label="Nascimento" value="14 jul 1992" />
                            </>
                        )}
                    </section>

                    <section className="card" style={{ marginTop: 16 }}>
                        <div className="card-head">
                            <h3 className="card-title">Aparência</h3>
                        </div>
                        <PrefRow
                            label="Modo escuro"
                            on={theme === "dark"}
                            onChange={onToggleTheme}
                        />
                    </section>
                </div>
                <div className="col">
                    <section className="card">
                        <div className="card-head">
                            <h3 className="card-title">
                                {isPatient ? "Preferências de aviso" : "Preferências de notificação"}
                            </h3>
                        </div>
                        <PrefRow label="Push (app mobile)" on />
                        <PrefRow label="E-mail" on />
                        <PrefRow label="SMS" />
                        <PrefRow label="Lembretes 24h antes" on />
                        {isDoctor && (
                            <PrefRow label="Novo agendamento" on />
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}