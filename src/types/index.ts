export type Language = 'ar' | 'fr';

export type CategoryId = 'ai' | 'design' | 'video' | 'entertainment' | 'music' | 'productivity';

export interface Category {
  id: CategoryId;
  nameAr: string;
  nameFr: string;
  icon: string;
  descriptionAr: string;
  descriptionFr: string;
}

export interface SubscriptionPlan {
  id: string;
  nameAr: string;
  nameFr: string;
  durationAr: string;
  durationFr: string;
  priceTnd: number | null; // null means "contact us for pricing"
  isPopular?: boolean;
  isAvailable: boolean;
  featuresAr: string[];
  featuresFr: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: CategoryId;
  shortDescAr: string;
  shortDescFr: string;
  fullDescAr: string;
  fullDescFr: string;
  brandColor: string;
  iconName: string;
  logoUrl?: string;
  availability: 'instant' | 'assisted' | 'on_request';
  availabilityLabelAr: string;
  availabilityLabelFr: string;
  isFeatured: boolean;
  isAvailable: boolean;
  startingPriceTnd: number | null;
  plans: SubscriptionPlan[];
  keyFeaturesAr: string[];
  keyFeaturesFr: string[];
  faqsAr: { q: string; a: string }[];
  faqsFr: { q: string; a: string }[];
}

export type OrderStatus = 'New' | 'Pending' | 'Contacted' | 'Processing' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  email?: string;
  productId: string;
  productName: string;
  planId: string;
  planName: string;
  priceTnd: number | null;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeNameAr: string;
  storeNameFr: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  currency: string;
  announcementAr: string;
  announcementFr: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
}
