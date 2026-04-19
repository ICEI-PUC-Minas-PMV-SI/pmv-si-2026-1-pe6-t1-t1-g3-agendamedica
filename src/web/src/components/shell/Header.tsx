import { useState, useEffect, useRef } from "react";
import { Ic } from "../../lib/icons";
import type { User, View } from "../../lib/types";

interface HeaderProps {
    unauth?: boolean;
    notifCount?: number;
    user: User;
    view?: View;
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
};

export function Header({
    unauth,
    notifCount,
    user,
    view,
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

    return (
        <header className="app-header">
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                    className="brand"
                    onClick={onBrandClick}
                    style={{ cursor: onBrandClick ? "pointer" : undefined }}
                >
                    <div className="brand-mark">M</div>
                    <span>medhub</span>
                </div>
                {!unauth && view && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            color: "var(--ink-muted)",
                            fontSize: 13,
                        }}
                    >
                        <Ic.chevron size={14} />
                        <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>
                            {viewLabels[view]}
                        </span>
                    </div>
                )}
            </div>

            {!unauth && (
                <div className="header-search">
                    <Ic.search size={16} />
                    <input placeholder="Buscar médico, especialidade, consulta…" />
                    <kbd>⌘K</kbd>
                </div>
            )}

            <div className="header-right">
                {unauth ? (
                    <>
                        <button className="btn btn-ghost btn-sm">Para profissionais</button>
                    </>
                ) : (
                    <>
                        <button className="icon-btn" title="Notificações" data-active={false}>
                            <Ic.bell size={18} />
                            {notifCount != null && notifCount > 0 && (
                                <span className="badge-dot">{notifCount}</span>
                            )}
                        </button>

                        <div ref={dropRef} style={{ position: "relative" }}>
                            <button className="user-chip" onClick={() => setDropOpen((o) => !o)}>
                                <span className="avatar">{user.initials}</span>
                                <span className="name">{user.name.split(" ")[0]}</span>
                                <Ic.chevDown size={14} className="user-chip-chev" />
                            </button>

                            {dropOpen && (
                                <div
                                    className="card"
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 8px)",
                                        right: 0,
                                        minWidth: 160,
                                        padding: 6,
                                        zIndex: 100,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            onGoProfile?.();
                                            setDropOpen(false);
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            width: "100%",
                                            padding: "8px 10px",
                                            borderRadius: 6,
                                            border: "none",
                                            background: "none",
                                            color: "var(--ink)",
                                            fontSize: 13.5,
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background = "var(--surface-2)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = "none")
                                        }
                                    >
                                        <Ic.user size={15} />
                                        Perfil
                                    </button>
                                    <button
                                        onClick={() => {
                                            onLogout?.();
                                            setDropOpen(false);
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            width: "100%",
                                            padding: "8px 10px",
                                            borderRadius: 6,
                                            border: "none",
                                            background: "none",
                                            color: "var(--ink)",
                                            fontSize: 13.5,
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background = "var(--surface-2)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = "none")
                                        }
                                    >
                                        <Ic.arrow
                                            size={15}
                                            style={{ transform: "rotate(180deg)" }}
                                        />
                                        Sair
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
