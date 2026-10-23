import React, { createContext, useState, useEffect } from 'react';
import { productsApi } from '../api/products.api';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    // Safety guard: ensure loading never gets stuck
    const safetyTimer = setTimeout(() => {
      setLoading(false);
      setCategoriesLoaded(true);
    }, 600);
    const unsubscribeProducts = productsApi.subscribeToProducts(
      (data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      },
      (err) => {
        console.warn("Products sync warning:", err);
        setProducts([]);
        setLoading(false);
      }
    );

    // Live listener for isolated categories collection — purely dynamic from database
    const unsubscribeCategories = productsApi.subscribeToCategories(
      (data) => {
        setCategories(Array.isArray(data) ? data : []);
        setCategoriesLoaded(true);
      },
      (err) => {
        console.warn("Categories subscription error:", err);
        setCategories([]);
        setCategoriesLoaded(true);
      }
    );

    return () => {
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
