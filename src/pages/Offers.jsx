import React from 'react';

// Asset Imports
import bannerGold20 from '../assets/banner_gold_20.webp';
import bannerDiamond50 from '../assets/Gemini_Generated_Image_11boa611boa611bo.png';
import bannerOldGold from '../assets/banner_old_gold.webp';
import luxuryShowroom from '../assets/luxury_showroom.png';

export default function Offers({
  navigateTo,
  changeCategoryTab,
  triggerAudio
}) {
  return (
    <div className="bg-[#F8F5EC] text-[#202329] min-h-screen pb-16">

      {/* TOP ANNOUNCEMENT BANNERS */}
      <div className="w-full bg-[#091B2B] border-b border-[#E6DFD3]/20 py-8 px-4">
        <div className="max-w-7xl mx-auto mb-6 text-center">
          <span className="text-[#B09A82] text-xs font-semibold tracking-[0.25em] uppercase block mb-1">
            Exclusive Privileges
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-white font-normal tracking-wide">
            Festive &amp; Seasonal Offers
          </h1>
          <div className="w-16 h-[1.5px] bg-[#6B4B2E] mx-auto mt-3" />
        </div>

        {/* Two Banners Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 select-none animate-slide-up text-center">
          {/* Banner 1: Pure Silver & Gold Making Charges Offer */}
          <div
            onClick={() => {
              triggerAudio?.('click');
              changeCategoryTab?.('Silver');
              navigateTo('collections');
            }}
            className="overflow-hidden rounded-2xl relative group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 text-center"
          >
            <img
              src={bannerGold20}
              alt="Special Making Charges Offer on Fine Jewellery"
              loading="lazy"
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          </div>

          {/* Banner 2: Diamond / Gemstone Offer */}
          <div
            onClick={() => {
              triggerAudio?.('click');
              changeCategoryTab?.('Diamond');
              navigateTo('collections');
            }}
            className="overflow-hidden rounded-2xl relative group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 text-center"
          >
            <img
              src={bannerDiamond50}
              alt="Up to 50% Off on Making Charges on Diamond & Gemstone Jewellery"
              loading="lazy"
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          </div>
        </div>
      </div>

      {/* EXCLUSIVE EXCHANGE & STORE SHOWROOM BANNERS */}
      <div className="w-full select-none animate-slide-up bg-[#F8F5EC] space-y-8 pt-8 text-center max-w-7xl mx-auto px-4">
        {/* Old Silver & Gold Exchange Banner */}
        <div
          onClick={() => {
            triggerAudio?.('click');
            navigateTo('valuation');
          }}
          className="w-full overflow-hidden rounded-2xl relative group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border border-[#E6DFD3] text-center"
        >
          <img
            src={bannerOldGold}
            alt="100% Exchange Value on Pure Silver & Gold"
            loading="lazy"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
        </div>

        {/* Manish & Co Flagship Boutique Locator Banner */}
        <div
          onClick={() => {
            triggerAudio?.('click');
            navigateTo('showrooms');
          }}
          className="w-full overflow-hidden rounded-2xl relative group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border border-[#E6DFD3] text-center"
        >
          <img
            src={luxuryShowroom}
            alt="MANISH & CO Flagship Boutique Experience"
            loading="lazy"
            className="w-full h-[320px] sm:h-[400px] object-cover block transition-transform duration-700 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091B2B]/90 via-[#091B2B]/40 to-transparent flex flex-col justify-end p-6 sm:p-12 text-left">
            <span className="text-[#B09A82] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
              Visit In Person
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal mb-3">
              Experience Manish &amp; Co at Our Mau Showroom
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-xl font-light mb-6">
              Step into our flagship lounge for private viewing sessions, customized bridal styling, and complimentary silver authentication.
            </p>
            <div>
              <span className="inline-flex items-center gap-2 bg-[#6B4B2E] hover:bg-[#8C6226] text-white text-xs uppercase tracking-[0.18em] px-6 py-3 rounded-full font-medium transition-all shadow-md">
                Locate Showroom
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* MANISH & CO PROMISE SECTION */}
        <div className="w-full bg-[#FAF8F5] py-16 lg:py-20 px-6 sm:px-12 rounded-3xl border border-[#E6DFD3] select-none text-center shadow-xs">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-16 text-center">

            {/* Left Column */}
            <div className="w-full lg:w-5/12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left shrink-0">
              <span className="text-[#6B4B2E] text-xs font-semibold tracking-[0.25em] uppercase block mb-1">
                Our Hallmark of Trust
              </span>
              <h3 className="font-serif text-[#0D2B4E] text-[28px] sm:text-[36px] lg:text-[40px] font-normal tracking-[0.01em] leading-tight m-0">
                MANISH &amp; CO
              </h3>
              <h2 className="font-serif text-[#091B2B] text-[48px] sm:text-[60px] lg:text-[70px] font-bold tracking-[0.02em] leading-none mt-1 sm:mt-2 mb-4">
                Promise
              </h2>
              <p className="text-[#555] text-sm leading-relaxed max-w-md">
                Every silver ornament, custom solitaire, and heirloom piece is crafted with generational integrity, certified authenticity, and unwavering devotion.
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-7/12 grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-6 justify-items-center text-center">
              {/* Circle 1 */}
              <div className="flex flex-col items-center max-w-[130px] text-center">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#0D2B4E] text-[#F8F5EC] flex flex-col justify-center items-center shadow-md transform transition-transform duration-300 hover:scale-105 border border-[#B09A82]/30">
                  <span className="text-[8px] tracking-widest uppercase opacity-80 font-semibold font-sans">SINCE</span>
                  <span className="text-lg sm:text-xl font-bold font-serif tracking-wider text-[#B09A82]">1988</span>
                </div>
                <p className="text-[11px] text-[#202329] font-medium tracking-wide text-center mt-3 leading-snug">
                  Generational Artisan Heritage
                </p>
              </div>

              {/* Circle 2 */}
              <div className="flex flex-col items-center max-w-[130px] text-center">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#0D2B4E] text-[#B09A82] flex flex-col justify-center items-center shadow-md transform transition-transform duration-300 hover:scale-105 border border-[#B09A82]/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[11px] text-[#202329] font-medium tracking-wide text-center mt-3 leading-snug">
                  100% BIS Hallmarked Silver
                </p>
              </div>

              {/* Circle 3 */}
              <div className="flex flex-col items-center max-w-[130px] text-center">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#0D2B4E] text-[#B09A82] flex flex-col justify-center items-center shadow-md transform transition-transform duration-300 hover:scale-105 border border-[#B09A82]/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[11px] text-[#202329] font-medium tracking-wide text-center mt-3 leading-snug">
                  Lifetime Exchange &amp; Buyback
                </p>
              </div>

              {/* Circle 4 */}
              <div className="flex flex-col items-center max-w-[130px] text-center">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#0D2B4E] text-[#B09A82] flex flex-col justify-center items-center shadow-md transform transition-transform duration-300 hover:scale-105 border border-[#B09A82]/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <p className="text-[11px] text-[#202329] font-medium tracking-wide text-center mt-3 leading-snug">
                  Guaranteed 925 Purity
                </p>
              </div>

              {/* Circle 5 */}
              <div className="flex flex-col items-center max-w-[130px] text-center">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#0D2B4E] text-[#B09A82] flex flex-col justify-center items-center shadow-md transform transition-transform duration-300 hover:scale-105 border border-[#B09A82]/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[11px] text-[#202329] font-medium tracking-wide text-center mt-3 leading-snug">
                  Transparent Weight &amp; Pricing
                </p>
              </div>

              {/* Circle 6 */}
              <div className="flex flex-col items-center max-w-[130px] text-center">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#0D2B4E] text-[#B09A82] flex flex-col justify-center items-center shadow-md transform transition-transform duration-300 hover:scale-105 border border-[#B09A82]/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <p className="text-[11px] text-[#202329] font-medium tracking-wide text-center mt-3 leading-snug">
                  Insured Pan-India Express Delivery
                </p>
              </div>

              {/* Circle 7 */}
              <div className="flex flex-col items-center max-w-[130px] text-center">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#0D2B4E] text-[#B09A82] flex flex-col justify-center items-center shadow-md transform transition-transform duration-300 hover:scale-105 border border-[#B09A82]/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[11px] text-[#202329] font-medium tracking-wide text-center mt-3 leading-snug">
                  Bespoke Handcrafted Designs
                </p>
              </div>

              {/* Circle 8 */}
              <div className="flex flex-col items-center max-w-[130px] text-center">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#0D2B4E] text-[#B09A82] flex flex-col justify-center items-center shadow-md transform transition-transform duration-300 hover:scale-105 border border-[#B09A82]/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <polygon points="23 7 16 12 23 17 23 7" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[11px] text-[#202329] font-medium tracking-wide text-center mt-3 leading-snug">
                  Personalised Video Consultations
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
