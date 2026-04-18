import React from 'react'
import { Ic } from '../lib/icons'
import type { AppState } from '../lib/types'

interface TweaksPanelProps {
  open: boolean
  onClose: () => void
  tweaks: AppState
  setTweaks: (t: AppState) => void
}

const swatches = [
  { id: 'teal',   c: 'oklch(0.55 0.09 195)' },
  { id: 'indigo', c: 'oklch(0.55 0.14 265)' },
  { id: 'coral',  c: 'oklch(0.64 0.14 30)' },
  { id: 'forest', c: 'oklch(0.5 0.1 150)' },
] as const

export function TweaksPanel({ open, onClose, tweaks, setTweaks }: TweaksPanelProps) {
  const set = <K extends keyof AppState>(k: K, v: AppState[K]) =>
    setTweaks({ ...tweaks, [k]: v })

  return (
    <div className="tweaks" data-open={open}>
      <div className="tweaks-head">
        <span className="tweaks-title">Tweaks</span>
        <button className="icon-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
          <Ic.x size={14} />
        </button>
      </div>
      <div className="tweaks-body">

        <div className="tweak">
          <label className="tweak-label">Estado da página</label>
          <div className="seg">
            {(['loaded', 'loading', 'empty', 'error'] as const).map(s => (
              <button key={s} data-active={tweaks.state === s} onClick={() => set('state', s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="tweak">
          <label className="tweak-label">Autenticação</label>
          <div className="seg">
            <button data-active={tweaks.auth === 'patient'} onClick={() => set('auth', 'patient')}>
              Paciente
            </button>
            <button data-active={tweaks.auth === 'unauth'} onClick={() => set('auth', 'unauth')}>
              Não autenticado
            </button>
          </div>
        </div>

        <div className="tweak">
          <label className="tweak-label">View (reuso do layout)</label>
          <div className="seg">
            <button data-active={tweaks.view === 'home'} onClick={() => set('view', 'home')}>
              Home
            </button>
            <button data-active={tweaks.view === 'schedule'} onClick={() => set('view', 'schedule')}>
              Agendar
            </button>
            <button data-active={tweaks.view === 'appointments'} onClick={() => set('view', 'appointments')}>
              Consultas
            </button>
          </div>
          <div className="seg" style={{ marginTop: 4 }}>
            <button data-active={tweaks.view === 'history'} onClick={() => set('view', 'history')}>
              Histórico
            </button>
            <button data-active={tweaks.view === 'profile'} onClick={() => set('view', 'profile')}>
              Perfil
            </button>
          </div>
        </div>

        <div className="tweak">
          <label className="tweak-label">Tema</label>
          <div className="seg">
            <button data-active={tweaks.theme === 'light'} onClick={() => set('theme', 'light')}>
              Claro
            </button>
            <button data-active={tweaks.theme === 'dark'} onClick={() => set('theme', 'dark')}>
              Escuro
            </button>
          </div>
        </div>

        <div className="tweak">
          <label className="tweak-label">Densidade</label>
          <div className="seg">
            {(['compact', 'comfortable', 'spacious'] as const).map(d => (
              <button key={d} data-active={tweaks.density === d} onClick={() => set('density', d)}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="tweak">
          <label className="tweak-label">Cor de destaque</label>
          <div className="swatches">
            {swatches.map(sw => (
              <button
                key={sw.id}
                className="swatch"
                style={{ '--c': sw.c, background: sw.c } as React.CSSProperties}
                data-active={tweaks.accent === sw.id}
                onClick={() => set('accent', sw.id)}
                title={sw.id}
              />
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.5, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          Os estados <b>loading/vazio/erro</b> aplicam-se aos widgets de consultas e notificações.
        </div>
      </div>
    </div>
  )
}

export default TweaksPanel
