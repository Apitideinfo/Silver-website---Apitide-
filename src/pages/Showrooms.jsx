import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Check, 
  Calendar, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Share2, 
  CheckCircle2, 
  Car, 
  Coffee, 
  Gem, 
  ArrowRight 
} from 'lucide-react';
import { BUSINESS } from '../config/constants';
import luxuryShowroom from '../assets/luxury_showroom.png';
import bannerSecondStore from '../assets/banner_second_store_mau.png';

export default function Showrooms({
  navigateTo,
  triggerAudio: triggerAudioProp,
  categories = [],
  loungeSuccess: propLoungeSuccess,
  consultationPassCode: propPassCode,
  consultationForm: propForm,
  setConsultationForm: propSetForm,
  handleLoungeBookingSubmit: propHandleSubmit
}) {
  const triggerAudio = (type = 'click') => {
    try { triggerAudioProp?.(type); } catch { /* noop */ }
  };

  // Local state for smooth standalone & integrated operation
  const [formData, setFormData] = useState({
    name: propForm?.name || '',
    phone: propForm?.phone || '',
    email: '',
    date: propForm?.date || '',
    timeSlot: 'Morning (11:00 AM – 01:00 PM)',
    type: propForm?.type || 'Bespoke 925 Silver Bridal Suite',
    notes: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState(propLoungeSuccess || false);
  const [passCode, setPassCode] = useState(propPassCode || '');

  const timeSlots = [
    'Morning (11:00 AM – 01:00 PM)',
    'Afternoon (02:00 PM – 05:00 PM)',
    'Evening (05:00 PM – 08:00 PM)'
  ];

  const consultationTypes = [
    'Bespoke 925 Silver Bridal Suite',
    'Custom Design & 3D CAD Modeling',
    'Fine Silver Kadas & Curb Chains (Him)',
    'Payals, Rings & Solitaires (Her)',
    'Heritage Heirlooms & Bullion Investment',
    'Born Baby & Kids Silver Gift Sets'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerAudio('shimmer');

    // Generate VIP access key
    const randomCode = `VIP-MC-${Math.floor(1000 + Math.random() * 9000)}`;
    setPassCode(randomCode);
    setBookingSuccess(true);

    if (propSetForm) propSetForm(formData);
    if (propHandleSubmit) {
      try { propHandleSubmit(e); } catch { /* noop */ }
    }

    // Direct WhatsApp Concierge connection
    const text = `*MANISH & CO • VIP SHOWROOM APPOINTMENT PASS*\n\n*Pass Key:* ${randomCode}\n*Patron Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Date:* ${formData.date}\n*Time Slot:* ${formData.timeSlot}\n*Category of Interest:* ${formData.type}${formData.notes ? `\n*Notes:* ${formData.notes}` : ''}\n\nKindly confirm my private suite booking at the Flagship Mau Atelier!`;
    window.open(`https://wa.me/${BUSINESS.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8F5EC] text-[#202329] font-sans selection:bg-[#6B4B2E]/20 selection:text-[#091B2B]">
      <Helmet>
        <title>Showroom & VIP Consultation Suites | MANISH & CO</title>
        <meta 
          name="description" 
          content="Book a private VIP fitting consultation at MANISH & CO Flagship Showroom in Mau, Uttar Pradesh. Discover 925 fine silver heirlooms in an intimate setting." 
        />
      </Helmet>

      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 sm:px-12 bg-gradient-to-b from-[#071524] via-[#0D2B4E] to-[#091B2B] text-white text-center select-none">
        {/* Soft background ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#6B4B2E]/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-[#B09A82]/35 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-[#E6DFD3]">
              MAU FLAGSHIP ATELIER • OPEN TODAY 10:30 AM – 08:30 PM
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Private Atelier &amp; Showroom <br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F8F5EC] to-[#B09A82] bg-clip-text text-transparent italic font-serif">
                VIP Consultation Suite
              </span>
            </h1>
            <p className="text-xs sm:text-base font-light text-white/80 max-w-2xl mx-auto leading-relaxed font-sans">
              Experience the pinnacle of royal hospitality. Book a private salon suite to preview our complete 925 hallmarked sterling silver collections, discuss custom bridal CAD designs, and receive dedicated silversmith guidance.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="serif-luxury text-xl font-bold text-[#D4AF37]">Private</span>
              <span className="text-[9px] uppercase tracking-wider text-white/70 block mt-0.5">Fitting Suites</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="serif-luxury text-xl font-bold text-[#D4AF37]">1-on-1</span>
              <span className="text-[9px] uppercase tracking-wider text-white/70 block mt-0.5">Master Silversmith</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="serif-luxury text-xl font-bold text-[#D4AF37]">3D CAD</span>
              <span className="text-[9px] uppercase tracking-wider text-white/70 block mt-0.5">Custom Studio</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="serif-luxury text-xl font-bold text-[#D4AF37]">100%</span>
              <span className="text-[9px] uppercase tracking-wider text-white/70 block mt-0.5">BIS Hallmarked</span>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          MAIN SECTION: BOUTIQUE METADATA + BOOKING FORM
          ======================================================== */}
      <section className="py-20 px-6 sm:px-12 max-w-[1340px] mx-auto select-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: FLAGSHIP BOUTIQUE SHOWCASE (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Showroom Image Card */}
            <div className="bg-white rounded-3xl border border-solid border-[#E6DFD3] p-4 shadow-md overflow-hidden space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] group">
                <img 
                  src={luxuryShowroom} 
                  alt="MANISH & CO Flagship Mau Showroom" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#D4AF37] block">MAU, UTTAR PRADESH</span>
                  <h4 className="serif-luxury text-xl font-bold">The Flagship Mau Atelier</h4>
                </div>
              </div>

              {/* Contact & Hours */}
              <div className="space-y-3.5 p-2 text-xs text-[#0D2B4E]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6B4B2E]/10 flex items-center justify-center text-[#6B4B2E] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-serif text-sm">Boutique Address</strong>
                    <span className="text-gray-600 leading-relaxed">{BUSINESS.ADDRESS}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6B4B2E]/10 flex items-center justify-center text-[#6B4B2E] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-serif text-sm">Direct WhatsApp Concierge</strong>
                    <a href={`tel:${BUSINESS.PHONE_PRIMARY}`} className="text-[#6B4B2E] hover:underline font-semibold">{BUSINESS.PHONE_PRIMARY}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6B4B2E]/10 flex items-center justify-center text-[#6B4B2E] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-serif text-sm">Electronic Support</strong>
                    <a href={`mailto:${BUSINESS.EMAIL}`} className="text-gray-600 hover:underline">{BUSINESS.EMAIL}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6B4B2E]/10 flex items-center justify-center text-[#6B4B2E] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-serif text-sm">Visiting Hours</strong>
                    <span className="text-gray-600">Open 7 Days • 10:30 AM to 08:30 PM</span>
                  </div>
                </div>
              </div>

              {/* Directions Button */}
              <a
                href={BUSINESS.MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerAudio('click')}
                className="w-full py-3.5 rounded-xl bg-[#0D2B4E] hover:bg-[#071524] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>

            {/* VIP Salon Perks */}
            <div className="bg-white rounded-3xl border border-solid border-[#E6DFD3] p-6 shadow-sm space-y-4">
              <h4 className="serif-luxury text-lg font-bold text-[#0D2B4E]">Private Suite Privileges</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF8F5]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Complimentary Valet</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF8F5]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Private Lounge Pass</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF8F5]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>In-hand 925 Catalog</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF8F5]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3D CAD Live Desk</span>
                </div>
              </div>
            </div>

          </div>


          {/* RIGHT: LUXURY VIP BOOKING FORM (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-solid border-[#E6DFD3] p-6 sm:p-10 shadow-lg space-y-6">
              
              {bookingSuccess ? (
                /* SUCCESS PASS CARD */
                <div className="text-center space-y-6 py-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-200 shadow-inner">
                    <Check className="w-8 h-8" />
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#6B4B2E] block">
                      AUTHENTICATED APPOINTMENT PASS
                    </span>
                    <h3 className="serif-luxury text-3xl font-bold text-[#0D2B4E]">
                      Fitting Suite Reserved!
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans">
                      Dear <strong>{formData.name}</strong>, your private VIP suite pass has been generated and logged with our master silversmith at the Flagship Mau boutique.
                    </p>
                  </div>

                  {/* VIP Pass Badge */}
                  <div className="max-w-md mx-auto bg-gradient-to-br from-[#071524] to-[#0D2B4E] text-white p-6 rounded-3xl border border-[#D4AF37]/50 shadow-xl space-y-4 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex justify-between items-center border-b border-white/15 pb-3">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] block font-mono">MANISH &amp; CO • VIP SUITE</span>
                        <h4 className="serif-luxury text-lg font-bold">Private Atelier Booking</h4>
                      </div>
                      <Crown className="w-5 h-5 text-[#D4AF37]" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono text-white/80">
                      <div>
                        <span className="text-[9px] text-white/50 block">DATE:</span>
                        <span className="font-bold text-white">{formData.date || 'Today'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-white/50 block">SLOT:</span>
                        <span className="font-bold text-white">{formData.timeSlot.split(' ')[0]}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] text-white/50 block">CATEGORY:</span>
                        <span className="font-bold text-white">{formData.type}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                      <span className="text-[9px] text-white/50 font-mono">AUTHENTICATION KEY:</span>
                      <span className="font-mono text-base font-black text-[#D4AF37] tracking-wider bg-white/10 px-3 py-1 rounded-lg">
                        {passCode}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-4 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        triggerAudio('click');
                        const text = `*MANISH & CO • VIP SHOWROOM APPOINTMENT PASS*\n\n*Pass Key:* ${passCode}\n*Patron Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Date:* ${formData.date}\n*Slot:* ${formData.timeSlot}\n\nI look forward to visiting the Mau Showroom!`;
                        window.open(`https://wa.me/${BUSINESS.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer border-none"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Re-open WhatsApp Pass</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerAudio('click');
                        setBookingSuccess(false);
                      }}
                      className="px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border-none"
                    >
                      Book Another Date
                    </button>
                  </div>
                </div>
              ) : (
                /* BOOKING FORM */
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <div className="space-y-2 border-b border-gray-100 pb-4">
                    <div className="inline-flex items-center gap-2 text-[#6B4B2E] text-[10px] font-bold uppercase tracking-wider">
                      <Crown className="w-3.5 h-3.5" />
                      <span>VIP CONCIERGE RESERVATION</span>
                    </div>
                    <h3 className="serif-luxury text-2xl font-bold text-[#0D2B4E]">
                      Reserve Your Fitting Suite
                    </h3>
                    <p className="text-xs text-gray-500 font-sans">
                      Appointments are complimentary and include personal consultations with our master jewellers.
                    </p>
                  </div>

                  {/* Patron Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#0D2B4E] font-bold block">
                      Patron Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharani Devika Singh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B4B2E] focus:ring-1 focus:ring-[#6B4B2E]/20 transition-all"
                    />
                  </div>

                  {/* WhatsApp Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-[#0D2B4E] font-bold block">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9451638680"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B4B2E] focus:ring-1 focus:ring-[#6B4B2E]/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-[#0D2B4E] font-bold block">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. devika@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B4B2E] focus:ring-1 focus:ring-[#6B4B2E]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Preferred Date & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-[#0D2B4E] font-bold block">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#6B4B2E] focus:ring-1 focus:ring-[#6B4B2E]/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-[#0D2B4E] font-bold block">
                        Preferred Time Window *
                      </label>
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#6B4B2E] focus:ring-1 focus:ring-[#6B4B2E]/20 transition-all cursor-pointer"
                      >
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Category of Interest */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#0D2B4E] font-bold block">
                      Consultation Focus *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#6B4B2E] focus:ring-1 focus:ring-[#6B4B2E]/20 transition-all cursor-pointer"
                    >
                      {consultationTypes.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Special Notes / Requests */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#0D2B4E] font-bold block">
                      Special Design Requirements / Notes
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Looking for heavy bridal payal set with matching toe rings, or custom engraving for kada."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B4B2E] focus:ring-1 focus:ring-[#6B4B2E]/20 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0D2B4E] via-[#091B2B] to-[#0D2B4E] hover:brightness-110 active:scale-95 text-[#D4AF37] font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer border border-[#D4AF37]/35 flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4 text-[#D4AF37]" />
                    <span>Generate VIP Pass &amp; Book on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>

                  <p className="text-[10px] text-gray-400 text-center font-sans">
                    ✦ Instant reservation pass generated &bull; No deposit required
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          SECOND STORE SHOWCASE (RANIPUR MAU)
          ======================================================== */}
      <section className="pb-20 px-6 sm:px-12 max-w-[1340px] mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-solid border-[#E6DFD3] shadow-xl group hover:shadow-2xl transition-all duration-500 bg-[#091B2B]">
          <img 
            src={bannerSecondStore} 
            alt="Our Second Store in Ranipur Mau" 
            loading="lazy"
            decoding="async"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
        </div>
      </section>

    </div>
  );
}
