import React, { useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useRates } from '../hooks/useRates';
import { calculateDynamicPrice, formatINR } from '../utils/pricing';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

export default function WishlistDrawer({ isOpen, onClose, navigateTo, navigateToPDP, triggerAudio }) {
  const { wishlistItems, toggleWishlist, setWishlistOpen } = useWishlist();
  const { handleAddToCart, setCartOpen } = useCart();
  const rates = useRates();

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMoveToBag = (item, e) => {
    e?.stopPropagation?.();
    triggerAudio?.('click');
    handleAddToCart(item);
    toggleWishlist(item);
    setWishlistOpen(false);
    setCartOpen(true);
  };

  const handleAddAllToBag = () => {
    triggerAudio?.('shimmer');
    wishlistItems.forEach(item => {
      handleAddToCart(item);
      toggleWishlist(item);
    });
    setWishlistOpen(false);
    setCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end font-sans">
      {/* Dark Blur Overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in" 
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white text-[#202329] shadow-2xl flex flex-col z-10 animate-slide-left select-none">
        {/* Subtle brown accent line on top */}
        <div className="h-1 bg-gradient-to-r from-[#6B4B2E] via-[#B09A82] to-[#6B4B2E] w-full" />

        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#E6DFD3] flex items-center justify-between bg-[#F8F5EC]">
          <div className="flex items-baseline space-x-2">
            <h2 className="serif-luxury text-lg font-bold text-[#0D2B4E] tracking-wide uppercase">Your Wishlist</h2>
            <span className="text-xs text-[#6B4B2E] font-semibold font-sans">
              ({wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''})
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#E6DFD3] hover:border-[#6B4B2E] flex items-center justify-center text-gray-500 hover:text-[#0D2B4E] transition-colors focus:outline-none cursor-pointer text-sm font-bold bg-white"
          >
            ✕
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-16 h-16 rounded-full bg-[#0D2B4E]/10 flex items-center justify-center text-[#6B4B2E]">
                <Heart className="w-8 h-8 fill-[#6B4B2E]/20" />
              </div>
              <div className="space-y-1">
                <h3 className="serif-luxury text-base font-bold text-[#0D2B4E]">Your Wishlist is Empty</h3>
                <p className="text-xs text-[#657989] font-sans max-w-xs">
                  Save your favorite handcrafted gold, diamond, and silver jewellery pieces to view them anytime.
                </p>
              </div>
              <button 
                onClick={() => { onClose(); navigateTo?.('collections'); }}
                className="px-6 py-2.5 bg-[#031838] hover:bg-[#0c2447] text-white text-xs font-bold rounded-lg tracking-widest uppercase cursor-pointer border-none shadow-sm transition-all"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {wishlistItems.map((item) => {
                const priceCalc = calculateDynamicPrice(item, rates);
                const displayPrice = item.price || priceCalc?.total || 0;

                return (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      onClose();
                      navigateToPDP?.(item);
                    }}
                    className="bg-white border border-gray-150 rounded-2xl p-3.5 flex gap-3.5 relative hover:shadow-md transition-all cursor-pointer group"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-[#FAF9F7] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100 p-1">
                      <img 
                        src={getOptimizedImageUrl(item.img || item.image, { width: 160 })} 
                        alt={item.name || item.title} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80';
                        }}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-[#031838] line-clamp-1 group-hover:text-[#B8893C] transition-colors">
                            {item.name || item.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerAudio?.('click');
                              toggleWishlist(item);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer bg-transparent border-none"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          {item.metal || 'Gold'} {item.carat || item.goldPurity || ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-bold text-[#B8893C] font-sans">
                          {formatINR(displayPrice)}
                        </span>
                        <button
                          onClick={(e) => handleMoveToBag(item, e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D2B4E] hover:bg-[#6B4B2E] text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-none shadow-xs"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {wishlistItems.length > 0 && (
          <div className="p-5 border-t border-[#E6DFD3] bg-[#F8F5EC] space-y-2.5">
            <button
              onClick={handleAddAllToBag}
              className="w-full py-3 bg-[#6B4B2E] hover:bg-[#855D3A] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-98 cursor-pointer border border-[#B09A82]/30 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag</span>
            </button>
            <button
              onClick={() => {
                onClose();
                navigateTo?.('collections');
              }}
              className="w-full py-2.5 bg-transparent hover:bg-white text-[#202329] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-solid border-[#E6DFD3]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
