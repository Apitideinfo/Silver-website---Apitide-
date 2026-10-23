import { safeParseFloat } from '../utils/pricing';

export const CartService = {
  // Add item to cart or increment quantity
  addItem(cartItems, newItem) {
    const existingIndex = cartItems.findIndex(
      (item) => item.id === newItem.id && item.carat === newItem.carat && item.weight === newItem.weight
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + (newItem.quantity || 1)
      };
      return updated;
    }

    return [...cartItems, { ...newItem, quantity: newItem.quantity || 1 }];
  },

  // Update item quantity
  updateQuantity(cartItems, itemId, quantity) {
    if (quantity <= 0) {
      return cartItems.filter((item) => item.id !== itemId);
    }
    return cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
  },

  // Remove item from cart
  removeItem(cartItems, itemId) {
    return cartItems.filter((item) => item.id !== itemId);
  },

  // Get total cart price
  calculateTotal(cartItems) {
    return cartItems.reduce(
      (sum, item) => sum + safeParseFloat(item.price) * safeParseFloat(item.quantity || 1),
      0
    );
  },

  // Get total cart item count
  getItemCount(cartItems) {
    return cartItems.reduce((count, item) => count + safeParseFloat(item.quantity), 0);
  }
};
