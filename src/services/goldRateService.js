/**
 * goldRateService.js — Firestore CRUD for Gold Rate Management
 * Collection: system_configs / Document: metal_rates
 */
import {
  db,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from '../firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/constants';
import { StorageService } from './StorageService';

const RATE_DOC_REF = () => doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, 'metal_rates');
const LOCAL_STORAGE_RATES_KEY = 'manish_metal_rates';

const syncChannel = (typeof window !== 'undefined' && 'BroadcastChannel' in window)
  ? new BroadcastChannel('manish_store_sync')
  : null;

const broadcastRatesChange = (payload) => {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('manish_rates_updated', { detail: payload }));
      if (syncChannel) syncChannel.postMessage({ type: 'rates', data: payload });
      localStorage.setItem('manish_rates_pulse', String(Date.now()));
    } catch (e) {
      console.warn("Rates broadcast warning:", e);
    }
  }
};

export const goldRateService = {
  /**
   * Fetch current rates (one-time read)
   */
  async getRates() {
    try {
      const snap = await getDoc(RATE_DOC_REF());
      if (snap.exists()) {
        const data = snap.data();
        StorageService.set(LOCAL_STORAGE_RATES_KEY, data);
        return data;
      }
    } catch (e) {
      console.warn("Fetching remote rates failed, using cache:", e.message);
    }
    return StorageService.get(LOCAL_STORAGE_RATES_KEY, getDefaultRates());
  },

  /**
   * Subscribe to live rate changes with instant local emit and real-time multi-tab sync
   */
  subscribeToRates(onUpdate, onError) {
    // 1. Immediately emit cached or default rates so UI is instantaneous
    const initial = StorageService.get(LOCAL_STORAGE_RATES_KEY, getDefaultRates());
    onUpdate(initial);

    let localHandler = null;
    let channelHandler = null;
    let storageHandler = null;

    if (typeof window !== 'undefined') {
      localHandler = (e) => {
        if (e?.detail) onUpdate(e.detail);
      };
      window.addEventListener('manish_rates_updated', localHandler);

      storageHandler = (e) => {
        if (e.key === LOCAL_STORAGE_RATES_KEY || e.key === 'manish_rates_pulse') {
          const updated = StorageService.get(LOCAL_STORAGE_RATES_KEY, initial);
          onUpdate(updated);
        }
      };
      window.addEventListener('storage', storageHandler);

      if (syncChannel) {
        channelHandler = (msg) => {
          if (msg?.data?.type === 'rates' && msg?.data?.data) {
            onUpdate(msg.data.data);
          }
        };
        syncChannel.addEventListener('message', channelHandler);
      }
    }

    // 2. Connect Firestore listener
    let unsubscribeFirestore = () => {};
    try {
      unsubscribeFirestore = onSnapshot(RATE_DOC_REF(), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          StorageService.set(LOCAL_STORAGE_RATES_KEY, data);
          onUpdate(data);
        }
      }, (err) => {
        console.warn("Rates firestore stream notice:", err.message);
        onError?.(err);
      });
    } catch (err) {
      console.warn("Firestore rate listener init error:", err);
    }

    return () => {
      if (typeof window !== 'undefined') {
        if (localHandler) window.removeEventListener('manish_rates_updated', localHandler);
        if (storageHandler) window.removeEventListener('storage', storageHandler);
      }
      if (syncChannel && channelHandler) {
        syncChannel.removeEventListener('message', channelHandler);
      }
      if (typeof unsubscribeFirestore === 'function') {
        unsubscribeFirestore();
      }
    };
  },

  /**
   * Save draft rates (does NOT mark as published)
   */
  async saveRates(ratesData, adminEmail = 'admin') {
    const payload = buildRatePayload(ratesData, adminEmail, false);
    StorageService.set(LOCAL_STORAGE_RATES_KEY, payload);
    broadcastRatesChange(payload);

    try {
      await setDoc(RATE_DOC_REF(), payload, { merge: true });
    } catch (e) {
      console.warn("Background Firestore rate save offline:", e.message);
    }
    return payload;
  },

  /**
   * Publish rates — marks publishedAt timestamp
   */
  async publishRates(ratesData, adminEmail = 'admin') {
    const now = new Date().toISOString();
    const payload = buildRatePayload(ratesData, adminEmail, true, now);
    StorageService.set(LOCAL_STORAGE_RATES_KEY, payload);
    broadcastRatesChange(payload);

    try {
      await setDoc(RATE_DOC_REF(), payload, { merge: true });
    } catch (e) {
      console.warn("Background Firestore rate publish offline:", e.message);
    }
    return payload;
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDefaultRates() {
  const defaultSilver = 92000;
  return {
    goldRate24k:  78500,
    goldRate22k:  71958,
    goldRate20k:  65417,
    goldRate18k:  58875,
    goldRate14k:  45788,
    goldRate9k:   29438,
    purityPercentages: {
      '24k': 100.00,
      '22k': 91.67,
      '20k': 83.33,
      '18k': 75.00,
      '14k': 58.33,
      '9k':  37.50,
      'silver925': 92.50,
      'silverNormal': 90.00,
    },
    silverRate:       defaultSilver,
    silverRate925:    Math.round(defaultSilver * 0.925),
    silverRateNormal: Math.round(defaultSilver * 0.90),
    platinumRate:     3500,
    lastUpdated:      new Date().toISOString(),
    publishedAt:      null,
    updatedBy:        'system',
    isPublished:      false,
  };
}

function buildRatePayload(ratesData, adminEmail, publish, publishedAt = null) {
  const now = new Date().toISOString();
  const rate24k = Number(ratesData.goldRate24k) || 78500;
  const p22 = Number(ratesData.purityPercentages?.['22k'] ?? ratesData.purityPercentages?.['22K'] ?? 91.67);
  const p20 = Number(ratesData.purityPercentages?.['20k'] ?? ratesData.purityPercentages?.['20K'] ?? 83.33);
  const p18 = Number(ratesData.purityPercentages?.['18k'] ?? ratesData.purityPercentages?.['18K'] ?? 75.00);
  const p14 = Number(ratesData.purityPercentages?.['14k'] ?? ratesData.purityPercentages?.['14K'] ?? 58.33);
  const p9  = Number(ratesData.purityPercentages?.['9k']  ?? ratesData.purityPercentages?.['9K']  ?? 37.50);
  const pSilver925 = Number(ratesData.purityPercentages?.['silver925'] ?? ratesData.purityPercentages?.['925'] ?? 92.50);
  const pSilverNormal = Number(ratesData.purityPercentages?.['silverNormal'] ?? ratesData.purityPercentages?.['normal'] ?? 90.00);
  const baseSilver = Number(ratesData.silverRate) || 92000;

  return {
    goldRate24k:  rate24k,
    goldRate22k:  Number(ratesData.goldRate22k) || Math.round(rate24k * (p22 / 100)),
    goldRate20k:  Number(ratesData.goldRate20k) || Math.round(rate24k * (p20 / 100)),
    goldRate18k:  Number(ratesData.goldRate18k) || Math.round(rate24k * (p18 / 100)),
    goldRate14k:  Number(ratesData.goldRate14k) || Math.round(rate24k * (p14 / 100)),
    goldRate9k:   Number(ratesData.goldRate9k)  || Math.round(rate24k * (p9 / 100)),
    purityPercentages: {
      '24k': 100.00,
      '22k': p22,
      '20k': p20,
      '18k': p18,
      '14k': p14,
      '9k':  p9,
      'silver925': pSilver925,
      'silverNormal': pSilverNormal,
    },
    silverRate:       baseSilver,
    silverRate925:    Number(ratesData.silverRate925)    || Math.round(baseSilver * (pSilver925 / 100)),
    silverRateNormal: Number(ratesData.silverRateNormal) || Math.round(baseSilver * (pSilverNormal / 100)),
    platinumRate:     Number(ratesData.platinumRate) || 3500,
    lastUpdated:      now,
    updatedBy:        adminEmail,
    isPublished:      publish,
    publishedAt:      publish ? (publishedAt || now) : (ratesData.publishedAt || null),
  };
}

