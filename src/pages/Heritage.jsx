import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import heritageBg from '../assets/heritage_palace_interior.png';
import royalIndianBride from '../assets/royal_indian_bride.png';
import familySignet from '../assets/family_signet.png';
import goldKada from '../assets/gold_kada.png';
import sapphireHeritageSet from '../assets/sapphire_heritage_set.png';
import luxuryShowroom from '../assets/luxury_showroom.png';
import emeraldSovereignRing from '../assets/emerald_sovereign_ring.png';
import emeraldBridalSuite from '../assets/emerald_bridal_suite.png';
import mayuraMangalsutra from '../assets/mayura_mangalsutra.png';
import citrineFloralSet from '../assets/citrine_floral_set.png';
import udaipurFiligreeSolitaire from '../assets/udaipur_filigree_solitaire.jpg';
import diamondEmeraldChoker from '../assets/diamond_emerald_choker.png';
import silverPoojaThali from '../assets/silver_pooja_thali.png';

export default function Heritage({
  navigateTo,
  triggerAudio: triggerAudioProp,
}) {
  const triggerAudio = (type) => { try { triggerAudioProp?.(type); } catch { /* noop */ } };

  // Local state (previously passed as props)
  const [activeStoryTimeline, setActiveStoryTimeline] = useState(1996);
  const [consultationModal, setConsultationModal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isCatalogDark = false;


  return (
    <div className={`transition-colors duration-500 min-h-screen pb-8 ${isCatalogDark
      ? 'bg-[#091B2B] text-[#F8F5EC]'
      : 'bg-[#F8F5EC] text-[#0D2B4E]'
      }`}>
      {/* ==========================================
        SECTION 01: ABOUT HERO (FULL WIDTH LUXURY HERO)
        ========================================== */}
      <section
        onMouseMove={(e) => {
          const { clientX, clientY } = e;
          const x = (clientX - window.innerWidth / 2) / 35;
          const y = (clientY - window.innerHeight / 2) / 35;
          setMousePos({ x, y });
        }}
        className={`relative w-full min-h-[700px] lg:min-h-[900px] overflow-hidden flex items-center justify-center py-24 px-6 sm:px-12 border-b transition-all duration-500 select-none ${isCatalogDark ? "bg-gradient-to-br from-[#091B2B] via-[#0D2B4E]/90 to-[#091B2B]/80 text-white border-[#B09A82]/10 shadow-2xl" : "bg-gradient-to-br from-[#F8F5EC] via-[#FFFFFF] to-[#FAF8F5] text-[#0D2B4E] border-[#B09A82]/20 shadow-sm"}`}
      >
        {/* Dedicated High-Resolution Environmental Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-[10000ms] scale-105 bg-no-repeat pointer-events-none opacity-[0.45]"
          style={{
            backgroundImage: `url(${heritageBg})`,
            transform: `translate3d(${mousePos.x * 0.25}px, ${mousePos.y * 0.25}px, 0) scale(1.03)`
          }}
        />
        <div className="absolute inset-0 pointer-events-none transition-all duration-500 bg-gradient-to-r from-[#091B2B]/95 via-[#0D2B4E]/85 to-[#091B2B]/75" />

        {/* Symmetrical Centered Layout Container */}
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto w-full relative z-30 gap-12 sm:gap-16">

          {/* Centered Editorial Story Content */}
          <div className="w-full space-y-6 sm:space-y-8 flex flex-col items-center text-center justify-center animate-[slide-up_1s_ease-out_forwards]">
            <div className="flex flex-wrap gap-4 items-center justify-center pb-2 w-full">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.38em] font-extrabold text-[#B09A82] block font-sans">
                ✦ LEGACY ✦ SEVEN DECADES ✦ ROYAL LINEAGE ✦
              </span>
            </div>

            <h1 className={`serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide leading-[1.12] transition-colors duration-500 text-center w-full ${isCatalogDark ? "text-white" : "text-[#0D2B4E]"}`}>
              A Dynasty of <br />
              Master <span className="italic text-[#B09A82] font-serif font-light">Goldsmiths</span>
            </h1>

            <p className={`text-xs sm:text-sm font-light max-w-2xl leading-relaxed pt-2 tracking-wide font-sans transition-colors duration-500 text-center mx-auto ${isCatalogDark ? "text-[#F8F4EE]/90" : "text-[#0D2B4E]/80"}`}>
              MANISH & CO is a trusted beacon of fine silver & heirloom craftsmanship. For generations, our family-led maison has crafted high-luxury bridal masterworks using ancient ancestral setting techniques, hand-selected Syndicate Polki, and master-refined 22-karat bullion.
            </p>

            <div className="pt-4 flex flex-wrap gap-5 w-full justify-center">
              <button
                onClick={() => {
                  if (triggerAudio) triggerAudio('click');
                  document.getElementById('heritage-story-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-8 py-3.5 rounded-full text-[10px] sm:text-[11px] tracking-[0.2em] font-extrabold uppercase transition-all duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer focus:outline-none font-sans text-center select-none ${isCatalogDark ? "bg-white text-[#16061F] hover:bg-white/95 border border-white" : "bg-[#0D2B4E] text-white hover:bg-[#0D2B4E]/90 border border-[#0D2B4E]"}`}
              >
                Explore Our Story
              </button>
              <button
                onClick={() => {
                  if (triggerAudio) triggerAudio('shimmer');
                  document.getElementById('heritage-lounge-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-8 py-3.5 rounded-full border text-[10px] sm:text-[11px] tracking-[0.2em] font-extrabold uppercase transition-all duration-300 hover:-translate-y-0.5 cursor-pointer focus:outline-none font-sans text-center select-none ${isCatalogDark ? "border-white bg-transparent text-white hover:bg-white/10" : "border-[#0D2B4E] bg-transparent text-[#0D2B4E] hover:bg-[#0D2B4E]/5"}`}
              >
                Visit Our Lounge
              </button>
            </div>

            {/* Elite Lineage Badges */}
            <div className="border-t border-[#B09A82]/15 pt-8 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-xl select-none justify-items-center">
              <div className="flex flex-col items-center text-center gap-2">
                <svg className="w-6 h-6 text-[#B09A82] filter drop-shadow-[0_1px_3px_rgba(212,175,55,0.3)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.375.666-.375.838 0l2.14 4.67a.5.5 0 00.375.272l4.894.664c.42.057.587.61.272.905l-3.696 3.493a.5.5 0 00-.143.447l1.01 5.093c.087.439-.408.828-.78.583l-4.23-2.775a.5.5 0 00-.472 0l-4.23 2.775c-.372.245-.867-.144-.78-.583l1.01-5.093a.5.5 0 00-.143-.447L2.83 10.012c-.315-.295-.148-.848.272-.905l4.894-.664a.5.5 0 00.375-.272l2.14-4.67z" />
                </svg>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B09A82] block font-sans">74+ Years</span>
                  <span className={`text-[8px] block font-sans tracking-wide transition-colors duration-500 ${isCatalogDark ? "text-[#F8F4EE]/60" : "text-[#0D2B4E]/60"}`}>Ancestral Artistry</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-t sm:border-t-0 sm:border-l border-b border-b-transparent border-[#B09A82]/15 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                <svg className="w-6 h-6 text-[#B09A82] filter drop-shadow-[0_1px_3px_rgba(212,175,55,0.3)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B09A82] block font-sans">Pure Gold</span>
                  <span className={`text-[8px] block font-sans tracking-wide transition-colors duration-500 ${isCatalogDark ? "text-[#F8F4EE]/60" : "text-[#0D2B4E]/60"}`}>Pure 925 Silver</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-t sm:border-t-0 sm:border-l border-[#B09A82]/15 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                <svg className="w-6 h-6 text-[#B09A82] filter drop-shadow-[0_1px_3px_rgba(212,175,55,0.3)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                </svg>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B09A82] block font-sans">Masterwork</span>
                  <span className={`text-[8px] block font-sans tracking-wide transition-colors duration-500 ${isCatalogDark ? "text-[#F8F4EE]/60" : "text-[#0D2B4E]/60"}`}>Atelier Manish Verma</span>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Visual Campaign Showcase Card */}
          <div className="w-full flex justify-center items-center overflow-visible py-8 pointer-events-auto">
            <div
              className="relative w-full max-w-[280px] sm:max-w-[420px] aspect-[3/4] rounded-[2rem] sm:rounded-[2.5rem] p-2 sm:p-3 border border-[#B09A82]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-black/40 backdrop-blur-md transition-all duration-700 hover:border-[#B09A82]/70 group pointer-events-auto"
              style={{
                transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)`
              }}
            >
              {/* Concentric thin gold borders on hover */}
              <div className="absolute -inset-2 rounded-[2.25rem] sm:rounded-[2.75rem] border border-[#B09A82]/10 pointer-events-none group-hover:scale-102 transition-all duration-700 ease-out z-0"></div>
              <div className="absolute -inset-4 rounded-[2.5rem] sm:rounded-[3rem] border border-[#B09A82]/5 pointer-events-none group-hover:scale-105 transition-all duration-1000 ease-out z-0"></div>

              {/* Inner gold frame corner brackets */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#B09A82]/65 pointer-events-none rounded-tl z-20 transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />
              <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#B09A82]/65 pointer-events-none rounded-tr z-20 transition-all duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#B09A82]/65 pointer-events-none rounded-bl z-20 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#B09A82]/65 pointer-events-none rounded-br z-20 transition-all duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />

              {/* Image Container */}
              <div className="relative w-full h-full rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden bg-[#16061F]">
                <img
                  src={royalIndianBride}
                  alt="Royal Indian Bride - Heritage Bridal Campaign"
                  className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out scale-102 group-hover:scale-[1.06] filter brightness-[1.05] contrast-[1.02]"
                />
                {/* Rich luxury vignette overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/30 pointer-events-none z-10" />

                {/* Campaign Stamp/Plate at bottom */}
                <div className="absolute bottom-6 left-6 right-6 z-20 text-center space-y-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[8px] font-black tracking-[0.4em] text-[#B09A82] uppercase block">
                    Showroom Campaign 2026
                  </span>
                  <h3 className="serif-luxury text-sm font-bold text-white tracking-widest uppercase">
                    The Royal Rajputi Bride
                  </h3>
                  <div className="w-10 h-[1px] bg-[#B09A82] mx-auto opacity-75"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Heritage page body - ALWAYS light ivory */}
      <div className="bg-[#F8F5EC] text-[#0D2B4E] transition-colors duration-500 space-y-24 py-20 border-t border-[#B09A82]/20 shadow-inner">
        {/* ==========================================
          SECTION 02: OUR STORY (DYNAMIC TIMELINE & LEGACY)
          ========================================== */}
        <section id="heritage-story-section" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-8 select-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Column: Story Visual Spotlight */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="relative group overflow-hidden rounded-[2.5rem] border border-[#B09A82]/15 aspect-[4/3] sm:aspect-[1.5] shadow-lg bg-gray-50">
                {/* Glow spotlight behind image */}
                <div className="absolute -inset-1 blur-2xl bg-[#B09A82]/15 opacity-70 rounded-full z-0 pointer-events-none"></div>
                <img
                  src={
                    activeStoryTimeline === 1996
                      ? familySignet
                      : activeStoryTimeline === 2004
                        ? goldKada
                        : activeStoryTimeline === 2012
                          ? sapphireHeritageSet
                          : activeStoryTimeline === 2020
                            ? luxuryShowroom
                            : emeraldSovereignRing
                  }
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 relative z-10"
                  alt="Heritage Lineage Story"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091B2B]/50 via-transparent to-transparent z-20 pointer-events-none"></div>
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-[#091B2B]/60 backdrop-blur-md border border-[#B09A82]/30 rounded-full text-[#B09A82] text-[8px] font-black uppercase tracking-widest">
                  {
                    activeStoryTimeline === 1996 ? "THE GENESIS"
                      : activeStoryTimeline === 2004 ? "ROYAL STANDARD"
                        : activeStoryTimeline === 2012 ? "POLKI FUSION"
                          : activeStoryTimeline === 2020 ? "CREATIVE STUDIO"
                            : "DIGITAL AVANT-GARDE"
                  }
                </div>
              </div>
              <p className="text-[10px] text-center italic tracking-wide opacity-50 mt-2">
                *Actual archival workshops detailing our Mau atelier lineages.
              </p>
            </div>

            {/* Right Column: Story Copy & Interactive Timeline */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="space-y-3 flex flex-col items-center lg:items-start w-full">
                <span className="text-[9px] font-bold tracking-[0.3em] text-[#B09A82] uppercase block w-full text-center lg:text-left">
                  OUR LEGACY
                </span>
                <h2 className="serif-luxury text-3xl sm:text-5xl font-bold leading-tight w-full text-center lg:text-left">
                  Forging Masterpieces For Generations
                </h2>
                <div className="w-16 h-[1.5px] bg-[#B09A82] shadow-[0_0_8px_rgba(212,175,55,0.5)] mx-auto lg:mx-0"></div>
              </div>

              {/* Narrative copy that morphs based on selected year */}
              <div className="min-h-[160px] border border-gold/10 p-6 rounded-3xl space-y-4 shadow-inner transition-all duration-500 bg-[#0D2B4E]/5 text-left w-full">
                <h3 className="serif-luxury text-lg sm:text-xl font-bold text-[#B09A82]">
                  {activeStoryTimeline === 1996 && "1996: Foundations in Mau, Uttar Pradesh"}
                  {activeStoryTimeline === 2004 && "2004: Purity Guild & Chitai Craft"}
                  {activeStoryTimeline === 2012 && "2012: Fine Silver & Bridal Expansion"}
                  {activeStoryTimeline === 2020 && "2020: Flagship Showroom & Atelier"}
                  {activeStoryTimeline === 2026 && "Present: Nationwide 925 Hallmark Flagship"}
                </h3>
                <p className="text-xs sm:text-sm font-light leading-relaxed tracking-wide opacity-80 font-sans">
                  {activeStoryTimeline === 1996 && "Our lineage began in Mau, Uttar Pradesh, where master silversmith Manish Verma began hand-sculpting pristine silver ornaments, temple payals, and royal heirlooms with unwavering devotion to 925 purity."}
                  {activeStoryTimeline === 2004 && "The atelier institutes rigorous purity standards and established hallmark testing guidelines, pioneering trust and authenticity across Uttar Pradesh."}
                  {activeStoryTimeline === 2012 && "Introduction of signature bridal silver suites, handcrafted chokers, and certified gemstones catering to bespoke royal trousseau orders."}
                  {activeStoryTimeline === 2020 && "Inauguration of our grand flagship showroom in Mau, featuring dedicated bridal consultation lounges and masterwork viewing suites."}
                  {activeStoryTimeline === 2026 && "Transitioning to a fully accredited MANISH & CO nationwide boutique, integrating digital certification catalogs, live silver rates, and instant WhatsApp booking."}
                </p>
              </div>

              {/* Horizontal interactive timeline rail */}
              <div className="relative pt-6 w-full max-w-md sm:max-w-xl mx-auto lg:mx-0 px-2">
                {/* Connector line */}
                <div className="absolute top-[42px] left-0 right-0 h-[2px] bg-[#B09A82]/20 z-0"></div>

                {/* Interactive nodes */}
                <div className="relative z-10 flex justify-between items-center text-center w-full">
                  {[1996, 2004, 2012, 2020, 2026].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => {
                        if (triggerAudio) triggerAudio('click');
                        setActiveStoryTimeline(yr);
                        if (setTimelineAutoplay) setTimelineAutoplay(false);
                      }}
                      className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                    >
                      <span className={`text-[10px] sm:text-xs tracking-wider font-extrabold transition-all duration-300 ${activeStoryTimeline === yr ? 'text-[#B09A82] scale-110' : 'opacity-50 hover:opacity-100'
                        }`}>
                        {yr === 2026 ? 'Present' : yr}
                      </span>
                      <span className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-bold text-[9px] ${activeStoryTimeline === yr
                        ? 'bg-[#B09A82] border-[#B09A82] text-[#0D2B4E] shadow-[0_0_12px_rgba(212,175,55,0.6)] scale-110'
                        : 'bg-[#0D2B4E]/10 border-gold/30 hover:border-gold/70'
                        }`}>
                        ✦
                      </span>
                      <span className={`text-[7px] uppercase tracking-wider font-extrabold transition-all duration-300 block ${activeStoryTimeline === yr ? 'opacity-100 text-[#B09A82]' : 'opacity-0 sm:opacity-45 sm:group-hover:opacity-75'
                        }`}>
                        {yr === 1996 ? "Genesis" : yr === 2004 ? "Standard" : yr === 2012 ? "Polki" : yr === 2020 ? "Showroom" : "Lounge"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================
          SECTION 03: WHY CHOOSE US (PILLARS OF TRUST)
          ========================================== */}
        <section className="py-20 select-none border-t border-b border-[#B09A82]/10 bg-[#0D2B4E]/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16 text-center">

            {/* Heading */}
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-[9px] font-bold tracking-[0.3em] text-[#B09A82] uppercase block">
                TRUSTED SINCE 1996
              </span>
              <h2 className="serif-luxury text-3xl sm:text-5xl font-bold">
                Why Customers Trust Us
              </h2>
              <div className="w-12 h-[1px] bg-[#B09A82] mx-auto mt-2"></div>
              <p className="text-xs sm:text-sm font-light opacity-75 leading-relaxed mt-4">
                Every centerpiece from our luxury maison carries a certificate of uncompromising purity, generational promise, and dedicated concierge hospitality.
              </p>
            </div>

            {/* 6 Glass cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  num: "01",
                  title: "100% BIS Hallmarked",
                  desc: "Every gram of gold is certified under government 916 hallmarks, securing absolute bullion purity and global exchange standards."
                },
                {
                  num: "02",
                  title: "Certified Diamonds",
                  desc: "All solitaire centerpieces and diamond clusters come accompanied by internationally verified GIA, IGI, or HRD certificates."
                },
                {
                  num: "03",
                  title: "Government Approved gold",
                  desc: "We stand entirely behind our craft, guaranteeing fully authorized buybacks, exchanges, and verified valuation processes."
                },
                {
                  num: "04",
                  title: "Custom Jewellery Design",
                  desc: "Work live with our award-winning master designers to transform raw gems and concepts into bespoke hand-chiseled heirlooms."
                },
                {
                  num: "05",
                  title: "Private Viewing Lounges",
                  desc: "Book an exclusive private consultation at our flagship showroom in Mau, featuring custom design reviews and bridal styling."
                },
                {
                  num: "06",
                  title: "Lifetime Support & Polishing",
                  desc: "Compulsory annual deep steam-cleaning, fitting adjustments, and complimentary gold polish checking to keep your lineage sparkling."
                }
              ].map((card, i) => (
                <div
                  key={i}
                  className="group border border-gold/15 bg-white rounded-3xl p-6 sm:p-8 text-left space-y-4 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_15px_30px_rgba(212,175,55,0.06)] hover:border-gold/30 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[#B09A82]/10 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform"></div>

                  <div className="flex justify-between items-center">
                    <span className="serif-luxury text-sm font-bold text-[#B09A82] tracking-widest">{card.num}</span>
                    <Sparkles className="w-4 h-4 text-gold group-hover:animate-pulse" />
                  </div>

                  <h3 className="serif-luxury text-lg font-bold group-hover:text-[#B09A82] transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-light leading-relaxed tracking-wide opacity-75 font-sans">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ==========================================
          SECTION 04: CRAFTSMANSHIP SHOWCASE (ART CRAFTED BY MASTERS)
          ========================================== */}
        <section className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-8 select-none font-sans">
          <div className="space-y-12 text-center">

            {/* Heading */}
            <div className="space-y-3 max-w-xl mx-auto">
              <span className="text-[9px] font-bold tracking-[0.3em] text-[#B09A82] uppercase block">
                JAIPUR ARTISTRY
              </span>
              <h2 className="serif-luxury text-3xl sm:text-5xl font-bold">
                Art Crafted By Masters
              </h2>
              <div className="w-12 h-[1px] bg-[#B09A82] mx-auto mt-2"></div>
              <p className="text-xs opacity-75 leading-relaxed mt-2 font-sans">
                An inside glimpse of Johari handcrafting techniques refined across seven decades.
              </p>
            </div>

            {/* 6 Grid Editorial Cards with Hover Zoom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Polki Setting",
                  desc: "Raw, uncut syndicate flat-cut diamonds seated carefully inside 24K pure gold foil, reflecting an ancient Mughal royal aesthetic.",
                  img: emeraldBridalSuite
                },
                {
                  name: "Jaipur Kundan",
                  desc: "Refining molten 24K gold foil borders to envelope rubies, emeralds, or polki gems with dynamic glass-enamel backings.",
                  img: mayuraMangalsutra
                },
                {
                  name: "Nakshi Temple Carving",
                  desc: "Native chisels hand-beating solid high-carat sheet gold into heavy motifs of deities, royal peacocks, and temple architecture.",
                  img: citrineFloralSet
                },
                {
                  name: "Diamond Setting",
                  desc: "Utilizing Swiss-grade microscopes to arrange tiny brilliant-cut prongs and micro-pave solitaires into platinum bands.",
                  img: udaipurFiligreeSolitaire
                },
                {
                  name: "Artisanal Hand Engraving",
                  desc: "The legacy of fine artisanal engraving, carving microscopic floral patterns and backing them with vibrant glass pigments.",
                  img: familySignet
                },
                {
                  name: "Bespoke Gold Casting",
                  desc: "Hand pouring customized molten alloys into single-use wax molds, creating unique structures that can never be replicated.",
                  img: goldKada
                }
              ].map((craft, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl aspect-[1.1] border border-gold/10 bg-[#FAF8F5] shadow-md"
                >
                  <img
                    src={craft.img}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-50"
                    alt={craft.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091B2B]/90 via-[#091B2B]/40 to-transparent"></div>

                  {/* Hover Info Overlay */}
                  <div className="absolute bottom-5 left-6 right-6 text-left space-y-1">
                    <span className="text-[#B09A82] text-[8px] uppercase tracking-[0.25em] font-extrabold block">MASTERPIECE TECHNIQUE</span>
                    <h3 className="serif-luxury text-lg font-bold text-white group-hover:text-[#B09A82] transition-colors">{craft.name}</h3>
                    <p className="text-[11px] text-white/70 font-light leading-relaxed tracking-wide line-clamp-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500">
                      {craft.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ==========================================
          SECTION 05: OUR COLLECTIONS (PRE-NAVIGATION GALLERY)
          ========================================== */}
        <section className="py-20 select-none border-t border-b border-[#B09A82]/10 bg-[#0D2B4E]/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">

            {/* Heading */}
            <div className="space-y-3 text-center max-w-xl mx-auto">
              <span className="text-[9px] font-bold tracking-[0.3em] text-[#B09A82] uppercase block">
                THE CURATED ARCHIVES
              </span>
              <h2 className="serif-luxury text-3xl sm:text-5xl font-bold">
                Explore Our Collections
              </h2>
              <div className="w-12 h-[1px] bg-[#B09A82] mx-auto mt-2"></div>
              <p className="text-xs opacity-75 mt-2 font-sans">
                Click any curated category suite to browse specific master catalogue items directly.
              </p>
            </div>

            {/* Collections Grid with Chime navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 font-sans">
              {[
                {
                  name: "Bridal Collection",
                  count: "38 Masterpieces",
                  tag: "bridal",
                  img: emeraldBridalSuite
                },
                {
                  name: "Diamond Jewellery",
                  count: "64 Items",
                  tag: "diamond",
                  img: diamondEmeraldChoker
                },
                {
                  name: "Polki Sets",
                  count: "22 Heirloom Suites",
                  tag: "diamond",
                  img: sapphireHeritageSet
                },
                {
                  name: "Gold Collection",
                  count: "95 Certified Designs",
                  tag: "gold",
                  img: goldKada
                },
                {
                  name: "Silver Collection",
                  count: "110 Artifacts",
                  tag: "silver",
                  img: silverPoojaThali
                },
                {
                  name: "Men's Ornaments",
                  count: "18 Royal Kadas & Buttons",
                  tag: "gold",
                  img: familySignet
                },
                {
                  name: "Temple Jewels",
                  count: "30 Heavy Sets",
                  tag: "gold",
                  img: citrineFloralSet
                },
                {
                  name: "View Complete Catalog",
                  count: "350+ Centerpieces",
                  tag: "all",
                  img: royalIndianBride
                }
              ].map((col, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (triggerAudio) triggerAudio('shimmer');
                    handleCategoryNav(col.tag);
                  }}
                  className="group text-left focus:outline-none relative overflow-hidden rounded-3xl aspect-[0.9] border border-gold/10 shadow-md bg-[#0D2B4E] cursor-pointer"
                >
                  <img
                    src={col.img}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                    alt={col.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091B2B]/85 via-[#091B2B]/20 to-transparent"></div>

                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 space-y-0.5">
                    <span className="text-[6.5px] text-[#B09A82] tracking-[0.3em] font-black block uppercase">LIMITED REVERIE</span>
                    <h3 className="serif-luxury text-xs sm:text-sm font-bold text-white tracking-wide group-hover:text-[#B09A82] transition-colors line-clamp-1">{col.name}</h3>
                    <div className="flex justify-between items-center text-[8.5px] sm:text-[9px] text-white/50 pt-1.5 sm:pt-2">
                      <span>{col.count}</span>
                      <span className="text-gold tracking-widest font-black transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* ==========================================
          SECTION 06: SHOWROOM EXPERIENCE (HERITAGE LOUNGE SUITES)
          ========================================== */}
        <section id="heritage-lounge-section" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-8 select-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Side: Copy & Information Cards */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
              <div className="space-y-3 flex flex-col items-center lg:items-start w-full">
                <span className="text-[9px] font-bold tracking-[0.3em] text-[#B09A82] uppercase block w-full text-center lg:text-left">
                  BY APPOINTMENT ONLY
                </span>
                <h2 className="serif-luxury text-3xl sm:text-5xl font-bold leading-tight w-full text-center lg:text-left">
                  Visit Our Heritage Lounge
                </h2>
                <div className="w-16 h-[1.5px] bg-[#B09A82] shadow-[0_0_8px_rgba(212,175,55,0.5)] mx-auto lg:mx-0"></div>
                <p className="text-xs sm:text-sm font-light opacity-80 mt-4 leading-relaxed font-sans w-full text-center lg:text-left">
                  Register an exclusive private consultation at our flagship showroom in Mau, Uttar Pradesh for custom jewellery commissions and bespoke bridal fittings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-left">
                {[
                  { title: "Bridal Consultation", desc: "Private bridal suites dedicated to mapping grand royal trousseaus." },
                  { title: "Bespoke Custom Orders", desc: "Co-designing unique jewellery featuring custom CAD render reviews." },
                  { title: "Trousseau Styling", desc: "Dedicated jewel matchings guided by luxury fashion experts." },
                  { title: "Royal VIP Hospitality", desc: "Chauffeur pick-up and champagne catering for visiting families." }
                ].map((info, idx) => (
                  <div key={idx} className="border border-gold/10 p-5 rounded-2xl space-y-1 bg-[#0D2B4E]/5">
                    <span className="text-[9px] font-bold text-[#B09A82] block">✦ SERVICE</span>
                    <h4 className="serif-luxury text-sm font-bold">{info.title}</h4>
                    <p className="text-[11px] font-light leading-relaxed opacity-75">{info.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (triggerAudio) triggerAudio('shimmer');
                  setConsultationModal(true);
                }}
                className="px-6 py-3.5 rounded-full bg-[#6B4B2E] hover:bg-[#B09A82] text-white text-[10px] tracking-[0.2em] font-extrabold uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(107,75,46,0.35)] cursor-pointer focus:outline-none block w-full text-center sm:w-auto font-sans"
              >
                Reserve Private Viewing Suite
              </button>
            </div>

            {/* Right Side: Showcase Salon Visual */}
            <div className="lg:col-span-6">
              <div className="relative group overflow-hidden rounded-[2.5rem] border border-[#B09A82]/25 aspect-[1.3] shadow-xl">
                <img
                  src={luxuryShowroom}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  alt="Heritage Fitting Salon"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091B2B]/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-5 left-6 text-left">
                  <span className="text-[8px] tracking-[0.34em] font-black text-[#B09A82] block">FLAGSHIP SHOWROOM SUITE</span>
                  <span className="serif-luxury text-base text-white tracking-wide">Flagship Boutique Mau, Uttar Pradesh</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
