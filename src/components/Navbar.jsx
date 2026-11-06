import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  User, 
  ShoppingCart, 
  Heart, 
  Menu, 
  X, 
  ChevronRight,
  Phone
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useRates } from '../hooks/useRates';
import { useProducts } from '../hooks/useProducts';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { INITIAL_CATEGORIES } from '../config/constants';

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
  const { cartItemCount = 0, setCartOpen } = useCart();
  const { wishlistItems = [], setWishlistOpen } = useWishlist();
  const { products = [], categories = [] } = useProducts();
  const { formatPrice, calculatePrice } = useRates();

  const [searchOpenMobile, setSearchOpenMobile] = useState(false);
  const [searchVal, setSearchVal] = useState(searchQuery || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const triggerAudio = (type) => {
    try { triggerAudioProp?.(type); } catch { /* noop */ }
  };

  // Sync external search query
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== searchVal) {
      setSearchVal(searchQuery);
    }
  }, [searchQuery]);

  // Click outside search container to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    if (e) e.preventDefault();
    if (searchVal.trim()) {
      triggerAudio('click');
      if (typeof setSearchQuery === 'function') {
        setSearchQuery(searchVal.trim());
      }
      if (typeof changeCategoryTab === 'function') {
        changeCategoryTab('Collections');
      }
      navigateTo('collections');
      setIsSearchFocused(false);
      setSearchOpenMobile(false);
    }
  };

  const navCategories = React.useMemo(() => {
    const list = Array.isArray(categories) && categories.length > 0 ? categories : INITIAL_CATEGORIES;
    return [
      { label: 'New Arrivals', action: () => { changeCategoryTab?.('Collections'); navigateTo('collections'); } },
      { label: 'Bestsellers', action: () => { changeCategoryTab?.('Collections'); navigateTo('collections'); } },
      ...list.map((cat) => ({
        label: cat.name,
        action: () => {
          changeCategoryTab?.(cat.id || cat.slug || cat.name);
          navigateTo('collections');
        }
      })),
      { 
        label: 'Reviews', 
        action: () => {
          if (currentPage === 'home') {
            const el = document.getElementById('testimonials') || document.getElementById('reviews');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
            navigateTo('home');
            setTimeout(() => {
              const el = document.getElementById('testimonials') || document.getElementById('reviews');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 350);
          }
        } 
      }
    ];
  }, [categories, changeCategoryTab, navigateTo, currentPage]);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 select-none bg-white shadow-xs">
      
      {/* ==========================================================
          TIER 1: TOP ANNOUNCEMENT BANNER (Reference Screenshot Style - Centered)
          ========================================================== */}
      <div className="w-full bg-[#5A3825] text-white text-[11px] sm:text-[12.5px] py-1.5 px-4 font-sans tracking-wide">
        <div className="max-w-[1536px] mx-auto flex items-center justify-center text-center px-2">
          <p className="truncate text-center font-medium">
            ✨ Crafted with care, trusted by thousands – Welcome to MANISH &amp; CO, where every piece tells your story
          </p>
        </div>
      </div>

      {/* ==========================================================
          TIER 2: MIDDLE ROW (Customer Care, MANISH & CO Logo, Icons)
          ========================================================== */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-[72px] flex items-center justify-between gap-4">
          
          {/* LEFT: Hamburger Menu & Customer Care */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                triggerAudio('click');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Open Navigation Menu"
              className="md:hidden p-1.5 -ml-1 text-gray-800 hover:text-black focus:outline-none cursor-pointer rounded-md"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Customer Care link */}
            <a 
              href="tel:+919451638680"
              className="hidden md:inline-flex items-center text-[13px] lg:text-[13.5px] text-gray-700 hover:text-black font-sans tracking-tight transition-colors whitespace-nowrap"
            >
              Customer Care: <span className="font-medium ml-1 text-gray-900">+91 94516 38680</span>
            </a>

            {/* Mobile Phone Call Link */}
            <a 
              href="tel:+919451638680"
              aria-label="Call Customer Care"
              className="hidden xs:inline-flex md:hidden text-gray-700 hover:text-black p-1"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* CENTER: BRAND LOGO (Fluid width so search icon NEVER overlaps on mobile) */}
          <div className="flex-1 min-w-0 flex items-center justify-center text-center px-1">
            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('home');
              }}
              className="flex flex-col items-center justify-center focus:outline-none cursor-pointer group text-center border-none bg-transparent max-w-full"
              aria-label="MANISH & CO Home"
            >
              <span 
                className="font-serif text-[17px] xs:text-[19px] sm:text-[24px] md:text-[28px] lg:text-[31px] font-bold tracking-[0.06em] xs:tracking-[0.08em] sm:tracking-[0.12em] text-[#111111] uppercase leading-none group-hover:text-[#8C6D46] transition-colors whitespace-nowrap"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                MANISH &amp; CO
              </span>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
                <span className="h-[0.5px] w-2.5 sm:w-5 bg-gray-300" />
                <span 
                  className="font-sans text-[7px] xs:text-[7.5px] sm:text-[9.5px] tracking-[0.2em] sm:tracking-[0.3em] text-[#8C6D46] uppercase font-semibold whitespace-nowrap"
                >
                  FINE JEWELLERY
                </span>
                <span className="h-[0.5px] w-2.5 sm:w-5 bg-gray-300" />
              </div>
            </button>
          </div>

          {/* RIGHT: Search Bar + Profile + Wishlist + Cart (Clean spacing) */}
          <div className="flex items-center justify-end gap-1 xs:gap-1.5 sm:gap-4 md:gap-5 shrink-0" ref={searchContainerRef}>
            
            {/* Desktop Embedded Search Box */}
            <div className="relative hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search"
                  className="w-32 lg:w-48 xl:w-56 py-1 pl-1 pr-7 text-[13px] bg-transparent border-b border-gray-300 focus:border-gray-900 focus:outline-none text-gray-800 placeholder-gray-500 font-sans transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Submit Search"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer p-0.5"
                >
                  <Search className="w-4.5 h-4.5" strokeWidth={1.5} />
                </button>
              </form>

              {/* Autocomplete Dropdown under search */}
              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-50">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-2 py-1">
                    Matching Products
                  </div>
                  {searchSuggestions.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        triggerAudio('click');
                        navigateToPDP?.(prod);
                        setIsSearchFocused(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-md transition-colors text-left cursor-pointer border-none bg-transparent"
                    >
                      <img 
                        src={getOptimizedImageUrl(prod.img, { width: 80 })} 
                        alt={prod.name} 
                        className="w-8 h-8 object-contain rounded border border-gray-100 bg-[#F9F9F9]" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">{prod.name}</div>
                        <div className="text-[11px] text-[#8C6D46] font-semibold">
                          ₹{formatPrice?.(calculatePrice?.(prod)?.total || prod.price) || prod.price}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search Icon Toggle */}
            <button
              onClick={() => {
                triggerAudio('click');
                setSearchOpenMobile(!searchOpenMobile);
              }}
              aria-label="Search"
              className="md:hidden p-1.5 text-gray-800 hover:text-black cursor-pointer"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Profile / Account Icon */}
            <button
              onClick={() => {
                triggerAudio('click');
                openCustomerAccount?.('orders');
              }}
              aria-label="Customer Account"
              title="My Account & Orders"
              className="p-1.5 text-gray-800 hover:text-black transition-colors cursor-pointer focus:outline-none"
            >
              <User className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={1.5} />
            </button>

            {/* Wishlist Heart Icon */}
            <button
              onClick={() => {
                triggerAudio('click');
                setWishlistOpen(true);
              }}
              aria-label="Wishlist"
              title="View Wishlist"
              className="relative p-1.5 text-gray-800 hover:text-black transition-colors cursor-pointer focus:outline-none"
            >
              <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={1.5} />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#8C6D46] text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon with Badge */}
            <button
              onClick={() => {
                triggerAudio('click');
                setCartOpen(true);
              }}
              aria-label="Shopping Cart"
              title="View Shopping Bag"
              className="relative p-1.5 text-gray-800 hover:text-black transition-colors cursor-pointer focus:outline-none"
            >
              <ShoppingCart className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 bg-[#1A1A1A] text-white text-[10px] font-bold min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center shadow-xs">
                {cartItemCount || 0}
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* ==========================================================
          MOBILE SEARCH INPUT (DROPDOWN)
          ========================================================== */}
      {searchOpenMobile && (
        <div className="md:hidden w-full bg-[#FAFAFA] border-b border-gray-200 px-4 py-2.5">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search Rings, Earrings, Silver Jewellery..."
              autoFocus
              className="w-full py-1.5 pl-3 pr-9 text-xs bg-white border border-gray-300 rounded-full focus:outline-none focus:border-gray-800 text-gray-800"
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-600 hover:text-black"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ==========================================================
          TIER 3: CATEGORY NAVIGATION BAR (Reference Screenshot Exact)
          ========================================================== */}
      <div className="w-full bg-white border-b border-gray-200">
        
        {/* Desktop Horizontal Category List */}
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 hidden md:flex items-center justify-center gap-4 lg:gap-6 xl:gap-8 py-2.5">
          {navCategories.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                triggerAudio('click');
                item.action();
              }}
              className="text-[13px] lg:text-[13.5px] font-medium text-[#222222] hover:text-[#8C6D46] transition-colors whitespace-nowrap cursor-pointer border-none bg-transparent py-1 tracking-tight"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Horizontal Scroll Strip for Instant Access */}
        <div className="md:hidden flex items-center overflow-x-auto no-scrollbar py-2 px-3 gap-3 text-xs font-medium text-gray-800 whitespace-nowrap scroll-smooth">
          {navCategories.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                triggerAudio('click');
                item.action();
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium transition-colors shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>

      {/* ==========================================================
          MOBILE NAVIGATION DRAWER
          ========================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-5 space-y-4 shadow-xl animate-fade-in max-h-[80vh] overflow-y-auto">
          
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Customer Care</span>
            <a href="tel:+919451638680" className="font-semibold text-gray-900">+91 94516 38680</a>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Browse Categories
            </div>
            {navCategories.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  triggerAudio('click');
                  item.action();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm font-medium text-gray-800 hover:text-[#8C6D46] border-b border-gray-50 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('about-us');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-1.5 text-xs font-medium text-gray-600 hover:text-black flex items-center justify-between"
            >
              <span>About MANISH &amp; CO</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('showrooms');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-1.5 text-xs font-medium text-gray-600 hover:text-black flex items-center justify-between"
            >
              <span>Our Showrooms &amp; Contact</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button
              onClick={() => {
                triggerAudio('click');
                openCustomerAccount?.('orders');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-1.5 text-xs font-medium text-gray-600 hover:text-black flex items-center justify-between"
            >
              <span>My Orders &amp; Tracking</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

        </div>
      )}

    </header>
  );
}
