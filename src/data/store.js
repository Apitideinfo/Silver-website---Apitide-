// ==========================================================================
// MANISH & CO – Fine Silver Jewellery
// Reactive Store & LocalStorage Persistence Engine
// ==========================================================================

import { PRODUCTS_DATA, COUPONS_DATA } from './products.js';

const STORAGE_KEYS = {
  PRODUCTS: 'mco_products_v1',
  CART: 'mco_cart_v1',
  WISHLIST: 'mco_wishlist_v1',
  ORDERS: 'mco_orders_v1',
  CUSTOM_LEADS: 'mco_custom_leads_v1',
  USER: 'mco_user_v1',
  RATES: 'mco_silver_rates_v1'
};

// Initial Seed Orders for Tracking & Admin demo
const INITIAL_ORDERS = [
  {
    id: "MCO-8941",
    date: "18 Oct 2026, 14:32",
    customer: {
      name: "Rohit Malhotra",
      email: "rohit.m@example.com",
      phone: "+91 98201 44521",
      address: "B-402, Imperial Towers, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050"
    },
    items: [
      {
        id: "rng-001",
        title: "The Solitaire Empress 925 Sterling Silver Ring",
        price: 3499,
        weight: 4.85,
        qty: 1,
        size: "14 (17.2 mm)",
        image: "./public/images/hallmark-ring.jpg"
      }
    ],
    summary: {
      subtotal: 3499,
      discount: 349.9,
      couponCode: "ROYAL10",
      giftPackaging: true,
      giftPackagingCost: 250,
      shipping: 0,
      total: 3399.1,
      totalWeight: 4.85
    },
    paymentMethod: "UPI (Google Pay)",
    status: "Shipped", // Confirmed, Processing, Shipped, Delivered
    courier: "Blue Dart Express Air",
    trackingNumber: "BD-94516386",
    timeline: [
      { status: "Order Confirmed", time: "18 Oct 2026, 14:32", desc: "Payment verified via UPI" },
      { status: "BIS 925 Hallmarking Inspection", time: "18 Oct 2026, 16:45", desc: "Assayed & certified with HUID" },
      { status: "Signature Linen Box Packed", time: "19 Oct 2026, 10:15", desc: "Sealed with M&Co wax seal & certificate" },
      { status: "Dispatched via Blue Dart Air", time: "19 Oct 2026, 15:30", desc: "In transit to Mumbai Hub (AWB #BD-94516386)" }
    ]
  },
  {
    id: "MCO-7820",
    date: "16 Oct 2026, 11:20",
    customer: {
      name: "Ananya Sharma",
      email: "ananya.sharma@example.com",
      phone: "+91 94516 38680",
      address: "Civil Lines, Near Clock Tower",
      city: "Mau",
      state: "Uttar Pradesh",
      pincode: "275101"
    },
    items: [
      {
        id: "ear-001",
        title: "Royal Heritage 925 Silver Pearl Drop Jhumkas",
        price: 4999,
        weight: 16.70,
        qty: 1,
        size: "Standard",
        image: "./public/images/heritage-jhumkas.jpg"
      }
    ],
    summary: {
      subtotal: 4999,
      discount: 500,
      couponCode: "FIRST925",
      giftPackaging: true,
      giftPackagingCost: 250,
      shipping: 0,
      total: 4749,
      totalWeight: 16.70
    },
    paymentMethod: "Cash on Delivery",
    status: "Delivered",
    courier: "Delhivery Hand Express",
    trackingNumber: "DL-27510188",
    timeline: [
      { status: "Order Confirmed", time: "16 Oct 2026, 11:20", desc: "COD verified by SMS" },
      { status: "Hallmarked & Wax Sealed", time: "16 Oct 2026, 15:10", desc: "Quality verified" },
      { status: "Out for Delivery", time: "17 Oct 2026, 09:30", desc: "Courier partner en route" },
      { status: "Delivered", time: "17 Oct 2026, 13:45", desc: "Handed over to patron" }
    ]
  }
];

// Initial Seed Custom Jewellery Lead
const INITIAL_CUSTOM_LEADS = [
  {
    id: "CST-101",
    date: "19 Oct 2026, 11:15",
    clientName: "Devendra Pratap Singh",
    clientPhone: "+91 99182 33412",
    jewelType: "Men's Royal Engraved Kada",
    finish: "Antique Oxidised Heritage Finish",
    engravingText: "JAI SHREE RAM",
    weight: "Heavy Heritage (25 - 60 grams)",
    budget: "₹12,000 - ₹25,000",
    notes: "Solid 925 silver kada with deep floral carving around the edges.",
    status: "New Lead"
  }
];

