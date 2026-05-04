import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { supabase } from '../../supabase.config';

const logoImage = require('../../assets/logo.png');

export default function UserAuthScreen({ navigation }) {
  const { appColors } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Datos incompletos', 'Introduce tu email y contraseña');
      return;
    }

    if (!isLogin && !name.trim()) {
      Alert.alert('Datos incompletos', 'Introduce tu nombre');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) {
          if (error.message.includes('Invalid login')) {
            Alert.alert('Error', 'Email o contraseña incorrectos');
          } else {
            Alert.alert('Error', error.message);
          }
          return;
        }

        navigation.goBack();
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: name.trim(),
              phone: phone.trim()
            }
          }
        });

        if (error) {
          Alert.alert('Error', error.message);
          return;
        }

        Alert.alert(
          'Cuenta creada',
          'Ya puedes empezar a comprar tus frutas y verduras favoritas',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: appColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logoImg} resizeMode="contain" />
          <Text style={[styles.subtitle, { color: appColors.textLight }]}>
            {isLogin ? 'Bienvenido de vuelta' : 'Unete a nuestra familia'}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: appColors.surface }]}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, isLogin && { backgroundColor: appColors.primary }]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && { color: '#FFF' }]}>
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, !isLogin && { backgroundColor: appColors.primary }]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && { color: '#FFF' }]}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <>
              <TextInput
                style={[styles.input, { borderColor: appColors.border, color: appColors.textDark }]}
                placeholder="Tu nombre"
                placeholderTextColor={appColors.textLight}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={[styles.input, { borderColor: appColors.border, color: appColors.textDark }]}
                placeholder="Teléfono (opcional)"
                placeholderTextColor={appColors.textLight}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </>
          )}

          <TextInput
            style={[styles.input, { borderColor: appColors.border, color: appColors.textDark }]}
            placeholder="Email"
            placeholderTextColor={appColors.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
          />

          <TouchableOpacity
            style={[
              styles.authButton,
              { backgroundColor: appColors.primary },
              isLoading && { opacity: 0.6 }
            ]}
            onPress={handleAuth}
            disabled={isLoading}
          >
            <Text style={styles.authButtonText}>
              {isLoading
                ? 'Cargando...'
                : isLogin
                  ? 'Entrar'
                  : 'Crear cuenta'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.skipText, { color: appColors.textLight }]}>
            Continuar sin cuenta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F4F0',
    borderRadius: 12,
    marginBottom: 20,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6D8B74',
  },
  input: {
    backgroundColor: '#FAFFF5',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 14,
  },
  authButton: {
    padding: 18,
    borderRadius: 14,
    marginTop: 6,
    elevation: 4,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 20,
    padding: 14,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 15,
  },
});
