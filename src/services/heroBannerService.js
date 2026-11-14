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

const STORAGE_KEY = 'manish_hero_banners_data';
const FIRESTORE_DOC_ID = 'hero_banners_carousel';

export const heroBannerService = {
  getStoredBanners() {
    let cached = StorageService.get(STORAGE_KEY, null);

    if (Array.isArray(cached) && cached.length > 0) {
      return cached.map((banner, idx) => {
        const def = DEFAULT_HERO_BANNERS[idx % DEFAULT_HERO_BANNERS.length];
        return {
          ...def,
          ...banner,
          webp: banner.webp || def.webp,
          png: banner.png || def.png,
          customImg: banner.customImg || banner.img || banner.image || '',
          mobileImg: banner.mobileImg || ''
        };
      });
    }

    const isInit = StorageService.get('manish_hero_banners_initialized', false);
    if (!isInit) {
      StorageService.set(STORAGE_KEY, DEFAULT_HERO_BANNERS);
      StorageService.set('manish_hero_banners_initialized', true);
      return DEFAULT_HERO_BANNERS;
    }

    return [];
  },

  async fetchRemoteBanners() {
    try {
      const config = await storeSyncService.pullLatestConfig();
      if (Array.isArray(config?.heroBanners) && config.heroBanners.length > 0) {
        return this.getStoredBanners();
      }
    } catch (_e) {
      // Continue to local/remote check
    }

    try {
      if (db) {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data()) {
          const remote = snap.data();
          if (Array.isArray(remote.banners) && remote.banners.length > 0) {
            const merged = remote.banners.map((banner, idx) => {
              const def = DEFAULT_HERO_BANNERS[idx % DEFAULT_HERO_BANNERS.length];
              return {
                ...def,
                ...banner,
                webp: banner.webp || def.webp,
                png: banner.png || def.png,
                customImg: banner.customImg || banner.img || banner.image || '',
                mobileImg: banner.mobileImg || ''
              };
            });
            StorageService.set(STORAGE_KEY, merged);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('manish_hero_banners_updated'));
            }
            return merged;
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch remote hero banners, using local cache:', e.message);
    }
    return this.getStoredBanners();
  },

  async saveBanners(banners) {
    const safeBanners = Array.isArray(banners) ? banners : [];
    const payload = {
      banners: safeBanners,
      lastUpdated: new Date().toISOString()
    };

    StorageService.set(STORAGE_KEY, safeBanners);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manish_hero_banners_updated'));

      if ('BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('manish_store_sync');
          bc.postMessage({ type: 'hero_banners', data: safeBanners });
          bc.close();
        } catch { /* noop */ }
      }
    }

    storeSyncService.publishSection('heroBanners', safeBanners).catch(err => {
      console.warn('storeSyncService heroBanners publish error:', err);
    });

    if (db) {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        setDoc(docRef, payload, { merge: true }).catch(() => {});
      } catch (e) {
        console.warn('Hero banners remote sync fallback:', e.message);
      }
    }

    return safeBanners;
  }
};
