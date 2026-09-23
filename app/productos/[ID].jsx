import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { products, useStore } from '../../store';
import styles from '../styles/productDetailStyles';

export default function ProductDetail() {
  const { ID } = useLocalSearchParams();
  const product = products.find((item) => item.id === ID);
  const { favorites, toggleFavorite, addToCart } = useStore();

  if (!product) return <SafeAreaView style={styles.safe}><Text>Producto no encontrado</Text></SafeAreaView>;
  const isFavorite = favorites.includes(product.id);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator>
        <View style={styles.header}><Pressable onPress={() => router.back()}><Text style={styles.back}>Volver</Text></Pressable><Pressable onPress={() => toggleFavorite(product.id)}><Text style={styles.heart}>{isFavorite ? '♥' : '♡'}</Text></Pressable></View>
        <View style={[styles.art, { backgroundColor: product.color }]}><Image source={product.image} style={styles.image} resizeMode="contain" /><Text style={[styles.category, { color: product.accent }]}>{product.category}</Text></View>
        <View style={styles.content}><Text style={styles.name}>{product.name}</Text><Text style={styles.price}>${product.price.toFixed(2)}</Text><Text style={styles.copy}>Una pieza pensada para acompañarte todos los dias. Diseño simple, materiales cuidados y la calidad que esperas.</Text><Pressable style={styles.button} onPress={() => addToCart(product.id)}><Text style={styles.buttonText}>Agregar al carrito</Text></Pressable></View>
      </ScrollView>
    </SafeAreaView>
  );
}

