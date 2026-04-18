import { useState } from 'react'
import { Ic } from '../../lib/icons'
import { relTime } from '../../lib/utils'
import type { Notification, AppStatus } from '../../lib/types'
import { LoadingState } from '../states/LoadingState'
import { EmptyState } from '../states/EmptyState'
import { ErrorState } from '../states/ErrorState'

interface NotificationItemProps {
  n: Notification
  onClick: () => void
}

function NotificationItem({ n, onClick }: NotificationItemProps) {
  return (
    <div className="notif-item" data-unread={!n.read} onClick={onClick}>
      <div className="notif-dot" />
      <div>
        <div className="notif-title">{n.title}</div>
        <div className="notif-msg">{n.message}</div>
      </div>
      <div className="notif-time">{relTime(n.createdAt)}</div>
    </div>
  )
}

interface NotificationsPanelProps {
  state: AppStatus
  notifications: Notification[]
  setNotifications: (ns: Notification[]) => void
  onRetry: () => void
}

export function NotificationsPanel({
  state,
  notifications,
  setNotifications,
  onRetry,
}: NotificationsPanelProps) {
  const [tab, setTab] = useState<'unread' | 'all'>('unread')

  const unreadCount = notifications.filter(n => !n.read).length
  const visible = tab === 'unread' ? notifications.filter(n => !n.read) : notifications

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })))
  const markRead = (id: string) =>
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)))

  return (
    <section className="card">
      <div className="card-head">
        <h3 className="card-title">
          Notificações
          {state === 'loaded' && unreadCount > 0 && (
            <span className="count">{unreadCount} novas</span>
          )}
        </h3>
        {state === 'loaded' && unreadCount > 0 && (
          <button className="card-action" onClick={markAllRead}>
            <Ic.check size={12} /> Marcar lidas
          </button>
        )}
      </div>

      {state === 'loaded' && notifications.length > 0 && (
        <div className="notif-tabs">
          <button
            className="notif-tab"
            data-active={tab === 'unread'}
            onClick={() => setTab('unread')}
          >
            Não lidas <span className="n">{unreadCount}</span>
          </button>
          <button
            className="notif-tab"
            data-active={tab === 'all'}
            onClick={() => setTab('all')}
          >
            Todas <span className="n">{notifications.length}</span>
          </button>
        </div>
      )}

      {state === 'loading' && <LoadingState rows={4} />}
      {state === 'error' && <ErrorState onRetry={onRetry} />}
      {state === 'empty' && (
        <EmptyState
          icon="inbox"
          title="Caixa vazia"
          body="Você está em dia. Avisos sobre suas consultas aparecerão aqui."
        />
      )}
      {state === 'loaded' && visible.length > 0 && (
        <div className="notif-list">
          {visible.map(n => (
            <NotificationItem key={n.id} n={n} onClick={() => markRead(n.id)} />
          ))}
        </div>
      )}
      {state === 'loaded' && visible.length === 0 && (
        <EmptyState icon="check" title="Tudo em dia" body="Não há notificações não lidas no momento." />
      )}
    </section>
  )
}
