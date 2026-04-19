import { Ic } from '../../lib/icons'
import type { User, View } from '../../lib/types'

interface HeaderProps {
  unauth?: boolean
  notifCount?: number
  user: User
  view?: View
  setView?: (v: View) => void
}

const viewLabels: Record<View, string> = {
  home: 'Início',
  schedule: 'Agendar',
  history: 'Histórico',
  profile: 'Perfil',
  appointments: 'Minhas Consultas',
}

export function Header({ unauth, notifCount, user, view }: HeaderProps) {
  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div className="brand">
          <div className="brand-mark">M</div>
          <span>medhub</span>
        </div>
        {!unauth && view && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-muted)', fontSize: 13 }}>
            <Ic.chevron size={14} />
            <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>
              {viewLabels[view]}
            </span>
          </div>
        )}
      </div>

      {!unauth && (
        <div className="header-search">
          <Ic.search size={16} />
          <input placeholder="Buscar médico, especialidade, consulta…" />
          <kbd>⌘K</kbd>
        </div>
      )}

      <div className="header-right">
        {unauth ? (
          <>
            <button className="btn btn-ghost btn-sm">Para profissionais</button>
            <button className="btn btn-secondary btn-sm">Entrar</button>
            <button className="btn btn-primary btn-sm">Criar conta</button>
          </>
        ) : (
          <>
            <button
              className="icon-btn"
              title="Notificações"
              data-active={false}
            >
              <Ic.bell size={18} />
              {notifCount != null && notifCount > 0 && (
                <span className="badge-dot">{notifCount}</span>
              )}
            </button>
            <button className="user-chip">
              <span className="avatar">{user.initials}</span>
              <span className="name">{user.name.split(' ')[0]}</span>
              <Ic.chevDown size={14} className="user-chip-chev" />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
