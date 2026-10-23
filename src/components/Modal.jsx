import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#091B2B]/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full rounded-[2rem] border border-solid border-[#E6DFD3] bg-white p-6 sm:p-8 shadow-2xl text-left select-none text-[#202329] z-50 ${sizes[size]}`}
          >
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-solid border-[#E6DFD3] pb-4 mb-5">
              <h3 className="serif-luxury text-xl font-bold text-[#0D2B4E] tracking-wide">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-gray-500 hover:text-black transition-colors cursor-pointer border-none bg-transparent"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
