import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function CartItem({ item }) {
  const { appColors, updateQuantity, removeFromCart } = useApp();

  const STEP = 0.5;

  const handleIncrease = () => {
    updateQuantity(item.id, Math.round((item.quantity + STEP) * 100) / 100);
  };

  const handleDecrease = () => {
    if (item.quantity > STEP) {
      updateQuantity(item.id, Math.round((item.quantity - STEP) * 100) / 100);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const subtotal = item.price * item.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="food-apple-outline" size={28} color="#A5D6A7" />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>
          {item.price.toFixed(2)}€/kg
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: '#F0F0F0' }]}
            onPress={handleDecrease}
          >
            <Ionicons name="remove" size={16} color="#666" />
          </TouchableOpacity>
          
          <Text style={styles.quantity}>
            {item.quantity >= 1 ? `${item.quantity} kg` : `${item.quantity * 1000} g`}
          </Text>
          
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: '#2E7D32' }]}
            onPress={handleIncrease}
          >
            <Ionicons name="add" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtotal}>
          {subtotal.toFixed(2)}€
        </Text>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemove}
        >
          <Ionicons name="trash-outline" size={16} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  price: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  actionsContainer: {
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  quantityButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 10,
    minWidth: 24,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  removeButton: {
    padding: 4,
  },
});
