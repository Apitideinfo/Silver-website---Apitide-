import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import splashLandscape from '../assets/manish_co_splash.png';
import splashPortrait from '../assets/splash_client_reference.png';
import brandLogo from '../assets/logo.png';

export default function Loader({ onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hasDismissedRef = useRef(false);

  // Graceful fade-out exit handler (zero sound)
  const handleDismiss = () => {
    if (hasDismissedRef.current) return;
    hasDismissedRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 600);
  };

  // Interactive mouse tracking for dynamic movable effect
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = ((clientX / innerWidth) - 0.5) * 36; // Range: -18px to +18px
    const y = ((clientY / innerHeight) - 0.5) * 36; // Range: -18px to +18px
    setMousePos({ x, y });
  };

  useEffect(() => {
    // Generous duration (3.6 seconds) so users can admire the movable splash screen
    const startTime = Date.now();
    const duration = 3600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 25);

    // Keyboard support: Escape, Space, Enter to quickly skip
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
      onClick={handleDismiss}
      onMouseMove={handleMouseMove}
      role="banner"
      aria-label="MANISH & CO Luxury Splash Screen"
      className={`fixed inset-0 z-[999999] bg-[#030712] flex items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 100% Fullscreen Splash Art Background with clean mandala center */}
      <picture className="w-full h-full absolute inset-0">
        <source 
          media="(max-width: 768px) and (orientation: portrait)" 
          srcSet={splashPortrait} 
        />
        <img
          src={splashLandscape}
          alt="MANISH & CO - Fine Jewellery"
          className="w-full h-full object-cover select-none pointer-events-none opacity-85 brightness-95 scale-100 transition-transform duration-1000 ease-out"
        />
      </picture>

      {/* Deep luxury radial ambient vignette for perfect focal contrast */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/40 to-[#02050D]/90 pointer-events-none" />

      {/* Dynamic Ambient Golden Glow that follows mouse position subtly */}
      <motion.div 
        animate={{ 
          x: mousePos.x * 1.2,
          y: mousePos.y * 1.2,
          scale: [1, 1.05, 1],
          opacity: [0.25, 0.4, 0.25]
        }}
        transition={{ 
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 50, damping: 20 },
          y: { type: "spring", stiffness: 50, damping: 20 }
        }}
        className="absolute w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] rounded-full bg-[#C5A880]/12 blur-[100px] pointer-events-none"
      />

      {/* ==========================================================
          MOVABLE / ANIMATED SPLASH SCREEN LOGO EMBLEM
          (Clean, perfectly fitted within the mandala, movable on mouse & float)
          ========================================================== */}
      <motion.div
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: "spring", stiffness: 70, damping: 22 }}
        className="relative z-20 flex flex-col items-center text-center px-4"
      >
        {/* Floating Movable Logo Container with 3D Depth */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
            rotate: [-1, 1, -1],
            scale: [1, 1.025, 1],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative flex items-center justify-center"
        >
          {/* Outer Rotating Sacred Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 sm:-inset-6 rounded-full border border-dashed border-[#D4AF37]/35 pointer-events-none"
          />

          {/* Secondary Shimmer Ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 sm:-inset-10 rounded-full border border-dotted border-[#E5C396]/20 pointer-events-none"
          />

          {/* Glowing Aura Halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 to-[#F5D77F]/30 blur-2xl pointer-events-none scale-110" />

          {/* Circular Client Logo Badge (Properly Fitted & Sealed) */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full bg-white p-1 shadow-[0_8px_35px_rgba(212,175,55,0.35),0_15px_30px_rgba(0,0,0,0.7)] border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/20 flex items-center justify-center overflow-hidden group">
            <img 
              src={brandLogo} 
              alt="M&CO Fine Jewellery Logo" 
              className="w-full h-full object-contain select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
            />
            {/* Shimmer Light Bar */}
            <motion.div
              animate={{ x: ['-140%', '140%'] }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Brand Text Typography with Crisp Luxury Serif */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 sm:mt-8 flex flex-col items-center"
        >
          <h1 
            className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[0.18em] text-white uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
          >
            MANISH &amp; CO
          </h1>
          
          <div className="flex items-center gap-3 mt-2 sm:mt-2.5">
            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span 
              className="font-serif text-[10px] sm:text-xs tracking-[0.3em] text-[#E5C396] uppercase font-semibold whitespace-nowrap"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
            >
              FINE JEWELLERY • 925 SILVER
            </span>
            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.18em] uppercase text-gray-400 mt-2 font-normal">
            Royal Silversmithing Atelier • Estd. 1952 • Mau
          </p>
        </motion.div>
      </motion.div>

      {/* Delicate Golden Sparkle Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-1.5 h-1.5 bg-[#D4AF37] rounded-full top-[22%] left-[24%] opacity-60 animate-ping" style={{ animationDuration: '3.5s' }} />
        <div className="absolute w-2 h-2 bg-[#C5A880] rounded-full top-[28%] right-[22%] opacity-40 animate-pulse" style={{ animationDuration: '2.8s' }} />
        <div className="absolute w-1 h-1 bg-[#F5D77F] rounded-full bottom-[28%] left-[26%] opacity-70 animate-pulse" style={{ animationDuration: '4.2s' }} />
        <div className="absolute w-1.5 h-1.5 bg-[#C5A880] rounded-full bottom-[22%] right-[28%] opacity-50 animate-ping" style={{ animationDuration: '3.8s' }} />
      </div>

      {/* Ultra-Slim Golden Progress Bar at the bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black/60 pointer-events-none z-30">
        <div 
          className="h-full bg-gradient-to-r from-[#8C6D46] via-[#D4AF37] to-[#FFF0B8] transition-all duration-100 ease-out shadow-[0_0_14px_rgba(212,175,55,0.9)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Interactive Luxury Skip Button in Top-Right Corner */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="absolute top-6 right-6 sm:top-8 sm:right-10 z-40 px-5 py-2 rounded-full border border-[#D4AF37]/40 bg-[#050811]/60 hover:bg-[#D4AF37]/20 text-[#E5C396] hover:text-white text-xs sm:text-sm font-sans tracking-[0.22em] uppercase transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#D4AF37]/80 hover:scale-105 active:scale-95"
      >
        <span>ENTER</span>
        <span className="text-sm">→</span>
      </button>
    </div>
  );
}
