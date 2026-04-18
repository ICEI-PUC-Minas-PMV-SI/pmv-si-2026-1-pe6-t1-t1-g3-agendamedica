import { Ic } from '../lib/icons'

export function UnauthView() {
  return (
    <div className="unauth-wrap">
      <div className="unauth-hero">
        <div>
          <div className="page-eyebrow">medhub · saúde em um só lugar</div>
          <h1
            className="unauth-title"
            dangerouslySetInnerHTML={{
              __html: 'Agende consultas <em>com calma</em>, sem ligar para ninguém.',
            }}
          />
          <p className="unauth-sub">
            Encontre profissionais, escolha horários e receba lembretes automáticos. Presencial ou
            teleconsulta — do jeito que for melhor pra você.
          </p>
          <div className="unauth-actions">
            <button className="btn btn-primary btn-lg">Entrar</button>
            <button className="btn btn-secondary btn-lg">Criar conta gratuita</button>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 28, fontSize: 12.5, color: 'var(--ink-3)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Ic.shield size={14} style={{ color: 'var(--accent)' }} />
              Dados criptografados
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Ic.check size={14} style={{ color: 'var(--accent)' }} />
              LGPD compliant
            </span>
          </div>
        </div>
        <div className="unauth-visual" aria-hidden="true">
          {'/* hero art\n   paciente em\n   consulta */'}
        </div>
      </div>
    </div>
  )
}
