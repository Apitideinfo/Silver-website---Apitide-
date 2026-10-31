import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { Gem, Scale, Ruler, Copy } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useRates } from '../hooks/useRates';
import { useProducts } from '../hooks/useProducts';
import { formatDateSafe } from '../utils/format';
import Modal from '../components/Modal';
import BookingForm from '../forms/BookingForm';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

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



// Process Image Imports
import productSketch from '../assets/product_sketch.png';
import jewelrySketchDesk from '../assets/jewelry_sketch_desk.png';
import process3dDesign from '../assets/process_3d_design.png';
import processCasting from '../assets/process_casting.png';
import processPolishing from '../assets/process_polishing.png';
import processSetting from '../assets/process_setting.png';
import processQuality from '../assets/process_quality.png';
import processPackaging from '../assets/process_packaging.png';

// Testimonial Images
import testimonial1 from '../assets/testimonial_1.png';
import testimonial2 from '../assets/testimonial_2.png';
import testimonial3 from '../assets/testimonial_3.png';
import testimonial4 from '../assets/testimonial_4.png';

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

export default function ProductDetail({
  detailProduct: propProduct,
  setDetailProduct,
  navigateTo,
  navigateToPDP,
  triggerAudio: triggerAudioProp,
}) {
  // Self-contained data — pulled from context, no prop drilling
  const { wishlistItems = [], toggleWishlist } = useWishlist();
  const { handleAddToCart, setCartOpen } = useCart();
  const {
    goldRate24k = 78500,
    goldRate22k = 71958,
    goldRate20k = 65417,
    goldRate18k = 58875,
    goldRate14k = 45788,
    goldRate9k = 29438,
    silverRate = 92000,
    silverRate1kg = 92000,
    silverRate925 = 85100,
    silverRateNormal = 82800,
    silverRate1g = 92,
    silverRate925PerGram = 85.1,
    silverRateNormalPerGram = 82.8,
    platinumRate = 3500,
    lastUpdated,
    publishedAt,
    calculatePrice
  } = useRates();
  const { products = [], loading: productsLoading } = useProducts();
  // Safe audio helper
  const triggerAudio = (type) => { try { triggerAudioProp?.(type); } catch { /* noop */ } };

  // Local modal state (previously passed as props)
  const [consultationModal, setConsultationModal] = useState(false);

  // ALL useState/useEffect hooks must come BEFORE any early returns (React rules of hooks)

  // Resolve which product to display: prop > first product in store
  const detailProduct = propProduct || products[0] || null;

  // Local Gallery State
  const [detailActiveImg, setDetailActiveImg] = useState(detailProduct?.img || null);
  const [pdpHovered, setPdpHovered] = useState(false);
  const [pdpZoomStyle, setPdpZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });

  // Customization & Size States
  const [pdpCustomizeOpen, setPdpCustomizeOpen] = useState(true);
  const [pdpSelectedMetal, setPdpSelectedMetal] = useState('18KT Yellow Gold');
  const [selectedRingSize, setSelectedRingSize] = useState('12');
  const [selectedBangleSize, setSelectedBangleSize] = useState('2-4');
  const [selectedChainSize, setSelectedChainSize] = useState('18"');
  const [customEngraving, setCustomEngraving] = useState('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Process & Price Breakup States
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [processPaused, setProcessPaused] = useState(false);
  const [pdpPriceTab, setPdpPriceTab] = useState('breakup');

  // Sticky buy bar — shown when user scrolls past the hero section
  const [showStickyBuyBar, setShowStickyBuyBar] = useState(false);

  // Helper properties computed safely after states
  const isSilver = !!detailProduct && (
    (detailProduct.categoryType || '').toLowerCase().includes('silver') ||
    (detailProduct.category || '').toLowerCase().includes('silver') ||
    (detailProduct.metal || detailProduct.metalType || '').toLowerCase().includes('silver') ||
    (detailProduct.metal || detailProduct.metalType || '').toLowerCase().includes('sterling') ||
    (detailProduct.title || detailProduct.name || '').toLowerCase().includes('silver') ||
    (detailProduct.metalPurity || detailProduct.carat || detailProduct.silverPurity || '').toLowerCase().includes('92.5') ||
    (detailProduct.metalPurity || detailProduct.carat || detailProduct.silverPurity || '').toLowerCase().includes('925') ||
    (detailProduct.metalPurity || detailProduct.carat || detailProduct.silverPurity || '').toLowerCase().includes('999')
  );

  const isPlatinum = !isSilver && !!detailProduct && (
    (detailProduct.categoryType || '').toLowerCase().includes('platinum') ||
    (detailProduct.category || '').toLowerCase().includes('platinum') ||
    (detailProduct.metal || detailProduct.metalType || '').toLowerCase().includes('platinum')
  );

  // Resolve current active purity & rate per gram dynamically
  let activePurity = '22K';
  if (isSilver) {
    const rawSilverPurity = pdpSelectedMetal || detailProduct?.silverPurity || detailProduct?.categoryType || detailProduct?.metalPurity || detailProduct?.carat || '925 Sterling Silver';
    if (rawSilverPurity.toLowerCase().includes('999')) activePurity = '999 Silver';
    else if (rawSilverPurity.toLowerCase().includes('normal')) activePurity = 'Normal Silver';
    else activePurity = '925 Sterling Silver';
  } else if (isPlatinum) {
    activePurity = '950 Platinum';
  } else {
    const selectedPurityClean = (pdpSelectedMetal ? pdpSelectedMetal.split(' ')[0] : '').replace(/KT$/i, 'K').toUpperCase();
    const productPurityClean = (detailProduct?.goldPurity || detailProduct?.carat || detailProduct?.metalPurity || '18K').replace(/KT$/i, 'K').toUpperCase();
    activePurity = selectedPurityClean || productPurityClean || '18K';
  }

  let activeRateLabel = `Today's Gold Rate (${activePurity})`;
  let activeRatePerGram = Math.round(goldRate22k / 10);

  if (isSilver) {
    if (activePurity.includes('999')) {
      activeRateLabel = `Today's Silver Rate (999 Fine Silver)`;
      activeRatePerGram = Math.round(silverRate1g || ((silverRate1kg || silverRate || 92000) / 1000));
    } else if (activePurity.includes('925') || activePurity.includes('92.5') || activePurity.includes('Sterling')) {
      activeRateLabel = `Today's Silver Rate (925 Sterling Silver)`;
      activeRatePerGram = Math.round(silverRate925PerGram || ((silverRate925 || (silverRate1kg || silverRate || 92000) * 0.925) / 1000));
    } else {
      activeRateLabel = `Today's Silver Rate (Normal Silver)`;
      activeRatePerGram = Math.round(silverRateNormalPerGram || ((silverRateNormal || (silverRate1kg || silverRate || 92000) * 0.90) / 1000));
    }
  } else if (isPlatinum) {
    activeRateLabel = "Today's Platinum Rate";
    activeRatePerGram = Math.round(platinumRate || 3500);
  } else {
    if (activePurity.includes('24')) {
      activeRateLabel = "Today's Gold Rate (24K)";
      activeRatePerGram = Math.round(goldRate24k / 10);
    } else if (activePurity.includes('22')) {
      activeRateLabel = "Today's Gold Rate (22K)";
      activeRatePerGram = Math.round(goldRate22k / 10);
    } else if (activePurity.includes('20')) {
      activeRateLabel = "Today's Gold Rate (20K)";
      activeRatePerGram = Math.round(goldRate20k / 10);
    } else if (activePurity.includes('18')) {
      activeRateLabel = "Today's Gold Rate (18K)";
      activeRatePerGram = Math.round(goldRate18k / 10);
    } else if (activePurity.includes('14')) {
      activeRateLabel = "Today's Gold Rate (14K)";
      activeRatePerGram = Math.round(goldRate14k / 10);
    } else if (activePurity.includes('9')) {
      activeRateLabel = "Today's Gold Rate (9K)";
      activeRatePerGram = Math.round((goldRate9k || ((goldRate24k / 10) * 0.375 * 10)) / 10);
    }
  }

  // Calculate product price, taking into account user's custom metal/karat selection for dynamic items
  const isDynamicMode = detailProduct?.priceCalculationMode === 'dynamic';

  const computedPrices = detailProduct && typeof calculatePrice === 'function'
    ? calculatePrice({
        ...detailProduct,
        metal: isSilver ? 'Silver' : isPlatinum ? 'Platinum' : (detailProduct.metal || 'Gold'),
        carat: isDynamicMode ? activePurity : (detailProduct.carat || detailProduct.metalPurity || activePurity),
        goldPurity: isDynamicMode && !isSilver && !isPlatinum ? activePurity : detailProduct.goldPurity,
        silverPurity: isDynamicMode && isSilver ? activePurity : detailProduct.silverPurity,
      })
    : null;

  const computedProductPrice = computedPrices
    ? (computedPrices.total !== undefined ? computedPrices.total : (computedPrices.subtotal || 0))
    : (detailProduct ? Math.round(Number(detailProduct.price || 0) * 1.03) : 0);

  const productDiscountPercent = computedPrices?.discountPercent !== undefined && computedPrices?.discountPercent !== null
    ? computedPrices.discountPercent
    : (Number(detailProduct?.discountPercent) || 0);

  const hasDiscount = productDiscountPercent > 0;

  const originalProductPrice = computedPrices?.originalTotal && hasDiscount
    ? computedPrices.originalTotal
    : (hasDiscount && computedProductPrice ? Math.round(computedProductPrice / (1 - productDiscountPercent / 100)) : computedProductPrice);

  // Scroll listener for sticky buy bar
  useEffect(() => {
    const handleScroll = () => setShowStickyBuyBar(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync image, default metal, & size selection when detailProduct changes
  useEffect(() => {
    if (detailProduct) {
      setDetailActiveImg(detailProduct.img);
      if (isSilver) {
        const defaultSilverPurity = detailProduct.silverPurity || detailProduct.metalPurity || detailProduct.carat || detailProduct.categoryType || '925 Sterling Silver';
        if (defaultSilverPurity.toLowerCase().includes('999')) {
          setPdpSelectedMetal('999 Silver');
        } else if (defaultSilverPurity.toLowerCase().includes('normal')) {
          setPdpSelectedMetal('Normal Silver');
        } else {
          setPdpSelectedMetal('925 Sterling Silver');
        }
      } else if (isPlatinum) {
        setPdpSelectedMetal('950 Platinum');
      } else {
        const rawPurity = (detailProduct.goldPurity || detailProduct.metalPurity || detailProduct.carat || '18K').toUpperCase().replace(/KT$/i, '').replace(/K$/i, '');
        const color = detailProduct.customMetalColor || detailProduct.metalColor || 'Yellow Gold';
        setPdpSelectedMetal(`${rawPurity}KT ${color}`);
      }

      // Initialize ring size if product has ring sizes
      const ringList = Array.isArray(detailProduct.ringSizes) && detailProduct.ringSizes.length > 0
        ? detailProduct.ringSizes
        : typeof detailProduct.ringSizes === 'string' && detailProduct.ringSizes.trim()
        ? detailProduct.ringSizes.split(',').map(s => s.trim()).filter(Boolean)
        : null;
      if (ringList && ringList.length > 0) {
        setSelectedRingSize(ringList[0]);
      } else {
        setSelectedRingSize('12');
      }

      // Initialize bangle size if product has bangle sizes
      const bangleList = Array.isArray(detailProduct.bangleSizes) && detailProduct.bangleSizes.length > 0
        ? detailProduct.bangleSizes
        : typeof detailProduct.bangleSizes === 'string' && detailProduct.bangleSizes.trim()
        ? detailProduct.bangleSizes.split(',').map(s => s.trim()).filter(Boolean)
        : null;
      if (bangleList && bangleList.length > 0) {
        setSelectedBangleSize(bangleList[0]);
      } else {
        setSelectedBangleSize('2-4');
      }

      // Initialize chain size if product has chain sizes
      const chainList = Array.isArray(detailProduct.chainSizes) && detailProduct.chainSizes.length > 0
        ? detailProduct.chainSizes
        : typeof detailProduct.chainSizes === 'string' && detailProduct.chainSizes.trim()
        ? detailProduct.chainSizes.split(',').map(s => s.trim()).filter(Boolean)
        : null;
      if (chainList && chainList.length > 0) {
        setSelectedChainSize(chainList[0]);
      } else {
        setSelectedChainSize('18"');
      }
    }
  }, [detailProduct?.id, isSilver, isPlatinum]);

  // Autoplay process timeline steps
  useEffect(() => {
    if (processPaused) return;
    const interval = setInterval(() => {
      setActiveProcessStep((prev) => (prev + 1) % 6);
    }, 4500);
    return () => clearInterval(interval);
  }, [processPaused]);

  // Media Autoplay logic — computed safely, guard returns are below
  const pdpMediaList = detailProduct
    ? [detailProduct.img, ...(detailProduct.subImages || [])].filter(Boolean)
    : [];
  const currentIdx = detailProduct
    ? pdpMediaList.indexOf(detailActiveImg || detailProduct.img)
    : -1;

  useEffect(() => {
    if (pdpHovered || pdpMediaList.length <= 1) return;
    const timer = setTimeout(() => {
      const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % pdpMediaList.length;
      setDetailActiveImg(pdpMediaList[nextIdx]);
    }, 5000);
    return () => clearTimeout(timer);
  }, [detailActiveImg, pdpHovered, pdpMediaList.length, currentIdx]);

  // Graceful fallback — products still loading
  if (productsLoading && !detailProduct) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F8F5EC]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#0D2B4E]/20 border-t-[#0D2B4E] rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-[#0D2B4E]/60 font-semibold font-sans">Loading Product...</p>
        </div>
      </div>
    );
  }

  // No product found at all — redirect user to browse collections
  if (!detailProduct) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 bg-[#F8F5EC]">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#0D2B4E]/10 text-[#0D2B4E] flex items-center justify-center mx-auto shadow-inner">
            <Gem className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#0D2B4E] serif-luxury tracking-tight">No Product Selected</h2>
          <p className="text-sm text-[#657989] font-medium leading-relaxed font-sans">
            Please browse our fine silver collection and select a product to view its details.
          </p>
          <button
            onClick={() => navigateTo?.('collections')}
            className="bg-[#0D2B4E] hover:bg-[#091B2B] text-[#F8F5EC] font-sans font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer border border-[#B09A82]/30 shadow-lg hover:shadow-xl"
          >
            Browse Collections
          </button>
        </div>
      </div>
    );
  }

  // Size Category Checkers with explicit sizeType support
  const configuredSizeType = detailProduct?.sizeType;
  const rawRings = detailProduct?.ringSizes;
  const hasRingList = (Array.isArray(rawRings) && rawRings.length > 0) || (typeof rawRings === 'string' && rawRings.trim().length > 0);
  const rawBangles = detailProduct?.bangleSizes;
  const hasBangleList = (Array.isArray(rawBangles) && rawBangles.length > 0) || (typeof rawBangles === 'string' && rawBangles.trim().length > 0);
  const rawChains = detailProduct?.chainSizes;
  const hasChainList = (Array.isArray(rawChains) && rawChains.length > 0) || (typeof rawChains === 'string' && rawChains.trim().length > 0);

  let isRing = false;
  let isBangle = false;
  let isChain = false;

  if (configuredSizeType === 'rings') {
    isRing = true;
  } else if (configuredSizeType === 'bangles') {
    isBangle = true;
  } else if (configuredSizeType === 'chains') {
    isChain = true;
  } else if (configuredSizeType === 'none') {
    isRing = false;
    isBangle = false;
    isChain = false;
  } else {
    // Legacy fallback based on arrays or category keywords
    if (hasRingList) {
      isRing = true;
    } else if (hasBangleList) {
      isBangle = true;
    } else if (hasChainList) {
      isChain = true;
    } else {
      isRing = ((detailProduct.categoryType || '').toLowerCase() === 'ring' || (detailProduct.category || '').toLowerCase().includes('ring')) && !((detailProduct.category || '').toLowerCase().includes('earring')) && !((detailProduct.categoryType || '').toLowerCase().includes('earring'));
      isBangle = (detailProduct.categoryType || '').toLowerCase() === 'bangle' || (detailProduct.category || '').toLowerCase().includes('bangle') || (detailProduct.categoryType || '').toLowerCase() === 'bracelet' || (detailProduct.category || '').toLowerCase().includes('bracelet');
      isChain = (detailProduct.categoryType || '').toLowerCase() === 'chain' || (detailProduct.category || '').toLowerCase().includes('chain') || (detailProduct.categoryType || '').toLowerCase() === 'necklace' || (detailProduct.category || '').toLowerCase().includes('necklace');
    }
  }

  const hasSizes = isRing || isBangle || isChain;
  const selectedSize = isChain ? selectedChainSize : isBangle ? selectedBangleSize : selectedRingSize;

  const isVideoUrl = (url) => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0].split('#')[0];
    return cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || cleanUrl.endsWith('.mov') || url.includes('/video/upload/');
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0';
    return Number(price).toLocaleString('en-IN');
  };

  const [manualZoomScale, setManualZoomScale] = useState(1);

  const handleZoomMouseMove = (e) => {
    setPdpHovered(true);
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPdpZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)',
    });
  };

  const handleZoomMouseLeave = () => {
    setPdpHovered(false);
    setPdpZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    });
  };

  return (
    <div className="bg-white text-[#181818] min-h-screen pb-24 relative font-sans">
      <Helmet>
        <title>{`${detailProduct?.name || 'Fine Silver Jewellery'} | BIS 925 Sterling Silver | MANISH & CO`}</title>
        <meta
          name="description"
          content={detailProduct?.desc || `Shop ${detailProduct?.name || 'fine silver jewellery'} in hallmarked 925 sterling silver at MANISH & CO. Handcrafted with generational devotion in Mau since 1996.`}
        />
        <meta property="og:title" content={`${detailProduct?.name || 'Fine Jewellery'} | MANISH & CO`} />
        <meta property="og:description" content={detailProduct?.desc || `Discover ${detailProduct?.name} in BIS 925 hallmarked sterling silver.`} />
        <meta property="og:image" content={detailProduct?.img || 'https://manishsilverdevjewellery-website.vercel.app/images/hero-necklace.jpg'} />
        <meta property="og:type" content="product" />
        <meta name="twitter:title" content={`${detailProduct?.name} | MANISH & CO`} />
        <meta name="twitter:image" content={detailProduct?.img || 'https://manishsilverdevjewellery-website.vercel.app/images/hero-necklace.jpg'} />
        {detailProduct && (
          <script type="application/ld+json">
            {`{
              "@context": "https://schema.org",
              "@type": "Product",
              "name": ${JSON.stringify(detailProduct.name || '')},
              "image": ${JSON.stringify(detailProduct.img || '')},
              "description": ${JSON.stringify(detailProduct.desc || detailProduct.name || '')},
              "sku": ${JSON.stringify(detailProduct.sku || detailProduct.id || '')},
              "brand": {
                "@type": "Brand",
                "name": "MANISH & CO"
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": ${JSON.stringify(String(calculatedPrice?.total || detailProduct.price || 0).replace(/[^0-9]/g, '') || "1999")},
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "MANISH & CO"
                }
              }
            }`}
          </script>
        )}
      </Helmet>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-16 animate-fade-in">

        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.2em] text-[#888888] uppercase font-sans text-left pb-4 select-none font-medium">
          <button onClick={() => navigateTo('home')} className="hover:text-[#B8893C] transition-colors duration-300 bg-transparent border-none cursor-pointer">HOME</button>
          <span className="text-[#E7DED2]">·</span>
          <button onClick={() => handleCategoryNav(detailProduct.category)} className="hover:text-[#B8893C] transition-colors duration-300 bg-transparent border-none cursor-pointer">{(detailProduct.category || 'JEWELLERY').toUpperCase()}</button>
          <span className="text-[#E7DED2]">·</span>
          <span className="text-[#181818] font-semibold">{detailProduct.name.toUpperCase()}</span>
        </nav>

        {/* Main Two-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-20 items-start">

          {/* LEFT COLUMN: Gallery View (Non-sticky/No-holder) */}
          <div className="space-y-8 self-start w-full text-center">

            {/* Hero Display Card */}
            <div
              className="relative bg-white flex items-start justify-center p-0 w-full aspect-square lg:aspect-auto lg:h-[550px] overflow-hidden group cursor-zoom-in transition-all duration-500"
              onMouseMove={handleZoomMouseMove}
              onMouseLeave={handleZoomMouseLeave}
            >
              {/* Left manual swipe arrow */}
              {pdpMediaList.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerAudio('click');
                    const prevIdx = (currentIdx - 1 + pdpMediaList.length) % pdpMediaList.length;
                    setDetailActiveImg(pdpMediaList[prevIdx]);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/75 backdrop-blur-md border border-gray-200/50 flex items-center justify-center text-gray-850 hover:bg-white hover:text-[#B8893C] transition-all duration-300 z-30 shadow-md cursor-pointer select-none active:scale-95"
                  title="Previous Image"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Right manual swipe arrow */}
              {pdpMediaList.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerAudio('click');
                    const nextIdx = (currentIdx + 1) % pdpMediaList.length;
                    setDetailActiveImg(pdpMediaList[nextIdx]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/75 backdrop-blur-md border border-gray-200/50 flex items-center justify-center text-gray-855 hover:bg-white hover:text-[#B8893C] transition-all duration-300 z-30 shadow-md cursor-pointer select-none active:scale-95"
                  title="Next Image"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Floating Wishlist Button */}
              <button
                onClick={(e) => { e.stopPropagation(); triggerAudio('click'); toggleWishlist(detailProduct); }}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none z-10 group/wish border-none bg-transparent"
                title="Add to Wishlist"
              >
                <svg
                  className={`w-6 h-6 transition-colors duration-300 ${wishlistItems.some(i => i.id === detailProduct.id) ? 'fill-red-500 text-red-500' : 'text-[#888888] hover:text-red-500'}`}
                  fill={wishlistItems.some(i => i.id === detailProduct.id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Render Media */}
              {isVideoUrl(detailActiveImg || detailProduct.img) ? (
                <div className="w-full h-full flex items-center justify-center bg-black rounded-none overflow-hidden">
                  <video
                    src={detailActiveImg || detailProduct.img}
                    autoPlay
                    loop
                    muted
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <>
                  <img
                    src={getOptimizedImageUrl(detailActiveImg || detailProduct.img, { width: 900 })}
                    alt={detailProduct.name}
                    onError={(e) => {
                      const fallback = getProductFallbackImage(detailProduct);
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    className="w-full h-full object-contain pointer-events-none transition-all duration-300 mix-blend-multiply"
                    style={{
                      transformOrigin: pdpHovered ? pdpZoomStyle.transformOrigin : 'center center',
                      transform: pdpHovered ? pdpZoomStyle.transform : `scale(${manualZoomScale})`,
                      transition: 'transform 0.15s ease-out, transform-origin 0.15s ease-out',
                      filter: 'brightness(1.06) contrast(1.04)',
                    }}
                  />

                  {/* Floating Zoom Controls for Mobile & Desktop */}
                  <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full border border-solid border-zinc-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] select-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerAudio('click');
                        setManualZoomScale(prev => Math.max(1, prev - 0.5));
                      }}
                      disabled={manualZoomScale <= 1}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-transparent hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-800 border-none cursor-pointer font-bold text-base transition-colors"
                      title="Zoom Out"
                    >
                      −
                    </button>
                    <span className="text-[10px] font-bold text-zinc-700 w-10 text-center font-sans tracking-tight">
                      {Math.round(manualZoomScale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerAudio('click');
                        setManualZoomScale(prev => Math.min(3, prev + 0.5));
                      }}
                      disabled={manualZoomScale >= 3}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-transparent hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-800 border-none cursor-pointer font-bold text-base transition-colors"
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails Strip */}
            <div className="relative flex items-center justify-center w-full bg-transparent py-1 select-none">
              <div id="pdp-thumb-list" className="flex-1 flex gap-4 overflow-x-auto no-scrollbar py-2 mx-3 justify-center select-none">
                {/* Main Image */}
                <button
                  onClick={() => { triggerAudio('click'); setDetailActiveImg(detailProduct.img); }}
                  className={`w-16 h-16 flex items-center justify-center p-0 bg-transparent shrink-0 focus:outline-none transition-all duration-300 hover:scale-105 cursor-pointer border-none relative ${(detailActiveImg || detailProduct.img) === detailProduct.img ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[1.5px] after:bg-[#B8893C]' : ''}`}
                >
                  <img src={detailProduct.img} className="w-14 h-14 object-contain rounded-none mix-blend-multiply" style={{ filter: 'brightness(1.06) contrast(1.04)' }} alt="Main View" />
                </button>

                {/* Sub Images */}
                {detailProduct.subImages && detailProduct.subImages.map((subImg, idx) => (
                  <button
                    key={idx}
                    onClick={() => { triggerAudio('click'); setDetailActiveImg(subImg); }}
                    className={`w-16 h-16 flex items-center justify-center p-0 bg-transparent shrink-0 focus:outline-none transition-all duration-300 hover:scale-105 cursor-pointer border-none relative ${(detailActiveImg || detailProduct.img) === subImg ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[1.5px] after:bg-[#B8893C]' : ''}`}
                  >
                    {isVideoUrl(subImg) ? (
                      <div className="w-16 h-16 flex flex-col items-center justify-center relative bg-black overflow-hidden rounded-none shadow-sm border border-gray-150">
                        <video src={subImg} className="w-14 h-14 object-cover" muted playsInline />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                          <svg className="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <img src={subImg} className="w-14 h-14 object-contain rounded-none mix-blend-multiply" style={{ filter: 'brightness(1.06) contrast(1.04)' }} alt={`Sub ${idx + 1}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Certified seals row */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-[10px] text-[#5E5E5E] tracking-[0.2em] font-medium uppercase select-none w-full">
              <span>BIS HALLMARKED</span>
              <span className="text-[#B8893C] text-xs">✦</span>
              <span>SGL CERTIFIED</span>
              <span className="text-[#B8893C] text-xs">✦</span>
              <span>GSI CERTIFIED</span>
            </div>

          </div>

          {/* RIGHT COLUMN: Configuration & Buy Section */}
          <div className="space-y-8 text-left lg:pl-4">

            {/* Collection Name & Product Name */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8893C] font-semibold block font-sans">
                {((detailProduct.category || "Exclusive") + " Collection").toUpperCase()}
              </span>
              <h1 className="text-[34px] md:text-[44px] lg:text-[54px] font-semibold text-[#181818] tracking-tight leading-tight font-serif serif-luxury">
                {detailProduct.name}
              </h1>

              {/* Premium Review Badge */}
              <div className="flex items-center gap-2 text-xs font-light text-[#5E5E5E] font-sans">
                <div className="flex items-center text-[#B8893C] gap-0.5">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span className="text-[#181818] font-semibold ml-1">4.8</span>
                <span className="text-[#E7DED2]">|</span>
                <span className="text-[#5E5E5E] hover:text-[#B8893C] transition-colors duration-300 underline decoration-[#E7DED2] underline-offset-4 cursor-pointer">128 client reviews</span>
              </div>
            </div>

            {/* Price Block */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-baseline gap-3.5">
                {/* Current Price */}
                <span className="text-4xl lg:text-[42px] font-light text-[#181818] font-sans tracking-tight">
                  ₹{formatPrice(computedProductPrice)}
                </span>
                {/* Original Price & Badge (Only if discount is active) */}
                {hasDiscount && (
                  <>
                    <span className="text-base text-[#888888] line-through font-light">
                      ₹{formatPrice(originalProductPrice)}
                    </span>
                    <span className="text-[10px] font-semibold text-[#B8893C] tracking-[0.15em] uppercase">
                      {productDiscountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Tax Info */}
              <p className="text-[10px] text-[#888888] tracking-wider font-light uppercase">MRP inclusive of all taxes &amp; delivery insurance</p>

              {/* Today's Metal Rate Notice - Only shown for live dynamic gold/platinum items, hidden for silver & fixed price items */}
              {(detailProduct?.priceCalculationMode === 'dynamic' || (computedPrices?.isLive && detailProduct?.priceCalculationMode !== 'manual')) && 
                !(detailProduct?.category || '').toLowerCase().includes('article') && 
                !isSilver && (
                <div className="bg-[#FAF8F6] border border-solid border-[#E7DED2]/60 rounded-xl p-3.5 space-y-1.5 max-w-sm text-left">
                  <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-[#8A6623]">
                    <span>{activeRateLabel}</span>
                    <span className="text-[#C8A646]">₹{activeRatePerGram.toLocaleString('en-IN')} / g</span>
                  </div>
                  {(publishedAt || lastUpdated) && (
                    <div className="flex justify-between items-center text-[8.5px] text-zinc-400 font-bold uppercase tracking-widest">
                      <span>Last Updated</span>
                      <span>{formatDateSafe(publishedAt || lastUpdated)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* EMI Information */}
              <p className="text-xs text-[#5E5E5E] font-light leading-relaxed">
                No Cost EMI starts at <span className="font-semibold text-[#181818]">₹{formatPrice(Math.round(computedProductPrice / 6))}/month</span> for 6 months · <button onClick={() => { triggerAudio('click'); navigateTo('terms-and-conditions'); }} className="text-[#B8893C] hover:text-[#A8772D] font-medium transition-colors duration-300 hover:underline cursor-pointer bg-transparent border-none">T&amp;C</button>
              </p>
            </div>

            <div className="pt-6 border-t border-[#E7DED2] space-y-6">
              <button
                onClick={() => setPdpCustomizeOpen(!pdpCustomizeOpen)}
                className="w-full flex items-center justify-between text-[10px] font-semibold text-[#181818] tracking-[0.2em] uppercase focus:outline-none cursor-pointer border-none bg-transparent p-0"
              >
                <span>Metal &amp; Size Customization</span>
                <svg
                  className={`w-3 h-3 text-[#B8893C] transform transition-transform duration-300 ${pdpCustomizeOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {pdpCustomizeOpen && (
                <div className="space-y-6 pt-2 font-sans text-xs">
                  {/* Metal Selection */}
                  <div className="space-y-3 text-left">
                    <span className="text-[#888888] font-medium uppercase tracking-[0.15em] text-[9px] block">Select Metal Option:</span>
                    <div className="flex flex-wrap gap-4">
                      {isSilver ? (
                        ['925 Sterling Silver', 'Normal Silver', '999 Silver'].map(metal => {
                          const active = activePurity.toLowerCase().includes(metal.toLowerCase().replace(' sterling', '').replace(' silver', '')) ||
                            (pdpSelectedMetal || '').toLowerCase() === metal.toLowerCase();
                          return (
                            <button
                              key={metal}
                              onClick={() => {
                                triggerAudio('click');
                                setPdpSelectedMetal(metal);
                              }}
                              className={`text-[11px] font-semibold tracking-wider uppercase pb-1 transition-all cursor-pointer border-none bg-transparent border-b ${active ? 'text-[#181818] border-[#181818]' : 'text-[#888888] border-transparent hover:text-[#5E5E5E]'}`}
                            >
                              {metal}
                            </button>
                          );
                        })
                      ) : (
                        ['18KT Yellow Gold', '14KT Yellow Gold', '22KT Yellow Gold', '24KT Yellow Gold', '18KT Rose Gold', '18KT White Gold'].map(metal => {
                          const active = (pdpSelectedMetal || '').toUpperCase().replace(/\s+/g, '') === metal.toUpperCase().replace(/\s+/g, '');
                          return (
                            <button
                              key={metal}
                              onClick={() => {
                                triggerAudio('click');
                                setPdpSelectedMetal(metal);
                              }}
                              className={`text-[11px] font-semibold tracking-wider uppercase pb-1 transition-all cursor-pointer border-none bg-transparent border-b ${active ? 'text-[#181818] border-[#181818]' : 'text-[#888888] border-transparent hover:text-[#5E5E5E]'}`}
                            >
                              {metal}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Dynamic Size Selection Dropdown */}
                  {hasSizes && (
                    <div className="space-y-2 text-left animate-fade-in">
                      <div className="flex justify-between items-center text-[10px] tracking-wider uppercase font-semibold text-[#888888]">
                        <span>Select Size:</span>
                        {isRing && (
                          <button
                            onClick={() => { triggerAudio("click"); setSizeGuideOpen(true); }}
                            className="text-gray-900 hover:text-[#B8893C] font-semibold transition-colors duration-300 underline cursor-pointer text-[10px] uppercase font-sans border-none bg-transparent"
                          >
                            Size Guide
                          </button>
                        )}
                      </div>

                      <div className="relative">
                        <select
                          value={selectedSize}
                          onChange={(e) => {
                            triggerAudio("click");
                            const val = e.target.value;
                            if (isChain) {
                              setSelectedChainSize(val);
                            } else if (isBangle) {
                              setSelectedBangleSize(val);
                            } else {
                              setSelectedRingSize(val);
                            }
                          }}
                          className="w-full bg-white text-[#181818] border border-[#E7DED2] rounded-lg py-3 pl-4 pr-10 text-xs font-semibold focus:outline-none focus:border-gray-800 transition-colors duration-300 appearance-none cursor-pointer font-sans"
                        >
                          {isChain && (
                            (Array.isArray(detailProduct?.chainSizes) && detailProduct.chainSizes.length > 0
                              ? detailProduct.chainSizes
                              : typeof detailProduct?.chainSizes === 'string' && detailProduct.chainSizes.trim()
                              ? detailProduct.chainSizes.split(',').map(s => s.trim()).filter(Boolean)
                              : ['12"', '14"', '16"', '18"', '20"', '22"', '24"', '26"', '28"', '30"', '32"', '34"', '36"']
                            )
                          ).map((sz) => (
                            <option key={sz} value={sz}>{sz} Length</option>
                          ))}

                          {isBangle && (
                            (Array.isArray(detailProduct?.bangleSizes) && detailProduct.bangleSizes.length > 0
                              ? detailProduct.bangleSizes
                              : typeof detailProduct?.bangleSizes === 'string' && detailProduct.bangleSizes.trim()
                              ? detailProduct.bangleSizes.split(',').map(s => s.trim()).filter(Boolean)
                              : ['1-2', '1-4', '1-6', '1-8', '2-0', '2-2', '2-4', '2-6', '2-8', '3-0', '3-2', '3-4']
                            )
                          ).map((sz) => (
                            <option key={sz} value={sz}>{sz} Bangle Size</option>
                          ))}

                          {isRing && (
                            (Array.isArray(detailProduct?.ringSizes) && detailProduct.ringSizes.length > 0
                              ? detailProduct.ringSizes
                              : typeof detailProduct?.ringSizes === 'string' && detailProduct.ringSizes.trim()
                              ? detailProduct.ringSizes.split(',').map(s => s.trim()).filter(Boolean)
                              : Array.from({ length: 34 - 6 + 1 }, (_, i) => {
                                  const num = 6 + i;
                                  return num < 10 ? `0${num}` : `${num}`;
                                })
                            )
                          ).map((sz) => (
                            <option key={sz} value={sz}>{sz} {/^\d+$/.test(sz) ? 'IND' : ''}</option>
                          ))}
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#888888]">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Engraving input */}
                  <div className="space-y-2 pt-2 text-left">
                    <label htmlFor="engraving-input" className="text-[#888888] font-medium uppercase tracking-[0.15em] text-[9px] block">Custom Engraving Text (Max 15 characters):</label>
                    <input
                      id="engraving-input"
                      type="text"
                      maxLength="15"
                      placeholder="e.g. FOREVER / AMOUR"
                      value={customEngraving}
                      onChange={(e) => setCustomEngraving(e.target.value)}
                      className="w-full border-b border-[#E7DED2] py-2.5 text-xs focus:outline-none focus:border-[#181818] text-[#181818] placeholder-[#888888] bg-transparent font-light"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Purchase Actions CTA */}
            <div className="space-y-3 pt-4 border-t border-[#E7DED2] text-left">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Primary: ADD TO BAG */}
                <button
                  onClick={() => {
                    triggerAudio('click');
                    handleAddToCart({
                      ...detailProduct,
                      price: computedProductPrice,
                      carat: `${pdpSelectedMetal || "925 Sterling Silver"}${hasSizes && selectedSize ? ` / Size ${selectedSize}` : ''}`,
                      desc: customEngraving ? `Engraved: "${customEngraving}"` : detailProduct.desc
                    });
                  }}
                  className="w-full sm:w-auto sm:flex-1 h-12 sm:h-14 bg-white hover:bg-[#F8F5EC] text-[#0D2B4E] border border-solid border-[#0D2B4E]/30 hover:border-[#0D2B4E] font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 rounded-full flex items-center justify-center hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-xs shrink-0"
                >
                  ADD TO BAG
                </button>

                {/* Primary: BUY NOW */}
                <button
                  onClick={() => {
                    triggerAudio('click');
                    handleAddToCart({
                      ...detailProduct,
                      price: computedProductPrice,
                      carat: `${pdpSelectedMetal || "925 Sterling Silver"}${hasSizes && selectedSize ? ` / Size ${selectedSize}` : ''}`,
                      desc: customEngraving ? `Engraved: "${customEngraving}"` : detailProduct.desc
                    });
                    setTimeout(() => setCartOpen(true), 200);
                  }}
                  className="w-full sm:w-auto sm:flex-1 h-12 sm:h-14 bg-[#0D2B4E] hover:bg-[#091B2B] text-[#F8F5EC] hover:brightness-110 font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 rounded-full flex items-center justify-center hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md border-none shrink-0"
                >
                  BUY NOW
                </button>
              </div>
            </div>

            {/* Premium Product Details & Specifications Accordion Section */}
            <div className="border-t border-[#E7DED2] pt-8 space-y-4 text-left">
              {/* Description Accordion Tab */}
              <details className="group border-b border-[#E7DED2] pb-4" open>
                <summary className="flex items-center justify-between text-[10px] font-semibold text-[#181818] uppercase tracking-[0.2em] cursor-pointer select-none py-2 list-none">
                  <span>Product Details &amp; Story</span>
                  <svg
                    className="w-3 h-3 text-[#B8893C] transform transition-transform duration-300 group-open:rotate-180"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pt-2 text-xs text-[#5E5E5E] leading-relaxed space-y-3 font-light">
                  {detailProduct.desc && detailProduct.desc.toLowerCase() !== 'test' ? (
                    <p>{detailProduct.desc}</p>
                  ) : !detailProduct.desc ? (
                    <p>A classic Solitaire with a modern twist. Our {detailProduct.name} features a brilliant diamond with unique, grooved detailing on the band. This design combines timeless sparkle with contemporary sophistication, a beautiful symbol of love.</p>
                  ) : null}
                  <p>Jewellery is more than an ornament—it's a symbol of love, celebration, and unforgettable memories. At MANISH &amp; CO, we carefully design and handcraft every piece with passion, precision, and dedication. Whether it's a wedding, festival, or special milestone, our jewellery is created to make every occasion truly memorable.</p>
                </div>
              </details>

              {/* Specifications Accordion Tab */}
              <details className="group border-b border-[#E7DED2] pb-4">
                <summary className="flex items-center justify-between text-[10px] font-semibold text-[#181818] uppercase tracking-[0.2em] cursor-pointer select-none py-2 list-none">
                  <span>Specifications</span>
                  <svg
                    className="w-3 h-3 text-[#B8893C] transform transition-transform duration-300 group-open:rotate-180"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pt-2 text-left">
                  <div className="flex justify-between items-center text-[10px] tracking-wider text-gray-500 uppercase border-b border-gray-200/50 pb-2 mb-4 font-bold">
                    <span>Product Details</span>
                    <span className="font-mono flex items-center gap-1">
                      SKU: {detailProduct.sku || 'HRJS-PD-' + detailProduct.id}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.clipboard.writeText(detailProduct.sku || 'HRJS-PD-' + detailProduct.id);
                          triggerAudio('click');
                          alert('SKU Copied to Clipboard!');
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors ml-1 cursor-pointer focus:outline-none border-none bg-transparent"
                        title="Copy SKU"
                      >
                        <Copy className="w-3 h-3 text-[#C8A646]" />
                      </button>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    {/* Card 1: METAL */}
                    <div className="bg-[#FAF9F6] border border-[#E7DED2]/60 p-5 rounded-2xl space-y-4 shadow-xs relative">
                      <div className="flex items-center justify-between text-xs font-bold text-[#3F1F54] uppercase tracking-wider border-b border-gray-200/50 pb-2.5">
                        <span className="flex items-center gap-2">
                          <Scale className="w-3.5 h-3.5 text-[#C8A646]" />
                          <span>Metal</span>
                        </span>
                      </div>
                      <div className="space-y-3 text-xs text-gray-600 font-light">
                        <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50">
                          <span className="text-gray-400">Purity</span>
                          <span className="font-semibold text-gray-900">{isSilver ? activePurity : (pdpSelectedMetal ? pdpSelectedMetal.split(' ')[0] : (detailProduct.metalPurity || detailProduct.carat || '22KT'))}</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50">
                          <span className="text-gray-400">Color / Finish</span>
                          <span className="font-semibold text-gray-900">{detailProduct.customMetalColor || detailProduct.metalColor || (isSilver ? 'Silver' : 'Yellow Gold')}</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-gray-400">{isSilver ? 'Silver Net Wt' : 'Net Wt'}</span>
                          <span className="font-semibold text-gray-900">{detailProduct.silverWeight ? `${detailProduct.silverWeight}g` : (detailProduct.goldWeight ? `${detailProduct.goldWeight}g` : (detailProduct.netWeight || detailProduct.weight || 'N/A'))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: DIMENSION */}
                    <div className="bg-[#FAF9F6] border border-[#E7DED2]/60 p-5 rounded-2xl space-y-4 shadow-xs relative">
                      <div className="flex items-center justify-between text-xs font-bold text-[#3F1F54] uppercase tracking-wider border-b border-gray-200/50 pb-2.5">
                        <span className="flex items-center gap-2">
                          <Ruler className="w-3.5 h-3.5 text-[#C8A646]" />
                          <span>Dimension</span>
                        </span>
                      </div>
                      <div className="space-y-3 text-xs text-gray-600 font-light text-left">
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-gray-400">Gross Wt</span>
                          <span className="font-semibold text-gray-900">{detailProduct.grossWeight || (detailProduct.silverWeight ? `${detailProduct.silverWeight}g` : (detailProduct.goldWeight ? `${detailProduct.goldWeight}g` : (detailProduct.netWeight || detailProduct.weight || 'N/A')))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: DIAMOND & GEMS */}
                    {(detailProduct.category === 'diamond' || detailProduct.diamondCarat || detailProduct.diamondValue || detailProduct.diamondColor || detailProduct.diamondClarity || detailProduct.diamondShape || detailProduct.diamondQuantity || detailProduct.stoneCarat || detailProduct.beadsCarat || detailProduct.pearlsCarat || detailProduct.gemstoneCarat || detailProduct.polki || detailProduct.polkiValue) && (
                      <div className="bg-[#FAF9F6] border border-[#E7DED2]/60 p-5 rounded-2xl space-y-4 shadow-xs relative">
                        <div className="flex items-center justify-between text-xs font-bold text-[#3F1F54] uppercase tracking-wider border-b border-gray-200/50 pb-2.5">
                          <span className="flex items-center gap-2">
                            <Gem className="w-3.5 h-3.5 text-[#C8A646]" />
                            <span>Diamond &amp; Gems</span>
                          </span>
                        </div>
                        <div className="space-y-3 text-xs text-gray-600 font-light text-left">
                          {(detailProduct.diamondCarat || detailProduct.diamondValue || detailProduct.diamondColor || detailProduct.diamondClarity || detailProduct.diamondShape || detailProduct.diamondQuantity) && (
                            <>
                              <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50">
                                <span className="text-gray-400">Shape</span>
                                <span className="font-semibold text-gray-900">{detailProduct.diamondShape || 'Round'}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50">
                                <span className="text-gray-400">Color</span>
                                <span className="font-semibold text-gray-900">{detailProduct.diamondColor || 'GH'}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50">
                                <span className="text-gray-400">Clarity</span>
                                <span className="font-semibold text-gray-900">{detailProduct.diamondClarity || 'VVS1'}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50">
                                <span className="text-gray-400">Cut</span>
                                <span className="font-semibold text-gray-900">{detailProduct.diamondCut || 'Excellent'}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50">
                                <span className="text-gray-400">Quantity</span>
                                <span className="font-semibold text-gray-900">{detailProduct.diamondQuantity || '1pcs'}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50">
                                {detailProduct.diamondValue ? (
                                  <>
                                    <span className="text-gray-400">Diamond Value</span>
                                    <span className="font-semibold text-gray-900">₹{formatPrice(detailProduct.diamondValue)}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-gray-400">Diamond Carat</span>
                                    <span className="font-semibold text-gray-900">{detailProduct.diamondCarat || detailProduct.diamondWeight || '0.339ct'}</span>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                          {detailProduct.stoneCarat && (
                            <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50 last:border-0">
                              <span className="text-gray-400">Stone weight</span>
                              <span className="font-semibold text-gray-900">{detailProduct.stoneCarat}</span>
                            </div>
                          )}
                          {detailProduct.beadsCarat && (
                            <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50 last:border-0">
                              <span className="text-gray-400">Beads weight</span>
                              <span className="font-semibold text-gray-900">{detailProduct.beadsCarat}</span>
                            </div>
                          )}
                          {detailProduct.pearlsCarat && (
                            <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50 last:border-0">
                              <span className="text-gray-400">Pearls weight</span>
                              <span className="font-semibold text-gray-900">{detailProduct.pearlsCarat}</span>
                            </div>
                          )}
                          {detailProduct.gemstoneCarat && (
                            <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50 last:border-0">
                              <span className="text-gray-400">Gemstone weight</span>
                              <span className="font-semibold text-gray-900">{detailProduct.gemstoneCarat}</span>
                            </div>
                          )}
                          {detailProduct.polki && (
                            <div className="flex justify-between items-center py-0.5 border-b border-gray-100/50 last:border-0">
                              <span className="text-gray-400">Polki weight</span>
                              <span className="font-semibold text-gray-900">{detailProduct.polki}</span>
                            </div>
                          )}
                          {detailProduct.polkiValue && (
                            <div className="flex justify-between items-center py-0.5 last:border-0">
                              <span className="text-gray-400">Polki Value</span>
                              <span className="font-semibold text-gray-900">₹{formatPrice(detailProduct.polkiValue)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E7DED2]/50 flex flex-col gap-4 text-xs text-gray-600 font-light">
                    <div>
                      <span className="text-gray-400 block mb-0.5">Certificates &amp; Hallmark</span>
                      <span className="font-semibold text-gray-900">
                        {Array.isArray(detailProduct.certificates) && detailProduct.certificates.length > 0
                          ? detailProduct.certificates.map(c => {
                              if (c === 'bis_hallmark') return 'BIS Hallmark Certificate';
                              if (c === 'igi_diamond') return 'IGI Diamond Certificate';
                              if (c === 'uncertified') return 'Uncertified / Custom';
                              return c;
                            }).join(', ')
                          : (detailProduct.hallmark || 'BIS Hallmark Certificate')}
                      </span>
                    </div>
                  </div>
                </div>
              </details>

              {/* Shipping & Boutique Delivery Accordion Tab */}
              <details className="group border-b border-[#E7DED2] pb-4">
                <summary className="flex items-center justify-between text-[10px] font-semibold text-[#181818] uppercase tracking-[0.2em] cursor-pointer select-none py-2 list-none">
                  <span>Shipping &amp; Boutique Pick-up</span>
                  <svg
                    className="w-3 h-3 text-[#B8893C] transform transition-transform duration-300 group-open:rotate-180"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pt-2 text-xs text-[#5E5E5E] leading-relaxed font-light">
                  <p>We offer free insured shipping to all pincodes within India. Estimated dispatch: 3-5 business days. You can also opt for physical collection from our showrooms in JNV branch or Tilak Nagar branch.</p>
                </div>
              </details>
            </div>

            {/* Price & Savings Details Section */}
            {(() => {
              if (!computedPrices || !detailProduct) return null;

              const finalPrice = computedPrices.subtotal;
              const discountedGst = computedPrices.gst;
              const productGstRate = (Number(detailProduct.gstPercent) || Number(detailProduct.gstPercentage) || 3) / 100;

              const displayCarat = activePurity;
              const netWeight = parseFloat(detailProduct.silverWeight || detailProduct.goldWeight || detailProduct.netWeight || detailProduct.weight) || 0;

              // Metal Rate per gram
              const metalRatePerGram = activeRatePerGram;
              const metalValue = netWeight > 0 ? (computedPrices.baseMetalValue || computedPrices.metalValue || Math.round(metalRatePerGram * netWeight)) : 0;

              // Separate Diamond, Polki, Stone, Making
              const diamondVal = Number(detailProduct.diamondValue) || 0;
              const polkiVal = Number(detailProduct.polkiValue) || 0;
              const stoneVal = Number(detailProduct.pearlsValue) || Number(detailProduct.stonePrice) || Number(detailProduct.otherCharges) || 0;

              let makingChargesVal = computedPrices.makingCharges !== undefined && computedPrices.makingCharges > 0 
                ? computedPrices.makingCharges 
                : (computedPrices.makingCharge !== undefined ? computedPrices.makingCharge : 0);

              if (!makingChargesVal && (detailProduct.makingChargeValue || detailProduct.makingCharges)) {
                const rawMaking = Number(detailProduct.makingChargeValue || detailProduct.makingCharges || 0);
                if (detailProduct.makingChargeType === 'percentage') {
                  makingChargesVal = Math.round(metalValue * (rawMaking / 100));
                } else if (detailProduct.makingChargeType === 'per_gram' || detailProduct.makingChargeType === 'weight') {
                  const wt = Number(detailProduct.goldWeight || detailProduct.silverWeight || detailProduct.netWeight || detailProduct.weight || 0);
                  makingChargesVal = Math.round(wt * rawMaking);
                } else {
                  makingChargesVal = Math.round(rawMaking);
                }
              }

              const discountOffMaking = Number(detailProduct.discountOffMaking) || 0;
              const discountOffDiamond = Number(detailProduct.discountOffDiamond) || 0;
              const itemDiscountPct = computedPrices.discountPercent !== undefined ? computedPrices.discountPercent : (Number(detailProduct.discountPercent) || 0);
              const itemDiscountAmt = computedPrices.discountAmount !== undefined ? computedPrices.discountAmount : (itemDiscountPct > 0 ? Math.round((metalValue + makingChargesVal + diamondVal + polkiVal + stoneVal) * (itemDiscountPct / 100)) : 0);

              const baseDiamondValue = discountOffDiamond > 0
                ? Math.round(diamondVal / (1 - discountOffDiamond / 100))
                : diamondVal;
              const baseMakingCharges = discountOffMaking > 0
                ? Math.round(makingChargesVal / (1 - discountOffMaking / 100))
                : makingChargesVal;

              const totalDisplay = computedPrices.total !== undefined 
                ? computedPrices.total 
                : (finalPrice + discountedGst);

              const originalSubtotal = metalValue + baseMakingCharges + baseDiamondValue + polkiVal + stoneVal;
              const originalGst = Math.round(originalSubtotal * productGstRate);
              const originalTotal = computedPrices.originalTotal || (originalSubtotal + originalGst);
              const saveAmount = Math.max(0, originalTotal - totalDisplay);
              const taxableAmountDisplay = computedPrices.taxableAmount !== undefined ? computedPrices.taxableAmount : Math.max(0, originalSubtotal - itemDiscountAmt);

              return (
                <div className="pt-6 space-y-4 select-none text-left">
                  <h4 className="text-[10px] font-semibold text-[#181818] uppercase tracking-[0.2em]">
                    Price &amp; Savings Details:
                  </h4>

                  <div className="bg-[#FAF9F6] border border-[#E7DED2]/60 rounded-3xl p-6 space-y-6 shadow-xs">
                    <div className="space-y-4 text-xs font-light text-gray-700">
                      {/* Metal / Item Base Row */}
                      {computedPrices.isLive ? (
                        netWeight > 0 && (
                          <div className="flex justify-between items-center py-1">
                            <span>
                              {displayCarat} {isSilver ? 'Silver' : isPlatinum ? 'Platinum' : 'Gold'}{netWeight > 0 ? ` (${netWeight}g @ ₹${(Number(metalRatePerGram) || 0).toLocaleString('en-IN')}/g)` : ''}
                            </span>
                            <span className="font-semibold font-mono text-gray-900">
                              ₹{(Number(metalValue) || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )
                      ) : (
                        <div className="flex justify-between items-center py-1">
                          <span>
                            {displayCarat || (isSilver ? '925 Sterling Silver' : '22K Gold')} Jewellery Base Price {netWeight > 0 ? `(${netWeight}g)` : ''}
                          </span>
                          <span className="font-semibold font-mono text-gray-900">
                            ₹{(Number(computedPrices.subtotal) || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      {/* Diamond Row */}
                      {diamondVal > 0 && (
                        <div className="flex justify-between items-center py-1">
                          <div className="flex items-center gap-2">
                            <span>
                              Diamond ({detailProduct.diamondQuantity ? `${detailProduct.diamondQuantity} pcs` : '1 pcs'}{detailProduct.diamondCarat || detailProduct.diamondWeight ? `, ${detailProduct.diamondCarat || detailProduct.diamondWeight}ct` : ''})
                            </span>
                            {discountOffDiamond > 0 && (
                              <span className="bg-[#E8F5E9] text-[#006361] text-[9px] font-bold px-1.5 py-0.5 rounded font-sans">
                                {discountOffDiamond}% OFF
                              </span>
                            )}
                          </div>
                          <div className="space-x-2 font-mono">
                            {discountOffDiamond > 0 && (
                              <span className="text-gray-400 line-through">
                                ₹{(Number(baseDiamondValue) || 0).toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="font-semibold text-gray-900">
                              ₹{(Number(diamondVal) || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Polki Row */}
                      {polkiVal > 0 && (
                        <div className="flex justify-between items-center py-1">
                          <div className="flex items-center gap-2">
                            <span>
                              Polki {detailProduct.polki ? `(${detailProduct.polki}g)` : ''}
                            </span>
                          </div>
                          <div className="font-mono font-semibold text-gray-900">
                            ₹{(Number(polkiVal) || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      )}

                      {/* Gemstones / Pearls / Other Stones Row */}
                      {stoneVal > 0 && (
                        <div className="flex justify-between items-center py-1">
                          <span>
                            Gemstones / Pearls {detailProduct.gemstoneCarat || detailProduct.stoneCarat ? `(${detailProduct.gemstoneCarat || detailProduct.stoneCarat}ct)` : ''}
                          </span>
                          <span className="font-mono font-semibold text-gray-900">
                            ₹{(Number(stoneVal) || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      {/* Making Charges Row */}
                      {makingChargesVal > 0 && (
                        <div className="flex justify-between items-center py-1">
                          <div className="flex items-center gap-2">
                            <span>Making Charges</span>
                            {discountOffMaking > 0 && (
                              <span className="bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold px-1.5 py-0.5 rounded font-sans">
                                {discountOffMaking}% OFF
                              </span>
                            )}
                          </div>
                          <div className="space-x-2 font-mono">
                            {discountOffMaking > 0 && (
                              <span className="text-gray-400 line-through">
                                ₹{(Number(baseMakingCharges) || 0).toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="font-semibold text-gray-900">
                              ₹{(Number(makingChargesVal) || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Taxable Amount Row */}
                      <div className="flex justify-between items-center py-1 text-gray-600">
                        <span>Taxable Amount</span>
                        <span className="font-semibold font-mono text-gray-800">
                          ₹{(Number(taxableAmountDisplay) || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Item Discount Row */}
                      {itemDiscountAmt > 0 && (
                        <div className="flex justify-between items-center py-1 text-[#006361]">
                          <span className="flex items-center gap-1.5">
                            <span>Discount</span>
                            <span className="bg-[#E8F5E9] text-[#006361] text-[9px] font-bold px-1.5 py-0.5 rounded font-sans">
                              {itemDiscountPct}% OFF
                            </span>
                          </span>
                          <span className="font-semibold font-mono text-[#006361]">
                            -₹{(Number(itemDiscountAmt) || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      {/* GST Row */}
                      <div className="flex justify-between items-center py-1">
                        <span>GST ({Math.round(productGstRate * 100)}%)</span>
                        <span className="font-semibold font-mono text-gray-900">
                          ₹{(Number(discountedGst) || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <hr className="border-gray-200/60 my-2" />

                      {/* Total Row */}
                      <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                        <span>Final Price (incl. GST)</span>
                        <span className="font-mono text-base font-bold">
                          ₹{(Number(totalDisplay) || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* You Save Row */}
                      {saveAmount > 0 && (
                        <div className="flex justify-between items-center py-1 text-[11px] text-[#006361] font-semibold">
                          <span>🎉 You Save</span>
                          <span className="font-mono">₹{(Number(saveAmount) || 0).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Green Banner */}
                  {saveAmount > 0 && (
                    <div className="bg-[#EEF7F2] border border-[#A3D9C9] rounded-xl px-5 py-4 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#006361] uppercase tracking-wider">
                        Save on this jewellery
                      </span>
                      <span className="font-mono font-black text-sm text-[#006361] font-bold">
                        ₹{saveAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {/* Similar Collection Section */}
                  {(() => {
                    const similarProducts = products
                      .filter(p => p.id !== detailProduct.id && p.category === detailProduct.category)
                      .slice(0, 8);

                    const fallbackSimilar = similarProducts.length > 0
                      ? similarProducts
                      : products.filter(p => p.id !== detailProduct.id).slice(0, 8);

                    if (fallbackSimilar.length === 0) return null;

                    return (
                      <div className="pt-6 space-y-3 border-t border-[#E7DED2]/60 mt-6 text-left">
                        <h4 className="text-[10px] font-semibold text-[#181818] uppercase tracking-[0.2em]">
                          Similar Collection:
                        </h4>
                        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-[#E7DED2] scrollbar-track-transparent snap-x">
                          {fallbackSimilar.map((item) => {
                            const finalItemPrice = calculatePrice(item).total;
                            const itemDiscount = Number(item.discountPercent) || 0;
                            const itemHasDiscount = itemDiscount > 0;
                            const itemOriginalPrice = itemHasDiscount ? (calculatePrice(item).originalTotal || Math.round(finalItemPrice / (1 - itemDiscount / 100))) : finalItemPrice;

                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  triggerAudio('click');
                                  setDetailProduct(item);
                                  setDetailActiveImg(item.img);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group cursor-pointer bg-white border border-[#E7DED2]/40 rounded-xl p-2 hover:shadow-sm hover:border-[#B8893C]/40 transition-all duration-300 flex flex-col justify-between w-28 sm:w-32 shrink-0 select-none snap-start"
                              >
                                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-1.5 relative flex items-center justify-center">
                                  <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-11/12 h-11/12 object-contain group-hover:scale-105 transition-transform duration-350"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <h5 className="text-[9px] font-semibold text-gray-800 line-clamp-1 group-hover:text-[#B8893C] transition-colors leading-tight">
                                    {item.name}
                                  </h5>
                                  <div className="flex flex-wrap items-baseline gap-0.5">
                                    <span className="text-[9px] font-bold text-gray-900 font-mono">
                                      ₹{Math.round(finalItemPrice).toLocaleString('en-IN')}
                                    </span>
                                    {itemHasDiscount && (
                                      <span className="text-[7.5px] text-[#4CAF50] font-bold whitespace-nowrap font-sans">
                                        {itemDiscount}% OFF
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}
          </div>

        </div>

        {/* Horizontal Scrolling Text Ticker */}
        <div className="bg-[#F7F3EE] border-t border-b border-[#E7DED2] py-4 overflow-hidden select-none my-12" style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
          <div className="animate-marquee flex whitespace-nowrap">
            <div className="flex items-center gap-8 px-4 text-[9px] tracking-[0.25em] uppercase font-bold text-[#5E5E5E] shrink-0">
              <span>Bespoke Jewellery, Handcrafted For You</span>
              <span className="text-[#B8893C]">✦</span>
              <span>Free Fully Insured Express Shipping</span>
              <span className="text-[#B8893C]">✦</span>
              <span>100% Certified Diamonds &amp; Hallmarked Gold</span>
              <span className="text-[#B8893C]">✦</span>
              <span>Virtual Concierge &amp; Live Video Consultation</span>
              <span className="text-[#B8893C]">✦</span>
              <span>Bespoke Jewellery, Handcrafted For You</span>
              <span className="text-[#B8893C]">✦</span>
              <span>Free Fully Insured Express Shipping</span>
              <span className="text-[#B8893C]">✦</span>
              <span>100% Certified Diamonds &amp; Hallmarked Gold</span>
              <span className="text-[#B8893C]">✦</span>
              <span>Virtual Concierge &amp; Live Video Consultation</span>
              <span className="text-[#B8893C]">✦</span>
            </div>
            <div className="flex items-center gap-8 px-4 text-[9px] tracking-[0.25em] uppercase font-bold text-[#5E5E5E] shrink-0">
              <span>Bespoke Jewellery, Handcrafted For You</span>
              <span className="text-[#B8893C]">✦</span>
              <span>Free Fully Insured Express Shipping</span>
              <span className="text-[#B8893C]">✦</span>
              <span>100% Certified Diamonds &amp; Hallmarked Gold</span>
              <span className="text-[#B8893C]">✦</span>
              <span>Virtual Concierge &amp; Live Video Consultation</span>
              <span className="text-[#B8893C]">✦</span>
              <span>Bespoke Jewellery, Handcrafted For You</span>
              <span className="text-[#B8893C]">✦</span>
              <span>Free Fully Insured Express Shipping</span>
              <span className="text-[#B8893C]">✦</span>
              <span>100% Certified Diamonds &amp; Hallmarked Gold</span>
              <span className="text-[#B8893C]">✦</span>
              <span>Virtual Concierge &amp; Live Video Consultation</span>
              <span className="text-[#B8893C]">✦</span>
            </div>
          </div>
        </div>

        {/* STORY BEHIND THE PRODUCT */}
        <div className="bg-[#F7F3EE] py-12 select-none" style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center gap-12 md:gap-20">

            {/* LEFT: Text Content */}
            <div className="flex-1 min-w-0 text-left space-y-6">
              <h2 className="text-3xl font-light text-[#181818] tracking-wide font-serif serif-luxury">
                Story Behind The Product
              </h2>
              <div className="space-y-5 text-[#5E5E5E] text-xs sm:text-sm font-light leading-relaxed max-w-xl">
                {detailProduct.desc && detailProduct.desc.toLowerCase() !== 'test' ? (
                  <p className="text-sm text-[#5E5E5E] leading-relaxed font-sans">
                    {detailProduct.desc}
                  </p>
                ) : !detailProduct.desc ? (
                  <p className="text-sm text-[#5E5E5E] leading-relaxed font-sans">
                    A classic Solitaire with a modern twist. Our {detailProduct.name} features a brilliant diamond with unique, grooved detailing on the band. This design combines timeless sparkle with contemporary sophistication, a beautiful symbol of love.
                  </p>
                ) : null}
                <p className="text-sm text-[#5E5E5E] leading-relaxed font-sans">
                  Jewellery is more than an ornament—it's a symbol of love, celebration, and unforgettable memories. At MANISH &amp; CO, we carefully design and handcraft every piece with passion, precision, and dedication. Whether it's a wedding, festival, or special milestone, our jewellery is created to make every occasion truly memorable.
                </p>
              </div>
            </div>

            {/* RIGHT: Image */}
            <div className="w-full md:w-[480px] shrink-0 bg-[#F3EEE7] overflow-hidden text-center">
              <img
                src={jewelrySketchDesk}
                alt="Story Behind The Product"
                className="w-full h-[280px] md:h-[320px] object-cover rounded-none"
              />
            </div>

          </div>
        </div>
        {/* ── END STORY BEHIND THE PRODUCT ── */}

        {/* ==========================================================
          FEATURE: PREMIUM OUR PROCESS SECTION
          ========================================================== */}
        <section
          onMouseEnter={() => setProcessPaused(true)}
          onMouseLeave={() => setProcessPaused(false)}
          className="bg-[#FCFAF7] py-20 px-6 sm:px-12 select-none border-b border-[#E7DED2] overflow-hidden text-left"
        >
          <div className="max-w-[1836px] mx-auto relative px-4 text-left">

            {/* Heading */}
            <div className="text-center md:text-left mb-12 space-y-4">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#B8893C] font-semibold font-sans block">
                Craftsmanship Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-[#181818] tracking-wide font-serif serif-luxury">
                Our Process
              </h2>
            </div>

            {/* Horizontal Timeline Navigation on Top */}
            <div className="flex items-center justify-between max-w-5xl mx-auto mb-16 relative px-4 select-none">
              {/* Connecting progress line */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[20px] right-[20px] h-[1px] bg-[#E7DED2] z-0">
                <div
                  className="h-full bg-[#B8893C] transition-all duration-500 ease-out origin-left"
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
                    {/* Dot/Number */}
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-sans text-xs transition-all duration-300 ${isActive
                        ? 'bg-[#B8893C] border-[#B8893C] text-white scale-110'
                        : 'bg-white border-[#E7DED2] text-[#888888] hover:border-[#B8893C] hover:text-[#B8893C]'
                      }`}>
                      {step.num}
                    </div>
                    {/* Hover Step Label */}
                    <span className={`absolute top-12 text-[9px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300 hidden md:block ${isActive ? 'text-[#B8893C] opacity-100 translate-y-0' : 'text-[#888888] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
                      }`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Showcase Card */}
            <div className="w-full bg-transparent flex flex-col lg:flex-row relative gap-8 lg:gap-16 pt-8 pb-12">
              {/* Left: Image with custom transition and zoom */}
              <div className="w-full lg:w-[55%] relative aspect-[16/10] lg:aspect-auto lg:h-[500px] overflow-hidden bg-[#F3EEE7] shrink-0 text-center rounded-2xl shadow-sm">
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
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/10 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Right: Text details */}
              <div className="w-full lg:w-[45%] flex flex-col justify-center text-left space-y-6 relative bg-transparent overflow-hidden py-4">

                <div className="relative z-10 space-y-3">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#B8893C] font-semibold font-sans">
                    Step {processStepsData[activeProcessStep].num} of 06
                  </span>
                  <h3
                    key={`title-${activeProcessStep}`}
                    className="text-3xl sm:text-4xl font-light text-[#181818] tracking-wide font-serif serif-luxury animate-fadeSlideIn"
                  >
                    {processStepsData[activeProcessStep].title}
                  </h3>
                  <div className="w-12 h-[1px] bg-[#B8893C]" />
                </div>

                <p
                  key={`desc-${activeProcessStep}`}
                  className="text-[#5E5E5E] text-xs sm:text-sm leading-relaxed font-sans font-light relative z-10 max-w-lg animate-fadeSlideIn [animation-delay:150ms]"
                >
                  {processStepsData[activeProcessStep].desc}
                </p>

                {/* Navigation arrows */}
                <div className="flex items-center space-x-4 pt-4 relative z-10">
                  <button
                    onClick={() => {
                      triggerAudio('click');
                      setActiveProcessStep((prev) => (prev - 1 + 6) % 6);
                    }}
                    className="w-10 h-10 rounded-full border border-[#E7DED2] flex items-center justify-center text-[#888888] hover:border-[#181818] hover:text-[#181818] transition-all duration-300 cursor-pointer bg-transparent"
                    aria-label="Previous step"
                  >
                    <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      triggerAudio('click');
                      setActiveProcessStep((prev) => (prev + 1) % 6);
                    }}
                    className="w-10 h-10 rounded-full border border-[#E7DED2] flex items-center justify-center text-[#888888] hover:border-[#181818] hover:text-[#181818] transition-all duration-300 cursor-pointer bg-transparent"
                    aria-label="Next step"
                  >
                    <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── POLAROID CUSTOMER TESTIMONIALS ── */}
        <section className="py-20 select-none bg-[#FCFAF7] border-b border-[#E7DED2]">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-3 mb-12">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#B8893C] font-semibold font-sans block">
              OUR CUSTOMERS' STORIES
            </span>
            <h2 className="serif-luxury text-3xl sm:text-4xl font-light text-[#181818] tracking-wide text-center">
              More Than Just Jewellery
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5E5E5E] font-light max-w-2xl mx-auto leading-relaxed text-center">
              Every piece tells a story. Every memory shines forever.
            </p>
          </div>

          {/* Testimonials Grid Container */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Aarohi Sharma, 27",
                  quote: "My dream engagement ring became a reality with MANISH & CO. The craftsmanship and sparkle are beyond expectations.",
                  img: testimonial1
                },
                {
                  name: "Priya Mehta, 31",
                  quote: "The quality, finishing, and personalized service made my purchase truly memorable. A perfect luxury experience.",
                  img: testimonial2
                },
                {
                  name: "Neha Kapoor, 29",
                  quote: "I wear my bracelet every day and it still looks stunning. Timeless craftsmanship and exceptional quality.",
                  img: testimonial3
                },
                {
                  name: "Riya Verma, 26",
                  quote: "My husband gifted me this beautiful necklace and I receive compliments everywhere. Absolutely love it.",
                  img: testimonial4
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col items-center text-center space-y-4"
                >
                  {/* Image Frame */}
                  <div className="w-full aspect-[4/5] overflow-hidden bg-[#F3EEE7] text-center">
                    <img
                      src={item.img}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  </div>
                  {/* Quote */}
                  <p className="font-serif text-sm italic leading-relaxed text-[#181818] max-w-[260px] font-light">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  {/* Name */}
                  <span className="block text-[10px] tracking-[0.2em] uppercase font-sans text-[#888888] font-medium">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Explore Collection Button */}
          <div className="flex justify-center pt-8">
            <button
              onClick={() => { triggerAudio('click'); navigateTo('collections'); }}
              className="px-8 py-3.5 border border-[#181818] text-[#181818] bg-transparent hover:bg-[#F7F3EE] hover:text-[#181818] transition-all duration-300 rounded-none text-xs font-semibold tracking-[0.2em] uppercase cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        </section>
        {/* ── END POLAROID TESTIMONIALS ── */}

        {/* ── CUSTOMER REVIEWS ── */}
        <section className="bg-white py-16 px-4 select-none border-b border-[#E7DED2] text-left">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7DED2] pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8893C] font-semibold font-sans block mb-2">
                  Client Appraisals
                </span>
                <h2 className="text-3xl font-light text-[#181818] tracking-wide font-serif serif-luxury">
                  Customer Reviews
                </h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-left font-sans">
                  <div className="flex items-center gap-1.5 text-[#B8893C] text-lg font-semibold">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    <span className="text-[#181818] font-semibold ml-1">4.8</span>
                  </div>
                  <p className="text-[10px] text-[#888888] font-light uppercase mt-0.5 tracking-wider">Based on 128 appraisals</p>
                </div>
              </div>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 pt-6 text-left">
              {[
                {
                  name: "Ananya Iyer",
                  date: "June 20, 2026",
                  rating: 5,
                  title: "An Absolute Masterpiece",
                  comment: "The precision and level of detail is simply breathtaking. The diamonds are brilliant and reflect light beautifully. Exceeded my high expectations in every way.",
                  verified: true
                },
                {
                  name: "Vikram Malhotra",
                  date: "May 14, 2026",
                  rating: 5,
                  title: "World Class Craftsmanship",
                  comment: "Bought this for my wife on our anniversary. The design looks elegant and extremely premium. The packaging box with MANISH & CO branding is a work of art itself.",
                  verified: true
                },
                {
                  name: "Shreya Ghoshal",
                  date: "April 08, 2026",
                  rating: 5,
                  title: "Perfect Fitting & Luxury Feeling",
                  comment: "The size fits perfectly. Custom engraving is neat and readable. Live video consultation helped me choose the right metal variant. Highly recommended scheme!",
                  verified: true
                },
                {
                  name: "Kabir Sen",
                  date: "March 29, 2026",
                  rating: 4,
                  title: "Highly Satisfied with Purchase",
                  comment: "A solid weight and sturdy build. The stones are set perfectly. Delivery took 4 days to Bangalore but it was fully insured. Splendid customer support.",
                  verified: true
                }
              ].map((rev, idx) => (
                <div key={idx} className="flex flex-col space-y-4 text-left border-b border-[#E7DED2]/50 pb-8 last:border-b-0">
                  <div className="flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      {/* Initials Monogram */}
                      <div className="w-9 h-9 rounded-full bg-[#F7F3EE] flex items-center justify-center text-[10px] font-semibold text-[#5E5E5E] tracking-wider uppercase">
                        {rev.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#181818] text-xs tracking-wider uppercase font-sans">{rev.name}</h4>
                        <p className="text-[9px] text-[#888888] font-light tracking-widest uppercase mt-0.5">{rev.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-[#B8893C] gap-0.5 text-[10px] font-semibold">
                      {"★".repeat(rev.rating)}
                      {rev.rating < 5 && <span className="text-[#E7DED2]">{"★".repeat(5 - rev.rating)}</span>}
                    </div>
                  </div>

                  <div className="space-y-2 pl-1 text-left">
                    {rev.verified && (
                      <span className="text-[#B8893C] text-[9px] tracking-widest uppercase font-semibold block">
                        ✓ Verified Appraisal
                      </span>
                    )}
                    <h5 className="font-serif text-sm font-semibold text-[#181818] tracking-wide">{rev.title}</h5>
                    <p className="text-[#5E5E5E] text-xs sm:text-xs leading-relaxed font-sans font-light">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* RESPONSIVE MOBILE STICKY BUY BAR */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#E7DED2] p-4 z-40 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.02)] select-none">
        <div className="flex items-center space-x-3">
          <img src={detailProduct.img} className="w-10 h-10 object-cover rounded-none border border-[#E7DED2] bg-[#F7F3EE]" alt="" />
          <div className="text-left">
            <h4 className="font-sans text-[11px] font-medium text-[#181818] truncate max-w-[110px] tracking-tight">{detailProduct.name}</h4>
            <span className="text-[#181818] font-semibold text-[12px] block mt-0.5 font-sans">₹{formatPrice(computedProductPrice)}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-1 justify-end ml-4">
          <button
            onClick={() => {
              handleAddToCart({
                ...detailProduct,
                price: computedProductPrice,
                carat: `${pdpSelectedMetal || "925 Sterling Silver"}${hasSizes && selectedSize ? ` / Size ${selectedSize}` : ''}`,
                desc: customEngraving ? `Engraved: "${customEngraving}"` : detailProduct.desc
              });
              setTimeout(() => setCartOpen(true), 200);
            }}
            className="flex-1 max-w-[140px] py-2.5 bg-[#0D2B4E] text-[#F8F5EC] hover:bg-[#091B2B] font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all duration-250 text-center font-sans active:scale-95 cursor-pointer shadow-sm border-none"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* DESKTOP STICKY TOP BUY BAR */}
      {showStickyBuyBar && (
        <div className="fixed top-0 left-0 right-0 hidden lg:flex bg-white/95 backdrop-blur-md border-b border-[#E7DED2] py-3.5 px-6 z-[100] shadow-[0_4px_25px_rgba(0,0,0,0.03)] select-none items-center justify-between">
          <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between">
            {/* Left: Thumbnail & Name & Price */}
            <div className="flex items-center space-x-4">
              <img src={detailProduct.img} className="w-12 h-12 object-contain rounded-none border border-[#E7DED2] bg-white mix-blend-multiply" style={{ filter: 'brightness(1.06) contrast(1.04)' }} alt="" />
              <div className="text-left">
                <h4 className="font-sans text-xs font-semibold text-[#181818] tracking-tight">{detailProduct.name}</h4>
                <div className="flex items-center gap-2.5 mt-0.5 font-sans">
                  <span className="text-[#181818] font-bold text-sm">₹{formatPrice(computedProductPrice)}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-xs text-[#888888] line-through font-light">₹{formatPrice(originalProductPrice)}</span>
                      <span className="text-[10px] text-[#B8893C] font-semibold">{productDiscountPercent}% OFF</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Buy Now button */}
              <button
                onClick={() => {
                  triggerAudio('click');
                  handleAddToCart({
                    ...detailProduct,
                    price: computedProductPrice,
                    carat: `${pdpSelectedMetal || "925 Sterling Silver"}${hasSizes && selectedSize ? ` / Size ${selectedSize}` : ''}`,
                    desc: customEngraving ? `Engraved: "${customEngraving}"` : detailProduct.desc
                  });
                  setTimeout(() => setCartOpen(true), 200);
                }}
                className="h-10 px-8 bg-[#0D2B4E] hover:bg-[#091B2B] text-[#F8F5EC] font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 rounded-full flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm border-none shrink-0"
              >
                BUY NOW
              </button>

              {/* Home icon button */}
              <button
                onClick={() => { triggerAudio('click'); navigateTo('home'); }}
                className="w-10 h-10 border border-[#E7DED2] text-[#181818] hover:border-[#181818] hover:bg-[#F7F3EE] transition-all duration-300 rounded-md flex items-center justify-center cursor-pointer bg-transparent shrink-0"
                title="Back to Home"
              >
                <svg className="w-4 h-4 text-[#181818]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>

              {/* Store locator / Boutique advisor button */}
              <button
                onClick={() => { triggerAudio('click'); navigateTo('showrooms'); }}
                className="w-10 h-10 border border-[#E7DED2] text-[#181818] hover:border-[#181818] hover:bg-[#F7F3EE] transition-all duration-300 rounded-md flex items-center justify-center cursor-pointer bg-transparent shrink-0"
                title="Our Boutique Showrooms"
              >
                <svg className="w-4 h-4 text-[#181818]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
