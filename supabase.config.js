import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://swzpvsgacwskgxjayumf.supabase.co';
const supabaseAnonKey = 'sb_publishable_siu-5sgE_1bGvaNS3Cml_A_QYEJ_l2s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
