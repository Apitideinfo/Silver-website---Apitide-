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
  ChevronDown
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
          content="Learn about MANISH & CO, Uttar Pradesh's premier maison of BIS 925 Hallmarked Fine Silver, Polki Jadau, and Royal Heirloom jewellery crafted with generational devotion." 
        />
      </Helmet>

      {/* ========================================================
          HERO SECTION: THE ROYAL MAISON
          ======================================================== */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden bg-[#091B2B] text-white px-6 sm:px-12 py-20 text-center select-none">
        {/* Ambient Palace Interior Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity scale-105 pointer-events-none"
          style={{ backgroundImage: `url(${heritageBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#091B2B]/95 via-[#0D2B4E]/85 to-[#091B2B] pointer-events-none" />

        {/* Ambient glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6B4B2E]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6">
          {/* Top Vintage Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-solid border-[#B09A82]/30 backdrop-blur-md">
            <Crown className="w-3.5 h-3.5 text-[#B09A82]" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-[#B09A82]">
              ESTABLISHED {BUSINESS.ESTABLISHED_YEAR} • DECADES OF EXCELLENCE
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Artisanal Brilliance, <br />
            <span className="bg-gradient-to-r from-[#B09A82] via-[#E6DFD3] to-[#B09A82] bg-clip-text text-transparent italic font-serif">
              Ancestral Silver Craft &amp; Integrity
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base font-light text-white/80 max-w-2xl leading-relaxed font-sans">
            Welcome to <strong className="font-semibold text-[#B09A82]">{BUSINESS.NAME}</strong>. For decades, our family maison has sculpted fine hallmarked silver ornaments, bespoke heirloom jewellery, and certified solitaires with unwavering honesty and unmatched artistic devotion.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-4 justify-center items-center">
            <button
              onClick={() => { triggerAudio('click'); navigateTo('collections'); }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6B4B2E] to-[#B09A82] text-white font-extrabold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_25px_rgba(107,75,46,0.35)] cursor-pointer border-none"
            >
              Explore Collections
            </button>
            <button
              onClick={() => { triggerAudio('shimmer'); navigateTo('heritage'); }}
              className="px-8 py-3.5 rounded-full border border-solid border-[#B09A82]/50 text-[#B09A82] hover:bg-white/5 font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer bg-transparent"
            >
              Heritage Story
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-solid border-white/10 w-full max-w-3xl mt-6">
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B09A82]">30+</span>
              <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold mt-1">Years Heritage</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B09A82]">100%</span>
              <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold mt-1">BIS Hallmarked</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B09A82]">25,000+</span>
              <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold mt-1">Happy Families</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B09A82]">925</span>
              <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold mt-1">Sterling Purity</span>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[28px] pointer-events-none" />
              
              {/* Floating Seal */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-solid border-[#E6DFD3] shadow-lg flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#0D2B4E] flex items-center justify-center text-[#B09A82] shrink-0 font-serif font-black text-xl">
                  MC
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#202329] font-serif">{BUSINESS.FOUNDER}</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Founder &amp; Custodian of Fine Silver Traditions</p>
                </div>
              </div>
            </div>

            {/* Decorative Gold Accent Badge */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-tr from-[#6B4B2E] to-[#B09A82] rounded-full flex flex-col items-center justify-center text-white shadow-xl font-sans text-center p-2 border-2 border-white">
              <span className="text-[8px] font-extrabold uppercase tracking-widest leading-tight">SINCE</span>
              <span className="font-serif font-black text-base leading-none">{BUSINESS.ESTABLISHED_YEAR}</span>
              <span className="text-[7px] font-bold uppercase tracking-wider">MAU</span>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold tracking-[0.25em] text-[#6B4B2E] uppercase block font-sans">
                ✦ OUR ORIGINS &amp; PHILOSOPHY
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#091B2B] leading-tight">
                Where Heritage Silversmithing Meets Modern Elegance
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              Rooted in the cultural heart of Mau, Uttar Pradesh, <strong className="text-[#091B2B] font-semibold">{BUSINESS.NAME}</strong> was founded on the principle that fine jewellery is not merely an accessory, but a timeless expression of identity, grace, and cherished memories.
            </p>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              Over the decades, guided by our founding vision, our boutique has established an enviable reputation for purist 925 hallmarked sterling silver, handcrafted payals, imperial chains, and heirloom bridal ornaments celebrated across Uttar Pradesh and beyond.
            </p>

            {/* Three Key Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-solid border-[#E6DFD3] shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#6B4B2E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#091B2B]">Ancestral Handcrafted Artistry</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Authentic filigree, engraving, and setting techniques perfected over generations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-solid border-[#E6DFD3] shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#6B4B2E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#091B2B]">100% Guaranteed Purity</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Every piece is certified with government BIS Hallmark ensuring uncompromised grade purity.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-solid border-[#E6DFD3] shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#6B4B2E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#091B2B]">Uncompromising Transparent Pricing</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Clear invoices separating net silver weight, gemstone value, making charges, and taxes.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          SECTION 03: THE 4 PILLARS OF TRUST
          ======================================================== */}
      <section className="py-16 px-6 sm:px-12 bg-white border-y border-solid border-[#E6DFD3]">
        <div className="max-w-[1340px] mx-auto text-center space-y-12">
          
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#6B4B2E] uppercase block font-sans">
              ✦ WHY CLIENTS CHOOSE MANISH &amp; CO
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#091B2B]">
              The Four Pillars of Our Promise
            </h2>
            <p className="text-xs text-gray-600 font-medium">
              Every purchase at MANISH &amp; CO is protected by a lifelong bond of authenticity, purity, and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* Pillar 1 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-solid border-[#E6DFD3] hover:border-[#6B4B2E]/50 hover:shadow-lg transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0D2B4E] flex items-center justify-center text-[#B09A82]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#091B2B]">
                100% BIS Hallmarked
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Strict adherence to government hallmarking standards ensuring pure 925 sterling silver and certified precious bullion.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-solid border-[#E6DFD3] hover:border-[#6B4B2E]/50 hover:shadow-lg transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0D2B4E] flex items-center justify-center text-[#B09A82]">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#091B2B]">
                Curated Natural Gemstones
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Hand-inspected, ethically sourced semi-precious and precious gemstones selected for superior brilliance, cut, and color.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-solid border-[#E6DFD3] hover:border-[#6B4B2E]/50 hover:shadow-lg transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0D2B4E] flex items-center justify-center text-[#B09A82]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#091B2B]">
                Complete Transparent Billing
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Zero hidden costs. Invoices transparently detail net metal weight, stone charges, nominal making fees, and GST.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-solid border-[#E6DFD3] hover:border-[#6B4B2E]/50 hover:shadow-lg transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0D2B4E] flex items-center justify-center text-[#B09A82]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#091B2B]">
                Lifetime Exchange &amp; Value
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
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
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#6B4B2E] uppercase block font-sans">
            ✦ FROM SKETCH TO MASTERWORK
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#091B2B]">
            The Journey of Master Craftsmanship
          </h2>
          <p className="text-xs text-gray-600 font-medium">
            Discover how pure silver and stones transform into heirloom ornaments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          
          <div className="p-6 rounded-2xl bg-white border border-solid border-[#E6DFD3] relative space-y-3 shadow-xs">
            <span className="font-serif text-3xl font-black text-[#6B4B2E]/30 block">01</span>
            <h4 className="font-serif text-sm font-bold text-[#091B2B]">Design &amp; Conceptualization</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every creation begins with hand-drawn motifs and high-precision CAD sculpting to achieve timeless silhouette and balance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-solid border-[#E6DFD3] relative space-y-3 shadow-xs">
            <span className="font-serif text-3xl font-black text-[#6B4B2E]/30 block">02</span>
            <h4 className="font-serif text-sm font-bold text-[#091B2B]">925 Pure Silver Refining</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Certified pure silver is blended to 92.5% sterling grade with copper alloys for optimal durability and radiant luster.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-solid border-[#E6DFD3] relative space-y-3 shadow-xs">
            <span className="font-serif text-3xl font-black text-[#6B4B2E]/30 block">03</span>
            <h4 className="font-serif text-sm font-bold text-[#091B2B]">Hand Setting &amp; Filigree</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Artisans hand-set each stone, bezel, and delicate link with precision instruments and ancestral soldering expertise.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-solid border-[#E6DFD3] relative space-y-3 shadow-xs">
            <span className="font-serif text-3xl font-black text-[#6B4B2E]/30 block">04</span>
            <h4 className="font-serif text-sm font-bold text-[#091B2B]">High-Lustre Polishing &amp; Hallmark</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Hand-buffed with anti-tarnish rhodium coating, micro-inspected, and laser hallmarked with government certification.
            </p>
          </div>

        </div>
      </section>


      {/* ========================================================
          SECTION 05: SHOWROOM BOUTIQUE & CONTACT DETAILS
          ======================================================== */}
      <section className="py-16 px-6 sm:px-12 bg-[#091B2B] text-white">
        <div className="max-w-[1340px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#B09A82] uppercase block font-sans">
                ✦ VISIT OUR SHOWROOM
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                Experience Luxury at Our Flagship Showroom in Mau
              </h2>
              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                Step into a world of curated elegance. Our flagship boutique houses private consultation lounges and our complete fine silver collections.
              </p>
            </div>

            <div className="space-y-4 text-xs text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#B09A82] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Flagship Boutique</strong>
                  <span>{BUSINESS.ADDRESS}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#B09A82] shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Direct Phone &amp; WhatsApp</strong>
                  <a href={`tel:${BUSINESS.PHONE_PRIMARY}`} className="hover:text-[#B09A82] transition-colors">{BUSINESS.PHONE_PRIMARY}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#B09A82] shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Official Email</strong>
                  <a href={`mailto:${BUSINESS.EMAIL}`} className="hover:text-[#B09A82] transition-colors">{BUSINESS.EMAIL}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#B09A82] shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Boutique Timings</strong>
                  <span>Open Daily: 10:30 AM to 08:30 PM (All 7 Days)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href={BUSINESS.MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#6B4B2E] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Get Directions
              </a>
              <a
                href={`https://wa.me/${BUSINESS.WHATSAPP_NUMBER}?text=Hello%20MANISH%20%26%20CO,%20I%20would%20like%20to%20schedule%20a%20showroom%20visit.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all border border-solid border-white/20 flex items-center gap-2"
              >
                Book Appointment
              </a>
            </div>
          </div>

          {/* Showroom Showcase Image */}
          <div className="rounded-3xl overflow-hidden border border-solid border-white/10 shadow-2xl">
            <img 
              src={luxuryShowroom} 
              alt="MANISH & CO Flagship Showroom Mau" 
              loading="lazy"
              decoding="async"
              className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-700" 
            />
          </div>

        </div>
      </section>

      {/* ========================================================
          OUR SECOND STORE: RANIPUR MAU SHOWCASE
          ======================================================== */}
      <section className="pb-16 px-6 sm:px-12 max-w-[1340px] mx-auto">
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
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#6B4B2E] uppercase block font-sans">
            ✦ TRANSPARENCY &amp; CLARITY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#091B2B]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-600 font-medium">
            Everything you need to know about purchasing and certifying jewellery with us.
          </p>
        </div>

        <div className="space-y-3 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-solid border-[#E6DFD3] overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left cursor-pointer border-none bg-transparent"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#091B2B] font-serif">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#6B4B2E] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
      <section className="pb-16 px-6 sm:px-12 max-w-[1340px] mx-auto">
        <div className="bg-gradient-to-r from-[#091B2B] via-[#0D2B4E] to-[#091B2B] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden border border-solid border-[#B09A82]/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#6B4B2E]/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Begin Your Bespoke Jewellery Journey
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
              Whether you are selecting a wedding bridal piece, a pure silver gift, or a custom order, our master artisans are at your service.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center relative z-10 pt-2">
            <button
              onClick={() => { triggerAudio('click'); navigateTo('collections'); }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6B4B2E] to-[#B09A82] text-white font-extrabold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer border-none"
            >
              Browse Catalog
            </button>
            <a
              href={`https://wa.me/${BUSINESS.WHATSAPP_NUMBER}?text=Hello%20MANISH%20%26%20CO,%20I%20would%20like%20to%20know%20more%20about%20your%20custom%20designs.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-[#B09A82] font-extrabold text-xs uppercase tracking-widest border border-solid border-[#B09A82]/40 transition-all"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
