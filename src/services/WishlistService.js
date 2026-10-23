export const WishlistService = {
  // Toggle wishlist state
  toggleItem(wishlistItems, item) {
    const isWishlisted = wishlistItems.some((w) => w.id === item.id);
    if (isWishlisted) {
      return wishlistItems.filter((w) => w.id !== item.id);
    }
    return [...wishlistItems, item];
  },

  // Check if item is in wishlist
  isWishlisted(wishlistItems, itemId) {
    return wishlistItems.some((w) => w.id === itemId);
  }
};
