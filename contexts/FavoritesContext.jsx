import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';

const FAVORITES_KEY = '@mi-tienda/favorites';
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children, products }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readyToPersist, setReadyToPersist] = useState(false);
  const writes = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;

    async function restoreFavorites() {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          if (!Array.isArray(parsedFavorites) || !parsedFavorites.every((id) => typeof id === 'string')) {
            throw new Error('Los favoritos guardados tienen un formato inválido.');
          }
          if (active) setFavorites([...new Set(parsedFavorites)]);
        }
        if (active) setReadyToPersist(true);
      } catch (error) {
        console.error('Error al recuperar favoritos:', error);
        Alert.alert('No se pudieron recuperar los favoritos', 'Revisa el almacenamiento del dispositivo e inténtalo de nuevo.');
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreFavorites();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!readyToPersist) return;

    const serializedFavorites = JSON.stringify(favorites);
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(FAVORITES_KEY, serializedFavorites))
      .catch((error) => {
        console.error('Error al guardar favoritos:', error);
        Alert.alert('No se pudieron guardar los favoritos', 'Los cambios podrían no conservarse al cerrar la aplicación.');
      });
  }, [favorites, readyToPersist]);

  const toggleFavorite = useCallback((productId) => {
    const isFavorite = favorites.includes(productId);
    setReadyToPersist(true);
    setFavorites((current) => (
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    ));

    if (!isFavorite) {
      const product = products.find((item) => item.id === productId);
      if (product) Alert.alert('Producto agregado a favoritos', `${product.name} se agregó a tus favoritos.`);
    }
  }, [favorites, products]);

  const reorderFavorites = useCallback((orderedIds) => {
    setReadyToPersist(true);
    setFavorites((current) => {
      const reordered = orderedIds.filter((id, index) => (
        current.includes(id) && orderedIds.indexOf(id) === index
      ));
      const reorderedIds = new Set(reordered);
      return [...reordered, ...current.filter((id) => !reorderedIds.has(id))];
    });
  }, []);

  const value = useMemo(() => ({
    favorites,
    loading,
    toggleFavorite,
    reorderFavorites,
  }), [favorites, loading, toggleFavorite, reorderFavorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  return context;
}
