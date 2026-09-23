import { Link } from 'expo-router';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import styles from '../styles/favoritosStyles';

export default function Favoritos() {
  const { favoriteProducts, toggleFavorite, addToCart } = useStore();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.title}>Favoritos</Text><Text style={styles.count}>{favoriteProducts.length} guardados</Text></View>
      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>Todavia no guardaste nada</Text><Text style={styles.emptyCopy}>Toca el corazon en un producto para verlo aca.</Text><Link href="/(tabs)/home" asChild><Pressable style={styles.button}><Text style={styles.buttonText}>Explorar productos</Text></Pressable></Link></View>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={[styles.art, { backgroundColor: item.color }]}><Image source={item.image} style={styles.image} resizeMode="cover" /><Text style={{ color: item.accent, fontWeight: '800' }}>{item.category}</Text></View>
            <View style={styles.info}><Text style={styles.name}>{item.name}</Text><Text style={styles.price}>${item.price.toFixed(2)}</Text><Pressable onPress={() => addToCart(item.id)}><Text style={styles.add}>Agregar al carrito</Text></Pressable></View>
            <Pressable onPress={() => toggleFavorite(item.id)}><Text style={styles.remove}>♥</Text></Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

