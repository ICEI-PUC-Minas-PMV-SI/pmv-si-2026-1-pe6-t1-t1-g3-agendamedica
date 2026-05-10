import React, { useState } from 'react';

export function CreateClinicView({ setView, initialData, isEditing }: any) {
  const [name, setName] = useState(initialData?.name || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [phone, setPhone] = useState(initialData?.phone || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se estiver editando, usa a URL com ID e método PUT. Se não, usa POST.
    const url = isEditing
      ? `http://localhost:3001/clinics/${initialData.id}`
      : 'http://localhost:3001/clinics';

    try {
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, phone })
      });

      if (response.ok) {
        alert(isEditing ? 'Atualizado no servidor com sucesso!' : 'Cadastrado com sucesso!');
        setView('clinics');
      }
    } catch (error) {
      alert("Erro ao salvar! O Mock Server está ligado?");
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'Fraunces', color: 'var(--ink)', fontSize: '2.5rem' }}>
        {isEditing ? 'Editar Unidade' : 'Cadastrar Unidade'}
      </h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} required />
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Endereço" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} required />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefone" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} required />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            Salvar
          </button>
          <button type="button" onClick={() => setView('clinics')} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
