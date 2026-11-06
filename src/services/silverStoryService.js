import { StorageService } from './StorageService';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/constants';

export const DEFAULT_SILVER_STORY_DATA = {
  sectionTitle: 'Silver For Every Story',
  cards: [
    {
      id: 'spotlight-1',
      title: 'TENNIS COLLECTION',
      tagline: '♥ Sparkle on repeat ♥',
      img: '',
      tab: 'bracelets'
    },
    {
      id: 'spotlight-2',
      title: 'TOE RING COLLECTION',
      tagline: '♥ Little Detail Big Mood ♥',
      img: '',
      tab: 'payal'
    },
    {
      id: 'spotlight-3',
      title: 'PEARL COLLECTION',
      tagline: '♥ Timeless Elegance ♥',
      img: '',
      tab: 'necklaces'
    },
    {
      id: 'spotlight-4',
      title: 'STONE COLLECTION',
      tagline: '♥ Add Some Shine ♥',
      img: '',
      tab: 'bracelets'
    }
  ],
  banner: {
    title: 'MANISH & CO - Diwali Festive Season - Flat 15% Off On All Products',
    img: '',
    tab: 'Collections'
  }
};

const STORAGE_KEY = 'manish_silver_story_data';
const FIRESTORE_DOC_ID = 'silver_story_showcase';

export const silverStoryService = {
  getStoredStoryData() {
    const cached = StorageService.get(STORAGE_KEY, null);
    if (cached && Array.isArray(cached.cards) && cached.cards.length === 4) {
      return cached;
    }
    return DEFAULT_SILVER_STORY_DATA;
  },

  async fetchRemoteStoryData() {
    try {
      if (db) {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data()) {
          const remote = snap.data();
          if (Array.isArray(remote.cards) && remote.cards.length === 4) {
            StorageService.set(STORAGE_KEY, remote);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('manish_silver_story_updated'));
            }
            return remote;
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch remote silver story data, using cached:', e.message);
    }
    return this.getStoredStoryData();
  },

  async saveStoryData(data) {
    const payload = {
      sectionTitle: data.sectionTitle || 'Silver For Every Story',
      cards: Array.isArray(data.cards) ? data.cards : DEFAULT_SILVER_STORY_DATA.cards,
      banner: data.banner || DEFAULT_SILVER_STORY_DATA.banner,
      lastUpdated: new Date().toISOString()
    };

    // 1. Instant Local Storage
    StorageService.set(STORAGE_KEY, payload);

    // 2. Dispatch in current window
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manish_silver_story_updated'));

      // 3. Broadcast across tabs
      if ('BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('manish_store_sync');
          bc.postMessage({ type: 'silver_story', data: payload });
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

    return payload;
  }
};

