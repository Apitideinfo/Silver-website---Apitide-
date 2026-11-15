import React, { useState, useEffect } from 'react';
import { showcaseSectionsService, DEFAULT_SHOWCASE_SECTIONS } from '../../services/showcaseSectionsService';
import { ImageUploadService } from '../../services/ImageUploadService';
import { getCategoryFallbackImage } from '../../utils/categoryAssets';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Upload, 
  Check, 
  RefreshCw, 
  Tag, 
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

const SECTION_OPTIONS = [
  { id: 'for-her', label: '01 / For Her (Women)' },
  { id: 'for-him', label: '02 / For Him (Men)' },
  { id: 'for-kids', label: '03 / For Kids' },
  { id: 'couples-section', label: "03 / Couple's Suite" },
  { id: 'gifts-collection', label: "03 / Gift's Collection" },
];

export default function AdminCuratedShowcase({ setAdminNotification }) {
  const [showcaseData, setShowcaseData] = useState(() => showcaseSectionsService.getStoredShowcaseData());
  const [activeSectionId, setActiveSectionId] = useState('for-her');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [uploadProgress, setUploadProgress] = useState('');

  // Sync listener from cloud / external changes
  useEffect(() => {
    const handleSync = () => {
      setShowcaseData(showcaseSectionsService.getStoredShowcaseData());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('manish_curated_showcase_updated', handleSync);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('manish_curated_showcase_updated', handleSync);
      }
    };
  }, []);

  const activeSection = showcaseData[activeSectionId] || DEFAULT_SHOWCASE_SECTIONS[activeSectionId] || {
    id: activeSectionId,
    number: '',
    title: '',
    subtitle: '',
    categories: []
  };

  const handleSave = async (dataToSave = showcaseData) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await showcaseSectionsService.saveShowcaseData(dataToSave);
      if (res.success) {
        setSaveSuccess(true);
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({
            message: '✓ Curated Showcase sections saved and live across all devices!',
            type: 'success'
          });
        }
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        throw new Error(res.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Save error:', err);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({
          message: 'Error saving showcase changes.',
          type: 'error'
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(idx);
    setUploadProgress(`Uploading image for item #${idx + 1}...`);
    try {
      const res = await ImageUploadService.uploadImage(file);
      if (res && res.url) {
        const nextCategories = [...(activeSection.categories || [])];
        nextCategories[idx] = { ...nextCategories[idx], img: res.url };
        const nextShowcase = {
          ...showcaseData,
          [activeSectionId]: {
            ...activeSection,
            categories: nextCategories
          }
        };
        setShowcaseData(nextShowcase);
        await handleSave(nextShowcase);
        setUploadProgress('✓ Image uploaded successfully!');
        setTimeout(() => setUploadProgress(''), 3000);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadProgress('Upload failed. Please try again.');
      setTimeout(() => setUploadProgress(''), 3000);
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleUpdateItemField = (idx, field, val) => {
    const nextCategories = [...(activeSection.categories || [])];
    nextCategories[idx] = { ...nextCategories[idx], [field]: val };
    const nextShowcase = {
      ...showcaseData,
      [activeSectionId]: {
        ...activeSection,
        categories: nextCategories
      }
    };
    setShowcaseData(nextShowcase);
  };

  const handleAddItem = async () => {
    const defaultLabel = 'New Category Item';
    const newItem = {
      id: `item-${Date.now()}`,
      label: defaultLabel,
      img: getCategoryFallbackImage(defaultLabel),
      tab: 'Collections'
    };
    const nextCategories = [...(activeSection.categories || []), newItem];
    const nextShowcase = {
      ...showcaseData,
      [activeSectionId]: {
        ...activeSection,
        categories: nextCategories
      }
    };
    setShowcaseData(nextShowcase);
    await handleSave(nextShowcase);
  };

  const handleDeleteItem = async (idx) => {
    const itemToDelete = activeSection.categories?.[idx];
    const label = itemToDelete?.label || `Item #${idx + 1}`;
    if (!window.confirm(`Delete "${label}" from ${activeSection.title || 'this section'}?`)) return;

    const nextCategories = (activeSection.categories || []).filter((_, i) => i !== idx);
    const nextShowcase = {
      ...showcaseData,
      [activeSectionId]: {
        ...activeSection,
        categories: nextCategories
      }
    };
    setShowcaseData(nextShowcase);
    await handleSave(nextShowcase);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Info Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-amber-500/10 border border-purple-500/20 rounded-2xl p-5 sm:p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-1">
            HOMEPAGE CURATED SHOWCASES
          </span>
          <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-500" />
            Curated Showcases Manager (For Her, Him, Kids, Couples, Gifts)
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            In sections ke items yaha se live update kar sakte hain. Luxury headings intact rahenge aur aapke uploaded images &amp; links seedha storefront par reflect honge.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 font-sans text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 border border-purple-200 dark:border-purple-800"
          >
            <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Add Item Card</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D2B4E] hover:bg-[#081B32] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#E6DFD3]" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E6DFD3]" />
                <span>Save Changes Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SECTION_OPTIONS.map((sec) => {
          const isActive = sec.id === activeSectionId;
          const count = showcaseData[sec.id]?.categories?.length ?? DEFAULT_SHOWCASE_SECTIONS[sec.id]?.categories?.length ?? 0;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSectionId(sec.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-[#15151A] text-white border-[#15151A] dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
              }`}
            >
              <span>{sec.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white dark:bg-zinc-200 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Section Header Info */}
      <div className="bg-white dark:bg-[#15151A] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#6B4B2E] uppercase">
            {activeSection.number}
          </span>
          <h4 className="text-base sm:text-lg font-serif font-bold text-[#0D2B4E] dark:text-white">
            {activeSection.title}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-xl">
            {activeSection.subtitle}
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg">
          {activeSection.categories?.length || 0} Dynamic Slide Items
        </span>
      </div>

      {/* Progress Toast */}
      {uploadProgress && (
        <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-semibold text-center border border-purple-200 dark:border-purple-800">
          {uploadProgress}
        </div>
      )}

      {/* Items Grid */}
      {(!activeSection.categories || activeSection.categories.length === 0) ? (
        <div className="p-12 text-center bg-white dark:bg-[#15151A] rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 space-y-3">
          <ImageIcon className="w-12 h-12 text-zinc-400 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No Items in this Showcase</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Click "+ Add Item Card" to add an item slide for this section on the storefront.
          </p>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            + Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {activeSection.categories.map((item, idx) => {
            const displayImg = item.img || getCategoryFallbackImage(item.label || item.name || item.id);
            const isUploading = uploadingIdx === idx;
            return (
              <div
                key={item.id || idx}
                className="bg-white dark:bg-[#15151A] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5 flex flex-col space-y-3 shadow-xs hover:border-purple-500/50 transition-all text-left relative group"
              >
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDeleteItem(idx)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-lg bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs border border-red-200 hover:border-red-500"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Square Photo Box */}
                <div className="w-full aspect-square bg-[#F8F5EC] dark:bg-zinc-900 rounded-xl overflow-hidden relative border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                  <img
                    src={displayImg}
                    alt={item.label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const fb = getCategoryFallbackImage(item.label);
                      if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                    }}
                  />

                  {/* Photo Upload Overlay */}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer text-white text-[11px] font-bold p-2 text-center">
                    <Upload className="w-4 h-4 text-white" />
                    <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => handleImageUpload(e, idx)}
                    />
                  </label>
                </div>

                {/* Card Fields */}
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                      Label / Name
                    </label>
                    <input
                      type="text"
                      value={item.label || ''}
                      onChange={(e) => handleUpdateItemField(idx, 'label', e.target.value)}
                      onBlur={() => handleSave()}
                      placeholder="e.g. Anklets, Rings"
                      className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1">
                      <span>Collection Tab</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </label>
                    <input
                      type="text"
                      value={item.tab || ''}
                      onChange={(e) => handleUpdateItemField(idx, 'tab', e.target.value)}
                      onBlur={() => handleSave()}
                      placeholder="e.g. rings, necklaces, Collections"
                      className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
