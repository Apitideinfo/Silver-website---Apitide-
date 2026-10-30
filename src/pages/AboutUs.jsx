import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, 
  Gem, 
  Award, 
  Sparkles, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  HeartHandshake, 
  Crown, 
  Layers, 
  HelpCircle,
  ChevronDown,
  Compass,
  Star,
  Flame,
  Check
} from 'lucide-react';
import { BUSINESS } from '../config/constants';

import hrLogo from '../assets/logo_new.png';
import heritageBg from '../assets/heritage_palace_interior.png';
import royalBride from '../assets/royal_indian_bride.png';
import aboutHeritageModern from '../assets/about_heritage_modern.jpeg';
import luxuryShowroom from '../assets/luxury_showroom.png';
import kadaImg from '../assets/gold_kada.png';
import solitaireImg from '../assets/solitaries.png';
import bannerSecondStore from '../assets/banner_second_store_mau.png';
import bannerStoreBanner from '../assets/banner_store_banner.png';

export default function AboutUs({ navigateTo, triggerAudio: triggerAudioProp }) {
  const triggerAudio = (type = 'click') => {
    try { triggerAudioProp?.(type); } catch { /* noop */ }
  };

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    triggerAudio('click');
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "How do I verify the authenticity and purity of MANISH & CO silver and gold?",
      a: "Every single piece of silver and gold jewellery created by MANISH & CO is 100% BIS Hallmarked (925 sterling purity for silver, 916/750 for gold), featuring the official BIS triangular logo, purity mark, and traceable certification ensuring generational trust."
    },
    {
      q: "Can I order customized bespoke bridal and heritage jewellery?",
      a: "Yes! Our master silversmiths and artisans work directly with you to craft bespoke bridal sets, polki jadau necklaces, silver payals, and antique heirloom designs tailored precisely to your personal sketches, weight preferences, and gemstone choices."
    },
    {
      q: "How do I care for and maintain 925 Sterling Silver jewellery?",
      a: "All MANISH & CO sterling silver pieces feature an anti-tarnish rhodium or royal gold protective finish. Store your jewellery in the provided airtight velvet box, away from direct perfumes and harsh moisture, and gently clean with a soft microfibre cloth to maintain its enduring shine."
    },
    {
      q: "Do you offer virtual video consultations for distant or NRI clients?",
      a: "Yes, we host dedicated one-on-one virtual appointments via video call where our senior jewellery consultants showcase live collections, weight certifications, and detailed specifications directly from our flagship Mau boutique."
    },
    {
      q: "What is your lifetime exchange and buyback policy?",
      a: "We offer a transparent lifetime exchange and buyback guarantee on all our BIS Hallmarked silver, gold, and certified gemstone jewellery based on prevalent market metal rates and transparent minimal deductions."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EC] text-[#202329] font-sans selection:bg-[#6B4B2E]/20 selection:text-[#091B2B]">
      <Helmet>
        <title>About Us | MANISH & CO - Fine Silver Jewellery & Heirlooms</title>
        <meta 
          name="description" 
          content="Discover MANISH & CO, Uttar Pradesh's premier maison of BIS 925 Hallmarked Fine Silver, Polki Jadau, and Royal Heirloom jewellery crafted with generational devotion since 1996." 
        />
      </Helmet>

      {/* ========================================================
          HERO SECTION: THE ROYAL MAISON
          ======================================================== */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden bg-[#071524] text-white px-6 sm:px-12 py-24 text-center select-none">
        {/* Ambient Palace Interior Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
          style={{ backgroundImage: `url(${heritageBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071524]/95 via-[#0D2B4E]/80 to-[#071524] pointer-events-none" />

        {/* Ambient glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[#6B4B2E]/25 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6">
          {/* Top Vintage Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-[#B09A82]/35 backdrop-blur-md shadow-lg">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-[#E6DFD3]">
              ESTABLISHED 1996 • THREE DECADES OF TRUST
            </span>
          </div>

          {/* Headline */}
          <h1 className="serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.14]">
            Artisanal Brilliance, <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F8F5EC] to-[#B09A82] bg-clip-text text-transparent italic font-serif">
              Ancestral Silver Craft &amp; Integrity
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base font-light text-white/80 max-w-2xl leading-relaxed font-sans">
            Welcome to <strong className="font-semibold text-[#D4AF37]">{BUSINESS.NAME}</strong>. Founded in 1996 in Mau, Uttar Pradesh, our family atelier sculpts certified 925 sterling silver ornaments, royal bridal suites, and imperial heirlooms with unwavering purity and bespoke artisanal precision.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-4 justify-center items-center">
            <button
              onClick={() => { triggerAudio('click'); navigateTo('collections'); }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6B4B2E] via-[#8A6623] to-[#B09A82] text-white font-extrabold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_25px_rgba(107,75,46,0.45)] cursor-pointer border-none flex items-center gap-2"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { triggerAudio('shimmer'); navigateTo('heritage'); }}
              className="px-8 py-3.5 rounded-full border border-solid border-[#B09A82]/50 text-[#E6DFD3] hover:bg-white/10 hover:border-[#D4AF37] font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer bg-white/[0.03] backdrop-blur-sm"
            >
              Heritage Story (1996–Present)
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-solid border-white/15 w-full max-w-3xl mt-6">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <span className="serif-luxury text-2xl sm:text-3xl font-bold text-[#D4AF37]">1996</span>
              <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold mt-1">Founded in Mau</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <span className="serif-luxury text-2xl sm:text-3xl font-bold text-[#D4AF37]">100%</span>
              <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold mt-1">BIS 925 Hallmarked</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <span className="serif-luxury text-2xl sm:text-3xl font-bold text-[#D4AF37]">30,000+</span>
              <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold mt-1">Patron Families</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <span className="serif-luxury text-2xl sm:text-3xl font-bold text-[#D4AF37]">925</span>
              <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold mt-1">Pristine Sterling</span>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          SECTION 02: THE FOUNDING STORY & VISION
          ======================================================== */}
      <section className="py-20 px-6 sm:px-12 max-w-[1340px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Visual Showcase Frame */}
          <div className="relative mx-auto max-w-[480px] w-full">
            <div className="relative rounded-[28px] overflow-hidden border border-solid border-[#E6DFD3] shadow-2xl bg-white p-3">
              <img 
                src={aboutHeritageModern} 
                alt="MANISH & CO - Where Heritage Silversmithing Meets Modern Elegance" 
                loading="lazy"
                decoding="async"
                className="w-full h-[460px] object-cover object-top rounded-[22px]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-[28px] pointer-events-none" />
              
              {/* Floating Seal */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-solid border-[#E6DFD3] shadow-lg flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#0D2B4E] flex items-center justify-center text-[#D4AF37] shrink-0 serif-luxury font-black text-xl shadow-sm">
                  MC
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#091B2B] font-serif">{BUSINESS.FOUNDER}</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Founder &amp; Master Silversmith • Mau Atelier</p>
                </div>
              </div>
            </div>

            {/* Decorative Gold Accent Badge */}
            <div className="absolute -top-4 -right-4 w-22 h-22 bg-gradient-to-tr from-[#6B4B2E] via-[#8A6623] to-[#D4AF37] rounded-full flex flex-col items-center justify-center text-white shadow-xl font-sans text-center p-2 border-2 border-white">
              <span className="text-[8px] font-extrabold uppercase tracking-widest leading-tight">SINCE</span>
              <span className="serif-luxury font-black text-lg leading-none">1996</span>
              <span className="text-[7px] font-bold uppercase tracking-wider">MAU, UP</span>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold tracking-[0.25em] text-[#6B4B2E] uppercase block font-sans">
                ✦ OUR ORIGINS &amp; PHILOSOPHY
              </span>
              <h2 className="serif-luxury text-3xl sm:text-4xl font-bold text-[#091B2B] leading-tight">
                Where Heritage Silversmithing Meets Modern Elegance
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              Rooted in the cultural heart of Mau, Uttar Pradesh since 1996, <strong className="text-[#091B2B] font-semibold">{BUSINESS.NAME}</strong> was founded on the principle that fine jewellery is not merely an accessory, but a sacred expression of lineage, grace, and cherished memories.
            </p>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              Over the past three decades, our flagship boutique has established an unassailable reputation for 100% BIS hallmarked 925 sterling silver, hand-sculpted bridal payals, royal kadas, masculine chains, and heirloom polki suites celebrated by families across Uttar Pradesh and throughout India.
            </p>

            {/* Three Key Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-solid border-[#E6DFD3] shadow-xs hover:border-[#6B4B2E]/40 transition-all">
                <div className="w-8 h-8 rounded-xl bg-[#6B4B2E]/10 flex items-center justify-center text-[#6B4B2E] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-[#6B4B2E]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#091B2B]">Ancestral Handcrafted Artistry</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Authentic filigree, hand-hammered Chitai, and master setting techniques preserved across decades.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-solid border-[#E6DFD3] shadow-xs hover:border-[#6B4B2E]/40 transition-all">
                <div className="w-8 h-8 rounded-xl bg-[#6B4B2E]/10 flex items-center justify-center text-[#6B4B2E] shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-[#6B4B2E]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#091B2B]">100% Guaranteed BIS Hallmarked Purity</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Every creation is certified with government BIS Hallmark ensuring verified 925 silver and genuine bullion.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-solid border-[#E6DFD3] shadow-xs hover:border-[#6B4B2E]/40 transition-all">
                <div className="w-8 h-8 rounded-xl bg-[#6B4B2E]/10 flex items-center justify-center text-[#6B4B2E] shrink-0 mt-0.5">
                  <Crown className="w-5 h-5 text-[#6B4B2E]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#091B2B]">Uncompromising Transparent Pricing</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Clear invoices separating net silver weight, gemstone value, nominal making fees, and GST.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          SECTION 03: THE 4 PILLARS OF TRUST
          ======================================================== */}
      <section className="py-20 px-6 sm:px-12 bg-white border-y border-solid border-[#E6DFD3]">
        <div className="max-w-[1340px] mx-auto text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold tracking-[0.28em] text-[#6B4B2E] uppercase block font-sans">
              ✦ WHY PATRONS CHOOSE MANISH &amp; CO ✦
            </span>
            <h2 className="serif-luxury text-3xl sm:text-4xl font-bold text-[#091B2B]">
              The Four Pillars of Our Promise
            </h2>
            <div className="w-16 h-[1.5px] bg-[#6B4B2E] mx-auto mt-2"></div>
            <p className="text-xs text-gray-600 font-medium">
              Every purchase at MANISH &amp; CO is fortified by a lifelong bond of authenticity, purity, and absolute transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* Pillar 1 */}
            <div className="group bg-[#FAF8F5] p-7 rounded-3xl border border-solid border-[#E6DFD3] hover:border-[#6B4B2E] hover:shadow-[0_12px_30px_rgba(107,75,46,0.12)] transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D2B4E] flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="serif-luxury text-lg font-bold text-[#091B2B]">
                100% BIS Hallmarked
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Strict adherence to government hallmarking standards ensuring pure 925 sterling silver and certified precious bullion.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group bg-[#FAF8F5] p-7 rounded-3xl border border-solid border-[#E6DFD3] hover:border-[#6B4B2E] hover:shadow-[0_12px_30px_rgba(107,75,46,0.12)] transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D2B4E] flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="serif-luxury text-lg font-bold text-[#091B2B]">
                Curated Natural Gemstones
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Hand-inspected, ethically sourced semi-precious and precious gemstones selected for superior brilliance, cut, and color.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group bg-[#FAF8F5] p-7 rounded-3xl border border-solid border-[#E6DFD3] hover:border-[#6B4B2E] hover:shadow-[0_12px_30px_rgba(107,75,46,0.12)] transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D2B4E] flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="serif-luxury text-lg font-bold text-[#091B2B]">
                Complete Transparent Billing
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Zero hidden costs. Invoices transparently detail net metal weight, stone charges, nominal making fees, and GST.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="group bg-[#FAF8F5] p-7 rounded-3xl border border-solid border-[#E6DFD3] hover:border-[#6B4B2E] hover:shadow-[0_12px_30px_rgba(107,75,46,0.12)] transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D2B4E] flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="serif-luxury text-lg font-bold text-[#091B2B]">
                Lifetime Exchange &amp; Value
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Hassle-free upgrades and buyback policy on hallmarked silver and gold at prevalent daily market rates.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          SECTION 04: CRAFTSMANSHIP JOURNEY
          ======================================================== */}
      <section className="py-20 px-6 sm:px-12 max-w-[1340px] mx-auto text-center space-y-12">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold tracking-[0.28em] text-[#6B4B2E] uppercase block font-sans">
            ✦ FROM SKETCH TO MASTERWORK ✦
          </span>
          <h2 className="serif-luxury text-3xl sm:text-4xl font-bold text-[#091B2B]">
            The Journey of Master Craftsmanship
          </h2>
          <div className="w-16 h-[1.5px] bg-[#6B4B2E] mx-auto mt-2"></div>
          <p className="text-xs text-gray-600 font-medium">
            Discover how pure 925 silver bullion transforms into precious family heirlooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          
          <div className="p-7 rounded-3xl bg-white border border-solid border-[#E6DFD3] relative space-y-3 shadow-xs hover:border-[#6B4B2E]/40 hover:shadow-md transition-all">
            <span className="serif-luxury text-4xl font-black text-[#6B4B2E]/25 block">01</span>
            <h4 className="serif-luxury text-base font-bold text-[#091B2B]">Design &amp; Conceptualization</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Every creation begins with hand-drawn motifs and high-precision CAD sculpting to achieve timeless silhouette and balance.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-solid border-[#E6DFD3] relative space-y-3 shadow-xs hover:border-[#6B4B2E]/40 hover:shadow-md transition-all">
            <span className="serif-luxury text-4xl font-black text-[#6B4B2E]/25 block">02</span>
            <h4 className="serif-luxury text-base font-bold text-[#091B2B]">925 Pure Silver Refining</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Certified pure silver is blended to 92.5% sterling grade with copper alloys for optimal durability and radiant luster.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-solid border-[#E6DFD3] relative space-y-3 shadow-xs hover:border-[#6B4B2E]/40 hover:shadow-md transition-all">
            <span className="serif-luxury text-4xl font-black text-[#6B4B2E]/25 block">03</span>
            <h4 className="serif-luxury text-base font-bold text-[#091B2B]">Hand Setting &amp; Filigree</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Artisans hand-set each stone, bezel, and delicate link with precision instruments and ancestral soldering expertise.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-solid border-[#E6DFD3] relative space-y-3 shadow-xs hover:border-[#6B4B2E]/40 hover:shadow-md transition-all">
            <span className="serif-luxury text-4xl font-black text-[#6B4B2E]/25 block">04</span>
            <h4 className="serif-luxury text-base font-bold text-[#091B2B]">High-Lustre Polishing &amp; Hallmark</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Hand-buffed with anti-tarnish rhodium coating, micro-inspected, and laser hallmarked with government certification.
            </p>
          </div>

        </div>
      </section>


      {/* ========================================================
          SECTION 05: SHOWROOM BOUTIQUE & CONTACT DETAILS
          ======================================================== */}
      <section className="py-20 px-6 sm:px-12 bg-[#091B2B] text-white">
        <div className="max-w-[1340px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-left">
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold tracking-[0.28em] text-[#D4AF37] uppercase block font-sans">
                ✦ VISIT OUR FLAGSHIP ATELIER ✦
              </span>
              <h2 className="serif-luxury text-3xl sm:text-4xl font-bold text-white leading-tight">
                Experience Luxury at Our Flagship Showroom in Mau
              </h2>
              <div className="w-16 h-[1.5px] bg-[#D4AF37] mt-2"></div>
              <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed font-sans">
                Step into a world of curated elegance. Our flagship boutique houses private consultation lounges, a 3D CAD design desk, and our complete 925 fine silver collections.
              </p>
            </div>

            <div className="space-y-4 text-xs text-white/80">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm font-serif">Flagship Mau Boutique</strong>
                  <span className="text-white/70">{BUSINESS.ADDRESS}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="text-white block text-sm font-serif">Direct WhatsApp Concierge</strong>
                  <a href={`tel:${BUSINESS.PHONE_PRIMARY}`} className="hover:text-[#D4AF37] text-white/80 transition-colors">{BUSINESS.PHONE_PRIMARY}</a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="text-white block text-sm font-serif">Electronic Mail</strong>
                  <a href={`mailto:${BUSINESS.EMAIL}`} className="hover:text-[#D4AF37] text-white/80 transition-colors">{BUSINESS.EMAIL}</a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="text-white block text-sm font-serif">Boutique Timings</strong>
                  <span className="text-white/70">Open Daily: 10:30 AM to 08:30 PM (All 7 Days)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href={BUSINESS.MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6B4B2E] to-[#8A6623] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
              >
                <MapPin className="w-4 h-4" /> Get Directions
              </a>
              <a
                href={`https://wa.me/${BUSINESS.WHATSAPP_NUMBER}?text=Hello%20MANISH%20%26%20CO,%20I%20would%20like%20to%20schedule%20a%20showroom%20visit.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all border border-solid border-white/20 flex items-center gap-2"
              >
                Book Private Suite
              </a>
            </div>
          </div>

          {/* Showroom Showcase Image */}
          <div className="rounded-3xl overflow-hidden border border-solid border-white/15 shadow-2xl relative group">
            <img 
              src={luxuryShowroom} 
              alt="MANISH & CO Flagship Showroom Mau" 
              loading="lazy"
              decoding="async"
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-xs text-white">
              <span className="font-bold text-[#D4AF37] block font-serif text-sm">Flagship Mau Lounge</span>
              <span>Personalized consultations for bridal trousseau &amp; custom silversmithing.</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          OUR SECOND STORE: RANIPUR MAU SHOWCASE
          ======================================================== */}
      <section className="py-16 px-6 sm:px-12 max-w-[1340px] mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-solid border-[#E6DFD3] shadow-xl group hover:shadow-2xl transition-all duration-500 bg-[#091B2B]">
          <img 
            src={bannerSecondStore} 
            alt="Our Second Store Now in Ranipur Mau - Rishu Jewellers & Shivangi Garments Collection" 
            loading="lazy"
            decoding="async"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
        </div>
      </section>


      {/* ========================================================
          SECTION 06: FREQUENTLY ASKED QUESTIONS (FAQ)
          ======================================================== */}
      <section className="py-20 px-6 sm:px-12 max-w-[900px] mx-auto text-center space-y-10">
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold tracking-[0.28em] text-[#6B4B2E] uppercase block font-sans">
            ✦ TRANSPARENCY &amp; CLARITY ✦
          </span>
          <h2 className="serif-luxury text-3xl sm:text-4xl font-bold text-[#091B2B]">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-[1.5px] bg-[#6B4B2E] mx-auto mt-2"></div>
          <p className="text-xs text-gray-600 font-medium font-sans">
            Everything you need to know about purchasing, certifying, and caring for your jewellery.
          </p>
        </div>

        <div className="space-y-3.5 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl border transition-all duration-300 shadow-xs ${isOpen ? 'border-[#6B4B2E] shadow-md' : 'border-[#E6DFD3] hover:border-gray-300'}`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left cursor-pointer border-none bg-transparent"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#091B2B] font-serif">{faq.q}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#6B4B2E]/10' : 'bg-gray-100'}`}>
                    <ChevronDown className="w-4 h-4 text-[#6B4B2E]" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-solid border-gray-100 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          STORE BANNER (SHREE HARI) - EDGE TO EDGE SIDE BY SIDE
          ======================================================== */}
      <section className="w-full pb-16 text-center overflow-hidden">
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
            decoding="async"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
        </a>
      </section>


      {/* ========================================================
          SECTION 07: BOTTOM CTA BANNER
          ======================================================== */}
      <section className="pb-20 px-6 sm:px-12 max-w-[1340px] mx-auto">
        <div className="bg-gradient-to-r from-[#071524] via-[#0D2B4E] to-[#071524] rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 relative overflow-hidden border border-solid border-[#D4AF37]/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#6B4B2E]/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="serif-luxury text-3xl sm:text-4xl font-bold leading-tight">
              Begin Your Bespoke Jewellery Journey
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed font-sans">
              Whether you are selecting a wedding bridal piece, a pure silver gift, or a custom order, our master artisans are at your service.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center relative z-10 pt-2">
            <button
              onClick={() => { triggerAudio('click'); navigateTo('collections'); }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6B4B2E] via-[#8A6623] to-[#D4AF37] text-white font-extrabold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer border-none"
            >
              Browse Catalog
            </button>
            <a
              href={`https://wa.me/${BUSINESS.WHATSAPP_NUMBER}?text=Hello%20MANISH%20%26%20CO,%20I%20would%20like%20to%20know%20more%20about%20your%20custom%20designs.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-[#D4AF37] font-extrabold text-xs uppercase tracking-widest border border-solid border-[#D4AF37]/40 transition-all"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
