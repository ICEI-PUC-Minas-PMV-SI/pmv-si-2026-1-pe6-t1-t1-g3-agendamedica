import { useState } from 'react'
import type React from 'react'

interface RegisterViewProps {
  onRegister: (name: string, email: string, password: string) => void
  onGoLogin: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--ink)',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}

export function RegisterView({ onRegister, onGoLogin }: RegisterViewProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRegister(name, email, password)
  }

  return (
    <div className="unauth-wrap">
      <div style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="brand" style={{ justifyContent: 'center', marginBottom: 8 }}>
            <div className="brand-mark">M</div>
            <span>medhub</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, margin: 0, letterSpacing: '-0.01em' }}>
            Crie sua conta
          </h2>
          <p style={{ color: 'var(--ink-3)', fontSize: 14, marginTop: 6 }}>
            Grátis, rápido e sem burocracia
          </p>
        </div>

        <section className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>Nome completo</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>Confirmar senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4 }}>
              Criar conta
            </button>
          </form>
        </section>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--ink-3)', marginTop: 20 }}>
          Já tem conta?{' '}
          <button
            onClick={onGoLogin}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, padding: 0 }}
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  )
}
