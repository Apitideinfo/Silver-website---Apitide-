import { 
  db, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from '../firebase/firestore';
import { FIRESTORE_COLLECTIONS, INITIAL_CATEGORIES } from '../config/constants';
import { StorageService } from '../services/StorageService';

const PRODUCTS_COLLECTION = FIRESTORE_COLLECTIONS.PRODUCTS;
const CATEGORIES_COLLECTION = FIRESTORE_COLLECTIONS.CATEGORIES;

const LOCAL_STORAGE_KEYS = {
  CATEGORIES: 'manish_categories_store',
  PRODUCTS: 'manish_products_store'
};

// Safe timeout wrapper so Firestore network stalls never freeze the admin UI
const withTimeout = (promise, ms = 3500) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore request timed out; saved locally')), ms))
  ]);
};

// Cross-tab broadcast channel for instant multi-tab sync without page refresh
const syncChannel = (typeof window !== 'undefined' && 'BroadcastChannel' in window)
  ? new BroadcastChannel('manish_store_sync')
  : null;

// Broadcast local catalogue changes across tabs/windows/components
const broadcastCatalogChange = (type) => {
  if (typeof window !== 'undefined') {
    // 1. Same-window custom event
    window.dispatchEvent(new CustomEvent('manish_catalog_updated', { detail: { type } }));

    // 2. Cross-tab BroadcastChannel
    try {
      if (syncChannel) {
        syncChannel.postMessage({ type, timestamp: Date.now() });
      }
    } catch (e) {
      console.warn("BroadcastChannel error:", e);
    }

    // 3. StorageEvent trigger for all other tabs & windows
    try {
      localStorage.setItem('manish_sync_pulse', `${type}_${Date.now()}`);
    } catch (e) {}
  }
};


