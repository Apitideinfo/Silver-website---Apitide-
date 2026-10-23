import React from 'react';
import { BUSINESS } from '../config/constants';

export default function PrivacyPolicy({ navigateTo, triggerAudio }) {
  const policySections = [
    {
      num: '01',
      title: 'Information We Collect',
      content: `${BUSINESS.NAME} collects personal information you voluntarily provide when placing an order, booking showroom appointments or video consultations, or contacting our customer concierge. This includes your name, phone number, shipping address, email address, and order customization requests.`,
    },
    {
      num: '02',
      title: 'How We Use Your Information',
      content: 'We use your information to fulfill jewellery orders, dispatch insured shipments, provide real-time WhatsApp tracking updates, deliver certificate verifications, personalize jewellery recommendations, and facilitate boutique consultations. We strictly never sell, trade, or rent your personal data to third parties.',
    },
    {
      num: '03',
      title: 'Data Security',
      content: `Your data is stored securely with industry-standard encryption protocols. We employ strict SSL encryption for all digital transactions and interactions. Access to client data is strictly restricted to authorized ${BUSINESS.NAME} personnel.`,
    },
    {
      num: '04',
      title: 'Cookies & Analytics',
      content: 'Our website uses cookies to enhance your browsing experience, remember your preferences, cart items, and wishlist selections, and analyze site traffic. You can control cookie preferences through your web browser.',
    },
    {
      num: '05',
      title: 'Direct Client Communications',
      content: 'By providing your phone number during checkout or appointment booking, you consent to receive direct order invoices, insured dispatch tracking, and concierge styling updates via WhatsApp or SMS. You may opt out at any time by messaging "STOP".',
    },
    {
      num: '06',
      title: 'Your Rights',
      content: `You have the right to access, rectify, or request deletion of your personal contact records. To exercise these rights, please contact our support desk at ${BUSINESS.EMAIL} or call ${BUSINESS.PHONE_PRIMARY}. We respond to all privacy queries promptly.`,
    },
    {
      num: '07',
      title: 'Third-Party Links & Payment Gateways',
      content: 'Our platform interfaces with certified, RBI-approved Indian payment processors and courier logistics partners. All transactions occur under industry-standard bank-grade security protocols.',
    }
  ];

  return (
    <div className="transition-colors duration-500 min-h-screen pb-8 bg-[#F8F5EC] text-[#202329]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-10 animate-slide-up text-left">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center space-x-2 bg-[#0D2B4E]/5 border border-[#B09A82]/30 px-4 py-1.5 rounded-full mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D2B4E] animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#0D2B4E] font-bold">
              {BUSINESS.NAME} • FINE SILVER JEWELLERY
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#0D2B4E] leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#657989] max-w-md mx-auto leading-relaxed font-sans">
            Effective Date: 2026. We are committed to safeguarding your personal information and ensuring absolute privacy and data protection across all orders.
          </p>
          <div className="w-12 h-[1.5px] bg-[#6B4B2E] mx-auto mt-2"></div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {policySections.map((sec) => (
            <section key={sec.num} className="bg-white border border-[#E6DFD3] rounded-3xl p-6 sm:p-8 shadow-sm hover:border-[#B09A82]/40 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-[10px] bg-[#0D2B4E]/10 border border-[#B09A82]/30 px-2.5 py-1 rounded-full text-[#0D2B4E] font-bold tracking-wider">
                  SECTION {sec.num}
                </span>
              </div>
              <h3 className="font-serif text-lg text-[#0D2B4E] font-bold mb-3">
                {sec.title}
              </h3>
              <p className="text-xs font-light text-gray-600 leading-relaxed font-sans">
                {sec.content}
              </p>
            </section>
          ))}
        </div>

        {/* Back CTA Button */}
        <div className="text-center pt-8 pb-4">
          <button
            onClick={() => {
              if (triggerAudio) triggerAudio('click');
              navigateTo('home');
            }}
            className="inline-flex items-center space-x-2 bg-[#0D2B4E] hover:bg-[#091B2B] text-[#F8F5EC] font-sans font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 hover:shadow-lg duration-300 cursor-pointer border border-[#B09A82]/30"
          >
            <span>←</span> <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
