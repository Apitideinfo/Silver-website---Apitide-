import React, { useState } from 'react';
import { db } from '../../firebase';
import { bookingApi } from '../../api/booking.api';
import { 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  BadgeIndianRupee,
  Gem,
  Download,
  Mail,
  Send,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../../config/constants';

const safeFormatDateTime = (dt) => {
  if (!dt) return '';
  try {
    if (typeof dt.toDate === 'function') {
      return dt.toDate().toLocaleString('en-IN');
    }
    if (dt.seconds !== undefined) {
      return new Date(dt.seconds * 1000).toLocaleString('en-IN');
    }
    const d = new Date(dt);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString('en-IN');
    }
  } catch (e) {
    console.error(e);
  }
  return '';
};

const getJsDate = (dt) => {
  if (!dt) return new Date(0);
  try {
    if (typeof dt.toDate === 'function') {
      return dt.toDate();
    }
    if (dt.seconds !== undefined) {
      return new Date(dt.seconds * 1000);
    }
    const d = new Date(dt);
    if (!isNaN(d.getTime())) {
      return d;
    }
  } catch (e) {
    console.error(e);
  }
  return new Date(0);
};

export default function AdminOrders({
  orders = [],
  consultations = [],
  savingsEnrollments = [],
  setAdminNotification
}) {
  const [activeSubTab, setActiveSubTab] = useState('orders'); // 'orders', 'consultations', 'schemes'
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSort, setOrderSort] = useState('latest');

  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);
  const [manualInvoiceNo, setManualInvoiceNo] = useState('');
  const [resendingEmailOrderId, setResendingEmailOrderId] = useState(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);

  const handleResendInvoiceEmail = async (order) => {
    setResendingEmailOrderId(order.id);
    try {
      await bookingApi.resendOrderInvoiceEmail(order);
      const targetEmail = order.email || order.customerEmail || 'customer email';
      setAdminNotification?.({ 
        message: `✓ Official Tax Invoice & Order confirmation email sent to ${targetEmail}`, 
        type: 'success' 
      });
    } catch (err) {
      console.error("Resend email error:", err);
      setAdminNotification?.({ 
        message: `Failed to dispatch email: ${err.message}`, 
        type: 'error' 
      });
    } finally {
      setResendingEmailOrderId(null);
    }
  };

  const handleDirectDownloadPdf = async (order) => {
    setDownloadingOrderId(order.id);
    try {
      await bookingApi.downloadInvoicePdf(order);
      setAdminNotification?.({
        message: `✓ Tax Invoice PDF downloaded for Order #${(order.id || '').slice(0, 8).toUpperCase()}`,
        type: 'success'
      });
    } catch (err) {
      console.error("PDF download error:", err);
      // Fallback to direct print window
      handleDownloadInvoice(order);
    } finally {
      setDownloadingOrderId(null);
    }
  };

  const handleOpenInvoiceModal = (order) => {
    setInvoiceModalOrder(order);
    const defaultNo = order.customInvoiceNo || order.invoiceNo || `HRJ/${new Date().getFullYear()}/${(order.id || '').slice(0, 6).toUpperCase()}`;
    setManualInvoiceNo(defaultNo);
  };

  const handleDownloadInvoice = (order, customNo) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to download/print invoices");
      return;
    }

    const orderId = order.id || 'N/A';
    const finalInvoiceNumber = customNo || manualInvoiceNo || order.customInvoiceNo || order.invoiceNo || `#${orderId.slice(0, 8).toUpperCase()}`;
    const dateStr = safeFormatDateTime(order.createdDate || order.date);
    const recipient = order.recipientName || 'Valued Customer';
    const mobile = order.mobile || 'N/A';
    const email = order.email || 'N/A';
    const address = order.address || 'N/A';
    const method = order.paymentMethod?.toUpperCase() || 'COD/UPI';
    const subtotal = order.subtotal || 0;
    const gst = order.gst || 0;
    const total = order.total || order.totalAmount || 0;

    const itemsHTML = (order.items || []).map((item, idx) => `
      <tr style="border-bottom: 1px solid #ECECEC;">
        <td style="padding: 12px 8px; text-align: center;">${idx + 1}</td>
        <td style="padding: 12px 8px;">
          <div style="font-weight: bold; color: #111;">${item.name || 'Signature Item'}</div>
          ${item.desc ? `<div style="font-size: 10px; color: #666; margin-top: 3px;">${item.desc}</div>` : ''}
        </td>
        <td style="padding: 12px 8px; text-align: center;">${item.carat || '22K'} / ${item.weight || 'N/A'}</td>
        <td style="padding: 12px 8px; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 12px 8px; text-align: right;">₹ ${Number(item.price || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: bold;">₹ ${Number((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${finalInvoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #333;
              margin: 0;
              padding: 40px;
              background: #fff;
              -webkit-print-color-adjust: exact;
            }
            .invoice-card {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #EAEAEA;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.02);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #C8A646;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo-section {
              text-align: left;
            }
            .logo-text {
              font-family: 'Cinzel', serif;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 2px;
              color: #1A1A1A;
              line-height: 1.1;
            }
            .logo-subtext {
              font-family: 'Cinzel', serif;
              font-size: 14px;
              font-weight: 600;
              letter-spacing: 3px;
              color: #C8A646;
              margin-top: 4px;
            }
            .company-details {
              font-size: 11px;
              color: #666;
              margin-top: 8px;
              line-height: 1.5;
            }
            .invoice-title-section {
              text-align: right;
            }
            .invoice-title {
              font-family: 'Cinzel', serif;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 1px;
              color: #C8A646;
            }
            .invoice-meta {
              font-size: 12px;
              color: #555;
              margin-top: 10px;
              line-height: 1.6;
            }
            .billing-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              gap: 20px;
            }
            .bill-box {
              flex: 1;
              background: #FAF9F6;
              border-radius: 8px;
              padding: 16px;
              border: 1px solid #F1EFEA;
            }
            .bill-title {
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #8A6623;
              margin-bottom: 8px;
            }
            .bill-details {
              font-size: 12px;
              color: #333;
              line-height: 1.6;
            }
            .table-items {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              font-size: 12px;
            }
            .table-items th {
              background: #12071B;
              color: #fff;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 10px;
              letter-spacing: 1px;
              padding: 10px 8px;
            }
            .total-section {
              display: flex;
              justify-content: flex-end;
              margin-top: 20px;
            }
            .total-box {
              width: 280px;
              font-size: 13px;
              line-height: 2;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #ECECEC;
              padding: 4px 0;
            }
            .grand-total-row {
              display: flex;
              justify-content: space-between;
              font-weight: 800;
              font-size: 16px;
              color: #C8A646;
              padding-top: 8px;
            }
            .footer-note {
              margin-top: 50px;
              border-top: 1px solid #EAEAEA;
              padding-top: 20px;
              text-align: center;
              font-size: 10px;
              color: #888;
              line-height: 1.5;
            }
            @media print {
              body {
                padding: 0;
              }
              .invoice-card {
                border: none;
                box-shadow: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div class="logo-section">
                <div class="logo-text">MANISH & CO</div>
                <div class="logo-subtext">&amp; SONS</div>
                <div class="company-details">
                  BIS Hallmarked Luxury Boutique<br/>
                  Sanskriti Bhawan Road, Sadar Bazar, Mau, Uttar Pradesh (275101)<br/>
                  Contact: +91 9451638680 | manishandco.in@gmail.com<br/>
                  <strong style="color: #111;">State:</strong> 09-Uttar Pradesh
                </div>
              </div>
              <div class="invoice-title-section">
                <div class="invoice-title">TAX INVOICE</div>
                <div class="invoice-meta">
                  <b>Invoice No:</b> ${finalInvoiceNumber.startsWith('#') ? finalInvoiceNumber : `#${finalInvoiceNumber}`}<br/>
                  <b>Date:</b> ${dateStr}<br/>
                  <b>Payment Mode:</b> ${method}
                </div>
              </div>
            </div>

            <div class="billing-section">
              <div class="bill-box">
                <div class="bill-title">Billed To</div>
                <div class="bill-details">
                  <strong>${recipient}</strong><br/>
                  Phone: ${mobile}<br/>
                  Email: ${email}
                </div>
              </div>
              <div class="bill-box">
                <div class="bill-title">Delivery Address</div>
                <div class="bill-details">
                  ${address !== 'N/A' && address !== '' ? address : `Showroom Pickup (${order.storeBranch || 'Mau Flagship Boutique'})`}
                </div>
              </div>
            </div>

            <table class="table-items">
              <thead>
                <tr>
                  <th style="width: 50px; text-align: center;">S.No</th>
                  <th style="text-align: left;">Item Description</th>
                  <th style="width: 120px; text-align: center;">Carat / Weight</th>
                  <th style="width: 60px; text-align: center;">Qty</th>
                  <th style="width: 100px; text-align: right;">Unit Price</th>
                  <th style="width: 120px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-box">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>₹ ${subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div class="total-row">
                  <span>GST (3%)</span>
                  <span>₹ ${gst.toLocaleString('en-IN')}</span>
                </div>
                <div class="grand-total-row">
                  <span>Grand Total</span>
                  <span>₹ ${total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div class="footer-note">
              Thank you for your patronage! All gold jewellery is BIS 916 Hallmarked and certified.<br/>
              <em>This is a computer-generated tax invoice and requires no physical signature.</em>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Update order status callback
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await bookingApi.updateOrderStatus(orderId, newStatus);
      setAdminNotification({ message: `Order status set to: ${newStatus}`, type: 'success' });

      // Retrieve recipientName and mobile from matching order
      const order = (orders || []).find(o => o.id === orderId);
      if (order && order.mobile) {
        fetch('/api/send-order-status-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            newStatus,
            recipientName: order.recipientName || 'Customer',
            mobile: order.mobile
          })
        }).then(res => {
          if (!res.ok) {
            console.error("FCM dispatch API returned error:", res.statusText);
          }
          return res.json();
        }).then(data => {
          console.log("FCM dispatch response:", data);
        }).catch(err => {
          console.error("Failed to fetch FCM dispatch API:", err);
        });
      }
    } catch (err) {
      console.error(err);
      setAdminNotification({ message: 'Failed to update order status.', type: 'error' });
    }
  };

  // Delete an order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to remove this order registration?")) {
      try {
        await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.ORDERS, orderId));
        setAdminNotification({ message: 'Order removed.', type: 'success' });
      } catch (err) {
        console.error(err);
        setAdminNotification({ message: 'Failed to remove order.', type: 'error' });
      }
    }
  };

  // Delete a consultation
  const handleDeleteConsultation = async (id) => {
    if (window.confirm("Are you sure you want to cancel this consultation booking?")) {
      try {
        await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.CONSULTATIONS, id));
        setAdminNotification({ message: 'Consultation booking deleted.', type: 'success' });
      } catch (err) {
        console.error(err);
        setAdminNotification({ message: 'Failed to delete consultation.', type: 'error' });
      }
    }
  };

  // Delete a scheme enrollment
  const handleDeleteScheme = async (id) => {
    if (window.confirm("Delete this scheme enrollment record?")) {
      try {
        await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.SAVINGS_ENROLLMENTS, id));
        setAdminNotification({ message: 'Scheme record deleted.', type: 'success' });
      } catch (err) {
        console.error(err);
        setAdminNotification({ message: 'Failed to delete scheme.', type: 'error' });
      }
    }
  };

  // Filters for checkout orders
  const filteredOrders = orders
    .filter(o => orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter)
    .filter(o => 
      o.recipientName?.toLowerCase().includes(orderSearch.toLowerCase()) || 
      o.mobile?.includes(orderSearch) ||
      o.id?.includes(orderSearch)
    )
    .sort((a, b) => {
      const dateA = getJsDate(a.createdDate || a.date);
      const dateB = getJsDate(b.createdDate || b.date);
      return orderSort === 'latest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="w-full max-w-full overflow-x-hidden text-[#1A1A1A] dark:text-zinc-100 font-sans text-left space-y-4">
      
      {/* Sub Tabs Controls — scrollable horizontally, doesn't expand parent */}
      <div className="-mx-3 sm:mx-0">
        <div className="flex border-b border-solid border-zinc-200 dark:border-zinc-800 gap-4 sm:gap-6 select-none font-bold uppercase tracking-wider text-[10px] sm:text-[11px] mb-4 overflow-x-auto whitespace-nowrap px-3 sm:px-0 scrollbar-none">
          {[
            { id: 'orders', label: 'Bespoke Orders', icon: ShoppingBag },
            { id: 'consultations', label: 'Video Consultations', icon: Calendar },
            { id: 'custom_designs', label: 'Custom Designs', icon: Gem },
            { id: 'schemes', label: 'Savings Scheme (11+1)', icon: BadgeIndianRupee }
          ].map(sub => {
            const Icon = sub.icon;
            const isActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                className={`py-3 border-b-2 border-solid flex items-center gap-1.5 cursor-pointer bg-transparent border-none shrink-0 ${
                  isActive
                    ? 'border-[#C8A646] text-[#C8A646] font-extrabold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER ACTIVE SUB TAB */}
      
      {activeSubTab === 'orders' && (
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-8 space-y-5 shadow-xs w-full overflow-hidden">
          {/* Header Search Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
            <div>
              <h3 className="text-base font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase">Secure Orders Ledger</h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">Manage customer deliveries, track dispatch updates and mark status changes.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-650 dark:text-zinc-350 focus:outline-none cursor-pointer w-full font-sans font-bold"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={orderSort}
                onChange={(e) => setOrderSort(e.target.value)}
                className="bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-650 dark:text-zinc-350 focus:outline-none cursor-pointer w-full font-sans font-bold"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <input
                type="text"
                placeholder="Search Buyer or ID..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs w-full text-zinc-850 dark:text-zinc-150 placeholder-zinc-450 focus:outline-none font-semibold"
              />
            </div>
          </div>

          {/* MOBILE CARD VIEW (< md) */}
          <div className="block md:hidden space-y-3">
            {filteredOrders.length === 0 ? (
              <p className="py-10 text-center text-zinc-450 uppercase tracking-wider font-bold text-xs">No registered orders found</p>
            ) : (
              filteredOrders.map(order => {
                const invoiceNumber = order.invoiceNo || order.customInvoiceNo || `HRJ/${new Date().getFullYear()}/${(order.id || '').slice(0, 6).toUpperCase()}`;
                const isEmailSent = Boolean(order.invoiceEmailSent);

                return (
                  <div key={order.id} className="bg-zinc-50 dark:bg-zinc-900/50 border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
                    {/* Top row: name + status badge */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm truncate">{order.recipientName || 'Anonymous Buyer'}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-zinc-450 font-mono">{order.mobile}</span>
                          {order.email && <span className="text-[9px] text-zinc-400 truncate max-w-[120px]">({order.email})</span>}
                        </div>
                      </div>
                      <select
                        value={order.orderStatus || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`shrink-0 bg-white dark:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider cursor-pointer focus:outline-none ${
                          order.orderStatus === 'delivered'
                            ? 'text-emerald-600'
                            : order.orderStatus === 'pending'
                            ? 'text-amber-500'
                            : 'text-zinc-500'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Invoice & Email Badges Row */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 bg-white dark:bg-zinc-950 p-2 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Inv:</span>
                        <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{invoiceNumber}</span>
                      </div>
                      <div>
                        {isEmailSent ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] flex items-center gap-1">
                            <span>✓</span> Email Sent
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[9px] flex items-center gap-1">
                            <span>⚠️</span> Email Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-zinc-400 font-bold uppercase tracking-wider block">Amount</span>
                        <span className="font-bold text-zinc-850 dark:text-zinc-200 font-sans">₹{(order.total || order.totalAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase tracking-wider block">Delivery</span>
                        <span className="font-semibold capitalize text-zinc-600 dark:text-zinc-400">{order.deliveryType || 'Home'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase tracking-wider block">Order ID</span>
                        <span className="font-mono text-zinc-400">#{order.id?.slice(0, 10)}…</span>
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider block">Date</span>
                        <span className="text-zinc-500 block truncate">{safeFormatDateTime(order.createdDate || order.date)}</span>
                      </div>
                    </div>

                    {/* Items */}
                    {order.items?.length > 0 && (
                      <div className="text-[10px] text-zinc-500 truncate border-t border-solid border-zinc-100 dark:border-zinc-800 pt-2">
                        {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleDirectDownloadPdf(order)}
                        disabled={downloadingOrderId === order.id}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 cursor-pointer border-none text-[10px] font-bold uppercase tracking-wider disabled:opacity-50"
                        title="Download Vector PDF Invoice"
                      >
                        {downloadingOrderId === order.id ? (
                          <span className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>PDF Invoice</span>
                      </button>

                      <button
                        onClick={() => handleResendInvoiceEmail(order)}
                        disabled={resendingEmailOrderId === order.id}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-pointer border-none text-[10px] font-bold uppercase tracking-wider disabled:opacity-50"
                        title="Dispatch / Resend Invoice Email"
                      >
                        {resendingEmailOrderId === order.id ? (
                          <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                        <span>Resend Email</span>
                      </button>

                      <button
                        onClick={() => setSelectedOrderDetails(order)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-350 cursor-pointer border-none text-[10px] font-bold uppercase tracking-wider"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 cursor-pointer border-none text-[10px] font-bold uppercase tracking-wider"
                        title="Delete Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DESKTOP TABLE VIEW (≥ md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-solid border-zinc-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Order &amp; Invoice No</th>
                  <th className="py-2.5">Customer &amp; Email Status</th>
                  <th className="py-2.5">Items</th>
                  <th className="py-2.5">Total Amount</th>
                  <th className="py-2.5">Delivery</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-solid divide-zinc-100 dark:divide-zinc-850">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-zinc-450 uppercase tracking-wider font-bold">No registered orders found</td>
                  </tr>
                ) : (
                  filteredOrders.map(order => {
                    const invoiceNumber = order.invoiceNo || order.customInvoiceNo || `HRJ/${new Date().getFullYear()}/${(order.id || '').slice(0, 6).toUpperCase()}`;
                    const isEmailSent = Boolean(order.invoiceEmailSent);

                    return (
                      <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                        <td className="py-3.5 whitespace-nowrap text-zinc-400 font-mono text-[10px]">
                          {safeFormatDateTime(order.createdDate || order.date)}
                        </td>
                        <td className="py-3.5">
                          <span className="font-mono text-[11px] font-bold text-zinc-900 dark:text-zinc-100 block">
                            #{order.id?.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="font-mono text-[9px] text-[#C8A646] font-semibold block mt-0.5">
                            {invoiceNumber}
                          </span>
                        </td>
                        <td className="py-3.5 max-w-[200px]">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 block truncate">{order.recipientName || 'Anonymous Buyer'}</span>
                          <span className="text-[10px] text-zinc-450 block font-mono">{order.mobile}</span>
                          <div className="mt-1 flex items-center gap-1.5">
                            {isEmailSent ? (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-extrabold"
                                title={`Dispatched to ${order.invoiceEmailRecipient || order.email || 'customer'} at ${order.emailSentAt ? safeFormatDateTime(order.emailSentAt) : 'confirmation'}`}
                              >
                                <span>✓</span> Email Sent
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-extrabold"
                                title={order.invoiceEmailError || "Email has not been dispatched yet"}
                              >
                                <span>⚠️</span> Not Sent
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 text-zinc-500 max-w-[140px] truncate" title={order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}>
                          {order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}
                        </td>
                        <td className="py-3.5 font-bold font-sans text-zinc-850 dark:text-zinc-200 whitespace-nowrap">
                          ₹{(order.total || order.totalAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 capitalize font-semibold text-[11px]">
                          {order.deliveryType || 'home'}
                        </td>
                        <td className="py-3.5 text-center">
                          <select
                            value={order.orderStatus || 'pending'}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`bg-white dark:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider cursor-pointer focus:outline-none ${
                              order.orderStatus === 'delivered'
                                ? 'text-emerald-600'
                                : order.orderStatus === 'pending'
                                ? 'text-amber-500'
                                : 'text-zinc-500'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 text-right whitespace-nowrap space-x-1.5">
                          {/* Resend Email Button */}
                          <button
                            onClick={() => handleResendInvoiceEmail(order)}
                            disabled={resendingEmailOrderId === order.id}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-pointer border-none disabled:opacity-50"
                            title="Resend Tax Invoice & Order Email"
                          >
                            {resendingEmailOrderId === order.id ? (
                              <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin inline-block"></span>
                            ) : (
                              <Mail className="w-4 h-4" />
                            )}
                          </button>

                          {/* 1-Click PDF Download Button */}
                          <button
                            onClick={() => handleDirectDownloadPdf(order)}
                            disabled={downloadingOrderId === order.id}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 cursor-pointer border-none disabled:opacity-50"
                            title="Download Vector PDF Invoice"
                          >
                            {downloadingOrderId === order.id ? (
                              <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin inline-block"></span>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>

                          {/* Print / Custom Invoice Modal Button */}
                          <button
                            onClick={() => handleOpenInvoiceModal(order)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-350 cursor-pointer border-none"
                            title="Customize & Print Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* View Details Button */}
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-350 cursor-pointer border-none"
                            title="View order address details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 cursor-pointer border-none"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'consultations' && (
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-8 space-y-5 shadow-xs w-full overflow-hidden">
          <div className="border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
            <h3 className="text-base font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase">Showroom lounge bookings</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">Track video consultations slots and appointment requests.</p>
          </div>

          {/* MOBILE CARDS */}
          <div className="block md:hidden space-y-3">
            {(() => {
              const onlyConsults = consultations.filter(c => c.type !== 'custom_design');
              if (onlyConsults.length === 0) return <p className="py-10 text-center text-zinc-450 uppercase tracking-wider font-bold text-xs">No consultations booked</p>;
              return onlyConsults.map(c => (
                <div key={c.id} className="bg-zinc-50 dark:bg-zinc-900/50 border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm">{c.name}</span>
                      <span className="text-[10px] text-zinc-450 font-mono block">{c.phone}</span>
                    </div>
                    <span className="shrink-0 px-2 py-1 rounded-lg bg-[#C8A646]/10 text-[#C8A646] text-[9px] font-extrabold uppercase tracking-wider">
                      {c.preferredType || 'Gold Jewellery'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-zinc-400 font-bold uppercase tracking-wider block">Date</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{c.date || safeFormatDateTime(c.createdDate)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-bold uppercase tracking-wider block">Time Slot</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{c.timeSlot || 'Anytime'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteConsultation(c.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 cursor-pointer border-none text-[10px] font-bold uppercase tracking-wider"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Booking
                  </button>
                </div>
              ));
            })()}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-solid border-zinc-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  <th className="py-2.5">Request date</th>
                  <th className="py-2.5">Visitor</th>
                  <th className="py-2.5">Contact</th>
                  <th className="py-2.5">Collection Preference</th>
                  <th className="py-2.5">Preferred Slot</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-solid divide-zinc-100 dark:divide-zinc-850">
                {(() => {
                  const onlyConsults = consultations.filter(c => c.type !== 'custom_design');
                  if (onlyConsults.length === 0) {
                    return (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-zinc-450 uppercase tracking-wider font-bold">No consultations booked</td>
                      </tr>
                    );
                  }
                  return onlyConsults.map(c => (
                    <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                      <td className="py-3.5 whitespace-nowrap text-zinc-450 font-mono text-[10px]">
                        {c.date || safeFormatDateTime(c.createdDate)}
                      </td>
                      <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-100">{c.name}</td>
                      <td className="py-3.5 font-mono">{c.phone}</td>
                      <td className="py-3.5 font-bold text-gold uppercase text-[9px] tracking-wider">{c.preferredType || 'Gold Jewellery'}</td>
                      <td className="py-3.5 text-zinc-500" title={c.timeSlot}>
                        {c.timeSlot || 'Anytime'}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteConsultation(c.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 cursor-pointer border-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'custom_designs' && (
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-8 space-y-5 shadow-xs w-full overflow-hidden">
          <div className="border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
            <h3 className="text-base font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase">Custom Design Requests</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">Track bespoke jewellery sketches and custom style curation submissions.</p>
          </div>

          {/* MOBILE CARDS */}
          <div className="block md:hidden space-y-3">
            {(() => {
              const onlyCustomDesigns = consultations.filter(c => c.type === 'custom_design');
              if (onlyCustomDesigns.length === 0) return <p className="py-10 text-center text-zinc-450 uppercase tracking-wider font-bold text-xs">No custom designs requested</p>;
              return onlyCustomDesigns.map(c => (
                <div key={c.id} className="bg-zinc-50 dark:bg-zinc-900/50 border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm">{c.name}</span>
                      <span className="text-[10px] text-zinc-450 font-mono block">{c.phone}</span>
                    </div>
                    <span className="text-[9px] text-zinc-400 font-mono shrink-0">{safeFormatDateTime(c.createdDate)}</span>
                  </div>
                  {c.description && (
                    <p className="text-[10px] text-zinc-500 leading-relaxed border-t border-solid border-zinc-100 dark:border-zinc-800 pt-2">{c.description}</p>
                  )}
                  {c.imageUrls && c.imageUrls.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1.5 pb-1">
                      {c.imageUrls.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-[#C8A646] hover:underline bg-[#C8A646]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          🖼 Sketch {idx + 1}
                        </a>
                      ))}
                    </div>
                  ) : c.imageUrl && (
                    <a href={c.imageUrl} target="_blank" rel="noopener noreferrer" className="block text-[10px] font-bold text-[#C8A646] hover:underline">
                      🖼 View Sketch / Image
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteConsultation(c.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 cursor-pointer border-none text-[10px] font-bold uppercase tracking-wider"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Request
                  </button>
                </div>
              ));
            })()}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-solid border-zinc-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  <th className="py-2.5">Request date</th>
                  <th className="py-2.5">Visitor</th>
                  <th className="py-2.5">Contact</th>
                  <th className="py-2.5">Bespoke Details</th>
                  <th className="py-2.5">Image / Sketch Reference</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-solid divide-zinc-100 dark:divide-zinc-850">
                {(() => {
                  const onlyCustomDesigns = consultations.filter(c => c.type === 'custom_design');
                  if (onlyCustomDesigns.length === 0) {
                    return (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-zinc-455 uppercase tracking-wider font-bold">No custom designs requested</td>
                      </tr>
                    );
                  }
                  return onlyCustomDesigns.map(c => (
                    <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                      <td className="py-3.5 whitespace-nowrap text-zinc-450 font-mono text-[10px]">
                        {safeFormatDateTime(c.createdDate)}
                      </td>
                      <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-100">{c.name}</td>
                      <td className="py-3.5 font-mono">{c.phone}</td>
                      <td className="py-3.5 text-zinc-500 max-w-xs truncate" title={c.description}>
                        {c.description || '-'}
                      </td>
                      <td className="py-3.5">
                        {c.imageUrls && c.imageUrls.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {c.imageUrls.map((url, idx) => (
                              <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-[#C8A646] font-extrabold hover:underline bg-[#C8A646]/10 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
                                img #{idx + 1}
                              </a>
                            ))}
                          </div>
                        ) : c.imageUrl ? (
                          <a href={c.imageUrl} target="_blank" rel="noopener noreferrer" className="text-[#C8A646] font-bold hover:underline block max-w-[150px] truncate">
                            View image sketch
                          </a>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteConsultation(c.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 cursor-pointer border-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {activeSubTab === 'schemes' && (
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-8 space-y-5 shadow-xs w-full overflow-hidden">
          <div className="border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
            <h3 className="text-base font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase">Gold scheme enrollments</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">Gold Mine 11+1 Installments scheme enrollee directory list.</p>
          </div>

          {/* MOBILE CARDS */}
          <div className="block md:hidden space-y-3">
            {savingsEnrollments.length === 0 ? (
              <p className="py-10 text-center text-zinc-450 uppercase tracking-wider font-bold text-xs">No members enrolled</p>
            ) : (
              savingsEnrollments.map(s => (
                <div key={s.id} className="bg-zinc-50 dark:bg-zinc-900/50 border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm">{s.fullName}</span>
                      <span className="text-[10px] text-zinc-450 font-mono block">{s.mobileNumber}</span>
                    </div>
                    <span className="shrink-0 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-extrabold uppercase tracking-wider border border-solid border-amber-200">11+1 Scheme</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-zinc-400 font-bold uppercase tracking-wider block">Monthly Amount</span>
                      <span className="font-bold text-zinc-850 dark:text-zinc-200 font-sans">₹{(s.monthlyInstallment || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-bold uppercase tracking-wider block">Nominee</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{s.nomineeName || '—'}</span>
                    </div>
                    {s.emailAddress && (
                      <div className="col-span-2">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider block">Email</span>
                        <span className="text-zinc-600 dark:text-zinc-400 truncate block">{s.emailAddress}</span>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="text-zinc-400 font-bold uppercase tracking-wider block">Enrolled On</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{safeFormatDateTime(s.createdDate)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteScheme(s.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 cursor-pointer border-none text-[10px] font-bold uppercase tracking-wider"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Enrollment
                  </button>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-solid border-zinc-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  <th className="py-2.5">Enroll date</th>
                  <th className="py-2.5">Member</th>
                  <th className="py-2.5">Contact details</th>
                  <th className="py-2.5">Nominee</th>
                  <th className="py-2.5">Installment Amount</th>
                  <th className="py-2.5">Term period</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-solid divide-zinc-100 dark:divide-zinc-850">
                {savingsEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-zinc-455 uppercase tracking-wider font-bold">No members enrolled</td>
                  </tr>
                ) : (
                  savingsEnrollments.map(s => (
                    <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                      <td className="py-3.5 whitespace-nowrap text-zinc-400 font-mono text-[10px]">
                        {safeFormatDateTime(s.createdDate)}
                      </td>
                      <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-100">
                        {s.fullName}
                      </td>
                      <td className="py-3.5">
                        <span className="block font-bold">{s.mobileNumber}</span>
                        <span className="text-[9.5px] text-zinc-400 block">{s.emailAddress}</span>
                      </td>
                      <td className="py-3.5">{s.nomineeName || '-'}</td>
                      <td className="py-3.5 font-bold text-zinc-850 dark:text-zinc-200 font-sans">
                        ₹{(s.monthlyInstallment || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5">11+1 Months</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteScheme(s.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 cursor-pointer border-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL OVERLAYS FOR ORDER ADDRESS */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedOrderDetails(null)}></div>
          <div className="relative bg-white dark:bg-zinc-950 border border-solid border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl text-left select-none text-[#0D2B4E] dark:text-zinc-100 z-50">
            <h3 className="serif-luxury text-lg font-bold border-b border-solid border-zinc-100 dark:border-zinc-850 pb-3 mb-4 uppercase">
              Secure Delivery Details
            </h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block">Recipient</span>
                  <span className="text-sm font-bold text-zinc-850 dark:text-zinc-205">{selectedOrderDetails.recipientName}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block">Contact mobile</span>
                  <span className="text-sm font-bold text-zinc-850 dark:text-zinc-205">{selectedOrderDetails.recipientMobile || selectedOrderDetails.mobile}</span>
                </div>
              </div>

              {selectedOrderDetails.deliveryType === 'store' ? (
                <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-solid border-zinc-200 dark:border-zinc-800">
                  <span className="text-[9px] uppercase tracking-wider text-[#C8A646] font-bold block mb-1">Pick up showroom selected</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{selectedOrderDetails.storeBranch}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Location: {selectedOrderDetails.storeCity}</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 block">Delivery Address</span>
                    <p className="text-zinc-800 dark:text-zinc-200 mt-1 leading-relaxed">
                      Flat/Colony: {selectedOrderDetails.apartment}, {selectedOrderDetails.street}<br />
                      Landmark: {selectedOrderDetails.landmark || 'none'}<br />
                      City: {selectedOrderDetails.city} - {selectedOrderDetails.pincode}
                    </p>
                  </div>
                </div>
              )}

              {/* Items checklist detail */}
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-2">Order Items summary</span>
                <div className="space-y-2 border-t border-solid border-zinc-100 dark:border-zinc-850 pt-2.5 max-h-36 overflow-y-auto pr-1">
                  {selectedOrderDetails.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px]">
                      <span>{it.name} <strong className="text-zinc-400">x{it.quantity}</strong></span>
                      <span className="font-bold font-sans">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-955 text-[10px] uppercase font-bold tracking-widest cursor-pointer border-none font-bold text-center"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Type Invoice Number Generator Modal */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181820] border border-solid border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-scale-up text-left">
            <div className="flex items-start justify-between border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C8A646] block mb-1">
                  Tax Invoice Generator
                </span>
                <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                  Generate Invoice for Order
                </h3>
              </div>
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Order Details Brief */}
            <div className="bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400 font-medium">Customer:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{invoiceModalOrder.recipientName || 'Valued Client'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-medium">Order Total:</span>
                <span className="font-mono font-extrabold text-[#C8A646]">₹{Number(invoiceModalOrder.total || invoiceModalOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-medium">GSTIN:</span>
                <span className="font-mono font-bold text-zinc-600 dark:text-zinc-400">08AASFH1262R1ZM</span>
              </div>
            </div>

            {/* Manual Invoice Number Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                Invoice Number (Manual Type / Custom Edit)
              </label>
              <input
                type="text"
                value={manualInvoiceNo}
                onChange={(e) => setManualInvoiceNo(e.target.value)}
                placeholder="e.g. HRJ/2026/001 or #LWXDMSJL"
                className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-900 border border-solid border-zinc-300 dark:border-zinc-700 rounded-xl font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#C8A646]"
              />
              <p className="text-[10px] text-zinc-400 font-medium">
                You can enter any custom invoice number format. It will be printed on the official GST invoice.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInvoiceModalOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-solid border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 cursor-pointer bg-transparent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadInvoice(invoiceModalOrder, manualInvoiceNo);
                  setInvoiceModalOrder(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A646] to-[#E6C687] text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:brightness-105 cursor-pointer border-none"
              >
                Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
