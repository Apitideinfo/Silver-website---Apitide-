/**
 * MANISH & CO — Global Constants
 */

// ─── BUSINESS CONFIG ──────────────────────────────────────────
export const BUSINESS = Object.freeze({
  NAME: 'MANISH & CO',
  TAGLINE: 'Fine Silver Jewellery',
  WHATSAPP_NUMBER: '919451638680',
  PHONE_PRIMARY: '+91-9451638680',
  FOUNDER: 'Manish Verma',
  EMAIL: 'manishverma.bussiness@gmail.com',
  ADDRESS: 'Mau, Uttar Pradesh 275101, India',
  MAPS_URL: 'https://maps.google.com/?q=Mau+Uttar+Pradesh',
  SITE_URL: 'https://manishsilverjewellery.com',
  ESTABLISHED_YEAR: 1996,
});

// ─── API ENDPOINTS ─────────────────────────────────────────────
export const API = Object.freeze({
  GOLD_PRICE: 'https://api.gold-api.com/price/XAU',
  SILVER_PRICE: 'https://api.gold-api.com/price/XAG',
  EXCHANGE_RATE: 'https://open.er-api.com/v6/latest/USD',
});

// ─── FIRESTORE COLLECTIONS (ISOLATED FROM HR JEWELLERS) ────────
export const FIRESTORE_COLLECTIONS = Object.freeze({
  PRODUCTS: import.meta.env.VITE_COLLECTION_PRODUCTS || 'manish_products',
  CATEGORIES: import.meta.env.VITE_COLLECTION_CATEGORIES || 'manish_categories',
  ORDERS: import.meta.env.VITE_COLLECTION_ORDERS || 'manish_orders',
  CONSULTATIONS: import.meta.env.VITE_COLLECTION_CONSULTATIONS || 'manish_consultations',
  SAVINGS_ENROLLMENTS: import.meta.env.VITE_COLLECTION_SAVINGS || 'manish_savings_enrollments',
  SYSTEM_CONFIGS: import.meta.env.VITE_COLLECTION_CONFIGS || 'manish_system_configs',
  ADMIN_SETTINGS: import.meta.env.VITE_COLLECTION_ADMIN || 'manish_admin_settings',
  FCM_TOKENS: import.meta.env.VITE_COLLECTION_TOKENS || 'manish_fcm_tokens',
});

// ─── STORAGE KEYS ──────────────────────────────────────────────
export const STORAGE_KEYS = Object.freeze({
  WISHLIST: 'manish_wishlist',
  CART: 'manish_cart',
  RECENTLY_VIEWED: 'manish_recently_viewed',
  ADMIN_SESSION: 'manish_admin_user',
  ADMIN_ROLE: 'manish_admin_role',
});

// ─── METAL RATES ───────────────────────────────────────────────
export const DEFAULT_RATES = Object.freeze({
  GOLD: { '24K': 7788, '22K': 7250, '18K': 5940 },
  SILVER: { '999': 95, '925': 88 },
});

export const METAL_CONSTANTS = Object.freeze({
  TROY_OUNCE_GRAMS: 31.1034768,
  PREMIUM_MULTIPLIER: 1.15,
  GOLD_22K_RATIO: 0.9167,
  GOLD_18K_RATIO: 0.75,
  SILVER_925_RATIO: 0.925,
  GST_RATE: 0.03,
  RATES_CACHE_DURATION_MS: 30 * 60 * 1000,
});

// ─── UI TIMING ─────────────────────────────────────────────────
export const TIMING = Object.freeze({
  SEARCH_DEBOUNCE_MS: 300,
  API_TIMEOUT_MS: 8000,
  API_RETRY_COUNT: 2,
});

// ─── VALIDATION ────────────────────────────────────────────────
export const VALIDATION = Object.freeze({
  PHONE_REGEX: /^[6-9]\d{9}$/,
  WEIGHT_MIN_GRAMS: 0.1,
  WEIGHT_MAX_GRAMS: 5000,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
});

// ─── ROUTES ────────────────────────────────────────────────────
export const ROUTES = Object.freeze({
  HOME: 'home',
  COLLECTIONS: 'collections',
  SAVINGS: 'savings',
  GOLD_RESERVE: 'gold-reserve',
  OFFERS: 'offers',
  PRODUCT_DETAIL: 'product-detail',
  HERITAGE: 'heritage',
  VALUATION: 'valuation',
  GOLD_COINS: 'gold-coins',
  SHOWROOMS: 'showrooms',
  SAVINGS_ENROLL: 'savings-enroll',
  CHECKOUT: 'checkout',
  TERMS: 'terms-and-conditions',
  PRIVACY: 'privacy-policy',
  ADMIN: 'admin',
});

// ─── INITIAL BASELINE CATEGORIES ──────────────────────────────
export const INITIAL_CATEGORIES = Object.freeze([
  {
    id: 'solitaires',
    name: 'Solitaires & Diamonds',
    desc: 'Exquisite certified solitaires and brilliant cut diamonds set in hallmarked gold.',
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'necklaces',
    name: 'Royal Necklaces & Chokers',
    desc: 'Grand heirloom bridal necklaces and polki jadau choker masterpieces.',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'bangles-kadas',
    name: 'Bangles & Kadas',
    desc: 'Traditional royal chitai kadas and modern filigree gold bangles.',
    img: 'https://images.unsplash.com/photo-1611591475879-da60a37392c0?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'rings',
    name: 'Cocktail & Eternity Rings',
    desc: 'Handcrafted engagement bands, sovereign rings, and daily wear elegance.',
    img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'silver-pooja',
    name: '925 Silver & Pooja Heirlooms',
    desc: 'Hallmarked 925 sterling silver tableware, pooja thalis, payals, and gifting coins.',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'chains-mangalsutras',
    name: 'Chains & Mangalsutras',
    desc: 'Authentic 22K gold daily chains and sacred designer mangalsutra suites.',
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'gold-coins',
    name: 'Sovereign Bullion Coins',
    desc: '24K 999 certified Lakshmi & Ganesh gold bullion coins and silver bars.',
    img: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-01-01T00:00:00.000Z'
  }
]);
