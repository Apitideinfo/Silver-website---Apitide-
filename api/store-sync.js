/* global process, Buffer */
import { cloudinary } from './_utils/cloudinary.js';

const CONFIG_PUBLIC_ID = 'manish_store_config.json';
const ADMIN_API_KEY = process.env.MANISH_ADMIN_SECRET || 'manish_admin_secure_vault_2026';

let inMemoryConfig = null;
let lastResourceVersion = 0;

// Fallback base configuration matching baseline website data
const BASE_CONFIG = {
  version: '2026.11.15.1',
  lastUpdated: new Date().toISOString(),
  categories: [
    { id: 'pendant', name: 'Pendant', desc: 'Sacred deity lockets, solitaires, and vintage filigree everyday pendants.', img: '' },
    { id: 'necklaces', name: 'Necklaces', desc: 'Grand heirloom bridal necklaces, polki jadau sets, and royal chokers.', img: '' },
    { id: 'mangalsutra', name: 'Mangalsutra', desc: 'Sacred auspicious black beads mangalsutras in 925 hallmarked silver.', img: '' },
    { id: 'toe-ring', name: 'Toe Ring', desc: 'Traditional and contemporary 925 pure silver toe rings and bichiyas.', img: '' },
    { id: 'anklets', name: 'Anklets', desc: 'Pure 925 sterling silver payals, bridal anklets, and delicate daily chains.', img: '' },
    { id: 'chain', name: 'Chain', desc: 'Italian curb, rope, and box chains in 925 sterling silver and 22K gold.', img: '' },
    { id: 'rings', name: 'Rings', desc: 'Handcrafted 925 sterling silver rings, solitaires, and band rings.', img: '' },
    { id: 'earring', name: 'Earring', desc: 'Designer silver drops, hoops, chandbalis, and daily wear studs.', img: '' },
    { id: 'bracelets', name: 'Bracelets', desc: 'Sparkling diamond infinity bracelets and tennis chains in 925 sterling silver.', img: '' },
    { id: 'stone-bracelets', name: 'Stone Bracelets', desc: 'Healing gemstones and vibrant beaded stone bracelets in 925 sterling silver.', img: '' }
  ],
  heroBanners: [
    { id: 'hero-1', title: 'Timeless Silver Jewellery Collection', customImg: '', mobileImg: '', page: 'collections', category: 'Collections' },
    { id: 'hero-2', title: 'Luxury Navy Blue Earring Collection', customImg: '', mobileImg: '', page: 'collections', category: 'earrings' },
    { id: 'hero-3', title: 'Brand Promise - 925 Hallmark Purity', customImg: '', mobileImg: '', page: 'collections', category: 'Collections' },
    { id: 'hero-4', title: 'Royal Diwali Festive Season Glow', customImg: '', mobileImg: '', page: 'collections', category: 'Collections' }
  ],
  silverStory: {
    sectionTitle: 'Silver For Every Story',
    cards: [
      { id: 'spotlight-1', title: 'TENNIS COLLECTION', tagline: '♥ Sparkle on repeat ♥', img: '', tab: 'bracelets' },
      { id: 'spotlight-2', title: 'TOE RING COLLECTION', tagline: '♥ Little Detail Big Mood ♥', img: '', tab: 'payal' },
      { id: 'spotlight-3', title: 'PEARL COLLECTION', tagline: '♥ Timeless Elegance ♥', img: '', tab: 'necklaces' },
      { id: 'spotlight-4', title: 'STONE COLLECTION', tagline: '♥ Add Some Shine ♥', img: '', tab: 'bracelets' }
    ],
    banner: {
      title: 'MANISH & CO - Diwali Festive Season - Flat 15% Off On All Products',
      img: '',
      tab: 'Collections',
      hidden: false
    }
  },
  giftingHampers: [
    { id: 'hamper-1', title: 'Festive Gift Picks Under 1499', price: 'Under 1499', customImg: '', path: 'collections' },
    { id: 'hamper-2', title: 'Festive Gift Picks Under 1999', price: 'Under 1999', customImg: '', path: 'collections' },
    { id: 'hamper-3', title: 'Festive Gift Picks Under 2999', price: 'Under 2999', customImg: '', path: 'collections' },
    { id: 'hamper-4', title: 'Royal Luxury Silver Hampers', price: 'Premium', customImg: '', path: 'collections' }
  ]
};

