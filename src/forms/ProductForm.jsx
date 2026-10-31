import React, { createContext, useContext, useMemo, useState } from 'react';
import { AlertTriangle, Calculator, Sparkles, TrendingUp, CheckCircle2, ChevronDown, ChevronUp, Gem } from 'lucide-react';
import { useRates } from '../hooks/useRates';
import { calculateDynamicPrice, formatINR } from '../utils/pricing';

const ProductFormContext = createContext({
  getVal: () => '',
  updateField: () => {},
  updateFields: () => {},
});

const isVideoUrl = (url) => {
  if (!url) return false;
  return url.includes('.mp4') || url.includes('.webm') || url.includes('/video/upload/');
};

const downloadFile = async (url, filename = 'downloaded_image') => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    let ext = 'png';
    if (url.includes('.webp')) ext = 'webp';
    else if (url.includes('.jpg')) ext = 'jpg';
    else if (url.includes('.jpeg')) ext = 'jpeg';
    else if (url.includes('.mp4')) ext = 'mp4';
    link.download = `${filename}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("CORS block or fetch error. Opening in new tab:", error);
    window.open(url, '_blank');
  }
};

const FloatingInput = ({
  id,
  label,
  type = 'text',
  field,
  value: propValue,
  required = false,
  min,
  max,
  step,
  suffix,
  onChange,
  placeholder,
  className = ""
}) => {
  const { getVal, updateField } = useContext(ProductFormContext);
  const value = propValue !== undefined ? propValue : (field ? getVal(field) : '');
  const handleChange = onChange || ((e) => {
    const val = e.target.value;
    if (field) {
      updateField(field, type === 'number' ? (val === '' ? '' : +val) : val);
    }
  });

  return (
    <div className={`flex flex-col gap-1.5 text-left ${className}`}>
      <label
        htmlFor={id}
        className="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder || `Enter ${label}`}
          value={value}
          onChange={handleChange}
          className={`w-full h-10 bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl px-4 ${suffix ? 'pr-16' : ''} text-xs text-zinc-950 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-600 focus:outline-none focus:border-[#B8893C] dark:focus:border-[#E6C687] focus:ring-1 focus:ring-[#B8893C]/20 font-semibold`}
          required={required}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-450 dark:text-zinc-500 font-extrabold select-none pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

const FloatingSelect = ({
  id,
  label,
  field,
  value: propValue,
  required = false,
  onChange,
  children,
  className = ""
}) => {
  const { getVal, updateField } = useContext(ProductFormContext);
  const value = propValue !== undefined ? propValue : (field ? getVal(field) : '');
  const handleChange = onChange || ((e) => {
    if (field) {
      updateField(field, e.target.value);
    }
  });

  return (
    <div className={`flex flex-col gap-1.5 text-left ${className}`}>
      <label
        htmlFor={id}
        className="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        className="w-full h-10 bg-white dark:bg-[#09090B] border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-[#B8893C] dark:focus:border-[#E6C687] cursor-pointer font-semibold"
        required={required}
      >
        {children}
      </select>
    </div>
  );
};

const FloatingTextarea = ({
  id,
  label,
  field,
  value: propValue,
  required = false,
  rows = "2",
  onChange,
  placeholder,
  className = ""
}) => {
  const { getVal, updateField } = useContext(ProductFormContext);
  const value = propValue !== undefined ? propValue : (field ? getVal(field) : '');
  const handleChange = onChange || ((e) => {
    if (field) {
      updateField(field, e.target.value);
    }
  });

  return (
    <div className={`flex flex-col gap-1.5 text-left ${className}`}>
      <label
        htmlFor={id}
        className="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder || `Enter ${label}`}
        value={value}
        onChange={handleChange}
        className="w-full bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-950 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-600 focus:outline-none focus:border-[#B8893C] dark:focus:border-[#E6C687] resize-none font-semibold"
        required={required}
      ></textarea>
    </div>
  );
};

export default function ProductForm({
  editingProduct,
  setEditingProduct,
  newProduct,
  setNewProduct,
  categories = [],
  onSubmit,
  handleImageUpload,
  imageUploadProgress,
  handleRemoveImage,
  handleSubImagesUpload,
  subImagesUploadProgress,
  handleRemoveSubImage,
  handleFormKeyDown
}) {
  const { 
    goldRate24k = 78500, 
    goldRate22k = 71958, 
    goldRate20k = 65417, 
    goldRate18k = 58875, 
    goldRate14k = 45788, 
    goldRate9k = 29438,
    silverRate = 92000,
    silverRate1kg = 92000,
    silverRate925 = 85100,
    silverRateNormal = 82800,
    platinumRate = 3500 
  } = useRates();

  const getVal = (field, defaultVal = '') => {
    if (editingProduct) {
      return editingProduct[field] !== undefined ? editingProduct[field] : defaultVal;
    }
    return newProduct[field] !== undefined ? newProduct[field] : defaultVal;
  };

  const updateField = (field, val) => {
    if (editingProduct) {
      setEditingProduct(prev => ({ ...(prev || {}), [field]: val }));
    } else {
      setNewProduct(prev => ({ ...(prev || {}), [field]: val }));
    }
  };

  const updateFields = (fieldsObj) => {
    if (editingProduct) {
      setEditingProduct(prev => ({ ...(prev || {}), ...fieldsObj }));
    } else {
      setNewProduct(prev => ({ ...(prev || {}), ...fieldsObj }));
    }
  };

  // Metal detection for context-aware fields
  const currentMetalChoice = (getVal('categoryType') || getVal('metal') || getVal('metalType') || '').toLowerCase();
  const isSilverProduct = currentMetalChoice.includes('silver') || currentMetalChoice.includes('925') || currentMetalChoice.includes('999');
  const isPlatinumProduct = currentMetalChoice.includes('platinum');
  const isGoldProduct = !isSilverProduct && !isPlatinumProduct;

  // Compute live dynamic price breakdown when dynamic mode is selected
  const isDynamicMode = getVal('priceCalculationMode', 'manual') === 'dynamic';
  const targetProductObj = editingProduct || newProduct;

  const liveBreakdown = useMemo(() => {
    if (!isDynamicMode) return null;
    return calculateDynamicPrice(targetProductObj, {
      goldRate24k,
      goldRate22k,
      goldRate20k,
      goldRate18k,
      goldRate14k,
      goldRate9k,
      silverRate,
      silverRate1kg,
      silverRate925,
      silverRateNormal,
      platinumRate
    });
  }, [targetProductObj, isDynamicMode, goldRate24k, goldRate22k, goldRate20k, goldRate18k, goldRate14k, goldRate9k, silverRate, silverRate1kg, silverRate925, silverRateNormal, platinumRate]);

  // Certificate multi-select state helper
  const rawCertificates = getVal('certificates', []);
  const activeCertificates = Array.isArray(rawCertificates) && rawCertificates.length > 0
    ? rawCertificates
    : (getVal('hallmark') ? String(getVal('hallmark')).split(',').map(s => s.trim()).filter(Boolean) : ['BIS Hallmark Certificate']);

  const toggleCertificate = (certName) => {
    let updated;
    if (activeCertificates.includes(certName)) {
      updated = activeCertificates.filter(c => c !== certName);
    } else {
      updated = [...activeCertificates, certName];
    }
    updateFields({
      certificates: updated,
      hallmark: updated.join(', ')
    });
  };

  // Diamond data presence detection for accordion state
  const hasDiamondData = Boolean(
    getVal('diamondShape') || getVal('diamondWeight') || getVal('diamondColor') || 
    getVal('diamondClarity') || getVal('diamondCut') || getVal('diamondQuantity') || 
    getVal('diamondValue') || getVal('stoneCarat') || getVal('beadsCarat') || 
    getVal('pearlsCarat') || getVal('gemstoneCarat') || getVal('polki') || 
    getVal('polkiValue') || getVal('pearlsValue') || getVal('discountOffDiamond')
  );
  const [isDiamondOpen, setIsDiamondOpen] = useState(hasDiamondData);

  const contextValue = {
    getVal,
    updateField,
    updateFields,
    editingProduct,
    newProduct,
    liveBreakdown
  };

  return (
    <ProductFormContext.Provider value={contextValue}>
      <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
        <div>
          <h3 className="text-base font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase">
            {editingProduct ? 'Update Jewellery Details' : 'Register New Jewellery'}
          </h3>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Add parameters, metal values, diamond scales and prices to catalog registry.</p>
        </div>
        {editingProduct && (
          <button
            type="button"
            onClick={() => setEditingProduct(null)}
            className="px-3 py-1 rounded-md border border-solid border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all uppercase cursor-pointer bg-transparent"
          >
            Reset Add Mode
          </button>
        )}
      </div>

      {categories.length === 0 && (
        <div className="p-4 bg-amber-500/10 border border-solid border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
          <div className="space-y-1 text-left">
            <p className="font-bold uppercase tracking-wider text-[10px]">Mandatory Step Required</p>
            <p>You must establish at least one Category catalog before creating signature items. Please create one in the Category tab.</p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-8" onKeyDown={handleFormKeyDown}>

        {/* Section: General Details */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-[#E6C687]"></span>
            <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">General Information</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <FloatingInput
              id="prod-name-form"
              label="Jewellery Name"
              field="name"
              required
              className="col-span-2"
            />
            <FloatingInput
              id="prod-sku-form"
              label="SKU Code"
              field="sku"
              required
            />
             <FloatingSelect
              id="prod-category-form"
              label="Category Portfolio"
              field="category"
              required
            >
              <option value="">Select Category Portfolio</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </FloatingSelect>
            <FloatingSelect
              id="prod-categoryType-form"
              label="Metal Type"
              field="categoryType"
              required
              onChange={(e) => {
                const val = e.target.value;
                const isSilv = val.toLowerCase().includes('silver') || val.includes('925') || val.includes('999');
                const isPlat = val.toLowerCase().includes('platinum');
                
                let defaultPurity = '22K';
                if (isSilv) {
                  if (val.includes('999')) defaultPurity = '999 Silver';
                  else if (val.includes('Normal')) defaultPurity = 'Normal Silver';
                  else defaultPurity = '925 Sterling Silver';
                } else if (isPlat) {
                  defaultPurity = '950 Platinum';
                }

                updateFields({
                  categoryType: val,
                  metal: isSilv ? 'Silver' : (isPlat ? 'Platinum' : 'Gold'),
                  metalType: isSilv ? 'Silver' : (isPlat ? 'Platinum' : 'Gold'),
                  carat: defaultPurity,
                  metalPurity: defaultPurity,
                  goldPurity: isSilv || isPlat ? '' : defaultPurity,
                  silverPurity: isSilv ? defaultPurity : '',
                });
              }}
            >
              <option value="">Select Metal Type</option>
              <option value="Gold">Gold</option>
              <option value="925 Sterling Silver">925 Sterling Silver</option>
              <option value="Normal Silver">Normal Silver</option>
              <option value="999 Silver">999 Silver</option>
              <option value="Platinum">Platinum</option>
            </FloatingSelect>

            {/* Silver Weight Preset — for Bullion 999 Silver coins/bars */}
            {getVal('categoryType') === '999 Silver' && (
              <FloatingSelect
                id="prod-silverWeight-preset-form"
                label="Quick Silver Coin/Bar Weight"
                field="silverWeightPreset"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '500 gm') {
                    updateFields({ silverWeight: 500, netWeight: 500, weight: 500 });
                  } else if (val === '1 Kg') {
                    updateFields({ silverWeight: 1000, netWeight: 1000, weight: 1000 });
                  }
                }}
              >
                <option value="">Select Weight Preset</option>
                <option value="500 gm">500 gm</option>
                <option value="1 Kg">1 Kg</option>
              </FloatingSelect>
            )}
          </div>

          <div className={`grid grid-cols-1 ${getVal('jewelryType') === 'Custom' ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4`}>
            <FloatingSelect
              id="prod-jewelry-type-form"
              label="Jewellery Type"
              field="jewelryType"
            >
              <option value="">Select Jewellery Type</option>
              <option value="Kundan jewellery">Kundan jewellery</option>
              <option value="Kundan polki jewellery">Kundan polki jewellery</option>
              <option value="Light weight jewellery">Light weight jewellery</option>
              <option value="CZ Gold Jewelry">CZ Gold Jewelry</option>
              <option value="Diamond Gold Jewelry">Diamond Gold Jewelry</option>
              <option value="Plain Gold Jewelry">Plain Gold Jewelry</option>
              <option value="Labgrown Diamond Jewelry">Labgrown Diamond Jewelry</option>
              <option value="Labgrown Silver Jewelry">Labgrown Silver Jewelry</option>
              <option value="Imported Silver Jewelry">Imported Silver Jewelry</option>
              <option value="Traditional Silver Jewelry">Traditional Silver Jewelry</option>
              <option value="Modern Gold Jewelry">Modern Gold Jewelry</option>
              <option value="Modern Silver Jewelry">Modern Silver Jewelry</option>
              <option value="Custom">Custom</option>
            </FloatingSelect>

            {getVal('jewelryType') === 'Custom' && (
              <FloatingInput
                id="prod-custom-jewelry-type-form"
                label="Custom Jewellery Type"
                field="customJewelryType"
                placeholder="Enter custom jewellery type"
              />
            )}

            <FloatingSelect
              id="prod-gender-form"
              label="Gender"
              field="gender"
            >
              <option value="">Select Gender</option>
              <option value="Unisex">Unisex</option>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Kids">Kids</option>
              <option value="Others">Others</option>
            </FloatingSelect>
            <FloatingSelect
              id="prod-occasion-form"
              label="Occasion"
              field="occasion"
            >
              <option value="">Select Occasion</option>
              <option value="Everyday Wear">Everyday Wear</option>
              <option value="Festive">Festive</option>
              <option value="Wedding">Wedding</option>
              <option value="Engagement">Engagement</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Gifting">Gifting</option>
              <option value="Workwear">Workwear</option>
              <option value="Romantic">Romantic</option>
              <option value="Vacation">Vacation</option>
              <option value="Special Occasion">Special Occasion</option>
              <option value="Valentine">Valentine</option>
            </FloatingSelect>
          </div>

          <FloatingTextarea
            id="prod-desc-form"
            label="Jewellery Parameters & Details Description"
            field="desc"
            required
          />
        </div>

        {/* Section: Metal Specifications */}
        <div className="space-y-4 pt-4 border-t border-solid border-zinc-100 dark:border-zinc-850 text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-[#E6C687]"></span>
            <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
              {isSilverProduct ? 'Silver Specifications' : (isPlatinumProduct ? 'Platinum Specifications' : 'Gold Specifications')}
            </h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Dynamic Purity Dropdown based on selected metal */}
            {isSilverProduct ? (
              <div className="space-y-2">
                <FloatingSelect
                  id="prod-silver-purity-form"
                  label="Silver Purity"
                  field="silverPurity"
                  value={getVal('silverPurity') || getVal('carat') || '925 Sterling Silver'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateFields({ silverPurity: val, carat: val, metalPurity: val });
                  }}
                >
                  <option value="925 Sterling Silver">925 Sterling Silver</option>
                  <option value="Normal Silver">Normal Silver</option>
                  <option value="999 Silver">999 Silver (Fine Silver)</option>
                  <option value="Custom">Custom Purity</option>
                </FloatingSelect>

                {getVal('silverPurity') === 'Custom' && (
                  <FloatingInput
                    id="prod-custom-silver-purity"
                    label="Custom Silver Purity"
                    placeholder="e.g. 900 Silver, 800 Silver, 99.9% Bar"
                    field="customSilverPurity"
                    onChange={(e) => {
                      const val = e.target.value;
                      updateFields({ customSilverPurity: val, carat: val, metalPurity: val });
                    }}
                  />
                )}
              </div>
            ) : isPlatinumProduct ? (
              <div className="space-y-2">
                <FloatingSelect
                  id="prod-platinum-purity-form"
                  label="Platinum Purity"
                  field="platinumPurity"
                  value={getVal('platinumPurity') || getVal('carat') || '950 Platinum'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateFields({ platinumPurity: val, carat: val, metalPurity: val });
                  }}
                >
                  <option value="950 Platinum">950 Pure Platinum</option>
                  <option value="Custom">Custom Platinum Purity</option>
                </FloatingSelect>

                {getVal('platinumPurity') === 'Custom' && (
                  <FloatingInput
                    id="prod-custom-platinum-purity"
                    label="Custom Platinum Purity"
                    placeholder="e.g. 900 Platinum, 999 Platinum"
                    field="customPlatinumPurity"
                    onChange={(e) => {
                      const val = e.target.value;
                      updateFields({ customPlatinumPurity: val, carat: val, metalPurity: val });
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <FloatingSelect
                  id="prod-gold-purity-form"
                  label="Carat & Purity"
                  field="carat"
                  value={getVal('goldPurity') || getVal('carat') || '22K'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateFields({ carat: val, goldPurity: val, metalPurity: val });
                  }}
                >
                  <option value="">Select Carat &amp; Purity</option>
                  <option value="24K">24K (Pure Gold - 100%)</option>
                  <option value="22K">22K (Standard Hallmark - 91.6%)</option>
                  <option value="20K">20K (Traditional Kundan - 83.3%)</option>
                  <option value="18K">18K (Diamond/Ornaments - 75.0%)</option>
                  <option value="14K">14K (Modern Daily - 58.3%)</option>
                  <option value="9K">9K (Trending / Budget - 37.5%)</option>
                  <option value="925 Sterling Silver">925 Sterling Silver (92.5%)</option>
                  <option value="Normal Silver">Normal Silver</option>
                  <option value="999 Silver">999 Silver (Pure Silver - 99.9%)</option>
                  <option value="950 Platinum">950 Platinum (95.0%)</option>
                  <option value="Custom">Custom Purity / Karat</option>
                </FloatingSelect>

                {(getVal('carat') === 'Custom' || getVal('goldPurity') === 'Custom') && (
                  <FloatingInput
                    id="prod-custom-gold-purity"
                    label="Custom Carat & Purity"
                    placeholder="e.g. 21K, 10K, 23K, 916 Hallmark"
                    field="customCarat"
                    onChange={(e) => {
                      const val = e.target.value;
                      updateFields({ customCarat: val, metalPurity: val });
                    }}
                  />
                )}
              </div>
            )}

            {/* Dynamic Net Weight Input */}
            {isSilverProduct ? (
              <FloatingInput
                id="prod-silver-weight-form"
                label="Silver Net Weight (grams)"
                placeholder="Enter Silver Net Weight (grams)"
                field="silverWeight"
                type="number"
                step="0.001"
                min="0"
                required={isDynamicMode}
                value={getVal('silverWeight') !== '' ? getVal('silverWeight') : getVal('netWeight')}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  updateFields({ silverWeight: val, netWeight: val, weight: val });
                }}
              />
            ) : isPlatinumProduct ? (
              <FloatingInput
                id="prod-platinum-weight-form"
                label="Platinum Net Weight (grams)"
                placeholder="Enter Platinum Net Weight (grams)"
                field="platinumWeight"
                type="number"
                step="0.001"
                min="0"
                required={isDynamicMode}
                value={getVal('platinumWeight') !== '' ? getVal('platinumWeight') : getVal('netWeight')}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  updateFields({ platinumWeight: val, netWeight: val, weight: val });
                }}
              />
            ) : (
              <FloatingInput
                id="prod-gold-weight-spec-form"
                label="Gold Net Weight (grams)"
                placeholder="Enter Gold Net Weight (grams)"
                field="goldWeight"
                type="number"
                step="0.001"
                min="0"
                required={isDynamicMode}
                value={getVal('goldWeight') !== '' ? getVal('goldWeight') : getVal('netWeight')}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  updateFields({ goldWeight: val, netWeight: val, weight: val });
                }}
              />
            )}

            <div className="relative">
              <FloatingInput
                id="prod-grossWeight-form"
                label="Gross Weight"
                field="grossWeight"
                type="number"
                step="0.001"
                min="0"
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  updateFields({ grossWeight: val, weight: val });
                }}
              />
              {/* Standard Coin Weights Selectors */}
              {(getVal('category') === 'gold-coins' || getVal('category')?.toLowerCase().includes('coin')) && (
                <div className="space-y-1 mt-2 select-none">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-400 font-bold block px-1">Quick Select Coin Weight:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['0.5', '1', '2', '5', '8', '10', '20', '50'].map((w) => {
                      const activeWeight = String(getVal('grossWeight'));
                      const isActive = activeWeight === w;
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => {
                            const numW = Number(w);
                            updateFields({ grossWeight: numW, netWeight: numW, weight: numW, goldWeight: numW, silverWeight: numW });
                          }}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border border-solid transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#BCA057] border-[#BCA057] text-white font-extrabold shadow-sm'
                              : 'border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 bg-white dark:bg-zinc-900'
                          }`}
                        >
                          {w}g
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <FloatingInput
              id="prod-dimensions-form"
              label="Product Dimensions"
              field="productDimensions"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FloatingSelect
              id="prod-metalColor-form"
              label="Metal Color / Finishing"
              field="metalColor"
            >
              <option value="">Select Metal Color/Finishing</option>
              <option value="Yellow Gold">Yellow Gold</option>
              <option value="Rose Gold">Rose Gold</option>
              <option value="White Gold">White Gold</option>
              <option value="Platinum Plated Silver">Platinum Plated Silver</option>
              <option value="Rose Gold Plated Silver">Rose Gold Plated Silver</option>
              <option value="Gold Plated Silver">Gold Plated Silver</option>
              <option value="Two-Tone Gold">Two-Tone Gold</option>
              <option value="Antique Gold / Kundan Finish">Antique Gold / Kundan Finish</option>
              <option value="Oxidised Silver">Oxidised Silver</option>
              <option value="Black Rhodium">Black Rhodium</option>
              <option value="Custom">Custom Color / Finishing</option>
            </FloatingSelect>

            {/* Custom Metal Color/Finish Text Input */}
            {(getVal('metalColor') === 'Custom' || getVal('customMetalColor')) && (
              <FloatingInput
                id="prod-custom-metal-color-form"
                label="Custom Metal Color / Finish"
                placeholder="Enter custom color or finish (e.g. Antique Finish, Matte Finish, Black Rhodium, Two-Tone)"
                field="customMetalColor"
                required={getVal('metalColor') === 'Custom'}
              />
            )}
          </div>
        </div>

        {/* Section: Diamonds & Gemstones Details (Collapsible Accordion Dropdown) */}
        <div className="pt-4 border-t border-solid border-zinc-100 dark:border-zinc-850 text-left">
          <button
            type="button"
            onClick={() => setIsDiamondOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/80 dark:hover:bg-zinc-850 border border-solid border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer select-none text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#B8893C]/15 dark:bg-[#E6C687]/15 flex items-center justify-center text-[#B8893C] dark:text-[#E6C687]">
                <Gem className="w-3.5 h-3.5" />
              </span>
              <div>
                <h4 className="text-xs font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase flex items-center gap-2">
                  Diamonds &amp; Stone Details
                  <span className="text-[9px] font-normal text-zinc-400 dark:text-zinc-500 lowercase">
                    (Optional for plain jewellery)
                  </span>
                </h4>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                  {isDiamondOpen ? 'Click arrow to collapse section' : 'Click arrow to expand and add Diamond, Polki, Pearls & Gemstone parameters'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasDiamondData && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-[9px] font-bold">
                  ✓ Configured
                </span>
              )}
              <div className="w-6 h-6 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center border border-solid border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 transition-transform duration-200">
                {isDiamondOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </div>
          </button>

          {isDiamondOpen && (
            <div className="space-y-4 mt-4 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                <FloatingSelect
                  id="prod-diamondShape-form"
                  label="Diamond Shape"
                  field="diamondShape"
                >
                  <option value="">Select Diamond Shape</option>
                  <option value="Round">Round</option>
                  <option value="Princess">Princess</option>
                  <option value="Cushion">Cushion</option>
                  <option value="Oval">Oval</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Pear">Pear</option>
                  <option value="Marquise">Marquise</option>
                  <option value="Radiant">Radiant</option>
                  <option value="Asscher">Asscher</option>
                  <option value="Heart">Heart</option>
                </FloatingSelect>

                <FloatingInput
                  id="prod-diamondWeight-form"
                  label="Diamond Weight"
                  field="diamondWeight"
                />

                <FloatingSelect
                  id="prod-diamondColor-form"
                  label="Color Grade"
                  field="diamondColor"
                >
                  <option value="">Select Color Grade</option>
                  <option value="EF">EF</option>
                  <option value="GH">GH</option>
                  <option value="HI">HI</option>
                  <option value="IJ">IJ</option>
                  <option value="JK">JK</option>
                  <option value="KL">KL</option>
                  <option value="LM">LM</option>
                  <option value="NZ">NZ</option>
                  <option value="DF">DF</option>
                </FloatingSelect>

                <FloatingSelect
                  id="prod-diamondClarity-form"
                  label="Clarity Grade"
                  field="diamondClarity"
                >
                  <option value="">Select Clarity Grade</option>
                  <option value="FL">FL</option>
                  <option value="IF">IF</option>
                  <option value="VVS1">VVS1</option>
                  <option value="VVS2">VVS2</option>
                  <option value="VS1">VS1</option>
                  <option value="VS2">VS2</option>
                  <option value="SI1">SI1</option>
                  <option value="SI2">SI2</option>
                  <option value="I1">I1</option>
                  <option value="I2">I2</option>
                  <option value="I3">I3</option>
                </FloatingSelect>

                <FloatingSelect
                  id="prod-diamondCut-form"
                  label="Cut Grade"
                  field="diamondCut"
                >
                  <option value="">Select Cut Grade</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </FloatingSelect>

                <FloatingInput
                  id="prod-diamondQuantity-form"
                  label="Diamond Pcs"
                  field="diamondQuantity"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <FloatingInput
                  id="prod-diamondValue-form"
                  label="Diamond Value (₹)"
                  field="diamondValue"
                  type="number"
                  min="0"
                />

                <FloatingInput
                  id="prod-stoneCarat-form"
                  label="Stone weight"
                  field="stoneCarat"
                />

                <FloatingInput
                  id="prod-beadsCarat-form"
                  label="Beads weight"
                  field="beadsCarat"
                />

                <FloatingInput
                  id="prod-pearlsCarat-form"
                  label="Pearls weight"
                  field="pearlsCarat"
                />

                <FloatingInput
                  id="prod-gemstoneCarat-form"
                  label="Gemstone weight"
                  field="gemstoneCarat"
                />

                <FloatingInput
                  id="prod-polki-form"
                  label="Polki weight"
                  field="polki"
                />

                <FloatingInput
                  id="prod-polkiValue-form"
                  label="Polki Value (₹)"
                  field="polkiValue"
                  type="number"
                  min="0"
                />

                <FloatingInput
                  id="prod-pearlsValue-form"
                  label="Pearls / Gemstone Value (₹)"
                  field="pearlsValue"
                  type="number"
                  min="0"
                />

                <FloatingInput
                  id="prod-discountOffDiamond-form"
                  label="Discount Off Diamond"
                  field="discountOffDiamond"
                  type="number"
                  min="0"
                  max="100"
                  suffix="% OFF"
                  className="col-span-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section: Pricing & Commercial details */}
        <div className="space-y-4 pt-4 border-t border-solid border-zinc-100 dark:border-zinc-850 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                Pricing &amp; Commercials
              </h4>
            </div>
            {isDynamicMode && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/60 text-[9px] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#A88038]" /> Live Bullion Synced
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FloatingSelect
              id="prod-calc-mode"
              label="Price Mode"
              field="priceCalculationMode"
              value={getVal('priceCalculationMode') || 'manual'}
              onChange={(e) => {
                const mode = e.target.value;
                updateFields({
                  priceCalculationMode: mode,
                  goldPurity: getVal('goldPurity') || getVal('carat') || '22K',
                  silverPurity: getVal('silverPurity') || '925 Sterling Silver',
                  carat: getVal('carat') || (isSilverProduct ? '925 Sterling Silver' : '22K'),
                  makingChargeType: getVal('makingChargeType') || 'percentage',
                  gstPercent: getVal('gstPercent', 3)
                });
              }}
            >
              <option value="manual">Manual (Fixed Price)</option>
              <option value="dynamic">Dynamic (Auto Recalculate with Live Rates)</option>
            </FloatingSelect>

            {getVal('priceCalculationMode', 'manual') === 'manual' ? (
              <>
                <FloatingInput
                  id="prod-price-form"
                  label="Fixed Selling Price (INR)"
                  field="price"
                  type="number"
                  required={getVal('priceCalculationMode', 'manual') === 'manual'}
                />
                <FloatingInput
                  id="prod-discount-manual-form"
                  label="Discount Off Item"
                  field="discountPercent"
                  type="number"
                  min="0"
                  max="100"
                  suffix="% OFF"
                />
              </>
            ) : (
              <>
                {/* Context-aware Purity Selection */}
                {isSilverProduct ? (
                  <div className="space-y-2">
                    <FloatingSelect
                      id="prod-silver-purity-dyn-form"
                      label="Silver Purity"
                      field="silverPurity"
                      value={getVal('silverPurity') || getVal('carat') || '925 Sterling Silver'}
                      onChange={(e) => {
                        const p = e.target.value;
                        updateFields({ silverPurity: p, carat: p, metalPurity: p });
                      }}
                    >
                      <option value="925 Sterling Silver">925 Sterling Silver (92.5%)</option>
                      <option value="Normal Silver">Normal Silver</option>
                      <option value="999 Silver">999 Silver (Fine Silver)</option>
                      <option value="Custom">Custom Purity</option>
                    </FloatingSelect>

                    {getVal('silverPurity') === 'Custom' && (
                      <FloatingInput
                        id="prod-custom-silver-purity-dyn"
                        label="Custom Silver Purity"
                        placeholder="e.g. 900 Silver, 800 Silver"
                        field="customSilverPurity"
                        onChange={(e) => {
                          const p = e.target.value;
                          updateFields({ customSilverPurity: p, carat: p, metalPurity: p });
                        }}
                      />
                    )}
                  </div>
                ) : isPlatinumProduct ? (
                  <div className="space-y-2">
                    <FloatingSelect
                      id="prod-plat-purity-dyn-form"
                      label="Platinum Purity"
                      field="platinumPurity"
                      value={getVal('platinumPurity') || '950 Platinum'}
                      onChange={(e) => {
                        const p = e.target.value;
                        updateFields({ platinumPurity: p, carat: p, metalPurity: p });
                      }}
                    >
                      <option value="950 Platinum">950 Pure Platinum</option>
                      <option value="Custom">Custom Platinum Purity</option>
                    </FloatingSelect>

                    {getVal('platinumPurity') === 'Custom' && (
                      <FloatingInput
                        id="prod-custom-plat-purity-dyn"
                        label="Custom Platinum Purity"
                        placeholder="e.g. 900 Platinum, 999 Platinum"
                        field="customPlatinumPurity"
                        onChange={(e) => {
                          const p = e.target.value;
                          updateFields({ customPlatinumPurity: p, carat: p, metalPurity: p });
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FloatingSelect
                      id="prod-purity-form"
                      label="Metal Purity (Karat)"
                      field="goldPurity"
                      value={getVal('goldPurity') || getVal('carat') || '22K'}
                      onChange={(e) => {
                        const p = e.target.value;
                        updateFields({ goldPurity: p, carat: p, metalPurity: p });
                      }}
                    >
                      <option value="24K">24K (Pure Gold - 100%)</option>
                      <option value="22K">22K (Standard Hallmark - 91.6%)</option>
                      <option value="20K">20K (Traditional Kundan - 83.3%)</option>
                      <option value="18K">18K (Diamond/Ornaments - 75.0%)</option>
                      <option value="14K">14K (Modern Daily - 58.3%)</option>
                      <option value="9K">9K (Trending / Budget - 37.5%)</option>
                      <option value="925 Sterling Silver">925 Sterling Silver (92.5%)</option>
                      <option value="Normal Silver">Normal Silver</option>
                      <option value="999 Silver">999 Silver (Pure Silver - 99.9%)</option>
                      <option value="950 Platinum">950 Platinum (95.0%)</option>
                      <option value="Custom">Custom Purity / Karat</option>
                    </FloatingSelect>

                    {(getVal('goldPurity') === 'Custom' || getVal('carat') === 'Custom') && (
                      <FloatingInput
                        id="prod-custom-gold-purity-dyn"
                        label="Custom Carat & Purity"
                        placeholder="e.g. 21K, 10K, 23K, 916 Hallmark"
                        field="customCarat"
                        onChange={(e) => {
                          const val = e.target.value;
                          updateFields({ customCarat: val, metalPurity: val });
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Context-aware Net Weight Input */}
                {isSilverProduct ? (
                  <FloatingInput
                    id="prod-silver-net-weight-dyn-form"
                    label="Silver Net Weight (grams)"
                    placeholder="Enter Silver Net Weight (grams)"
                    field="silverWeight"
                    type="number"
                    step="0.001"
                    min="0"
                    value={getVal('silverWeight') !== '' ? getVal('silverWeight') : getVal('netWeight')}
                    onChange={(e) => {
                      const w = e.target.value === '' ? '' : Number(e.target.value);
                      updateFields({ silverWeight: w, netWeight: w, weight: w });
                    }}
                    required={getVal('priceCalculationMode', 'manual') === 'dynamic'}
                  />
                ) : isPlatinumProduct ? (
                  <FloatingInput
                    id="prod-plat-net-weight-dyn-form"
                    label="Platinum Net Weight (grams)"
                    placeholder="Enter Platinum Net Weight (grams)"
                    field="platinumWeight"
                    type="number"
                    step="0.001"
                    min="0"
                    value={getVal('platinumWeight') !== '' ? getVal('platinumWeight') : getVal('netWeight')}
                    onChange={(e) => {
                      const w = e.target.value === '' ? '' : Number(e.target.value);
                      updateFields({ platinumWeight: w, netWeight: w, weight: w });
                    }}
                    required={getVal('priceCalculationMode', 'manual') === 'dynamic'}
                  />
                ) : (
                  <FloatingInput
                    id="prod-gold-weight-form"
                    label="Metal Net Weight (grams)"
                    placeholder="Enter Metal Net Weight (grams)"
                    field="goldWeight"
                    type="number"
                    step="0.001"
                    min="0"
                    value={getVal('goldWeight') !== '' ? getVal('goldWeight') : getVal('netWeight')}
                    onChange={(e) => {
                      const w = e.target.value === '' ? '' : Number(e.target.value);
                      updateFields({ goldWeight: w, netWeight: w, weight: w });
                    }}
                    required={getVal('priceCalculationMode', 'manual') === 'dynamic'}
                  />
                )}
              </>
            )}

            {/* Hallmark / Certificate Multi-Select Checkboxes */}
            <div className="space-y-1.5 text-left col-span-1 sm:col-span-1">
              <label className="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase block">
                Certificate &amp; Hallmark <span className="text-zinc-400 font-normal lowercase">(Multi-Select)</span>
              </label>
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 space-y-2">
                {[
                  'BIS Hallmark Government Certified',
                  'IGI Diamond Certificate',
                  '925 Silver Authenticity Certificate',
                  'BIS Hallmark 750 (18K)',
                  'BIS Hallmark 916 (22K)',
                  'Uncertified / Custom'
                ].map((cert) => {
                  const isChecked = activeCertificates.includes(cert);
                  return (
                    <label
                      key={cert}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCertificate(cert)}
                        className="w-4 h-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="text-[11px] leading-tight">{cert}</span>
                    </label>
                  );
                })}

                {/* Custom Certificate Input if Uncertified / Custom is checked */}
                {activeCertificates.includes('Uncertified / Custom') && (
                  <div className="pt-2 border-t border-solid border-zinc-200 dark:border-zinc-800">
                    <input
                      type="text"
                      placeholder="Enter custom certificate name..."
                      value={getVal('customCertificate', '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField('customCertificate', val);
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {getVal('priceCalculationMode', 'manual') === 'dynamic' && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2">
              <FloatingSelect
                id="prod-making-charge-type"
                label="Making Charge Type"
                field="makingChargeType"
                onChange={(e) => updateField('makingChargeType', e.target.value)}
              >
                <option value="percentage">Percentage (%) of Metal Value</option>
                <option value="fixed">Fixed Amount (₹)</option>
                <option value="per_gram">Making on Metal Weight (₹ per Gram)</option>
              </FloatingSelect>

              <FloatingInput
                id="prod-making-charge-value"
                label={
                  getVal('makingChargeType', 'percentage') === 'percentage'
                    ? 'Making Charge (%)'
                    : getVal('makingChargeType') === 'per_gram' || getVal('makingChargeType') === 'weight'
                    ? 'Making Charge (₹/g)'
                    : 'Making Charge (₹)'
                }
                placeholder={
                  getVal('makingChargeType', 'percentage') === 'percentage'
                    ? 'Enter Making Charge (%)'
                    : getVal('makingChargeType') === 'per_gram' || getVal('makingChargeType') === 'weight'
                    ? 'Enter ₹ per Gram (e.g. 650)'
                    : 'Enter Total Making Charge (₹)'
                }
                field="makingChargeValue"
                type="number"
                step="0.1"
                min="0"
                suffix={
                  getVal('makingChargeType', 'percentage') === 'percentage'
                    ? '%'
                    : getVal('makingChargeType') === 'per_gram' || getVal('makingChargeType') === 'weight'
                    ? '₹/g'
                    : '₹'
                }
                onChange={(e) => {
                  const mv = e.target.value === '' ? '' : Number(e.target.value);
                  updateFields({ makingChargeValue: mv, makingCharges: mv });
                }}
              />

              <FloatingInput
                id="prod-stone-price"
                label="Stone / Gemstone Charges (₹)"
                field="stonePrice"
                type="number"
                min="0"
                placeholder="Enter stone charges (₹)"
              />

              <FloatingInput
                id="prod-other-charges"
                label="Other Additional Charges (₹)"
                field="otherCharges"
                type="number"
                min="0"
                placeholder="Enter other charges (₹)"
              />

              <FloatingInput
                id="prod-discount-form"
                label="Discount Off Item"
                field="discountPercent"
                type="number"
                min="0"
                max="100"
                suffix="% OFF"
              />
            </div>
          )}

          {/* GST Rate Manual Configuration & Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
            <FloatingInput
              id="prod-discountOffMaking-form"
              label="Discount Off Making Charge"
              field="discountOffMaking"
              type="number"
              min="0"
              max="100"
              suffix="% OFF"
            />

            {/* Manual GST Rate with Quick Presets */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label htmlFor="prod-gst-form" className="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                  GST Rate (%) <span className="text-zinc-400 font-normal lowercase">(Manual Edit)</span>
                </label>
              </div>

              <div className="relative">
                <input
                  id="prod-gst-form"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="3"
                  value={getVal('gstPercent', 3)}
                  onChange={(e) => {
                    const gVal = e.target.value === '' ? 0 : Number(e.target.value);
                    updateFields({ gstPercent: gVal, gstPercentage: gVal });
                  }}
                  className="w-full h-10 bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl px-4 pr-10 text-xs text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#B8893C] font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-extrabold select-none pointer-events-none">
                  %
                </span>
              </div>

              {/* Quick Preset Pills */}
              <div className="flex items-center gap-1.5 pt-1 text-[9px] font-bold flex-wrap">
                {[
                  { label: '3% (Standard)', value: 3 },
                  { label: '0% (Export/SEZ)', value: 0 },
                  { label: '5%', value: 5 },
                  { label: '18%', value: 18 }
                ].map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateFields({ gstPercent: preset.value, gstPercentage: preset.value })}
                    className={`px-1.5 py-0.5 rounded border border-solid cursor-pointer transition-colors ${
                      Number(getVal('gstPercent', 3)) === preset.value
                        ? 'bg-[#C8A646] text-white border-[#C8A646]'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <FloatingInput
              id="prod-badge-form"
              label="Product Badge"
              field="badge"
              placeholder="e.g. Best Seller, Trending"
            />

            <FloatingSelect
              id="prod-stock-form"
              label="Stock Status"
              field="stockStatus"
            >
              <option value="In Stock">In Stock (Available immediately)</option>
              <option value="Out of Stock">Out of Stock (Request Booking Only)</option>
              <option value="Preorder">Preorder (Making charges adjustments)</option>
            </FloatingSelect>
          </div>

          {/* ⚡ Real-Time Auto-Calculated Live Price Breakdown Card */}
          {isDynamicMode && liveBreakdown && (
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#FAF7F0] via-white to-[#F7F2E6] dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 border border-solid border-[#D5A529]/40 shadow-sm text-zinc-900 dark:text-zinc-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-solid border-[#D5A529]/20 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#D5A529]/20 flex items-center justify-center text-[#A88038]">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-[#E6C687]">
                      Live Auto-Calculated Price Breakdown ({isSilverProduct ? 'Silver' : (isPlatinumProduct ? 'Platinum' : 'Gold')})
                    </h5>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      Live rate for {liveBreakdown.purity}: ₹{Math.round(liveBreakdown.ratePerGram || (liveBreakdown.metalValue / (liveBreakdown.weight || 1)) || 0).toLocaleString('en-IN')}/g
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Estimated Selling Price</span>
                  <span className="text-lg font-black text-[#A88038] dark:text-[#F3D9A4] font-mono">
                    ₹{liveBreakdown.total?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Grid Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
                <div className="bg-white/80 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">{isSilverProduct ? 'Silver' : (isPlatinumProduct ? 'Platinum' : 'Gold')} ({liveBreakdown.weight}g)</span>
                  <span className="font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
                    ₹{liveBreakdown.metalValue?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">Making Charges</span>
                  <span className="font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
                    ₹{liveBreakdown.makingCharge?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">Stones &amp; Other</span>
                  <span className="font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
                    ₹{((liveBreakdown.totalStoneValue !== undefined ? liveBreakdown.totalStoneValue : (liveBreakdown.stonePrice || 0)) + (liveBreakdown.otherCharges || 0))?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">
                    {liveBreakdown.discountPercent > 0 ? `Orig. MRP (${liveBreakdown.discountPercent}% OFF)` : 'Discount'}
                  </span>
                  <span className={`font-extrabold font-mono ${liveBreakdown.discountPercent > 0 ? 'text-gray-500 line-through' : 'text-zinc-500'}`}>
                    {liveBreakdown.discountPercent > 0 ? `₹${liveBreakdown.originalTotal?.toLocaleString('en-IN')}` : '0% (None)'}
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">GST ({liveBreakdown.gstPct}%)</span>
                  <span className="font-extrabold text-amber-700 dark:text-amber-400 font-mono">
                    ₹{liveBreakdown.gst?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-[#D5A529]/15 p-2.5 rounded-xl border border-[#D5A529]/40 col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-[#A88038] font-black uppercase block">Final Total</span>
                  <span className="font-black text-[#A88038] dark:text-[#F3D9A4] font-mono text-sm">
                    ₹{liveBreakdown.total?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

          {/* Section: Size Customization Selector */}
          {(() => {
          const rawRingSizes = getVal('ringSizes', []);
          const rawBangleSizes = getVal('bangleSizes', []);
          const rawChainSizes = getVal('chainSizes', []);
          const currentRingSizes = Array.isArray(rawRingSizes) ? rawRingSizes : (typeof rawRingSizes === 'string' && rawRingSizes.trim() ? rawRingSizes.split(',').map(s => s.trim()).filter(Boolean) : []);
          const currentBangleSizes = Array.isArray(rawBangleSizes) ? rawBangleSizes : (typeof rawBangleSizes === 'string' && rawBangleSizes.trim() ? rawBangleSizes.split(',').map(s => s.trim()).filter(Boolean) : []);
          const currentChainSizes = Array.isArray(rawChainSizes) ? rawChainSizes : (typeof rawChainSizes === 'string' && rawChainSizes.trim() ? rawChainSizes.split(',').map(s => s.trim()).filter(Boolean) : []);

          const storedSizeType = getVal('sizeType');
          const selectedType = storedSizeType || (
            currentRingSizes.length > 0 ? 'rings' : (currentBangleSizes.length > 0 ? 'bangles' : (currentChainSizes.length > 0 ? 'chains' : 'none'))
          );

          const COMMON_RING_SIZES = ['10', '12', '14', '16', '18', '20', '22'];
          const ALL_RING_SIZES = Array.from({ length: 34 - 6 + 1 }, (_, i) => {
            const num = 6 + i;
            return num < 10 ? `0${num}` : `${num}`;
          });
          const ALL_BANGLE_SIZES = ['1-2', '1-4', '1-6', '1-8', '2-0', '2-2', '2-4', '2-6', '2-8', '3-0', '3-2', '3-4'];
          const COMMON_BANGLE_SIZES = ['2-2', '2-4', '2-6', '2-8'];
          const ALL_CHAIN_SIZES = ['12"', '14"', '16"', '18"', '20"', '22"', '24"', '26"', '28"', '30"', '32"', '34"', '36"'];
          const COMMON_CHAIN_SIZES = ['16"', '18"', '20"', '22"'];

          return (
            <div className="space-y-4 pt-4 border-t border-solid border-zinc-100 dark:border-zinc-850 text-left">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">Size Selection Type</h4>
              </div>
              <div className="max-w-xs">
                <select
                  id="admin-size-type"
                  value={selectedType}
                  onChange={(e) => {
                    const type = e.target.value;
                    if (type === 'rings') {
                      const rings = currentRingSizes.length > 0 ? currentRingSizes : COMMON_RING_SIZES;
                      updateFields({ sizeType: 'rings', ringSizes: rings, bangleSizes: [], chainSizes: [] });
                    } else if (type === 'bangles') {
                      const bangles = currentBangleSizes.length > 0 ? currentBangleSizes : COMMON_BANGLE_SIZES;
                      updateFields({ sizeType: 'bangles', ringSizes: [], bangleSizes: bangles, chainSizes: [] });
                    } else if (type === 'chains') {
                      const chains = currentChainSizes.length > 0 ? currentChainSizes : COMMON_CHAIN_SIZES;
                      updateFields({ sizeType: 'chains', ringSizes: [], bangleSizes: [], chainSizes: chains });
                    } else {
                      updateFields({ sizeType: 'none', ringSizes: [], bangleSizes: [], chainSizes: [] });
                    }
                  }}
                  className="w-full h-10 bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs text-[#1A1A1A] dark:text-zinc-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-1 focus:ring-amber-400/20 font-semibold cursor-pointer"
                >
                  <option value="none">No Size Selection (Coins / Earrings / Pendants / Articles)</option>
                  <option value="rings">Ring Size List (IND Sizes)</option>
                  <option value="bangles">Bangle / Kada Size List</option>
                  <option value="chains">Chain / Necklace Length List</option>
                </select>
              </div>

              {/* Section: Ring Sizes Option */}
              {selectedType === 'rings' && (
                <div className="space-y-4 pt-4 border-t border-solid border-zinc-100 dark:border-zinc-800/40">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-[#E6C687]"></span>
                      <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                        Available Ring Sizes (IND) {currentRingSizes.length > 0 ? `(${currentRingSizes.length} Active)` : '(0 Selected - Click boxes to activate)'}
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateFields({ ringSizes: COMMON_RING_SIZES })}
                        className="px-2.5 py-1 text-[9px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-solid border-amber-300 dark:border-amber-700/60 rounded-lg cursor-pointer bg-transparent"
                      >
                        Select Popular
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFields({ ringSizes: ALL_RING_SIZES })}
                        className="px-2.5 py-1 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer bg-transparent"
                      >
                        Select All (06-34)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFields({ ringSizes: [] })}
                        className="px-2.5 py-1 text-[9px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 border border-solid border-red-200 dark:border-red-900/40 rounded-lg cursor-pointer bg-transparent"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 xs:grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-1.5 sm:gap-2">
                    {ALL_RING_SIZES.map((szStr) => {
                      const isSelected = currentRingSizes.includes(szStr);

                      return (
                        <button
                          key={szStr}
                          type="button"
                          onClick={() => {
                            let updatedSizes = [];
                            if (currentRingSizes.includes(szStr)) {
                              updatedSizes = currentRingSizes.filter(s => s !== szStr);
                            } else {
                              updatedSizes = [...currentRingSizes, szStr].sort();
                            }
                            updateFields({ ringSizes: updatedSizes });
                          }}
                          className={`h-8 border border-solid flex items-center justify-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 font-extrabold shadow-sm'
                              : 'bg-transparent text-zinc-400 border-zinc-200 dark:border-zinc-800 dark:text-zinc-600 hover:border-zinc-450 hover:text-zinc-700'
                          }`}
                        >
                          {szStr}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Ring Size Input */}
                  <div className="pt-2 flex items-center gap-2 max-w-sm">
                    <input
                      id="custom-ring-size-input"
                      type="text"
                      placeholder="Add custom size (e.g. 05.5, Free Size, US 7)"
                      className="flex-1 h-9 bg-white dark:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 font-semibold"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (val && !currentRingSizes.includes(val)) {
                            updateFields({ ringSizes: [...currentRingSizes, val] });
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('custom-ring-size-input');
                        const val = input?.value?.trim();
                        if (val && !currentRingSizes.includes(val)) {
                          updateFields({ ringSizes: [...currentRingSizes, val] });
                          if (input) input.value = '';
                        }
                      }}
                      className="px-3 h-9 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border-none"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              )}

              {/* Section: Bangle Sizes Option */}
              {selectedType === 'bangles' && (
                <div className="space-y-4 pt-4 border-t border-solid border-zinc-100 dark:border-zinc-800/40">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-[#E6C687]"></span>
                      <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                        Available Bangle Sizes {currentBangleSizes.length > 0 ? `(${currentBangleSizes.length} Active)` : '(0 Selected)'}
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateFields({ bangleSizes: COMMON_BANGLE_SIZES })}
                        className="px-2.5 py-1 text-[9px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 border border-solid border-amber-300 dark:border-amber-700/60 rounded-lg cursor-pointer bg-transparent"
                      >
                        Select Popular
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFields({ bangleSizes: ALL_BANGLE_SIZES })}
                        className="px-2.5 py-1 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer bg-transparent"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFields({ bangleSizes: [] })}
                        className="px-2.5 py-1 text-[9px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 border border-solid border-red-200 dark:border-red-900/40 rounded-lg cursor-pointer bg-transparent"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_BANGLE_SIZES.map((sz) => {
                      const isSelected = currentBangleSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            let updated = [];
                            if (currentBangleSizes.includes(sz)) {
                              updated = currentBangleSizes.filter(s => s !== sz);
                            } else {
                              updated = [...currentBangleSizes, sz];
                            }
                            updateFields({ bangleSizes: updated });
                          }}
                          className={`h-8 px-3 border border-solid flex items-center justify-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 font-extrabold shadow-sm'
                              : 'bg-transparent text-zinc-400 border-zinc-200 dark:border-zinc-800 dark:text-zinc-600 hover:border-zinc-450'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Bangle Size Input */}
                  <div className="pt-2 flex items-center gap-2 max-w-sm">
                    <input
                      id="custom-bangle-size-input"
                      type="text"
                      placeholder="Add custom bangle size (e.g. 2-10, 2-12, Free Size)"
                      className="flex-1 h-9 bg-white dark:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 font-semibold"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (val && !currentBangleSizes.includes(val)) {
                            updateFields({ bangleSizes: [...currentBangleSizes, val] });
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('custom-bangle-size-input');
                        const val = input?.value?.trim();
                        if (val && !currentBangleSizes.includes(val)) {
                          updateFields({ bangleSizes: [...currentBangleSizes, val] });
                          if (input) input.value = '';
                        }
                      }}
                      className="px-3 h-9 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border-none"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              )}

              {/* Section: Chain Sizes Option */}
              {selectedType === 'chains' && (
                <div className="space-y-4 pt-4 border-t border-solid border-zinc-100 dark:border-zinc-800/40">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-[#E6C687]"></span>
                      <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                        Available Chain / Necklace Lengths {currentChainSizes.length > 0 ? `(${currentChainSizes.length} Active)` : '(0 Selected)'}
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateFields({ chainSizes: COMMON_CHAIN_SIZES })}
                        className="px-2.5 py-1 text-[9px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 border border-solid border-amber-300 dark:border-amber-700/60 rounded-lg cursor-pointer bg-transparent"
                      >
                        Select Popular
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFields({ chainSizes: ALL_CHAIN_SIZES })}
                        className="px-2.5 py-1 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer bg-transparent"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFields({ chainSizes: [] })}
                        className="px-2.5 py-1 text-[9px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 border border-solid border-red-200 dark:border-red-900/40 rounded-lg cursor-pointer bg-transparent"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_CHAIN_SIZES.map((sz) => {
                      const isSelected = currentChainSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            let updated = [];
                            if (currentChainSizes.includes(sz)) {
                              updated = currentChainSizes.filter(s => s !== sz);
                            } else {
                              updated = [...currentChainSizes, sz];
                            }
                            updateFields({ chainSizes: updated });
                          }}
                          className={`h-8 px-3 border border-solid flex items-center justify-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-950 text-white border-zinc-955 dark:bg-zinc-105 dark:text-zinc-950 dark:border-zinc-100 font-extrabold shadow-sm'
                              : 'bg-transparent text-zinc-400 border-zinc-200 dark:border-zinc-800 dark:text-zinc-600 hover:border-zinc-450'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Chain Size Input */}
                  <div className="pt-2 flex items-center gap-2 max-w-sm">
                    <input
                      id="custom-chain-size-input"
                      type="text"
                      placeholder="Add custom length (e.g. 15 inches, 40 cm, 38&quot;)"
                      className="flex-1 h-9 bg-white dark:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 font-semibold"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (val && !currentChainSizes.includes(val)) {
                            updateFields({ chainSizes: [...currentChainSizes, val] });
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('custom-chain-size-input');
                        const val = input?.value?.trim();
                        if (val && !currentChainSizes.includes(val)) {
                          updateFields({ chainSizes: [...currentChainSizes, val] });
                          if (input) input.value = '';
                        }
                      }}
                      className="px-3 h-9 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border-none"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Section: Media Assets / Gallery */}
        <div className="space-y-4 pt-4 border-t border-solid border-zinc-100 dark:border-zinc-850 text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-[#E6C687]"></span>
            <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">Jewellery Assets / Gallery</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Main Cover Image Uploader Card */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-solid border-zinc-200 dark:border-zinc-800 p-5 rounded-xl space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-zinc-800 dark:text-zinc-300 block mb-1">Primary Cover Image</span>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium mb-3">Upload a clean webp/png catalog cover image.</p>
                <input
                  id="prod-image-picker"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, editingProduct ? 'edit' : 'new')}
                  className="text-xs text-zinc-500 font-semibold"
                />
                {imageUploadProgress && <p className="text-[9px] text-[#BCA057] mt-1.5 font-bold">{imageUploadProgress}</p>}
              </div>
              {getVal('img') && (
                <div className="relative group w-20 h-24 rounded-lg overflow-hidden border border-solid border-zinc-200 dark:border-zinc-800">
                  <img
                    src={getVal('img')}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => downloadFile(getVal('img'), `${getVal('sku') || 'product'}_cover`)}
                      className="w-full py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[8px] font-bold uppercase tracking-wider rounded cursor-pointer border-none"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(editingProduct ? 'edit' : 'new')}
                      className="w-full py-1 bg-red-650 hover:bg-red-700 text-white text-[8px] font-bold uppercase tracking-wider rounded cursor-pointer border-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sub-gallery Uploader Card */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-solid border-zinc-200 dark:border-zinc-800 p-5 rounded-xl space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-zinc-800 dark:text-zinc-300 block mb-1">Sub Gallery Media</span>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium mb-3">Upload secondary angles images or showcasing videos.</p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => handleSubImagesUpload(e, editingProduct ? 'edit' : 'new')}
                  className="text-xs text-zinc-500 font-semibold"
                />
                {subImagesUploadProgress && <p className="text-[9px] text-[#BCA057] mt-1.5 font-bold">{subImagesUploadProgress}</p>}
              </div>

              {/* List of sub-images */}
              {(getVal('subImages', [])).length > 0 && (
                <div className="flex flex-wrap gap-2.5">
                  {(getVal('subImages', [])).map((subImg, idx) => (
                    <div key={idx} className="relative group w-12 h-14 rounded overflow-hidden border border-solid border-zinc-200 dark:border-zinc-805">
                      {isVideoUrl(subImg) ? (
                        <div className="w-full h-full relative bg-black">
                          <video src={subImg} className="w-full h-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <span className="text-[9px]"></span>
                          </div>
                        </div>
                      ) : (
                        <img src={subImg} alt="" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                        <button
                          type="button"
                          onClick={() => downloadFile(subImg, `${getVal('sku') || 'product'}_gallery_${idx + 1}`)}
                          className="w-full py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[7px] font-bold uppercase tracking-wider rounded cursor-pointer border-none leading-none"
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubImage(idx, editingProduct ? 'edit' : 'new')}
                          className="w-full py-0.5 bg-red-650 hover:bg-red-700 text-white text-[7px] font-bold uppercase tracking-wider rounded cursor-pointer border-none leading-none"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form submits actions */}
        <div className="flex gap-3 pt-4 border-t border-solid border-zinc-100 dark:border-zinc-850 text-left">
          <button
            type="submit"
            disabled={categories.length === 0 && !editingProduct}
            className="h-10 px-8 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none font-bold text-center"
          >
            {editingProduct ? 'Save Jewellery Changes' : 'Publish Product to Catalog'}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="h-10 px-6 border border-solid border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-650 dark:text-zinc-350 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
    </ProductFormContext.Provider>
  );
}
