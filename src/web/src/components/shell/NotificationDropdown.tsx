import { useState, useEffect, useRef } from "react";
import { Ic } from "../../lib/icons";
import * as api from "../../lib/api";
import { relTime } from "../../lib/utils";
import type { Notification, View } from "../../lib/types";

interface NotificationDropdownProps {
    notifications: Notification[];
    setNotifications: (ns: Notification[]) => void;
    setView: (v: View) => void;
}

export function NotificationDropdown({
    notifications,
    setNotifications,
    setView,
}: NotificationDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        if (!open) return;
        const onMouse = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onMouse);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onMouse);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const markRead = async (id: string) => {
        try {
            await api.markRead(id);
            setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
        } catch (err) {
            console.error("Falha ao marcar notificação como lida", err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.markAllRead();
            setNotifications(notifications.map((n) => ({ ...n, read: true })));
        } catch (err) {
            console.error("Falha ao marcar todas as notificações como lidas", err);
        }
    };

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                className="icon-btn"
                title="Notificações"
                data-active={open || undefined}
                onClick={() => setOpen((o) => !o)}
            >
                <Ic.bell size={18} />
                {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
            </button>

            {open && (
                <div
                    className="card"
                    style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        width: 320,
                        padding: 0,
                        zIndex: 100,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            padding: "14px 16px 12px",
                            borderBottom: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                            Notificações
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                style={{
                                    fontSize: 12,
                                    color: "var(--accent)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                }}
                            >
                                Marcar todas lidas
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div
                            style={{
                                padding: "24px 16px",
                                textAlign: "center",
                                fontSize: 13,
                                color: "var(--ink-muted)",
                            }}
                        >
                            Nenhuma notificação
                        </div>
                    ) : (
                        <div style={{ maxHeight: 320, overflowY: "auto" }}>
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    data-unread={!n.read || undefined}
                                    onClick={() => !n.read && markRead(n.id)}
                                    style={{
                                        padding: "12px 16px",
                                        borderBottom: "1px solid var(--border)",
                                        display: "grid",
                                        gridTemplateColumns: "8px 1fr auto",
                                        gap: 10,
                                        alignItems: "start",
                                        cursor: !n.read ? "pointer" : "default",
                                        background: !n.read ? "var(--surface-2)" : undefined,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            background: !n.read ? "var(--accent)" : "transparent",
                                            marginTop: 4,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                fontWeight: !n.read ? 500 : 400,
                                                color: !n.read ? "var(--ink)" : "var(--ink-3)",
                                                lineHeight: 1.35,
                                            }}
                                        >
                                            {n.title}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: !n.read ? "var(--ink-2)" : "var(--ink-muted)",
                                                marginTop: 2,
                                            }}
                                        >
                                            {n.message}
                                        </div>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            color: "var(--ink-muted)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {relTime(n.createdAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ padding: "10px 16px", textAlign: "center" }}>
                        <button
                            onClick={() => {
                                setView("home");
                                setOpen(false);
                            }}
                            style={{
                                fontSize: 12,
                                color: "var(--accent)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px 0",
                            }}
                        >
                            Ver todas as notificações →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
