import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { BUSINESS } from '../config/constants';

const TERMS_DATA = [
  {
    id: "tc-sec-1",
    num: 1,
    title: "General Terms",
    paragraphs: [
      `${BUSINESS.NAME} reserves the right to modify, update, or discontinue any service, product, offer, or policy without prior notice.`,
      "All products displayed on our website are subject to availability.",
      "Product images are for illustrative purposes only. Actual product appearance may vary slightly due to screen settings, photography, and handcrafted variations."
    ]
  },
  {
    id: "tc-sec-2",
    num: 2,
    title: "Product Pricing",
    paragraphs: [
      "Silver, gold, diamond, gemstone, and precious metal prices fluctuate based on market bullion rates.",
      "All prices displayed are subject to change without prior notice.",
      "The final price applicable will be the price displayed at the time of order confirmation.",
      "Taxes, GST, shipping charges, and other applicable fees may be added during checkout."
    ]
  },
  {
    id: "tc-sec-3",
    num: 3,
    title: "Promotional Offers",
    paragraphs: [
      "Offers, discounts, coupons, vouchers, and promotional campaigns are applicable only on selected products.",
      `${BUSINESS.NAME} reserves the right to withdraw, modify, or cancel any offer at any time.`,
      "Offers cannot be combined unless specifically mentioned."
    ]
  },
  {
    id: "tc-sec-4",
    num: 4,
    title: "Account Registration",
    paragraphs: [
      "Customers are responsible for maintaining the confidentiality of their account credentials.",
      "Any activity conducted through a registered account shall be deemed authorized by the account holder.",
      `${BUSINESS.NAME} reserves the right to suspend or terminate accounts involved in fraudulent or suspicious activities.`
    ]
  },
  {
    id: "tc-sec-5",
    num: 5,
    title: "Orders & Payments",
    paragraphs: [
      "Orders will be processed only after successful payment verification.",
      "We accept payments through approved payment gateways, UPI, Net Banking, Debit Cards, Credit Cards, and other supported methods.",
      `${BUSINESS.NAME} reserves the right to cancel any order due to pricing errors, stock unavailability, suspected fraud, or regulatory requirements.`
    ]
  },
  {
    id: "tc-sec-6",
    num: 6,
    title: "Shipping & Delivery",
    paragraphs: [
      "Delivery timelines are estimates and may vary depending on location, logistics, weather conditions, or other unforeseen circumstances.",
      "Customers must provide accurate shipping information.",
      "Risk of loss passes to the customer upon successful delivery."
    ]
  },
  {
    id: "tc-sec-7",
    num: 7,
    title: "Cancellation Policy",
    paragraphs: [
      "Orders may be cancelled before dispatch without additional charges.",
      "Customized jewellery, engraved products, personalized items, and made-to-order products cannot be cancelled once production has commenced.",
      "Refunds for prepaid orders will be processed according to our refund policy."
    ]
  },
  {
    id: "tc-sec-8",
    num: 8,
    title: "Returns & Refunds",
    paragraphs: [
      "Eligible products may be returned within the return period specified on the product page.",
      "Customized jewellery, personalized products, coins, bullion, and special-order items may not be eligible for return.",
      "Refunds will be processed after successful quality inspection and approval.",
      "Refunds will be issued through the original payment method whenever possible."
    ]
  },
  {
    id: "tc-sec-9",
    num: 9,
    title: "Exchange & Buyback Policy",
    paragraphs: [
      "Exchange and buyback services are subject to product verification, purity testing, and applicable deductions.",
      "Buyback values may vary according to prevailing market rates and company policies.",
      `${BUSINESS.NAME} reserves the right to reject products that do not meet exchange eligibility requirements.`
    ]
  },
  {
    id: "tc-sec-10",
    num: 10,
    title: "KYC & PAN Requirements",
    paragraphs: [
      "For purchases exceeding limits prescribed under applicable Indian laws, customers must provide valid PAN details and supporting KYC documentation.",
      "Failure to provide required documentation may result in order cancellation or transaction delays."
    ]
  },
  {
    id: "tc-sec-11",
    num: 11,
    title: "Intellectual Property",
    paragraphs: [
      `All trademarks, logos, product images, content, graphics, designs, videos, and website materials belong exclusively to ${BUSINESS.NAME}.`,
      "Unauthorized use, reproduction, or distribution is strictly prohibited."
    ]
  },
  {
    id: "tc-sec-12",
    num: 12,
    title: "Third-Party Links",
    paragraphs: [
      "Our website may contain links to external websites.",
      `${BUSINESS.NAME} is not responsible for the content, privacy practices, or services offered by third-party websites.`
    ]
  },
  {
    id: "tc-sec-13",
    num: 13,
    title: "Limitation of Liability",
    paragraphs: [
      `${BUSINESS.NAME} shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from:`
    ],
    listItems: [
      "Website usage",
      "Product purchases",
      "Delivery delays",
      "Technical failures",
      "Third-party service interruptions"
    ],
    extraParagraphs: [
      "Our maximum liability shall not exceed the value of the purchased product."
    ]
  },
  {
    id: "tc-sec-14",
    num: 14,
    title: "Warranties Disclaimer",
    paragraphs: [
      "Products and services are provided on an \"as-is\" and \"as-available\" basis.",
      `Except as expressly stated, ${BUSINESS.NAME} makes no warranties regarding uninterrupted website operation or error-free services.`
    ]
  },
  {
    id: "tc-sec-15",
    num: 15,
    title: "User Conduct",
    paragraphs: [
      "Users agree not to:"
    ],
    listItems: [
      "Violate applicable laws",
      "Submit false information",
      "Attempt unauthorized access",
      "Engage in fraudulent transactions",
      "Abuse promotional offers",
      "Interfere with website functionality"
    ],
    extraParagraphs: [
      "Violations may result in account suspension or legal action."
    ]
  },
  {
    id: "tc-sec-16",
    num: 16,
    title: "Fair Usage Policy",
    paragraphs: [
      "Customers must use return, exchange, buyback, referral, loyalty, and promotional programs fairly.",
      "Excessive returns, fraudulent claims, abuse of discounts, creation of multiple accounts, or misuse of offers may result in restrictions or account termination."
    ]
  },
  {
    id: "tc-sec-17",
    num: 17,
    title: "Privacy",
    paragraphs: [
      "Personal information is collected, stored, and processed in accordance with our Privacy Policy.",
      "By using our services, customers consent to such processing."
    ]
  },
  {
    id: "tc-sec-18",
    num: 18,
    title: "Force Majeure",
    paragraphs: [
      `${BUSINESS.NAME} shall not be responsible for delays or failures caused by circumstances beyond reasonable control, including:`
    ],
    listItems: [
      "Natural disasters",
      "Government restrictions",
      "Supply chain disruptions",
      "Strikes",
      "Internet outages",
      "Technical failures"
    ]
  },
  {
    id: "tc-sec-19",
    num: 19,
    title: "Governing Law",
    paragraphs: [
      "These Terms & Conditions shall be governed by the laws of India.",
      `Any disputes arising from the use of our website, products, or services shall be subject to the exclusive jurisdiction of the courts where ${BUSINESS.NAME} operates its principal business in Mau, Uttar Pradesh.`
    ]
  },
  {
    id: "tc-sec-20",
    num: 20,
    title: "Contact Information",
    paragraphs: [
      "For any questions regarding these Terms & Conditions, customers may contact:"
    ],
    contactInfo: {
      brand: `${BUSINESS.NAME} (${BUSINESS.TAGLINE})`,
      address: BUSINESS.ADDRESS,
      email: BUSINESS.EMAIL,
      backupEmail: "contact@manishsilver.com",
      phone: BUSINESS.PHONE_PRIMARY,
      hours: "All 7 Days, 10:30 AM – 8:30 PM"
    },
    extraParagraphs: [
      `By using our website and purchasing from ${BUSINESS.NAME}, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.`
    ]
  }
];

