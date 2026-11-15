import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategoryFallbackImage } from '../utils/categoryAssets';

/**
 * EditorialShowcaseSection
 * Compact, modern showcase matching client reference:
 * - Horizontal category slide (square photo + title underneath)
 * Result: No excessive vertical scrolling!
 */
export default function EditorialShowcaseSection({
  id,
  number,
  title,
  subtitle,
  dark = false,
  categories = [],
  triggerAudio,
  navigateTo,
  changeCategoryTab,
  setGenderFilter,
  defaultGender = null,
  tabs = null,
  activeTab = null,
  onTabChange = null,
}) {
  const catScrollRef = useRef(null);

  const scrollLeft = (ref) => {
    triggerAudio?.('click');
    if (ref.current) {
      ref.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    triggerAudio?.('click');
    if (ref.current) {
      ref.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat) => {
    triggerAudio?.('click');
    if (cat.action) {
      cat.action();
    } else {
      if (defaultGender && typeof setGenderFilter === 'function') {
        setGenderFilter(defaultGender);
      }
      changeCategoryTab?.(cat.tab || 'Collections', 'all', defaultGender || 'all');
      navigateTo?.('collections');
    }
  };

  const isDark = dark;
  const sectionBg = isDark ? 'bg-[#091B2B]' : 'bg-white';
  const sectionBorder = isDark ? 'border-white/10' : 'border-[#E8DFD5]';
  const textColor = isDark ? 'text-white' : 'text-[#0D2B4E]';
  const tagColor = isDark ? 'text-[#B09A82]' : 'text-[#6B4B2E]';
  const subtextColor = isDark ? 'text-gray-400' : 'text-[#6F6862]';
  const dividerColor = isDark ? 'bg-white/20' : 'bg-[#6B4B2E]/30';
  const cardBorder = isDark ? 'border-white/10' : 'border-[#E8DFD5]';
  const cardBg = isDark ? 'bg-white/5' : 'bg-white';

  return (
    <section id={id} className={`w-full py-10 sm:py-14 ${sectionBg} border-b ${sectionBorder} select-none text-left`}>
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* ========================================================
            EDITORIAL HEADER
            ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="text-left flex-1 min-w-0">
            <span className={`inline-block ${tagColor} text-[11px] sm:text-xs font-sans font-bold tracking-[0.28em] uppercase mb-1`}>
              {number}
            </span>
            <div className="flex items-center gap-4">
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${textColor} leading-tight shrink-0`}
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                {title}
              </h2>
              <div className={`hidden sm:block h-[1px] ${dividerColor} flex-1 max-w-[200px]`} />
            </div>
            {subtitle && (
              <p className={`${subtextColor} text-xs sm:text-sm font-sans mt-1 max-w-xl font-normal`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* View All & Arrow navigation */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <button
              onClick={() => {
                triggerAudio?.('click');
                if (defaultGender && typeof setGenderFilter === 'function') setGenderFilter(defaultGender);
                changeCategoryTab?.('Collections', 'all', defaultGender || 'all');
                navigateTo?.('collections');
              }}
              className={`${tagColor} hover:text-[#1A1817] font-sans text-xs font-bold tracking-[0.18em] uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer group`}
            >
              <span>VIEW ALL</span>
              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollLeft(catScrollRef)}
                aria-label="Previous categories"
                className={`w-7 h-7 rounded-full border ${cardBorder} ${cardBg} flex items-center justify-center text-gray-600 hover:text-[#8C6D46] hover:border-[#8C6D46] transition-colors cursor-pointer`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRight(catScrollRef)}
                aria-label="Next categories"
                className={`w-7 h-7 rounded-full border ${cardBorder} ${cardBg} flex items-center justify-center text-gray-600 hover:text-[#8C6D46] hover:border-[#8C6D46] transition-colors cursor-pointer`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Optional Tabs for Multi-collection Switcher (Kids, Couples, Gifts) */}
        {Array.isArray(tabs) && tabs.length > 0 && (
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-4">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    triggerAudio?.('click');
                    onTabChange?.(tab.id);
                  }}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? 'bg-[#0D2B4E] text-white border-[#0D2B4E] shadow-sm'
                      : 'bg-white text-[#6F6862] border-[#E8DFD5] hover:border-[#8C6D46] hover:text-[#0D2B4E]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================
            ROW: CATEGORY SLIDE (Square image + title below)
            2-3 items visible on mobile, smoothly sliding horizontally
            ======================================================== */}
        <div 
          ref={catScrollRef}
          className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 snap-x snap-mandatory touch-pan-x"
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-center group cursor-pointer shrink-0 w-[110px] xs:w-[124px] sm:w-[140px] md:w-[155px] snap-start"
            >
              {/* Square Image Box */}
              <div className={`w-full aspect-square overflow-hidden bg-white rounded-none border ${cardBorder} group-hover:border-[#8C6D46] shadow-[0_2px_10px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_20px_rgba(140,109,70,0.18)] transition-all duration-300 relative`}>
                <img
                  src={cat.img || getCategoryFallbackImage(cat.label)}
                  alt={cat.label}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getCategoryFallbackImage(cat.label);
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
              </div>

              {/* Title below card */}
              <span 
                className={`mt-2.5 font-sans text-[10.5px] sm:text-xs font-semibold tracking-[0.12em] uppercase text-center w-full px-1 leading-snug break-words ${textColor} group-hover:text-[#8C6D46] transition-colors`}
              >
                {cat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
