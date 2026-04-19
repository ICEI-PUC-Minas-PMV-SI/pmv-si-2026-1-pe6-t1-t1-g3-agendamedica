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
// Data
import { USER, APPOINTMENTS, NOTIFICATIONS, ACTIVITY } from './lib/mockData'
// Types
import type { AppState, AuthView, Notification, Theme, User, View } from './lib/types'

function makeInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    theme: 'light',
    auth: 'unauth',
    authView: 'landing',
    view: 'home',
  })
  const [currentUser, setCurrentUser] = useState<User>(USER)
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS)

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('data-density', 'comfortable')
    el.setAttribute('data-accent', 'teal')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appState.theme)
  }, [appState.theme])

  const setView = (v: View) => setAppState(prev => ({ ...prev, view: v }))
  const setAuthView = (v: AuthView) => setAppState(prev => ({ ...prev, authView: v }))
  const setTheme = (t: Theme) => setAppState(prev => ({ ...prev, theme: t }))

  const onLogin = () => setAppState(prev => ({ ...prev, auth: 'patient', view: 'home' }))

  const onRegister = (name: string, email: string) => {
    setCurrentUser({
      id: 'mock-user',
      name,
      email,
      role: 'PATIENT',
      initials: makeInitials(name),
    })
    setAppState(prev => ({ ...prev, auth: 'patient', view: 'home' }))
  }

  const onLogout = () => {
    setCurrentUser(USER)
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
        return <HistoryView appointments={APPOINTMENTS} />
      case 'profile':
        return (
          <ProfileView
            user={currentUser}
            theme={appState.theme}
            onToggleTheme={() => setTheme(appState.theme === 'light' ? 'dark' : 'light')}
          />
        )
      case 'appointments':
        return <AppointmentsView appointments={APPOINTMENTS} />
      default:
        return (
          <HomeView
            state="loaded"
            appointments={APPOINTMENTS}
            notifications={notifications}
            setNotifications={setNotifications}
            activity={ACTIVITY}
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
