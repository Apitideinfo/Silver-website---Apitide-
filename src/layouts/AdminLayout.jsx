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
  KeyRound
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

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

  return (
    <div className="flex w-full min-h-screen bg-zinc-50 text-zinc-900 overflow-x-hidden">

      
      {/* Sidebar panel */}
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
        />

        <main className="flex-1 p-3 sm:p-6 md:p-8 pb-40 md:pb-32 w-full overflow-x-hidden min-w-0">
          {children}
        </main>

        {/* Mobile Bottom Tab Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-solid border-zinc-200 px-1 py-2 flex items-center justify-around md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)] select-none">
          {[
            { id: 'dashboard', name: 'Overview', icon: LayoutDashboard },
            { id: 'products', name: 'Add Items', icon: Gem },
            { id: 'inventory', name: 'Categories', icon: Boxes },
            { id: 'orders', name: 'Orders', icon: ShoppingBag },
            { id: 'customers', name: 'Customers', icon: Users },
            { id: 'pricing', name: 'Gold Rate', icon: TrendingUp },
            { id: 'security', name: 'Security', icon: KeyRound }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1.5 px-1 transition-all duration-200 relative cursor-pointer border-none bg-transparent min-w-0 flex-1 ${
                  isActive
                    ? 'text-[#C8A646] font-bold'
                    : 'text-zinc-400 hover:text-zinc-650'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#C8A646]' : 'text-zinc-400'}`} />
                <span className="text-[7px] sm:text-[8.5px] uppercase tracking-wide whitespace-nowrap truncate w-full text-center">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

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
