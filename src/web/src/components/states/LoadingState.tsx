import React from 'react'

interface LoadingStateProps {
  rows?: number
}

export function LoadingState({ rows = 3 }: LoadingStateProps) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div className="sk-row" key={i}>
          <div className="sk" style={{ width: 56, height: 56 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="sk sk-line" style={{ width: '55%' }} />
            <div className="sk sk-line" style={{ width: '35%', height: 10 }} />
          </div>
          <div className="sk sk-line" style={{ width: 70, height: 22, borderRadius: 999 }} />
        </div>
      ))}
    </div>
  )
}
