import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#1D2B3A',
      tabBarInactiveTintColor: '#9AA4AF',
      tabBarStyle: { height: 62 + insets.bottom, paddingBottom: insets.bottom + 8, paddingTop: 8 },
      tabBarLabelStyle: { fontSize: 12 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>⌂</Text> }} />
      <Tabs.Screen name="productos" options={{ title: 'Productos', tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>▦</Text> }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos', tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>♥</Text> }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>●</Text> }} />
      <Tabs.Screen name="home" options={{ href: null }} />
    </Tabs>
  );
}
