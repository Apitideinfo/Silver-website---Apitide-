import { StorageService } from './StorageService';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/constants';
import { storeSyncService } from './storeSyncService';
import { getCategoryFallbackImage } from '../utils/categoryAssets';

// Assets for defaults
import herRings from '../assets/editorial/her_rings.jpg';
import herBracelets from '../assets/editorial/her_bracelets.jpg';
import herAnklets from '../assets/editorial/her_anklets.jpg';
import himRings from '../assets/editorial/him_rings.jpg';
import himChains from '../assets/editorial/him_chains.jpg';
import himBracelets from '../assets/editorial/him_bracelets.jpg';
import kidsBracelets from '../assets/editorial/kids_bracelets.jpg';
import kidsChains from '../assets/editorial/kids_chains.jpg';
import kidsKadas from '../assets/editorial/kids_kadas.jpg';
import kidsJewelleryImg from '../assets/kids_jewellery.png';
import giftsCoins from '../assets/editorial/gifts_coins.jpg';
import giftsKeepsakes from '../assets/editorial/gifts_keepsakes.jpg';
import kadaImg from '../assets/clean_categories/kada.png';
import payalImg from '../assets/clean_categories/payal.png';
import earringsImg from '../assets/clean_categories/earrings.png';
import necklacesImg from '../assets/necklaces.png';
import pendantsImg from '../assets/pendants.png';
import silverChainImg from '../assets/clean_categories/silver_chain.png';
import mensJewelleryImg from '../assets/mens_jewellery.png';
import solitairesImg from '../assets/solitaries.png';
import diamondBracelet from '../assets/diamond_bracelet.png';
import colToeRingPng from '../assets/col_toe_ring.png';

export const DEFAULT_SHOWCASE_SECTIONS = {
  'for-her': {
    id: 'for-her',
    number: '01 / FOR HER',
    title: "Women's Jewellery",
    subtitle: 'Elegant 925 sterling silver pieces for everyday beauty and royal moments.',
    defaultGender: 'women',
    categories: [
      { id: 'her-anklets', label: 'Anklets', img: herAnklets, tab: 'payal' },
      { id: 'her-rings', label: 'Rings', img: herRings, tab: 'rings' },
      { id: 'her-earrings', label: 'Ear rings', img: earringsImg, tab: 'earrings' },
      { id: 'her-toerings', label: 'Toe Rings', img: colToeRingPng || payalImg, tab: 'payal' },
      { id: 'her-chains', label: 'Chains', img: silverChainImg, tab: 'necklaces' },
      { id: 'her-necklaces', label: 'Necklaces', img: necklacesImg, tab: 'necklaces' },
      { id: 'her-pendants', label: 'Pendants', img: pendantsImg, tab: 'pendant' },
      { id: 'her-bracelets', label: 'Bracelets', img: herBracelets, tab: 'bracelets' },
      { id: 'her-other', label: 'Other', img: diamondBracelet, tab: 'Collections' },
    ]
  },
  'for-him': {
    id: 'for-him',
    number: '02 / FOR HIM',
    title: "Men's Jewellery",
    subtitle: 'Bold 925 sterling silver designs crafted for confidence and royal presence.',
    defaultGender: 'men',
    categories: [
      { id: 'him-kada', label: 'Kada', img: kadaImg, tab: 'bangles' },
      { id: 'him-rings', label: 'Rings', img: himRings, tab: 'rings' },
      { id: 'him-chains', label: 'Chains', img: himChains, tab: 'necklaces' },
      { id: 'him-bracelets', label: 'Bracelets', img: himBracelets, tab: 'bracelets' },
      { id: 'him-pendants', label: 'Pendants', img: solitairesImg, tab: 'pendant' },
      { id: 'him-other', label: 'Other', img: mensJewelleryImg, tab: 'Collections' },
    ]
  },
  'for-kids': {
    id: 'for-kids',
    number: '03 / SPECIAL EDITIONS & CELEBRATIONS',
    title: "Kid's Jewellery",
    subtitle: 'Pure, skin-friendly 925 silver keepsakes handcrafted for your little precious ones.',
    defaultGender: 'kids',
    categories: [
      { id: 'kids-bornbaby', label: 'Bornbaby Kit', img: kidsJewelleryImg, tab: 'Collections' },
      { id: 'kids-chains', label: 'Chains', img: kidsChains, tab: 'necklaces' },
      { id: 'kids-pendants', label: 'Pendants', img: pendantsImg, tab: 'pendant' },
      { id: 'kids-bracelets', label: 'Bracelets & Berwa', img: kidsBracelets, tab: 'bracelets' },
      { id: 'kids-other', label: 'Other', img: kidsKadas, tab: 'Collections' },
    ]
  },
  'couples-section': {
    id: 'couples-section',
    number: '03 / SPECIAL EDITIONS & CELEBRATIONS',
    title: "Couple's Collection",
    subtitle: 'Matching sterling silver designs crafted to celebrate sacred bonds.',
    defaultGender: null,
    categories: [
      { id: 'couple-rings', label: 'Couple Rings', img: herRings, tab: 'rings' },
      { id: 'couple-chains', label: 'Couple Chains', img: himChains, tab: 'necklaces' },
      { id: 'couple-bracelets', label: 'Couple Bracelets', img: herBracelets, tab: 'bracelets' },
      { id: 'couple-sets', label: 'Secret Sets', img: giftsKeepsakes, tab: 'Collections' },
      { id: 'couple-others', label: 'Others', img: solitairesImg, tab: 'Collections' },
    ]
  },
  'gifts-collection': {
    id: 'gifts-collection',
    number: '03 / SPECIAL EDITIONS & CELEBRATIONS',
    title: "Gift's Collection",
    subtitle: 'Thoughtful 925 silver gift sets, bespoke pieces, and memorable keepsakes.',
    defaultGender: null,
    categories: [
      { id: 'gift-bornbaby', label: 'Born Baby Kit', img: kidsJewelleryImg, tab: 'Collections' },
      { id: 'gift-couples', label: 'Couples things', img: giftsCoins, tab: 'Collections' },
      { id: 'gift-fav', label: 'Add Your Fav.', img: giftsKeepsakes, tab: 'Collections' },
    ]
  }
};

