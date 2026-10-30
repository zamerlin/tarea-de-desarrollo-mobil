import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductGrid from '../../components/ProductGrid';
import { useStore } from '../../store';
import styles from '../styles/homeStyles';

export default function Index() {
  const { cart, products, loading, refreshing, error, refresh } = useStore();
  const featuredProducts = products.slice(0, 6);

  return (
    <SafeAreaView style={styles.safe}>
      <ProductGrid
        products={featuredProducts}
        loading={loading}
        refreshing={refreshing}
        error={error}
        refresh={refresh}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListHeaderComponent={(
          <View>
            <View style={styles.topbar}>
              <View>
                <Text style={styles.eyebrow}>MISIONES, ARG</Text>
                <Text style={styles.title}>Tienda Magica</Text>
              </View>
              <Link href="/carrito" asChild>
                <Pressable style={styles.cartButton}>
                  <Text style={styles.cartIcon}>Carrito</Text>
                  {cart.length > 0 && <Text style={styles.badge}>{cart.length}</Text>}
                </Pressable>
              </Link>
            </View>
            <View style={styles.banner}>
              <View>
                <Text style={styles.bannerTitle}>Bienvenidos</Text>
                <Text style={styles.bannerSmall}>La mejor magia</Text>
                <Text style={styles.bannerCopy}>Hasta 20% off en productos seleccionados</Text>
              </View>
              <Text style={styles.bannerMark}>20%</Text>
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Elegidos para vos</Text>
              <Link href="/(tabs)/productos" asChild>
                <Pressable><Text style={styles.count}>Ver todos</Text></Pressable>
              </Link>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
