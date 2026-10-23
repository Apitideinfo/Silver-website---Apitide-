import React, { useEffect } from 'react';
import { useSavings } from '../contexts/SavingsContext';
import { useRates } from '../hooks/useRates';

// Asset Imports
import goldReserveBanner from '../assets/gold_reserve_banner.png';

export default function GoldReserve({
  navigateTo,
  triggerAudio
}) {
  const {
    monthlySavingsInput,
    setMonthlySavingsInput,
    savingsForm,
    setSavingsForm,
    setSavingsSchemeType
  } = useSavings();

  const { goldRate24k = 78500 } = useRates();
  const savingsSchemeType = 'Gold Reserve';

  useEffect(() => {
    setSavingsSchemeType('Gold Reserve');
  }, [setSavingsSchemeType]);

  return (
    <>
      {/* MOBILE VIEW */}
      <div className="lg:hidden bg-white min-h-screen pb-24 text-[#1B1B1B]">
        {/* FULL WIDTH BANNER */}
        <div className="w-full bg-[#FAF0ED] text-center">
          <img
            src={goldReserveBanner}
            alt="Gold Reserve Plan"
            className="w-full object-contain"
          />
        </div>

        {/* QUICK ENROLL CARD */}
        <div className="w-full bg-[#FCFAFF] py-6 px-4">
          <div className="max-w-md mx-auto bg-white border border-solid border-gray-150 rounded-2xl shadow-[0_8px_30px_rgba(63,31,84,0.05)] p-5 space-y-4">
            <h3 className="text-center text-[13.5px] font-bold text-[#1B3152] font-sans tracking-wide">
              Pay 11 installments, get an extra voucher worth upto <span className="text-[#c0392b]">1 installment!</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-semibold">Enter Monthly Amount</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={monthlySavingsInput}
                  onChange={(e) => setMonthlySavingsInput(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  className="w-full border border-solid border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#c0392b] transition-all bg-[#FCFAFF]"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-semibold">Enter Email ID</label>
                <input
                  type="email"
                  placeholder="e.g. patron@mail.com"
                  value={savingsForm.email}
                  onChange={(e) => setSavingsForm({ ...savingsForm, email: e.target.value })}
                  className="w-full border border-solid border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#c0392b] transition-all bg-[#FCFAFF]"
                />
              </div>
            </div>

            <button
              onClick={() => { triggerAudio('shimmer'); navigateTo('savings-enroll'); }}
              className="w-full py-3.5 rounded-lg bg-[#c0392b] hover:bg-[#a93226] text-white text-xs uppercase font-extrabold tracking-widest transition-all cursor-pointer shadow-md active:scale-95 border-none font-bold"
            >
              GET STARTED
            </button>

            <div className="text-center space-y-1.5 pt-2">
              <button
                onClick={() => { triggerAudio('click'); navigateTo('savings-enroll'); }}
                className="text-[11px] text-gray-500 hover:text-[#c0392b] cursor-pointer transition-colors block mx-auto font-medium bg-transparent border-none"
              >
                Want to pay your {savingsSchemeType} Installment?{' '}
                <span className="text-[#c0392b] font-bold hover:underline">Click to Pay</span>
              </button>
              <p className="text-[10px] text-gray-400 font-medium">
                For any queries, call/WhatsApp us at <a href="tel:+919783843978" className="text-[#c0392b] font-bold">+91 97838 43978</a>
              </p>
            </div>
          </div>
        </div>

        {/* WHY PLAN SECTION */}
        <div className="w-full bg-[#fafafa] py-10 px-4">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-semibold text-[#1a1a2e]">
                Why {savingsSchemeType} Plan?
              </h2>
              <div className="w-10 h-[2px] bg-[#c0392b] mx-auto" />
            </div>
            <div className="flex flex-col gap-5">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: 'Plan Ahead',
                  desc: 'Subscribe to plan for your future high value purchases',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 11v-1" />
                    </svg>
                  ),
                  title: 'Gold accumulation',
                  desc: 'With every installment payment, gold units are allocated to your plan based on the prevailing gold rate',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  ),
                  title: 'Special benefits',
                  desc: 'Pay 11 installments and get an extra voucher worth upto 1 installment amount',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-solid border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#FCFAFF] border border-solid border-gray-100 flex items-center justify-center shrink-0">
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
              <p style={{ fontFamily: 'sans-serif', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E89AA9', fontWeight: '700', margin: '0 0 8px' }}>Simple &amp; Transparent</p>
              <h2 className="text-xl font-semibold text-[#0B2341] tracking-wide font-serif" style={{ lineHeight: '1.2' }}>How does it work?</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
                <div style={{ width: '32px', height: '1.5px', background: '#E89AA9' }} />
                <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="3.5" stroke="#E89AA9" strokeWidth="0.8" />
                  <circle cx="4" cy="4" r="1.5" fill="#E89AA9" />
                </svg>
                <div style={{ width: '32px', height: '1.5px', background: '#E89AA9' }} />
              </div>
            </div>

            <div className="relative pl-12 space-y-8 py-2">
              <div className="absolute left-[18px] top-4 bottom-4 w-[1px] border-l border-dashed border-[#E89AA9]/60" />

              {[
                {
                  step: 'Step 01',
                  title: 'Pay Monthly',
                  desc: 'Pay monthly installments to accumulate gold units.',
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
                  title: 'Gold accumulation',
                  desc: 'Gold units are allocated based on the prevailing gold rate.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9" strokeWidth="1.2" className="w-5 h-5">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 11v-1" />
                    </svg>
                  )
                },
                {
                  step: 'Step 03',
                  title: 'Special benefits',
                  desc: 'Pay 11 installments and get an extra voucher worth upto 1 installment amount.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9" strokeWidth="1.2" className="w-5 h-5">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                    </svg>
                  )
                }
              ].map((s, idx) => (
                <div key={idx} className="relative flex flex-col items-start text-left">
                  <div className="absolute -left-12 w-9 h-9 rounded-full bg-white border border-solid border-[#E89AA9] flex items-center justify-center font-bold text-xs text-[#0B2341] shadow-xs">
                    {idx + 1}
                  </div>
                  <span className="text-[8.5px] uppercase tracking-widest text-[#E89AA9] font-bold font-sans block mb-0.5">{s.step}</span>
                  <h4 className="text-xs font-bold text-[#0B2341] font-serif mb-1">{s.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-sans">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <span className="inline-flex items-center gap-2 bg-[#FDF7F7] border border-solid border-[rgba(232,154,169,0.25)] rounded-full px-5 py-2 text-[10.5px] text-gray-500 font-sans shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <svg viewBox="0 0 14 14" fill="none" width="11" height="11" className="shrink-0">
                  <circle cx="7" cy="7" r="6" stroke="#E89AA9" strokeWidth="1" />
                  <path d="M7 4.5V7.5L9 9" stroke="#E89AA9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Refer to the calculator below for details
              </span>
            </div>
          </div>
        </div>

        {/* GOLD RESERVE CALCULATOR */}
        <div className="w-full py-10 px-4 bg-[#F8F8F8] border-t border-b border-solid border-gray-200">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#0B2341] font-serif">Gold Reserve Calculator</h2>
              <p className="text-[11px] text-gray-500 mt-1 font-sans">Slide or enter monthly installment amount</p>
              <p className="text-[11px] text-[#c0392b] font-bold font-sans mt-0.5">Today's Gold rate(24kt) | ₹ {goldRate24k.toFixed(2)}</p>
            </div>

            <div className="bg-white border border-solid border-gray-150 rounded-2xl p-5 shadow-xs space-y-6">
              <div className="flex items-center justify-between border border-solid border-gray-200 rounded-lg p-2.5 bg-white h-16">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-sans">Monthly Amount</span>
                  <div className="flex items-center text-lg font-bold text-[#0B2341] font-sans mt-0.5">
                    <span className="mr-1">₹</span>
                    <input
                      type="number"
                      value={monthlySavingsInput}
                      onChange={(e) => setMonthlySavingsInput(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      className="w-24 focus:outline-none bg-transparent border-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => { triggerAudio('shimmer'); navigateTo('savings-enroll'); }}
                  className="px-5 py-2 rounded bg-[#c0392b] text-white text-[10.5px] font-bold tracking-wider cursor-pointer active:scale-95 transition-transform border-none font-bold"
                >
                  CHECK
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={Number(monthlySavingsInput) || 1000}
                  onChange={(e) => setMonthlySavingsInput(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#c0392b]"
                  style={{
                    background: `linear-gradient(to right, #c0392b 0%, #c0392b ${(((Number(monthlySavingsInput) || 1000) - 1000) / 49000) * 100}%, #E5E5E5 ${(((Number(monthlySavingsInput) || 1000) - 1000) / 49000) * 100}%, #E5E5E5 100%)`
                  }}
                />
                <div className="flex justify-between text-[9.5px] text-gray-400 font-bold font-sans">
                  <span>1,000</span>
                  <span>25,000</span>
                  <span>50,000</span>
                </div>
              </div>

              <div className="space-y-4 pt-2 text-left">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex gap-2 items-center">
                    <div className="w-3 h-3 bg-[#0B2341] rounded-xs shrink-0" />
                    <div className="font-sans">
                      <span className="font-semibold text-[#0B2341] block">Your Payment</span>
                      <span className="text-[10px] text-gray-400">(1 installment)</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#0B2341]">₹ {(Number(monthlySavingsInput) || 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex gap-2 items-center">
                    <div className="w-3 h-3 bg-[#38A52B] rounded-xs shrink-0" />
                    <div className="font-sans">
                      <span className="font-semibold text-[#0B2341] block">Your Reserved Gold</span>
                      <span className="text-[10px] text-gray-400">(in units)</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#0B2341]">{((Number(monthlySavingsInput) || 0) / (goldRate24k || 1)).toFixed(4)} g</span>
                </div>

                <div className="h-[1px] bg-gray-200" />

                <div className="font-sans text-[11px] text-gray-600 leading-relaxed bg-[#FAF8F6] p-4 rounded-lg border border-solid border-gray-150">
                  <p className="margin-0 font-bold text-[#0B2341] mb-1.5">
                    Pay all installments on time and choose between one of the two following options for your special benefit voucher:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Plain Gold voucher worth 50% of your installment amount.</li>
                    <li>Non-Plain Gold voucher worth 100% of your installment amount.</li>
                  </ul>
                </div>

                <div className="h-[1px] bg-gray-200" />

                <p className="text-[10px] text-gray-400 text-center leading-normal font-sans pt-1">
                  If jewellery is more than ₹ {((Number(monthlySavingsInput) || 0) * 11).toLocaleString('en-IN')}, you just need to pay the difference amount at the time of purchase.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NOTE & FAQ */}
        <div className="w-full py-10 px-4 bg-[#F9F1F2] text-center space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26544] font-sans block">NOTE:</span>
              <p className="text-xs text-gray-500 leading-relaxed font-sans text-left">
                *1 gold unit = 1 gram of 24kt gold<br />
                The Gold Reserve Option Plan is redeemable from 2nd month onwards, subject to terms and conditions.<br />
                The subscription amount and primary voucher can be used towards the purchase of Diamond studded, Gemstone studded, Plain Gold, Plain Platinum or Preset Solitaire jewellery.<br />
                The Plain Gold special benefit voucher can be used towards the purchase of Plain Gold jewellery only.<br />
                The Non-Plain Gold special benefit voucher can be used towards the purchase of Diamond studded, Gemstone studded, Plain Platinum or Preset Solitaire jewellery only.
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
        <div className="flex fixed bottom-[56px] left-0 w-full z-45 bg-white border-t border-solid border-gray-200 px-4 py-3 items-center justify-between shadow-[0_-4px_25px_rgba(0,0,0,0.06)]">
          <a
            href="https://wa.me/919783843978"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 mr-2 text-center py-2.5 border border-solid border-gray-300 rounded-xl text-xs font-bold text-gray-700 bg-white active:bg-gray-50 transition-colors cursor-pointer text-center no-underline font-bold"
          >
            CONTACT US
          </a>
          <button
            onClick={() => { triggerAudio('shimmer'); navigateTo('savings-enroll'); }}
            className="flex-1 py-2.5 bg-[#c0392b] hover:bg-[#a93226] text-white rounded-xl text-xs font-extrabold uppercase tracking-widest text-center shadow-md active:scale-95 transition-transform cursor-pointer border-none font-bold"
          >
            GET STARTED
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:block bg-white min-h-screen">
        {/* FULL WIDTH BANNER */}
        <div className="w-full bg-[#FAF0ED] text-center">
          <img
            src={goldReserveBanner}
            alt="Gold Reserve 11+1 Monthly Installment Plan"
            className="w-full object-contain"
          />
        </div>

        {/* QUICK ENROLL STRIP */}
        <div className="w-full border-b border-solid border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-grow text-left">
                <label className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1.5 font-semibold">Enter Monthly Amount</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={monthlySavingsInput}
                  onChange={(e) => setMonthlySavingsInput(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  className="w-full border border-solid border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#c0392b] transition-all bg-white"
                />
              </div>
              <div className="flex-grow text-left">
                <label className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1.5 font-semibold">Enter Email address</label>
                <input
                  type="email"
                  placeholder="Enter Email address"
                  value={savingsForm.email}
                  onChange={(e) => setSavingsForm({ ...savingsForm, email: e.target.value })}
                  className="w-full border border-solid border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#c0392b] transition-all bg-white"
                />
              </div>
              <button
                onClick={() => { triggerAudio('shimmer'); navigateTo('savings-enroll'); }}
                className="px-10 py-3 rounded-lg bg-[#c0392b] hover:bg-[#a93226] text-white text-xs uppercase font-black tracking-widest transition-all cursor-pointer whitespace-nowrap shadow-md hover:shadow-lg border-none font-bold"
              >
                GET STARTED
              </button>
            </div>
            <div className="text-right mt-2">
              <button
                onClick={() => { triggerAudio('click'); navigateTo('savings-enroll'); }}
                className="text-[11px] text-gray-500 hover:text-[#c0392b] cursor-pointer transition-colors font-sans border-none bg-transparent"
              >
                Want to pay your {savingsSchemeType} Installment?{' '}
                <span className="text-[#c0392b] font-semibold hover:underline">Click to Pay</span>
              </button>
            </div>
          </div>
        </div>

        {/* WHY PLAN SECTION */}
        <div className="w-full bg-[#fafafa] py-12">
          <div className="max-w-5xl mx-auto px-6 space-y-8">
            <div className="text-center space-y-2">
              <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-semibold text-[#1a1a2e]">
                Why {savingsSchemeType} Plan?
              </h2>
              <div className="w-10 h-[2px] bg-[#c0392b] mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: 'Plan Ahead',
                  desc: 'Subscribe to plan for your future high value purchases',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 11v-1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M5 12a7 7 0 1114 0 7 7 0 01-14 0z" />
                    </svg>
                  ),
                  title: 'Gold accumulation',
                  desc: 'With every installment payment, gold units are allocated to your plan based on the prevailing gold rate',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  ),
                  title: 'Special benefits',
                  desc: 'Pay 11 installments and get on extra voucher worth upto 1 installment amount',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-white border border-solid border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1a2e] mb-1" style={{ fontFamily: 'Georgia, serif' }}>{title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section style={{ background: '#FAF8F6', width: '100%', padding: '110px 0 100px' }}>
          <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: '96px' }}>
              <p style={{
                fontFamily: 'sans-serif',
                fontSize: '10px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: '#E89AA9',
                fontWeight: '700',
                margin: '0 0 14px'
              }}>
                Simple &amp; Transparent
              </p>
              <h2 style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '40px',
                fontWeight: '600',
                color: '#0B2341',
                letterSpacing: '0.01em',
                margin: '0 0 24px',
                lineHeight: '1.2'
              }}>
                How It Works
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <div style={{ width: '64px', height: '1px', background: '#E89AA9', opacity: 0.7 }} />
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="3.5" stroke="#E89AA9" strokeWidth="0.8" />
                  <circle cx="4" cy="4" r="1.5" fill="#E89AA9" />
                </svg>
                <div style={{ width: '64px', height: '1px', background: '#E89AA9', opacity: 0.7 }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
              <div style={{ position: 'relative', width: '560px', height: '560px', flexShrink: 0 }}>
                <svg width="560" height="560" viewBox="0 0 560 560" fill="none"
                  style={{ position: 'absolute', inset: 0 }}>
                  <circle cx="260" cy="280" r="218"
                    stroke="#E89AA9" strokeWidth="1.2"
                    strokeDasharray="4 8" opacity="0.9" />

                  <circle cx="260" cy="280" r="190"
                    stroke="#E89AA9" strokeWidth="0.5"
                    opacity="0.35" />

                  <path d="M68 410 Q40 445 70 465"
                    stroke="#E89AA9" strokeWidth="0.8"
                    fill="none" strokeLinecap="round" opacity="0.6" />
                  <path d="M65 460 L70 465 L75 458"
                    stroke="#E89AA9" strokeWidth="0.8"
                    fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />

                  <line x1="431.8" y1="145.8" x2="560" y2="145.8"
                    stroke="#E89AA9" strokeWidth="0.6"
                    strokeDasharray="3 6" opacity="0.6" />
                  <circle cx="431.8" cy="145.8" r="14"
                    fill="#FAF8F6" stroke="#E89AA9" strokeWidth="0.8" />
                  <text x="431.8" y="149.8" textAnchor="middle"
                    fontFamily="sans-serif" fontSize="11"
                    fill="#0B2341" fontWeight="600">1</text>

                  <line x1="478" y1="280" x2="560" y2="280"
                    stroke="#E89AA9" strokeWidth="0.6"
                    strokeDasharray="3 6" opacity="0.6" />
                  <circle cx="478" cy="280" r="14"
                    fill="#FAF8F6" stroke="#E89AA9" strokeWidth="0.8" />
                  <text x="478" y="284" textAnchor="middle"
                    fontFamily="sans-serif" fontSize="11"
                    fill="#0B2341" fontWeight="600">2</text>

                  <line x1="431.8" y1="414.2" x2="560" y2="414.2"
                    stroke="#E89AA9" strokeWidth="0.6"
                    strokeDasharray="3 6" opacity="0.6" />
                  <circle cx="431.8" cy="414.2" r="14"
                    fill="#FAF8F6" stroke="#E89AA9" strokeWidth="0.8" />
                  <text x="431.8" y="418.2" textAnchor="middle"
                    fontFamily="sans-serif" fontSize="11"
                    fill="#0B2341" fontWeight="600">3</text>
                </svg>

                <div style={{
                  position: 'absolute',
                  top: '280px', left: '260px',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center', width: '240px',
                  pointerEvents: 'none'
                }}>
                  <h3 style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: '38px',
                    fontWeight: '700',
                    color: '#0B2341',
                    lineHeight: '1.2',
                    letterSpacing: '0.01em',
                    margin: 0
                  }}>
                    3 Easy<br />Steps
                  </h3>
                  <div style={{
                    width: '40px', height: '1px',
                    background: '#E89AA9', margin: '14px auto'
                  }} />
                  <p style={{
                    fontFamily: 'sans-serif',
                    fontSize: '12px',
                    color: '#8A94A6',
                    lineHeight: '1.6',
                    margin: 0,
                    fontWeight: '400'
                  }}>
                    to purchase the jewellery your heart desires
                  </p>
                </div>
              </div>

              <div style={{
                flex: 1,
                position: 'relative',
                height: '560px',
                minWidth: 0
              }}>
                {/* STEP 01 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '98px', left: 0, right: 0,
                    height: '96px',
                    display: 'flex', alignItems: 'center',
                    gap: '28px',
                    borderBottom: '0.5px solid rgba(232,154,169,0.15)',
                    paddingBottom: '20px'
                  }}
                >
                  <div style={{
                    width: '80px', height: '80px', flexShrink: 0,
                    borderRadius: '50%',
                    border: '1px solid #E89AA9',
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '4px',
                    boxShadow: '0 4px 15px rgba(232,154,169,0.06)'
                  }}>
                    <div style={{
                      width: '100%', height: '100%',
                      borderRadius: '50%',
                      border: '0.8px solid rgba(232,154,169,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9"
                        strokeWidth="1.2" width="28" height="28"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{
                      fontFamily: 'sans-serif',
                      fontSize: '9px', letterSpacing: '0.25em',
                      textTransform: 'uppercase', color: '#E89AA9',
                      fontWeight: '700', margin: '0 0 4px'
                    }}>Step 01</p>
                    <p style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: '20px', fontWeight: '600',
                      color: '#0B2341', margin: '0 0 4px',
                      letterSpacing: '0.01em'
                    }}>Monthly Payments</p>
                    <p style={{
                      fontFamily: 'sans-serif',
                      fontSize: '13px', color: '#6F727A',
                      lineHeight: '1.6', margin: 0,
                      maxWidth: '340px', fontWeight: '400'
                    }}>Pay 11 monthly installments to accumulate gold units.</p>
                  </div>
                </div>

                {/* STEP 02 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '232px', left: 0, right: 0,
                    height: '96px',
                    display: 'flex', alignItems: 'center',
                    gap: '28px',
                    borderBottom: '0.5px solid rgba(232,154,169,0.15)',
                    paddingBottom: '20px'
                  }}
                >
                  <div style={{
                    width: '80px', height: '80px', flexShrink: 0,
                    borderRadius: '50%',
                    border: '1px solid #E89AA9',
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '4px',
                    boxShadow: '0 4px 15px rgba(232,154,169,0.06)'
                  }}>
                    <div style={{
                      width: '100%', height: '100%',
                      borderRadius: '50%',
                      border: '0.8px solid rgba(232,154,169,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9"
                        strokeWidth="1.2" width="28" height="28"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3h12l4 6-10 12L2 9z" />
                        <path d="M11 3 L8 9 L12 21 L16 9 L13 3" />
                        <path d="M2 9h20" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{
                      fontFamily: 'sans-serif',
                      fontSize: '9px', letterSpacing: '0.25em',
                      textTransform: 'uppercase', color: '#E89AA9',
                      fontWeight: '700', margin: '0 0 4px'
                    }}>Step 02</p>
                    <p style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: '20px', fontWeight: '600',
                      color: '#0B2341', margin: '0 0 4px',
                      letterSpacing: '0.01em'
                    }}>Get Special Benefits</p>
                    <p style={{
                      fontFamily: 'sans-serif',
                      fontSize: '13px', color: '#6F727A',
                      lineHeight: '1.6', margin: 0,
                      maxWidth: '340px', fontWeight: '400'
                    }}>Pay for 11 months on time and unlock an extra voucher worth upto 1 installment.</p>
                  </div>
                </div>

                {/* STEP 03 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '366px', left: 0, right: 0,
                    height: '96px',
                    display: 'flex', alignItems: 'center',
                    gap: '28px',
                    paddingBottom: '20px'
                  }}
                >
                  <div style={{
                    width: '80px', height: '80px', flexShrink: 0,
                    borderRadius: '50%',
                    border: '1px solid #E89AA9',
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifycenter: 'center',
                    padding: '4px',
                    boxShadow: '0 4px 15px rgba(232,154,169,0.06)'
                  }}>
                    <div style={{
                      width: '100%', height: '100%',
                      borderRadius: '50%',
                      border: '0.8px solid rgba(232,154,169,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#E89AA9"
                        strokeWidth="1.2" width="28" height="28"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{
                      fontFamily: 'sans-serif',
                      fontSize: '9px', letterSpacing: '0.25em',
                      textTransform: 'uppercase', color: '#E89AA9',
                      fontWeight: '700', margin: '0 0 4px'
                    }}>Step 03</p>
                    <p style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: '20px', fontWeight: '600',
                      color: '#0B2341', margin: '0 0 4px',
                      letterSpacing: '0.01em'
                    }}>Happy Shopping</p>
                    <p style={{
                      fontFamily: 'sans-serif',
                      fontSize: '13px', color: '#6F727A',
                      lineHeight: '1.6', margin: 0,
                      maxWidth: '340px', fontWeight: '400'
                    }}>Use the auto-redeemed voucher (equal to your total reserved gold units' live value at maturity) to buy at any of our stores or online.</p>
                  </div>
                </div>

              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '72px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#FDF7F7',
                border: '1px solid rgba(232,154,169,0.25)',
                borderRadius: '30px',
                padding: '12px 36px',
                fontFamily: 'sans-serif',
                fontSize: '12px',
                color: '#6F727A',
                letterSpacing: '0.02em',
                boxShadow: '0 2px 12px rgba(232,154,169,0.03)'
              }}>
                <svg viewBox="0 0 14 14" fill="none" width="13" height="13" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="6" stroke="#E89AA9" strokeWidth="1" />
                  <path d="M7 4.5V7.5L9 9" stroke="#E89AA9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Refer to the calculator below for details
              </span>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section style={{ background: '#ffffff', padding: '64px 0 48px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px' }}>
            <h2 style={{
              textAlign: 'center',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '32px',
              fontWeight: '600',
              color: '#0B2341',
              margin: '0 0 8px',
              letterSpacing: '0.01em'
            }}>Gold Reserve Calculator</h2>

            <p style={{
              textAlign: 'center',
              fontFamily: 'sans-serif',
              fontSize: '14px',
              color: '#555',
              margin: '0 0 40px',
              fontWeight: '500'
            }}>Today's Gold rate(24kt) | ₹ {goldRate24k.toFixed(2)}</p>

            <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-start', marginBottom: '24px' }}>
              {/* LEFT */}
              <div style={{ width: '320px', flexShrink: 0 }}>
                <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#0B2341', fontWeight: '600', marginBottom: '14px', lineHeight: '1.5' }}>
                  Slide or enter monthly installment amount
                </p>

                <div style={{
                  border: '1.2px solid #D1D5DB',
                  borderRadius: '4px',
                  background: '#fff',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', fontWeight: '600', fontFamily: 'sans-serif' }}>Monthly Amount</span>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#0C223F', fontFamily: 'sans-serif', marginTop: '2px' }}>₹ {(Number(monthlySavingsInput) || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => { triggerAudio('shimmer'); navigateTo('savings-enroll'); }}
                    style={{
                      background: '#c0392b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: '800',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    CHECK
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={Number(monthlySavingsInput) || 1000}
                    onChange={(e) => setMonthlySavingsInput(Number(e.target.value))}
                    className="gmc-slider"
                    style={{
                      background: `linear-gradient(to right, #c0392b 0%, #c0392b ${(((Number(monthlySavingsInput) || 1000) - 1000) / 49000) * 100}%, #E5E7EB ${(((Number(monthlySavingsInput) || 1000) - 1000) / 49000) * 100}%, #E5E7EB 100%)`
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999', marginTop: '8px', fontFamily: 'sans-serif', fontWeight: '600' }}>
                    <span>1,000</span>
                    <span>25,000</span>
                    <span>50,000</span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div style={{ flex: 1, borderLeft: '1.2px solid #E5E7EB', paddingLeft: '64px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '12px', background: '#0B2341', borderRadius: '2px', flexShrink: 0 }} />
                    <div style={{ fontFamily: 'sans-serif' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '500', color: '#0B2341', display: 'block' }}>Your Payment</span>
                      <span style={{ fontSize: '11px', color: '#888' }}>(1 installment)</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0B2341', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                    ₹ {(Number(monthlySavingsInput) || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '12px', background: '#38A52B', borderRadius: '2px', flexShrink: 0 }} />
                    <div style={{ fontFamily: 'sans-serif' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '500', color: '#0B2341', display: 'block' }}>Your Reserved Gold</span>
                      <span style={{ fontSize: '11px', color: '#888' }}>(in units)</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0B2341', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                    {((Number(monthlySavingsInput) || 0) / (goldRate24k || 1)).toFixed(4)}
                  </div>
                </div>

                <div style={{ height: '1px', background: '#E5E5E5', marginBottom: '18px' }} />

                <div style={{
                  fontFamily: 'sans-serif',
                  fontSize: '13px',
                  color: '#555',
                  lineHeight: '1.6',
                  background: '#FAF8F6',
                  padding: '16px',
                  borderRadius: '4px',
                  border: '1px solid #EAEAEA'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#0B2341' }}>
                    Pay all installments on time and choose between one of the two following options for your special benefit voucher:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li>Plain Gold voucher worth 50% of your installment amount.</li>
                    <li style={{ marginTop: '4px' }}>Non-Plain Gold voucher worth 100% of your installment amount.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ height: '1.2px', background: '#E6B7BE', opacity: 0.6, width: '100%', margin: '24px 0 12px 0' }} />
            <p style={{
              fontSize: '11.5px',
              color: '#8A94A6',
              textAlign: 'center',
              lineHeight: '1.5',
              margin: 0,
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              If jewellery is more than ₹ {(monthlySavingsInput * 11).toLocaleString('en-IN')}, you just need to pay the difference amount at the time of purchase
            </p>
          </div>
        </section>

        {/* NOTE & FAQ */}
        <section
          className="relative w-full overflow-hidden flex flex-col items-center justify-between box-border"
          style={{
            background: '#F9F1F2',
            height: '520px',
            paddingTop: '110px',
            paddingBottom: '50px'
          }}
        >
          <div className="absolute top-0 left-0 right-0 w-full z-10 pointer-events-none" style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[60px] md:h-[100px] block">
              <path d="M0,100 C360,30 1080,30 1440,100 L1440,0 L0,0 Z" fill="#ffffff" />
            </svg>
          </div>

          <div className="w-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-between h-full relative z-20">
            <div className="text-center max-w-[600px] px-4">
              <span
                className="block text-xs font-extrabold uppercase tracking-widest mb-1.5 font-sans"
                style={{ color: '#F26544' }}
              >
                NOTE:-
              </span>
              <p className="text-xs md:text-[13px] text-[#6F727A] leading-relaxed font-sans m-0">
                *1 gold unit = 1 gram of 24kt gold<br />
                The Gold Reserve Option Plan is redeemable from 2nd month onwards, subject to terms and conditions.<br />
                The subscription amount and primary voucher can be used towards the purchase of Diamond studded, Gemstone studded, Plain Gold, Plain Platinum or Preset Solitaire jewellery.<br />
                The Plain Gold special benefit voucher can be used towards the purchase of Plain Gold jewellery only.<br />
                The Non-Plain Gold special benefit voucher can be used towards the purchase of Diamond studded, Gemstone studded, Plain Platinum or Preset Solitaire jewellery only.
              </p>
            </div>

            <div className="flex items-center w-full my-4 md:my-6">
              <div className="flex-grow h-[1px] md:h-[1.2px]" style={{ backgroundColor: '#E6B7BE' }} />
              <div className="bg-white py-3 md:py-4 px-6 md:px-12 mx-3 md:mx-6 shadow-none">
                <h3
                  className="text-base md:text-[28px] font-medium text-[#0B2341] m-0 tracking-wide text-center font-serif"
                  style={{ lineHeight: '1.2' }}
                >
                  Find answers to all your queries here
                </h3>
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
