import { StorageService } from './StorageService';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/constants';
import { storeSyncService } from './storeSyncService';

import heroBannerTimelessSilverWebp from '../assets/hero_banner_timeless_silver.webp';
import heroBannerTimelessSilverPng from '../assets/hero_banner_timeless_silver.png';
import heroBannerLuxuryEarringWebp from '../assets/hero_banner_luxury_earring.webp';
import heroBannerLuxuryEarringPng from '../assets/hero_banner_luxury_earring.png';
import heroBannerBrandPromiseWebp from '../assets/hero_banner_brand_promise.webp';
import heroBannerBrandPromisePng from '../assets/hero_banner_brand_promise.png';
import heroBannerDiwaliGlowWebp from '../assets/hero_banner_diwali_glow.webp';
import heroBannerDiwaliGlowPng from '../assets/hero_banner_diwali_glow.png';

export const DEFAULT_HERO_BANNERS = [
  {
    id: 'hero-1',
    title: 'Timeless Silver Jewellery Collection',
    customImg: '',
    webp: heroBannerTimelessSilverWebp,
    png: heroBannerTimelessSilverPng,
    alt: 'Timeless Silver Jewellery Collection - MANISH & CO',
    page: 'collections',
    category: 'Collections'
  },
  {
    id: 'hero-2',
    title: 'Luxury Navy Blue Earring Collection',
    customImg: '',
    webp: heroBannerLuxuryEarringWebp,
    png: heroBannerLuxuryEarringPng,
    alt: 'Luxury Navy Blue Earring Collection - MANISH & CO',
    page: 'collections',
    category: 'earrings'
  },
  {
    id: 'hero-3',
    title: 'Brand Promise - 925 Hallmark Purity',
    customImg: '',
    webp: heroBannerBrandPromiseWebp,
    png: heroBannerBrandPromisePng,
    alt: 'Brand Promise - Pure 925 Sterling Silver - MANISH & CO',
    page: 'collections',
    category: 'Collections'
  },
  {
    id: 'hero-4',
    title: 'Royal Diwali Festive Season Glow',
    customImg: '',
    webp: heroBannerDiwaliGlowWebp,
    png: heroBannerDiwaliGlowPng,
    alt: 'Royal Diwali Festive Season Glow - MANISH & CO',
    page: 'collections',
    category: 'Collections'
  }
];

const DEFAULT_BANNER_MAP = {
  'hero-1': { webp: heroBannerTimelessSilverWebp, png: heroBannerTimelessSilverPng, title: 'Timeless Silver Jewellery Collection', alt: 'Timeless Silver Jewellery Collection - MANISH & CO' },
  'hero-2': { webp: heroBannerLuxuryEarringWebp, png: heroBannerLuxuryEarringPng, title: 'Luxury Navy Blue Earring Collection', alt: 'Luxury Navy Blue Earring Collection - MANISH & CO' },
  'hero-3': { webp: heroBannerBrandPromiseWebp, png: heroBannerBrandPromisePng, title: 'Brand Promise - 925 Hallmark Purity', alt: 'Brand Promise - Pure 925 Sterling Silver - MANISH & CO' },
  'hero-4': { webp: heroBannerDiwaliGlowWebp, png: heroBannerDiwaliGlowPng, title: 'Royal Diwali Festive Season Glow', alt: 'Royal Diwali Festive Season Glow - MANISH & CO' }
};

const sanitizeBanner = (banner, idx) => {
  const def = DEFAULT_BANNER_MAP[banner?.id] || DEFAULT_HERO_BANNERS[idx % DEFAULT_HERO_BANNERS.length];
  let customImg = (banner?.customImg || banner?.img || banner?.image || '').trim();
  // Strip stale relative hashes or dead blob URLs that cause broken images
  if (customImg.startsWith('blob:') || customImg.startsWith('/assets/') || customImg.startsWith('assets/')) {
    customImg = '';
  }
  let mobileImg = (banner?.mobileImg || '').trim();
  if (mobileImg.startsWith('blob:') || mobileImg.startsWith('/assets/') || mobileImg.startsWith('assets/')) {
    mobileImg = '';
  }

  return {
    ...def,
    ...banner,
    webp: def?.webp || banner?.webp || heroBannerTimelessSilverWebp,
    png: def?.png || banner?.png || heroBannerTimelessSilverPng,
    customImg,
    mobileImg
  };
};

const STORAGE_KEY = 'manish_hero_banners_data';
const DELETED_KEY = 'manish_hero_banners_deleted_ids';
const FIRESTORE_DOC_ID = 'hero_banners_carousel';

