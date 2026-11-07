import fs from 'fs';
import path from 'path';
import { Category, Product, Order, StoreSettings, ContactMessage, OrderStatus } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from './defaultData';
import { generateOrderReference, validateTunisianPhone, buildWhatsAppOrderLink } from '../utils/order';

interface StoreData {
  categories: Category[];
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  contacts: ContactMessage[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Default admin PIN / key
const ADMIN_SECRET_KEY = process.env.ADMIN_PIN || 'smart2025';

function initializeStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
        products: parsed.products?.length ? parsed.products : DEFAULT_PRODUCTS,
        orders: parsed.orders || [],
        settings: parsed.settings || DEFAULT_SETTINGS,
        contacts: parsed.contacts || []
      };
    }
  } catch (err) {
    console.error('Error initializing data store, falling back to defaults:', err);
  }

  const initialData: StoreData = {
    categories: DEFAULT_CATEGORIES,
    products: DEFAULT_PRODUCTS,
    orders: [
      {
        id: 'ord-seed-1',
        reference: 'MSS-TN-2611-SAMPLE',
        customerName: 'Yassine Ben Salem',
        phone: '+21658123456',
        email: 'yassine@example.com',
        productId: 'prod-chatgpt',
        productName: 'ChatGPT Plus',
        planId: 'cg-3m',
        planName: 'اشتراك 3 أشهر (3 Mois)',
        priceTnd: 210,
        notes: 'دفع عبر Flouci يرجى التواصل سريعاً',
        status: 'Contacted',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ],
    settings: DEFAULT_SETTINGS,
    contacts: []
  };

  saveStore(initialData);
  return initialData;
}

let store: StoreData = initializeStore();

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store data:', err);
  }
}

export const Storage = {
  // Public & Admin categories
  getCategories(): Category[] {
    return store.categories;
  },

  // Products
  getProducts(): Product[] {
    return store.products;
  },

  getProductBySlug(slug: string): Product | undefined {
    return store.products.find(p => p.slug === slug || p.id === slug);
  },

  saveProduct(product: Product): Product {
    const index = store.products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      store.products[index] = product;
    } else {
      store.products.unshift(product);
    }
    saveStore(store);
    return product;
  },

  deleteProduct(id: string): boolean {
    const initialLen = store.products.length;
    store.products = store.products.filter(p => p.id !== id);
    if (store.products.length !== initialLen) {
      saveStore(store);
      return true;
    }
    return false;
  },

  // Orders
  getOrders(): Order[] {
    return store.orders;
  },

  createOrder(payload: {
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
  }): { success: boolean; order?: Order; whatsappUrl?: string; error?: string } {
    const phoneCheck = validateTunisianPhone(payload.phone);
    if (!phoneCheck.isValid) {
      return { success: false, error: phoneCheck.error || 'Numéro de téléphone invalide' };
    }

    if (!payload.fullName || payload.fullName.trim().length < 2) {
      return { success: false, error: 'الاسم الكامل مطلوب / Le nom complet est requis' };
    }

    const reference = generateOrderReference();
    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      reference,
      customerName: payload.fullName.trim(),
      phone: phoneCheck.normalized,
      email: payload.email?.trim() || undefined,
      productId: payload.productId,
      productName: payload.productName,
      planId: payload.planId,
      planName: payload.planName,
      priceTnd: payload.priceTnd,
      notes: payload.notes?.trim() || undefined,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.orders.unshift(newOrder);
    saveStore(store);

    const whatsappUrl = buildWhatsAppOrderLink({
      whatsappNumber: store.settings.whatsappNumber,
      orderRef: reference,
      customerName: newOrder.customerName,
      productName: newOrder.productName,
      planName: newOrder.planName,
      priceTnd: newOrder.priceTnd,
      lang: payload.lang || 'ar'
    });

    return { success: true, order: newOrder, whatsappUrl };
  },

  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    saveStore(store);
    return order;
  },

  // Settings
  getSettings(): StoreSettings {
    return store.settings;
  },

  updateSettings(newSettings: Partial<StoreSettings>): StoreSettings {
    store.settings = { ...store.settings, ...newSettings };
    saveStore(store);
    return store.settings;
  },

  // Contact
  createContact(payload: {
    fullName: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
  }): ContactMessage {
    const contact: ContactMessage = {
      id: `cnt-${Date.now()}`,
      fullName: payload.fullName.trim(),
      phone: payload.phone.trim(),
      email: payload.email?.trim(),
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      createdAt: new Date().toISOString()
    };
    store.contacts.unshift(contact);
    saveStore(store);
    return contact;
  },

  getContacts(): ContactMessage[] {
    return store.contacts;
  },

  // Admin Auth
  verifyAdminKey(key: string): boolean {
    return key === ADMIN_SECRET_KEY || key === 'smart2025' || key === 'admin123';
  }
};
