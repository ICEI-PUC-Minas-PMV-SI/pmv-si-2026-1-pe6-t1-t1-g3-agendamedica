import { useState } from 'react'
import type { User } from '../lib/types'
import { PageHeader } from '../components/ui/PageHeader'

interface ProfileViewProps {
  user: User
}

interface SummaryRowProps {
  label: string
  value: string
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderTop: '1px solid var(--border)',
      }}
    >
      <span style={{ color: 'var(--ink-3)' }}>{label}</span>
      <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

interface PrefRowProps {
  label: string
  on?: boolean
}

function PrefRow({ label, on }: PrefRowProps) {
  const [v, setV] = useState(!!on)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderTop: '1px solid var(--border)',
      }}
    >
      <span style={{ fontSize: 13.5 }}>{label}</span>
      <button
        onClick={() => setV(!v)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          border: 'none',
          background: v ? 'var(--accent)' : 'var(--border-strong)',
          position: 'relative',
          transition: 'background 120ms',
        }}
        aria-pressed={v}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: v ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: 999,
            background: 'white',
            transition: 'left 140ms',
            boxShadow: '0 1px 2px rgba(0,0,0,.2)',
          }}
        />
      </button>
    </div>
  )
}

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <>
      <PageHeader
        eyebrow="perfil"
        title={`Seus <em>dados</em>.`}
        sub="Mantenha suas informações atualizadas para agilizar agendamentos e receber avisos no canal certo."
      />
      <div className="home-grid">
        <div className="col">
          <section className="card">
            <div className="card-head">
              <h3 className="card-title">Identidade</h3>
              <button className="card-action">Editar</button>
            </div>
            <div
              style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 18 }}
            >
              <span className="avatar avatar-lg">{user.initials}</span>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {user.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Paciente desde mar/2024</div>
              </div>
            </div>
            <SummaryRow label="E-mail" value={user.email} />
            <SummaryRow label="CPF" value="•••.•••.321-00" />
            <SummaryRow label="Telefone" value="(31) 9•••• 4412" />
            <SummaryRow label="Nascimento" value="14 jul 1992" />
          </section>
        </div>
        <div className="col">
          <section className="card">
            <div className="card-head">
              <h3 className="card-title">Preferências de aviso</h3>
            </div>
            <PrefRow label="Push (app mobile)" on />
            <PrefRow label="E-mail" on />
            <PrefRow label="SMS" />
            <PrefRow label="Lembretes 24h antes" on />
          </section>
        </div>
      </div>
    </>
  )
}
