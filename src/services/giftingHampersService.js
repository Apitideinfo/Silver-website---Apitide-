import { StorageService } from './StorageService';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/constants';

import giftPick1499Webp from '../assets/gift_pick_1499.webp';
import giftPick1499Png from '../assets/gift_pick_1499.png';
import giftPick1999Webp from '../assets/gift_pick_1999.webp';
import giftPick1999Png from '../assets/gift_pick_1999.png';
import giftPick2999Webp from '../assets/gift_pick_2999.webp';
import giftPick2999Png from '../assets/gift_pick_2999.png';
import giftPickPremiumWebp from '../assets/gift_pick_premium.webp';
import giftPickPremiumPng from '../assets/gift_pick_premium.png';

export const DEFAULT_GIFTING_HAMPERS = [
  {
    id: 'under-1499',
    title: 'Picks Under ₹1499',
    imgWebp: giftPick1499Webp,
    imgPng: giftPick1499Png,
    customImg: '',
    path: '/collections?maxPrice=1499'
  },
  {
    id: 'under-1999',
    title: 'Picks Under ₹1999',
    imgWebp: giftPick1999Webp,
    imgPng: giftPick1999Png,
    customImg: '',
    path: '/collections?maxPrice=1999'
  },
  {
    id: 'under-2999',
    title: 'Picks Under ₹2999',
    imgWebp: giftPick2999Webp,
    imgPng: giftPick2999Png,
    customImg: '',
    path: '/collections?maxPrice=2999'
  },
  {
    id: 'premium-gifts',
    title: 'Premium Gifts',
    imgWebp: giftPickPremiumWebp,
    imgPng: giftPickPremiumPng,
    customImg: '',
    path: '/collections?sort=luxury'
  }
];

const STORAGE_KEY = 'manish_gifting_hampers_data';
const VERSION_KEY = 'manish_gifting_hampers_version';
const CURRENT_VERSION = 'v2026_11_14_v2';
const FIRESTORE_DOC_ID = 'gifting_hampers_showcase';

export const giftingHampersService = {
  getStoredHampers() {
    const version = StorageService.get(VERSION_KEY, null);
    let cached = StorageService.get(STORAGE_KEY, null);

    if (version !== CURRENT_VERSION || !cached || !Array.isArray(cached) || cached.length !== 4) {
      cached = DEFAULT_GIFTING_HAMPERS;
      StorageService.set(STORAGE_KEY, DEFAULT_GIFTING_HAMPERS);
      StorageService.set(VERSION_KEY, CURRENT_VERSION);
      return DEFAULT_GIFTING_HAMPERS;
    }

    return cached.map((item, idx) => ({
      ...DEFAULT_GIFTING_HAMPERS[idx],
      ...item,
      imgWebp: DEFAULT_GIFTING_HAMPERS[idx].imgWebp,
      imgPng: DEFAULT_GIFTING_HAMPERS[idx].imgPng,
      customImg: item.customImg || item.image || item.img || ''
    }));
  },

  async fetchRemoteHampers() {
    try {
      if (db) {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data()) {
          const remote = snap.data();
          if (Array.isArray(remote.items) && remote.items.length === 4) {
            const merged = remote.items.map((item, idx) => ({
              ...DEFAULT_GIFTING_HAMPERS[idx],
              ...item,
              imgWebp: DEFAULT_GIFTING_HAMPERS[idx].imgWebp,
              imgPng: DEFAULT_GIFTING_HAMPERS[idx].imgPng,
              customImg: item.customImg || item.image || item.img || ''
            }));
            StorageService.set(STORAGE_KEY, merged);
            StorageService.set(VERSION_KEY, CURRENT_VERSION);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('manish_gifting_hampers_updated'));
            }
            return merged;
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch remote hampers data, using cached:', e.message);
    }
    return this.getStoredHampers();
  },

  async saveHampers(items) {
    const safeItems = Array.isArray(items) && items.length === 4 ? items : DEFAULT_GIFTING_HAMPERS;
    const payload = {
      items: safeItems,
      lastUpdated: new Date().toISOString()
    };

    // 1. Instant Local Storage with Version Stamp
    StorageService.set(STORAGE_KEY, safeItems);
    StorageService.set(VERSION_KEY, CURRENT_VERSION);

    // 2. Dispatch in current window
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manish_gifting_hampers_updated'));

      // 3. Broadcast across tabs
      if ('BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('manish_store_sync');
          bc.postMessage({ type: 'gifting_hampers', data: safeItems });
          bc.close();
        } catch { /* noop */ }
      }
    }

    // 4. Remote Firestore sync with 1.5s timeout so UI never hangs
    if (db) {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        await Promise.race([
          setDoc(docRef, payload, { merge: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
        ]);
      } catch (e) {
        console.warn('Remote sync fallback:', e.message);
      }
    }

    return safeItems;
  }
};

