import { useState, useEffect, useRef } from "react";
import { Ic } from "../../lib/icons";
import type { User, View, Notification } from "../../lib/types";
import { NotificationDropdown } from "./NotificationDropdown";

interface HeaderProps {
    unauth?: boolean;
    notifications?: Notification[];
    setNotifications?: (ns: Notification[]) => void;
    user: User;
    view?: View;
    mode: "patient" | "professional"; // Novo
    onToggleMode: () => void;         // Novo
    setView?: (v: View) => void;
    onLogout?: () => void;
    onGoProfile?: () => void;
    onBrandClick?: () => void;
}

const viewLabels: Record<View, string> = {
    home: "Início",
    schedule: "Agendar",
    history: "Histórico",
    profile: "Perfil",
    appointments: "Minhas Consultas",
    notifications: "Notificações",
};

export function Header({
    unauth,
    notifications = [],
    setNotifications,
    user,
    view,
    mode,          // Destructuring
    onToggleMode,  // Destructuring
    setView,
    onLogout,
    onGoProfile,
    onBrandClick,
}: HeaderProps) {
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!dropOpen) return;
        const handler = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setDropOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [dropOpen]);

    // Estilo dinâmico para o Header dependendo do modo
    const isPro = mode === "professional";

    return (
        <header className={`app-header ${isPro ? "mode-pro" : ""}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                    className="brand"
                    onClick={onBrandClick}
                    style={{ cursor: onBrandClick ? "pointer" : undefined }}
                >
                    <div className="brand-mark">{isPro ? "P" : "M"}</div>
                    <span>medhub{isPro && <small className="pro-tag">PRO</small>}</span>
                </div>
                {!unauth && view && (
                    <div className="view-breadcrumb">
                        <Ic.chevron size={14} />
                        <span className="view-label">
                            {viewLabels[view]}
                        </span>
                    </div>
                )}
            </div>

            {!unauth && (
                <div className="header-search">
                    <Ic.search size={16} />
                    <input placeholder="Buscar médico, especialidade, consulta…" />
                    <input placeholder={isPro ? "Buscar paciente ou prontuário..." : "Buscar médico, especialidade..."} />
                    <kbd>⌘K</kbd>
                </div>
            )}

            <div className="header-right">
                <button 
                    className={`btn btn-sm ${isPro ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={onToggleMode}
                    style={{ marginRight: 8 }}
                >
                    {isPro ? "Visão Paciente" : "Para Profissionais"}
                </button>

                {!unauth && (
                    <>
                        <button className="icon-btn" title="Notificações">
                            <Ic.bell size={18} />
                            {notifCount != null && notifCount > 0 && (
                                <span className="badge-dot">{notifCount}</span>
                            )}
                        </button>
                        {setNotifications && setView && (
                            <NotificationDropdown
                                notifications={notifications}
                                setNotifications={setNotifications}
                                setView={setView}
                            />
                        )}

                        <div ref={dropRef} style={{ position: "relative" }}>
                            <button className="user-chip" onClick={() => setDropOpen((o) => !o)}>
                                <span className="avatar">{user.initials}</span>
                                <span className="name">{user.name.split(" ")[0]}</span>
                                <Ic.chevDown size={14} className="user-chip-chev" />
                            </button>

                            {dropOpen && (
                                <div className="dropdown-card card">
                                    <button className="drop-item" onClick={() => { onGoProfile?.(); setDropOpen(false); }}>
                                        <Ic.user size={15} /> Perfil
                                    </button>
                                    <button className="drop-item logout" onClick={() => { onLogout?.(); setDropOpen(false); }}>
                                        <Ic.arrow size={15} style={{ transform: "rotate(180deg)" }} /> Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}