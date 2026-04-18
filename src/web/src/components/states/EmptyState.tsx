import React from 'react'
import { Ic, IcName } from '../../lib/icons'

interface EmptyStateProps {
  icon?: IcName
  title: string
  body: string
  action?: string
  onAction?: () => void
}

export function EmptyState({ icon = 'inbox', title, body, action, onAction }: EmptyStateProps) {
  const I = Ic[icon]
  return (
    <div className="state">
      <div className="state-icon"><I size={22} /></div>
      <h4 className="state-title">{title}</h4>
      <p className="state-body">{body}</p>
      {action && (
        <div className="state-actions">
          <button className="btn btn-primary btn-sm" onClick={onAction}>{action}</button>
        </div>
      )}
    </div>
  )
}
