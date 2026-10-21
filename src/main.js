// ==========================================================================
// MANISH & CO – Fine Silver Jewellery
// Main Client Application Controller
// ==========================================================================

import { store } from './data/store.js';
import { CATEGORIES_META, TESTIMONIALS_DATA, COUPONS_DATA } from './data/products.js';

// --- APPLICATION STATE ---
let currentCategory = 'all';
let currentSort = 'featured';
let activeFilters = {
  priceMax: 35000,
  finishes: ['925 Sterling', 'Oxidised 925', '18K Gold Vermeil', 'Rose Gold 925'],
  occasions: [],
  inStockOnly: false,
  searchQuery: ''
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  renderCategories();
  renderProducts();
  renderTestimonials();
  renderSocialGrid();
  initCustomStudio();
  initCartDrawer();
  initWishlistDrawer();
  initCheckout();
  initTracking();
  initAuth();
  initAdminPortal();
  initSizeAndHallmarkGuides();
  updateLiveSilverRatesUI();
  updateHeaderCounts();

  // Listen to store updates
  window.addEventListener('mco:statechange', handleStateChange);
});

// --- STATE CHANGE DISPATCHER ---
function handleStateChange(e) {
  const { type } = e.detail;
  updateHeaderCounts();

  if (type.startsWith('cart:')) {
    renderCartDrawer();
  }
  if (type.startsWith('wishlist:')) {
    renderWishlistDrawer();
    updateWishlistCardIcons();
  }
  if (type.startsWith('products:')) {
    renderProducts();
    if (document.getElementById('adminPortalBackdrop').classList.contains('open')) {
      renderAdminProducts();
      renderAdminOverview();
    }
  }
  if (type.startsWith('orders:')) {
    if (document.getElementById('adminPortalBackdrop').classList.contains('open')) {
      renderAdminOrders();
      renderAdminOverview();
    }
  }
  if (type.startsWith('custom:')) {
    if (document.getElementById('adminPortalBackdrop').classList.contains('open')) {
      renderAdminCustomLeads();
      renderAdminOverview();
    }
  }
  if (type.startsWith('rates:')) {
    updateLiveSilverRatesUI();
  }
  if (type.startsWith('user:')) {
    updateUserAuthUI();
  }
}

// --- TOAST NOTIFICATIONS ---
export function showToast(message, icon = 'fa-circle-check') {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast) return;

  toastMsg.textContent = message;
  toastIcon.innerHTML = `<i class="fa-solid ${icon}"></i>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// --- HEADER & NAVIGATION ---
function initHeader() {
  const header = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const searchToggleBtn = document.getElementById('searchToggleBtn');
  const quickSearchDropdown = document.getElementById('quickSearchDropdown');
  const quickSearchInput = document.getElementById('quickSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const collectionsNavItem = document.getElementById('collectionsNavItem');
  const collectionsMenuTrigger = document.getElementById('collectionsMenuTrigger');
  const navRateTickerLink = document.getElementById('navRateTickerLink');

  // Sticky header shadow + Scroll-down hide-up logo animation
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Sticky header shadow
        if (currentScrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        // Scroll-down hide logo animation (and scroll-up reveal)
        if (currentScrollY > 50) {
          if (currentScrollY > lastScrollY && (currentScrollY - lastScrollY > 4)) {
            // Scrolling down -> hide logo smoothly upwards
            header.classList.add('logo-hidden');
          } else if (lastScrollY - currentScrollY > 6) {
            // Scrolling up -> smoothly slide logo back down
            header.classList.remove('logo-hidden');
          }
        } else {
          // At top of page -> logo is always visible
          header.classList.remove('logo-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Collections Dropdown Toggle on Mobile / Touch
  if (collectionsMenuTrigger && collectionsNavItem) {
    collectionsMenuTrigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 1100 || e.pointerType === 'touch') {
        e.preventDefault();
        collectionsNavItem.classList.toggle('open');
      }
    });
  }

  // Close collections dropdown on outside click
  document.addEventListener('click', (e) => {
    if (collectionsNavItem && !collectionsNavItem.contains(e.target)) {
      collectionsNavItem.classList.remove('open');
    }
  });

  // Handle click on Collections Dropdown cards & view all
  document.querySelectorAll('.dropdown-cat-card, .dropdown-view-all').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = card.getAttribute('data-category');
      if (cat) {
        filterCatalogueByCategory(cat);
      }
      if (collectionsNavItem) {
        collectionsNavItem.classList.remove('open');
      }
      const catSection = document.getElementById('catalogue');
      if (catSection) {
        catSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Live Rate Nav Link
  if (navRateTickerLink) {
    navRateTickerLink.addEventListener('click', (e) => {
      e.preventDefault();
      const pill = document.getElementById('silverRatePill');
      if (pill) {
        pill.scrollIntoView({ behavior: 'smooth', block: 'center' });
        pill.classList.add('highlight-pulse');
        setTimeout(() => pill.classList.remove('highlight-pulse'), 2500);
      }
    });
  }

  // Mobile menu open / close
  mobileMenuBtn.addEventListener('click', () => {
    mobileNavDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
  });

  const closeMobileNav = () => {
    mobileNavDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
  };

  mobileDrawerClose.addEventListener('click', closeMobileNav);
  drawerOverlay.addEventListener('click', closeMobileNav);

  // Mobile category links
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const cat = link.getAttribute('data-category');
      if (cat) {
        filterCatalogueByCategory(cat);
      }
      closeMobileNav();
    });
  });

  // Desktop nav links category filter
  document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const cat = link.getAttribute('data-category');
      if (cat) {
        e.preventDefault();
        document.querySelectorAll('.desktop-nav .nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        filterCatalogueByCategory(cat);
        document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Quick search toggle
  searchToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    quickSearchDropdown.classList.toggle('open');
    if (quickSearchDropdown.classList.contains('open')) {
      quickSearchInput.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!quickSearchDropdown.contains(e.target) && !searchToggleBtn.contains(e.target)) {
      quickSearchDropdown.classList.remove('open');
    }
  });

  quickSearchInput.addEventListener('input', (e) => {
    handleSearchAutocomplete(e.target.value);
  });

  clearSearchBtn.addEventListener('click', () => {
    quickSearchInput.value = '';
    handleSearchAutocomplete('');
    activeFilters.searchQuery = '';
    renderProducts();
  });
}

// --- SEARCH AUTOCOMPLETE ---
function handleSearchAutocomplete(query) {
  const preview = document.getElementById('searchResultsPreview');
  const q = (query || '').trim().toLowerCase();

  if (!q) {
    preview.innerHTML = '';
    activeFilters.searchQuery = '';
    renderProducts();
    return;
  }

  activeFilters.searchQuery = q;
  renderProducts();

  const products = store.getProducts();
  const matches = products.filter(p => 
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.subCategory.toLowerCase().includes(q) ||
    p.purity.toLowerCase().includes(q)
  ).slice(0, 5);

  if (matches.length === 0) {
    preview.innerHTML = `<div style="padding: 0.75rem; font-size: 0.8rem; color: #64748B;">No matches found for "${query}"</div>`;
    return;
  }

  preview.innerHTML = matches.map(p => `
    <div class="search-result-item" onclick="window.openProductDetailModal('${p.id}')">
      <img src="${p.image}" alt="${p.title}">
      <div class="search-result-details">
        <h5>${p.title}</h5>
        <div class="price">₹${p.price.toLocaleString('en-IN')} <span style="font-size: 0.7rem; color: #64748B; font-weight: normal;">• ${p.weight}g 925 Silver</span></div>
      </div>
    </div>
  `).join('');
}

// --- LIVE SILVER RATES UI ---
function updateLiveSilverRatesUI() {
  const rates = store.getRates();
  const silverRateText = document.getElementById('liveSilverRateText');
  if (silverRateText) {
    silverRateText.textContent = `₹${rates.rate925.toFixed(2)}/g`;
  }
  const admin925 = document.getElementById('adminSilverRate925');
  const admin24k = document.getElementById('adminSilverRate24K');
  if (admin925) admin925.value = rates.rate925;
  if (admin24k) admin24k.value = rates.rate24k;
}

// --- HEADER COUNTS & USER GREETING ---
function updateHeaderCounts() {
  const cartCalcs = store.getCartCalculations();
  const wishlist = store.getWishlist();
  const user = store.getUser();

  const cartBadge = document.getElementById('cartCount');
  const wishlistBadge = document.getElementById('wishlistCount');
  const userGreeting = document.getElementById('userGreeting');

  if (cartBadge) cartBadge.textContent = cartCalcs.totalQty;
  if (wishlistBadge) wishlistBadge.textContent = wishlist.length;

  if (userGreeting) {
    if (user && user.name) {
      userGreeting.textContent = user.name.split(' ')[0];
    } else {
      userGreeting.textContent = "Sign In";
    }
  }
}

// --- CATEGORIES RENDERING ---
function renderCategories() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES_META.map(cat => `
    <div class="category-card" onclick="window.filterCatalogueByCategory('${cat.slug}')">
      <img src="${cat.image}" alt="${cat.title}" loading="lazy">
      <div class="category-card-overlay">
        <span class="category-card-count">${cat.itemCount}</span>
        <h3 class="category-card-title">${cat.title}</h3>
        <span class="category-card-cta">Explore 925 Silver <i class="fa-solid fa-arrow-right"></i></span>
      </div>
    </div>
  `).join('');
}

// Global filter helper for category clicks
window.filterCatalogueByCategory = function(categorySlug) {
  currentCategory = categorySlug;

  // Sync category filter pills
  document.querySelectorAll('#categoryFilterPills .pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === categorySlug);
  });

  // Sync desktop nav & dropdown cards
  document.querySelectorAll('.desktop-nav .nav-link, .dropdown-cat-card').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-category') === categorySlug);
  });

  renderProducts();

  // Scroll to catalogue
  const catSection = document.getElementById('catalogue');
  if (catSection) {
    catSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// --- PRODUCT CATALOGUE & FILTERING ENGINE ---
function renderProducts() {
  const grid = document.getElementById('productGrid');
  const totalCountEl = document.getElementById('totalProductCount');
  const noResults = document.getElementById('noResultsState');
  const activeChips = document.getElementById('activeFilterChips');

  if (!grid) return;

  let products = store.getProducts();

  // 1. Category Filter
  if (currentCategory && currentCategory !== 'all') {
    if (currentCategory === 'Bestseller') {
      products = products.filter(p => p.isBestseller);
    } else if (currentCategory === 'New') {
      products = products.filter(p => p.isNew);
    } else if (currentCategory === 'Custom') {
      // scroll to custom
      document.getElementById('custom-jewellery').scrollIntoView({ behavior: 'smooth' });
      return;
    } else {
      products = products.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
    }
  }

  // 2. Search Query Filter
  if (activeFilters.searchQuery) {
    const q = activeFilters.searchQuery;
    products = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q) ||
      (p.gemstone && p.gemstone.toLowerCase().includes(q))
    );
  }

  // 3. Price Filter
  if (activeFilters.priceMax) {
    products = products.filter(p => p.price <= activeFilters.priceMax);
  }

  // 4. Finish Filter
  if (activeFilters.finishes && activeFilters.finishes.length > 0) {
    products = products.filter(p => activeFilters.finishes.includes(p.finish));
  }

  // 5. Occasion Filter
  if (activeFilters.occasions && activeFilters.occasions.length > 0) {
    products = products.filter(p => activeFilters.occasions.includes(p.occasion));
  }

  // 6. Ready to Ship only
  if (activeFilters.inStockOnly) {
    products = products.filter(p => p.stock > 0);
  }

  // 7. Sorting
  products.sort((a, b) => {
    if (currentSort === 'price-asc') return a.price - b.price;
    if (currentSort === 'price-desc') return b.price - a.price;
    if (currentSort === 'rating-desc') return b.rating - a.rating;
    if (currentSort === 'weight-desc') return b.weight - a.weight;
    if (currentSort === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0; // featured / default
  });

  if (totalCountEl) totalCountEl.textContent = products.length;

  // Active Filter Chips
  renderFilterChips(activeChips);

  if (products.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  grid.innerHTML = products.map(prod => {
    const isWish = store.isInWishlist(prod.id);
    const savePercent = Math.round(((prod.mrp - prod.price) / prod.mrp) * 100);

    return `
      <article class="product-card" id="card-${prod.id}">
        <!-- Media -->
        <div class="prod-media-wrapper" onclick="window.openProductDetailModal('${prod.id}')">
          <img src="${prod.image}" alt="${prod.title}" class="prod-img-primary" loading="lazy">
          ${prod.gallery && prod.gallery[1] ? `<img src="${prod.gallery[1]}" alt="${prod.title} angle" class="prod-img-hover" loading="lazy">` : ''}
          
          <!-- Badges -->
          <div class="prod-badges">
            <span class="badge badge-hallmark">✦ 925 Hallmark</span>
            ${prod.isBestseller ? `<span class="badge badge-bestseller">Bestseller</span>` : ''}
            ${savePercent > 0 ? `<span class="badge badge-discount">${savePercent}% Off</span>` : ''}
          </div>

          <!-- Wishlist Heart -->
          <button class="prod-wishlist-btn ${isWish ? 'active' : ''}" 
                  onclick="event.stopPropagation(); window.toggleProductWishlist('${prod.id}')"
                  title="${isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}">
            <i class="fa-${isWish ? 'solid' : 'regular'} fa-heart"></i>
          </button>

          <!-- Quick View Trigger -->
          <button class="prod-quick-view-btn" onclick="event.stopPropagation(); window.openProductDetailModal('${prod.id}')">
            <i class="fa-solid fa-eye"></i> Quick View
          </button>
        </div>

        <!-- Product Content -->
        <div class="prod-content">
          <div class="prod-meta-row">
            <span class="prod-category">${prod.category}</span>
            <span class="prod-weight-tag"><i class="fa-solid fa-scale-balanced"></i> ${prod.weight}g</span>
          </div>

          <h3 class="prod-title" onclick="window.openProductDetailModal('${prod.id}')">${prod.title}</h3>

          <div class="prod-rating">
            <span class="stars"><i class="fa-solid fa-star"></i> ${prod.rating}</span>
            <span class="review-count">(${prod.reviewsCount} reviews)</span>
          </div>

          <div class="prod-price-box">
            <span class="prod-price">₹${prod.price.toLocaleString('en-IN')}</span>
            <span class="prod-mrp">₹${prod.mrp.toLocaleString('en-IN')}</span>
            <span class="prod-save-tag">Save ₹${(prod.mrp - prod.price).toLocaleString('en-IN')}</span>
          </div>

          <div class="prod-actions">
            <button class="add-to-cart-btn" onclick="window.quickAddToCart('${prod.id}')">
              <i class="fa-solid fa-bag-shopping"></i> Add to Bag
            </button>
            <button class="buy-now-btn" onclick="window.quickBuyNow('${prod.id}')">
              Buy Now
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Render active filter tags
function renderFilterChips(container) {
  if (!container) return;
  const chips = [];

  if (currentCategory && currentCategory !== 'all') {
    chips.push({ label: `Category: ${currentCategory}`, onRemove: () => filterCatalogueByCategory('all') });
  }
  if (activeFilters.priceMax < 35000) {
    chips.push({ label: `Under ₹${activeFilters.priceMax.toLocaleString('en-IN')}`, onRemove: () => {
      activeFilters.priceMax = 35000;
      document.getElementById('priceRangeInput').value = 35000;
      document.getElementById('priceMaxDisplay').textContent = '35,000';
      renderProducts();
    }});
  }
  if (activeFilters.inStockOnly) {
    chips.push({ label: 'In Stock Only', onRemove: () => {
      activeFilters.inStockOnly = false;
      document.getElementById('inStockOnlyCheckbox').checked = false;
      renderProducts();
    }});
  }

  container.innerHTML = chips.map((c, idx) => `
    <span class="filter-chip">
      ${c.label}
      <button onclick="window.removeFilterChip(${idx})"><i class="fa-solid fa-xmark"></i></button>
    </span>
  `).join('');

  window._activeChipHandlers = chips.map(c => c.onRemove);
}

