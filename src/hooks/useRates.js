import { useContext } from 'react';
import { RatesContext } from '../contexts/RatesContext';
import { RateService } from '../services/RateService';

export function useRates() {
  const context = useContext(RatesContext);
  if (!context) {
    throw new Error('useRates must be used within a RatesProvider');
  }

  const {
    goldRate24k       = 78500,
    goldRate22k       = 71958,
    goldRate20k       = 65417,
    goldRate18k       = 58875,
    goldRate14k       = 45788,
    goldRate9k        = 29438,
    purityPercentages = { '24k': 100, '22k': 91.67, '20k': 83.33, '18k': 75.00, '14k': 58.33, '9k': 37.50 },
    silverRate        = 92000,
    silverRate1kg     = 92000,
    silverRate925     = 85100,
    silverRateNormal  = 82800,
    platinumRate      = 3500,
    lastUpdated       = null,
    publishedAt       = null,
    updatedBy         = null,
    isPublished       = false,
  } = context.rates || {};

  // Derived helpers (1g rates)
  const goldRate24kPerGram       = goldRate24k / 10;
  const goldRate22kPerGram       = goldRate22k / 10;
  const goldRate20kPerGram       = goldRate20k / 10;
  const goldRate18kPerGram       = goldRate18k / 10;
  const goldRate14kPerGram       = goldRate14k / 10;
  const goldRate9kPerGram        = goldRate9k / 10;
  const silverRate1g             = RateService.convertKgToGramSilver(silverRate1kg || silverRate, '999');
  const silverRate925PerGram     = RateService.convertKgToGramSilver(silverRate925, '925');
  const silverRateNormalPerGram  = RateService.convertKgToGramSilver(silverRateNormal, 'normal');

  // Helper: calculate full price for a product using live rates
  const calculatePrice = (product) => {
    return RateService.calculateProductPrice(product, goldRate24k, silverRate1kg || silverRate, {
      goldRate22k,
      goldRate20k,
      goldRate18k,
      goldRate14k,
      goldRate9k,
      silverRate925,
      silverRateNormal,
      platinumRate,
    });
  };

  const formatPrice = (amount) => {
    return RateService.formatINR(amount);
  };

  return {
    ...context,
    // Raw rates
    goldRate24k,
    goldRate22k,
    goldRate20k,
    goldRate18k,
    goldRate14k,
    goldRate9k,
    purityPercentages,
    silverRate,
    silverRate1kg,
    silverRate925,
    silverRateNormal,
    platinumRate,
    // Metadata
    lastUpdated,
    publishedAt,
    updatedBy,
    isPublished,
    // Derived
    goldRate24kPerGram,
    goldRate22kPerGram,
    goldRate20kPerGram,
    goldRate18kPerGram,
    goldRate14kPerGram,
    goldRate9kPerGram,
    silverRate1g,
    silverRate925PerGram,
    silverRateNormalPerGram,
    // Helpers
    calculatePrice,
    formatPrice,
  };
}

export default useRates;

