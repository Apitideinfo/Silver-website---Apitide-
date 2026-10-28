import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  Gem,
  Truck,
  Sparkles
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useRates } from '../hooks/useRates';
import { useProducts } from '../hooks/useProducts';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import brandLogo from '../assets/logo.png';

export default function Navbar({
  currentPage,
  navigateTo,
  changeCategoryTab,
  soundEnabled,
  toggleSound,
  triggerAudio: triggerAudioProp,
  setConsultationModal,
  setCoinPurityTab,
  setCoinWeightFilter,
  setMetalFilter,
  setMaxPriceFilter,
  navigateToPDP,
  genderFilter,
  setGenderFilter,
  searchQuery,
  setSearchQuery,
  openCustomerAccount
}) {
  const { cartItemCount, setCartOpen } = useCart();
  const { wishlistItems, setWishlistOpen } = useWishlist();
  const { products = [] } = useProducts();
  const { formatPrice, calculatePrice } = useRates();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(searchQuery || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

  const triggerAudio = (type) => {
    try { triggerAudioProp?.(type); } catch { /* noop */ }
  };

  // Sync external search query
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== searchVal) {
      setSearchVal(searchQuery);
    }
  }, [searchQuery]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Autocomplete suggestions
  const searchSuggestions = searchVal.trim()
    ? products
        .filter((p) =>
          (p.name || '').toLowerCase().includes(searchVal.toLowerCase()) ||
          (p.category || '').toLowerCase().includes(searchVal.toLowerCase()) ||
          (p.subCategory || '').toLowerCase().includes(searchVal.toLowerCase()) ||
          (p.metal || '').toLowerCase().includes(searchVal.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      triggerAudio('click');
      if (typeof setSearchQuery === 'function') {
        setSearchQuery(searchVal.trim());
      }
      if (typeof changeCategoryTab === 'function') {
        changeCategoryTab('Collections');
      }
      navigateTo('collections');
      setSearchOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 select-none bg-[#050B14]/95 backdrop-blur-md border-b border-white/10 transition-colors duration-300">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        
        {/* ==========================================================
            LEFT: BRAND LOGO WORDMARK (Screenshot Exact: White Subtitle, Single-Line Mobile)
            ========================================================== */}
        <button
          onClick={() => {
            navigateTo('home');
          }}
          className="flex items-center gap-2 sm:gap-3 focus:outline-none cursor-pointer group text-left border-none bg-transparent shrink-0"
        >
          <img 
            src={brandLogo} 
            alt="M&CO Fine Jewellery" 
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-contain bg-white shadow-[0_2px_12px_rgba(0,0,0,0.4)] border border-white/20 transition-transform duration-300 group-hover:scale-105 shrink-0"
          />
          <div className="flex flex-col items-start min-w-0">
            <span 
              className="font-serif text-[17px] xs:text-[19px] sm:text-[23px] font-bold tracking-[0.16em] sm:tracking-[0.18em] text-white uppercase leading-none drop-shadow-sm group-hover:text-[#E5C396] transition-colors whitespace-nowrap"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
            >
              MANISH &amp; CO
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 w-full">
              <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/70" />
              <span 
                className="font-serif text-[8px] sm:text-[9.5px] tracking-[0.24em] sm:tracking-[0.28em] text-white/90 uppercase font-semibold whitespace-nowrap"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                FINE JEWELLERY
              </span>
              <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/70" />
            </div>
          </div>
        </button>

        {/* ==========================================================
            CENTER: NAVIGATION LINKS (Reference Screenshot Design)
            ========================================================== */}
        <div className="hidden md:flex items-center gap-7 lg:gap-11">
          {/* Home */}
          <button
            onClick={() => {
              triggerAudio('click');
              navigateTo('home');
            }}
            className={`relative py-1.5 text-[13px] lg:text-[14px] font-sans tracking-[0.06em] cursor-pointer transition-colors ${
              currentPage === 'home'
                ? 'text-white font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#C5A880]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Home
          </button>

          {/* Collections */}
          <button
            onClick={() => {
              triggerAudio('click');
              changeCategoryTab?.('Collections');
              navigateTo('collections');
            }}
            className={`relative py-1.5 text-[13px] lg:text-[14px] font-sans tracking-[0.06em] cursor-pointer transition-colors ${
              currentPage === 'collections'
                ? 'text-white font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#C5A880]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Collections
          </button>

          {/* About */}
          <button
            onClick={() => {
              triggerAudio('click');
              navigateTo('about-us');
            }}
            className={`relative py-1.5 text-[13px] lg:text-[14px] font-sans tracking-[0.06em] cursor-pointer transition-colors ${
              currentPage === 'about-us' || currentPage === 'heritage'
                ? 'text-white font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#C5A880]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            About
          </button>

          {/* Silver Guide */}
          <button
            onClick={() => {
              triggerAudio('click');
              navigateTo('valuation');
            }}
            className={`relative py-1.5 text-[13px] lg:text-[14px] font-sans tracking-[0.06em] cursor-pointer transition-colors ${
              currentPage === 'valuation'
                ? 'text-white font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#C5A880]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Silver Guide
          </button>

          {/* Contact */}
          <button
            onClick={() => {
              triggerAudio('click');
              navigateTo('showrooms');
            }}
            className={`relative py-1.5 text-[13px] lg:text-[14px] font-sans tracking-[0.06em] cursor-pointer transition-colors ${
              currentPage === 'showrooms'
                ? 'text-white font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#C5A880]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Contact
          </button>
        </div>

        {/* ==========================================================
            RIGHT: ICONS (Search, User, Cart) + Mobile Hamburger
            ========================================================== */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Search Trigger Icon */}
          <button
            onClick={() => {
              triggerAudio('click');
              setSearchOpen(!searchOpen);
            }}
            aria-label="Search Fine Jewellery"
            className="p-2 text-gray-200 hover:text-white transition-colors cursor-pointer focus:outline-none rounded-full hover:bg-white/5 active:scale-95"
          >
            <Search className="w-5 h-5" strokeWidth={1.8} />
          </button>

          {/* Customer Account / Orders Icon */}
          <button
            onClick={() => {
              triggerAudio('click');
              openCustomerAccount?.('orders');
            }}
            aria-label="My Account and Orders"
            className="p-2 text-gray-200 hover:text-white transition-colors cursor-pointer focus:outline-none rounded-full hover:bg-white/5 active:scale-95"
          >
            <User className="w-5 h-5" strokeWidth={1.8} />
          </button>

          {/* Cart Icon with Gold Badge */}
          <button
            onClick={() => {
              triggerAudio('click');
              setCartOpen(true);
            }}
            aria-label="View Shopping Bag"
            className="relative p-2 text-gray-200 hover:text-white transition-colors cursor-pointer focus:outline-none rounded-full hover:bg-white/5 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 bg-[#8C6D46] text-white text-[10px] font-bold min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(140,109,70,0.5)]">
              {cartItemCount || 0}
            </span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => {
              triggerAudio('click');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Open Navigation Menu"
            className="md:hidden p-2 text-gray-200 hover:text-white focus:outline-none cursor-pointer rounded-full hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ==========================================================
          SEARCH BAR OVERLAY / DROPDOWN
          ========================================================== */}
      {searchOpen && (
        <div className="w-full bg-[#070E1A] border-t border-white/10 px-4 sm:px-8 py-3.5 shadow-2xl animate-fade-in">
          <div className="max-w-2xl mx-auto relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-[#C5A880] absolute left-4" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search Solitaires, Rings, 925 Silver Necklaces..."
                className="w-full h-11 pl-12 pr-10 bg-white/10 border border-white/15 focus:border-[#C5A880] focus:bg-white/15 focus:outline-none rounded-full text-white placeholder-gray-400 text-sm transition-all shadow-inner font-sans"
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => setSearchVal('')}
                  className="absolute right-3 p-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Suggestions list */}
            {searchSuggestions.length > 0 && (
              <div className="mt-2 bg-[#091322] border border-white/15 rounded-2xl p-2 shadow-2xl max-h-64 overflow-y-auto">
                {searchSuggestions.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      triggerAudio('click');
                      navigateToPDP?.(prod);
                      setSearchOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer focus:outline-none border-none bg-transparent"
                  >
                    <img 
                      src={getOptimizedImageUrl(prod.img, { width: 100 })} 
                      alt={prod.name} 
                      className="w-9 h-9 object-contain rounded-lg border border-white/10 bg-white/5" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{prod.name}</div>
                      <div className="text-[11px] text-[#C5A880] font-sans font-semibold">
                        ₹{formatPrice?.(calculatePrice?.(prod)?.total || prod.price) || prod.price}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================================
          MOBILE NAVIGATION DRAWER
          ========================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050B14] border-t border-white/10 px-6 py-6 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex flex-col space-y-3 font-sans">
            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('home');
                setMobileMenuOpen(false);
              }}
              className="text-left text-base font-medium text-white hover:text-[#C5A880] py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>

            <button
              onClick={() => {
                triggerAudio('click');
                changeCategoryTab?.('Collections');
                navigateTo('collections');
                setMobileMenuOpen(false);
              }}
              className="text-left text-base font-medium text-white hover:text-[#C5A880] py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Collections</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>

            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('about-us');
                setMobileMenuOpen(false);
              }}
              className="text-left text-base font-medium text-white hover:text-[#C5A880] py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>About Us</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>

            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('valuation');
                setMobileMenuOpen(false);
              }}
              className="text-left text-base font-medium text-white hover:text-[#C5A880] py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Silver Guide &amp; Bullion</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>

            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('showrooms');
                setMobileMenuOpen(false);
              }}
              className="text-left text-base font-medium text-white hover:text-[#C5A880] py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Contact &amp; Showrooms</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>925 Sterling Silver • BIS Hallmarked</span>
            <span className="text-[#C5A880]">Authentic Luxury</span>
          </div>
        </div>
      )}
    </nav>
  );
}
