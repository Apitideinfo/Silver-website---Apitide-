import { StorageService } from './StorageService';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/constants';

export const DEFAULT_PRICE_CATEGORIES = [
  { id: 'tier-199', title: 'Under ₹199', price: 199, color: 'pink', active: true },
  { id: 'tier-229', title: 'Under ₹229', price: 229, color: 'yellow', active: true },
  { id: 'tier-299', title: 'Under ₹299', price: 299, color: 'red', active: true },
  { id: 'tier-499', title: 'Under ₹499', price: 499, color: 'blue', active: true },
  { id: 'tier-799', title: 'Under ₹799', price: 799, color: 'green', active: true },
  { id: 'tier-999', title: 'Under ₹999', price: 999, color: 'purple', active: true },
];

export const COLOR_OPTIONS = [
  { 
    id: 'red', 
    name: 'Ruby Red', 
    gradient: 'from-[#E53E3E] via-[#C53030] to-[#9B2C2C]',
    shadow: 'shadow-[0_10px_28px_rgba(229,62,62,0.38)]',
    border: 'border-[#FEB2B2]/40',
    ring: 'ring-rose-400/40',
    dot: 'bg-red-500'
  },
  { 
    id: 'yellow', 
    name: 'Amber Gold', 
    gradient: 'from-[#F6AD55] via-[#D69E2E] to-[#B7791F]',
    shadow: 'shadow-[0_10px_28px_rgba(214,158,46,0.38)]',
    border: 'border-[#FEEBC8]/40',
    ring: 'ring-amber-400/40',
    dot: 'bg-amber-500'
  },
  { 
    id: 'blue', 
    name: 'Sapphire Blue', 
    gradient: 'from-[#3182CE] via-[#2B6CB0] to-[#1A365D]',
    shadow: 'shadow-[0_10px_28px_rgba(49,130,206,0.38)]',
    border: 'border-[#BEE3F8]/40',
    ring: 'ring-blue-400/40',
    dot: 'bg-blue-500'
  },
  { 
    id: 'pink', 
    name: 'Rose Pink', 
    gradient: 'from-[#ED64A6] via-[#D53F8C] to-[#97266D]',
    shadow: 'shadow-[0_10px_28px_rgba(237,100,166,0.38)]',
    border: 'border-[#FED7E2]/40',
    ring: 'ring-pink-400/40',
    dot: 'bg-pink-500'
  },
  { 
    id: 'green', 
    name: 'Emerald Green', 
    gradient: 'from-[#38A169] via-[#2F855A] to-[#1C4532]',
    shadow: 'shadow-[0_10px_28px_rgba(56,161,105,0.38)]',
    border: 'border-[#C6F6D5]/40',
    ring: 'ring-emerald-400/40',
    dot: 'bg-emerald-500'
  },
  { 
    id: 'purple', 
    name: 'Amethyst Purple', 
    gradient: 'from-[#805AD5] via-[#6B46C1] to-[#44337A]',
    shadow: 'shadow-[0_10px_28px_rgba(128,90,213,0.38)]',
    border: 'border-[#E9D8FD]/40',
    ring: 'ring-purple-400/40',
    dot: 'bg-purple-500'
  },
];

export const getColorStyles = (colorId) => {
  const found = COLOR_OPTIONS.find(c => c.id === colorId);
  return found || COLOR_OPTIONS[0];
};

export const priceCategoryService = {
  getStoredCategories() {
    const cached = StorageService.get('manish_price_categories', null);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
    return DEFAULT_PRICE_CATEGORIES;
  },

  async fetchRemoteCategories() {
    try {
      if (db) {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, 'price_categories');
        const snap = await getDoc(docRef);
        if (snap.exists() && Array.isArray(snap.data()?.tiers)) {
          const remote = snap.data().tiers;
          StorageService.set('manish_price_categories', remote);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('manish_price_categories_updated'));
          }
          return remote;
        }
      }
    } catch (e) {
      // fallback to cached
    }
    return this.getStoredCategories();
  },

  async saveCategories(tiers) {
    StorageService.set('manish_price_categories', tiers);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manish_price_categories_updated'));
    }

    try {
      if (db) {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, 'price_categories');
        await setDoc(docRef, { tiers, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (e) {
      console.warn('Could not save to firestore:', e);
    }
    return tiers;
  }
};
