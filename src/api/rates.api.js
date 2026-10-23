import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from '../firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/constants';

const RATE_DOC = () => doc(db, FIRESTORE_COLLECTIONS.SYSTEM_CONFIGS, 'metal_rates');

export const ratesApi = {
  // Get active rates document (one-time)
  async getRates() {
    const docRef = RATE_DOC();
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return getDefaults();
  },

  // Listen to live rates changes (realtime)
  subscribeToRates(onUpdate, onError) {
    const docRef = RATE_DOC();
    return onSnapshot(docRef, (docSnap) => {
      onUpdate(docSnap.exists() ? docSnap.data() : getDefaults());
    }, onError);
  },

  // Save rates (full payload including 22K, 18K, silver, platinum, metadata)
  async saveRates(ratesData) {
    const docRef = RATE_DOC();
    await setDoc(docRef, {
      ...ratesData,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    return ratesData;
  }
};

function getDefaults() {
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
    },
    silverRate:   92000,
    silverRate1kg: 92000,   // legacy compat alias
    platinumRate: 3500,
    lastUpdated:  new Date().toISOString(),
    publishedAt:  null,
    updatedBy:    'system',
    isPublished:  false,
  };
}
