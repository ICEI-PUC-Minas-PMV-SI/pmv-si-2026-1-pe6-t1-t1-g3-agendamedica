import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Ic } from "../../lib/icons";
import * as api from "../../lib/api";
import { relTime, useMediaQuery } from "../../lib/utils";
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
    const [sheetVisible, setSheetVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery("(max-width: 640px)");

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Trigger slide-up animation one frame after the sheet mounts
    useEffect(() => {
        if (open && isMobile) {
            const id = requestAnimationFrame(() => setSheetVisible(true));
            return () => cancelAnimationFrame(id);
        }
    }, [open, isMobile]);

    // Reset sheetVisible when viewport resizes from mobile to desktop
    useEffect(() => {
        if (!isMobile) {
            setSheetVisible(false);
            setOpen(false);
        }
    }, [isMobile]);

    const closeSheet = useCallback(() => setSheetVisible(false), []);

    // Click-outside + Escape for desktop dropdown
    useEffect(() => {
        if (!open || isMobile) return;
        const onMouse = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
    }, [open, isMobile]);

    // Escape for mobile sheet
    useEffect(() => {
        if (!open || !isMobile) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeSheet();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, isMobile, closeSheet]);

    // Called when the sheet's CSS transition ends; unmounts the sheet after slide-out
    const handleSheetTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && e.propertyName === "transform" && !sheetVisible)
            setOpen(false);
    };

    const markRead = async (id: string) => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
        try {
            await api.markRead(id);
        } catch (err) {
            setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: false } : n)));
            console.error("Falha ao marcar notificação como lida", err);
        }
    };

    const markAllRead = async () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        try {
            await api.markAllRead();
        } catch (err) {
            setNotifications(notifications.map((n) => ({ ...n, read: false })));
            console.error("Falha ao marcar todas as notificações como lidas", err);
        }
    };

    // Shared content rendered inside both the desktop dropdown and mobile sheet
    const renderContent = (onViewAll: () => void) => (
        <>
            <div
                style={{
                    padding: "14px 16px 12px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
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
                <div style={{ overflowY: "auto", flex: 1, minHeight: 0 }}>
                    {notifications.map((n) => (
                        <button
                            key={n.id}
                            type="button"
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
                                background: !n.read ? "var(--surface-2)" : "transparent",
                                border: "none",
                                width: "100%",
                                textAlign: "left",
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
                        </button>
                    ))}
                </div>
            )}

            <div style={{ padding: "10px 16px", textAlign: "center", flexShrink: 0 }}>
                <button
                    onClick={onViewAll}
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
        </>
    );

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

            {/* Desktop: absolute dropdown (unchanged) */}
            {!isMobile && open && (
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
                    {renderContent(() => {
                        setView("notifications");
                        setOpen(false);
                    })}
                </div>
            )}

            {/* Mobile: bottom sheet via portal */}
            {isMobile &&
                open &&
                createPortal(
                    <div
                        onClick={closeSheet}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0, 0, 0, 0.4)",
                            zIndex: 200,
                            opacity: sheetVisible ? 1 : 0,
                            transition: "opacity 320ms ease-out",
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            onTransitionEnd={handleSheetTransitionEnd}
                            style={{
                                position: "fixed",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "var(--surface)",
                                borderRadius: "16px 16px 0 0",
                                maxHeight: "75vh",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                zIndex: 201,
                                transform: sheetVisible ? "translateY(0)" : "translateY(100%)",
                                transition: "transform 320ms ease-out",
                            }}
                        >
                            {/* Drag handle (decorative) */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    padding: "12px 0 4px",
                                    flexShrink: 0,
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 4,
                                        borderRadius: 2,
                                        background: "var(--border)",
                                    }}
                                />
                            </div>
                            {renderContent(() => {
                                setView("notifications");
                                closeSheet();
                            })}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}
