import type { Appointment } from "../lib/types";
import { Ic } from "../lib/icons";
import { fmtDate, STATUS_LABEL, STATUS_CLASS } from "../lib/utils";
import { PageHeader } from "../components/ui/PageHeader";

interface HistoryViewProps {
    appointments: Appointment[];
}

interface PastAppointment {
    id: string;
    date: string;
    status: string;
    doctor: string;
    specialty: string;
    clinic: string;
}

const PAST: PastAppointment[] = [
    {
        id: "p1",
        date: "2026-03-22T10:00",
        status: "CONFIRMED",
        doctor: "Dr. Paulo Andrade",
        specialty: "Clínico Geral",
        clinic: "Clínica Santa Luz — Centro",
    },
    {
        id: "p2",
        date: "2026-02-14T15:30",
        status: "CONFIRMED",
        doctor: "Dra. Marina Figueiredo",
        specialty: "Cardiologia",
        clinic: "Clínica Santa Luz — Centro",
    },
    {
        id: "p3",
        date: "2026-01-08T09:00",
        status: "CANCELLED",
        doctor: "Dr. Rafael Monteiro",
        specialty: "Clínico Geral",
        clinic: "Teleconsulta",
    },
    {
        id: "p4",
        date: "2025-11-30T16:15",
        status: "CONFIRMED",
        doctor: "Dra. Helena Prado",
        specialty: "Dermatologia",
        clinic: "Clínica Santa Luz — Pampulha",
    },
];

export function HistoryView({ appointments: _appointments }: HistoryViewProps) {
    return (
        <>
            <PageHeader
                eyebrow="histórico"
                title={`Tudo que <em>aconteceu</em>.`}
                sub="Consultas e encaminhamentos — organizados por data."
            />
            <section className="card">
                <div className="card-head">
                    <h3 className="card-title">
                        Últimos 6 meses <span className="count">{PAST.length}</span>
                    </h3>
                    <button className="card-action">Exportar PDF</button>
                </div>
                {PAST.map((ap) => {
                    const f = fmtDate(ap.date);
                    return (
                        <div key={ap.id} className="appt-row">
                            <div className="appt-date">
                                <span className="mo">{f.mo}</span>
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
                                    <span>{ap.clinic}</span>
                                </div>
                            </div>
                            <div className="appt-actions">
                                <button className="btn btn-ghost btn-sm">Ver resumo</button>
                            </div>
                        </div>
                    );
                })}
            </section>
        </>
    );
}
