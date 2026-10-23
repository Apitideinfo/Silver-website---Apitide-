import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Save, Zap, RefreshCw,
  Clock, User, CheckCircle2, AlertCircle,
  ChevronDown, ChevronUp, Info, Percent, Sparkles
} from 'lucide-react';
import { goldRateService } from '../../services/goldRateService';
import { deriveRates, formatINR, DEFAULT_PURITY_PERCENTAGES, calculateSilverRatePerGram } from '../../utils/pricing';

// ─── Purity Rate Card ───────────────────────────────────────────────────────
function RateInputCard({
  id,
  label,
  sublabel,
  karat,
  percentage,
  onPercentageChange,
  value,
  onChange,
  unit = '₹ / 10g',
  accentColor = 'amber',
  badge,
  disabled,
  isMaster = false,
  baseRate24k = 0,
}) {
  const accent = {
    amber:    { border: 'border-amber-300 dark:border-amber-700/60', ring: 'focus:border-amber-400 focus:ring-amber-400/20', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bgBadge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700' },
    yellow:   { border: 'border-yellow-300 dark:border-yellow-700/60', ring: 'focus:border-yellow-400 focus:ring-yellow-400/20', dot: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', bgBadge: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' },
    emerald:  { border: 'border-emerald-300 dark:border-emerald-700/60', ring: 'focus:border-emerald-400 focus:ring-emerald-400/20', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bgBadge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' },
    orange:   { border: 'border-orange-300 dark:border-orange-700/60', ring: 'focus:border-orange-400 focus:ring-orange-400/20', dot: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', bgBadge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700' },
    purple:   { border: 'border-purple-300 dark:border-purple-700/60', ring: 'focus:border-purple-400 focus:ring-purple-400/20', dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', bgBadge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700' },
    indigo:   { border: 'border-indigo-300 dark:border-indigo-700/60', ring: 'focus:border-indigo-400 focus:ring-indigo-400/20', dot: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', bgBadge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700' },
    blue:     { border: 'border-blue-300 dark:border-blue-700/60', ring: 'focus:border-blue-400 focus:ring-blue-400/20', dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', bgBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' },
    cyan:     { border: 'border-cyan-300 dark:border-cyan-700/60', ring: 'focus:border-cyan-400 focus:ring-cyan-400/20', dot: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', bgBadge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700' },
    slate:    { border: 'border-slate-300 dark:border-slate-700/60', ring: 'focus:border-slate-400 focus:ring-slate-400/20', dot: 'bg-slate-500', text: 'text-slate-600 dark:text-slate-400', bgBadge: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700' },
  }[accentColor] || {};

  // Fundamental mathematical conversion: kg rates divide by 1000, 10g rates divide by 10, gram rates are 1:1
  const isKg = String(unit).toLowerCase().includes('kg');
  const isGram = String(unit).toLowerCase().includes('gram') && !isKg;
  const divisor = isKg ? 1000 : (isGram ? 1 : 10);
  const perGramValue = value > 0 ? (Number(value) / divisor) : 0;

  return (
    <div className={`bg-white dark:bg-zinc-900/70 border border-solid ${accent.border || 'border-zinc-200 dark:border-zinc-800'} rounded-2xl p-5 space-y-3.5 relative overflow-hidden transition-all shadow-xs ${isMaster ? 'ring-2 ring-amber-400/30 shadow-md' : 'hover:border-zinc-300 dark:hover:border-zinc-700'}`}>
      {/* Accent top stripe */}
      <span className={`absolute top-0 left-0 right-0 h-1 ${accent.dot}`} />

      {/* Header with Title */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              {label}
            </span>
            {badge && (
              <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${accent.bgBadge}`}>
                {badge}
              </span>
            )}
          </div>
          {sublabel && <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">{sublabel}</p>}
        </div>
      </div>

      {/* Main Rate Input */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-zinc-400 pointer-events-none select-none">₹</span>
        <input
          id={id}
          type="number"
          min="0"
          step="1"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={isMaster ? 'Enter 24K rate (e.g. 78500)' : '0'}
          className={`w-full h-12 bg-zinc-50 dark:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-20 text-sm font-black text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 ${accent.ring} transition-all disabled:opacity-85 disabled:cursor-not-allowed`}
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-zinc-400 pointer-events-none select-none whitespace-nowrap">
          {unit}
        </span>
      </div>

      {/* Percentage fine-tuning row for non-master cards */}
      {!isMaster && onPercentageChange && (
        <div className="flex items-center justify-between pt-1 border-t border-solid border-zinc-100 dark:border-zinc-850 text-[10px]">
          <span className="text-zinc-400 dark:text-zinc-500 font-bold flex items-center gap-1">
            <Percent className="w-3 h-3 text-zinc-400" /> Purity Ratio:
          </span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => onPercentageChange(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-16 h-6 px-1.5 text-right font-black font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-400"
            />
            <span className="font-bold text-zinc-400">%</span>
          </div>
        </div>
      )}

      {/* Derived Per Gram summary */}
      {value > 0 && (
        <div className="flex items-center justify-between text-[10px] font-bold">
          <span className="text-zinc-400">1 Gram Rate:</span>
          <span className={`${accent.text} font-mono font-extrabold`}>
            ≈ {formatINR(Math.round(perGramValue))} / g
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Metadata info row ───────────────────────────────────────────────────────
function MetaRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-solid border-zinc-100 dark:border-zinc-850 last:border-b-0">
      <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
      </div>
      <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500 flex-1">{label}</span>
      <span className={`text-xs font-bold ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
        {value || '—'}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function GoldRateManagement({ setAdminNotification, adminUser }) {
  const [savedRates, setSavedRates]   = useState(null);
  const [draftRates, setDraftRates]   = useState({
    goldRate24k: '',
    goldRate22k: '',
    goldRate20k: '',
    goldRate18k: '',
    goldRate14k: '',
    goldRate9k: '',
    silverRate: '',
    silverRate925: '',
    silverRateNormal: '',
    platinumRate: '',
  });

  const [percentages, setPercentages] = useState({
    '22k': DEFAULT_PURITY_PERCENTAGES['22K'],
    '20k': DEFAULT_PURITY_PERCENTAGES['20K'],
    '18k': DEFAULT_PURITY_PERCENTAGES['18K'],
    '14k': DEFAULT_PURITY_PERCENTAGES['14K'],
    '9k':  DEFAULT_PURITY_PERCENTAGES['9K'] ?? 37.50,
    'silver925': 92.50,
    'silverNormal': 90.00,
  });

  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [publishing, setPublishing]     = useState(false);
  const [autoDerive, setAutoDerive]     = useState(true);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [showOptional, setShowOptional] = useState(true);

  // Load current rates on mount
  useEffect(() => {
    goldRateService.subscribeToRates(
      (data) => {
        setSavedRates(data);
        const storedPercentages = {
          '22k': Number(data.purityPercentages?.['22k'] ?? DEFAULT_PURITY_PERCENTAGES['22K']),
          '20k': Number(data.purityPercentages?.['20k'] ?? DEFAULT_PURITY_PERCENTAGES['20K']),
          '18k': Number(data.purityPercentages?.['18k'] ?? DEFAULT_PURITY_PERCENTAGES['18K']),
          '14k': Number(data.purityPercentages?.['14k'] ?? DEFAULT_PURITY_PERCENTAGES['14K']),
          '9k':  Number(data.purityPercentages?.['9k']  ?? DEFAULT_PURITY_PERCENTAGES['9K'] ?? 37.50),
          'silver925': Number(data.purityPercentages?.['silver925'] ?? data.purityPercentages?.['925'] ?? 92.50),
          'silverNormal': Number(data.purityPercentages?.['silverNormal'] ?? data.purityPercentages?.['normal'] ?? 90.00),
        };
        setPercentages(storedPercentages);

        const rate24k = data.goldRate24k || '';
        const derived = rate24k ? deriveRates(rate24k, storedPercentages) : {};
        const baseSilver = data.silverRate || '';
        const derived925 = baseSilver ? Math.round(baseSilver * (storedPercentages.silver925 / 100)) : '';
        const derivedNormal = baseSilver ? Math.round(baseSilver * (storedPercentages.silverNormal / 100)) : '';

        setDraftRates({
          goldRate24k:      rate24k,
          goldRate22k:      data.goldRate22k || derived.goldRate22k || '',
          goldRate20k:      data.goldRate20k || derived.goldRate20k || '',
          goldRate18k:      data.goldRate18k || derived.goldRate18k || '',
          goldRate14k:      data.goldRate14k || derived.goldRate14k || '',
          goldRate9k:       data.goldRate9k  || derived.goldRate9k  || '',
          silverRate:       baseSilver,
          silverRate925:    data.silverRate925 || derived925,
          silverRateNormal: data.silverRateNormal || derivedNormal,
          platinumRate:     data.platinumRate || '',
        });
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
        setAdminNotification({ message: 'Failed to load gold rates.', type: 'error' });
      }
    );
  }, []);

  // Recalculate 22K, 20K, 18K, 14K, 9K from 24K and current purity percentages
  const recalculateFrom24k = (base24k, currentPercentages = percentages) => {
    if (!base24k || base24k <= 0) {
      return {
        goldRate22k: '',
        goldRate20k: '',
        goldRate18k: '',
        goldRate14k: '',
        goldRate9k: '',
      };
    }
    const d = deriveRates(base24k, currentPercentages);
    return {
      goldRate22k: d.goldRate22k,
      goldRate20k: d.goldRate20k,
      goldRate18k: d.goldRate18k,
      goldRate14k: d.goldRate14k,
      goldRate9k:  d.goldRate9k,
    };
  };

  // Master 24K Change handler: auto-populates 22K, 20K, 18K, 14K, 9K
  const handle24kChange = (val) => {
    const update = { ...draftRates, goldRate24k: val };
    if (autoDerive && val > 0) {
      const derived = recalculateFrom24k(val, percentages);
      update.goldRate22k = derived.goldRate22k;
      update.goldRate20k = derived.goldRate20k;
      update.goldRate18k = derived.goldRate18k;
      update.goldRate14k = derived.goldRate14k;
      update.goldRate9k  = derived.goldRate9k;
    }
    setDraftRates(update);
  };

  // Master 999 Silver Change handler: auto-derives 925 and Normal Silver
  const handle999SilverChange = (val) => {
    const update = { ...draftRates, silverRate: val };
    if (autoDerive && val > 0) {
      const p925 = Number(percentages.silver925 ?? 92.50);
      const pNormal = Number(percentages.silverNormal ?? 90.00);
      update.silverRate925 = Math.round(val * (p925 / 100));
      update.silverRateNormal = Math.round(val * (pNormal / 100));
    }
    setDraftRates(update);
  };

  // Percentage change handler for specific karat / silver purity
  const handlePercentageChange = (karatKey, pctVal) => {
    const updatedPercentages = { ...percentages, [karatKey]: pctVal };
    setPercentages(updatedPercentages);

    if (autoDerive) {
      if (['22k', '20k', '18k', '14k', '9k'].includes(karatKey) && draftRates.goldRate24k > 0) {
        const derived = recalculateFrom24k(draftRates.goldRate24k, updatedPercentages);
        setDraftRates(prev => ({
          ...prev,
          goldRate22k: derived.goldRate22k,
          goldRate20k: derived.goldRate20k,
          goldRate18k: derived.goldRate18k,
          goldRate14k: derived.goldRate14k,
          goldRate9k:  derived.goldRate9k,
        }));
      } else if (karatKey === 'silver925' && draftRates.silverRate > 0) {
        setDraftRates(prev => ({
          ...prev,
          silverRate925: Math.round(draftRates.silverRate * (pctVal / 100)),
        }));
      } else if (karatKey === 'silverNormal' && draftRates.silverRate > 0) {
        setDraftRates(prev => ({
          ...prev,
          silverRateNormal: Math.round(draftRates.silverRate * (pctVal / 100)),
        }));
      }
    }
  };

  const handleSave = async () => {
    if (!draftRates.goldRate24k) {
      setAdminNotification({ message: 'Please enter the 24K Gold Rate.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const baseSilver = draftRates.silverRate ? Number(draftRates.silverRate) : 0;
      const p925 = Number(percentages.silver925 ?? 92.50);
      const pNormal = Number(percentages.silverNormal ?? 90.00);
      const payload = {
        ...draftRates,
        silverRate925: draftRates.silverRate925 || (baseSilver > 0 ? Math.round(baseSilver * (p925 / 100)) : ''),
        silverRateNormal: draftRates.silverRateNormal || (baseSilver > 0 ? Math.round(baseSilver * (pNormal / 100)) : ''),
        purityPercentages: percentages,
      };
      await goldRateService.saveRates(payload, adminUser?.email || 'admin');
      setAdminNotification({ message: 'Metal rates saved as draft.', type: 'success' });
    } catch (err) {
      console.error(err);
      setAdminNotification({ message: 'Failed to save rates.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setShowConfirm(false);
    if (!draftRates.goldRate24k) {
      setAdminNotification({ message: 'Please enter the 24K Gold Rate before publishing.', type: 'error' });
      return;
    }
    setPublishing(true);
    try {
      const baseSilver = draftRates.silverRate ? Number(draftRates.silverRate) : 0;
      const p925 = Number(percentages.silver925 ?? 92.50);
      const pNormal = Number(percentages.silverNormal ?? 90.00);
      const payload = {
        ...draftRates,
        silverRate925: draftRates.silverRate925 || (baseSilver > 0 ? Math.round(baseSilver * (p925 / 100)) : ''),
        silverRateNormal: draftRates.silverRateNormal || (baseSilver > 0 ? Math.round(baseSilver * (pNormal / 100)) : ''),
        purityPercentages: percentages,
      };
      await goldRateService.publishRates(payload, adminUser?.email || 'admin');
      setAdminNotification({ message: '✓ Live rates published! Gold, Silver & Platinum updated across website.', type: 'success' });
    } catch (err) {
      console.error(err);
      setAdminNotification({ message: 'Failed to publish rates.', type: 'error' });
    } finally {
      setPublishing(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return iso; }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#C8A646] border-t-transparent animate-spin" />
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Loading Live Rates Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 text-[#1A1A1A] dark:text-zinc-100 font-sans text-left">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-[#C8A646] flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-black tracking-wide text-zinc-900 dark:text-zinc-100 uppercase">
              Gold &amp; Precious Metal Rates
            </h2>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium pl-10">
            Set today's live 24K bullion gold rate and 999 silver rate. All purities auto-calculate dynamically.
          </p>
        </div>

        {/* Live badge */}
        {savedRates?.isPublished && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-solid border-emerald-200 dark:border-emerald-800 rounded-full text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest shrink-0">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Live — Rates Published
          </span>
        )}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Rate Inputs (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Core Gold Rates Container */}
          <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
              <div>
                <h3 className="text-sm font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase">
                  Gold Karat Rates
                </h3>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                  Enter rate in ₹ per 10 grams (Bullion Standard)
                </p>
              </div>

              {/* Auto-derive toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  Auto-Calculate Derived Rates
                </span>
                <div
                  onClick={() => setAutoDerive(!autoDerive)}
                  className={`w-9 h-5 rounded-full transition-colors duration-200 relative cursor-pointer border border-solid ${autoDerive ? 'bg-[#C8A646] border-[#C8A646]' : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${autoDerive ? 'left-4' : 'left-0.5'}`} />
                </div>
              </label>
            </div>

            {/* Master 24K Input */}
            <RateInputCard
              id="rate-24k"
              label="24K Pure Gold (Master Base Rate)"
              sublabel="Bullion 99.9% Pure Gold Rate per 10 grams"
              karat="24K"
              isMaster={true}
              badge="MASTER BASE"
              value={draftRates.goldRate24k}
              onChange={handle24kChange}
              accentColor="amber"
            />

            {/* Derived 22K, 20K, 18K Karat Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 22K Card */}
              <RateInputCard
                id="rate-22k"
                label="22K Gold"
                sublabel="Standard Hallmark (916)"
                karat="22K"
                percentage={percentages['22k']}
                onPercentageChange={(pct) => handlePercentageChange('22k', pct)}
                badge="916 BIS"
                value={draftRates.goldRate22k}
                onChange={(v) => setDraftRates({ ...draftRates, goldRate22k: v })}
                accentColor="yellow"
                disabled={autoDerive}
                baseRate24k={draftRates.goldRate24k}
              />

              {/* 20K Card */}
              <RateInputCard
                id="rate-20k"
                label="20K Gold"
                sublabel="Traditional / Kundan / Polki (833)"
                karat="20K"
                percentage={percentages['20k']}
                onPercentageChange={(pct) => handlePercentageChange('20k', pct)}
                badge="833 KUNDAN"
                value={draftRates.goldRate20k}
                onChange={(v) => setDraftRates({ ...draftRates, goldRate20k: v })}
                accentColor="emerald"
                disabled={autoDerive}
                baseRate24k={draftRates.goldRate24k}
              />

              {/* 18K Card */}
              <RateInputCard
                id="rate-18k"
                label="18K Gold"
                sublabel="Diamond & Gemstone Jewellery (750)"
                karat="18K"
                percentage={percentages['18k']}
                onPercentageChange={(pct) => handlePercentageChange('18k', pct)}
                badge="750 DIAMOND"
                value={draftRates.goldRate18k}
                onChange={(v) => setDraftRates({ ...draftRates, goldRate18k: v })}
                accentColor="orange"
                disabled={autoDerive}
                baseRate24k={draftRates.goldRate24k}
              />
            </div>

            {/* 14K & 9K Cards */}
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RateInputCard
                  id="rate-14k"
                  label="14K Gold Rate"
                  sublabel="Modern Lightweight Daily Wear (585)"
                  karat="14K"
                  percentage={percentages['14k']}
                  onPercentageChange={(pct) => handlePercentageChange('14k', pct)}
                  badge="585 MODERN"
                  value={draftRates.goldRate14k}
                  onChange={(v) => setDraftRates({ ...draftRates, goldRate14k: v })}
                  accentColor="purple"
                  disabled={autoDerive}
                  baseRate24k={draftRates.goldRate24k}
                />

                <RateInputCard
                  id="rate-9k"
                  label="9K Gold Rate"
                  sublabel="Affordable & Light Fashion Wear (375)"
                  karat="9K"
                  percentage={percentages['9k']}
                  onPercentageChange={(pct) => handlePercentageChange('9k', pct)}
                  badge="375 AFFORDABLE"
                  value={draftRates.goldRate9k}
                  onChange={(v) => setDraftRates({ ...draftRates, goldRate9k: v })}
                  accentColor="indigo"
                  disabled={autoDerive}
                  baseRate24k={draftRates.goldRate24k}
                />
              </div>
            </div>
          </div>

          {/* ── Other Precious Metals Section (Silver & Platinum) ── */}
          <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
              <div>
                <h3 className="text-sm font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase">
                  Other Precious Metals
                </h3>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                  Silver &amp; Platinum live rates (1 kg = 1000g conversion)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 999 Fine Silver (Base) */}
              <div>
                <RateInputCard
                  id="rate-silver-999"
                  label="999 Fine Silver (Master Base Rate)"
                  sublabel="Pure Silver Bullion Rate per 1 kg"
                  badge="MASTER 999"
                  isMaster={true}
                  value={draftRates.silverRate}
                  onChange={handle999SilverChange}
                  unit="₹ / kg"
                  accentColor="blue"
                />
              </div>

              {/* Platinum Rate */}
              <div>
                <RateInputCard
                  id="rate-platinum"
                  label="Platinum Rate"
                  sublabel="950 Pure Platinum Jewellery Rate"
                  badge="950 PLATINUM"
                  value={draftRates.platinumRate}
                  onChange={(v) => setDraftRates({ ...draftRates, platinumRate: v })}
                  unit="₹ / gram"
                  accentColor="purple"
                />
              </div>
            </div>

            {/* Derived Silver Purities (925 Sterling Silver & Normal Silver) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* 925 Sterling Silver */}
              <RateInputCard
                id="rate-silver-925"
                label="925 Sterling Silver"
                sublabel="Fine Hallmark Jewellery (92.5%)"
                karat="925"
                percentage={percentages.silver925}
                onPercentageChange={(pct) => handlePercentageChange('silver925', pct)}
                badge="925 STERLING"
                value={draftRates.silverRate925}
                onChange={(v) => setDraftRates({ ...draftRates, silverRate925: v })}
                unit="₹ / kg"
                accentColor="cyan"
                disabled={autoDerive}
                baseRate24k={draftRates.silverRate}
              />

              {/* Normal Silver */}
              <RateInputCard
                id="rate-silver-normal"
                label="Normal Silver"
                sublabel="Standard Silver Articles & Ornaments (90.0%)"
                karat="Normal"
                percentage={percentages.silverNormal}
                onPercentageChange={(pct) => handlePercentageChange('silverNormal', pct)}
                badge="900 NORMAL"
                value={draftRates.silverRateNormal}
                onChange={(v) => setDraftRates({ ...draftRates, silverRateNormal: v })}
                unit="₹ / kg"
                accentColor="slate"
                disabled={autoDerive}
                baseRate24k={draftRates.silverRate}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || publishing}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-solid border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Draft'}
            </button>

            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={saving || publishing || !draftRates.goldRate24k}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#C8A646] to-[#E6C687] hover:brightness-105 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              {publishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {publishing ? 'Publishing...' : 'Publish Rates Live'}
            </button>
          </div>
        </div>

        {/* Right: Status Panel (1/3 width) */}
        <div className="space-y-4">

          {/* Live Preview Card */}
          <div className="bg-gradient-to-br from-[#1a1208] to-[#2d1f06] border border-solid border-[#C8A646]/30 rounded-2xl p-6 space-y-5 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIHN0cm9rZT0iI0M4QTY0NiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIGZpbGw9Im5vbmUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-60" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#C8A646]/80 font-bold">
                  Live Rates Overview
                </p>
                <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#C8A646]/20 text-[#E6C687] font-black">
                  Active Bullion
                </span>
              </div>

              {/* Gold Rates Overview */}
              <div className="space-y-2">
                <span className="text-[8px] font-bold uppercase tracking-wider text-amber-500/80 block">Gold Bullion (per 10g &amp; 1g)</span>
                {[
                  { label: '24K Pure Gold', value: draftRates.goldRate24k, unit: '/10g', color: 'text-amber-400', divisor: 10 },
                  { label: '22K Standard Gold', value: draftRates.goldRate22k, unit: '/10g', color: 'text-yellow-400', divisor: 10 },
                  { label: '20K Traditional Gold', value: draftRates.goldRate20k, unit: '/10g', color: 'text-emerald-400', divisor: 10 },
                  { label: '18K Ornament Gold', value: draftRates.goldRate18k, unit: '/10g', color: 'text-orange-400', divisor: 10 },
                  { label: '14K Modern Gold', value: draftRates.goldRate14k, unit: '/10g', color: 'text-purple-400', divisor: 10 },
                  { label: '9K Affordable Gold', value: draftRates.goldRate9k, unit: '/10g', color: 'text-indigo-400', divisor: 10 },
                ].map(({ label, value, unit, color, divisor }) => (
                  <div key={label} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                    <div>
                      <span className="text-[11px] font-bold text-[#C8A646]/90 uppercase tracking-wider block">
                        {label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-black ${color}`}>
                        {value ? `₹${Number(value).toLocaleString('en-IN')}` : '—'}
                      </span>
                      <span className="text-[8px] text-[#C8A646]/60 ml-1">{unit}</span>
                      {value > 0 && (
                        <span className="block text-[9px] font-mono text-zinc-300">
                          (₹{Math.round(Number(value) / divisor).toLocaleString('en-IN')}/g)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Silver & Platinum Overview */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[8px] font-bold uppercase tracking-wider text-cyan-400/80 block">Silver &amp; Platinum (per kg &amp; 1g)</span>
                {[
                  { label: '999 Fine Silver', value: draftRates.silverRate, unit: '/kg', color: 'text-cyan-400', divisor: 1000 },
                  { label: '925 Sterling Silver', value: draftRates.silverRate925, unit: '/kg', color: 'text-cyan-300', divisor: 1000 },
                  { label: 'Normal Silver', value: draftRates.silverRateNormal, unit: '/kg', color: 'text-slate-300', divisor: 1000 },
                  { label: '950 Platinum', value: draftRates.platinumRate, unit: '/g', color: 'text-purple-400', divisor: 1 },
                ].map(({ label, value, unit, color, divisor }) => (
                  <div key={label} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                    <div>
                      <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider block">
                        {label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-black ${color}`}>
                        {value ? `₹${Number(value).toLocaleString('en-IN')}` : '—'}
                      </span>
                      <span className="text-[8px] text-zinc-400 ml-1">{unit}</span>
                      {value > 0 && divisor > 1 && (
                        <span className="block text-[9px] font-mono text-zinc-300">
                          (₹{Math.round(Number(value) / divisor).toLocaleString('en-IN')}/g)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-1 shadow-xs">
            <p className="text-[9px] uppercase tracking-widest font-extrabold text-zinc-400 dark:text-zinc-500 mb-3">Rate Metadata</p>
            <MetaRow icon={Clock}       label="Last Saved"    value={formatDate(savedRates?.lastUpdated)} />
            <MetaRow icon={User}        label="Updated By"    value={savedRates?.updatedBy} />
            <MetaRow icon={CheckCircle2} label="Published At" value={formatDate(savedRates?.publishedAt)} highlight={!!savedRates?.publishedAt} />
            <MetaRow
              icon={AlertCircle}
              label="Status"
              value={savedRates?.isPublished ? 'LIVE ✓' : 'Draft (Not Published)'}
              highlight={savedRates?.isPublished}
            />
          </div>
        </div>
      </div>

      {/* ── Publish Confirmation Dialog ── */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-white dark:bg-zinc-950 border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 w-full max-w-md text-left space-y-6 shadow-2xl z-10"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                    Publish Rate Changes?
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    This will push new Gold (24K, 22K, 20K, 18K, 14K, 9K), Silver (999, 925, Normal) &amp; Platinum rates live immediately. All dynamic jewellery items will recalculate prices in real time.
                  </p>
                </div>
              </div>

              {/* Rate summary */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2">
                {[
                  { label: '24K Pure Gold', value: draftRates.goldRate24k, unit: '/10g' },
                  { label: '22K Gold', value: draftRates.goldRate22k, unit: '/10g' },
                  { label: '18K Gold', value: draftRates.goldRate18k, unit: '/10g' },
                  { label: '14K Gold', value: draftRates.goldRate14k, unit: '/10g' },
                  { label: '9K Gold', value: draftRates.goldRate9k, unit: '/10g' },
                  { label: '999 Fine Silver', value: draftRates.silverRate, unit: '/kg' },
                  { label: '925 Sterling Silver', value: draftRates.silverRate925, unit: '/kg' },
                ].map(({ label, value, unit }) => value ? (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-zinc-500 font-medium">{label}</span>
                    <span className="font-black text-zinc-900 dark:text-zinc-100 font-mono">
                      ₹{Number(value).toLocaleString('en-IN')}<span className="text-[9px] text-zinc-400 font-medium ml-1">{unit}</span>
                    </span>
                  </div>
                ) : null)}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#C8A646] to-[#E6C687] text-white rounded-xl text-xs font-extrabold uppercase tracking-widest hover:brightness-105 transition-all cursor-pointer border-none shadow-md flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Publish Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