window.removeFilterChip = function(idx) {
  if (window._activeChipHandlers && window._activeChipHandlers[idx]) {
    window._activeChipHandlers[idx]();
  }
};

// Filter pills listener
document.querySelectorAll('#categoryFilterPills .pill-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    filterCatalogueByCategory(filter);
  });
});

// Sort select listener
const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProducts();
  });
}

// Columns view toggle (3 vs 4)
document.querySelectorAll('#viewToggle .view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#viewToggle .view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cols = btn.getAttribute('data-cols');
    const grid = document.getElementById('productGrid');
    if (grid) grid.setAttribute('data-columns', cols);
  });
});

// Sidebar price slider
const priceRangeInput = document.getElementById('priceRangeInput');
const priceMaxDisplay = document.getElementById('priceMaxDisplay');
if (priceRangeInput) {
  priceRangeInput.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    activeFilters.priceMax = val;
    priceMaxDisplay.textContent = val.toLocaleString('en-IN');
    renderProducts();
  });
}

// Sidebar finish checkboxes
document.querySelectorAll('input[name="finishFilter"]').forEach(cb => {
  cb.addEventListener('change', () => {
    const selected = Array.from(document.querySelectorAll('input[name="finishFilter"]:checked')).map(el => el.value);
    activeFilters.finishes = selected;
    renderProducts();
  });
});

// Sidebar occasion checkboxes
document.querySelectorAll('input[name="occasionFilter"]').forEach(cb => {
  cb.addEventListener('change', () => {
    const selected = Array.from(document.querySelectorAll('input[name="occasionFilter"]:checked')).map(el => el.value);
    activeFilters.occasions = selected;
    renderProducts();
  });
});

// In-stock checkbox
const inStockOnlyCheckbox = document.getElementById('inStockOnlyCheckbox');
if (inStockOnlyCheckbox) {
  inStockOnlyCheckbox.addEventListener('change', (e) => {
    activeFilters.inStockOnly = e.target.checked;
    renderProducts();
  });
}

// Reset filters button
const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');
const resetFiltersCta = document.getElementById('resetFiltersCta');
const resetAllFilters = () => {
  currentCategory = 'all';
  activeFilters.priceMax = 35000;
  activeFilters.finishes = ['925 Sterling', 'Oxidised 925', '18K Gold Vermeil', 'Rose Gold 925'];
  activeFilters.occasions = [];
  activeFilters.inStockOnly = false;
  activeFilters.searchQuery = '';

  if (priceRangeInput) priceRangeInput.value = 35000;
  if (priceMaxDisplay) priceMaxDisplay.textContent = '35,000';
  document.querySelectorAll('input[name="finishFilter"]').forEach(cb => cb.checked = true);
  document.querySelectorAll('input[name="occasionFilter"]').forEach(cb => cb.checked = false);
  if (inStockOnlyCheckbox) inStockOnlyCheckbox.checked = false;

  document.querySelectorAll('#categoryFilterPills .pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
  });

  renderProducts();
};