export default function TermsAndConditions({
  activeTcSection,
  setActiveTcSection,
  navigateTo,
  triggerAudio
}) {
  return (
    <div className="transition-colors duration-500 min-h-screen pb-8 bg-[#F8F5EC] text-[#202329]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-10 animate-slide-up text-left">

        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center space-x-2 bg-[#0D2B4E]/5 border border-[#B09A82]/30 px-4 py-1.5 rounded-full mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D2B4E] animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#0D2B4E] font-bold">
              OFFICIAL GUIDELINES &amp; POLICIES
            </span>
          </div>
          <h1 className="serif-luxury text-4xl sm:text-5xl font-semibold text-[#0D2B4E] leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-[#657989] max-w-md mx-auto leading-relaxed">
            Effective Date: June 2, 2026. Please read the official terms and conditions governing the use of MANISH &amp; CO Fine Silver Jewellery platforms and services.
          </p>
          <div className="w-12 h-[1.5px] bg-[#6B4B2E] mx-auto mt-2"></div>
        </div>

        {/* Mobile Quick-Jump Selection Dropdown */}
        <div className="lg:hidden w-full bg-white border border-[#E6DFD3] rounded-2xl p-4 shadow-sm mb-6">
          <label className="block text-[9px] uppercase tracking-wider font-bold text-[#0D2B4E] mb-2">
            Quick Navigation List
          </label>
          <select
            value={activeTcSection}
            onChange={(e) => {
              const val = e.target.value;
              setActiveTcSection(val);
              const el = document.getElementById(val);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="w-full bg-[#F8F5EC] border border-[#E6DFD3] rounded-xl px-3 py-2.5 text-xs text-[#0D2B4E] font-semibold focus:outline-none focus:border-[#0D2B4E]"
          >
            {TERMS_DATA.map((sec) => (
              <option key={sec.id} value={sec.id}>
                Clause {sec.num}: {sec.title}
              </option>
            ))}
          </select>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Sticky Left Sidebar for Desktop */}
          <div className="lg:col-span-4 sticky top-24 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hidden lg:block max-h-[calc(100vh-12rem)] overflow-y-auto pr-4 scrollbar-thin">
            <h3 className="serif-luxury text-sm font-bold text-[#0D2B4E] mb-4 pb-2 border-b border-gray-100 uppercase tracking-wider">
              Table of Clauses
            </h3>
            <nav className="space-y-1">
              {TERMS_DATA.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveTcSection(sec.id);
                    const el = document.getElementById(sec.id);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] transition-all duration-300 flex items-center justify-between group cursor-pointer ${activeTcSection === sec.id
                    ? 'bg-[#0D2B4E] text-[#F8F5EC] font-bold border-l-4 border-[#6B4B2E]'
                    : 'text-gray-500 hover:text-[#0D2B4E] hover:bg-[#F8F5EC]'
                    }`}
                >
                  <span className="truncate pr-2">{sec.num}. {sec.title}</span>
                  {activeTcSection === sec.id ? (
                    <span className="text-[#B09A82] text-xs">✦</span>
                  ) : (
                    <span className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Scrollable Content Pane */}
          <div className="lg:col-span-8 space-y-6">
            {TERMS_DATA.map((sec) => {
              const isActive = activeTcSection === sec.id;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-500 ${isActive
                    ? 'border-[#B09A82]/50 shadow-md ring-1 ring-[#B09A82]/20 bg-gradient-to-br from-white to-[#F8F5EC]'
                    : 'border-[#E6DFD3] hover:border-[#B09A82]/40'
                    }`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-[10px] bg-[#0D2B4E]/10 border border-[#B09A82]/30 px-2.5 py-1 rounded-full text-[#0D2B4E] font-bold tracking-wider">
                      CLAUSE {sec.num}
                    </span>
                    {isActive && (
                      <span className="text-[10px] text-[#6B4B2E] font-semibold animate-pulse tracking-wide flex items-center space-x-1">
                        <span>✦</span> <span>Active View</span>
                      </span>
                    )}
                  </div>

                  <h3 className="serif-luxury text-lg text-[#0D2B4E] font-bold mb-4">
                    {sec.title}
                  </h3>

                  <div className="space-y-4 text-xs font-light text-gray-600 leading-relaxed">
                    {sec.paragraphs && sec.paragraphs.map((p, idx) => (
                      <p key={idx} className="font-sans font-light">{p}</p>
                    ))}

                    {sec.listItems && (
                      <ul className="list-disc pl-5 space-y-2.5 my-3 text-gray-600 font-sans font-light">
                        {sec.listItems.map((item, idx) => (
                          <li key={idx}><strong>{item}</strong></li>
                        ))}
                      </ul>
                    )}

                    {sec.extraParagraphs && sec.extraParagraphs.map((p, idx) => (
                      <p key={idx} className="font-sans font-light mt-3">{p}</p>
                    ))}

                    {/* Contact details embedded in Section 20 */}
                    {sec.contactInfo && (
                      <div className="mt-5 border border-[#E6DFD3] rounded-2xl p-5 bg-[#F8F5EC] space-y-3.5 text-xs text-gray-700">
                        <p className="font-bold text-[#0D2B4E] font-sans">{sec.contactInfo.brand}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-sans">
                          <div className="space-y-1.5">
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#6B4B2E]" />
                              <span>Registered Address</span>
                            </p>
                            <p className="font-normal">{sec.contactInfo.address}</p>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#6B4B2E]" />
                              <span>Phone Contacts</span>
                            </p>
                            <p className="font-semibold text-[#0D2B4E]">{sec.contactInfo.phone}</p>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-[#6B4B2E]" />
                              <span>Electronic Email</span>
                            </p>
                            <p className="font-medium text-[#0D2B4E]">{sec.contactInfo.email}</p>
                            <p className="text-[10px] text-gray-400">CC: {sec.contactInfo.backupEmail}</p>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#6B4B2E]" />
                              <span>Operating Hours</span>
                            </p>
                            <p className="font-normal">{sec.contactInfo.hours}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

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
