import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F4' },
  scrollContent: { paddingBottom: 36 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  back: { color: '#1D2B3A', fontWeight: '700' },
  heart: { color: '#E76F51', fontSize: 27 },
  art: { height: 480, marginHorizontal: 20, borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end', padding: 20 },
  image: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  category: { fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  content: { padding: 24 },
  name: { color: '#1D2B3A', fontSize: 28, fontWeight: '800' },
  price: { color: '#5B6670', fontSize: 19, marginTop: 8 },
  copy: { color: '#7D8790', lineHeight: 21, marginTop: 24 },
  button: { backgroundColor: '#1D2B3A', borderRadius: 28, paddingVertical: 17, alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});
