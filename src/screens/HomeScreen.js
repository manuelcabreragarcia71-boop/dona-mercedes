import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { ProductService } from '../services/backendService';
import ProductCard from '../components/ProductCard';
import { getStoreStatus } from '../utils/businessHours';

const logoImage = require('../../assets/logo.png');
const bannerImage = require('../../assets/banner.png');

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { appColors, addToCart, getCartItemCount } = useApp();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [storeStatus, setStoreStatus] = useState(getStoreStatus());
  const [adminTaps, setAdminTaps] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(1);
  const adminTimer = useRef(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    loadProducts();
    
    const unsubscribe = ProductService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
      filterProducts(searchQuery, updatedProducts);
    });

    const interval = setInterval(() => {
      setStoreStatus(getStoreStatus());
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    filterProducts(searchQuery, products);
  }, [searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (query, productList = products) => {
    if (!query.trim()) {
      setFilteredProducts(productList);
      return;
    }

    const filtered = productList.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredProducts(filtered);
  };

  const WEIGHT_OPTIONS = [0.25, 0.5, 1, 1.5, 2, 3];

  const handleProductPress = (product) => {
    if (product.available) {
      setSelectedProduct(product);
      setSelectedWeight(1);
    }
  };

  const handleAddWithWeight = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, selectedWeight);
      setSelectedProduct(null);
    }
  };

  const handleLockPress = () => {
    const newTaps = adminTaps + 1;
    setAdminTaps(newTaps);

    if (adminTimer.current) clearTimeout(adminTimer.current);

    if (newTaps >= 5) {
      setAdminTaps(0);
      navigation.navigate('AdminLogin');
    } else {
      adminTimer.current = setTimeout(() => setAdminTaps(0), 3000);
    }
  };

  const cartItemCount = getCartItemCount();

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.heroSection}>
        <TouchableOpacity
          style={styles.lockButton}
          onPress={handleLockPress}
          activeOpacity={1}
        >
          <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.15)" />
        </TouchableOpacity>

        <Animated.View style={[
          styles.logoContainer,
          { transform: [{ scale: headerAnim }] }
        ]}>
          <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
        </Animated.View>

        <Text style={styles.heroTitle}>Doña Mercedes</Text>
        <Text style={styles.heroSubtitle}>Frutería de confianza</Text>

        {storeStatus.isOpen ? (
          <View style={styles.openBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#FFF" />
            <Text style={styles.openBadgeText}> Abierto - Haz tu pedido</Text>
          </View>
        ) : (
          <View style={styles.closedBadge}>
            <Ionicons name="time-outline" size={14} color="#FFF" />
            <Text style={styles.closedBadgeText}> {storeStatus.message}</Text>
          </View>
        )}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#CCC" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionRow}>
        <MaterialCommunityIcons name="leaf" size={20} color={appColors.primary} />
        <Text style={[styles.sectionLabel, { color: appColors.text }]}>
          Productos Frescos
        </Text>
        <Text style={styles.countBadge}>{filteredProducts.length}</Text>
      </View>
    </View>
  );

  const renderProduct = ({ item }) => (
    <ProductCard product={item} onPress={() => handleProductPress(item)} />
  );

  return (
    <View style={[styles.container, { backgroundColor: '#F5F7F5' }]}>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadProducts}
            colors={[appColors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={appColors.primary} />
            ) : (
              <>
                <Ionicons name="search" size={48} color="#CCC" />
                <Text style={[styles.emptyText, { color: appColors.textLight }]}>
                  {searchQuery ? 'No se encontraron productos' : 'No hay productos disponibles'}
                </Text>
              </>
            )}
          </View>
        }
      />

      {cartItemCount > 0 && (
        <TouchableOpacity
          style={styles.cartFab}
          onPress={() => navigation.navigate('Cart')}
        >
          <Ionicons name="cart" size={24} color="#FFF" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
          </View>
        </TouchableOpacity>
      )}

      <Modal
        visible={!!selectedProduct}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.weightModal}>
            {selectedProduct && (
              <>
                <View style={styles.weightModalHeader}>
                  {selectedProduct.imageUrl ? (
                    <Image source={{ uri: selectedProduct.imageUrl }} style={styles.weightModalImage} resizeMode="cover" />
                  ) : (
                    <View style={[styles.weightModalImage, styles.weightModalPlaceholder]}>
                      <MaterialCommunityIcons name="food-apple-outline" size={32} color="#A5D6A7" />
                    </View>
                  )}
                  <View style={styles.weightModalInfo}>
                    <Text style={styles.weightModalName}>{selectedProduct.name}</Text>
                    <Text style={styles.weightModalPrice}>{selectedProduct.price.toFixed(2)}€/kg</Text>
                    {selectedProduct.description ? (
                      <Text style={styles.weightModalDesc} numberOfLines={2}>{selectedProduct.description}</Text>
                    ) : null}
                  </View>
                </View>

                <Text style={styles.weightLabel}>Selecciona la cantidad:</Text>

                <View style={styles.weightOptions}>
                  {WEIGHT_OPTIONS.map((w) => (
                    <TouchableOpacity
                      key={w}
                      style={[
                        styles.weightOption,
                        selectedWeight === w && styles.weightOptionSelected
                      ]}
                      onPress={() => setSelectedWeight(w)}
                    >
                      <Text style={[
                        styles.weightOptionText,
                        selectedWeight === w && styles.weightOptionTextSelected
                      ]}>
                        {w >= 1 ? `${w} kg` : `${w * 1000} g`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.weightTotalRow}>
                  <Text style={styles.weightTotalLabel}>Total:</Text>
                  <Text style={styles.weightTotalPrice}>
                    {(selectedProduct.price * selectedWeight).toFixed(2)}€
                  </Text>
                </View>

                <View style={styles.weightButtons}>
                  <TouchableOpacity
                    style={styles.weightCancelBtn}
                    onPress={() => setSelectedProduct(null)}
                  >
                    <Text style={styles.weightCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.weightAddBtn}
                    onPress={handleAddWithWeight}
                  >
                    <Ionicons name="cart" size={18} color="#FFF" />
                    <Text style={styles.weightAddText}>  Añadir</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    marginBottom: 8,
  },
  heroSection: {
    paddingTop: 50,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1B5E20',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 10,
    zIndex: 2,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    zIndex: 2,
  },
  lockButton: {
    position: 'absolute',
    top: 46,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
    zIndex: 2,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 14,
  },
  openBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  closedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211,47,47,0.35)',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 14,
  },
  closedBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 6,
  },
  countBadge: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    overflow: 'hidden',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
  },
  cartFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6D00',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#D32F2F',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  weightModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  weightModalHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  weightModalImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },
  weightModalPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
  },
  weightModalInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  weightModalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  weightModalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 4,
  },
  weightModalDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  weightLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  weightOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  weightOption: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  weightOptionSelected: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  weightOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  weightOptionTextSelected: {
    color: '#2E7D32',
  },
  weightTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 16,
  },
  weightTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  weightTotalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2E7D32',
  },
  weightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  weightCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  weightCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  weightAddBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightAddText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