if (clearAllFiltersBtn) clearAllFiltersBtn.addEventListener('click', resetAllFilters);
if (resetFiltersCta) resetFiltersCta.addEventListener('click', resetAllFilters);

// --- WISHLIST ACTIONS ---
window.toggleProductWishlist = function(id) {
  const isAdded = store.toggleWishlist(id);
  const prod = store.getProductById(id);
  const name = prod ? prod.title : 'Item';

  if (isAdded) {
    showToast(`Added "${name}" to Wishlist`, 'fa-heart');
  } else {
    showToast(`Removed from Wishlist`, 'fa-heart-crack');
  }
};

function updateWishlistCardIcons() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.id.replace('card-', '');
    const isWish = store.isInWishlist(id);
    const btn = card.querySelector('.prod-wishlist-btn');
    if (btn) {
      btn.classList.toggle('active', isWish);
      btn.innerHTML = `<i class="fa-${isWish ? 'solid' : 'regular'} fa-heart"></i>`;
    }
  });
}

// --- QUICK CART ACTIONS ---
window.quickAddToCart = function(id) {
  const prod = store.getProductById(id);
  if (!prod) return;
  store.addToCart(prod, 1, "Standard");
  showToast(`Added "${prod.title}" to Bag!`, 'fa-bag-shopping');
  openCartDrawer();
};

window.quickBuyNow = function(id) {
  const prod = store.getProductById(id);
  if (!prod) return;
  store.addToCart(prod, 1, "Standard");
  openCheckoutModal();
};

// --- PRODUCT DETAIL MODAL (PDP) ---
window.openProductDetailModal = function(id) {
  const prod = store.getProductById(id);
  if (!prod) return;

  const modalBackdrop = document.getElementById('productDetailModalBackdrop');
  const body = document.getElementById('productModalBody');

  const savePercent = Math.round(((prod.mrp - prod.price) / prod.mrp) * 100);

  body.innerHTML = `
    <div class="pdp-grid">
      <!-- Media Gallery -->
      <div class="pdp-gallery">
        <div class="pdp-main-image">
          <img src="${prod.image}" id="pdpActiveImage" alt="${prod.title}">
        </div>
        <div class="pdp-thumbnails">
          ${(prod.gallery || [prod.image]).map((img, i) => `
            <div class="pdp-thumb ${i === 0 ? 'active' : ''}" onclick="window.changePdpImage('${img}', this)">
              <img src="${img}" alt="${prod.title} thumbnail ${i+1}">
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Details & Purchase -->
      <div class="pdp-details">
        <div class="pdp-hallmark-tag">
          <i class="fa-solid fa-certificate gold-text"></i> BIS 925 Hallmarked Purity Guaranteed
        </div>
        <h2 class="pdp-title">${prod.title}</h2>
        <div class="pdp-sku">SKU: <strong>${prod.sku}</strong> | Silver Purity: <strong>92.5% Pure Sterling</strong></div>

        <div class="pdp-pricing">
          <span class="pdp-price">₹${prod.price.toLocaleString('en-IN')}</span>
          <span class="pdp-mrp">₹${prod.mrp.toLocaleString('en-IN')}</span>
          <span class="pdp-tax-note">Save ${savePercent}% • Inclusive of all Taxes (GST 3%)</span>
        </div>

        <!-- Specifications Table -->
        <table class="pdp-specs-table">
          <tbody>
            <tr>
              <td>Precious Metal:</td>
              <td>Pure 925 Sterling Silver</td>
            </tr>
            <tr>
              <td>Gross Silver Weight:</td>
              <td>${prod.weight} grams</td>
            </tr>
            <tr>
              <td>Finish & Coating:</td>
              <td>${prod.plating || 'Triple Rhodium Anti-Tarnish Shield'}</td>
            </tr>
            <tr>
              <td>Gemstone Setting:</td>
              <td>${prod.gemstone || 'Handcrafted Solid Silver'}</td>
            </tr>
            <tr>
              <td>Hallmark Stamp:</td>
              <td>925 MANISH & CO + Government HUID</td>
            </tr>
            <tr>
              <td>Warranty & Polish:</td>
              <td>Lifetime Free Cleaning & Authenticity Card</td>
            </tr>
          </tbody>
        </table>

        <!-- Ring Size or Length Guide -->
        <div class="form-field" style="margin-bottom: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <label for="pdpSizeSelect">Select Ring / Wrist Size:</label>
            <a href="#" style="font-size: 0.75rem; color: var(--color-brown); text-decoration: underline;" onclick="event.preventDefault(); window.openSizeGuideModal();">
              <i class="fa-solid fa-ruler"></i> Size Guide
            </a>
          </div>
          <select id="pdpSizeSelect" style="padding: 0.5rem; background: var(--color-offwhite-soft); border: 1px solid var(--border-subtle); border-radius: 4px;">
            <option value="Standard / Free Size">Standard / Free Size</option>
            <option value="Size 12 (16.5 mm)">Size 12 (16.5 mm)</option>
            <option value="Size 14 (17.2 mm)">Size 14 (17.2 mm) - Recommended</option>
            <option value="Size 16 (17.8 mm)">Size 16 (17.8 mm)</option>
            <option value="Size 18 (18.5 mm)">Size 18 (18.5 mm)</option>
          </select>
        </div>

        <!-- Pincode Checker -->
        <div class="pincode-checker">
          <input type="text" id="pdpPincodeInput" placeholder="Enter Delivery Pincode (e.g. 275101, 110001)" maxlength="6">
          <button class="btn btn-sm btn-outline-navy" onclick="window.checkPincodeDelivery()">Check Delivery</button>
        </div>
        <div class="pincode-result" id="pdpPincodeResult">
          <i class="fa-solid fa-truck-fast"></i> Free Insured Express Delivery across India (Dispatch within 24 hrs)
        </div>

        <!-- Signature Gift Box Addon -->
        <div class="cart-gifting-addon" style="margin-bottom: 1.25rem;">
          <label class="custom-checkbox-wrapper">
            <input type="checkbox" id="pdpGiftPackagingCheckbox">
            <span class="label-text">
              <strong>Gift this in Manish & Co Signature Linen Box & Wax Seal (+₹250)</strong>
              <small>Includes wax stamped box, navy satin ribbon & handwritten gift note</small>
            </span>
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="pdp-actions-row">
          <button class="btn btn-primary btn-lg" onclick="window.addPdpToBag('${prod.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Add to Bag
          </button>
          <button class="btn btn-gold btn-lg" onclick="window.buyNowFromPdp('${prod.id}')">
            Buy Now
          </button>
        </div>

        <!-- WhatsApp Direct Inquiry -->
        <a href="https://wa.me/919451638680?text=Hello%20Manish%20%26%20Co,%20I%20am%20interested%20in%20${encodeURIComponent(prod.title)}%20(SKU:%20${prod.sku}).%20Please%20share%20details." 
           target="_blank" 
           class="btn btn-outline-brown btn-block btn-sm" style="margin-top: 0.5rem;">
          <i class="fa-brands fa-whatsapp"></i> Inquire with Manish Verma on WhatsApp
        </a>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('open');
};

window.changePdpImage = function(src, thumbEl) {
  document.getElementById('pdpActiveImage').src = src;
  document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
};

window.checkPincodeDelivery = function() {
  const pin = (document.getElementById('pdpPincodeInput').value || '').trim();
  const res = document.getElementById('pdpPincodeResult');
  if (pin.length !== 6 || isNaN(pin)) {
    res.innerHTML = `<span style="color: #DC2626;"><i class="fa-solid fa-circle-exclamation"></i> Please enter a valid 6-digit Indian PIN code.</span>`;
    return;
  }

  res.innerHTML = `
    <span style="color: #15803D;">
      <i class="fa-solid fa-circle-check"></i> Delivery to PIN <strong>${pin}</strong> available by Blue Dart Air!
      <br><small style="color: #475569;">Estimated delivery: 2-3 business days. Cash on Delivery (COD) available.</small>
    </span>
  `;
};

window.addPdpToBag = function(id) {
  const prod = store.getProductById(id);
  if (!prod) return;
  const size = document.getElementById('pdpSizeSelect').value;
  const giftBox = document.getElementById('pdpGiftPackagingCheckbox').checked;

  store.addToCart(prod, 1, size);
  if (giftBox) {
    store.setCartGiftPackaging(true);
  }

  document.getElementById('productDetailModalBackdrop').classList.remove('open');
  showToast(`Added "${prod.title}" to Bag!`, 'fa-bag-shopping');
  openCartDrawer();
};

window.buyNowFromPdp = function(id) {
  const prod = store.getProductById(id);
  if (!prod) return;
  const size = document.getElementById('pdpSizeSelect').value;
  const giftBox = document.getElementById('pdpGiftPackagingCheckbox').checked;

  store.addToCart(prod, 1, size);
  if (giftBox) {
    store.setCartGiftPackaging(true);
  }

  document.getElementById('productDetailModalBackdrop').classList.remove('open');
  openCheckoutModal();
};

const closeProductDetailModalBtn = document.getElementById('closeProductDetailModalBtn');
if (closeProductDetailModalBtn) {
  closeProductDetailModalBtn.addEventListener('click', () => {
    document.getElementById('productDetailModalBackdrop').classList.remove('open');
  });
}

