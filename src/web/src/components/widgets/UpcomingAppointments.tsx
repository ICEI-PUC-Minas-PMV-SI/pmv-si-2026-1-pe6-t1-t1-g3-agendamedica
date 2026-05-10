import { Ic } from "../../lib/icons";
import { fmtDate, STATUS_LABEL, STATUS_CLASS } from "../../lib/utils";
import type { Appointment, AppStatus } from "../../lib/types";
import { LoadingState } from "../states/LoadingState";
import { EmptyState } from "../states/EmptyState";
import { ErrorState } from "../states/ErrorState";

interface AppointmentRowProps {
    appointment: Appointment;
    currentUserRole?: string;
}

function AppointmentRow({ appointment, currentUserRole }: AppointmentRowProps) {
    const formattedDate = fmtDate(appointment.date);
    const appointmentDate = new Date(appointment.date);
    const todayDate = new Date();
    const isToday = appointmentDate.getDate() === todayDate.getDate() && appointmentDate.getMonth() === todayDate.getMonth() && appointmentDate.getFullYear() === todayDate.getFullYear();

    return (
        <div className="appt-row">
            <div className={`appt-date ${isToday ? "appt-today" : ""}`}>
                <span className="mo">{isToday ? "hoje" : formattedDate.mo}</span>
                <span className="d">{formattedDate.d}</span>
                <span className="dow">{formattedDate.dow}</span>
            </div>
            <div className="appt-body">
                <div className="appt-doctor">
                    {currentUserRole !== "PATIENT" ? appointment.patientName : appointment.doctor}
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
                    <span className="inline-ic">
                        {appointment.mode === "tele" ? <Ic.video size={13} /> : <Ic.mapPin size={13} />}
                        {appointment.clinic}
                    </span>
                </div>
            </div>
            <div className="appt-actions">
                {appointment.mode === "tele" && appointment.status === "PENDING" && (
                    <button className="btn btn-ghost btn-sm">
                        <Ic.video size={14} /> Entrar
                    </button>
                )}
                {appointment.status !== "CANCELLED" && (
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
    onSchedule?: () => void;
    currentUserRole?: string;
}

export function UpcomingAppointments({
    state,
    appointments,
    onRetry,
    onSchedule,
    currentUserRole,
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
                    action={currentUserRole !== "DOCTOR" ? "Agendar agora" : undefined}
                    onAction={currentUserRole !== "DOCTOR" ? onSchedule : undefined}
                />
            )}
            {state === "loaded" && (
                <div>
                    {appointments.map((appointment) => (
                        <AppointmentRow key={appointment.id} appointment={appointment} currentUserRole={currentUserRole} />
                    ))}
                </div>
            )}
        </section>
    );
}
