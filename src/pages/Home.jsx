import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { useRates } from '../hooks/useRates';
import Modal from '../components/Modal';
import BookingForm from '../forms/BookingForm';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { ShieldCheck, Gem, Truck, Package, ArrowRight } from 'lucide-react';

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
import { INITIAL_CATEGORIES } from '../config/constants';
import { priceCategoryService, getColorStyles } from '../services/priceCategoryService';


// Editorial Collection Showcase (01 Men's, 02 Women's, 03 Kid's, 04 Gift's)
import himRings from '../assets/editorial/him_rings.jpg';
import himChains from '../assets/editorial/him_chains.jpg';
import himBracelets from '../assets/editorial/him_bracelets.jpg';
import herRings from '../assets/editorial/her_rings.jpg';
import herBracelets from '../assets/editorial/her_bracelets.jpg';
import herAnklets from '../assets/editorial/her_anklets.jpg';
import kidsBracelets from '../assets/editorial/kids_bracelets.jpg';
import kidsChains from '../assets/editorial/kids_chains.jpg';
import kidsKadas from '../assets/editorial/kids_kadas.jpg';
import giftsCoins from '../assets/editorial/gifts_coins.jpg';
import giftsPooja from '../assets/editorial/gifts_pooja.jpg';
import giftsKeepsakes from '../assets/editorial/gifts_keepsakes.jpg';

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

// Clean Transparent Category Images
import cleanBangles from '../assets/clean_categories/bangles.png';
import cleanBracelets from '../assets/clean_categories/bracelets.png';
import cleanEarrings from '../assets/clean_categories/earrings.png';
import cleanJhumka from '../assets/clean_categories/jhumka.png';
import cleanKada from '../assets/clean_categories/kada.png';
import cleanNathNosePin from '../assets/clean_categories/nath_nose_pin.png';
import cleanNecklace from '../assets/clean_categories/necklace.png';
import cleanNosePin from '../assets/clean_categories/nose_pin.png';
import cleanPayal from '../assets/clean_categories/payal.png';
import cleanPendantLocket from '../assets/clean_categories/pendant_locket.png';
import cleanRings from '../assets/clean_categories/rings.png';
import cleanSilverChain from '../assets/clean_categories/silver_chain.png';

