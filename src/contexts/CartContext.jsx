import React, { createContext, useState, useEffect } from 'react';
import { CartService } from '../services/CartService';
import { StorageService } from '../services/StorageService';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    return StorageService.get('hrj_cart', []);
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    StorageService.set('hrj_cart', cartItems);
  }, [cartItems]);

  const handleAddToCart = (item) => {
    setCartItems((prev) => CartService.addItem(prev, item));
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    setCartItems((prev) => CartService.updateQuantity(prev, itemId, quantity));
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems((prev) => CartService.removeItem(prev, itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = CartService.calculateTotal(cartItems);
  const cartItemCount = CartService.getItemCount(cartItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartOpen,
        setCartOpen,
        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveFromCart,
        clearCart,
        cartTotal,
        cartItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
