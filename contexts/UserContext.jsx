import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';

const USER_KEY = '@mi-tienda/profile';
const USERS_URL = 'https://6ae4f63a28393034b08e0e91.mockapi.io/api/tienda-magica/usuario';
const UserContext = createContext(null);

function isValidProfile(profile) {
  return profile
    && typeof profile.name === 'string'
    && typeof profile.email === 'string'
    && (profile.avatarUri === null || typeof profile.avatarUri === 'string');
}

function validEmail(email) {
  return typeof email === 'string' && email.trim().toLowerCase().endsWith('@mail.com');
}

async function fetchUsers() {
  const response = await fetch(USERS_URL);
  if (!response.ok) {
    throw new Error(`No se pudieron consultar los usuarios (HTTP ${response.status}).`);
  }

  const users = await response.json();
  if (!Array.isArray(users)) {
    throw new Error('La API devolvió una lista de usuarios inválida.');
  }

  return users;
}

function getUserFields(user) {
  return {
    name: user?.name ?? user?.['nombre-usuario'] ?? user?.nombre,
    email: user?.email ?? user?.['mail-usuario'] ?? user?.correo,
    password: user?.password ?? user?.['password-usuario'] ?? user?.contrasena,
    avatarUri: user?.avatar ?? user?.avatarUri ?? null,
  };
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [readyToPersist, setReadyToPersist] = useState(false);
  const writes = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;

    async function restoreProfile() {
      try {
        const storedProfile = await AsyncStorage.getItem(USER_KEY);
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          if (!isValidProfile(parsedProfile)) {
            throw new Error('El perfil guardado tiene un formato inválido.');
          }
          if (active) {
            setUser(parsedProfile);
            setReadyToPersist(true);
          }
        } else if (active) {
          setReadyToPersist(true);
        }
      } catch (error) {
        console.error('Error al recuperar el perfil:', error);
        Alert.alert('No se pudo recuperar el perfil', 'Revisa el almacenamiento del dispositivo e inténtalo de nuevo.');
      } finally {
        if (active) setReady(true);
      }
    }

    restoreProfile();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready || !readyToPersist) return;

    writes.current = writes.current
      .then(() => (
        user
          ? AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
          : AsyncStorage.removeItem(USER_KEY)
      ))
      .catch((error) => {
        console.error('Error al guardar el perfil:', error);
        Alert.alert('No se pudo guardar el perfil', 'Los cambios podrían no conservarse al cerrar la aplicación.');
      });
  }, [ready, readyToPersist, user]);

  const login = useCallback(async ({ email, password }) => {
    if (!ready) return { success: false, message: 'Espera a que termine de cargar el perfil.' };
    if (!validEmail(email)) return { success: false, message: 'El email debe terminar en @mail.com' };
    if (typeof password !== 'string' || password.length <= 5) {
      return { success: false, message: 'La contraseña debe tener más de 5 caracteres' };
    }

    try {
      const users = await fetchUsers();
      const normalizedEmail = email.trim().toLowerCase();
      const found = users
        .map(getUserFields)
        .find((candidate) => (
          typeof candidate.email === 'string'
          && candidate.email.trim().toLowerCase() === normalizedEmail
          && candidate.password === password
        ));
      if (!found) return { success: false, message: 'Email o contraseña incorrectos' };

      setUser({ name: found.name, email: normalizedEmail, avatarUri: found.avatarUri || null });
      setReadyToPersist(true);
      return { success: true };
    } catch (error) {
      console.error('Error al iniciar sesión con MockAPI:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'No se pudo iniciar sesión. Inténtalo de nuevo.',
      };
    }
  }, [ready]);

  const register = useCallback(async ({ name, email, password, confirmPassword }) => {
    if (typeof name !== 'string' || !name.trim()) {
      return { success: false, message: 'El nombre es obligatorio' };
    }
    if (!validEmail(email)) return { success: false, message: 'El email debe terminar en @mail.com' };
    if (typeof password !== 'string' || password.length <= 5) {
      return { success: false, message: 'La contraseña debe tener más de 5 caracteres' };
    }
    if (password !== confirmPassword) return { success: false, message: 'Las contraseñas no coinciden' };

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const users = await fetchUsers();
      if (users.some((candidate) => {
        const fields = getUserFields(candidate);
        return typeof fields.email === 'string'
          && fields.email.trim().toLowerCase() === normalizedEmail;
      })) {
        return { success: false, message: 'El email ya está registrado' };
      }

      const response = await fetch(USERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
          avatar: '',
        }),
      });
      if (!response.ok) {
        throw new Error(`No se pudo crear el usuario (HTTP ${response.status}).`);
      }

      const createdUser = await response.json();
      if (!createdUser || typeof createdUser.id !== 'string') {
        throw new Error('La API no confirmó la creación del usuario.');
      }

      return { success: true };
    } catch (error) {
      console.error('Error al crear el usuario en MockAPI:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'No se pudo crear la cuenta. Inténtalo de nuevo.',
      };
    }
  }, []);

  const updateProfile = useCallback((patch) => {
    setReadyToPersist(true);
    setUser((current) => current ? { ...current, ...patch } : current);
  }, []);

  const changePhoto = useCallback((sourceUri) => {
    if (!user) return;

    if (Platform.OS === 'web') {
      updateProfile({ avatarUri: sourceUri });
      return;
    }

    try {
      const source = new File(sourceUri);
      const destination = new File(Paths.document, `profile-${Date.now()}.jpg`);
      source.copy(destination);
      updateProfile({ avatarUri: destination.uri });
    } catch (error) {
      console.error('Error al guardar la foto de perfil:', error);
      Alert.alert('No se pudo guardar la foto', 'Inténtalo de nuevo con otra imagen.');
    }
  }, [updateProfile, user]);

  const logout = useCallback(() => {
    setReadyToPersist(true);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    ready,
    login,
    register,
    updateProfile,
    changePhoto,
    logout,
  }), [user, ready, login, register, updateProfile, changePhoto, logout]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser debe usarse dentro de UserProvider');
  return context;
}
