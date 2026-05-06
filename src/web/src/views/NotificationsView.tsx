import type { Notification } from "../lib/types";
import * as api from "../lib/api";
import { relTime } from "../lib/utils";
import { PageHeader } from "../components/ui/PageHeader";

interface NotificationsViewProps {
    notifications: Notification[];
    setNotifications: (ns: Notification[]) => void;
}

export function NotificationsView({ notifications, setNotifications }: NotificationsViewProps) {
    const unreadCount = notifications.filter((n) => !n.read).length;

    const markRead = async (id: string) => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
        try {
            await api.markRead(id);
        } catch {
            setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: false } : n)));
        }
    };

    const markAllRead = async () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        try {
            await api.markAllRead();
        } catch {
            setNotifications(notifications.map((n) => ({ ...n, read: false })));
        }
    };

    return (
        <>
            <PageHeader
                eyebrow="notificações"
                title={`Tudo em <em>um lugar</em>.`}
                sub="Atualizações e avisos sobre suas consultas."
            />
            <section className="card">
                <div className="card-head">
                    <h3 className="card-title">
                        Todas as notificações{" "}
                        <span className="count">{notifications.length}</span>
                    </h3>
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
                            Marcar todas como lidas
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div
                        style={{
                            padding: "32px 0",
                            textAlign: "center",
                            fontSize: 13,
                            color: "var(--ink-muted)",
                        }}
                    >
                        Nenhuma notificação
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className="appt-row"
                            style={{
                                background: !n.read ? "var(--surface-2)" : "transparent",
                                display: "grid",
                                gridTemplateColumns: "8px 1fr auto",
                                gap: 12,
                                alignItems: "start",
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
                                        fontSize: 14,
                                        fontWeight: !n.read ? 500 : 400,
                                        color: !n.read ? "var(--ink)" : "var(--ink-3)",
                                    }}
                                >
                                    {n.title}
                                </div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: !n.read ? "var(--ink-2)" : "var(--ink-muted)",
                                        marginTop: 2,
                                    }}
                                >
                                    {n.message}
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: 6,
                                }}
                            >
                                <span style={{ fontSize: 11, color: "var(--ink-muted)", whiteSpace: "nowrap" }}>
                                    {relTime(n.createdAt)}
                                </span>
                                {!n.read && (
                                    <button
                                        onClick={() => markRead(n.id)}
                                        style={{
                                            fontSize: 11,
                                            color: "var(--accent)",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Marcar como lida
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </section>
        </>
    );
}
