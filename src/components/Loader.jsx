import React, { useState, useEffect, useRef } from 'react';
import splashLandscape from '../assets/manish_co_splash.png';
import splashPortrait from '../assets/splash_client_reference.png';

export default function Loader({ onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasDismissedRef = useRef(false);

  // Soft luxury chime on dismiss / entrance
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.12); // C6
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio errors safely ignored
    }
  };

  // Graceful fade-out exit handler
  const handleDismiss = () => {
    if (hasDismissedRef.current) return;
    hasDismissedRef.current = true;
    setIsExiting(true);
    playChime();

    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 600);
  };

  useEffect(() => {
    // Generous duration (3.8 seconds) so users/clients can admire the splash screen
    const startTime = Date.now();
    const duration = 3800;

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
      role="banner"
      aria-label="MANISH & CO Luxury Splash Screen"
      className={`fixed inset-0 z-[999999] bg-[#030712] flex items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-[1.01] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 100% Fullscreen Splash Art: Portrait for mobile, Landscape for desktop */}
      <picture className="w-full h-full absolute inset-0">
        <source 
          media="(max-width: 768px) and (orientation: portrait)" 
          srcSet={splashPortrait} 
        />
        <img
          src={splashLandscape}
          alt="MANISH & CO - Fine Jewellery"
          className="w-full h-full object-cover select-none pointer-events-none drop-shadow-2xl animate-luxury-splash"
        />
      </picture>

      {/* Subtle Ambient Radial Warm Glow Pulsing Behind the Sacred Mandala */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] rounded-full bg-[#C5A880]/12 blur-[100px] pointer-events-none animate-pulse"
        style={{ animationDuration: '4s' }}
      />

      {/* Delicate Golden Sparkle Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-1.5 h-1.5 bg-[#D4AF37] rounded-full top-[26%] left-[28%] opacity-60 animate-ping" style={{ animationDuration: '3.5s' }} />
        <div className="absolute w-2 h-2 bg-[#C5A880] rounded-full top-[32%] right-[26%] opacity-40 animate-pulse" style={{ animationDuration: '2.8s' }} />
        <div className="absolute w-1 h-1 bg-[#F5D77F] rounded-full bottom-[32%] left-[30%] opacity-70 animate-pulse" style={{ animationDuration: '4.2s' }} />
        <div className="absolute w-1.5 h-1.5 bg-[#C5A880] rounded-full bottom-[28%] right-[32%] opacity-50 animate-ping" style={{ animationDuration: '3.8s' }} />
      </div>

      {/* Ultra-Slim Golden Progress Bar at the bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/40 pointer-events-none z-30">
        <div 
          className="h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-[#F5D77F] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(212,175,55,0.8)]"
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
        <span>SKIP</span>
        <span className="text-sm">→</span>
      </button>


    </div>
  );
}