// --- CART DRAWER CONTROLLER ---
function initCartDrawer() {
  const cartTriggerBtn = document.getElementById('cartTriggerBtn');
  const cartDrawerCloseBtn = document.getElementById('cartDrawerCloseBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const continueShoppingBtn = document.getElementById('continueShoppingBtn');
  const cartGiftPackagingCheckbox = document.getElementById('cartGiftPackagingCheckbox');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponCodeInput = document.getElementById('couponCodeInput');
  const proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');

  cartTriggerBtn.addEventListener('click', openCartDrawer);
  cartDrawerCloseBtn.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);
  continueShoppingBtn.addEventListener('click', closeCartDrawer);

  cartGiftPackagingCheckbox.addEventListener('change', (e) => {
    store.setCartGiftPackaging(e.target.checked);
  });

  applyCouponBtn.addEventListener('click', () => {
    const code = couponCodeInput.value;
    const res = store.applyCoupon(code);
    const feedback = document.getElementById('couponFeedback');
    feedback.className = `coupon-feedback ${res.success ? 'success' : 'error'}`;
    feedback.textContent = res.message;
  });

  proceedToCheckoutBtn.addEventListener('click', () => {
    closeCartDrawer();
    openCheckoutModal();
  });
}

function openCartDrawer() {
  renderCartDrawer();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
}

function renderCartDrawer() {
  const calcs = store.getCartCalculations();
  const list = document.getElementById('cartItemsList');
  const totalCountEl = document.getElementById('cartDrawerTotalItems');
  const weightEl = document.getElementById('cartSummaryWeight');
  const subtotalEl = document.getElementById('cartSummarySubtotal');
  const discountRow = document.getElementById('discountRow');
  const discountEl = document.getElementById('cartSummaryDiscount');
  const giftBoxRow = document.getElementById('giftBoxRow');
  const giftBoxEl = document.getElementById('cartSummaryGiftBox');
  const shippingEl = document.getElementById('cartSummaryShipping');
  const totalEl = document.getElementById('cartSummaryTotal');
  const giftCheckbox = document.getElementById('cartGiftPackagingCheckbox');
  const shippingFill = document.getElementById('shippingProgressFill');
  const shippingMsg = document.getElementById('freeShippingMessage');

  totalCountEl.textContent = calcs.totalQty;
  weightEl.textContent = `${calcs.totalWeight} g`;
  subtotalEl.textContent = `₹${calcs.subtotal.toLocaleString('en-IN')}`;
  totalEl.textContent = `₹${Math.round(calcs.total).toLocaleString('en-IN')}`;

  if (giftCheckbox) giftCheckbox.checked = calcs.giftPackaging;

  // Free shipping progress bar
  if (calcs.amountNeededForFreeShipping > 0) {
    const pct = Math.min(100, Math.round(((calcs.freeShippingThreshold - calcs.amountNeededForFreeShipping) / calcs.freeShippingThreshold) * 100));
    shippingFill.style.width = `${pct}%`;
    shippingMsg.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Add ₹${calcs.amountNeededForFreeShipping.toLocaleString('en-IN')} more to unlock <strong>FREE Express Insured Delivery</strong>!`;
    shippingEl.textContent = `₹150`;
  } else {
    shippingFill.style.width = `100%`;
    shippingMsg.innerHTML = `<i class="fa-solid fa-circle-check gold-text"></i> Congratulations! You've unlocked <strong>FREE Insured Express Delivery</strong>!`;
    shippingEl.textContent = `FREE`;
  }

  // Discount row
  if (calcs.discount > 0) {
    discountRow.style.display = 'flex';
    discountEl.textContent = `-₹${Math.round(calcs.discount).toLocaleString('en-IN')} (${calcs.coupon.code})`;
  } else {
    discountRow.style.display = 'none';
  }

  // Gift box row
  if (calcs.giftPackaging) {
    giftBoxRow.style.display = 'flex';
    giftBoxEl.textContent = `₹250`;
  } else {
    giftBoxRow.style.display = 'none';
  }

  // Cart items rendering
  if (calcs.items.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: #64748B;">
        <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-taupe);"></i>
        <h4 style="font-family: var(--font-serif); color: var(--color-navy); font-size: 1.3rem;">Your Shopping Bag is Empty</h4>
        <p style="font-size: 0.85rem; margin-top: 0.4rem;">Explore our hallmarked 925 sterling silver collections to add timeless heirlooms.</p>
        <button class="btn btn-outline-navy btn-sm" style="margin-top: 1.25rem;" onclick="document.getElementById('cartDrawerCloseBtn').click(); window.location.hash = '#catalogue';">Explore Collections</button>
      </div>
    `;
    document.getElementById('proceedToCheckoutBtn').disabled = true;
    return;
  }

  document.getElementById('proceedToCheckoutBtn').disabled = false;

  list.innerHTML = calcs.items.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-details">
        <h4>${item.title}</h4>
        <div class="cart-item-weight">Net Wt: ${item.weight}g 925 Silver</div>
        ${item.size ? `<div style="font-size: 0.72rem; color: #64748B;">Size: ${item.size}</div>` : ''}
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="window.updateCartItemQty('${item.id}', '${item.size}', -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="window.updateCartItemQty('${item.id}', '${item.size}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="window.removeCartItem('${item.id}', '${item.size}')" title="Remove Item">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');
}

window.updateCartItemQty = function(id, size, delta) {
  store.updateCartQty(id, size, delta);
};

window.removeCartItem = function(id, size) {
  store.removeFromCart(id, size);
};

// Global coupon helper for announcement bar
window.applyCouponCode = function(code) {
  openCartDrawer();
  const input = document.getElementById('couponCodeInput');
  if (input) input.value = code;
  const res = store.applyCoupon(code);
  const feedback = document.getElementById('couponFeedback');
  if (feedback) {
    feedback.className = `coupon-feedback ${res.success ? 'success' : 'error'}`;
    feedback.textContent = res.message;
  }
};

// --- WISHLIST DRAWER CONTROLLER ---
function initWishlistDrawer() {
  const trigger = document.getElementById('wishlistTriggerBtn');
  const drawer = document.getElementById('wishlistDrawer');
  const overlay = document.getElementById('wishlistOverlay');
  const closeBtn = document.getElementById('wishlistDrawerCloseBtn');
  const addAllBtn = document.getElementById('addAllWishlistToCartBtn');

  trigger.addEventListener('click', () => {
    renderWishlistDrawer();
    drawer.classList.add('open');
    overlay.classList.add('active');
  });

  const closeWishlist = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
  };

  closeBtn.addEventListener('click', closeWishlist);
  overlay.addEventListener('click', closeWishlist);

  addAllBtn.addEventListener('click', () => {
    const products = store.getWishlistProducts();
    products.forEach(p => store.addToCart(p, 1, "Standard"));
    closeWishlist();
    showToast(`Moved all items to your Bag!`, 'fa-bag-shopping');
    openCartDrawer();
  });
}

function renderWishlistDrawer() {
  const list = document.getElementById('wishlistItemsList');
  const countEl = document.getElementById('wishlistDrawerTotalItems');
  const products = store.getWishlistProducts();

  countEl.textContent = products.length;

  if (products.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: #64748B;">
        <i class="fa-regular fa-heart" style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-taupe);"></i>
        <h4 style="font-family: var(--font-serif); color: var(--color-navy); font-size: 1.3rem;">Your Wishlist is Empty</h4>
        <p style="font-size: 0.85rem; margin-top: 0.4rem;">Tap the heart icon on any jewellery piece to save it for later.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = products.map(p => `
    <div class="cart-item">
      <img src="${p.image}" alt="${p.title}" class="cart-item-img">
      <div class="cart-item-details">
        <h4>${p.title}</h4>
        <div class="cart-item-weight">${p.weight}g Pure 925 Silver</div>
        <div class="cart-item-price">₹${p.price.toLocaleString('en-IN')}</div>
        <button class="btn btn-xs btn-outline-navy" style="margin-top: 0.45rem;" onclick="window.quickAddToCart('${p.id}')">
          <i class="fa-solid fa-bag-shopping"></i> Move to Bag
        </button>
      </div>
      <button class="cart-item-remove" onclick="window.toggleProductWishlist('${p.id}')" title="Remove from Wishlist">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');
}

// --- BESPOKE CUSTOM JEWELLERY STUDIO ---
function initCustomStudio() {
  const form = document.getElementById('customJewelleryForm');
  const engravingInput = document.getElementById('customEngravingText');
  const engravedRenderText = document.getElementById('engravedRenderText');

  if (engravingInput && engravedRenderText) {
    engravingInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      engravedRenderText.textContent = val ? val.toUpperCase() : "YOUR INSCRIPTION HERE";
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const jewelType = document.getElementById('customJewelType').value;
      const finish = document.getElementById('customFinish').value;
      const engraving = document.getElementById('customEngravingText').value;
      const weight = document.getElementById('customWeight').value;
      const budget = document.getElementById('customBudget').value;
      const clientName = document.getElementById('customClientName').value;
      const clientPhone = document.getElementById('customClientPhone').value;
      const notes = document.getElementById('customNotes').value;

      const lead = store.addCustomLead({
        clientName,
        clientPhone,
        jewelType,
        finish,
        engravingText: engraving || "N/A",
        weight,
        budget,
        notes
      });

      showToast(`Bespoke Request Submitted! Lead #${lead.id}`, 'fa-compass-drafting');
      form.reset();
      engravedRenderText.textContent = "YOUR INSCRIPTION HERE";

      // Open WhatsApp direct link option
      const waMsg = `Hello Manish Verma & Co, I have submitted a bespoke custom jewellery inquiry (ID: ${lead.id}) for ${jewelType}. Client: ${clientName}, Phone: ${clientPhone}, Budget: ${budget}. Looking forward to consultation!`;
      const waUrl = `https://wa.me/919451638680?text=${encodeURIComponent(waMsg)}`;
      
      setTimeout(() => {
        if (confirm("Your custom request has been recorded with Founder Manish Verma. Would you like to connect directly on WhatsApp now?")) {
          window.open(waUrl, '_blank');
        }
      }, 500);
    });
  }
}

