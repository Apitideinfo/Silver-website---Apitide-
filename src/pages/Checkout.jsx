import React, { useState, useEffect } from 'react';
import { Mail, Download, Truck, Tag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { bookingApi } from '../api/booking.api';
import { requestAndSaveToken } from '../utils/notifications';
import { StorageService } from '../services/StorageService';

const loadRazorpaySDK = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.Razorpay) {
          clearInterval(interval);
          resolve(true);
        } else if (attempts > 30) {
          clearInterval(interval);
          resolve(Boolean(window.Razorpay));
        }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout({ navigateTo, triggerAudio }) {
  const { cartItems, cartTotal, handleUpdateQuantity, handleRemoveFromCart, clearCart } = useCart();

  const [checkoutFlowStep, setCheckoutFlowStep] = useState(1);
  const [checkoutForm, setCheckoutForm] = useState({ method: 'card', name: '', phone: '', address: '' });
  const [deliveryType, setDeliveryType] = useState('home'); // 'home' or 'store'
  const [upiId, setUpiId] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [netbankBank, setNetbankBank] = useState('');
  const [deliveryForm, setDeliveryForm] = useState({
    email: '',
    mobile: '',
    whatsapp: '',
    recipientName: '',
    pincode: '',
    apartment: '',
    street: '',
    locality: '',
    landmark: '',
    storeBranch: 'Main Showroom',
    storeCity: 'Mau'
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [placedOrderTotal, setPlacedOrderTotal] = useState(0);
  const [placedOrderFull, setPlacedOrderFull] = useState(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    loadRazorpaySDK();
  }, []);

  const handleCopyOrderId = () => {
    if (!placedOrderId) return;
    navigator.clipboard?.writeText(placedOrderId);
    setCopiedId(true);
    triggerAudio?.('click');
    setTimeout(() => setCopiedId(false), 3000);
  };

  const handleTrackLive = () => {
    triggerAudio?.('click');
    window.dispatchEvent(new CustomEvent('hrj-open-account', { detail: { tab: 'track', orderId: placedOrderId } }));
  };

  const handleDownloadPlacedInvoice = async () => {
    if (!placedOrderFull && !placedOrderId) return;
    setDownloadingInvoice(true);
    triggerAudio?.('click');
    try {
      const orderToDownload = placedOrderFull || {
        id: placedOrderId,
        orderId: placedOrderId,
        recipientName: deliveryForm.recipientName,
        phone: deliveryForm.mobile,
        email: deliveryForm.email,
        address: deliveryType === 'home'
          ? `${deliveryForm.apartment}, ${deliveryForm.street}, ${deliveryForm.locality}, PIN: ${deliveryForm.pincode}`
          : `Showroom Pickup: ${deliveryForm.storeBranch}`,
        deliveryType,
        storeBranch: deliveryForm.storeBranch,
        paymentMethod: checkoutForm.method === 'cod' ? 'Cash on Showroom Delivery' : 'Razorpay Online Payment',
        total: placedOrderTotal,
        subtotal: Math.round(placedOrderTotal / 1.03),
        gst: Math.round(placedOrderTotal - placedOrderTotal / 1.03)
      };
      await bookingApi.downloadInvoicePdf(orderToDownload);
    } catch (err) {
      console.error("Invoice download error:", err);
      alert("Failed to download invoice PDF. You can also view or print it anytime in Customer Lounge.");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (cartItems.length === 0) return;
    setSubmittingOrder(true);
    const isReady = await loadRazorpaySDK();
    if (!isReady || !window.Razorpay) {
      setSubmittingOrder(false);
      alert("Razorpay payment gateway could not be loaded. Please check your internet connection and try again.");
      return;
    }
    try {
      const orderTotalAmount = cartTotal;
      if (!orderTotalAmount || isNaN(orderTotalAmount) || orderTotalAmount <= 0) {
        throw new Error(`Invalid order amount: ${orderTotalAmount}. Please check your cart items.`);
      }
      const orderAmountPaise = Math.round(orderTotalAmount * 100);

      // Create Razorpay Order
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: orderAmountPaise, currency: 'INR' })
      });

      let orderData;
      try {
        orderData = await res.json();
      } catch (parseErr) {
        orderData = { error: `Server error (${res.status}): ${res.statusText || 'Unable to parse server response'}` };
      }

      if (!res.ok) {
        throw new Error(orderData?.error || `Failed to initialize order (Status ${res.status})`);
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay Key ID (VITE_RAZORPAY_KEY_ID) is not configured in .env');
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MANISH & CO',
        description: `Purchase of ${cartItems.reduce((a, c) => a + c.quantity, 0)} items`,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            // Verify payment signature
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyRes.ok) {
              const verifyErrObj = await verifyRes.json();
              throw new Error(verifyErrObj.error || 'Payment verification failed');
            }

            const verification = await verifyRes.json();

            if (verification.success) {
              const orderPayload = {
                recipientName: deliveryForm.recipientName,
                email: deliveryForm.email,
                mobile: deliveryForm.mobile,
                whatsapp: deliveryForm.whatsapp || '',
                deliveryType,
                storeBranch: deliveryType === 'store' ? deliveryForm.storeBranch : '',
                storeCity: deliveryType === 'store' ? deliveryForm.storeCity : '',
                address: deliveryType === 'home'
                  ? `${deliveryForm.apartment}, ${deliveryForm.street}, ${deliveryForm.locality}, ${deliveryForm.landmark || ''}, PIN: ${deliveryForm.pincode}`
                  : '',
                pincode: deliveryForm.pincode,
                paymentMethod: 'razorpay',
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                paymentStatus: 'paid',
                orderStatus: 'pending',
                items: cartItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  carat: item.carat || '',
                  weight: item.weight || '',
                  desc: item.desc || ''
                })),
                subtotal: Math.round(cartTotal / 1.03),
                gst: Math.round(cartTotal - cartTotal / 1.03),
                total: orderTotalAmount,
                createdDate: new Date().toISOString()
              };

              setPlacedOrderTotal(orderPayload.total);
              const result = await bookingApi.createOrder(orderPayload);
              const completeSavedOrder = { id: result.id, ...orderPayload, invoiceNo: result.invoiceNo };
              setPlacedOrderFull(completeSavedOrder);
              requestAndSaveToken(deliveryForm.mobile).catch(err => console.error("Error registering notification token:", err));

              // Persist order ID and customer profile locally
              try {
                const existingIds = StorageService.get('manish_my_order_ids', StorageService.get('hrj_my_order_ids', []));
                if (!existingIds.includes(result.id)) {
                  StorageService.set('manish_my_order_ids', [result.id, ...existingIds]);
                }
                StorageService.set('manish_customer_profile', {
                  name: deliveryForm.recipientName,
                  mobile: deliveryForm.mobile,
                  email: deliveryForm.email,
                  city: deliveryForm.storeCity || 'Mau',
                  address: deliveryForm.apartment ? `${deliveryForm.apartment}, ${deliveryForm.street}, ${deliveryForm.locality}` : '',
                  pincode: deliveryForm.pincode
                });
              } catch (saveErr) {
                console.warn("Storage save error:", saveErr);
              }

              // Dispatch official GST invoice email with attached PDF to customer
              bookingApi.sendOrderConfirmationEmail({
                ...orderPayload,
                orderId: result.id,
                invoiceNo: result.invoiceNo
              }).then(() => {
                bookingApi.updateOrderEmailStatus(result.id, {
                  invoiceEmailSent: true,
                  emailSentAt: new Date().toISOString(),
                  invoiceEmailRecipient: deliveryForm.email || 'orders@manishandco.com'
                }).catch(e => console.warn("Email status update warning:", e));
              }).catch(emailErr => {
                console.warn("Email dispatch error (order remains safely confirmed):", emailErr);
                bookingApi.updateOrderEmailStatus(result.id, {
                  invoiceEmailSent: false,
                  invoiceEmailError: emailErr.message || 'Dispatch error'
                }).catch(() => {});
              });

              setPlacedOrderId(result.id);
              setOrderPlaced(true);
              clearCart();
            } else {
              alert("Payment verification failed. Please try again.");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            alert(`Signature verification failed: ${verifyErr.message}`);
          } finally {
            setSubmittingOrder(false);
          }
        },
        prefill: {
          name: deliveryForm.recipientName || '',
          email: deliveryForm.email || '',
          contact: deliveryForm.mobile || ''
        },
        theme: { color: '#B8893C' },
        modal: {
          ondismiss: function () {
            setSubmittingOrder(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (failedResp) {
        alert(`Payment failed: ${failedResp.error.description}`);
        setSubmittingOrder(false);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert(`Razorpay Error: ${err.message}`);
      setSubmittingOrder(false);
    }
  };

  const updateCartQuantity = (itemId, amount) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      handleUpdateQuantity(itemId, item.quantity + amount);
    }
  };

  const removeFromCart = (itemId) => {
    handleRemoveFromCart(itemId);
  };

  const handleCartCheckoutSubmit = async () => {
    if (cartItems.length === 0) return;
    setSubmittingOrder(true);
    try {
      const orderPayload = {
        recipientName: deliveryForm.recipientName,
        email: deliveryForm.email,
        mobile: deliveryForm.mobile,
        whatsapp: deliveryForm.whatsapp || '',
        deliveryType,
        storeBranch: deliveryType === 'store' ? deliveryForm.storeBranch : '',
        storeCity: deliveryType === 'store' ? deliveryForm.storeCity : '',
        address: deliveryType === 'home' 
          ? `${deliveryForm.apartment}, ${deliveryForm.street}, ${deliveryForm.locality}, ${deliveryForm.landmark || ''}, PIN: ${deliveryForm.pincode}`
          : '',
        pincode: deliveryForm.pincode,
        paymentMethod: checkoutForm.method,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          carat: item.carat || '',
          weight: item.weight || '',
          desc: item.desc || ''
        })),
        subtotal: Math.round(cartTotal / 1.03),
        gst: Math.round(cartTotal - cartTotal / 1.03),
        total: cartTotal,
        createdDate: new Date().toISOString()
      };

      setPlacedOrderTotal(orderPayload.total);
      const result = await bookingApi.createOrder(orderPayload);
      const completeSavedOrder = { id: result.id, ...orderPayload, invoiceNo: result.invoiceNo };
      setPlacedOrderFull(completeSavedOrder);
      requestAndSaveToken(deliveryForm.mobile).catch(err => console.error("Error registering notification token:", err));

      // Persist order ID and customer profile locally
      try {
        const existingIds = StorageService.get('manish_my_order_ids', StorageService.get('hrj_my_order_ids', []));
        if (!existingIds.includes(result.id)) {
          StorageService.set('manish_my_order_ids', [result.id, ...existingIds]);
        }
        StorageService.set('manish_customer_profile', {
          name: deliveryForm.recipientName,
          mobile: deliveryForm.mobile,
          email: deliveryForm.email,
          city: deliveryForm.storeCity || 'Mau',
          address: deliveryForm.apartment ? `${deliveryForm.apartment}, ${deliveryForm.street}, ${deliveryForm.locality}` : '',
          pincode: deliveryForm.pincode
        });
      } catch (saveErr) {
        console.warn("Storage save error:", saveErr);
      }

      // Dispatch official GST invoice email with attached PDF to customer
      bookingApi.sendOrderConfirmationEmail({
        ...orderPayload,
        orderId: result.id,
        invoiceNo: result.invoiceNo
      }).then(() => {
        bookingApi.updateOrderEmailStatus(result.id, {
          invoiceEmailSent: true,
          emailSentAt: new Date().toISOString(),
          invoiceEmailRecipient: deliveryForm.email || 'orders@manishandco.com'
        }).catch(e => console.warn("Email status update warning:", e));
      }).catch(emailErr => {
        console.warn("Email dispatch error (order remains safely confirmed):", emailErr);
        bookingApi.updateOrderEmailStatus(result.id, {
          invoiceEmailSent: false,
          invoiceEmailError: emailErr.message || 'Dispatch error'
        }).catch(() => {});
      });

      setPlacedOrderId(result.id);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error("Order submission failed:", err);
      alert("Failed to submit order. Please try again.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="bg-[#FAF8F6] min-h-screen py-16 px-4 sm:px-12 flex items-center justify-center font-sans text-gray-800 text-left select-none">
        <div className="max-w-lg w-full bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle gold top line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#B8893C] via-[#E6C687] to-[#B8893C]"></div>
          
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner border border-emerald-200">
            ✓
          </div>
          
          <div className="space-y-1.5">
            <h2 className="serif-luxury text-xl font-bold text-[#0D2B4E] tracking-wide uppercase">
              Order Confirmed &amp; Registered!
            </h2>
            <p className="text-xs text-gray-500">
              Thank you for trusting MANISH &amp; CO. Your order has been registered securely.
            </p>
          </div>

          {/* Prominent Order ID Box with 1-Click Copy */}
          <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5EFE6] border-2 border-dashed border-[#B8893C]/40 rounded-2xl p-4 text-center space-y-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B8893C] block">
              Your Unique Order ID
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 max-w-full">
              <span className="font-mono text-xs sm:text-sm font-bold text-[#0D2B4E] select-all bg-white px-3 py-2 rounded-xl border border-solid border-gray-200 shadow-xs break-all text-center">
                #{placedOrderId}
              </span>
              <button
                onClick={handleCopyOrderId}
                className="px-4 py-2 rounded-xl bg-[#0D2B4E] hover:bg-[#0D2B4E]/90 text-white text-xs font-bold transition-all shadow-sm cursor-pointer border-none flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
                title="Copy Order ID"
              >
                {copiedId ? <span>✓ Copied!</span> : <span>📋 Copy ID</span>}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">
              Save this Order ID or use your phone number to track anytime in Customer Lounge.
            </p>
          </div>

          {/* Email Confirmation Notice Banner */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 text-left flex items-start gap-2.5">
            <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-emerald-900 leading-relaxed font-medium">
              <strong>Official GST Tax Invoice &amp; Live Tracking Link</strong> have been dispatched to{' '}
              <span className="font-bold underline text-emerald-950">{deliveryForm.email || 'your registered email'}</span>.
            </div>
          </div>

          {/* Order Details Breakdown */}
          <div className="bg-gray-50 rounded-2xl p-4 text-xs space-y-2 text-left border border-gray-100 font-medium">
            <div className="flex justify-between text-gray-500">
              <span>Customer Name</span>
              <span className="font-bold text-[#0D2B4E]">{deliveryForm.recipientName}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Contact Mobile</span>
              <span className="font-bold text-[#0D2B4E]">{deliveryForm.mobile}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Method</span>
              <span className="font-bold text-[#0D2B4E] capitalize">
                {deliveryType === 'store' ? `Showroom Pickup (${deliveryForm.storeBranch})` : 'Insured Home Delivery'}
              </span>
            </div>
            <div className="flex justify-between text-gray-500 border-t border-gray-150 pt-2 mt-2">
              <span className="text-[#0D2B4E] font-bold">Total Amount (Incl. GST)</span>
              <span className="font-bold text-base text-[#B8893C]">₹ {placedOrderTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action Buttons: Download PDF Invoice, Track & Back */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownloadPlacedInvoice}
              disabled={downloadingInvoice}
              className="w-full py-3.5 bg-gradient-to-r from-[#B8893C] to-[#E6C687] hover:brightness-110 text-white text-xs uppercase font-black tracking-widest rounded-xl transition-all shadow-md cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {downloadingInvoice ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Generating Tax Invoice PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> <span>Download Tax Invoice (PDF)</span>
                </>
              )}
            </button>

            <button
              onClick={handleTrackLive}
              className="w-full py-3 bg-[#0D2B4E] hover:bg-[#0D2B4E]/90 text-white text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-sm cursor-pointer border-none flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" /> <span>Track Live Order Status</span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-[#0D2B4E] text-xs uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer border-none"
            >
              ← Back to Showroom
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F6] min-h-screen pb-0 font-sans text-gray-800">
      {/* Checkout Header with Progress Bar */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <div onClick={() => navigateTo('home')} className="flex items-center space-x-2 font-serif text-lg font-bold text-[#0D2B4E] tracking-widest cursor-pointer select-none">
          <span>MANISH &amp; CO</span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 text-xs font-semibold select-none">
          <div className="flex flex-col items-center">
            <span className={`${checkoutFlowStep === 1 ? 'text-[#0D2B4E]' : 'text-gray-400'}`}>Cart</span>
            <div className={`w-3.5 h-3.5 rounded-full border-2 mt-1 flex items-center justify-center ${checkoutFlowStep >= 1 ? 'border-[#006361] bg-[#006361]' : 'border-gray-300 bg-white'}`}>
              {checkoutFlowStep > 1 && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
          <div className="w-16 h-[2px]" style={{ backgroundColor: checkoutFlowStep > 1 ? '#006361' : '#E5E7EB' }} />
          <div className="flex flex-col items-center">
            <span className={`${checkoutFlowStep === 2 ? 'text-[#0D2B4E]' : 'text-gray-400'}`}>Delivery</span>
            <div className={`w-3.5 h-3.5 rounded-full border-2 mt-1 flex items-center justify-center ${checkoutFlowStep >= 2 ? 'border-[#006361] bg-[#006361]' : 'border-gray-300 bg-white'}`}>
              {checkoutFlowStep > 2 && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
          <div className="w-16 h-[2px]" style={{ backgroundColor: checkoutFlowStep > 2 ? '#006361' : '#E5E7EB' }} />
          <div className="flex flex-col items-center">
            <span className={`${checkoutFlowStep === 3 ? 'text-[#0D2B4E]' : 'text-gray-400'}`}>Payment</span>
            <div className={`w-3.5 h-3.5 rounded-full border-2 mt-1 flex items-center justify-center ${checkoutFlowStep >= 3 ? 'border-[#006361] bg-[#006361]' : 'border-gray-300 bg-white'}`}>
              {checkoutFlowStep > 3 && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
        </div>

        {/* Secure Badge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 tracking-wide select-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#006361]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="font-bold text-[#006361]">100% SECURE</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ===== LEFT PANEL ===== */}
          <div className="lg:col-span-8 space-y-6">

            {/* ===== STEP 1: CART ===== */}
            {checkoutFlowStep === 1 && (
              <div className="animate-fade-in text-left">
                <h2 className="text-lg font-bold text-[#0D2B4E] mb-6">My Shopping Cart ({cartItems.reduce((a, c) => a + c.quantity, 0)} Item{cartItems.reduce((a, c) => a + c.quantity, 0) !== 1 ? 's' : ''})</h2>

                {cartItems.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                    <p className="text-gray-400 text-sm">Your cart is empty</p>
                    <button onClick={() => navigateTo('collections')} className="mt-4 px-6 py-2 bg-[#0D2B4E] text-white text-xs font-bold rounded-lg cursor-pointer">CONTINUE SHOPPING</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 relative">
                        {/* Product Image */}
                        <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
                          <img 
                            src={item.img || item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80'} 
                            alt="" 
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80';
                            }}
                            className="w-full h-full object-cover" 
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 space-y-2">
                          <h3 className="text-sm font-bold text-[#0D2B4E]">{item.name}</h3>
                          <p className="text-[10px] text-gray-400">Product Code: {item.id}</p>

                          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-gray-500 mt-2">
                            {item.carat && <span><strong className="text-gray-600">Metal:</strong> {item.carat}</span>}
                            {item.weight && <span><strong className="text-gray-600">Weight:</strong> {item.weight}</span>}
                          </div>

                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs text-gray-500">Quantity</span>
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="w-7 h-7 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer text-sm focus:outline-none"
                              >−</button>
                              <span className="px-2 text-xs font-bold text-gray-800">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="w-7 h-7 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer text-sm focus:outline-none"
                              >+</button>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-3 text-[10px] uppercase font-bold tracking-wider">
                            <button onClick={() => removeFromCart(item.id)} className="text-[#c0392b] hover:underline cursor-pointer bg-transparent border-none">REMOVE</button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-base font-bold text-[#0D2B4E]">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}

                    {/* Trust Badges under cart */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap justify-center gap-6 text-[10px] text-gray-500 select-none">
                      <span className="flex items-center gap-1"><span className="text-green-500">✓</span> 30-Day Returnable</span>
                      <span className="flex items-center gap-1"><span className="text-green-500">✓</span> Eligible for Lifetime exchange &amp; Buy back</span>
                      <span className="flex items-center gap-1"><span className="text-green-500">✓</span> Free &amp; Insured Delivery</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== STEP 2: DELIVERY ===== */}
            {checkoutFlowStep === 2 && (
              <div className="animate-fade-in space-y-6 text-left">
                {/* Your Details Section */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-[#0D2B4E]">Your Details</h2>
                    <p className="text-xs text-gray-400 mt-1">Required to Save Cart and Send Order Updates</p>
                  </div>

                  {/* Email & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400 flex-shrink-0"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
                      <div className="flex-1">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Email address</span>
                        <input type="email" required placeholder="your@email.com" value={deliveryForm.email} onChange={(e) => setDeliveryForm({ ...deliveryForm, email: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0 focus:outline-none" />
                      </div>
                    </div>
                    <div className="relative border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400 flex-shrink-0"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" /></svg>
                      <div className="flex-1">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Mobile number</span>
                        <input type="tel" required placeholder="+91 XXXXX XXXXX" value={deliveryForm.mobile} onChange={(e) => setDeliveryForm({ ...deliveryForm, mobile: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0 focus:outline-none" />
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <p className="text-xs text-gray-400">Would you like to receive notifications on WhatsApp?</p>
                  <div className="relative border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400 flex-shrink-0"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" /></svg>
                    <div className="flex-1">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block">WhatsApp Number (Optional)</span>
                      <input type="tel" placeholder="+91" value={deliveryForm.whatsapp} onChange={(e) => setDeliveryForm({ ...deliveryForm, whatsapp: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0 focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* Delivery Type */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#0D2B4E]">Delivery Type</h2>
                    <p className="text-xs text-gray-400 mt-1">Please choose preferred type of delivery.</p>
                  </div>

                  <label className={`flex items-center justify-between border rounded-xl px-4 py-3.5 cursor-pointer transition-all ${deliveryType === 'home' ? 'border-[#006361] bg-[#006361]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="text-xs font-semibold text-[#0D2B4E]">Home Delivery</span>
                    <input type="radio" name="deliveryType" value="home" checked={deliveryType === 'home'} onChange={() => setDeliveryType('home')} className="accent-[#006361]" />
                  </label>

                  <label className={`flex flex-col border rounded-xl px-4 py-3.5 cursor-pointer transition-all ${deliveryType === 'store' ? 'border-[#006361] bg-[#006361]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-[#0D2B4E]">Pick up from store</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">Buy now, pick up from our store at your convenience.</p>
                      </div>
                      <input type="radio" name="deliveryType" value="store" checked={deliveryType === 'store'} onChange={() => setDeliveryType('store')} className="accent-[#006361]" />
                    </div>

                    {/* Store Selection (shown when store is selected) */}
                    {deliveryType === 'store' && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                        <div className="relative border border-gray-200 rounded-lg px-3 py-2">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 block">City</span>
                          <select value={deliveryForm.storeCity} onChange={(e) => setDeliveryForm({ ...deliveryForm, storeCity: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0 cursor-pointer">
                            <option value="">—</option>
                            <option value="Mau">Mau</option>
                            <option value="Varanasi">Varanasi</option>
                            <option value="Lucknow">Lucknow</option>
                          </select>
                        </div>
                        <div className="relative border border-gray-200 rounded-lg px-3 py-2">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Store</span>
                          <select value={deliveryForm.storeBranch} onChange={(e) => setDeliveryForm({ ...deliveryForm, storeBranch: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0 cursor-pointer">
                            <option value="">—</option>
                            <option value="Flagship Boutique, Mau (Sanskriti Bhawan Road)">Flagship Boutique, Mau (Sanskriti Bhawan Road)</option>
                            <option value="City Lounge, Sadar Bazar, Mau">City Lounge, Sadar Bazar, Mau</option>
                          </select>
                        </div>
                        {deliveryForm.storeBranch && (
                          <div className="sm:col-span-2 relative border border-gray-200 rounded-lg px-3 py-2">
                            <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Store Address</span>
                            <p className="text-xs text-gray-700 font-semibold mt-0.5">{deliveryForm.storeBranch}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </label>
                </div>

                {/* Delivery Details (Address Fields) */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#0D2B4E]">Delivery Details</h2>
                    <p className="text-xs text-gray-400 mt-1">We will deliver the order at the below address</p>
                  </div>

                  {/* Recipient Name */}
                  <div className="relative border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400 flex-shrink-0"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <input type="text" required placeholder="Recipient's Name" value={deliveryForm.recipientName} onChange={(e) => setDeliveryForm({ ...deliveryForm, recipientName: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold focus:ring-0 focus:outline-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Recipient Mobile */}
                    <div className="relative border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400 flex-shrink-0"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" /></svg>
                      <div className="flex-1">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Recipient's mobile (optional)</span>
                        <input type="tel" placeholder="+91" value={deliveryForm.recipientMobile} onChange={(e) => setDeliveryForm({ ...deliveryForm, recipientMobile: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0 focus:outline-none" />
                      </div>
                    </div>
                    {/* Pincode */}
                    <div className="relative border border-gray-200 rounded-lg px-3 py-2.5">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Enter Valid Pincode</span>
                      <input type="text" required placeholder="e.g. 334001" maxLength="6" value={deliveryForm.pincode} onChange={(e) => setDeliveryForm({ ...deliveryForm, pincode: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold mt-0.5 focus:ring-0 focus:outline-none" />
                    </div>
                  </div>

                  {deliveryType === 'home' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative border border-gray-200 rounded-lg px-3 py-2.5">
                          <input type="text" required placeholder="Enter complete Apartment/House/Flat No." value={deliveryForm.apartment} onChange={(e) => setDeliveryForm({ ...deliveryForm, apartment: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold focus:ring-0 focus:outline-none" />
                        </div>
                        <div className="relative border border-gray-200 rounded-lg px-3 py-2.5">
                          <input type="text" required placeholder="Enter complete Street/Colony/Area Name" value={deliveryForm.street} onChange={(e) => setDeliveryForm({ ...deliveryForm, street: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold focus:ring-0 focus:outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative border border-gray-200 rounded-lg px-3 py-2.5">
                          <input type="text" required placeholder="Enter complete Locality/Town Name" value={deliveryForm.locality} onChange={(e) => setDeliveryForm({ ...deliveryForm, locality: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold focus:ring-0 focus:outline-none" />
                        </div>
                        <div className="relative border border-gray-200 rounded-lg px-3 py-2.5">
                          <input type="text" placeholder="Landmark (Optional)" value={deliveryForm.landmark} onChange={(e) => setDeliveryForm({ ...deliveryForm, landmark: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold focus:ring-0 focus:outline-none" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* GST Number */}
                  <div className="relative border border-gray-200 rounded-lg px-3 py-2.5">
                    <input type="text" placeholder="GST Number (Optional)" value={deliveryForm.gstNumber} onChange={(e) => setDeliveryForm({ ...deliveryForm, gstNumber: e.target.value })} className="w-full bg-transparent border-none outline-none text-xs text-gray-800 font-semibold focus:ring-0 focus:outline-none" />
                  </div>

                  {/* Billing same as shipping */}
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                    <input type="checkbox" checked={deliveryForm.billingIsSameAsShipping} onChange={(e) => setDeliveryForm({ ...deliveryForm, billingIsSameAsShipping: e.target.checked })} className="accent-[#006361] rounded focus:outline-none" />
                    <span>Billing address is <span className="text-[#006361] font-semibold">same as shipping address</span></span>
                  </label>
                </div>
              </div>
            )}

            {/* ===== STEP 3: PAYMENT ===== */}
            {checkoutFlowStep === 3 && (
              <div className="animate-fade-in text-left">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 space-y-6">
                  <h2 className="text-lg font-bold text-[#0D2B4E]">Choose a Payment Method</h2>

                  <div className="flex flex-col sm:flex-row gap-0">
                    {/* Vertical Tabs */}
                    <div className="flex flex-row sm:flex-col sm:min-w-[140px] border-b sm:border-b-0 sm:border-r border-gray-200 text-left">
                      {[
                        { id: 'card', name: 'Cards' },
                        { id: 'netbanking', name: 'Net Banking' },
                        { id: 'upi', name: 'UPI' },
                        { id: 'cod', name: 'Cash on Delivery' }
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setCheckoutForm({ ...checkoutForm, method: m.id })}
                          className={`text-left px-4 py-3 text-xs font-semibold transition-all cursor-pointer border-none bg-transparent ${checkoutForm.method === m.id ? 'text-[#0D2B4E] bg-white' : 'text-gray-400 hover:text-gray-600'}`}
                          style={{ borderLeft: checkoutForm.method === m.id ? '3px solid #6B4B2E' : '3px solid transparent' }}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 px-4 sm:px-8 py-4 sm:py-2 text-left">
                      <h3 className="text-sm font-bold text-[#0D2B4E] mb-3">
                        Pay with {checkoutForm.method === 'cod' ? 'Cash on Showroom Delivery' : checkoutForm.method === 'card' ? 'Credit / Debit Card' : checkoutForm.method === 'netbanking' ? 'Net Banking' : 'UPI'}
                      </h3>

                      {checkoutForm.method === 'cod' && (
                        <p className="text-xs text-gray-400 leading-relaxed mb-6">
                          Your order will be confirmed and you can pay at the showroom or upon delivery.
                        </p>
                      )}

                      {checkoutForm.method !== 'cod' && (
                        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-2xl border border-solid border-zinc-200/60 mb-6 text-xs text-gray-505 space-y-2">
                          <p className="font-bold text-gray-800 flex items-center gap-1.5">
                            <span className="text-emerald-600">🔒</span> Razorpay Secure Online Payment
                          </p>
                          <p>You can pay via Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), Net Banking, or Mobile Wallets. Razorpay will open a secure window to process your payment.</p>
                          <p className="text-[10px] text-gray-400 italic">Please do not reload or close this page during the transaction.</p>
                        </div>
                      )}

                      <button
                        onClick={checkoutForm.method === 'cod' ? handleCartCheckoutSubmit : handleRazorpayPayment}
                        disabled={submittingOrder}
                        className="w-full sm:w-auto px-16 py-3.5 rounded-lg bg-[#6B4B2E] hover:bg-[#8C6226] text-white text-xs uppercase font-black tracking-widest transition-all shadow-md cursor-pointer border-none font-bold disabled:opacity-55 disabled:cursor-not-allowed"
                      >
                        {submittingOrder ? 'Processing...' : 'PROCEED TO PAY'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT PANEL: ORDER SUMMARY ===== */}
          <div className="lg:col-span-4 space-y-4 text-left">
            {/* Delivery Check (Step 2+) */}
            {checkoutFlowStep >= 2 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0D2B4E]">Delivery check</span>
                <span className="text-xs text-[#6B4B2E] font-semibold cursor-pointer">{deliveryForm.pincode || 'Enter pincode'}</span>
              </div>
            )}

            {/* Order Summary Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#0D2B4E] uppercase tracking-wider">Order Summary</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} Item{cartItems.reduce((a, c) => a + c.quantity, 0) !== 1 ? 's' : ''})</span>
                  <span className="font-bold text-[#0D2B4E]">₹ {Math.round(cartTotal / 1.03).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (3%)</span>
                  <span className="font-bold text-[#0D2B4E]">₹ {Math.round(cartTotal - cartTotal / 1.03).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-[#0D2B4E]">Total Payable</span>
                <span className="text-lg font-black text-[#0D2B4E]">₹ {cartTotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Action Button */}
              {checkoutFlowStep === 1 && (
                <button
                  onClick={() => { if (cartItems.length > 0) setCheckoutFlowStep(2); }}
                  className="w-full py-3.5 rounded-lg bg-[#6B4B2E] hover:bg-[#8C6226] text-white text-xs uppercase font-black tracking-widest transition-all shadow-md cursor-pointer border-none font-bold"
                >
                  PLACE ORDER
                </button>
              )}
              {checkoutFlowStep === 2 && (
                <button
                  onClick={() => {
                    if (deliveryForm.email && deliveryForm.mobile && deliveryForm.recipientName && deliveryForm.pincode) {
                      setCheckoutForm({
                        ...checkoutForm,
                        name: deliveryForm.recipientName,
                        phone: deliveryForm.mobile,
                        address: deliveryType === 'store'
                          ? `Store Pickup: ${deliveryForm.storeBranch}`
                          : `${deliveryForm.apartment}, ${deliveryForm.street}, ${deliveryForm.locality}, ${deliveryForm.landmark || ''}, PIN: ${deliveryForm.pincode}`
                      });
                      setCheckoutFlowStep(3);
                    } else {
                      alert('Please fill in Email, Mobile, Recipient Name, and Pincode.');
                    }
                  }}
                  className="w-full py-3.5 rounded-lg bg-[#6B4B2E] hover:bg-[#8C6226] text-white text-xs uppercase font-black tracking-widest transition-all shadow-md cursor-pointer border-none font-bold"
                >
                  PROCEED TO PAYMENT
                </button>
              )}

              <div className="border-t border-gray-100 pt-3">
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Any Questions?<br />
                  Please call us at <strong className="text-[#0D2B4E]">+91 94516 38680</strong> or <span className="text-[#006361] font-semibold cursor-pointer">Chat with us</span>
                </p>
              </div>
            </div>

            {/* Back Button */}
            {checkoutFlowStep > 1 && (
              <button
                onClick={() => setCheckoutFlowStep(checkoutFlowStep - 1)}
                className="w-full py-3 text-xs text-gray-500 font-bold uppercase tracking-widest border border-gray-200 rounded-xl hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
              >
                ← BACK
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Trust Footer */}
      <div className="w-full bg-[#FAF8F6] border-t border-gray-200 pt-10 pb-6 px-6 sm:px-12 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0D2B4E]">Fine Silver Maison</span>
              <p className="text-[9px] text-gray-400 font-light">Established lineage since 1996</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0D2B4E]">Trusted by Patrons</span>
              <p className="text-[9px] text-gray-400 font-light font-sans">Renowned for purity nationwide</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0D2B4E]">Transparent Pricing</span>
              <p className="text-[9px] text-gray-400 font-light">Guaranteed weight &amp; value tracking</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0D2B4E]">100% Certified Jewellery</span>
              <p className="text-[9px] text-gray-400 font-light">BIS Hallmarked</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-sans select-none">
            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-[8px]">CASH</span>
            <span className="bg-[#1a1f71] text-white px-2 py-1 rounded text-[8px]">VISA</span>
            <span className="bg-[#eb001b] text-white px-2 py-1 rounded text-[8px]">MC</span>
            <span className="bg-[#006fcf] text-white px-2 py-1 rounded text-[8px]">AMEX</span>
            <span className="bg-[#097A44] text-white px-2 py-1 rounded text-[8px]">RuPay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
