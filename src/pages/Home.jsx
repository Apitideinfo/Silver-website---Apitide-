import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { useRates } from '../hooks/useRates';
import Modal from '../components/Modal';
import BookingForm from '../forms/BookingForm';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { ShieldCheck, Gem, Truck, Package, ArrowRight, Star, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Heart, Calendar } from 'lucide-react';

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
import heroBannerTimelessSilverPng from '../assets/hero_banner_timeless_silver.png';
import heroBannerTimelessSilverWebp from '../assets/hero_banner_timeless_silver.webp';
import heroBannerLuxuryEarringPng from '../assets/hero_banner_luxury_earring.png';
import heroBannerLuxuryEarringWebp from '../assets/hero_banner_luxury_earring.webp';
import heroBannerBrandPromisePng from '../assets/hero_banner_brand_promise.png';
import heroBannerBrandPromiseWebp from '../assets/hero_banner_brand_promise.webp';
import heroBannerDiwaliGlowPng from '../assets/hero_banner_diwali_glow.png';
import heroBannerDiwaliGlowWebp from '../assets/hero_banner_diwali_glow.webp';
import midnightSapphireHero from '../assets/midnight_sapphire_hero.png';
import midnightSapphireHeroWebp from '../assets/midnight_sapphire_hero.webp';
import catRefRings from '../assets/cat_ref_rings.png';
import catRefRingsWebp from '../assets/cat_ref_rings.webp';
import catRefStoneBracelets from '../assets/cat_ref_stone_bracelets.png';
import catRefStoneBraceletsWebp from '../assets/cat_ref_stone_bracelets.webp';
import catRefEarring from '../assets/cat_ref_earring.png';
import catRefEarringWebp from '../assets/cat_ref_earring.webp';
import catRefBracelets from '../assets/cat_ref_bracelets.png';
import catRefBraceletsWebp from '../assets/cat_ref_bracelets.webp';
import catRefPendant from '../assets/cat_ref_pendant.png';
import catRefPendantWebp from '../assets/cat_ref_pendant.webp';
import catRefNecklaces from '../assets/cat_ref_necklaces.png';
import catRefNecklacesWebp from '../assets/cat_ref_necklaces.webp';
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
import { silverStoryService, DEFAULT_SILVER_STORY_DATA } from '../services/silverStoryService';

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

// Silver Gifting Hampers Assets
import giftPick1499Webp from '../assets/gift_pick_1499.webp';
import giftPick1499Png from '../assets/gift_pick_1499.png';
import giftPick1999Webp from '../assets/gift_pick_1999.webp';
import giftPick1999Png from '../assets/gift_pick_1999.png';
import giftPick2999Webp from '../assets/gift_pick_2999.webp';
import giftPick2999Png from '../assets/gift_pick_2999.png';
import giftPickPremiumWebp from '../assets/gift_pick_premium.webp';
import giftPickPremiumPng from '../assets/gift_pick_premium.png';
// Eri's Best Picks Assets
import erisInfinityRingWebp from '../assets/eris_infinity_ring.webp';
import erisInfinityRingPng from '../assets/eris_infinity_ring.png';
import erisHeartPendantWebp from '../assets/eris_heart_pendant.webp';
import erisHeartPendantPng from '../assets/eris_heart_pendant.png';

// Curated Category Extra Assets
import catRefAnkletsWebp from '../assets/cat_ref_anklets.webp';
import catRefChainWebp from '../assets/cat_ref_chain.webp';
import catRefToeRingWebp from '../assets/cat_ref_toe_ring.webp';

// Made for Every Kind of Love Assets
import loveStory1Webp from '../assets/love_story_1.webp';
import loveStory1Png from '../assets/love_story_1.png';
import loveStory2Webp from '../assets/love_story_2.webp';
import loveStory2Png from '../assets/love_story_2.png';
import loveStory3Webp from '../assets/love_story_3.webp';
import loveStory3Png from '../assets/love_story_3.png';
import loveStory4Webp from '../assets/love_story_4.webp';
import loveStory4Png from '../assets/love_story_4.png';


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
  if (norm.includes('stone') || (norm.includes('bracelet') && norm.includes('stone'))) return catRefStoneBraceletsWebp || catRefStoneBracelets;
  if (norm.includes('ring') && !norm.includes('ear') && !norm.includes('toe')) return catRefRingsWebp || catRefRings;
  if (norm.includes('toering') || norm.includes('toe-ring') || norm.includes('toe')) return colToeRingWebp || colToeRingPng;
  if (norm.includes('earring') || norm.includes('jhumka') || norm.includes('top') || norm.includes('stud')) return catRefEarringWebp || catRefEarring;
  if (norm.includes('bracelet')) return catRefBraceletsWebp || catRefBracelets;
  if (norm.includes('pendant') || norm.includes('locket')) return catRefPendantWebp || catRefPendant;
  if (norm.includes('necklace') || norm.includes('choker') || norm.includes('haar')) return catRefNecklacesWebp || catRefNecklaces;
  if (norm.includes('payal') || norm.includes('anklet')) return silverPayalsImg;
  if (norm.includes('mangal')) return mangalsutrasImg;
  if (norm.includes('chain')) return goldChainsImg;
  if (norm.includes('bangle') || norm.includes('kada')) return kadaImg;
  if (norm.includes('nath') || norm.includes('nose')) return nosePinsImg;
  if (norm.includes('coin') || norm.includes('bullion')) return goldCoinsImg;
  if (norm.includes('solitaire') || norm.includes('diamond')) return solitariesImg;
  if (norm.includes('watch')) return watchJewelleryImg;
  if (norm.includes('men')) return mensJewelleryImg;
  if (norm.includes('kids') || norm.includes('child')) return kidsJewelleryImg;
  return catRefRingsWebp || catRefRings;
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