export const productsApi = {
  // ─── CATEGORIES CRUD ──────────────────────────────────────────

  // Read: Fetch all categories
  async fetchAllCategories() {
    try {
      const querySnapshot = await withTimeout(getDocs(collection(db, CATEGORIES_COLLECTION)), 2500);
      if (!querySnapshot.empty) {
        const remote = querySnapshot.docs.map(d => ({ id: d.id, docId: d.id, ...d.data() }));
        StorageService.set(LOCAL_STORAGE_KEYS.CATEGORIES, remote);
        return remote;
      }
    } catch (e) {
      console.warn("Using local categories cache:", e.message);
    }
    const cached = StorageService.get(LOCAL_STORAGE_KEYS.CATEGORIES, []);
    if (!cached || cached.length === 0) {
      StorageService.set(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    return cached;
  },

  // Read: Realtime subscription
  subscribeToCategories(onUpdate, onError) {
    // 1. Immediately emit local cache or initial baseline
    let local = StorageService.get(LOCAL_STORAGE_KEYS.CATEGORIES, []);
    if (!local || local.length === 0) {
      local = INITIAL_CATEGORIES;
      StorageService.set(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    }
    onUpdate(local);

    // Cross-tab & local update handler
    let lastJson = JSON.stringify(local);
    const handleSync = () => {
      const updated = StorageService.get(LOCAL_STORAGE_KEYS.CATEGORIES, local);
      const str = JSON.stringify(updated);
      if (str !== lastJson) {
        lastJson = str;
        onUpdate(updated);
      }
    };

    let intervalId = null;
    let channelHandler = null;
    let storageHandler = null;
    let focusHandler = null;

    if (typeof window !== 'undefined') {
      window.addEventListener('manish_catalog_updated', handleSync);
      
      // Native storage event across other tabs
      storageHandler = (e) => {
        if (!e.key || e.key === LOCAL_STORAGE_KEYS.CATEGORIES || e.key === 'manish_sync_pulse') {
          handleSync();
        }
      };
      window.addEventListener('storage', storageHandler);

      // BroadcastChannel across tabs
      if (syncChannel) {
        channelHandler = (msg) => {
          if (msg?.data?.type === 'categories' || msg?.data?.type === 'all') {
            handleSync();
          }
        };
        syncChannel.addEventListener('message', channelHandler);
      }

      // Tab focus / visibility
      focusHandler = () => handleSync();
      window.addEventListener('focus', focusHandler);
      document.addEventListener('visibilitychange', focusHandler);

      // 2.5s lightweight heartbeat check
      intervalId = setInterval(handleSync, 2500);
    }

    // 2. Connect Firestore realtime listener
    let unsubscribeFirestore = () => {};
    try {
      const q = collection(db, CATEGORIES_COLLECTION);
      unsubscribeFirestore = onSnapshot(
        q, 
        (snapshot) => {
          if (snapshot && !snapshot.empty) {
            const categories = snapshot.docs.map(d => ({ id: d.id, docId: d.id, ...d.data() }));
            StorageService.set(LOCAL_STORAGE_KEYS.CATEGORIES, categories);
            onUpdate(categories);
          }
        }, 
        (err) => {
          console.warn("Categories realtime subscription notice (operating offline-resilient):", err?.message);
          const safeData = StorageService.get(LOCAL_STORAGE_KEYS.CATEGORIES, local);
          onUpdate(safeData);
        }
      );
    } catch (err) {
      console.warn("Firestore listener init warning:", err);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('manish_catalog_updated', handleSync);
        if (storageHandler) window.removeEventListener('storage', storageHandler);
        if (focusHandler) {
          window.removeEventListener('focus', focusHandler);
          document.removeEventListener('visibilitychange', focusHandler);
        }
        if (intervalId) clearInterval(intervalId);
      }
      if (syncChannel && channelHandler) {
        syncChannel.removeEventListener('message', channelHandler);
      }
      if (typeof unsubscribeFirestore === 'function') {
        unsubscribeFirestore();
      }
    };
  },

  // Create: Add category
  async addCategory(categoryData) {
    const rawId = (categoryData.id || categoryData.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const catId = (rawId || `cat-${Date.now()}`).trim();
    const payload = {
      ...categoryData,
      id: catId,
      docId: catId,
      createdDate: categoryData.createdDate || new Date().toISOString()
    };

    // 1. Instant Optimistic Local Save
    const existing = StorageService.get(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const filtered = existing.filter(c => c.id !== catId && c.docId !== catId);
    const updated = [payload, ...filtered];
    StorageService.set(LOCAL_STORAGE_KEYS.CATEGORIES, updated);
    broadcastCatalogChange('categories');

    // 2. Background Firestore write (non-blocking)
    (async () => {
      try {
        const docRef = doc(db, CATEGORIES_COLLECTION, catId);
        await withTimeout(setDoc(docRef, payload, { merge: true }), 2000);
      } catch (err) {
        console.warn("Background Firestore sync skipped/offline; category safely stored:", err.message);
      }
    })();

    return payload;
  },

  // Create alias
  async createCategory(categoryData) {
    return this.addCategory(categoryData);
  },

  // Update: Edit category
  async updateCategory(categoryId, categoryData) {
    const id = String(categoryId).trim().toLowerCase();
    const payload = {
      ...categoryData,
      id,
      docId: id,
      lastUpdated: new Date().toISOString()
    };

    // 1. Instant Optimistic Local Update
    const existing = StorageService.get(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const updated = existing.map(c => (c.id === id || c.docId === id) ? { ...c, ...payload } : c);
    StorageService.set(LOCAL_STORAGE_KEYS.CATEGORIES, updated);
    broadcastCatalogChange('categories');

    // 2. Background Firestore sync (non-blocking)
    (async () => {
      try {
        const docRef = doc(db, CATEGORIES_COLLECTION, id);
        await withTimeout(setDoc(docRef, payload, { merge: true }), 2000);
      } catch (err) {
        console.warn("Background Firestore update skipped/offline; stored locally:", err.message);
      }
    })();

    return payload;
  },

  // Delete: Remove category
  async deleteCategory(categoryId) {
    const id = String(categoryId).trim().toLowerCase();

    // 1. Instant Optimistic Local Delete
    const existing = StorageService.get(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const updated = existing.filter(c => c.id !== id && c.docId !== id);
    StorageService.set(LOCAL_STORAGE_KEYS.CATEGORIES, updated);
    broadcastCatalogChange('categories');

    // 2. Background Firestore sync (non-blocking)
    (async () => {
      try {
        const docRef = doc(db, CATEGORIES_COLLECTION, id);
        await withTimeout(deleteDoc(docRef), 2000);
      } catch (err) {
        console.warn("Background Firestore delete skipped/offline; removed locally:", err.message);
      }
    })();

    return id;
  },

  // ─── PRODUCTS CRUD ────────────────────────────────────────────

  // Read: Fetch all products
  async fetchAllProducts() {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdDate', 'desc'));
      const querySnapshot = await withTimeout(getDocs(q), 3000);
      const remote = querySnapshot.docs.map(d => ({ id: d.id, docId: d.id, ...d.data() }));
      StorageService.set(LOCAL_STORAGE_KEYS.PRODUCTS, remote);
      return remote;
    } catch (e) {
      console.warn("Using local products cache:", e.message);
      return StorageService.get(LOCAL_STORAGE_KEYS.PRODUCTS, []);
    }
  },

  // Read: Realtime subscription
  subscribeToProducts(onUpdate, onError) {
    // 1. Immediately emit local cache so UI is instantaneous and never stuck
    const local = StorageService.get(LOCAL_STORAGE_KEYS.PRODUCTS, []);
    onUpdate(local);

    let lastJson = JSON.stringify(local);
    const handleSync = () => {
      const updated = StorageService.get(LOCAL_STORAGE_KEYS.PRODUCTS, []);
      const str = JSON.stringify(updated);
      if (str !== lastJson) {
        lastJson = str;
        onUpdate(updated);
      }
    };

    let intervalId = null;
    let channelHandler = null;
    let storageHandler = null;
    let focusHandler = null;

    if (typeof window !== 'undefined') {
      window.addEventListener('manish_catalog_updated', handleSync);

      storageHandler = (e) => {
        if (!e.key || e.key === LOCAL_STORAGE_KEYS.PRODUCTS || e.key === 'manish_sync_pulse') {
          handleSync();
        }
      };
      window.addEventListener('storage', storageHandler);

      if (syncChannel) {
        channelHandler = (msg) => {
          if (msg?.data?.type === 'products' || msg?.data?.type === 'all') {
            handleSync();
          }
        };
        syncChannel.addEventListener('message', channelHandler);
      }

      focusHandler = () => handleSync();
      window.addEventListener('focus', focusHandler);
      document.addEventListener('visibilitychange', focusHandler);

      intervalId = setInterval(handleSync, 2500);
    }

    // 2. Connect Firestore realtime listener
    let unsubscribeFirestore = () => {};
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdDate', 'desc'));
      unsubscribeFirestore = onSnapshot(
        q, 
        (snapshot) => {
          if (!snapshot.empty) {
            const products = snapshot.docs.map(d => ({ id: d.id, docId: d.id, ...d.data() }));
            StorageService.set(LOCAL_STORAGE_KEYS.PRODUCTS, products);
            onUpdate(products);
          }
        }, 
        (err) => {
          console.warn("Products realtime subscription warning (operating offline-resilient):", err?.message);
          onError?.(err);
        }
      );
    } catch (err) {
      console.warn("Firestore products listener init warning:", err);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('manish_catalog_updated', handleSync);
        if (storageHandler) window.removeEventListener('storage', storageHandler);
        if (focusHandler) {
          window.removeEventListener('focus', focusHandler);
          document.removeEventListener('visibilitychange', focusHandler);
        }
        if (intervalId) clearInterval(intervalId);
      }
      if (syncChannel && channelHandler) {
        syncChannel.removeEventListener('message', channelHandler);
      }
      if (typeof unsubscribeFirestore === 'function') {
        unsubscribeFirestore();
      }
    };
  },

  // Create: Add product
  async addProduct(productData) {
    const prodId = (productData.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
    const payload = {
      ...productData,
      id: prodId,
      docId: prodId,
      createdDate: productData.createdDate || new Date().toISOString()
    };

    // 1. Instant Optimistic Local Save
    const existing = StorageService.get(LOCAL_STORAGE_KEYS.PRODUCTS, []);
    const updated = [payload, ...existing.filter(p => p.id !== prodId)];
    StorageService.set(LOCAL_STORAGE_KEYS.PRODUCTS, updated);
    broadcastCatalogChange('products');

    // 2. Background Firestore Sync (non-blocking)
    (async () => {
      try {
        const docRef = doc(db, PRODUCTS_COLLECTION, prodId);
        await withTimeout(setDoc(docRef, payload, { merge: true }), 2500);
      } catch (err) {
        console.warn("Firestore product add background sync notice:", err.message);
      }
    })();

    return payload;
  },

  // Update: Edit product
  async updateProduct(productId, productData) {
    const id = String(productId);
    const payload = {
      ...productData,
      id,
      docId: id,
      lastUpdated: new Date().toISOString()
    };

    // 1. Instant Optimistic Local Update
    const existing = StorageService.get(LOCAL_STORAGE_KEYS.PRODUCTS, []);
    const updated = existing.map(p => (p.id === id || p.docId === id) ? { ...p, ...payload } : p);
    StorageService.set(LOCAL_STORAGE_KEYS.PRODUCTS, updated);
    broadcastCatalogChange('products');

    // 2. Background Firestore Sync (non-blocking)
    (async () => {
      try {
        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        await withTimeout(setDoc(docRef, payload, { merge: true }), 2500);
      } catch (err) {
        console.warn("Firestore product update background sync notice:", err.message);
      }
    })();

    return payload;
  },

  // Delete: Remove product
  async deleteProduct(productId) {
    const id = String(productId);

    // 1. Instant Optimistic Local Delete
    const existing = StorageService.get(LOCAL_STORAGE_KEYS.PRODUCTS, []);
    const updated = existing.filter(p => p.id !== id && p.docId !== id);
    StorageService.set(LOCAL_STORAGE_KEYS.PRODUCTS, updated);
    broadcastCatalogChange('products');

    // 2. Background Firestore Sync (non-blocking)
    (async () => {
      try {
        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        await withTimeout(deleteDoc(docRef), 2500);
      } catch (err) {
        console.warn("Firestore product delete background sync notice:", err.message);
      }
    })();

    return id;
  }
};

