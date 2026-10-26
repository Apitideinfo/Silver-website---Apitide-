import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';
import CustomerAccountModal from '../components/CustomerAccountModal';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

export default function MainLayout({
  children,
  currentPage,
  navigateTo,
  changeCategoryTab,
  soundEnabled,
  toggleSound,
  triggerAudio,
  setConsultationModal,
  setCoinPurityTab,
  setCoinWeightFilter,
  setMetalFilter,
  setMaxPriceFilter,
  navigateToPDP,
  genderFilter,
  setGenderFilter,
  searchQuery,
  setSearchQuery
}) {
  const { cartOpen, setCartOpen } = useCart();
  const { wishlistOpen, setWishlistOpen } = useWishlist();
  const [customerAccountOpen, setCustomerAccountOpen] = useState(false);
  const [customerAccountTab, setCustomerAccountTab] = useState('orders');

  useEffect(() => {
    // Check if ?track= is in URL on mount
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('track')) {
        setCustomerAccountTab('track');
        setCustomerAccountOpen(true);
      }
    } catch (e) {
      console.warn("URL search param error:", e);
    }

    // Listen for custom event 'hrj-open-account'
    const handleOpenAccount = (e) => {
      const tab = e?.detail?.tab || 'orders';
      setCustomerAccountTab(tab);
      setCustomerAccountOpen(true);
    };

    window.addEventListener('hrj-open-account', handleOpenAccount);
    return () => {
      window.removeEventListener('hrj-open-account', handleOpenAccount);
    };
  }, []);

  const openCustomerAccount = (tab = 'orders') => {
    setCustomerAccountTab(tab);
    setCustomerAccountOpen(true);
    triggerAudio?.('click');
  };

  return (
    <div className="font-sans min-h-screen relative overflow-x-clip bg-[#F8F5EC] text-[#202329] selection:bg-[#0D2B4E]/15 selection:text-[#0D2B4E]">
      {/* Navigation Header (Distraction-free checkout mode hides main header) */}
      {currentPage !== 'checkout' && (
        <Navbar
          currentPage={currentPage}
          navigateTo={navigateTo}
          changeCategoryTab={changeCategoryTab}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
          triggerAudio={triggerAudio}
          setConsultationModal={setConsultationModal}
          setCoinPurityTab={setCoinPurityTab}
          setCoinWeightFilter={setCoinWeightFilter}
          setMetalFilter={setMetalFilter}
          setMaxPriceFilter={setMaxPriceFilter}
          navigateToPDP={navigateToPDP}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openCustomerAccount={openCustomerAccount}
        />
      )}

      {/* Main Content Area */}
      <div className={currentPage === 'checkout' ? 'pt-0' : 'pt-20'}>
        {children}
      </div>

      {/* Floating WhatsApp Quick Connect Button */}
      <div className="fixed bottom-16 sm:bottom-24 lg:bottom-8 right-3 sm:right-6 lg:right-8 z-40">
        <a
          href="https://wa.me/919451638680?text=Hello%20MANISH%20%26%20CO,%20I%27d%20like%20to%20inquire%20about%20your%20fine%20silver%20jewellery%20collections."
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerAudio('shimmer')}
          className="relative w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#091B2B] to-[#0D2B4E] border-2 border-solid border-[#6B4B2E] rounded-full flex items-center justify-center shadow-[0_6px_24px_rgba(13,43,78,0.25)] hover:shadow-[0_15px_45px_rgba(13,43,78,0.45)] hover:scale-110 active:scale-95 transition-all duration-500 group cursor-pointer focus:outline-none"
          title="Connect on WhatsApp"
        >
          {/* Outer Pulsing Bronze Rings */}
          <span className="absolute -inset-0.5 sm:-inset-1 rounded-full border border-solid border-[#6B4B2E] animate-ping opacity-25 group-hover:opacity-50" style={{ animationDuration: '2s' }} />
          <span className="absolute -inset-1 sm:-inset-2 rounded-full border border-solid border-[#B09A82]/60 animate-ping opacity-15 group-hover:opacity-30" style={{ animationDuration: '3s' }} />

          {/* Rotating Accent Circle */}
          <svg className="absolute w-8 h-8 sm:w-12 sm:h-12 text-[#B09A82] opacity-40 group-hover:opacity-80 transition-opacity duration-300 animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
          </svg>

          {/* WhatsApp Icon */}
          <svg className="w-4.5 h-4.5 sm:w-6.5 sm:h-6.5 text-[#F8F5EC] group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.037L2 22l5.135-1.348a9.954 9.954 0 004.878 1.28c5.505 0 9.988-4.478 9.989-9.984 0-2.67-1.037-5.18-2.925-7.07C17.186 3.037 14.678 2 12.012 2zm5.727 14.153c-.313.882-1.554 1.61-2.148 1.666-.59.055-1.18.326-3.766-.694-2.585-1.02-4.237-3.663-4.364-3.834-.127-.171-1.03-1.374-1.03-2.623 0-1.25.654-1.862.887-2.102.233-.24.509-.3.678-.3.17 0 .34 0 .487.007.155.007.363-.058.567.442.204.5.7 1.713.76 1.838.06.126.1.272.017.438-.083.166-.124.272-.25.418-.125.146-.263.327-.375.44-.124.125-.253.26-.11.507.144.247.64 1.056 1.373 1.71.942.843 1.737 1.103 1.983 1.226.246.123.39.103.535-.062.145-.165.62-.72.787-.966.166-.247.33-.206.555-.124.225.083 1.427.674 1.674.8.247.124.412.185.472.289.06.103.06.6-.253 1.482z" />
          </svg>
        </a>
      </div>

      {/* Footer Details (Hidden on dedicated checkout flow) */}
      {currentPage !== 'checkout' && (
        <div className="w-full">
          <Footer
            navigateTo={navigateTo}
            handleCategoryNav={(cat) => {
              if (cat === 'silver-earrings') {
                changeCategoryTab('Earrings', 'silver');
                if (typeof setMetalFilter === 'function') setMetalFilter('silver');
              } else if (cat === 'silver') {
                changeCategoryTab('Silver', 'silver');
                if (typeof setMetalFilter === 'function') setMetalFilter('silver');
              } else if (cat === 'gold') {
                changeCategoryTab('Collections', 'gold');
                if (typeof setMetalFilter === 'function') setMetalFilter('gold');
              } else if (cat === 'platinum') {
                changeCategoryTab('Collections', 'platinum');
                if (typeof setMetalFilter === 'function') setMetalFilter('platinum');
              } else if (cat === 'diamond') {
                changeCategoryTab('Diamond', 'all');
              } else if (cat === 'bridal') {
                changeCategoryTab('Bridal', 'all');
              } else {
                changeCategoryTab(cat.charAt(0).toUpperCase() + cat.slice(1), 'all');
              }
              navigateTo('collections');
            }}
            triggerAudio={triggerAudio}
          />
        </div>
      )}

      {/* Customer Account, Order History, Live Tracking & Reorder Modal */}
      <CustomerAccountModal
        isOpen={customerAccountOpen}
        onClose={() => setCustomerAccountOpen(false)}
        triggerAudio={triggerAudio}
        navigateTo={navigateTo}
        initialTab={customerAccountTab}
      />

      {/* Shopping Bag Drawer Overlay */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        navigateTo={navigateTo}
      />

      {/* Wishlist Drawer Overlay */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        navigateTo={navigateTo}
        navigateToPDP={navigateToPDP}
        triggerAudio={triggerAudio}
      />
    </div>
  );
}
