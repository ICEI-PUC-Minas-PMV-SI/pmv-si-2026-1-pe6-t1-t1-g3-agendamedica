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
import { UnauthView } from './views/UnauthView'
// Tweaks
import TweaksPanel from './tweaks/TweaksPanel'
// Data
import { USER, APPOINTMENTS, NOTIFICATIONS, ACTIVITY } from './lib/mockData'
// Types
import type { AppState, Notification, View } from './lib/types'

export default function App() {
  const [tweaks, setTweaks] = useState<AppState>({
    accent: 'teal',
    density: 'comfortable',
    theme: 'light',
    state: 'loaded',
    auth: 'patient',
    view: 'home',
  })
  const [tweaksOpen, setTweaksOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS)

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('data-accent', tweaks.accent)
    el.setAttribute('data-theme', tweaks.theme)
    el.setAttribute('data-density', tweaks.density)
  }, [tweaks.accent, tweaks.theme, tweaks.density])

  const setView = (v: View) => setTweaks(prev => ({ ...prev, view: v }))

  const unauth = tweaks.auth === 'unauth'
  const unreadCount = notifications.filter(n => !n.read).length
  const apptsForState = tweaks.state === 'empty' ? [] : APPOINTMENTS
  const notifsForState = tweaks.state === 'empty' ? [] : notifications
  const onRetry = () => setTweaks(prev => ({ ...prev, state: 'loaded' }))

  const renderView = () => {
    switch (tweaks.view) {
      case 'schedule':
        return <ScheduleView />
      case 'history':
        return <HistoryView appointments={APPOINTMENTS} />
      case 'profile':
        return <ProfileView user={USER} />
      case 'appointments':
        return <AppointmentsView appointments={APPOINTMENTS} />
      default:
        return (
          <HomeView
            state={tweaks.state}
            appointments={apptsForState}
            notifications={notifsForState}
            setNotifications={setNotifications}
            activity={ACTIVITY}
            user={USER}
            onRetry={onRetry}
            onSchedule={() => setView('schedule')}
            onView={setView}
          />
        )
    }
  }

  if (unauth) {
    return (
      <>
        <div className="app-shell" data-unauth="true">
          <Header unauth user={USER} />
          <main className="app-main">
            <div className="app-main-inner">
              <UnauthView />
            </div>
          </main>
        </div>
        <TweaksPanel
          open={tweaksOpen}
          onClose={() => setTweaksOpen(false)}
          tweaks={tweaks}
          setTweaks={setTweaks}
        />
      </>
    )
  }

  return (
    <>
      <div className="app-shell">
        <Header
          notifCount={unreadCount}
          user={USER}
          view={tweaks.view}
          setView={setView}
          onOpenTweaks={() => setTweaksOpen(true)}
        />
        <Sidebar view={tweaks.view} setView={setView} />
        <main className="app-main">
          <div className="app-main-inner">
            {renderView()}
          </div>
        </main>
        <BottomNav view={tweaks.view} setView={setView} />
      </div>
      <TweaksPanel
        open={tweaksOpen}
        onClose={() => setTweaksOpen(false)}
        tweaks={tweaks}
        setTweaks={setTweaks}
      />
    </>
  )
}
