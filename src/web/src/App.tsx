import { useState, useEffect } from 'react'
// Shell
import { Header } from './components/shell/Header'
import { Sidebar } from './components/shell/Sidebar'
import { BottomNav } from './components/shell/BottomNav'
// Views — autenticadas
import { HomeView } from './views/HomeView'
import { ScheduleView } from './views/ScheduleView'
import { HistoryView } from './views/HistoryView'
import { ProfileView } from './views/ProfileView'
import { AppointmentsView } from './views/AppointmentsView'
// Views — não autenticadas
import { UnauthView } from './views/UnauthView'
import { LoginView } from './views/LoginView'
import { RegisterView } from './views/RegisterView'
// API
import * as api from './lib/api'
// Types
import type { AppState, Appointment, AuthView, Notification, Theme, User, View } from './lib/types'

const DEFAULT_USER: User = {
  id: '',
  name: '',
  email: '',
  role: 'PATIENT',
  initials: '?',
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    theme: 'light',
    auth: 'unauth',
    authView: 'landing',
    view: 'home',
  })
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('data-density', 'comfortable')
    el.setAttribute('data-accent', 'teal')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appState.theme)
  }, [appState.theme])

  // Busca dados ao autenticar
  useEffect(() => {
    if (appState.auth !== 'patient') return
    Promise.all([api.fetchAppointments(), api.fetchNotifications()])
      .then(([appts, notifs]) => {
        setAppointments(appts)
        setNotifications(notifs)
      })
      .catch(console.error)
  }, [appState.auth])

  const setView = (v: View) => setAppState(prev => ({ ...prev, view: v }))
  const setAuthView = (v: AuthView) => setAppState(prev => ({ ...prev, authView: v }))
  const setTheme = (t: Theme) => setAppState(prev => ({ ...prev, theme: t }))

  const onLogin = async (email: string, password: string) => {
    const user = await api.login(email, password)
    setCurrentUser(user)
    setAppState(prev => ({ ...prev, auth: 'patient', view: 'home' }))
  }

  const onRegister = async (name: string, email: string, password: string) => {
    const user = await api.register(name, email, password)
    setCurrentUser(user)
    setAppState(prev => ({ ...prev, auth: 'patient', view: 'home' }))
  }

  const onLogout = () => {
    api.setToken('')
    setCurrentUser(DEFAULT_USER)
    setAppointments([])
    setNotifications([])
    setAppState(prev => ({ ...prev, auth: 'unauth', authView: 'landing' }))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const renderAuthView = () => {
    switch (appState.authView) {
      case 'login':
        return <LoginView onLogin={onLogin} onGoRegister={() => setAuthView('register')} />
      case 'register':
        return <RegisterView onRegister={onRegister} onGoLogin={() => setAuthView('login')} />
      default:
        return <UnauthView onGoLogin={() => setAuthView('login')} onGoRegister={() => setAuthView('register')} />
    }
  }

  const renderView = () => {
    switch (appState.view) {
      case 'schedule':
        return <ScheduleView />
      case 'history':
        return <HistoryView appointments={appointments} />
      case 'profile':
        return (
          <ProfileView
            user={currentUser}
            theme={appState.theme}
            onToggleTheme={() => setTheme(appState.theme === 'light' ? 'dark' : 'light')}
          />
        )
      case 'appointments':
        return <AppointmentsView appointments={appointments} />
      default:
        return (
          <HomeView
            state="loaded"
            appointments={appointments}
            notifications={notifications}
            setNotifications={setNotifications}
            user={currentUser}
            onRetry={() => {}}
            onSchedule={() => setView('schedule')}
            onView={setView}
          />
        )
    }
  }

  if (appState.auth === 'unauth') {
    return (
      <div className="app-shell" data-unauth="true">
        <Header unauth user={currentUser} onBrandClick={() => setAuthView('landing')} />
        <main className="app-main">
          <div className="app-main-inner">
            {renderAuthView()}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Header
        notifCount={unreadCount}
        user={currentUser}
        view={appState.view}
        setView={setView}
        onLogout={onLogout}
        onGoProfile={() => setView('profile')}
        onBrandClick={() => setView('home')}
      />
      <Sidebar view={appState.view} setView={setView} />
      <main className="app-main">
        <div className="app-main-inner">
          {renderView()}
        </div>
      </main>
      <BottomNav view={appState.view} setView={setView} />
    </div>
  )
}
