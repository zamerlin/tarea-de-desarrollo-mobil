import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductGrid from '../../components/ProductGrid';
import { useStore } from '../../store';
import styles from '../styles/productsStyles';

export default function ProductsTab() {
  const { cart, products, loading, refreshing, error, refresh } = useStore();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos</Text>
        <Pressable style={styles.cartButton} onPress={() => router.push('/carrito')}>
          <Text style={styles.cartText}>Carrito {cart.length > 0 ? `(${cart.length})` : ''}</Text>
        </Pressable>
      </View>
      <ProductGrid
        products={products}
        loading={loading}
        refreshing={refreshing}
        error={error}
        refresh={refresh}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={styles.count}>{products.length} productos disponibles</Text>}
      />
    </SafeAreaView>
  );
}
