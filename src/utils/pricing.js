/**
 * pricing.js — Core Jewellery Price Calculation Engine
 * Pure functions only — no React, no Firestore.
 * Supports: Gold (24K/22K/20K/18K/14K/9K), Silver (925 Sterling Silver/Normal Silver/999 Silver), Platinum
 * Single Source of Truth for all jewellery price computations.
 */

// ─── Purity multipliers relative to 24K ────────────────────────────────────
export const PURITY_MULTIPLIERS = {
  '24K': 1.0,
  '22K': 22 / 24,       // 0.9167 (91.67%)
  '20K': 20 / 24,       // 0.8333 (83.33%)
  '18K': 18 / 24,       // 0.75   (75.00%)
  '14K': 14 / 24,       // 0.5833 (58.33%)
  '9K':   9 / 24,       // 0.375
};

export const DEFAULT_PURITY_PERCENTAGES = {
  '24K': 100.00,
  '22K': 91.67,
  '20K': 83.33,
  '18K': 75.00,
  '14K': 58.33,
  '9K':  37.50,
};

// ─── Silver Purity Multipliers relative to 999 Fine Silver ──────────────────
export const SILVER_PURITY_MULTIPLIERS = {
  '999 Silver': 1.0,
  '999 Fine Silver': 1.0,
  '999': 1.0,
  '925 Sterling Silver': 0.925,
  '925 Silver': 0.925,
  '92.5': 0.925,
  '925': 0.925,
  'Normal Silver': 0.90,
  'Normal': 0.90,
};

/**
 * Parse floats safely by stripping any currency symbols, commas, or spaces.
 */
