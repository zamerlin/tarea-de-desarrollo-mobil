import { createContext, useContext, useMemo, useState } from 'react';

const productImages = {
  '1': require('./assets/products/digimon_our_war_game-CXZKWFI8.jpg'),
  '2': require('./assets/products/glass-no-hana-to-kowasu-sekai.jpg'),
  '3': require('./assets/products/gundam_00_trailblazer-C-sotOTx.jpg'),
  '4': require('./assets/products/kimi-no-na-wa.jpg'),
  '5': require('./assets/products/macross-f-itsuwari-no-utahime.jpg'),
  '6': require('./assets/products/violet_evergarden-DXlltCxv.jpg'),
  '7': require('./assets/products/macross-f-sayonara-no-tsubasa.jpg'),
  '8': require('./assets/products/macross_ai_oboete_imasuka-ZB5fwCX9.jpg'),
  '9': require('./assets/products/mobile-suit-gundam-gyakushuu-no-char.jpg'),
  '10': require('./assets/products/no_game_no_life_zero-Ci8OlDpr.jpg'),
  '11': require('./assets/products/pokemon-p01-mewtwo-vs-mew.jpg'),
  '12': require('./assets/products/pokemon-p20-yo-te-elijo.jpg'),
  '13': require('./assets/products/tengen-toppa-gurren-lagann-lagann-hen.jpg'),
  '14': require('./assets/products/tengen_toppa_gurren_lagann_gurren_hen-DbZclmGA.jpg'),
};

export const products = [
  { id: '1', name: 'Digimon Our War Game', category: 'Aventura', price: 50, image: productImages['1'], color: '#DCEBFF', accent: '#2D6CDF' },
  { id: '2', name: 'Glass no Hana to Kowasu Sekai', category: 'Romance', price: 51, image: productImages['2'], color: '#FCE5D7', accent: '#D9663D' },
  { id: '3', name: 'Gundam 00 Trailblazer', category: 'Mecha', price: 52, image: productImages['3'], color: '#E3F3E9', accent: '#388A5B' },
  { id: '4', name: 'Kimi no Na Wa', category: 'Drama', price: 53, image: productImages['4'], color: '#FFF0C7', accent: '#B57916' },
  { id: '5', name: 'Macross F: Itsuwari no Utahime', category: 'Sci-Fi', price: 54, image: productImages['5'], color: '#F0E2F8', accent: '#8650A8' },
  { id: '6', name: 'Violet Evergarden', category: 'Drama', price: 56, image: productImages['6'], color: '#E5E5E5', accent: '#4C5561' },
  { id: '7', name: 'Macross F: Sayonara no Tsubasa', category: 'Drama', price: 55, image: productImages['7'], color: '#DCEBFF', accent: '#2D6CDF' },
  { id: '8', name: 'Macross: Ai Oboete Imasuka', category: 'Mecha', price: 56, image: productImages['8'], color: '#FCE5D7', accent: '#D9663D' },
  { id: '9', name: 'Gundam Gyakushuu no Char', category: 'Mecha', price: 57, image: productImages['9'], color: '#E3F3E9', accent: '#388A5B' },
  { id: '10', name: 'No Game No Life Zero', category: 'Fantasía', price: 58, image: productImages['10'], color: '#FFF0C7', accent: '#B57916' },
  { id: '11', name: 'Pokemon: Mewtwo vs Mew', category: 'Aventura', price: 59, image: productImages['11'], color: '#F0E2F8', accent: '#8650A8' },
  { id: '12', name: 'Pokemon: Yo Te Elijo', category: 'Amistad', price: 60, image: productImages['12'], color: '#E5E5E5', accent: '#4C5561' },
  { id: '13', name: 'Gurren Lagann: Lagann Hen', category: 'Acción', price: 55, image: productImages['13'], color: '#DCEBFF', accent: '#2D6CDF' },
  { id: '14', name: 'Gurren Lagann: Gurren Hen', category: 'Heroico', price: 54, image: productImages['14'], color: '#FCE5D7', accent: '#D9663D' },
];

const StoreContext = createContext(null);

function validEmail(email) {
  return typeof email === 'string' && email.trim().toLowerCase().endsWith('@mail.com');
}

export function StoreProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  function login({ email, password }) {
    if (!validEmail(email)) return { success: false, message: 'El email debe terminar en @mail.com' };
    if (password.length <= 5) return { success: false, message: 'La contraseña debe tener más de 5 caracteres' };
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find((candidate) => candidate.email === normalizedEmail && candidate.password === password);
    if (!found) return { success: false, message: 'Email o contraseña incorrectos' };
    setUser({ name: found.name, email: found.email });
    return { success: true };
  }

  function register({ name, email, password, confirmPassword }) {
    if (!name.trim()) return { success: false, message: 'El nombre es obligatorio' };
    if (!validEmail(email)) return { success: false, message: 'El email debe terminar en @mail.com' };
    if (password.length <= 5) return { success: false, message: 'La contraseña debe tener más de 5 caracteres' };
    if (password !== confirmPassword) return { success: false, message: 'Las contraseñas no coinciden' };
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((candidate) => candidate.email === normalizedEmail)) return { success: false, message: 'El email ya está registrado' };
    setUsers((current) => [...current, { name: name.trim(), email: normalizedEmail, password }]);
    return { success: true };
  }

  function toggleFavorite(productId) {
    setFavorites((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  }

  function addToCart(productId) {
    setCart((current) => current.includes(productId) ? current : [...current, productId]);
  }

  function removeFromCart(productId) {
    setCart((current) => current.filter((id) => id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const value = useMemo(() => ({
    favorites,
    cart,
    user,
    login,
    logout: () => setUser(null),
    register,
    toggleFavorite,
    addToCart,
    removeFromCart,
    clearCart,
    favoriteProducts: products.filter((product) => favorites.includes(product.id)),
    cartProducts: products.filter((product) => cart.includes(product.id)),
  }), [favorites, cart, user, users]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore debe usarse dentro de StoreProvider');
  return context;
}
