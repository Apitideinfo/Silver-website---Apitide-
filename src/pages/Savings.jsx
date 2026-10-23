import React, { useState, useEffect } from 'react';
import { useSavings } from '../contexts/SavingsContext';
import bannerSavings11_1 from '../assets/banner_savings_11_1.webp';

export default function Savings({
  triggerAudio,
  navigateTo
}) {
  const {
    monthlySavingsInput,
    setMonthlySavingsInput,
    savingsForm,
    setSavingsForm,
    setSavingsSchemeType
  } = useSavings();

  const savingsSchemeType = 'Gold Mine';

  useEffect(() => {
    setSavingsSchemeType('Gold Mine');
  }, [setSavingsSchemeType]);

  const [erdTooltip, setErdTooltip] = useState(null); // '6th' | '8th' | null


  return (
    <>
      {/* MOBILE VIEW */}
      <div className="lg:hidden bg-white min-h-screen pb-24 text-[#1B1B1B]">
        {/* FULL WIDTH BANNER */}
        <div className="w-full aspect-[2400/778] overflow-hidden bg-[#fdf5ee]">
          <img
            src={bannerSavings11_1}
            alt="Gold Mine 11+1 Plan"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* QUICK ENROLL CARD (HR Jewellers & Sons Style) */}
        <div className="w-full bg-[#FCFAFF] py-6 px-4">
          <div className="max-w-md mx-auto bg-white border border-gray-150 rounded-2xl shadow-[0_8px_30px_rgba(63,31,84,0.05)] p-5 space-y-4">
            <h3 className="text-center text-[13.5px] font-bold text-[#1B3152] font-sans tracking-wide">
              Pay 11 installments, get <span className="text-[#E54E38]">100% OFF</span> on 12th installment!
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-semibold text-left">Enter Monthly Amount</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={monthlySavingsInput}
                  onChange={(e) => setMonthlySavingsInput(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#E54E38] transition-all bg-[#FCFAFF]"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-semibold text-left">Enter Email ID</label>
                <input
                  type="email"
                  placeholder="e.g. patron@mail.com"
                  value={savingsForm.email}
                  onChange={(e) => setSavingsForm({ ...savingsForm, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#E54E38] transition-all bg-[#FCFAFF]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (triggerAudio) triggerAudio('shimmer');
                navigateTo('savings-enroll');
              }}
              className="w-full py-3.5 rounded-lg bg-[#E54E38] hover:bg-[#c83d28] text-white text-xs uppercase font-extrabold tracking-widest transition-all cursor-pointer shadow-md active:scale-95 border-none"
            >
              Start Now
            </button>

            <div className="text-center space-y-1.5 pt-2">
              <button
                onClick={() => {
                  if (triggerAudio) triggerAudio('click');
                  navigateTo('savings-enroll');
                }}
                className="text-[11px] text-gray-500 hover:text-[#E54E38] cursor-pointer transition-colors block mx-auto font-medium bg-transparent border-none"
              >
                Want to pay your {savingsSchemeType} Installment?{' '}
                <span className="text-[#E54E38] font-bold hover:underline">Click to Pay</span>
              </button>
              <p className="text-[10px] text-gray-400 font-medium">
                For any queries, call/WhatsApp us at <a href="tel:+919783843978" className="text-[#E54E38] font-bold">+91 97838 43978</a>
              </p>
            </div>
          </div>
        </div>

        {/* WHY PLAN SECTION — reference style */}
        <div className="w-full bg-[#fafafa] py-10 px-4">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-[#1a1a2e]" style={{ fontFamily: 'Georgia, serif' }}>
                Why {savingsSchemeType} Plan?
              </h2>
              <div className="w-10 h-[2px] bg-[#E54E38] mx-auto" />
            </div>
            <div className="flex flex-col gap-5">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E54E38" strokeWidth="1.5" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  title: 'Plan Ahead',
                  desc: 'Subscribe to plan for your future high value purchases',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E54E38" strokeWidth="1.5" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                  ),
                  title: 'For Special Moments',
                  desc: 'Plan for gifting on special occasions like Birthdays, Weddings etc',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E54E38" strokeWidth="1.5" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13l-1.4-6M17 17a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  ),
                  title: 'Special Discounts',
                  desc: 'Pay 11 installments & get 100% discount on the 12th installment',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#FCFAFF] border border-gray-100 flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1a1a2e] mb-1 text-left" style={{ fontFamily: 'Georgia, serif' }}>{title}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed text-left font-sans">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="w-full bg-white py-10 px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#E89AA9] mb-2 font-sans">Simple &amp; Transparent</p>
              <h2 className="text-xl font-semibold text-[#0B2341] tracking-wide font-serif leading-tight">How does it work?</h2>
              <div className="w-10 h-[1.5px] bg-[#E89AA9] mx-auto mt-2" />
            </div>

            <div className="relative pl-12 space-y-8 py-2">
              {/* Vertical dashed line */}
              <div className="absolute left-[18px] top-4 bottom-4 w-[1px] border-l border-dashed border-[#E89AA9]/60" />

              {[
                {
                  step: 'Step 01',
                  title: 'Pay Monthly',
                  desc: 'Pay 11 monthly installments to accumulate gold units.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9" strokeWidth="1.2" className="w-5 h-5">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  )
                },
                {
                  step: 'Step 02',
                  title: 'Get Special Discount',
                  desc: 'Pay for 11 months on time and get 100% off on the 12th installment.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9" strokeWidth="1.2" className="w-5 h-5">
                      <path d="M6 3h12l4 6-10 12L2 9z" />
                      <path d="M11 3 L8 9 L12 21 L16 9 L13 3" />
                    </svg>
                  )
                },
                {
                  step: 'Step 03',
                  title: 'Happy Shopping!',
                  desc: 'Use the auto-redeemed voucher (equal to your total paid amount plus bonus) to buy at any of our stores or online.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9" strokeWidth="1.2" className="w-5 h-5">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                    </svg>
                  )
                }
              ].map((s, idx) => (
                <div key={idx} className="relative flex flex-col items-start text-left">
                  {/* Anchor dot */}
                  <div className="absolute -left-12 w-9 h-9 rounded-full bg-white border border-[#E89AA9] flex items-center justify-center font-bold text-xs text-[#0B2341] shadow-xs select-none">
                    {idx + 1}
                  </div>
                  <span className="text-[8.5px] uppercase tracking-widest text-[#E89AA9] font-bold font-sans block mb-0.5">{s.step}</span>
                  <h4 className="text-xs font-bold text-[#0B2341] font-serif mb-1">{s.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-sans">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <span className="inline-flex items-center gap-2 bg-[#FDF7F7] border border-[rgba(232,154,169,0.25)] rounded-full px-5 py-2 text-[10.5px] text-gray-500 font-sans shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <svg viewBox="0 0 14 14" fill="none" width="11" height="11" className="shrink-0">
                  <circle cx="7" cy="7" r="6" stroke="#E89AA9" strokeWidth="1" />
                  <path d="M7 4.5V7.5L9 9" stroke="#E89AA9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Refer to the calculator below for details
              </span>
            </div>
          </div>
        </div>

        {/* GOLD MINE CALCULATOR */}
        <div className="w-full py-10 px-4 bg-[#F8F8F8] border-t border-b border-gray-200">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#0B2341] font-serif">Gold Mine Calculator</h2>
              <p className="text-[11px] text-gray-500 mt-1 font-sans">Slide or enter monthly installment amount</p>
            </div>

            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs space-y-6">
              {/* Custom Amount Input Box */}
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-2.5 bg-white h-16">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-sans">Monthly Amount</span>
                  <div className="flex items-center text-lg font-bold text-[#0B2341] font-sans mt-0.5">
                    <span className="mr-1">₹</span>
                    <input
                      type="number"
                      value={monthlySavingsInput}
                      onChange={(e) => setMonthlySavingsInput(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      className="w-24 focus:outline-none bg-transparent border-none outline-none ring-0 font-bold"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (triggerAudio) triggerAudio('shimmer');
                    navigateTo('savings-enroll');
                  }}
                  className="bg-[#E54E38] hover:bg-[#c83d28] text-white px-5 py-2.5 rounded font-bold text-xs uppercase transition-all shadow-xs shrink-0 cursor-pointer border-none"
                >
                  CHECK
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={Number(monthlySavingsInput) || 1000}
                onChange={(e) => setMonthlySavingsInput(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#0B2341]"
                style={{
                  background: `linear-gradient(to right, #E8BEC5 0%, #E8BEC5 ${(((Number(monthlySavingsInput) || 1000) - 1000) / 49000) * 100}%, #E5E5E5 ${(((Number(monthlySavingsInput) || 1000) - 1000) / 49000) * 100}%, #E5E5E5 100%)`
                }}
              />

              {/* SVG Pie Chart */}
              <div className="w-full flex justify-center py-2">
                <svg viewBox="0 0 260 260" width="220" height="220" className="block">
                  <path d="M130 130 L185 34.74 A110 110 0 1 1 130 20 Z" fill="#E8BEC5" />
                  <path d="M130 130 L130 20 A110 110 0 0 1 185 34.74 Z" fill="#38A52B" />

                  <text x="155" y="46" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="700" fill="white">100%</text>
                  <text x="153" y="56" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="700" fill="white">Discount*</text>
                  <text x="148" y="67" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="white">₹{(Number(monthlySavingsInput) || 0).toLocaleString('en-IN')}</text>

                  <text x="130" y="190" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#6F727A">You Pay</text>
                  <text x="130" y="210" textAnchor="middle" fontFamily="Georgia, serif" fontSize="18" fontWeight="700" fill="#0B2341">₹{((Number(monthlySavingsInput) || 0) * 11).toLocaleString('en-IN')}</text>
                </svg>
              </div>

              {/* Math Breakdown */}
              <div className="space-y-4 pt-2 text-left">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex gap-2 items-center">
                    <div className="w-3 h-3 bg-[#E8BEC5] rounded-xs shrink-0" />
                    <div className="font-sans">
                      <span className="font-semibold text-[#0B2341] block">Your total payment</span>
                      <span className="text-[10px] text-gray-400">(Period of 11 months)</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#0B2341]">₹ {((Number(monthlySavingsInput) || 0) * 11).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex gap-2 items-center">
                    <div className="w-3 h-3 bg-[#38A52B] rounded-xs shrink-0" />
                    <div className="font-sans">
                      <span className="font-semibold text-[#0B2341] block">100% Discount on 12th installment</span>
                      <span className="text-[10px] text-gray-400">(100% of 1 month installment value)</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#0B2341]">₹ {(Number(monthlySavingsInput) || 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="h-[1px] bg-gray-200" />

                <div className="flex justify-between items-center">
                  <div className="text-left font-sans">
                    <span className="text-xs font-semibold text-[#0B2341] block">Buy any jewellery worth:</span>
                    <span className="text-[9.5px] text-gray-400">(after 12th month)</span>
                  </div>
                  <span className="text-xl font-black text-[#E54E38] font-sans">₹ {((Number(monthlySavingsInput) || 0) * 12).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-sans">
                    <span className="font-semibold text-[#0B2341]">You effectively pay</span>
                    <span className="bg-[#38A52B] text-white rounded-xs px-2 py-0.5 text-[9.5px] font-bold">8.33% discount!</span>
                  </div>
                  <span className="font-bold text-[#0B2341]">₹ {((Number(monthlySavingsInput) || 0) * 11).toLocaleString('en-IN')}</span>
                </div>

                <div className="h-[1px] bg-gray-200" />

                {/* Early Redemption */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs font-bold text-[#0B2341] font-sans">Early Redemption</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-200 rounded-lg p-3 bg-white text-left space-y-1 relative shadow-xs">
                      <span className="text-[9px] text-[#2F6FB6] font-bold block font-sans">6th Month</span>
                      <span className="text-sm font-bold text-[#F26544] block font-sans">₹ {Math.round((Number(monthlySavingsInput) || 0) * 5.25).toLocaleString('en-IN')}</span>
                      <span className="text-[8px] text-gray-400 font-sans block leading-normal">Buy worth after 6th mo (Pay 5m + 25% disc)</span>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3 bg-white text-left space-y-1 relative shadow-xs">
                      <span className="text-[9px] text-[#2F6FB6] font-bold block font-sans">8th Month</span>
                      <span className="text-sm font-bold text-[#F26544] block font-sans">₹ {Math.round((Number(monthlySavingsInput) || 0) * 7.5).toLocaleString('en-IN')}</span>
                      <span className="text-[8px] text-gray-400 font-sans block leading-normal">Buy worth after 8th mo (Pay 7m + 50% disc)</span>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-gray-200" />

                <p className="text-[10px] text-gray-400 text-center leading-normal font-sans pt-1">
                  If jewellery is more than ₹ {((Number(monthlySavingsInput) || 0) * 12).toLocaleString('en-IN')}, you just need to pay the difference amount at the time of purchase.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NOTICE & FAQ */}
        <div className="w-full py-10 px-4 bg-[#F9F1F2] text-center space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26544] font-sans block">NOTE:</span>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                The subscription amount and benefits can be used towards the purchase of either diamond/gemstone studded jewellery or plain gold jewellery.
              </p>
            </div>

            <div className="w-10 h-[1px] bg-[#E6B7BE]/50 mx-auto" />

            <div className="flex flex-col gap-2 font-sans text-xs">
              <a
                href="/#faq"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('home');
                  setTimeout(() => {
                    const faqEl = document.getElementById('faq');
                    if (faqEl) faqEl.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className="font-semibold text-[#2F6FB6] hover:underline"
              >
                View all FAQ &gt;&gt;
              </a>
              <a
                href="/terms-and-conditions"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('terms-and-conditions');
                }}
                className="font-semibold text-[#2F6FB6] hover:underline"
              >
                View all Terms &amp; Conditions &gt;&gt;
              </a>
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR */}
        <div className="flex fixed bottom-0 left-0 w-full z-45 bg-white border-t border-gray-200 px-4 py-3 items-center justify-between shadow-[0_-4px_25px_rgba(0,0,0,0.06)] select-none">
          <a
            href="https://wa.me/919783843978"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 mr-2 text-center py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 bg-white active:bg-gray-50 transition-colors cursor-pointer no-underline"
          >
            CONTACT US
          </a>
          <button
            onClick={() => {
              if (triggerAudio) triggerAudio('shimmer');
              navigateTo('savings-enroll');
            }}
            className="flex-1 py-2.5 bg-[#E54E38] hover:bg-[#c83d28] text-white rounded-xl text-xs font-extrabold uppercase tracking-widest text-center shadow-md active:scale-95 transition-transform cursor-pointer border-none"
          >
            START NOW
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:block bg-white min-h-screen">
        {/* 1. FULL WIDTH BANNER */}
        <div className="w-full aspect-[2400/778] overflow-hidden bg-[#fdf5ee]">
          <img
            src={bannerSavings11_1}
            alt="Gold Mine 11+1 Monthly Installment Plan"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 2. QUICK ENROLL STRIP */}
        <div className="w-full border-b border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="flex flex-col sm:flex-row gap-3 items-end text-left">
              <div className="flex-grow">
                <label className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1.5 font-semibold">Enter Monthly Amount</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={monthlySavingsInput}
                  onChange={(e) => setMonthlySavingsInput(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#E54E38] transition-all bg-[#FCFAFF]"
                />
              </div>
              <div className="flex-grow">
                <label className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1.5 font-semibold">Enter Email address</label>
                <input
                  type="email"
                  placeholder="Enter Email address"
                  value={savingsForm.email}
                  onChange={(e) => setSavingsForm({ ...savingsForm, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E54E38] transition-all bg-[#FCFAFF]"
                />
              </div>
              <button
                onClick={() => {
                  if (triggerAudio) triggerAudio('shimmer');
                  navigateTo('savings-enroll');
                }}
                className="px-10 py-3 rounded-lg bg-[#E54E38] hover:bg-[#c83d28] text-white text-xs uppercase font-black tracking-widest transition-all cursor-pointer whitespace-nowrap shadow-md hover:shadow-lg border-none"
              >
                Start Now
              </button>
            </div>
            <div className="text-right mt-2">
              <button
                onClick={() => {
                  if (triggerAudio) triggerAudio('click');
                  navigateTo('savings-enroll');
                }}
                className="text-[11px] text-gray-500 hover:text-[#E54E38] cursor-pointer transition-colors bg-transparent border-none"
              >
                Want to pay your {savingsSchemeType} Installment?{' '}
                <span className="text-[#E54E38] font-semibold hover:underline">Click to Pay</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. WHY PLAN SECTION */}
        <div className="w-full bg-[#fafafa] py-12">
          <div className="max-w-5xl mx-auto px-6 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-[#1a1a2e]" style={{ fontFamily: 'Georgia, serif' }}>
                Why {savingsSchemeType} Plan?
              </h2>
              <div className="w-10 h-[2px] bg-[#E54E38] mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E54E38" strokeWidth="1.5" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  title: 'Plan Ahead',
                  desc: 'Subscribe to plan for your future high value purchases',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E54E38" strokeWidth="1.5" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                  ),
                  title: 'For Special Moments',
                  desc: 'Plan for gifting on special occasions like Birthdays, Weddings etc',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E54E38" strokeWidth="1.5" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13l-1.4-6M17 17a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  ),
                  title: 'Special Discounts',
                  desc: 'Pay 11 installments & get 100% discount on the 12th installment',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1a2e] mb-1" style={{ fontFamily: 'Georgia, serif' }}>{title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. HOW IT WORKS */}
        <section style={{ background: '#FAF8F6', width: '100%', padding: '110px 0 100px' }}>
          <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: '96px' }}>
              <p style={{ fontFamily: 'sans-serif', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#E89AA9', fontWeight: '700', margin: '0 0 14px' }}>Simple &amp; Transparent</p>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '40px', fontWeight: '600', color: '#0B2341', letterSpacing: '0.01em', margin: '0 0 24px', lineHeight: '1.2' }}>How It Works</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <div style={{ width: '64px', height: '1px', background: '#E89AA9', opacity: 0.7 }} />
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="3.5" stroke="#E89AA9" strokeWidth="0.8" />
                  <circle cx="4" cy="4" r="1.5" fill="#E89AA9" />
                </svg>
                <div style={{ width: '64px', height: '1px', background: '#E89AA9', opacity: 0.7 }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
              {/* LEFT — Circle Diagram */}
              <div style={{ position: 'relative', width: '560px', height: '560px', flexShrink: 0 }}>
                <svg width="560" height="560" viewBox="0 0 560 560" fill="none" style={{ position: 'absolute', inset: 0 }}>
                  <circle cx="260" cy="280" r="218" stroke="#E89AA9" strokeWidth="1.2" strokeDasharray="4 8" opacity="0.9" />
                  <circle cx="260" cy="280" r="190" stroke="#E89AA9" strokeWidth="0.5" opacity="0.35" />
                  <path d="M68 410 Q40 445 70 465" stroke="#E89AA9" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6" />
                  <path d="M65 460 L70 465 L75 458" stroke="#E89AA9" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                  <line x1="431.8" y1="145.8" x2="560" y2="145.8" stroke="#E89AA9" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.6" />
                  <circle cx="431.8" cy="145.8" r="14" fill="#FAF8F6" stroke="#E89AA9" strokeWidth="0.8" />
                  <text x="431.8" y="149.8" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#0B2341" fontWeight="600">1</text>
                  <line x1="478" y1="280" x2="560" y2="280" stroke="#E89AA9" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.6" />
                  <circle cx="478" cy="280" r="14" fill="#FAF8F6" stroke="#E89AA9" strokeWidth="0.8" />
                  <text x="478" y="284" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#0B2341" fontWeight="600">2</text>
                  <line x1="431.8" y1="414.2" x2="560" y2="414.2" stroke="#E89AA9" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.6" />
                  <circle cx="431.8" cy="414.2" r="14" fill="#FAF8F6" stroke="#E89AA9" strokeWidth="0.8" />
                  <text x="431.8" y="418.2" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#0B2341" fontWeight="600">3</text>
                </svg>

                <div style={{ position: 'absolute', top: '280px', left: '260px', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '240px', pointerEvents: 'none' }}>
                  <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '38px', fontWeight: '700', color: '#0B2341', lineHeight: '1.2', letterSpacing: '0.01em', margin: 0 }}>
                    3 Easy<br />Steps
                  </h3>
                  <div style={{ width: '40px', height: '1px', background: '#E89AA9', margin: '14px auto' }} />
                  <p style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#8A94A6', lineHeight: '1.6', margin: 0, fontWeight: '400' }}>
                    to purchase the jewellery your heart desires
                  </p>
                </div>
              </div>

              {/* RIGHT — Step Cards */}
              <div style={{ flex: 1, position: 'relative', height: '560px', minWidth: 0 }}>
                <div style={{ position: 'absolute', top: '98px', left: 0, right: 0, height: '96px', display: 'flex', alignItems: 'center', gap: '28px', borderBottom: '0.5px solid rgba(232,154,169,0.15)', paddingBottom: '20px' }}>
                  <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '50%', border: '1px solid #E89AA9', background: '#fff', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: '0 4px 15px rgba(232,154,169,0.06)' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '0.8px solid rgba(232,154,169,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9" strokeWidth="1.2" width="28" height="28" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontFamily: 'sans-serif', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E89AA9', fontWeight: '700', margin: '0 0 4px' }}>Step 01</p>
                    <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '20px', fontWeight: '600', color: '#0B2341', margin: '0 0 4px', letterSpacing: '0.01em' }}>Pay Monthly</p>
                    <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#6F727A', lineHeight: '1.6', margin: 0, maxWidth: '340px', fontWeight: '400' }}>Flexible monthly installments with easy payment options.</p>
                  </div>
                </div>

                <div style={{ position: 'absolute', top: '232px', left: 0, right: 0, height: '96px', display: 'flex', alignItems: 'center', gap: '28px', borderBottom: '0.5px solid rgba(232,154,169,0.15)', paddingBottom: '20px' }}>
                  <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '50%', border: '1px solid #E89AA9', background: '#fff', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: '0 4px 15px rgba(232,154,169,0.06)' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '0.8px solid rgba(232,154,169,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9" strokeWidth="1.2" width="28" height="28" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3h12l4 6-10 12L2 9z" />
                        <path d="M11 3 L8 9 L12 21 L16 9 L13 3" />
                        <path d="M2 9h20" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontFamily: 'sans-serif', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E89AA9', fontWeight: '700', margin: '0 0 4px' }}>Step 02</p>
                    <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '20px', fontWeight: '600', color: '#0B2341', margin: '0 0 4px', letterSpacing: '0.01em' }}>Get Exclusive Benefits</p>
                    <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#6F727A', lineHeight: '1.6', margin: 0, maxWidth: '340px', fontWeight: '400' }}>Complete your installments and unlock special rewards.</p>
                  </div>
                </div>

                <div style={{ position: 'absolute', top: '366px', left: 0, right: 0, height: '96px', display: 'flex', alignItems: 'center', gap: '28px', paddingBottom: '20px' }}>
                  <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '50%', border: '1px solid #E89AA9', background: '#fff', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: '0 4px 15px rgba(232,154,169,0.06)' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '0.8px solid rgba(232,154,169,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9" strokeWidth="1.2" width="28" height="28" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontFamily: 'sans-serif', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E89AA9', fontWeight: '700', margin: '0 0 4px' }}>Step 03</p>
                    <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '20px', fontWeight: '600', color: '#0B2341', margin: '0 0 4px', letterSpacing: '0.01em' }}>Enjoy Your Purchase</p>
                    <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#6F727A', lineHeight: '1.6', margin: 0, maxWidth: '340px', fontWeight: '400' }}>Redeem your benefits and purchase any jewellery item online or in-store.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '72px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#FDF7F7', border: '1px solid rgba(232,154,169,0.25)', borderRadius: '30px', padding: '12px 36px', fontFamily: 'sans-serif', fontSize: '12px', color: '#6F727A', letterSpacing: '0.02em', boxShadow: '0 2px 12px rgba(232,154,169,0.03)' }}>
                <svg viewBox="0 0 14 14" fill="none" width="13" height="13" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="6" stroke="#E89AA9" strokeWidth="1" />
                  <path d="M7 4.5V7.5L9 9" stroke="#E89AA9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Refer to the calculator below for complete details
              </span>
            </div>
          </div>
        </section>

        {/* 5. GOLD MINE CALCULATOR */}
        <section style={{ background: '#F8F8F8', padding: '64px 0 48px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px' }}>
            <h2 style={{ textAlign: 'center', fontFamily: '"Playfair Display", Georgia, serif', fontSize: '32px', fontWeight: '600', color: '#0B2341', marginBottom: '40px', letterSpacing: '0.01em' }}>Gold Mine Calculator</h2>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start mb-6 text-left">
              {/* LEFT PANEL */}
              <div className="w-full lg:w-[320px] shrink-0 max-w-sm lg:max-w-none">
                <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#0B2341', fontWeight: '600', marginBottom: '14px', lineHeight: '1.5' }}>
                  Slide or enter monthly installment amount
                </p>

                <div style={{ border: '1.2px solid #D1D5DB', borderRadius: '4px', background: '#fff', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', overflow: 'hidden', height: '64px', marginBottom: '18px' }}>
                  <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px', fontFamily: 'sans-serif' }}>Monthly Amount</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#0B2341', fontFamily: 'sans-serif', lineHeight: 1.1 }}>
                      ₹ {(Number(monthlySavingsInput) || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (triggerAudio) triggerAudio('shimmer');
                      navigateTo('savings-enroll');
                    }}
                    style={{ background: '#E54E38', color: '#fff', border: 'none', padding: '0 24px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    CHECK
                  </button>
                </div>

                <input
                  type="range" min="1000" max="50000" step="1000"
                  value={Number(monthlySavingsInput) || 1000}
                  onChange={(e) => setMonthlySavingsInput(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#0B2341]"
                  style={{
                    background: `linear-gradient(to right, #E8BEC5 0%, #E8BEC5 ${(((Number(monthlySavingsInput) || 1000) - 1000) / 49000) * 100}%, #E5E5E5 ${(((Number(monthlySavingsInput) || 1000) - 1000) / 49000) * 100}%, #E5E5E5 100%)`
                  }}
                />

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                  <svg viewBox="0 0 260 260" width="288" height="288" style={{ display: 'block' }}>
                    <path d="M130 130 L185 34.74 A110 110 0 1 1 130 20 Z" fill="#E8BEC5" />
                    <path d="M130 130 L130 20 A110 110 0 0 1 185 34.74 Z" fill="#38A52B" />

                    <text x="155" y="46" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="700" fill="white">100%</text>
                    <text x="153" y="56" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="700" fill="white">Discount*</text>
                    <text x="148" y="67" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="white">₹{(Number(monthlySavingsInput) || 0).toLocaleString('en-IN')}</text>

                    <text x="130" y="190" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#6F727A">You Pay</text>
                    <text x="130" y="210" textAnchor="middle" fontFamily="Georgia, serif" fontSize="18" fontWeight="700" fill="#0B2341">₹{((Number(monthlySavingsInput) || 0) * 11).toLocaleString('en-IN')}</text>
                  </svg>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="w-full flex-1" style={{ paddingTop: '0px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '12px', background: '#E8BEC5', borderRadius: '2px', flexShrink: 0 }} />
                    <div style={{ fontFamily: 'sans-serif' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '500', color: '#0B2341', display: 'block' }}>Your total payment</span>
                      <span style={{ fontSize: '11px', color: '#888' }}>(Period of 11 months)</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0B2341', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                    ₹ {((Number(monthlySavingsInput) || 0) * 11).toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '12px', background: '#38A52B', borderRadius: '2px', flexShrink: 0 }} />
                    <div style={{ fontFamily: 'sans-serif' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '500', color: '#0B2341', display: 'block' }}>100% Discount on 12th installment</span>
                      <span style={{ fontSize: '11px', color: '#888' }}>(100% of 1 month installment value)</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0B2341', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                    ₹ {(Number(monthlySavingsInput) || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ height: '1px', background: '#E5E5E5', marginBottom: '18px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontFamily: 'sans-serif' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#0B2341' }}>Buy any jewellery worth:</div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>(after 12th month)</div>
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#E54E38', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                    ₹ {((Number(monthlySavingsInput) || 0) * 12).toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'sans-serif' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#0B2341' }}>You effectively pay</span>
                    <span style={{ background: '#38A52B', color: '#fff', borderRadius: '3px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>8.33% discount!</span>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0B2341', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                    ₹ {((Number(monthlySavingsInput) || 0) * 11).toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ height: '1px', background: '#E5E5E5', marginBottom: '18px' }} />

                <p style={{ fontSize: '14px', fontWeight: '700', color: '#0B2341', fontFamily: 'sans-serif', marginBottom: '12px' }}>Early Redemption</p>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <div style={{ background: '#ffffff', border: '1.2px solid #E5E7EB', borderRadius: '4px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)' }}>
                      <div style={{ fontFamily: 'sans-serif' }}>
                        <div style={{ fontSize: '11px', color: '#2F6FB6', fontWeight: '600', marginBottom: '4px' }}>6th Month</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#F26544' }}>
                          ₹ {Math.round((Number(monthlySavingsInput) || 0) * 5.25).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <button onClick={() => setErdTooltip(erdTooltip === '6th' ? null : '6th')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' }}>
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                          <circle cx="10" cy="10" r="8.5" stroke={erdTooltip === '6th' ? '#2F6FB6' : '#999'} strokeWidth="1.2" />
                          <text x="10" y="13.5" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="700" fill={erdTooltip === '6th' ? '#2F6FB6' : '#999'}>i</text>
                        </svg>
                      </button>
                    </div>

                    {erdTooltip === '6th' && (
                      <div style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '18px 20px', minWidth: '280px', zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.10)', fontFamily: 'sans-serif' }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#0B2341', marginBottom: '14px' }}>Redemption in 6th month</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div>
                            <div style={{ fontSize: '12.5px', color: '#333' }}>Your total payment</div>
                            <div style={{ fontSize: '11px', color: '#aaa' }}>(5 installments)</div>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', whiteSpace: 'nowrap', marginLeft: '16px' }}>₹ {((Number(monthlySavingsInput) || 0) * 5).toLocaleString('en-IN')}</div>
                        </div>
                        <div style={{ height: '1px', background: '#f0f0f0', margin: '10px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div>
                            <div style={{ fontSize: '12.5px', color: '#333' }}>Special Discount</div>
                            <div style={{ fontSize: '11px', color: '#aaa' }}>(25% of one installment value)</div>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', whiteSpace: 'nowrap', marginLeft: '16px' }}>₹ {Math.round((Number(monthlySavingsInput) || 0) * 0.25).toLocaleString('en-IN')}</div>
                        </div>
                        <div style={{ height: '1px', background: '#f0f0f0', margin: '10px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <div>
                            <div style={{ fontSize: '12.5px', color: '#333' }}>You can buy jewellery worth:</div>
                            <div style={{ fontSize: '11px', color: '#aaa' }}>(after 6th month)</div>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#F26544', whiteSpace: 'nowrap', marginLeft: '16px' }}>₹ {Math.round((Number(monthlySavingsInput) || 0) * 5.25).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ position: 'relative', flex: 1 }}>
                    <div style={{ background: '#ffffff', border: '1.2px solid #E5E7EB', borderRadius: '4px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)' }}>
                      <div style={{ fontFamily: 'sans-serif' }}>
                        <div style={{ fontSize: '11px', color: '#2F6FB6', fontWeight: '600', marginBottom: '4px' }}>8th Month</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#F26544' }}>
                          ₹ {Math.round((Number(monthlySavingsInput) || 0) * 7.5).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <button onClick={() => setErdTooltip(erdTooltip === '8th' ? null : '8th')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' }}>
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                          <circle cx="10" cy="10" r="8.5" stroke={erdTooltip === '8th' ? '#2F6FB6' : '#999'} strokeWidth="1.2" />
                          <text x="10" y="13.5" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="700" fill={erdTooltip === '8th' ? '#2F6FB6' : '#999'}>i</text>
                        </svg>
                      </button>
                    </div>

                    {erdTooltip === '8th' && (
                      <div style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '18px 20px', minWidth: '280px', zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.10)', fontFamily: 'sans-serif' }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#0B2341', marginBottom: '14px' }}>Redemption in 8th month</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div>
                            <div style={{ fontSize: '12.5px', color: '#333' }}>Your total payment</div>
                            <div style={{ fontSize: '11px', color: '#aaa' }}>(7 installments)</div>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', whiteSpace: 'nowrap', marginLeft: '16px' }}>₹ {((Number(monthlySavingsInput) || 0) * 7).toLocaleString('en-IN')}</div>
                        </div>
                        <div style={{ height: '1px', background: '#f0f0f0', margin: '10px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div>
                            <div style={{ fontSize: '12.5px', color: '#333' }}>Special Discount</div>
                            <div style={{ fontSize: '11px', color: '#aaa' }}>(50% of one installment value)</div>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', whiteSpace: 'nowrap', marginLeft: '16px' }}>₹ {Math.round((Number(monthlySavingsInput) || 0) * 0.5).toLocaleString('en-IN')}</div>
                        </div>
                        <div style={{ height: '1px', background: '#f0f0f0', margin: '10px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <div>
                            <div style={{ fontSize: '12.5px', color: '#333' }}>You can buy jewellery worth:</div>
                            <div style={{ fontSize: '11px', color: '#aaa' }}>(after 8th month)</div>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#F26544', whiteSpace: 'nowrap', marginLeft: '16px' }}>₹ {Math.round((Number(monthlySavingsInput) || 0) * 7.5).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: '1.2px', background: '#E6B7BE', opacity: 0.6, width: '100%', margin: '24px 0 12px 0' }} />
            <p style={{ fontSize: '11.5px', color: '#8A94A6', textAlign: 'center', lineHeight: '1.5', margin: 0, fontFamily: 'sans-serif', fontWeight: '400' }}>
              If jewellery is more than ₹ {((Number(monthlySavingsInput) || 0) * 12).toLocaleString('en-IN')}, you just need to pay the difference amount at the time of purchase
            </p>
          </div>
        </section>

        {/* 6. NOTICE & FAQ */}
        <section className="relative w-full overflow-hidden flex flex-col items-center justify-between box-border" style={{ background: '#F9F1F2', height: '520px', paddingTop: '110px', paddingBottom: '50px' }}>
          <div className="absolute top-0 left-0 right-0 w-full z-10 pointer-events-none" style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[60px] md:h-[100px] block">
              <path d="M0,100 C360,30 1080,30 1440,100 L1440,0 L0,0 Z" fill="#F8F8F8" />
            </svg>
          </div>

          <div className="w-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-between h-full relative z-20">
            <div className="text-center max-w-[600px] px-4">
              <span className="block text-xs font-extrabold uppercase tracking-widest mb-1.5 font-sans" style={{ color: '#F26544' }}>NOTE:-</span>
              <p className="text-xs md:text-[13.5px] text-[#6F727A] leading-relaxed font-sans m-0">
                The subscription amount and benefits can be used towards the purchase of<br className="hidden md:inline" />
                either diamond/gemstone studded jewellery or plain gold jewellery.
              </p>
            </div>

            <div className="flex items-center w-full my-4 md:my-6">
              <div className="flex-grow h-[1px] md:h-[1.2px]" style={{ backgroundColor: '#E6B7BE' }} />
              <div className="bg-white py-3 md:py-4 px-6 md:px-12 mx-3 md:mx-6 shadow-none">
                <h3 className="text-base md:text-[28px] font-medium text-[#0B2341] m-0 tracking-wide text-center" style={{ fontFamily: '"Playfair Display", Georgia, serif', lineHeight: '1.2' }}>Find answers to all your queries here</h3>
              </div>
              <div className="flex-grow h-[1px] md:h-[1.2px]" style={{ backgroundColor: '#E6B7BE' }} />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-16 font-sans mb-4">
              <a
                href="/#faq"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('home');
                  setTimeout(() => {
                    const faqEl = document.getElementById('faq');
                    if (faqEl) faqEl.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className="text-sm md:text-[15.5px] font-semibold text-[#2F6FB6] no-underline hover:text-[#1c508a] transition-colors"
              >
                View all FAQ &gt;&gt;
              </a>
              <span className="text-[#E6B7BE] text-base hidden md:inline select-none">|</span>
              <a
                href="/terms-and-conditions"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('terms-and-conditions');
                }}
                className="text-sm md:text-[15.5px] font-semibold text-[#2F6FB6] no-underline hover:text-[#1c508a] transition-colors"
              >
                View all Terms &amp; Conditions &gt;&gt;
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
