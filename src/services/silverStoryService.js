import { StorageService } from './StorageService';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/constants';
import { storeSyncService } from './storeSyncService';

import colTennisWebp from '../assets/col_tennis.webp';
import colToeRingWebp from '../assets/col_toe_ring.webp';
import colPearlWebp from '../assets/col_pearl.webp';
import colStoneWebp from '../assets/col_stone.webp';
import diwaliFestiveManishAndCoWebp from '../assets/diwali_festive_manish_and_co.webp';

export const getStoryCardFallbackImage = (cardOrId, idx = 0) => {
  const norm = String(
    typeof cardOrId === 'string' ? cardOrId : (cardOrId?.id || cardOrId?.title || cardOrId?.tab || '')
  ).toLowerCase();
  if (norm.includes('tennis') || norm.includes('spotlight-1')) return colTennisWebp;
  if (norm.includes('toe') || norm.includes('spotlight-2') || norm.includes('payal')) return colToeRingWebp;
  if (norm.includes('pearl') || norm.includes('spotlight-3') || norm.includes('necklace')) return colPearlWebp;
  if (norm.includes('stone') || norm.includes('spotlight-4')) return colStoneWebp;
  const fallbacks = [colTennisWebp, colToeRingWebp, colPearlWebp, colStoneWebp];
  return fallbacks[idx % fallbacks.length];
};

export const getStoryBannerFallbackImage = () => diwaliFestiveManishAndCoWebp;

export const DEFAULT_SILVER_STORY_DATA = {
  sectionTitle: 'Silver For Every Story',
  cards: [
    {
      id: 'spotlight-1',
      title: 'TENNIS COLLECTION',
      tagline: '♥ Sparkle on repeat ♥',
      img: colTennisWebp,
      tab: 'bracelets'
    },
    {
      id: 'spotlight-2',
      title: 'TOE RING COLLECTION',
      tagline: '♥ Little Detail Big Mood ♥',
      img: colToeRingWebp,
      tab: 'payal'
    },
    {
      id: 'spotlight-3',
      title: 'PEARL COLLECTION',
      tagline: '♥ Timeless Elegance ♥',
      img: colPearlWebp,
      tab: 'necklaces'
    },
    {
      id: 'spotlight-4',
      title: 'STONE COLLECTION',
      tagline: '♥ Add Some Shine ♥',
      img: colStoneWebp,
      tab: 'bracelets'
    }
  ],
  banner: {
    title: 'MANISH & CO - Diwali Festive Season - Flat 15% Off On All Products',
    img: diwaliFestiveManishAndCoWebp,
    tab: 'Collections',
    hidden: false
  }
};

const STORAGE_KEY = 'manish_silver_story_data';
const FIRESTORE_DOC_ID = 'silver_story_showcase';

export const silverStoryService = {
  getStoredStoryData() {
    const isAllCleared = StorageService.get('manish_silver_story_all_cleared', false);
    if (isAllCleared) {
      return {
        sectionTitle: 'Silver For Every Story',
        cards: [],
        banner: { hidden: true, deleted: true }
      };
    }

    let cached = StorageService.get(STORAGE_KEY, null);

    if (cached && typeof cached === 'object') {
      const deletedCardIds = StorageService.get('manish_silver_story_deleted_card_ids', []);
      const cards = Array.isArray(cached.cards)
        ? cached.cards
          .filter(c => c && !deletedCardIds.includes(c.id))
          .map((c, i) => ({
            ...c,
            img: c.img || getStoryCardFallbackImage(c, i)
          }))
        : [];

      return {
        sectionTitle: cached.sectionTitle || 'Silver For Every Story',
        cards,
        banner: cached.banner || DEFAULT_SILVER_STORY_DATA.banner
      };
    }

    const isInit = StorageService.get('manish_silver_story_initialized', false);
    if (!isInit) {
      StorageService.set(STORAGE_KEY, DEFAULT_SILVER_STORY_DATA);
      StorageService.set('manish_silver_story_initialized', true);
      return DEFAULT_SILVER_STORY_DATA;
    }

    return {
      sectionTitle: 'Silver For Every Story',
      cards: [],
      banner: { hidden: true, deleted: true }
    };
  },

  async fetchRemoteStoryData() {
    try {
      const config = await storeSyncService.pullLatestConfig();
      if (config?.silverStory && typeof config.silverStory === 'object') {
        return this.getStoredStoryData();
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
          const isAllCleared = StorageService.get('manish_silver_story_all_cleared', false);
          if (!isAllCleared && Array.isArray(remote.cards)) {
            StorageService.set(STORAGE_KEY, remote);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('manish_silver_story_updated', { detail: remote }));
            }
            return this.getStoredStoryData();
          }
        }
      }
    } catch (e) {
      // Offline fallback
    }
    return this.getStoredStoryData();
  },

  async saveStoryData(data) {
    const safeCards = Array.isArray(data.cards) ? data.cards : [];
    const isAllCleared = safeCards.length === 0 && (!data.banner || data.banner.hidden || data.banner.deleted);
    StorageService.set('manish_silver_story_all_cleared', isAllCleared);

    const payload = {
      sectionTitle: data.sectionTitle || 'Silver For Every Story',
      cards: safeCards,
      banner: data.banner || { hidden: false },
      lastUpdated: new Date().toISOString()
    };

    // 1. Instant Local Storage
    StorageService.set(STORAGE_KEY, payload);

    // 2. Pulse for cross-tab and cross-window sync
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('manish_sync_pulse', `silver_story_${Date.now()}`);
      } catch (_e) { /* noop */ }

      // 3. Dispatch in current window
      window.dispatchEvent(new CustomEvent('manish_silver_story_updated', { detail: payload }));

      // 4. Broadcast across tabs
      if ('BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('manish_store_sync');
          bc.postMessage({ type: 'silver_story', data: payload, timestamp: Date.now() });
          bc.close();
        } catch { /* noop */ }
      }
    }

    // 5. Shared Cloud Persistence via storeSyncService
    storeSyncService.publishSection('silverStory', payload).catch(err => {
      console.warn('storeSyncService silverStory publish error:', err);
    });

    // 6. Firestore sync attempt (graceful fallback)
    if (db) {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, FIRESTORE_DOC_ID);
        setDoc(docRef, payload, { merge: true }).catch(() => { });
      } catch (e) {
        // Fallback
      }
    }

    return payload;
  },

  async deleteCard(cardId) {
    const current = this.getStoredStoryData();
    const updatedCards = current.cards.filter(c => c.id !== cardId);

    const deletedCardIds = StorageService.get('manish_silver_story_deleted_card_ids', []);
    if (!deletedCardIds.includes(cardId)) {
      deletedCardIds.push(cardId);
      StorageService.set('manish_silver_story_deleted_card_ids', deletedCardIds);
    }

    return this.saveStoryData({
      ...current,
      cards: updatedCards
    });
  }
};
