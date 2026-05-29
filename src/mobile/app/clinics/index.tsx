import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, ListRenderItem, Platform } from 'react-native';

// 1. Tipagem autossuficiente
interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
}

// 2. Cores padronizadas internamente
const colors = {
  bg: '#F3F4F6',
  surface: '#FFFFFF',
  ink: '#1F2937',
  inkMuted: '#6B7280',
  accent: '#0ea5e9',
  accentSoft: '#e0f2fe'
};

// 3. URL da API inteligente (mesma lógica que o grupo usou no api.ts)
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/clinics' : 'http://localhost:3000/clinics';

export default function ClinicsCrudScreen() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados do Formulário
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Listar Clínicas (GET via Fetch nativo)
  async function loadClinics() {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setClinics(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as clínicas do servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClinics();
  }, []);

  function handleEdit(clinic: Clinic) {
    setSelectedId(clinic.id);
    setName(clinic.name);
    setAddress(clinic.address);
    setPhone(clinic.phone);
    setIsFormOpen(true);
  }

  // Salvar Cadastro ou Edição (POST / PUT via Fetch nativo)
  async function handleSave() {
    if (!name || !address || !phone) {
      Alert.alert('Aviso', 'Por favor, preencha todos os campos.');
      return;
    }

    const clinicData = { name, address, phone };

    try {
      if (selectedId) {
        await fetch(`${API_URL}/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clinicData)
        });
        Alert.alert('Sucesso', 'Clínica atualizada com sucesso!');
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clinicData)
        });
        Alert.alert('Sucesso', 'Clínica cadastrada com sucesso!');
      }

      handleCloseForm();
      loadClinics();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar os dados da unidade.');
    }
  }

  function handleCloseForm() {
    setSelectedId(null);
    setName('');
    setAddress('');
    setPhone('');
    setIsFormOpen(false);
  }

  const renderClinicItem: ListRenderItem<Clinic> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.clinicName}>{item.name}</Text>
        <Text style={styles.clinicDetails}>📍 {item.address}</Text>
        <Text style={styles.clinicDetails}>📞 {item.phone}</Text>
      </View>
      <TouchableOpacity style={styles.buttonEdit} onPress={() => handleEdit(item)}>
        <Text style={styles.buttonEditText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && clinics.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFormOpen ? (
        <View style={styles.form}>
          <Text style={styles.title}>{selectedId ? '📝 Editar Unidade' : '➕ Nova Unidade de Saúde'}</Text>

          <Text style={styles.label}>Nome da Clínica</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Unidade Contagem" placeholderTextColor="#999" />

          <Text style={styles.label}>Endereço Completo</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Ex: Av. João César de Oliveira, 1200" placeholderTextColor="#999" />

          <Text style={styles.label}>Telefone de Contato</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Ex: (31) 3333-3333" keyboardType="phone-pad" placeholderTextColor="#999" />

          <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonCancel} onPress={handleCloseForm}>
            <Text style={styles.buttonTextCancel}>Voltar para Lista</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Gerenciar Clínicas</Text>
            <TouchableOpacity style={styles.buttonNew} onPress={() => setIsFormOpen(true)}>
              <Text style={styles.buttonText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={clinics}
            keyExtractor={(item) => item.id}
            renderItem={renderClinicItem}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.ink },
  form: { marginTop: 10 },
  label: { fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, color: colors.ink },
  card: { backgroundColor: colors.surface, padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  cardInfo: { flex: 1, paddingRight: 10 },
  clinicName: { fontSize: 16, fontWeight: 'bold', color: colors.ink },
  clinicDetails: { fontSize: 14, color: colors.inkMuted, marginTop: 4 },
  buttonNew: { backgroundColor: colors.accent, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  buttonSave: { backgroundColor: colors.accent, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 25 },
  buttonCancel: { backgroundColor: 'transparent', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#ccc' },
  buttonEdit: { backgroundColor: colors.accentSoft, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: colors.accent },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonTextCancel: { color: colors.inkMuted, fontWeight: 'bold', fontSize: 16 },
  buttonEditText: { color: colors.accent, fontWeight: 'bold', fontSize: 14 }
});
