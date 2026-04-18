import React from 'react'
import { Ic } from '../../lib/icons'
import type { IcName } from '../../lib/icons'
import type { View } from '../../lib/types'

interface SidebarProps {
  view: View
  setView: (v: View) => void
}

interface PrimaryNavItem {
  id: View
  label: string
  icon: IcName
  tag?: string
}

interface AccountNavItem {
  id: View | 'settings'
  label: string
  icon: IcName
}

const primaryItems: PrimaryNavItem[] = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'schedule', label: 'Agendar', icon: 'calendarPlus' },
  { id: 'appointments', label: 'Minhas consultas', icon: 'calendar', tag: '3' },
  { id: 'history', label: 'Histórico', icon: 'history' },
]

const accountItems: AccountNavItem[] = [
  { id: 'profile', label: 'Perfil', icon: 'user' },
  { id: 'settings', label: 'Preferências', icon: 'settings' },
]

export function Sidebar({ view, setView }: SidebarProps) {
  return (
    <aside className="app-sidebar">
      <div className="nav-section-label">Atendimento</div>
      {primaryItems.map(it => {
        const Icon = Ic[it.icon]
        return (
          <button
            key={it.id}
            className="nav-item"
            data-active={view === it.id}
            onClick={() => setView(it.id)}
          >
            <Icon size={16} />
            <span>{it.label}</span>
            {it.tag && <span className="tag">{it.tag}</span>}
          </button>
        )
      })}
      <div className="nav-section-label">Conta</div>
      {accountItems.map(it => {
        const Icon = Ic[it.icon]
        const isView = it.id !== 'settings'
        return (
          <button
            key={it.id}
            className="nav-item"
            data-active={isView ? view === it.id : false}
            onClick={() => { if (isView) setView(it.id as View) }}
          >
            <Icon size={16} />
            <span>{it.label}</span>
          </button>
        )
      })}

      <div className="sidebar-footer" />
    </aside>
  )
}
