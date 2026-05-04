import React from 'react';

export function ClinicsView() {
  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Regra 01: Títulos em Fraunces */}
      <h1 style={{ 
        fontFamily: 'Fraunces', 
        color: 'var(--ink)', 
        fontSize: '2.5rem', 
        marginBottom: '8px' 
      }}>
        Unidades de Saúde
      </h1>
      
      {/* Regra 02: Interface em Inter Tight */}
      <p style={{ fontFamily: 'Inter Tight', color: 'var(--ink-2)', marginBottom: '32px' }}>
        Gerenciamento de clínicas parceiras e pontos de atendimento MedHub.
      </p>

      {/* Ações com o tom Teal (Accent) oficial */}
      <div style={{ marginBottom: '24px' }}>
        <button className="btn-accent" style={{ 
          backgroundColor: 'var(--accent)', 
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '8px', 
          border: 'none',
          fontFamily: 'Inter Tight',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          + Cadastrar Clínica
        </button>
      </div>

      {/* Tabela dentro de um Card (Surface) */}
      <div style={{ 
        backgroundColor: 'var(--surface)', 
        borderRadius: '12px', 
        padding: '24px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter Tight' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--ink-2)', borderBottom: '1px solid var(--bg)' }}>
              <th style={{ padding: '16px' }}>Unidade</th>
              <th style={{ padding: '16px' }}>Endereço</th>
              <th style={{ padding: '16px' }}>Telefone</th>
              <th style={{ padding: '16px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--bg)', color: 'var(--ink)' }}>
              <td style={{ padding: '16px', fontWeight: '500' }}>Clínica Pedro I</td>
              <td style={{ padding: '16px' }}>Rua Exemplo, bairro Exemplo 123</td>
              {/* Regra 03: Dados técnicos em JetBrains Mono */}
              <td style={{ padding: '16px', fontFamily: 'JetBrains Mono' }}>(31) 99999-9999</td>
              <td style={{ padding: '16px' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}