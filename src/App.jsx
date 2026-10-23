import React, { useState, useEffect } from 'react';
import AppProviders from './contexts/AppProviders';

import { useAuth } from './hooks/useAuth';
import { useRates } from './hooks/useRates';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';

import ErrorBoundary from './ErrorBoundary';
import MainLayout from './layouts/MainLayout';
import Loader from './components/Loader';

// Robust dynamic import with automatic single-retry/auto-refresh on stale deployment chunk errors
const lazyWithRetry = (importFn, name = 'Component') =>
  React.lazy(async () => {
    const isRetry = sessionStorage.getItem(`hrj_chunk_retry_${name}`);
    try {
      const module = await importFn();
      sessionStorage.removeItem(`hrj_chunk_retry_${name}`);
      return module;
    } catch (error) {
      console.warn(`Dynamic chunk import failed for ${name}:`, error);
      const isChunkError =
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('Importing a module script failed') ||
        error?.name === 'ChunkLoadError' ||
        String(error).includes('dynamically imported module');

      if (isChunkError && !isRetry) {
        sessionStorage.setItem(`hrj_chunk_retry_${name}`, '1');
        // Auto-refresh the window to fetch the latest deployed manifest
        window.location.reload();
        return new Promise(() => {}); // prevent further error execution while page reloads
      }
      throw error;
    }
  });

const Admin = lazyWithRetry(() => import('./Admin'), 'Admin');

// Web Audio API dynamic Sound Synth
class LuxurySynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  playClick() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // Elegant B5 chime note
      osc.frequency.exponentialRampToValueAtTime(1318.51, this.ctx.currentTime + 0.08); // slides to E6

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // Audio context error ignored safely
    }
  }
  playShimmer() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.006, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      gain.connect(this.ctx.destination);

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major luxury arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        osc.connect(gain);
        osc.start(now + idx * 0.06);
        osc.stop(now + 0.8);
      });
    } catch {
      // Audio context error ignored safely
    }
  }
}

import Home from './pages/Home';
const Collections = lazyWithRetry(() => import('./pages/Collections'), 'Collections');
const ProductDetail = lazyWithRetry(() => import('./pages/ProductDetail'), 'ProductDetail');

// Preload primary routes in background during idle time for instantaneous switching
if (typeof window !== 'undefined') {
  const prefetchCorePages = () => {
    import('./pages/Collections');
    import('./pages/ProductDetail');
    import('./pages/Checkout');
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prefetchCorePages, { timeout: 2500 });
  } else {
    setTimeout(prefetchCorePages, 1200);
  }
}
const Offers = lazyWithRetry(() => import('./pages/Offers'), 'Offers');
const GoldCoins = lazyWithRetry(() => import('./pages/GoldCoins'), 'GoldCoins');
const Heritage = lazyWithRetry(() => import('./pages/Heritage'), 'Heritage');
const Valuation = lazyWithRetry(() => import('./pages/Valuation'), 'Valuation');
const Checkout = lazyWithRetry(() => import('./pages/Checkout'), 'Checkout');
const Showrooms = lazyWithRetry(() => import('./pages/Showrooms'), 'Showrooms');
const TermsAndConditions = lazyWithRetry(() => import('./pages/TermsAndConditions'), 'TermsAndConditions');
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy'), 'PrivacyPolicy');
const AboutUs = lazyWithRetry(() => import('./pages/AboutUs'), 'AboutUs');

import { StorageService } from './services/StorageService';

