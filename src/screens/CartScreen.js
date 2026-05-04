import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import CartItem from '../components/CartItem';
import { DELIVERY_OPTIONS } from '../utils/constants';
import { OrderService } from '../services/backendService';

export default function CartScreen({ navigation }) {
  const { appColors, cart, getCartTotal, clearCart } = useApp();
  const [deliveryOption, setDeliveryOption] = useState(DELIVERY_OPTIONS.PICKUP);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = getCartTotal();

  const validateOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'Añade productos antes de realizar el pedido');
      return false;
    }

    if (!customerName.trim()) {
      Alert.alert('Datos incompletos', 'Por favor, introduce tu nombre');
      return false;
    }

    if (!customerPhone.trim()) {
      Alert.alert('Datos incompletos', 'Por favor, introduce tu teléfono');
      return false;
    }

    if (deliveryOption === DELIVERY_OPTIONS.DELIVERY && !customerAddress.trim()) {
      Alert.alert('Datos incompletos', 'Por favor, introduce tu dirección completa');
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateOrder()) {
      return;
    }

    Alert.alert(
      'Confirmar pedido',
      `Total: ${total.toFixed(2)}€\n\n¿Confirmar pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setIsSubmitting(true);

              const orderData = {
                items: cart.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  imageUrl: item.imageUrl
                })),
                total,
                deliveryOption,
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim(),
                customerAddress: deliveryOption === DELIVERY_OPTIONS.DELIVERY ? customerAddress.trim() : null,
                status: 'pending'
              };

              await OrderService.create(orderData);

              Alert.alert(
                '✓ Pedido realizado',
                'Tu pedido ha sido recibido correctamente. Te contactaremos pronto.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      clearCart();
                      setCustomerName('');
                      setCustomerAddress('');
                      setCustomerPhone('');
                      navigation.navigate('Home');
                    }
                  }
                ]
              );
            } catch (error) {
              const msg = error?.message || JSON.stringify(error);
              Alert.alert('Error al realizar pedido', msg);
              console.error('Error submitting order:', error);
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };

  if (cart.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: appColors.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#CCC" />
          <Text style={[styles.emptyText, { color: appColors.textLight }]}>
            Tu carrito está vacío
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: appColors.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Ver productos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: appColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: appColors.text }]}>
            Productos ({cart.length})
          </Text>

          {cart.map(item => (
            <CartItem key={item.id} item={item} />
          ))}

          <View style={[styles.totalContainer, { backgroundColor: appColors.white, borderColor: appColors.border }]}>
            <Text style={[styles.totalLabel, { color: appColors.text }]}>Total:</Text>
            <Text style={[styles.totalAmount, { color: appColors.primary }]}>
              {total.toFixed(2)}€
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: appColors.text }]}>
            Tipo de entrega
          </Text>

          <View style={styles.deliveryOptions}>
            <TouchableOpacity
              style={[
                styles.deliveryOption,
                { borderColor: appColors.border },
                deliveryOption === DELIVERY_OPTIONS.PICKUP && { backgroundColor: appColors.primary, borderColor: appColors.primary }
              ]}
              onPress={() => setDeliveryOption(DELIVERY_OPTIONS.PICKUP)}
            >
              <Text style={[
                styles.deliveryOptionText,
                { color: appColors.text },
                deliveryOption === DELIVERY_OPTIONS.PICKUP && { color: '#FFFFFF' }
              ]}>
                Recogida en tienda
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deliveryOption,
                { borderColor: appColors.border },
                deliveryOption === DELIVERY_OPTIONS.DELIVERY && { backgroundColor: appColors.primary, borderColor: appColors.primary }
              ]}
              onPress={() => setDeliveryOption(DELIVERY_OPTIONS.DELIVERY)}
            >
              <Text style={[
                styles.deliveryOptionText,
                { color: appColors.text },
                deliveryOption === DELIVERY_OPTIONS.DELIVERY && { color: '#FFFFFF' }
              ]}>
                Entrega a domicilio
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: appColors.text }]}>
            Datos de contacto
          </Text>

          <TextInput
            style={[styles.input, { borderColor: appColors.border, color: appColors.text }]}
            placeholder="Nombre completo *"
            placeholderTextColor={appColors.textLight}
            value={customerName}
            onChangeText={setCustomerName}
          />

          <TextInput
            style={[styles.input, { borderColor: appColors.border, color: appColors.text }]}
            placeholder="Teléfono *"
            placeholderTextColor={appColors.textLight}
            value={customerPhone}
            onChangeText={setCustomerPhone}
            keyboardType="phone-pad"
          />

          {deliveryOption === DELIVERY_OPTIONS.DELIVERY && (
            <TextInput
              style={[styles.input, styles.textArea, { borderColor: appColors.border, color: appColors.text }]}
              placeholder="Dirección completa *"
              placeholderTextColor={appColors.textLight}
              value={customerAddress}
              onChangeText={setCustomerAddress}
              multiline
              numberOfLines={3}
            />
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: appColors.primary },
              isSubmitting && { opacity: 0.6 }
            ]}
            onPress={handleSubmitOrder}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Procesando...' : 'Realizar pedido'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 17,
    marginBottom: 30,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 16,
    elevation: 3,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  deliveryOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  deliveryOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  deliveryOptionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    padding: 18,
    borderRadius: 14,
    marginTop: 20,
    elevation: 5,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
