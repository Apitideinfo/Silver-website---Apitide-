import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from './config/constants';
import { useAuth } from './hooks/useAuth';
import { useRates } from './hooks/useRates';
import { useProducts } from './hooks/useProducts';

// Layout & Subcomponents imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCustomers from './pages/admin/AdminCustomers';
import GoldRateManagement from './pages/admin/GoldRateManagement';
import AdminSecurity from './pages/admin/AdminSecurity';
import { StorageService } from './services/StorageService';

// Forms imports
import LoginForm from './forms/LoginForm';
import hrLogo from './assets/logo.png';
import { Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from './components/Loader';


// Luxury branding assets
import luxuryArchBg from './assets/heritage_palace_interior.png';
import goldKada from './assets/gold_kada.png';
import diamondBracelet from './assets/diamond_bracelet.png';
import emeraldSovereignRing from './assets/emerald_sovereign_ring.png';



export default function Admin() {
  const { currentUser, adminRole, setAdminRole, setLocalAdminUser, logout, loading } = useAuth();
  const { goldRate24k, silverRate1kg } = useRates();
  const { products, categories } = useProducts();

  const [activeTab, setActiveTab] = useState('dashboard');

  // Authentication states
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Database collections lists
  const [orders, setOrders] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [savingsEnrollments, setSavingsEnrollments] = useState([]);

  // Toast / System Alerts
  const [adminNotification, setAdminNotification] = useState({ message: '', type: 'success' });
  const [showNotifications, setShowNotifications] = useState(false);
  const [dismissedNotifIds, setDismissedNotifIds] = useState([]);

  // Admin panel is always light/white theme — remove dark class on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Auth Login submission — Dynamic credentials verification
  const handleLoginSubmit = async ({ email, password }) => {
    setLoginSubmitting(true);
    setLoginError('');
    try {
      const lowerEmail = (email || '').trim().toLowerCase();
      const trimmedPass = (password || '').trim();

      if (!lowerEmail || !trimmedPass) {
        throw new Error('Please enter both email and password.');
      }

      // 1. Primary: Authenticate via Firebase Authentication
      try {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth, lowerEmail, trimmedPass);
        const role = lowerEmail.includes('manager') ? 'Showroom Manager' : 'Super Admin';
        setAdminRole(role);
        setAdminNotification({ message: 'Welcome to MANISH & CO Vault!', type: 'success' });
        return;
      } catch (fbErr) {
        // If Firebase email/password auth fails, check configured database vault password
      }

      // 2. Dynamic check against Firestore admin security doc or saved vault password
      let dynamicVaultPass = StorageService.get('manish_admin_password') || StorageService.get('hrj_admin_password');
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const secRef = doc(db, FIRESTORE_COLLECTIONS.ADMIN_SETTINGS, 'security');
        const secSnap = await getDoc(secRef);
        if (secSnap.exists()) {
          const secData = secSnap.data();
          if (secData.passwordHash) {
            try {
              dynamicVaultPass = atob(secData.passwordHash);
            } catch {
              // ignore decode error
            }
          }
        }
      } catch (secErr) {
        console.warn('Could not read remote admin security record:', secErr);
      }

      const validVaultPass = dynamicVaultPass || 'admin123';
      if (trimmedPass === validVaultPass) {
        try {
          const { signInAnonymously } = await import('firebase/auth');
          await signInAnonymously(auth);
        } catch {
          // optional anonymous session
        }

        const role = lowerEmail.includes('manager') ? 'Showroom Manager' : 'Super Admin';
        if (setLocalAdminUser) {
          setLocalAdminUser({
            email: lowerEmail,
            uid: 'admin_vault_' + Date.now(),
            role,
            isSuperAdmin: true
          });
        }
        setAdminRole(role);
        setAdminNotification({ message: 'Welcome to MANISH & CO Vault!', type: 'success' });
        return;
      }

      throw new Error('Invalid vault credentials. Verification failed.');
    } catch (err) {
      console.error('Login Error:', err);
      setLoginError(err.message || 'Invalid vault credentials. Verification failed.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Sync databases collections list (Realtime listeners)
  useEffect(() => {
    if (!currentUser) return;

    // Listen to orders
    const unsubscribeOrders = onSnapshot(
      collection(db, FIRESTORE_COLLECTIONS.ORDERS),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
      },
      (err) => console.error("Orders sync error:", err)
    );

    // Listen to consultations
    const unsubscribeConsults = onSnapshot(
      collection(db, FIRESTORE_COLLECTIONS.CONSULTATIONS),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setConsultations(data);
      },
      (err) => console.error("Consultations sync error:", err)
    );

    // Listen to savings schemes
    const unsubscribeSavings = onSnapshot(
      collection(db, FIRESTORE_COLLECTIONS.SAVINGS_ENROLLMENTS),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSavingsEnrollments(data);
      },
      (err) => console.error("Savings sync error:", err)
    );

    return () => {
      unsubscribeOrders();
      unsubscribeConsults();
      unsubscribeSavings();
    };
  }, [currentUser]);

  // Dynamic dropdown notification counters
  const activeAlerts = React.useMemo(() => {
    const list = [];

    // Unhandled consults
    consultations.forEach(c => {
      list.push({
        id: `c-${c.id}`,
        title: ' Consultation Lounge Booking',
        desc: `Visitor ${c.name} has requested a slot for ${c.preferredType || 'consultation'}.`,
        time: c.createdDate || c.date || new Date().toISOString(),
        targetTab: 'orders',
        type: 'consultation',
        raw: c
      });
    });

    // Unhandled orders
    orders
      .filter(o => o.orderStatus === 'pending')
      .forEach(o => {
        list.push({
          id: `o-${o.id}`,
          title: ' Pending Order Registry',
          desc: `Buyer ${o.recipientName || o.name || 'Anonymous'} has registered a bespoke purchase.`,
          time: o.createdDate || o.date || new Date().toISOString(),
          targetTab: 'orders',
          type: 'order',
          raw: o
        });
      });

    return list.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [orders, consultations]);

  // Filter out dismissed notifications
  const visibleAlerts = activeAlerts.filter(n => !dismissedNotifIds.includes(n.id));

  // Mark all notifications as read (dismiss them from the panel)
  const markAllRead = () => {
    setDismissedNotifIds(prev => [...new Set([...prev, ...activeAlerts.map(n => n.id)])]);
    setShowNotifications(false);
  };

  // Handle Logout
  const handleAdminLogout = async () => {
    if (window.confirm("Lock vault controls and log out?")) {
      await logout();
    }
  };

  if (loading) {
    return <Loader />;
  }

  // If not logged in as a credentialed admin user with an allocated role, render login card
  const isAuthorizedAdmin = currentUser && adminRole;

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center lg:justify-end lg:pr-[10%] relative overflow-y-auto py-8 sm:py-12 font-sans select-none text-[#2F2F2F] admin-login-bg">
        <style>{`
          .admin-login-bg {
            background-color: #FCFAF6;
          }
          @media (min-width: 1024px) {
            .admin-login-bg {
              background-image: url(${luxuryArchBg});
              background-size: 100% 100%;
              background-repeat: no-repeat;
            }
          }
          @keyframes luxury-float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes luxury-float-reverse {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(6px) rotate(-1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .animate-luxury-float {
            animation: luxury-float 12s ease-in-out infinite;
          }
          .animate-luxury-float-reverse {
            animation: luxury-float-reverse 14s ease-in-out infinite;
          }
          .gold-metallic-text {
            background: linear-gradient(135deg, #A88038 0%, #F3D9A4 50%, #A88038 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}</style>

        {/* Ambient premium lights and glows (Very soft golden glows) */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#D5A529]/4 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-[#D68EC7]/3 blur-[140px] pointer-events-none" />

        {/* Main glassmorphism card (760px wide, 32px border radius, 64px padding) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-[92%] sm:max-w-[560px] lg:max-w-[640px] bg-white/88 border border-white/60 backdrop-blur-[24px] rounded-[24px] sm:rounded-[32px] p-5 sm:p-10 lg:p-12 shadow-2xl flex flex-col items-center text-center relative z-10 lg:mr-[2%]"
        >

          {/* Top floating white rounded square with gold lock icon */}
          <div className="relative mb-8">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#D5A529]/20 to-[#D68EC7]/25 rounded-[24px] blur-xl opacity-90" />
            <div className="w-16 h-16 rounded-[20px] bg-white border border-[#E8E3DA]/60 shadow-[0_8px_20px_rgba(0,0,0,0.04)] flex items-center justify-center relative z-10">
              <Lock className="w-6 h-6 text-[#D5A529]" />
            </div>
          </div>

          {/* Form Heading & details */}
          <div className="space-y-3 mb-8">
            <h2 className="text-[34px] font-extrabold tracking-tight text-[#2F2F2F] font-serif">
              Welcome Back
            </h2>
            <p className="text-xs text-[#8D8D8D] font-medium leading-relaxed max-w-sm mx-auto">
              Sign in to access your <span className="gold-metallic-text font-bold">MANISH & CO</span> Vault Console
            </p>
          </div>

          {/* Login fields widget */}
          <LoginForm
            onSubmit={handleLoginSubmit}
            submitting={loginSubmitting}
            error={loginError}
          />

          {/* Divider connection */}
          <div className="w-full flex items-center justify-center gap-4 mt-8 select-none">
            <div className="h-[1px] flex-1 bg-[#E8E3DA]/70" />
            <div className="flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#8D8D8D]">
              <Lock className="w-3 h-3 text-[#D5A529]" />
              <span>Secure &amp; Encrypted Connection</span>
            </div>
            <div className="h-[1px] flex-1 bg-[#E8E3DA]/70" />
          </div>

        </motion.div>
      </div>
    );
  }



  // Render vault workspace tabs layout
  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      adminUser={currentUser}
      adminRole={adminRole}
      handleAdminLogout={handleAdminLogout}
      darkMode={false}
      setDarkMode={() => { }}
      notifications={visibleAlerts}
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      markAllRead={markAllRead}
      adminNotification={adminNotification}
      setAdminNotification={setAdminNotification}
    >
      {/* Dynamic Tab Renderer */}
      {activeTab === 'dashboard' && (
        <AdminDashboard
          products={products}
          orders={orders}
          consultations={consultations}
          goldRate={goldRate24k}
          silverRate={silverRate1kg}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'products' && (
        <AdminProducts
          products={products}
          categories={categories}
          setAdminNotification={setAdminNotification}
        />
      )}

      {activeTab === 'inventory' && (
        <AdminCategories
          categories={categories}
          setAdminNotification={setAdminNotification}
        />
      )}

      {activeTab === 'orders' && (
        <AdminOrders
          orders={orders}
          consultations={consultations}
          savingsEnrollments={savingsEnrollments}
          setAdminNotification={setAdminNotification}
        />
      )}

      {activeTab === 'customers' && (
        <AdminCustomers
          orders={orders}
          consultations={consultations}
          savingsEnrollments={savingsEnrollments}
        />
      )}

      {activeTab === 'pricing' && (
        <GoldRateManagement
          setAdminNotification={setAdminNotification}
          adminUser={currentUser}
        />
      )}

      {activeTab === 'security' && (
        <AdminSecurity
          adminUser={currentUser}
          adminRole={adminRole}
          setAdminNotification={setAdminNotification}
        />
      )}
    </AdminLayout>
  );
}
