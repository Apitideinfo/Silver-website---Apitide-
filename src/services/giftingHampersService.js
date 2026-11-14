import { StorageService } from './StorageService';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/constants';
import { storeSyncService } from './storeSyncService';

import giftPick1499Webp from '../assets/gift_pick_1499.webp';
import giftPick1499Png from '../assets/gift_pick_1499.png';
import giftPick1999Webp from '../assets/gift_pick_1999.webp';
import giftPick1999Png from '../assets/gift_pick_1999.png';
import giftPick2999Webp from '../assets/gift_pick_2999.webp';
import giftPick2999Png from '../assets/gift_pick_2999.png';
import giftPickPremiumWebp from '../assets/gift_pick_premium.webp';
import giftPickPremiumPng from '../assets/gift_pick_premium.png';

export const getHamperFallbackImage = (hamperOrId) => {
  const norm = String(
    typeof hamperOrId === 'string' ? hamperOrId : (hamperOrId?.id || hamperOrId?.title || hamperOrId?.price || '')
  ).toLowerCase();
  if (norm.includes('1499') || norm.includes('hamper-1') || norm.includes('under-1499')) return giftPick1499Webp;
  if (norm.includes('1999') || norm.includes('hamper-2') || norm.includes('under-1999')) return giftPick1999Webp;
  if (norm.includes('2999') || norm.includes('hamper-3') || norm.includes('under-2999')) return giftPick2999Webp;
  return giftPickPremiumWebp;
};

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
const FIRESTORE_DOC_ID = 'gifting_hampers_showcase';

export const giftingHampersService = {
  getStoredHampers() {
    const isAllCleared = StorageService.get('manish_gifting_hampers_all_cleared', false);
    if (isAllCleared) return [];

    const deletedIds = StorageService.get('manish_gifting_hampers_deleted_ids', []);
    let cached = StorageService.get(STORAGE_KEY, null);

    if (Array.isArray(cached)) {
      return cached
        .filter(item => item && !deletedIds.includes(item.id))
        .map(item => ({
          ...item,
          customImg: item.customImg || '',
          imgWebp: item.customImg || getHamperFallbackImage(item),
          imgPng: item.customImg || getHamperFallbackImage(item)
        }));
    }

    const isInit = StorageService.get('manish_gifting_hampers_initialized', false);
    if (!isInit) {
      StorageService.set(STORAGE_KEY, DEFAULT_GIFTING_HAMPERS);
      StorageService.set('manish_gifting_hampers_initialized', true);
      return DEFAULT_GIFTING_HAMPERS;
    }

    return [];
  },

  async fetchRemoteHampers() {
    try {
      const config = await storeSyncService.pullLatestConfig();
      if (Array.isArray(config?.giftingHampers)) {
        return this.getStoredHampers();
      }
    } catch (_e) {
      // Continue to local/remote check
    }

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

    // Shared Cloud Persistence via storeSyncService
    storeSyncService.publishSection('giftingHampers', safeItems).catch(err => {
      console.warn('storeSyncService giftingHampers publish error:', err);
    });

    const payload = {
      items: safeItems,
      lastUpdated: new Date().toISOString()
    };

    if (db) {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        setDoc(docRef, payload, { merge: true }).catch(() => {});
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
  }
};
