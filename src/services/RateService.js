import { calculateDynamicPrice, calculateSilverRatePerGram, formatINR as _formatINR } from '../utils/pricing.js';

export const RateService = {
  // Convert 24k gold rate to 22k rate (Formula: 24K * X%)
  convert24kTo22k(rate24k, pct = 91.67) {
    return Math.round(rate24k * (pct / 100));
  },

  // Convert 24k gold rate to 20k rate (Formula: 24K * X%)
  convert24kTo20k(rate24k, pct = 83.33) {
    return Math.round(rate24k * (pct / 100));
  },

  // Convert 24k gold rate to 18k rate (Formula: 24K * X%)
  convert24kTo18k(rate24k, pct = 75.00) {
    return Math.round(rate24k * (pct / 100));
  },

  // Convert 24k gold rate to 14k rate (Formula: 24K * X%)
  convert24kTo14k(rate24k, pct = 58.33) {
    return Math.round(rate24k * (pct / 100));
  },

  // Convert 24k gold rate to 9k rate (Formula: 24K * X%)
  convert24kTo9k(rate24k, pct = 37.50) {
    return Math.round(rate24k * (pct / 100));
  },

  // Convert 1kg silver rate to 1g silver rate (1 kg = 1000g)
  convertKgToGramSilver(rateSilver1kg, purity = '999') {
    return calculateSilverRatePerGram(rateSilver1kg, purity);
  },

  calculateSilverRatePerGram(rateSilver1kg, purity = '999') {
    return calculateSilverRatePerGram(rateSilver1kg, purity);
  },

  /**
   * Calculate product price.
   * If product.priceCalculationMode === 'dynamic', uses live rates from pricing.js formula.
   * Otherwise falls back to stored price (backward compatible).
   */
  calculateProductPrice(product, rate24k = 78500, rateSilver1kg = 92000, customRates = {}) {
    if (!product) return { baseMetalValue: 0, makingCharges: 0, gst: 0, total: 0 };

    const rates = {
      goldRate24k:      rate24k,
      goldRate22k:      customRates.goldRate22k || Math.round(rate24k * (22 / 24)),
      goldRate20k:      customRates.goldRate20k || Math.round(rate24k * (20 / 24)),
      goldRate18k:      customRates.goldRate18k || Math.round(rate24k * (18 / 24)),
      goldRate14k:      customRates.goldRate14k || Math.round(rate24k * (14 / 24)),
      goldRate9k:       customRates.goldRate9k  || Math.round(rate24k * (9 / 24)),
      silverRate:       rateSilver1kg,
      silverRate1kg:    rateSilver1kg,
      silverRate925:    customRates.silverRate925 || Math.round(rateSilver1kg * 0.925),
      silverRateNormal: customRates.silverRateNormal || Math.round(rateSilver1kg * 0.90),
      platinumRate:     customRates.platinumRate || 3500,
    };

    const result = calculateDynamicPrice(product, rates);

    // Return in legacy shape for full backward compat with existing call sites
    return {
      baseMetalValue:  result.metalValue,
      makingCharges:   result.makingCharge,
      diamondValue:    result.diamondValue,
      polkiValue:      result.polkiValue,
      stonePrice:      result.stonePrice,
      otherCharges:    result.otherCharges,
      discountPercent: result.discountPercent,
      discountAmount:  result.discountAmount,
      taxableAmount:   result.taxableAmount,
      gst:             result.gst,
      subtotal:        result.subtotal,
      total:           result.total,
      originalTotal:   result.originalTotal,
      metalType:       result.metalType,
      isLive:          result.isLive,
    };
  },

  // Format currency
  formatINR(amount) {
    return _formatINR(amount);
  }
};

