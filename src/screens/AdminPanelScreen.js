import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  FlatList,
  Switch,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { ProductService, OrderService } from '../services/backendService';
import { ORDER_STATUS } from '../utils/constants';
import { parseAICommand, generateAIResponse, applyPriceAction } from '../utils/aiPriceParser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function AdminPanelScreen({ navigation }) {
  const { appColors, setIsAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [aiCommand, setAiCommand] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    available: true,
    imageUrl: ''
  });

  useEffect(() => {
    loadOrders();
    loadProducts();

    const unsubscribeOrders = OrderService.subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
    });

    const unsubscribeProducts = ProductService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    const unsubscribeNewOrders = OrderService.subscribeToNewOrders((newOrder) => {
      Alert.alert(
        'Nuevo Pedido',
        `Cliente: ${newOrder.customerName}\nTotal: ${newOrder.total.toFixed(2)}€`,
        [{ text: 'Ver', onPress: () => setActiveTab('orders') }]
      );
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeNewOrders();
    };
  }, []);

  const loadOrders = async () => {
    try {
      const data = await OrderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleAICommand = async () => {
    if (!aiCommand.trim()) {
      Alert.alert('Error', 'Escribe un comando primero');
      return;
    }

    const result = parseAICommand(aiCommand);
    
    if (!result.success) {
      setAiResponse('Error: ' + result.error);
      return;
    }

    try {
      const product = products.find(p => {
        const name = p.name.toLowerCase();
        return name.includes(result.productKey) ||
               name.includes(result.product) ||
               result.productKey.includes(name.split(' ')[0]);
      });

      if (product) {
        const finalPrice = applyPriceAction(product.price, result.price, result.action);
        await ProductService.update(product.id, {
          ...product,
          price: finalPrice
        });
        
        const response = generateAIResponse({ ...result, price: finalPrice });
        setAiResponse(response);
        setAiCommand('');
      } else {
        setAiResponse('No se encontro "' + result.product + '" en los productos. Productos disponibles: ' + 
          products.map(p => p.name).join(', '));
      }
    } catch (error) {
      setAiResponse('Error al actualizar el precio');
      console.error('Error updating price:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await OrderService.updateStatus(orderId, newStatus);
      Alert.alert('Listo', 'Estado actualizado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          onPress: async () => {
            setIsAdmin(false);
            await AsyncStorage.removeItem('admin_session');
            navigation.replace('Home');
          }
        }
      ]
    );
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      description: '',
      available: true,
      imageUrl: ''
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      available: product.available,
      imageUrl: product.imageUrl || ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim() || !productForm.price) {
      Alert.alert('Error', 'Completa los campos obligatorios');
      return;
    }

    const price = parseFloat(productForm.price);
    if (isNaN(price) || price < 0) {
      Alert.alert('Error', 'Precio inválido');
      return;
    }

    try {
      let imageUrl = productForm.imageUrl;
      const isLocalImage = imageUrl && !imageUrl.startsWith('http');

      const productData = {
        name: productForm.name.trim(),
        price,
        description: productForm.description.trim(),
        available: productForm.available,
        imageUrl: isLocalImage ? '' : imageUrl
      };

      let productId;
      if (editingProduct) {
        productId = editingProduct.id;
        await ProductService.update(productId, productData);
      } else {
        productId = await ProductService.create(productData);
      }

      if (isLocalImage && productId) {
        try {
          const publicUrl = await ProductService.uploadImage(imageUrl, productId);
          await ProductService.update(productId, { ...productData, imageUrl: publicUrl });
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          const msg = uploadError?.message || uploadError?.error || JSON.stringify(uploadError);
          Alert.alert('Aviso', 'Producto guardado pero la imagen no se pudo subir:\n' + msg);
          setShowProductModal(false);
          return;
        }
      }

      Alert.alert('Listo', editingProduct ? 'Producto actualizado' : 'Producto creado');
      setShowProductModal(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el producto: ' + (error.message || 'Error desconocido'));
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      'Eliminar producto',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await ProductService.delete(productId);
              Alert.alert('Listo', 'Producto eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          }
        }
      ]
    );
  };

  const compressImage = async (uri) => {
    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 600 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulated.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri;
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const compressedUri = await compressImage(result.assets[0].uri);
      setProductForm({ ...productForm, imageUrl: compressedUri });
    }
  };

  const handleChangeCredentials = async () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      await AsyncStorage.setItem('admin_username', newUsername);
      await AsyncStorage.setItem('admin_password', newPassword);
      Alert.alert('Listo', 'Credenciales actualizadas');
      setShowSettingsModal(false);
      setNewUsername('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar las credenciales');
    }
  };

  const renderOrders = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.tabTitle, { color: appColors.text }]}>
        Pedidos ({orders.length})
      </Text>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: appColors.textLight }]}>
            No hay pedidos
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.orderCard, { borderColor: appColors.border }]}>
              <View style={styles.orderHeader}>
                <Text style={[styles.orderCustomer, { color: appColors.text }]}>
                  {item.customerName}
                </Text>
                <Text style={[styles.orderTotal, { color: appColors.primary }]}>
                  {item.total.toFixed(2)}€
                </Text>
              </View>

              <Text style={[styles.orderDetail, { color: appColors.textLight }]}>
                Tel: {item.customerPhone}
              </Text>

              {item.customerAddress && (
                <Text style={[styles.orderDetail, { color: appColors.textLight }]}>
                  Dir: {item.customerAddress}
                </Text>
              )}

              <Text style={[styles.orderDetail, { color: appColors.textLight }]}>
                {item.deliveryOption === 'pickup' ? 'Recogida en tienda' : 'Entrega a domicilio'}
              </Text>

              <View style={styles.orderItems}>
                {item.items.map((product, index) => (
                  <Text key={index} style={[styles.orderItem, { color: appColors.text }]}>
                    • {product.name} x{product.quantity} - {(product.price * product.quantity).toFixed(2)}€
                  </Text>
                ))}
              </View>

              <View style={styles.orderActions}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    { backgroundColor: item.status === 'pending' ? appColors.warning : appColors.border }
                  ]}
                  onPress={() => handleUpdateOrderStatus(item.id, 'pending')}
                >
                  <Text style={styles.statusButtonText}>Pendiente</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    { backgroundColor: item.status === 'preparing' ? appColors.primary : appColors.border }
                  ]}
                  onPress={() => handleUpdateOrderStatus(item.id, 'preparing')}
                >
                  <Text style={styles.statusButtonText}>Preparando</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    { backgroundColor: item.status === 'delivered' ? appColors.success : appColors.border }
                  ]}
                  onPress={() => handleUpdateOrderStatus(item.id, 'delivered')}
                >
                  <Text style={styles.statusButtonText}>Entregado</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );

  const renderProducts = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={[styles.tabTitle, { color: appColors.text }]}>
          Productos ({products.length})
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: appColors.primary }]}
          onPress={handleAddProduct}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.addButtonText}> Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.productCard, { borderColor: appColors.border }]}>
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: appColors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.productPrice, { color: appColors.primary }]}>
                {item.price.toFixed(2)}€
              </Text>
              <Text style={[styles.productStatus, { color: item.available ? appColors.success : appColors.error }]}>
                {item.available ? '✓ Disponible' : '✕ Agotado'}
              </Text>
            </View>

            <View style={styles.productActions}>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: appColors.primary }]}
                onPress={() => handleEditProduct(item)}
              >
                <Ionicons name="pencil" size={16} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: appColors.error }]}
                onPress={() => handleDeleteProduct(item.id)}
              >
                <Ionicons name="trash" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );

  const renderAI = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.tabTitle, { color: appColors.text }]}>
        Asistente IA de Precios
      </Text>

      <View style={[styles.aiContainer, { borderColor: appColors.border }]}>
        <Text style={[styles.aiInstructions, { color: appColors.textLight }]}>
          Ejemplos de comandos:
        </Text>
        <Text style={[styles.aiExample, { color: appColors.text }]}>
          • "El tomate está hoy a 2€"
        </Text>
        <Text style={[styles.aiExample, { color: appColors.text }]}>
          • "Sube las manzanas a 1,90€"
        </Text>
        <Text style={[styles.aiExample, { color: appColors.text }]}>
          • "Baja el plátano a 1,50€"
        </Text>

        <TextInput
          style={[styles.aiInput, { borderColor: appColors.border, color: appColors.text }]}
          placeholder="Escribe tu comando aquí..."
          placeholderTextColor={appColors.textLight}
          value={aiCommand}
          onChangeText={setAiCommand}
          multiline
        />

        <TouchableOpacity
          style={[styles.aiButton, { backgroundColor: appColors.primary }]}
          onPress={handleAICommand}
        >
          <Text style={styles.aiButtonText}>Procesar comando</Text>
        </TouchableOpacity>

        {aiResponse ? (
          <View style={[styles.aiResponse, { backgroundColor: appColors.background }]}>
            <Text style={[styles.aiResponseText, { color: appColors.text }]}>
              {aiResponse}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: appColors.background }]}>
      <View style={[styles.header, { backgroundColor: appColors.primary }]}>
        <Text style={styles.headerTitle}>Panel Admin</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSettingsModal(true)}
          >
            <Ionicons name="settings-outline" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && { backgroundColor: appColors.primary }]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && { color: '#FFFFFF' }]}>
            Pedidos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && { backgroundColor: appColors.primary }]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.tabText, activeTab === 'products' && { color: '#FFFFFF' }]}>
            Productos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'ai' && { backgroundColor: appColors.primary }]}
          onPress={() => setActiveTab('ai')}
        >
          <Text style={[styles.tabText, activeTab === 'ai' && { color: '#FFFFFF' }]}>
            IA
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'ai' && renderAI()}
      </ScrollView>

      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: appColors.white }]}>
            <Text style={[styles.modalTitle, { color: appColors.text }]}>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </Text>

            <TextInput
              style={[styles.input, { borderColor: appColors.border, color: appColors.text }]}
              placeholder="Nombre *"
              placeholderTextColor={appColors.textLight}
              value={productForm.name}
              onChangeText={(text) => setProductForm({ ...productForm, name: text })}
            />

            <TextInput
              style={[styles.input, { borderColor: appColors.border, color: appColors.text }]}
              placeholder="Precio *"
              placeholderTextColor={appColors.textLight}
              value={productForm.price}
              onChangeText={(text) => setProductForm({ ...productForm, price: text })}
              keyboardType="decimal-pad"
            />

            <TextInput
              style={[styles.input, styles.textArea, { borderColor: appColors.border, color: appColors.text }]}
              placeholder="Descripción"
              placeholderTextColor={appColors.textLight}
              value={productForm.description}
              onChangeText={(text) => setProductForm({ ...productForm, description: text })}
              multiline
            />

            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: appColors.text }]}>
                Disponible
              </Text>
              <Switch
                value={productForm.available}
                onValueChange={(value) => setProductForm({ ...productForm, available: value })}
                trackColor={{ false: appColors.border, true: appColors.primary }}
              />
            </View>

            <TouchableOpacity
              style={[styles.imageButton, { borderColor: appColors.border }]}
              onPress={handlePickImage}
            >
              <Ionicons name={productForm.imageUrl ? 'checkmark-circle' : 'camera-outline'} size={20} color={appColors.primary} />
              <Text style={[styles.imageButtonText, { color: appColors.text }]}>
                {productForm.imageUrl ? ' Imagen seleccionada' : ' Seleccionar imagen'}
              </Text>
            </TouchableOpacity>

            {productForm.imageUrl ? (
              <Image source={{ uri: productForm.imageUrl }} style={styles.imagePreview} resizeMode="cover" />
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: appColors.border }]}
                onPress={() => setShowProductModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: appColors.primary }]}
                onPress={handleSaveProduct}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: appColors.white }]}>
            <Text style={[styles.modalTitle, { color: appColors.text }]}>
              Cambiar Credenciales
            </Text>

            <TextInput
              style={[styles.input, { borderColor: appColors.border, color: appColors.text }]}
              placeholder="Nuevo usuario"
              placeholderTextColor={appColors.textLight}
              value={newUsername}
              onChangeText={setNewUsername}
              autoCapitalize="none"
            />

            <TextInput
              style={[styles.input, { borderColor: appColors.border, color: appColors.text }]}
              placeholder="Nueva contraseña"
              placeholderTextColor={appColors.textLight}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: appColors.border }]}
                onPress={() => {
                  setShowSettingsModal(false);
                  setNewUsername('');
                  setNewPassword('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: appColors.primary }]}
                onPress={handleChangeCredentials}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Actualizar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderCustomer: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  orderDetail: {
    fontSize: 14,
    marginBottom: 6,
  },
  orderItems: {
    marginVertical: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  orderItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  statusButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productStatus: {
    fontSize: 14,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aiContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  aiInstructions: {
    fontSize: 14,
    marginBottom: 8,
  },
  aiExample: {
    fontSize: 13,
    marginBottom: 4,
    marginLeft: 8,
  },
  aiInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  aiButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiResponse: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  aiResponseText: {
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
  },
  imageButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imageButtonText: {
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
