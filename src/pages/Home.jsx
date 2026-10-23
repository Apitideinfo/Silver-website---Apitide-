import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { useRates } from '../hooks/useRates';
import Modal from '../components/Modal';
import BookingForm from '../forms/BookingForm';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

// Category Image Fallbacks
import solitariesImg from '../assets/solitaries.png';
import watchJewelleryImg from '../assets/watch_jewellery.png';
import mensJewelleryImg from '../assets/mens_jewellery.png';
import mangalsutrasImg from '../assets/mangalsutras.png';
import nosePinsImg from '../assets/nose_pins.png';
import kidsJewelleryImg from '../assets/kids_jewellery.png';
import goldCoinsImg from '../assets/gold_coins.png';
import ankletsImg from '../assets/anklets.png';
import pendantsImg from '../assets/pendants.png';
import ringsImg from '../assets/rings.png';
import necklacesImg from '../assets/necklaces.png';
import sapphireHeritageSet from '../assets/sapphire_heritage_set.png';
import goldKada from '../assets/gold_kada.png';
import diamondBracelet from '../assets/diamond_bracelet.png';
import goldChainsImg from '../assets/gold_chains.png';
import kadaImg from '../assets/kada.png';

// Section Video / Image Assets
import campaignDaintyDreams from '../assets/campaign_dainty_dreams.webp';
import campaignRawReverie from '../assets/campaign_raw_reverie.webp';
import campaignClayWhispers from '../assets/campaign_clay_whispers.webp';
import giftingLayeredNecklaces from '../assets/gifting_layered_necklaces.png';
import giftingCovetedStyles from '../assets/gifting_coveted_styles.png';
import giftingHrMan from '../assets/gifting_hr_man.png';

// Testimonial Images
import testimonial1 from '../assets/testimonial_1.png';
import testimonial2 from '../assets/testimonial_2.png';
import testimonial3 from '../assets/testimonial_3.png';
import testimonial4 from '../assets/testimonial_4.png';

// Banners
import bannerTimelessSilver from '../assets/banner_timeless_elegance.png';
import bannerElegantGold from '../assets/banner_elegant_gold.png';
import bannerGoldSilver50 from '../assets/banner_pure_gold_silver_50.png';
import bannerGold20 from '../assets/banner_gold_20.webp';

// Process Icons
import productSketch from '../assets/product_sketch.png';
import processCasting from '../assets/process_casting.png';
import processSetting from '../assets/process_setting.png';
import processPolishing from '../assets/process_polishing.png';
import processQuality from '../assets/process_quality.png';
import processPackaging from '../assets/process_packaging.png';

const processStepsData = [
  {
    num: "01",
    title: "Design Consultation",
    desc: "Our design experts translate your vision into initial concepts, sketches, and detailed engineering requirements.",
    img: productSketch,
    fallback: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop"
  },
  {
    num: "02",
    title: "Modeling & Casting",
    desc: "We bring designs to life with precise 3D CAD modeling and cast the raw form in precious 22K/18K gold bullion.",
    img: processCasting,
    fallback: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200&auto=format&fit=crop"
  },
  {
    num: "03",
    title: "Stone Setting",
    desc: "Master setters delicately select and embed each certified diamond, polki, or gemstone with flawless precision.",
    img: processSetting,
    fallback: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop"
  },
  {
    num: "04",
    title: "Filing & Polishing",
    desc: "Raw cast parts are meticulously hand-filed and polished to bring out the metal's high-shine royal luster.",
    img: processPolishing,
    fallback: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop"
  },
  {
    num: "05",
    title: "Quality Inspection",
    desc: "Every ornament undergoes rigorous laser testing and micro-inspections to guarantee absolute structural integrity.",
    img: processQuality,
    fallback: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop"
  },
  {
    num: "06",
    title: "Final Delivery",
    desc: "Packaged in premium, signature velvet jewellery caskets, ready for safe transit or physical showroom pick-up.",
    img: processPackaging,
    fallback: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop"
  }
];

const promoBanners = [
  {
    id: 1,
    img: bannerTimelessSilver,
    alt: "Timeless Elegance in Pure Silver",
    link: "collections",
    tab: "Silver",
    metal: "silver"
  },
  {
    id: 2,
    img: bannerElegantGold,
    alt: "Elegant Gold Jewelry Sale Banner",
    link: "collections",
    tab: "Collections",
    metal: "gold"
  },
  {
    id: 3,
    img: bannerGoldSilver50,
    alt: "Pure Gold & Silver: Up to 50% Off",
    link: "collections",
    tab: "Collections",
    metal: "all"
  }
];

const getCategoryFallbackImage = (catNameOrId) => {
  const norm = String(catNameOrId || '').toLowerCase().replace(/\s+/g, '');
  if (norm.includes('solitaire')) return solitariesImg;
  if (norm.includes('watch')) return watchJewelleryImg;
  if (norm.includes('men')) return mensJewelleryImg;
  if (norm.includes('mangalsutra')) return mangalsutrasImg;
  if (norm.includes('nose')) return nosePinsImg;
  if (norm.includes('kids')) return kidsJewelleryImg;
  if (norm.includes('coin')) return goldCoinsImg;
  if (norm.includes('anklet')) return ankletsImg;
  if (norm.includes('pendant')) return pendantsImg;
  if (norm.includes('earring')) return sapphireHeritageSet;
  if (norm.includes('ring')) return ringsImg;
  if (norm.includes('necklace')) return necklacesImg;
  if (norm.includes('bangle')) return goldKada;
  if (norm.includes('bracelet')) return diamondBracelet;
  if (norm.includes('chain')) return goldChainsImg;
  if (norm.includes('kada')) return kadaImg;
  return ringsImg;
};