export function safeParseFloat(val) {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Centralized silver rate per gram converter.
 * 1 kg = 1000 grams.
 * e.g. ₹236,000 / kg → ₹236 / g
 *
 * @param {number|string} ratePerKg - Silver rate in ₹ / kg
 * @param {string} purity - '999 Silver' | '925 Sterling Silver' | 'Normal Silver' | etc.
 * @returns {number} Silver rate per gram
 */
export function calculateSilverRatePerGram(ratePerKg, purity = '999') {
  const baseKg = safeParseFloat(ratePerKg) || 92000;
  const base1g = baseKg / 1000; // Fundamental rule: ratePerKg / 1000 = ratePerGram

  const p = String(purity || '').toLowerCase().trim();
  if (p.includes('925') || p.includes('92.5') || p.includes('sterling')) {
    return base1g * 0.925;
  }
  if (p.includes('normal')) {
    return base1g * 0.90;
  }
  return base1g;
}

export const getSilverRatePerGram = calculateSilverRatePerGram;

/**
 * Get the per-gram rate for a given gold purity.
 * @param {string} purity  — '24K' | '22K' | '20K' | '18K' | '14K' | '9K'
 * @param {number} rate24k — 24K rate per 10 grams (as stored in Firestore)
 * @returns {number} per-gram rate
 */
export function getGoldRatePerGram(purity, rate24k) {
  const normalized = (purity || '').toUpperCase().replace(/T$/, '').trim();
  const mul = PURITY_MULTIPLIERS[normalized] ?? PURITY_MULTIPLIERS[purity] ?? PURITY_MULTIPLIERS['22K'];
  // rate24k is stored as ₹ per 10 grams  →  divide by 10 for per-gram
  return (safeParseFloat(rate24k) / 10) * mul;
}

/**
 * Core dynamic price formula.
 *
 * @param {Object} product — Product document from Firestore
 * @param {Object} rates   — Live rates object from RatesContext / Firestore
 *   rates.goldRate24k    {number}  — ₹ per 10g (24K)
 *   rates.goldRate22k    {number}  — ₹ per 10g (22K) [optional, derived if absent]
 *   rates.goldRate20k    {number}  — ₹ per 10g (20K) [optional, derived if absent]
 *   rates.goldRate18k    {number}  — ₹ per 10g (18K) [optional, derived if absent]
 *   rates.goldRate14k    {number}  — ₹ per 10g (14K) [optional, derived if absent]
 *   rates.silverRate     {number}  — ₹ per kg (999 Fine Silver)
 *   rates.silverRate925  {number}  — ₹ per kg (925 Sterling Silver) [optional]
 *   rates.silverRateNormal {number}— ₹ per kg (Normal Silver) [optional]
 *   rates.platinumRate   {number}  — ₹ per gram
 *
 * @returns {Object} Complete pricing breakdown
 */
export function calculateDynamicPrice(product, rates = {}) {
  if (!product) {
    return emptyBreakdown();
  }

  // ── 1. Determine calculation mode ────────────────────────────────────────
  const rawMode = String(product.priceCalculationMode || '').toLowerCase().trim();
  const isExplicitDynamic = rawMode === 'dynamic';
  const isExplicitManual  = rawMode === 'manual' || rawMode === 'fixed';
  const hasFixedPrice     = safeParseFloat(product.price) > 0;

  // If explicitly manual/fixed OR (not explicitly dynamic and has a positive fixed price)
  if (isExplicitManual || (!isExplicitDynamic && hasFixedPrice)) {
    // Fixed manual price mode: strictly use fixed stored price with discount & GST handling (NO live bullion rate recalculation)
    return calculateManualBreakdown(product);
  }

  // ── 2. Detect metal type ──────────────────────────────────────────────────
  const metalType = detectMetalType(product);

  // ── 3. Read product pricing inputs ───────────────────────────────────────
  let purity = '22K';
  let weight = 0;

  if (metalType === 'silver') {
    purity = product.silverPurity || product.metalPurity || product.carat || product.categoryType || '925 Sterling Silver';
    weight = safeParseFloat(product.silverWeight || product.netWeight || product.goldWeight || product.weight || 0);
  } else if (metalType === 'platinum') {
    purity = product.platinumPurity || product.metalPurity || product.carat || '950 Platinum';
    weight = safeParseFloat(product.platinumWeight || product.netWeight || product.goldWeight || product.weight || 0);
  } else {
    // Gold
    purity = product.goldPurity || product.carat || product.metalPurity || '22K';
    weight = safeParseFloat(product.goldWeight || product.netWeight || product.weight || 0);
  }

  const makingType       = product.makingChargeType || 'percentage';   // 'fixed' | 'percentage'
  const makingValue      = safeParseFloat(product.makingChargeValue || product.makingCharges || 0);
  const diamondVal       = safeParseFloat(product.diamondValue || 0);
  const polkiVal         = safeParseFloat(product.polkiValue || 0);
  const pearlsVal        = safeParseFloat(product.pearlsValue || 0);
  const stonePriceVal    = safeParseFloat(product.stonePrice || 0);
  const totalStoneVal    = diamondVal + polkiVal + pearlsVal + stonePriceVal;
  const otherChargesVal  = safeParseFloat(product.otherCharges || 0);
  const gstPct           = safeParseFloat(product.gstPercentage || product.gstPercent || 3);
  const discountPercent  = safeParseFloat(product.discountPercent ?? product.discountOffItem ?? 0);

  // ── 4. Calculate base metal value ────────────────────────────────────────
  let metalValue = 0;
  let ratePerGram = 0;

  if (metalType === 'silver') {
    const pLower = String(purity).toLowerCase();
    if (rates.silverRate925 && (pLower.includes('925') || pLower.includes('92.5'))) {
      ratePerGram = safeParseFloat(rates.silverRate925) / 1000;
    } else if (rates.silverRateNormal && pLower.includes('normal')) {
      ratePerGram = safeParseFloat(rates.silverRateNormal) / 1000;
    } else {
      ratePerGram = calculateSilverRatePerGram(rates.silverRate || rates.silverRate1kg || 92000, purity);
    }
    metalValue = ratePerGram * weight;
  } else if (metalType === 'platinum') {
    ratePerGram = safeParseFloat(rates.platinumRate || 3500);
    metalValue = ratePerGram * weight;
  } else {
    // Gold — resolve per-gram rate for the purity
    const normalized = (purity || '').toUpperCase().replace(/T$/, '').trim();
    if ((normalized === '24K' || normalized === '24') && rates.goldRate24k) {
      ratePerGram = rates.goldRate24k / 10;
    } else if ((normalized === '22K' || normalized === '22') && rates.goldRate22k) {
      ratePerGram = rates.goldRate22k / 10;
    } else if ((normalized === '20K' || normalized === '20') && rates.goldRate20k) {
      ratePerGram = rates.goldRate20k / 10;
    } else if ((normalized === '18K' || normalized === '18') && rates.goldRate18k) {
      ratePerGram = rates.goldRate18k / 10;
    } else if ((normalized === '14K' || normalized === '14') && rates.goldRate14k) {
      ratePerGram = rates.goldRate14k / 10;
    } else if ((normalized === '9K' || normalized === '9') && rates.goldRate9k) {
      ratePerGram = rates.goldRate9k / 10;
    } else {
      // derive from 24K
      ratePerGram = getGoldRatePerGram(purity, rates.goldRate24k || 78500);
    }
    metalValue = ratePerGram * weight;
  }

  // ── 5. Making charges ────────────────────────────────────────────────────
  let makingCharge = 0;
  if (makingType === 'fixed') {
    makingCharge = makingValue;
  } else if (makingType === 'per_gram' || makingType === 'weight' || makingType === 'perGram') {
    // Making on metal weight (₹ per gram)
    makingCharge = weight * makingValue;
  } else {
    // percentage of metal value
    makingCharge = metalValue * (makingValue / 100);
  }

  // ── 6. Subtotal, Discount, Taxable Amount & GST ──────────────────────────
  const subtotal = metalValue + makingCharge + totalStoneVal + otherChargesVal;
  
  const gst   = subtotal * (gstPct / 100);
  const total = Math.round(subtotal + gst);

  // When discount is configured:
  // Selling price remains the actual calculated total, and original crossed-out MRP is increased
  let originalTotal  = total;
  let discountAmount = 0;
  if (discountPercent > 0 && discountPercent < 100) {
    originalTotal  = Math.round(total / (1 - (discountPercent / 100)));
    discountAmount = Math.max(0, originalTotal - total);
  }

  return {
    goldValue:       Math.round(metalValue), // Backward-compatible alias
    metalValue:      Math.round(metalValue),
    ratePerGram:     Math.round(ratePerGram * 100) / 100,
    makingCharge:    Math.round(makingCharge),
    diamondValue:    Math.round(diamondVal),
    polkiValue:      Math.round(polkiVal),
    pearlsValue:     Math.round(pearlsVal),
    stonePrice:      Math.round(stonePriceVal),
    totalStoneValue: Math.round(totalStoneVal),
    otherCharges:    Math.round(otherChargesVal),
    subtotal:        Math.round(subtotal),
    discountPercent,
    discountAmount:  Math.round(discountAmount),
    taxableAmount:   Math.round(subtotal),
    gst:             Math.round(gst),
    total,
    originalTotal,
    metalType,
    isLive:          true,
    purity,
    weight,
    makingType,
    gstPct,
  };
}

/**
 * Backward-compatible manual/legacy breakdown.
 * Evaluates stored price and optional discount.
 */
export function calculateManualBreakdown(product) {
  const rawPrice = safeParseFloat(product.price);
  if (!rawPrice) return emptyBreakdown();

  const discountPercent = safeParseFloat(product.discountPercent ?? product.discountOffItem ?? 0);
  const gstPct          = safeParseFloat(product.gstPercent || product.gstPercentage || 3);
  const gstRate         = gstPct / 100;

  const diamondVal      = safeParseFloat(product.diamondValue || 0);
  const polkiVal        = safeParseFloat(product.polkiValue || 0);
  const pearlsVal       = safeParseFloat(product.pearlsValue || 0);
  const stonePriceVal   = safeParseFloat(product.stonePrice || 0);
  const makingChargeVal = safeParseFloat(product.makingChargeValue || product.makingCharges || 0);
  const otherChargesVal = safeParseFloat(product.otherCharges || 0);

  const subtotal        = rawPrice;
  const gst             = Math.round(subtotal * gstRate);
  const total           = Math.round(subtotal + gst);

  let originalTotal     = total;
  let discountAmount    = 0;
  if (discountPercent > 0 && discountPercent < 100) {
    originalTotal  = Math.round(total / (1 - (discountPercent / 100)));
    discountAmount = Math.max(0, originalTotal - total);
  }

  const goldVal = Math.max(0, subtotal - diamondVal - polkiVal - pearlsVal - stonePriceVal - makingChargeVal - otherChargesVal);

  return {
    goldValue:       Math.round(goldVal),
    metalValue:      Math.round(goldVal),
    ratePerGram:     0,
    makingCharge:    Math.round(makingChargeVal),
    diamondValue:    Math.round(diamondVal),
    polkiValue:      Math.round(polkiVal),
    pearlsValue:     Math.round(pearlsVal),
    stonePrice:      Math.round(stonePriceVal),
    totalStoneValue: Math.round(diamondVal + polkiVal + pearlsVal + stonePriceVal),
    otherCharges:    Math.round(otherChargesVal),
    subtotal:        Math.round(subtotal),
    discountPercent,
    discountAmount:  Math.round(discountAmount),
    taxableAmount:   Math.round(subtotal),
    gst,
    total,
    originalTotal,
    metalType:       detectMetalType(product),
    isLive:          false,
    purity:          product.carat || product.goldPurity || product.silverPurity || '22K',
    weight:          safeParseFloat(product.silverWeight || product.netWeight || product.weight || 0),
    makingType:      product.makingChargeType || 'fixed',
    gstPct,
  };
}

/** Detects metal type from product fields */
export function detectMetalType(product) {
  if (!product) return 'gold';
  const metal   = (product.metal || product.metalType || '').toLowerCase();
  const purity  = (product.metalPurity || product.carat || product.goldPurity || product.silverPurity || '').toLowerCase();
  const name    = (product.name || '').toLowerCase();
  const cat     = (product.category || '').toLowerCase();
  const catType = (product.categoryType || '').toLowerCase();

  if (
    metal === 'silver' || metal.includes('silver') ||
    purity.includes('92.5') || purity.includes('925') || purity.includes('999') || purity.includes('silver') ||
    name.includes('silver') || cat.includes('silver') || catType.includes('silver')
  ) {
    return 'silver';
  }
  if (metal === 'platinum' || name.includes('platinum') || cat.includes('platinum') || catType.includes('platinum')) {
    return 'platinum';
  }
  if (metal === 'diamond' || name.includes('diamond') || cat.includes('diamond') || catType.includes('diamond')) {
    return 'diamond';
  }
  return 'gold';
}

/** Returns zero-value breakdown */
function emptyBreakdown() {
  return {
    goldValue: 0, metalValue: 0, ratePerGram: 0, makingCharge: 0, stonePrice: 0,
    diamondValue: 0, polkiValue: 0, otherCharges: 0, subtotal: 0, discountPercent: 0,
    discountAmount: 0, taxableAmount: 0, gst: 0, total: 0, originalTotal: 0,
    metalType: 'gold', isLive: false, purity: '22K', weight: 0,
    makingType: 'percentage', gstPct: 3,
  };
}

/**
 * Format a number as Indian Rupees.
 * @param {number} amount
 * @returns {string} e.g. "₹1,23,456"
 */
export function formatINR(amount) {
  const num = safeParseFloat(amount);
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Derive 22K, 20K, 18K and 14K rates from 24K base rate.
 */
export function deriveRates(goldRate24k, customPercentages = {}) {
  const base24k = safeParseFloat(goldRate24k);
  const p22 = safeParseFloat(customPercentages['22K'] ?? customPercentages['22k'] ?? DEFAULT_PURITY_PERCENTAGES['22K']);
  const p20 = safeParseFloat(customPercentages['20K'] ?? customPercentages['20k'] ?? DEFAULT_PURITY_PERCENTAGES['20K']);
  const p18 = safeParseFloat(customPercentages['18K'] ?? customPercentages['18k'] ?? DEFAULT_PURITY_PERCENTAGES['18K']);
  const p14 = safeParseFloat(customPercentages['14K'] ?? customPercentages['14k'] ?? DEFAULT_PURITY_PERCENTAGES['14K']);
  const p9  = safeParseFloat(customPercentages['9K']  ?? customPercentages['9k']  ?? DEFAULT_PURITY_PERCENTAGES['9K']);

  return {
    goldRate24k: Math.round(base24k),
    goldRate22k: Math.round(base24k * (p22 / 100)),
    goldRate20k: Math.round(base24k * (p20 / 100)),
    goldRate18k: Math.round(base24k * (p18 / 100)),
    goldRate14k: Math.round(base24k * (p14 / 100)),
    goldRate9k:  Math.round(base24k * (p9 / 100)),
    percentages: {
      '24K': 100,
      '22K': p22,
      '20K': p20,
      '18K': p18,
      '14K': p14,
      '9K':  p9,
    }
  };
}

