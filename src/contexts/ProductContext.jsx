import React, { createContext, useState, useEffect } from 'react';
import { productsApi } from '../api/products.api';
import { StorageService } from '../services/StorageService';
import { INITIAL_CATEGORIES } from '../config/constants';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    return StorageService.get('manish_products_store', []);
  });
  const [categories, setCategories] = useState(() => {
    const CURRENT_CATALOG_VERSION = 'v2026_11_14_v3';
    const storedVersion = StorageService.get('manish_catalog_version', null);
    let cached = StorageService.get('manish_categories_store', null);
    
    // Auto-migrate legacy cached categories on client devices (e.g. mobile phones with old Bangles/Nath list)
    const hasLegacy = Array.isArray(cached) && cached.some(c => 
      c.id === 'bangles' || c.id === 'nath-nose-pin' || c.name === 'Bangles' || c.id === 'jhumka'
    );
    if (hasLegacy || !Array.isArray(cached) || cached.length === 0) {
      cached = INITIAL_CATEGORIES;
      StorageService.set('manish_categories_store', INITIAL_CATEGORIES);
      StorageService.set('manish_categories_initialized', true);
      StorageService.set('manish_catalog_version', CURRENT_CATALOG_VERSION);
    }
    return cached;
  });
  const [loading, setLoading] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(true);

  useEffect(() => {
    // 1. Channel & Cross-tab synchronization
    const syncChannel = (typeof window !== 'undefined' && 'BroadcastChannel' in window)
      ? new BroadcastChannel('manish_store_sync')
      : null;

    const handleCatalogUpdate = () => {
      const updatedCats = StorageService.get('manish_categories_store', null);
      if (Array.isArray(updatedCats)) {
        setCategories(updatedCats);
      }
      const updatedProds = StorageService.get('manish_products_store', null);
      if (Array.isArray(updatedProds)) {
        setProducts(updatedProds);
      }
    };

    let storageHandler = null;
    let channelHandler = null;
    let focusHandler = null;

    if (typeof window !== 'undefined') {
      window.addEventListener('manish_catalog_updated', handleCatalogUpdate);

      storageHandler = (e) => {
        if (!e.key || e.key === 'manish_categories_store' || e.key === 'manish_products_store' || e.key === 'manish_sync_pulse') {
          handleCatalogUpdate();
        }
      };
      window.addEventListener('storage', storageHandler);

      if (syncChannel) {
        channelHandler = () => handleCatalogUpdate();
        syncChannel.addEventListener('message', channelHandler);
      }

      focusHandler = () => handleCatalogUpdate();
      window.addEventListener('focus', focusHandler);
      document.addEventListener('visibilitychange', focusHandler);
    }

    // 2. Subscribe to products
    const unsubscribeProducts = productsApi.subscribeToProducts(
      (data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Products sync notice:", err);
        setLoading(false);
      }
    );

    // 3. Subscribe to categories
    const unsubscribeCategories = productsApi.subscribeToCategories(
      (data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
        setCategoriesLoaded(true);
      },
      (err) => {
        console.warn("Categories sync notice:", err);
        setCategoriesLoaded(true);
      }
    );

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('manish_catalog_updated', handleCatalogUpdate);
        if (storageHandler) window.removeEventListener('storage', storageHandler);
        if (focusHandler) {
          window.removeEventListener('focus', focusHandler);
          document.removeEventListener('visibilitychange', focusHandler);
        }
      }
      if (syncChannel && channelHandler) {
        syncChannel.removeEventListener('message', channelHandler);
      }
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, []);


  return (
    <ProductContext.Provider value={{ products, categories, loading, categoriesLoaded }}>
      {children}
    </ProductContext.Provider>
  );
}
