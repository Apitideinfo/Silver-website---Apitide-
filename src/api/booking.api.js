import { 
  db, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from '../firebase/firestore';
import { FIRESTORE_COLLECTIONS, BUSINESS } from '../config/constants';

const CONSULTATIONS_COLLECTION = FIRESTORE_COLLECTIONS.CONSULTATIONS;
const SAVINGS_COLLECTION = FIRESTORE_COLLECTIONS.SAVINGS_ENROLLMENTS;
const ORDERS_COLLECTION = FIRESTORE_COLLECTIONS.ORDERS;

export const bookingApi = {
  // Add a consultation/booking request
  async createConsultation(bookingData) {
    const docRef = await addDoc(collection(db, CONSULTATIONS_COLLECTION), {
      ...bookingData,
      createdDate: new Date().toISOString()
    });
    return { id: docRef.id, ...bookingData };
  },

  // Subscribe to live consultations for admin
  subscribeToConsultations(onUpdate, onError) {
    const q = query(collection(db, CONSULTATIONS_COLLECTION), orderBy('createdDate', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(bookings);
    }, onError);
  },

  // Update booking status
  async updateConsultationStatus(bookingId, status) {
    const docRef = doc(db, CONSULTATIONS_COLLECTION, bookingId);
    await updateDoc(docRef, { status });
    return { id: bookingId, status };
  },

  // Delete booking request
  async deleteConsultation(bookingId) {
    const docRef = doc(db, CONSULTATIONS_COLLECTION, bookingId);
    await deleteDoc(docRef);
    return bookingId;
  },

  // Add savings scheme enrollment
  async enrollInSavingsScheme(enrollmentData) {
    const docRef = await addDoc(collection(db, SAVINGS_COLLECTION), {
      ...enrollmentData,
      createdDate: new Date().toISOString(),
      status: 'pending'
    });
    return { id: docRef.id, ...enrollmentData };
  },

  // Create new customer order
  async createOrder(orderData) {
    const invoiceNo = orderData.invoiceNo || orderData.customInvoiceNo || `MCO/${new Date().getFullYear()}/${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const payload = {
      ...orderData,
      invoiceNo,
      invoiceEmailSent: false,
      createdDate: orderData.createdDate || new Date().toISOString(),
      orderStatus: orderData.orderStatus || 'pending'
    };
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), payload);
    return { id: docRef.id, ...payload };
  },

  // Subscribe to live orders
  subscribeToOrders(onUpdate, onError) {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdDate', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(orders);
    }, onError);
  },

  // Fetch all orders once (for manual refresh / instant sync)
  async getOrders() {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Update order status
  async updateOrderStatus(orderId, orderStatus) {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, { orderStatus });
    return { id: orderId, orderStatus };
  },

  // Update order email sent status
  async updateOrderEmailStatus(orderId, emailData = {}) {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(docRef, {
        invoiceEmailSent: emailData.invoiceEmailSent ?? true,
        emailSentAt: emailData.emailSentAt || new Date().toISOString(),
        invoiceEmailRecipient: emailData.invoiceEmailRecipient || '',
        invoiceEmailError: emailData.invoiceEmailError || null
      });
      return { id: orderId, ...emailData };
    } catch (err) {
      console.error('Failed to update order email status in Firestore:', err);
      throw err;
    }
  },

  // Send or resend order confirmation email with attached PDF invoice
  async sendOrderConfirmationEmail(orderData) {
    const orderId = orderData.orderId || orderData.id;
    const recipient = orderData.email || orderData.customerEmail || BUSINESS.EMAIL;
    const invoiceNo = orderData.invoiceNo || orderData.customInvoiceNo || `MCO/${new Date().getFullYear()}/${(orderId || '').slice(0, 8).toUpperCase()}`;

    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'new_order',
        recipient,
        data: {
          orderId,
          invoiceNo,
          name: orderData.recipientName || orderData.name || 'Valued Patron',
          phone: orderData.mobile || orderData.phone || 'N/A',
          email: recipient,
          deliveryType: orderData.deliveryType || 'home',
          storeBranch: orderData.storeBranch || 'Flagship Atelier, Mau',
          address: orderData.address || (orderData.deliveryType === 'store' ? `Store Pickup: ${orderData.storeBranch || 'Showroom'}` : 'Showroom Collection'),
          paymentMethod: orderData.paymentMethod === 'cod' ? 'Cash on Showroom Delivery' : (orderData.paymentMethod || 'Razorpay Online Payment'),
          paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'cod' ? 'PAYMENT ON DELIVERY' : 'PAID'),
          items: orderData.items || [],
          subtotal: orderData.subtotal || Math.round((orderData.total || 0) / 1.03),
          gst: orderData.gst || Math.round((orderData.total || 0) - (orderData.total || 0) / 1.03),
          total: orderData.total || orderData.totalAmount || 0,
          discount: orderData.discount || 0,
          createdDate: orderData.createdDate || new Date().toISOString()
        }
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Email service error: HTTP ${res.status}`);
    }

    const data = await res.json();
    return data;
  },

  // Resend order invoice email and persist status
  async resendOrderInvoiceEmail(order) {
    const orderId = order.id;
    const recipient = order.email || order.customerEmail || BUSINESS.EMAIL;
    const emailResult = await this.sendOrderConfirmationEmail(order);
    await this.updateOrderEmailStatus(orderId, {
      invoiceEmailSent: true,
      emailSentAt: new Date().toISOString(),
      invoiceEmailRecipient: recipient
    });
    return emailResult;
  },

  // 1-Click Client Download Invoice PDF
  async downloadInvoicePdf(orderData) {
    const orderId = orderData.orderId || orderData.id || 'Order';
    const invoiceNo = orderData.invoiceNo || orderData.customInvoiceNo || `MCO/${new Date().getFullYear()}/${orderId.slice(0, 8).toUpperCase()}`;

    const response = await fetch('/api/download-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderData,
        orderId,
        invoiceNo,
        recipientName: orderData.recipientName || orderData.name || 'Valued Patron',
        phone: orderData.mobile || orderData.phone || 'N/A',
        email: orderData.email || orderData.customerEmail || '',
        address: orderData.address || (orderData.deliveryType === 'store' ? `Store Pickup: ${orderData.storeBranch || 'Showroom'}` : 'Showroom Collection'),
        items: orderData.items || [],
        subtotal: orderData.subtotal || Math.round((orderData.total || 0) / 1.03),
        gst: orderData.gst || Math.round((orderData.total || 0) - (orderData.total || 0) / 1.03),
        total: orderData.total || orderData.totalAmount || 0,
        discount: orderData.discount || 0
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to download invoice PDF: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `Invoice_MCO_${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Delete order
  async deleteOrder(orderId) {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
    return orderId;
  }
};
