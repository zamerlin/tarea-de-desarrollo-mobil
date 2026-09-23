import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../../store';
import styles from '../styles/perfilStyles';

export default function Perfil() {
  const { cart, favorites, user, logout } = useStore();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>MI CUENTA</Text>
        <Text style={styles.title}>Tu perfil</Text>
        <View style={styles.avatar}><Text style={styles.avatarText}>MG</Text></View>
        {user ? <>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </> : <Pressable style={styles.loginButton} onPress={() => router.push('/login')}><Text style={styles.loginText}>Iniciar sesión</Text></Pressable>}
        <View style={styles.stats}><View><Text style={styles.number}>{cart.length}</Text><Text style={styles.label}>En carrito</Text></View><View><Text style={styles.number}>{favorites.length}</Text><Text style={styles.label}>Favoritos</Text></View><View><Text style={styles.number}>0</Text><Text style={styles.label}>Pedidos</Text></View></View>
        <View style={styles.menu}>{user && <Pressable onPress={logout}><Text style={[styles.menuItem, styles.logout]}>Cerrar sesión</Text></Pressable>}</View>
      </View>
    </SafeAreaView>
  );
}

