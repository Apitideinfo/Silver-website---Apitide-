import React, { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export default function CartDrawer({ isOpen, onClose, navigateTo }) {
  const { 
    cartItems, 
    handleUpdateQuantity, 
    handleRemoveFromCart, 
    cartTotal,
    cartItemCount 
  } = useCart();

  // Prevent scroll on body when drawer is open
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
        <div className="h-1 bg-gradient-to-r from-[#6B4B2E] via-[#B09A82] to-[#6B4B2E] w-full"></div>

        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#E6DFD3] flex items-center justify-between bg-[#F8F5EC]">
          <div className="flex items-baseline space-x-2">
            <h2 className="serif-luxury text-lg font-bold text-[#0D2B4E] tracking-wide uppercase">Shopping Bag</h2>
            <span className="text-xs text-[#6B4B2E] font-semibold font-sans">({cartItemCount} item{cartItemCount !== 1 ? 's' : ''})</span>
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
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-14 h-14 rounded-full bg-[#0D2B4E]/10 flex items-center justify-center text-[#0D2B4E]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-sm font-medium text-gray-400 font-sans">Your Shopping Bag is empty</p>
              <button 
                onClick={() => { onClose(); navigateTo('collections'); }}
                className="px-6 py-2.5 bg-[#0D2B4E] hover:bg-[#091B2B] text-[#F8F5EC] text-xs font-bold rounded-lg tracking-widest uppercase cursor-pointer border border-[#B09A82]/30 shadow-sm transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 relative hover:shadow-xs transition-shadow">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
                    <img 
                      src={item.img || item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80'} 
                      alt="" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80';
                      }}
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5 text-left">
                    <h4 className="text-xs font-bold text-[#031838] line-clamp-2 pr-4">{item.name}</h4>
                    {item.carat && (
                      <p className="text-[10px] text-gray-400 font-medium">
                        {item.carat}
                      </p>
                    )}
                    {item.desc && item.desc.includes('Engraved:') && (
                      <p className="text-[10px] text-[#B8893C] font-semibold italic">
                        {item.desc}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity select */}
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer text-xs focus:outline-none bg-transparent border-none"
                        >
                          −
                        </button>
                        <span className="px-1.5 text-[11px] font-bold text-gray-800 font-sans">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer text-xs focus:outline-none bg-transparent border-none"
                        >
                          +
                        </button>
                      </div>

                      {/* Total item price */}
                      <span className="text-xs font-bold text-[#031838] font-sans">
                        ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Quick Remove Button */}
                  <button 
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="absolute top-2.5 right-2.5 text-gray-400 hover:text-[#c0392b] transition-colors focus:outline-none border-none bg-transparent cursor-pointer p-1"
                    title="Remove item"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="bg-[#F8F5EC] border-t border-[#E6DFD3] p-6 space-y-4">
            <div className="space-y-2.5 text-xs text-left">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal ({cartItemCount} item{cartItemCount !== 1 ? 's' : ''})</span>
                <span className="font-bold text-[#0D2B4E] font-sans">₹ {Math.round(cartTotal / 1.03).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>GST (3%)</span>
                <span className="font-bold text-[#0D2B4E] font-sans">₹ {Math.round(cartTotal - cartTotal / 1.03).toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-[#E6DFD3] pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-[#0D2B4E]">Total Payable</span>
                <span className="text-base font-black text-[#0D2B4E] font-sans">₹ {cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigateTo('checkout');
              }}
              className="w-full py-3.5 bg-[#0D2B4E] hover:bg-[#091B2B] text-[#F8F5EC] font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer border border-[#B09A82]/30"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
