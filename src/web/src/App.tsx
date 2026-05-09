import { useState, useEffect } from "react";
// Shell
import { Header } from "./components/shell/Header";
import { Sidebar } from "./components/shell/Sidebar";
import { BottomNav } from "./components/shell/BottomNav";
// Views — autenticadas
import { HomeView } from "./views/HomeView";
import { ScheduleView } from "./views/ScheduleView";
import { HistoryView } from "./views/HistoryView";
import { ProfileView } from "./views/ProfileView";
import { AppointmentsView } from "./views/AppointmentsView";
import { DoctorDashboard } from "./views/DoctorDashboard";
import { NotificationsView } from "./views/NotificationsView";
// Views — não autenticadas
import { UnauthView } from "./views/UnauthView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
// API
import * as api from "./lib/api";
// Types
import type { AppState, Appointment, AuthView, Notification, Theme, User, View } from "./lib/types";

const DEFAULT_USER: User = {
    id: "",
    name: "",
    email: "",
    role: "PATIENT",
    initials: "?",
    cpf: "",
};

export default function App() {
    const [appState, setAppState] = useState<AppState>({
        theme: "light",
        auth: "unauth",
        authView: "landing",
        view: "home",
        mode: "patient",
    });

    const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const el = document.documentElement;
        el.setAttribute("data-density", "comfortable");
        el.setAttribute("data-accent", "teal");
        el.setAttribute("data-theme", appState.theme);
    }, [appState.theme]);

    useEffect(() => {
        if (appState.auth === "unauth") return;

        Promise.all([api.fetchAppointments(), api.fetchNotifications()])
            .then(([appts, notifs]) => {
                setAppointments(appts);
                setNotifications(notifs);
            })
            .catch(console.error);
    }, [appState.auth]);

    const setView = (v: View) => setAppState((prev) => ({ ...prev, view: v }));
    const setAuthView = (v: AuthView) => setAppState((prev) => ({ ...prev, authView: v }));
    const setTheme = (t: Theme) => setAppState((prev) => ({ ...prev, theme: t }));

    const toggleMode = () => {
        setAppState((prev) => ({
            ...prev,
            mode: prev.mode === "patient" ? "professional" : "patient",
            view: "home", 
        }));
    };

    const onLogin = async (email: string, password: string) => {
        const user = await api.login(email, password);
        setCurrentUser(user);
        
        const isStaff = user.role === "DOCTOR" || user.role === "RECEPTIONIST";
        setAppState((prev) => ({
            ...prev,
            auth: isStaff ? "professional" : "patient",
            mode: isStaff ? "professional" : "patient",
            view: "home",
        }));
    };

    const onRegister = async (name: string, email: string, password: string, cpf: string, _crm?: string, _specialty?: string) => {
        const user = await api.register(name, email, password, cpf);
            
        setCurrentUser(user);
        
        const isStaff = user.role === "DOCTOR" || user.role === "RECEPTIONIST";
        setAppState((prev) => ({ 
            ...prev, 
            auth: isStaff ? "professional" : "patient", 
            view: "home", 
            mode: isStaff ? "professional" : "patient" 
        }));
    };

    const onLogout = () => {
        api.setToken("");
        setCurrentUser(DEFAULT_USER);
        setAppointments([]);
        setNotifications([]);
        setAppState((prev) => ({ 
            ...prev, 
            auth: "unauth", 
            authView: "landing", 
            mode: "patient" 
        }));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const renderView = () => {
        if (appState.mode === "professional") {
            if (currentUser.role === "DOCTOR") {
                switch (appState.view) {
                    case "appointments":
                        return <DoctorDashboard user={currentUser} appointments={appointments} />;
                    case "profile":
                        return <ProfileView user={currentUser} theme={appState.theme} onToggleTheme={() => setTheme(appState.theme === "light" ? "dark" : "light")} />;
                    default:
                        return <DoctorDashboard user={currentUser} appointments={appointments} />;
                }
            }
            return <div className="card">Acesso restrito.</div>;
    const renderAuthView = () => {
        switch (appState.authView) {
            case "login":
                return <LoginView onLogin={onLogin} onGoRegister={() => setAuthView("register")} />;
            case "register":
                return (
                    <RegisterView onRegister={onRegister} onGoLogin={() => setAuthView("login")} />
                );
            default:
                return (
                    <UnauthView
                        onGoLogin={() => setAuthView("login")}
                        onGoRegister={() => setAuthView("register")}
                    />
                );
        }

        switch (appState.view) {
            case "schedule":
                return (
                    <ScheduleView
                        patientId={currentUser.id}
                        userName={currentUser.name}
                        onAppointmentCreated={() =>
                            api.fetchAppointments().then(setAppointments).catch(console.error)
                        }
                        onGoAppointments={() => setView("appointments")}
                    />
                );
            case "history":
                return <HistoryView appointments={appointments} />;
            case "profile":
                return <ProfileView user={currentUser} theme={appState.theme} onToggleTheme={() => setTheme(appState.theme === "light" ? "dark" : "light")} />;
            case "appointments": return <AppointmentsView appointments={appointments} />;
                return (
                    <ProfileView
                        user={currentUser}
                        theme={appState.theme}
                        onToggleTheme={() =>
                            setTheme(appState.theme === "light" ? "dark" : "light")
                        }
                    />
                );
            case "appointments":
                return (
                    <AppointmentsView
                        appointments={appointments}
                        onCancelled={(id) =>
                            setAppointments((prev) =>
                                prev.map((a) =>
                                    a.id === id ? { ...a, status: "CANCELLED" } : a,
                                ),
                            )
                        }
                    />
                );
            case "notifications":
                return (
                    <NotificationsView
                        notifications={notifications}
                        setNotifications={setNotifications}
                    />
                );
            default:
                return (
                    <HomeView
                        state="loaded"
                        appointments={appointments}
                        notifications={notifications}
                        setNotifications={setNotifications}
                        user={currentUser}
                        onRetry={() => {}}
                        onSchedule={() => setView("schedule")}
                        onView={setView}
                    />
                );
        }
    };

    const renderAuthView = () => {
        switch (appState.authView) {
            case "login":
                return <LoginView onLogin={onLogin} onGoRegister={() => setAuthView("register")} />;
            case "register":
                return (
                    <RegisterView 
                        onRegister={onRegister} 
                        onGoLogin={() => setAuthView("login")} 
                        mode={appState.mode} 
                    />
                );
            default:
                return (
                    <UnauthView
                        onGoLogin={() => setAuthView("login")}
                        onGoRegister={() => setAuthView("register")}
                    />
                );
        }
    };

    if (appState.auth === "unauth") {
        return (
            <div className="app-shell" data-unauth="true">
                <Header 
                    unauth 
                    user={currentUser} 
                    onBrandClick={() => setAuthView("landing")} 
                    mode={appState.mode} 
                    onToggleMode={toggleMode} 
                />
                <main className="app-main">
                    <div className="app-main-inner">{renderAuthView()}</div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Header
                notifications={notifications}
                setNotifications={setNotifications}
                user={currentUser}
                view={appState.view}
                mode={appState.mode}
                onToggleMode={toggleMode}
                setView={setView}
                onLogout={onLogout}
                onGoProfile={() => setView("profile")}
                onBrandClick={() => setView("home")}
            />
            {/* Sidebar atualizado com as novas props de controle */}
            <Sidebar 
                view={appState.view} 
                setView={setView} 
                userRole={currentUser.role}
                mode={appState.mode}
            />
            <main className="app-main">
                <div className="app-main-inner">{renderView()}</div>
            </main>
            <BottomNav view={appState.view} setView={setView} />
        </div>
    );
}