const cleanCategoryList = [
  { id: 'rings', name: 'Rings', tab: 'Rings', img: cleanRings },
  { id: 'bracelets', name: 'Bracelets', tab: 'Bracelets', img: cleanBracelets },
  { id: 'earrings', name: 'Earrings', tab: 'Earrings', img: cleanEarrings },
  { id: 'necklaces', name: 'Necklaces', tab: 'Necklaces', img: cleanNecklace },
  { id: 'pendants', name: 'Pendants', tab: 'Pendants', img: cleanPendantLocket },
  { id: 'bangles', name: 'Bangles', tab: 'Bangles', img: cleanBangles },
  { id: 'kada', name: 'Kadas', tab: 'Bangles', img: cleanKada },
  { id: 'silver-chain', name: 'Chains', tab: 'Necklaces', img: cleanSilverChain },
  { id: 'payal', name: 'Payals & Anklets', tab: 'Silver', img: cleanPayal },
  { id: 'jhumka', name: 'Jhumkas', tab: 'Earrings', img: cleanJhumka },
  { id: 'nose-pin', name: 'Nose Pins', tab: 'Collections', img: cleanNosePin },
  { id: 'nath-nose-pin', name: 'Nath & Studs', tab: 'Collections', img: cleanNathNosePin },
];



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
  const [activeStoryTimeline, setActiveStoryTimeline] = useState(1952);
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
        </div>

        {/* Hero Left Content Container with Framer-Motion Staggered Entrance */}
        <div className="relative z-10 max-w-[1536px] w-full mx-auto px-6 sm:px-10 lg:px-14 py-14 sm:py-16 lg:py-20 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[640px] text-left"
          >
            
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2 mb-3 sm:mb-4"
            >
              <span className="text-[#C5A880] text-xs font-serif select-none">✦</span>
              <span className="inline-block text-[#C5A880] text-xs sm:text-[13px] font-sans font-medium tracking-[0.28em] uppercase">
                TIMELESS BY NATURE
              </span>
            </motion.div>

            {/* Main Luxury Headline (Screenshot Exact Typography) */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-[70px] xl:text-[78px] font-bold uppercase text-white leading-[1.03] tracking-[0.03em] drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
            >
              MORE THAN<br />
              JEWELLERY
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-gray-300 text-xs sm:text-sm lg:text-[15px] font-sans font-medium tracking-[0.18em] uppercase mt-4 sm:mt-5 mb-7 sm:mb-9 leading-relaxed max-w-[460px]"
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
          FEATURE 02: OUR COLLECTIONS - CRAFTED FOR EVERY MOMENT
          (Exact Reference Screenshot Design)
          ========================================================== */}
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
          EDITORIAL SHOWCASE 01: MEN'S JEWELLERY (FOR HIM)
          ========================================================== */}
        <section id="for-him" className="w-full py-12 sm:py-16 bg-[#F5ECE4] border-b border-[#E8DFD5] select-none">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            
            {/* Editorial Header */}
            <div className="mb-6 sm:mb-8 text-left">
              <span className="inline-block text-[#8C6D46] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-1.5">
                01 / FOR HIM
              </span>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <h2 
                    className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#1A1817] leading-tight shrink-0"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    Men's Jewellery
                  </h2>
                  <div className="hidden sm:block h-[1px] bg-[#D6CABE] flex-1 max-w-[260px] lg:max-w-[340px]" />
                </div>
                <button
                  onClick={() => {
                    triggerAudio('click');
                    if (typeof setGenderFilter === 'function') setGenderFilter('men');
                    changeCategoryTab?.('Collections', 'all', 'men');
                    navigateTo('collections');
                  }}
                  className="text-[#1A1817] hover:text-[#8C6D46] font-sans text-xs sm:text-[13px] font-semibold tracking-[0.16em] uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer group shrink-0"
                >
                  <span>View All</span>
                  <span className="text-sm font-light transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
              <p className="text-[#6F6862] text-xs sm:text-sm font-sans mt-2 font-normal">
                Bold 925 sterling silver designs crafted for confidence and royal presence.
              </p>
            </div>

            {/* 3 Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
              {/* Card 1: Rings */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (typeof setGenderFilter === 'function') setGenderFilter('men');
                  changeCategoryTab?.('Rings', 'all', 'men');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={himRings}
                    alt="Men's Rings - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Rings
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>

              {/* Card 2: Chains */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (typeof setGenderFilter === 'function') setGenderFilter('men');
                  changeCategoryTab?.('Chains', 'all', 'men');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={himChains}
                    alt="Men's Chains - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Chains
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>

              {/* Card 3: Bracelets & Kadas */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (typeof setGenderFilter === 'function') setGenderFilter('men');
                  changeCategoryTab?.('Bracelets', 'all', 'men');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={himBracelets}
                    alt="Men's Bracelets & Kadas - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Bracelets &amp; Kadas
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================================
          EDITORIAL SHOWCASE 02: WOMEN'S JEWELLERY (FOR HER)
          ========================================================== */}
        <section id="for-her" className="w-full py-12 sm:py-16 bg-[#F5ECE4] border-b border-[#E8DFD5] select-none">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            
            {/* Editorial Header */}
            <div className="mb-6 sm:mb-8 text-left">
              <span className="inline-block text-[#8C6D46] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-1.5">
                02 / FOR HER
              </span>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <h2 
                    className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#1A1817] leading-tight shrink-0"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    Women's Jewellery
                  </h2>
                  <div className="hidden sm:block h-[1px] bg-[#D6CABE] flex-1 max-w-[260px] lg:max-w-[340px]" />
                </div>
                <button
                  onClick={() => {
                    triggerAudio('click');
                    if (typeof setGenderFilter === 'function') setGenderFilter('women');
                    changeCategoryTab?.('Collections', 'all', 'women');
                    navigateTo('collections');
                  }}
                  className="text-[#1A1817] hover:text-[#8C6D46] font-sans text-xs sm:text-[13px] font-semibold tracking-[0.16em] uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer group shrink-0"
                >
                  <span>View All</span>
                  <span className="text-sm font-light transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
              <p className="text-[#6F6862] text-xs sm:text-sm font-sans mt-2 font-normal">
                Elegant 925 sterling silver pieces for everyday beauty and royal moments.
              </p>
            </div>

            {/* 3 Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
              {/* Card 1: Rings */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (typeof setGenderFilter === 'function') setGenderFilter('women');
                  changeCategoryTab?.('Rings', 'all', 'women');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={herRings}
                    alt="Women's Rings - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Rings
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>

              {/* Card 2: Bracelets */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (typeof setGenderFilter === 'function') setGenderFilter('women');
                  changeCategoryTab?.('Bracelets', 'all', 'women');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={herBracelets}
                    alt="Women's Bracelets - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Bracelets
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>

              {/* Card 3: Anklets */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (typeof setGenderFilter === 'function') setGenderFilter('women');
                  changeCategoryTab?.('Payal', 'all', 'women');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={herAnklets}
                    alt="Women's Anklets & Payals - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Anklets &amp; Payals
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================================
          EDITORIAL SHOWCASE 03: KID'S JEWELLERY (LITTLE TREASURES)
          ========================================================== */}
        <section id="kids-collection" className="w-full py-12 sm:py-16 bg-[#F5ECE4] border-b border-[#E8DFD5] select-none">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            
            {/* Editorial Header */}
            <div className="mb-6 sm:mb-8 text-left">
              <span className="inline-block text-[#8C6D46] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-1.5">
                03 / LITTLE TREASURES
              </span>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <h2 
                    className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#1A1817] leading-tight shrink-0"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    Kid's Jewellery
                  </h2>
                  <div className="hidden sm:block h-[1px] bg-[#D6CABE] flex-1 max-w-[260px] lg:max-w-[340px]" />
                </div>
                <button
                  onClick={() => {
                    triggerAudio('click');
                    if (typeof setGenderFilter === 'function') setGenderFilter('kids');
                    changeCategoryTab?.('Collections', 'all', 'kids');
                    navigateTo('collections');
                  }}
                  className="text-[#1A1817] hover:text-[#8C6D46] font-sans text-xs sm:text-[13px] font-semibold tracking-[0.16em] uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer group shrink-0"
                >
                  <span>View All</span>
                  <span className="text-sm font-light transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
              <p className="text-[#6F6862] text-xs sm:text-sm font-sans mt-2 font-normal">
                Pure, skin-friendly 925 silver keepsakes handcrafted for your little precious ones.
              </p>
            </div>

            {/* 3 Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
              {/* Card 1: Nazariya & Bracelets */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (typeof setGenderFilter === 'function') setGenderFilter('kids');
                  changeCategoryTab?.('Bracelets', 'all', 'kids');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={kidsBracelets}
                    alt="Kids' Nazariya & Bracelets - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Nazariya &amp; Bracelets
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>

              {/* Card 2: Chains & Pendants */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (typeof setGenderFilter === 'function') setGenderFilter('kids');
                  changeCategoryTab?.('Pendants', 'all', 'kids');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={kidsChains}
                    alt="Kids' Chains & Pendants - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Chains &amp; Pendants
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>

              {/* Card 3: Baby Kadas & Bangles */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  if (typeof setGenderFilter === 'function') setGenderFilter('kids');
                  changeCategoryTab?.('Bangles', 'all', 'kids');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={kidsKadas}
                    alt="Kids' Baby Kadas & Bangles - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Baby Kadas &amp; Bangles
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================================
          EDITORIAL SHOWCASE 04: GIFT'S COLLECTION (SACRED CELEBRATIONS)
          ========================================================== */}
        <section id="gifts-collection" className="w-full py-12 sm:py-16 bg-[#F5ECE4] border-b border-[#E8DFD5] select-none">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            
            {/* Editorial Header */}
            <div className="mb-6 sm:mb-8 text-left">
              <span className="inline-block text-[#8C6D46] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-1.5">
                04 / SACRED &amp; CELEBRATION
              </span>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <h2 
                    className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#1A1817] leading-tight shrink-0"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    Gift's Collection
                  </h2>
                  <div className="hidden sm:block h-[1px] bg-[#D6CABE] flex-1 max-w-[260px] lg:max-w-[340px]" />
                </div>
                <button
                  onClick={() => {
                    triggerAudio('click');
                    navigateTo('gold-coins');
                  }}
                  className="text-[#1A1817] hover:text-[#8C6D46] font-sans text-xs sm:text-[13px] font-semibold tracking-[0.16em] uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer group shrink-0"
                >
                  <span>View All</span>
                  <span className="text-sm font-light transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
              <p className="text-[#6F6862] text-xs sm:text-sm font-sans mt-2 font-normal">
                Auspicious 999 fine silver coins, sacred pooja articles, and royal heirloom keepsakes.
              </p>
            </div>

            {/* 3 Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
              {/* Card 1: Silver Coins & Bullion */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  navigateTo('gold-coins');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={giftsCoins}
                    alt="Pure Silver Coins & Bars - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Silver Coins &amp; Bullion
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>

              {/* Card 2: Pooja Silver Articles */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  changeCategoryTab?.('Silver', 'all');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={giftsPooja}
                    alt="Pooja Silver Articles - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Pooja Silver Articles
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>

              {/* Card 3: Keepsakes & Heirlooms */}
              <div
                onClick={() => {
                  triggerAudio('click');
                  changeCategoryTab?.('Collections', 'all');
                  navigateTo('collections');
                }}
                className="group cursor-pointer flex flex-col overflow-hidden bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-500 rounded-none"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-[#ECE4DC] relative">
                  <img
                    src={giftsKeepsakes}
                    alt="Royal Keepsakes & Gifting - MANISH & CO"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="bg-[#111111] px-5 py-3.5 sm:py-4 flex items-center justify-between text-white border-t border-white/5">
                  <span className="font-serif text-base sm:text-[17px] tracking-wide text-white/95 font-medium group-hover:text-[#D5C0A5] transition-colors">
                    Keepsakes &amp; Heirlooms
                  </span>
                  <span className="text-sm sm:text-base font-light text-white/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D5C0A5]">
                    →
                  </span>
                </div>
              </div>
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
                  <span className="text-lg sm:text-xl md:text-2xl font-bold font-serif tracking-wider mt-0.5">1952</span>
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
