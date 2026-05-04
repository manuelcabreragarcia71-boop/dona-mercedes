import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/constants';
import { supabase } from '../../supabase.config';
import { ensureAdminCredentials } from '../utils/setupAdmin';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [appColors, setAppColors] = useState(COLORS);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [orders, setOrders] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    loadCartFromStorage();
    loadAppSettings();
    initAuth();
    ensureAdminCredentials();
  }, []);

  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription?.unsubscribe();
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const loadAppSettings = async () => {
    try {
      const savedColors = await AsyncStorage.getItem('appColors');
      const savedBackground = await AsyncStorage.getItem('backgroundImage');
      
      if (savedColors) {
        setAppColors(JSON.parse(savedColors));
      }
      if (savedBackground) {
        setBackgroundImage(savedBackground);
      }
    } catch (error) {
      console.error('Error loading app settings:', error);
    }
  };

  const saveCartToStorage = async (newCart) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    let newCart;
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }
    
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.length;
  };

  const updateAppColors = async (newColors) => {
    setAppColors(newColors);
    await AsyncStorage.setItem('appColors', JSON.stringify(newColors));
  };

  const updateBackgroundImage = async (imageUri) => {
    setBackgroundImage(imageUri);
    await AsyncStorage.setItem('backgroundImage', imageUri);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    user,
    setUser,
    isAdmin,
    setIsAdmin,
    appColors,
    updateAppColors,
    backgroundImage,
    updateBackgroundImage,
    orders,
    setOrders,
    authLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