function AppContent() {
  const getInitialPage = () => {
    try {
      if (typeof window === 'undefined') return 'home';
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get('page');
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      const targetPage = pageParam || path;
      const validPages = [
        'admin', 'offers', 'gold-coins', 'heritage', 
        'valuation', 'collections', 'showrooms', 'terms-and-conditions', 
        'privacy-policy', 'product-detail', 'checkout', 'about-us'
      ];
      if (validPages.includes(targetPage)) {
        return targetPage;
      }
    } catch (e) {
      console.warn("Routing initialization failed:", e);
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [soundEnabled, setSoundEnabled] = useState(() => StorageService.get('hrj_sound_enabled', true));

  // Catalog page states & filters
  const [activeCategoryTab, setActiveCategoryTab] = useState('Collections');
  const [metalFilter, setMetalFilter] = useState('all');
  const [purityFilter, setPurityFilter] = useState('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState(10000000);
  const [coinPurityTab, setCoinPurityTab] = useState('24K');
  const [coinWeightFilter, setCoinWeightFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { products, loading: productsLoading } = useProducts();
  const { rates, loading: ratesLoading } = useRates();
  const { currentUser, loginAnonymously, loading: authLoading } = useAuth();
  const { wishlistItems, setWishlistOpen } = useWishlist();
  const { cartItems, setCartOpen } = useCart();

  const [detailProduct, setDetailProduct] = useState(null);

  // LuxurySynth instance — singleton for this component lifecycle
  const synth = React.useRef(new LuxurySynth()).current;

  // Sound triggering helper — uses Web Audio API synth, no file imports needed
  const triggerAudio = (type) => {
    if (!soundEnabled) return;
    try {
      if (type === 'shimmer') {
        synth.playShimmer();
      } else {
        synth.playClick();
      }
    } catch (e) {
      // Audio context errors are non-fatal, silently ignored
    }
  };

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    StorageService.set('hrj_sound_enabled', nextVal);
  };

  // Browser Routing coordinates
  const navigateTo = (page) => {
    triggerAudio('click');
    const safePage = ['savings', 'gold-reserve', 'savings-enroll'].includes(page) ? 'collections' : page;
    setCurrentPage(safePage);
    window.history.pushState(null, '', safePage === 'home' ? '/' : `/${safePage}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPDP = (prod) => {
    setDetailProduct(prod);
    navigateTo('product-detail');
  };

  // Check popstate updates
  useEffect(() => {
    const handlePopState = () => {
      try {
        const path = window.location.pathname.replace(/^\/|\/$/g, '');
        const validPages = [
          'admin', 'offers', 'gold-coins', 'heritage', 
          'valuation', 'collections', 'showrooms', 'terms-and-conditions', 
          'privacy-policy', 'product-detail', 'checkout', 'about-us'
        ];
        if (validPages.includes(path)) {
          setCurrentPage(path);
          return;
        }
      } catch (e) {
        console.warn("Popstate sync failed:", e);
      }
      setCurrentPage('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // One time anonymous login for visitors
  useEffect(() => {
    if (!currentUser) {
      loginAnonymously();
    }
  }, [currentUser]);

  // Initial luxury splash screen display timer (smooth first-load splash, never hangs)
  const [initialSplash, setInitialSplash] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const path = window.location.pathname.replace(/^\/|\/$/g, '');
        if (urlParams.get('page') === 'admin' || path === 'admin') return false;
        return !sessionStorage.getItem('mco_splash_shown');
      }
    } catch {
      // ignore
    }
    return false;
  });

  useEffect(() => {
    if (!initialSplash) return;
    const timer = setTimeout(() => {
      setInitialSplash(false);
      try { sessionStorage.setItem('mco_splash_shown', '1'); } catch {}
    }, 850);
    return () => clearTimeout(timer);
  }, [initialSplash]);

  // Sync title and SEO meta descriptions tags dynamically
  useEffect(() => {
    let title = 'MANISH & CO — Fine Silver Jewellery | 925 Hallmarked';
    let desc = 'Luxury handcrafted 925 sterling silver, certified solitaires, royal heirlooms, and bespoke fine jewellery by MANISH & CO. Timeless, Elegant, Modern, Authentic.';
    
    switch (currentPage) {
      case 'collections':
        title = 'Fine Silver & Gold Collections — MANISH & CO';
        desc = 'Browse our modern interactive catalog of certified 925 sterling silver, solitaires, royal neckwear, and precious adornments.';
        break;
      case 'heritage':
        title = 'Our Heritage & Royal Atelier — MANISH & CO';
        desc = 'Discover the legacy and certified royal lineage of our master silversmiths and artisans crafting fine silver jewellery since 1996.';
        break;
      case 'valuation':
        title = 'Live Daily Silver & Gold Bullion Rates — MANISH & CO';
        desc = 'Calculate fine silver and gold jewelry rates instantly according to active Indian bullion indexes and 925 hallmark metrics.';
        break;
      case 'showrooms':
        title = 'Flagship Fitting Showroom — MANISH & CO';
        desc = 'Visit our luxury flagship salon. Register appointments for bespoke custom fittings and bridal jewellery design.';
        break;
      case 'product-detail':
        title = `${detailProduct?.name || 'Exclusive Ornaments'} — MANISH & CO Fine Jewellery`;
        desc = `Details, 925 sterling silver purity specs, dynamic pricing breakdown, EMI calculator and insured doorstep delivery.`;
        break;
      case 'gold-coins':
        title = 'Invest in Pure Silver & Gold Coins — MANISH & CO';
        desc = 'Discover certified 999 pure silver and 24K gold bullion coins crafted for gifting, investment, and auspicious occasions.';
        break;
      case 'offers':
        title = `Exclusive Offers & Boutiques — MANISH & CO`;
        desc = `Explore exclusive celebratory discounts, certified gemstone offers, and check delivery pincodes.`;
        break;
      case 'checkout':
        title = `Secure Checkout — MANISH & CO`;
        desc = `Complete your order securely with MANISH & CO. Choose express insured delivery or boutique pick-up.`;
        break;
      case 'about-us':
        title = `About Us — MANISH & CO Fine Silver Jewellery`;
        desc = `The story of MANISH & CO. Timeless, Elegant, Modern, Authentic fine silver treasures since 1996.`;
        break;
    }
    
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', desc);
  }, [currentPage, detailProduct]);

  // Luxury Splash Screen only on initial entrance, never blocks admin or gets stuck
  if (initialSplash && currentPage !== 'admin') {
    return <Loader onDismiss={() => setInitialSplash(false)} />;
  }

  // Render Admin View directly (Admin handles its own internal layout wraps)
  if (currentPage === 'admin') {
    return (
      <ErrorBoundary>
        <React.Suspense fallback={<Loader />}>
          <Admin />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <MainLayout
        currentPage={currentPage}
        navigateTo={navigateTo}
        changeCategoryTab={(tab, optMetal, optGender) => {
          setActiveCategoryTab(tab);
          if (optMetal !== undefined) {
            setMetalFilter(optMetal);
          }
          if (optGender !== undefined) {
            setGenderFilter(optGender);
          }
        }}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        triggerAudio={triggerAudio}
        setCoinPurityTab={setCoinPurityTab}
        setCoinWeightFilter={setCoinWeightFilter}
        setMetalFilter={setMetalFilter}
        setMaxPriceFilter={setMaxPriceFilter}
        navigateToPDP={navigateToPDP}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
        {/* Suspense Wrapper for Page Components Lazy Loading */}
        <React.Suspense fallback={
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3.5 select-none animate-fade-in">
            <div className="w-9 h-9 border-2 border-[#6B4B2E] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-serif text-[11px] font-bold uppercase tracking-[0.25em] text-[#0D2B4E] animate-pulse">
              MANISH &amp; CO
            </span>
          </div>
        }>
          
          {currentPage === 'home' && (
            <Home 
              navigateTo={navigateTo} 
              navigateToPDP={navigateToPDP}
              changeCategoryTab={setActiveCategoryTab}
              triggerAudio={triggerAudio}
              setMaxPriceFilter={setMaxPriceFilter}
              setGenderFilter={setGenderFilter}
              setMetalFilter={setMetalFilter}
            />
          )}

          {currentPage === 'collections' && (
            <Collections
              activeCategoryTab={activeCategoryTab}
              setActiveCategoryTab={setActiveCategoryTab}
              metalFilter={metalFilter}
              setMetalFilter={setMetalFilter}
              purityFilter={purityFilter}
              setPurityFilter={setPurityFilter}
              maxPriceFilter={maxPriceFilter}
              setMaxPriceFilter={setMaxPriceFilter}
              genderFilter={genderFilter}
              setGenderFilter={setGenderFilter}
              navigateToPDP={navigateToPDP}
              triggerAudio={triggerAudio}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {currentPage === 'product-detail' && (
            <ProductDetail
              detailProduct={detailProduct}
              setDetailProduct={setDetailProduct}
              navigateTo={navigateTo}
              navigateToPDP={navigateToPDP}
              triggerAudio={triggerAudio}
            />
          )}

          {currentPage === 'gold-coins' && (
            <GoldCoins
              coinPurityTab={coinPurityTab}
              setCoinPurityTab={setCoinPurityTab}
              coinWeightFilter={coinWeightFilter}
              setCoinWeightFilter={setCoinWeightFilter}
              navigateTo={navigateTo}
              navigateToPDP={navigateToPDP}
              triggerAudio={triggerAudio}
            />
          )}

          {currentPage === 'offers' && (
            <Offers
              navigateTo={navigateTo}
              setMetalFilter={setMetalFilter}
              setMaxPriceFilter={setMaxPriceFilter}
              changeCategoryTab={setActiveCategoryTab}
              triggerAudio={triggerAudio}
            />
          )}

          {currentPage === 'heritage' && (
            <Heritage
              navigateTo={navigateTo}
              triggerAudio={triggerAudio}
            />
          )}

          {currentPage === 'valuation' && (
            <Valuation
              navigateTo={navigateTo}
              triggerAudio={triggerAudio}
            />
          )}

          {currentPage === 'checkout' && (
            <Checkout
              navigateTo={navigateTo}
              triggerAudio={triggerAudio}
            />
          )}

          {currentPage === 'showrooms' && (
            <Showrooms
              navigateTo={navigateTo}
              triggerAudio={triggerAudio}
            />
          )}

          {currentPage === 'terms-and-conditions' && (
            <TermsAndConditions
              navigateTo={navigateTo}
              triggerAudio={triggerAudio}
            />
          )}

          {currentPage === 'privacy-policy' && (
            <PrivacyPolicy
              navigateTo={navigateTo}
              triggerAudio={triggerAudio}
            />
          )}

          {currentPage === 'about-us' && (
            <AboutUs
              navigateTo={navigateTo}
              triggerAudio={triggerAudio}
            />
          )}

        </React.Suspense>
      </MainLayout>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
