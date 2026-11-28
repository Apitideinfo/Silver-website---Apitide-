import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import Modal from '../components/Modal';
import BookingForm from '../forms/BookingForm';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { ArrowRight, Star, Sparkles, ChevronRight, ChevronLeft, Diamond, Shield, ShieldCheck, RotateCcw, Truck, Gift } from 'lucide-react';

// Category Image Fallbacks
import solitariesImg from '../assets/solitaries.png';
import watchJewelleryImg from '../assets/watch_jewellery.png';
import mensJewelleryImg from '../assets/mens_jewellery.png';
import nosePinsImg from '../assets/nose_pins.png';
import kidsJewelleryImg from '../assets/kids_jewellery.png';
import goldCoinsImg from '../assets/gold_coins.png';
import kadaImg from '../assets/kada.png';
import EditorialShowcaseSection from '../components/EditorialShowcaseSection';
import { showcaseSectionsService, DEFAULT_SHOWCASE_SECTIONS } from '../services/showcaseSectionsService';
import herRings from '../assets/editorial/her_rings.jpg';
import herBracelets from '../assets/editorial/her_bracelets.jpg';
import herAnklets from '../assets/editorial/her_anklets.jpg';
import necklacesImg from '../assets/necklaces.png';
import pendantsImg from '../assets/pendants.png';
import earringsImg from '../assets/clean_categories/earrings.png';
import silverChainImg from '../assets/clean_categories/silver_chain.png';
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
import { giftingHampersService, getHamperFallbackImage } from '../services/giftingHampersService';

