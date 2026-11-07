import { Category, Product, Order, StoreSettings, ContactMessage, OrderStatus } from '../types';

export const apiClient = {
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getProducts(): Promise<Product[]> {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(slug: string): Promise<Product> {
    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async getSettings(): Promise<StoreSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async createOrder(payload: {
    fullName: string;
    phone: string;
    email?: string;
    productId: string;
    productName: string;
    planId: string;
    planName: string;
    priceTnd: number | null;
    notes?: string;
    lang?: 'ar' | 'fr';
  }): Promise<{ success: boolean; order: Order; whatsappUrl: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit order');
    return data;
  },

  async submitContact(payload: {
    fullName: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; contact: ContactMessage }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit contact');
    return data;
  },

  // Admin API
  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid admin credentials');
    return data;
  },

  async getAdminStats(token: string) {
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async getAdminOrders(token: string): Promise<Order[]> {
    const res = await fetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async updateOrderStatus(token: string, orderId: string, status: OrderStatus): Promise<Order> {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order');
    return data.order;
  },

  async saveProduct(token: string, product: Product): Promise<Product> {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save product');
    return data.product;
  },

  async createProduct(token: string, product: Omit<Product, 'id'>): Promise<Product> {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data.product;
  },

  async deleteProduct(token: string, id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.success;
  },

  async updateSettings(token: string, settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data.settings;
  }
};
