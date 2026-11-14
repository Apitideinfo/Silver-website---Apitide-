import React, { useState, useEffect } from 'react';

import { db } from '../../firebase';

import { productsApi } from '../../api/products.api';

import { ImageUploadService } from '../../services/ImageUploadService';

import { StorageService } from '../../services/StorageService';

import { INITIAL_CATEGORIES } from '../../config/constants';

import { silverStoryService, DEFAULT_SILVER_STORY_DATA } from '../../services/silverStoryService';
import { giftingHampersService, DEFAULT_GIFTING_HAMPERS } from '../../services/giftingHampersService';
import { heroBannerService, DEFAULT_HERO_BANNERS } from '../../services/heroBannerService';

import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
// Fallback images for Silver Story Showcase Preview
import colTennisWebp from '../../assets/col_tennis.webp';
import colToeRingWebp from '../../assets/col_toe_ring.webp';
import colPearlWebp from '../../assets/col_pearl.webp';
import colStoneWebp from '../../assets/col_stone.webp';
import diwaliFestiveManishAndCoWebp from '../../assets/diwali_festive_manish_and_co.webp';


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

  Layers,

  Tag,

  Coins,

  RotateCcw,

  Eye,

  EyeOff,

  Heart,

  Gift

} from 'lucide-react';

import { doc, deleteDoc } from 'firebase/firestore';

import { 

  priceCategoryService, 

  COLOR_OPTIONS, 

  getColorStyles, 

  DEFAULT_PRICE_CATEGORIES 

} from '../../services/priceCategoryService';



