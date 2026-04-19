import { Ic } from "../../lib/icons";
import { fmtDate, STATUS_LABEL, STATUS_CLASS } from "../../lib/utils";
import type { Appointment, AppStatus } from "../../lib/types";
import { LoadingState } from "../states/LoadingState";
import { EmptyState } from "../states/EmptyState";
import { ErrorState } from "../states/ErrorState";

interface AppointmentRowProps {
    ap: Appointment;
}

function AppointmentRow({ ap }: AppointmentRowProps) {
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
                    <span className="inline-ic">
                        {ap.mode === "tele" ? <Ic.video size={13} /> : <Ic.mapPin size={13} />}
                        {ap.clinic}
                    </span>
                </div>
            </div>
            <div className="appt-actions">
                {ap.mode === "tele" && ap.status === "PENDING" && (
                    <button className="btn btn-ghost btn-sm">
                        <Ic.video size={14} /> Entrar
                    </button>
                )}
                {ap.status !== "CANCELLED" && (
                    <>
                        <button className="btn btn-ghost btn-sm">Remarcar</button>
                        <button className="btn btn-secondary btn-sm">Detalhes</button>
                    </>
                )}
                <button className="icon-btn" style={{ width: 32, height: 32 }}>
                    <Ic.more size={16} />
                </button>
            </div>
        </div>
    );
}

interface UpcomingAppointmentsProps {
    state: AppStatus;
    appointments: Appointment[];
    onRetry: () => void;
    onSchedule: () => void;
}

export function UpcomingAppointments({
    state,
    appointments,
    onRetry,
    onSchedule,
}: UpcomingAppointmentsProps) {
    return (
        <section className="card">
            <div className="card-head">
                <h3 className="card-title">
                    Próximas consultas
                    {state === "loaded" && <span className="count">{appointments.length}</span>}
                </h3>
                <button className="card-action">
                    Ver todas{" "}
                    <Ic.arrow size={12} style={{ verticalAlign: "middle", marginLeft: 2 }} />
                </button>
            </div>

            {state === "loading" && <LoadingState rows={3} />}
            {state === "error" && <ErrorState onRetry={onRetry} />}
            {state === "empty" && (
                <EmptyState
                    icon="calendar"
                    title="Nenhuma consulta agendada"
                    body="Quando você marcar uma consulta, ela aparecerá aqui com todos os detalhes e ações rápidas."
                    action="Agendar agora"
                    onAction={onSchedule}
                />
            )}
            {state === "loaded" && (
                <div>
                    {appointments.map((ap) => (
                        <AppointmentRow key={ap.id} ap={ap} />
                    ))}
                </div>
            )}
        </section>
    );
}