// Helper: fetch latest published config from Cloudinary
async function fetchPublishedConfig() {
  try {
    // 1. Check Cloudinary resource metadata to get the exact latest version
    const resource = await cloudinary.api.resource(CONFIG_PUBLIC_ID, { resource_type: 'raw' });
    if (resource?.version && resource.version === lastResourceVersion && inMemoryConfig) {
      return inMemoryConfig;
    }

    const versionUrl = resource?.secure_url || cloudinary.url(CONFIG_PUBLIC_ID, { resource_type: 'raw', secure: true });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(versionUrl, {
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        const merged = {
          ...BASE_CONFIG,
          ...data,
          categories: Array.isArray(data.categories) ? data.categories : BASE_CONFIG.categories,
          heroBanners: Array.isArray(data.heroBanners) ? data.heroBanners : BASE_CONFIG.heroBanners,
          silverStory: (data.silverStory && typeof data.silverStory === 'object') ? data.silverStory : BASE_CONFIG.silverStory,
          giftingHampers: Array.isArray(data.giftingHampers) ? data.giftingHampers : BASE_CONFIG.giftingHampers
        };
        inMemoryConfig = merged;
        lastResourceVersion = resource?.version || Date.now();
        return merged;
      }
    }
  } catch (err) {
    console.warn('[store-sync] Warning fetching Cloudinary published config:', err.message);
  }
  return inMemoryConfig || BASE_CONFIG;
}

export default async function handler(req, res) {
  // Global CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-admin-key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── GET: Fetch Shared Configuration ──────────────────────────────
  if (req.method === 'GET') {
    try {
      const config = await fetchPublishedConfig();
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3, stale-while-revalidate=10');
      return res.status(200).json({
        success: true,
        data: config,
        timestamp: config.lastUpdated || new Date().toISOString()
      });
    } catch (err) {
      console.error('[store-sync] GET Error:', err);
      return res.status(200).json({
        success: true,
        data: inMemoryConfig || BASE_CONFIG,
        fallback: true,
        error: err.message
      });
    }
  }

  // ─── POST: Secure Admin Update ──────────────────────────────────
  if (req.method === 'POST') {
    try {
      // 1. Authorization check
      const authHeader = req.headers['authorization'] || '';
      const adminKeyHeader = req.headers['x-admin-key'] || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();

      const isAuthorized = 
        adminKeyHeader === ADMIN_API_KEY ||
        token === ADMIN_API_KEY ||
        req.body?.adminKey === ADMIN_API_KEY;

      if (!isAuthorized) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Admin authentication key' });
      }

      // 2. Validate payload
      const { section, data, fullSync } = req.body || {};
      if (!section && !fullSync) {
        return res.status(400).json({ error: 'Missing section or fullSync payload' });
      }

      // 3. Read current published config
      const currentConfig = await fetchPublishedConfig();
      let updatedConfig = { ...currentConfig };

      if (fullSync && typeof data === 'object') {
        updatedConfig = {
          ...currentConfig,
          ...data,
          lastUpdated: new Date().toISOString(),
          version: `v_${Date.now()}`
        };
      } else if (section) {
        // Atomic section update
        const allowedSections = ['categories', 'heroBanners', 'silverStory', 'giftingHampers', 'products'];
        if (!allowedSections.includes(section)) {
          return res.status(400).json({ error: `Invalid section: ${section}. Allowed: ${allowedSections.join(', ')}` });
        }

        updatedConfig[section] = data;
        updatedConfig.lastUpdated = new Date().toISOString();
        updatedConfig.version = `v_${Date.now()}`;
      }

      // 4. Atomic upload to Cloudinary CDN
      const base64Data = Buffer.from(JSON.stringify(updatedConfig, null, 2)).toString('base64');
      const uploadRes = await cloudinary.uploader.upload('data:application/json;base64,' + base64Data, {
        resource_type: 'raw',
        public_id: CONFIG_PUBLIC_ID,
        overwrite: true,
        invalidate: true
      });

      inMemoryConfig = updatedConfig;
      lastResourceVersion = uploadRes.version;

      console.log(`[store-sync] Successfully published section '${section || 'fullSync'}' to Cloudinary:`, uploadRes.secure_url);

      return res.status(200).json({
        success: true,
        section,
        version: updatedConfig.version,
        lastUpdated: updatedConfig.lastUpdated,
        url: uploadRes.secure_url
      });
    } catch (err) {
      console.error('[store-sync] POST Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