// Dynamic Hero Banners Service
import { heroBannerService, DEFAULT_HERO_BANNERS } from '../services/heroBannerService';

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
import bannerMoreThanABrandWebp from '../assets/more_than_a_brand_a_promise_hd.webp';
import bannerMoreThanABrandPng from '../assets/more_than_a_brand_a_promise_hd.png';
import bannerCraftsmanshipTimelessRingsWebp from '../assets/craftsmanship_behind_timeless_rings.webp';
import bannerCraftsmanshipTimelessRingsPng from '../assets/craftsmanship_behind_timeless_rings.png';



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
  setMaxPriceFilter,
  setGenderFilter = () => {},
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

  // Sync listener for categories updates from cloud/admin
  const [categoriesVersion, setCategoriesVersion] = useState(0);
  useEffect(() => {
    const handleCategorySync = () => setCategoriesVersion(v => v + 1);
    window.addEventListener('manish_catalog_updated', handleCategorySync);
    window.addEventListener('storage', (e) => {
      if (e.key === 'manish_categories_store' || e.key === 'manish_sync_pulse') {
        handleCategorySync();
      }
    });
    return () => window.removeEventListener('manish_catalog_updated', handleCategorySync);
  }, []);

  // Dynamic Category Slider (populated live from Admin Categories)
  const dynamicStoryCategories = React.useMemo(() => {
    const isAllCleared = StorageService.get('manish_categories_all_cleared', false);
    if (isAllCleared) return [];

    const deletedIds = StorageService.get('manish_categories_deleted_ids', []);
    const isInit = StorageService.get('manish_categories_initialized', false);

    let list = [];
    if (Array.isArray(categories) && categories.length > 0) {
      list = categories;
    } else {
      const cached = StorageService.get('manish_categories_store', null);
      if (Array.isArray(cached) && cached.length > 0) {
        list = cached;
      } else if (!isInit && !isAllCleared) {
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
  }, [categories, categoriesVersion]);

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

    window.addEventListener('manish_silver_story_updated', handleSilverStorySync);

    const storageHandler = (e) => {
      if (e.key === 'manish_silver_story_data' || (e.key === 'manish_sync_pulse' && e.newValue && e.newValue.startsWith('silver_story_'))) {
        handleSilverStorySync();
      }
    };
    window.addEventListener('storage', storageHandler);

    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('manish_store_sync');
        bc.onmessage = (msg) => {
          if (msg?.data?.type === 'silver_story') {
            handleSilverStorySync();
          }
        };
      } catch { /* noop */ }
    }

    return () => {
      window.removeEventListener('manish_silver_story_updated', handleSilverStorySync);
      window.removeEventListener('storage', storageHandler);
      if (bc) bc.close();
    };
  }, []);

  // ─── DYNAMIC SILVER GIFTING HAMPERS ──────────────────────────────
  const [giftingHampers, setGiftingHampers] = useState(() => giftingHampersService.getStoredHampers());

  useEffect(() => {
    giftingHampersService.fetchRemoteHampers().then(res => {
      if (res) setGiftingHampers(res);
    });

    const handleGiftingHampersSync = () => {
      setGiftingHampers(giftingHampersService.getStoredHampers());
    };

    window.addEventListener('manish_gifting_hampers_updated', handleGiftingHampersSync);

    const storageHandler = (e) => {
      if (e.key === 'manish_gifting_hampers_data' || (e.key === 'manish_sync_pulse' && e.newValue && e.newValue.startsWith('gifting_hampers_'))) {
        handleGiftingHampersSync();
      }
    };
    window.addEventListener('storage', storageHandler);

    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('manish_store_sync');
        bc.onmessage = (msg) => {
          if (msg?.data?.type === 'gifting_hampers') {
            handleGiftingHampersSync();
          }
        };
      } catch { /* noop */ }
    }

    return () => {
      window.removeEventListener('manish_gifting_hampers_updated', handleGiftingHampersSync);
      window.removeEventListener('storage', storageHandler);
      if (bc) bc.close();
    };
  }, []);

  // Combined dynamic categories with baseline reference set (all 10+ reference categories)
  const displayCategories = React.useMemo(() => {
    const isAllCleared = StorageService.get('manish_categories_all_cleared', false);
    if (isAllCleared) return [];

    const deletedIds = StorageService.get('manish_categories_deleted_ids', []);
    if (Array.isArray(categories) && categories.length > 0) {
      return categories.filter(c => {
        const id = String(c.id || c.docId || c.name || '').toLowerCase();
        return !deletedIds.includes(id) && !deletedIds.includes(String(c.id || '')) && !deletedIds.includes(String(c.docId || ''));
      });
    }
    const cached = StorageService.get('manish_categories_store', null);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached.filter(c => {
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


  // Polaroid Testimonials Data
  const polaroidTestimonialsData = [
    {
      name: "Aarohi Sharma, 27",
      quote: "My dream silver bridal set became a reality with MANISH & CO. The craftsmanship and royal finish are beyond expectations.",
      img: testimonial1,
      rot: "rotate-[-4deg] sm:rotate-[-8deg]",
      top: "42px"
    },
    {
      name: "Priya Mehta, 31",
      quote: "The quality, finishing, and personalized service made my purchase truly memorable. A perfect luxury silver boutique experience.",
      img: testimonial2,
      rot: "rotate-[3deg] sm:rotate-[-3deg]",
      top: "52px"
    },
    {
      name: "Neha Kapoor, 29",
      quote: "I wear my bracelet every day and it still looks stunning. Timeless craftsmanship, 925 purity and exceptional quality.",
      img: testimonial3,
      rot: "rotate-[-3deg] sm:rotate-[4deg]",
      top: "50px"
    },
    {
      name: "Riya Verma, 26",
      quote: "My husband gifted me this beautiful necklace and I receive compliments everywhere. The wax seal packaging was breathtaking.",
      img: testimonial4,
      rot: "rotate-[4deg] sm:rotate-[8deg]",
      top: "42px"
    }
  ];

  // Polaroid Testimonials Refs & Progress State
  const testimonialsRef = useRef(null);
  const [testimonialsInView, setTestimonialsInView] = useState(false);
  const polaroidScrollRef = useRef(null);
  const [polaroidScrollProgress, setPolaroidScrollProgress] = useState(0);
  const [activePolaroidIdx, setActivePolaroidIdx] = useState(0);

  const scrollToPolaroid = (idx) => {
    if (polaroidScrollRef.current) {
      const container = polaroidScrollRef.current;
      const card = container.children[idx];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      setActivePolaroidIdx(idx);
    }
  };

  const scrollPolaroid = (direction) => {
    const nextIdx = direction === 'left' ? Math.max(0, activePolaroidIdx - 1) : Math.min(3, activePolaroidIdx + 1);
    scrollToPolaroid(nextIdx);
  };

  const handlePolaroidScroll = () => {
    if (polaroidScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = polaroidScrollRef.current;
      const totalScroll = scrollWidth - clientWidth;
      if (totalScroll > 0) {
        setPolaroidScrollProgress((scrollLeft / totalScroll) * 100);
        const cardStep = totalScroll / 3;
        const currentIdx = Math.round(scrollLeft / Math.max(cardStep, 1));
        setActivePolaroidIdx(Math.min(3, Math.max(0, currentIdx)));
      }
    }
  };

  // Curated Showcase Special Occasions Active Tab
  const [specialOccasionTab, setSpecialOccasionTab] = useState('for-kids');

  // Featured Collection Cards (for "Crafted for Every Moment" - Screenshot 2)
  const featuredCollectionCards = React.useMemo(() => {
    const defaultFeatured = [
      { id: 'rings', name: 'Rings', img: herRings, tab: 'rings' },
      { id: 'necklaces', name: 'Necklaces', img: necklacesImg, tab: 'necklaces' },
      { id: 'bracelets', name: 'Bracelets', img: herBracelets, tab: 'bracelets' },
      { id: 'payal', name: 'Anklets', img: herAnklets, tab: 'payal' }
    ];

    if (Array.isArray(categories) && categories.length > 0) {
      const live = categories.map(c => ({
        id: c.id || c.docId || c.name,
        name: c.name,
        img: c.img || getCategoryFallbackImage(c.name || c.id),
        tab: c.tab || c.name
      }));
      if (live.length >= 4) return live.slice(0, 4);
      const existingNames = new Set(live.map(l => String(l.name).toLowerCase()));
      const fillers = defaultFeatured.filter(b => !existingNames.has(b.name.toLowerCase()));
      return [...live, ...fillers].slice(0, 4);
    }

    return defaultFeatured;
  }, [categories]);

  // Recommended For You Categories (Dynamic from Shop by Category - Requirement 2)
  const activeCategories = React.useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories.map(c => ({
        id: c.id || c.docId || c.name,
        name: c.name,
        img: c.img || getCategoryFallbackImage(c.name || c.id),
        tab: c.tab || c.name
      }));
    }
    return (INITIAL_CATEGORIES || []).map(c => ({
      id: c.id || c.name,
      name: c.name,
      img: c.img || getCategoryFallbackImage(c.name || c.id),
      tab: c.tab || c.name
    }));
  }, [categories]);

  // Dynamic Curated Showcase Sections from Admin (Requirement 1)
  const [showcaseData, setShowcaseData] = useState(() => showcaseSectionsService.getStoredShowcaseData());

  useEffect(() => {
    showcaseSectionsService.fetchRemoteShowcaseData().then(data => {
      if (data) setShowcaseData(data);
    });

    const handleShowcaseSync = () => {
      setShowcaseData(showcaseSectionsService.getStoredShowcaseData());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('manish_curated_showcase_updated', handleShowcaseSync);
      window.addEventListener('manish_curated_showcases_updated', handleShowcaseSync);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('manish_curated_showcase_updated', handleShowcaseSync);
        window.removeEventListener('manish_curated_showcases_updated', handleShowcaseSync);
      }
    };
  }, []);

  const forHerSection = showcaseData['for-her'] || DEFAULT_SHOWCASE_SECTIONS['for-her'];
  const forHimSection = showcaseData['for-him'] || DEFAULT_SHOWCASE_SECTIONS['for-him'];
  const specialOccasionActive = showcaseData[specialOccasionTab] || DEFAULT_SHOWCASE_SECTIONS[specialOccasionTab] || DEFAULT_SHOWCASE_SECTIONS['for-kids'];

  // Story & Process States
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
        {/* Banner Images Carousel Container - Fully responsive across mobile, tablet & desktop */}
        <div 
          className="relative w-full overflow-hidden bg-[#091B2B] h-[205px] xs:h-[235px] sm:h-[285px] md:h-auto md:aspect-[2200/715] flex items-center justify-center"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentHeroSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full cursor-pointer flex items-center justify-center"
              onClick={() => {
                const banner = heroBanners[currentHeroSlide] || heroBanners[0];
                if (banner?.category && typeof changeCategoryTab === 'function') {
                  changeCategoryTab(banner.category);
                }
                navigateTo(banner?.page || 'collections');
              }}
            >
              {(() => {
                const banner = heroBanners[currentHeroSlide] || DEFAULT_HERO_BANNERS[0];
                const def = DEFAULT_HERO_BANNERS[currentHeroSlide % DEFAULT_HERO_BANNERS.length] || DEFAULT_HERO_BANNERS[0];
                const isCustom = banner.isCustom || !['hero-1', 'hero-2', 'hero-3', 'hero-4'].includes(banner?.id) || Boolean(banner.customImg && !banner.customImg.startsWith('/assets/'));
                const bannerSrc = (banner.customImg && !banner.customImg.startsWith('/assets/')) 
                  ? banner.customImg 
                  : (banner.png || (!isCustom && banner.webp) || def.png || def.webp);
                const mobileSrc = (banner.mobileImg && !banner.mobileImg.startsWith('/assets/')) 
                  ? banner.mobileImg 
                  : bannerSrc;

                return (
                  <picture className="w-full h-full block">
                    {mobileSrc && mobileSrc !== bannerSrc && (
                      <source media="(max-width: 767px)" srcSet={mobileSrc} />
                    )}
                    {!isCustom && banner.webp && (
                      <source srcSet={banner.webp} type="image/webp" />
                    )}
                    <img
                      src={bannerSrc}
                      alt={banner?.alt || banner?.title || 'MANISH & CO Hero Banner'}
                      className="w-full h-full object-contain md:object-cover object-center select-none"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        if (!isCustom) {
                          e.currentTarget.src = def.png || def.webp;
                        }
                      }}
                    />
                  </picture>
                );
              })()}
            </motion.div>
          </AnimatePresence>

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

      {/* ==========================================================
          LUXURY TRUST BADGES STRIP (Directly Below Hero Section)
          5-Item Assurances Matching Brand Reference:
          1. 925 Fine Jewellery
          2. 100% Hypoallergenic
          3. 90% Refund Policy
          4. Free Shipping Across India
          5. Elegant Gift Packaging
          ========================================================== */}
      <section 
        id="hero-trust-badges-strip"
        aria-label="Manish and Co Guarantees" 
        className="w-full bg-[#FAF7F2] border-b border-[#E6DFD3] select-none py-3.5 sm:py-5"
      >
        <div className="max-w-[1536px] mx-auto px-2 sm:px-6 lg:px-10">
          <div className="grid grid-cols-5 divide-x divide-[#E2D8CC] items-center text-center">
            
            {/* 1. 925 Fine Jewellery */}
            <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 group">
              <Diamond className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#0D2B4E] stroke-[1.3] mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-serif text-[11px] xs:text-xs sm:text-sm md:text-[15px] font-bold text-[#0D2B4E] leading-tight sm:leading-snug">
                925 Fine
              </span>
              <span className="font-sans text-[9px] xs:text-[10px] sm:text-xs text-[#5A6474] font-medium leading-tight">
                Jewellery
              </span>
            </div>

            {/* 2. 100% Hypoallergenic */}
            <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 group">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#0D2B4E] stroke-[1.3] mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-serif text-[11px] xs:text-xs sm:text-sm md:text-[15px] font-bold text-[#0D2B4E] leading-tight sm:leading-snug">
                100%
              </span>
              <span className="font-sans text-[9px] xs:text-[10px] sm:text-xs text-[#5A6474] font-medium leading-tight">
                Hypoallergenic
              </span>
            </div>

            {/* 3. 90% Refund Policy */}
            <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 group">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#0D2B4E] stroke-[1.3] mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-serif text-[11px] xs:text-xs sm:text-sm md:text-[15px] font-bold text-[#0D2B4E] leading-tight sm:leading-snug">
                90%
              </span>
              <span className="font-sans text-[9px] xs:text-[10px] sm:text-xs text-[#5A6474] font-medium leading-tight">
                Refund Policy
              </span>
            </div>

            {/* 4. Free Shipping Across India */}
            <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 group">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#0D2B4E] stroke-[1.3] mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-serif text-[11px] xs:text-xs sm:text-sm md:text-[15px] font-bold text-[#0D2B4E] leading-tight sm:leading-snug whitespace-nowrap">
                Free Shipping
              </span>
              <span className="font-sans text-[9px] xs:text-[10px] sm:text-xs text-[#5A6474] font-medium leading-tight whitespace-nowrap">
                Across India
              </span>
            </div>

            {/* 5. Elegant Gift Packaging */}
            <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 group">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#0D2B4E] stroke-[1.3] mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-serif text-[11px] xs:text-xs sm:text-sm md:text-[15px] font-bold text-[#0D2B4E] leading-tight sm:leading-snug">
                Elegant
              </span>
              <span className="font-sans text-[9px] xs:text-[10px] sm:text-xs text-[#5A6474] font-medium leading-tight whitespace-nowrap">
                Gift Packaging
              </span>
            </div>

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
          SECTION: SHOP BY CATEGORY (Featured Categories Carousel)
          Reference Screenshot Match: 
          Rings | Stone Bracelets | Earring | Bracelets | Pendant | Necklaces
          ========================================================== */}
        <section
          id="shop-by-category-cards"
          aria-label="Shop By Category - Featured Categories"
          className="w-full bg-[#FFFFFF] pt-6 pb-6 sm:pt-8 sm:pb-8 border-b border-gray-100/60 select-none relative"
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
                className="flex items-center gap-2.5 xs:gap-3.5 sm:gap-5 md:gap-6 lg:gap-7 overflow-x-auto no-scrollbar scroll-smooth justify-start py-2 px-1 sm:px-3 cursor-grab active:cursor-grabbing select-none touch-pan-x snap-x snap-mandatory"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {dynamicStoryCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleStoryCardClick(cat)}
                    className="w-[92px] xs:w-[108px] sm:w-[130px] md:w-[145px] lg:w-[160px] snap-start group cursor-pointer flex flex-col items-center shrink-0 focus:outline-none bg-transparent border-0 p-0 transition-transform duration-300 hover:-translate-y-1"
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
                    <span className="mt-2 sm:mt-2.5 text-[11px] xs:text-xs sm:text-[13.5px] font-sans font-semibold text-gray-900 group-hover:text-[#0D2B4E] transition-colors text-center block w-full truncate px-0.5">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* ==========================================================
          SECTION: CRAFTSMANSHIP BEHIND TIMELESS RINGS (Edge-to-Edge Banner)
          User Request: Add on edge to edge below this image section
          ========================================================== */}
        <section 
          id="craftsmanship-timeless-rings-banner"
          className="w-full bg-[#061220] select-none overflow-hidden cursor-pointer group"
          onClick={() => {
            triggerAudio('click');
            changeCategoryTab?.('rings');
            navigateTo('collections');
          }}
          aria-label="Craftsmanship Behind Timeless Rings - MANISH & CO Fine Jewellery"
        >
          <picture className="w-full block">
            <source srcSet={bannerCraftsmanshipTimelessRingsWebp} type="image/webp" />
            <img 
              src={bannerCraftsmanshipTimelessRingsPng} 
              alt="Craftsmanship Behind Timeless Rings - MANISH & CO Fine Jewellery" 
              className="w-full h-auto block object-cover group-hover:scale-[1.008] transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </picture>
        </section>

        {/* ==========================================================
          01 / FOR HER — WOMEN'S JEWELLERY (Editorial Showcase)
          ========================================================== */}
        {forHerSection && (
          <EditorialShowcaseSection
            id={forHerSection.id}
            number={forHerSection.number}
            title={forHerSection.title}
            subtitle={forHerSection.subtitle}
            defaultGender={forHerSection.defaultGender}
            categories={forHerSection.categories}
            triggerAudio={triggerAudio}
            navigateTo={navigateTo}
            changeCategoryTab={changeCategoryTab}
            setGenderFilter={setGenderFilter}
          />
        )}

        {/* ==========================================================
          02 / FOR HIM — MEN'S JEWELLERY (Royal Navy Theme 70%)
          ========================================================== */}
        {forHimSection && (
          <EditorialShowcaseSection
            id={forHimSection.id}
            number={forHimSection.number}
            title={forHimSection.title}
            subtitle={forHimSection.subtitle}
            defaultGender={forHimSection.defaultGender}
            categories={forHimSection.categories}
            dark={true}
            triggerAudio={triggerAudio}
            navigateTo={navigateTo}
            changeCategoryTab={changeCategoryTab}
            setGenderFilter={setGenderFilter}
          />
        )}

        {/* ==========================================================
          03 / FOR KIDS & CELEBRATIONS (Soft Cream Theme 20%)
          ========================================================== */}
        {specialOccasionActive && (
          <EditorialShowcaseSection
            id="special-occasions"
            number="03 / FOR KIDS & CELEBRATIONS"
            title={specialOccasionActive.title}
            subtitle={specialOccasionActive.subtitle}
            defaultGender={specialOccasionActive.defaultGender}
            categories={specialOccasionActive.categories}
            triggerAudio={triggerAudio}
            navigateTo={navigateTo}
            changeCategoryTab={changeCategoryTab}
            setGenderFilter={setGenderFilter}
            tabs={[
              { id: 'for-kids', label: 'For Kids' },
              { id: 'couples-section', label: "Couple's Suite" },
              { id: 'gifts-collection', label: "Gift's Collection" }
            ]}
            activeTab={specialOccasionTab}
            onTabChange={(tabId) => setSpecialOccasionTab(tabId)}
          />
        )}

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
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getCategoryFallbackImage(item.category || item.name);
                        }}
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
          SECTION: OUR STORY - MORE THAN A BRAND, A PROMISE
          ========================================================== */}
        <section 
          id="our-story-heritage-banner"
          className="w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EF] to-[#F5EFE4] border-y border-[#E8DFD5] select-none overflow-hidden cursor-pointer group py-6 sm:py-10"
          onClick={() => {
            triggerAudio('click');
            navigateTo('heritage');
          }}
          aria-label="Our Story - More Than a Brand, A Promise"
        >
          <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-center">
            <picture className="w-full max-w-6xl block">
              <source srcSet={bannerMoreThanABrandWebp} type="image/webp" />
              <img 
                src={bannerMoreThanABrandPng} 
                alt="OUR STORY - More Than a Brand, A Promise - MANISH & CO Fine Jewellery" 
                className="w-full h-auto block object-contain mx-auto group-hover:scale-[1.015] transition-transform duration-700 ease-out drop-shadow-xs"
                loading="lazy"
              />
            </picture>
          </div>
        </section>

        {/* ==========================================================
          POLAROID TESTIMONIALS (Edge-to-Edge & Length Increased - Requirement 3)
          ========================================================== */}
        <section id="testimonials" ref={testimonialsRef}
          data-inview={testimonialsInView ? "true" : "false"}
          className="w-full py-20 sm:py-24 lg:py-28 overflow-hidden select-none border-y border-solid transition-colors duration-500 group bg-[#F8F5EC] border-[#E6DFD3] text-center"
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3 mb-12 sm:mb-16">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#6B4B2E] font-bold font-sans block">
              OUR PATRONS' STORIES
            </span>
            <h2 className="serif-luxury text-3xl sm:text-4xl lg:text-[50px] font-medium leading-none tracking-wide text-[#0D2B4E]">
              More Than Just Jewellery
            </h2>
            <p className="font-sans text-xs sm:text-[16px] tracking-wide font-normal max-w-2xl mx-auto leading-relaxed text-[#657989]">
              Every piece tells a story. Every memory shines forever in pure hallmarked silver.
            </p>
          </div>

          {/* DESKTOP VIEW (1024px+): True Edge-to-Edge Hanging Clothesline with Extended Height */}
          <div className="hidden lg:block w-full overflow-visible py-6 select-none px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
            <div className="relative w-full h-[540px] xl:h-[570px]">
              {/* Clothesline Wire SVG - True 0 to 100 edge-to-edge */}
              <svg className="absolute left-0 top-0 w-full h-[140px] pointer-events-none z-0" viewBox="0 0 100 140" fill="none" preserveAspectRatio="none">
                <path
                  d="M 0,35 Q 6,55 12.5,55 Q 25,95 37.5,55 Q 50,95 62.5,55 Q 75,95 87.5,55 Q 94,55 100,35"
                  stroke="#D1D5DB"
                  strokeWidth="1.2"
                />
              </svg>

              <div className="w-full h-full flex items-start justify-between 2xl:justify-around relative z-10 px-4">
                {polaroidTestimonialsData.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ marginTop: item.top }}
                    className="shrink-0 transition-all duration-300 px-2 xl:px-4"
                  >
                    <div
                      style={{ transformOrigin: "50% -20px" }}
                      className={`w-[280px] xl:w-[310px] 2xl:w-[330px] shadow-[0_20px_45px_rgba(13,43,78,0.09),0_6px_18px_rgba(13,43,78,0.05)] rounded-xs pt-6 px-5 pb-8 relative flex flex-col items-center select-none transition-all duration-300 hover:scale-[1.03] hover:rotate-0 hover:z-40 cursor-pointer border border-solid overflow-visible bg-white border-[#E6DFD3] ${item.rot}`}
                    >
                      {/* Realistic Silver Clip Pin */}
                      <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 w-8 h-12 flex items-center justify-center z-20 pointer-events-none">
                        <svg width="28" height="42" viewBox="0 0 28 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id={`metalGrad_desk_${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FFFFFF" />
                              <stop offset="40%" stopColor="#D8D9DA" />
                              <stop offset="70%" stopColor="#9EA0A2" />
                              <stop offset="100%" stopColor="#5C5E60" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M14 2 C8 2, 7 20, 7 20 M14 2 C20 2, 21 20, 21 20"
                            stroke="#9EA0A2"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M4 20 L24 20 L27 32 L1 32 Z"
                            fill={`url(#metalGrad_desk_${idx})`}
                            stroke="#8E9092"
                            strokeWidth="0.8"
                            strokeLinejoin="round"
                          />
                          <path d="M4 20 L24 20 L25 23 L3 23 Z" fill="#C5C6C8" />
                          <line x1="5" y1="21" x2="23" y2="21" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.8" />
                        </svg>
                      </div>

                      {/* Polaroid Photo */}
                      <div className="w-full aspect-square overflow-hidden rounded-xs mb-4 bg-[#F8F5EC] p-1 shadow-xs border border-solid border-[#E6DFD3] text-center">
                        <img
                          src={item.img}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center pointer-events-none"
                        />
                      </div>

                      {/* Verified Badge */}
                      <div className="w-full flex items-center justify-between text-[#D4AF37] text-[10.5px] mb-2 px-0.5">
                        <div className="flex gap-0.5">
                          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        </div>
                        <span className="text-[9.5px] text-[#6B4B2E] font-medium font-sans">Verified Patron</span>
                      </div>

                      {/* Patron Name and Quote */}
                      <div className="w-full space-y-1.5 text-left px-0.5">
                        <h4 className="font-sans font-bold text-sm tracking-wide text-[#0D2B4E]">
                          {item.name}
                        </h4>
                        <p className="font-sans text-[11.5px] leading-relaxed tracking-normal font-normal text-[#657989] italic">
                          "{item.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MOBILE & TABLET VIEW (< 1024px): 100% Responsive Edge-to-Edge Clothesline Carousel */}
          <div className="block lg:hidden w-full relative px-0 sm:px-4">
            {/* Hanging Clothesline Header Wire */}
            <div className="w-full h-[2px] bg-[#D1D5DB] relative mb-6">
              <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2.5 h-2.5 rounded-full bg-[#8C6D46]/40" />
            </div>

            {/* Carousel Container */}
            <div
              ref={polaroidScrollRef}
              onScroll={handlePolaroidScroll}
              className="w-full overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory flex items-start gap-4 sm:gap-6 justify-start touch-pan-x"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {polaroidTestimonialsData.map((item, idx) => (
                <div
                  key={idx}
                  className="shrink-0 snap-center w-[82vw] max-w-[290px] px-1 py-4 flex flex-col items-center"
                >
                  <div className="w-full shadow-[0_12px_28px_rgba(13,43,78,0.08),0_4px_12px_rgba(13,43,78,0.04)] rounded-xs pt-5 px-4 pb-6 relative flex flex-col items-center bg-white border border-solid border-[#E6DFD3]">
                    {/* Metallic Clip */}
                    <div className="absolute -top-[24px] left-1/2 -translate-x-1/2 w-7 h-10 flex items-center justify-center z-20 pointer-events-none">
                      <svg width="24" height="36" viewBox="0 0 28 42" fill="none">
                        <path d="M14 2 C8 2, 7 20, 7 20 M14 2 C20 2, 21 20, 21 20" stroke="#9EA0A2" strokeWidth="1.6" fill="none" />
                        <path d="M4 20 L24 20 L27 32 L1 32 Z" fill="#D8D9DA" stroke="#8E9092" strokeWidth="0.8" />
                        <path d="M4 20 L24 20 L25 23 L3 23 Z" fill="#C5C6C8" />
                      </svg>
                    </div>

                    {/* Photo */}
                    <div className="w-full aspect-square overflow-hidden rounded-xs mb-3 bg-[#F8F5EC] p-1 shadow-xs border border-solid border-[#E6DFD3]">
                      <img
                        src={item.img}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center pointer-events-none"
                      />
                    </div>

                    {/* Verified Stars */}
                    <div className="w-full flex items-center justify-between text-[#D4AF37] text-[10px] mb-1 px-0.5">
                      <div className="flex gap-0.5">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                      <span className="text-[9px] text-[#6B4B2E] font-medium font-sans">Verified Patron</span>
                    </div>

                    {/* Name & Quote */}
                    <div className="w-full space-y-1 text-left px-0.5">
                      <h4 className="font-sans font-bold text-xs sm:text-[13px] tracking-wide text-[#0D2B4E]">
                        {item.name}
                      </h4>
                      <p className="font-sans text-[10.5px] leading-relaxed tracking-normal font-normal text-[#657989] italic">
                        "{item.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Navigation Arrows & Dots */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => scrollPolaroid('left')}
                disabled={activePolaroidIdx === 0}
                className="w-8 h-8 rounded-full border border-[#E6DFD3] bg-white flex items-center justify-center text-[#0D2B4E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F5EDE4] transition-all cursor-pointer shadow-xs"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => scrollToPolaroid(dotIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activePolaroidIdx === dotIdx
                        ? 'w-6 bg-[#6B4B2E]'
                        : 'w-2 bg-[#E6DFD3] hover:bg-[#8C6D46]/60'
                    }`}
                    aria-label={`Go to story ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollPolaroid('right')}
                disabled={activePolaroidIdx === 3}
                className="w-8 h-8 rounded-full border border-[#E6DFD3] bg-white flex items-center justify-center text-[#0D2B4E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F5EDE4] transition-all cursor-pointer shadow-xs"
                aria-label="Next story"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
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
