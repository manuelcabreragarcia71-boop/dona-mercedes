import AsyncStorage from '@react-native-async-storage/async-storage';

export const ensureAdminCredentials = async () => {
  try {
    const existing = await AsyncStorage.getItem('admin_username');
    if (!existing) {
      await AsyncStorage.setItem('admin_username', 'admin');
      await AsyncStorage.setItem('admin_password', 'admin1234');
    }
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
};
