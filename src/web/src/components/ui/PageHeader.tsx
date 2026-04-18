import React from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  sub?: string
  children?: React.ReactNode
}

export function PageHeader({ eyebrow, title, sub, children }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h1 className="page-title" dangerouslySetInnerHTML={{ __html: title }} />
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {children && <div style={{ display: 'flex', gap: 10 }}>{children}</div>}
    </div>
  )
}
