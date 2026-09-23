import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import { products, useStore } from '../../store';
import styles from '../styles/productsStyles';

export default function ProductsTab() {
  const { cart } = useStore();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos</Text>
        <Pressable style={styles.cartButton} onPress={() => router.push('/carrito')}>
          <Text style={styles.cartText}>Carrito {cart.length > 0 ? `(${cart.length})` : ''}</Text>
        </Pressable>
      </View>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={styles.count}>{products.length} productos disponibles</Text>}
      />
    </SafeAreaView>
  );
}
