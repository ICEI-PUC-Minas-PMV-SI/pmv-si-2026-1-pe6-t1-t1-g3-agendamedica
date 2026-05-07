import { PageHeader } from "../components/ui/PageHeader";
import { Ic } from "../lib/icons";
import type { Appointment, DoctorUser } from "../lib/types";
import { fmtDate, STATUS_LABEL, STATUS_CLASS } from "../lib/utils";

interface DoctorDashboardProps {
    user: DoctorUser;
    appointments: Appointment[];
}

export function DoctorDashboard({ user, appointments }: DoctorDashboardProps) {
    return (
        <>
            <PageHeader
                eyebrow={`CRM ${user.crm} • ${user.specialty}`}
                title={`Sua agenda de <em>hoje</em>.`}
                sub="Acesse prontuários e inicie os atendimentos do dia."
            />

            <section className="card">
                <div className="card-head">
                    <h3 className="card-title">Pacientes Confirmados</h3>
                    <div className="badge">{appointments.length}</div>
                </div>

                {appointments.map((ap) => {
                    const f = fmtDate(ap.date);
                    return (
                        <div className="appt-row" key={ap.id}>
                            <div className={`appt-date ${ap.isToday ? "appt-today" : ""}`}>
                                <span className="mo">{f.mo}</span>
                                <span className="d">{f.d}</span>
                            </div>
                            <div className="appt-body">
                                <div className="appt-doctor">
                                    {ap.patientName || "Paciente Externo"}
                                    <span className={`chip ${STATUS_CLASS[ap.status]}`}>
                                        {STATUS_LABEL[ap.status]}
                                    </span>
                                </div>
                                <div className="appt-specialty">
                                    <span className="inline-ic"><Ic.clock size={13} /> {f.hm}</span>
                                    <span className="dot">·</span>
                                    <span>{ap.mode === "tele" ? "Telemedicina" : "Presencial"}</span>
                                </div>
                            </div>
                            <div className="appt-actions">
                                <button className="btn btn-secondary btn-sm">Histórico</button>
                                <button className="btn btn-primary btn-sm">Atender</button>
                            </div>
                        </div>
                    );
                })}
            </section>
        </>
    );
}