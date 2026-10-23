import React from 'react';
import sealLogo from '../assets/manish_co_seal.jpg';

export default function Loader({ onDismiss }) {
  return (
    <div 
      onClick={onDismiss}
      className="fixed inset-0 z-[9999] bg-[#F8F5EC] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
    >
      {/* Soft Ambient Radial Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(248, 245, 236, 0.4) 0%, rgba(230, 223, 211, 0.45) 70%, rgba(176, 154, 130, 0.25) 100%)'
        }}
      />

      {/* Subtle Warm Amber Spotlight */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-[#B09A82]/15 blur-[120px] pointer-events-none animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        style={{ animationDuration: '4s' }} 
      />

      {/* Delicate Luxury Drift Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute w-1.5 h-1.5 bg-[#6B4B2E] rounded-full top-[18%] left-[28%] animate-particle-1" />
        <div className="absolute w-2 h-2 bg-[#B09A82] rounded-full top-[62%] left-[18%] animate-particle-2" />
        <div className="absolute w-1 h-1 bg-[#0D2B4E] rounded-full top-[78%] left-[72%] animate-particle-3" />
        <div className="absolute w-2 h-2 bg-[#6B4B2E] rounded-full top-[38%] left-[82%] animate-particle-1" />
        <div className="absolute w-1 h-1 bg-[#B09A82] rounded-full top-[12%] left-[68%] animate-particle-2" />
      </div>

      {/* Main Lockup Container — Screenshot 2 Exact Visual Branding */}
      <div className="relative flex flex-col items-center text-center px-6 animate-luxury-splash">
        
        {/* Generated Brand Wax Seal Emblem */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-2 rounded-full bg-[#B09A82]/20 filter blur-xl scale-95 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-[0_8px_30px_rgba(13,43,78,0.18)] border-2 border-[#E6DFD3] bg-[#F8F5EC] flex items-center justify-center">
            <img
              src={sealLogo}
              alt="MANISH & CO Royal Seal"
              className="w-full h-full object-cover select-none transform transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Brand Name — Screenshot 2 Serif Typography */}
        <h1 
          className="font-serif text-[32px] sm:text-[42px] md:text-[52px] font-bold tracking-[0.16em] text-[#0D2B4E] uppercase leading-tight drop-shadow-[0_1px_2px_rgba(13,43,78,0.08)]"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
        >
          MANISH &amp; CO
        </h1>

        {/* Flanked Rule & Subtitle — Screenshot 2 Exact Layout */}
        <div className="flex items-center justify-center gap-4 mt-3 w-full max-w-[340px] sm:max-w-[420px]">
          {/* Left Rule Line */}
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#6B4B2E] to-[#6B4B2E]" />
          
          {/* Subtitle */}
          <span 
            className="font-serif text-[12px] sm:text-[14px] md:text-[15px] tracking-[0.32em] text-[#6B4B2E] uppercase font-semibold whitespace-nowrap px-1"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
          >
            FINE JEWELLERY
          </span>
          
          {/* Right Rule Line */}
          <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#6B4B2E] to-[#6B4B2E]" />
        </div>

        {/* Brand Core Values from Brand Moodboard */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 text-[9px] sm:text-[10px] tracking-[0.24em] uppercase text-[#657989] font-sans font-medium">
          <span>TIMELESS</span>
          <span className="text-[#B09A82]">•</span>
          <span>ELEGANT</span>
          <span className="text-[#B09A82]">•</span>
          <span>MODERN</span>
          <span className="text-[#B09A82]">•</span>
          <span>AUTHENTIC</span>
        </div>

        {/* Luxury Loading Indicator Bar */}
        <div className="w-[160px] sm:w-[200px] h-[2px] bg-[#E6DFD3] rounded-full mt-8 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-[#0D2B4E] via-[#6B4B2E] to-[#0D2B4E] rounded-full absolute top-0 left-0 animate-luxury-loader" />
        </div>

        {/* Hallmarked Label */}
        <p className="text-[9px] tracking-[0.2em] uppercase text-[#B2BAC1] font-sans font-light mt-3">
          925 Sterling Silver • BIS Hallmarked
        </p>
      </div>
    </div>
  );
}
