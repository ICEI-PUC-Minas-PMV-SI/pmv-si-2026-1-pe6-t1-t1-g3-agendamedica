import type { Appointment } from "../lib/types";
import { Ic } from "../lib/icons";
import { fmtDate, STATUS_LABEL, STATUS_CLASS } from "../lib/utils";
import { PageHeader } from "../components/ui/PageHeader";

interface AppointmentsViewProps {
    appointments: Appointment[];
}

interface AppointmentRowFullProps {
    ap: Appointment;
}

function AppointmentRowFull({ ap }: AppointmentRowFullProps) {
    const f = fmtDate(ap.date);
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
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger-ink)" }}>
                    Cancelar
                </button>
                <button className="btn btn-secondary btn-sm">Detalhes</button>
            </div>
        </div>
    );
}

export function AppointmentsView({ appointments }: AppointmentsViewProps) {
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
                    <button className="btn btn-primary btn-sm">
                        <Ic.plus size={14} /> Nova
                    </button>
                </div>
                {appointments.map((ap) => (
                    <AppointmentRowFull key={ap.id} ap={ap} />
                ))}
            </section>
        </>
    );
}