const STORAGE_KEY = 'manish_curated_showcase_data';
const FIRESTORE_DOC_ID = 'curated_showcases';

export const showcaseSectionsService = {
  getStoredShowcaseData() {
    let cached = StorageService.get(STORAGE_KEY, null);

    if (cached && typeof cached === 'object' && Object.keys(cached).length > 0) {
      // Return merged with defaults to preserve headings if missing
      const result = {};
      Object.keys(DEFAULT_SHOWCASE_SECTIONS).forEach(secKey => {
        const defSec = DEFAULT_SHOWCASE_SECTIONS[secKey];
        const cachedSec = cached[secKey];
        if (cachedSec && Array.isArray(cachedSec.categories)) {
          result[secKey] = {
            ...defSec,
            ...cachedSec,
            // Ensure headings are preserved
            number: defSec.number,
            title: cachedSec.title || defSec.title,
            subtitle: cachedSec.subtitle || defSec.subtitle,
            categories: cachedSec.categories.map(c => ({
              ...c,
              img: c.img || getCategoryFallbackImage(c.label || c.name || c.id)
            }))
          };
        } else {
          result[secKey] = defSec;
        }
      });
      return result;
    }

    return DEFAULT_SHOWCASE_SECTIONS;
  },

  async fetchRemoteShowcaseData() {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.ADMIN_SETTINGS, FIRESTORE_DOC_ID);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const remoteData = snap.data();
        if (remoteData && typeof remoteData === 'object' && remoteData.sections) {
          StorageService.set(STORAGE_KEY, remoteData.sections);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('manish_curated_showcase_updated'));
          }
          return remoteData.sections;
        }
      }
    } catch (err) {
      console.warn('Could not fetch remote curated showcase data from Firestore:', err);
    }
    return this.getStoredShowcaseData();
  },

  async saveShowcaseData(sections) {
    try {
      StorageService.set(STORAGE_KEY, sections);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('manish_curated_showcase_updated'));
      }

      // 1. Sync via storeSyncService for immediate cross-device broadcast
      await storeSyncService.publishSection('curated_showcases', sections);

      // 2. Persist to Firestore
      try {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.ADMIN_SETTINGS, FIRESTORE_DOC_ID);
        await setDoc(docRef, {
          sections,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (fbErr) {
        console.warn('Firestore curated showcase save fallback:', fbErr);
      }

      return { success: true };
    } catch (err) {
      console.error('Failed to save curated showcase data:', err);
      return { success: false, error: err.message };
    }
  },

  async updateItem(sectionId, itemIdx, updatedItem) {
    const current = this.getStoredShowcaseData();
    if (!current[sectionId]) return { success: false, error: 'Section not found' };

    const cats = [...(current[sectionId].categories || [])];
    if (itemIdx >= 0 && itemIdx < cats.length) {
      cats[itemIdx] = { ...cats[itemIdx], ...updatedItem };
      current[sectionId].categories = cats;
      return this.saveShowcaseData(current);
    }
    return { success: false, error: 'Item index invalid' };
  },

  async addItem(sectionId, newItem) {
    const current = this.getStoredShowcaseData();
    if (!current[sectionId]) return { success: false, error: 'Section not found' };

    const cats = [...(current[sectionId].categories || [])];
    const generatedId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    cats.push({
      id: newItem.id || generatedId,
      label: newItem.label || 'New Item',
      img: newItem.img || getCategoryFallbackImage(newItem.label),
      tab: newItem.tab || 'Collections'
    });
    current[sectionId].categories = cats;
    return this.saveShowcaseData(current);
  },

  async deleteItem(sectionId, itemIdx) {
    const current = this.getStoredShowcaseData();
    if (!current[sectionId]) return { success: false, error: 'Section not found' };

    const cats = [...(current[sectionId].categories || [])];
    if (itemIdx >= 0 && itemIdx < cats.length) {
      cats.splice(itemIdx, 1);
      current[sectionId].categories = cats;
      return this.saveShowcaseData(current);
    }
    return { success: false, error: 'Item index invalid' };
  }
};
