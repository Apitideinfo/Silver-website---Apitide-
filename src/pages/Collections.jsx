import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Gem, 
  CircleDot, 
  Crown, 
  Circle, 
  Heart, 
  Bell, 
  Star, 
  Award, 
  User, 
  Coins, 
  Baby, 
  Disc,
  SlidersHorizontal,
  Search,
  PenTool
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../hooks/useWishlist';
import { useRates } from '../hooks/useRates';
import Modal from '../components/Modal';
import BookingForm from '../forms/BookingForm';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

// Asset Imports
import banner1 from '../assets/banner_1.png';
import banner2 from '../assets/banner_2.webp';

// Product fallback image assets
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

const getProductFallbackImage = (prod) => {
  const norm = String(prod?.category || prod?.name || '').toLowerCase().replace(/\s+/g, '');
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

function BannerCarousel({ banners }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = banners.length;
  useEffect(() => {
    if (paused || len < 2) return;
    const t = setInterval(() => setActive(p => (p + 1) % len), 3500);
    return () => clearInterval(t);
  }, [paused, len]);
  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ aspectRatio: '2400/778' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Offer Banner ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
          style={{ opacity: active === i ? 1 : 0, zIndex: active === i ? 1 : 0 }}
          draggable={false}
        />
      ))}
      {/* Prev */}
      <button
        onClick={() => setActive(p => (p - 1 + len) % len)}
        className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-black/25 hover:bg-black/50 text-white text-sm sm:text-xl flex items-center justify-center backdrop-blur-sm cursor-pointer focus:outline-none transition-all border-none"
        aria-label="Previous"
      >&#8249;</button>
      {/* Next */}
      <button
        onClick={() => setActive(p => (p + 1) % len)}
        className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-black/25 hover:bg-black/50 text-white text-sm sm:text-xl flex items-center justify-center backdrop-blur-sm cursor-pointer focus:outline-none transition-all border-none"
        aria-label="Next"
      >&#8250;</button>
    </div>
  );
}

// -------------------------------------------------------------
// Granular, Collision-Free Category & Metal Matchers
// -------------------------------------------------------------
function isProductSilver(p) {
  const catType = String(p.categoryType || '').toLowerCase();
  const metal = String(p.metal || '').toLowerCase();
  const metalType = String(p.metalType || '').toLowerCase();
  const metalColor = String(p.metalColor || '').toLowerCase();
  const carat = String(p.carat || p.metalPurity || p.goldPurity || p.silverPurity || '').toLowerCase();
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();
  const desc = String(p.desc || p.description || '').toLowerCase();

  return (
    catType.includes('silver') ||
    metal.includes('silver') ||
    metalType.includes('silver') ||
    metalColor.includes('silver') ||
    carat.includes('925') ||
    carat.includes('92.5') ||
    carat.includes('999') ||
    cat.includes('silver') ||
    subCat.includes('silver') ||
    name.includes('silver') ||
    desc.includes('silver') ||
    desc.includes('925')
  );
}

