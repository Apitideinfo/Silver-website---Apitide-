import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * EditorialShowcaseSection
 * Compact, modern showcase matching client reference:
 * 1. Horizontal category slide (square photo + title underneath)
 * 2. "— CURATED FOR EVERY OCCASION —" divider
 * 3. Compact curated product row (photo + title + price)
 * Result: No excessive vertical scrolling!
 */
export default function EditorialShowcaseSection({
  id,
  number,
  title,
  subtitle,
  dark = false,
  categories = [],
  curatedItems = [],
  triggerAudio,
  navigateTo,
  changeCategoryTab,
  setGenderFilter,
  defaultGender = null,
}) {
  const catScrollRef = useRef(null);

  const scrollLeft = (ref) => {
    triggerAudio?.('click');
    if (ref.current) {
      ref.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    triggerAudio?.('click');
    if (ref.current) {
      ref.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat) => {
    triggerAudio?.('click');
    if (cat.action) {
      cat.action();
    } else {
      if (defaultGender && setGenderFilter) {
        setGenderFilter(defaultGender);
      }
      changeCategoryTab?.(cat.tab || 'Collections', 'all', defaultGender || 'all');
      navigateTo?.('collections');
    }
  };


  const isDark = dark;
  const sectionBg = isDark ? 'bg-[#050B14]' : 'bg-[#FAF7F2]';
  const sectionBorder = isDark ? 'border-white/10' : 'border-[#EAE3D9]';
  const textColor = isDark ? 'text-white' : 'text-[#1A1817]';
  const tagColor = isDark ? 'text-[#C5A880]' : 'text-[#8C6D46]';
  const subtextColor = isDark ? 'text-gray-400' : 'text-[#6F6862]';
  const dividerColor = isDark ? 'bg-white/20' : 'bg-[#D6CABE]';
  const cardBorder = isDark ? 'border-white/10' : 'border-[#E8DFD5]';
  const cardBg = isDark ? 'bg-white/5' : 'bg-white';

  return (
    <section id={id} className={`w-full py-10 sm:py-14 ${sectionBg} border-b ${sectionBorder} select-none text-left`}>
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* ========================================================
            EDITORIAL HEADER
            ======================================================== */}
        <div className="flex items-end justify-between gap-4 mb-6">
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
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                triggerAudio?.('click');
                if (defaultGender && setGenderFilter) setGenderFilter(defaultGender);
                changeCategoryTab?.('Collections', 'all', defaultGender || 'all');
                navigateTo?.('collections');
              }}
              className={`${tagColor} hover:text-[#1A1817] font-sans text-xs font-bold tracking-[0.18em] uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer group`}
            >
              <span>VIEW ALL</span>
              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5">
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

        {/* ========================================================
            ROW 1: CATEGORY SLIDE (Square image + title below)
            Matches client reference image exact structure
            ======================================================== */}
        <div 
          ref={catScrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1"
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-center group cursor-pointer shrink-0 w-[124px] sm:w-[140px] md:w-[155px]"
            >
              {/* Square Image Box */}
              <div className={`w-full aspect-square overflow-hidden bg-white rounded-none border ${cardBorder} group-hover:border-[#8C6D46] shadow-[0_2px_10px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_20px_rgba(140,109,70,0.18)] transition-all duration-300 relative`}>
                <img
                  src={cat.img}
                  alt={cat.label}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
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