// --- SIGNATURE GIFTING BUTTON ADDON ---
const addGiftBoxAddonBtn = document.getElementById('addGiftBoxAddonBtn');
if (addGiftBoxAddonBtn) {
  addGiftBoxAddonBtn.addEventListener('click', () => {
    store.setCartGiftPackaging(true);
    showToast(`Signature Linen Box & Wax Seal Added (+₹250)`, 'fa-gift');
    openCartDrawer();
  });
}

// --- TESTIMONIALS & SOCIAL GRID ---
function renderTestimonials() {
  const container = document.getElementById('testimonialsCarousel');
  if (!container) return;

  container.innerHTML = TESTIMONIALS_DATA.map(t => `
    <div class="testimonial-card">
      <div class="t-rating">
        ${Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
      </div>
      <blockquote class="t-quote">"${t.quote}"</blockquote>
      <div class="t-author">
        <div class="t-avatar">${t.name.charAt(0)}</div>
        <div class="t-info">
          <strong>${t.name}</strong>
          <span>${t.city} • Verified Buyer</span>
          <div class="t-verified"><i class="fa-solid fa-circle-check"></i> ${t.itemPurchased}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderSocialGrid() {
  const grid = document.getElementById('socialGrid');
  if (!grid) return;

  const images = [
    "./public/images/hallmark-ring.jpg",
    "./public/images/hero-necklace.jpg",
    "./public/images/luxury-packaging.jpg",
    "./public/images/heritage-jhumkas.jpg",
    "./public/images/custom-craft.jpg",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
  ];

  grid.innerHTML = images.map(img => `
    <div class="social-item" onclick="window.location.hash='#catalogue'">
      <img src="${img}" alt="MANISH & CO Fine Silver Lifestyle" loading="lazy">
      <div class="social-hover">
        <i class="fa-brands fa-instagram"></i>
      </div>
    </div>
  `).join('');
}

// --- MULTI-STEP CHECKOUT ENGINE ---
let checkoutStep = 1;
let checkoutFormData = {
  customer: {},
  shippingMethod: 'free',
  paymentMethod: 'UPI'
};

function initCheckout() {
  const closeBtn = document.getElementById('closeCheckoutModalBtn');
  closeBtn.addEventListener('click', closeCheckoutModal);
}

function openCheckoutModal() {
  const calcs = store.getCartCalculations();
  if (calcs.items.length === 0) {
    showToast("Your cart is empty. Please add items to checkout.", "fa-bag-shopping");
    return;
  }

  checkoutStep = 1;
  const user = store.getUser();
  if (user) {
    checkoutFormData.customer = {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    };
  }

  renderCheckoutStep();
  document.getElementById('checkoutModalBackdrop').classList.add('open');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModalBackdrop').classList.remove('open');
}

function renderCheckoutStep() {
  const body = document.getElementById('checkoutModalBody');
  const calcs = store.getCartCalculations();

  // Update step indicators
  document.getElementById('chkStep1').className = `step-bullet ${checkoutStep === 1 ? 'active' : (checkoutStep > 1 ? 'completed' : '')}`;
  document.getElementById('chkStep2').className = `step-bullet ${checkoutStep === 2 ? 'active' : (checkoutStep > 2 ? 'completed' : '')}`;
  document.getElementById('chkStep3').className = `step-bullet ${checkoutStep === 3 ? 'active' : ''}`;

  if (checkoutStep === 1) {
    // Step 1: Shipping Address
    body.innerHTML = `
      <div class="checkout-grid">
        <form id="chkAddressForm" class="checkout-form">
          <h4 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--color-navy);">Insured Delivery Address</h4>
          <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 1.25rem;">Shipment insured by Blue Dart Air against loss and damage.</p>

          <div class="form-row">
            <div class="form-field">
              <label for="chkName">Full Name *</label>
              <input type="text" id="chkName" value="${checkoutFormData.customer.name || ''}" placeholder="Receiver Name" required>
            </div>
            <div class="form-field">
              <label for="chkPhone">Mobile Phone (for OTP & Delivery) *</label>
              <input type="tel" id="chkPhone" value="${checkoutFormData.customer.phone || ''}" placeholder="+91 98765 43210" required>
            </div>
          </div>

          <div class="form-field">
            <label for="chkEmail">Email Address (for Digital Hallmark Invoice) *</label>
            <input type="email" id="chkEmail" value="${checkoutFormData.customer.email || ''}" placeholder="patron@example.com" required>
          </div>

          <div class="form-field">
            <label for="chkAddress">Street Address / House No / Landmark *</label>
            <input type="text" id="chkAddress" value="${checkoutFormData.customer.address || ''}" placeholder="Flat 402, Royal Residency, Near ..." required>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="chkCity">City *</label>
              <input type="text" id="chkCity" value="${checkoutFormData.customer.city || ''}" placeholder="City" required>
            </div>
            <div class="form-field">
              <label for="chkState">State *</label>
              <select id="chkState" required>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Other">Other State</option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label for="chkPincode">PIN Code *</label>
            <input type="text" id="chkPincode" value="${checkoutFormData.customer.pincode || '275101'}" maxlength="6" placeholder="6-digit Indian PIN Code" required>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 1rem;">
            Continue to Payment <i class="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <!-- Mini Order Summary Sidebar -->
        <div class="checkout-summary-sidebar" style="background: var(--color-offwhite-soft); padding: 1.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <h5 style="font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 1rem; color: var(--color-navy);">Order Overview (${calcs.totalQty} items)</h5>
          
          <div style="max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-subtle);">
            ${calcs.items.map(i => `
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <img src="${i.image}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 4px;">
                <div style="flex: 1; font-size: 0.78rem;">
                  <strong style="display: block; color: var(--color-navy); line-height: 1.2;">${i.title}</strong>
                  <span style="color: #64748B;">Qty: ${i.qty} • ${i.weight}g 925 Silver</span>
                </div>
                <strong style="font-size: 0.85rem; color: var(--color-navy);">₹${(i.price * i.qty).toLocaleString('en-IN')}</strong>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.82rem; color: #475569;">
            <div style="display: flex; justify-content: space-between;">
              <span>Total Silver Net Weight</span>
              <strong>${calcs.totalWeight} g</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Subtotal</span>
              <span>₹${calcs.subtotal.toLocaleString('en-IN')}</span>
            </div>
            ${calcs.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: #15803D;">
                <span>Coupon Discount</span>
                <span>-₹${Math.round(calcs.discount).toLocaleString('en-IN')}</span>
              </div>
            ` : ''}
            ${calcs.giftPackaging ? `
              <div style="display: flex; justify-content: space-between;">
                <span>Linen Gift Packaging</span>
                <span>₹250</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between;">
              <span>Insured Shipping</span>
              <span>${calcs.shipping === 0 ? 'FREE' : '₹150'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.1rem; color: var(--color-navy); border-top: 1px solid var(--border-subtle); padding-top: 0.65rem; margin-top: 0.35rem;">
              <strong>Total Payable</strong>
              <strong>₹${Math.round(calcs.total).toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('chkAddressForm').addEventListener('submit', (e) => {
      e.preventDefault();
      checkoutFormData.customer = {
        name: document.getElementById('chkName').value,
        phone: document.getElementById('chkPhone').value,
        email: document.getElementById('chkEmail').value,
        address: document.getElementById('chkAddress').value,
        city: document.getElementById('chkCity').value,
        state: document.getElementById('chkState').value,
        pincode: document.getElementById('chkPincode').value
      };
      checkoutStep = 2;
      renderCheckoutStep();
    });

  } else if (checkoutStep === 2) {
    // Step 2: Payment Selection
    body.innerHTML = `
      <div class="checkout-grid">
        <div>
          <h4 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--color-navy);">Select Payment Method</h4>
          <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 1.25rem;">256-Bit SSL Encrypted & Bank-Grade Security.</p>

          <div class="payment-methods-grid">
            <!-- Option 1: Instant UPI -->
            <label class="pay-card-option ${checkoutFormData.paymentMethod === 'UPI' ? 'selected' : ''}">
              <input type="radio" name="payMethod" value="UPI" ${checkoutFormData.paymentMethod === 'UPI' ? 'checked' : ''} onchange="window.selectPaymentMethod('UPI')">
              <div>
                <strong><i class="fa-brands fa-google-pay gold-text"></i> Instant UPI / QR Code (Recommended)</strong>
                <p style="font-size: 0.78rem; color: #64748B;">Scan & Pay via GPay, PhonePe, Paytm, or any BHIM UPI App.</p>
              </div>
            </label>

            <!-- Option 2: Cards -->
            <label class="pay-card-option ${checkoutFormData.paymentMethod === 'Card' ? 'selected' : ''}">
              <input type="radio" name="payMethod" value="Card" ${checkoutFormData.paymentMethod === 'Card' ? 'checked' : ''} onchange="window.selectPaymentMethod('Card')">
              <div>
                <strong><i class="fa-regular fa-credit-card"></i> Credit / Debit Cards (Visa, RuPay, Mastercard)</strong>
                <p style="font-size: 0.78rem; color: #64748B;">Zero extra convenience fees. Instant confirmation.</p>
              </div>
            </label>

            <!-- Option 3: Netbanking -->
            <label class="pay-card-option ${checkoutFormData.paymentMethod === 'Netbanking' ? 'selected' : ''}">
              <input type="radio" name="payMethod" value="Netbanking" ${checkoutFormData.paymentMethod === 'Netbanking' ? 'checked' : ''} onchange="window.selectPaymentMethod('Netbanking')">
              <div>
                <strong><i class="fa-solid fa-building-columns"></i> Netbanking (HDFC, SBI, ICICI, Axis & All Indian Banks)</strong>
                <p style="font-size: 0.78rem; color: #64748B;">Direct secure portal transfer.</p>
              </div>
            </label>

            <!-- Option 4: COD -->
            <label class="pay-card-option ${checkoutFormData.paymentMethod === 'COD' ? 'selected' : ''}">
              <input type="radio" name="payMethod" value="COD" ${checkoutFormData.paymentMethod === 'COD' ? 'checked' : ''} onchange="window.selectPaymentMethod('COD')">
              <div>
                <strong><i class="fa-solid fa-hand-holding-dollar"></i> Cash on Delivery (COD)</strong>
                <p style="font-size: 0.78rem; color: #64748B;">Pay in cash or UPI at delivery doorstep with tamper-proof seal check.</p>
              </div>
            </label>
          </div>

          <!-- Dynamic Payment Method Details Box -->
          <div id="paymentDetailsInteractiveBox">
            ${renderPaymentMethodDetails()}
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button class="btn btn-outline-navy" onclick="window.backToCheckoutStep1()">
              <i class="fa-solid fa-arrow-left"></i> Back to Address
            </button>
            <button class="btn btn-gold btn-block btn-lg" onclick="window.confirmAndPlaceOrder()">
              <i class="fa-solid fa-lock"></i> Authorize & Confirm Order (₹${Math.round(calcs.total).toLocaleString('en-IN')})
            </button>
          </div>
        </div>

        <!-- Sidebar Summary -->
        <div class="checkout-summary-sidebar" style="background: var(--color-offwhite-soft); padding: 1.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); height: fit-content;">
          <h5 style="font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--color-navy);">Delivery To:</h5>
          <div style="font-size: 0.8rem; line-height: 1.5; color: #475569; margin-bottom: 1.25rem;">
            <strong style="color: var(--color-navy);">${checkoutFormData.customer.name}</strong><br>
            ${checkoutFormData.customer.address}, ${checkoutFormData.customer.city}, ${checkoutFormData.customer.state} - ${checkoutFormData.customer.pincode}<br>
            <i class="fa-solid fa-phone"></i> ${checkoutFormData.customer.phone}
          </div>

          <div style="font-size: 0.85rem; border-top: 1px solid var(--border-subtle); padding-top: 0.85rem;">
            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; color: var(--color-navy); font-weight: 700;">
              <span>Total Payable</span>
              <span>₹${Math.round(calcs.total).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (checkoutStep === 3) {
    // Step 3: Success Screen
    const order = checkoutFormData.placedOrder;
    body.innerHTML = `
      <div class="order-success-box">
        <div class="success-icon"><i class="fa-solid fa-check"></i></div>
        <h3>Thank You for Choosing MANISH & CO!</h3>
        <p style="font-size: 1.05rem; color: #475569; max-width: 580px; margin: 0.5rem auto 1.5rem;">
          Your order has been safely placed with Order ID <strong>#${order.id}</strong>. A digital BIS Hallmarking Certificate & Invoice have been issued.
        </p>

        <div style="background: var(--color-offwhite-soft); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1.5rem; max-width: 540px; margin: 0 auto 1.5rem; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Order ID:</span>
            <strong>#${order.id}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Delivery Courier:</span>
            <strong>${order.courier} (AWB: ${order.trackingNumber})</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Payment Method:</span>
            <strong>${order.paymentMethod}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Total Silver Net Weight:</span>
            <strong>${order.summary.totalWeight} grams</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.1rem; color: var(--color-navy); border-top: 1px solid var(--border-subtle); padding-top: 0.5rem;">
            <span>Total Amount Paid:</span>
            <strong>₹${Math.round(order.summary.total).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <button class="btn btn-gold" onclick="window.trackOrderNow('${order.id}')">
            <i class="fa-solid fa-truck-fast"></i> Track Live Insured Shipment
          </button>
          <button class="btn btn-outline-navy" onclick="window.simulateInvoiceDownload('${order.id}')">
            <i class="fa-solid fa-file-invoice"></i> Download Tax Invoice
          </button>
          <button class="btn btn-primary" onclick="window.closeCheckoutModalAndContinue()">
            Continue Browsing
          </button>
        </div>
      </div>
    `;
  }
}

function renderPaymentMethodDetails() {
  const method = checkoutFormData.paymentMethod;
  const calcs = store.getCartCalculations();

  if (method === 'UPI') {
    return `
      <div class="pay-qr-box">
        <h5 style="color: var(--color-navy); margin-bottom: 0.35rem;">Scan with Any UPI App</h5>
        <p style="font-size: 0.78rem; color: #64748B; margin-bottom: 0.85rem;">Google Pay, PhonePe, Paytm, CRED or BHIM</p>
        <!-- Dynamic QR Code SVG simulation -->
        <div style="background: #FFFFFF; display: inline-block; padding: 12px; border: 1px solid #CBD5E1; border-radius: 8px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=manishandco@upi&pn=MANISH%20%26%20CO&am=${Math.round(calcs.total)}&cu=INR" alt="UPI QR Code" class="pay-qr-code">
        </div>
        <div style="font-size: 0.82rem; color: var(--color-navy); font-weight: 700; margin-top: 0.5rem;">
          UPI ID: <span style="font-family: monospace; background: var(--color-offwhite-alt); padding: 0.15rem 0.5rem; border-radius: 4px;">manishandco@upi</span>
        </div>
      </div>
    `;
  } else if (method === 'Card') {
    return `
      <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1.25rem; margin-top: 1rem;">
        <div class="form-field">
          <label>Card Number</label>
          <input type="text" placeholder="4532 •••• •••• 8941" maxlength="19">
        </div>
        <div class="form-row">
          <div class="form-field">
            <label>Expiry Date</label>
            <input type="text" placeholder="MM / YY" maxlength="5">
          </div>
          <div class="form-field">
            <label>CVV / CVC</label>
            <input type="password" placeholder="•••" maxlength="3">
          </div>
        </div>
        <div class="form-field">
          <label>Cardholder Name</label>
          <input type="text" placeholder="Name as printed on card">
        </div>
      </div>
    `;
  } else if (method === 'Netbanking') {
    return `
      <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1.25rem; margin-top: 1rem;">
        <label style="font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 0.5rem;">Popular Banks</label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; font-size: 0.8rem;">
          <label style="display: flex; gap: 0.4rem; align-items: center;"><input type="radio" name="bank" checked> HDFC Bank</label>
          <label style="display: flex; gap: 0.4rem; align-items: center;"><input type="radio" name="bank"> State Bank of India</label>
          <label style="display: flex; gap: 0.4rem; align-items: center;"><input type="radio" name="bank"> ICICI Bank</label>
          <label style="display: flex; gap: 0.4rem; align-items: center;"><input type="radio" name="bank"> Axis Bank</label>
          <label style="display: flex; gap: 0.4rem; align-items: center;"><input type="radio" name="bank"> Kotak Bank</label>
          <label style="display: flex; gap: 0.4rem; align-items: center;"><input type="radio" name="bank"> Punjab National</label>
        </div>
      </div>
    `;
  } else if (method === 'COD') {
    return `
      <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-sm); padding: 1rem; margin-top: 1rem; font-size: 0.82rem; color: #92400E;">
        <i class="fa-solid fa-triangle-exclamation"></i> <strong>Cash on Delivery (COD) Policy:</strong>
        <p style="margin-top: 0.35rem;">To avoid transit fraud on precious 925 sterling silver, an OTP verification will be conducted via SMS/WhatsApp prior to Blue Dart courier handover.</p>
      </div>
    `;
  }
  return '';
}

window.selectPaymentMethod = function(method) {
  checkoutFormData.paymentMethod = method;
  renderCheckoutStep();
};

window.backToCheckoutStep1 = function() {
  checkoutStep = 1;
  renderCheckoutStep();
};

window.confirmAndPlaceOrder = function() {
  const calcs = store.getCartCalculations();
  const order = store.createOrder({
    customer: checkoutFormData.customer,
    items: calcs.items,
    summary: {
      subtotal: calcs.subtotal,
      discount: calcs.discount,
      couponCode: calcs.coupon ? calcs.coupon.code : null,
      giftPackaging: calcs.giftPackaging,
      giftPackagingCost: calcs.giftBoxCost,
      shipping: calcs.shipping,
      total: calcs.total,
      totalWeight: calcs.totalWeight
    },
    paymentMethod: checkoutFormData.paymentMethod
  });

  checkoutFormData.placedOrder = order;
  checkoutStep = 3;
  renderCheckoutStep();
  showToast(`Order #${order.id} Placed Successfully!`, 'fa-crown');
};

window.closeCheckoutModalAndContinue = function() {
  closeCheckoutModal();
  window.location.hash = '#catalogue';
};

window.trackOrderNow = function(orderId) {
  closeCheckoutModal();
  openTrackingModalWithId(orderId);
};

window.simulateInvoiceDownload = function(orderId) {
  showToast(`Downloading Tax Invoice for #${orderId}...`, 'fa-file-arrow-down');
  // Trigger virtual download
  setTimeout(() => {
    alert(`MANISH & CO Fine Silver Jewellery\nInvoice #INV-${orderId}\nGSTIN: 09AAAFM1234F1Z5\nAuthorized Signatory: Manish Verma\nStatus: Official Tax Invoice & BIS Hallmark Guarantee Generated.`);
  }, 400);
};

// --- ORDER TRACKING ENGINE ---
function initTracking() {
  const form = document.getElementById('orderTrackingForm');
  const closeBtn = document.getElementById('closeTrackingModalBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('trackOrderInput').value;
      openTrackingModalWithId(input);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('trackingModalBackdrop').classList.remove('open');
    });
  }
}

