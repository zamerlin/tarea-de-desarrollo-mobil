import { ActivityIndicator, Alert, Image, Platform, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../../store';
import styles from '../styles/perfilStyles';

export default function Perfil() {
  const { cart, favorites, user, ready, logout, changePhoto } = useStore();

  async function pickPhoto() {
    try {
      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permiso necesario', 'Permite el acceso a tus fotos para elegir una imagen de perfil.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: Platform.OS === 'web',
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        const uri = Platform.OS === 'web' && asset.base64
          ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
          : asset.uri;
        changePhoto(uri);
      }
    } catch (error) {
      console.error('Error al elegir una foto de perfil:', error);
      Alert.alert('No se pudo abrir la galería', 'Inténtalo de nuevo más tarde.');
    }
  }

  async function takePhoto() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso necesario', 'Permite el acceso a la cámara para tomar una foto de perfil.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: Platform.OS === 'web',
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        const uri = Platform.OS === 'web' && asset.base64
          ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
          : asset.uri;
        changePhoto(uri);
      }
    } catch (error) {
      console.error('Error al tomar una foto de perfil:', error);
      Alert.alert('No se pudo abrir la cámara', 'Inténtalo de nuevo más tarde.');
    }
  }

  function showPhotoOptions() {
    Alert.alert('Foto de perfil', 'Elige cómo agregar tu foto.', [
      { text: 'Tomar foto', onPress: takePhoto },
      { text: 'Elegir de la galería', onPress: pickPhoto },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>MI CUENTA</Text>
        <Text style={styles.title}>Tu perfil</Text>
        {!ready ? <ActivityIndicator accessibilityLabel="Cargando perfil" color="#1D2B3A" style={styles.avatar} /> : null}
        {ready && user ? <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cambiar foto de perfil"
            onPress={showPhotoOptions}
            style={styles.avatar}
          >
            {user.avatarUri
              ? <Image source={{ uri: user.avatarUri }} style={styles.avatarImage} />
              : <Text style={styles.avatarText}>{user.name.slice(0, 1).toUpperCase()}</Text>}
          </Pressable>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Pressable onPress={showPhotoOptions}><Text style={styles.changePhoto}>Cambiar foto</Text></Pressable>
        </> : null}
        {ready && !user ? <Pressable style={styles.loginButton} onPress={() => router.push('/login')}><Text style={styles.loginText}>Iniciar sesión</Text></Pressable> : null}
        <View style={styles.stats}><View><Text style={styles.number}>{cart.length}</Text><Text style={styles.label}>En carrito</Text></View><View><Text style={styles.number}>{favorites.length}</Text><Text style={styles.label}>Favoritos</Text></View><View><Text style={styles.number}>0</Text><Text style={styles.label}>Pedidos</Text></View></View>
        <View style={styles.menu}>{user && <Pressable onPress={logout}><Text style={[styles.menuItem, styles.logout]}>Cerrar sesión</Text></Pressable>}</View>
      </View>
    </SafeAreaView>
  );
}
