import { Ic } from "../../lib/icons";
import type { IcName } from "../../lib/icons";
import type { View, Appointment } from "../../lib/types";

interface SidebarProps {
    view: View;
    currentUserRole: string;
    appointments?: Appointment[];
    setView: (v: View) => void;
}

interface PrimaryNavItem {
    id: View;
    label: string;
    icon: IcName;
    tag?: string;
}

interface AccountNavItem {
    id: View | "settings";
    label: string;
    icon: IcName;
}

const primaryItems: PrimaryNavItem[] = [
    { id: "home", label: "Início", icon: "home" },
    { id: "schedule", label: "Agendar", icon: "calendarPlus" },
    { id: "appointments", label: "Minhas consultas", icon: "calendar" },
    { id: "history", label: "Histórico", icon: "history" },
    { id: "clinics", label: "Unidades de Saúde", icon: "mapPin" },
];

const accountItems: AccountNavItem[] = [
    { id: "profile", label: "Perfil", icon: "user" },
    { id: "settings", label: "Preferências", icon: "settings" },
];

export function Sidebar({ view, currentUserRole, appointments = [], setView }: SidebarProps) {
    const visiblePrimary = primaryItems.filter(it => {
        if (currentUserRole === "DOCTOR" && it.id === "schedule") return false;
        return true;
    });

    const pendingCount = appointments.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED").length;

    return (
        <aside className="app-sidebar">
            <div className="nav-section-label">Atendimento</div>
            {visiblePrimary.map((it) => {
                const Icon = Ic[it.icon];
                return (
                    <button
                        key={it.id}
                        className="nav-item"
                        data-active={view === it.id}
                        onClick={() => setView(it.id)}
                    >
                        <Icon size={16} />
                        <span>{it.label}</span>
                        {it.id === "appointments" && pendingCount > 0 && (
                            <span className="tag">{pendingCount}</span>
                        )}
                        {it.id !== "appointments" && it.tag && (
                            <span className="tag">{it.tag}</span>
                        )}
                    </button>
                );
            })}
            <div className="nav-section-label">Conta</div>
            {accountItems.map((it) => {
                const Icon = Ic[it.icon];
                return (
                    <button
                        key={it.id}
                        className="nav-item"
                        data-active={view === it.id}
                        onClick={() => setView(it.id as View)}
                    >
                        <Icon size={16} />
                        <span>{it.label}</span>
                    </button>
                );
            })}

            <div className="sidebar-footer" />
        </aside>
    );
}
