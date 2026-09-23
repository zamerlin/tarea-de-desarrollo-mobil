import { router } from 'expo-router';
import { Alert, FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import styles from './styles/carritoStyles';

export default function Carrito() {
  const { cartProducts, removeFromCart, clearCart, user } = useStore();
  const total = cartProducts.reduce((sum, product) => sum + product.price, 0);

  function completePurchase() {
    if (!user) {
      router.push('/(tabs)/perfil');
      return;
    }
    clearCart();
    Alert.alert('Compra realizada', 'El carrito fue vaciado correctamente.');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Pressable onPress={() => router.back()}><Text style={styles.back}>Volver</Text></Pressable><Text style={styles.title}>Carrito</Text><View style={{ width: 44 }} /></View>
      <FlatList
        data={cartProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>Tu carrito esta vacio</Text><Text style={styles.copy}>Agrega productos desde el catalogo para empezar.</Text></View>}
        renderItem={({ item }) => <View style={styles.item}><View style={[styles.art, { backgroundColor: item.color }]}><Image source={item.image} style={styles.image} resizeMode="cover" /><Text style={{ color: item.accent, fontWeight: '800' }}>{item.category}</Text></View><View style={styles.info}><Text style={styles.name}>{item.name}</Text><Text style={styles.price}>${item.price.toFixed(2)}</Text></View><Pressable onPress={() => removeFromCart(item.id)}><Text style={styles.remove}>Quitar</Text></Pressable></View>}
        ListFooterComponent={cartProducts.length > 0 && <View style={styles.summary}><View style={styles.line}><Text style={styles.label}>Subtotal</Text><Text style={styles.total}>${total.toFixed(2)}</Text></View><View style={styles.line}><Text style={styles.label}>Envio</Text><Text style={styles.total}>Gratis</Text></View><Pressable style={styles.button} onPress={completePurchase}><Text style={styles.buttonText}>{user ? 'Continuar compra' : 'Iniciar sesión'}</Text></Pressable></View>}
      />
    </SafeAreaView>
  );
}

