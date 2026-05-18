import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  image?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  contact: string;
  orders: number;
  status: 'Active' | 'Pending' | 'Inactive';
}

export interface Driver {
  id: string;
  name: string;
  status: 'Active' | 'Offline' | 'On Break';
  deliveries: number;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'Processing' | 'En Route' | 'Delivered' | 'Cancelled';
  total: number;
  date: string;
  driverId?: string;
  deliveryAddress?: string;
  lat?: number;
  lng?: number;
  customerPhone?: string;
  customerEmail?: string;
  discount?: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
}

interface DataState {
  products: Product[];
  restaurants: Restaurant[];
  drivers: Driver[];
  coupons: Coupon[];
  cart: CartItem[];
  orders: Order[];
  isLoading: boolean;
  
  initializeData: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (userId: string, address?: string, lat?: number, lng?: number, phone?: string, email?: string, discount?: number) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  assignDriver: (orderId: string, driverId?: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'orders'>) => Promise<void>;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;

  addDriver: (driver: Omit<Driver, 'id' | 'deliveries' | 'rating'>) => Promise<void>;
  updateDriver: (id: string, updates: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;

  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  updateCoupon: (id: string, updates: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
}

const DUMMY_PRODUCTS = [
  { id: '1', name: 'Fresh Roma Tomatoes', category: 'Vegetables', price: 24.50, stock: 150, unit: 'case (25 lbs)' },
  { id: '2', name: 'Organic Spinach', category: 'Vegetables', price: 18.00, stock: 85, unit: 'carton (4x 2.5 lbs)' },
  { id: '3', name: 'Premium Jasmine Rice', category: 'Grains', price: 45.00, stock: 40, unit: 'bag (50 lbs)' },
  { id: '4', name: 'Extra Virgin Olive Oil', category: 'Oils', price: 89.99, stock: 25, unit: 'tin (3 liters)' },
  { id: '5', name: 'Avocado Bulk', category: 'Vegetables', price: 35.00, stock: 60, unit: 'box (48 count)' },
];

const DUMMY_RESTAURANTS: Restaurant[] = [
  { id: 'REST-01', name: 'Le Petit Bistro', contact: 'Emma Wilson', orders: 145, status: 'Active' },
  { id: 'REST-02', name: 'Ocean Blue Seafood', contact: 'Michael Chen', orders: 89, status: 'Active' },
  { id: 'REST-03', name: 'Mama\'s Kitchen', contact: 'Sarah Johnson', orders: 234, status: 'Active' },
  { id: 'REST-04', name: 'Green Leaf Caffe', contact: 'David Brown', orders: 12, status: 'Pending' },
];

const DUMMY_DRIVERS: Driver[] = [
  { id: 'DRV-001', name: 'John Doe', status: 'Active', deliveries: 12, rating: 4.8 },
  { id: 'DRV-002', name: 'Alice Smith', status: 'Offline', deliveries: 8, rating: 4.9 },
  { id: 'DRV-003', name: 'Mark Johnson', status: 'Active', deliveries: 15, rating: 4.7 },
  { id: 'DRV-004', name: 'Emily Davis', status: 'On Break', deliveries: 4, rating: 4.6 },
];

export const useDataStore = create<DataState>((set, get) => ({
  products: DUMMY_PRODUCTS,
  restaurants: DUMMY_RESTAURANTS,
  drivers: DUMMY_DRIVERS,
  coupons: [
    { id: 'COUPON-1', code: 'FRESH20', discountPercent: 20, active: true }
  ],
  cart: [],
  orders: [
    { id: 'ORD-1001', userId: 'customer_1', items: [{...DUMMY_PRODUCTS[0], quantity: 2}], status: 'En Route', total: 49.00, date: new Date().toISOString() },
    { id: 'ORD-1002', userId: 'restaurant_1', items: [{...DUMMY_PRODUCTS[2], quantity: 5}], status: 'Processing', total: 225.00, date: new Date().toISOString() }
  ],
  isLoading: false,
  
  initializeData: async () => {
    set({ isLoading: true });
    try {
      // Attempt to load products from real DB
      const { data: dbProducts, error: pErr } = await supabase.from('products').select('*');
      if (!pErr && dbProducts && dbProducts.length > 0) {
        set({ products: dbProducts as Product[] });
      }
      
      // Attempt to load orders from real DB
      const { data: dbOrders, error: oErr } = await supabase.from('orders').select('*');
      if (!oErr && dbOrders && dbOrders.length > 0) {
        // Assume mapping items json string or object
        set({ orders: dbOrders.map((o: any) => ({
          ...o,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
        })) as Order[] });
      }

      const { data: dbDrivers, error: dErr } = await supabase.from('drivers').select('*');
      if (!dErr && dbDrivers && dbDrivers.length > 0) {
         set({ drivers: dbDrivers as Driver[] });
      }

      const { data: dbRestaurants, error: rErr } = await supabase.from('restaurants').select('*');
      if (!rErr && dbRestaurants && dbRestaurants.length > 0) {
         set({ restaurants: dbRestaurants as Restaurant[] });
      }

      const { data: dbCoupons, error: cErr } = await supabase.from('coupons').select('*');
      if (!cErr && dbCoupons && dbCoupons.length > 0) {
         set({ coupons: dbCoupons as Coupon[] });
      }
    } catch (e) {
      console.warn('Failed to load from DB, using fallback data.', e);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: (product, quantity = 1) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return { cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) };
    }
    return { cart: [...state.cart, { ...product, quantity }] };
  }),
  
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),
  
  clearCart: () => set({ cart: [] }),
  
  placeOrder: async (userId, address, lat, lng, phone, email, discount = 0) => {
    const state = get();
    if (state.cart.length === 0) return;
    
    // Quick parse if price is string
    const subtotal = state.cart.reduce((sum, item) => sum + ((typeof item.price === 'number' ? item.price : parseFloat(item.price)) * item.quantity), 0);
    const total = Math.max(0, subtotal - discount);

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      userId,
      items: state.cart,
      status: 'Processing',
      total,
      date: new Date().toISOString(),
      deliveryAddress: address,
      lat,
      lng,
      customerPhone: phone,
      customerEmail: email,
      discount
    };
    
    // Update local state first (optimistic)
    set({ orders: [newOrder, ...state.orders], cart: [] });

    try {
      // Try pushing to DB
      await supabase.from('orders').insert([{
        id: newOrder.id,
        user_id: newOrder.userId,
        items: newOrder.items,
        status: newOrder.status,
        total: newOrder.total,
        date: newOrder.date,
        delivery_address: address,
        lat,
        lng,
        customer_phone: phone,
        customer_email: email,
        discount
      }]);
    } catch (e) {
      console.warn("DB insert failed, storing only locally");
    }
  },
  
