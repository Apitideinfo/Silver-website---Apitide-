import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  ChevronDown,
  ChevronRight,
  Phone
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useRates } from '../hooks/useRates';
import { useProducts } from '../hooks/useProducts';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { INITIAL_CATEGORIES } from '../config/constants';
import { StorageService } from '../services/StorageService';

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

  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [searchOpenMobile, setSearchOpenMobile] = useState(false);
  const [searchVal, setSearchVal] = useState(searchQuery || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [collectionsDropdown, setCollectionsDropdown] = useState(false);
  const [mobileCollectionsExpanded, setMobileCollectionsExpanded] = useState(false);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const triggerAudio = (type) => {
    try { triggerAudioProp?.(type); } catch { /* noop */ }
  };

  // Sync external search query
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== searchVal) {
      const timer = setTimeout(() => setSearchVal(searchQuery), 0);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, searchVal]);

  // Click outside search container to close suggestions & search box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
        if (!searchVal.trim()) {
          setDesktopSearchOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchVal]);

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
      setDesktopSearchOpen(false);
      setSearchOpenMobile(false);
    }
  };

  const navCategories = React.useMemo(() => {
    const isAllCleared = StorageService.get('manish_categories_all_cleared', false);
    if (isAllCleared) return [];
    const deletedIds = StorageService.get('manish_categories_deleted_ids', []);
    const sourceList = Array.isArray(categories) && categories.length > 0 
      ? categories 
      : (StorageService.get('manish_categories_initialized', false) ? [] : INITIAL_CATEGORIES);

    const cleanList = sourceList.filter(c => {
      const id = String(c.id || c.docId || c.name || '').toLowerCase();
      if (deletedIds.includes(id) || deletedIds.includes(String(c.id || '')) || deletedIds.includes(String(c.docId || ''))) {
        return false;
      }
      return id !== 'bangles' && id !== 'nath-nose-pin' && id !== 'jhumka' && c.name !== 'Bangles';
    });
    const finalList = cleanList;

    return [
      { label: 'New Arrivals', action: () => { changeCategoryTab?.('Collections'); navigateTo('collections'); } },
      { label: 'Bestsellers', action: () => { changeCategoryTab?.('Collections'); navigateTo('collections'); } },
      ...finalList.map((cat) => ({
        label: cat.name,
        action: () => {
          changeCategoryTab?.(cat.id || cat.slug || cat.name);
          navigateTo('collections');
        }
      })),
      { 
        label: 'Patrons\' Stories', 
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
    <header className="fixed top-0 left-0 right-0 w-full z-50 select-none bg-[#050C17] shadow-lg">
      
      {/* ==========================================================
          TOP ANNOUNCEMENT BAR (Reference Match: Clean, Minimalist Luxury)
          ========================================================== */}
      <div className="w-full bg-[#050C17] text-white text-[11px] sm:text-[12px] py-1.5 px-4 font-sans tracking-wider border-b border-white/5">
        <div className="max-w-[1536px] mx-auto flex items-center justify-center text-center">
          <p className="truncate text-center font-normal text-white/90">
            Free Shipping Across India &nbsp;<span className="text-white/40">|</span>&nbsp; 90% Refund Policy
          </p>
        </div>
      </div>

      {/* ==========================================================
          MAIN HEADER ROW (Exact Match to User Reference Screenshot)
          Background: #061220 with subtle border-b border-white/10
          ========================================================== */}
      <div className="w-full bg-[#061220] border-b border-white/10">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-[70px] flex items-center justify-between gap-4">
          
          {/* LEFT: Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                triggerAudio('click');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Open Navigation Menu"
              className="lg:hidden p-1.5 -ml-1 text-white hover:text-white/80 focus:outline-none cursor-pointer rounded-md transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo (Exact Reference Font & Styling) */}
            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('home');
              }}
              className="flex flex-col items-start justify-center focus:outline-none cursor-pointer group text-left border-none bg-transparent"
              aria-label="MANISH & CO Home"
            >
              <span 
                className="font-serif text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-normal tracking-[0.08em] text-white uppercase leading-none group-hover:text-white/90 transition-colors whitespace-nowrap"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                MANISH &amp; CO
              </span>
              <span 
                className="font-sans text-[7px] xs:text-[7.5px] sm:text-[8px] md:text-[8.5px] tracking-[0.28em] sm:tracking-[0.32em] text-white/80 uppercase font-medium mt-1 leading-none whitespace-nowrap"
              >
                FINE JEWELLERY
              </span>
            </button>
          </div>

          {/* CENTER: Desktop Navigation Links (Exact Match to Reference Screenshot) */}
          <nav className="hidden lg:flex items-center justify-center gap-7 xl:gap-9 text-[13.5px] xl:text-[14px] font-sans tracking-[0.03em]">
            
            {/* Home */}
            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('home');
              }}
              className={`relative cursor-pointer transition-colors py-1 ${
                currentPage === 'home'
                  ? 'text-white border-b-2 border-white font-medium'
                  : 'text-white/80 hover:text-white font-normal'
              }`}
            >
              Home
            </button>

            {/* Collections with Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setCollectionsDropdown(true)}
              onMouseLeave={() => setCollectionsDropdown(false)}
            >
              <button
                onClick={() => {
                  triggerAudio('click');
                  changeCategoryTab?.('Collections');
                  navigateTo('collections');
                }}
                className={`inline-flex items-center gap-1 cursor-pointer transition-colors py-1 ${
                  currentPage === 'collections'
                    ? 'text-white border-b-2 border-white font-medium'
                    : 'text-white/80 hover:text-white font-normal'
                }`}
              >
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Luxury Collections Dropdown Menu */}
              {collectionsDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-64 animate-fade-in">
                  <div className="bg-[#081726] border border-white/15 rounded-lg shadow-2xl py-2 px-1 backdrop-blur-md">
                    <button
                      onClick={() => {
                        triggerAudio('click');
                        changeCategoryTab?.('Collections');
                        navigateTo('collections');
                        setCollectionsDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[#D4AF37] hover:bg-white/5 rounded transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      All Collections →
                    </button>
                    <div className="h-[1px] bg-white/10 my-1" />
                    {navCategories.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          triggerAudio('click');
                          item.action();
                          setCollectionsDropdown(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-white/85 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* About */}
            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('about-us');
              }}
              className={`relative cursor-pointer transition-colors py-1 ${
                currentPage === 'about-us'
                  ? 'text-white border-b-2 border-white font-medium'
                  : 'text-white/80 hover:text-white font-normal'
              }`}
            >
              About
            </button>

            {/* Our Craft */}
            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('heritage');
              }}
              className={`relative cursor-pointer transition-colors py-1 ${
                currentPage === 'heritage'
                  ? 'text-white border-b-2 border-white font-medium'
                  : 'text-white/80 hover:text-white font-normal'
              }`}
            >
              Our Craft
            </button>

            {/* Custom */}
            <button
              onClick={() => {
                triggerAudio('click');
                setConsultationModal(true);
              }}
              className="relative cursor-pointer transition-colors py-1 text-white/80 hover:text-white font-normal"
            >
              Custom
            </button>

            {/* Journal */}
            <button
              onClick={() => {
                triggerAudio('click');
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
              }}
              className="relative cursor-pointer transition-colors py-1 text-white/80 hover:text-white font-normal"
            >
              Journal
            </button>

            {/* Contact */}
            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('showrooms');
              }}
              className={`relative cursor-pointer transition-colors py-1 ${
                currentPage === 'showrooms'
                  ? 'text-white border-b-2 border-white font-medium'
                  : 'text-white/80 hover:text-white font-normal'
              }`}
            >
              Contact
            </button>

          </nav>

          {/* RIGHT: Minimalist Outline Icons (Search, User, ShoppingBag) */}
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 shrink-0" ref={searchContainerRef}>
            
            {/* Search Icon & Expanding Search Input */}
            <div className="relative">
              {desktopSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="relative flex items-center animate-fade-in">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search jewellery..."
                    autoFocus
                    className="w-36 sm:w-52 py-1 pl-2 pr-7 text-xs bg-transparent border-b border-white/40 focus:border-white focus:outline-none text-white placeholder-white/50 font-sans transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setDesktopSearchOpen(false)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    triggerAudio('click');
                    setDesktopSearchOpen(true);
                  }}
                  aria-label="Search"
                  className="p-1 text-white hover:text-white/80 transition-colors cursor-pointer"
                >
                  <Search className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={1.5} />
                </button>
              )}

              {/* Autocomplete Dropdown under search */}
              {desktopSearchOpen && isSearchFocused && searchSuggestions.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#081726] border border-white/15 rounded-lg shadow-2xl p-2 z-50 text-white">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-white/40 px-2 py-1">
                    Matching Products
                  </div>
                  {searchSuggestions.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        triggerAudio('click');
                        navigateToPDP?.(prod);
                        setIsSearchFocused(false);
                        setDesktopSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 hover:bg-white/10 rounded-md transition-colors text-left cursor-pointer border-none bg-transparent"
                    >
                      <img 
                        src={getOptimizedImageUrl(prod.img, { width: 80 })} 
                        alt={prod.name} 
                        className="w-8 h-8 object-contain rounded border border-white/10 bg-white/5" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{prod.name}</div>
                        <div className="text-[11px] text-[#D4AF37] font-semibold">
                          ₹{formatPrice?.(calculatePrice?.(prod)?.total || prod.price) || prod.price}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile / Account Icon */}
            <button
              onClick={() => {
                triggerAudio('click');
                openCustomerAccount?.('orders');
              }}
              aria-label="Customer Account"
              title="My Account & Orders"
              className="p-1 text-white hover:text-white/80 transition-colors cursor-pointer focus:outline-none"
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
              className="relative p-1 text-white hover:text-white/80 transition-colors cursor-pointer focus:outline-none"
            >
              <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={1.5} />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#050C17] text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon with Badge (Matching reference image) */}
            <button
              onClick={() => {
                triggerAudio('click');
                setCartOpen(true);
              }}
              aria-label="Shopping Bag"
              title="View Shopping Bag"
              className="relative p-1 text-white hover:text-white/80 transition-colors cursor-pointer focus:outline-none"
            >
              <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#050C17] text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>

      {/* ==========================================================
          MOBILE NAVIGATION DRAWER
          ========================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#061220] border-b border-white/15 px-6 py-5 space-y-4 shadow-2xl animate-fade-in max-h-[85vh] overflow-y-auto text-white">
          
          <div className="pb-3 border-b border-white/10 flex items-center justify-between text-xs text-white/70">
            <span>Customer Care</span>
            <a href="tel:+919451638680" className="font-semibold text-white">+91 94516 38680</a>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 text-sm font-medium border-b border-white/10 flex items-center justify-between transition-colors ${
                currentPage === 'home' ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>

            {/* Collections with accordion */}
            <div>
              <button
                onClick={() => setMobileCollectionsExpanded(!mobileCollectionsExpanded)}
                className="w-full text-left py-2.5 text-sm font-medium border-b border-white/10 flex items-center justify-between text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <span>Collections</span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${mobileCollectionsExpanded ? 'rotate-180' : ''}`} />
              </button>
              {mobileCollectionsExpanded && (
                <div className="pl-4 py-2 space-y-2 bg-white/5 rounded-md my-1">
                  <button
                    onClick={() => {
                      triggerAudio('click');
                      changeCategoryTab?.('Collections');
                      navigateTo('collections');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-xs font-semibold text-[#D4AF37] py-1"
                  >
                    View All Collections →
                  </button>
                  {navCategories.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        triggerAudio('click');
                        item.action();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-xs text-white/80 hover:text-white py-1 block"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('about-us');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 text-sm font-medium border-b border-white/10 flex items-center justify-between transition-colors ${
                currentPage === 'about-us' ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              <span>About</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>

            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('heritage');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 text-sm font-medium border-b border-white/10 flex items-center justify-between transition-colors ${
                currentPage === 'heritage' ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              <span>Our Craft</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>

            <button
              onClick={() => {
                triggerAudio('click');
                setConsultationModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 text-sm font-medium text-white/80 hover:text-white border-b border-white/10 flex items-center justify-between transition-colors"
            >
              <span>Custom Jewellery</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>

            <button
              onClick={() => {
                triggerAudio('click');
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
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 text-sm font-medium text-white/80 hover:text-white border-b border-white/10 flex items-center justify-between transition-colors"
            >
              <span>Journal (Patrons' Stories)</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>

            <button
              onClick={() => {
                triggerAudio('click');
                navigateTo('showrooms');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 text-sm font-medium border-b border-white/10 flex items-center justify-between transition-colors ${
                currentPage === 'showrooms' ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              <span>Contact &amp; Showrooms</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                triggerAudio('click');
                openCustomerAccount?.('orders');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-1.5 text-xs font-medium text-white/80 hover:text-white flex items-center justify-between transition-colors"
            >
              <span>My Orders &amp; Tracking</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            </button>
          </div>

        </div>
      )}

    </header>
  );
}
