import React, { createContext, useState, useEffect } from 'react';
import { WishlistService } from '../services/WishlistService';
import { StorageService } from '../services/StorageService';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    return StorageService.get('hrj_wishlist', []);
  });
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => {
    StorageService.set('hrj_wishlist', wishlistItems);
  }, [wishlistItems]);

  const toggleWishlist = (item) => {
    setWishlistItems((prev) => WishlistService.toggleItem(prev, item));
  };

  const isWishlisted = (itemId) => {
    return WishlistService.isWishlisted(wishlistItems, itemId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistOpen,
        setWishlistOpen,
        toggleWishlist,
        isWishlisted
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
