import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '../store';

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StoreProvider>
					<StatusBar style="dark" />
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(tabs)" />
						<Stack.Screen name="productos/[ID]" />
						<Stack.Screen name="productos/index" />
						<Stack.Screen name="carrito" />
						<Stack.Screen name="login" />
						<Stack.Screen name="registro" />
					</Stack>
				</StoreProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
