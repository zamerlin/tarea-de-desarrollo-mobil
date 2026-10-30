import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';

export default function Login() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const result = await login({ email, password });
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.replace('/(tabs)/perfil');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>Volver</Text></Pressable>
        <Text style={styles.eyebrow}>MI CUENTA</Text>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.copy}>Ingresá para ver tus pedidos y guardar tus favoritos.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput style={styles.input} placeholder="Email @mail.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
        <Pressable style={styles.button} onPress={submit} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Ingresando…' : 'Ingresar'}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/registro')}><Text style={styles.link}>Crear una cuenta</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F4' },
  content: { padding: 24 },
  back: { color: '#1D2B3A', fontWeight: '700', marginBottom: 46 },
  eyebrow: { color: '#8B9299', fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },
  title: { color: '#1D2B3A', fontSize: 29, fontWeight: '800', marginTop: 7 },
  copy: { color: '#7D8790', lineHeight: 21, marginTop: 10, marginBottom: 24 },
  error: { color: '#B43D32', backgroundColor: '#FBE7E4', borderRadius: 10, padding: 12, marginBottom: 14 },
  input: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 12, color: '#1D2B3A' },
  button: { backgroundColor: '#1D2B3A', borderRadius: 26, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontWeight: '800' },
  link: { color: '#D9663D', fontWeight: '700', textAlign: 'center', marginTop: 22 },
});
