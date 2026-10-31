import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Crown, 
  Coins, 
  Sparkles, 
  ShoppingBag, 
  Building2, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  FileCheck, 
  PenTool, 
  Gem 
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useRates } from '../hooks/useRates';

// Asset Imports
import laxmiGoldCoin from '../assets/laxmi_gold_coin.png';
import goldBullionCoin from '../assets/gold_bullion_coin.png';

const calculateCoinPrice = (coin, rate24k, silverRate1g = 92) => {
  let baseMetalValue = 0;
  const isSilver = String(coin.purity || '').toLowerCase().includes('silver') || String(coin.metal || '').toLowerCase().includes('silver');
  if (isSilver) {
    const silverPerGram = silverRate1g || 92;
    baseMetalValue = silverPerGram * coin.weightGm;
  } else {
    const baseRatePerGm = rate24k / 10;
    const purityMultiplier = coin.purity === '24K' ? 1.0 : 0.9167;
    baseMetalValue = baseRatePerGm * coin.weightGm * purityMultiplier;
  }
  const makingCharges = baseMetalValue * (coin.makingChargePercent / 100);
  const subtotal = baseMetalValue + makingCharges;
  const gst = subtotal * 0.03;
  const total = subtotal + gst;
  return {
    baseMetalValue: Math.round(baseMetalValue),
    makingCharges: Math.round(makingCharges),
    gst: Math.round(gst),
    total: Math.round(total)
  };
};