function isProductGold(p) {
  if (isProductSilver(p)) return false;
  const catType = String(p.categoryType || '').toLowerCase();
  const metal = String(p.metal || '').toLowerCase();
  const metalType = String(p.metalType || '').toLowerCase();
  const metalColor = String(p.metalColor || '').toLowerCase();
  const carat = String(p.carat || p.metalPurity || p.goldPurity || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  if (metal.includes('platinum') || metalType.includes('platinum') || catType.includes('platinum') || name.includes('platinum')) {
    return false;
  }

  return (
    catType === 'gold' ||
    metal.includes('gold') ||
    metalColor.includes('gold') ||
    carat.includes('k') ||
    carat.includes('kt') ||
    carat.includes('916') ||
    carat.includes('750') ||
    carat.includes('585') ||
    (!catType && !metal && !metalType)
  );
}

function isProductPlatinum(p) {
  const catType = String(p.categoryType || '').toLowerCase();
  const metal = String(p.metal || '').toLowerCase();
  const metalType = String(p.metalType || '').toLowerCase();
  const metalColor = String(p.metalColor || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();
  const carat = String(p.carat || '').toLowerCase();

  return (
    catType.includes('platinum') ||
    metal.includes('platinum') ||
    metalType.includes('platinum') ||
    metalColor.includes('platinum') ||
    name.includes('platinum') ||
    carat.includes('950')
  );
}

function isProductDiamond(p) {
  const stone = String(p.stone || p.gemstone || p.diamondShape || '').toLowerCase();
  const clarity = String(p.diamondClarity || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();
  const desc = String(p.desc || p.description || '').toLowerCase();
  return stone.includes('diamond') || clarity.length > 0 || name.includes('diamond') || desc.includes('diamond');
}

function isProductEarring(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const catType = String(p.categoryType || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  // Guard against chains, necklaces, or finger rings incorrectly matched
  if ((name.includes('chain') || name.includes('necklace') || name.includes('longset')) && !name.includes('earring') && !name.includes('jhumk')) {
    return false;
  }

  if (cat.includes('earring') || subCat.includes('earring') || catType.includes('earring')) {
    return true;
  }

  return (
    name.includes('earring') ||
    name.includes('ear ring') ||
    name.includes('jhumk') ||
    name.includes('jhumka') ||
    name.includes('stud') ||
    name.includes('bali') ||
    name.includes('tops') ||
    name.includes('sui dhaga') ||
    name.includes('hoop') ||
    name.includes('tassel drop earring')
  );
}

function isProductRing(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const catType = String(p.categoryType || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  // Guard against earrings with "ring" in word
  if (cat.includes('earring') || subCat.includes('earring') || isProductEarring(p)) {
    return false;
  }
  if (cat.includes('nose') || name.includes('nose') || name.includes('nath')) {
    return false;
  }

  if (cat === 'rings' || cat === 'ring' || subCat === 'rings' || subCat === 'ring' || catType === 'rings' || catType === 'ring') {
    return true;
  }

  return (
    name.includes('ring') ||
    name.includes('anguthi') ||
    name.includes('band') ||
    name.includes('solitaire ring') ||
    name.includes('cocktail ring')
  );
}

function isProductNecklaceOrChain(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const catType = String(p.categoryType || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  if (cat.includes('necklace') || cat.includes('chain') || subCat.includes('necklace') || subCat.includes('chain') || catType.includes('necklace') || catType.includes('chain')) {
    return true;
  }

  return (
    name.includes('necklace') ||
    name.includes('chain') ||
    name.includes('choker') ||
    name.includes('haar') ||
    name.includes('kanthla') ||
    name.includes('longset') ||
    name.includes('chain set') ||
    name.includes('necklace set')
  );
}

function isProductPendant(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const catType = String(p.categoryType || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  return (
    cat.includes('pendant') ||
    subCat.includes('pendant') ||
    catType.includes('pendant') ||
    name.includes('pendant') ||
    name.includes('locket')
  );
}

function isProductBangle(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const catType = String(p.categoryType || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  return (
    cat.includes('bangle') ||
    subCat.includes('bangle') ||
    catType.includes('bangle') ||
    name.includes('bangle') ||
    name.includes('kada') ||
    name.includes('chuda')
  );
}

function isProductBracelet(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const catType = String(p.categoryType || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  return (
    cat.includes('bracelet') ||
    subCat.includes('bracelet') ||
    catType.includes('bracelet') ||
    name.includes('bracelet')
  );
}

function isProductMangalsutra(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  return (
    cat.includes('mangalsutra') ||
    subCat.includes('mangalsutra') ||
    name.includes('mangalsutra')
  );
}

function isProductAnklet(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  return (
    cat.includes('anklet') ||
    subCat.includes('anklet') ||
    cat.includes('payal') ||
    name.includes('anklet') ||
    name.includes('payal')
  );
}

function isProductNosePin(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  return (
    cat.includes('nose') ||
    subCat.includes('nose') ||
    name.includes('nose pin') ||
    name.includes('nath') ||
    name.includes('laung')
  );
}

function isProductSolitaire(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  return (
    cat.includes('solitaire') ||
    subCat.includes('solitaire') ||
    name.includes('solitaire')
  );
}

function isProductKids(p) {
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();

  return (
    cat.includes('kid') ||
    subCat.includes('kid') ||
    cat.includes('baby') ||
    name.includes('kid') ||
    name.includes('baby')
  );
}

function isProductMatchGender(p, targetGender) {
  if (!targetGender || targetGender === 'all') return true;
  const filter = String(targetGender).toLowerCase().trim();
  const prodGender = String(p.gender || p.targetAudience || p.audience || '').toLowerCase().trim();
  const name = String(p.name || '').toLowerCase();
  const cat = String(p.category || '').toLowerCase();
  const subCat = String(p.subCategory || '').toLowerCase();
  const desc = String(p.desc || p.description || '').toLowerCase();
  const jType = String(p.jewelryType || p.customJewelryType || '').toLowerCase();

  // If explicitly set to Unisex, it matches all adult genders
  if (prodGender === 'unisex') return true;

  if (filter === 'men' || filter === 'man' || filter === 'male' || filter === 'for men') {
    // Strictly exclude explicit women/female items
    if (prodGender === 'women' || prodGender === 'female' || prodGender === 'girl' || prodGender === 'ladies') {
      return false;
    }
    // Check if item is explicitly marked for men or has men/gents/male/boy in text
    const isExplicitMen = (
      prodGender === 'men' ||
      prodGender === 'man' ||
      prodGender === 'male' ||
      prodGender === 'gents' ||
      prodGender === 'gent' ||
      prodGender === 'boy' ||
      prodGender === 'boys' ||
      name.includes('men') ||
      name.includes('gents') ||
      name.includes('male') ||
      cat.includes('men') ||
      cat.includes('gents') ||
      subCat.includes('men') ||
      subCat.includes('gents') ||
      desc.includes('for men') ||
      desc.includes('mens') ||
      desc.includes("men's") ||
      desc.includes('gents') ||
      jType.includes('men') ||
      jType.includes('gents')
    );
    if (isExplicitMen) return true;

    // For items without explicit gender or unassigned:
    // Exclude strictly women items
    const isStrictlyWomenItem = (
      name.includes('women') ||
      name.includes('ladies') ||
      name.includes('mangalsutra') ||
      name.includes('tanmaniya') ||
      name.includes('nath') ||
      name.includes('nose pin') ||
      name.includes('nosepin') ||
      name.includes('payal') ||
      name.includes('anklet') ||
      name.includes('bichhiya') ||
      name.includes('toe ring') ||
      name.includes('jhumka') ||
      name.includes('jhumki') ||
      name.includes('chandbali') ||
      name.includes('maang tikka') ||
      name.includes('borla') ||
      name.includes('bridal') ||
      cat.includes('mangalsutra') ||
      cat.includes('anklet') ||
      cat.includes('nose pin')
    );
    if (isStrictlyWomenItem) return false;

    // Traditional men-compatible jewellery (Kada, Cuban chains, Signet rings, Rudraksha, Bullion coins/bars)
    const isMenCompatible = (
      name.includes('kada') ||
      name.includes('chain') ||
      name.includes('bracelet') ||
      name.includes('rudraksh') ||
      name.includes('signet') ||
      name.includes('cufflink') ||
      name.includes('kurta') ||
      name.includes('coin') ||
      name.includes('bar') ||
      cat.includes('kada') ||
      cat.includes('chain') ||
      cat.includes('bracelet') ||
      cat.includes('coin')
    );

    return isMenCompatible;
  }

  if (filter === 'women' || filter === 'woman' || filter === 'female' || filter === 'for women' || filter === 'ladies') {
    // Strictly exclude explicit men/male items
    if (prodGender === 'men' || prodGender === 'male' || prodGender === 'gents' || prodGender === 'boy' || prodGender === 'boys') {
      return false;
    }
    // Strictly exclude items with explicit men/gents in name unless unisex
    if (name.includes('for men') || name.includes('mens ') || name.includes("men's ") || name.includes('gents ')) {
      return false;
    }
    return (
      prodGender === 'women' ||
      prodGender === 'woman' ||
      prodGender === 'female' ||
      prodGender === 'ladies' ||
      prodGender === 'lady' ||
      prodGender === 'girl' ||
      prodGender === 'girls' ||
      prodGender === 'unisex' ||
      name.includes('women') ||
      name.includes('ladies') ||
      name.includes('female') ||
      cat.includes('women') ||
      subCat.includes('women') ||
      desc.includes('for women') ||
      desc.includes('womens') ||
      desc.includes("women's") ||
      desc.includes('ladies') ||
      // In Indian jewellery catalogues, items without explicit gender default to women unless marked for men/kids
      (!prodGender && !isProductKids(p))
    );
  }

  if (filter === 'kids' || filter === 'kid' || filter === 'baby' || filter === 'children' || filter === 'for kids') {
    return (
      prodGender === 'kids' ||
      prodGender === 'kid' ||
      prodGender === 'baby' ||
      prodGender === 'children' ||
      prodGender === 'child' ||
      isProductKids(p)
    );
  }

  if (filter === 'others' || filter === 'other') {
    return prodGender === 'others' || prodGender === 'other';
  }

  return prodGender.includes(filter) || name.includes(filter) || cat.includes(filter);
}

export default function Collections({
  activeCategoryTab: initialCategoryTab = 'Collections',
  setActiveCategoryTab: onCategoryTabChange,
  metalFilter: externalMetalFilter,
  setMetalFilter: setExternalMetalFilter,
  purityFilter: externalPurityFilter,
  setPurityFilter: setExternalPurityFilter,
  maxPriceFilter: externalMaxPrice,
  setMaxPriceFilter: setExternalMaxPrice,
  genderFilter: externalGenderFilter,
  setGenderFilter: setExternalGenderFilter,
  searchQuery,
  setSearchQuery,
  navigateToPDP,
  triggerAudio: triggerAudioProp,
}) {
  // Data from context
  const { products = [], categories = [], loading: catalogLoading } = useProducts();
  const { wishlistItems = [], toggleWishlist } = useWishlist();
  const { calculatePrice } = useRates();

  // Safe audio helper
  const triggerAudio = (type) => { try { triggerAudioProp?.(type); } catch { /* noop */ } };

  const metalTypeOptions = [
    { 
      id: 'gold', 
      label: 'GOLD', 
      icon: (
        <svg className="w-4 h-4 text-[#C8960C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M9 9h6" strokeLinecap="round" />
        </svg>
      ), 
      bg: 'linear-gradient(135deg, #FFF8E7, #FFF0B3)', 
      border: '#C8960C', 
      text: '#A07820' 
    },
    { 
      id: 'silver', 
      label: 'ALL SILVER', 
      icon: (
        <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="6" width="18" height="12" rx="3" />
          <path d="M8 12h8" strokeLinecap="round" />
        </svg>
      ), 
      bg: 'linear-gradient(135deg, #F8FAFC, #E2E8F0)', 
      border: '#94A3B8', 
      text: '#475569' 
    },
    { 
      id: '925 silver', 
      label: '925 SILVER', 
      icon: (
        <svg className="w-4 h-4 text-[#475569]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
        </svg>
      ), 
      bg: 'linear-gradient(135deg, #F0F4F8, #D9E2EC)', 
      border: '#627D98', 
      text: '#334E68' 
    },
    { 
      id: 'normal silver', 
      label: 'NORMAL SILVER', 
      icon: (
        <svg className="w-4 h-4 text-[#718096]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ), 
      bg: 'linear-gradient(135deg, #F7FAFC, #E2E8F0)', 
      border: '#718096', 
      text: '#4A5568' 
    },
    { 
      id: '999 silver', 
      label: '999 SILVER', 
      icon: (
        <svg className="w-4 h-4 text-[#2E7D32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinejoin="round" />
        </svg>
      ), 
      bg: 'linear-gradient(135deg, #F0FFF4, #C6F6D5)', 
      border: '#38A169', 
      text: '#22543D' 
    },
    { 
      id: 'rose gold', 
      label: 'ROSE GOLD', 
      icon: (
        <svg className="w-4 h-4 text-[#C53030]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9z" />
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
        </svg>
      ), 
      bg: 'linear-gradient(135deg, #FFF5F5, #FED7D7)', 
      border: '#E53E3E', 
      text: '#9B2C2C' 
    },
    { 
      id: 'white gold', 
      label: 'WHITE GOLD', 
      icon: (
        <svg className="w-4 h-4 text-[#718096]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />
        </svg>
      ), 
      bg: 'linear-gradient(135deg, #F7FAFC, #EDF2F7)', 
      border: '#A0AEC0', 
      text: '#4A5568' 
    },
    { 
      id: 'platinum', 
      label: 'PLATINUM', 
      icon: (
        <svg className="w-4 h-4 text-[#6B46C1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 3h12l4 6-10 12L2 9z" strokeLinejoin="round" />
          <path d="M2 9h20M10 3l2 6 2-6M6 9l6 12 6-12" />
        </svg>
      ), 
      bg: 'linear-gradient(135deg, #FAF5FF, #E9D8FD)', 
      border: '#805AD5', 
      text: '#553C9A' 
    },
  ];

  const metalRadioList = [
    'All',
    'Gold',
    'Silver',
    '925 Sterling Silver',
    'Normal Silver',
    '999 Silver',
    'Rose Gold',
    'White Gold',
    'Platinum',
    'Plain Gold'
  ];

  // All filter state (self-contained with 2-way sync)
  const [activeCategoryTab, setActiveCategoryTab] = useState(initialCategoryTab || 'Collections');
  const [metalFilter, setMetalFilter] = useState(externalMetalFilter || 'all');
  const [purityFilter, setPurityFilter] = useState(externalPurityFilter || 'all');
  const [maxPriceFilter, setMaxPriceFilter] = useState(externalMaxPrice || 100000000);
  const [priceFilter, setPriceFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState(externalGenderFilter || 'all');
  const [stoneFilter, setStoneFilter] = useState('all');
  const [occasionFilter, setOccasionFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('popularity');
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [customDesignOpen, setCustomDesignOpen] = useState(false);
  const [consultationModal, setConsultationModal] = useState(false);
  const isCatalogDark = false;

  // Sync external filter props when they change
  useEffect(() => { if (externalMetalFilter !== undefined) setMetalFilter(externalMetalFilter); }, [externalMetalFilter]);
  useEffect(() => { if (externalPurityFilter !== undefined) setPurityFilter(externalPurityFilter); }, [externalPurityFilter]);
  useEffect(() => { if (externalMaxPrice !== undefined) setMaxPriceFilter(externalMaxPrice); }, [externalMaxPrice]);
  useEffect(() => { if (externalGenderFilter !== undefined) setGenderFilter(externalGenderFilter); }, [externalGenderFilter]);
  useEffect(() => { if (initialCategoryTab !== undefined) setActiveCategoryTab(initialCategoryTab); }, [initialCategoryTab]);

  // Synchronized Filter Setters
  const changeCategoryTab = (tab) => {
    setActiveCategoryTab(tab);
    onCategoryTabChange?.(tab);
  };

  const handleSetMetalFilter = (val) => {
    const nextVal = val === metalFilter ? 'all' : val;
    setMetalFilter(nextVal);
    setExternalMetalFilter?.(nextVal);
    // Reset purity filter if incompatible
    setPurityFilter('all');
    setExternalPurityFilter?.('all');
  };

  const handleSetPurityFilter = (val) => {
    const nextVal = val === purityFilter ? 'all' : val;
    setPurityFilter(nextVal);
    setExternalPurityFilter?.(nextVal);
  };

  const handleSetGenderFilter = (val) => {
    const nextVal = val === genderFilter ? 'all' : val;
    setGenderFilter(nextVal);
    setExternalGenderFilter?.(nextVal);
  };

  const resetAllFilters = () => {
    triggerAudio('click');
    setActiveCategoryTab('Collections');
    onCategoryTabChange?.('Collections');
    setMetalFilter('all');
    setExternalMetalFilter?.('all');
    setPurityFilter('all');
    setExternalPurityFilter?.('all');
    setMaxPriceFilter(100000000);
    setExternalMaxPrice?.(100000000);
    setPriceFilter('all');
    setGenderFilter('all');
    setExternalGenderFilter?.('all');
    setStoneFilter('all');
    setOccasionFilter('all');
  };

  // Primary Category options list with luxury SVG icons
  const primaryCategories = useMemo(() => [
    { id: 'Collections', label: 'All Collections', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'Earrings', label: 'Earrings', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'Rings', label: 'Rings', icon: <CircleDot className="w-3.5 h-3.5" /> },
    { id: 'Necklaces', label: 'Necklaces & Chains', icon: <Crown className="w-3.5 h-3.5" /> },
    { id: 'Pendants', label: 'Pendants', icon: <Gem className="w-3.5 h-3.5" /> },
    { id: 'Bangles', label: 'Bangles', icon: <Circle className="w-3.5 h-3.5" /> },
    { id: 'Bracelets', label: 'Bracelets', icon: <Disc className="w-3.5 h-3.5" /> },
    { id: 'Mangalsutra', label: 'Mangalsutra', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'Silver', label: 'Silver Collection', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'Solitaires', label: 'Solitaires', icon: <Gem className="w-3.5 h-3.5" /> },
    { id: 'Kids Jewellery', label: 'Kids Jewellery', icon: <Baby className="w-3.5 h-3.5" /> },
  ], []);

  // Determine current metal mode for dynamic purity options
  const isSilverActive = ['silver', 'all silver', '925 silver', '925 sterling silver', 'normal silver', '999 silver'].includes(metalFilter.toLowerCase());
  const isPlatinumActive = metalFilter.toLowerCase() === 'platinum';

  const purityOptions = useMemo(() => {
    if (isSilverActive) {
      return [
        { label: 'All Silver Purity', val: 'all' },
        { label: '925 Sterling Silver (92.5%)', val: '925' },
        { label: '999 Fine Silver (99.9%)', val: '999' },
        { label: 'Normal Silver', val: 'normal silver' }
      ];
    }
    if (isPlatinumActive) {
      return [
        { label: 'All Platinum', val: 'all' },
        { label: '950 Platinum', val: '950' }
      ];
    }
    return [
      { label: 'All Gold Purity', val: 'all' },
      { label: '14K (58.5%)', val: '14K' },
      { label: '18K (75.0%)', val: '18K' },
      { label: '20K (83.3%)', val: '20K' },
      { label: '22K (91.6%)', val: '22K' },
      { label: '24K (99.9%)', val: '24K' }
    ];
  }, [isSilverActive, isPlatinumActive]);

  // Main Filter Pipeline
  const filteredJewellery = useMemo(() => {
    let result = [...(products || [])].filter(p => p.name && p.name.trim() !== '');

    // 1. Search Query Filter
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const name = String(p.name || '').toLowerCase();
        const cat = String(p.category || '').toLowerCase();
        const subCat = String(p.subCategory || '').toLowerCase();
        const desc = String(p.desc || p.description || '').toLowerCase();
        const metal = String(p.metal || p.metalType || '').toLowerCase();
        const purity = String(p.carat || p.metalPurity || p.goldPurity || p.silverPurity || '').toLowerCase();
        const sku = String(p.sku || '').toLowerCase();
        return (
          name.includes(q) ||
          cat.includes(q) ||
          subCat.includes(q) ||
          desc.includes(q) ||
          metal.includes(q) ||
          purity.includes(q) ||
          sku.includes(q)
        );
      });
    }

    // 2. Category Filter (Clean, Exact, Non-Leaking)
    if (activeCategoryTab && activeCategoryTab !== 'Collections' && activeCategoryTab !== 'all') {
      const tab = activeCategoryTab.toLowerCase().trim();
      result = result.filter(p => {
        if (tab === 'silver' || tab === 'silver collection') {
          return isProductSilver(p);
        }
        if (tab === 'silver-earrings' || tab === 'silver earrings') {
          return isProductSilver(p) && isProductEarring(p);
        }
        if (tab === 'earrings' || tab === 'earring') {
          return isProductEarring(p);
        }
        if (tab === 'rings' || tab === 'ring') {
          return isProductRing(p);
        }
        if (tab === 'necklaces' || tab === 'necklace' || tab === 'chains' || tab === 'chain') {
          return isProductNecklaceOrChain(p);
        }
        if (tab === 'pendants' || tab === 'pendant') {
          return isProductPendant(p);
        }
        if (tab === 'bracelets' || tab === 'bracelet') {
          return isProductBracelet(p);
        }
        if (tab === 'bangles' || tab === 'bangle') {
          return isProductBangle(p);
        }
        if (tab === 'mangalsutra' || tab === 'mangalsutras') {
          return isProductMangalsutra(p);
        }
        if (tab === 'anklets' || tab === 'anklet') {
          return isProductAnklet(p);
        }
        if (tab === 'nose pins' || tab === 'nose pin' || tab === 'nosepins') {
          return isProductNosePin(p);
        }
        if (tab === 'solitaires' || tab === 'solitaire') {
          return isProductSolitaire(p);
        }
        if (tab === 'kids jewellery' || tab === 'kids') {
          return isProductKids(p);
        }
        if (tab === 'diamond' || tab === 'diamonds' || tab === 'diamond jewellery') {
          return isProductDiamond(p);
        }

        const cat = String(p.category || '').toLowerCase();
        const subCat = String(p.subCategory || '').toLowerCase();
        const name = String(p.name || '').toLowerCase();
        return cat.includes(tab) || subCat.includes(tab) || name.includes(tab);
      });
    }

    // 3. Metal Filter
    if (metalFilter !== 'all') {
      const mf = metalFilter.toLowerCase().trim();
      result = result.filter(p => {
        const catType = String(p.categoryType || '').toLowerCase();
        const metal = String(p.metal || '').toLowerCase();
        const metalType = String(p.metalType || '').toLowerCase();
        const metalColor = String(p.metalColor || '').toLowerCase();
        const carat = String(p.carat || p.goldPurity || p.metalPurity || p.silverPurity || '').toLowerCase();
        const name = String(p.name || '').toLowerCase();

        const isSilver = isProductSilver(p);

        if (mf === 'silver' || mf === 'all silver' || mf === 'silver (all)') {
          return isSilver;
        }
        if (mf === '925 silver' || mf === '925 sterling silver' || mf === '925' || mf === '92.5') {
          return isSilver && (catType.includes('925') || carat.includes('925') || carat.includes('92.5') || name.includes('925') || metal.includes('925') || metalType.includes('925'));
        }
        if (mf === '999 silver' || mf === '999') {
          return isSilver && (catType.includes('999') || carat.includes('999') || name.includes('999') || metal.includes('999') || metalType.includes('999'));
        }
        if (mf === 'normal silver') {
          return isSilver && !carat.includes('925') && !carat.includes('92.5') && !carat.includes('999') && !catType.includes('925') && !catType.includes('999');
        }
        if (mf === 'gold' || mf === 'plain gold') {
          return isProductGold(p);
        }
        if (mf === 'rose gold') {
          return metalColor.includes('rose') || metal.includes('rose') || name.includes('rose');
        }
        if (mf === 'white gold') {
          return metalColor.includes('white') || metal.includes('white') || name.includes('white');
        }
        if (mf === 'platinum') {
          return isProductPlatinum(p);
        }
        if (mf === 'diamond') {
          return isProductDiamond(p);
        }
        return catType.includes(mf) || metal.includes(mf) || metalType.includes(mf) || metalColor.includes(mf) || name.includes(mf);
      });
    }

    // 4. Purity Filter
    if (purityFilter !== 'all') {
      const pf = purityFilter.toLowerCase().replace(/kt$/i, 'k').replace(/k$/i, '');
      result = result.filter(p => {
        const carat = String(p.carat || p.goldPurity || p.purity || p.metalPurity || p.silverPurity || '').toLowerCase().replace(/kt$/i, 'k').replace(/k$/i, '');
        const catType = String(p.categoryType || '').toLowerCase();
        const name = String(p.name || '').toLowerCase();
        return carat.includes(pf) || catType.includes(pf) || name.includes(pf);
      });
    }

    // 5. Price, Stone, Gender, Occasion
    if (maxPriceFilter < 100000000) {
      result = result.filter(p => calculatePrice(p).total <= maxPriceFilter);
    }
    if (stoneFilter !== 'all') {
      result = result.filter(p => String(p.stone || p.gemstone || p.diamondShape || '').toLowerCase().includes(stoneFilter.toLowerCase()));
    }
    if (genderFilter !== 'all') {
      result = result.filter(p => isProductMatchGender(p, genderFilter));
    }
    if (occasionFilter !== 'all') {
      result = result.filter(p => String(p.occasion || '').toLowerCase().includes(occasionFilter.toLowerCase()));
    }

    // 6. Sorting
    switch (sortFilter) {
      case 'price_low':
        result.sort((a, b) => calculatePrice(a).total - calculatePrice(b).total);
        break;
      case 'price_high':
        result.sort((a, b) => calculatePrice(b).total - calculatePrice(a).total);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    searchQuery,
    activeCategoryTab,
    metalFilter,
    purityFilter,
    maxPriceFilter,
    stoneFilter,
    genderFilter,
    occasionFilter,
    sortFilter,
    calculatePrice
  ]);

  const hasActiveFilters =
    (activeCategoryTab && activeCategoryTab !== 'Collections') ||
    metalFilter !== 'all' ||
    purityFilter !== 'all' ||
    priceFilter !== 'all' ||
    genderFilter !== 'all' ||
    stoneFilter !== 'all' ||
    occasionFilter !== 'all';

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0';
    return Number(price).toLocaleString('en-IN');
  };

  return (
    <>
      {/* SORT + FILTER STICKY BAR FOR MOBILE ONLY */}
      <div className={`lg:hidden fixed bottom-0 left-0 w-full z-30 border-t flex items-center justify-center shadow-[0_-4px_20px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors duration-500 ${isCatalogDark
        ? "bg-[#1D0E29]/95 border-gold/15 text-white shadow-2xl"
        : "bg-[#F8F5EC]/95 border-[#6B4B2E]/20 text-[#0D2B4E]"
        }`}>
        {/* Reset / Status */}
        <button
          onClick={resetAllFilters}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[9px] font-bold uppercase tracking-widest border-r bg-transparent border-none active:bg-black/5 transition-colors ${isCatalogDark ? "border-gold/15 text-white active:bg-white/5" : "border-[#6B4B2E]/20 text-[#0D2B4E] active:bg-black/5"
            }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" /></svg>
          Reset
        </button>
        {/* Sort */}
        <button
          onClick={() => { triggerAudio('click'); setMobileSortOpen(true); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[9px] font-bold uppercase tracking-widest border-r bg-transparent border-none active:bg-black/5 transition-colors ${isCatalogDark ? "border-gold/15 text-white active:bg-white/5" : "border-[#6B4B2E]/20 text-[#0D2B4E] active:bg-black/5"
            }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
          Sort
        </button>
        {/* Filter */}
        <button
          onClick={() => { triggerAudio('click'); setMobileFilterOpen(true); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[9px] font-bold uppercase tracking-widest bg-transparent border-none active:bg-black/5 transition-colors ${isCatalogDark ? "text-white active:bg-white/5" : "text-[#0D2B4E] active:bg-black/5"
            }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filter {hasActiveFilters && '●'}
        </button>
      </div>

      {/* MOBILE SORT DRAWER */}
      <AnimatePresence>
        {mobileSortOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setMobileSortOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[61] bg-white rounded-t-2xl shadow-2xl max-h-[50vh] overflow-hidden"
            >
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>
              <div className="px-5 pb-2 flex justify-between items-center border-b border-gray-100">
                <h3 className="text-sm font-bold text-[#0D2B4E] serif-luxury">Sort By</h3>
                <button onClick={() => setMobileSortOpen(false)} className="text-gray-400 hover:text-[#0D2B4E] transition-colors p-1 cursor-pointer border-none bg-transparent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="py-2 px-5 space-y-0 text-left">
                {[
                  { val: 'popularity', label: 'Popularity' },
                  { val: 'newest', label: 'Newest First' },
                  { val: 'price_low', label: 'Price: Low to High' },
                  { val: 'price_high', label: 'Price: High to Low' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => { setSortFilter(opt.val); setMobileSortOpen(false); triggerAudio('click'); }}
                    className={`w-full text-left py-3 px-3 rounded-lg text-xs font-sans transition-colors cursor-pointer border-none ${sortFilter === opt.val ? 'bg-[#0D2B4E]/8 text-[#0D2B4E] font-bold' : 'text-gray-600 hover:bg-gray-50 bg-transparent'}`}
                  >
                    {sortFilter === opt.val && <span className="mr-2">✓</span>}
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="h-6" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[61] bg-white rounded-t-2xl shadow-2xl flex flex-col"
              style={{ maxHeight: '85vh' }}
            >
              <div className="flex justify-center pt-2 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              {/* Header */}
              <div className="px-4 pb-2 flex justify-between items-center border-b border-gray-100 shrink-0">
                <h3 className="text-sm font-bold text-[#0D2B4E] serif-luxury flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#6B4B2E]" />
                  <span>Filters</span>
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetAllFilters}
                    className="text-[8px] uppercase tracking-widest font-black text-[#6B4B2E] hover:text-[#0D2B4E] transition-colors cursor-pointer bg-transparent border-none"
                  >
                    Clear All
                  </button>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400 hover:text-[#0D2B4E] transition-colors p-1 cursor-pointer border-none bg-transparent">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Filter Body */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-left" style={{ scrollbarWidth: 'thin', scrollbarColor: '#6B4B2E transparent' }}>

                {/* 1. CATEGORY */}
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-2">Category</span>
                  <div className="flex flex-wrap gap-1.5">
                    {primaryCategories.map(cat => {
                      const isActive = activeCategoryTab.toLowerCase() === cat.id.toLowerCase() || (cat.id === 'Collections' && (activeCategoryTab === 'Collections' || !activeCategoryTab));
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            triggerAudio('click');
                            if (cat.id === 'Silver') {
                              changeCategoryTab('Silver');
                              handleSetMetalFilter('silver');
                            } else {
                              changeCategoryTab(cat.id);
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-[9px] font-semibold border transition-all cursor-pointer border-solid flex items-center gap-1 ${isActive ? 'bg-[#0D2B4E] text-white border-[#0D2B4E]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D2B4E]'}`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. METAL TYPE */}
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-2">Metal Type</span>
                  <div className="grid grid-cols-2 gap-2">
                    {metalTypeOptions.map((opt) => {
                      const isActive = metalFilter === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSetMetalFilter(opt.id)}
                          className={`relative flex flex-col items-center justify-center gap-1 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${isActive ? 'shadow-[0_4px_12px_rgba(0,0,0,0.12)]' : 'border-gray-200 bg-white'}`}
                          style={{
                            borderColor: isActive ? opt.border : '#E5E7EB',
                            background: isActive ? opt.bg : 'white'
                          }}
                        >
                          <span className="text-lg">{opt.icon}</span>
                          <span className="text-[9px] font-extrabold tracking-wide font-sans text-center" style={{ color: isActive ? opt.text : '#6B7280' }}>
                            {opt.label}
                          </span>
                          {isActive && (
                            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: opt.border }}>
                              <svg viewBox="0 0 10 10" className="w-2 h-2" fill="white"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. DYNAMIC PURITY */}
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-2">
                    {isSilverActive ? 'Silver Purity' : isPlatinumActive ? 'Platinum Purity' : 'Gold Purity'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {purityOptions.map(p => (
                      <button
                        key={p.val}
                        onClick={() => handleSetPurityFilter(p.val)}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-semibold border transition-all cursor-pointer border-solid ${purityFilter === p.val ? 'bg-[#0D2B4E] text-white border-[#0D2B4E]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D2B4E]'}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. PRICE */}
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-2">Price</span>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Below Rs. 10,000', val: 10000 },
                      { label: 'Rs. 10,000 – Rs. 20,000', val: 20000 },
                      { label: 'Rs. 20,000 – Rs. 30,000', val: 30000 },
                      { label: 'Rs. 30,000 – Rs. 40,000', val: 40000 },
                      { label: 'Rs. 40,000 – Rs. 50,000', val: 50000 },
                      { label: 'Rs. 50,000 and Above', val: 100000000 },
                    ].map(({ label, val }) => {
                      const isChecked = priceFilter === label;
                      return (
                        <label key={val} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="mob-price" 
                            checked={isChecked} 
                            onChange={() => {
                              if (isChecked) {
                                setPriceFilter('all');
                                setMaxPriceFilter(100000000);
                                setExternalMaxPrice?.(100000000);
                              } else {
                                setPriceFilter(label);
                                setMaxPriceFilter(val);
                                setExternalMaxPrice?.(val);
                              }
                            }} 
                            className="accent-[#0D2B4E] w-3 h-3 cursor-pointer" 
                          />
                          <span className={`text-[10px] font-sans leading-none ${isChecked ? 'text-[#0D2B4E] font-bold' : 'text-gray-600'}`}>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. GENDER */}
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-2">Gender</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Women', 'Men', 'Unisex', 'Others'].map(g => (
                      <button key={g} onClick={() => handleSetGenderFilter(g.toLowerCase())}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-semibold border transition-all cursor-pointer border-solid ${genderFilter === g.toLowerCase() ? 'bg-[#0D2B4E] text-white border-[#0D2B4E]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D2B4E]'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. STONES */}
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-2">Stones</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'Topaz', 'Amethyst', 'Garnet', 'Opal', 'Citrine', 'Aquamarine'].map(s => (
                      <button key={s} onClick={() => setStoneFilter(prev => prev === s ? 'all' : s)}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-semibold border transition-all cursor-pointer border-solid ${stoneFilter === s ? 'bg-[#0D2B4E] text-white border-[#0D2B4E]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D2B4E]'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. OCCASION */}
                <div className="pb-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-2">Occasion</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Everyday Wear', 'Festive', 'Wedding', 'Engagement', 'Anniversary', 'Gifting', 'Workwear', 'Romantic', 'Vacation', 'Special Occasion', 'Valentine'].map(o => (
                      <button key={o} onClick={() => setOccasionFilter(prev => prev === o ? 'all' : o)}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-semibold border transition-all cursor-pointer border-solid ${occasionFilter === o ? 'bg-[#0D2B4E] text-white border-[#0D2B4E]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D2B4E]'}`}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Apply Button */}
              <div className="shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
                <button
                  onClick={() => { setMobileFilterOpen(false); triggerAudio('shimmer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full py-3 rounded-xl bg-[#0D2B4E] text-white text-[10px] uppercase font-bold tracking-widest shadow-lg hover:bg-[#6B4B2E] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border-none font-bold"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Apply Filters ({filteredJewellery.length} items)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CATALOG MAIN BODY */}
      <div className={`transition-colors duration-500 min-h-screen pb-32 sm:pb-20 ${isCatalogDark ? 'bg-[#F2EDE4] text-[#0D2B4E]' : 'bg-[#F8F5EC] text-[#0D2B4E]'}`}>

        {/* Full-width Banner Carousel */}
        <BannerCarousel banners={[banner1, banner2]} />

        <div className="max-w-[1600px] mx-auto px-3 sm:px-8 lg:px-12 space-y-4 sm:space-y-8 animate-slide-up pt-4 sm:pt-8">

          {/* Top Interactive Category Bar */}
          <div className="w-full overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-2 min-w-max">
              {primaryCategories.map((cat) => {
                const isSelected = activeCategoryTab.toLowerCase() === cat.id.toLowerCase() || (cat.id === 'Collections' && (activeCategoryTab === 'Collections' || !activeCategoryTab));
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      triggerAudio('click');
                      if (cat.id === 'Silver') {
                        changeCategoryTab('Silver');
                        handleSetMetalFilter('silver');
                      } else {
                        changeCategoryTab(cat.id);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer border select-none ${
                      isSelected
                        ? 'bg-[#0D2B4E] text-white border-[#0D2B4E] shadow-md scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#0D2B4E]/50 hover:text-[#0D2B4E]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Split Layout: Sidebar Filters (left) & Products Grid (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-start text-left">

            {/* Left Sidebar Filters Panel — Desktop only */}
            <aside className="hidden lg:block col-span-12 lg:col-span-3 lg:sticky lg:top-24 bg-white border border-[#6B4B2E]/20 rounded-xl sm:rounded-3xl shadow-[0_8px_24px_rgba(63,31,84,0.04)] text-left relative z-20 self-start" style={{ maxHeight: 'none', overflowY: 'visible', scrollbarWidth: 'thin', scrollbarColor: '#6B4B2E transparent', padding: '0' }}>

              {/* Header */}
              <div className="flex justify-between items-center border-b border-gray-100 px-3 sm:px-5 py-2 sm:py-3 sticky top-0 bg-white z-10 rounded-t-xl sm:rounded-t-3xl">
                <h3 className="serif-luxury text-xs sm:text-base font-bold text-[#0D2B4E] flex items-center gap-1.5 tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-[#6B4B2E]" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={resetAllFilters}
                  className="text-[7px] sm:text-[9px] uppercase tracking-widest font-black text-[#6B4B2E] hover:text-[#0D2B4E] transition-colors cursor-pointer border border-solid border-[#6B4B2E]/30 rounded-md sm:rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 bg-transparent"
                >
                  Clear All
                </button>
              </div>

              <div className="px-3 sm:px-5 py-2 sm:py-4 space-y-0 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto text-left" style={{ scrollbarWidth: 'thin', scrollbarColor: '#6B4B2E transparent' }}>

                {/* 1. CATEGORY */}
                <div className="border-b border-gray-100 py-1.5 sm:py-3 text-left">
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-1.5 sm:mb-2.5">Category</span>
                  <div className="space-y-1 sm:space-y-1.5">
                    {primaryCategories.map(cat => {
                      const isActive = activeCategoryTab.toLowerCase() === cat.id.toLowerCase() || (cat.id === 'Collections' && (activeCategoryTab === 'Collections' || !activeCategoryTab));
                      return (
                        <label key={cat.id} className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="desktop-cat" 
                            checked={isActive} 
                            onChange={() => {
                              triggerAudio('click');
                              if (cat.id === 'Silver') {
                                changeCategoryTab('Silver');
                                handleSetMetalFilter('silver');
                              } else {
                                changeCategoryTab(cat.id);
                              }
                            }} 
                            className="accent-[#0D2B4E] w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 cursor-pointer" 
                          />
                          <span className={`text-[9px] sm:text-[11px] font-sans leading-none flex items-center gap-1.5 ${isActive ? 'text-[#0D2B4E] font-bold' : 'text-gray-600 group-hover:text-[#0D2B4E]'}`}>
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 2. METAL TYPE — Quick Select & Radio */}
                <div className="border-b border-gray-100 py-2 sm:py-3 text-left">
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-2 sm:mb-3">Metal Type</span>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {metalTypeOptions.map((opt) => {
                      const isActive = metalFilter === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSetMetalFilter(opt.id)}
                          className={`relative flex flex-col items-center justify-center gap-1 py-2 sm:py-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${isActive ? 'shadow-[0_4px_14px_rgba(0,0,0,0.12)]' : 'border-gray-200 hover:border-gray-300'}`}
                          style={{
                            borderColor: isActive ? opt.border : '#E5E7EB',
                            background: isActive ? opt.bg : 'white'
                          }}
                        >
                          <span className="text-lg">{opt.icon}</span>
                          <span className="text-[8px] sm:text-[10px] font-extrabold tracking-wide font-sans text-center" style={{ color: isActive ? opt.text : '#6B7280' }}>
                            {opt.label}
                          </span>
                          {isActive && (
                            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: opt.border }}>
                              <svg viewBox="0 0 10 10" className="w-2 h-2" fill="white"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    {metalRadioList.map(m => (
                      <label key={m} className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="metal" 
                          checked={metalFilter === m.toLowerCase()} 
                          onChange={() => handleSetMetalFilter(m.toLowerCase())} 
                          className="accent-[#0D2B4E] w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 cursor-pointer" 
                        />
                        <span className={`text-[9px] sm:text-[11px] font-sans leading-none ${metalFilter === m.toLowerCase() ? 'text-[#0D2B4E] font-bold' : 'text-gray-600 group-hover:text-[#0D2B4E]'}`}>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. DYNAMIC PURITY */}
                <div className="border-b border-gray-100 py-1.5 sm:py-3 text-left">
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-1.5 sm:mb-2.5">
                    {isSilverActive ? 'Silver Purity' : isPlatinumActive ? 'Platinum Purity' : 'Gold Purity'}
                  </span>
                  <div className="space-y-1 sm:space-y-2">
                    {purityOptions.map(p => (
                      <label key={p.val} className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="purity" 
                          checked={purityFilter === p.val} 
                          onChange={() => handleSetPurityFilter(p.val)} 
                          className="accent-[#0D2B4E] w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 cursor-pointer" 
                        />
                        <span className={`text-[9px] sm:text-[11px] font-sans leading-none ${purityFilter === p.val ? 'text-[#0D2B4E] font-bold' : 'text-gray-600 group-hover:text-[#0D2B4E]'}`}>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 4. PRICE */}
                <div className="border-b border-gray-100 py-1.5 sm:py-3 text-left">
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-1.5 sm:mb-2.5">Price</span>
                  <div className="space-y-1 sm:space-y-2">
                    {[
                      { label: 'Below Rs. 10,000', val: 10000 },
                      { label: 'Rs. 10,000 – Rs. 20,000', val: 20000 },
                      { label: 'Rs. 20,000 – Rs. 30,000', val: 30000 },
                      { label: 'Rs. 30,000 – Rs. 40,000', val: 40000 },
                      { label: 'Rs. 40,000 – Rs. 50,000', val: 50000 },
                      { label: 'Rs. 50,000 and Above', val: 100000000 },
                    ].map(({ label, val }) => {
                      const isChecked = priceFilter === label;
                      return (
                        <label key={val} className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="price" 
                            checked={isChecked} 
                            onChange={() => {
                              if (isChecked) {
                                setPriceFilter('all');
                                setMaxPriceFilter(100000000);
                                setExternalMaxPrice?.(100000000);
                              } else {
                                setPriceFilter(label);
                                setMaxPriceFilter(val);
                                setExternalMaxPrice?.(val);
                              }
                            }} 
                            className="accent-[#0D2B4E] w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 cursor-pointer" 
                          />
                          <span className={`text-[9px] sm:text-[11px] font-sans leading-none ${isChecked ? 'text-[#0D2B4E] font-bold' : 'text-gray-600 group-hover:text-[#0D2B4E]'}`}>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. GENDER */}
                <div className="border-b border-gray-100 py-1.5 sm:py-3 text-left">
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-1.5 sm:mb-2.5">Gender</span>
                  <div className="space-y-1 sm:space-y-2">
                    {['All', 'Women', 'Men', 'Unisex', 'Others'].map(g => (
                      <label key={g} className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group">
                        <input type="radio" name="gender" checked={genderFilter === g.toLowerCase()} onChange={() => handleSetGenderFilter(g.toLowerCase())} className="accent-[#0D2B4E] w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 cursor-pointer" />
                        <span className={`text-[9px] sm:text-[11px] font-sans leading-none ${genderFilter === g.toLowerCase() ? 'text-[#0D2B4E] font-bold' : 'text-gray-600 group-hover:text-[#0D2B4E]'}`}>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 6. STONES */}
                <div className="border-b border-gray-100 py-1.5 sm:py-3 text-left">
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-1.5 sm:mb-2.5">Stones</span>
                  <div className="space-y-1 sm:space-y-2">
                    {['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'Topaz', 'Amethyst', 'Garnet', 'Opal', 'Citrine', 'Aquamarine'].map(s => (
                      <label key={s} className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group">
                        <input type="radio" name="stone" checked={stoneFilter === s} onChange={() => setStoneFilter(prev => prev === s ? 'all' : s)} className="accent-[#0D2B4E] w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 cursor-pointer" />
                        <span className={`text-[9px] sm:text-[11px] font-sans leading-none ${stoneFilter === s ? 'text-[#0D2B4E] font-bold' : 'text-gray-600 group-hover:text-[#0D2B4E]'}`}>{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 7. OCCASION */}
                <div className="border-b border-gray-100 py-1.5 sm:py-3 text-left">
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#1B1B1B] block mb-1.5 sm:mb-2.5">Occasion</span>
                  <div className="space-y-1 sm:space-y-2">
                    {['Everyday Wear', 'Festive', 'Wedding', 'Engagement', 'Anniversary', 'Gifting', 'Workwear', 'Romantic', 'Vacation', 'Special Occasion', 'Valentine'].map(o => (
                      <label key={o} className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group">
                        <input type="radio" name="occasion" checked={occasionFilter === o} onChange={() => setOccasionFilter(prev => prev === o ? 'all' : o)} className="accent-[#0D2B4E] w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 cursor-pointer" />
                        <span className={`text-[9px] sm:text-[11px] font-sans leading-none ${occasionFilter === o ? 'text-[#0D2B4E] font-bold' : 'text-gray-600 group-hover:text-[#0D2B4E]'}`}>{o}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* BESPOKE CTA */}
                <div className="pt-2 sm:pt-4 text-center space-y-1.5 sm:space-y-2">
                  <p className="text-[7px] sm:text-[9px] text-gray-400 font-light leading-relaxed font-sans">Can't find your dream piece? Request bespoke craftsmanship.</p>
                  <button onClick={() => { triggerAudio('shimmer'); setCustomDesignOpen(true); }}
                    className="w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#0D2B4E]/10 hover:bg-[#0D2B4E] text-[#0D2B4E] hover:text-white border border-solid border-[#0D2B4E]/30 hover:border-transparent text-[7px] sm:text-[8.5px] uppercase font-bold tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5">
                    <PenTool className="w-3 h-3" />
                    <span>Create Custom Design</span>
                  </button>
                </div>

              </div>

            </aside>

            {/* Right Products panel */}
            <div className="col-span-12 lg:col-span-9 space-y-3 sm:space-y-4 text-left">

              {/* Active Search Query Notice */}
              {searchQuery && searchQuery.trim() !== '' && (
                <div className="bg-[#FAF8F6] border border-solid border-[#E6C687]/50 rounded-xl sm:rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-[#6B4B2E]" />
                    <span className="text-gray-700">Searching for: <strong className="text-[#0D2B4E]">"{searchQuery}"</strong> ({filteredJewellery.length} results)</span>
                  </div>
                  <button
                    onClick={() => {
                      if (typeof setSearchQuery === 'function') setSearchQuery('');
                      triggerAudio('click');
                    }}
                    className="text-[10px] uppercase font-bold text-gray-400 hover:text-red-600 transition-colors cursor-pointer border border-solid border-gray-200 rounded-lg px-2 py-1 bg-white"
                  >
                    ✕ Clear Search
                  </button>
                </div>
              )}

              {/* Sorting Header Row */}
              <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 bg-white border border-[#6B4B2E]/15 rounded-xl sm:rounded-2xl py-2 sm:py-3 px-3 sm:px-6 shadow-[0_4px_16px_rgba(63,31,84,0.03)] text-[9px] sm:text-xs">
                <span className="text-gray-500 font-medium whitespace-nowrap">
                  Showing <strong className="text-[#0D2B4E]">{filteredJewellery.length}</strong> jewellery items
                </span>

                <div className="flex items-center gap-1.5 sm:gap-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-gray-450 font-bold uppercase text-[7px] sm:text-[9px] tracking-wider shrink-0 hidden sm:inline">Sort By:</span>
                    <select
                      value={sortFilter}
                      onChange={(e) => setSortFilter(e.target.value)}
                      className="bg-[#FAF8F5] border border-gray-200 rounded-lg sm:rounded-xl px-1.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs text-gray-700 font-sans outline-none focus:border-gold cursor-pointer"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="newest">Newest</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                    </select>
                  </div>

                  <button
                    onClick={() => { triggerAudio('shimmer'); setCustomDesignOpen(true); }}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg sm:rounded-xl bg-gold/10 hover:bg-gold text-gold hover:text-white border border-solid border-gold hover:border-transparent text-[8px] sm:text-[9px] uppercase font-bold tracking-widest transition-all duration-300 cursor-pointer shadow-sm ml-auto whitespace-nowrap"
                  >
                    <PenTool className="w-3 h-3" />
                    <span className="hidden xs:inline">Custom </span>Design
                  </button>
                </div>
              </div>

              {/* Active Filter Badges / Chips Bar */}
              {hasActiveFilters && (
                <div className="bg-white/80 border border-[#6B4B2E]/20 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 text-left">
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Active Filters:</span>
                  
                  {activeCategoryTab && activeCategoryTab !== 'Collections' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#0D2B4E]/10 text-[#0D2B4E] border border-[#0D2B4E]/20">
                      Category: {activeCategoryTab}
                      <button onClick={() => changeCategoryTab('Collections')} className="hover:text-red-600 ml-0.5 cursor-pointer bg-transparent border-none text-[11px] font-bold">✕</button>
                    </span>
                  )}
                  
                  {metalFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#C8960C]/15 text-[#916700] border border-[#C8960C]/30">
                      Metal: {metalFilter.toUpperCase()}
                      <button onClick={() => handleSetMetalFilter('all')} className="hover:text-red-600 ml-0.5 cursor-pointer bg-transparent border-none text-[11px] font-bold">✕</button>
                    </span>
                  )}
                  
                  {purityFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      Purity: {purityFilter}
                      <button onClick={() => handleSetPurityFilter('all')} className="hover:text-red-600 ml-0.5 cursor-pointer bg-transparent border-none text-[11px] font-bold">✕</button>
                    </span>
                  )}
                  
                  {priceFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      Price: {priceFilter}
                      <button onClick={() => { setPriceFilter('all'); setMaxPriceFilter(100000000); setExternalMaxPrice?.(100000000); }} className="hover:text-red-600 ml-0.5 cursor-pointer bg-transparent border-none text-[11px] font-bold">✕</button>
                    </span>
                  )}
                  
                  {genderFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      Gender: {genderFilter === 'men' ? 'For Men' : genderFilter === 'women' ? 'For Women' : genderFilter === 'kids' ? 'For Kids' : genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)}
                      <button onClick={() => handleSetGenderFilter('all')} className="hover:text-red-600 ml-0.5 cursor-pointer bg-transparent border-none text-[11px] font-bold">✕</button>
                    </span>
                  )}
                  
                  {stoneFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      Stone: {stoneFilter}
                      <button onClick={() => setStoneFilter('all')} className="hover:text-red-600 ml-0.5 cursor-pointer bg-transparent border-none text-[11px] font-bold">✕</button>
                    </span>
                  )}
                  
                  {occasionFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      Occasion: {occasionFilter}
                      <button onClick={() => setOccasionFilter('all')} className="hover:text-red-600 ml-0.5 cursor-pointer bg-transparent border-none text-[11px] font-bold">✕</button>
                    </span>
                  )}
                  
                  <button
                    onClick={resetAllFilters}
                    className="text-[10px] sm:text-xs font-bold text-red-600 hover:underline cursor-pointer bg-transparent border-none ml-auto"
                  >
                    Clear All ✕
                  </button>
                </div>
              )}

              {catalogLoading ? (
                /* Shimmer loading state */
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
                  {[...Array(6)].map((_, idx) => (
                    <div
                      key={idx}
                      className="border rounded-xl sm:rounded-[28px] p-2 sm:p-4 space-y-2 sm:space-y-4 shadow-sm animate-pulse bg-white border-gray-100"
                    >
                      <div className="aspect-square rounded-[1.25rem] relative overflow-hidden bg-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-1/3 rounded bg-gray-200"></div>
                        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                        <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                      </div>
                      <div className="h-10 rounded-xl bg-gray-100"></div>
                    </div>
                  ))}
                </div>
              ) : filteredJewellery.length === 0 ? (
                /* Empty state */
                <div className="py-20 px-6 text-center border border-solid rounded-[2.5rem] shadow-sm max-w-md mx-auto space-y-5 animate-fade-in bg-white border-[#FAF8F5] text-[#0D2B4E]">
                  <div className="w-16 h-16 bg-[#FAF8F5]/10 border border-solid border-[#6B4B2E]/30 rounded-full flex items-center justify-center mx-auto text-[#6B4B2E] shadow-inner animate-float-gentle">
                    <Sparkles className="w-7 h-7 text-[#6B4B2E]" />
                  </div>
                  <h3 className="serif-luxury font-medium text-xl">No Masterpieces Found</h3>
                  <p className="text-xs max-w-xs mx-auto leading-relaxed normal-case text-gray-550">
                    No items match the active combination of <span className="font-semibold text-[#6B4B2E]">{activeCategoryTab}</span> {metalFilter !== 'all' && `(${metalFilter.toUpperCase()})`} filters.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 shadow-md cursor-pointer border bg-[#0D2B4E] text-white hover:bg-[#6B4B2E] border-transparent font-bold"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                /* Normal Listing State */
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5 animate-fade-in text-left">
                  {filteredJewellery.map((prod) => {
                    const isWishlisted = wishlistItems.some(w => w.id === prod.id);
                    return (
                      <div
                        key={prod.id}
                        onClick={() => navigateToPDP(prod)}
                        className="group rounded-xl sm:rounded-3xl p-2 sm:p-5 flex flex-col justify-between border border-solid border-[#EAEAEA] transition-all duration-300 relative cursor-pointer overflow-hidden bg-white text-[#1B1B1B] shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:border-[#6B4B2E]/45 hover:-translate-y-1.5 h-auto text-left"
                      >
                        {/* Image & Overlays */}
                        <div className="aspect-square rounded-xl sm:rounded-[1.5rem] overflow-hidden relative bg-white border border-solid border-[#6B4B2E]/5 shrink-0 text-center">
                          {prod.img ? (
                            <img
                              src={getOptimizedImageUrl(prod.img, { width: 600 })}
                              alt={prod.name}
                              loading="lazy"
                              onError={(e) => {
                                const fallback = getProductFallbackImage(prod);
                                if (e.currentTarget.src !== fallback) {
                                  e.currentTarget.src = fallback;
                                }
                              }}
                              className="w-full h-full object-contain p-4 scale-100 group-hover:scale-110 transition-transform duration-[1200ms] ease-out mix-blend-multiply"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-[#FAF8F5] to-[#F3EEE7] flex flex-col items-center justify-center space-y-2 border border-dashed border-[#6B4B2E]/20 rounded-xl">
                              <Gem className="w-8 h-8 text-[#6B4B2E] animate-float-gentle" />
                              <span className="text-[8px] tracking-widest text-[#BCA057] uppercase font-bold">Awaiting Curation</span>
                            </div>
                          )}

                          {prod.badge && (
                            <span className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-[#1B1B1B] text-[#6B4B2E] text-[6px] sm:text-[8px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full tracking-wider uppercase border border-solid border-[#6B4B2E]/30 z-20 shadow-sm animate-pulse-slow">
                              {prod.badge}
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerAudio('click');
                              toggleWishlist(prod);
                            }}
                            className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 p-1.5 sm:p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#1B1B1B] shadow-md transition-all duration-300 hover:scale-105 active:scale-95 z-20 focus:outline-none cursor-pointer border-none"
                          >
                            <svg
                              className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-colors duration-300 ${isWishlisted ? 'text-[#6B4B2E] fill-current scale-110' : 'text-gray-400 fill-none'}`}
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>

                        {/* Metadata Details */}
                        <div className="space-y-1 sm:space-y-2 mt-1.5 sm:mt-4 flex-1 flex flex-col justify-between text-left">
                          <div className="space-y-0.5 sm:space-y-1 text-left">
                            <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#6B4B2E] font-bold block text-left">
                              {prod.subCategory || prod.category}
                            </span>
                            <h3 className="serif-luxury font-bold text-[10px] sm:text-base leading-tight sm:leading-snug group-hover:text-[#6B4B2E] transition-colors duration-300 line-clamp-2 text-[#1B1B1B] text-left">
                              {prod.name}
                            </h3>
                            <p className="text-[8px] sm:text-[10px] font-sans font-light leading-relaxed normal-case text-[#666666]/90 hidden sm:line-clamp-2 text-left">
                              {prod.desc}
                            </p>
                          </div>

                          <div className="pt-1 sm:pt-2.5 border-t border-gray-100/80 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mt-auto w-full">
                            <div className="flex flex-wrap items-baseline gap-1.5">
                              <span className="font-extrabold text-[10px] sm:text-sm text-[#6B4B2E] tracking-wide font-sans">
                                ₹{formatPrice(calculatePrice(prod).total)}
                              </span>
                              {Number(prod.discountPercent) > 0 && (
                                <>
                                  <span className="text-[7.5px] sm:text-[10px] line-through text-gray-400 font-sans">
                                    ₹{formatPrice(calculatePrice(prod).originalTotal || Math.round(calculatePrice(prod).total / (1 - Number(prod.discountPercent) / 100)))}
                                  </span>
                                  <span className="text-[7px] sm:text-[9.5px] text-[#4CAF50] font-extrabold tracking-wide font-sans uppercase">
                                    {Number(prod.discountPercent)}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                            <span className="text-[6px] sm:text-[8.5px] font-semibold px-1.5 sm:px-2.5 py-0.5 rounded-full uppercase tracking-widest bg-[#6B4B2E]/10 text-[#6B4B2E] border border-solid border-[#6B4B2E]/20 hidden sm:inline whitespace-nowrap">
                              {prod.carat || '22K Gold'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-1.5 sm:mt-4 pt-0 sm:pt-1 flex items-center gap-1.5 sm:gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerAudio('click');
                              setConsultationModal(true);
                            }}
                            className="w-9 h-9 sm:w-12 sm:h-12 border border-solid border-[#4CAF50] bg-transparent hover:bg-[#4CAF50]/5 rounded-lg sm:rounded-xl flex items-center justify-center cursor-pointer focus:outline-none shrink-0 transition-colors duration-300"
                            title="Book Video Call"
                          >
                            <svg className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-[#4CAF50]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerAudio('click');
                              navigateToPDP(prod);
                            }}
                            className="flex-grow h-9 sm:h-12 border border-solid border-gray-200 hover:border-gray-400 bg-white text-gray-800 hover:text-black font-semibold text-[9px] sm:text-xs rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer focus:outline-none flex items-center justify-center font-sans"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
    </>
  );
}
