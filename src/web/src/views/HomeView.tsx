import type { AppStatus, Appointment, Notification, Activity, View, User } from '../lib/types'
import { PageHeader } from '../components/ui/PageHeader'
import { HeroCTA } from '../components/widgets/HeroCTA'
import { UpcomingAppointments } from '../components/widgets/UpcomingAppointments'
import { ShortcutsGrid } from '../components/widgets/ShortcutsGrid'
import { NotificationsPanel } from '../components/widgets/NotificationsPanel'
import { ActivityCard } from '../components/widgets/ActivityCard'

interface StatRowProps {
  label: string
  value: string
  delta: string
  warn?: boolean
}

function StatRow({ label, value, delta, warn }: StatRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingTop: 10,
        borderTop: '1px solid var(--border)',
      }}
    >
      <div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{label}</div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            marginTop: 2,
          }}
        >
          {value}
        </div>
      </div>
      <div
        style={{
          fontSize: 11.5,
          color: warn ? 'var(--warn-ink)' : 'var(--ink-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {delta}
      </div>
    </div>
  )
}

export interface HomeViewProps {
  state: AppStatus
  appointments: Appointment[]
  notifications: Notification[]
  setNotifications: (ns: Notification[]) => void
  activity: Activity[]
  user: User
  onRetry: () => void
  onSchedule: () => void
  onView: (v: View) => void
}

export function HomeView({
  state,
  appointments,
  notifications,
  setNotifications,
  activity,
  user,
  onRetry,
  onSchedule,
  onView,
}: HomeViewProps) {
  const firstName = user.name.split(' ')[0]

  return (
    <>
      <PageHeader
        eyebrow={`paciente · ${user.id}`}
        title={`Olá, <em>${firstName}</em>.`}
        sub="Um panorama dos seus próximos passos em saúde, com ações rápidas a um clique."
      />
      <HeroCTA user={user} onSchedule={onSchedule} />
      <div style={{ height: 'var(--density-gap)' }} />
      <div className="home-grid">
        <div className="col">
          <UpcomingAppointments
            state={state}
            appointments={appointments}
            onRetry={onRetry}
            onSchedule={onSchedule}
          />
          <ShortcutsGrid onSchedule={onSchedule} onView={onView} />
          <ActivityCard activity={activity} />
        </div>
        <div className="col">
          <NotificationsPanel
            state={state}
            notifications={notifications}
            setNotifications={setNotifications}
            onRetry={onRetry}
          />
          <section className="card">
            <div className="card-head">
              <h3 className="card-title">Sua saúde em foco</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <StatRow label="Consultas este ano" value="7" delta="+2 vs. 2025" />
              <StatRow label="Última consulta" value="há 14 dias" delta="Clínico Geral" />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
