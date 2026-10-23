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
    id: 'bangles',
    name: 'Bangles',
    desc: 'Artisanal silver and gold filigree bangles crafted with timeless perfection.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'earrings',
    name: 'Earrings',
    desc: 'Bespoke chandeliers, hoops, and designer drops adorned with fine gems.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'jhumka',
    name: 'Jhumka',
    desc: 'Traditional royal heritage jhumkas with exquisite meenakari and bell drops.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'kada',
    name: 'Kada',
    desc: 'Royal antique chitai kadas and solid silver & gold statement cuffs.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'necklace',
    name: 'Necklace',
    desc: 'Grand heirloom bridal necklaces, polki jadau sets, and royal chokers.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'payal',
    name: 'Payal',
    desc: 'Pure 925 sterling silver payals, bridal anklets, and delicate daily chains.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'pendant-locket',
    name: 'Pendant & Locket',
    desc: 'Sacred deity lockets, solitaires, and vintage filigree everyday pendants.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'rings',
    name: 'Rings',
    desc: 'Handcrafted diamond solitaires, sovereign signets, and cocktail eternity bands.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'silver-chain',
    name: 'Silver Chain',
    desc: 'Italian curb, rope, and box chains in 925 sterling silver and 22K gold.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'tops-studs',
    name: 'Tops & Studs',
    desc: 'Sparkling diamond florals, solitaires, and minimalist daily studs.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'mangalsutras',
    name: 'Mangalsutras',
    desc: 'Authentic 22K gold and silver designer sacred mangalsutra suites.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'gold-coins',
    name: 'Gold Coins',
    desc: '24K 999 certified Lakshmi & Ganesh gold bullion coins and silver bars.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'solitaires',
    name: 'Solitaires',
    desc: 'Exquisite certified solitaires and brilliant cut diamonds set in hallmarked gold.',
    img: '',
    createdDate: '2026-01-01T00:00:00.000Z'
  }
]);