class StoreEngine {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    // Products
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(PRODUCTS_DATA));
    }
    // Cart
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify({
        items: [],
        giftPackaging: false,
        coupon: null
      }));
    }
    // Wishlist
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(["rng-001", "ear-001"]));
    }
    // Orders
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    // Custom Leads
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOM_LEADS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LEADS, JSON.stringify(INITIAL_CUSTOM_LEADS));
    }
    // Silver Rates
    if (!localStorage.getItem(STORAGE_KEYS.RATES)) {
      localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify({
        rate925: 98.50,
        rate24k: 102.50,
        lastUpdated: "Today, 10:00 AM"
      }));
    }
  }

  notify(event, payload = {}) {
    window.dispatchEvent(new CustomEvent('mco:statechange', {
      detail: { type: event, ...payload }
    }));
  }

  // --- PRODUCTS ---
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || PRODUCTS_DATA;
    } catch {
      return PRODUCTS_DATA;
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  addProduct(newProduct) {
    const products = this.getProducts();
    const product = {
      ...newProduct,
      id: "mco-prod-" + Date.now(),
      sku: "MCO-" + Math.floor(1000 + Math.random() * 9000),
      rating: 5.0,
      reviewsCount: 1,
      gallery: [newProduct.image]
    };
    products.unshift(product);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notify('products:updated');
    return product;
  }

  updateProduct(id, updates) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notify('products:updated');
      return products[index];
    }
    return null;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notify('products:updated');
  }

  // --- CART ---
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || { items: [], giftPackaging: false, coupon: null };
    } catch {
      return { items: [], giftPackaging: false, coupon: null };
    }
  }

  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notify('cart:updated', { cart: this.getCartCalculations() });
  }

  addToCart(product, qty = 1, size = "Standard", options = {}) {
    const cart = this.getCart();
    const existingIndex = cart.items.findIndex(
      item => item.id === product.id && item.size === size
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].qty += qty;
    } else {
      cart.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        mrp: product.mrp,
        weight: product.weight,
        purity: product.purity,
        image: product.image,
        qty: qty,
        size: size,
        ...options
      });
    }

    this.saveCart(cart);
  }

  updateCartQty(id, size, delta) {
    const cart = this.getCart();
    const index = cart.items.findIndex(item => item.id === id && item.size === size);
    if (index > -1) {
      cart.items[index].qty += delta;
      if (cart.items[index].qty <= 0) {
        cart.items.splice(index, 1);
      }
      this.saveCart(cart);
    }
  }

  removeFromCart(id, size) {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => !(item.id === id && item.size === size));
    this.saveCart(cart);
  }

  setCartGiftPackaging(enable) {
    const cart = this.getCart();
    cart.giftPackaging = !!enable;
    this.saveCart(cart);
  }

  applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    const couponDef = COUPONS_DATA[cleanCode];
    if (!couponDef) {
      return { success: false, message: "Invalid coupon code. Try 'ROYAL10' or 'FIRST925'." };
    }

    const cart = this.getCart();
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (subtotal < couponDef.minOrder) {
      return {
        success: false,
        message: `Minimum order value for ${cleanCode} is ₹${couponDef.minOrder.toLocaleString('en-IN')}.`
      };
    }

    let discountAmount = 0;
    if (couponDef.type === 'percent') {
      discountAmount = (subtotal * couponDef.value) / 100;
    } else {
      discountAmount = couponDef.value;
    }

    cart.coupon = {
      code: cleanCode,
      label: couponDef.label,
      discount: discountAmount
    };

    this.saveCart(cart);
    return { success: true, message: `Coupon ${cleanCode} applied successfully! Saved ₹${discountAmount.toLocaleString('en-IN')}` };
  }

  removeCoupon() {
    const cart = this.getCart();
    cart.coupon = null;
    this.saveCart(cart);
  }

  clearCart() {
    this.saveCart({ items: [], giftPackaging: false, coupon: null });
  }

  getCartCalculations() {
    const cart = this.getCart();
    const subtotal = cart.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const totalWeight = cart.items.reduce((sum, i) => sum + (i.weight * i.qty), 0);
    const totalQty = cart.items.reduce((sum, i) => sum + i.qty, 0);

    const giftBoxCost = cart.giftPackaging ? 250 : 0;
    
    // Free shipping threshold ₹1,999
    const freeShippingThreshold = 1999;
    const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    let discount = 0;
    if (cart.coupon) {
      // Re-validate coupon amount based on current subtotal
      const couponDef = COUPONS_DATA[cart.coupon.code];
      if (couponDef && subtotal >= couponDef.minOrder) {
        discount = couponDef.type === 'percent'
          ? (subtotal * couponDef.value) / 100
          : couponDef.value;
      }
    }

    const total = Math.max(0, subtotal - discount + giftBoxCost + shipping);

    return {
      items: cart.items,
      totalQty,
      subtotal,
      totalWeight: Number(totalWeight.toFixed(2)),
      giftPackaging: cart.giftPackaging,
      giftBoxCost,
      shipping,
      freeShippingThreshold,
      amountNeededForFreeShipping,
      coupon: cart.coupon,
      discount,
      total
    };
  }

  // --- WISHLIST ---
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    } catch {
      return [];
    }
  }

  isInWishlist(id) {
    return this.getWishlist().includes(id);
  }

  toggleWishlist(id) {
    let list = this.getWishlist();
    let isAdded = false;
    if (list.includes(id)) {
      list = list.filter(item => item !== id);
    } else {
      list.push(id);
      isAdded = true;
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    this.notify('wishlist:updated', { id, isAdded, count: list.length });
    return isAdded;
  }

  getWishlistProducts() {
    const ids = this.getWishlist();
    const all = this.getProducts();
    return all.filter(p => ids.includes(p.id));
  }

  // --- ORDERS ---
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  }

  getOrderById(idOrPhone) {
    const orders = this.getOrders();
    const q = (idOrPhone || '').trim().toLowerCase();
    return orders.find(o => 
      o.id.toLowerCase() === q ||
      o.customer.phone.replace(/\D/g, '') === q.replace(/\D/g, '') ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === q)
    ) || null;
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const orderId = "MCO-" + Math.floor(1000 + Math.random() * 9000);
    const trackingNum = "BD-" + Math.floor(10000000 + Math.random() * 90000000);

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      customer: orderData.customer,
      items: orderData.items,
      summary: orderData.summary,
      paymentMethod: orderData.paymentMethod,
      status: "Confirmed",
      courier: "Blue Dart Express Air",
      trackingNumber: trackingNum,
      timeline: [
        { status: "Order Confirmed", time: "Just now", desc: "Payment verified & insured coverage active" },
        { status: "Hallmark Purity Verification", time: "Pending", desc: "Inspection by quality assayer" },
        { status: "Signature Linen Packaging", time: "Pending", desc: "Wax seal stamping in progress" },
        { status: "Dispatched via Insured Air", time: "Pending", desc: "AWB #" + trackingNum }
      ]
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.clearCart();
    this.notify('orders:updated', { order: newOrder });
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      // Add timeline stamp
      const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      order.timeline.push({
        status: `Status updated to ${newStatus}`,
        time: nowStr,
        desc: "Merchant system update"
      });
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notify('orders:updated');
      return order;
    }
    return null;
  }

  // --- CUSTOM INQUIRIES ---
  getCustomLeads() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_LEADS)) || INITIAL_CUSTOM_LEADS;
    } catch {
      return INITIAL_CUSTOM_LEADS;
    }
  }

  addCustomLead(leadData) {
    const leads = this.getCustomLeads();
    const lead = {
      id: "CST-" + Math.floor(100 + Math.random() * 900),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...leadData,
      status: "New Lead"
    };
    leads.unshift(lead);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LEADS, JSON.stringify(leads));
    this.notify('custom:updated', { lead });
    return lead;
  }

  // --- AUTH / USER ---
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    } catch {
      return null;
    }
  }

  login(userData) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    this.notify('user:updated', { user: userData });
    return userData;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    this.notify('user:updated', { user: null });
  }

  // --- SILVER RATES ---
  getRates() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RATES)) || { rate925: 98.50, rate24k: 102.50 };
    } catch {
      return { rate925: 98.50, rate24k: 102.50 };
    }
  }

  setRates(rate925, rate24k) {
    const rates = {
      rate925: Number(rate925),
      rate24k: Number(rate24k),
      lastUpdated: "Just updated"
    };
    localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(rates));
    this.notify('rates:updated', { rates });
    return rates;
  }
}

export const store = new StoreEngine();
