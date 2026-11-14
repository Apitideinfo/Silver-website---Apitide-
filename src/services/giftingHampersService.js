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
const CURRENT_VERSION = 'v2026_11_14_v4';
const FIRESTORE_DOC_ID = 'gifting_hampers_showcase';

export const giftingHampersService = {
  getStoredHampers() {
    const isAllCleared = StorageService.get('manish_gifting_hampers_all_cleared', false);
    if (isAllCleared) return [];

    const deletedIds = StorageService.get('manish_gifting_hampers_deleted_ids', []);
    const version = StorageService.get(VERSION_KEY, null);
    let cached = StorageService.get(STORAGE_KEY, null);

    if (version !== CURRENT_VERSION || !cached || !Array.isArray(cached)) {
      cached = DEFAULT_GIFTING_HAMPERS;
      StorageService.set(STORAGE_KEY, DEFAULT_GIFTING_HAMPERS);
      StorageService.set(VERSION_KEY, CURRENT_VERSION);
    }

    return cached
      .filter(item => item && !deletedIds.includes(item.id))
      .map((item, idx) => {
        const defaultRef = DEFAULT_GIFTING_HAMPERS.find(d => d.id === item.id) || DEFAULT_GIFTING_HAMPERS[idx] || {};
        return {
          ...defaultRef,
          ...item,
          imgWebp: defaultRef.imgWebp || item.imgWebp,
          imgPng: defaultRef.imgPng || item.imgPng,
          customImg: item.customImg || item.image || item.img || ''
        };
      });
  },

  async fetchRemoteHampers() {
    try {
      if (db) {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        const snap = await Promise.race([
          getDoc(docRef),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
        ]);
        if (snap && snap.exists() && snap.data()) {
          const remote = snap.data();
          const isAllCleared = StorageService.get('manish_gifting_hampers_all_cleared', false);
          if (!isAllCleared && Array.isArray(remote.items)) {
            StorageService.set(STORAGE_KEY, remote.items);
            StorageService.set(VERSION_KEY, CURRENT_VERSION);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('manish_gifting_hampers_updated', { detail: remote.items }));
            }
            return this.getStoredHampers();
          }
        }
      }
    } catch (e) {
      // Offline fallback
    }
    return this.getStoredHampers();
  },

  async saveHampers(items) {
    const safeItems = Array.isArray(items) ? items : [];
    const isAllCleared = safeItems.length === 0;
    StorageService.set('manish_gifting_hampers_all_cleared', isAllCleared);

    StorageService.set(STORAGE_KEY, safeItems);
    StorageService.set(VERSION_KEY, CURRENT_VERSION);

    // Cross-tab and window sync pulse
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('manish_sync_pulse', `gifting_hampers_${Date.now()}`);
      } catch (_e) { /* noop */ }

      window.dispatchEvent(new CustomEvent('manish_gifting_hampers_updated', { detail: safeItems }));

      if ('BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('manish_store_sync');
          bc.postMessage({ type: 'gifting_hampers', data: safeItems, timestamp: Date.now() });
          bc.close();
        } catch { /* noop */ }
      }
    }

    const payload = {
      items: safeItems,
      lastUpdated: new Date().toISOString()
    };

    if (db) {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        await Promise.race([
          setDoc(docRef, payload, { merge: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
        ]);
      } catch (e) {
        // Fallback
      }
    }

    return safeItems;
  },

  async deleteHamper(hamperId) {
    const current = this.getStoredHampers();
    const updated = current.filter(h => h.id !== hamperId);

    const deletedIds = StorageService.get('manish_gifting_hampers_deleted_ids', []);
    if (!deletedIds.includes(hamperId)) {
      deletedIds.push(hamperId);
      StorageService.set('manish_gifting_hampers_deleted_ids', deletedIds);
    }

    return this.saveHampers(updated);
  },

  async addHamper(newHamper) {
    const current = this.getStoredHampers();
    const hamperToAdd = {
      id: newHamper?.id || `hamper-${Date.now()}`,
      title: newHamper?.title || 'New Gift Hamper',
      customImg: newHamper?.customImg || '',
      path: newHamper?.path || '/collections'
    };
    const updated = [...current, hamperToAdd];
    return this.saveHampers(updated);
  },

  async resetHampers() {
    StorageService.set('manish_gifting_hampers_all_cleared', false);
    StorageService.set('manish_gifting_hampers_deleted_ids', []);
    return this.saveHampers(DEFAULT_GIFTING_HAMPERS);
  }
};