export const heroBannerService = {
  getStoredBanners() {
    const deletedIds = StorageService.get(DELETED_KEY, []);
    let cached = StorageService.get(STORAGE_KEY, null);

    if (Array.isArray(cached) && cached.length > 0) {
      return cached
        .filter(banner => banner && banner.id && !deletedIds.includes(banner.id))
        .map((banner, idx) => sanitizeBanner(banner, idx));
    }

    const isInit = StorageService.get('manish_hero_banners_initialized', false);
    if (!isInit) {
      const initial = DEFAULT_HERO_BANNERS.filter(b => !deletedIds.includes(b.id));
      StorageService.set(STORAGE_KEY, initial);
      StorageService.set('manish_hero_banners_initialized', true);
      return initial;
    }

    return DEFAULT_HERO_BANNERS.filter(b => !deletedIds.includes(b.id));
  },

  async fetchRemoteBanners() {
    const deletedIds = StorageService.get(DELETED_KEY, []);

    try {
      const config = await storeSyncService.pullLatestConfig();
      if (Array.isArray(config?.heroBanners)) {
        const valid = config.heroBanners.filter(b => b && b.id && !deletedIds.includes(b.id));
        if (valid.length > 0) {
          const sanitized = valid.map((b, idx) => sanitizeBanner(b, idx));
          StorageService.set(STORAGE_KEY, sanitized);
          return sanitized;
        }
      }
    } catch (_e) {
      // Continue to local/remote check
    }

    try {
      if (db) {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        const snap = await Promise.race([
          getDoc(docRef),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
        ]);
        if (snap && snap.exists() && snap.data()) {
          const remote = snap.data();
          if (Array.isArray(remote.banners)) {
            const filtered = remote.banners.filter(b => b && b.id && !deletedIds.includes(b.id));
            if (filtered.length > 0) {
              const merged = filtered.map((banner, idx) => sanitizeBanner(banner, idx));
              StorageService.set(STORAGE_KEY, merged);
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('manish_hero_banners_updated', { detail: merged }));
              }
              return merged;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch remote hero banners, using local cache:', e.message);
    }
    return this.getStoredBanners();
  },

  async saveBanners(banners) {
    const deletedIds = StorageService.get(DELETED_KEY, []);
    const safeBanners = (Array.isArray(banners) ? banners : [])
      .filter(b => b && b.id && !deletedIds.includes(b.id))
      .map((b, idx) => sanitizeBanner(b, idx));

    const cleanPayload = {
      banners: safeBanners.map(b => ({
        id: String(b.id || `hero-${Date.now()}`),
        title: String(b.title || ''),
        subtitle: String(b.subtitle || ''),
        cta: String(b.cta || ''),
        page: String(b.page || 'collections'),
        category: String(b.category || 'Collections'),
        customImg: String(b.customImg || ''),
        mobileImg: String(b.mobileImg || ''),
        alt: String(b.alt || b.title || '')
      })),
      lastUpdated: new Date().toISOString()
    };

    // 1. Instant local storage persistence
    StorageService.set(STORAGE_KEY, safeBanners);

    // 2. Pulse for cross-tab and cross-window sync
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('manish_sync_pulse', `hero_banners_${Date.now()}`);
      } catch (_e) { /* noop */ }

      window.dispatchEvent(new CustomEvent('manish_hero_banners_updated', { detail: safeBanners }));

      if ('BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('manish_store_sync');
          bc.postMessage({ type: 'hero_banners', data: safeBanners, timestamp: Date.now() });
          bc.close();
        } catch { /* noop */ }
      }
    }

    // 3. Background Cloud Persistence via storeSyncService (non-blocking)
    storeSyncService.publishSection('heroBanners', cleanPayload.banners).catch(err => {
      console.warn('storeSyncService heroBanners publish error:', err);
    });

    // 4. Background Firestore sync attempt (non-blocking with merge & safe timeout)
    if (db) {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        Promise.race([
          setDoc(docRef, cleanPayload, { merge: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]).catch(e => {
          console.warn('Hero banners remote sync fallback:', e.message);
        });
      } catch (e) {
        // Fallback
      }
    }

    return safeBanners;
  },

  async deleteBanner(bannerId, nextBanners) {
    const deletedIds = StorageService.get(DELETED_KEY, []);
    if (bannerId && !deletedIds.includes(bannerId)) {
      deletedIds.push(bannerId);
      StorageService.set(DELETED_KEY, deletedIds);
    }

    const current = nextBanners || this.getStoredBanners().filter(b => b.id !== bannerId);
    return this.saveBanners(current);
  }
};
