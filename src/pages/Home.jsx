import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import Modal from '../components/Modal';
import BookingForm from '../forms/BookingForm';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { ArrowRight, Star, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

// Category Image Fallbacks
import solitariesImg from '../assets/solitaries.png';
import watchJewelleryImg from '../assets/watch_jewellery.png';
import mensJewelleryImg from '../assets/mens_jewellery.png';
import nosePinsImg from '../assets/nose_pins.png';
import kidsJewelleryImg from '../assets/kids_jewellery.png';
import goldCoinsImg from '../assets/gold_coins.png';
import kadaImg from '../assets/kada.png';
import EditorialShowcaseSection from '../components/EditorialShowcaseSection';
import { INITIAL_CATEGORIES } from '../config/constants';
import { StorageService } from '../services/StorageService';

// Testimonial Images
import testimonial1 from '../assets/testimonial_1.png';
import testimonial2 from '../assets/testimonial_2.png';
import testimonial3 from '../assets/testimonial_3.png';
import testimonial4 from '../assets/testimonial_4.png';

// Banners & Collections
import catRefPendant from '../assets/cat_ref_pendant.png';
import catRefPendantWebp from '../assets/cat_ref_pendant.webp';
import catRefNecklaces from '../assets/cat_ref_necklaces.png';
import catRefNecklacesWebp from '../assets/cat_ref_necklaces.webp';
import catRefMangalsutra from '../assets/cat_ref_mangalsutra.png';
import catRefMangalsutraWebp from '../assets/cat_ref_mangalsutra.webp';
import catRefToeRing from '../assets/cat_ref_toe_ring.png';
import catRefToeRingWebp from '../assets/cat_ref_toe_ring.webp';
import catRefAnklets from '../assets/cat_ref_anklets.png';
import catRefAnkletsWebp from '../assets/cat_ref_anklets.webp';
import catRefChain from '../assets/cat_ref_chain.png';
import catRefChainWebp from '../assets/cat_ref_chain.webp';
import catRefRings from '../assets/cat_ref_rings.png';
import catRefRingsWebp from '../assets/cat_ref_rings.webp';
import catRefEarring from '../assets/cat_ref_earring.png';
import catRefEarringWebp from '../assets/cat_ref_earring.webp';
import catRefBracelets from '../assets/cat_ref_bracelets.png';
import catRefBraceletsWebp from '../assets/cat_ref_bracelets.webp';
import catRefStoneBracelets from '../assets/cat_ref_stone_bracelets.png';
import catRefStoneBraceletsWebp from '../assets/cat_ref_stone_bracelets.webp';
import colTennisPng from '../assets/col_tennis.png';
import colTennisWebp from '../assets/col_tennis.webp';
import colToeRingPng from '../assets/col_toe_ring.png';
import colToeRingWebp from '../assets/col_toe_ring.webp';
import colPearlPng from '../assets/col_pearl.png';
import colPearlWebp from '../assets/col_pearl.webp';
import colStonePng from '../assets/col_stone.png';
import colStoneWebp from '../assets/col_stone.webp';
import diwaliFestiveManishAndCoJpg from '../assets/diwali_festive_manish_and_co.jpg';
import diwaliFestiveManishAndCoWebp from '../assets/diwali_festive_manish_and_co.webp';

// Dynamic Silver Story Showcase Service
import { silverStoryService } from '../services/silverStoryService';

// Dynamic Gifting Hampers Service
import { giftingHampersService } from '../services/giftingHampersService';

// Dynamic Hero Banners Service
import { heroBannerService } from '../services/heroBannerService';

// Craft Your Bespoke Jewellery Assets
import craftYourBespokeJewelleryPng from '../assets/craft_your_bespoke_jewellery.png';
import craftYourBespokeJewelleryWebp from '../assets/craft_your_bespoke_jewellery.webp';

// Trust Seals & Brand Assurances Assets (High-Res Transparent)
import trustSealBisWebp from '../assets/trust_seal_bis.webp';
import trustSealBisPng from '../assets/trust_seal_bis.png';
import trustSealShippingWebp from '../assets/trust_seal_shipping.webp';
import trustSealShippingPng from '../assets/trust_seal_shipping.png';
import trustSealCodWebp from '../assets/trust_seal_cod.webp';
import trustSealCodPng from '../assets/trust_seal_cod.png';
import trustSealCustomersWebp from '../assets/trust_seal_customers.webp';
import trustSealCustomersPng from '../assets/trust_seal_customers.png';

// Made for Every Kind of Love Assets
import loveStory1Webp from '../assets/love_story_1.webp';
import loveStory1Png from '../assets/love_story_1.png';
import loveStory2Webp from '../assets/love_story_2.webp';
import loveStory2Png from '../assets/love_story_2.png';
import loveStory3Webp from '../assets/love_story_3.webp';
import loveStory3Png from '../assets/love_story_3.png';
import loveStory4Webp from '../assets/love_story_4.webp';
import loveStory4Png from '../assets/love_story_4.png';

import bannerBuiltOnPurity from '../assets/built_on_purity_925_fine_silver.png';
import bannerCraftsmanshipJourney from '../assets/craftsmanship_in_every_silver_detail.png';
import bannerStoreBanner from '../assets/banner_store_banner.png';
import gemsCollectionBanner from '../assets/gems_collection_banner.jpg';



const getCategoryFallbackImage = (catNameOrId) => {
  const norm = String(catNameOrId || '').toLowerCase().replace(/\s+/g, '');
  if (norm.includes('pendant') || norm.includes('locket')) return catRefPendantWebp || catRefPendant;
  if (norm.includes('necklace') || norm.includes('choker') || norm.includes('haar')) return catRefNecklacesWebp || catRefNecklaces;
  if (norm.includes('mangal')) return catRefMangalsutraWebp || catRefMangalsutra;
  if (norm.includes('toering') || norm.includes('toe-ring') || norm.includes('toe') || norm.includes('bichiya')) return catRefToeRingWebp || catRefToeRing;
  if (norm.includes('anklet') || norm.includes('payal')) return catRefAnkletsWebp || catRefAnklets;
  if (norm.includes('chain')) return catRefChainWebp || catRefChain;
  if (norm.includes('stone') || (norm.includes('bracelet') && norm.includes('stone'))) return catRefStoneBraceletsWebp || catRefStoneBracelets;
  if (norm.includes('ring') && !norm.includes('ear') && !norm.includes('toe')) return catRefRingsWebp || catRefRings;
  if (norm.includes('earring') || norm.includes('jhumka') || norm.includes('top') || norm.includes('stud')) return catRefEarringWebp || catRefEarring;
  if (norm.includes('bracelet')) return catRefBraceletsWebp || catRefBracelets;
  if (norm.includes('payal')) return catRefAnkletsWebp || catRefAnklets;
  if (norm.includes('bangle') || norm.includes('kada')) return kadaImg;
  if (norm.includes('nath') || norm.includes('nose')) return nosePinsImg;
  if (norm.includes('coin') || norm.includes('bullion')) return goldCoinsImg;
  if (norm.includes('solitaire') || norm.includes('diamond')) return solitariesImg;
  if (norm.includes('watch')) return watchJewelleryImg;
  if (norm.includes('men')) return mensJewelleryImg;
  if (norm.includes('kids') || norm.includes('child')) return kidsJewelleryImg;
  return catRefPendantWebp || catRefPendant;
};


const TRUST_SEALS_DATA = [
  {
    id: 'bis-hallmark',
    label: 'BIS Hallmarked Silver',
    imgWebp: trustSealBisWebp,
    imgPng: trustSealBisPng
  },
  {
    id: 'free-shipping',
    label: 'Free Shipping',
    imgWebp: trustSealShippingWebp,
    imgPng: trustSealShippingPng
  },
  {
    id: 'cash-on-delivery',
    label: 'Cash On Delivery',
    imgWebp: trustSealCodWebp,
    imgPng: trustSealCodPng
  },
  {
    id: 'happy-customers',
    label: '25,000+ Happy Customers',
    imgWebp: trustSealCustomersWebp,
    imgPng: trustSealCustomersPng
  }
];

const LOVE_STORY_CARDS = [
  {
    id: 'first-glance',
    title: 'FIRST GLANCE',
    imgWebp: loveStory1Webp,
    imgPng: loveStory1Png,
    tab: 'earrings',
    active: false
  },
  {
    id: 'everyday-love',
    title: 'EVERYDAY LOVE',
    imgWebp: loveStory2Webp,
    imgPng: loveStory2Png,
    tab: 'rings',
    active: true
  },
  {
    id: 'just-for-me',
    title: 'JUST FOR ME',
    imgWebp: loveStory3Webp,
    imgPng: loveStory3Png,
    tab: 'pendants',
    active: false
  },
  {
    id: 'the-special-day',
    title: 'THE SPECIAL DAY',
    imgWebp: loveStory4Webp,
    imgPng: loveStory4Png,
    tab: 'mangalsutras',
    active: false
  }
];

export default function Home({
  navigateTo,
  navigateToPDP,
  changeCategoryTab,
  triggerAudio: triggerAudioProp,
  setMetalFilter,
}) {
  // Self-contained data from context
  const { products = [], categories = [] } = useProducts();

  const isCatalogDark = false;
  const triggerAudio = (type) => { try { triggerAudioProp?.(type); } catch { /* noop */ } };

  // Local modal state
  const [consultationModal, setConsultationModal] = useState(false);
  const [customDesignOpen, setCustomDesignOpen] = useState(false);
  const trustSealsScrollRef = useRef(null);

  // Dynamic Hero Carousel State (Synchronized with Admin updates & auto-slide)
  const [heroBanners, setHeroBanners] = useState(() => heroBannerService.getStoredBanners());

  useEffect(() => {
    heroBannerService.fetchRemoteBanners().then((res) => {
      if (res && res.length > 0) setHeroBanners(res);
    });

    const handleHeroBannersUpdate = () => {
      setHeroBanners(heroBannerService.getStoredBanners());
    };

    window.addEventListener('manish_hero_banners_updated', handleHeroBannersUpdate);
    const storageHandler = (e) => {
      if (e.key === 'manish_hero_banners_data') {
        handleHeroBannersUpdate();
      }
    };
    window.addEventListener('storage', storageHandler);
    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('manish_store_sync');
      bc.onmessage = (msg) => {
        if (msg?.data?.type === 'hero_banners') {
          handleHeroBannersUpdate();
        }
      };
    }
    return () => {
      window.removeEventListener('manish_hero_banners_updated', handleHeroBannersUpdate);
      window.removeEventListener('storage', storageHandler);
      if (bc) bc.close();
    };
  }, []);

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const heroTouchStartX = useRef(0);
  const storyCarouselRef = useRef(null);
  const storyIsDragging = useRef(false);
  const storyStartX = useRef(0);
  const storyScrollLeft = useRef(0);
  const storyHasDragged = useRef(false);

  // Dynamic Category Slider (populated live from Admin Categories)
  const dynamicStoryCategories = React.useMemo(() => {
    const isAllCleared = StorageService.get('manish_categories_all_cleared', false);
    if (isAllCleared) return [];

    const deletedIds = StorageService.get('manish_categories_deleted_ids', []);
    const isInit = StorageService.get('manish_categories_initialized', false);

    let list = [];
    if (Array.isArray(categories)) {
      list = categories;
    } else {
      const cached = StorageService.get('manish_categories_store', null);
      if (Array.isArray(cached)) {
        list = cached;
      } else if (!isInit) {
        list = INITIAL_CATEGORIES;
      }
    }

    // Filter out deleted categories and stale legacy
    const cleanList = list.filter(c => {
      const id = String(c.id || c.docId || c.name || '').toLowerCase();
      if (deletedIds.includes(id) || deletedIds.includes(String(c.id || '')) || deletedIds.includes(String(c.docId || ''))) {
        return false;
      }
      return id !== 'bangles' && id !== 'nath-nose-pin' && id !== 'jhumka' && c.name !== 'Bangles';
    });

    return cleanList.map((cat) => {
      const catId = cat.id || cat.docId || String(cat.name || '').toLowerCase().replace(/\s+/g, '-');
      // If Admin uploaded a real custom image, use it! Otherwise use high-res reference image
      const isCustomUploaded = (cat.img && typeof cat.img === 'string' && (cat.img.startsWith('http') || cat.img.startsWith('data:')))
        || (cat.image && typeof cat.image === 'string' && (cat.image.startsWith('http') || cat.image.startsWith('data:')));
      const catImg = isCustomUploaded
        ? (cat.img || cat.image).trim()
        : getCategoryFallbackImage(cat.name || catId);

      return {
        id: catId,
        name: cat.name || catId,
        img: catImg,
        badge: cat.badge || null,
        tab: cat.tab || catId
      };
    });
  }, [categories]);

  const handleStoryMouseDown = (e) => {
    if (!storyCarouselRef.current) return;
    storyIsDragging.current = true;
    storyHasDragged.current = false;
    storyStartX.current = e.pageX - storyCarouselRef.current.offsetLeft;
    storyScrollLeft.current = storyCarouselRef.current.scrollLeft;
  };

  const handleStoryMouseMove = (e) => {
    if (!storyIsDragging.current || !storyCarouselRef.current) return;
    const x = e.pageX - storyCarouselRef.current.offsetLeft;
    const walk = (x - storyStartX.current) * 1.4;
    if (Math.abs(walk) > 6) {
      storyHasDragged.current = true;
    }
    storyCarouselRef.current.scrollLeft = storyScrollLeft.current - walk;
  };

  const handleStoryMouseUp = () => {
    storyIsDragging.current = false;
  };

  const handleStoryCardClick = (cat) => {
    if (storyHasDragged.current) {
      storyHasDragged.current = false;
      return;
    }
    triggerAudio('click');
    if (typeof changeCategoryTab === 'function') {
      changeCategoryTab(cat.tab);
    }
    navigateTo('collections');
  };

  // Auto slide every 5000ms (5 seconds)
  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHeroPaused, heroBanners.length]);

  const nextHeroSlide = () => {
    triggerAudio('click');
    setCurrentHeroSlide((prev) => (prev + 1) % heroBanners.length);
  };

  const prevHeroSlide = () => {
    triggerAudio('click');
    setCurrentHeroSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  // Dynamic Price / Budget Categories ("Gol Categories" - Under 199, Under 229, Under 299 etc.)
  // ─── DYNAMIC SILVER FOR EVERY STORY SHOWCASE ─────────────────────
  const [silverStoryData, setSilverStoryData] = useState(() => silverStoryService.getStoredStoryData());

  useEffect(() => {
    silverStoryService.fetchRemoteStoryData().then(res => {
      if (res) setSilverStoryData(res);
    });

    const handleSilverStorySync = () => {
      setSilverStoryData(silverStoryService.getStoredStoryData());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('manish_silver_story_updated', handleSilverStorySync);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('manish_silver_story_updated', handleSilverStorySync);
      }
    };
  }, []);

  // ─── DYNAMIC SILVER GIFTING HAMPERS ──────────────────────────────
  const [giftingHampers, setGiftingHampers] = useState(() => giftingHampersService.getStoredHampers());

  useEffect(() => {
    giftingHampersService.fetchRemoteHampers().then(res => {
      if (res && res.length === 4) setGiftingHampers(res);
    });

    const handleGiftingHampersSync = () => {
      setGiftingHampers(giftingHampersService.getStoredHampers());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('manish_gifting_hampers_updated', handleGiftingHampersSync);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('manish_gifting_hampers_updated', handleGiftingHampersSync);
      }
    };
  }, []);

  // Combined dynamic categories with baseline reference set (all 10+ reference categories)
  const displayCategories = React.useMemo(() => {
    const isAllCleared = StorageService.get('manish_categories_all_cleared', false);
    if (isAllCleared) return [];

    const deletedIds = StorageService.get('manish_categories_deleted_ids', []);
    if (Array.isArray(categories)) {
      return categories.filter(c => {
        const id = String(c.id || c.docId || c.name || '').toLowerCase();
        return !deletedIds.includes(id) && !deletedIds.includes(String(c.id || '')) && !deletedIds.includes(String(c.docId || ''));
      });
    }
    const isInit = StorageService.get('manish_categories_initialized', false);
    if (!isInit && !isAllCleared) {
      return INITIAL_CATEGORIES;
    }
    return [];
  }, [categories]);

  // Dynamic Best Sellers from live store products (replaces hardcoded products)
  const dynamicBestSellers = React.useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    return products.slice(0, 4);
  }, [products]);

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
    const el = testimonialsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setTestimonialsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, []);

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
      <Helmet>
        <title>MANISH &amp; CO — Fine Jewellery | BIS 925 Sterling Silver &amp; Heirlooms</title>
        <meta name="description" content="Discover royal 925 sterling silver necklaces, solitaires, payals, kadas, and custom bespoke heirloom jewellery at MANISH &amp; CO. Handcrafted in Mau since 1996." />
        <meta property="og:title" content="MANISH &amp; CO — Fine 925 Silver Jewellery &amp; Heirlooms" />
        <meta property="og:description" content="Explore pure 925 sterling silver solitaires, royal bridal heirlooms, and fine bullion at MANISH &amp; CO." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://manishsilverdevjewellery-website.vercel.app/" />
        <meta name="twitter:title" content="MANISH &amp; CO — Fine Jewellery" />
        <meta name="twitter:description" content="Pure 925 sterling silver solitaires, royal heirlooms, and bespoke silver jewellery." />
      </Helmet>


      {/* ==========================================================
          SECTION 01: LUXURY HERO AUTO-SLIDER (5-SECOND AUTO-ROTATE)
          Banners:
          1. Timeless Silver Jewellery Collection
          2. Luxury Navy Blue Earring Collection
          3. Manish & Co. Brand Promise
          4. Navy Silver Diwali Glow
          ========================================================== */}
      <section
        id="hero-section"
        aria-label="Manish and Co Fine Jewellery Hero Showcase"
        className="relative w-full overflow-hidden select-none bg-[#091B2B]"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        onTouchStart={(e) => {
          heroTouchStartX.current = e.touches[0].clientX;
          setIsHeroPaused(true);
        }}
        onTouchEnd={(e) => {
          setIsHeroPaused(false);
          const diff = heroTouchStartX.current - e.changedTouches[0].clientX;
          if (diff > 45) nextHeroSlide();
          else if (diff < -45) prevHeroSlide();
        }}
      >
        {/* Banner Images Carousel Container - Increased height on mobile view for bold luxury presence, proportional on desktop */}
        <div className="relative w-full h-[250px] xs:h-[285px] sm:h-[350px] md:h-auto md:aspect-[2200/715] overflow-hidden bg-[#091B2B]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentHeroSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={() => {
                const banner = heroBanners[currentHeroSlide] || heroBanners[0];
                if (banner?.category && typeof changeCategoryTab === 'function') {
                  changeCategoryTab(banner.category);
                }
                navigateTo(banner?.page || 'collections');
              }}
            >
              {heroBanners[currentHeroSlide]?.customImg ? (
                <img
                  src={heroBanners[currentHeroSlide].customImg}
                  alt={heroBanners[currentHeroSlide]?.alt || heroBanners[currentHeroSlide]?.title || 'MANISH & CO Hero Banner'}
                  className="w-full h-full object-cover object-center select-none"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <picture className="w-full h-full block">
                  {heroBanners[currentHeroSlide]?.webp && (
                    <source srcSet={heroBanners[currentHeroSlide].webp} type="image/webp" />
                  )}
                  <img
                    src={heroBanners[currentHeroSlide]?.png || heroBanners[currentHeroSlide]?.webp}
                    alt={heroBanners[currentHeroSlide]?.alt || heroBanners[currentHeroSlide]?.title || 'MANISH & CO Hero Banner'}
                    className="w-full h-full object-cover object-center select-none"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Left Navigation Arrow (Hidden on mobile swipe to avoid blocking banner text) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevHeroSlide();
            }}
            aria-label="Previous Banner"
            className="hidden sm:flex absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-20 focus:outline-none shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Navigation Arrow (Hidden on mobile swipe to avoid blocking banner text) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextHeroSlide();
            }}
            aria-label="Next Banner"
            className="hidden sm:flex absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-20 focus:outline-none shadow-lg"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-1 sm:bottom-3 lg:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/10">
            {heroBanners.map((banner, index) => (
              <button
                key={banner.id}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerAudio('click');
                  setCurrentHeroSlide(index);
                }}
                aria-label={'Go to slide ' + (index + 1)}
                className={'transition-all duration-300 rounded-full cursor-pointer focus:outline-none ' + (
                  currentHeroSlide === index
                    ? 'w-4 sm:w-8 h-1 sm:h-2 bg-gradient-to-r from-[#D4AF37] to-[#FFF5DC] shadow-[0_0_8px_rgba(212,175,55,0.7)]'
                    : 'w-1 sm:w-2 h-1 sm:h-2 bg-white/40 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#E6DFD3] relative z-20" />

      {/* Centered Custom Design Action below Hero */}
      <div className="w-full py-4 sm:py-5 px-4 bg-white flex justify-center items-center relative z-20 border-b border-[#E6DFD3]/60">
        <button
          type="button"
          onClick={() => {
            triggerAudio('click');
            setCustomDesignOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-[#0D2B4E] hover:bg-[#081B32] text-white font-sans text-xs sm:text-[13px] font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(13,43,78,0.28)] hover:shadow-[0_6px_20px_rgba(13,43,78,0.4)] cursor-pointer active:scale-95 focus:outline-none"
        >
          <Sparkles className="w-4 h-4 text-[#E6DFD3] shrink-0" />
          <span>Custom Design</span>
        </button>
      </div>

      {/* Main Content Area (Clean White background) */}
      <div className="bg-white text-[#0D2B4E] transition-colors duration-500 !mt-0">

        {/* ==========================================================
          SECTION: SHOP BY CATEGORY ("Silver For Every Story")
          Reference Screenshot Match: 
          Rings | Stone Bracelets | Earring | Bracelets | Pendant | Necklaces
          Theme: MANISH & CO Signature (#F8F5EC Ivory, #0D2B4E Navy, #8C6D46 Bronze, #E6DFD3 Border)
          ========================================================== */}
        <section
          id="silver-for-every-story"
          aria-label="Silver For Every Story - Featured Categories"
          className="w-full bg-[#FFFFFF] pt-8 pb-7 sm:pt-10 sm:pb-9 border-b border-gray-100/60 select-none relative"
        >
          <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 relative">

            {/* Horizontal Scrollable Category Cards Carousel */}
            {dynamicStoryCategories.length > 0 && (
              <div
                ref={storyCarouselRef}
                onMouseDown={handleStoryMouseDown}
                onMouseMove={handleStoryMouseMove}
                onMouseUp={handleStoryMouseUp}
                onMouseLeave={handleStoryMouseUp}
                className="flex items-center gap-3 sm:gap-5 md:gap-6 lg:gap-7 overflow-x-auto no-scrollbar scroll-smooth justify-start py-2 px-1 sm:px-3 cursor-grab active:cursor-grabbing select-none touch-pan-x"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {dynamicStoryCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleStoryCardClick(cat)}
                    className="w-[102px] xs:w-[115px] sm:w-[135px] md:w-[150px] lg:w-[160px] group cursor-pointer flex flex-col items-center shrink-0 focus:outline-none bg-transparent border-0 p-0 transition-transform duration-300 hover:-translate-y-1"
                  >
                    {/* Clean Square Card Image matching reference screenshot */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200/80 shadow-xs group-hover:shadow-md group-hover:border-[#0D2B4E]/40 transition-all duration-300 pointer-events-none">
                      <img
                        src={cat.img}
                        alt={cat.name}
                        draggable={false}
                        className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out select-none pointer-events-none"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getCategoryFallbackImage(cat.name || cat.id);
                        }}
                      />
                      {cat.badge && (
                        <span className="absolute top-1.5 left-1.5 bg-[#0D2B4E] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase font-sans">
                          {cat.badge}
                        </span>
                      )}
                    </div>

                    {/* Clean Category Label Directly Below */}
                    <span className="mt-2.5 sm:mt-3 text-xs sm:text-[13.5px] font-sans font-semibold text-gray-900 group-hover:text-[#0D2B4E] transition-colors text-center block w-full truncate px-1">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Reference Screenshot Exact: ♥ Silver For Every Story ♥ */}
            <div className="max-w-4xl mx-auto flex items-center justify-center mt-6 sm:mt-10 px-2 sm:px-4">
              <div className="flex-1 h-[1.5px] sm:h-[2.5px] bg-[#8C6D46] rounded-full" />
              <span className="px-2.5 sm:px-6 text-[13px] xs:text-[15px] sm:text-[18px] md:text-[20px] font-serif font-bold text-[#0D2B4E] flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap tracking-wide">
                <span className="text-[#8C6D46] text-sm sm:text-lg font-bold">♥</span>
                <span>Silver For Every Story</span>
                <span className="text-[#8C6D46] text-sm sm:text-lg font-bold">♥</span>
              </span>
              <div className="flex-1 h-[1.5px] sm:h-[2.5px] bg-[#8C6D46] rounded-full" />
            </div>

            {/* ==========================================================
                DIWALI FESTIVE SHOWCASE & 4 COLLECTION SPOTLIGHT (Reference Screenshot Exact)
                Left: 2x2 Grid (Tennis, Toe Ring, Pearl, Stone Collections)
                Right: MANISH & CO Royal Diwali Festive Banner (Flat 15% Off)
                ========================================================== */}
            <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">

              {/* Left Column: 2x2 Grid of 4 Collections */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-3.5 sm:gap-5">

                {/* 1. Tennis Collection */}
                <button
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    changeCategoryTab?.(silverStoryData?.cards?.[0]?.tab || 'bracelets');
                    navigateTo('collections');
                  }}
                  className="flex flex-col items-center group cursor-pointer border-none bg-transparent text-left focus:outline-none"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#E6DFD3] shadow-xs group-hover:shadow-md transition-all duration-300">
                    <img
                      src={silverStoryData?.cards?.[0]?.img || colTennisWebp || colTennisPng}
                      alt={silverStoryData?.cards?.[0]?.title || 'TENNIS COLLECTION'}
                      className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2.5 sm:mt-3 text-center">
                    <h3 className="text-xs sm:text-[13.5px] font-sans font-bold tracking-wider uppercase text-[#0D2B4E] group-hover:text-[#8C6D46] transition-colors leading-tight">
                      {silverStoryData?.cards?.[0]?.title || 'TENNIS COLLECTION'}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-sans text-[#8C6D46] font-medium tracking-wide mt-0.5">
                      {silverStoryData?.cards?.[0]?.tagline || '♥ Sparkle On Repeat ♥'}
                    </p>
                  </div>
                </button>

                {/* 2. Toe Ring Collection */}
                <button
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    changeCategoryTab?.(silverStoryData?.cards?.[1]?.tab || 'payal');
                    navigateTo('collections');
                  }}
                  className="flex flex-col items-center group cursor-pointer border-none bg-transparent text-left focus:outline-none"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#E6DFD3] shadow-xs group-hover:shadow-md transition-all duration-300">
                    <img
                      src={silverStoryData?.cards?.[1]?.img || colToeRingWebp || colToeRingPng}
                      alt={silverStoryData?.cards?.[1]?.title || 'TOE RING COLLECTION'}
                      className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2.5 sm:mt-3 text-center">
                    <h3 className="text-xs sm:text-[13.5px] font-sans font-bold tracking-wider uppercase text-[#0D2B4E] group-hover:text-[#8C6D46] transition-colors leading-tight">
                      {silverStoryData?.cards?.[1]?.title || 'TOE RING COLLECTION'}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-sans text-[#8C6D46] font-medium tracking-wide mt-0.5">
                      {silverStoryData?.cards?.[1]?.tagline || '♥ Little Detail Big Mood ♥'}
                    </p>
                  </div>
                </button>

                {/* 3. Pearl Collection */}
                <button
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    changeCategoryTab?.(silverStoryData?.cards?.[2]?.tab || 'necklaces');
                    navigateTo('collections');
                  }}
                  className="flex flex-col items-center group cursor-pointer border-none bg-transparent text-left focus:outline-none"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#E6DFD3] shadow-xs group-hover:shadow-md transition-all duration-300">
                    <img
                      src={silverStoryData?.cards?.[2]?.img || colPearlWebp || colPearlPng}
                      alt={silverStoryData?.cards?.[2]?.title || 'PEARL COLLECTION'}
                      className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2.5 sm:mt-3 text-center">
                    <h3 className="text-xs sm:text-[13.5px] font-sans font-bold tracking-wider uppercase text-[#0D2B4E] group-hover:text-[#8C6D46] transition-colors leading-tight">
                      {silverStoryData?.cards?.[2]?.title || 'PEARL COLLECTION'}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-sans text-[#8C6D46] font-medium tracking-wide mt-0.5">
                      {silverStoryData?.cards?.[2]?.tagline || '♥ Timeless Elegance ♥'}
                    </p>
                  </div>
                </button>

                {/* 4. Stone Collection */}
                <button
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    changeCategoryTab?.(silverStoryData?.cards?.[3]?.tab || 'bracelets');
                    navigateTo('collections');
                  }}
                  className="flex flex-col items-center group cursor-pointer border-none bg-transparent text-left focus:outline-none"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#E6DFD3] shadow-xs group-hover:shadow-md transition-all duration-300">
                    <img
                      src={silverStoryData?.cards?.[3]?.img || colStoneWebp || colStonePng}
                      alt={silverStoryData?.cards?.[3]?.title || 'STONE COLLECTION'}
                      className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2.5 sm:mt-3 text-center">
                    <h3 className="text-xs sm:text-[13.5px] font-sans font-bold tracking-wider uppercase text-[#0D2B4E] group-hover:text-[#8C6D46] transition-colors leading-tight">
                      {silverStoryData?.cards?.[3]?.title || 'STONE COLLECTION'}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-sans text-[#8C6D46] font-medium tracking-wide mt-0.5">
                      {silverStoryData?.cards?.[3]?.tagline || '♥ Add Some Shine ♥'}
                    </p>
                  </div>
                </button>

              </div>

              {/* Right Column: MANISH & CO Diwali Festive Banner (Generated for brand) */}
              <div className="lg:col-span-6 flex">
                <button
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    changeCategoryTab?.(silverStoryData?.banner?.tab || 'Collections');
                    navigateTo('collections');
                  }}
                  className="relative w-full aspect-square sm:aspect-auto sm:min-h-[380px] rounded-2xl overflow-hidden border border-[#E6DFD3] shadow-md hover:shadow-xl transition-all duration-500 group cursor-pointer focus:outline-none bg-gradient-to-br from-[#FAF5EE] to-[#F2E8DA]"
                  aria-label="Explore MANISH & CO Diwali Festive Offer"
                >
                  <img
                    src={silverStoryData?.banner?.img || diwaliFestiveManishAndCoWebp || diwaliFestiveManishAndCoJpg}
                    alt={silverStoryData?.banner?.title || "MANISH & CO Diwali Festive Season - Flat 15% Off On 925 Sterling Silver Jewellery"}
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Subtle Interactive Shimmer Overlay */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* Centered Custom Design Action below Silver For Every Story */}
        <div className="w-full py-4 sm:py-5 px-4 bg-[#FAF7F2] flex justify-center items-center relative z-20 border-b border-[#E6DFD3]/60">
          <button
            type="button"
            onClick={() => {
              triggerAudio('click');
              setCustomDesignOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-[#0D2B4E] hover:bg-[#081B32] text-white font-sans text-xs sm:text-[13px] font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(13,43,78,0.28)] hover:shadow-[0_6px_20px_rgba(13,43,78,0.4)] cursor-pointer active:scale-95 focus:outline-none"
          >
            <Sparkles className="w-4 h-4 text-[#E6DFD3] shrink-0" />
            <span>Custom Design</span>
          </button>
        </div>

        {/* ==========================================================
          SECTION: TRUST SEALS / BRAND ASSURANCES
          (BIS Hallmarked, Free Shipping, COD, 25,000+ Happy Customers)
          Size enlarged, luxury balanced, crystal clear badges
          ========================================================== */}
        <section id="trust-seals-section" className="w-full bg-[#FFFFFF] py-6 sm:py-8 border-b border-gray-100 select-none">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 relative">
            <div className="relative flex items-center justify-center">
              {/* 4 Trust Circular Seals - Clean 4-Col on Mobile, Spacious Flex on Desktop */}
              <div 
                ref={trustSealsScrollRef}
                className="w-full max-w-[1200px] grid grid-cols-4 sm:flex sm:items-center sm:justify-around gap-1.5 xs:gap-3 sm:gap-6 px-1 sm:px-4"
              >
                {TRUST_SEALS_DATA.map((seal) => (
                  <div key={seal.id} className="w-full sm:w-[220px] md:w-[250px] h-[78px] xs:h-[95px] sm:h-[135px] flex items-center justify-center group cursor-pointer select-none">
                    <div className="w-[64px] h-[64px] xs:w-[82px] xs:h-[82px] sm:w-[130px] sm:h-[130px] flex items-center justify-center transition-all duration-300 group-hover:scale-106 group-hover:drop-shadow-md">
                      <picture className="w-full h-full flex items-center justify-center">
                        <source srcSet={seal.imgWebp} type="image/webp" />
                        <img 
                          src={seal.imgPng} 
                          alt={seal.label} 
                          className="w-full h-full object-contain"
                          style={{ maxHeight: '130px', maxWidth: '100%' }}
                          loading="lazy"
                        />
                      </picture>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
          SECTION: SILVER GIFTING HAMPERS
          Festive Gift Picks (Under 1499, Under 1999, Under 2999, Premium Gifts)
          ========================================================== */}
        <section id="silver-gifting-hampers-section" className="w-full bg-[#FFFFFF] py-10 sm:py-14 border-b border-gray-100 select-none">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
            
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-[11px] sm:text-xs font-sans font-bold tracking-[0.28em] text-[#6B4B2E] uppercase block mb-2">
                FESTIVE CELEBRATIONS
              </span>
              <h2 
                className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#0D2B4E] tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                Silver Gifting Hampers
              </h2>
              <div className="w-12 h-[2px] bg-[#6B4B2E] mx-auto mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
              {giftingHampers.map((hamper) => (
                <button
                  key={hamper.id}
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    if (hamper.path) {
                      navigateTo(hamper.path);
                    }
                  }}
                  className="group relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none cursor-pointer border border-[#E8DFD5] hover:border-[#6B4B2E]"
                  aria-label={hamper.title}
                >
                  {(hamper.customImg || hamper.image || hamper.img) ? (
                    <img 
                      src={hamper.customImg || hamper.image || hamper.img} 
                      alt={hamper.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out" 
                      loading="lazy" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = hamper.imgPng || hamper.imgWebp;
                      }}
                    />
                  ) : (
                    <picture className="w-full h-full block">
                      <source srcSet={hamper.imgWebp} type="image/webp" />
                      <img 
                        src={hamper.imgPng} 
                        alt={hamper.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out" 
                        loading="lazy" 
                      />
                    </picture>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* ==========================================================
          SECTION: CRAFT YOUR BESPOKE JEWELLERY BANNER (Edge-to-Edge)
          ========================================================== */}
        <section 
          id="craft-bespoke-jewellery-banner"
          className="w-full bg-white select-none overflow-hidden"
        >
          <button
            type="button"
            onClick={() => {
              triggerAudio('click');
              setConsultationModal(true);
            }}
            className="w-full block border-none p-0 m-0 cursor-pointer text-left focus:outline-none relative group"
            aria-label="Craft Your Bespoke Jewellery - Book a Consultation"
          >
            <picture className="w-full block">
              <source srcSet={craftYourBespokeJewelleryWebp} type="image/webp" />
              <img 
                src={craftYourBespokeJewelleryPng} 
                alt="Craft Your Bespoke Jewellery - MANISH & CO" 
                className="w-full h-auto block object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </button>
        </section>

        {/* ==========================================================
          SECTION: MADE FOR EVERY KIND OF LOVE (Screenshot 01 Exact)
          ========================================================== */}
        <section id="made-for-every-kind-of-love" className="w-full bg-[#FFFFFF] py-10 sm:py-14 border-b border-gray-100 select-none">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
            
            {/* Header: ✨ Made for Every Kind of Love ✨ */}
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-[26px] font-sans font-bold text-[#0D2B4E] tracking-tight inline-flex items-center justify-center gap-2">
                <span className="text-[#6B4B2E] text-lg">✨</span>
                <span>Made for Every Kind of Love</span>
                <span className="text-[#6B4B2E] text-lg">✨</span>
              </h2>
            </div>

            {/* 4 Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
              {LOVE_STORY_CARDS.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => {
                    triggerAudio('click');
                    if (card.tab) changeCategoryTab(card.tab);
                    navigateTo('collections');
                  }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="relative w-full aspect-square rounded-2xl sm:rounded-[30px] overflow-hidden bg-[#F5EDE4] border border-[#E8DFD5] shadow-xs hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:scale-[1.02]">
                    <picture className="w-full h-full block">
                      <source srcSet={card.imgWebp} type="image/webp" />
                      <img 
                        src={card.imgPng} 
                        alt={card.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </picture>
                  </div>

                  <div className="mt-3.5 sm:mt-4 text-center">
                    <span className={`text-xs sm:text-[13px] font-sans font-bold tracking-wider uppercase transition-colors ${
                      card.active 
                        ? 'text-[#6B4B2E] border-b-2 border-[#6B4B2E] pb-0.5' 
                        : 'text-[#0D2B4E] group-hover:text-[#6B4B2E]'
                    }`}>
                      {card.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ==========================================================
          CLIENT FEEDBACK SECTION 4: GEMS COLLECTION (Ultra-Premium Redesign)
          ========================================================== */}
        <section id="gems-collection-section" className="relative w-full py-12 sm:py-20 lg:py-24 bg-gradient-to-b from-[#030911] via-[#061424] to-[#040C16] border-b border-[#C5A880]/20 select-none text-left text-white overflow-hidden">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-14 z-10">

            {/* Editorial Luxury Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-14">
              <div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.06] border border-[#C5A880]/30 backdrop-blur-md mb-2.5 sm:mb-3">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E5C396]" />
                  <span className="text-[#E5C396] text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.25em] uppercase">
                    CERTIFIED NATURAL GEMSTONES
                  </span>
                </div>
                <h2
                  className="text-2xl xs:text-3xl sm:text-4xl lg:text-[50px] font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5DC] via-[#E8D1A7] to-[#C8A265]"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                >
                  Gems Collection
                </h2>
                <div className="w-16 sm:w-20 h-[2px] bg-gradient-to-r from-[#C5A880] to-transparent my-2.5 sm:my-3.5" />
                <p className="text-gray-300 text-xs sm:text-sm font-sans max-w-2xl font-light leading-relaxed">
                  Certified Royal Blue Sapphires, Zambian Emeralds, Burmese Rubies, and Tanzanites hand-set in hallmarked 925 sterling silver. Forged for timeless royalty and astrological radiance.
                </p>
              </div>

              <button
                onClick={() => {
                  changeCategoryTab?.('Collections');
                  navigateTo('collections');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3 sm:py-3.5 bg-[#0D2B4E] hover:bg-[#143B66] active:scale-95 text-white font-sans text-xs sm:text-[12.5px] font-semibold tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.4)] border border-[#C5A880]/40 rounded-sm cursor-pointer group"
              >
                <span>EXPLORE ALL GEMS</span>
                <ArrowRight className="w-4 h-4 text-[#E5C396] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Gems Showcase Banner with Dual-tone Luxury Border */}
            <div className="relative rounded-lg overflow-hidden border border-[#C5A880]/25 shadow-[0_25px_60px_rgba(0,0,0,0.7)] group mb-6 sm:mb-10 bg-black/40">
              <img
                src={gemsCollectionBanner}
                alt="Sapphire, Emerald, Ruby & Tanzanite 925 Silver Jewellery"
                className="w-full h-auto max-h-[460px] object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02060C]/90 via-[#02060C]/35 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-10 sm:right-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[#E5C396] text-[9.5px] sm:text-[11px] font-sans font-bold tracking-[0.22em] uppercase">
                      100% ETHICALLY SOURCED • BIS HALLMARKED 925 SILVER
                    </span>
                  </div>
                  <h3
                    className="font-serif text-lg xs:text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-lg text-white"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    Earth's Rarest Hues. Forged in Pure Silver.
                  </h3>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-[#C5A880]/30 text-xs font-sans font-medium text-[#E5C396]">
                  <span>IGI / SGL Certified Gemstones</span>
                </div>
              </div>
            </div>

            {/* 4 Premium Gemstone Cards - 2x2 Grid on Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[
                { 
                  name: 'Royal Sapphire', 
                  stone: 'Neelam', 
                  origin: 'Ceylon • AAA', 
                  desc: 'Symbol of wisdom, regal grace & serene mental focus.',
                  accentGlow: 'hover:border-[#3B82F6]/60 hover:shadow-[0_12px_32px_rgba(59,130,246,0.22)]',
                  badgeBg: 'bg-[#3B82F6]/15 text-[#93C5FD] border-[#3B82F6]/30',
                  gemDot: 'bg-[#3B82F6]'
                },
                { 
                  name: 'Zambian Emerald', 
                  stone: 'Panna', 
                  origin: 'Zambia • AAA', 
                  desc: 'Lush green harmony, flourishing prosperity & crisp clarity.',
                  accentGlow: 'hover:border-[#10B981]/60 hover:shadow-[0_12px_32px_rgba(16,185,129,0.22)]',
                  badgeBg: 'bg-[#10B981]/15 text-[#6EE7B7] border-[#10B981]/30',
                  gemDot: 'bg-[#10B981]'
                },
                { 
                  name: 'Burmese Ruby', 
                  stone: 'Manik', 
                  origin: 'Burma • AAA', 
                  desc: 'Fiery passion, invictus courage & noble self-confidence.',
                  accentGlow: 'hover:border-[#F43F5E]/60 hover:shadow-[0_12px_32px_rgba(244,63,94,0.22)]',
                  badgeBg: 'bg-[#F43F5E]/15 text-[#FDA4AF] border-[#F43F5E]/30',
                  gemDot: 'bg-[#F43F5E]'
                },
                { 
                  name: 'Royal Tanzanite', 
                  stone: 'Tanzanite', 
                  origin: 'Merelani • AAAA', 
                  desc: 'Rare deep indigo African treasure with mystical brilliance.',
                  accentGlow: 'hover:border-[#8B5CF6]/60 hover:shadow-[0_12px_32px_rgba(139,92,246,0.22)]',
                  badgeBg: 'bg-[#8B5CF6]/15 text-[#C4B5FD] border-[#8B5CF6]/30',
                  gemDot: 'bg-[#8B5CF6]'
                }
              ].map((gem, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    changeCategoryTab?.('Collections');
                    navigateTo('collections');
                  }}
                  className={`relative p-3.5 sm:p-5 lg:p-6 rounded-lg bg-white/[0.03] backdrop-blur-md border border-white/10 transition-all duration-300 cursor-pointer group hover:bg-white/[0.07] ${gem.accentGlow}`}
                >
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-2 mb-2 sm:mb-3">
                    <span className="text-[#C5A880] text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.2em] uppercase">
                      {gem.stone}
                    </span>
                    <span className={`text-[8.5px] sm:text-[9.5px] font-sans font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border self-start xs:self-auto ${gem.badgeBg}`}>
                      {gem.origin}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-sm shrink-0 ${gem.gemDot}`} />
                    <h4
                      className="font-serif text-sm xs:text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-[#FFF5DC] transition-colors truncate"
                      style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                    >
                      {gem.name}
                    </h4>
                  </div>

                  <p className="text-gray-400 text-[10.5px] sm:text-xs font-sans mt-1 sm:mt-2 leading-relaxed line-clamp-2 min-h-[30px] sm:min-h-[36px]">
                    {gem.desc}
                  </p>

                  <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-sans font-bold tracking-wider uppercase text-[#E5C396] group-hover:text-white transition-colors">
                      Shop
                    </span>
                    <span className="w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-full bg-[#0D2B4E] group-hover:bg-[#143B66] text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-sm text-xs sm:text-sm">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <section id="our-collections" className="w-full py-12 sm:py-16 lg:py-20 bg-white border-b border-[#E8DFD5] select-none">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">

              {/* Left Column: Editorial Brand Headline */}
              <div className="w-full lg:w-[32%] xl:w-[28%] shrink-0 text-left">
                {/* Eyebrow */}
                <span className="inline-block text-[#6B4B2E] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-3 sm:mb-4">
                  OUR COLLECTIONS
                </span>

                {/* Main Serif Headline */}
                <h2
                  className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-[#0D2B4E] leading-[1.08] mb-4 sm:mb-5"
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
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#0D2B4E] hover:bg-[#081B32] active:scale-95 text-white font-sans text-xs sm:text-[12.5px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(13,43,78,0.25)] cursor-pointer rounded-none"
                  >
                    <span>SHOP ALL</span>
                    <span className="text-sm font-light">→</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Collection Category Cards */}
              <div className="w-full lg:flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {displayCategories.slice(0, 4).map((cat) => (
                  <div
                    key={cat.id || cat.docId || cat.name}
                    onClick={() => {
                      triggerAudio('click');
                      changeCategoryTab?.(cat.name);
                      navigateTo('collections');
                    }}
                    className="group cursor-pointer flex flex-col items-center text-center select-none"
                  >
                    <div className="w-full aspect-[148/169] overflow-hidden bg-black/5 shadow-sm relative">
                      <img
                        src={cat.img || getCategoryFallbackImage(cat.name || cat.id)}
                        alt={`${cat.name} - MANISH & CO`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <h3 className="font-sans font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#0D2B4E] mt-3 group-hover:text-[#6B4B2E] transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] sm:text-xs text-[#6F6862] group-hover:text-[#6B4B2E] group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1 mt-0.5 font-normal">
                      <span>Shop Now</span>
                      <span className="text-xs">→</span>
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================================
          CLIENT FEEDBACK SECTION 1: BEST SELLERS (Dynamic Products)
          ========================================================== */}
        {dynamicBestSellers.length > 0 && (
          <section id="best-sellers" className="w-full py-14 sm:py-20 bg-white border-b border-[#EAE3D9] select-none">
            <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">

              {/* Editorial Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-12">
                <div className="text-left">
                  <span className="inline-block text-[#6B4B2E] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.28em] uppercase mb-2">
                    CURATED PATRON FAVORITES
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#0D2B4E] leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    Best Sellers
                  </h2>
                  <p className="text-[#6F6862] text-xs sm:text-sm font-sans mt-2 max-w-xl font-normal">
                    Our most cherished BIS hallmarked 925 sterling silver creations, celebrated by patrons across India.
                  </p>
                </div>

                <button
                  onClick={() => {
                    changeCategoryTab?.('Collections');
                    navigateTo('collections');
                  }}
                  className="text-[#0D2B4E] hover:text-[#6B4B2E] font-sans text-xs sm:text-[13px] font-semibold tracking-[0.18em] uppercase inline-flex items-center gap-2 transition-colors cursor-pointer group shrink-0"
                >
                  <span>Explore All Icons</span>
                  <span className="text-sm font-light transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </button>
              </div>

              {/* Dynamic Best Seller Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
                {dynamicBestSellers.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.id) navigateToPDP?.(item);
                      else navigateTo('collections');
                    }}
                    className="group cursor-pointer flex flex-col bg-white border border-[#E8DFD5] hover:border-[#8C6D46]/60 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(140,109,70,0.18)] transition-all duration-500 overflow-hidden text-left"
                  >
                    {/* Image Container with Badge */}
                    <div className="w-full aspect-[4/5] overflow-hidden bg-[#FAF6F2] relative">
                      <img
                        src={item.img || getCategoryFallbackImage(item.category || item.name)}
                        alt={item.name || item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />

                      {/* Badge */}
                      <span className="absolute top-2.5 left-2.5 bg-[#050B14]/90 backdrop-blur-xs text-[#E5C396] text-[8.5px] sm:text-[9.5px] font-sans font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-[1px] border border-[#C5A880]/30 shadow-xs">
                        {item.badge || 'BESTSELLER'}
                      </span>

                      {/* Quick View Pill */}
                      <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full py-2 bg-[#0D2B4E] text-white text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.18em] uppercase text-center shadow-lg">
                          VIEW PIECE →
                        </div>
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-3.5 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                      <div>
                        <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#6B4B2E] font-semibold tracking-wider uppercase mb-1">
                          <span>{item.silverPurity || item.purity || '925 Silver'}</span>
                          <span className="flex items-center gap-1 text-amber-600">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{item.rating || '4.9'}</span>
                          </span>
                        </div>
                        <h3
                          className="font-serif text-sm sm:text-base lg:text-[17px] font-bold text-[#0D2B4E] group-hover:text-[#6B4B2E] transition-colors line-clamp-1"
                          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                        >
                          {item.name || item.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F0EAE1]">
                        <span className="font-serif text-base sm:text-lg font-bold text-[#0D2B4E]">
                          {item.price ? `₹${Number(item.price).toLocaleString('en-IN')}` : ''}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-sans tracking-wider uppercase text-gray-500 group-hover:text-[#6B4B2E] transition-colors font-medium">
                          Shop Now →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}



        {/* ==========================================================
          FEATURE 03: BUILT ON PURITY — WHY 925 FINE SILVER?
          (Edge-by-Edge Full-Bleed Banner)
          ========================================================== */}
        <section
          id="built-on-purity"
          className="w-full relative overflow-hidden select-none bg-[#091B2B] cursor-pointer group border-b border-white/10"
          onClick={() => {
            triggerAudio('click');
            changeCategoryTab?.('Silver', 'silver', 'all');
            if (typeof setMetalFilter === 'function') setMetalFilter('silver');
            navigateTo('collections');
          }}
        >
          <img
            src={bannerBuiltOnPurity}
            alt="Built on Purity - Why 925 Sterling Silver? MANISH & CO Fine Jewellery"
            className="w-full h-auto min-h-[190px] sm:min-h-0 object-cover object-center block transition-transform duration-700 ease-out group-hover:scale-[1.008]"
            loading="lazy"
          />
          {/* Subtle luxury ambient hover sheen */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.025] transition-colors duration-300 pointer-events-none" />
        </section>

        {/* ==========================================================
          BRAND CAMPAIGN VIDEO
          ========================================================== */}
        <section className="py-20 bg-white overflow-hidden text-center">
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
                    <p className="text-white text-xs sm:text-sm font-serif tracking-wider drop-shadow-md">
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

            <div className="text-center space-y-2.5">
              <span className="text-[10.5px] uppercase tracking-[0.35em] text-[#6B4B2E] font-bold font-sans">TAILORED SELECTION</span>
              <h2 className="serif-luxury text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#0D2B4E]">Recommended for You</h2>
              <div className="w-14 h-[2px] bg-[#6B4B2E] mx-auto mt-2 rounded-full"></div>
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
                className="absolute left-2 md:left-4 z-10 p-2.5 rounded-full border border-solid shadow-lg transition-all duration-300 -translate-x-4 opacity-0 group-hover/sect:opacity-100 group-hover/sect:translate-x-0 cursor-pointer hidden md:flex items-center justify-center bg-white/95 backdrop-blur-sm border-[#E6DFD3] text-[#0D2B4E] hover:bg-[#F5EDE4]"
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
                        className="w-[115px] h-[115px] sm:w-[135px] sm:h-[135px] md:w-[150px] md:h-[150px] rounded-2xl overflow-hidden border border-solid border-[#EADBCE]/90 bg-white flex items-center justify-center transition-all duration-300 ease group-hover:scale-[1.04] group-hover:-translate-y-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] group-hover:shadow-[0_12px_28px_rgba(107,75,46,0.18)]"
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
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        />
                      </div>
                      <span
                        className="font-sans text-[11px] sm:text-xs tracking-wider uppercase font-semibold transition-colors duration-300 text-[#0D2B4E] group-hover:text-[#6B4B2E]"
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
                className="absolute right-2 md:right-4 z-10 p-2.5 rounded-full border border-solid shadow-lg transition-all duration-300 translate-x-4 opacity-0 group-hover/sect:opacity-100 group-hover/sect:-translate-x-0 cursor-pointer hidden md:flex items-center justify-center bg-white/95 backdrop-blur-sm border-[#E6DFD3] text-[#0D2B4E] hover:bg-[#F5EDE4]"
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
          className="w-full relative overflow-hidden select-none bg-[#091B2B] cursor-pointer group border-y border-white/10"
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
        <section id="testimonials" ref={testimonialsRef}
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

          {/* ==========================================================
              MOBILE VIEW (< md): Responsive Touch Swipe Cards Carousel
              ========================================================== */}
          <div className="md:hidden w-full px-4">
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 py-4 px-1 touch-pan-x">
              {[
                {
                  name: "Aarohi Sharma, 27",
                  quote: "My dream silver bridal set became a reality with MANISH & CO. The craftsmanship and royal finish are beyond expectations.",
                  img: testimonial1
                },
                {
                  name: "Priya Mehta, 31",
                  quote: "The quality, finishing, and personalized service made my purchase truly memorable. A perfect luxury silver boutique experience.",
                  img: testimonial2
                },
                {
                  name: "Neha Kapoor, 29",
                  quote: "I wear my bracelet every day and it still looks stunning. Timeless craftsmanship, 925 purity and exceptional quality.",
                  img: testimonial3
                },
                {
                  name: "Riya Verma, 26",
                  quote: "My husband gifted me this beautiful necklace and I receive compliments everywhere. The wax seal packaging was breathtaking.",
                  img: testimonial4
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="w-[82vw] max-w-[310px] shrink-0 snap-center bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_25px_rgba(13,43,78,0.08)] border border-[#E6DFD3] flex flex-col items-center select-none"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#F8F5EC] p-1.5 border border-[#E6DFD3] mb-3 shadow-xs">
                    <img
                      src={item.img}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center rounded-lg pointer-events-none"
                    />
                  </div>

                  <div className="flex items-center gap-1 text-[#D4AF37] text-xs mb-2">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    <span className="text-[10px] text-[#6B4B2E] font-medium ml-1 font-sans">Verified Purchase</span>
                  </div>

                  <div className="w-full text-center space-y-1.5">
                    <h4 className="font-sans font-bold text-[13px] tracking-wide text-[#0D2B4E]">
                      {item.name}
                    </h4>
                    <p className="font-sans text-[11px] leading-relaxed tracking-normal font-normal text-[#657989] italic">
                      "{item.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ==========================================================
              DESKTOP VIEW (>= md): Clothesline with Hanging Clips & Rotations
              ========================================================== */}
          <div
            ref={polaroidScrollRef}
            onScroll={handlePolaroidScroll}
            className="hidden md:block w-full overflow-x-auto no-scrollbar py-6 snap-x touch-pan-x"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="relative w-full min-w-[1100px] sm:min-w-[1250px] lg:min-w-[1400px] xl:min-w-0 xl:w-full h-[460px] sm:h-[480px]">
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
            { yr: 1996, label: "1996", title: "Mau Atelier Inception", desc: "Foundations of our master silversmith studio in Mau, hand-sculpting pristine silver ornaments and setting absolute purity standards in dense 925 sterling silver." },
            { yr: 2004, label: "2004", title: "Artisanal Hallmarking & Chitai Craft", desc: "Pioneering traditional hand-hammered Chitai work and introducing rigorous 925 purity benchmarks across eastern Uttar Pradesh." },
            { yr: 2012, label: "2012", title: "Sterling Silver & Bridal Expansion", desc: "Introduction of signature handcrafted bridal silver payals, royal kadas, heavy curb chains, and bespoke gemstone suites." },
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
        <div className="w-full bg-white py-16 lg:py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-solid border-gray-200 select-none text-center">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20 text-center">
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left shrink-0">
              <h3 className="font-serif text-[#0D2B4E] text-[28px] sm:text-[36px] lg:text-[44px] font-normal tracking-[0.01em] leading-tight m-0">MANISH &amp; CO</h3>
              <h2 className="font-serif text-[#6B4B2E] text-[56px] sm:text-[72px] lg:text-[84px] font-extrabold tracking-[0.02em] leading-none mt-1 sm:mt-2 mb-0">Promise</h2>
            </div>

            <div className="w-full lg:w-1/2 grid grid-cols-3 gap-y-10 sm:gap-y-12 gap-x-4 sm:gap-x-8 md:gap-x-12 justify-items-center text-center">
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#0D2B4E] border-2 border-[#6B4B2E] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <span className="text-[8px] sm:text-[10px] tracking-widest uppercase opacity-75 font-semibold font-sans">SINCE</span>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold font-serif tracking-wider mt-0.5">1996</span>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#0D2B4E] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Artisanal Heritage of Mau</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#0D2B4E] border-2 border-[#6B4B2E] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#0D2B4E] font-sans font-medium tracking-wide text-center mt-3 leading-snug">100% Certified Jewellery</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#0D2B4E] border-2 border-[#6B4B2E] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#0D2B4E] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Lifetime Exchange &amp; Buyback</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#0D2B4E] border-2 border-[#6B4B2E] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#0D2B4E] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Guaranteed Purity &amp; Value</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#0D2B4E] border-2 border-[#6B4B2E] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#0D2B4E] font-sans font-medium tracking-wide text-center mt-3 leading-snug">100% Transparency</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#0D2B4E] border-2 border-[#6B4B2E] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#0D2B4E] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Free Shipping</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#0D2B4E] border-2 border-[#6B4B2E] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#0D2B4E] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Authentic Rajputi Ornaments</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#0D2B4E] border-2 border-[#6B4B2E] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><polygon points="23 7 16 12 23 17 23 7" strokeLinecap="round" strokeLinejoin="round" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#0D2B4E] font-sans font-medium tracking-wide text-center mt-3 leading-snug">Personalised Video Consultations</p>
              </div>
              <div className="flex flex-col items-center max-w-[120px] text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#0D2B4E] border-2 border-[#6B4B2E] text-white flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 sm:w-10 sm:h-10"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#0D2B4E] font-sans font-medium tracking-wide text-center mt-3 leading-snug">BIS 916 Hallmarked Gold</p>
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
