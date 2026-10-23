import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { 
  Sparkles, 
  Gem, 
  Crown, 
  CircleDot, 
  Circle, 
  Heart, 
  Bell, 
  Star, 
  Award, 
  Gift, 
  Coins, 
  User, 
  Baby, 
  Disc,
  Package,
  Truck
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useRates } from '../hooks/useRates';
import { useProducts } from '../hooks/useProducts';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

import brandSeal from '../assets/manish_co_seal.jpg';
const hrLogo = brandSeal;
const hrLogoMark = brandSeal;

// Import local category tab icons
import solitariesImg from '../assets/solitaries.png';
import watchJewelleryImg from '../assets/watch_jewellery.png';
import mensJewelleryImg from '../assets/mens_jewellery.png';
import mangalsutrasImg from '../assets/mangalsutras.png';
import nosePinsImg from '../assets/nose_pins.png';
import kidsJewelleryImg from '../assets/kids_jewellery.png';
import goldCoinsImg from '../assets/gold_coins.png';
import ankletsImg from '../assets/anklets.png';

export default function Navbar({
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
  genderFilter,
  setGenderFilter,
  searchQuery,
  setSearchQuery,
  openCustomerAccount
}) {
  const { cartItems, setCartOpen, cartItemCount } = useCart();
  const { wishlistItems, setWishlistOpen } = useWishlist();
  const { products } = useProducts();
  const { formatPrice, calculatePrice } = useRates();

  const [searchVal, setSearchVal] = useState(searchQuery || '');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOurCollectionsOpen, setMobileOurCollectionsOpen] = useState(true);

  // Sync external searchQuery state if updated
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== searchVal) {
      setSearchVal(searchQuery);
    }
  }, [searchQuery]);

  // Suggestions search logic
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
      changeCategoryTab('Collections');
      navigateTo('collections');
      setSearchFocused(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 select-none bg-[#F8F5EC]/95 backdrop-blur-md border-b border-[#E6DFD3] shadow-xs py-2">
      {/* DESKTOP HEADER (Two-Row Layout) */}
      <div className="hidden lg:flex flex-col w-full max-w-[1400px] mx-auto px-6">
        
        {/* Top Row: Logo, Search Bar, Redesigned Utility Buttons */}
        <div className="flex justify-between items-center gap-8 h-20">
          
          {/* Logo / Brand Name */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-3 shrink-0 focus:outline-none transition-all duration-300 hover:scale-[1.02] text-left cursor-pointer border-none bg-transparent"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#E6DFD3] shadow-sm shrink-0 bg-[#F8F5EC]">
              <img
                src={hrLogoMark}
                alt="MANISH &amp; CO Royal Seal"
                className="w-full h-full object-cover select-none"
              />
            </div>
            <div className="flex flex-col justify-center text-left">
              <span 
                className="serif-luxury text-[17px] lg:text-[20px] font-bold leading-tight tracking-[2.5px] text-[#0D2B4E]"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                MANISH &amp; CO
              </span>
              <span 
                className="serif-luxury text-[11px] lg:text-[12px] font-semibold leading-none tracking-[3.5px] text-[#6B4B2E] mt-1"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                FINE SILVER JEWELLERY
              </span>
              <span className="text-[7.5px] tracking-[0.25em] uppercase font-sans font-light text-[#657989] mt-1">
                925 Hallmarked • Est. 1996
              </span>
            </div>
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-[550px] mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search Fine Silver Rings, Necklaces, Solitaires..."
                className="w-full h-12 pl-12 pr-4 bg-white border border-solid border-[#E6DFD3] focus:border-[#0D2B4E] focus:outline-none rounded-full text-[#202329] placeholder-[#657989] text-[13px] font-medium transition-all shadow-2xs"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#657989] pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {searchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white text-[#202329] shadow-[0_12px_40px_rgba(13,43,78,0.1)] border border-solid border-[#E6DFD3] rounded-2xl py-3 px-4 z-[999] max-h-[300px] overflow-y-auto">
                {searchSuggestions.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      triggerAudio('click');
                      navigateToPDP(prod);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-[#F8F5EC] rounded-xl transition-colors text-left cursor-pointer focus:outline-none border-none bg-transparent"
                  >
                    <img src={getOptimizedImageUrl(prod.img, { width: 100 })} alt={prod.name} className="w-10 h-10 object-contain rounded-lg border border-solid border-[#E6DFD3] bg-[#F8F5EC]" />
                    <div>
                      <div className="text-[12px] font-bold text-[#0D2B4E] line-clamp-1">{prod.name}</div>
                      <div className="text-[10px] text-[#6B4B2E] font-bold font-sans">₹{formatPrice(calculatePrice(prod).total)}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center space-x-2 xl:space-x-3 h-full">
            
            {/* Sound Button */}
            <button
              onClick={toggleSound}
              className="group relative flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-white transition-all duration-300 cursor-pointer focus:outline-none border border-transparent hover:border-[#E6DFD3] bg-transparent"
            >
              <div className="text-[#0D2B4E] group-hover:text-[#6B4B2E] transition-transform duration-300 group-hover:scale-110 active:scale-95">
                {soundEnabled ? (
                  <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                ) : (
                  <svg className="w-5.5 h-5.5 text-[#B2BAC1]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6h4.72L12.75 5.1c.3-.3.8-.09.8.32v13.16c0 .41-.5.62-.8.32l-3.53-3.53H6.75c-.69 0-1.25-.56-1.25-1.25v-3c0-.69.56-1.25 1.25-1.25z" />
                  </svg>
                )}
              </div>
            </button>

            {/* Whatsapp Inquire */}
            <a
              href="https://wa.me/919451638680?text=Hello%20MANISH%20%26%20CO,%20I%20am%20interested%20in%20your%20pure%20silver%20jewellery%20designs."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-white transition-all duration-300 cursor-pointer border border-transparent hover:border-[#E6DFD3]"
            >
              <div className="text-[#0D2B4E] group-hover:text-[#6B4B2E] transition-transform duration-300 group-hover:scale-110 active:scale-95">
                <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.705 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
            </a>

            {/* Customer Account & Orders */}
            <button
              onClick={() => { triggerAudio?.('click'); openCustomerAccount?.('orders'); }}
              className="group relative flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-white transition-all duration-300 cursor-pointer focus:outline-none border border-transparent hover:border-[#E6DFD3] bg-transparent"
              title="My Account & Order Tracking"
            >
              <div className="text-[#0D2B4E] group-hover:text-[#6B4B2E] relative transition-transform duration-300 group-hover:scale-110 active:scale-95">
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => { triggerAudio('click'); setWishlistOpen(true); }}
              className="group relative flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-white transition-all duration-300 cursor-pointer focus:outline-none border border-transparent hover:border-[#E6DFD3] bg-transparent"
            >
              <div className="text-[#0D2B4E] group-hover:text-[#6B4B2E] relative transition-transform duration-300 group-hover:scale-110 active:scale-95">
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistItems.length > 0 && (
                  <span className="absolute top-[-4px] right-[-4px] bg-[#0D2B4E] text-[#F8F5EC] text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
            </button>

            {/* Cart */}
            <button
              onClick={() => { triggerAudio('click'); setCartOpen(true); }}
              className="group relative flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-white transition-all duration-300 cursor-pointer focus:outline-none border border-transparent hover:border-[#E6DFD3] bg-transparent"
            >
              <div className="text-[#0D2B4E] group-hover:text-[#6B4B2E] relative transition-transform duration-300 group-hover:scale-110 active:scale-95">
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute top-[-4px] right-[-4px] bg-[#6B4B2E] text-white text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </button>

          </div>
        </div>

        {/* Bottom Row: NAVIGATION LINKS */}
        <div className="w-full flex justify-center mt-3 mb-1 px-2 xl:px-4">
          <div className="w-full max-w-[1400px] bg-white border border-solid border-[#E6DFD3] rounded-[20px] shadow-[0_4px_20px_rgba(13,43,78,0.04)] px-4 lg:px-5 xl:px-8 py-3.5 flex justify-center items-center">
            <div className="flex items-center justify-between w-full text-[10.5px] lg:text-[11px] xl:text-[11.5px] font-sans tracking-[0.05em] lg:tracking-[0.06em] xl:tracking-[0.08em] uppercase font-bold text-[#202329] whitespace-nowrap gap-1.5 lg:gap-3 xl:gap-4 select-none">
              
              {/* Fine Silver Category */}
              <button
                onClick={() => { triggerAudio('click'); changeCategoryTab('Silver'); navigateTo('collections'); }}
                className="relative hover:text-[#0D2B4E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1.5 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent font-medium"
              >
                <span>Fine Silver</span>
                <span className="px-1.5 py-0.5 text-[8px] tracking-normal font-sans font-extrabold text-white bg-[#6B4B2E] rounded-full uppercase scale-95 shadow-xs shrink-0">
                  925
                </span>
              </button>

              {/* standard categories */}
              <button
                onClick={() => { triggerAudio('click'); changeCategoryTab('Bracelets'); navigateTo('collections'); }}
                className="hover:text-[#0D2B4E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent font-medium"
              >
                Watch Jewellery
              </button>

              <button
                onClick={() => { triggerAudio('click'); changeCategoryTab('Rings'); navigateTo('collections'); }}
                className="hover:text-[#0D2B4E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent font-medium"
              >
                Rings
              </button>

              <button
                onClick={() => { triggerAudio('click'); changeCategoryTab('Earrings'); navigateTo('collections'); }}
                className="hover:text-[#0D2B4E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent font-medium"
              >
                Earrings
              </button>

              <button
                onClick={() => { triggerAudio('click'); changeCategoryTab('Necklace'); navigateTo('collections'); }}
                className="hover:text-[#0D2B4E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent font-medium"
              >
                Necklaces
              </button>

              <button
                onClick={() => { triggerAudio('click'); changeCategoryTab('Necklace'); navigateTo('collections'); }}
                className="hover:text-[#0D2B4E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent font-medium"
              >
                Pendants
              </button>

              <button
                onClick={() => { triggerAudio('click'); changeCategoryTab('Rings'); navigateTo('collections'); }}
                className="hover:text-[#0D2B4E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent font-medium"
              >
                Solitaires
              </button>

              <button
                onClick={() => { triggerAudio('click'); changeCategoryTab('Collections'); navigateTo('collections'); }}
                className="hover:text-[#0D2B4E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent font-medium"
              >
                All Jewellery
              </button>

              {/* Gifts Dropdown */}
              <div className="relative group h-full flex items-center shrink-0">
                <button
                  onClick={() => { triggerAudio('click'); changeCategoryTab('Gifts & Pooja'); navigateTo('collections'); }}
                  className="hover:text-[#0D2B4E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent font-medium"
                >
                  <span className="whitespace-nowrap">Gifts</span>
                  <svg className="w-3 h-3 text-gray-400 group-hover:rotate-180 transition-transform duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white text-gray-800 shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-solid border-[#ECECEC] rounded-2xl py-6 px-7 min-w-[420px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex gap-8 text-[12px] normal-case font-sans select-none text-left font-semibold whitespace-normal">
                  <div className="flex flex-col space-y-1 flex-1">
                    <h4 className="font-bold text-[13px] text-[#1A1A1A] border-b border-solid border-gray-100 pb-2 mb-1">Gifts For Special Someone</h4>
                    {[
                      { label: 'For HER', price: '2,861', gender: 'women' },
                      { label: 'For HIM', price: '5,820', gender: 'men' },
                      { label: 'For SISTER', price: '5,746', gender: 'women' },
                      { label: 'For BROTHER', price: '5,820', gender: 'men' },
                      { label: 'For MOTHER', price: '5,805', gender: 'women' },
                      { label: 'For FATHER', price: '5,820', gender: 'men' },
                      { label: 'For FRIENDS', price: '4,221', gender: 'all' }
                    ].map((g) => (
                      <button
                        key={g.label}
                        onClick={() => {
                          triggerAudio('click');
                          if (typeof setGenderFilter === 'function') setGenderFilter(g.gender || 'all');
                          if (typeof setMetalFilter === 'function') setMetalFilter('all');
                          changeCategoryTab('Collections', 'all', g.gender || 'all');
                          navigateTo('collections');
                        }}
                        className="text-left hover:text-[#C8A646] hover:translate-x-1 transition-all py-1 cursor-pointer focus:outline-none border-none bg-transparent"
                      >
                        <span className="font-bold text-[12px] text-gray-800 block">{g.label}</span>
                        <span className="text-[10px] text-gray-400">Starting at Rs. {g.price}/-</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col items-center justify-center bg-[#FAF9F7] rounded-2xl p-4 min-w-[160px]">
                    <div className="bg-gradient-to-br from-[#D58B8B] to-[#C8A646] rounded-xl p-4 text-center text-white w-full shadow-sm flex flex-col items-center">
                      <p className="text-[9px] uppercase tracking-wider font-semibold opacity-90">MANISH &amp; CO</p>
                      <p className="text-[10px] font-bold mt-0.5">Gift Cards</p>
                      <Gift className="w-6 h-6 mt-1.5 text-white/95" />
                    </div>
                    <p className="text-[10px] text-gray-500 text-center mt-2 leading-snug font-medium">Available in denominations<br />starting from <strong className="text-[#1A1A1A]">₹500</strong> to <strong className="text-[#1A1A1A]">₹50,000</strong></p>
                  </div>
                </div>
              </div>

              {/* Gold Coins Dropdown */}
              <div className="relative group h-full flex items-center shrink-0">
                <button
                  onClick={() => {
                    triggerAudio('click');
                    navigateTo('gold-coins');
                    setCoinPurityTab('24K');
                    setCoinWeightFilter('all');
                  }}
                  className="hover:text-[#C8A646] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent"
                >
                  <span className="whitespace-nowrap">Gold Coins</span>
                  <svg className="w-3 h-3 text-gray-450 group-hover:rotate-180 transition-transform duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white text-gray-800 shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-solid border-[#ECECEC] rounded-2xl py-6 px-7 min-w-[480px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 grid grid-cols-3 gap-x-6 gap-y-4 text-[12px] normal-case font-sans select-none text-left font-semibold whitespace-normal">
                  {/* 24K Gold */}
                  <div className="flex flex-col space-y-2.5">
                    <button
                      onClick={() => {
                        triggerAudio('click');
                        navigateTo('gold-coins');
                        setCoinPurityTab('24K');
                        setCoinWeightFilter('all');
                      }}
                      className="font-bold text-[13px] text-gray-900 border-b border-solid border-gray-100 pb-1.5 text-left hover:text-[#C8A646] focus:outline-none border-none bg-transparent"
                    >
                      24 Kt (999.9)
                    </button>
                    <div className="flex flex-col space-y-1.5 text-[11.5px] text-gray-600 font-medium">
                      {['0.5', '1', '2', '5', '8', '10', '20', '50', '100'].map((w) => (
                        <button
                          key={`dropdown-24k-${w}`}
                          onClick={() => {
                            triggerAudio('click');
                            navigateTo('gold-coins');
                            setCoinPurityTab('24K');
                            setCoinWeightFilter(w);
                          }}
                          className="text-left hover:text-[#C8A646] hover:translate-x-1 transition-all py-0.5 cursor-pointer focus:outline-none border-none bg-transparent"
                        >
                          {w}g Gold
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 22K Gold */}
                  <div className="flex flex-col space-y-2.5">
                    <button
                      onClick={() => {
                        triggerAudio('click');
                        navigateTo('gold-coins');
                        setCoinPurityTab('22K');
                        setCoinWeightFilter('all');
                      }}
                      className="font-bold text-[13px] text-gray-900 border-b border-solid border-gray-100 pb-1.5 text-left hover:text-[#C8A646] focus:outline-none border-none bg-transparent"
                    >
                      22 Kt (916)
                    </button>
                    <div className="flex flex-col space-y-1.5 text-[11.5px] text-gray-600 font-medium">
                      {['1', '2', '5', '8', '10', '20', '50'].map((w) => (
                        <button
                          key={`dropdown-22k-${w}`}
                          onClick={() => {
                            triggerAudio('click');
                            navigateTo('gold-coins');
                            setCoinPurityTab('22K');
                            setCoinWeightFilter(w);
                          }}
                          className="text-left hover:text-[#C8A646] hover:translate-x-1 transition-all py-0.5 cursor-pointer focus:outline-none border-none bg-transparent"
                        >
                          {w}g Gold
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 999 Pure Silver */}
                  <div className="flex flex-col space-y-2.5">
                    <button
                      onClick={() => {
                        triggerAudio('click');
                        navigateTo('gold-coins');
                        setCoinPurityTab('999 Silver');
                        setCoinWeightFilter('all');
                      }}
                      className="font-bold text-[13px] text-gray-900 border-b border-solid border-gray-100 pb-1.5 text-left hover:text-[#C8A646] focus:outline-none border-none bg-transparent"
                    >
                      999 Silver
                    </button>
                    <div className="flex flex-col space-y-1.5 text-[11.5px] text-gray-600 font-medium">
                      {[
                        { key: '10', label: '10g Silver' },
                        { key: '20', label: '20g Silver' },
                        { key: '50', label: '50g Silver' },
                        { key: '100', label: '100g (100grm)' },
                        { key: '200', label: '200g (200grm)' },
                        { key: '500', label: '500g (500grm)' },
                        { key: '1000', label: '1000g (1KG)' }
                      ].map((item) => (
                        <button
                          key={`dropdown-silver-${item.key}`}
                          onClick={() => {
                            triggerAudio('click');
                            navigateTo('gold-coins');
                            setCoinPurityTab('999 Silver');
                            setCoinWeightFilter(item.key);
                          }}
                          className="text-left hover:text-[#C8A646] hover:translate-x-1 transition-all py-0.5 cursor-pointer focus:outline-none border-none bg-transparent"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Offers */}
              <div className="relative group h-full flex items-center shrink-0">
                <button
                  onClick={() => { triggerAudio('click'); navigateTo('offers'); }}
                  className="hover:text-[#6B4B2E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 focus:outline-none text-[#6B4B2E] whitespace-nowrap shrink-0 border-none bg-transparent font-medium"
                >
                  <span className="whitespace-nowrap">Offers</span>
                  <svg className="w-3 h-3 text-[#6B4B2E] group-hover:rotate-180 transition-transform duration-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className="absolute top-full right-0 mt-3 bg-white text-gray-800 shadow-[0_12px_30px_rgba(13,43,78,0.1)] border border-solid border-[#E6DFD3] rounded-2xl p-2 w-[340px] max-w-[90vw] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-[12px] normal-case font-sans select-none font-semibold flex flex-col gap-1 whitespace-normal text-left">
                  <button
                    onClick={() => {
                      triggerAudio('click');
                      if (typeof setMetalFilter === 'function') setMetalFilter('all');
                      if (typeof setGenderFilter === 'function') setGenderFilter('all');
                      if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(100000000);
                      changeCategoryTab('Diamond', 'all', 'all');
                      navigateTo('collections');
                    }}
                    className="w-full text-left px-4 py-2.5 text-[12px] font-semibold text-gray-800 hover:bg-[#F8F5EC] hover:text-[#0D2B4E] transition-colors rounded-xl cursor-pointer leading-snug focus:outline-none border-none bg-transparent whitespace-normal block"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Gem className="w-3.5 h-3.5 text-[#6B4B2E] shrink-0" />
                      <span>Up To 50% Off On Making Charges On Solitaires</span>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      triggerAudio('click');
                      if (typeof setMetalFilter === 'function') setMetalFilter('silver');
                      if (typeof setGenderFilter === 'function') setGenderFilter('all');
                      if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(100000000);
                      changeCategoryTab('Silver', 'silver', 'all');
                      navigateTo('collections');
                    }}
                    className="w-full text-left px-4 py-2.5 text-[12px] font-semibold text-gray-800 hover:bg-[#F8F5EC] hover:text-[#0D2B4E] transition-colors rounded-xl cursor-pointer leading-snug focus:outline-none border-none bg-transparent whitespace-normal block"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-[#6B4B2E] shrink-0" />
                      <span>Special In-Store Privileges On 925 Sterling Silver</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* About Us */}
              <button
                onClick={() => { triggerAudio('click'); navigateTo('about-us'); }}
                className="hover:text-[#0D2B4E] transition-colors duration-300 cursor-pointer h-full flex items-center gap-1 whitespace-nowrap shrink-0 focus:outline-none border-none bg-transparent font-medium"
              >
                <span className="whitespace-nowrap">About Us</span>
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* MOBILE HEADER (Single-Row with dropdown drawer) */}
      <div className="lg:hidden flex flex-col w-full bg-[#F8F5EC] border-b border-solid border-[#E6DFD3] px-4 py-3 gap-3">
        <div className="flex items-center justify-between w-full">
          
          {/* Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-2.5 focus:outline-none cursor-pointer text-left border-none bg-transparent"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E6DFD3] shadow-xs shrink-0 bg-[#F8F5EC]">
              <img
                src={hrLogoMark}
                alt="MANISH &amp; CO Logo"
                className="w-full h-full object-cover select-none"
              />
            </div>
            <div className="flex flex-col justify-center text-left">
              <span 
                className="serif-luxury text-[14px] font-bold tracking-[1.5px] text-[#0D2B4E]"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                MANISH &amp; CO
              </span>
              <span 
                className="serif-luxury text-[9px] font-bold tracking-[2.5px] text-[#6B4B2E] -mt-0.5"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                FINE SILVER
              </span>
            </div>
          </button>

          {/* Mobile Action Controls */}
          <div className="flex items-center space-x-2 text-[#0D2B4E]">
            
            {/* Customer Account Mobile */}
            <button
              onClick={() => { triggerAudio?.('click'); openCustomerAccount?.('orders'); }}
              className="p-1.5 hover:bg-white rounded-full relative focus:outline-none border-none bg-transparent"
              title="My Account & Orders"
            >
              <svg className="w-5.5 h-5.5 text-[#0D2B4E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>

            {/* Wishlist Mobile */}
            <button
              onClick={() => { triggerAudio('click'); setWishlistOpen(true); }}
              className="p-1.5 hover:bg-white rounded-full relative focus:outline-none border-none bg-transparent"
            >
              <svg className="w-5 h-5 text-[#0D2B4E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Cart Mobile */}
            <button
              onClick={() => { triggerAudio('click'); setCartOpen(true); }}
              className="p-1.5 hover:bg-white rounded-full relative focus:outline-none border-none bg-transparent"
            >
              <svg className="w-5.5 h-5.5 text-[#0D2B4E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#6B4B2E] text-white text-[7px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Drawer Menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 hover:bg-slate-50 rounded-full focus:outline-none border-none bg-transparent"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="relative w-full">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search designs..."
              className="w-full h-10 pl-10 pr-4 bg-[#FAF9F7] border border-solid border-[#ECECEC] focus:border-[#C8A646] focus:outline-none rounded-full text-[#1A1A1A] placeholder-gray-400 text-[12px] font-medium transition-all"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-450 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Mobile Autocomplete Suggest */}
          {searchFocused && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white text-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-solid border-[#ECECEC] rounded-xl py-2 px-3 z-[999] max-h-[220px] overflow-y-auto">
              {searchSuggestions.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => {
                    triggerAudio('click');
                    setSearchFocused(false);
                    navigateToPDP(prod);
                  }}
                  className="w-full flex items-center gap-3 p-1.5 hover:bg-[#FAF9F7] rounded-lg transition-colors text-left border-none bg-transparent"
                >
                  <img src={getOptimizedImageUrl(prod.img, { width: 100 })} alt={prod.name} className="w-8 h-8 object-contain rounded-md border border-solid border-[#ECECEC] bg-[#FAF9F7]" />
                  <div>
                    <div className="text-[11px] font-bold text-[#1A1A1A] line-clamp-1">{prod.name}</div>
                    <div className="text-[9px] text-[#C8A646] font-bold font-sans">₹{formatPrice(calculatePrice(prod).total)}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Full-Screen Menu Overlay — portal to escape nav's backdrop-filter stacking context */}
        {mobileMenuOpen && ReactDOM.createPortal(
          <div
            className="fixed inset-0 w-screen h-screen bg-[#F8F5EC] z-[99999] flex flex-col overflow-y-auto"
            style={{ animation: 'slideDownFadeIn 0.25s ease-out forwards', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-solid border-[#E6DFD3] shrink-0 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E6DFD3] shadow-xs shrink-0 bg-[#F8F5EC]">
                  <img src={hrLogoMark} alt="MANISH & CO Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center text-left">
                  <span 
                    className="serif-luxury text-[14px] font-bold tracking-[1.5px] text-[#0D2B4E]"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    MANISH &amp; CO
                  </span>
                  <span 
                    className="serif-luxury text-[9px] font-bold tracking-[2.5px] text-[#6B4B2E] -mt-0.5"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    FINE SILVER JEWELLERY
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F8F5EC] border border-[#E6DFD3] cursor-pointer"
              >
                <svg className="w-5 h-5 text-[#0D2B4E]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col px-5 py-4 space-y-1 flex-1">
              {/* Customer Account & Order Tracking Card */}
              <div className="bg-gradient-to-br from-[#091B2B] to-[#0D2B4E] p-3.5 rounded-2xl text-[#F8F5EC] mb-2.5 shadow-sm border border-solid border-[#6B4B2E]/40">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#6B4B2E] flex items-center justify-center text-xs text-white">👤</span>
                    <span className="text-[12px] font-bold tracking-wider uppercase text-[#B09A82]">Customer Account</span>
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); openCustomerAccount?.('profile'); }}
                    className="text-[10px] text-[#B2BAC1] hover:text-[#F8F5EC] bg-transparent border-none cursor-pointer underline font-medium"
                  >
                    Profile
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2.5">
                  <button
                    onClick={() => { setMobileMenuOpen(false); openCustomerAccount?.('orders'); }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-[#F8F5EC] text-[11px] font-bold border border-white/10 transition-all cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-[#B09A82]" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); openCustomerAccount?.('track'); }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#6B4B2E]/30 hover:bg-[#6B4B2E]/40 active:scale-95 text-[#F8F5EC] text-[11px] font-bold border border-[#6B4B2E]/40 transition-all cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#B09A82]" />
                    <span>Track Order</span>
                  </button>
                </div>
              </div>


              <div className="text-[9px] font-bold uppercase tracking-widest text-[#657989] px-2 pt-3 pb-2">Collections</div>

              {/* Gender & Gifting Quick Nav */}
              {[
                { 
                  label: 'For Men', 
                  gender: 'men', 
                  icon: <User className="w-4 h-4 text-[#6B4B2E]" /> 
                },
                { 
                  label: 'For Women', 
                  gender: 'women', 
                  icon: <Sparkles className="w-4 h-4 text-[#6B4B2E]" /> 
                },
                { 
                  label: 'For Kids', 
                  gender: 'kids', 
                  icon: <Baby className="w-4 h-4 text-[#6B4B2E]" /> 
                },
                { 
                  label: 'For Gifting', 
                  categoryTab: 'Gifts & Pooja', 
                  icon: <Gift className="w-4 h-4 text-[#6B4B2E]" /> 
                },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    triggerAudio('click');
                    setMobileMenuOpen(false);
                    if (item.categoryTab) {
                      setMetalFilter('all');
                      setGenderFilter('all');
                      changeCategoryTab(item.categoryTab, 'all', 'all');
                    } else {
                      setMetalFilter('all');
                      setGenderFilter(item.gender);
                      changeCategoryTab('Collections', 'all', item.gender);
                    }
                    navigateTo('collections');
                  }}
                  className="flex items-center w-full text-left px-4 py-3 rounded-xl active:bg-zinc-50 hover:bg-[#F8F5EC] border-none cursor-pointer transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#6B4B2E]/10 flex items-center justify-center mr-3 shrink-0">{item.icon}</span>
                  <span className="text-[14px] font-bold text-[#202329]">{item.label}</span>
                  <svg className="w-4 h-4 text-zinc-400 ml-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}

              {/* Collapsible Accordion: Our Collection [▼] */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    triggerAudio('click');
                    setMobileOurCollectionsOpen(!mobileOurCollectionsOpen);
                  }}
                  className="flex items-center justify-between w-full text-left px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#0D2B4E]/5 to-[#6B4B2E]/10 border border-solid border-[#E6DFD3] cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Gem className="w-4 h-4 text-[#6B4B2E]" />
                    <span className="text-[14px] font-black uppercase tracking-wider text-[#0D2B4E]">Our Collection</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-[#6B4B2E] transition-transform duration-300 ${mobileOurCollectionsOpen ? 'rotate-180' : 'rotate-0'}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Sub-Category items inside Our Collection */}
                {mobileOurCollectionsOpen && (
                  <div className="pl-3 pr-1 py-2 space-y-1 mt-1 bg-white/70 rounded-xl border border-solid border-[#E6DFD3]">
                    {[
                      { label: 'Rings', tab: 'Rings', icon: <CircleDot className="w-3.5 h-3.5 text-[#6B4B2E]" /> },
                      { label: 'Earrings', tab: 'Earrings', icon: <Sparkles className="w-3.5 h-3.5 text-[#6B4B2E]" /> },
                      { label: 'Necklaces', tab: 'Necklace', icon: <Crown className="w-3.5 h-3.5 text-[#6B4B2E]" /> },
                      { label: 'Pendants', tab: 'Pendants', icon: <Gem className="w-3.5 h-3.5 text-[#6B4B2E]" /> },
                      { label: 'Bangles', tab: 'Bangles', icon: <Circle className="w-3.5 h-3.5 text-[#6B4B2E]" /> },
                      { label: 'Bracelets', tab: 'Bracelets', icon: <Disc className="w-3.5 h-3.5 text-[#6B4B2E]" /> },
                      { label: 'Mangalsutras', tab: 'Mangalsutras', icon: <Heart className="w-3.5 h-3.5 text-[#6B4B2E]" /> },
                      { label: 'Anklets', tab: 'Anklets', icon: <Bell className="w-3.5 h-3.5 text-[#6B4B2E]" /> },
                      { label: 'Nose Pins', tab: 'Nose Pins', icon: <Star className="w-3.5 h-3.5 text-[#6B4B2E]" /> },
                      { label: 'Solitaires', tab: 'Solitaires', icon: <Gem className="w-3.5 h-3.5 text-[#6B4B2E]" /> },
                      { label: 'Silver Jewellery', tab: 'Silver', icon: <Award className="w-3.5 h-3.5 text-[#657989]" /> },
                    ].map(item => (
                      <button
                        key={item.label}
                        onClick={() => {
                          triggerAudio('click');
                          setMobileMenuOpen(false);
                          setGenderFilter('all');
                          if (item.tab === 'Silver') {
                            changeCategoryTab('Silver', 'silver');
                            if (typeof setMetalFilter === 'function') setMetalFilter('silver');
                          } else {
                            changeCategoryTab(item.tab, 'all');
                          }
                          navigateTo('collections');
                        }}
                        className="flex items-center w-full text-left px-3.5 py-2.5 rounded-lg active:bg-zinc-200 hover:bg-[#F8F5EC] border-none cursor-pointer transition-colors"
                      >
                        <span className="w-6 h-6 rounded-md bg-white border border-[#E6DFD3] flex items-center justify-center mr-2.5 shrink-0 shadow-2xs">{item.icon}</span>
                        <span className="text-[13px] font-medium text-[#202329]">{item.label}</span>
                        <svg className="w-3.5 h-3.5 text-zinc-400 ml-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-[9px] font-bold uppercase tracking-widest text-[#657989] px-2 pt-3 pb-2">More &amp; About</div>

              <button
                onClick={() => { triggerAudio('click'); setMobileMenuOpen(false); navigateTo('about-us'); }}
                className="flex items-center w-full text-left px-4 py-3.5 rounded-xl bg-white border border-solid border-[#E6DFD3] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0D2B4E] text-[#F8F5EC] flex items-center justify-center text-xs font-bold shadow-xs">✦</span>
                  <span className="text-[14px] font-bold text-[#0D2B4E]">About Us</span>
                </div>
                <span className="text-[9px] font-extrabold text-[#6B4B2E] uppercase tracking-wider ml-auto bg-[#F8F5EC] border border-[#E6DFD3] px-2 py-0.5 rounded-full shadow-xs">1996</span>
              </button>

              <button
                onClick={() => { triggerAudio('click'); setMobileMenuOpen(false); navigateTo('gold-coins'); setCoinPurityTab('24K'); setCoinWeightFilter('all'); }}
                className="flex items-center w-full text-left px-4 py-3.5 rounded-xl active:bg-zinc-50 border-none cursor-pointer transition-colors"
              >
                <span className="text-[14px] font-semibold text-[#202329]">Pure Silver &amp; Gold Coins</span>
                <svg className="w-4 h-4 text-zinc-400 ml-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => { triggerAudio('click'); setMobileMenuOpen(false); navigateTo('offers'); }}
                className="flex items-center w-full text-left px-4 py-3.5 rounded-xl active:bg-zinc-50 border-none cursor-pointer transition-colors"
              >
                <span className="text-[14px] font-semibold text-[#202329]">Offers &amp; Privileges</span>
                <svg className="w-4 h-4 text-zinc-400 ml-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>

            {/* WhatsApp CTA at bottom */}
            <div className="px-5 pb-8 pt-4 shrink-0">
              <a
                href="https://wa.me/919451638680?text=Hello%20MANISH%20%26%20CO,%20I%20am%20interested%20in%20your%20fine%20silver%20jewellery."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-[#0D2B4E] hover:bg-[#091B2B] text-[#F8F5EC] border border-[#6B4B2E] font-bold text-[14px] shadow-md transition-colors"
              >
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.037L2 22l5.135-1.348a9.954 9.954 0 004.878 1.28c5.505 0 9.988-4.478 9.989-9.984 0-2.67-1.037-5.18-2.925-7.07C17.186 3.037 14.678 2 12.012 2z" />
                </svg>
                Chat on WhatsApp with MANISH &amp; CO
              </a>
            </div>
          </div>
        , document.body)}

      </div>
    </nav>
  );
}
