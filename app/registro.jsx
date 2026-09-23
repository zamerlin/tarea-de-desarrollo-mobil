import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';

export default function Registro() {
  const { register } = useStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); }
  function submit() {
    const result = register(form);
    if (!result.success) return setError(result.message);
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>Volver</Text></Pressable>
        <Text style={styles.eyebrow}>NUEVA CUENTA</Text>
        <Text style={styles.title}>Registrate</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput style={styles.input} placeholder="Nombre" value={form.name} onChangeText={(value) => update('name', value)} />
        <TextInput style={styles.input} placeholder="Email @mail.com" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(value) => update('email', value)} />
        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={form.password} onChangeText={(value) => update('password', value)} />
        <TextInput style={styles.input} placeholder="Confirmar contraseña" secureTextEntry value={form.confirmPassword} onChangeText={(value) => update('confirmPassword', value)} />
        <Pressable style={styles.button} onPress={submit}><Text style={styles.buttonText}>Registrarme</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F4' },
  content: { padding: 24 },
  back: { color: '#1D2B3A', fontWeight: '700', marginBottom: 46 },
  eyebrow: { color: '#8B9299', fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },
  title: { color: '#1D2B3A', fontSize: 29, fontWeight: '800', marginTop: 7, marginBottom: 24 },
  error: { color: '#B43D32', backgroundColor: '#FBE7E4', borderRadius: 10, padding: 12, marginBottom: 14 },
  input: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 12, color: '#1D2B3A' },
  button: { backgroundColor: '#1D2B3A', borderRadius: 26, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontWeight: '800' },
});
