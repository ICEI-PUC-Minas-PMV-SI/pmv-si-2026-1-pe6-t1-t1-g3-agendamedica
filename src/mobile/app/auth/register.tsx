import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/lib/tokens';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nome obrigatório.';
    if (!email.trim()) e.email = 'E-mail obrigatório.';
    if (cpf.replace(/\D/g, '').length < 11) e.cpf = 'CPF deve ter 11 dígitos.';
    if (password.length < 6) e.password = 'Senha deve ter no mínimo 6 caracteres.';
    return e;
  }

  async function handleRegister() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await register(name.trim(), email.trim(), cpf.replace(/\D/g, ''), password);
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : 'Erro ao criar conta.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>
              Cadastre-se para agendar consultas facilmente
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nome completo"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              placeholder="Seu nome"
              error={errors.name}
            />
            <Input
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="seu@email.com"
              error={errors.email}
              containerStyle={styles.gap}
            />
            <Input
              label="CPF"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
              placeholder="000.000.000-00"
              error={errors.cpf}
              containerStyle={styles.gap}
            />
            <Input
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              error={errors.password}
              containerStyle={styles.gap}
            />

            {errors.general ? (
              <Text style={styles.error}>{errors.general}</Text>
            ) : null}

            <Button
              label="Criar conta"
              onPress={handleRegister}
              loading={loading}
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.link}> Fazer login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
  },
  back: { marginBottom: spacing[6] },
  backText: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.accent,
  },
  header: { marginBottom: spacing[6] },
  title: {
    fontFamily: typography.displayFont,
    fontSize: typography.size['2xl'],
    color: colors.ink,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.base,
    color: colors.inkMuted,
    lineHeight: typography.size.base * typography.lineHeight.normal,
  },
  form: {},
  gap: { marginTop: spacing[4] },
  error: {
    marginTop: spacing[3],
    fontFamily: typography.bodyFont,
    fontSize: typography.size.sm,
    color: colors.danger,
  },
  submitBtn: { marginTop: spacing[6] },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing[6],
  },
  footerText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
  link: {
    fontFamily: typography.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.accent,
  },
});