export default function AdminCategories({

  categories: propCategories = [],

  setAdminNotification

}) {

  // Synchronized Reactive Categories State
  const [categories, setCategories] = useState(() => {
    const cached = StorageService.get('manish_categories_store', null);
    if (Array.isArray(cached)) return cached;
    if (Array.isArray(propCategories)) return propCategories;
    const isInit = StorageService.get('manish_categories_initialized', false);
    if (!isInit) return INITIAL_CATEGORIES;
    return [];
  });

  useEffect(() => {
    if (Array.isArray(propCategories)) {
      setCategories(propCategories);
    }
  }, [propCategories]);

  useEffect(() => {
    const handleSync = () => {
      const cached = StorageService.get('manish_categories_store', null);
      if (Array.isArray(cached)) {
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



  // Sub-tab: 'categories' vs 'price-tiers'

    // ─── SILVER FOR EVERY STORY SPOTLIGHT STATE ───────────────────

  const [silverStoryData, setSilverStoryData] = useState(() => silverStoryService.getStoredStoryData());

  const [activeStoryCardIdx, setActiveStoryCardIdx] = useState(0);

  const [cardUploadProgress, setCardUploadProgress] = useState('');

  const [bannerUploadProgress, setBannerUploadProgress] = useState('');

  const [savingSilverStory, setSavingSilverStory] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);



  useEffect(() => {

    silverStoryService.fetchRemoteStoryData().then(res => {

      if (res) setSilverStoryData(res);

    });



    const handleSilverStorySync = () => {

      setSilverStoryData(silverStoryService.getStoredStoryData());

    };



    if (typeof window !== 'undefined') {

      window.addEventListener('manish_silver_story_updated', handleSilverStorySync);

    }

    return () => {

      if (typeof window !== 'undefined') {

        window.removeEventListener('manish_silver_story_updated', handleSilverStorySync);

      }

    };

  }, []);



  const handleCardImageUpload = async (e, cardIdx) => {

    const file = e.target.files?.[0];

    if (!file) return;



    setCardUploadProgress('Uploading Spotlight Photo...');

    try {

      const res = await ImageUploadService.uploadImage(file);

      setSilverStoryData(prev => {

        const newCards = [...prev.cards];

        newCards[cardIdx] = { ...newCards[cardIdx], img: res.url };

        return { ...prev, cards: newCards };

      });

      setCardUploadProgress('Uploaded successfully!');

    } catch (err) {

      console.error(err);

      setCardUploadProgress('Upload failed.');

    }

  };



  const handleBannerImageUpload = async (e) => {

    const file = e.target.files?.[0];

    if (!file) return;



    setBannerUploadProgress('Uploading Showcase Banner...');

    try {

      const res = await ImageUploadService.uploadImage(file);

      setSilverStoryData(prev => ({

        ...prev,

        banner: { ...prev.banner, img: res.url }

      }));

      setBannerUploadProgress('Uploaded successfully!');

    } catch (err) {

      console.error(err);

      setBannerUploadProgress('Upload failed.');

    }

  };



  const handleSaveSilverStory = async (e) => {
    if (e) e.preventDefault();
    setSavingSilverStory(true);
    try {
      await silverStoryService.saveStoryData(silverStoryData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({
          message: '✓ "Silver For Every Story" showcase updated live on Homepage!',
          type: 'success'
        });
      }
    } catch (err) {
      console.error(err);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: 'Saved locally, syncing to cloud...', type: 'info' });
      }
    } finally {
      setTimeout(() => {
        setSavingSilverStory(false);
      }, 350);
    }
  };



  const handleResetSilverStory = async () => {

    if (window.confirm('Reset "Silver For Every Story" section to default showcase references?')) {

      setSilverStoryData(DEFAULT_SILVER_STORY_DATA);

      await silverStoryService.saveStoryData(DEFAULT_SILVER_STORY_DATA);

      if (typeof setAdminNotification === 'function') {

        setAdminNotification({ message: '✓ Showcase reset to default reference items!', type: 'success' });

      }

    }

  };

  // ─── SILVER GIFTING HAMPERS (FESTIVE) STATE & HANDLERS ─────────────
  const [giftingHampers, setGiftingHampers] = useState(() => giftingHampersService.getStoredHampers());
  const [hamperUploadProgress, setHamperUploadProgress] = useState('');
  const [savingHampers, setSavingHampers] = useState(false);
  const [hampersSaveSuccess, setHampersSaveSuccess] = useState(false);

  useEffect(() => {
    giftingHampersService.fetchRemoteHampers().then(res => {
      if (res && res.length === 4) setGiftingHampers(res);
    });

    const handleHampersSync = () => {
      setGiftingHampers(giftingHampersService.getStoredHampers());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('manish_gifting_hampers_updated', handleHampersSync);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('manish_gifting_hampers_updated', handleHampersSync);
      }
    };
  }, []);

  const handleHamperImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHamperUploadProgress(`Uploading Hamper #${index + 1} image...`);
    try {
      const res = await ImageUploadService.uploadImage(file);
      if (res && res.url) {
        const next = [...giftingHampers];
        next[index] = { ...next[index], customImg: res.url };
        setGiftingHampers(next);
        await giftingHampersService.saveHampers(next);
        setHamperUploadProgress(`✓ Hamper #${index + 1} image uploaded and live on Homepage!`);
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({
            message: `✓ Hamper #${index + 1} image updated live on Homepage!`,
            type: 'success'
          });
        }
        setTimeout(() => setHamperUploadProgress(''), 4000);
      }
    } catch (err) {
      console.error(err);
      setHamperUploadProgress('Upload failed.');
      setTimeout(() => setHamperUploadProgress(''), 3000);
    }
  };

  const handleResetSingleHamperImage = async (idx) => {
    const next = [...giftingHampers];
    next[idx] = { ...next[idx], customImg: '' };
    setGiftingHampers(next);
    await giftingHampersService.saveHampers(next);
    if (typeof setAdminNotification === 'function') {
      setAdminNotification({ message: `✓ Hamper #${idx + 1} reset to default image!`, type: 'success' });
    }
  };

  const handleSaveHampers = async (e) => {
    if (e) e.preventDefault();
    setSavingHampers(true);
    try {
      await giftingHampersService.saveHampers(giftingHampers);
      setHampersSaveSuccess(true);
      setTimeout(() => setHampersSaveSuccess(false), 3000);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({
          message: '✓ Silver Gifting Hampers updated live on Homepage!',
          type: 'success'
        });
      }
    } catch (err) {
      console.error(err);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: 'Saved locally, syncing to cloud...', type: 'info' });
      }
    } finally {
      setTimeout(() => {
        setSavingHampers(false);
      }, 350);
    }
  };

  const handleResetHampers = async () => {
    if (window.confirm('Reset "Silver Gifting Hampers" section to default images and prices?')) {
      setGiftingHampers(DEFAULT_GIFTING_HAMPERS);
      await giftingHampersService.saveHampers(DEFAULT_GIFTING_HAMPERS);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: '✓ Hampers reset to default!', type: 'success' });
      }
    }
  };

  // ─── DYNAMIC HERO BANNERS CAROUSEL STATE ──────────────────────────
  const [heroBanners, setHeroBanners] = useState(() => heroBannerService.getStoredBanners());
  const [heroBannerUploadProgress, setHeroBannerUploadProgress] = useState('');
  const [savingHeroBanners, setSavingHeroBanners] = useState(false);
  const [heroBannersSaveSuccess, setHeroBannersSaveSuccess] = useState(false);

  useEffect(() => {
    heroBannerService.fetchRemoteBanners().then(res => {
      if (res && res.length > 0) setHeroBanners(res);
    });

    const handleHeroBannersSync = () => {
      setHeroBanners(heroBannerService.getStoredBanners());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('manish_hero_banners_updated', handleHeroBannersSync);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('manish_hero_banners_updated', handleHeroBannersSync);
      }
    };
  }, []);

  const handleHeroBannerImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHeroBannerUploadProgress(`Uploading Slide #${index + 1} banner...`);
    try {
      const res = await ImageUploadService.uploadImage(file);
      if (res && res.url) {
        const next = [...heroBanners];
        next[index] = { ...next[index], customImg: res.url };
        setHeroBanners(next);
        await heroBannerService.saveBanners(next);
        setHeroBannerUploadProgress(`✓ Slide #${index + 1} banner uploaded and live on Homepage!`);
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({
            message: `✓ Slide #${index + 1} banner updated live on Homepage!`,
            type: 'success'
          });
        }
        setTimeout(() => setHeroBannerUploadProgress(''), 4000);
      }
    } catch (err) {
      console.error(err);
      setHeroBannerUploadProgress('Upload failed.');
      setTimeout(() => setHeroBannerUploadProgress(''), 3000);
    }
  };

  const handleResetSingleHeroBannerImage = async (idx) => {
    const next = [...heroBanners];
    next[idx] = { ...next[idx], customImg: '' };
    setHeroBanners(next);
    await heroBannerService.saveBanners(next);
    if (typeof setAdminNotification === 'function') {
      setAdminNotification({ message: `✓ Slide #${idx + 1} reset to brand default image!`, type: 'success' });
    }
  };

  const handleHeroBannerFieldChange = (idx, field, val) => {
    setHeroBanners(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleAddHeroSlide = () => {
    const newSlide = {
      id: `hero-${Date.now()}`,
      title: 'New Featured Jewellery Banner',
      customImg: '',
      webp: '',
      png: '',
      alt: 'Fine Silver Jewellery - MANISH & CO',
      page: 'collections',
      category: 'Collections'
    };
    const next = [...heroBanners, newSlide];
    setHeroBanners(next);
    heroBannerService.saveBanners(next);
    if (typeof setAdminNotification === 'function') {
      setAdminNotification({ message: '✓ New slide added to carousel! Upload an image and save.', type: 'success' });
    }
  };

  const handleRemoveHeroSlide = async (idx) => {
    if (heroBanners.length <= 1) {
      alert('You must have at least 1 hero banner slide in the carousel.');
      return;
    }
    if (window.confirm(`Delete Hero Slide #${idx + 1}?`)) {
      const next = heroBanners.filter((_, i) => i !== idx);
      setHeroBanners(next);
      await heroBannerService.saveBanners(next);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: `✓ Hero Slide #${idx + 1} removed!`, type: 'success' });
      }
    }
  };

  const handleSaveHeroBanners = async (e) => {
    if (e) e.preventDefault();
    setSavingHeroBanners(true);
    try {
      await heroBannerService.saveBanners(heroBanners);
      setHeroBannersSaveSuccess(true);
      setTimeout(() => setHeroBannersSaveSuccess(false), 3000);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({
          message: '✓ Hero Banners updated live on Homepage carousel!',
          type: 'success'
        });
      }
    } catch (err) {
      console.error(err);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: 'Saved locally, syncing to cloud...', type: 'info' });
      }
    } finally {
      setTimeout(() => {
        setSavingHeroBanners(false);
      }, 350);
    }
  };

  const handleResetHeroBanners = async () => {
    if (window.confirm('Reset all Hero Carousel Banners to original brand defaults?')) {
      setHeroBanners(DEFAULT_HERO_BANNERS);
      await heroBannerService.saveBanners(DEFAULT_HERO_BANNERS);
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({ message: '✓ Hero Banners reset to default!', type: 'success' });
      }
    }
  };



  const [activeSubTab, setActiveSubTab] = useState('categories');

  const [priceTiers, setPriceTiers] = useState(() => priceCategoryService.getStoredCategories());

  

  // Price tier form state

  const [editingTierId, setEditingTierId] = useState(null);

  const [tierPrice, setTierPrice] = useState(299);

  const [tierTitle, setTierTitle] = useState('Under ₹299');

  const [tierColor, setTierColor] = useState('red');

  const [tierActive, setTierActive] = useState(true);



  // Sync price tiers when updated externally

  useEffect(() => {

    const handlePriceSync = () => {

      setPriceTiers(priceCategoryService.getStoredCategories());

    };

    if (typeof window !== 'undefined') {

      window.addEventListener('manish_price_categories_updated', handlePriceSync);

    }

    return () => {

      if (typeof window !== 'undefined') {

        window.removeEventListener('manish_price_categories_updated', handlePriceSync);

      }

    };

  }, []);



  const handleSavePriceTier = async (e) => {

    e.preventDefault();

    const priceNum = Number(tierPrice);

    if (!priceNum || priceNum <= 0) {

      if (typeof setAdminNotification === 'function') {

        setAdminNotification({ message: 'Please enter a valid price amount.', type: 'error' });

      }

      return;

    }



    let updatedList;

    if (editingTierId) {

      updatedList = priceTiers.map(t => t.id === editingTierId ? {

        ...t,

        price: priceNum,

        title: tierTitle.trim() || `Under ₹${priceNum}`,

        color: tierColor,

        active: tierActive

      } : t);

      setEditingTierId(null);

    } else {

      const newId = `tier-${priceNum}-${Date.now().toString().slice(-4)}`;

      const newTier = {

        id: newId,

        price: priceNum,

        title: tierTitle.trim() || `Under ₹${priceNum}`,

        color: tierColor,

        active: tierActive

      };

      updatedList = [...priceTiers, newTier];

    }



    // Sort ascending by price

    updatedList.sort((a, b) => a.price - b.price);

    setPriceTiers(updatedList);

    await priceCategoryService.saveCategories(updatedList);



    // Reset inputs

    setTierPrice(299);

    setTierTitle('Under ₹299');

    setTierColor('red');

    setTierActive(true);



    if (typeof setAdminNotification === 'function') {

      setAdminNotification({ 

        message: editingTierId ? '✓ Price category updated live on Homepage!' : '✓ New price category published to Homepage!', 

        type: 'success' 

      });

    }

  };



  const handleStartEditPriceTier = (tier) => {

    setEditingTierId(tier.id);

    setTierPrice(tier.price);

    setTierTitle(tier.title);

    setTierColor(tier.color || 'red');

    setTierActive(tier.active !== false);

  };



  const handleDeletePriceTier = async (id, title) => {

    if (window.confirm(`Delete price tier "${title}" from the homepage?`)) {

      const updatedList = priceTiers.filter(t => t.id !== id);

      setPriceTiers(updatedList);

      await priceCategoryService.saveCategories(updatedList);

      if (typeof setAdminNotification === 'function') {

        setAdminNotification({ message: 'Price category removed.', type: 'success' });

      }

    }

  };



  const handleTogglePriceTier = async (id) => {

    const updatedList = priceTiers.map(t => t.id === id ? { ...t, active: !t.active } : t);

    setPriceTiers(updatedList);

    await priceCategoryService.saveCategories(updatedList);

  };



  const handleResetPriceTiers = async () => {

    if (window.confirm('Reset all price categories to default recommended tiers (Under ₹199, ₹229, ₹299, ₹499, ₹799, ₹999)?')) {

      setPriceTiers(DEFAULT_PRICE_CATEGORIES);

      await priceCategoryService.saveCategories(DEFAULT_PRICE_CATEGORIES);

      if (typeof setAdminNotification === 'function') {

        setAdminNotification({ message: '✓ Reset to recommended price categories!', type: 'success' });

      }

    }

  };



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

      setCategories(prev => {
        const id = editingCategory.id || editingCategory.docId;
        const exists = (Array.isArray(prev) ? prev : []).some(c => c.id === id || c.docId === id);
        if (exists) {
          return prev.map(c => (c.id === id || c.docId === id) ? { ...c, ...updatedData } : c);
        }
        return [...(Array.isArray(prev) ? prev : []), { id, ...updatedData }];
      });



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
        const idToDelete = String(catDocId).trim();
        setCategories(prev => (Array.isArray(prev) ? prev : []).filter(c => 
          c.id !== idToDelete && c.docId !== idToDelete &&
          String(c.id || '').toLowerCase() !== idToDelete.toLowerCase() &&
          String(c.docId || '').toLowerCase() !== idToDelete.toLowerCase()
        ));
        await productsApi.deleteCategory(idToDelete);
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({ message: `Category "${catName || catDocId}" removed.`, type: 'success' });
        }
      } catch (err) {
        console.error(err);
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({ message: 'Failed to remove category.', type: 'error' });
        }
      }
    }
  };

  // Delete all categories (bulk clear)
  const handleDeleteAllCategories = async () => {
    if (window.confirm('Are you sure you want to delete ALL categories from the directory? This action cannot be undone.')) {
      try {
        setCategories([]);
        await productsApi.deleteAllCategories();
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({ message: 'All categories deleted successfully.', type: 'success' });
        }
      } catch (err) {
        console.error(err);
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({ message: 'Failed to delete all categories: ' + err.message, type: 'error' });
        }
      }
    }
  };

  // Reset to initial baseline categories
  const handleResetDefaultCategories = async () => {
    if (window.confirm('Reset categories back to initial baseline catalog?')) {
      try {
        setCategories(INITIAL_CATEGORIES);
        await productsApi.resetCategoriesToDefault();
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({ message: '✓ Restored default category catalog!', type: 'success' });
        }
      } catch (err) {
        console.error(err);
        if (typeof setAdminNotification === 'function') {
          setAdminNotification({ message: 'Failed to restore default categories.', type: 'error' });
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

      

      {/* Sub-Tab Navigation Bar - Responsive Horizontal Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-[#15151A] p-2.5 sm:p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none w-full lg:w-auto">
          {/* Tab 1: Categories */}
          <button
            type="button"
            onClick={() => setActiveSubTab('categories')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'categories'
                ? 'bg-[#15151A] text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-[#C8A646]" />
            <span>Jewellery Categories</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold">
              {categories.length}
            </span>
          </button>

          {/* Tab 2: Hero Banners */}
          <button
            type="button"
            onClick={() => setActiveSubTab('hero-banners')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'hero-banners'
                ? 'bg-[#15151A] text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Hero Banners</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold">
              Carousel
            </span>
          </button>

          {/* Tab 3: Silver Story */}
          <button
            type="button"
            onClick={() => setActiveSubTab('silver-story')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'silver-story'
                ? 'bg-[#15151A] text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Silver For Every Story</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold">
              Showcase
            </span>
          </button>

          {/* Tab 4: Gifting Hampers */}
          <button
            type="button"
            onClick={() => setActiveSubTab('gifting-hampers')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === 'gifting-hampers'
                ? 'bg-[#15151A] text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4 text-emerald-500" />
            <span>Gifting Hampers</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold">
              Festive
            </span>
          </button>
        </div>

        {/* Right Side Quick Actions / Resets */}
        <div className="flex items-center gap-2 shrink-0">
          {activeSubTab === 'hero-banners' && (
            <button
              type="button"
              onClick={handleResetHeroBanners}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Banners</span>
            </button>
          )}

          {activeSubTab === 'silver-story' && (
            <button
              type="button"
              onClick={handleResetSilverStory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Reference Showcase</span>
            </button>
          )}

          {activeSubTab === 'gifting-hampers' && (
            <button
              type="button"
              onClick={handleResetHampers}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Hampers</span>
            </button>
          )}
        </div>
      </div>



      
      {/* =========================================================
          VIEW: HERO BANNERS CAROUSEL (HOMEPAGE HERO)
          ========================================================= */}
      {activeSubTab === 'hero-banners' && (
        <div className="space-y-6">
          {/* Top Info & Action Banner */}
          <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-amber-500/10 border border-blue-500/20 rounded-2xl p-5 sm:p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">
                HOMEPAGE HERO SECTION
              </span>
              <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Hero Carousel Banners Manager
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
                Manage the sliding banners at the top of your homepage. Upload custom banners or paste image URLs. Changes update immediately across all devices and customers.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAddHeroSlide}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-500" />
                <span>Add Slide</span>
              </button>

              <button
                type="button"
                onClick={handleSaveHeroBanners}
                disabled={savingHeroBanners}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0D2B4E] hover:bg-[#143B66] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {savingHeroBanners ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C8A646]" />
                    <span>Saving...</span>
                  </>
                ) : heroBannersSaveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Saved Live!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C8A646]" />
                    <span>Save Banners Live</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hero Slides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {heroBanners.map((slide, index) => {
              const currentImg = slide.customImg || slide.png || slide.webp;
              const isCustom = Boolean(slide.customImg);

              return (
                <div
                  key={slide.id || index}
                  className="bg-white dark:bg-[#15151A] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 text-left transition-all hover:border-blue-500/30"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          SLIDE #{index + 1}
                        </span>
                        {isCustom ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                            Custom Image
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            Brand Default
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleResetSingleHeroBannerImage(index)}
                            className="p-1.5 text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            title="Reset to brand default banner"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {heroBanners.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveHeroSlide(index)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete this slide"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Preview Container (aspect-[2200/715]) */}
                    <div className="relative aspect-[2200/715] w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-4 group">
                      {currentImg ? (
                        <img
                          src={currentImg}
                          alt={slide.title || `Hero Slide ${index + 1}`}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                          No Image Uploaded
                        </div>
                      )}

                      {/* Overlay upload button */}
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer text-white">
                        <ImageIcon className="w-6 h-6 text-white drop-shadow" />
                        <span className="text-xs font-bold drop-shadow">Click to Upload Banner Image</span>
                        <span className="text-[10px] text-zinc-300">Recommended: 2200 x 715 px</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleHeroBannerImageUpload(e, index)}
                        />
                      </label>
                    </div>

                    {/* Slide Fields */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                          Slide Title / Headline
                        </label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => handleHeroBannerFieldChange(index, 'title', e.target.value)}
                          placeholder="e.g. Timeless Silver Jewellery Collection"
                          className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0D2B4E]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                            Destination Page
                          </label>
                          <input
                            type="text"
                            value={slide.page || ''}
                            onChange={(e) => handleHeroBannerFieldChange(index, 'page', e.target.value)}
                            placeholder="e.g. collections"
                            className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0D2B4E]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                            Category Filter
                          </label>
                          <input
                            type="text"
                            value={slide.category || ''}
                            onChange={(e) => handleHeroBannerFieldChange(index, 'category', e.target.value)}
                            placeholder="e.g. Collections or earrings"
                            className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0D2B4E]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                          Direct Banner Image URL (or use file upload above)
                        </label>
                        <input
                          type="text"
                          value={slide.customImg || ''}
                          onChange={(e) => handleHeroBannerFieldChange(index, 'customImg', e.target.value)}
                          placeholder="https://... or paste image link"
                          className="w-full px-3 py-1.5 text-[11px] font-mono rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-[#0D2B4E]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {heroBannerUploadProgress && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold text-center">
              {heroBannerUploadProgress}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
        VIEW: SILVER FOR EVERY STORY SPOTLIGHT & FESTIVE BANNER
        ========================================================= */}
      {activeSubTab === 'silver-story' && (
        <div className="space-y-6">
          
          {/* Top Info & Action Banner */}
          <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 border border-rose-500/20 rounded-2xl p-5 sm:p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                "Silver For Every Story" Spotlight &amp; Banner Management
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                Yaha se aap Homepage ke 4 Spotlight Cards (Tennis, Toe Ring, Pearl, Stone) aur right-side wale Diwali Festive Offer Banner ki photo, title, tagline aur link live update kar sakte hain.
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleSaveSilverStory}
              disabled={savingSilverStory}
              className="px-6 py-3 bg-[#15151A] hover:bg-black text-white dark:bg-white dark:text-zinc-900 font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Published Live!</span>
                </>
              ) : savingSilverStory ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C8A646]" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#C8A646]" />
                  <span>Save &amp; Publish Live</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: 4 Spotlight Cards Editor (7 Cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs">
              
              <div className="border-b border-zinc-100 dark:border-zinc-850 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-[#E6C687] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C8A646]" />
                    4 Spotlight Cards (2x2 Grid)
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-semibold">
                    Select a card below to edit its photo, headline and linked collection.
                  </span>
                </div>
              </div>

              {/* Sub-Tabs for the 4 Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(silverStoryData?.cards || []).map((card, idx) => {
                  const isSelected = activeStoryCardIdx === idx;
                  const fallbackImg = [colTennisWebp, colToeRingWebp, colPearlWebp, colStoneWebp][idx] || colTennisWebp;
                  return (
                    <button
                      key={card.id || idx}
                      type="button"
                      onClick={() => setActiveStoryCardIdx(idx)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-zinc-900 dark:border-white ring-2 ring-zinc-900/10 bg-zinc-50 dark:bg-zinc-800/80 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        <img 
                          src={card.img || fallbackImg} 
                          alt={card.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-zinc-400 block uppercase tracking-wider">
                          Card 0{idx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                          {card.title?.replace(' COLLECTION', '') || `Card ${idx + 1}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Card Edit Form */}
              {(() => {
                const currentCard = silverStoryData?.cards?.[activeStoryCardIdx] || {};
                const fallbackImg = [colTennisWebp, colToeRingWebp, colPearlWebp, colStoneWebp][activeStoryCardIdx] || colTennisWebp;

                return (
                  <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-850">
                    
                    {/* Title & Tagline Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                          Collection Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={currentCard.title || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSilverStoryData(prev => {
                              const newCards = [...prev.cards];
                              newCards[activeStoryCardIdx] = { ...newCards[activeStoryCardIdx], title: val };
                              return { ...prev, cards: newCards };
                            });
                          }}
                          placeholder="e.g. TENNIS COLLECTION"
                          className="w-full h-10 px-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                          Tagline / Subtext
                        </label>
                        <input
                          type="text"
                          value={currentCard.tagline || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSilverStoryData(prev => {
                              const newCards = [...prev.cards];
                              newCards[activeStoryCardIdx] = { ...newCards[activeStoryCardIdx], tagline: val };
                              return { ...prev, cards: newCards };
                            });
                          }}
                          placeholder="e.g. ♥ Sparkle on repeat ♥"
                          className="w-full h-10 px-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900"
                        />
                      </div>
                    </div>

                    {/* Linked Category Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                        Target Category Link (Clicking navigates to)
                      </label>
                      <select
                        value={currentCard.tab || 'bracelets'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSilverStoryData(prev => {
                            const newCards = [...prev.cards];
                            newCards[activeStoryCardIdx] = { ...newCards[activeStoryCardIdx], tab: val };
                            return { ...prev, cards: newCards };
                          });
                        }}
                        className="w-full h-10 px-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-900 cursor-pointer"
                      >
                        <option value="bracelets">Bracelets &amp; Kadas</option>
                        <option value="rings">Rings</option>
                        <option value="earring">Earrings</option>
                        <option value="necklaces">Necklaces &amp; Chokers</option>
                        <option value="payal">Toe Rings &amp; Anklets / Payals</option>
                        <option value="pendant">Pendants &amp; Lockets</option>
                        <option value="mangalsutra">Mangalsutras</option>
                        <option value="stone-bracelets">Stone Bracelets</option>
                        <option value="Collections">All Collections</option>
                      </select>
                    </div>

                    {/* Image Upload & URL */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                        Spotlight Image Upload
                      </label>
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 text-xs font-bold rounded-xl cursor-pointer transition-colors shrink-0">
                          <ImageIcon className="w-4 h-4 text-[#C8A646]" />
                          <span>Choose New Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCardImageUpload(e, activeStoryCardIdx)}
                            className="hidden"
                          />
                        </label>

                        <input
                          type="url"
                          placeholder="Or paste direct image URL (https://...)"
                          value={currentCard.img || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSilverStoryData(prev => {
                              const newCards = [...prev.cards];
                              newCards[activeStoryCardIdx] = { ...newCards[activeStoryCardIdx], img: val };
                              return { ...prev, cards: newCards };
                            });
                          }}
                          className="flex-1 h-10 px-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-mono focus:outline-none focus:border-zinc-900"
                        />
                      </div>

                      {cardUploadProgress && (
                        <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                          {cardUploadProgress}
                        </p>
                      )}
                    </div>

                    {/* Live Preview Box */}
                    <div className="pt-2">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block mb-2">
                        Live Homepage Card Preview
                      </span>
                      <div className="max-w-[200px] p-3 rounded-2xl bg-white border border-[#E6DFD3] shadow-xs text-center mx-auto sm:mx-0">
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                          <img 
                            src={currentCard.img || fallbackImg} 
                            alt={currentCard.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="mt-2">
                          <span className="font-sans text-[11px] font-bold text-[#0D2B4E] uppercase tracking-wide block truncate">
                            {currentCard.title || 'COLLECTION TITLE'}
                          </span>
                          <span className="font-sans text-[9px] text-[#8C6D46] font-medium block truncate mt-0.5">
                            {currentCard.tagline || '♥ Tagline ♥'}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })()}

            </div>

            {/* RIGHT COLUMN: Right Diwali Festive Offer Banner (5 Cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
              
              <div className="border-b border-zinc-100 dark:border-zinc-850 pb-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-[#E6C687] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C8A646]" />
                  Right Festive Showcase Banner
                </h4>
                <span className="text-[10px] text-zinc-400 font-semibold">
                  Large square offer banner displayed on the right of the 4 cards.
                </span>
              </div>

              {/* Banner Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                  Banner Alt / Title Description
                </label>
                <input
                  type="text"
                  value={silverStoryData?.banner?.title || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSilverStoryData(prev => ({
                      ...prev,
                      banner: { ...prev.banner, title: val }
                    }));
                  }}
                  placeholder="e.g. Diwali Festive Season - Flat 15% Off On All Products"
                  className="w-full h-10 px-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900"
                />
              </div>

              {/* Banner Target Tab */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                  Banner Target Category
                </label>
                <select
                  value={silverStoryData?.banner?.tab || 'Collections'}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSilverStoryData(prev => ({
                      ...prev,
                      banner: { ...prev.banner, tab: val }
                    }));
                  }}
                  className="w-full h-10 px-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-900 cursor-pointer"
                >
                  <option value="Collections">All Collections (Default)</option>
                  <option value="bracelets">Bracelets &amp; Kadas</option>
                  <option value="rings">Rings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="earring">Earrings</option>
                </select>
              </div>

              {/* Banner Image Upload & URL */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                  Banner Image
                </label>

                <div className="flex flex-col gap-2.5">
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                    <ImageIcon className="w-4 h-4 text-[#C8A646]" />
                    <span>Upload New Banner Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerImageUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Or paste direct image URL (https://...)"
                    value={silverStoryData?.banner?.img || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSilverStoryData(prev => ({
                        ...prev,
                        banner: { ...prev.banner, img: val }
                      }));
                    }}
                    className="w-full h-10 px-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-mono focus:outline-none focus:border-zinc-900"
                  />
                </div>

                {bannerUploadProgress && (
                  <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                    {bannerUploadProgress}
                  </p>
                )}
              </div>

              {/* Banner Live Preview */}
              <div className="pt-2">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block mb-2">
                  Banner Live Preview
                </span>
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
                  <img
                    src={silverStoryData?.banner?.img || diwaliFestiveManishAndCoWebp}
                    alt={silverStoryData?.banner?.title || 'Festive Offer Banner'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bottom Quick Save */}
              <button
                type="button"
                onClick={handleSaveSilverStory}
                disabled={savingSilverStory}
                className="w-full py-3.5 bg-[#785B3C] hover:bg-[#8F6D48] active:scale-98 text-white font-sans text-xs font-bold uppercase tracking-[0.18em] rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {savingSilverStory ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save &amp; Publish Live</span>
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================
          VIEW: SILVER GIFTING HAMPERS (FESTIVE CELEBRATIONS)
          ========================================================= */}
      {activeSubTab === 'gifting-hampers' && (
        <div className="space-y-6">
          {/* Top Info & Action Banner */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-1">
                FESTIVE CELEBRATIONS
              </span>
              <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-500" />
                Silver Gifting Hampers Manager
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
                Update the 4 Festive Gift Pick cards (Under ₹1499, Under ₹1999, Under ₹2999, Premium Gifts) displayed on your Homepage. Upload custom images or customize landing links.
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleSaveHampers}
              disabled={savingHampers}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D2B4E] hover:bg-[#081B32] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {savingHampers ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#E6DFD3]" />
                  <span>Saving Live...</span>
                </>
              ) : hampersSaveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved Live to Website!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E6DFD3]" />
                  <span>Save Hampers Live</span>
                </>
              )}
            </button>
          </div>

          {/* 4 Hampers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftingHampers.map((hamper, idx) => {
              const activeImg = hamper.customImg || hamper.imgWebp || hamper.imgPng;
              return (
                <div 
                  key={hamper.id || idx}
                  className="bg-white dark:bg-[#15151A] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col space-y-4 shadow-xs hover:border-[#0D2B4E]/50 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Tier #{idx + 1}
                    </span>
                    {hamper.customImg ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Custom Image
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Default Image
                      </span>
                    )}
                  </div>

                  {/* Square Image Preview */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 border border-zinc-200 dark:border-zinc-700">
                    <img
                      src={activeImg}
                      alt={hamper.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Upload Actions */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                      Upload New Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleHamperImageUpload(e, idx)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      />
                      <div className="w-full py-2.5 px-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-center transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <ImageIcon className="w-4 h-4 text-zinc-500" />
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                          Choose File...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Or Custom URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Or Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={hamper.customImg || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGiftingHampers(prev => {
                          const next = [...prev];
                          next[idx] = { ...next[idx], customImg: val };
                          return next;
                        });
                      }}
                      onBlur={async () => {
                        await giftingHampersService.saveHampers(giftingHampers);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0D2B4E]"
                    />
                  </div>

                  {/* Clear Custom Image */}
                  {hamper.customImg && (
                    <button
                      type="button"
                      onClick={() => handleResetSingleHamperImage(idx)}
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 text-left cursor-pointer transition-colors"
                    >
                      ✕ Reset to Default Image
                    </button>
                  )}

                  {/* Title & Link */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={hamper.title || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGiftingHampers(prev => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], title: val };
                            return next;
                          });
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0D2B4E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        Link Path
                      </label>
                      <input
                        type="text"
                        value={hamper.path || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGiftingHampers(prev => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], path: val };
                            return next;
                          });
                        }}
                        className="w-full px-3 py-1.5 text-[11px] font-mono rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-[#0D2B4E]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hamperUploadProgress && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold text-center">
              {hamperUploadProgress}
            </div>
          )}
        </div>
      )}

{/* =========================================================

        VIEW 2: EXISTING JEWELLERY CATEGORIES

        ========================================================= */}

      {activeSubTab === 'categories' && (

      <>

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

          <div className="flex flex-wrap items-center gap-2">
            {categories.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteAllCategories}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all cursor-pointer"
                title="Delete all categories from directory"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetDefaultCategories}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all cursor-pointer"
              title="Restore default sample categories"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C8A646]" />
              <span>Reset Defaults</span>
            </button>

            <div className="relative w-full sm:w-56">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 sm:col-span-3 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-zinc-50/50 dark:bg-zinc-900/30">
              <p className="text-xs font-semibold text-zinc-500 mb-2">
                {categories.length === 0 ? 'No categories in directory. All categories have been deleted.' : 'No matching categories found.'}
              </p>
              {categories.length === 0 && (
                <button
                  type="button"
                  onClick={handleResetDefaultCategories}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C8A646] hover:bg-[#b09038] text-white shadow-xs transition-all cursor-pointer mt-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Default Categories</span>
                </button>
              )}
            </div>
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

      </>

      )}



    </div>

  );

}

