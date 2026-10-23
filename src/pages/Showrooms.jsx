import React from 'react';
import { MapPin, Phone, Mail, Clock, Check } from 'lucide-react';

export default function Showrooms({
  categories = [],
  loungeSuccess = false,
  consultationPassCode = '',
  consultationForm = { name: '', phone: '', date: '', type: 'Solitaire Festival Consultation' },
  setConsultationForm = () => {},
  handleLoungeBookingSubmit = (e) => e.preventDefault()
}) {
  const safeForm = consultationForm || { name: '', phone: '', date: '', type: 'Solitaire Festival Consultation' };

  return (
    <div className="transition-colors duration-500 min-h-screen pb-8 bg-[#F8F5EC] text-[#202329]">
      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12 animate-slide-up text-center">

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#0D2B4E]/5 border border-[#B09A82]/30 px-4 py-1.5 rounded-full mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D2B4E] animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#0D2B4E] font-bold">
              MANISH &amp; CO FITTING LOUNGE
            </span>
          </div>
          <h1 className="serif-luxury text-4xl sm:text-5xl font-semibold text-[#0D2B4E] leading-tight">
            Private Atelier &amp; Showroom Suite Appointments
          </h1>
          <div className="w-12 h-[1.5px] bg-[#6B4B2E] mx-auto mt-2"></div>
        </div>

        {/* Split contact forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">

          {/* Showroom metadata */}
          <div className="bg-white border border-[#E6DFD3] rounded-3xl p-8 space-y-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="serif-luxury text-xl text-[#0D2B4E] font-bold mb-4">Flagship Mau Atelier</h3>
              <div className="space-y-4 text-xs font-light text-[#657989] leading-relaxed">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#6B4B2E] shrink-0 mt-0.5" />
                  <span><strong>Showroom Address:</strong> Sanskriti Bhawan Road, Sadar Bazar, Mau, Uttar Pradesh 275101</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#6B4B2E] shrink-0 mt-0.5" />
                  <span><strong>Direct WhatsApp Concierge:</strong> +91 94516 38680</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#6B4B2E] shrink-0 mt-0.5" />
                  <span><strong>Electronic Support:</strong> manishverma.bussiness@gmail.com</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#6B4B2E] shrink-0 mt-0.5" />
                  <span><strong>Visiting Hours:</strong> Monday - Sunday (10:30 AM - 08:30 PM)</span>
                </p>
              </div>
            </div>

            <div className="border-t border-[#E6DFD3] pt-6 space-y-2 text-xs font-bold text-[#0D2B4E]">
              <p className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Secured private lounge suite key</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Personal master silversmith &amp; gemologist adviser</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>In-hand preview of complete 925 fine silver catalog</span>
              </p>
            </div>
          </div>

          {/* Consultation Booking form */}
          <div className="bg-white border border-[#E6DFD3] rounded-3xl p-8 shadow-sm space-y-4">
            <h3 className="serif-luxury text-lg text-[#0D2B4E] font-bold">Book Advisory Fitting Suite</h3>

            {loungeSuccess ? (
              <div className="bg-[#006361]/10 border border-[#006361]/20 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
                <h4 className="serif-luxury text-xl font-bold text-[#006361]">Appointment Suite Confirmed!</h4>
                <p className="text-xs text-gray-600">Your private booking pass <strong>{consultationPassCode}</strong> has been logged and sent to our showroom masters.</p>
                <div className="bg-white border border-gray-100 rounded-xl p-3 inline-block font-mono text-sm text-[#006361] font-bold">
                  {consultationPassCode}
                </div>
              </div>
            ) : (
              <form onSubmit={handleLoungeBookingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="lounge-name" className="text-[9px] uppercase tracking-wider text-[#0D2B4E] font-bold block mb-1">Patron Name</label>
                  <input
                    id="lounge-name"
                    type="text"
                    required
                    placeholder="e.g. Suryaveer Singh"
                    value={safeForm.name || ''}
                    onChange={(e) => setConsultationForm({ ...safeForm, name: e.target.value })}
                    className="w-full bg-[#F8F5EC] border border-[#E6DFD3] rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0D2B4E] focus:ring-1 focus:ring-[#0D2B4E]/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lounge-phone" className="text-[9px] uppercase tracking-wider text-[#0D2B4E] font-bold block mb-1">WhatsApp Phone</label>
                    <input
                      id="lounge-phone"
                      type="tel"
                      required
                      placeholder="e.g. 9451638680"
                      value={safeForm.phone || ''}
                      onChange={(e) => setConsultationForm({ ...safeForm, phone: e.target.value })}
                      className="w-full bg-[#F8F5EC] border border-[#E6DFD3] rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0D2B4E] focus:ring-1 focus:ring-[#0D2B4E]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="lounge-date" className="text-[9px] uppercase tracking-wider text-[#0D2B4E] font-bold block mb-1">Select Date</label>
                    <input
                      id="lounge-date"
                      type="date"
                      required
                      value={safeForm.date || ''}
                      onChange={(e) => setConsultationForm({ ...safeForm, date: e.target.value })}
                      className="w-full bg-[#F8F5EC] border border-[#E6DFD3] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#0D2B4E] focus:ring-1 focus:ring-[#0D2B4E]/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lounge-type" className="text-[9px] uppercase tracking-wider text-[#0D2B4E] font-bold block mb-1">Select Category of Interest</label>
                  <select
                    id="lounge-type"
                    value={safeForm.type || 'Solitaire Festival Consultation'}
                    onChange={(e) => setConsultationForm({ ...safeForm, type: e.target.value })}
                    className="w-full bg-[#F8F5EC] border border-[#E6DFD3] rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0D2B4E] focus:ring-1 focus:ring-[#0D2B4E]/20 transition-all cursor-pointer"
                  >
                    <option value="Solitaire Festival Consultation">Solitaire Festival Consultation</option>
                    <option value="Custom Design Consultation">Custom Design Consultation</option>
                    {Array.isArray(categories) && categories.map(cat => {
                      const catName = typeof cat === 'object' ? (cat?.name || '') : String(cat);
                      const catId = typeof cat === 'object' ? (cat?.id || catName) : cat;
                      if (!catName) return null;
                      return (
                        <option key={catId} value={catName}>{catName}</option>
                      );
                    })}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0D2B4E] hover:bg-[#091B2B] text-[#F8F5EC] font-sans font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md cursor-pointer border border-[#B09A82]/30"
                >
                  Authenticate Lounge Access
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
