import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { supabase } from '../../supabase.config';
import { OrderService } from '../services/backendService';

const logoImage = require('../../assets/logo.png');

export default function UserProfileScreen({ navigation }) {
  const { appColors, user, setUser } = useApp();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserOrders();
    }
  }, [user]);

  const loadUserOrders = async () => {
    try {
      setLoadingOrders(true);
      const allOrders = await OrderService.getAll();
      const userOrders = allOrders.filter(o => o.customerPhone === user?.user_metadata?.phone);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading user orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Quieres cerrar tu sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          onPress: async () => {
            await supabase.auth.signOut();
            setUser(null);
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: appColors.background }]}>
        <View style={styles.notLoggedIn}>
          <Image source={logoImage} style={styles.profileLogo} resizeMode="contain" />
          <Text style={[styles.notLoggedTitle, { color: appColors.text }]}>
            Hola!
          </Text>
          <Text style={[styles.notLoggedSubtitle, { color: appColors.textLight }]}>
            Crea una cuenta para guardar tus pedidos y recibir ofertas especiales
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: appColors.primary }]}
            onPress={() => navigation.navigate('UserAuth')}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesion / Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const userName = user?.user_metadata?.full_name || 'Cliente';
  const userEmail = user?.email || '';

  const statusLabels = {
    pending: { text: 'Pendiente', color: '#F9A825', icon: 'time-outline' },
    preparing: { text: 'Preparando', color: '#FF6D00', icon: 'restaurant-outline' },
    delivered: { text: 'Entregado', color: '#388E3C', icon: 'checkmark-circle' },
    cancelled: { text: 'Cancelado', color: '#D32F2F', icon: 'close-circle' }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: appColors.background }]}>
      <View style={[styles.profileHeader, { backgroundColor: appColors.primary }]}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{userName}</Text>
        <Text style={styles.profileEmail}>{userEmail}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: appColors.text }]}>
          Mis Pedidos
        </Text>

        {orders.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: appColors.surface }]}>
            <Ionicons name="receipt-outline" size={48} color="#CCC" />
            <Text style={[styles.emptyText, { color: appColors.textLight }]}>
              Aun no tienes pedidos
            </Text>
            <TouchableOpacity
              style={[styles.shopButton, { backgroundColor: appColors.secondary }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopButtonText}>Ir a comprar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map(order => {
            const status = statusLabels[order.status] || statusLabels.pending;
            return (
              <View key={order.id} style={[styles.orderCard, { backgroundColor: appColors.surface, borderColor: appColors.border }]}>
                <View style={styles.orderHeader}>
                  <Text style={[styles.orderDate, { color: appColors.textLight }]}>
                    {new Date(order.createdAt).toLocaleDateString('es-ES')}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                    <Ionicons name={status.icon} size={14} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {' '}{status.text}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderItems}>
                  {order.items.map((item, idx) => (
                    <Text key={idx} style={[styles.orderItem, { color: appColors.textDark }]}>
                      {item.name} x{item.quantity}
                    </Text>
                  ))}
                </View>
                <Text style={[styles.orderTotal, { color: appColors.primary }]}>
                  Total: {order.total.toFixed(2)}€
                </Text>
              </View>
            );
          })
        )}

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: appColors.error }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: appColors.error }]}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  profileLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  notLoggedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notLoggedSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  loginButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  emptyCard: {
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  shopButton: {
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderItems: {
    marginBottom: 8,
  },
  orderItem: {
    fontSize: 14,
    marginBottom: 2,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
  },
  logoutButton: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
