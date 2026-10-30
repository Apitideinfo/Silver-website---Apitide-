import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Crown, ShieldCheck, ArrowRight, TrendingUp, RefreshCw, Calculator, HelpCircle, Check, Info, Share2, PhoneCall } from 'lucide-react';
import { useRates } from '../hooks/useRates';
import { motion } from 'framer-motion';
import { BUSINESS } from '../config/constants';
import luxuryShowroom from '../assets/luxury_showroom.png';
import goldBullionCoin from '../assets/gold_bullion_coin.png';
import silverPoojaThali from '../assets/silver_pooja_thali.png';
import emeraldSovereignRing from '../assets/emerald_sovereign_ring.png';

export default function Valuation({
  navigateTo,
  triggerAudio: triggerAudioProp,
}) {
  const triggerAudio = (type = 'click') => {
    try { triggerAudioProp?.(type); } catch { /* noop */ }
  };

  // Pull live rates from context
  const {
    goldRate24k = 78500,
    goldRate22k = 71958,
    goldRate20k = 65417,
    goldRate18k = 58875,
    goldRate14k = 45788,
    goldRate9k = 29438,
    goldRate24kPerGram = 7850,
    goldRate22kPerGram = 7196,
    goldRate20kPerGram = 6542,
    goldRate18kPerGram = 5888,
    goldRate14kPerGram = 4579,
    goldRate9kPerGram = 2944,
    silverRate1g = 92,
    silverRate925PerGram = 85.1,
    silverRateNormalPerGram = 82.8,
  } = useRates();

  // Calculator State
  const [selectedMetal, setSelectedMetal] = useState('silver'); // default to silver since brand is fine silver
  const [selectedPurity, setSelectedPurity] = useState('925');
  const [weightInput, setWeightInput] = useState(25);
  const [makingChargesInput, setMakingChargesInput] = useState(10);
  const [wastageInput, setWastageInput] = useState(3);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Quick weight presets
  const quickWeightPresets = selectedMetal === 'silver' 
    ? [10, 25, 50, 100, 250, 500] 
    : [2, 5, 8, 10, 20, 50];

  // Calculated bullion cost
  const weightNum = parseFloat(weightInput) || 0;
  const makingPct = parseFloat(makingChargesInput) || 0;
  const wastagePct = parseFloat(wastageInput) || 0;

  const ratePerGram = selectedMetal === 'gold'
    ? (selectedPurity === '24K'
        ? (goldRate24kPerGram || goldRate24k / 10)
        : selectedPurity === '22K'
          ? (goldRate22kPerGram || goldRate22k / 10)
          : selectedPurity === '20K'
            ? (goldRate20kPerGram || goldRate20k / 10)
            : selectedPurity === '18K'
              ? (goldRate18kPerGram || goldRate18k / 10)
              : selectedPurity === '14K'
                ? (goldRate14kPerGram || goldRate14k / 10)
                : (goldRate9kPerGram || goldRate9k / 10))
    : (selectedPurity.includes('925') || selectedPurity.includes('92.5')
        ? (silverRate925PerGram || silverRate1g * 0.925)
        : selectedPurity.includes('normal') || selectedPurity.includes('Normal')
          ? (silverRateNormalPerGram || silverRate1g * 0.90)
          : (silverRate1g || 92));

  const metalValue = weightNum * ratePerGram;
  const makingAmt = metalValue * (makingPct / 100);
  const wastageAmt = metalValue * (wastagePct / 100);
  const subtotalBeforeGst = metalValue + makingAmt + wastageAmt;
  const gstAmt = subtotalBeforeGst * 0.03;
  const calculatedFinalCost = subtotalBeforeGst + gstAmt;

  const handleShareQuote = () => {
    triggerAudio('click');
    const finalTotal = Math.round(calculatedFinalCost);
    const text = `Hello MANISH & CO, I simulated an estimate quote on your Live Jewellery Calculator:\n\n*Metal:* ${selectedMetal.toUpperCase()} (${selectedPurity})\n*Gross Weight:* ${weightNum}g\n*Rate/g:* ₹${Math.round(ratePerGram).toLocaleString('en-IN')}\n*Metal Cost:* ₹${Math.round(metalValue).toLocaleString('en-IN')}\n*Making Charges (${makingPct}%):* ₹${Math.round(makingAmt).toLocaleString('en-IN')}\n*Wastage Factor (${wastagePct}%):* ₹${Math.round(wastageAmt).toLocaleString('en-IN')}\n*GST (3%):* ₹${Math.round(gstAmt).toLocaleString('en-IN')}\n*Estimated Final Price:* ₹${finalTotal.toLocaleString('en-IN')}\n\nPlease verify and lock this rate for my order!`;
    window.open(`https://wa.me/${BUSINESS.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8F5EC] text-[#0D2B4E] font-sans selection:bg-[#6B4B2E]/20 selection:text-[#091B2B]">
      <Helmet>
        <title>Jewellery Valuation & Live Bullion Rates | MANISH & CO</title>
        <meta 
          name="description" 
          content="Calculate live 925 sterling silver and hallmarked gold jewellery estimates with MANISH & CO transparent bullion calculator linked to live daily market spot rates." 
        />
      </Helmet>

      {/* ========================================================
          HERO & LIVE MARKET TICKER STRIP
          ======================================================== */}
      <section className="relative w-full overflow-hidden select-none pt-20 pb-16 px-6 sm:px-12 bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#ECE5D8] border-b border-[#E6DFD3]">
        {/* Soft background luxury glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#6B4B2E]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1340px] mx-auto text-center space-y-6 relative z-10">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#E6DFD3] shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#6B4B2E] uppercase font-sans">
              LIVE BULLION SPOT RATES • 100% TRANSPARENT VALUATION
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <h1 className="serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0D2B4E] leading-[1.15]">
              Jewellery Valuation <br />
              <span className="bg-gradient-to-r from-[#6B4B2E] via-[#8A6623] to-[#D4AF37] bg-clip-text text-transparent italic font-serif">
                &amp; Daily Metal Index
              </span>
            </h1>
            <p className="text-xs sm:text-base font-light text-[#0D2B4E]/80 max-w-2xl mx-auto leading-relaxed">
              Plan your fine jewellery purchase with absolute confidence. Calculate live 925 sterling silver and 22K/24K gold values with transparent making charges and zero hidden fees.
            </p>
          </div>

          {/* Live Rate Pills Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6 max-w-5xl mx-auto">
            {/* Silver 925 (Primary Brand Focus) */}
            <div 
              onClick={() => {
                triggerAudio('click');
                setSelectedMetal('silver');
                setSelectedPurity('925');
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${selectedMetal === 'silver' && selectedPurity === '925'
                ? 'bg-[#0D2B4E] text-white border-[#D4AF37] shadow-lg scale-[1.02]'
                : 'bg-white/80 text-[#0D2B4E] border-[#E6DFD3] hover:border-[#6B4B2E]/50'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider opacity-75 font-sans">
                <span>925 Sterling Silver</span>
                <span className="text-emerald-500 font-mono text-[9px]">+0.4%</span>
              </div>
              <div className="serif-luxury text-2xl font-bold mt-1 text-[#D4AF37]">
                ₹{Math.round(silverRate925PerGram || silverRate1g * 0.925)} <span className="text-xs font-normal text-current opacity-70">/g</span>
              </div>
              <span className="text-[9px] opacity-60 block mt-0.5">Hallmark Standard</span>
            </div>

            {/* Silver 999 */}
            <div 
              onClick={() => {
                triggerAudio('click');
                setSelectedMetal('silver');
                setSelectedPurity('999');
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${selectedMetal === 'silver' && selectedPurity === '999'
                ? 'bg-[#0D2B4E] text-white border-[#D4AF37] shadow-lg scale-[1.02]'
                : 'bg-white/80 text-[#0D2B4E] border-[#E6DFD3] hover:border-[#6B4B2E]/50'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider opacity-75 font-sans">
                <span>Fine Silver 999</span>
                <span className="text-emerald-500 font-mono text-[9px]">+0.3%</span>
              </div>
              <div className="serif-luxury text-2xl font-bold mt-1 text-[#D4AF37]">
                ₹{Math.round(silverRate1g || 92)} <span className="text-xs font-normal text-current opacity-70">/g</span>
              </div>
              <span className="text-[9px] opacity-60 block mt-0.5">100% Pure Bullion</span>
            </div>

            {/* Gold 24K */}
            <div 
              onClick={() => {
                triggerAudio('click');
                setSelectedMetal('gold');
                setSelectedPurity('24K');
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${selectedMetal === 'gold' && selectedPurity === '24K'
                ? 'bg-[#0D2B4E] text-white border-[#D4AF37] shadow-lg scale-[1.02]'
                : 'bg-white/80 text-[#0D2B4E] border-[#E6DFD3] hover:border-[#6B4B2E]/50'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider opacity-75 font-sans">
                <span>Gold 24K (999)</span>
                <span className="text-emerald-500 font-mono text-[9px]">+0.35%</span>
              </div>
              <div className="serif-luxury text-2xl font-bold mt-1 text-[#D4AF37]">
                ₹{Math.round(goldRate24kPerGram || goldRate24k / 10).toLocaleString('en-IN')} <span className="text-xs font-normal text-current opacity-70">/g</span>
              </div>
              <span className="text-[9px] opacity-60 block mt-0.5">Solid 24 Karat</span>
            </div>

            {/* Gold 22K */}
            <div 
              onClick={() => {
                triggerAudio('click');
                setSelectedMetal('gold');
                setSelectedPurity('22K');
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${selectedMetal === 'gold' && selectedPurity === '22K'
                ? 'bg-[#0D2B4E] text-white border-[#D4AF37] shadow-lg scale-[1.02]'
                : 'bg-white/80 text-[#0D2B4E] border-[#E6DFD3] hover:border-[#6B4B2E]/50'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider opacity-75 font-sans">
                <span>Gold 22K (916)</span>
                <span className="text-emerald-500 font-mono text-[9px]">+0.32%</span>
              </div>
              <div className="serif-luxury text-2xl font-bold mt-1 text-[#D4AF37]">
                ₹{Math.round(goldRate22kPerGram || goldRate22k / 10).toLocaleString('en-IN')} <span className="text-xs font-normal text-current opacity-70">/g</span>
              </div>
              <span className="text-[9px] opacity-60 block mt-0.5">BIS 916 Hallmark</span>
            </div>

            {/* Gold 18K */}
            <div 
              onClick={() => {
                triggerAudio('click');
                setSelectedMetal('gold');
                setSelectedPurity('18K');
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 col-span-2 sm:col-span-1 ${selectedMetal === 'gold' && selectedPurity === '18K'
                ? 'bg-[#0D2B4E] text-white border-[#D4AF37] shadow-lg scale-[1.02]'
                : 'bg-white/80 text-[#0D2B4E] border-[#E6DFD3] hover:border-[#6B4B2E]/50'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider opacity-75 font-sans">
                <span>Gold 18K (750)</span>
                <span className="text-emerald-500 font-mono text-[9px]">+0.28%</span>
              </div>
              <div className="serif-luxury text-2xl font-bold mt-1 text-[#D4AF37]">
                ₹{Math.round(goldRate18kPerGram || goldRate18k / 10).toLocaleString('en-IN')} <span className="text-xs font-normal text-current opacity-70">/g</span>
              </div>
              <span className="text-[9px] opacity-60 block mt-0.5">Diamond Jewellery</span>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          MAIN CALCULATOR WORKSPACE
          ======================================================== */}
      <section id="interactive-calculator" className="py-20 px-6 sm:px-12 max-w-[1340px] mx-auto select-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: SIMULATOR CONTROLS (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1 & 2 Card: Metal & Purity */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-solid border-[#E6DFD3] shadow-md space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#6B4B2E]/10 flex items-center justify-center text-[#6B4B2E]">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="serif-luxury text-xl font-bold text-[#0D2B4E]">01. Select Precious Metal</h3>
                    <p className="text-[11px] text-gray-500">Choose between 925 fine silver or hallmarked gold</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#0D2B4E] px-3 py-1 rounded-full">
                  Step 1
                </span>
              </div>

              {/* Metal Switcher */}
              <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#0D2B4E]/5 border border-[#E6DFD3]">
                <button
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    setSelectedMetal('silver');
                    setSelectedPurity('925');
                  }}
                  className={`py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedMetal === 'silver'
                    ? 'bg-[#0D2B4E] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#0D2B4E]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>925 Fine Silver</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    setSelectedMetal('gold');
                    setSelectedPurity('22K');
                  }}
                  className={`py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedMetal === 'gold'
                    ? 'bg-[#0D2B4E] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#0D2B4E]'
                  }`}
                >
                  <Crown className="w-4 h-4 text-[#D4AF37]" />
                  <span>Hallmarked Gold</span>
                </button>
              </div>

              {/* Purity Pills */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">
                  Select Purity Standard:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedMetal === 'silver' ? (
                    [
                      { id: '925', label: '925 Sterling Silver', tag: 'Hallmark 92.5%', rate: Math.round(silverRate925PerGram || silverRate1g * 0.925) },
                      { id: '999', label: '999 Fine Silver', tag: 'Pure Bullion 99.9%', rate: Math.round(silverRate1g || 92) },
                      { id: 'normal', label: '900 Traditional Silver', tag: 'Chitai Craft 90%', rate: Math.round(silverRateNormalPerGram || silverRate1g * 0.90) }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          triggerAudio('click');
                          setSelectedPurity(p.id);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${selectedPurity === p.id
                          ? 'bg-[#0D2B4E] text-white border-[#D4AF37] shadow-md'
                          : 'bg-[#FAF8F5] text-[#0D2B4E] border-[#E6DFD3] hover:border-[#6B4B2E]/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="serif-luxury text-base font-bold">{p.label}</span>
                          {selectedPurity === p.id && <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />}
                        </div>
                        <span className="text-[9px] opacity-70 block mt-1">{p.tag}</span>
                        <span className="serif-luxury text-sm font-bold text-[#D4AF37] block mt-1.5">₹{p.rate}/g</span>
                      </button>
                    ))
                  ) : (
                    [
                      { id: '24K', label: '24K Pure Gold', tag: '999 Bullion 99.9%', rate: Math.round(goldRate24kPerGram || goldRate24k / 10) },
                      { id: '22K', label: '22K Hallmark Gold', tag: '916 Sovereign 91.6%', rate: Math.round(goldRate22kPerGram || goldRate22k / 10) },
                      { id: '18K', label: '18K Diamond Gold', tag: '750 Ornaments 75.0%', rate: Math.round(goldRate18kPerGram || goldRate18k / 10) }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          triggerAudio('click');
                          setSelectedPurity(p.id);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${selectedPurity === p.id
                          ? 'bg-[#0D2B4E] text-white border-[#D4AF37] shadow-md'
                          : 'bg-[#FAF8F5] text-[#0D2B4E] border-[#E6DFD3] hover:border-[#6B4B2E]/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="serif-luxury text-base font-bold">{p.label}</span>
                          {selectedPurity === p.id && <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />}
                        </div>
                        <span className="text-[9px] opacity-70 block mt-1">{p.tag}</span>
                        <span className="serif-luxury text-sm font-bold text-[#D4AF37] block mt-1.5">₹{p.rate}/g</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Step 3 Card: Weight & Specifications */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-solid border-[#E6DFD3] shadow-md space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#6B4B2E]/10 flex items-center justify-center text-[#6B4B2E]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="serif-luxury text-xl font-bold text-[#0D2B4E]">02. Weight &amp; Craftsmanship</h3>
                    <p className="text-[11px] text-gray-500">Fine-tune grams, making charges, and wastage parameters</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#0D2B4E] px-3 py-1 rounded-full">
                  Step 2
                </span>
              </div>

              {/* Gross Weight Input & Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#0D2B4E] uppercase tracking-wider">
                    Gross Weight (Grams):
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xl px-3 py-1.5 shadow-xs">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      step="0.5"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value === '' ? '' : Math.max(1, Math.min(1000, parseFloat(e.target.value) || 1)))}
                      className="w-16 font-bold text-sm text-[#0D2B4E] text-center bg-transparent border-none focus:outline-none"
                    />
                    <span className="text-xs font-bold text-[#6B4B2E]">grams</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max={selectedMetal === 'silver' ? 500 : 100}
                  step="0.5"
                  value={parseFloat(weightInput) || 1}
                  onChange={(e) => setWeightInput(parseFloat(e.target.value))}
                  className="w-full accent-[#0D2B4E] cursor-pointer"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Popular:</span>
                  {quickWeightPresets.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        triggerAudio('click');
                        setWeightInput(preset);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${weightInput === preset
                        ? 'bg-[#0D2B4E] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-gray-700 border border-[#E6DFD3] hover:border-[#6B4B2E]'
                      }`}
                    >
                      {preset}g
                    </button>
                  ))}
                </div>
              </div>

              {/* Making Charges & Wastage Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
                {/* Making Charges */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-[#0D2B4E]">
                    <span>Making Charges</span>
                    <span className="text-[#6B4B2E] font-bold bg-[#6B4B2E]/10 px-2.5 py-0.5 rounded-full">{makingChargesInput}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={makingChargesInput}
                    onChange={(e) => setMakingChargesInput(parseFloat(e.target.value))}
                    className="w-full accent-[#0D2B4E] cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-500 block">Artisanal hand-filigree &amp; carving fees</span>
                </div>

                {/* Wastage */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-[#0D2B4E]">
                    <span>Wastage Allowance</span>
                    <span className="text-[#6B4B2E] font-bold bg-[#6B4B2E]/10 px-2.5 py-0.5 rounded-full">{wastageInput}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={wastageInput}
                    onChange={(e) => setWastageInput(parseFloat(e.target.value))}
                    className="w-full accent-[#0D2B4E] cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-500 block">Metal loss allowance during melting &amp; setting</span>
                </div>
              </div>

            </div>

          </div>


          {/* RIGHT COLUMN: VALUATION RECEIPT & ACTIONS (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-gradient-to-br from-[#071524] via-[#0D2B4E] to-[#071524] text-white rounded-3xl p-6 sm:p-8 border border-solid border-[#D4AF37]/35 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#6B4B2E]/20 rounded-full blur-[80px] pointer-events-none" />

              {/* Receipt Header */}
              <div className="flex justify-between items-start border-b border-white/15 pb-5 relative z-10">
                <div>
                  <span className="text-[9px] font-extrabold tracking-[0.25em] uppercase text-[#D4AF37] block">
                    LIVE ATELIER QUOTE
                  </span>
                  <h4 className="serif-luxury text-2xl font-bold text-white mt-0.5">
                    {selectedMetal === 'silver' ? '925 Fine Silver' : 'Fine Gold Bullion'}
                  </h4>
                  <span className="text-xs text-white/70 font-mono">
                    Grade: {selectedPurity} Standard
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#D4AF37]">
                  <Crown className="w-6 h-6" />
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-3.5 text-xs text-white/85 font-mono relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Pure Metal Weight:</span>
                  <span className="font-bold text-white text-sm">{weightNum} grams</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70">Spot Rate / gram:</span>
                  <span className="font-bold text-white">₹{Math.round(ratePerGram).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                  <span className="text-white/70">Pure Bullion Metal Value:</span>
                  <span className="font-bold text-white">₹{Math.round(metalValue).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70">Making Charges ({makingPct}%):</span>
                  <span className="font-bold text-white">₹{Math.round(makingAmt).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70">Wastage Factor ({wastagePct}%):</span>
                  <span className="font-bold text-white">₹{Math.round(wastageAmt).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-3 text-[#D4AF37]">
                  <span>GST (3% Official Hallmark Tax):</span>
                  <span className="font-bold">₹{Math.round(gstAmt).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Total Final Card */}
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center space-y-1 relative z-10 backdrop-blur-md">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/70 font-bold block">
                  ESTIMATED FINAL PRICE (ALL INCL.)
                </span>
                <div className="serif-luxury text-3xl sm:text-4xl font-black text-[#D4AF37] tracking-tight">
                  ₹{Math.round(calculatedFinalCost).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-white/60 font-sans block">
                  Includes pure bullion, craftsmanship, wastage &amp; GST
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2 relative z-10">
                <button
                  type="button"
                  onClick={handleShareQuote}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6B4B2E] via-[#8A6623] to-[#D4AF37] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-[0_8px_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Lock Rate via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerAudio('click');
                    navigateTo('showrooms');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all border border-solid border-white/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-[#D4AF37]" />
                  <span>Book Private Fitting Lounge</span>
                </button>
              </div>

              <div className="text-center pt-1 border-t border-white/10 relative z-10">
                <p className="text-[10px] text-white/60 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% BIS Hallmarked • Transparent Invoicing</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          PURITY & HALLMARKING TRUST GUIDELINE
          ======================================================== */}
      <section className="py-16 px-6 sm:px-12 bg-white border-t border-solid border-[#E6DFD3]">
        <div className="max-w-[1340px] mx-auto text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold tracking-[0.28em] text-[#6B4B2E] uppercase block font-sans">
              ✦ HALLMARKING PROTOCOLS ✦
            </span>
            <h2 className="serif-luxury text-3xl sm:text-4xl font-bold text-[#0D2B4E]">
              Understanding Jewellery Purity Standards
            </h2>
            <div className="w-16 h-[1.5px] bg-[#6B4B2E] mx-auto mt-2"></div>
            <p className="text-xs text-gray-600 font-medium">
              We empower every patron with crystal-clear knowledge before making a purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6DFD3] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D2B4E] text-[#D4AF37] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="serif-luxury text-base font-bold text-[#0D2B4E]">BIS Hallmark Seal</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                The triangular Bureau of Indian Standards emblem laser-stamped directly on every pure silver and gold ornament.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6DFD3] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D2B4E] text-[#D4AF37] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="serif-luxury text-base font-bold text-[#0D2B4E]">925 Sterling Standard</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Represents 92.5% pure elemental silver with 7.5% hardening alloys to create ornaments resistant to bending and tarnish.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6DFD3] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D2B4E] text-[#D4AF37] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="serif-luxury text-base font-bold text-[#0D2B4E]">Live MCX Index</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Rates are dynamically synced to the Mumbai Bullion Association &amp; Multi Commodity Exchange without arbitrary markups.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6DFD3] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D2B4E] text-[#D4AF37] flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="serif-luxury text-base font-bold text-[#0D2B4E]">Lifetime Buyback</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enjoy transparent buyback and exchange policies across all our hallmarked jewellery at prevailing market rates.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