export default function GoldCoins({
  coinPurityTab: initialPurityTab,
  setCoinPurityTab: onPurityTabChange,
  coinWeightFilter: initialWeightFilter,
  setCoinWeightFilter: onWeightFilterChange,
  navigateTo,
  navigateToPDP,
  triggerAudio: triggerAudioProp,
}) {
  // Self-contained data from context
  const { products = [], loading } = useProducts();
  const { wishlistItems = [], toggleWishlist } = useWishlist();
  const { handleAddToCart } = useCart();
  const { goldRate24k = 78500, silverRate1g = 92 } = useRates();

  const triggerAudio = (type) => { try { triggerAudioProp?.(type); } catch { /* noop */ } };
  // Page local states
  const [coinPurityTab, setCoinPurityTab] = useState(initialPurityTab || 'all');
  const [coinWeightFilter, setCoinWeightFilter] = useState(initialWeightFilter || 'all');
  const [coinDetailOpen, setCoinDetailOpen] = useState(null);
  const [coinDetailImg, setCoinDetailImg] = useState(0);

  // Sync external filter props
  useEffect(() => {
    if (initialPurityTab !== undefined) setCoinPurityTab(initialPurityTab);
  }, [initialPurityTab]);

  useEffect(() => {
    if (initialWeightFilter !== undefined) setCoinWeightFilter(initialWeightFilter);
  }, [initialWeightFilter]);

  const isCatalogDark = false;

  // Memoized gold & silver coins calculated from products list
  const GOLD_COINS_DATA = useMemo(() => {
    return products
      .filter(p => {
        const catLower = (p.category || '').toLowerCase();
        const nameLower = (p.name || '').toLowerCase();
        const subLower = (p.subCategory || '').toLowerCase();
        return catLower === 'gold-coins' || catLower.includes('coin') || catLower.includes('bar') ||
               nameLower.includes('coin') || nameLower.includes('bullion') || nameLower.includes('bar') ||
               subLower.includes('coin');
      })
      .map(p => {
        const weightGm = parseFloat(p.weight) || parseFloat(p.weightGm) || parseFloat(p.silverWeight) || parseFloat(p.goldWeight) || 0;
        const isSilver = (p.metal || '').toLowerCase().includes('silver') ||
                         (p.category || '').toLowerCase().includes('silver') ||
                         (p.subCategory || '').toLowerCase().includes('silver') ||
                         (p.name || '').toLowerCase().includes('silver') ||
                         (p.carat || p.metalPurity || p.silverPurity || '').toLowerCase().includes('999');
        
        let purity = '24K';
        if (isSilver) {
          purity = '999 Silver';
        } else if ((p.carat || p.metalPurity || '').toUpperCase().includes('22')) {
          purity = '22K';
        }

        const makingChargePercent = parseFloat(p.makingCharges) || parseFloat(p.makingChargePercent) || 3.5;
        
        let displayImg = p.img;
        if (!displayImg || displayImg.includes('laxmi_gold_coin') || p.name.toLowerCase().includes('laxmi') || p.name.toLowerCase().includes('temple') || p.name.toLowerCase().includes('ganesha')) {
          displayImg = laxmiGoldCoin;
        } else if (displayImg.includes('gold_bullion_coin') || p.name.toLowerCase().includes('bullion') || p.name.toLowerCase().includes('sovereign') || p.name.toLowerCase().includes('mint')) {
          displayImg = goldBullionCoin;
        }
        
        return {
          id: p.id,
          name: p.name,
          purity,
          weightGm,
          metal: isSilver ? 'Silver' : 'Gold',
          img: displayImg,
          makingChargePercent,
          description: p.desc || p.description || '',
          certification: p.certification || p.hallmark || p.certificate || (isSilver ? '999 Fine Silver BIS Certified' : 'BIS Hallmarked & NABL Accredited'),
          available: p.available !== false,
          category: p.subCategory || p.category || (isSilver ? 'Silver Coin' : 'Gold Coin')
        };
      });
  }, [products]);

  const filteredCoins = useMemo(() => {
    return GOLD_COINS_DATA.filter((coin) => {
      const matchPurity = coinPurityTab === 'all' || 
        (coinPurityTab === '999 Silver' ? (coin.purity.includes('999') || coin.purity.includes('Silver')) : coin.purity === coinPurityTab);
      
      const matchWeight = coinWeightFilter === 'all' || 
        coin.weightGm.toString() === coinWeightFilter ||
        (coinWeightFilter === '1000' && (coin.weightGm === 1000 || String(coin.weightGm).toLowerCase().includes('1kg')));

      return matchPurity && matchWeight;
    });
  }, [GOLD_COINS_DATA, coinPurityTab, coinWeightFilter]);

  return (
    <div className={`transition-colors duration-500 min-h-screen pb-20 bg-[#F8F5EC] text-[#0D2B4E]`}>
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden py-24 sm:py-32 select-none border-b border-solid border-gold/25 text-center" style={{ background: 'radial-gradient(circle at 70% 30%, #F4F0EB 0%, #F8F5EC 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gold/40" />
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-[#6B4B2E]/45 animate-particle-1"></div>
            <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-[#6B4B2E]/35 animate-particle-2"></div>
            <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 rounded-full bg-[#6B4B2E]/50 animate-particle-3"></div>
            <div className="absolute top-1/3 right-10 w-2 h-2 rounded-full bg-[#6B4B2E]/25 animate-particle-1"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 text-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.35em] text-[#6B4B2E] border border-solid border-[#6B4B2E]/35 px-5 py-2.5 rounded-full bg-[#0D2B4E]/5 backdrop-blur-xl shadow-2xl animate-fade-in gold-glow-border font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B4B2E] animate-ping" />
              <span>999 PURE GOLD</span>
            </div>
            <h1 className="serif-luxury text-4xl sm:text-6xl font-semibold leading-[1.1] tracking-wide">
              Invest In <br />
              <span className="bg-gradient-to-r from-gold via-[#E6C687] to-gold bg-clip-text text-transparent filter drop-shadow-sm font-bold">
                Timeless Gold Coins
              </span>
            </h1>
            <p className="text-sm sm:text-base leading-relaxed tracking-wide font-light text-gray-600">
              Discover certified gold coins crafted for gifting, investment and heritage value. Meticulously minted with auspicious traditional engravings, certified under strict BIS Hallmarks for absolute purity.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => {
                  triggerAudio('click');
                  const el = document.getElementById('coins-catalogue-anchor');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 bg-gradient-to-r from-gold to-[#6B4B2E] hover:from-[#6B4B2E] hover:to-gold text-navy text-xs uppercase font-bold tracking-widest rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl cursor-pointer border-none font-bold text-white"
              >
                Explore Coins
              </button>
              <button
                onClick={() => {
                  triggerAudio('click');
                  const el = document.getElementById('coins-catalogue-anchor');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 border border-solid border-gold/50 hover:border-gold text-navy bg-gold/5 text-xs uppercase font-bold tracking-widest rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
              >
                View Purity
              </button>
            </div>
          </div>

          {/* Right side cascade */}
          <div className="lg:col-span-5 flex justify-center items-center relative min-h-[380px] w-full select-none pointer-events-auto text-center">
            <div className="absolute w-[320px] h-[320px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

            {/* Coin 1 */}
            <div className="relative z-30 transform hover:scale-105 transition-transform duration-500 animate-float-gentle group cursor-pointer select-none" onClick={() => { if (GOLD_COINS_DATA && GOLD_COINS_DATA[0]) { triggerAudio('shimmer'); setCoinDetailOpen(GOLD_COINS_DATA[0]); setCoinDetailImg(0); } }}>
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-[6px] border-solid border-gold/45 bg-gradient-to-br from-gold via-[#E6DFD3] to-[#6B4B2E] shadow-2xl relative overflow-hidden flex items-center justify-center p-2">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url(${laxmiGoldCoin})` }} />
                <div className="absolute inset-3 border-2 border-solid border-gold/30 rounded-full flex flex-col items-center justify-center text-center p-4 bg-gold/10 backdrop-blur-[1px] select-none">
                  <span className="text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">🔱</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0D2B4E] mt-2 leading-none">MANISH & CO</span>
                  <span className="text-[7px] font-bold text-navy/70 tracking-widest mt-1">24K 999.9 PURE</span>
                  <span className="text-[8px] font-black text-[#0D2B4E] mt-2">10 GRAMS</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out pointer-events-none" />
              </div>
              <div className="absolute -bottom-6 left-8 right-8 h-4 bg-[#0D2B4E]/30 rounded-full blur-lg" />
            </div>

            {/* Coin 2 */}
            <div className="absolute right-[-15px] top-[5%] z-20 transform scale-[0.7] hover:scale-[0.75] transition-all duration-500 animate-float-gentle cursor-pointer select-none" style={{ animationDelay: '1.2s' }} onClick={() => { if (GOLD_COINS_DATA && GOLD_COINS_DATA[6]) { triggerAudio('shimmer'); setCoinDetailOpen(GOLD_COINS_DATA[6]); setCoinDetailImg(0); } }}>
              <div className="w-36 h-36 rounded-full border-[4px] border-solid border-gold/40 bg-gradient-to-br from-gold via-[#E6DFD3] to-[#6B4B2E] shadow-xl flex items-center justify-center p-2 relative overflow-hidden group">
                <div className="absolute inset-1.5 border border-solid border-gold/30 rounded-full flex flex-col items-center justify-center text-center p-2">
                  <Crown className="w-5 h-5 text-navy" />
                  <span className="text-[7px] font-black tracking-wider text-navy mt-1">MAU MINT</span>
                  <span className="text-[8px] font-black text-navy mt-1">22K 916</span>
                  <span className="text-[7px] font-bold text-navy/70">8 GRAMS</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 left-6 right-6 h-3 bg-[#0D2B4E]/20 rounded-full blur-md" />
            </div>

            {/* Coin 3 */}
            <div className="absolute left-[-20px] top-[10%] z-15 transform scale-[0.75] hover:scale-[0.8] transition-all duration-500 animate-float-gentle cursor-pointer select-none" style={{ animationDelay: '2.4s' }} onClick={() => { if (GOLD_COINS_DATA && GOLD_COINS_DATA[2]) { triggerAudio('shimmer'); setCoinDetailOpen(GOLD_COINS_DATA[2]); setCoinDetailImg(0); } }}>
              <div className="w-40 h-40 rounded-full border-[4px] border-solid border-gold/40 bg-gradient-to-br from-gold via-[#E6DFD3] to-[#6B4B2E] shadow-xl flex items-center justify-center p-2 relative overflow-hidden group">
                <div className="absolute inset-1.5 border border-solid border-gold/30 rounded-full flex flex-col items-center justify-center text-center p-2">
                  <Coins className="w-5 h-5 text-navy" />
                  <span className="text-[7px] font-black tracking-wider text-navy mt-1">SOVEREIGN</span>
                  <span className="text-[8px] font-black text-navy mt-1">24K 999.9</span>
                  <span className="text-[7px] font-bold text-navy/70">20 GRAMS</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 left-6 right-6 h-3 bg-[#0D2B4E]/20 rounded-full blur-md" />
            </div>

            {/* Coin 4 */}
            <div className="absolute right-[5%] bottom-[-5%] z-25 transform scale-[0.8] hover:scale-[0.85] transition-all duration-500 animate-float-gentle cursor-pointer select-none" style={{ animationDelay: '1.8s' }} onClick={() => { if (GOLD_COINS_DATA && GOLD_COINS_DATA[1]) { triggerAudio('shimmer'); setCoinDetailOpen(GOLD_COINS_DATA[1]); setCoinDetailImg(0); } }}>
              <div className="w-38 h-38 rounded-full border-[4.5px] border-solid border-gold/45 bg-gradient-to-br from-gold via-[#E6DFD3] to-[#6B4B2E] shadow-2xl flex items-center justify-center p-2 relative overflow-hidden group">
                <div className="absolute inset-1.5 border border-solid border-gold/35 rounded-full flex flex-col items-center justify-center text-center p-2">
                  <Sparkles className="w-5 h-5 text-navy" />
                  <span className="text-[6.5px] font-black tracking-wider text-navy mt-1">LAXMI EMBLEM</span>
                  <span className="text-[7.5px] font-black text-navy mt-0.5">5 GRAMS</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 left-6 right-6 h-3 bg-[#0D2B4E]/25 rounded-full blur-md" />
            </div>

            {/* Coin 5 */}
            <div className="absolute left-[8%] bottom-[-8%] z-10 transform scale-[0.6] hover:scale-[0.65] transition-all duration-500 animate-float-gentle cursor-pointer select-none" style={{ animationDelay: '3.0s' }} onClick={() => { if (GOLD_COINS_DATA && GOLD_COINS_DATA[5]) { triggerAudio('shimmer'); setCoinDetailOpen(GOLD_COINS_DATA[5]); setCoinDetailImg(0); } }}>
              <div className="w-32 h-32 rounded-full border-[3px] border-solid border-gold/35 bg-gradient-to-br from-gold via-[#E6DFD3] to-[#6B4B2E] shadow-lg flex items-center justify-center p-1.5 relative overflow-hidden group">
                <div className="absolute inset-1 border border-solid border-gold/20 rounded-full flex flex-col items-center justify-center text-center p-2">
                  <Sparkles className="w-4 h-4 text-navy" />
                  <span className="text-[6px] font-black tracking-wider text-navy">SHUBH LABH</span>
                  <span className="text-[7px] font-black text-navy mt-1">1 GRAM</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 left-6 right-6 h-3 bg-[#0D2B4E]/15 rounded-full blur-md" />
            </div>

          </div>
        </div>
      </div>

      {/* 2. STICKY FILTER BAR */}
      <div id="coins-catalogue-anchor" className="sticky top-20 z-30 py-4 shadow-md backdrop-blur-xl border-b border-solid transition-colors duration-300 select-none bg-opacity-95 bg-[#F8F5ECEE] border-[#0D2B4E15]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-[10px] uppercase tracking-widest font-black mr-2 opacity-60 shrink-0">Purity:</span>
            {[
              { key: 'all', label: 'All Purity' },
              { key: '24K', label: '24K (999.9 Purity)' },
              { key: '22K', label: '22K (916 Purity)' },
              { key: '999 Silver', label: '999 Silver (Pure Silver)' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => { triggerAudio('click'); setCoinPurityTab(tab.key); }}
                className={`px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg border border-solid transition-all duration-305 cursor-pointer whitespace-nowrap ${coinPurityTab === tab.key
                  ? 'bg-gold border-gold text-[#0D2B4E] shadow-md'
                  : 'border-gray-200 hover:border-gold/50 text-gray-700 hover:text-navy bg-white'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-[10px] uppercase tracking-widest font-black mr-2 opacity-60 shrink-0">Weight:</span>
            {[
              { key: 'all', label: 'All Weights' },
              { key: '0.5', label: '0.5g' },
              { key: '1', label: '1g' },
              { key: '2', label: '2g' },
              { key: '5', label: '5g' },
              { key: '8', label: '8g' },
              { key: '10', label: '10g' },
              { key: '20', label: '20g' },
              { key: '50', label: '50g' },
              { key: '100', label: '100g (100grm)' },
              { key: '200', label: '200g (200grm)' },
              { key: '500', label: '500g (500grm)' },
              { key: '1000', label: '1000g (1KG)' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => { triggerAudio('click'); setCoinWeightFilter(filter.key); }}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border border-solid transition-all duration-305 cursor-pointer whitespace-nowrap ${coinWeightFilter === filter.key
                  ? 'bg-gold border-gold text-[#0D2B4E] shadow-md'
                  : 'border-gray-200 hover:border-gold/30 text-gray-600 hover:text-navy bg-white'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 3. COIN CATALOGUE GRID */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 text-center">
        <div className="space-y-3 mb-12">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">Patron Investment Guild</span>
          <h2 className="serif-luxury text-3xl sm:text-4xl font-semibold">Available Gold Coins Catalogue</h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-2"></div>
          <p className="text-xs max-w-xl mx-auto font-light leading-relaxed text-gray-550">
            Real-time transparent pricing recalculated live based on current 24K spot gold rate: <span className="font-bold text-gold">₹{goldRate24k}/10g</span>. All products are fully sealed and certified.
          </p>
        </div>

        {filteredCoins.length === 0 ? (
          <div className="py-24 space-y-4 text-center">
            <Coins className="w-12 h-12 text-gold mx-auto" />
            <h3 className="serif-luxury text-lg font-bold">No coins match selected filters</h3>
            <p className="text-xs opacity-60">Try choosing "All Purity" or "All Weights" to browse the entire collection.</p>
            <button onClick={() => { triggerAudio('click'); setCoinPurityTab('all'); setCoinWeightFilter('all'); }} className="px-6 py-2 bg-gold text-[#0D2B4E] text-[10px] uppercase font-bold tracking-widest rounded-lg cursor-pointer border-none font-bold">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCoins.map((coin) => {
              const prices = calculateCoinPrice(coin, goldRate24k, silverRate1g);
              const isWishlisted = wishlistItems.some((w) => w.id === coin.id);

              return (
                <div
                  key={coin.id}
                  className="group border border-solid rounded-3xl p-6 transition-all duration-500 flex flex-col relative overflow-hidden select-none hover:-translate-y-1.5 bg-[#F8F5EC] border-gold/10 hover:border-[#6B4B2E]/45 shadow-md hover:shadow-[0_15px_40px_rgba(212,175,55,0.08)]"
                >
                  <div className="relative aspect-square rounded-2xl flex items-center justify-center p-6 mb-5 overflow-hidden transition-colors bg-[#F8F5EC]">
                    <div className="relative w-40 h-40 rounded-full border-[4px] border-solid border-gold/30 bg-gradient-to-br from-gold via-[#E6DFD3] to-[#6B4B2E] shadow-xl flex items-center justify-center p-1.5 transition-transform duration-500 group-hover:scale-105 overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center opacity-25 select-none pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url('${coin.img}')` }} />

                      <div className="absolute inset-1 border border-solid border-gold/20 rounded-full flex flex-col items-center justify-center text-center p-2">
                        <span className="text-xl filter drop-shadow">🪷</span>
                        <span className="text-[7px] font-black tracking-wider text-navy mt-1 leading-none">{coin.category}</span>
                        <span className="text-[8px] font-black text-[#0D2B4E] mt-1 leading-none">{coin.weightGm}g</span>
                        <span className="text-[6px] font-bold text-navy/60 leading-none mt-1">{coin.purity} PURE</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist({
                          id: coin.id,
                          name: coin.name,
                          price: prices.total,
                          img: coin.img,
                          weight: `${coin.weightGm}g`,
                          carat: `${coin.purity} Gold Coin`
                        });
                      }}
                      className={`absolute top-3 right-3 p-2.5 rounded-full border border-solid transition-all duration-305 cursor-pointer ${isWishlisted
                        ? 'bg-[#6B4B2E] border-[#6B4B2E] text-[#0D2B4E] scale-110'
                        : 'border-gray-100 hover:border-gold/40 text-gray-400 hover:text-gold bg-white shadow-sm'
                        }`}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <svg className="w-3.5 h-3.5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>

                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-gold/10 border border-solid border-gold/30 text-[7px] font-bold text-gold tracking-widest uppercase">
                      BIS 999.9 Hallmarked
                    </span>
                  </div>

                  <div className="text-left space-y-1.5 flex-grow">
                    <span className="text-[8px] uppercase tracking-widest text-gold font-bold">{coin.purity} • {coin.weightGm} Grams</span>
                    <h3 className="serif-luxury text-sm font-bold truncate tracking-wide leading-snug">{coin.name}</h3>
                    <p className="text-[10px] font-light leading-normal line-clamp-2 text-gray-400">{coin.description}</p>

                    <div className="mt-3 p-3 rounded-2xl space-y-1 bg-gray-50 border border-solid border-gray-100">
                      <div className="flex justify-between items-center text-[10px] opacity-70">
                        <span>Metal Base Value:</span>
                        <span className="font-sans">₹{prices.baseMetalValue.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] opacity-70">
                        <span>Making Charges ({coin.makingChargePercent}%):</span>
                        <span className="font-sans">₹{prices.makingCharges.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] opacity-70 border-b border-solid pb-1 border-[#EAE6E1]">
                        <span>GST (3%):</span>
                        <span className="font-sans">₹{prices.gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-gold pt-1">
                        <span>Live Price:</span>
                        <span className="font-sans text-xs">₹{prices.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t border-solid border-[#F8F5EC]">
                    <button
                      onClick={() => {
                        triggerAudio('click');
                        setCoinDetailOpen(coin);
                        setCoinDetailImg(0);
                      }}
                      className="py-2 text-[8px] uppercase tracking-widest font-black rounded-lg border border-solid border-gray-200 hover:border-gold/50 text-[#0D2B4E] hover:bg-gray-50 cursor-pointer bg-transparent"
                    >
                      🔍 View Specs
                    </button>

                    <button
                      onClick={() => {
                        handleAddToCart({
                          id: coin.id,
                          name: coin.name,
                          price: prices.total,
                          img: coin.img,
                          weight: `${coin.weightGm}g`,
                          carat: `${coin.purity} Gold Coin`
                        });
                      }}
                      className="py-2 text-[8px] uppercase tracking-widest font-black rounded-lg bg-gradient-to-r from-gold to-[#6B4B2E] hover:from-[#6B4B2E] hover:to-gold text-[#0D2B4E] transition-all transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer border-none font-bold flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. PRODUCT DETAIL MODAL */}
      {coinDetailOpen && (() => {
        const coin = coinDetailOpen;
        const prices = calculateCoinPrice(coin, goldRate24k, silverRate1g);
        const isWishlisted = wishlistItems.some((w) => w.id === coin.id);

        return (
          <div className="fixed inset-0 z-[100] overflow-y-auto backdrop-blur-md bg-[#0D2B4E]/75 flex justify-center items-center p-4">
            <div className="relative max-w-4xl w-full rounded-[2.5rem] border border-solid overflow-hidden p-6 sm:p-8 select-none bg-[#F8F5EC] border-gold/20 text-[#0D2B4E]">
              <button
                onClick={() => { triggerAudio('click'); setCoinDetailOpen(null); }}
                className="absolute top-5 right-5 p-2 rounded-full border border-solid border-gray-200 text-gray-600 hover:text-navy bg-white shadow cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-4">
                <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                  <div className="w-full aspect-square rounded-3xl flex items-center justify-center p-8 relative overflow-hidden mb-4 bg-white border border-solid border-gray-100 shadow-sm text-center">
                    <div className="relative w-52 h-52 rounded-full border-[5px] border-solid border-gold/40 bg-gradient-to-br from-gold via-[#E6DFD3] to-[#6B4B2E] shadow-2xl flex items-center justify-center p-2 overflow-hidden transform hover:scale-105 transition-transform duration-500 group">
                      <div className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url('${coin.img}')` }} />
                      <div className="absolute inset-2 border-2 border-solid border-gold/20 rounded-full flex flex-col items-center justify-center text-center p-4">
                        <Crown className="w-7 h-7 text-navy" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-navy mt-2 leading-none">MANISH & CO</span>
                        <span className="text-[7px] font-bold text-navy/70 tracking-widest mt-1">{coin.purity} PURE</span>
                        <span className="text-[9px] font-black text-navy mt-2">{coin.weightGm}g</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    {[
                      { label: 'Obverse Face', icon: <Coins className="w-3 h-3 inline mr-1" />, idx: 0 },
                      { label: 'Cert Assay', icon: <FileCheck className="w-3 h-3 inline mr-1" />, idx: 1 }
                    ].map((t) => (
                      <button
                        key={t.idx}
                        onClick={() => { triggerAudio('click'); setCoinDetailImg(t.idx); }}
                        className={`px-3 py-1.5 text-[9px] font-bold rounded-lg border border-solid transition-all cursor-pointer flex items-center ${coinDetailImg === t.idx
                          ? 'bg-gold border-gold text-[#0D2B4E]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-100 bg-transparent'
                        }`}
                      >
                        {t.icon}
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col justify-between text-left space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-gold/10 border border-solid border-gold/30 text-[8px] font-bold text-gold tracking-widest uppercase">
                        {coin.purity} Purity
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/10 border border-solid border-gray-200 text-[8px] font-bold opacity-75 tracking-widest uppercase">
                        {coin.weightGm}g Weight
                      </span>
                    </div>
                    <h2 className="serif-luxury text-2xl font-semibold leading-tight tracking-wide">{coin.name}</h2>
                    <p className="text-xs font-light leading-relaxed text-gray-550">{coin.description}</p>
                  </div>

                  <div className="p-4 rounded-2xl text-xs space-y-2.5 bg-gray-50 border border-solid border-gray-100 text-left">
                    <h4 className="text-[10px] font-bold text-gold uppercase tracking-wider mb-1.5">SHOWROOM SPEC SHEET:</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-[10px]">
                      <div className="opacity-60">Metal Material:</div>
                      <div className="font-bold">Fine Solid Gold ({coin.purity})</div>
                      <div className="opacity-60">Pure Gram Weight:</div>
                      <div className="font-bold">{coin.weightGm} Grams</div>
                      <div className="opacity-60">Fineness Factor:</div>
                      <div className="font-bold">{coin.purity === '24K' ? '999.9 (24 Carat)' : '916 (22 Carat)'}</div>
                      <div className="opacity-60">Refinery Certification:</div>
                      <div className="font-bold text-gold">{coin.certification}</div>
                      <div className="opacity-60">Refining Process:</div>
                      <div className="font-bold">Serialized High-Pressure Mint Cast</div>
                      <div className="opacity-60">Buyback Guarantee:</div>
                      <div className="font-bold text-gold">100% Lifetime Showroom Assured</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl text-xs space-y-2 border border-solid bg-white border-gray-100 shadow-sm text-left">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6B4B2E]">Transparent Dynamic Pricing Invoice</h4>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="opacity-75">Base Gold Rate (24K/10g):</span>
                        <span className="font-sans">₹{goldRate24k.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-75">Coin Base Value ({coin.weightGm}g of {coin.purity}):</span>
                        <span className="font-sans">₹{prices.baseMetalValue.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-75">Showroom Minting Charges ({coin.makingChargePercent}%):</span>
                        <span className="font-sans">₹{prices.makingCharges.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-solid pb-1.5 border-gray-100">
                        <span className="opacity-75">Government IGST (3%):</span>
                        <span className="font-sans">₹{prices.gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-gold pt-1">
                        <span>Grand Valuation Net Total:</span>
                        <span className="font-sans text-sm">₹{prices.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        toggleWishlist({
                          id: coin.id,
                          name: coin.name,
                          price: prices.total,
                          img: coin.img,
                          weight: `${coin.weightGm}g`,
                          carat: `${coin.purity} Gold Coin`
                        });
                      }}
                      className={`p-3.5 rounded-xl border border-solid transition-all cursor-pointer bg-white border-gray-200 hover:border-gold text-gray-505 hover:text-gold ${isWishlisted ? 'bg-[#6B4B2E] border-[#6B4B2E] text-[#0D2B4E] scale-105' : ''}`}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <svg className="w-4.5 h-4.5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => {
                        handleAddToCart({
                          id: coin.id,
                          name: coin.name,
                          price: prices.total,
                          img: coin.img,
                          weight: `${coin.weightGm}g`,
                          carat: `${coin.purity} Gold Coin`
                        });
                        setCoinDetailOpen(null);
                      }}
                      className="flex-grow py-3.5 rounded-xl bg-gradient-to-r from-gold to-[#6B4B2E] hover:from-[#6B4B2E] hover:to-gold text-[#0D2B4E] text-xs uppercase font-bold tracking-widest transition-all transform hover:-translate-y-0.5 hover:shadow-xl cursor-pointer border-none font-bold flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag / Lock Rate</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 5. EDITORIAL TRUST SECTION */}
      <div className="py-20 select-none border-t border-solid bg-white border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">Absolute Security Assured</span>
            <h2 className="serif-luxury text-3xl sm:text-4xl font-semibold">Showroom Minting Security &amp; Trust Guarantees</h2>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "NABL Certified Refinery",
                icon: <ShieldCheck className="w-6 h-6 text-gold" />,
                desc: "Every single gold coin is sourced from NABL accredited gold refineries, guaranteeing pure high-pressure minting standards."
              },
              {
                title: "999.9 Sovereign Purity",
                icon: <Crown className="w-6 h-6 text-gold" />,
                desc: "Our coins strictly carry 999.9 fineness on 24K and 916 hallmarks on 22K, backed by complete laboratory validation tags."
              },
              {
                title: "Fully Insured Home Transit",
                icon: <Truck className="w-6 h-6 text-gold" />,
                desc: "All coin dispatches within Rajasthan are fully insured during transportation under strict lock-box security guidelines."
              },
              {
                title: "Lifetime Buyback Guarantee",
                icon: <RotateCcw className="w-6 h-6 text-gold" />,
                desc: "Get instant absolute liquidity with our 100% buyback guarantee valued at current spot metal rates without deductions."
              },
              {
                title: "Safe Showroom Collection",
                icon: <Building2 className="w-6 h-6 text-gold" />,
                desc: "Prefer pick-up? Complete your buy online and collect in-person inside our Tilak Nagar Flagship Fitted Suites in absolute privacy."
              },
              {
                title: "Master Goldsmith Verification",
                icon: <PenTool className="w-6 h-6 text-gold" />,
                desc: "Every order carries a physical signature certificate of master smith Anil Soni, assuring authentic purity checks."
              }
            ].map((tr, idx) => (
              <div
                key={idx}
                className="group border border-solid rounded-3xl p-6 text-left space-y-4 hover:-translate-y-2 hover:z-10 transition-all duration-500 relative overflow-hidden bg-[#F8F5EC] border-gold/10 hover:border-[#6B4B2E]/45 shadow-md hover:shadow-[0_15px_40px_rgba(212,175,55,0.08)]"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                <div className="flex justify-between items-center relative z-10">
                  <span className="serif-luxury text-gold font-extrabold text-sm tracking-widest">✦ 0{idx + 1}</span>
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-300 filter drop-shadow-md">{tr.icon}</span>
                </div>
                <h4 className="serif-luxury text-base font-bold tracking-wide relative z-10">{tr.title}</h4>
                <p className="text-xs font-light leading-relaxed tracking-wide relative z-10 text-gray-555">{tr.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. EDITORIAL INVESTMENT BENEFITS */}
      <div className="py-20 select-none border-t border-solid bg-[#F8F5EC] border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">Generational Value Strategy</span>
            <h2 className="serif-luxury text-3xl sm:text-4xl font-semibold">Why Invest In HR Gold Coins?</h2>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            {[
              {
                title: "Ultimate Inflation Hedge",
                icon: "📈",
                desc: "Gold maintains purchasing power across decades. Safeguard your family financial safety net against inflation volatility with solid bullion."
              },
              {
                title: "Absolute Liquidity Assets",
                icon: "💧",
                desc: "Gold coins are globally recognized liquid assets, accepted by banking systems, pawnshops, and goldsmiths anywhere instantly."
              },
              {
                title: "Zero-Waste Pricing Value",
                icon: "🍃",
                desc: "Unlike intricate bridal jewellery, investment-grade coins carry extremely minimal making charges, retaining near 100% metal value."
              },
              {
                title: "Intergenerational Heirloom Assets",
                icon: "👨‍👩‍👧‍👦",
                desc: "Easily transferable, lightweight physical assets that pass on generations of royal security from mothers to daughters."
              },
              {
                title: "Auspicious Traditional Gifting",
                icon: "🎁",
                desc: "The ultimate representation of honor and blessings for weddings, newborns, Diwali, and corporate grand opening milestones."
              },
              {
                title: "Melt & Remake Adaptability",
                icon: "🔥",
                desc: "Store pure metal bars in your locker today, and melt them later to forge beautiful custom-fit ornaments when the occasion demands."
              }
            ].map((tr, idx) => (
              <div
                key={idx}
                className="group border border-solid rounded-3xl p-6 text-left space-y-4 hover:-translate-y-1.5 transition-all duration-500 hover:shadow-lg relative overflow-hidden border-gray-100 bg-white hover:border-gold/20"
              >
                <div className="flex justify-between items-center">
                  <span className="serif-luxury text-gold font-black text-sm">✧ Phase 0{idx + 1}</span>
                  <span className="text-xl group-hover:scale-110 transition-transform">{tr.icon}</span>
                </div>
                <h4 className="serif-luxury text-base font-bold tracking-wide">{tr.title}</h4>
                <p className="text-xs font-light leading-relaxed tracking-wide text-gray-505">{tr.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
