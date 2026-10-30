import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import ProductCard from './ProductCard';

function EmptyState({ loading, error, onRetry }) {
  if (loading) {
    return <ActivityIndicator accessibilityLabel="Cargando productos" color="#1D2B3A" style={{ marginTop: 32 }} />;
  }

  if (error) {
    return (
      <View style={{ alignItems: 'center', padding: 24 }}>
        <Text style={{ color: '#B43D32', textAlign: 'center' }}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={{ backgroundColor: '#1D2B3A', borderRadius: 22, marginTop: 16, paddingHorizontal: 20, paddingVertical: 12 }}
        >
          <Text style={{ color: '#FFF', fontWeight: '700' }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center', padding: 24 }}>
      <Text style={{ color: '#1D2B3A', fontWeight: '700', textAlign: 'center' }}>
        Todavía no hay productos en la colección objetos de MockAPI.
      </Text>
      <Text style={{ color: '#7D8790', marginTop: 8, textAlign: 'center' }}>
        Agregá productos en MockAPI y desliza hacia abajo para actualizar.
      </Text>
    </View>
  );
}

function InlineError({ error, onRetry }) {
  if (!error) return null;

  return (
    <View style={{ alignItems: 'center', paddingBottom: 20 }}>
      <Text style={{ color: '#B43D32', textAlign: 'center' }}>{error}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={{ backgroundColor: '#1D2B3A', borderRadius: 22, marginTop: 12, paddingHorizontal: 20, paddingVertical: 10 }}
      >
        <Text style={{ color: '#FFF', fontWeight: '700' }}>Reintentar</Text>
      </Pressable>
    </View>
  );
}

export default function ProductGrid({
  products,
  loading,
  refreshing,
  error,
  refresh,
  contentContainerStyle,
  columnWrapperStyle,
  ListHeaderComponent,
}) {
  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      columnWrapperStyle={columnWrapperStyle}
      contentContainerStyle={contentContainerStyle}
      ListHeaderComponent={(
        <>
          {ListHeaderComponent}
          {products.length > 0 && <InlineError error={error} onRetry={refresh} />}
        </>
      )}
      ListEmptyComponent={<EmptyState loading={loading} error={error} onRetry={refresh} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#1D2B3A" />}
    />
  );
}
