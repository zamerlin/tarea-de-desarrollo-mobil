import { Link } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Image, PanResponder, Pressable, RefreshControl, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import styles from '../styles/favoritosStyles';

function EmptyFavorites({ loading, error, refresh }) {
  if (loading) {
    return <ActivityIndicator accessibilityLabel="Cargando favoritos" color="#1D2B3A" style={{ marginTop: 32 }} />;
  }

  if (error) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No se pudieron cargar los productos</Text>
        <Text style={styles.emptyCopy}>{error}</Text>
        <Pressable style={styles.button} onPress={refresh}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Todavía no guardaste nada</Text>
      <Text style={styles.emptyCopy}>Toca el corazón en un producto para verlo acá.</Text>
      <Link href="/(tabs)/home" asChild>
        <Pressable style={styles.button}><Text style={styles.buttonText}>Explorar productos</Text></Pressable>
      </Link>
    </View>
  );
}

function FavoriteRow({ item, isActive, onLayout, onDragStart, onDrop, onDelete, onAddToCart }) {
  const [translateY] = useState(() => new Animated.Value(0));
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) + Math.abs(dy) > 5,
    onPanResponderGrant: () => onDragStart(item.id),
    onPanResponderMove: (_, { dy }) => translateY.setValue(dy),
    onPanResponderRelease: (_, { dy }) => {
      const finalOffset = onDrop(item.id, dy);
      translateY.setValue(finalOffset);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderTerminate: () => {
      onDragStart(null);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderTerminationRequest: () => false,
  }), [item.id, onDragStart, onDrop, translateY]);

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        { transform: [{ translateY }] },
        isActive && styles.activeItem,
      ]}
    >
      <Swipeable
        renderRightActions={() => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Eliminar ${item.name} de favoritos`}
            style={styles.deleteAction}
            onPress={() => onDelete(item.id)}
          >
            <Text style={styles.deleteActionText}>Eliminar</Text>
          </Pressable>
        )}
      >
        <View style={styles.item}>
          <View {...panResponder.panHandlers} style={styles.dragHandle}>
            <Text style={styles.dragHandleText}>≡</Text>
          </View>
          <View style={[styles.art, { backgroundColor: item.color }]}>{item.image && <Image source={item.image} style={styles.image} resizeMode="cover" />}<Text style={{ color: item.accent, fontWeight: '800' }}>{item.category}</Text></View>
          <View style={styles.info}><Text style={styles.name}>{item.name}</Text><Text style={styles.price}>${item.price.toFixed(2)}</Text><Pressable onPress={() => onAddToCart(item.id)}><Text style={styles.add}>Agregar al carrito</Text></Pressable></View>
          <Pressable accessibilityRole="button" accessibilityLabel={`Quitar ${item.name} de favoritos`} onPress={() => onDelete(item.id)}><Text style={styles.remove}>♥</Text></Pressable>
        </View>
      </Swipeable>
    </Animated.View>
  );
}

export default function Favoritos() {
  const {
    favoriteProducts,
    favorites,
    favoritesLoading,
    loading: productsLoading,
    refreshing,
    error,
    refresh,
    toggleFavorite,
    addToCart,
    reorderFavorites,
  } = useStore();
  const [activeItem, setActiveItem] = useState(null);
  const itemLayouts = useRef(new Map());

  const onDrop = useCallback((itemId, dy) => {
    const sourceLayout = itemLayouts.current.get(itemId);
    if (!sourceLayout) {
      setActiveItem(null);
      return dy;
    }

    const dropCenter = sourceLayout.y + sourceLayout.height / 2 + dy;
    const targetIndex = favoriteProducts
      .filter((product) => product.id !== itemId)
      .filter((product) => {
        const layout = itemLayouts.current.get(product.id);
        return layout && layout.y + layout.height / 2 < dropCenter;
      }).length;
    const remaining = favoriteProducts.filter((product) => product.id !== itemId);
    const orderedProducts = [
      ...remaining.slice(0, targetIndex),
      favoriteProducts.find((product) => product.id === itemId),
      ...remaining.slice(targetIndex),
    ];
    const targetSlot = favoriteProducts[targetIndex];
    const destinationLayout = targetSlot && itemLayouts.current.get(targetSlot.id);
    const destinationY = destinationLayout?.y ?? sourceLayout.y;
    const finalOffset = sourceLayout.y + dy - destinationY;

    if (orderedProducts.some((product, index) => product.id !== favoriteProducts[index]?.id)) {
      reorderFavorites(orderedProducts.map((product) => product.id));
    }
    setActiveItem(null);
    return finalOffset;
  }, [favoriteProducts, reorderFavorites]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.title}>Favoritos</Text><Text style={styles.count}>{favorites.length} guardados</Text></View>
      <Text style={styles.hint}>Desliza para eliminar · Arrastra ≡ para reordenar</Text>
      {favoriteProducts.length > 0 && error ? (
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={styles.emptyCopy}>{error}</Text>
          <Pressable onPress={refresh}><Text style={styles.add}>Reintentar</Text></Pressable>
        </View>
      ) : null}
      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        scrollEnabled={!activeItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#1D2B3A" />}
        ListEmptyComponent={(
          <EmptyFavorites
            loading={favoritesLoading || productsLoading}
            error={error}
            refresh={refresh}
          />
        )}
        renderItem={({ item }) => (
          <FavoriteRow
            item={item}
            isActive={activeItem === item.id}
            onLayout={(event) => itemLayouts.current.set(item.id, event.nativeEvent.layout)}
            onDragStart={setActiveItem}
            onDrop={onDrop}
            onDelete={toggleFavorite}
            onAddToCart={addToCart}
          />
        )}
      />
    </SafeAreaView>
  );
}
