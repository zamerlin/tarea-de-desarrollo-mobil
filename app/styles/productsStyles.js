import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F4' },
  header: { padding: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { color: '#1D2B3A', fontWeight: '700' },
  title: { color: '#1D2B3A', fontSize: 24, fontWeight: '800' },
  count: { color: '#9AA4AF', fontSize: 12 },
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  row: { gap: 14 },
  cartButton: { backgroundColor: '#1D2B3A', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9 },
  cartText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
});
