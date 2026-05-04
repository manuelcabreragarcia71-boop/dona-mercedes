import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminLoginScreen({ navigation }) {
  const { appColors, setIsAdmin } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const savedUsername = await AsyncStorage.getItem('admin_username');
      const savedPassword = await AsyncStorage.getItem('admin_password');

      if (!savedUsername || !savedPassword) {
        Alert.alert('Error', 'No hay credenciales configuradas. Contacta al administrador.');
        return;
      }

      if (username === savedUsername && password === savedPassword) {
        setIsAdmin(true);
        await AsyncStorage.setItem('admin_session', 'true');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: appColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.lockCircle}>
            <Ionicons name="lock-closed" size={32} color="#2E7D32" />
          </View>
          <Text style={[styles.title, { color: appColors.primary }]}>
            Acceso Restringido
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { borderColor: appColors.border, color: appColors.textDark }]}
            placeholder="Usuario"
            placeholderTextColor={appColors.textLight}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={[styles.input, { borderColor: appColors.border, color: appColors.textDark }]}
            placeholder="Contraseña"
            placeholderTextColor={appColors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: appColors.primary },
              isLoading && { opacity: 0.6 }
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Verificando...' : 'Acceder'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { color: appColors.textLight }]}>
              ← Volver
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  lockCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  form: {},
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 14,
  },
  button: {
    padding: 18,
    borderRadius: 14,
    marginTop: 10,
    elevation: 4,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
