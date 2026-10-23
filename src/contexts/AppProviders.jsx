import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { ProductProvider } from './ProductContext';
import { RatesProvider } from './RatesContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { SavingsProvider } from './SavingsContext';

export default function AppProviders({ children }) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProductProvider>
            <RatesProvider>
              <CartProvider>
                <WishlistProvider>
                  <SavingsProvider>
                    {children}
                  </SavingsProvider>
                </WishlistProvider>
              </CartProvider>
            </RatesProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

