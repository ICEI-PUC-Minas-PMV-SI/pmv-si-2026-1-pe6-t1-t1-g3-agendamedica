import { Ic } from "../../lib/icons";
import type { IcName } from "../../lib/icons";
import type { View } from "../../lib/types";

interface BottomNavProps {
    view: View;
    currentUserRole: string;
    setView: (v: View) => void;
}

interface NavItem {
    id: View;
    label: string;
    icon: IcName;
}

const items: NavItem[] = [
    { id: "home", label: "Início", icon: "home" },
    { id: "schedule", label: "Agendar", icon: "calendarPlus" },
    { id: "appointments", label: "Consultas", icon: "calendar" },
    { id: "profile", label: "Perfil", icon: "user" },
];

export function BottomNav({ view, currentUserRole, setView }: BottomNavProps) {
    const visibleItems = items.filter(it => {
        if (currentUserRole === "DOCTOR" && it.id === "schedule") return false;
        return true;
    });

    return (
        <nav className="bottom-nav">
            {visibleItems.map((it) => {
                const Icon = Ic[it.icon];
                return (
                    <button
                        key={it.id}
                        className="bottom-nav-item"
                        data-active={view === it.id}
                        onClick={() => setView(it.id)}
                    >
                        <Icon size={20} />
                        <span>{it.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
