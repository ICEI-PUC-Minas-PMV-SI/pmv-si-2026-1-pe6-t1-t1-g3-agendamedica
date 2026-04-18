import { Ic, IcName } from '../../lib/icons'
import type { View } from '../../lib/types'

interface ShortcutsGridProps {
  onSchedule: () => void
  onView: (v: View) => void
}

interface ShortcutItem {
  id: string
  icon: IcName
  label: string
  sub: string
  go: () => void
}

export function ShortcutsGrid({ onSchedule, onView }: ShortcutsGridProps) {
  const items: ShortcutItem[] = [
    { id: 'schedule', icon: 'calendarPlus', label: 'Agendar',  sub: 'Nova consulta',      go: () => onSchedule() },
    { id: 'history',  icon: 'history',      label: 'Histórico', sub: '12 consultas',       go: () => onView('history') },
    { id: 'manage',   icon: 'calendar',     label: 'Gerenciar', sub: 'Remarcar · cancelar', go: () => onView('appointments') },
    { id: 'profile',  icon: 'user',         label: 'Perfil',    sub: 'Dados e saúde',      go: () => onView('profile') },
  ]

  return (
    <section className="card">
      <div className="card-head">
        <h3 className="card-title">Atalhos</h3>
      </div>
      <div className="shortcuts">
        {items.map(it => {
          const I = Ic[it.icon]
          return (
            <button key={it.id} className="shortcut" onClick={it.go}>
              <div className="shortcut-icon"><I size={16} /></div>
              <div>
                <div className="shortcut-label">{it.label}</div>
                <div className="shortcut-sub">{it.sub}</div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
