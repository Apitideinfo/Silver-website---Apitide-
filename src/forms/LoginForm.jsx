import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight
} from 'lucide-react';

export default function LoginForm({
  onSubmit,
  submitting = false,
  error = ''
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 text-left">
      <style>{`
        .luxury-input:-webkit-autofill,
        .luxury-input:-webkit-autofill:hover, 
        .luxury-input:-webkit-autofill:focus, 
        .luxury-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #2F2F2F !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50/90 border border-solid border-red-200 rounded-xl p-4 text-[13px] font-semibold text-red-650"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* ADMIN EMAIL ADDRESS */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D] font-bold block px-1 font-sans">
          ADMIN EMAIL ADDRESS
        </label>
        <div className="relative flex items-center h-[64px] bg-white border border-solid border-[#E8E3DA] rounded-[16px] overflow-hidden focus-within:border-[#D5A529] focus-within:shadow-[0_0_0_4px_rgba(213,165,41,0.08)] transition-all duration-300 shadow-sm">
          <div className="w-[56px] h-full flex items-center justify-center shrink-0 border-r border-[#E8E3DA] bg-[#FCFAF6]">
            <User className="w-5 h-5 text-[#D5A529]" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gmail.com"
            className="luxury-input flex-1 bg-transparent border-none outline-none px-4 text-[16px] text-[#2F2F2F] placeholder-[#8D8D8D]/50 font-sans outline-none focus:ring-0 focus:outline-none"
            required
            disabled={submitting}
          />
          {isValidEmail && (
            <div className="pr-4 flex items-center justify-center shrink-0">
              <div className="w-5 h-5 rounded-full border border-emerald-500 flex items-center justify-center bg-emerald-50">
                <Check className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADMIN PASSWORD */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D] font-bold block px-1 font-sans">
          ADMIN PASSWORD
        </label>
        <div className="relative flex items-center h-[64px] bg-white border border-solid border-[#E8E3DA] rounded-[16px] overflow-hidden focus-within:border-[#D5A529] focus-within:shadow-[0_0_0_4px_rgba(213,165,41,0.08)] transition-all duration-300 shadow-sm">
          <div className="w-[56px] h-full flex items-center justify-center shrink-0 border-r border-[#E8E3DA] bg-[#FCFAF6]">
            <Lock className="w-5 h-5 text-[#D5A529]" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="luxury-input flex-1 bg-transparent border-none outline-none px-4 text-[16px] text-[#2F2F2F] placeholder-[#8D8D8D]/50 font-sans outline-none focus:ring-0 focus:outline-none"
            required
            disabled={submitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-[#8D8D8D] hover:text-[#2F2F2F] transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center shrink-0 outline-none"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Remember Section */}
      <div className="flex justify-between items-center px-1 text-xs select-none">
        <label className="flex items-center gap-2 cursor-pointer text-[#8D8D8D] font-sans">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-[#E8E3DA] text-[#D5A529] focus:ring-[#D5A529]/30 cursor-pointer accent-[#D5A529]"
          />
          <span>Remember me on this device</span>
        </label>
      </div>

      {/* ACCESS VAULT CONSOLE Submit Button */}
      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ 
          scale: 1.02, 
          y: -4,
          boxShadow: "0 10px 25px rgba(213, 165, 41, 0.25)"
        }}
        whileTap={{ scale: 0.98 }}
        className="w-full h-[72px] rounded-[16px] bg-gradient-to-r from-[#D5A529] to-[#D68EC7] text-white text-xs uppercase font-extrabold tracking-[0.25em] transition-all duration-200 cursor-pointer border-none flex items-center justify-center gap-3 relative font-sans"
      >
        <span>{submitting ? 'Verifying Credentials...' : 'ACCESS VAULT CONSOLE'}</span>
        <ArrowRight className="w-4 h-4 text-white" />
      </motion.button>
    </form>
  );
}
