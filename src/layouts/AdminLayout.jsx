import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Check, 
  X,
  LayoutDashboard, 
  Gem, 
  Boxes, 
  ShoppingBag, 
  Users,
  TrendingUp,
  KeyRound,
  Menu,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import hrLogo from '../assets/logo.png';

export default function AdminLayout({
  children,
  activeTab,
  setActiveTab,
  adminUser,
  adminRole,
  handleAdminLogout,
  darkMode,
  setDarkMode,
  notifications,
  showNotifications,
  setShowNotifications,
  markAllRead,
  adminNotification,
  setAdminNotification,
  setOrderSearch,
  setOrderStatusFilter,
  setCrmSearch
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const navMenuItems = [
    { id: 'dashboard', name: 'Overview', description: 'Real-time sales & metrics', icon: LayoutDashboard },
    { id: 'products', name: 'Jewellery Catalog', description: 'Add & manage designs', icon: Gem },
    { id: 'inventory', name: 'Categories & Tiers', description: 'Budget & catalog tags', icon: Boxes },
    { id: 'orders', name: 'Orders & Bookings', description: 'Customer purchases', icon: ShoppingBag },
    { id: 'customers', name: 'Customer Directory', description: 'CRM contacts & leads', icon: Users },
    { id: 'pricing', name: 'Gold & Silver Rates', description: 'Live metal bullion rates', icon: TrendingUp },
    { id: 'security', name: 'Security & Password', description: 'Vault access control', icon: KeyRound }
  ];

  return (
    <div className="flex w-full min-h-screen bg-zinc-50 text-zinc-900 overflow-x-hidden">

      {/* Sidebar panel (Tablet/Desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminUser={adminUser}
        adminRole={adminRole}
        handleAdminLogout={handleAdminLogout}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* Main console content */}
      <div className="flex-grow flex flex-col min-h-screen min-w-0 w-0 overflow-x-hidden">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          adminUser={adminUser}
          handleAdminLogout={handleAdminLogout}
          adminRole={adminRole}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllRead={markAllRead}
          setOrderSearch={setOrderSearch}
          setOrderStatusFilter={setOrderStatusFilter}
          setCrmSearch={setCrmSearch}
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
        />

        <main className="flex-1 p-3 sm:p-6 md:p-8 pb-32 md:pb-28 w-full overflow-x-hidden min-w-0">
          {children}
        </main>

        {/* Mobile Bottom Tab Bar (Ergonomic 5-item touch layout) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-solid border-zinc-200 px-2 py-2 flex items-center justify-around md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', name: 'Jewellery', icon: Gem },
            { id: 'orders', name: 'Orders', icon: ShoppingBag },
            { id: 'pricing', name: 'Rates', icon: TrendingUp },
            { id: 'menu', name: 'Menu', icon: Menu }
          ].map((item) => {
            const Icon = item.icon;
            const isMenu = item.id === 'menu';
            const isActive = isMenu ? isMobileDrawerOpen : (activeTab === item.id && !isMobileDrawerOpen);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (isMenu) {
                    setIsMobileDrawerOpen(!isMobileDrawerOpen);
                  } else {
                    setActiveTab(item.id);
                    setIsMobileDrawerOpen(false);
                  }
                }}
                className={`flex flex-col items-center justify-center gap-1 py-1 px-1 transition-colors relative cursor-pointer border-none bg-transparent min-w-0 flex-1 active:scale-95 ${
                  isActive
                    ? 'text-[#BCA057] font-bold'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-[#BCA057]/10' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#BCA057]' : 'text-zinc-400'}`} />
                </div>
                <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap truncate w-full text-center">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==========================================================
          MOBILE NAVIGATION SLIDE-OVER DRAWER
          ========================================================== */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="absolute top-0 bottom-0 left-0 w-[84%] max-w-[340px] bg-white flex flex-col shadow-2xl z-10 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-950 flex items-center justify-center shadow-xs overflow-hidden">
                    <img src={hrLogo} alt="MANISH & CO" className="w-7 h-7 object-contain" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-sm font-black tracking-wide text-zinc-950 leading-none">
                      MANISH &amp; CO
                    </h2>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-[#BCA057] font-bold block mt-1">
                      VAULT ADMIN PORTAL
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-200/60 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Admin Profile Chip */}
              <div className="px-5 py-3.5 bg-amber-50/70 border-b border-amber-200/60 flex items-center justify-between text-left">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[9.5px] font-bold text-amber-800 tracking-wider uppercase">
                      {adminRole || 'Master Admin'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-800 truncate mt-0.5">
                    {adminUser?.email || 'admin@gmail.com'}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[8px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>

              {/* Navigation Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1 text-left">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block mb-2 px-3">
                  Navigation Sections
                </span>
                {navMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left cursor-pointer border-none ${
                        isActive
                          ? 'bg-[#BCA057]/15 text-[#8C6D26] font-bold shadow-xs'
                          : 'bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-[#BCA057] text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-tight truncate">{item.name}</p>
                          <p className="text-[10px] text-zinc-400 font-normal leading-tight truncate">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#8C6D26]' : 'text-zinc-300'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-2">
                <a
                  href="/"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-solid border-zinc-300 bg-white text-zinc-800 text-xs font-bold hover:bg-zinc-100 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-600" />
                  <span>Open Storefront (User Panel)</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    handleAdminLogout?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer border-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Console</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating System Toasts */}
      <AnimatePresence>
        {adminNotification?.message && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-6 right-6 z-[9999] max-w-sm w-full p-4 rounded-2xl border border-solid flex items-center gap-3.5 shadow-2xl backdrop-blur-md ${
              adminNotification.type === 'error'
                ? 'bg-red-50/95 dark:bg-red-950/90 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200 shadow-red-500/5'
                : 'bg-white/95 dark:bg-zinc-900/95 border-[#E6C687]/30 text-zinc-900 dark:text-zinc-100 shadow-[#E6C687]/5'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              adminNotification.type === 'error'
                ? 'bg-red-100 dark:bg-red-900/50 text-red-650 dark:text-red-400'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
            }`}>
              {adminNotification.type === 'error' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Check className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[10px] uppercase tracking-widest opacity-60 mb-0.5">
                {adminNotification.type === 'error' ? 'System Warning' : 'System Success'}
              </p>
              <p className="text-xs font-semibold leading-snug break-words">{adminNotification.message}</p>
            </div>

            <button
              onClick={() => setAdminNotification({ message: '', type: 'success' })}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer shrink-0 border-none bg-transparent"
              aria-label="Close notification"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