function openTrackingModalWithId(query) {
  const order = store.getOrderById(query);
  const modal = document.getElementById('trackingModalBackdrop');
  const body = document.getElementById('trackingModalBody');

  if (!order) {
    body.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem;">
        <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--color-taupe); margin-bottom: 1rem;"></i>
        <h4 style="font-family: var(--font-serif); color: var(--color-navy); font-size: 1.35rem;">No Consignment Found</h4>
        <p style="font-size: 0.88rem; color: #64748B; margin-top: 0.4rem;">
          Could not find an order matching "${query}". Please check your 6-digit Order ID (e.g. MCO-8941) or phone number.
        </p>
      </div>
    `;
    modal.classList.add('open');
    return;
  }

  body.innerHTML = `
    <div style="margin-bottom: 1.5rem; background: var(--color-offwhite-soft); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <strong style="font-size: 1.15rem; color: var(--color-navy);">Order #${order.id}</strong>
        <span style="background: var(--color-navy); color: #FFFFFF; font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.65rem; border-radius: 4px;">
          Status: ${order.status}
        </span>
      </div>
      <div style="font-size: 0.8rem; color: #64748B;">
        <span><strong>Courier Partner:</strong> ${order.courier}</span> • 
        <span><strong>Air AWB:</strong> ${order.trackingNumber}</span>
      </div>
      <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.25rem;">
        <span><strong>Destination:</strong> ${order.customer.city}, ${order.customer.state} (${order.customer.pincode})</span>
      </div>
    </div>

    <h5 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-navy); margin-bottom: 1.25rem;">Insured Transit Journey</h5>

    <div class="tracking-timeline">
      ${order.timeline.map((step, idx) => `
        <div class="timeline-step ${idx === order.timeline.length - 1 ? 'active' : 'completed'}">
          <div class="timeline-dot"></div>
          <div class="timeline-info">
            <strong>${step.status}</strong>
            <span>${step.desc}</span>
            <small style="display: block; font-size: 0.72rem; color: var(--color-brown); margin-top: 0.15rem;">${step.time}</small>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  modal.classList.add('open');
}

// --- USER AUTH & PROFILE DASHBOARD ---
function initAuth() {
  const authBtn = document.getElementById('userAuthBtn');
  const closeBtn = document.getElementById('closeAuthModalBtn');
  const loginTabBtn = document.getElementById('loginTabBtn');
  const registerTabBtn = document.getElementById('registerTabBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const userLogoutBtn = document.getElementById('userLogoutBtn');

  authBtn.addEventListener('click', () => {
    updateUserAuthUI();
    document.getElementById('authModalBackdrop').classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    document.getElementById('authModalBackdrop').classList.remove('open');
  });

  loginTabBtn.addEventListener('click', () => {
    loginTabBtn.classList.add('active');
    registerTabBtn.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });

  registerTabBtn.addEventListener('click', () => {
    registerTabBtn.classList.add('active');
    loginTabBtn.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailOrPhone = document.getElementById('loginEmailPhone').value;
    const name = emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Patron';
    store.login({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@client.manishandco.in`,
      phone: emailOrPhone.includes('@') ? '+91 9451638680' : emailOrPhone
    });
    showToast(`Welcome back, ${name}!`, 'fa-crown');
    updateUserAuthUI();
  });

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regFullName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    store.login({ name, email, phone });
    showToast(`Welcome to Manish & Co Privilege, ${name}!`, 'fa-crown');
    updateUserAuthUI();
  });

  if (userLogoutBtn) {
    userLogoutBtn.addEventListener('click', () => {
      store.logout();
      showToast("Signed out successfully", 'fa-arrow-right-from-bracket');
      updateUserAuthUI();
    });
  }
}

