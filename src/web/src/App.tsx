import { ClinicsView } from './views/ClinicsView';
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
import { CreateClinicView } from "./views/CreateClinicView";
import { AppointmentsView } from "./views/AppointmentsView";
import { NotificationsView } from "./views/NotificationsView";
import { DoctorDashboard } from "./views/DoctorView";
// Views — não autenticadas
import { UnauthView } from "./views/UnauthView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
// API
import * as api from "./lib/api";
// Types
import type { AppState, Appointment, AuthView, Doctor, Notification, Theme, User, View } from "./lib/types";

const DEFAULT_USER: User = {
    id: "",
    name: "",
    email: "",
    role: "PATIENT",
    initials: "?",
};

export default function App() {
    // Unificação dos estados iniciais para evitar erro de redeclaração
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
    const [rescheduleData, setRescheduleData] = useState<Appointment | null>(null);
    const [editingClinic, setEditingClinic] = useState<any>(null);

    useEffect(() => {
        const el = document.documentElement;
        el.setAttribute("data-density", "comfortable");
        el.setAttribute("data-accent", "teal");
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", appState.theme);
    }, [appState.theme]);

    useEffect(() => {
        if (appState.auth === "unauth") return;

        const loadData = () => {
            Promise.all([api.fetchAppointments(currentUser.id), api.fetchNotifications()])
                .then(([appts, notifs]) => {
                    setAppointments(appts);
                    setNotifications(notifs);
                })
                .catch(console.error);
        };

        loadData();
        const poll = setInterval(loadData, 60000); // Poll a cada 60s

        return () => clearInterval(poll);
    }, [appState.auth, currentUser]);

    const setView = (v: View) => setAppState((prev) => ({ ...prev, view: v }));
    const setAuthView = (v: AuthView) => setAppState((prev) => ({ ...prev, authView: v }));
    const setTheme = (t: Theme) => setAppState((prev) => ({ ...prev, theme: t }));

    const toggleMode = () => {
        setAppState((prev) => ({
            ...prev,
            mode: prev.mode === "patient" ? "professional" : "patient",
            authView: "landing",
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

    const onRegister = async (
        name: string,
        email: string,
        password: string,
        cpf: string,
        crm?: string,
        specialty?: string,
    ) => {
        const role = appState.mode === "professional" ? "DOCTOR" : "PATIENT";
        await api.register(name, email, password, cpf, role, crm, specialty);
    };

    const onLogout = () => {
        api.setToken("");
        setCurrentUser(DEFAULT_USER);
        setAppointments([]);
        setNotifications([]);
        setAppState((prev) => ({ ...prev, auth: "unauth", authView: "landing", mode: "patient" }));
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

    const renderView = () => {
        switch (appState.view) {
            case "clinics":
                return <ClinicsView setView={setView} setEditingClinic={setEditingClinic} />;
            case "create-clinic":
                return <CreateClinicView setView={setView} />;
            case "edit-clinic":
                return (
                    <CreateClinicView
                        setView={setView}
                        initialData={editingClinic}
                        isEditing={true}
                    />
                );
            case "schedule":
                return (
                    <ScheduleView
                        patientId={currentUser.id}
                        userName={currentUser.name}
                        currentUserRole={currentUser.role}
                        initialData={rescheduleData}
                        onAppointmentCreated={() => {
                            setRescheduleData(null);
                            api.fetchAppointments(currentUser.id).then(setAppointments).catch(console.error);
                        }}
                        onGoAppointments={() => {
                            setRescheduleData(null);
                            setView("appointments");
                        }}
                    />
                );
            case "history":
                return <HistoryView appointments={appointments} />;
            case "profile":
                return (
                    <ProfileView
                        user={currentUser}
                        theme={appState.theme}
                        onToggleTheme={() =>
                            setTheme(appState.theme === "light" ? "dark" : "light")
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
            case "appointments":
                return (
                    <AppointmentsView
                        appointments={appointments}
                        currentUserRole={currentUser.role}
                        onCancelled={(id) =>
                            setAppointments((prev) =>
                                prev.map((a) =>
                                    a.id === id ? { ...a, status: "CANCELLED" } : a,
                                ),
                            )
                        }
                        onConfirmed={(id) =>
                            setAppointments((prev) =>
                                prev.map((a) =>
                                    a.id === id ? { ...a, status: "CONFIRMED" } : a,
                                ),
                            )
                        }
                        onReschedule={(ap) => {
                            setRescheduleData(ap);
                            setView("schedule");
                        }}
                    />
                );
            default:
                if (currentUser.role === "DOCTOR") {
                    return (
                        <DoctorDashboard
                            user={currentUser as unknown as Doctor}
                            appointments={appointments}
                        />
                    );
                }
                return (
                    <HomeView
                        state="loaded"
                        appointments={appointments}
                        notifications={notifications}
                        setNotifications={setNotifications}
                        user={currentUser}
                        onRetry={() => {}}
                        onSchedule={() => {
                            setRescheduleData(null);
                            setView("schedule");
                        }}
                        onView={setView}
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
                setView={setView}
                onLogout={onLogout}
                onGoProfile={() => setView("profile")}
                onBrandClick={() => setView("home")}
                mode={appState.mode}
                onToggleMode={toggleMode}
            />
            <Sidebar
                view={appState.view}
                currentUserRole={currentUser.role}
                appointments={appointments}
                setView={(v) => {
                    if (v === "schedule") setRescheduleData(null);
                    setView(v);
                }}
            />
            <main className="app-main">
                <div className="app-main-inner">{renderView()}</div>
            </main>
            <BottomNav
                view={appState.view}
                currentUserRole={currentUser.role}
                setView={(v) => {
                    if (v === "schedule") setRescheduleData(null);
                    setView(v);
                }}
            />
        </div>
    );
}