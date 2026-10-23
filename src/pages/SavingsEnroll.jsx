import React from 'react';
import { useSavings } from '../contexts/SavingsContext';
import { useBooking } from '../hooks/useBooking';

export default function SavingsEnroll({
  triggerAudio,
  navigateTo
}) {
  const {
    savingsEnrollStep,
    setSavingsEnrollStep,
    savingsEnrollForm,
    setSavingsEnrollForm,
    monthlySavingsInput,
    savingsSchemeType
  } = useSavings();

  const { enrollSavings, submitting, errors } = useBooking();

  const [upiId, setUpiId] = React.useState('');
  const [cardNo, setCardNo] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');
  const [netbankBank, setNetbankBank] = React.useState('');

  const handleSavingsEnrollWizardSubmit = async (e) => {
    e.preventDefault();
    if (triggerAudio) triggerAudio('shimmer');
    
    // Map form states to payload properties expected by BookingService & API
    const payload = {
      fullName: savingsEnrollForm.name,
      whatsapp: savingsEnrollForm.mobile,
      email: savingsEnrollForm.email,
      amount: Number(monthlySavingsInput),
      nomineeName: savingsEnrollForm.nomineeName,
      nomineeRelationship: savingsEnrollForm.nomineeRelationship,
      paymentMethod: savingsEnrollForm.paymentMethod,
      address: `${savingsEnrollForm.address || ''}, ${savingsEnrollForm.street || ''}, ${savingsEnrollForm.locality || ''}, ${savingsEnrollForm.landmark || ''}, ${savingsEnrollForm.city || ''}, ${savingsEnrollForm.state || ''} - ${savingsEnrollForm.pincode || ''}`,
      schemeType: savingsSchemeType || 'Gold Mine'
    };

    const success = await enrollSavings(payload);
    if (success) {
      setSavingsEnrollStep(4);
    }
  };

  return (
    <div className="bg-[#FAF8F6] min-h-screen pb-16 font-sans text-gray-800">
      {/* Enrollment Header */}
      <header className="w-full bg-white border-b border-gray-200 py-5 sm:py-5 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        {/* Logo */}
        <div onClick={() => navigateTo('home')} className="flex items-center space-x-2 font-serif text-lg font-bold text-[#031838] tracking-widest cursor-pointer select-none">
          <span>HR JEWELLER &amp; SONS</span>
        </div>

        {/* Progress Bar (Matching HR Jewellers & Sons style) */}
        {savingsEnrollStep <= 3 && (
          <div className="flex items-center space-x-4 text-xs font-semibold select-none">
            <div className="flex flex-col items-center">
              <span className={`${savingsEnrollStep === 1 ? 'text-[#031838]' : 'text-gray-400'}`}>Personal Details</span>
              <div className={`w-3.5 h-3.5 rounded-full border-2 mt-1 flex items-center justify-center ${savingsEnrollStep >= 1 ? 'border-[#006361] bg-[#006361]' : 'border-gray-300 bg-white'}`}>
                {savingsEnrollStep > 1 && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <div className="w-12 h-[2px] bg-gray-200 mt-4 animate-pulse" style={{ backgroundColor: savingsEnrollStep > 1 ? '#006361' : '#E5E7EB' }} />
            <div className="flex flex-col items-center">
              <span className={`${savingsEnrollStep === 2 ? 'text-[#031838]' : 'text-gray-400'}`}>Nominee Details</span>
              <div className={`w-3.5 h-3.5 rounded-full border-2 mt-1 flex items-center justify-center ${savingsEnrollStep >= 2 ? 'border-[#006361] bg-[#006361]' : 'border-gray-300 bg-white'}`}>
                {savingsEnrollStep > 2 && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <div className="w-12 h-[2px] bg-gray-200 mt-4" style={{ backgroundColor: savingsEnrollStep > 2 ? '#006361' : '#E5E7EB' }} />
            <div className="flex flex-col items-center">
              <span className={`${savingsEnrollStep === 3 ? 'text-[#031838]' : 'text-gray-400'}`}>Payment Details</span>
              <div className={`w-3.5 h-3.5 rounded-full border-2 mt-1 flex items-center justify-center ${savingsEnrollStep >= 3 ? 'border-[#006361] bg-[#006361]' : 'border-gray-300 bg-white'}`}>
                {savingsEnrollStep > 3 && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
          </div>
        )}

        {/* Secure Badge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 tracking-wide select-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#006361]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="font-bold text-[#006361]">100% SECURE</span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-10">

        {savingsEnrollStep === 4 ? (
          /* STEP 4: SUCCESS RECEIPT SCREEN */
          <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 shadow-xl text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 animate-bounce">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="serif-luxury text-3xl font-bold text-[#031838]">Enrollment Initiated Successfully!</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Your application for the 11+1 Gold Saving scheme is processed. A Showroom Specialist will contact you on WhatsApp to finalize direct bank mandate links.
              </p>
            </div>

            <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-left space-y-3 bg-[#FAF8F6]">
              <div className="flex justify-between text-xs text-gray-600"><span className="font-bold">Subscriber Name</span><span>{savingsEnrollForm.name}</span></div>
              <div className="flex justify-between text-xs text-gray-600"><span className="font-bold">Contact Phone</span><span>{savingsEnrollForm.mobile}</span></div>
              <div className="flex justify-between text-xs text-gray-600"><span className="font-bold">Email Address</span><span>{savingsEnrollForm.email}</span></div>
              <div className="flex justify-between text-xs text-gray-600"><span className="font-bold">Nominee Name</span><span>{savingsEnrollForm.nomineeName} ({savingsEnrollForm.nomineeRelationship})</span></div>
              <div className="h-[1px] bg-gray-200 my-2" />
              <div className="flex justify-between text-sm text-[#031838] font-bold"><span>Monthly Installment</span><span>₹ {monthlySavingsInput.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-sm text-[#006361] font-bold"><span>12th Month Bonus (Showroom)</span><span>₹ {monthlySavingsInput.toLocaleString('en-IN')}</span></div>
            </div>

            <button
              onClick={() => navigateTo('home')}
              className="px-8 py-3.5 rounded-xl bg-[#031838] hover:bg-[#0c2b5c] text-white text-xs uppercase font-black tracking-widest transition-all shadow-md cursor-pointer border-none"
            >
              Go back to Home
            </button>
          </div>
        ) : (
          /* SPLIT LAYOUT FOR STEPS 1, 2, 3 */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* LEFT PANEL - FORMS */}
            <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-md">

              {savingsEnrollStep === 1 && (
                /* STEP 1: PERSONAL DETAILS FORM */
                <form onSubmit={(e) => { e.preventDefault(); setSavingsEnrollStep(2); }} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4 text-left">
                    <h2 className="text-xl font-bold text-[#031838] serif-luxury">Personal Details</h2>
                    <p className="text-xs text-gray-400 font-light">Kindly enter your personal details for the fields mentioned below</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {/* Email address */}
                    <div className="relative border border-gray-200 rounded-xl px-3 py-2 bg-[#FAF8F6]">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Email Address</span>
                      <input
                        type="email"
                        required
                        value={savingsEnrollForm.email}
                        onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, email: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-700 font-semibold mt-0.5 focus:ring-0"
                      />
                    </div>

                    {/* Mobile number */}
                    <div className="relative border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">Mobile Number</span>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9783843978"
                        value={savingsEnrollForm.mobile}
                        onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, mobile: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="relative border border-gray-200 rounded-xl px-3 py-2 text-left">
                    <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">Your Full Name</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suryaveer Singh"
                      value={savingsEnrollForm.name}
                      onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, name: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {/* Pincode */}
                    <div className="relative border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">Pincode</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 334001"
                        value={savingsEnrollForm.pincode}
                        onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, pincode: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0"
                      />
                    </div>

                    {/* Flat/House No. */}
                    <div className="relative border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">Apartment/House/Flat No.</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 4-D-37"
                        value={savingsEnrollForm.address}
                        onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, address: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {/* Street/Colony */}
                    <div className="relative border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">Street/Colony/Area Name</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. JNV Colony"
                        value={savingsEnrollForm.street}
                        onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, street: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0"
                      />
                    </div>

                    {/* Locality */}
                    <div className="relative border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">Locality/Town</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Near Murti Circle"
                        value={savingsEnrollForm.locality}
                        onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, locality: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {/* Landmark */}
                    <div className="relative border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">Landmark (Optional)</span>
                      <input
                        type="text"
                        placeholder="e.g. Opposite Park"
                        value={savingsEnrollForm.landmark}
                        onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, landmark: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0"
                      />
                    </div>

                    {/* City */}
                    <div className="relative border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">City/District</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bikaner"
                        value={savingsEnrollForm.city}
                        onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, city: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0"
                      />
                    </div>
                  </div>

                  {/* State Dropdown */}
                  <div className="relative border border-gray-200 rounded-xl px-3 py-2 text-left">
                    <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">State</span>
                    <select
                      value={savingsEnrollForm.state}
                      onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, state: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0 select-none cursor-pointer"
                    >
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>

                  <div className="pt-2 text-left">
                    <p className="text-[10px] text-gray-400 font-light leading-relaxed font-sans">
                      By clicking Next, I hereby acknowledge that I am above 18 years old and I am resident of India.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-10 py-3.5 rounded-xl bg-[#E84F35] hover:bg-[#d63d22] text-white text-xs uppercase font-black tracking-widest transition-all shadow-md cursor-pointer border-none"
                    >
                      NEXT
                    </button>
                  </div>
                </form>
              )}

              {savingsEnrollStep === 2 && (
                /* STEP 2: NOMINEE DETAILS FORM */
                <form onSubmit={(e) => { e.preventDefault(); setSavingsEnrollStep(3); }} className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-100 pb-4 text-left">
                    <h2 className="text-xl font-bold text-[#031838] serif-luxury">Nominee Details</h2>
                    <p className="text-xs text-gray-400 font-light" style={{ lineHeight: '1.5' }}>Enter details of the person who can redeem the plan benefits in case of unforeseen circumstances</p>
                  </div>

                  {/* Nominee Name & Relationship - Side by Side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {/* Nominee's Full Name */}
                    <div className="relative border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">Nominee's Full Name</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Savitri Devi"
                        value={savingsEnrollForm.nomineeName}
                        onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, nomineeName: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0"
                      />
                    </div>

                    {/* Relationship Dropdown */}
                    <div className="relative border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">Relationship</span>
                      <select
                        value={savingsEnrollForm.nomineeRelationship}
                        onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, nomineeRelationship: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0 cursor-pointer select-none"
                      >
                        <option value="Wife">Wife</option>
                        <option value="Husband">Husband</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Nationality Dropdown */}
                  <div className="relative border border-gray-200 rounded-xl px-3 py-2 text-left">
                    <span className="text-[9px] uppercase tracking-wider text-[#031838] font-bold block">Nationality</span>
                    <select
                      value={savingsEnrollForm.nomineeNationality || 'Indian'}
                      onChange={(e) => setSavingsEnrollForm({ ...savingsEnrollForm, nomineeNationality: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0 cursor-pointer select-none"
                    >
                      <option value="Indian">Indian</option>
                      <option value="NRI">NRI (Non-Resident Indian)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed text-left">
                    By clicking Next, I hereby acknowledge that nominee is above 18 years old
                  </p>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setSavingsEnrollStep(1)}
                      className="px-8 py-3.5 rounded-xl border border-gray-200 text-gray-600 text-xs uppercase font-black tracking-widest transition-all hover:bg-gray-50 cursor-pointer"
                    >
                      BACK
                    </button>
                    <button
                      type="submit"
                      className="px-10 py-3.5 rounded-xl bg-[#E84F35] hover:bg-[#d63d22] text-white text-xs uppercase font-black tracking-widest transition-all shadow-md cursor-pointer border-none"
                    >
                      NEXT
                    </button>
                  </div>
                </form>
              )}

              {savingsEnrollStep === 3 && (
                /* STEP 3: PAYMENT DETAILS FORM */
                <form onSubmit={handleSavingsEnrollWizardSubmit} className="space-y-6 animate-fade-in">
                  <div className="pb-4 text-left">
                    <h2 className="text-lg font-bold text-[#031838] serif-luxury">Choose a Payment Method</h2>
                  </div>

                  {/* Payment Layout: Vertical Tabs + Content */}
                  <div className="flex flex-col sm:flex-row gap-0">
                    {/* Vertical Tabs (Left) */}
                    <div className="flex flex-row sm:flex-col sm:min-w-[140px] border-b sm:border-b-0 sm:border-r border-gray-200 text-left">
                      {[
                        { id: 'card', name: 'Cards' },
                        { id: 'netbanking', name: 'Net Banking' },
                        { id: 'upi', name: 'UPI' }
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSavingsEnrollForm({ ...savingsEnrollForm, paymentMethod: m.id })}
                          className={`text-left px-4 py-3 text-xs font-semibold transition-all cursor-pointer relative border-none bg-transparent ${savingsEnrollForm.paymentMethod === m.id
                            ? 'text-[#031838] bg-white'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                          style={savingsEnrollForm.paymentMethod === m.id ? {
                            borderLeft: '3px solid #E84F35',
                          } : {
                            borderLeft: '3px solid transparent',
                          }}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 px-4 sm:px-8 py-4 sm:py-2 text-left">
                      <h3 className="text-sm font-bold text-[#031838] mb-3">
                        Pay with {savingsEnrollForm.paymentMethod === 'card' ? 'Credit / Debit Card' : savingsEnrollForm.paymentMethod === 'netbanking' ? 'Net Banking' : 'UPI'}
                      </h3>

                      {/* Card Details Inputs */}
                      {savingsEnrollForm.paymentMethod === 'card' && (
                        <div className="space-y-4 mb-6">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Name on Card</label>
                            <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder="e.g. Anil Soni"
                              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-200 focus:border-gold focus:outline-none text-xs"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Card Number</label>
                            <input
                              type="text"
                              value={cardNo}
                              onChange={(e) => setCardNo(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                              maxLength="19"
                              placeholder="1234 5678 1234 5678"
                              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-200 focus:border-gold focus:outline-none text-xs"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Expiry Date</label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="MM/YY"
                                maxLength="5"
                                className="w-full h-11 px-4 rounded-xl border border-solid border-slate-200 focus:border-gold focus:outline-none text-xs"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">CVV</label>
                              <input
                                type="password"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                placeholder="***"
                                maxLength="3"
                                className="w-full h-11 px-4 rounded-xl border border-solid border-slate-200 focus:border-gold focus:outline-none text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Net Banking Inputs */}
                      {savingsEnrollForm.paymentMethod === 'netbanking' && (
                        <div className="space-y-1 mb-6">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Select Your Bank</label>
                          <select
                            value={netbankBank}
                            onChange={(e) => setNetbankBank(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-solid border-slate-200 focus:border-gold focus:outline-none text-xs bg-white"
                            required
                          >
                            <option value="">Choose a bank</option>
                            <option value="SBI">State Bank of India</option>
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="Axis">Axis Bank</option>
                            <option value="Kotak">Kotak Mahindra Bank</option>
                            <option value="PNB">Punjab National Bank</option>
                          </select>
                        </div>
                      )}

                      {/* UPI Input */}
                      {savingsEnrollForm.paymentMethod === 'upi' && (
                        <div className="space-y-1 mb-6">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">UPI ID / Virtual Payment Address (VPA)</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. name@upi or name@okaxis"
                            className="w-full h-11 px-4 rounded-xl border border-solid border-slate-200 focus:border-gold focus:outline-none text-xs"
                            required
                          />
                        </div>
                      )}

                      {/* PROCEED TO PAY Button */}
                      {errors?.global && (
                        <div className="text-red-500 text-xs font-semibold mb-3">
                          {errors.global}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full sm:w-auto px-16 py-3.5 rounded-lg bg-[#E84F35] hover:bg-[#d63d22] text-white text-xs uppercase font-black tracking-widest transition-all shadow-md cursor-pointer border-none font-bold ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {submitting ? 'PROCESSING...' : 'PROCEED TO PAY'}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-start pt-4">
                    <button
                      type="button"
                      onClick={() => setSavingsEnrollStep(2)}
                      className="px-8 py-3.5 rounded-xl border border-gray-200 text-gray-600 text-xs uppercase font-black tracking-widest transition-all hover:bg-gray-50 cursor-pointer"
                    >
                      BACK
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* RIGHT PANEL - SUBSCRIPTION SUMMARY */}
            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-md space-y-6 text-left">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#031838] serif-luxury">Subscription Summary</h3>
                <p className="text-[10px] text-gray-400">Kindly check your monthly subscription amount.</p>
              </div>

              {/* Subscription amount card */}
              <div className="border border-red-200 bg-red-50/20 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                  <span>Subscription Amount (Monthly)</span>
                  <span className="text-[#031838] font-bold">₹ {(Number(monthlySavingsInput) || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="h-[1px] bg-red-100" />
                <div className="flex justify-between items-center text-sm font-bold text-[#031838]">
                  <span>You Pay</span>
                  <span className="text-[#c0392b] text-base font-sans font-bold">₹ {(Number(monthlySavingsInput) || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 font-light text-center leading-normal font-sans">
                Any Questions? Please call us at <strong className="text-[#031838]">+91 97838 43978</strong>
              </p>
            </div>

          </div>
        )}

      </div>

      {/* Value Propositions Footer (similar to HR Jewellers & Sons) */}
      <div className="w-full bg-[#FAF8F6] border-t border-gray-200 mt-16 pt-10 pb-6 px-6 sm:px-12 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Props list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#031838]">Bikaner's Heritage Store</span>
              <p className="text-[9px] text-gray-400 font-light">Established lineage since 1952</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#031838]">Trusted by Patrons</span>
              <p className="text-[9px] text-gray-400 font-light font-sans">Renowned for purity nationwide</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#031838]">100% Transparent Pricing</span>
              <p className="text-[9px] text-gray-400 font-light">Guaranteed weight & value tracking</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#031838]">Certified Hallmark</span>
              <p className="text-[9px] text-gray-400 font-light">100% BIS Hallmarked Jewellery</p>
            </div>
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-sans select-none">
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>RuPay</span>
            <span>•</span>
            <span>UPI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
