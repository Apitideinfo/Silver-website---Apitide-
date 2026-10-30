import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { useRates } from '../hooks/useRates';
import Modal from '../components/Modal';
import BookingForm from '../forms/BookingForm';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { ShieldCheck, Gem, Truck, Package, ArrowRight, Star, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

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
import silverPayalsImg from '../assets/silver_payals.png';
import citrineFloralSet from '../assets/citrine_floral_set.png';
import nathNosePinImg from '../assets/nath_nose_pin.png';
import jhumkasImg from '../assets/jhumkas.png';
import EditorialShowcaseSection from '../components/EditorialShowcaseSection';
import { getShowcaseSectionsConfig } from '../config/showcaseSections';
import { INITIAL_CATEGORIES } from '../config/constants';
import { priceCategoryService, getColorStyles } from '../services/priceCategoryService';


// Editorial Collection Showcase (01 Men's, 02 Women's, 03 Kid's, 04 Gift's)

// Testimonial Images
import testimonial1 from '../assets/testimonial_1.png';
import testimonial2 from '../assets/testimonial_2.png';
import testimonial3 from '../assets/testimonial_3.png';
import testimonial4 from '../assets/testimonial_4.png';

// Banners & Collections
import midnightSapphireHero from '../assets/midnight_sapphire_hero.png';
import midnightSapphireHeroWebp from '../assets/midnight_sapphire_hero.webp';
import colRings from '../assets/col_rings.png';
import colBracelets from '../assets/col_bracelets.png';
import colPendants from '../assets/col_pendants.png';
import colChains from '../assets/col_chains.png';
import bannerBuiltOnPurity from '../assets/built_on_purity_925_fine_silver.png';
import bannerCraftsmanshipJourney from '../assets/craftsmanship_in_every_silver_detail.png';
import bannerStoreBanner from '../assets/banner_store_banner.png';
import bannerPureSilverCollection from '../assets/banner_pure_silver_collection.png';
import madePersonalSketch from '../assets/made_personal_sketch.jpg';
import gemsCollectionBanner from '../assets/gems_collection_banner.jpg';
import goldPlatingBanner from '../assets/gold_plating_banner.jpg';



const getCategoryFallbackImage = (catNameOrId) => {
  const norm = String(catNameOrId || '').toLowerCase().replace(/\s+/g, '');
  if (norm.includes('bangle')) return kadaImg;
  if (norm.includes('bracelet')) return diamondBracelet;
  if (norm.includes('jhumka')) return jhumkasImg;
  if (norm.includes('earring')) return sapphireHeritageSet;
  if (norm.includes('kada')) return goldKada;
  if (norm.includes('necklace') || norm.includes('choker')) return necklacesImg;
  if (norm.includes('payal') || norm.includes('anklet')) return silverPayalsImg;
  if (norm.includes('pendant') || norm.includes('locket')) return pendantsImg;
  if (norm.includes('ring')) return ringsImg;
  if (norm.includes('chain')) return goldChainsImg;
  if (norm.includes('nath')) return nathNosePinImg;
  if (norm.includes('top') || norm.includes('stud') || norm.includes('nose')) return nosePinsImg;
  if (norm.includes('mangalsutra')) return mangalsutrasImg;
  if (norm.includes('coin') || norm.includes('bullion')) return goldCoinsImg;
  if (norm.includes('solitaire') || norm.includes('diamond')) return solitariesImg;
  if (norm.includes('watch')) return watchJewelleryImg;
  if (norm.includes('men')) return mensJewelleryImg;
  if (norm.includes('kids') || norm.includes('child')) return kidsJewelleryImg;
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

  // Dynamic Price / Budget Categories ("Gol Categories" - Under 199, Under 229, Under 299 etc.)
  const [priceCategories, setPriceCategories] = useState(() => priceCategoryService.getStoredCategories());

  useEffect(() => {
    priceCategoryService.fetchRemoteCategories().then((res) => {
      if (res && res.length > 0) setPriceCategories(res);
    });

    const handlePriceCategoriesUpdate = () => {
      setPriceCategories(priceCategoryService.getStoredCategories());
    };

    window.addEventListener('manish_price_categories_updated', handlePriceCategoriesUpdate);
    return () => {
      window.removeEventListener('manish_price_categories_updated', handlePriceCategoriesUpdate);
    };
  }, []);


  // Combined dynamic categories with baseline reference set (all 10+ reference categories)
  const displayCategories = React.useMemo(() => {
    const list = (Array.isArray(categories) && categories.length > 0) ? [...categories] : [...INITIAL_CATEGORIES];
    INITIAL_CATEGORIES.forEach((base) => {
      const exists = list.some(c =>
        (c.id && c.id.toLowerCase() === base.id.toLowerCase()) ||
        (c.name && c.name.toLowerCase() === base.name.toLowerCase())
      );
      if (!exists) {
        list.push(base);
      }
    });
    return list;
  }, [categories]);

  // Lower Recommendations Carousel Scrolling Refs & Autoplay
  const categoriesScrollRef = useRef(null);
  const categoriesAutoplayRef = useRef(null);


  // Polaroid Testimonials Refs & Progress State
  const testimonialsRef = useRef(null);
  const [testimonialsInView, setTestimonialsInView] = useState(false);
  const polaroidScrollRef = useRef(null);
  const [polaroidScrollProgress, setPolaroidScrollProgress] = useState(0);

  // Story & Process States
  const activeCategories = displayCategories;
  const [activeStoryTimeline, setActiveStoryTimeline] = useState(1996);
  const [timelineDirection, setTimelineDirection] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);


  // Lower Recommendations Autoplay (if needed)
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
        TOP ACTION BAR: CUSTOM DESIGNS + BOOK AN APPOINTMENT
        (Sticky at very top, above all sections)
        ========================================================== */}
      <div className="w-full bg-[#050B14] border-b border-white/10 py-3 px-4 sm:px-8 lg:px-14 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 z-30 relative">
        <p className="text-[#C5A880] text-[11px] sm:text-xs font-sans font-semibold tracking-[0.22em] uppercase text-center shrink-0">
          ✦ Bespoke Silver Jewellery — Made Just For You ✦
        </p>
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          {/* Custom Designs Button */}
          <button
            onClick={() => {
              triggerAudio('click');
              setCustomDesignOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#8C6D46] hover:bg-[#A37B4D] active:scale-95 text-white font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(140,109,70,0.35)] cursor-pointer rounded-[2px]"
            aria-label="Send Custom Design Request on WhatsApp"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.037L2 22l5.135-1.348a9.954 9.954 0 004.878 1.28c5.505 0 9.988-4.478 9.989-9.984 0-2.67-1.037-5.18-2.925-7.07C17.186 3.037 14.678 2 12.012 2zm5.727 14.153c-.313.882-1.554 1.61-2.148 1.666-.59.055-1.18.326-3.766-.694-2.585-1.02-4.237-3.663-4.364-3.834-.127-.171-1.03-1.374-1.03-2.623 0-1.25.654-1.862.887-2.102.233-.24.509-.3.678-.3.17 0 .34 0 .487.007.155.007.363-.058.567.442.204.5.7 1.713.76 1.838.06.126.1.272.017.438-.083.166-.124.272-.25.418-.125.146-.263.327-.375.44-.124.125-.253.26-.11.507.144.247.64 1.056 1.373 1.71.942.843 1.737 1.103 1.983 1.226.246.123.39.103.535-.062.145-.165.62-.72.787-.966.166-.247.33-.206.555-.124.225.083 1.427.674 1.674.8.247.124.412.185.472.289.06.103.06.6-.253 1.482z" />
            </svg>
            <span>Custom Designs</span>
          </button>

          {/* Book an Appointment Button */}
          <button
            onClick={() => {
              triggerAudio('click');
              setConsultationModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2 border border-[#C5A880]/60 hover:border-[#C5A880] hover:bg-white/5 text-[#C5A880] font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer rounded-[2px] active:scale-95"
            aria-label="Book an Appointment"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* ==========================================================
        SECTION 01: LUXURY HERO SECTION - MORE THAN JEWELLERY
        (Production-Ready: High-Performance WebP + Framer Motion Stagger + Polished Typography & Trust Badges)
        ========================================================== */}
      <section 
        id="hero-section"
        aria-label="Manish & Co Fine Jewellery Introduction" 
        className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] xl:min-h-[760px] overflow-hidden select-none bg-[#050B14] flex items-center"
      >
        {/* Background Still Life Image with High-Performance <picture> */}
        <div className="absolute inset-0 w-full h-full">
          <picture className="w-full h-full block">
            <source srcSet={midnightSapphireHeroWebp} type="image/webp" />
            <img
              src={midnightSapphireHero}
              alt="MANISH & CO - 925 Fine Silver Jewellery"
              className="w-full h-full object-cover object-right sm:object-center select-none pointer-events-none transition-transform duration-1000 ease-out will-change-transform"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          
          {/* Desktop Left-to-Right Dark Gradient for Crisp Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-[#050B14]/85 to-transparent w-full md:w-[70%] lg:w-[62%] pointer-events-none" />
          
          {/* Mobile Bottom-up & Subtle Dark Vignette for 100% Mobile Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/60 to-transparent sm:hidden pointer-events-none" />
          <div className="absolute inset-0 bg-[#050B14]/30 sm:bg-transparent pointer-events-none" />

          {/* Luxury Ambient Shimmer Particles (Top Glint) */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Animated Golden & Silver Stardust Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[
              { top: '15%', left: '8%', size: 'w-2 h-2', delay: 0, duration: 4.5 },
              { top: '28%', left: '38%', size: 'w-1.5 h-1.5', delay: 1, duration: 5 },
              { top: '62%', left: '18%', size: 'w-2 h-2', delay: 0.6, duration: 4.2 },
              { top: '22%', left: '72%', size: 'w-2.5 h-2.5', delay: 1.4, duration: 3.8 },
              { top: '70%', left: '65%', size: 'w-1.5 h-1.5', delay: 2.1, duration: 5.5 },
              { top: '45%', left: '88%', size: 'w-2 h-2', delay: 0.9, duration: 4.8 },
              { top: '80%', left: '40%', size: 'w-1.5 h-1.5', delay: 1.8, duration: 4.0 },
            ].map((p, i) => (
              <motion.div
                key={i}
                className={`absolute ${p.size} rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF5DC] shadow-[0_0_12px_#D4AF37]`}
                style={{ top: p.top, left: p.left }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.25, 0.95, 0.25],
                  scale: [0.75, 1.35, 0.75],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: p.delay,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Left Content Container with Framer-Motion Staggered Entrance */}
        <div className="relative z-10 max-w-[1536px] w-full mx-auto px-6 sm:px-10 lg:px-14 py-14 sm:py-16 lg:py-20 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[640px] text-left"
          >
            
            {/* Animated Royal Welcome Badge (Client Feedback #5: Welcome Animation) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C5A880]/25 via-[#C5A880]/10 to-transparent border border-[#C5A880]/40 backdrop-blur-md mb-4 sm:mb-5 shadow-[0_4px_20px_rgba(197,168,128,0.2)] group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5C396] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.28em] text-[#E5C396] uppercase">
                WELCOME TO MANISH &amp; CO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-center gap-2 mb-3 sm:mb-4"
            >
              <span className="text-[#C5A880] text-xs font-serif select-none">✦</span>
              <span className="inline-block text-[#C5A880] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase">
                TIMELESS BY NATURE • ESTD. 1996
              </span>
            </motion.div>

            {/* Main Luxury Headline with Shimmering Gradient and Presence */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-[72px] xl:text-[80px] font-bold uppercase text-white leading-[1.02] tracking-[0.03em] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
            >
              MORE THAN<br />
              <span className="bg-gradient-to-r from-white via-[#F5E6D3] to-white bg-clip-text text-transparent">
                JEWELLERY
              </span>
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              className="text-gray-200 text-xs sm:text-sm lg:text-[15px] font-sans font-medium tracking-[0.18em] uppercase mt-4 sm:mt-5 mb-7 sm:mb-9 leading-relaxed max-w-[480px]"
            >
              925 FINE SILVER JEWELLERY<br className="hidden sm:inline" /> FOR A MODERN YOU
            </motion.p>

            {/* Action Buttons Row */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4"
            >
              {/* Primary Bronze CTA */}
              <button
                onClick={() => {
                  triggerAudio('click');
                  changeCategoryTab?.('Collections');
                  navigateTo('collections');
                }}
                aria-label="Explore 925 fine silver jewellery collections"
                className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#8C6D46] hover:bg-[#A37B4D] active:scale-[0.98] text-white font-sans text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_8px_25px_rgba(140,109,70,0.4)] hover:shadow-[0_12px_32px_rgba(140,109,70,0.6)] cursor-pointer rounded-[2px] overflow-hidden"
              >
                {/* Light Sweep Shimmer Sheen */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                <span className="relative z-10">EXPLORE COLLECTIONS</span>
                <span className="relative z-10 text-base font-light transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </button>

              {/* Secondary Clean Editorial Scroll Button */}
              <button
                onClick={() => {
                  triggerAudio('click');
                  const colElem = document.getElementById('our-collections');
                  if (colElem) {
                    colElem.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    changeCategoryTab?.('Collections');
                    navigateTo('collections');
                  }
                }}
                aria-label="Scroll to discover collections"
                className="hidden sm:inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 hover:border-[#C5A880]/70 text-gray-300 hover:text-white font-sans text-xs sm:text-sm font-medium tracking-[0.16em] uppercase transition-all duration-300 hover:bg-white/[0.04] cursor-pointer rounded-[2px]"
              >
                <span>OUR CRAFT</span>
                <span className="text-xs text-[#C5A880]">↓</span>
              </button>
            </motion.div>

            {/* Value Proposition Trust Badges (Production Polish: Micro-cards, High-DPI icons, Glassmorphic Hover) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-white/10 mt-8 sm:mt-12"
              role="list"
              aria-label="Value propositions"
            >
              {/* Badge 1: 925 Pure Silver */}
              <div 
                role="listitem"
                className="group/badge flex items-center gap-2.5 p-2 rounded transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/5 group-hover/badge:border-[#C5A880]/30 transition-colors">
                  <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#C5A880] group-hover/badge:text-[#DFC6A4] transition-colors" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white text-xs sm:text-[13px] font-bold leading-tight font-sans tracking-wide">925</span>
                  <span className="text-gray-400 group-hover/badge:text-gray-300 text-[10px] sm:text-[11px] leading-tight font-sans transition-colors">Pure Silver</span>
                </div>
              </div>

              {/* Badge 2: Premium Craftsmanship */}
              <div 
                role="listitem"
                className="group/badge flex items-center gap-2.5 p-2 rounded transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/5 group-hover/badge:border-[#C5A880]/30 transition-colors">
                  <Gem className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#C5A880] group-hover/badge:text-[#DFC6A4] transition-colors" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white text-xs sm:text-[13px] font-bold leading-tight font-sans tracking-wide">Premium</span>
                  <span className="text-gray-400 group-hover/badge:text-gray-300 text-[10px] sm:text-[11px] leading-tight font-sans transition-colors">Craftsmanship</span>
                </div>
              </div>

              {/* Badge 3: Pan India Delivery */}
              <div 
                role="listitem"
                className="group/badge flex items-center gap-2.5 p-2 rounded transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/5 group-hover/badge:border-[#C5A880]/30 transition-colors">
                  <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#C5A880] group-hover/badge:text-[#DFC6A4] transition-colors" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white text-xs sm:text-[13px] font-bold leading-tight font-sans tracking-wide">Pan India</span>
                  <span className="text-gray-400 group-hover/badge:text-gray-300 text-[10px] sm:text-[11px] leading-tight font-sans transition-colors">Delivery</span>
                </div>
              </div>

              {/* Badge 4: Secure Packaging */}
              <div 
                role="listitem"
                className="group/badge flex items-center gap-2.5 p-2 rounded transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/5 group-hover/badge:border-[#C5A880]/30 transition-colors">
                  <Package className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#C5A880] group-hover/badge:text-[#DFC6A4] transition-colors" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white text-xs sm:text-[13px] font-bold leading-tight font-sans tracking-wide">Secure</span>
                  <span className="text-gray-400 group-hover/badge:text-gray-300 text-[10px] sm:text-[11px] leading-tight font-sans transition-colors">Packaging</span>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#E6DFD3] relative z-20" />

      {/* Main Content Area (White/Ivory background) */}
      <div className="bg-[#F8F5EC] text-[#202329] transition-colors duration-500 !mt-0">

        {/* ==========================================================
          ANIMATED LUXURY MARQUEE TICKER (Continuous moving sheen)
          ========================================================== */}
        <div className="w-full bg-[#071322] border-y border-[#C5A880]/30 py-3 overflow-hidden select-none relative z-20 shadow-inner">
          <div className="flex animate-marquee-smooth whitespace-nowrap gap-8 text-[11px] sm:text-xs font-sans font-bold tracking-[0.25em] uppercase text-[#E5C396]">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span>✦ 100% BIS 925 HALLMARKED PURE SILVER</span>
                <span className="text-[#8C6D46]">•</span>
                <span>ESTD. 1996 ATELIER • MAU HERITAGE</span>
                <span className="text-[#8C6D46]">•</span>
                <span>BESPOKE CUSTOM DESIGNS VIA WHATSAPP</span>
                <span className="text-[#8C6D46]">•</span>
                <span>INSURED PAN-INDIA DOORSTEP DELIVERY</span>
                <span className="text-[#8C6D46]">•</span>
                <span>LIFETIME EXCHANGE &amp; BUYBACK</span>
                <span className="text-[#8C6D46]">•</span>
              </span>
            ))}
          </div>
        </div>

{/* ==========================================================
          CLIENT FEEDBACK SECTION 2: CUSTOM DESIGNS (Screenshot 2 Match)
          "MADE PERSONAL: Your Idea. Your Jewellery."
          ========================================================== */}
        <section 
          id="custom-designs-made-personal" 
          className="w-full bg-[#050B14] py-14 sm:py-20 lg:py-24 border-b border-white/10 select-none relative overflow-hidden text-left"
        >
          {/* Subtle Golden Mandala Corner Watermark */}
          <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-[#C5A880]/5 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#C5A880]/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Editorial Headline & Actions (Screenshot 2 Exact) */}
              <div className="lg:col-span-5 text-left">
                {/* Eyebrow */}
                <span className="inline-block text-[#C5A880] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-3 sm:mb-4">
                  MADE PERSONAL
                </span>

                {/* Main Headline */}
                <h2 
                  className="text-3xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-bold text-white leading-[1.05] mb-4 sm:mb-6"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                >
                  Your Idea.<br />
                  Your Jewellery.
                </h2>

                {/* Subtitle Description */}
                <p className="text-gray-300 text-xs sm:text-sm lg:text-[15px] font-sans font-normal leading-relaxed mb-8 sm:mb-10 max-w-[440px]">
                  Create a custom piece or meet us for a personal appointment to bring your vision to life.
                </p>

                {/* Two Action Buttons (Screenshot 2 Exact Design) */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {/* Button 1: CUSTOM DESIGNS -> (Outlined) */}
                  <button
                    onClick={() => {
                      setCustomDesignOpen(true);
                    }}
                    className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 border border-[#B09A82] hover:border-white text-white font-sans text-xs sm:text-[13px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 hover:bg-white/10 cursor-pointer rounded-none active:scale-95"
                  >
                    <span>CUSTOM DESIGNS</span>
                    <span className="text-sm font-light">→</span>
                  </button>

                  {/* Button 2: BOOK AN APPOINTMENT -> (Filled Gold) */}
                  <button
                    onClick={() => {
                      setConsultationModal(true);
                    }}
                    className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#8C6D46] hover:bg-[#A37B4D] text-white font-sans text-xs sm:text-[13px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-[0_8px_25px_rgba(140,109,70,0.4)] cursor-pointer rounded-none active:scale-95"
                  >
                    <span>BOOK AN APPOINTMENT</span>
                    <span className="text-sm font-light">→</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Atelier Sketch Workbench Photo (Screenshot 2 Exact) */}
              <div className="lg:col-span-7">
                <div className="relative rounded-[2px] overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                  <img 
                    src={madePersonalSketch} 
                    alt="Atelier Sketch Desk - Made Personal: Your Idea. Your Jewellery."
                    className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Atelier Badge */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-[#050B14]/85 backdrop-blur-md p-3.5 sm:p-4 border border-white/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#C5A880] uppercase tracking-[0.2em] font-semibold block">
                        HANDCRAFTED BESPOKE ATELIER
                      </span>
                      <p className="text-xs sm:text-sm text-white font-serif font-medium mt-0.5">
                        Master Silversmith Consultation • 3D CAD Mockup • BIS 925 Hallmark
                      </p>
                    </div>
                    <span className="hidden sm:inline-block text-[#C5A880] text-lg font-serif">✦</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
{/* ==========================================================
          EDITORIAL SHOWCASES (01-06: HIM, HER, KIDS, GIFTS, COUPLES, ACCESSORIES)
          Refactored into clean modular components for peak performance
          ========================================================== */}
        {getShowcaseSectionsConfig({ navigateTo, changeCategoryTab, setCustomDesignOpen }).map((sec) => (
          <EditorialShowcaseSection
            key={sec.id}
            {...sec}
            triggerAudio={triggerAudio}
            navigateTo={navigateTo}
            changeCategoryTab={changeCategoryTab}
            setGenderFilter={setGenderFilter}
          />
        ))}

{/* ==========================================================
          CLIENT FEEDBACK SECTION 4: GEMS COLLECTION (Feedback #10)
          ========================================================== */}
        <section id="gems-collection-section" className="w-full py-14 sm:py-20 bg-[#050B14] border-b border-white/10 select-none text-left text-white">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            
            {/* Editorial Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div>
                <span className="inline-block text-[#C5A880] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-2">
                  PRECIOUS &amp; NATURAL STONES
                </span>
                <h2 
                  className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-white leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                >
                  Gems Collection
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm font-sans mt-2 max-w-xl font-normal leading-relaxed">
                  Certified Royal Blue Sapphires, Zambian Emeralds, Burmese Rubies, and Tanzanites hand-set in hallmarked 925 fine silver.
                </p>
              </div>

              <button
                onClick={() => {
                  changeCategoryTab?.('Collections');
                  navigateTo('collections');
                }}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#8C6D46] hover:bg-[#A37B4D] active:scale-95 text-white font-sans text-xs sm:text-[12.5px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_8px_25px_rgba(140,109,70,0.35)] cursor-pointer rounded-none"
              >
                <span>EXPLORE ALL GEMS</span>
                <span className="text-sm font-light">→</span>
              </button>
            </div>

            {/* Gems Showcase Banner with 4 Gem Types */}
            <div className="relative rounded-[2px] overflow-hidden border border-white/15 shadow-2xl group mb-8">
              <img 
                src={gemsCollectionBanner} 
                alt="Sapphire, Emerald, Ruby & Tanzanite 925 Silver Jewellery"
                className="w-full h-auto max-h-[460px] object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/85 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-10 sm:right-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div>
                  <span className="text-[#E5C396] text-xs font-sans font-bold tracking-[0.25em] uppercase block mb-1">
                    ✦ CERTIFIED NATURAL GEMSTONES
                  </span>
                  <h3 
                    className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-md text-white"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    Earth's Rarest Hues. Forged in Pure Silver.
                  </h3>
                </div>
              </div>
            </div>

            {/* 4 Gemstone Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: 'Royal Sapphire', stone: 'Neelam', desc: 'Symbol of wisdom, regal grace & focus' },
                { name: 'Zambian Emerald', stone: 'Panna', desc: 'Lush green harmony & prosperous clarity' },
                { name: 'Burmese Ruby', stone: 'Manik', desc: 'Fiery passion, courage & noble power' },
                { name: 'Royal Tanzanite', stone: 'Tanzanite', desc: 'Rare deep indigo African treasure' }
              ].map((gem, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    changeCategoryTab?.('Collections');
                    navigateTo('collections');
                  }}
                  className="p-4 sm:p-5 bg-white/5 border border-white/10 hover:border-[#C5A880]/60 transition-all duration-300 cursor-pointer group hover:bg-white/10"
                >
                  <span className="text-[#C5A880] text-[10px] font-sans font-bold tracking-[0.2em] uppercase block mb-1">
                    {gem.stone}
                  </span>
                  <h4 
                    className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-[#E5C396] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    {gem.name}
                  </h4>
                  <p className="text-gray-400 text-xs font-sans mt-1.5 leading-relaxed">
                    {gem.desc}
                  </p>
                  <span className="text-[#C5A880] text-[11px] font-sans font-semibold tracking-wider uppercase mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Shop Jewels</span>
                    <span>→</span>
                  </span>
                </div>
              ))}
            </div>

          </div>
        </section>

{/* ==========================================================
          CLIENT FEEDBACK SECTION 3: GOLD PLATING (Feedback #6.2)
          ========================================================== */}
        <section id="gold-plating-section" className="w-full py-14 sm:py-20 bg-[#F5ECE4] border-b border-[#E8DFD5] select-none text-left">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            
            {/* Editorial Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div>
                <span className="inline-block text-[#8C6D46] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-2">
                  18K DUAL TONE ROYALTY
                </span>
                <h2 
                  className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#1A1817] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                >
                  Gold Plating Collection
                </h2>
                <p className="text-[#6F6862] text-xs sm:text-sm font-sans mt-2 max-w-xl font-normal leading-relaxed">
                  Rich 18K yellow gold layered seamlessly over solid 925 sterling silver. Anti-tarnish, skin-friendly, and designed for royal radiance.
                </p>
              </div>

              <button
                onClick={() => {
                  changeCategoryTab?.('Collections');
                  navigateTo('collections');
                }}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#785B3C] hover:bg-[#8F6D48] active:scale-95 text-white font-sans text-xs sm:text-[12.5px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(120,91,60,0.25)] cursor-pointer rounded-none"
              >
                <span>SHOP GOLD PLATED</span>
                <span className="text-sm font-light">→</span>
              </button>
            </div>

            {/* Showcase Visual: Large 16:9 Gold Plating Banner with 3 Feature Badges */}
            <div className="relative rounded-[2px] overflow-hidden border border-[#D6CABE] shadow-xl group mb-8">
              <img 
                src={goldPlatingBanner} 
                alt="18K Gold Plated 925 Sterling Silver Jewellery"
                className="w-full h-auto max-h-[460px] object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-10 sm:right-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-white">
                <div>
                  <span className="text-[#F5D77F] text-xs font-sans font-bold tracking-[0.25em] uppercase block mb-1">
                    ✦ 18 KARAT YELLOW GOLD VERMEIL
                  </span>
                  <h3 
                    className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-md"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    The Warmth of Gold. The Purity of Silver.
                  </h3>
                </div>
                <div className="flex items-center gap-6 text-xs sm:text-sm font-sans tracking-wide text-white/90">
                  <span>• 18K Micron Plating</span>
                  <span>• 925 Core</span>
                  <span>• Lifetime Buyback</span>
                </div>
              </div>
            </div>

          </div>
        </section>

{/* ==========================================================
          CLIENT FEEDBACK SECTION 5: BUDGET TIERS (Feedback #6.3, 6.4, 6.5)
          - UNDER 499
          - UNDER 999
          - UNDER 1999
          ========================================================== */}
        <section id="curated-budget-tiers" className="w-full py-14 sm:py-20 bg-[#FDFBF7] border-b border-[#EAE3D9] select-none text-left">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="inline-block text-[#8C6D46] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-2">
                AFFORDABLE 925 LUXURY
              </span>
              <h2 
                className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#1A1817] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                Shop by Budget
              </h2>
              <p className="text-[#6F6862] text-xs sm:text-sm font-sans mt-2 font-normal">
                Pure 925 sterling silver crafted to shine within your everyday celebration budget.
              </p>
            </div>

            {/* 3 Budget Tier Showcase Cards (Under 499, Under 999, Under 1999) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Tier 1: Under 499 */}
              <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-[#F9F6F0] border border-[#E8DFD5] hover:border-[#8C6D46] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(140,109,70,0.15)] transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-[#8C6D46]/10 text-[#8C6D46] text-[10px] font-sans font-bold tracking-[0.2em] uppercase rounded-full">
                      POCKET LUXURY
                    </span>
                    <span className="text-xs text-gray-500 font-sans">BIS 925 Pure</span>
                  </div>
                  <h3 
                    className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1817] group-hover:text-[#8C6D46] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    Under ₹499
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6F6862] font-sans mt-2.5 leading-relaxed">
                    Minimalist 925 silver rings, nose pins, auspicious tokens, and silver charms for daily grace.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-sans text-[#5A5550]">
                    <li className="flex items-center gap-2">✦ Minimalist Silver Bands</li>
                    <li className="flex items-center gap-2">✦ Hallmarked Nose Pins &amp; Studs</li>
                    <li className="flex items-center gap-2">✦ Auspicious Charms &amp; Coins</li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[#EAE3D9]">
                  <button
                    onClick={() => {
                      if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(499);
                      changeCategoryTab?.('Collections');
                      navigateTo('collections');
                    }}
                    className="w-full py-3.5 bg-[#1A1817] group-hover:bg-[#8C6D46] text-white font-sans text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>EXPLORE UNDER ₹499</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Tier 2: Under 999 */}
              <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-[#F9F6F0] border-2 border-[#8C6D46] shadow-[0_8px_30px_rgba(140,109,70,0.18)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#8C6D46] text-white text-[9px] font-sans font-bold tracking-[0.2em] uppercase px-3 py-1">
                  POPULAR
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-[#8C6D46] text-white text-[10px] font-sans font-bold tracking-[0.2em] uppercase rounded-full">
                      EVERYDAY ELEGANCE
                    </span>
                    <span className="text-xs text-gray-500 font-sans">BIS 925 Pure</span>
                  </div>
                  <h3 
                    className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1817] group-hover:text-[#8C6D46] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    Under ₹999
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6F6862] font-sans mt-2.5 leading-relaxed">
                    Certified 925 silver pendants, nazariya bracelets, statement hoop earrings, and delicate chains.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-sans text-[#5A5550]">
                    <li className="flex items-center gap-2">✦ Solitaire &amp; Floral Pendants</li>
                    <li className="flex items-center gap-2">✦ Nazariya &amp; Charm Bracelets</li>
                    <li className="flex items-center gap-2">✦ Oxidised Jhumkis &amp; Hoops</li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[#EAE3D9]">
                  <button
                    onClick={() => {
                      if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(999);
                      changeCategoryTab?.('Collections');
                      navigateTo('collections');
                    }}
                    className="w-full py-3.5 bg-[#8C6D46] hover:bg-[#A37B4D] text-white font-sans text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>EXPLORE UNDER ₹999</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Tier 3: Under 1999 */}
              <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-[#F9F6F0] border border-[#E8DFD5] hover:border-[#8C6D46] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(140,109,70,0.15)] transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-[#8C6D46]/10 text-[#8C6D46] text-[10px] font-sans font-bold tracking-[0.2em] uppercase rounded-full">
                      ROYAL ATTIRE
                    </span>
                    <span className="text-xs text-gray-500 font-sans">BIS 925 Pure</span>
                  </div>
                  <h3 
                    className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1817] group-hover:text-[#8C6D46] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    Under ₹1999
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6F6862] font-sans mt-2.5 leading-relaxed">
                    Heavy masculine chains, engraved Rajasthani kadas, traditional payals, and gem cocktail rings.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-sans text-[#5A5550]">
                    <li className="flex items-center gap-2">✦ Solid Curb &amp; Rope Silver Chains</li>
                    <li className="flex items-center gap-2">✦ Hand-hammered Silver Kadas</li>
                    <li className="flex items-center gap-2">✦ Bridal Ghungroo Payals &amp; Chokers</li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[#EAE3D9]">
                  <button
                    onClick={() => {
                      if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(1999);
                      changeCategoryTab?.('Collections');
                      navigateTo('collections');
                    }}
                    className="w-full py-3.5 bg-[#1A1817] group-hover:bg-[#8C6D46] text-white font-sans text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>EXPLORE UNDER ₹1999</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>



        <section id="our-collections" className="w-full py-12 sm:py-16 lg:py-20 bg-[#F5ECE4] border-b border-[#E8DFD5] select-none">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
              
              {/* Left Column: Editorial Brand Headline */}
              <div className="w-full lg:w-[32%] xl:w-[28%] shrink-0 text-left">
                {/* Eyebrow */}
                <span className="inline-block text-[#8C6D46] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-3 sm:mb-4">
                  OUR COLLECTIONS
                </span>

                {/* Main Serif Headline */}
                <h2 
                  className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-[#1A1817] leading-[1.08] mb-4 sm:mb-5"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                >
                  Crafted for<br />
                  Every Moment
                </h2>

                {/* Subtitle Paragraph */}
                <p className="text-[#5A5550] text-sm sm:text-[14.5px] font-sans font-normal leading-relaxed mb-7 sm:mb-8 max-w-[340px]">
                  Explore our finely crafted 925 silver jewellery designed for everyday elegance and lasting value.
                </p>

                {/* Solid Bronze CTA Button */}
                <div>
                  <button
                    onClick={() => {
                      triggerAudio('click');
                      changeCategoryTab?.('Collections');
                      navigateTo('collections');
                    }}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#785B3C] hover:bg-[#8F6D48] active:scale-95 text-white font-sans text-xs sm:text-[12.5px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(120,91,60,0.25)] cursor-pointer rounded-none"
                  >
                    <span>SHOP ALL</span>
                    <span className="text-sm font-light">→</span>
                  </button>
                </div>
              </div>

              {/* Right Column: 4 Collection Category Cards */}
              <div className="w-full lg:flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                
                {/* Card 1: RINGS */}
                <div
                  onClick={() => {
                    triggerAudio('click');
                    changeCategoryTab?.('Rings');
                    navigateTo('collections');
                  }}
                  className="group cursor-pointer flex flex-col items-center text-center select-none"
                >
                  <div className="w-full aspect-[148/169] overflow-hidden bg-black/5 shadow-sm relative">
                    <img
                      src={colRings}
                      alt="RINGS - MANISH & CO"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <h3 className="font-sans font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#1A1817] mt-3 group-hover:text-[#8C6D46] transition-colors">
                    RINGS
                  </h3>
                  <span className="text-[11px] sm:text-xs text-[#6F6862] group-hover:text-[#8C6D46] group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1 mt-0.5 font-normal">
                    <span>Shop Now</span>
                    <span className="text-xs">→</span>
                  </span>
                </div>

                {/* Card 2: BRACELETS */}
                <div
                  onClick={() => {
                    triggerAudio('click');
                    changeCategoryTab?.('Bracelets');
                    navigateTo('collections');
                  }}
                  className="group cursor-pointer flex flex-col items-center text-center select-none"
                >
                  <div className="w-full aspect-[148/169] overflow-hidden bg-black/5 shadow-sm relative">
                    <img
                      src={colBracelets}
                      alt="BRACELETS - MANISH & CO"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <h3 className="font-sans font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#1A1817] mt-3 group-hover:text-[#8C6D46] transition-colors">
                    BRACELETS
                  </h3>
                  <span className="text-[11px] sm:text-xs text-[#6F6862] group-hover:text-[#8C6D46] group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1 mt-0.5 font-normal">
                    <span>Shop Now</span>
                    <span className="text-xs">→</span>
                  </span>
                </div>

                {/* Card 3: PENDANTS */}
                <div
                  onClick={() => {
                    triggerAudio('click');
                    changeCategoryTab?.('Pendants');
                    navigateTo('collections');
                  }}
                  className="group cursor-pointer flex flex-col items-center text-center select-none"
                >
                  <div className="w-full aspect-[148/169] overflow-hidden bg-black/5 shadow-sm relative">
                    <img
                      src={colPendants}
                      alt="PENDANTS - MANISH & CO"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <h3 className="font-sans font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#1A1817] mt-3 group-hover:text-[#8C6D46] transition-colors">
                    PENDANTS
                  </h3>
                  <span className="text-[11px] sm:text-xs text-[#6F6862] group-hover:text-[#8C6D46] group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1 mt-0.5 font-normal">
                    <span>Shop Now</span>
                    <span className="text-xs">→</span>
                  </span>
                </div>

                {/* Card 4: CHAINS */}
                <div
                  onClick={() => {
                    triggerAudio('click');
                    changeCategoryTab?.('Chains');
                    navigateTo('collections');
                  }}
                  className="group cursor-pointer flex flex-col items-center text-center select-none"
                >
                  <div className="w-full aspect-[148/169] overflow-hidden bg-black/5 shadow-sm relative">
                    <img
                      src={colChains}
                      alt="CHAINS - MANISH & CO"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <h3 className="font-sans font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#1A1817] mt-3 group-hover:text-[#8C6D46] transition-colors">
                    CHAINS
                  </h3>
                  <span className="text-[11px] sm:text-xs text-[#6F6862] group-hover:text-[#8C6D46] group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1 mt-0.5 font-normal">
                    <span>Shop Now</span>
                    <span className="text-xs">→</span>
                  </span>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ==========================================================
          CLIENT FEEDBACK SECTION 1: BEST SELLERS (Feedback #6.1)
          ========================================================== */}
        <section id="best-sellers" className="w-full py-14 sm:py-20 bg-[#FDFBF7] border-b border-[#EAE3D9] select-none">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            
            {/* Editorial Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-12">
              <div className="text-left">
                <span className="inline-block text-[#8C6D46] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-2">
                  CURATED PATRON FAVORITES
                </span>
                <h2 
                  className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#1A1817] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                >
                  Best Sellers
                </h2>
                <p className="text-[#6F6862] text-xs sm:text-sm font-sans mt-2 max-w-xl font-normal">
                  Our most cherished BIS hallmarked 925 sterling silver creations, celebrated by over 25,000 patrons across India.
                </p>
              </div>

              <button
                onClick={() => {
                  changeCategoryTab?.('Collections');
                  navigateTo('collections');
                }}
                className="text-[#1A1817] hover:text-[#8C6D46] font-sans text-xs sm:text-[13px] font-semibold tracking-[0.18em] uppercase inline-flex items-center gap-2 transition-colors cursor-pointer group shrink-0"
              >
                <span>Explore All Icons</span>
                <span className="text-sm font-light transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </button>
            </div>

            {/* 4 Best Seller Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
              {[
                {
                  id: 'bs-sapphire-ring',
                  title: 'Sapphire Solitaire Ring',
                  cat: 'Rings',
                  purity: '925 Silver',
                  price: '₹1,899',
                  rating: '4.9',
                  reviews: '142',
                  img: colRings,
                  badge: 'MOST COVETED'
                },
                {
                  id: 'bs-curb-bracelet',
                  title: 'Royal Cuban Bracelet',
                  cat: 'Bracelets',
                  purity: '925 Silver',
                  price: '₹1,499',
                  rating: '5.0',
                  reviews: '98',
                  img: colBracelets,
                  badge: 'TOP RATED'
                },
                {
                  id: 'bs-compass-pendant',
                  title: 'North Star Compass Pendant',
                  cat: 'Pendants',
                  purity: '925 Silver',
                  price: '₹999',
                  rating: '4.9',
                  reviews: '215',
                  img: colPendants,
                  badge: 'BESTSELLER'
                },
                {
                  id: 'bs-curb-chain',
                  title: 'Miami Solid Curb Chain',
                  cat: 'Chains',
                  purity: '925 Silver',
                  price: '₹1,999',
                  rating: '4.8',
                  reviews: '86',
                  img: colChains,
                  badge: 'ROYAL HEIRLOOM'
                }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    changeCategoryTab?.(item.cat);
                    navigateTo('collections');
                  }}
                  className="group cursor-pointer flex flex-col bg-white border border-[#E8DFD5] hover:border-[#8C6D46]/60 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(140,109,70,0.18)] transition-all duration-500 overflow-hidden text-left"
                >
                  {/* Image Container with Badge */}
                  <div className="w-full aspect-[4/5] overflow-hidden bg-[#FAF6F2] relative">
                    <img 
                      src={item.img} 
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
                    
                    {/* Badge */}
                    <span className="absolute top-2.5 left-2.5 bg-[#050B14]/90 backdrop-blur-xs text-[#E5C396] text-[8.5px] sm:text-[9.5px] font-sans font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-[1px] border border-[#C5A880]/30 shadow-xs">
                      {item.badge}
                    </span>

                    {/* Quick View Pill */}
                    <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full py-2 bg-[#8C6D46] text-white text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.18em] uppercase text-center shadow-lg">
                        VIEW PIECE →
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-3.5 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#8C6D46] font-semibold tracking-wider uppercase mb-1">
                        <span>{item.purity}</span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{item.rating}</span>
                        </span>
                      </div>
                      <h3 
                        className="font-serif text-sm sm:text-base lg:text-[17px] font-bold text-[#1A1817] group-hover:text-[#8C6D46] transition-colors line-clamp-1"
                        style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F0EAE1]">
                      <span className="font-serif text-base sm:text-lg font-bold text-[#1A1817]">
                        {item.price}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-sans tracking-wider uppercase text-gray-500 group-hover:text-[#8C6D46] transition-colors font-medium">
                        Shop Now →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        

        {/* ==========================================================
          FEATURE 03: BUILT ON PURITY — WHY 925 FINE SILVER?
          (Edge-by-Edge Full-Bleed Banner)
          ========================================================== */}
        <section 
          id="built-on-purity" 
          className="w-full relative overflow-hidden select-none bg-[#050B14] cursor-pointer group border-b border-white/10"
          onClick={() => {
            triggerAudio('click');
            changeCategoryTab?.('Silver', 'silver', 'all');
            if (typeof setMetalFilter === 'function') setMetalFilter('silver');
            navigateTo('collections');
          }}
        >
          <img
            src={bannerBuiltOnPurity}
            alt="Built on Purity - Why 925 Fine Silver? MANISH & CO Fine Jewellery"
            className="w-full h-auto min-h-[190px] sm:min-h-0 object-cover object-center block transition-transform duration-700 ease-out group-hover:scale-[1.008]"
            loading="lazy"
          />
          {/* Subtle luxury ambient hover sheen */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.025] transition-colors duration-300 pointer-events-none" />
        </section>

        {/* ==========================================================
          FEATURE 04: SHOP BY CATEGORY / BUDGET STORE (GOL PRICE TIERS)
          ========================================================== */}
        <section 
          id="shop-by-category-marquee" 
          className="w-full py-12 sm:py-16 bg-[#FDFBF7] border-b border-[#EAE3D9] overflow-hidden select-none"
        >
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14 relative">
              
              {/* LEFT COLUMN: Editorial "Shop by Category" */}
              <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 text-left z-20 bg-[#FDFBF7] py-2">
                <span className="inline-block text-[#8C6D46] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.25em] uppercase mb-2.5">
                  AFFORDABLE PURITY
                </span>
                
                <h2 
                  className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#1A1817] leading-[1.08] mb-3.5"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                >
                  Shop by<br />Category
                </h2>

                <p className="text-[#6F6862] text-xs sm:text-sm font-sans leading-relaxed mb-6 max-w-[300px]">
                  Explore all certified 925 fine silver designs by price. Handcrafted jewellery designed to shine within your everyday budget.
                </p>

                <div>
                  <button
                    onClick={() => {
                      triggerAudio('click');
                      if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(100000000);
                      changeCategoryTab?.('Collections');
                      navigateTo('collections');
                    }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#785B3C] hover:bg-[#8F6D48] active:scale-95 text-white font-sans text-xs sm:text-[12.5px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(120,91,60,0.25)] cursor-pointer rounded-none"
                  >
                    <span>VIEW ALL DEALS</span>
                    <span className="text-sm font-light">→</span>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Continuous Moving Marquee of Vibrant Gol (Round) Price Categories */}
              <div className="w-full lg:flex-1 relative overflow-hidden py-4">
                {/* Left & Right gradient fades for smooth fade-in/fade-out */}
                <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

                {/* Moving Marquee Strip of Gol Categories */}
                <div className="animate-marquee-smooth flex flex-row items-center gap-6 sm:gap-8 lg:gap-10 select-none py-3">
                  {[...priceCategories.filter(t => t.active !== false), ...priceCategories.filter(t => t.active !== false)].map((tier, idx) => {
                    const style = getColorStyles(tier.color);
                    return (
                      <div
                        key={`price-tier-${tier.id}-${idx}`}
                        onClick={() => {
                          triggerAudio('click');
                          if (typeof setMaxPriceFilter === 'function') setMaxPriceFilter(tier.price);
                          if (typeof setGenderFilter === 'function') setGenderFilter('all');
                          if (typeof setMetalFilter === 'function') setMetalFilter('all');
                          changeCategoryTab?.('Collections');
                          navigateTo('collections');
                        }}
                        className="group/item cursor-pointer flex flex-col items-center text-center shrink-0 w-[120px] sm:w-[136px] lg:w-[146px] transition-all duration-300"
                      >
                        {/* Vibrant Round "Gol" Badge */}
                        <div className={`w-[110px] h-[110px] sm:w-[124px] sm:h-[124px] lg:w-[136px] lg:h-[136px] rounded-full bg-gradient-to-br ${style.gradient} ${style.shadow} ${style.border} border-2 flex flex-col items-center justify-center p-3 relative overflow-hidden transition-all duration-300 group-hover/item:scale-108 group-hover/item:ring-4 ${style.ring} group-hover/item:shadow-2xl`}>
                          
                          {/* Ambient Sparkle / Sheen Accent */}
                          <div className="absolute inset-0 bg-white/0 group-hover/item:bg-white/10 transition-colors duration-300 pointer-events-none" />
                          <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/20 rounded-full blur-sm pointer-events-none" />

                          {/* Top "UNDER" Eyebrow */}
                          <span className="font-sans font-bold text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-white/90 drop-shadow-sm leading-none mb-1">
                            UNDER
                          </span>

                          {/* Bold Price Amount */}
                          <span 
                            className="text-2xl sm:text-[28px] lg:text-[30px] font-bold text-white leading-none tracking-tight drop-shadow-md"
                            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                          >
                            ₹{tier.price}
                          </span>

                          {/* Bottom Action Pill */}
                          <span className="inline-flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-sans font-bold tracking-wider uppercase text-white bg-black/25 px-2 py-0.5 rounded-full mt-1.5 border border-white/20 shadow-xs group-hover/item:bg-black/35 transition-colors">
                            <span>Shop</span>
                            <span className="text-[10px] transition-transform duration-200 group-hover/item:translate-x-0.5">→</span>
                          </span>
                        </div>

                        {/* Title Underneath */}
                        <span className="font-sans font-semibold text-[11px] sm:text-xs tracking-[0.14em] uppercase text-[#1A1817] group-hover/item:text-[#8C6D46] transition-colors mt-3 line-clamp-1">
                          {tier.title || `Under ₹${tier.price}`}
                        </span>
                        <span className="text-[10px] text-[#8C6D46] tracking-wider uppercase font-semibold mt-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          View Items →
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

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
                        className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-full overflow-hidden border border-solid flex items-center justify-center transition-all duration-300 ease group-hover:scale-105 border-[#EADBCE]/75 bg-[#F7F4EB] shadow-[0_4px_14px_rgba(160,140,110,0.12)] group-hover:shadow-[0_8px_24px_rgba(201,161,74,0.22)]"
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

        {/* ==========================================================
          CRAFTSMANSHIP JOURNEY — BEAUTY IS IN THE DETAILS (925 SILVER)
          (Edge-by-Edge Full-Bleed Banner)
          ========================================================== */}
        <section 
          id="craftsmanship-journey-banner" 
          className="w-full relative overflow-hidden select-none bg-[#050B14] cursor-pointer group border-y border-white/10"
          onClick={() => {
            triggerAudio('click');
            navigateTo('heritage');
          }}
        >
          <img
            src={bannerCraftsmanshipJourney}
            alt="The Jewellery Journey - Beauty Is in the Details - MANISH & CO Fine Jewellery"
            className="w-full h-auto min-h-[190px] sm:min-h-0 object-cover object-center block transition-transform duration-700 ease-out group-hover:scale-[1.008]"
            loading="lazy"
          />
          {/* Subtle luxury ambient hover sheen */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.025] transition-colors duration-300 pointer-events-none" />
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
            { yr: 1996, label: "1996", title: "Mau Atelier Inception", desc: "Foundations of our master silversmith studio in Mau, hand-sculpting pristine silver ornaments and setting absolute purity standards in dense 925 fine silver." },
            { yr: 2004, label: "2004", title: "Artisanal Hallmarking & Chitai Craft", desc: "Pioneering traditional hand-hammered Chitai work and introducing rigorous 925 purity benchmarks across eastern Uttar Pradesh." },
            { yr: 2012, label: "2012", title: "Fine Silver & Bridal Expansion", desc: "Introduction of signature handcrafted bridal silver payals, royal kadas, heavy curb chains, and bespoke gemstone suites." },
            { yr: 2020, label: "2020", title: "Flagship Mau Boutique & Custom Studio", desc: "Opening of our grand showroom lounge in Mau, offering 3D CAD design tables and private bridal suites for family appointments." },
            { yr: 2026, label: "Present", title: "MANISH & CO Pan-India Digital Flagship", desc: "Certified 925 BIS Hallmarked collections, live transparent silver bullion rates, bespoke WhatsApp concierge, and insured doorstep delivery across India." }
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
                          {item.label || item.yr}
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

        {/* ==========================================================
          STORE BANNER (SHREE HARI) - EDGE TO EDGE SIDE BY SIDE
          ========================================================== */}
        <section className="w-full overflow-hidden pb-12 sm:pb-16 text-center">
          <a
            href="https://maps.app.goo.gl/SXN2DZ7UasRc7qFG6?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerAudio('shimmer')}
            className="block w-full overflow-hidden relative cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border-y border-solid border-[#E6DFD3] group"
          >
            <img
              src={bannerStoreBanner}
              alt="A trusted SHREE HARI ORNAMENTS AND COLLECTION CENTER - Fatehpur Modh Mau - Find This Store"
              loading="lazy"
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          </a>
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
                  <span className="text-lg sm:text-xl md:text-2xl font-bold font-serif tracking-wider mt-0.5">1996</span>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Artisanal Heritage of Mau</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">100% Certified Jewellery</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Lifetime Exchange &amp; Buyback</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Guaranteed Purity &amp; Value</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">100% Transparency</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Free Shipping</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Authentic Rajputi Ornaments</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><polygon points="23 7 16 12 23 17 23 7" strokeLinecap="round" strokeLinejoin="round" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#2c3e50] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Personalised Video Consultations</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#031838] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
