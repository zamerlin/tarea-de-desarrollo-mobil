import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F4' },
  content: { padding: 24, alignItems: 'center' },
  eyebrow: { color: '#8B9299', fontSize: 10, letterSpacing: 1.5, fontWeight: '700', alignSelf: 'flex-start' },
  title: { color: '#1D2B3A', fontSize: 28, fontWeight: '800', alignSelf: 'flex-start', marginTop: 6 },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#B6D4CA', alignItems: 'center', justifyContent: 'center', marginTop: 28 },
  avatarImage: { width: 86, height: 86, borderRadius: 43 },
  avatarText: { color: '#1D4038', fontSize: 25, fontWeight: '800' },
  name: { color: '#1D2B3A', fontSize: 18, fontWeight: '800', marginTop: 12 },
  email: { color: '#8B9299', marginTop: 4 },
  changePhoto: { color: '#D9663D', fontSize: 12, fontWeight: '700', marginTop: 8 },
  loginButton: { backgroundColor: '#1D2B3A', borderRadius: 24, paddingHorizontal: 24, paddingVertical: 13, marginTop: 18 },
  loginText: { color: '#FFF', fontWeight: '800' },
  stats: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 18, marginTop: 28, textAlign: 'center' },
  number: { color: '#1D2B3A', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  label: { color: '#8B9299', fontSize: 11, marginTop: 4 },
  menu: { width: '100%', backgroundColor: '#FFF', borderRadius: 16, marginTop: 16, paddingHorizontal: 18 },
  menuItem: { color: '#1D2B3A', fontWeight: '600', paddingVertical: 17, borderBottomWidth: 1, borderBottomColor: '#EEF0F1' },
  logout: { color: '#D9663D' },
});
