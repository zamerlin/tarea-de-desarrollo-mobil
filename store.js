import { createContext, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { FavoritesProvider, useFavorites } from './contexts/FavoritesContext';
import { UserProvider, useUser } from './contexts/UserContext';
import useProducts from './hooks/useProducts';

const ProductsContext = createContext(null);
const CartContext = createContext(null);

function CartProvider({ children }) {
  const { products } = useContext(ProductsContext);
  const [cart, setCart] = useState([]);

  const value = useMemo(() => ({
    cart,
    addToCart(productId) {
      const isInCart = cart.includes(productId);
      setCart((current) => current.includes(productId) ? current : [...current, productId]);

      if (!isInCart) {
        const product = products.find((item) => item.id === productId);
        if (product) Alert.alert('Producto agregado al carrito', `${product.name} se agregó al carrito.`);
      }
    },
    removeFromCart(productId) {
      setCart((current) => current.filter((id) => id !== productId));
    },
    clearCart() {
      setCart([]);
    },
  }), [cart, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function StoreProvider({ children }) {
  const productState = useProducts();

  return (
    <ProductsContext.Provider value={productState}>
      <UserProvider>
        <FavoritesProvider products={productState.products}>
          <CartProvider>{children}</CartProvider>
        </FavoritesProvider>
      </UserProvider>
    </ProductsContext.Provider>
  );
}

export function useStore() {
  const productState = useContext(ProductsContext);
  const cartState = useContext(CartContext);
  const { favorites, loading: favoritesLoading, toggleFavorite, reorderFavorites } = useFavorites();
  const userState = useUser();

  if (!productState || !cartState) throw new Error('useStore debe usarse dentro de StoreProvider');

  const favoriteProducts = useMemo(() => (
    favorites
      .map((id) => productState.products.find((product) => product.id === id))
      .filter(Boolean)
  ), [favorites, productState.products]);
  const cartProducts = useMemo(() => (
    productState.products.filter((product) => cartState.cart.includes(product.id))
  ), [cartState.cart, productState.products]);

  return {
    ...productState,
    ...cartState,
    ...userState,
    favorites,
    favoritesLoading,
    toggleFavorite,
    reorderFavorites,
    favoriteProducts,
    cartProducts,
  };
}
