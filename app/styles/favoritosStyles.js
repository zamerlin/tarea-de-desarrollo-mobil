import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F4' },
  header: { padding: 24, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  title: { color: '#1D2B3A', fontSize: 28, fontWeight: '800' },
  count: { color: '#9AA4AF', fontSize: 12 },
  content: { padding: 20 },
  item: { backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  art: { width: 82, height: 82, borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-end', padding: 8 },
  image: { ...StyleSheet.absoluteFillObject, borderRadius: 12 },
  info: { flex: 1, gap: 5 },
  name: { color: '#1D2B3A', fontWeight: '800', fontSize: 15 },
  price: { color: '#5B6670' },
  add: { color: '#D9663D', fontWeight: '700', fontSize: 12 },
  remove: { color: '#E76F51', fontSize: 20, padding: 6 },
  empty: { alignItems: 'center', paddingTop: 130, paddingHorizontal: 30 },
  emptyTitle: { color: '#1D2B3A', fontSize: 19, fontWeight: '800' },
  emptyCopy: { color: '#7D8790', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  button: { backgroundColor: '#1D2B3A', borderRadius: 22, paddingHorizontal: 20, paddingVertical: 13, marginTop: 22 },
  buttonText: { color: '#FFF', fontWeight: '700' },
});
