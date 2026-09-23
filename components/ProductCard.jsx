import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { useStore } from '../store';
import styles from '../app/styles/homeStyles';

export default function ProductCard({ product }) {
  const { favorites, toggleFavorite, addToCart } = useStore();
  const isFavorite = favorites.includes(product.id);

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/productos/${product.id}`)}>
      <View style={[styles.productArt, { backgroundColor: product.color }]}>
        <Image source={product.image} style={styles.productImage} resizeMode="contain" />
        <Text style={[styles.artLabel, { color: product.accent }]}>{product.category}</Text>
        <Pressable style={styles.heart} onPress={() => toggleFavorite(product.id)} hitSlop={8}>
          <Text style={[styles.heartText, isFavorite && styles.favoriteText]}>{isFavorite ? '♥' : '♡'}</Text>
        </Pressable>
      </View>
      <Text style={styles.productName}>{product.name}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Pressable style={styles.addButton} onPress={() => addToCart(product.id)}>
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