  updateOrderStatus: async (orderId, status) => {
    // Optimistic
    set((state) => ({
      orders: state.orders.map(order => order.id === orderId ? { ...order, status } : order)
    }));

    try {
      await supabase.from('orders').update({ status }).eq('id', orderId);
    } catch (e) {
      console.warn("DB update failed");
    }
  },
  
  assignDriver: async (orderId, driverId) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, driverId } : o))
    }));
    try {
      await supabase.from('orders').update({ driver_id: driverId }).eq('id', orderId);
    } catch (e) {
      console.warn("DB update failed");
    }
  },
  
  addProduct: async (product) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    set((state) => ({ products: [newProduct, ...state.products] }));
    
    try {
      await supabase.from('products').insert([newProduct]);
    } catch (e) {
      console.warn("DB insert failed, stored only locally");
    }
  },

  updateProduct: async (id, updates) => {
    set((state) => ({
      products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
    
    try {
      await supabase.from('products').update(updates).eq('id', id);
    } catch (e) {
      console.warn("DB update failed, updated only locally");
    }
  },

  deleteProduct: async (id) => {
    set((state) => ({
      products: state.products.filter(p => p.id !== id)
    }));
    
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.warn("DB delete failed, deleted only locally");
    }
  },

  addRestaurant: async (restaurant) => {
    const newRest = { ...restaurant, id: `REST-${Math.floor(Math.random() * 10000)}`, orders: 0 };
    set((state) => ({
      restaurants: [newRest, ...state.restaurants]
    }));
    try {
      await supabase.from('restaurants').insert([newRest]);
    } catch(e) {
      console.warn("DB insert failed", e);
    }
  },

  updateRestaurant: async (id, updates) => {
    set((state) => ({
      restaurants: state.restaurants.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
    try {
      await supabase.from('restaurants').update(updates).eq('id', id);
    } catch(e) {
      console.warn("DB update failed", e);
    }
  },

  deleteRestaurant: async (id) => {
     set((state) => ({
      restaurants: state.restaurants.filter(r => r.id !== id)
    }));
    try {
      await supabase.from('restaurants').delete().eq('id', id);
    } catch(e) {
      console.warn("DB delete failed", e);
    }
  },

  addDriver: async (driver) => {
    const newDriver = { ...driver, id: `DRV-${Math.floor(1000 + Math.random() * 9000)}`, deliveries: 0, rating: 5.0 };
    set((state) => ({
      drivers: [newDriver, ...state.drivers]
    }));
    try {
      await supabase.from('drivers').insert([newDriver]);
    } catch(e) {
      console.warn("DB insert failed", e);
    }
  },

  updateDriver: async (id, updates) => {
     set((state) => ({
      drivers: state.drivers.map(d => d.id === id ? { ...d, ...updates } : d)
    }));
    try {
      await supabase.from('drivers').update(updates).eq('id', id);
    } catch(e) {
      console.warn("DB update failed", e);
    }
  },

  deleteDriver: async (id) => {
    set((state) => ({
      drivers: state.drivers.filter(d => d.id !== id)
    }));
    try {
      await supabase.from('drivers').delete().eq('id', id);
    } catch(e) {
      console.warn("DB delete failed", e);
    }
  },

  addCoupon: async (coupon) => {
    const newCoupon = { ...coupon, id: `COUP-${Math.floor(Math.random() * 10000)}` };
    set((state) => ({
      coupons: [newCoupon, ...state.coupons]
    }));
    try {
      await supabase.from('coupons').insert([newCoupon]);
    } catch(e) {
      console.warn("DB insert failed", e);
    }
  },

  updateCoupon: async (id, updates) => {
    set((state) => ({
      coupons: state.coupons.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
    try {
      await supabase.from('coupons').update(updates).eq('id', id);
    } catch(e) {
      console.warn("DB update failed", e);
    }
  },

  deleteCoupon: async (id) => {
    set((state) => ({
      coupons: state.coupons.filter(c => c.id !== id)
    }));
    try {
      await supabase.from('coupons').delete().eq('id', id);
    } catch(e) {
      console.warn("DB delete failed", e);
    }
  }
}));
