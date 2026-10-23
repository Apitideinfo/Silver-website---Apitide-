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
    const cached = StorageService.get('manish_categories_store', []);
    return (Array.isArray(cached) && cached.length > 0) ? cached : INITIAL_CATEGORIES;
  });
  const [loading, setLoading] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(true);

  useEffect(() => {
    // 1. Listen for catalog update events
    const handleCatalogUpdate = () => {
      const updatedCats = StorageService.get('manish_categories_store', []);
      if (Array.isArray(updatedCats) && updatedCats.length > 0) {
        setCategories(updatedCats);
      }
      const updatedProds = StorageService.get('manish_products_store', []);
      if (Array.isArray(updatedProds) && updatedProds.length > 0) {
        setProducts(updatedProds);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('manish_catalog_updated', handleCatalogUpdate);
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
        if (Array.isArray(data) && data.length > 0) {
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
