import { supabase } from '../../supabase.config';

const mapProductFromDb = (product) => ({
  id: product.id,
  name: product.name,
  price: Number(product.price),
  description: product.description || '',
  available: product.available,
  imageUrl: product.image_url || '',
  createdAt: product.created_at,
  updatedAt: product.updated_at
});

const mapProductToDb = (productData) => ({
  name: productData.name,
  price: productData.price,
  description: productData.description || '',
  available: productData.available ?? true,
  image_url: productData.imageUrl || ''
});

const mapOrderFromDb = (order) => ({
  id: order.id,
  items: order.items || [],
  total: Number(order.total),
  deliveryOption: order.delivery_option,
  customerName: order.customer_name,
  customerPhone: order.customer_phone,
  customerAddress: order.customer_address,
  status: order.status,
  createdAt: order.created_at,
  updatedAt: order.updated_at
});

export const ProductService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error getting products:', error);
      throw error;
    }

    return data.map(mapProductFromDb);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting product:', error);
      throw error;
    }

    return data ? mapProductFromDb(data) : null;
  },

  async create(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert(mapProductToDb(productData))
      .select('id')
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return data.id;
  },

  async update(id, productData) {
    const { error } = await supabase
      .from('products')
      .update(mapProductToDb(productData))
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async uploadImage(uri, productId) {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const filename = `products/${productId}_${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filename, uint8, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filename);

    return data.publicUrl;
  },

  subscribeToProducts(callback) {
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
        const products = await ProductService.getAll();
        callback(products);
      })
      .subscribe();

    ProductService.getAll().then(callback).catch((error) => console.error('Error loading products:', error));

    return () => supabase.removeChannel(channel);
  }
};

export const OrderService = {
  async create(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        items: orderData.items,
        total: orderData.total,
        delivery_option: orderData.deliveryOption,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    return data.id;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting orders:', error);
      throw error;
    }

    return data.map(mapOrderFromDb);
  },

  async updateStatus(orderId, status) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  subscribeToOrders(callback) {
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
        const orders = await OrderService.getAll();
        callback(orders);
      })
      .subscribe();

    OrderService.getAll().then(callback).catch((error) => console.error('Error loading orders:', error));

    return () => supabase.removeChannel(channel);
  },

  subscribeToNewOrders(callback) {
    const channel = supabase
      .channel('new-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        callback(mapOrderFromDb(payload.new));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }
};

export const SettingsService = {
  async get() {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'app')
      .maybeSingle();

    if (error) {
      console.error('Error getting settings:', error);
      throw error;
    }

    return data?.value || null;
  },

  async update(settings) {
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'app', value: settings }, { onConflict: 'key' });

    if (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};
