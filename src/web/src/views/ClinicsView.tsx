import React, { useState, useEffect } from 'react';

export function ClinicsView({ setView, setEditingClinic }: { setView: (v: any) => void, setEditingClinic: (clinic: any) => void }) {
  const [clinics, setClinics] = useState<any[]>([]);

  // Busca as clínicas do servidor
  useEffect(() => {
    fetch('http://localhost:3001/clinics')
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("Erro ao buscar clínicas:", err));
  }, []);

  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'Fraunces', color: 'var(--ink)', fontSize: '2.5rem', marginBottom: '8px' }}>Unidades de Saúde</h1>
      <p style={{ fontFamily: 'Inter Tight', color: 'var(--ink-2)', marginBottom: '32px' }}>Gerenciamento de clínicas parceiras e pontos de atendimento MedHub.</p>

      <button className="btn-accent" style={{
        backgroundColor: 'var(--accent)', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none',
        fontFamily: 'Inter Tight', fontWeight: 'bold', cursor: 'pointer', marginBottom: '24px'
      }} onClick={() => {
        setEditingClinic(null);
        setView('create-clinic');
      }}>
        + Cadastrar Clínica
      </button>

      <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
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
            {clinics.map((clinic) => (
              <tr key={clinic.id} style={{ borderBottom: '1px solid var(--bg)', color: 'var(--ink)' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>{clinic.name}</td>
                <td style={{ padding: '16px' }}>{clinic.address}</td>
                <td style={{ padding: '16px', fontFamily: 'JetBrains Mono' }}>{clinic.phone}</td>
                <td style={{ padding: '16px' }}>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                    onClick={() => {
                      setEditingClinic(clinic); // Passa a clínica REAL com o ID dela
                      setView('edit-clinic');
                    }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