export default function Home({
  navigateTo,
  navigateToPDP,
  changeCategoryTab,
  triggerAudio: triggerAudioProp,
  setMaxPriceFilter,
  setGenderFilter,
  setMetalFilter,
}) {
  // Self-contained data from context
  const { products = [], categories = [], loading } = useProducts();
  const { goldRate24k = 78500, silverRate1g: silverRate = 92 } = useRates();

  const categoriesLoaded = !loading;
  const isCatalogDark = false;
  const triggerAudio = (type) => { try { triggerAudioProp?.(type); } catch { /* noop */ } };

  // Local modal state
  const [consultationModal, setConsultationModal] = useState(false);
  const [customDesignOpen, setCustomDesignOpen] = useState(false);

  // Autoplay Slider States
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [promoIsPaused, setPromoIsPaused] = useState(false);
  const [promoTouchStart, setPromoTouchStart] = useState(null);
  const [promoTouchEnd, setPromoTouchEnd] = useState(null);
  const promoAutoplayRef = useRef(null);

  // Recommendations Carousel Scrolling Refs & Autoplay
  const categoriesScrollRef = useRef(null);
  const categoriesAutoplayRef = useRef(null);

  // Polaroid Testimonials Refs & Progress State
  const testimonialsRef = useRef(null);
  const [testimonialsInView, setTestimonialsInView] = useState(false);
  const polaroidScrollRef = useRef(null);
  const [polaroidScrollProgress, setPolaroidScrollProgress] = useState(0);

  // Story & Process States
  const [activeStoryTimeline, setActiveStoryTimeline] = useState(1952);
  const [timelineDirection, setTimelineDirection] = useState(1);
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [processPaused, setProcessPaused] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Active categories setup — purely dynamic from database
  const activeCategories = (categoriesLoaded && Array.isArray(categories)) ? categories : [];

  // Promo Banner Autoplay
  useEffect(() => {
    if (promoAutoplayRef.current) clearInterval(promoAutoplayRef.current);
    if (!promoIsPaused) {
      promoAutoplayRef.current = setInterval(() => {
        setCurrentPromoSlide((prev) => (prev + 1) % promoBanners.length);
      }, 5000);
    }
    return () => {
      if (promoAutoplayRef.current) clearInterval(promoAutoplayRef.current);
    };
  }, [promoIsPaused]);

  // Recommendations Autoplay
  const startCategoriesAutoplay = () => {
    if (categoriesAutoplayRef.current) clearInterval(categoriesAutoplayRef.current);
    categoriesAutoplayRef.current = setInterval(() => {
      if (categoriesScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoriesScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          categoriesScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const scrollStep = clientWidth > 768 ? 240 : 160;
          categoriesScrollRef.current.scrollTo({ left: scrollLeft + scrollStep, behavior: 'smooth' });
        }
      }
    }, 5000);
  };

  const scrollCategories = (direction) => {
    if (categoriesScrollRef.current) {
      const { scrollLeft, clientWidth } = categoriesScrollRef.current;
      const scrollAmount = clientWidth * 0.7;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      categoriesScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      startCategoriesAutoplay();
    }
  };

  useEffect(() => {
    startCategoriesAutoplay();
    return () => {
      if (categoriesAutoplayRef.current) clearInterval(categoriesAutoplayRef.current);
    };
  }, []);

  // Process Autoplay
  useEffect(() => {
    if (processPaused) return;
    const interval = setInterval(() => {
      setActiveProcessStep((prev) => (prev + 1) % 6);
    }, 4500);
    return () => clearInterval(interval);
  }, [processPaused]);

  // Touch handlers for Promo carousel
  const handlePromoTouchStart = (e) => {
    setPromoTouchStart(e.targetTouches[0].clientX);
  };

  const handlePromoTouchMove = (e) => {
    setPromoTouchEnd(e.targetTouches[0].clientX);
  };

  const handlePromoTouchEnd = () => {
    if (!promoTouchStart || !promoTouchEnd) return;
    const distance = promoTouchStart - promoTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      triggerAudio('click');
      setCurrentPromoSlide((prev) => (prev + 1) % promoBanners.length);
    } else if (isRightSwipe) {
      triggerAudio('click');
      setCurrentPromoSlide((prev) => (prev - 1 + promoBanners.length) % promoBanners.length);
    }
    setPromoTouchStart(null);
    setPromoTouchEnd(null);
  };

  const handlePromoKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      triggerAudio('click');
      setCurrentPromoSlide((prev) => (prev - 1 + promoBanners.length) % promoBanners.length);
    } else if (e.key === 'ArrowRight') {
      triggerAudio('click');
      setCurrentPromoSlide((prev) => (prev + 1) % promoBanners.length);
    }
  };

  const handlePolaroidScroll = () => {
    if (polaroidScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = polaroidScrollRef.current;
      const totalScroll = scrollWidth - clientWidth;
      if (totalScroll > 0) {
        setPolaroidScrollProgress((scrollLeft / totalScroll) * 100);
      }
    }
  };

  // Testimonials Observer Setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setTestimonialsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }
    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
    };
  }, []);

  const testimonialsData = [
    {
      patron: "Maharani Gayatri Devi",
      city: "Jaipur Legacy",
      quote: "The Kundan Aad carries the exact weight and majesty of our family heirlooms. Their master artisans preserved the 18th-century reverse Meenakari detail with breathtaking precision. A stellar testament to Rajasthan's living history."
    },
    {
      patron: "Suryaveer Singh Rathore",
      city: "Uttar Pradesh Royal Lineage",
      quote: "The Chitai hand-hammered sterling silver sets represent craftsmanship that is virtually extinct today. Standard commercial brands sell machine-pressed copies, but MANISH & CO delivers a heavy, resonant masterpiece forged entirely by hand."
    },
    {
      patron: "Aishwarya Sen",
      city: "Delhi High-Fashion",
      quote: "Their bespoke bridal consultation allowed us to custom-craft our wedding jewellery with certified 925 sterling silver and uncompromised craftsmanship. Exceptional trust, transparent pricing, and their showroom experience was pure luxury."
    }
  ];

  const faqData = [
    {
      q: "How are active daily spot gold and silver bullion rates calculated?",
      a: "We pull direct, real-time rates from international commodity indexes (XAU/XAG) converted via active INR currency exchange benchmarks. This gives you exact, transparent pricing down to the second, matching government BIS guidelines."
    },
    {
      q: "What certifications accompany your diamond and polki ornaments?",
      a: "Every solitaire and natural diamond comes certified with unique laser-inscription registry codes by the International Gemological Institute (IGI). All gold ornaments carry 100% official Bureau of Indian Standards (BIS) 916 Hallmark engravings."
    },
    {
      q: "Can I customize an ancestral royal seal, design or signet ring?",
      a: "Absolutely. Our bespoke design studio specializes in custom forgings. You can schedule a private design consultation with our master artisan Manish Verma to review family seals, drawings, or sketches."
    },
    {
      q: "Do you guarantee 100% authentic BIS Hallmarked 925 Sterling Silver?",
      a: "Yes. Every single creation from MANISH & CO is laser-engraved with the official Bureau of Indian Standards (BIS) 925 Hallmark and comes with an authenticity certificate, ensuring unmatched purity and enduring trust."
    },
    {
      q: "What security measures protect home delivery across India?",
      a: "Every parcel is securely packaged in our signature linen casket, protected with an authentic tamper-evident wax seal and shipped via express insured couriers with live end-to-end tracking to your doorstep."
    }
  ];

  return (
    <div className={`pb-0 transition-colors duration-500 ${isCatalogDark ? "text-[#FCFAFF]" : "text-[#202329]"}`}>
      
      {/* ==========================================================
        SECTION 01: EDGE-TO-EDGE RAJASTHANI WELCOME HERO BANNER
        ========================================================== */}
      <section className="relative w-full overflow-hidden select-none bg-[#091B2B]">
        <div className="w-full relative flex items-center justify-center">
          <img
            src="/images/rajasthani-welcome-namaste-cartoon.png"
            alt="Rajasthani Welcome - Manish & Co"
            className="w-full h-auto object-cover sm:object-contain max-h-[85vh] mx-auto block shadow-2xl"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#E6DFD3] relative z-20" />

      {/* Main Content Area (White/Ivory background) */}
      <div className="bg-[#F8F5EC] text-[#202329] transition-colors duration-500 !mt-0">

        {/* ==========================================================
          FEATURE 02: PREMIUM JEWELLERY CATEGORIES GRID (DYNAMIC ONLY)
          ========================================================== */}
        {activeCategories.length > 0 && (
          <div id="shop-by-category" className="w-full pt-0 pb-12 lg:pb-16 px-6 sm:px-12 select-none bg-[#F8F5EC] text-center">
            <section className="max-w-[1836px] mx-auto">
              {/* Unified Horizontal Scroll Categories */}
              <div className="pt-6 pb-6 overflow-x-auto no-scrollbar scroll-smooth">
                <div className="grid grid-flow-col grid-rows-2 gap-4 sm:gap-6 w-max select-none px-4 text-center">
                  {activeCategories.map((cat, idx) => {
                    const handleClick = () => {
                      triggerAudio('click');
                      const normName = String(cat.name || '').toLowerCase();
                      if (cat.id === 'gold-coins' || normName.includes('coin')) {
                        navigateTo('gold-coins');
                      } else {
                        changeCategoryTab(cat.name);
                        navigateTo('collections');
                      }
                    };
                    const rawCatImg = cat.img || getCategoryFallbackImage(cat.name || cat.id);
                    const catImg = getOptimizedImageUrl(rawCatImg, { width: 300 });

                    return (
                      <div
                        key={idx}
                        onClick={handleClick}
                        className="w-[120px] sm:w-[170px] h-[160px] sm:h-[240px] bg-white border border-[rgba(0,0,0,0.04)] rounded-[20px] sm:rounded-[24px] shadow-[0_6px_18px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between relative overflow-hidden hover:-translate-y-[3px] transition-all duration-[250ms] ease group cursor-pointer text-center"
                        style={{
                          paddingTop: '16px',
                          paddingLeft: '12px',
                          paddingRight: '12px',
                          paddingBottom: '16px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div className="w-full h-[85px] sm:h-[120px] flex items-center justify-center relative bg-transparent text-center">
                          <img
                            src={catImg}
                            alt={cat.name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              const fallback = getCategoryFallbackImage(cat.name || cat.id);
                              if (e.currentTarget.src !== fallback) {
                                e.currentTarget.src = fallback;
                              }
                            }}
                            className="w-[72%] h-[72%] object-contain object-center transition-transform duration-[250ms] ease-out group-hover:scale-[1.03] filter drop-shadow-[0_8px_12px_rgba(90,74,74,0.12)] mix-blend-multiply"
                          />
                        </div>
                        <span
                          className="text-center font-sans tracking-tight line-clamp-2 mt-auto text-[11px] sm:text-[13px] font-semibold text-[#3d2619] leading-snug select-none"
                        >
                          {cat.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CUSTOM DESIGN BUTTON */}
        <div className="w-full flex justify-center py-8 bg-[#F8F5EC]">
          <button
            onClick={() => { triggerAudio('shimmer'); setCustomDesignOpen(true); }}
            id="custom-design-cta"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-sans font-bold text-[13px] tracking-[0.15em] uppercase text-white overflow-hidden cursor-pointer select-none transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(180,120,20,0.45)] active:scale-95 border-none font-bold"
            style={{
              background: 'linear-gradient(135deg, #C8960C 0%, #E8B84B 40%, #A07820 100%)',
              boxShadow: '0 4px 18px rgba(180,120,20,0.30)',
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Custom Design
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ==========================================================
          PROMOTIONAL CAROUSEL
          ========================================================== */}
        <section className="w-full bg-[#F8F5F0] py-6 sm:py-16 flex flex-col items-center justify-center overflow-hidden">
          <div
            className="w-full aspect-[2400/778] overflow-hidden bg-white relative group select-none outline-none shadow-sm"
            tabIndex={0}
            onKeyDown={handlePromoKeyDown}
            onTouchStart={handlePromoTouchStart}
            onTouchMove={handlePromoTouchMove}
            onTouchEnd={handlePromoTouchEnd}
            onMouseEnter={() => setPromoIsPaused(true)}
            onMouseLeave={() => setPromoIsPaused(false)}
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden cursor-pointer">
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentPromoSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.6, ease: "easeInOut" }
                  }}
                  onClick={() => {
                    triggerAudio('click');
                    const banner = promoBanners[currentPromoSlide];
                    if (banner.tab) {
                      changeCategoryTab(banner.tab, banner.metal || 'all', 'all');
                    }
                    if (banner.metal && typeof setMetalFilter === 'function') {
                      setMetalFilter(banner.metal);
                    }
                    navigateTo(banner.link || 'collections');
                  }}
                  className="absolute inset-0 w-full h-full text-left group cursor-pointer"
                >
                  <img
                    src={promoBanners[currentPromoSlide].img}
                    alt={promoBanners[currentPromoSlide].alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center select-none pointer-events-none"
                  />

                  {/* Call-to-action button overlay */}
                  <div className="absolute bottom-2 left-2 sm:bottom-8 sm:left-8 lg:bottom-12 lg:left-12 z-30 pointer-events-none">
                    <button
                      className="px-2.5 py-1 sm:px-6 sm:py-3 lg:px-8 lg:py-3.5 bg-[#C9A14A] hover:bg-[#b08836] text-white font-sans text-[9px] sm:text-xs lg:text-sm font-extrabold uppercase tracking-widest rounded-full transition-all duration-300 transform group-hover:scale-105 shadow-md border-none font-bold"
                    >
                      View Offer
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="w-full max-w-[600px] mx-auto flex items-center justify-between mt-3 sm:mt-6 px-6 select-none">
            <button
              onClick={() => {
                triggerAudio('click');
                setCurrentPromoSlide((prev) => (prev - 1 + promoBanners.length) % promoBanners.length);
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-solid border-[#C9A14A]/30 hover:border-[#C9A14A] hover:bg-white text-[#C9A14A] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer bg-transparent"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="flex space-x-2 sm:space-x-3 items-center">
              {promoBanners.map((_, idx) => (
                <button
                  key={`promo-dot-${idx}`}
                  onClick={() => {
                    triggerAudio('click');
                    setCurrentPromoSlide(idx);
                  }}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 border-none cursor-pointer ${currentPromoSlide === idx ? "w-6 sm:w-8 bg-[#C9A14A]" : "w-1.5 sm:w-2 bg-[#C9A14A]/30 hover:bg-[#C9A14A]/60"}`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                triggerAudio('click');
                setCurrentPromoSlide((prev) => (prev + 1) % promoBanners.length);
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-solid border-[#C9A14A]/30 hover:border-[#C9A14A] hover:bg-white text-[#C9A14A] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer bg-transparent"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </section>

        {/* ==========================================================
          LATEST CAMPAIGN COLLECTIONS
          ========================================================== */}
        <section className="py-16 bg-[#FDFBF7] text-[#0A2240] text-center select-none">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl serif-luxury tracking-wider text-[#0A2240]">
              Browse Latest Jewellery Collections
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end text-center">
              {/* Dainty Dreams Card */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (setGenderFilter) setGenderFilter('women');
                  if (changeCategoryTab) changeCategoryTab('Rings');
                  navigateTo('collections');
                }}
                className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer aspect-[4/3] text-center"
              >
                <img
                  src={campaignDaintyDreams}
                  alt="Dainty Dreams Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Raw Reverie Card */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (setMetalFilter) setMetalFilter('gold');
                  if (changeCategoryTab) changeCategoryTab('Necklace');
                  navigateTo('collections');
                }}
                className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer aspect-[4/3] transform md:-translate-y-6 text-center"
              >
                <img
                  src={campaignRawReverie}
                  alt="Raw Reverie Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Clay Whispers Card -> Redirects to Diamond Jewellery */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (typeof setMetalFilter === 'function') setMetalFilter('all');
                  if (changeCategoryTab) changeCategoryTab('Diamond');
                  navigateTo('collections');
                }}
                className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer aspect-[4/3] text-center"
              >
                <img
                  src={campaignClayWhispers}
                  alt="Clay Whispers Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                <div className="absolute inset-0 flex flex-col justify-center items-end p-8 bg-gradient-to-l from-black/40 via-transparent to-transparent select-none pointer-events-none">
                  <div className="text-right space-y-1">
                    <span className="block text-[28px] sm:text-[32px] lg:text-[40px] serif-luxury text-[#E6C687] leading-none tracking-[0.2em] font-serif font-light drop-shadow-lg">
                      CLAY
                    </span>
                    <span className="block text-[24px] sm:text-[28px] lg:text-[34px] serif-luxury text-[#E6C687] leading-none tracking-[0.15em] font-serif font-light drop-shadow-lg">
                      WHISPERS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  triggerAudio('click');
                  changeCategoryTab('Collections');
                  navigateTo('collections');
                }}
                className="px-8 py-3.5 bg-[#0D2B4E] hover:bg-[#091B2B] text-[#F8F5EC] font-sans text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 border border-solid border-[#B09A82]/40 shadow-md active:scale-95 cursor-pointer"
              >
                Browse all Collections
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================================
          BRAND CAMPAIGN VIDEO
          ========================================================== */}
        <section className="py-20 bg-[#F8F5EC] overflow-hidden text-center">
          <div className="max-w-[1836px] mx-auto px-6 sm:px-12 lg:px-16 text-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch text-center">
              
              <motion.div
                initial={{ opacity: 0, x: -120 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 text-center"
              >
                <div className="border-2 border-[#6B4B2E] rounded-[8px] overflow-hidden shadow-2xl bg-black aspect-video relative group transition-transform duration-500 hover:scale-[1.01] text-center border-solid">
                  <video
                    src="/videos/strokes_of_genius.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-full object-cover select-none"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091B2B]/80 via-transparent to-transparent flex items-end p-6 text-left pointer-events-none">
                    <p className="text-[#F8F5EC] text-xs sm:text-sm font-serif tracking-wider drop-shadow-md">
                      Handcrafted In Pure 925 Sterling Silver • Centuries of Indian Royal Silversmithing
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 120 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 relative flex flex-col lg:flex-row items-center lg:items-stretch h-full py-6 lg:py-0"
              >
                <div className="absolute -left-12 right-0 h-[1.5px] bg-[#6B4B2E] top-1/2 -translate-y-1/2 z-0 hidden lg:block" />
                <div className="lg:absolute lg:left-0 lg:bottom-1/2 lg:pl-12 lg:pb-1.5 z-10 text-center lg:text-left w-full lg:w-auto">
                  <h3 className="serif-luxury text-4xl sm:text-5xl lg:text-[52px] font-normal tracking-wide text-[#0D2B4E] hover:scale-[1.02] transition-transform duration-300">
                    #StrokesofGenius
                  </h3>
                </div>
                <div className="w-24 h-[1.5px] bg-[#6B4B2E] mt-4 lg:hidden" />
              </motion.div>

            </div>
          </div>
        </section>

        {/* ==========================================================
          GIFTING GUIDE
          ========================================================== */}
        <section className="py-20 bg-white overflow-hidden text-center">
          <div className="max-w-[1836px] mx-auto px-6 sm:px-12 lg:px-16 text-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch text-center">
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:col-span-7 flex flex-col justify-between space-y-6 lg:space-y-0 text-center"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full text-center">
                  {/* Card 1: Layered Necklaces */}
                  <div
                    onClick={() => {
                      triggerAudio('click');
                      if (typeof setMetalFilter === 'function') setMetalFilter('all');
                      if (typeof setGenderFilter === 'function') setGenderFilter('women');
                      if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(100000000);
                      if (changeCategoryTab) changeCategoryTab('Necklaces', 'all', 'women');
                      navigateTo('collections');
                    }}
                    className="bg-white rounded-3xl p-5 flex flex-col justify-between shadow-sm border border-solid border-[#E6DFD3] hover:border-[#B09A82]/60 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 group text-left cursor-pointer select-none"
                  >
                    <div className="bg-[#F8F5EC] rounded-2xl aspect-square flex items-center justify-center p-4 shadow-inner relative overflow-hidden text-center">
                      <img
                        src={giftingLayeredNecklaces}
                        alt="Layered Necklaces"
                        className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      />
                    </div>
                    <div className="mt-5 text-left">
                      <h4 className="serif-luxury text-lg font-bold text-[#0D2B4E] border-b border-solid border-[#0D2B4E]/15 pb-1 inline-block">
                        Layered Necklaces
                      </h4>
                      <p className="text-[11.5px] text-[#657989] font-sans mt-2 leading-relaxed font-light">
                        Elevate your style with chic layered necklaces in hallmark pure 925 silver.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Coveted Styles */}
                  <div
                    onClick={() => {
                      triggerAudio('click');
                      if (typeof setMetalFilter === 'function') setMetalFilter('all');
                      if (typeof setGenderFilter === 'function') setGenderFilter('all');
                      if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(100000000);
                      if (changeCategoryTab) changeCategoryTab('Collections', 'all', 'all');
                      navigateTo('collections');
                    }}
                    className="bg-white rounded-3xl p-5 flex flex-col justify-between shadow-sm border border-solid border-[#E6DFD3] hover:border-[#B09A82]/60 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 group text-left cursor-pointer select-none"
                  >
                    <div className="bg-[#F8F5EC] rounded-2xl aspect-square flex items-center justify-center p-4 shadow-inner relative overflow-hidden text-center">
                      <img
                        src={giftingCovetedStyles}
                        alt="Coveted Styles"
                        className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      />
                    </div>
                    <div className="mt-5 text-left">
                      <h4 className="serif-luxury text-lg font-bold text-[#0D2B4E] border-b border-solid border-[#0D2B4E]/15 pb-1 inline-block">
                        Coveted Styles
                      </h4>
                      <p className="text-[11.5px] text-[#657989] font-sans mt-2 leading-relaxed font-light">
                        A curated selection of MANISH &amp; CO's most coveted jewels.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: MANISH & CO Men */}
                  <div
                    onClick={() => {
                      triggerAudio('click');
                      if (typeof setMetalFilter === 'function') setMetalFilter('all');
                      if (typeof setGenderFilter === 'function') setGenderFilter('men');
                      if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(100000000);
                      if (changeCategoryTab) changeCategoryTab('Collections', 'all', 'men');
                      navigateTo('collections');
                    }}
                    className="bg-white rounded-3xl p-5 flex flex-col justify-between shadow-sm border border-solid border-[#E6DFD3] hover:border-[#B09A82]/60 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 group text-left cursor-pointer select-none"
                  >
                    <div className="bg-[#F8F5EC] rounded-2xl aspect-square flex items-center justify-center p-4 shadow-inner relative overflow-hidden text-center">
                      <img
                        src={giftingHrMan}
                        alt="MANISH & CO Men"
                        className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      />
                    </div>
                    <div className="mt-5 text-left">
                      <h4 className="serif-luxury text-lg font-bold text-[#0D2B4E] border-b border-solid border-[#0D2B4E]/15 pb-1 inline-block">
                        MANISH &amp; CO Men
                      </h4>
                      <p className="text-[11.5px] text-[#657989] font-sans mt-2 leading-relaxed font-light">
                        Signature silver kadas, rings, and chains to enhance refined masculine style.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Part: Luxury Navy & Taupe Gift Box Card */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:col-span-5 relative text-center"
              >
                {/* Floating Stars */}
                <div className="absolute inset-0 pointer-events-none select-none z-20">
                  <div className="absolute -top-3 -left-3 text-[#B09A82] text-lg animate-pulse">✦</div>
                  <div className="absolute top-1/4 -left-4 text-[#B09A82]/60 text-sm">✨</div>
                  <div className="absolute bottom-6 -left-3 text-[#B09A82] text-base">✦</div>
                  <div className="absolute -bottom-3 left-1/4 text-[#B09A82]/70 text-lg">✨</div>
                  <div className="absolute -top-4 -right-2 text-[#B09A82] text-base animate-pulse">✦</div>
                  <div className="absolute top-1/3 -right-4 text-[#B09A82]/60 text-sm">✨</div>
                  <div className="absolute bottom-12 -right-3 text-[#B09A82] text-base opacity-75">✦</div>
                  <div className="absolute -bottom-3 right-1/6 text-[#B09A82]/70 text-lg">✨</div>
                </div>

                <div className="w-full h-full bg-gradient-to-br from-[#0D2B4E] via-[#091B2B] to-[#0D2B4E] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl overflow-hidden border border-solid border-[#B09A82]/30 text-center">
                  <div className="absolute inset-2 border-[1.5px] border-dashed border-[#B09A82]/30 rounded-2xl pointer-events-none z-10" />

                  <div className="text-center pt-4 pb-6 z-20">
                    <span className="serif-luxury text-[#B09A82] text-lg sm:text-xl md:text-2xl font-light tracking-wide block uppercase">
                      Curated Signature
                    </span>
                    <h3 className="serif-luxury text-[#F8F5EC] text-5xl sm:text-6xl lg:text-7xl font-bold tracking-wider mt-1 mb-2 relative inline-block">
                      G
                      <span className="relative inline-block text-[#B09A82]">
                        ı
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm sm:text-base text-[#B09A82]">✦</span>
                      </span>
                      ft
                    </h3>
                    <span className="serif-luxury text-[#B2BAC1] text-lg sm:text-xl font-light tracking-wide block">
                      for your loved ones in signature linen &amp; wax seal box
                    </span>
                  </div>

                  {/* Guided Gifting Price Boxes */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 pb-4 z-20 relative">
                    {/* Box 1 */}
                    <button
                      onClick={() => {
                        triggerAudio('shimmer');
                        if (typeof setMetalFilter === 'function') setMetalFilter('all');
                        if (typeof setGenderFilter === 'function') setGenderFilter('all');
                        if (changeCategoryTab) changeCategoryTab('Collections');
                        if (setMaxPriceFilter) setMaxPriceFilter(10000);
                        navigateTo('collections');
                      }}
                      className="bg-[#F8F5EC] rounded-b-xl rounded-t-sm pt-6 pb-4 flex flex-col items-center justify-center relative shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-pointer border border-solid border-[#B09A82]/20"
                    >
                      <svg className="w-8 h-8 absolute -top-4 text-[#6B4B2E] fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                        <path d="M12,12 C9,7 6,7 6,10 C6,13 9,13 12,12 Z" />
                        <path d="M12,12 C15,7 18,7 18,10 C18,13 15,13 12,12 Z" />
                      </svg>
                      <div className="absolute top-2 w-[106%] h-2.5 bg-[#F8F5EC] rounded-sm border-b border-solid border-[#B09A82]/30 shadow-sm" />
                      <span className="text-[9px] uppercase tracking-wider text-[#657989] font-bold font-sans">Under</span>
                      <span className="serif-luxury text-lg sm:text-2xl font-black text-[#0D2B4E] leading-none mt-1 font-bold">10k</span>
                    </button>

                    {/* Box 2 */}
                    <button
                      onClick={() => {
                        triggerAudio('shimmer');
                        if (typeof setMetalFilter === 'function') setMetalFilter('all');
                        if (typeof setGenderFilter === 'function') setGenderFilter('all');
                        if (changeCategoryTab) changeCategoryTab('Collections');
                        if (setMaxPriceFilter) setMaxPriceFilter(30000);
                        navigateTo('collections');
                      }}
                      className="bg-[#F8F5EC] rounded-b-xl rounded-t-sm pt-6 pb-4 flex flex-col items-center justify-center relative shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-pointer border border-solid border-[#B09A82]/20"
                    >
                      <svg className="w-8 h-8 absolute -top-4 text-[#6B4B2E] fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                        <path d="M12,12 C9,7 6,7 6,10 C6,13 9,13 12,12 Z" />
                        <path d="M12,12 C15,7 18,7 18,10 C18,13 15,13 12,12 Z" />
                      </svg>
                      <div className="absolute top-2 w-[106%] h-2.5 bg-[#F8F5EC] rounded-sm border-b border-solid border-[#B09A82]/30 shadow-sm" />
                      <span className="text-[9px] uppercase tracking-wider text-[#657989] font-bold font-sans">Under</span>
                      <span className="serif-luxury text-lg sm:text-2xl font-black text-[#0D2B4E] leading-none mt-1 font-bold">30k</span>
                    </button>

                    {/* Box 3 */}
                    <button
                      onClick={() => {
                        triggerAudio('shimmer');
                        if (typeof setMetalFilter === 'function') setMetalFilter('all');
                        if (typeof setGenderFilter === 'function') setGenderFilter('all');
                        if (changeCategoryTab) changeCategoryTab('Collections');
                        if (setMaxPriceFilter) setMaxPriceFilter(50000);
                        navigateTo('collections');
                      }}
                      className="bg-[#F8F5EC] rounded-b-xl rounded-t-sm pt-6 pb-4 flex flex-col items-center justify-center relative shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-pointer border border-solid border-[#B09A82]/20"
                    >
                      <svg className="w-8 h-8 absolute -top-4 text-[#6B4B2E] fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                        <path d="M12,12 C9,7 6,7 6,10 C6,13 9,13 12,12 Z" />
                        <path d="M12,12 C15,7 18,7 18,10 C18,13 15,13 12,12 Z" />
                      </svg>
                      <div className="absolute top-2 w-[106%] h-2.5 bg-[#F8F5EC] rounded-sm border-b border-solid border-[#B09A82]/30 shadow-sm" />
                      <span className="text-[9px] uppercase tracking-wider text-[#657989] font-bold font-sans">Under</span>
                      <span className="serif-luxury text-lg sm:text-2xl font-black text-[#0D2B4E] leading-none mt-1 font-bold">50k</span>
                    </button>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ==========================================================
          TAILORED SELECTION RECOMMENDED FOR YOU
          ========================================================== */}
        <section className="py-12 bg-white border-b border-solid border-[#E6DFD3] relative overflow-hidden text-center">
          <div className="w-full px-4 md:px-12 space-y-10 relative group/sect text-center">
            
            <div className="text-center space-y-3">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#6B4B2E] font-bold font-sans">TAILORED SELECTION</span>
              <h2 className="serif-luxury text-3xl sm:text-5xl font-semibold text-[#0D2B4E]">Recommended for You</h2>
              <div className="w-16 h-[1.5px] bg-[#6B4B2E] mx-auto mt-3"></div>
            </div>

            <div
              className="relative flex items-center px-0 md:px-16"
              onMouseEnter={() => {
                if (categoriesAutoplayRef.current) clearInterval(categoriesAutoplayRef.current);
              }}
              onMouseLeave={() => {
                startCategoriesAutoplay();
              }}
            >
              {/* Left Scroll button */}
              <button
                onClick={() => scrollCategories('left')}
                className="absolute left-2 md:left-4 z-10 p-2.5 rounded-full border border-solid shadow-lg transition-all duration-300 -translate-x-4 opacity-0 group-hover/sect:opacity-100 group-hover/sect:translate-x-0 cursor-pointer hidden md:flex items-center justify-center bg-white/95 backdrop-blur-sm border-[#E6DFD3] text-[#0D2B4E] hover:bg-[#F8F5EC]"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Scroll Container */}
              <div
                ref={categoriesScrollRef}
                className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-6 px-4 select-none w-full flex-nowrap justify-start"
              >
                {activeCategories.map((cat, idx) => {
                  const handleClick = () => {
                    triggerAudio('click');
                    const normName = String(cat.name || '').toLowerCase();
                    if (cat.id === 'gold-coins' || normName.includes('coin')) {
                      navigateTo('gold-coins');
                    } else {
                      changeCategoryTab(cat.name);
                      navigateTo('collections');
                    }
                  };
                  const rawCatImg = cat.img || getCategoryFallbackImage(cat.name || cat.id);
                  const catImg = getOptimizedImageUrl(rawCatImg, { width: 250 });

                  return (
                    <div
                      key={idx}
                      onClick={handleClick}
                      className="flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-center group text-center"
                    >
                      <div
                        className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-full overflow-hidden border border-solid flex items-center justify-center transition-transform duration-300 ease group-hover:scale-105 border-[#E6DFD3] bg-[#F8F5EC] shadow-[0_4px_12px_rgba(13,43,78,0.06)]"
                      >
                        <img
                          src={catImg}
                          alt={cat.name}
                          loading="lazy"
                          onError={(e) => {
                            const fallback = getCategoryFallbackImage(cat.name || cat.id);
                            if (e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                          className="w-[72%] h-[72%] object-contain transition-transform duration-300 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.06)] mix-blend-multiply"
                        />
                      </div>
                      <span
                        className="font-sans text-[11px] sm:text-xs tracking-wider uppercase font-semibold transition-colors duration-300 text-[#202329] group-hover:text-[#6B4B2E]"
                      >
                        {cat.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Right Scroll button */}
              <button
                onClick={() => scrollCategories('right')}
                className="absolute right-2 md:right-4 z-10 p-2.5 rounded-full border border-solid shadow-lg transition-all duration-300 translate-x-4 opacity-0 group-hover/sect:opacity-100 group-hover/sect:-translate-x-0 cursor-pointer hidden md:flex items-center justify-center bg-white/95 backdrop-blur-sm border-[#E6DFD3] text-[#0D2B4E] hover:bg-[#F8F5EC]"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        </section>

        {/* MCPG Plain Gold Jewellery Offer Banner below Recommended for You */}
        <section className="w-full bg-transparent pb-8 overflow-hidden select-none text-center">
          <div
            onClick={() => {
              triggerAudio('click');
              if (typeof setMetalFilter === 'function') setMetalFilter('gold');
              if (typeof setGenderFilter === 'function') setGenderFilter('all');
              if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(100000000);
              if (changeCategoryTab) changeCategoryTab('Collections', 'gold', 'all');
              navigateTo('collections');
            }}
            className="w-full overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border-y border-solid border-[#E6DFD3] text-center"
          >
            <img
              src={bannerGold20}
              alt="Up to 20% OFF on Making Charges on Plain Gold Jewellery"
              loading="lazy"
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          </div>
        </section>

        {/* ==========================================================
          CRAFTSMANSHIP JOURNEY OUR PROCESS
          ========================================================== */}
        <section 
          onMouseEnter={() => setProcessPaused(true)}
          onMouseLeave={() => setProcessPaused(false)}
          className="bg-white py-20 px-6 sm:px-12 select-none border-b border-solid border-gray-100 overflow-hidden text-left"
        >
          <div className="max-w-[1836px] mx-auto relative px-4 text-left">
            
            <div className="text-center md:text-left mb-12 space-y-4">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#6B4B2E] font-bold font-sans block">
                Craftsmanship Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold text-[#0D2B4E] tracking-tight serif-luxury">
                Our Artisanal Process
              </h2>
            </div>

            {/* Progress line */}
            <div className="flex items-center justify-between max-w-5xl mx-auto mb-20 relative px-4 select-none">
              <div className="absolute top-1/2 -translate-y-1/2 left-[24px] right-[24px] h-[2px] bg-[#E6DFD3] z-0">
                <div 
                  className="h-full bg-[#6B4B2E] transition-all duration-500 ease-out origin-left"
                  style={{ width: `${(activeProcessStep / 5) * 100}%` }}
                />
              </div>
              
              {processStepsData.map((step, idx) => {
                const isActive = activeProcessStep === idx;
                return (
                  <button
                    key={step.num}
                    onClick={() => {
                      triggerAudio('click');
                      setActiveProcessStep(idx);
                    }}
                    className="relative z-10 flex flex-col items-center group focus:outline-none cursor-pointer border-none bg-transparent"
                  >
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-[#6B4B2E] border-[#6B4B2E] text-white shadow-[0_0_15px_rgba(107,75,46,0.35)] scale-110'
                        : 'bg-white border-[#E6DFD3] text-gray-500 hover:border-[#6B4B2E] hover:text-[#6B4B2E] border-solid'
                    }`}>
                      {step.num}
                    </div>
                    <span className={`absolute top-14 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 hidden md:block ${
                      isActive ? 'text-[#6B4B2E] opacity-100 translate-y-0' : 'text-gray-400 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Showcase Card */}
            <div className="w-full bg-white border border-solid border-[#E6DFD3] rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(13,43,78,0.04)] hover:shadow-[0_40px_80px_rgba(13,43,78,0.08)] transition-shadow duration-500 flex flex-col lg:flex-row relative">
              <div className="w-full lg:w-[55%] relative aspect-[16/10] lg:aspect-auto lg:h-[550px] overflow-hidden bg-[#F8F5EC] shrink-0 text-center">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    key={activeProcessStep}
                    src={processStepsData[activeProcessStep]?.img || processStepsData[activeProcessStep]?.fallback}
                    alt={processStepsData[activeProcessStep]?.title || "Our Process"}
                    onError={(e) => {
                      const fallback = processStepsData[activeProcessStep]?.fallback;
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#091B2B]/40 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="w-full lg:w-[45%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-left space-y-6 relative bg-white overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#6B4B2E] font-bold font-sans">
                    Step {processStepsData[activeProcessStep].num} of 06
                  </span>
                  <h3 
                    key={`title-${activeProcessStep}`}
                    className="text-3xl sm:text-4xl font-semibold text-[#0D2B4E] tracking-tight serif-luxury animate-fadeSlideIn"
                  >
                    {processStepsData[activeProcessStep].title}
                  </h3>
                  <div className="w-12 h-1 bg-[#6B4B2E] rounded-full" />
                </div>

                <p 
                  key={`desc-${activeProcessStep}`}
                  className="text-[#657989] text-sm sm:text-base leading-relaxed font-sans font-normal relative z-10 max-w-lg animate-fadeSlideIn [animation-delay:150ms]"
                >
                  {processStepsData[activeProcessStep].desc}
                </p>

                {/* Arrows */}
                <div className="flex items-center space-x-4 pt-6 relative z-10">
                  <button
                    onClick={() => {
                      triggerAudio('click');
                      setActiveProcessStep((prev) => (prev - 1 + 6) % 6);
                    }}
                    className="w-12 h-12 rounded-full border border-solid border-[#E6DFD3] flex items-center justify-center text-[#0D2B4E] hover:bg-[#0D2B4E] hover:border-[#0D2B4E] hover:text-[#F8F5EC] transition-all duration-300 cursor-pointer shadow-sm bg-transparent"
                    aria-label="Previous step"
                  >
                    <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      triggerAudio('click');
                      setActiveProcessStep((prev) => (prev + 1) % 6);
                    }}
                    className="w-12 h-12 rounded-full border border-solid border-[#E6DFD3] flex items-center justify-center text-[#0D2B4E] hover:bg-[#0D2B4E] hover:border-[#0D2B4E] hover:text-[#F8F5EC] transition-all duration-300 cursor-pointer shadow-sm bg-transparent"
                    aria-label="Next step"
                  >
                    <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
          POLAROID TESTIMONIALS
          ========================================================== */}
        <section
          ref={testimonialsRef}
          data-inview={testimonialsInView ? "true" : "false"}
          className="w-full py-16 overflow-hidden select-none border-y border-solid transition-colors duration-500 group bg-[#F8F5EC] border-[#E6DFD3] text-center"
        >
          <div className="max-w-7xl mx-auto px-4 text-center space-y-3 mb-12">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#6B4B2E] font-bold font-sans block">
              OUR PATRONS' STORIES
            </span>
            <h2 className="serif-luxury text-3xl sm:text-[48px] font-medium leading-none tracking-wide text-[#0D2B4E]">
              More Than Just Jewellery
            </h2>
            <p className="font-sans text-xs sm:text-[16px] tracking-wide font-normal max-w-2xl mx-auto leading-relaxed text-[#657989]">
              Every piece tells a story. Every memory shines forever in pure hallmarked silver.
            </p>
          </div>

          <div
            ref={polaroidScrollRef}
            onScroll={handlePolaroidScroll}
            className="w-full overflow-x-auto no-scrollbar py-6 snap-x"
          >
            <div className="relative w-full min-w-[1400px] xl:min-w-0 xl:w-full h-[480px]">
              <svg className="absolute left-0 top-0 w-full h-[120px] pointer-events-none z-0" viewBox="0 0 100 120" fill="none" preserveAspectRatio="none">
                <path
                  d="M 0,30 Q 5,50 10,50 Q 23.3,85 36.6,50 Q 50,85 63.3,50 Q 76.7,85 90,50 Q 95,50 100,30"
                  stroke="#D1D5DB"
                  strokeWidth="1.2"
                />
              </svg>

              {[
                {
                  name: "Aarohi Sharma, 27",
                  quote: "My dream silver bridal set became a reality with MANISH & CO. The craftsmanship and royal finish are beyond expectations.",
                  img: testimonial1,
                  rot: "rotate-[-10deg]",
                  left: "10%"
                },
                {
                  name: "Priya Mehta, 31",
                  quote: "The quality, finishing, and personalized service made my purchase truly memorable. A perfect luxury silver boutique experience.",
                  img: testimonial2,
                  rot: "rotate-[-4deg]",
                  left: "36.6%"
                },
                {
                  name: "Neha Kapoor, 29",
                  quote: "I wear my bracelet every day and it still looks stunning. Timeless craftsmanship, 925 purity and exceptional quality.",
                  img: testimonial3,
                  rot: "rotate-[4deg]",
                  left: "63.3%"
                },
                {
                  name: "Riya Verma, 26",
                  quote: "My husband gifted me this beautiful necklace and I receive compliments everywhere. The wax seal packaging was breathtaking.",
                  img: testimonial4,
                  rot: "rotate-[10deg]",
                  left: "90%"
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    left: item.left,
                    top: "50px",
                    transform: "translateX(-50%)"
                  }}
                  className="absolute shrink-0 z-10 hover:z-30"
                >
                  <div className="transform-gpu transition-all duration-700 ease-out opacity-100 translate-y-0">
                    <div
                      style={{ transformOrigin: "50% -20px" }}
                      className={`w-[285px] shadow-[0_15px_35px_rgba(13,43,78,0.08),0_5px_15px_rgba(13,43,78,0.04)] rounded-xs pt-5 px-5 pb-8 relative flex flex-col items-center select-none snap-center transition-all duration-300 hover:scale-[1.04] hover:rotate-0 hover:z-40 cursor-pointer border border-solid mt-[20px] overflow-visible bg-white border-[#E6DFD3] ${item.rot}`}
                    >
                      <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 w-8 h-12 flex items-center justify-center z-20 pointer-events-none">
                        <svg width="28" height="42" viewBox="0 0 28 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FFFFFF" />
                              <stop offset="40%" stopColor="#D8D9DA" />
                              <stop offset="70%" stopColor="#9EA0A2" />
                              <stop offset="100%" stopColor="#5C5E60" />
                            </linearGradient>
                            <linearGradient id="loopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#F0F1F2" />
                              <stop offset="50%" stopColor="#9EA0A2" />
                              <stop offset="100%" stopColor="#404142" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M14 2 C8 2, 7 20, 7 20 M14 2 C20 2, 21 20, 21 20"
                            stroke="url(#loopGrad)"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            fill="none"
                            className="drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.2)]"
                          />
                          <path
                            d="M14 2 C8 2, 7 20, 7 20 M14 2 C20 2, 21 20, 21 20"
                            stroke="#F3F4F6"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M4 20 L24 20 L27 32 L1 32 Z"
                            fill="url(#metalGrad)"
                            stroke="#8E9092"
                            strokeWidth="0.8"
                            strokeLinejoin="round"
                          />
                          <path d="M4 20 L24 20 L25 23 L3 23 Z" fill="#C5C6C8" />
                          <line x1="5" y1="21" x2="23" y2="21" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.8" />
                        </svg>
                      </div>

                      <div className="w-full aspect-square overflow-hidden rounded-xs mb-4 bg-[#F8F5EC] p-1 shadow-sm border border-solid border-[#E6DFD3] text-center">
                        <img
                          src={item.img}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center pointer-events-none"
                        />
                      </div>

                      <div className="w-full space-y-2 text-left px-1">
                        <h4 className="font-sans font-bold text-xs sm:text-[13px] tracking-wide text-[#0D2B4E]">
                          {item.name}
                        </h4>
                        <p className="font-sans text-[10px] sm:text-[11px] leading-relaxed tracking-wide font-normal text-[#657989]">
                          {item.quote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className="w-full h-[3px] rounded-full overflow-hidden bg-[#E6DFD3]">
              <div
                className="h-full rounded-full transition-all duration-150 bg-[#6B4B2E]"
                style={{ width: `${Math.max(10, polaroidScrollProgress)}%` }}
              />
            </div>

            <div className="flex justify-center mt-12">
              <button
                onClick={() => {
                  triggerAudio('click');
                  navigateTo('collections');
                }}
                className="px-8 py-3 rounded-none text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 border border-solid border-[#0D2B4E]/30 text-[#0D2B4E] hover:bg-[#0D2B4E] hover:text-[#F8F5EC] hover:border-transparent cursor-pointer bg-transparent"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================================
          THE GOLDEN LEGACY STORY TIMELINE
          ========================================================== */}
        {(() => {
          const timelineItems = [
            { yr: 1952, title: "Mau Atelier Inception", desc: "Foundations of our ancestral silversmith studio in Mau, hand-sculpting pristine silver ornaments for noble families. Setting absolute purity standards in handcrafting, utilizing dense 925 silver & gold bullion." },
            { yr: 1974, title: "Pioneering Purity Benchmarks", desc: "The atelier institutes rigorous purity testing procedures and establishes hallmark standards, decades before national hallmarking laws were standardized." },
            { yr: 1998, title: "Fine Silver & Polki Expansion", desc: "Introduction of signature bridal silver suites, handcrafted chokers, and certified gemstones catering to bespoke royal trousseau orders." },
            { yr: 2014, title: "Flagship Mau Showroom Lounge", desc: "Opening of our grand flagship boutique in Mau, offering bespoke design tables and private bridal suites for family bridal viewings." },
            { yr: 2026, title: "MANISH & CO Fine Silver Boutique", desc: "Full expansion as MANISH & CO Fine Silver Jewellery, offering certified 925 hallmark collections, live transparent silver rate updates, and luxury wax-sealed express delivery nationwide." }
          ];

          const years = timelineItems.map(t => t.yr);
          const activeIndex = timelineItems.findIndex(t => t.yr === activeStoryTimeline);
          const progressPercent = activeIndex !== -1 ? (activeIndex / (timelineItems.length - 1)) * 100 : 0;
          const activeItem = timelineItems[activeIndex] || timelineItems[0];

          return (
            <section id="home-story-timeline" className="max-w-7xl mx-auto px-6 py-20 select-none text-center">
              <div className="text-center space-y-3 mb-16">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#6B4B2E] font-bold font-sans block">OUR DYNAMIC TIMELINE</span>
                <h2 className="serif-luxury text-3xl sm:text-5xl font-semibold transition-colors duration-500 text-[#0D2B4E]">The Silver &amp; Golden Legacy</h2>
                <div className="w-16 h-[1.5px] bg-[#6B4B2E] mx-auto mt-3"></div>
              </div>

              {/* Horizonal track */}
              <div className="relative w-full max-w-4xl mx-auto mb-16 px-4">
                <div className="absolute top-[11px] left-[24px] right-[24px] h-[1.5px]">
                  <div className="w-full h-full bg-[#E6DFD3]" />
                  <div
                    className="absolute left-0 top-0 h-full bg-[#6B4B2E] transition-all duration-700 ease-out origin-left"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="relative flex justify-between items-center w-full px-[12px]">
                  {timelineItems.map((item) => {
                    const isActive = activeStoryTimeline === item.yr;
                    return (
                      <div
                        key={item.yr}
                        onClick={() => {
                          triggerAudio('click');
                          setTimelineDirection(item.yr >= activeStoryTimeline ? 1 : -1);
                          setActiveStoryTimeline(item.yr);
                        }}
                        className="flex flex-col items-center cursor-pointer group relative z-10"
                      >
                        <div className={`w-6 h-6 rounded-full border-2 border-solid transition-all duration-300 flex items-center justify-center font-bold text-[9px] ${isActive
                          ? 'bg-[#6B4B2E] border-[#6B4B2E] text-white shadow-[0_0_12px_rgba(107,75,46,0.5)] scale-110'
                          : 'bg-white border-[#E6DFD3] text-gray-400 hover:border-[#6B4B2E]'
                          }`}>
                          ✦
                        </div>
                        <span className={`text-[13px] font-bold font-sans tracking-wider mt-3 transition-colors duration-300 ${isActive ? 'text-[#6B4B2E]' : 'text-gray-400 group-hover:text-gray-600'
                          }`}>
                          {item.yr}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Slider details */}
              <div className="flex items-center justify-between max-w-4xl mx-auto mt-6 px-2 sm:px-6">
                <button
                  onClick={() => {
                    triggerAudio('click');
                    setTimelineDirection(-1);
                    setActiveStoryTimeline((prev) => {
                      const idx = years.indexOf(prev);
                      const prevIdx = (idx - 1 + years.length) % years.length;
                      return years[prevIdx];
                    });
                  }}
                  className="p-3 rounded-full border border-solid border-[#E6DFD3] hover:border-[#6B4B2E]/50 text-gray-500 hover:text-[#0D2B4E] hover:bg-[#F8F5EC] cursor-pointer bg-transparent"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex-1 max-w-2xl mx-auto text-center min-h-[140px] flex flex-col items-center justify-center px-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStoryTimeline}
                      initial={{ opacity: 0, x: -30 * timelineDirection }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 * timelineDirection }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="space-y-4"
                    >
                      <h3 className="serif-luxury text-xl sm:text-2xl font-medium tracking-wide text-[#0D2B4E]">
                        {activeItem.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-light leading-relaxed font-sans max-w-2xl mx-auto text-[#657989]">
                        {activeItem.desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => {
                    triggerAudio('click');
                    setTimelineDirection(1);
                    setActiveStoryTimeline((prev) => {
                      const idx = years.indexOf(prev);
                      const nextIdx = (idx + 1) % years.length;
                      return years[nextIdx];
                    });
                  }}
                  className="p-3 rounded-full border border-solid border-[#E6DFD3] hover:border-[#6B4B2E]/50 text-gray-500 hover:text-[#0D2B4E] hover:bg-[#F8F5EC] cursor-pointer bg-transparent"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </section>
          );
        })()}

        {/* ==========================================================
          FAQ ACCORDIONS
          ========================================================== */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-4 space-y-8 text-center pb-24">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#6B4B2E] font-bold font-sans">Patron Concierge</span>
            <h2 className="serif-luxury text-3xl sm:text-5xl font-medium leading-none text-[#0D2B4E]">Frequently Asked Questions</h2>
            <div className="w-16 h-[1.5px] bg-[#6B4B2E] mx-auto mt-3"></div>
          </div>

          <div className="space-y-4 text-left">
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                className="border border-solid rounded-2xl overflow-hidden shadow-sm transition-all duration-300 bg-white border-[#E6DFD3] text-left"
              >
                <button
                  onClick={() => {
                    triggerAudio('click');
                    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
                  }}
                  className="w-full px-6 py-4 flex justify-between items-center text-left text-sm font-bold focus:outline-none hover:text-[#6B4B2E] transition-colors cursor-pointer text-[#202329] bg-transparent border-none"
                >
                  <span className="font-sans leading-snug">{faq.q}</span>
                  <span className="text-xs text-[#6B4B2E] font-sans ml-2">{openFaqIndex === idx ? '▲' : '▼'}</span>
                </button>

                {openFaqIndex === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs leading-relaxed font-sans border-t border-solid text-[#657989] border-[#E6DFD3] font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Promise Grid */}
        <div className="w-full bg-[#FAF6F8] py-16 lg:py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-solid border-gray-200 select-none text-center">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20 text-center">
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left shrink-0">
              <h3 className="font-serif text-[#031838] text-[28px] sm:text-[36px] lg:text-[44px] font-normal tracking-[0.01em] leading-tight m-0">MANISH &amp; CO</h3>
              <h2 className="font-serif text-[#031838] text-[56px] sm:text-[72px] lg:text-[84px] font-extrabold tracking-[0.02em] leading-none mt-1 sm:mt-2 mb-0">Promise</h2>
            </div>
            
            <div className="w-full lg:w-1/2 grid grid-cols-3 gap-y-10 sm:gap-y-12 gap-x-4 sm:gap-x-8 md:gap-x-12 justify-items-center text-center">
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <span className="text-[8px] sm:text-[10px] tracking-widest uppercase opacity-75 font-semibold font-sans">SINCE</span>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold font-serif tracking-wider mt-0.5">1952</span>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Artisanal Heritage of Mau</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">100% Certified Jewellery</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Lifetime Exchange &amp; Buyback</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Guaranteed Purity &amp; Value</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">100% Transparency</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Free Shipping</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Authentic Rajputi Ornaments</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><polygon points="23 7 16 12 23 17 23 7" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Personalised Video Consultations</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">BIS 916 Hallmarked Gold</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Custom Design Request Modal */}
      <Modal
        isOpen={customDesignOpen}
        onClose={() => setCustomDesignOpen(false)}
        title="Create Custom Design"
        size="md"
      >
        <BookingForm 
          type="custom_design" 
          onSuccess={() => setCustomDesignOpen(false)} 
        />
      </Modal>

      {/* Consultation Booking Modal */}
      <Modal
        isOpen={consultationModal}
        onClose={() => setConsultationModal(false)}
        title="Book Live Video Consultation"
        size="md"
      >
        <BookingForm 
          type="consultation" 
          onSuccess={() => setConsultationModal(false)} 
        />
      </Modal>
    </div>
  );
}
