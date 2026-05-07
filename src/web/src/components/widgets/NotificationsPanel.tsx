import { useState } from "react";
import { Ic } from "../../lib/icons";
import { relTime } from "../../lib/utils";
import * as api from "../../lib/api";
import type { Notification, AppStatus, View } from "../../lib/types";
import { LoadingState } from "../states/LoadingState";
import { EmptyState } from "../states/EmptyState";
import { ErrorState } from "../states/ErrorState";

const PAGE_SIZE = 5;

interface NotificationItemProps {
    n: Notification;
    onMarkRead: () => void;
    onMarkUnread: () => void;
}

function NotificationItem({ n, onMarkRead, onMarkUnread }: NotificationItemProps) {
    return (
        <div className="notif-item" data-unread={!n.read} onClick={() => !n.read && onMarkRead()}>
            <div className="notif-dot" />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-msg">{n.message}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                <div className="notif-time">{relTime(n.createdAt)}</div>
                {n.read && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onMarkUnread(); }}
                        style={{
                            fontSize: 10,
                            color: "var(--ink-muted)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            whiteSpace: "nowrap",
                        }}
                    >
                        Marcar não lida
                    </button>
                )}
            </div>
        </div>
    );
}

interface NotificationsPanelProps {
    state: AppStatus;
    notifications: Notification[];
    setNotifications: (ns: Notification[]) => void;
    onRetry: () => void;
    onView: (v: View) => void;
}

export function NotificationsPanel({
    state,
    notifications,
    setNotifications,
    onRetry,
    onView,
}: NotificationsPanelProps) {
    const [tab, setTab] = useState<"unread" | "all">("unread");

    const unreadCount = notifications.filter((n) => !n.read).length;
    const filtered = tab === "unread" ? notifications.filter((n) => !n.read) : notifications;
    const visible = filtered.slice(0, PAGE_SIZE);
    const hasMore = filtered.length > PAGE_SIZE;

    const markAllRead = async () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        try {
            await api.markAllRead();
        } catch {
            setNotifications(notifications.map((n) => ({ ...n, read: false })));
        }
    };
    const markRead = async (id: string) => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
        try {
            await api.markRead(id);
        } catch {
            setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: false } : n)));
        }
    };
    const markUnread = async (id: string) => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: false } : n)));
        try {
            await api.markUnread(id);
        } catch {
            setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
        }
    };

    return (
        <section className="card">
            <div className="card-head">
                <h3 className="card-title">
                    Notificações
                    {state === "loaded" && unreadCount > 0 && (
                        <span className="count">{unreadCount} novas</span>
                    )}
                </h3>
                {state === "loaded" && unreadCount > 0 && (
                    <button className="card-action" onClick={markAllRead}>
                        <Ic.check size={12} /> Marcar lidas
                    </button>
                )}
            </div>

            {state === "loaded" && notifications.length > 0 && (
                <div className="notif-tabs">
                    <button
                        className="notif-tab"
                        data-active={tab === "unread"}
                        onClick={() => setTab("unread")}
                    >
                        Não lidas <span className="n">{unreadCount}</span>
                    </button>
                    <button
                        className="notif-tab"
                        data-active={tab === "all"}
                        onClick={() => setTab("all")}
                    >
                        Todas <span className="n">{notifications.length}</span>
                    </button>
                </div>
            )}

            {state === "loading" && <LoadingState rows={4} />}
            {state === "error" && <ErrorState onRetry={onRetry} />}
            {state === "empty" && (
                <EmptyState
                    icon="inbox"
                    title="Caixa vazia"
                    body="Você está em dia. Avisos sobre suas consultas aparecerão aqui."
                />
            )}
            {state === "loaded" && visible.length > 0 && (
                <div className="notif-list">
                    {visible.map((n) => (
                        <NotificationItem
                            key={n.id}
                            n={n}
                            onMarkRead={() => markRead(n.id)}
                            onMarkUnread={() => markUnread(n.id)}
                        />
                    ))}
                    {hasMore && (
                        <button
                            onClick={() => onView("notifications")}
                            style={{
                                width: "100%",
                                padding: "10px 16px",
                                fontSize: 12,
                                color: "var(--accent)",
                                background: "none",
                                border: "none",
                                borderTop: "1px solid var(--border)",
                                cursor: "pointer",
                                textAlign: "center",
                            }}
                        >
                            Ver todas as notificações ({filtered.length}) →
                        </button>
                    )}
                </div>
            )}
            {state === "loaded" && visible.length === 0 && (
                <EmptyState
                    icon="check"
                    title="Tudo em dia"
                    body="Não há notificações não lidas no momento."
                />
            )}
        </section>
    );
}
