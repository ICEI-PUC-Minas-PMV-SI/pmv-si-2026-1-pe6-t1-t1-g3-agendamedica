import { Ic } from '../../lib/icons'

interface ErrorStateProps {
  title?: string
  body?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Não foi possível carregar',
  body = 'Verifique sua conexão e tente novamente em alguns instantes.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state">
      <div className="state-icon state-icon-err"><Ic.alertOct size={22} /></div>
      <h4 className="state-title">{title}</h4>
      <p className="state-body">{body}</p>
      <div className="state-actions">
        <button className="btn btn-secondary btn-sm" onClick={onRetry}>
          <Ic.refresh size={14} /> Tentar novamente
        </button>
      </div>
    </div>
  )
}
