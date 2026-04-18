import React from 'react'
import { Ic } from '../../lib/icons'
import type { Activity } from '../../lib/types'

interface ActivityCardProps {
  activity: Activity[]
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const iconFor = (t: string) =>
    t === 'confirmed' ? 'check' : t === 'rescheduled' ? 'refresh' : 'sparkle'

  return (
    <section className="card">
      <div className="card-head">
        <h3 className="card-title">Atividade recente</h3>
      </div>
      <div className="activity-list">
        {activity.map(a => {
          const I = Ic[iconFor(a.type)]
          return (
            <div key={a.id} className="activity-item">
              <div className="activity-ic"><I size={13} /></div>
              <div className="activity-body"><div className="t">{a.text}</div></div>
              <div className="activity-time">{a.time}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
