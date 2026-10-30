import React, { createContext, useState, useEffect } from 'react';
import { ratesApi } from '../api/rates.api';
import { StorageService } from '../services/StorageService';

export const RatesContext = createContext();

const DEFAULTS = {
  goldRate24k:  78500,
  goldRate22k:  71958,
  goldRate20k:  65417,
  goldRate18k:  58875,
  goldRate14k:  45788,
  goldRate9k:   29438,
  purityPercentages: {
    '24k': 100.00,
    '22k': 91.67,
    '20k': 83.33,
    '18k': 75.00,
    '14k': 58.33,
    '9k':  37.50,
  },
  silverRate:       92000,
  silverRate1kg:    92000,
  silverRate925:    85100,
  silverRateNormal: 82800,
  platinumRate:     3500,
  lastUpdated:      null,
  publishedAt:      null,
  updatedBy:        null,
  isPublished:      false,
};

export function RatesProvider({ children }) {
  const [rates, setRates] = useState(() => {
    try {
      const cached = StorageService.get('manish_metal_rates', null);
      if (cached && typeof cached === 'object') {
        const baseSilver = cached.silverRate || cached.silverRate1kg || DEFAULTS.silverRate1kg;
        return {
          ...DEFAULTS,
          ...cached,
          silverRate:       baseSilver,
          silverRate1kg:    baseSilver,
          silverRate925:    cached.silverRate925 || Math.round(baseSilver * 0.925),
          silverRateNormal: cached.silverRateNormal || Math.round(baseSilver * 0.90),
        };
      }
    } catch (e) {}
    return DEFAULTS;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = ratesApi.subscribeToRates(
      (data) => {
        if (!data) return;
        const baseSilver = data.silverRate || data.silverRate1kg || DEFAULTS.silverRate1kg;
        setRates({
          ...DEFAULTS,
          ...data,
          silverRate:       baseSilver,
          silverRate1kg:    baseSilver,
          silverRate925:    data.silverRate925 || Math.round(baseSilver * 0.925),
          silverRateNormal: data.silverRateNormal || Math.round(baseSilver * 0.90),
        });
        setLoading(false);
      },
      (err) => {
        console.warn('Rates subscription notice:', err?.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);


  return (
    <RatesContext.Provider value={{ rates, loading }}>
      {children}
    </RatesContext.Provider>
  );
}
