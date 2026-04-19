import { useState, useEffect } from 'react'
// Shell
import { Header } from './components/shell/Header'
import { Sidebar } from './components/shell/Sidebar'
import { BottomNav } from './components/shell/BottomNav'
// Views
import { HomeView } from './views/HomeView'
import { ScheduleView } from './views/ScheduleView'
import { HistoryView } from './views/HistoryView'
import { ProfileView } from './views/ProfileView'
import { AppointmentsView } from './views/AppointmentsView'
// Data
import { USER, APPOINTMENTS, NOTIFICATIONS, ACTIVITY } from './lib/mockData'
// Types
import type { AppState, Notification, Theme, View } from './lib/types'

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    theme: 'light',
    view: 'home',
  })
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
  const setTheme = (t: Theme) => setAppState(prev => ({ ...prev, theme: t }))

  const unreadCount = notifications.filter(n => !n.read).length

  const renderView = () => {
    switch (appState.view) {
      case 'schedule':
        return <ScheduleView />
      case 'history':
        return <HistoryView appointments={APPOINTMENTS} />
      case 'profile':
        return (
          <ProfileView
            user={USER}
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
            user={USER}
            onRetry={() => {}}
            onSchedule={() => setView('schedule')}
            onView={setView}
          />
        )
    }
  }

  return (
    <div className="app-shell">
      <Header
        notifCount={unreadCount}
        user={USER}
        view={appState.view}
        setView={setView}
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
