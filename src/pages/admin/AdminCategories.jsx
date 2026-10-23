import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { productsApi } from '../../api/products.api';
import { ImageUploadService } from '../../services/ImageUploadService';
import { StorageService } from '../../services/StorageService';
import { INITIAL_CATEGORIES } from '../../config/constants';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import { 
  Trash2, 
  Edit3, 
  Plus, 
  Image as ImageIcon, 
  X, 
  Check, 
  RefreshCw, 
  Search,
  Sparkles,
  Layers
} from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';

export default function AdminCategories({
  categories: propCategories = [],
  setAdminNotification
}) {
  // Synchronized Reactive Categories State
  const [categories, setCategories] = useState(() => {
    const cached = StorageService.get('manish_categories_store', []);
    if (Array.isArray(cached) && cached.length > 0) return cached;
    if (Array.isArray(propCategories) && propCategories.length > 0) return propCategories;
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    if (Array.isArray(propCategories) && propCategories.length > 0) {
      setCategories(propCategories);
    }
  }, [propCategories]);

  useEffect(() => {
    const handleSync = () => {
      const cached = StorageService.get('manish_categories_store', []);
      if (Array.isArray(cached) && cached.length > 0) {
        setCategories(cached);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('manish_catalog_updated', handleSync);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('manish_catalog_updated', handleSync);
      }
    };
  }, []);

  // Create / Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImg, setNewCatImg] = useState('');
  const [catImageUploadProgress, setCatImageUploadProgress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit Mode State
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatId, setEditCatId] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editCatImg, setEditCatImg] = useState('');
  const [editCatImgProgress, setEditCatImgProgress] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Search Filter
  const [categorySearch, setCategorySearch] = useState('');

  // Category banner image upload for Create form
  const handleCatImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCatImageUploadProgress('Uploading Category Image...');
    try {
      const res = await ImageUploadService.uploadImage(file);
      setNewCatImg(res.url);
      setCatImageUploadProgress('Uploaded successfully!');
    } catch (err) {
      console.error(err);
      setCatImageUploadProgress('Upload failed.');
    }
  };

  // Category banner image upload for Edit form
  const handleEditCatImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditCatImgProgress('Uploading New Image...');
    try {
      const res = await ImageUploadService.uploadImage(file);
      setEditCatImg(res.url);
      setEditCatImgProgress('Image Updated!');
    } catch (err) {
      console.error(err);
      setEditCatImgProgress('Upload failed.');
    }
  };

  // Save new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const trimmedName = newCatName.trim();
    if (!trimmedName) {
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: 'Category name is required.', type: 'error' });
      }
      return;
    }

    const rawSlug = newCatId.trim() || trimmedName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `cat-${Date.now()}`;
    const finalSlug = rawSlug.toLowerCase();

    setSubmitting(true);
    try {
      const payload = {
        id: finalSlug,
        docId: finalSlug,
        name: trimmedName,
        desc: newCatDesc.trim(),
        img: newCatImg.trim(),
        createdDate: new Date().toISOString()
      };

      // 1. Instant local reactive state update
      setCategories(prev => [payload, ...prev.filter(c => c.id !== finalSlug && c.docId !== finalSlug)]);

      // 2. Call products API
      await productsApi.addCategory(payload);
      
      setNewCatName('');
      setNewCatId('');
      setNewCatDesc('');
      setNewCatImg('');
      setCatImageUploadProgress('');

      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: `Category "${payload.name}" established successfully!`, type: 'success' });
      }
    } catch (err) {
      console.error('Failed to create category:', err);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: 'Failed to create category: ' + (err.message || 'Error'), type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal/Mode
  const handleStartEdit = (cat) => {
    setEditingCategory(cat);
    setEditCatName(cat.name || '');
    setEditCatId(cat.id || cat.docId || '');
    setEditCatDesc(cat.desc || '');
    setEditCatImg(cat.img || '');
    setEditCatImgProgress('');
  };

  // Save Updated Category
  const handleSaveEditCategory = async (e) => {
    e.preventDefault();
    if (!editCatName.trim() || !editCatId.trim()) return;

    setIsUpdating(true);
    try {
      const updatedData = {
        name: editCatName.trim(),
        desc: editCatDesc.trim(),
        img: editCatImg.trim()
      };

      await productsApi.updateCategory(editingCategory.id || editingCategory.docId, updatedData);

      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: `Category "${editCatName}" updated successfully!`, type: 'success' });
      }
      setEditingCategory(null);
    } catch (err) {
      console.error('Error updating category:', err);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: 'Failed to update category: ' + err.message, type: 'error' });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (catDocId, catName) => {
    if (window.confirm(`Are you sure you want to remove "${catName || catDocId}" from published categories?`)) {
      try {
        setCategories(prev => prev.filter(c => c.id !== catDocId && c.docId !== catDocId));
        await productsApi.deleteCategory(catDocId);
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({ message: 'Category removed.', type: 'success' });
        }
      } catch (err) {
        console.error(err);
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({ message: 'Failed to remove category.', type: 'error' });
        }
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    (cat.name || '').toLowerCase().includes(categorySearch.toLowerCase()) ||
    (cat.id || '').toLowerCase().includes(categorySearch.toLowerCase()) ||
    (cat.desc || '').toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-[#1A1A1A] dark:text-zinc-100 font-sans text-left w-full overflow-x-hidden">
      
      {/* Category Creation Card */}
      <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
          <div>
            <h3 className="text-base font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C8A646]" />
              Create Catalog Portfolio
            </h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-550 font-semibold">
              Establish new categories layout tabs, describe collections themes, and configure banner assets.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-lg w-fit">
            Total Categories: {categories.length}
          </span>
        </div>

        <form onSubmit={handleAddCategory} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label htmlFor="cat-name" className="text-[9px] uppercase tracking-wider text-zinc-450 font-bold block px-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                id="cat-name"
                type="text"
                required
                placeholder="e.g. Royal Solitaires"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  setNewCatId(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                }}
                className="w-full h-10 bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-200 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cat-id" className="text-[9px] uppercase tracking-wider text-zinc-455 font-bold block px-1">
                Category Code / Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="cat-id"
                type="text"
                required
                placeholder="e.g. royal-solitaires"
                value={newCatId}
                onChange={(e) => setNewCatId(e.target.value)}
                className="w-full h-10 bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-200 font-mono font-bold"
              />
            </div>

          </div>

          <div className="space-y-1.5">
            <label htmlFor="cat-desc" className="text-[9px] uppercase tracking-wider text-zinc-455 font-bold block px-1">
              Portfolio Description
            </label>
            <textarea
              id="cat-desc"
              rows="2"
              placeholder="e.g. Exquisite handcrafted rings featuring signature single diamonds settings."
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              className="w-full p-4 bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none resize-none font-semibold"
            />
          </div>

          {/* Banner image upload */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-solid border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4 max-w-lg">
            <div>
              <span className="text-[10px] font-extrabold text-zinc-800 dark:text-zinc-300 block mb-1">
                Category Showcase Banner
              </span>
              <p className="text-[9px] text-zinc-400 dark:text-zinc-550 font-medium mb-3">
                Upload a showcase banner image or paste an image URL.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  id="cat-image-picker"
                  type="file"
                  accept="image/*"
                  onChange={handleCatImageUpload}
                  className="text-xs text-zinc-500 font-semibold file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#D5A529] file:text-white hover:file:bg-[#A88038] cursor-pointer"
                />
              </div>
              
              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="Or paste direct image URL (https://...)"
                  value={newCatImg}
                  onChange={(e) => setNewCatImg(e.target.value)}
                  className="w-full h-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 text-[11px] font-mono outline-none"
                />
              </div>

              {catImageUploadProgress && (
                <p className="text-[10px] text-[#A88038] mt-1 font-bold">{catImageUploadProgress}</p>
              )}
            </div>

            {newCatImg && (
              <div className="relative group w-36 h-20 rounded-lg overflow-hidden border border-solid border-zinc-300 dark:border-zinc-700 shadow-sm">
                <img src={newCatImg} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setNewCatImg('');
                    setCatImageUploadProgress('');
                    const fileInput = document.getElementById('cat-image-picker');
                    if (fileInput) fileInput.value = '';
                  }}
                  className="absolute inset-0 bg-red-600/80 hover:bg-red-700 opacity-0 group-hover:opacity-100 text-white text-[10px] font-bold uppercase transition-opacity flex items-center justify-center cursor-pointer border-none"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-955 text-xs uppercase font-bold tracking-widest rounded-xl transition-all shadow-xs border-none cursor-pointer flex items-center gap-2"
          >
            {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{submitting ? 'Establishing...' : 'Establish Category'}</span>
          </button>
        </form>
      </div>

      {/* Categories Directory & Search */}
      <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
          <div>
            <h3 className="text-base font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase">
              Category Directory
            </h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
              Live catalog structure tabs displayed on showroom storefront lists.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search category name..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-[#D5A529]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCategories.length === 0 ? (
            <p className="text-xs text-zinc-455 py-8 text-center sm:col-span-3">
              {categories.length === 0 ? 'No categories catalog created yet.' : 'No matching categories found.'}
            </p>
          ) : (
            filteredCategories.map(cat => (
              <div 
                key={cat.id || cat.docId} 
                className="relative group bg-zinc-50 dark:bg-[#121216] border border-solid border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-xs"
              >
                
                {/* Banner Visual */}
                <div className="aspect-[2/1] w-full bg-zinc-150 dark:bg-zinc-900 relative overflow-hidden border-b border-solid border-zinc-200 dark:border-zinc-850 group">
                  {cat.img ? (
                    <img src={getOptimizedImageUrl(cat.img, { width: 500 })} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-mono text-zinc-400 gap-1">
                      <ImageIcon className="w-5 h-5 text-zinc-300" />
                      <span>No Banner Asset</span>
                    </div>
                  )}
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-zinc-800 shadow-sm cursor-pointer border border-zinc-200 transition-all flex items-center gap-1 text-[10px] font-bold"
                      title="Edit Category & Change Image"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#A88038]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.docId || cat.id, cat.name)}
                      className="p-1.5 rounded-lg bg-red-500/90 hover:bg-red-600 text-white cursor-pointer border-none transition-all"
                      title="Remove Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide text-sm">
                        {cat.name}
                      </h4>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                        {cat.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal mt-1">
                      {cat.desc || 'No collection summary provided.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400">
                    <span>Banner: {cat.img ? 'Configured ✓' : 'Default'}</span>
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="text-[#A88038] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer text-[10px]"
                    >
                      Change Image →
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 text-left relative z-10 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-850 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 flex items-center justify-center text-[#A88038]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Edit Category: {editingCategory.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">Slug: {editingCategory.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCategory} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Category Name</label>
                <input
                  type="text"
                  required
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="w-full h-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs font-semibold focus:border-[#D5A529] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Portfolio Description</label>
                <textarea
                  rows="3"
                  value={editCatDesc}
                  onChange={(e) => setEditCatDesc(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:border-[#D5A529] outline-none resize-none"
                />
              </div>

              {/* Change Category Image Section */}
              <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-300 block">
                  Change Category Banner Image
                </span>
                
                <input
                  id="edit-cat-image-picker"
                  type="file"
                  accept="image/*"
                  onChange={handleEditCatImageUpload}
                  className="text-xs text-zinc-500 font-semibold file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#D5A529] file:text-white hover:file:bg-[#A88038] cursor-pointer"
                />

                <input
                  type="text"
                  placeholder="Or paste image URL (https://...)"
                  value={editCatImg}
                  onChange={(e) => setEditCatImg(e.target.value)}
                  className="w-full h-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 text-[11px] font-mono outline-none"
                />

                {editCatImgProgress && (
                  <p className="text-[10px] text-[#A88038] font-bold">{editCatImgProgress}</p>
                )}

                {editCatImg && (
                  <div className="relative group w-full h-28 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 shadow-sm mt-2">
                    <img src={editCatImg} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditCatImg('')}
                      className="absolute top-2 right-2 p-1 rounded bg-red-600 text-white text-[10px] font-bold cursor-pointer border-none shadow"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D5A529] to-[#D68EC7] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none flex items-center justify-center gap-2 shadow-sm"
                >
                  {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{isUpdating ? 'Saving Changes...' : 'Save Category'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