const GIFT_HAMPERS_DATA = [
  {
    id: 'under-1499',
    title: 'Picks Under ₹1499',
    imgWebp: giftPick1499Webp,
    imgPng: giftPick1499Png,
    path: '/collections?maxPrice=1499'
  },
  {
    id: 'under-1999',
    title: 'Picks Under ₹1999',
    imgWebp: giftPick1999Webp,
    imgPng: giftPick1999Png,
    path: '/collections?maxPrice=1999'
  },
  {
    id: 'under-2999',
    title: 'Picks Under ₹2999',
    imgWebp: giftPick2999Webp,
    imgPng: giftPick2999Png,
    path: '/collections?maxPrice=2999'
  },
  {
    id: 'premium-gifts',
    title: 'Premium Gifts',
    imgWebp: giftPickPremiumWebp,
    imgPng: giftPickPremiumPng,
    path: '/collections?sort=luxury'
  }
];

const CURATED_AUDIENCE_SECTIONS = [
  {
    id: 'for-her',
    label: 'FOR HER',
    icon: '👸',
    subtitle: 'Bracelets, Anklets, Rings, Ear rings, Toe Rings & Necklaces',
    items: [
      { id: 'her-bracelets', name: 'Bracelets', sub: '925 Italian & Tennis', img: catRefBraceletsWebp, tab: 'bracelets' },
      { id: 'her-anklets', name: 'Anklets', sub: 'Traditional & Minimal', img: catRefAnkletsWebp, tab: 'anklets' },
      { id: 'her-rings', name: 'Rings', sub: 'Pavé Solitaires & Bands', img: catRefRingsWebp, tab: 'rings' },
      { id: 'her-earrings', name: 'Ear Rings', sub: 'Studs, Drops & Jhumkas', img: catRefEarringWebp, tab: 'earrings' },
      { id: 'her-toe-rings', name: 'Toe Rings', sub: 'Hallmarked 925 Silver', img: catRefToeRingWebp, tab: 'rings' },
      { id: 'her-chains', name: 'Chains', sub: 'Delicate Link Chains', img: catRefChainWebp, tab: 'chains' },
      { id: 'her-necklaces', name: 'Necklaces', sub: 'Chokers & Layered Chains', img: catRefNecklacesWebp, tab: 'necklaces' },
      { id: 'her-pendants', name: 'Pendants', sub: 'Evil Eye & Symbolic Charms', img: catRefPendantWebp, tab: 'pendants' },
      { id: 'her-other', name: 'Other Jewellery', sub: 'Explore Complete Range', img: colBracelets, tab: 'Collections' },
    ]
  },
  {
    id: 'for-him',
    label: 'FOR HIM',
    icon: '🤴',
    subtitle: 'Bracelets & Kada, Chains, Signet Rings & Regal Pendants',
    items: [
      { id: 'him-kadas', name: 'Bracelets & Kada', sub: 'Chitai & Heavy 925 Kada', img: kadaImg, tab: 'bracelets' },
      { id: 'him-chains', name: 'Chains', sub: 'Curb, Figaro & Rope', img: catRefChainWebp, tab: 'chains' },
      { id: 'him-rings', name: 'Rings', sub: 'Bold Signet & Sovereign Rings', img: catRefRingsWebp, tab: 'rings' },
      { id: 'him-pendants', name: 'Pendants', sub: 'Om, Trishul, Shield Pendants', img: catRefPendantWebp, tab: 'pendants' },
      { id: 'him-other', name: 'Other Essentials', sub: 'Men’s Silver Brooches & Sets', img: kadaImg, tab: 'Collections' },
    ]
  },
  {
    id: 'for-kids',
    label: 'KIDS COLLECTION',
    icon: '👶',
    subtitle: 'Born Baby Kit, Gentle Chains, Cute Pendants & Nazariya Berwa',
    items: [
      { id: 'kids-kit', name: 'Bornbaby Kit', sub: 'Silver Spoon, Bowl & Glass', img: kidsJewelleryImg, tab: 'Collections' },
      { id: 'kids-chains', name: 'Chains', sub: 'Lightweight & Safe Silver', img: catRefChainWebp, tab: 'chains' },
      { id: 'kids-pendants', name: 'Pendants', sub: 'Cute Animal & Star Charms', img: catRefPendantWebp, tab: 'pendants' },
      { id: 'kids-berwa', name: 'Bracelets & Berwa', sub: 'Hypoallergenic Silver Nazariya', img: kidsJewelleryImg, tab: 'bracelets' },
      { id: 'kids-other', name: 'Other Keepsakes', sub: 'Silver Rattles & Silver Coins', img: kidsJewelleryImg, tab: 'Collections' },
    ]
  },
  {
    id: 'couples-gifts',
    label: 'COUPLES & GIFTS',
    icon: '🎁',
    subtitle: 'Couple Rings, Couple Chains, Secret Sets & Curated Hampers',
    items: [
      { id: 'couple-rings', name: 'Couple Rings', sub: 'Matching Forever Bands', img: catRefRingsWebp, tab: 'rings' },
      { id: 'couple-chains', name: 'Couple Chains', sub: 'Interlocking Infinity Chains', img: catRefChainWebp, tab: 'chains' },
      { id: 'couple-bracelets', name: 'Couple Bracelets', sub: 'His & Hers Silver Pair', img: catRefBraceletsWebp, tab: 'bracelets' },
      { id: 'couple-secret-sets', name: 'Secret Sets', sub: 'Hidden Message Pendants', img: giftPickPremiumWebp, tab: 'Collections' },
      { id: 'couple-gifts', name: 'Gifts Section', sub: 'Born Baby Kit & Romantic Hampers', img: giftPick1999Webp, tab: 'Collections' },
    ]
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
  const [wishlistLoveCards, setWishlistLoveCards] = useState(['everyday-love']);
  const [activeAudienceTab, setActiveAudienceTab] = useState('for-her');
  const audienceCarouselRef = useRef(null);
  const trustSealsScrollRef = useRef(null);

  const scrollTrustSeals = (dir) => {
    if (trustSealsScrollRef.current) {
      const step = trustSealsScrollRef.current.clientWidth > 768 ? 240 : 150;
      trustSealsScrollRef.current.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
    }
  };

  const toggleWishlistLoveCard = (id) => {
    setWishlistLoveCards((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const scrollAudienceCarousel = (dir) => {
    if (audienceCarouselRef.current) {
      const step = audienceCarouselRef.current.clientWidth > 768 ? 320 : 200;
      audienceCarouselRef.current.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
    }
  };

  // Hero Carousel State (Auto slide every 5 sec)
  const heroBanners = [
    {
      id: 1,
      title: 'Timeless Silver Jewellery Collection',
      webp: heroBannerTimelessSilverWebp,
      png: heroBannerTimelessSilverPng,
      alt: 'Timeless Silver Jewellery Collection - MANISH & CO',
      page: 'collections',
      category: 'Collections'
    },
    {
      id: 2,
      title: 'Luxury Navy Blue Earring Collection',
      webp: heroBannerLuxuryEarringWebp,
      png: heroBannerLuxuryEarringPng,
      alt: 'Luxury Navy Blue Earring Collection - MANISH & CO',
      page: 'collections',
      category: 'earrings'
    },
    {
      id: 3,
      title: 'Manish & Co. Brand Promise',
      webp: heroBannerBrandPromiseWebp,
      png: heroBannerBrandPromisePng,
      alt: 'Manish & Co. Brand Promise - 925 Hallmarked Sterling Silver',
      page: 'about-us',
      category: null
    },
    {
      id: 4,
      title: 'Navy Silver Diwali Glow',
      webp: heroBannerDiwaliGlowWebp,
      png: heroBannerDiwaliGlowPng,
      alt: 'Navy Silver Diwali Glow - Festive Fine Jewellery Collection',
      page: 'collections',
      category: 'Collections'
    }
  ];

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
    const list = Array.isArray(categories) && categories.length > 0 ? categories : INITIAL_CATEGORIES;
    return list.map((cat) => {
      const catId = cat.id || cat.docId || String(cat.name || '').toLowerCase().replace(/\s+/g, '-');
      // If Admin uploaded or set an image, use it directly! Otherwise fall back cleanly
      const catImg = (cat.img && typeof cat.img === 'string' && cat.img.trim())
        ? cat.img.trim()
        : (cat.image && typeof cat.image === 'string' && cat.image.trim())
          ? cat.image.trim()
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

  const scrollStoryCarousel = (direction) => {
    if (storyCarouselRef.current) {
      const scrollStep = Math.max(260, Math.floor(storyCarouselRef.current.clientWidth * 0.55));
      storyCarouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollStep : scrollStep,
        behavior: 'smooth'
      });
    }
  };

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

  const [priceCategories, setPriceCategories] = useState(() => priceCategoryService.getStoredCategories());

  useEffect(() => {
    priceCategoryService.fetchRemoteCategories().then((res) => {
      if (res && res.length > 0) setPriceCategories(res);
    });

    const handlePriceCategoriesUpdate = () => {
      setPriceCategories(priceCategoryService.getStoredCategories());
    };

    window.addEventListener('manish_price_categories_updated', handlePriceCategoriesUpdate);
    const storageHandler = (e) => {
      if (e.key === 'manish_price_categories' || e.key === 'manish_price_pulse') {
        handlePriceCategoriesUpdate();
      }
    };
    window.addEventListener('storage', storageHandler);
    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('manish_store_sync');
      bc.onmessage = (msg) => {
        if (msg?.data?.type === 'price_categories') {
          handlePriceCategoriesUpdate();
        }
      };
    }
    return () => {
      window.removeEventListener('manish_price_categories_updated', handlePriceCategoriesUpdate);
      window.removeEventListener('storage', storageHandler);
      if (bc) bc.close();
    };
  }, []);


  // Combined dynamic categories with baseline reference set (all 10+ reference categories)
  const displayCategories = React.useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    return INITIAL_CATEGORIES;
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
        className="relative w-full overflow-hidden select-none bg-[#050B14]"
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
        {/* Banner Images Carousel Container - Full Image Visible with Zero Cropping */}
        <div className="relative w-full aspect-[2200/715] min-h-[125px] sm:min-h-[260px] md:min-h-[360px] lg:min-h-[460px] xl:min-h-[520px] overflow-hidden bg-[#050B14]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentHeroSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={() => {
                const banner = heroBanners[currentHeroSlide];
                if (banner.category && typeof changeCategoryTab === 'function') {
                  changeCategoryTab(banner.category);
                }
                navigateTo(banner.page || 'collections');
              }}
            >
              <picture className="w-full h-full block">
                <source srcSet={heroBanners[currentHeroSlide].webp} type="image/webp" />
                <img
                  src={heroBanners[currentHeroSlide].png}
                  alt={heroBanners[currentHeroSlide].alt}
                  className="w-full h-full object-contain sm:object-cover object-center select-none"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
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
          <div className="absolute bottom-2.5 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10">
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
                    ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-gradient-to-r from-[#D4AF37] to-[#FFF5DC] shadow-[0_0_8px_rgba(212,175,55,0.7)]'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#E6DFD3] relative z-20" />

      {/* ==========================================================
          TOP CONCIERGE BAR: CUSTOM DESIGN & BOOK AN APPOINTMENT
          Direct WhatsApp Connect (+91 94516 38680)
          ========================================================== */}
      <div className="w-full bg-[#17131F] text-white py-2.5 sm:py-3 px-4 border-b border-[#C8A646]/30 shadow-xs relative z-20">
        <div className="max-w-[1536px] mx-auto px-2 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 text-center md:text-left">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C8A646] animate-pulse shrink-0" />
            <p className="text-xs sm:text-[13px] font-sans text-[#EAE2D5] tracking-wide m-0">
              <strong className="text-[#C8A646] font-semibold">Bespoke Atelier:</strong> Share your custom design or meet our master silversmith for a private appointment.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3.5 w-full sm:w-auto shrink-0">
            {/* 1. Custom Designs Button */}
            <button
              type="button"
              onClick={() => {
                triggerAudio('click');
                setCustomDesignOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2 rounded-full border border-[#C8A646]/80 bg-white/5 hover:bg-[#C8A646] hover:text-[#17131F] text-[#F3E5C8] font-sans text-[11px] sm:text-[12.5px] font-bold tracking-wider uppercase transition-all duration-300 shadow-xs cursor-pointer active:scale-95 focus:outline-none whitespace-nowrap"
              title="Upload your design photo directly on WhatsApp"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C8A646] shrink-0" />
              <span>Custom Design</span>
            </button>

            {/* 2. Book An Appointment Button */}
            <button
              type="button"
              onClick={() => {
                triggerAudio('click');
                setConsultationModal(true);
              }}
              className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-5 py-2 sm:py-2 rounded-full bg-gradient-to-r from-[#C8A646] to-[#A37B4D] hover:from-[#D8BA65] hover:to-[#B58C5E] text-[#17131F] font-sans text-[11px] sm:text-[12.5px] font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_3px_12px_rgba(200,166,70,0.35)] cursor-pointer active:scale-95 focus:outline-none whitespace-nowrap"
              title="Book a private visit or live consultation"
            >
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#17131F] shrink-0" />
              <span>Appointment</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area (White/Ivory background) */}
      <div className="bg-[#F8F5EC] text-[#202329] transition-colors duration-500 !mt-0">

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

            {/* Left Navigation Arrow */}
            <button
              type="button"
              onClick={() => scrollStoryCarousel('left')}
              aria-label="Previous categories"
              className="flex absolute left-1 sm:left-2 lg:left-3 top-[36%] -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs border border-[#8C6D46]/40 shadow-md hover:shadow-xl hover:bg-[#0D2B4E] hover:border-[#0D2B4E] items-center justify-center text-[#0D2B4E] hover:text-white transition-all z-30 cursor-pointer focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Right Navigation Arrow */}
            <button
              type="button"
              onClick={() => scrollStoryCarousel('right')}
              aria-label="Next categories"
              className="flex absolute right-1 sm:right-2 lg:right-3 top-[36%] -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs border border-[#8C6D46]/40 shadow-md hover:shadow-xl hover:bg-[#0D2B4E] hover:border-[#0D2B4E] items-center justify-center text-[#0D2B4E] hover:text-white transition-all z-30 cursor-pointer focus:outline-none"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Horizontal Scrollable Category Cards Carousel */}
            <div
              ref={storyCarouselRef}
              onMouseDown={handleStoryMouseDown}
              onMouseMove={handleStoryMouseMove}
              onMouseUp={handleStoryMouseUp}
              onMouseLeave={handleStoryMouseUp}
              className="flex items-center gap-3.5 sm:gap-5 md:gap-6 lg:gap-7 overflow-x-auto no-scrollbar scroll-smooth justify-start py-2 px-3 sm:px-6 cursor-grab active:cursor-grabbing select-none"
            >
              {dynamicStoryCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleStoryCardClick(cat)}
                  className="w-[130px] sm:w-[150px] md:w-[165px] lg:w-[178px] bg-white rounded-xl border border-[#E6DFD3] hover:border-[#8C6D46] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(140,109,70,0.18)] p-2.5 sm:p-3 transition-all duration-300 group cursor-pointer flex flex-col items-center shrink-0 focus:outline-none hover:-translate-y-1"
                >
                  {/* Square Card Image */}
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#EADBCE]/50 pointer-events-none">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      draggable={false}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out select-none pointer-events-none"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCategoryFallbackImage(cat.name || cat.id);
                      }}
                    />
                    {cat.badge && (
                      <span className="absolute top-1.5 left-1.5 bg-[#8C6D46] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase font-sans">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  {/* Category Label */}
                  <span className="mt-2 sm:mt-3 text-[11.5px] sm:text-[13.5px] font-sans font-semibold text-[#0D2B4E] tracking-tight group-hover:text-[#8C6D46] transition-colors text-center block w-full truncate px-0.5">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>

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
                  className="relative w-full aspect-[16/10] sm:aspect-auto sm:min-h-[380px] rounded-2xl overflow-hidden border border-[#E6DFD3] shadow-md hover:shadow-xl transition-all duration-500 group cursor-pointer focus:outline-none bg-gradient-to-br from-[#FAF5EE] to-[#F2E8DA]"
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



                {/* ==========================================================
          SECTION: TRUST SEALS / BRAND ASSURANCES
          (BIS Hallmarked, Free Shipping, COD, 25,000+ Happy Customers)
          Size enlarged, luxury balanced, crystal clear badges
          ========================================================== */}
        <section id="trust-seals-section" className="w-full bg-[#FFFFFF] py-6 sm:py-8 border-b border-gray-100 select-none">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 relative">
            <div className="relative flex items-center justify-center">
              {/* Left Navigation Arrow */}
              <button
                type="button"
                onClick={() => scrollTrustSeals('left')}
                aria-label="Previous seals"
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-gray-200/90 items-center justify-center text-gray-400 hover:text-gray-700 bg-white shadow-xs transition-colors cursor-pointer focus:outline-none z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* 4 Trust Circular Seals - Horizontal Smooth Swipe on Mobile, Centered on Desktop */}
              <div 
                ref={trustSealsScrollRef}
                className="w-full max-w-[1040px] flex items-center justify-start sm:justify-between gap-2.5 sm:gap-4 px-2 sm:px-4 overflow-x-auto no-scrollbar scroll-smooth"
              >
                {TRUST_SEALS_DATA.map((seal) => (
                  <div key={seal.id} className="w-[130px] xs:w-[150px] sm:w-[240px] shrink-0 sm:shrink h-[85px] sm:h-[95px] flex items-center justify-center group cursor-pointer select-none">
                    <div className="w-[80px] h-[80px] sm:w-[95px] sm:h-[95px] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-xs">
                      <picture className="w-full h-full flex items-center justify-center">
                        <source srcSet={seal.imgWebp} type="image/webp" />
                        <img 
                          src={seal.imgPng} 
                          alt={seal.label} 
                          className="w-full h-full object-contain"
                          style={{ maxHeight: '95px', maxWidth: '100%' }}
                          loading="lazy"
                        />
                      </picture>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Navigation Arrow */}
              <button
                type="button"
                onClick={() => scrollTrustSeals('right')}
                aria-label="Next seals"
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-gray-200/90 items-center justify-center text-gray-400 hover:text-gray-700 bg-white shadow-xs transition-colors cursor-pointer focus:outline-none z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
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
              <span className="text-[11px] sm:text-xs font-sans font-bold tracking-[0.28em] text-[#8C6D46] uppercase block mb-2">
                FESTIVE CELEBRATIONS
              </span>
              <h2 
                className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#1F142B] tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                Silver Gifting Hampers
              </h2>
              <div className="w-12 h-[2px] bg-[#C8A646] mx-auto mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
              {GIFT_HAMPERS_DATA.map((hamper) => (
                <button
                  key={hamper.id}
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    if (hamper.path) {
                      navigateTo(hamper.path);
                    }
                  }}
                  className="group relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none cursor-pointer border border-[#E8DFD5] hover:border-[#C8A646]"
                  aria-label={hamper.title}
                >
                  <picture className="w-full h-full block">
                    <source srcSet={hamper.imgWebp} type="image/webp" />
                    <img 
                      src={hamper.imgPng} 
                      alt={hamper.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out" 
                      loading="lazy" 
                    />
                  </picture>
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
              <h2 className="text-xl sm:text-2xl md:text-[26px] font-sans font-bold text-[#1F142B] tracking-tight inline-flex items-center justify-center gap-2">
                <span className="text-amber-500 text-lg">✨</span>
                <span>Made for Every Kind of Love</span>
                <span className="text-amber-500 text-lg">✨</span>
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
                  <div className="relative w-full aspect-square rounded-2xl sm:rounded-[30px] overflow-hidden bg-[#E8DEF8]/30 border border-[#D0BCFF]/30 shadow-xs hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:scale-[1.02]">
                    <picture className="w-full h-full block">
                      <source srcSet={card.imgWebp} type="image/webp" />
                      <img 
                        src={card.imgPng} 
                        alt={card.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </picture>

                    {/* Top-Right Luxury Wishlist Heart Icon */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerAudio('click');
                        toggleWishlistLoveCard(card.id);
                      }}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white shadow-xs hover:shadow-md flex items-center justify-center text-[#571B3E] transition-all duration-300 hover:scale-110 z-10 focus:outline-none cursor-pointer"
                      aria-label="Save to Wishlist"
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${
                          wishlistLoveCards.includes(card.id)
                            ? 'fill-[#571B3E] text-[#571B3E] scale-110'
                            : 'fill-transparent text-[#571B3E] hover:fill-[#571B3E]/20'
                        }`} 
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>

                  <div className="mt-3.5 sm:mt-4 text-center">
                    <span className={`text-xs sm:text-[13px] font-sans font-bold tracking-wider uppercase transition-colors ${
                      card.active 
                        ? 'text-[#571B3E] border-b-2 border-[#571B3E] pb-0.5' 
                        : 'text-[#1F142B] group-hover:text-[#571B3E]'
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
          SECTION: CURATED COLLECTIONS FOR HER, HIM, KIDS & COUPLES
          Interactive Tabbed Carousel Slider
          ========================================================== */}
        <section id="curated-audience-section" className="w-full bg-[#FFFFFF] py-10 sm:py-14 border-b border-gray-100 select-none">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
            
            {/* Section Header */}
            <div className="text-center mb-6 sm:mb-8">
              <span className="text-[11px] sm:text-xs font-sans font-bold tracking-[0.25em] text-[#8C6D46] uppercase block mb-1.5">
                CURATED FOR EVERYONE
              </span>
              <h2 
                className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#1F142B] tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                Shop By Recipient &amp; Style
              </h2>
              <div className="w-12 h-[2px] bg-[#C8A646] mx-auto mt-2.5 rounded-full" />
            </div>

            {/* Audience Segmented Filter Tabs */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-7 sm:mb-9">
              {CURATED_AUDIENCE_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    setActiveAudienceTab(sec.id);
                  }}
                  className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-sans text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer border focus:outline-none ${
                    activeAudienceTab === sec.id
                      ? 'bg-[#17131F] text-[#F3E5C8] border-[#17131F] shadow-md scale-102'
                      : 'bg-[#FAF8F5] text-gray-700 border-gray-200 hover:border-[#8C6D46] hover:bg-white'
                  }`}
                >
                  <span className="text-sm">{sec.icon}</span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>

            {/* Active Audience Items Carousel */}
            {(() => {
              const currentSection = CURATED_AUDIENCE_SECTIONS.find(s => s.id === activeAudienceTab) || CURATED_AUDIENCE_SECTIONS[0];
              return (
                <div className="relative">
                  {/* Left Carousel Arrow */}
                  <button
                    type="button"
                    onClick={() => scrollAudienceCarousel('left')}
                    aria-label="Previous categories"
                    className="hidden sm:flex absolute -left-2 sm:left-0 top-[38%] -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200 shadow-md hover:shadow-xl hover:bg-[#0D2B4E] hover:text-white items-center justify-center text-gray-700 transition-all z-20 cursor-pointer focus:outline-none"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Right Carousel Arrow */}
                  <button
                    type="button"
                    onClick={() => scrollAudienceCarousel('right')}
                    aria-label="Next categories"
                    className="hidden sm:flex absolute -right-2 sm:right-0 top-[38%] -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200 shadow-md hover:shadow-xl hover:bg-[#0D2B4E] hover:text-white items-center justify-center text-gray-700 transition-all z-20 cursor-pointer focus:outline-none"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Horizontal Scroll Track */}
                  <div
                    ref={audienceCarouselRef}
                    className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-2 sm:px-8 select-none"
                  >
                    {currentSection.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          triggerAudio('click');
                          if (item.tab) changeCategoryTab?.(item.tab);
                          navigateTo('collections');
                        }}
                        className="w-[145px] sm:w-[175px] md:w-[195px] shrink-0 bg-[#FFFDFB] rounded-2xl border border-[#EADBCE]/70 hover:border-[#8C6D46] shadow-xs hover:shadow-lg transition-all duration-300 p-2.5 sm:p-3 flex flex-col items-center group cursor-pointer hover:-translate-y-1"
                      >
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#EADBCE]/40">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                        </div>

                        <div className="mt-3 text-center w-full px-1">
                          <h4 className="text-xs sm:text-[13.5px] font-sans font-bold text-[#1F142B] group-hover:text-[#8C6D46] transition-colors leading-tight uppercase tracking-tight">
                            {item.name}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] font-sans text-gray-500 font-medium mt-0.5 truncate">
                            {item.sub}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        </section>

        {/* ==========================================================
          SECTION: 🎁 ERI'S BEST PICKS 🎁 (Screenshot 02 Exact)
          Two Arched Royal Showcase Cards: Infinity Ring & Heart Pendant
          ========================================================== */}
        <section id="eris-best-picks-section" className="w-full bg-[#FFFFFF] py-10 sm:py-16 border-b border-gray-100 select-none">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
            
            {/* Header: 🎁 Eri's Best Picks 🎁 with fine luxury divider lines */}
            <div className="max-w-4xl mx-auto flex items-center justify-center mb-8 sm:mb-12 px-2 sm:px-4">
              <div className="flex-1 h-[1.5px] sm:h-[2px] bg-[#E8C88A] rounded-full" />
              <span className="px-2.5 sm:px-6 text-sm xs:text-base sm:text-[18px] md:text-[20px] font-serif font-bold text-[#1F142B] flex items-center gap-1.5 sm:gap-2 whitespace-nowrap tracking-wide">
                <span>🎁</span>
                <span>Eri’s Best Picks</span>
                <span>🎁</span>
              </span>
              <div className="flex-1 h-[1.5px] sm:h-[2px] bg-[#E8C88A] rounded-full" />
            </div>

            {/* 2 Arched Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 max-w-4xl mx-auto px-2 sm:px-6">

              {/* CARD 1: INFINITY RING */}
              <div 
                onClick={() => {
                  triggerAudio('click');
                  changeCategoryTab?.('rings');
                  navigateTo('collections');
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Arch Window Frame with Gold Gradient & Mandala Watermark */}
                <div className="relative w-full max-w-[290px] xs:max-w-[330px] md:max-w-none mx-auto aspect-[4/5] sm:aspect-[3/4] rounded-t-full border-[3px] border-[#E8C88A] bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EA] to-[#FFFFFF] p-6 sm:p-8 flex items-center justify-center overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1.5">
                  
                  {/* Sacred Mandala SVG Watermark Motif in Arch */}
                  <svg 
                    viewBox="0 0 200 200" 
                    className="absolute -top-10 inset-x-0 mx-auto w-52 h-52 sm:w-60 sm:h-60 opacity-[0.22] pointer-events-none text-[#C8A646] group-hover:scale-105 transition-transform duration-700"
                  >
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map((deg) => (
                      <line
                        key={deg}
                        x1="100"
                        y1="15"
                        x2="100"
                        y2="185"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        transform={`rotate(${deg} 100 100)`}
                      />
                    ))}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <path
                        key={deg}
                        d="M100 55 Q115 78 100 100 Q85 78 100 55 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        transform={`rotate(${deg} 100 100)`}
                      />
                    ))}
                  </svg>

                  {/* Sparkling Sterling Silver Infinity Ring Image */}
                  <picture className="w-[78%] sm:w-[82%] aspect-square relative z-10 flex items-center justify-center">
                    <source srcSet={erisInfinityRingWebp} type="image/webp" />
                    <img 
                      src={erisInfinityRingPng} 
                      alt="Infinity Ring - MANISH & CO"
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-108 group-hover:-translate-y-2 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </picture>

                  {/* Subtle Shimmer Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Typography below arch: Infinity Ring */}
                <div className="mt-4 sm:mt-5 text-center">
                  <h3 
                    className="text-2xl sm:text-3xl text-[#1F142B] tracking-tight leading-none"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    <span className="font-bold">Infinity</span> <span className="font-light italic text-[#8C6D46]">Ring</span>
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-sans text-[#8C6D46] font-semibold tracking-wider uppercase mt-1.5 group-hover:text-[#0D2B4E] transition-colors">
                    <span>Explore Ring</span>
                    <span className="text-sm">→</span>
                  </span>
                </div>
              </div>

              {/* CARD 2: HEART PENDANT */}
              <div 
                onClick={() => {
                  triggerAudio('click');
                  changeCategoryTab?.('pendants');
                  navigateTo('collections');
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Arch Window Frame with Gold Gradient & Mandala Watermark */}
                <div className="relative w-full max-w-[290px] xs:max-w-[330px] md:max-w-none mx-auto aspect-[4/5] sm:aspect-[3/4] rounded-t-full border-[3px] border-[#E8C88A] bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EA] to-[#FFFFFF] p-6 sm:p-8 flex items-center justify-center overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1.5">
                  
                  {/* Sacred Mandala SVG Watermark Motif in Arch */}
                  <svg 
                    viewBox="0 0 200 200" 
                    className="absolute -top-10 inset-x-0 mx-auto w-52 h-52 sm:w-60 sm:h-60 opacity-[0.22] pointer-events-none text-[#C8A646] group-hover:scale-105 transition-transform duration-700"
                  >
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map((deg) => (
                      <line
                        key={deg}
                        x1="100"
                        y1="15"
                        x2="100"
                        y2="185"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        transform={`rotate(${deg} 100 100)`}
                      />
                    ))}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <path
                        key={deg}
                        d="M100 55 Q115 78 100 100 Q85 78 100 55 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        transform={`rotate(${deg} 100 100)`}
                      />
                    ))}
                  </svg>

                  {/* Mother-of-Pearl & Pavé Diamond Halo Heart Pendant Image */}
                  <picture className="w-[78%] sm:w-[82%] aspect-square relative z-10 flex items-center justify-center">
                    <source srcSet={erisHeartPendantWebp} type="image/webp" />
                    <img 
                      src={erisHeartPendantPng} 
                      alt="Heart Pendant - MANISH & CO"
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-108 group-hover:-translate-y-2 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </picture>

                  {/* Subtle Shimmer Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Typography below arch: Heart Pendant */}
                <div className="mt-4 sm:mt-5 text-center">
                  <h3 
                    className="text-2xl sm:text-3xl text-[#1F142B] tracking-tight leading-none"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    <span className="font-bold">Heart</span> <span className="font-light italic text-[#8C6D46]">Pendant</span>
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-sans text-[#8C6D46] font-semibold tracking-wider uppercase mt-1.5 group-hover:text-[#0D2B4E] transition-colors">
                    <span>Explore Pendant</span>
                    <span className="text-sm">→</span>
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

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
                  Certified Royal Blue Sapphires, Zambian Emeralds, Burmese Rubies, and Tanzanites hand-set in hallmarked 925 sterling silver.
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

            <div className="text-center space-y-2.5">
              <span className="text-[10.5px] uppercase tracking-[0.35em] text-[#8C6D46] font-bold font-sans">TAILORED SELECTION</span>
              <h2 className="serif-luxury text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#1F142B]">Recommended for You</h2>
              <div className="w-14 h-[2px] bg-[#C8A646] mx-auto mt-2 rounded-full"></div>
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
