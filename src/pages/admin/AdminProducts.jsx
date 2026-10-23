import React, { useState } from 'react';
import ProductForm from '../../forms/ProductForm';
import { db } from '../../firebase';
import { productsApi } from '../../api/products.api';
import { ImageUploadService } from '../../services/ImageUploadService';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import { doc, deleteDoc } from 'firebase/firestore';

export default function AdminProducts({
  products = [],
  categories = [],
  setAdminNotification
}) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    categoryType: 'Gold',
    jewelryType: '',
    customJewelryType: '',
    silverPurity: '925 Sterling Silver',
    silverWeight: '',
    gender: 'Unisex',
    occasion: 'Everyday Wear',
    desc: '',
    carat: '22K',
    goldPurity: '22K',
    netWeight: '',
    grossWeight: '',
    weight: '',
    goldWeight: '',
    productDimensions: '',
    metalColor: 'Yellow Gold',
    customMetalColor: '',
    certificates: ['bis_hallmark'],
    diamondShape: '',
    diamondWeight: '',
    diamondColor: '',
    diamondClarity: '',
    diamondCut: '',
    diamondQuantity: '',
    diamondValue: '',
    stoneCarat: '',
    beadsCarat: '',
    pearlsCarat: '',
    gemstoneCarat: '',
    polki: '',
    polkiValue: '',
    pearlsValue: '',
    discountOffDiamond: '',
    priceCalculationMode: 'manual',
    makingChargeType: 'percentage',
    makingChargeValue: '',
    stonePrice: '',
    otherCharges: '',
    price: '',
    hallmark: 'BIS Hallmark Certificate',
    makingCharges: '',
    discountPercent: '',
    discountOffMaking: '',
    gstPercent: 3,
    badge: '',
    stockStatus: 'In Stock',
    img: '',
    subImages: [],
    sizeType: 'none',
    ringSizes: [],
    bangleSizes: [],
    chainSizes: []
  });

  const [imageUploadProgress, setImageUploadProgress] = useState('');
  const [subImagesUploadProgress, setSubImagesUploadProgress] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCatalogIds, setSelectedCatalogIds] = useState([]);

  // File Upload Cover image
  const handleImageUpload = async (e, mode) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadProgress('Uploading Cover...');
    try {
      const res = await ImageUploadService.uploadImage(file);
      if (mode === 'edit') {
        setEditingProduct(prev => ({ ...prev, img: res.url }));
      } else {
        setNewProduct(prev => ({ ...prev, img: res.url }));
      }
      setImageUploadProgress('Cover Uploaded!');
    } catch (err) {
      console.error(err);
      setImageUploadProgress('Upload failed.');
    }
  };

  // Remove cover image
  const handleRemoveImage = (mode) => {
    if (mode === 'edit') {
      setEditingProduct(prev => ({ ...prev, img: '' }));
    } else {
      setNewProduct(prev => ({ ...prev, img: '' }));
    }
    setImageUploadProgress('');
    const fileInput = document.getElementById('prod-image-picker');
    if (fileInput) fileInput.value = '';
  };

  // Gallery Sub-images uploads
  const handleSubImagesUpload = async (e, mode) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSubImagesUploadProgress(`Uploading 0 of ${files.length}...`);
    try {
      let completedCount = 0;
      let failedCount = 0;
      const urls = [];

      const uploadPromises = files.map(async (file) => {
        try {
          const res = await ImageUploadService.uploadImage(file);
          if (res && res.url) {
            urls.push(res.url);
          } else {
            failedCount++;
          }
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          failedCount++;
        } finally {
          completedCount++;
          setSubImagesUploadProgress(`Uploading ${completedCount} of ${files.length}...`);
        }
      });

      await Promise.all(uploadPromises);

      if (urls.length > 0) {
        if (mode === 'edit') {
          setEditingProduct(prev => ({
            ...prev,
            subImages: [...(prev.subImages || []), ...urls]
          }));
        } else {
          setNewProduct(prev => ({
            ...prev,
            subImages: [...(prev.subImages || []), ...urls]
          }));
        }
      }

      // Reset file input value so onChange can be triggered again for the same files
      e.target.value = '';

      if (failedCount > 0) {
        setSubImagesUploadProgress(`Uploaded ${urls.length} items (${failedCount} failed).`);
      } else {
        setSubImagesUploadProgress('Gallery added!');
      }
    } catch (err) {
      console.error(err);
      setSubImagesUploadProgress('Gallery upload error.');
    }
  };

  // Remove a sub image
  const handleRemoveSubImage = (index, mode) => {
    if (mode === 'edit') {
      setEditingProduct(prev => ({
        ...prev,
        subImages: (prev.subImages || []).filter((_, idx) => idx !== index)
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        subImages: (prev.subImages || []).filter((_, idx) => idx !== index)
      }));
    }
  };

  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const targetProduct = editingProduct || newProduct;
    if (!targetProduct.name || !targetProduct.name.trim()) {
      setAdminNotification({ message: 'Product Name is required!', type: 'error' });
      alert('Product Name is required!');
      return;
    }
    if (!targetProduct.category || !targetProduct.category.trim()) {
      setAdminNotification({ message: 'Product Category is required!', type: 'error' });
      alert('Product Category is required!');
      return;
    }

    try {
      if (editingProduct) {
        // Edit mode save
        const payload = {
          ...editingProduct,
          priceCalculationMode: editingProduct.priceCalculationMode || (Number(editingProduct.price) > 0 ? 'manual' : 'dynamic')
        };
        await productsApi.updateProduct(editingProduct.id, payload);
        setEditingProduct(null);
        setAdminNotification({ message: 'Jewellery updated successfully!', type: 'success' });
      } else {
        // Create mode save
        const payload = {
          ...newProduct,
          priceCalculationMode: newProduct.priceCalculationMode || (Number(newProduct.price) > 0 ? 'manual' : 'dynamic')
        };
        await productsApi.addProduct(payload);
        setNewProduct({
          name: '',
          sku: '',
          category: '',
          categoryType: 'Gold',
          jewelryType: '',
          customJewelryType: '',
          silverPurity: '925 Sterling Silver',
          silverWeight: '',
          gender: 'Unisex',
          occasion: 'Everyday Wear',
          desc: '',
          carat: '22K',
          goldPurity: '22K',
          netWeight: '',
          grossWeight: '',
          weight: '',
          goldWeight: '',
          productDimensions: '',
          metalColor: 'Yellow Gold',
          customMetalColor: '',
          certificates: ['bis_hallmark'],
          diamondShape: '',
          diamondWeight: '',
          diamondColor: '',
          diamondClarity: '',
          diamondCut: '',
          diamondQuantity: '',
          diamondValue: '',
          stoneCarat: '',
          beadsCarat: '',
          pearlsCarat: '',
          gemstoneCarat: '',
          polki: '',
          polkiValue: '',
          pearlsValue: '',
          discountOffDiamond: '',
          priceCalculationMode: 'manual',
          makingChargeType: 'percentage',
          makingChargeValue: '',
          stonePrice: '',
          otherCharges: '',
          price: '',
          hallmark: 'BIS Hallmark Certificate',
          makingCharges: '',
          discountPercent: '',
          discountOffMaking: '',
          gstPercent: 3,
          badge: '',
          stockStatus: 'In Stock',
          img: '',
          subImages: [],
          sizeType: 'none',
          ringSizes: [],
          bangleSizes: [],
          chainSizes: []
        });
        setAdminNotification({ message: 'Jewellery published successfully!', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      setAdminNotification({ message: 'Failed to write product details. Try again.', type: 'error' });
    }
  };

  // Single delete
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this design?")) {
      try {
        await productsApi.deleteProduct(id);
        setAdminNotification({ message: 'Jewellery deleted.', type: 'success' });
      } catch (err) {
        console.error(err);
        setAdminNotification({ message: 'Failed to delete jewellery.', type: 'error' });
      }
    }
  };

  // Bulk delete
  const handleDeleteSelectedCatalog = async () => {
    if (window.confirm(`Delete all ${selectedCatalogIds.length} selected items?`)) {
      try {
        for (const id of selectedCatalogIds) {
          await productsApi.deleteProduct(id);
        }
        setSelectedCatalogIds([]);
        setAdminNotification({ message: 'Selected items deleted.', type: 'success' });
      } catch (err) {
        console.error(err);
        setAdminNotification({ message: 'Error deleting selection.', type: 'error' });
      }
    }
  };

  const downloadFile = async (url, filename) => {
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

  const handleDownloadProductImages = async (product) => {
    if (product.img) {
      await downloadFile(product.img, `${product.sku || 'product'}_cover`);
    }
    if (Array.isArray(product.subImages) && product.subImages.length > 0) {
      for (let i = 0; i < product.subImages.length; i++) {
        await downloadFile(product.subImages[i], `${product.sku || 'product'}_gallery_${i + 1}`);
      }
    }
  };

  const filtered = products
    .filter(p => productCategoryFilter === 'all' || p.category === productCategoryFilter)
    .filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.sku?.toLowerCase().includes(productSearch.toLowerCase()));

  return (
    <div className="space-y-6 pb-24 text-[#1A1A1A] dark:text-zinc-100 font-sans text-left w-full overflow-x-hidden">
      
      {/* Form Area container */}
      <ProductForm
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        categories={categories}
        onSubmit={handleSaveProduct}
        handleImageUpload={handleImageUpload}
        imageUploadProgress={imageUploadProgress}
        handleRemoveImage={handleRemoveImage}
        handleSubImagesUpload={handleSubImagesUpload}
        subImagesUploadProgress={subImagesUploadProgress}
        handleRemoveSubImage={handleRemoveSubImage}
        handleFormKeyDown={handleFormKeyDown}
      />

      {/* Catalog lists table */}
      <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
          <div>
            <h3 className="text-base font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase">Catalog Inventory</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">Filter, search, edit, or remove published items from the global vault catalog.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              className="bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-650 dark:text-zinc-350 focus:outline-none cursor-pointer w-full sm:w-auto font-sans font-bold"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search SKU or name..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-1.5 text-xs w-full sm:w-60 text-zinc-850 dark:text-zinc-150 placeholder-zinc-450 focus:outline-none font-semibold"
            />
          </div>
        </div>

        {/* Selection tools */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 pb-3 border-b border-solid border-zinc-100 dark:border-zinc-850">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="select-all-catalog"
              checked={filtered.length > 0 && selectedCatalogIds.length === filtered.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCatalogIds(filtered.map(p => p.id));
                } else {
                  setSelectedCatalogIds([]);
                }
              }}
              className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-950 focus:ring-0 focus:ring-offset-0 bg-transparent cursor-pointer w-4 h-4"
            />
            <label htmlFor="select-all-catalog" className="text-[10px] uppercase font-bold tracking-wider text-zinc-505 cursor-pointer select-none">
              Select All ({filtered.length})
            </label>
          </div>
          {selectedCatalogIds.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteSelectedCatalog}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 border border-solid border-red-500/20 px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Delete Selected ({selectedCatalogIds.length})
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-zinc-50 dark:bg-zinc-900/10 border border-solid border-dashed border-zinc-200 dark:border-zinc-800 p-12 rounded-xl text-center">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">No Jewellery Matches Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
            {filtered.map(prod => (
              <div key={prod.id} className="group bg-white dark:bg-[#121216] border border-solid border-zinc-200 dark:border-zinc-850 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-750 transition-colors shadow-xs">
                
                {/* Visual */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-50 dark:bg-zinc-900/20 border-b border-solid border-zinc-100 dark:border-zinc-850">
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedCatalogIds.includes(prod.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCatalogIds([...selectedCatalogIds, prod.id]);
                        } else {
                          setSelectedCatalogIds(selectedCatalogIds.filter(id => id !== prod.id));
                        }
                      }}
                      className="rounded border-zinc-300 dark:border-zinc-750 text-zinc-950 focus:ring-0 focus:ring-offset-0 bg-white dark:bg-zinc-900 cursor-pointer w-4.5 h-4.5 shadow-sm"
                    />
                  </div>
                  <img
                    src={getOptimizedImageUrl(prod.img, { width: 300 })}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    alt={prod.name || ''}
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-950/80 backdrop-blur-xs border border-solid border-zinc-800 text-[7.5px] font-black tracking-wider uppercase text-[#E6C687]">
                      {prod.carat || 'Gold'}
                    </span>
                  </div>
                </div>

                {/* Details info */}
                <div className="p-4 space-y-2 text-xs flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight block truncate" title={prod.name}>
                      {prod.name}
                    </h4>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(() => {
                        const catObj = categories.find(c => c.id === prod.category);
                        if (!catObj && !prod.category) return null;
                        return (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[8px] font-bold uppercase tracking-wider leading-none">
                            {catObj?.name || prod.category}
                          </span>
                        );
                      })()}
                      {prod.categoryType && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[#BCA057] dark:text-[#E6C687] text-[8px] font-bold uppercase tracking-wider leading-none">
                          {prod.categoryType}
                        </span>
                      )}
                      <span className="text-[9px] font-mono text-zinc-400 block">{prod.sku}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-1.5 pt-2 border-t border-solid border-zinc-100 dark:border-zinc-850">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(prod);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-705 dark:text-zinc-305 rounded-lg text-[8px] uppercase font-bold tracking-widest cursor-pointer border-none"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadProductImages(prod)}
                      className="py-1.5 px-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-705 dark:text-zinc-305 rounded-lg text-[8px] uppercase font-bold tracking-widest cursor-pointer border-none flex items-center justify-center"
                      title="Download Images"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="py-1.5 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 rounded-lg text-[8px] uppercase font-bold tracking-widest cursor-pointer border-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