function updateUserAuthUI() {
  const user = store.getUser();
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const profileDashboard = document.getElementById('userProfileDashboard');
  const authTabs = document.querySelector('.auth-tabs');

  if (user) {
    // Logged in
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    if (authTabs) authTabs.style.display = 'none';
    profileDashboard.classList.remove('hidden');

    document.getElementById('profileDisplayName').textContent = user.name;
    document.getElementById('profileDisplayEmail').textContent = user.email;

    // Load recent orders
    const orders = store.getOrders().slice(0, 3);
    const list = document.getElementById('profileOrdersList');
    list.innerHTML = orders.map(o => `
      <div style="padding: 0.75rem; background: var(--color-offwhite-soft); border-radius: 4px; margin-bottom: 0.5rem; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="color: var(--color-navy);">Order #${o.id}</strong>
          <div style="color: #64748B;">${o.date} • ₹${Math.round(o.summary.total).toLocaleString('en-IN')}</div>
        </div>
        <button class="btn btn-xs btn-outline-navy" onclick="window.trackOrderNow('${o.id}')">Track</button>
      </div>
    `).join('');
  } else {
    // Logged out
    profileDashboard.classList.add('hidden');
    if (authTabs) authTabs.style.display = 'flex';
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  }
}

// --- ADMIN BACKOFFICE PORTAL ---
function initAdminPortal() {
  const toggleBtn = document.getElementById('adminPortalToggle');
  const closeBtn = document.getElementById('closeAdminPortalBtn');
  const backdrop = document.getElementById('adminPortalBackdrop');
  const refreshBtn = document.getElementById('adminRefreshBtn');

  toggleBtn.addEventListener('click', () => {
    backdrop.classList.add('open');
    renderAdminOverview();
    renderAdminProducts();
    renderAdminOrders();
    renderAdminCustomLeads();
    renderAdminCoupons();
  });

  closeBtn.addEventListener('click', () => {
    backdrop.classList.remove('open');
  });

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      renderAdminOverview();
      renderAdminProducts();
      renderAdminOrders();
      renderAdminCustomLeads();
      showToast("Store data synchronized", "fa-arrows-rotate");
    });
  }

  // Admin tab switching
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      document.getElementById(target).classList.add('active');
    });
  });

  // Admin silver rates update form
  const silverRateForm = document.getElementById('adminSilverRateForm');
  if (silverRateForm) {
    silverRateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const r925 = document.getElementById('adminSilverRate925').value;
      const r24k = document.getElementById('adminSilverRate24K').value;
      store.setRates(r925, r24k);
      showToast("Live Silver Rates Updated across Store!", "fa-scale-balanced");
    });
  }

  // Add product modal
  initAdminProductModal();
}

function renderAdminOverview() {
  const orders = store.getOrders();
  const products = store.getProducts();
  const customLeads = store.getCustomLeads();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.summary.total || 0), 0);
  const totalSilverSold = orders.reduce((sum, o) => sum + (o.summary.totalWeight || 0), 0);

  document.getElementById('adminStatRevenue').textContent = `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`;
  document.getElementById('adminStatOrders').textContent = orders.length;
  document.getElementById('adminStatSilverGrams').textContent = `${totalSilverSold.toFixed(1)} g`;
  document.getElementById('adminStatSkus').textContent = products.length;

  document.getElementById('adminProductCount').textContent = products.length;
  document.getElementById('adminOrderCount').textContent = orders.length;
  document.getElementById('adminCustomCount').textContent = customLeads.length;

  // Mini recent orders
  const miniOrders = document.getElementById('adminRecentOrdersMini');
  miniOrders.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${orders.slice(0, 4).map(o => `
          <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${o.customer.name}</td>
            <td>₹${Math.round(o.summary.total).toLocaleString('en-IN')}</td>
            <td><span class="badge ${o.status === 'Delivered' ? 'badge-bestseller' : 'badge-hallmark'}">${o.status}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Mini custom leads
  const miniLeads = document.getElementById('adminRecentLeadsMini');
  miniLeads.innerHTML = customLeads.slice(0, 4).map(l => `
    <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
      <div>
        <strong style="color: var(--color-navy); display: block;">${l.clientName} (${l.jewelType})</strong>
        <span style="color: #64748B;">${l.budget} • Engraving: "${l.engravingText}"</span>
      </div>
      <a href="https://wa.me/${l.clientPhone.replace(/\D/g, '')}" target="_blank" class="sidebar-wa-btn" style="padding: 0.25rem 0.6rem; font-size: 0.7rem;">
        <i class="fa-brands fa-whatsapp"></i> Chat
      </a>
    </div>
  `).join('');
}

function renderAdminProducts() {
  const tbody = document.getElementById('adminProductsTableBody');
  const products = store.getProducts();

  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img src="${p.image}" alt="${p.title}"></td>
      <td>
        <strong>${p.title}</strong>
        <div style="font-size: 0.72rem; color: #64748B;">SKU: ${p.sku}</div>
      </td>
      <td>${p.category}</td>
      <td><strong>${p.weight}g</strong></td>
      <td>₹${p.price.toLocaleString('en-IN')}</td>
      <td>
        <span style="font-weight: 700; color: ${p.stock <= 5 ? '#DC2626' : '#15803D'};">
          ${p.stock} units ${p.stock <= 5 ? '(Low)' : ''}
        </span>
      </td>
      <td><span class="badge badge-hallmark">BIS 925</span></td>
      <td>
        <button class="btn btn-xs btn-outline-brown" onclick="window.adminDeleteProduct('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.adminDeleteProduct = function(id) {
  if (confirm("Are you sure you want to remove this 925 silver product from the catalogue?")) {
    store.deleteProduct(id);
    renderAdminProducts();
    renderAdminOverview();
    showToast("Product removed from catalog", "fa-trash");
  }
};

function renderAdminOrders() {
  const tbody = document.getElementById('adminOrdersTableBody');
  const orders = store.getOrders();

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>#${o.id}</strong><div style="font-size: 0.72rem; color: #64748B;">${o.date}</div></td>
      <td>
        <strong>${o.customer.name}</strong>
        <div style="font-size: 0.72rem; color: #64748B;">${o.customer.phone}</div>
        <div style="font-size: 0.7rem; color: #64748B;">${o.customer.city}, ${o.customer.state}</div>
      </td>
      <td>
        ${o.items.map(i => `<div style="font-size: 0.76rem;">${i.qty}x ${i.title} (${i.weight}g)</div>`).join('')}
      </td>
      <td><strong>₹${Math.round(o.summary.total).toLocaleString('en-IN')}</strong></td>
      <td>${o.paymentMethod}</td>
      <td>${o.summary.giftPackaging ? '<span class="badge badge-bestseller">Linen Box + Wax</span>' : 'Standard'}</td>
      <td>
        <select onchange="window.adminUpdateOrderStatus('${o.id}', this.value)" style="font-size: 0.78rem; padding: 0.3rem; border: 1px solid var(--border-subtle); border-radius: 4px;">
          <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
          <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
      <td>
        <button class="btn btn-xs btn-outline-navy" onclick="window.trackOrderNow('${o.id}')">Track</button>
      </td>
    </tr>
  `).join('');
}

