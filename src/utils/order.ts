/**
 * Core business logic and validation utilities for Mr Smart Shop AI
 */

export interface OrderInput {
  fullName: string;
  phone: string;
  email?: string;
  productId: string;
  productName: string;
  planId: string;
  planName: string;
  priceTnd: number | null;
  notes?: string;
}

/**
 * Validates Tunisian phone numbers.
 * Accepts formats:
 * - 8 digits directly (e.g. 58123456, 22123456, 98123456, 44123456)
 * - +216 followed by 8 digits (e.g. +21658123456)
 * - 00216 followed by 8 digits
 * - With spaces/dashes (e.g. 58 123 456, 22-123-456)
 */
export function validateTunisianPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, normalized: '', error: 'رقم الهاتف مطلوب / Le numéro de téléphone est requis' };
  }

  // Remove spaces, dashes, dots, parentheses
  let cleaned = phone.replace(/[\s\-\.\(\)]/g, '');

  // Handle +216 or 00216 prefix
  if (cleaned.startsWith('+216')) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.startsWith('00216')) {
    cleaned = cleaned.substring(5);
  } else if (cleaned.startsWith('216') && cleaned.length === 11) {
    cleaned = cleaned.substring(3);
  }

  // Must now be exactly 8 digits
  if (!/^\d{8}$/.test(cleaned)) {
    return { 
      isValid: false, 
      normalized: cleaned, 
      error: 'يرجى إدخال رقم هاتف تونسي صحيح يتكون من 8 أرقام / Veuillez entrer un numéro tunisien valide de 8 chiffres' 
    };
  }

  // Common Tunisian mobile prefixes: 2x (Ooredoo), 5x (Orange), 9x (Tunisie Telecom), 4x (Lycamobile), 3x/7x (Landlines/VoIP)
  return { isValid: true, normalized: `+216${cleaned}` };
}

/**
 * Generates an order reference code: MSS-TN-XXXXXX
 */
export function generateOrderReference(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
  return `MSS-TN-${dateStr}-${randomPart}`;
}

/**
 * Formats pricing for Tunisian Dinars.
 * Displays "Contact us for pricing" if price is null, zero, or negative.
 */
export function formatTndPrice(price: number | null | undefined, lang: 'ar' | 'fr' = 'ar'): string {
  if (price === null || price === undefined || price <= 0) {
    return lang === 'ar' ? 'اتصل بنا لمعرفة السعر' : 'Contactez-nous pour le tarif';
  }
  // Standard format in Tunisia is DT or TND
  return `${price} ${lang === 'ar' ? 'د.ت' : 'DT'}`;
}

/**
 * Builds pre-filled WhatsApp link with clear structured order details
 */
export function buildWhatsAppOrderLink(options: {
  whatsappNumber: string;
  orderRef: string;
  customerName: string;
  productName: string;
  planName: string;
  priceTnd: number | null;
  lang: 'ar' | 'fr';
}): string {
  const { whatsappNumber, orderRef, customerName, productName, planName, priceTnd, lang } = options;
  // Clean phone number (strip +, spaces)
  const cleanNumber = whatsappNumber.replace(/\D/g, '');

  let text = '';
  if (lang === 'ar') {
    text = `مرحباً Mr Smart Shop AI 🇹🇳\n` +
      `أود إتمام طلب الاشتراك الخاص بي:\n\n` +
      `🔖 رقم الطلب: ${orderRef}\n` +
      `👤 الاسم: ${customerName}\n` +
      `📦 الخدمة: ${productName}\n` +
      `⏱️ الباقة: ${planName}\n` +
      `💰 السعر: ${priceTnd ? `${priceTnd} د.ت` : 'حسب الاتفاق'}\n\n` +
      `يرجى تأكيد توفر الحساب وتزويدي ببيانات الدفع والتفعيل. شكراً لكم!`;
  } else {
    text = `Bonjour Mr Smart Shop AI 🇹🇳\n` +
      `Je souhaite finaliser ma demande d'abonnement :\n\n` +
      `🔖 Réf Commande : ${orderRef}\n` +
      `👤 Nom : ${customerName}\n` +
      `📦 Service : ${productName}\n` +
      `⏱️ Forfait : ${planName}\n` +
      `💰 Tarif : ${priceTnd ? `${priceTnd} DT` : 'Sur devis'}\n\n` +
      `Merci de me confirmer la disponibilité et les modalités de paiement / activation.`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