window.adminUpdateOrderStatus = function(orderId, newStatus) {
  store.updateOrderStatus(orderId, newStatus);
  showToast(`Order #${orderId} marked as ${newStatus}`, 'fa-truck');
  renderAdminOrders();
  renderAdminOverview();
};

function renderAdminCustomLeads() {
  const tbody = document.getElementById('adminCustomTableBody');
  const leads = store.getCustomLeads();

  tbody.innerHTML = leads.map(l => `
    <tr>
      <td>${l.date}</td>
      <td>
        <strong>${l.clientName}</strong>
        <div style="font-size: 0.75rem; color: #64748B;">${l.clientPhone}</div>
      </td>
      <td><strong>${l.jewelType}</strong></td>
      <td><span style="font-family: monospace; background: var(--color-silver); padding: 0.2rem 0.45rem; border-radius: 3px;">${l.engravingText}</span></td>
      <td>${l.finish} (${l.weight})</td>
      <td><strong>${l.budget}</strong></td>
      <td>
        <a href="https://wa.me/${l.clientPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(l.clientName)},%20this%20is%20Manish%20Verma%20from%20MANISH%20%26%20CO.%20I%20am%20reviewing%20your%20bespoke%20jewellery%20inquiry." target="_blank" class="sidebar-wa-btn" style="padding: 0.25rem 0.6rem;">
          <i class="fa-brands fa-whatsapp"></i> Chat
        </a>
      </td>
      <td><span class="badge badge-bestseller">${l.status}</span></td>
    </tr>
  `).join('');
}

function renderAdminCoupons() {
  const container = document.getElementById('adminCouponList');
  if (!container) return;

  container.innerHTML = Object.entries(COUPONS_DATA).map(([code, c]) => `
    <div style="padding: 0.85rem; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: var(--color-navy); font-size: 0.95rem;">${code}</strong>
        <div style="font-size: 0.78rem; color: #64748B;">${c.label} • Min Order: ₹${c.minOrder.toLocaleString('en-IN')}</div>
      </div>
      <span class="badge badge-hallmark">Active</span>
    </div>
  `).join('');
}

// Add Product Modal Inside Admin
function initAdminProductModal() {
  const openBtn = document.getElementById('openAddProductModalBtn');
  const closeBtn = document.getElementById('closeAdminProductModalBtn');
  const cancelBtn = document.getElementById('cancelAdminProductModalBtn');
  const backdrop = document.getElementById('adminProductModalBackdrop');
  const form = document.getElementById('adminProductForm');

  openBtn.addEventListener('click', () => backdrop.classList.add('open'));
  closeBtn.addEventListener('click', () => backdrop.classList.remove('open'));
  cancelBtn.addEventListener('click', () => backdrop.classList.remove('open'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('adminProdTitle').value;
    const category = document.getElementById('adminProdCategory').value;
    const price = Number(document.getElementById('adminProdPrice').value);
    const mrp = Number(document.getElementById('adminProdMrp').value);
    const weight = Number(document.getElementById('adminProdWeight').value);
    const stock = Number(document.getElementById('adminProdStock').value);
    const finish = document.getElementById('adminProdFinish').value;
    const occasion = document.getElementById('adminProdOccasion').value;
    const image = document.getElementById('adminProdImage').value;
    const desc = document.getElementById('adminProdDesc').value;

    store.addProduct({
      title,
      category,
      subCategory: category,
      price,
      mrp,
      weight,
      stock,
      purity: "925 Sterling",
      finish,
      occasion,
      image,
      description: desc,
      isBestseller: false,
      isNew: true
    });

    form.reset();
    backdrop.classList.remove('open');
    showToast(`Added "${title}" to 925 Silver Catalogue!`, 'fa-circle-plus');
    renderAdminProducts();
    renderAdminOverview();
  });
}

// --- SIZE GUIDE & HALLMARK GUIDE MODALS ---
function initSizeAndHallmarkGuides() {
  const openSizeBtn = document.getElementById('openSizeGuideModal');
  const closeSizeBtn = document.getElementById('closeSizeGuideBtn');
  const sizeBackdrop = document.getElementById('sizeGuideModalBackdrop');

  const openHallmarkBtn = document.getElementById('openHallmarkGuideModal');
  const closeHallmarkBtn = document.getElementById('closeHallmarkGuideBtn');
  const hallmarkBackdrop = document.getElementById('hallmarkGuideModalBackdrop');

  if (openSizeBtn) openSizeBtn.addEventListener('click', (e) => { e.preventDefault(); sizeBackdrop.classList.add('open'); renderSizeGuideContent('ring'); });
  if (closeSizeBtn) closeSizeBtn.addEventListener('click', () => sizeBackdrop.classList.remove('open'));

  if (openHallmarkBtn) openHallmarkBtn.addEventListener('click', (e) => { e.preventDefault(); hallmarkBackdrop.classList.add('open'); });
  if (closeHallmarkBtn) closeHallmarkBtn.addEventListener('click', () => hallmarkBackdrop.classList.remove('open'));

  const tabRing = document.getElementById('tabRingSize');
  const tabBangle = document.getElementById('tabBangleSize');
  if (tabRing && tabBangle) {
    tabRing.addEventListener('click', () => { tabRing.classList.add('active'); tabBangle.classList.remove('active'); renderSizeGuideContent('ring'); });
    tabBangle.addEventListener('click', () => { tabBangle.classList.add('active'); tabRing.classList.remove('active'); renderSizeGuideContent('bangle'); });
  }
}

window.openSizeGuideModal = function() {
  const sizeBackdrop = document.getElementById('sizeGuideModalBackdrop');
  sizeBackdrop.classList.add('open');
  renderSizeGuideContent('ring');
};

function renderSizeGuideContent(type) {
  const box = document.getElementById('guideContentBox');
  if (!box) return;

  if (type === 'ring') {
    box.innerHTML = `
      <table class="admin-table" style="font-size: 0.82rem;">
        <thead>
          <tr><th>Indian Size</th><th>Diameter (mm)</th><th>Circumference (mm)</th><th>How to Measure</th></tr>
        </thead>
        <tbody>
          <tr><td>Size 10</td><td>15.9 mm</td><td>50.0 mm</td><td>Wrap paper strip around finger knuckle</td></tr>
          <tr><td>Size 12</td><td>16.5 mm</td><td>51.9 mm</td><td>Mark point of overlap with pen</td></tr>
          <tr><td>Size 14</td><td>17.2 mm</td><td>54.0 mm</td><td>Standard Women's Solitaire Size</td></tr>
          <tr><td>Size 16</td><td>17.8 mm</td><td>56.0 mm</td><td>Measure with ruler in mm</td></tr>
          <tr><td>Size 18</td><td>18.5 mm</td><td>58.1 mm</td><td>Standard Men's Signet Size</td></tr>
          <tr><td>Size 20</td><td>19.1 mm</td><td>60.0 mm</td><td>Large / Thumb Ring Size</td></tr>
        </tbody>
      </table>
    `;
  } else {
    box.innerHTML = `
      <table class="admin-table" style="font-size: 0.82rem;">
        <thead>
          <tr><th>Bangle / Kada Size</th><th>Inner Diameter (Inches)</th><th>Inner Diameter (mm)</th><th>Ideal For</th></tr>
        </thead>
        <tbody>
          <tr><td>Size 2.2</td><td>2.125 in</td><td>54.0 mm</td><td>Petite Women's Wrists</td></tr>
          <tr><td>Size 2.4</td><td>2.25 in</td><td>57.2 mm</td><td>Standard Women's Size</td></tr>
          <tr><td>Size 2.6</td><td>2.375 in</td><td>60.3 mm</td><td>Medium / Comfort Fit</td></tr>
          <tr><td>Size 2.8</td><td>2.50 in</td><td>63.5 mm</td><td>Standard Men's Solid Kada</td></tr>
          <tr><td>Size 2.10</td><td>2.625 in</td><td>66.7 mm</td><td>Heavy Royal Men's Kada</td></tr>
        </tbody>
      </table>
    `;
  }
}
